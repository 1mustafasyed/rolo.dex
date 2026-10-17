import type { Session, SupabaseClient } from '@supabase/supabase-js';

export const DEMO_UNAVAILABLE = 'Demo is unavailable right now';
type Account = { email?: string | null };

export function isDemoUser(user: Account | null | undefined): boolean {
  return user?.email?.trim().toLowerCase() === 'demo@rolo.dex';
}

export function assertCanWrite(user: Account): void {
  if (isDemoUser(user)) throw new Error('Demo mode is read-only.');
}

export function demoTokens(payload: unknown): { access_token: string; refresh_token: string } {
  if (!payload || typeof payload !== 'object') throw new Error(DEMO_UNAVAILABLE);
  const record = payload as Record<string, unknown>;
  const tokens = ('session' in record ? record.session : record) as Record<string, unknown> | null;
  if (!tokens || typeof tokens !== 'object' ||
      typeof tokens.access_token !== 'string' || !tokens.access_token.trim() ||
      typeof tokens.refresh_token !== 'string' || !tokens.refresh_token.trim()) {
    throw new Error(DEMO_UNAVAILABLE);
  }
  return { access_token: tokens.access_token, refresh_token: tokens.refresh_token };
}

export async function signInDemo(client: Pick<SupabaseClient, 'functions' | 'auth'>) {
  let settingSession = false;
  try {
    const { data, error } = await client.functions.invoke('demo-login', { method: 'POST' });
    if (error) throw error;
    const tokens = demoTokens(data);
    settingSession = true;
    const result = await client.auth.setSession(tokens);
    if (result.error || !result.data.session || !isDemoUser(result.data.session.user)) {
      throw new Error(DEMO_UNAVAILABLE);
    }
    demoTokens(result.data.session);
    if (!result.data.session.user.id?.trim()) throw new Error(DEMO_UNAVAILABLE);
    return result.data.session;
  } catch {
    // A session event may have fired before setSession reported failure.
    // App defers those events until this operation has been validated.
    if (settingSession) {
      try {
        const { error } = await client.auth.signOut({ scope: 'local' });
        if (error) throw error;
      } catch {
        throw new Error(DEMO_UNAVAILABLE);
      }
    }
    throw new Error(DEMO_UNAVAILABLE);
  }
}

export class DemoExitError extends Error {
  readonly sessionLost: boolean;
  constructor(sessionLost: boolean) {
    super(sessionLost ? 'Could not restore your demo session after exit failed. Please sign in again.' : 'Could not exit demo. Please try again.');
    this.sessionLost = sessionLost;
  }
}

export async function exitDemo(client: Pick<SupabaseClient, 'auth'>, session: Session): Promise<void> {
  try {
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (!error) return;
  } catch {
    // Supabase can remove the local session even when logout fails remotely.
  }
  try {
    const { data, error } = await client.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
    if (error || !data.session || data.session.user.id !== session.user.id || !isDemoUser(data.session.user)) {
      throw new DemoExitError(true);
    }
  } catch {
    throw new DemoExitError(true);
  }
  throw new DemoExitError(false);
}