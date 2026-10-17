import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { DEMO_UNAVAILABLE, DemoExitError, demoTokens, exitDemo, isDemoUser, signInDemo } from '../src/lib/demo.ts';
import { atlasWrites } from '../src/lib/atlas-writes.ts';
import type { ContactInput } from '../src/lib/types.ts';

const tokens = { access_token: 'test-access', refresh_token: 'test-refresh' };
const demoSession = { ...tokens, user: { id: 'demo-id', email: 'demo@rolo.dex' } };
function mockClient(options: { payload?: unknown; invokeError?: boolean; sessionError?: boolean; missingSession?: boolean; wrongUser?: boolean; cleanupError?: boolean } = {}) {
  const calls: unknown[][] = [];
  const client = {
    functions: {
      invoke: async (...args: unknown[]) => {
        calls.push(['invoke', ...args]);
        return { data: 'payload' in options ? options.payload : tokens, error: options.invokeError ? new Error('private backend detail') : null };
      },
    },
    auth: {
      setSession: async (...args: unknown[]) => {
        calls.push(['setSession', ...args]);
        return { data: { session: options.missingSession ? null : options.wrongUser ? { user: { email: 'normal@example.test' } } : demoSession }, error: options.sessionError ? new Error('private auth detail') : null };
      },
      signOut: async (...args: unknown[]) => {
        calls.push(['signOut', ...args]);
        return { error: options.cleanupError ? new Error('cleanup failed') : null };
      },
    },
  } as unknown as Pick<SupabaseClient, 'functions' | 'auth'>;
  return { client, calls };
}

test('demo detection uses only normalized authenticated email', () => {
  for (const email of ['demo@rolo.dex', ' DEMO@ROLO.DEX ']) assert.equal(isDemoUser({ email }), true);
  for (const user of [null, undefined, {}, { email: '' }, { email: 'demo@rolo.dex.evil' }, { email: 'normal@example.test' }]) assert.equal(isDemoUser(user), false);
});

test('validates token fields and supported response envelopes without leaking details', () => {
  assert.deepEqual(demoTokens(tokens), tokens);
  assert.deepEqual(demoTokens({ session: tokens }), tokens);
  for (const value of [null, 'secret detail', {}, { access_token: 'a' }, { ...tokens, refresh_token: ' ' }, { ...tokens, access_token: 42 }, { session: null }]) {
    assert.throws(() => demoTokens(value), { message: DEMO_UNAVAILABLE });
  }
});

test('demo invokes one no-body POST and validates a real demo session', async () => {
  const { client, calls } = mockClient();
  assert.equal(await signInDemo(client), demoSession);
  assert.deepEqual(calls, [['invoke', 'demo-login', { method: 'POST' }], ['setSession', tokens]]);
});

test('invoke and malformed responses fail safely before session setup; retry succeeds', async () => {
  for (const options of [{ invokeError: true }, { payload: null }, { payload: {} }]) {
    const { client, calls } = mockClient(options);
    await assert.rejects(signInDemo(client), { message: DEMO_UNAVAILABLE });
    assert.equal(calls.length, 1);
  }
  assert.equal(await signInDemo(mockClient().client), demoSession);
});

test('failed or wrong-account session setup cleans up locally and reports only friendly error', async () => {
  for (const options of [{ sessionError: true }, { missingSession: true }, { wrongUser: true }, { sessionError: true, cleanupError: true }]) {
    const { client, calls } = mockClient(options);
    await assert.rejects(signInDemo(client), { message: DEMO_UNAVAILABLE });
    assert.deepEqual(calls.at(-1), ['signOut', { scope: 'local' }]);
  }
});

test('all four demo mutations reject before any Supabase request', async () => {
  let requests = 0;
  const client = {
    from: () => { requests++; throw new Error('unexpected write'); },
    rpc: () => { requests++; throw new Error('unexpected RPC'); },
  } as unknown as Pick<SupabaseClient, 'from' | 'rpc'>;
  const writes = atlasWrites(client, { id: 'demo-id', email: ' DEMO@ROLO.DEX ' } as User);
  const input = { first_name: 'Test' } as ContactInput;
  for (const call of [() => writes.create(input), () => writes.update({ id: 'contact-id', input }), () => writes.remove('contact-id'), () => writes.seed()]) {
    await assert.rejects(call(), { message: 'Demo mode is read-only.' });
  }
  assert.equal(requests, 0);
});

test('normal account writes preserve request paths and ownership filters', async () => {
  const calls: unknown[][] = [];
  const chain = {
    insert: async (input: unknown) => { calls.push(['insert', input]); return { error: null }; },
    update: (input: unknown) => { calls.push(['update', input]); return chain; },
    delete: () => { calls.push(['delete']); return chain; },
    eq: (...args: unknown[]) => { calls.push(['eq', ...args]); return chain; },
    select: async () => ({ data: [{ id: 'contact-id' }], error: null }),
  };
  const client = {
    from: (table: string) => { calls.push(['from', table]); return chain; },
    rpc: async (name: string) => { calls.push(['rpc', name]); return { error: null }; },
  } as unknown as Pick<SupabaseClient, 'from' | 'rpc'>;
  const writes = atlasWrites(client, { id: 'normal-id', email: 'normal@example.test' } as User);
  const input = { first_name: 'Test' } as ContactInput;
  await writes.create(input);
  await writes.update({ id: 'contact-id', input });
  await writes.remove('contact-id');
  await writes.seed();
  assert.equal(calls.filter(call => call[0] === 'from').length, 3);
  assert.equal(calls.filter(call => call[0] === 'eq' && call[1] === 'owner_id' && call[2] === 'normal-id').length, 2);
  assert.deepEqual(calls.at(-1), ['rpc', 'seed_sample_contacts']);
});

test('successful demo exit uses only local scope without restoring tokens', async () => {
  const { client, calls } = mockClient();
  await exitDemo(client, demoSession as Session);
  assert.deepEqual(calls, [['signOut', { scope: 'local' }]]);
});

test('failed demo exit restores the existing session before surfacing a retryable error', async () => {
  const { client, calls } = mockClient({ cleanupError: true });
  await assert.rejects(exitDemo(client, demoSession as Session), (error: unknown) => {
    assert.ok(error instanceof DemoExitError);
    assert.equal(error.sessionLost, false);
    assert.equal(error.message, 'Could not exit demo. Please try again.');
    return true;
  });
  assert.deepEqual(calls, [['signOut', { scope: 'local' }], ['setSession', tokens]]);
});

test('failed exit plus failed restoration explicitly reports lost session instead of pretending it is active', async () => {
  const { client } = mockClient({ cleanupError: true, sessionError: true });
  await assert.rejects(exitDemo(client, demoSession as Session), (error: unknown) => {
    assert.ok(error instanceof DemoExitError);
    assert.equal(error.sessionLost, true);
    return true;
  });
});