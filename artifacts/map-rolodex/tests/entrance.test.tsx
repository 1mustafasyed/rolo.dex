import { act, type ReactNode } from 'react';
import { readFileSync } from 'node:fs';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import { tokens } from '@workspace/map-rolodex-design-system/tokens';
import { ENTRANCE_TIMING } from '../src/hooks/use-entrance';

const mocks = vi.hoisted(() => ({
  restored: null as Session | null,
  callback: (_event: string, _session: Session | null) => {},
  signIn: vi.fn(),
  signUp: vi.fn(),
  unsubscribe: vi.fn(),
}));
vi.mock('@/lib/supabase', () => ({
  configurationError: null,
  supabase: { auth: {
    getSession: async () => ({ data: { session: mocks.restored }, error: null }),
    onAuthStateChange: (callback: typeof mocks.callback) => {
      mocks.callback = callback;
      return { data: { subscription: { unsubscribe: mocks.unsubscribe } } };
    },
    signInWithPassword: (...args: unknown[]) => mocks.signIn(...args),
    signUp: (...args: unknown[]) => mocks.signUp(...args),
    signOut: async () => ({ error: null }),
  } },
}));
vi.mock('@/pages/atlas', () => ({
  default: () => <main data-testid="mock-atlas"><button>Map control</button></main>,
}));
import App from '../src/App';

const session = { user: { id: 'test-user', email: 'user@example.test' } } as Session;
let root: Root;
let container: HTMLDivElement;
let reduced = false;
const find = (id: string) => container.querySelector<HTMLElement>(`[data-testid="${id}"]`);
const splash = () => find('welcome-splash')!;
const advance = async (ms: number) => { await act(async () => { vi.advanceTimersByTime(ms); }); };
const animationEnd = async (node: Element, name: string) => {
  const event = new Event('animationend', { bubbles: true });
  Object.defineProperty(event, 'animationName', { value: name });
  await act(async () => { node.dispatchEvent(event); });
};
const render = async (node: ReactNode = <App />) => { await act(async () => { root.render(node); }); };
const click = async (node: HTMLElement) => { await act(async () => node.click()); };

async function login() {
  for (const [id, value] of [['input-auth-email', 'user@example.test'], ['input-auth-password', 'test-password']]) {
    const input = find(id) as HTMLInputElement;
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
  await act(async () => {
    container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}
async function uncover() {
  await advance(ENTRANCE_TIMING.rust);
  await animationEnd(find('entrance-rust')!, 'rust-rise-to-cascade');
  await advance(ENTRANCE_TIMING.paneRise);
  await animationEnd(splash(), 'login-rise-up');
}
async function finishRouteAnimation() {
  await uncover();
  await advance(Math.max(0, ENTRANCE_TIMING.reveal - ENTRANCE_TIMING.paneRise));
  await animationEnd(splash().querySelector('.orbit-route')!, 'welcome-route');
}

beforeEach(() => {
  vi.useFakeTimers();
  reduced = false;
  mocks.restored = null;
  mocks.signIn.mockReset().mockResolvedValue({ data: { session }, error: null });
  mocks.signUp.mockReset().mockResolvedValue({ data: { session: null }, error: null });
  mocks.unsubscribe.mockReset();
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  }));
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
});

describe('authenticated two-pane entrance', () => {
  it('reveals the welcome pane, then uncovers the map when the globe route finishes', async () => {
    await render();
    await login();
    expect(container.querySelector('.login-auth-layer')!.hasAttribute('inert')).toBe(true);
    expect(find('entrance-rust')!.style.getPropertyValue('--entrance-primary')).toBe(tokens.color.dark.primary);
    expect(find('atlas-layer')!.hasAttribute('inert')).toBe(true);
    expect(find('atlas-layer')!.getAttribute('aria-hidden')).toBe('true');
    expect(splash().hasAttribute('inert')).toBe(true);
    expect(splash().classList.contains('is-revealing')).toBe(false);
    await advance(ENTRANCE_TIMING.rust - 1);
    expect(find('entrance-rust')!.classList.contains('is-entering')).toBe(true);
    expect(splash().classList.contains('is-waiting')).toBe(true);
    await advance(1);
    // Actual completion of the first leg (100% -> 33.333% translation)
    // starts both the remaining rust movement and the splash's upward entry.
    await animationEnd(find('entrance-rust')!, 'rust-rise-to-cascade');
    expect(find('entrance-rust')!.classList.contains('is-following')).toBe(true);
    expect(splash().classList.contains('is-entering')).toBe(true);
    expect(splash().classList.contains('is-revealing')).toBe(true);
    expect(splash().hasAttribute('inert')).toBe(true);
    await animationEnd(splash().querySelector('h1')!, 'login-rise-up');
    expect(splash().classList.contains('is-entering')).toBe(true);
    await advance(ENTRANCE_TIMING.paneRise);
    await animationEnd(splash(), 'login-rise-up');
    expect(find('entrance-rust')).toBeNull();
    expect(container.querySelector('.login-auth-layer')).toBeNull();
    expect(splash().classList.contains('is-revealing')).toBe(true);
    expect(splash().hasAttribute('inert')).toBe(false);
    await advance(Math.max(0, ENTRANCE_TIMING.reveal - ENTRANCE_TIMING.paneRise - 1));
    expect(splash().classList.contains('is-exiting')).toBe(false);
    await advance(1);
    await animationEnd(splash().querySelector('.orbit-route')!, 'welcome-route');
    expect(splash().classList.contains('is-exiting')).toBe(true);
    expect(splash().classList.contains('is-readable')).toBe(true);
    expect(find('atlas-layer')!.hasAttribute('inert')).toBe(true);
    await animationEnd(splash(), 'login-swipe-up');
    expect(find('welcome-splash')).toBeNull();
    expect(find('atlas-layer')!.hasAttribute('inert')).toBe(false);
  });

  it('keeps valid rise keyframes and immediate text/artwork animation rules', () => {
    const style = document.createElement('style');
    // Vitest stubs CSS imports; read the real stylesheet for CSSOM coverage.
    style.textContent = readFileSync('src/login-transition.css', 'utf8');
    document.head.append(style);
    try {
      const rules = Array.from(style.sheet!.cssRules);
      expect(rules.some(rule => rule.type === 7 && (rule as CSSKeyframesRule).name === 'login-rise-up')).toBe(true);
      const declarations = (selector: string) => (rules.find(rule =>
        (rule as CSSStyleRule).selectorText === selector) as CSSStyleRule).style;
      expect(declarations('.entrance-rust.is-entering').getPropertyValue('animation')).toContain('linear both');
      expect(declarations('.entrance-rust.is-following').getPropertyValue('animation')).toContain('linear both');
      expect(declarations('.welcome-splash.is-revealing .welcome-type-line-one').getPropertyValue('animation-delay')).toBe('0ms');
      expect(declarations('.welcome-splash.is-revealing .welcome-kicker').getPropertyValue('animation')).not.toContain('calc(var(--d) * .28)');
      expect(declarations('.welcome-splash.is-revealing .orbit-route').getPropertyValue('animation')).toContain('var(--d) linear');
    } finally {
      style.remove();
    }
  });

  it('starts the upward map reveal immediately on route completion, not on the headline event', async () => {
    await render(); await login();
    await advance(ENTRANCE_TIMING.rust);
    await animationEnd(find('entrance-rust')!, 'rust-rise-to-cascade');
    const title = splash().querySelector('h1');
    expect(splash().classList.contains('is-revealing')).toBe(true);
    await advance(ENTRANCE_TIMING.paneRise);
    await animationEnd(splash(), 'login-rise-up');
    expect(splash().querySelector('h1')).toBe(title);
    expect(splash().classList.contains('is-revealing')).toBe(true);
    await animationEnd(splash().querySelector('.welcome-type-line-three')!, 'welcome-type-up');
    expect(splash().classList.contains('is-exiting')).toBe(false);
    await advance(Math.max(0, ENTRANCE_TIMING.reveal - ENTRANCE_TIMING.paneRise - 1));
    expect(splash().classList.contains('is-exiting')).toBe(false);
    await advance(1);
    await animationEnd(splash().querySelector('.orbit-route')!, 'welcome-route');
    expect(splash().classList.contains('is-exiting')).toBe(true);
  });

  it('does not wait for map readiness before uncovering the already-mounted map', async () => {
    await render(); await login(); await finishRouteAnimation();
    expect(splash().classList.contains('is-exiting')).toBe(true);
    expect(find('mock-atlas')).not.toBeNull();
    expect(find('atlas-layer')!.hasAttribute('inert')).toBe(true);
    await animationEnd(splash(), 'login-swipe-up');
    expect(find('welcome-splash')).toBeNull();
    expect(find('atlas-layer')!.hasAttribute('inert')).toBe(false);
  });

  it('failed sign-in and confirmation-only signup never enter', async () => {
    mocks.signIn.mockResolvedValue({ data: { session: null }, error: new Error('Invalid login') });
    await render(); await login();
    expect(find('error-auth')!.textContent).toContain('Invalid login');
    expect(find('entrance-rust')).toBeNull();
    await click(find('button-auth-toggle')!); await login();
    expect(find('status-email-confirmation')).not.toBeNull();
    expect(find('mock-atlas')).toBeNull();
  });

  it('restored sessions and refreshes do not replay', async () => {
    mocks.restored = session;
    await render();
    expect(find('mock-atlas')).not.toBeNull();
    expect(find('welcome-splash')).toBeNull();
    await act(async () => mocks.callback('TOKEN_REFRESHED', session));
    expect(find('entrance-rust')).toBeNull();
  });

  it('an early auth event cannot enter before the sign-in result is validated', async () => {
    let resolveLogin!: (value: unknown) => void;
    mocks.signIn.mockImplementation(() => new Promise(resolve => { resolveLogin = resolve; }));
    await render(); await login();
    await act(async () => mocks.callback('SIGNED_IN', session));
    expect(find('mock-atlas')).toBeNull();
    expect(find('entrance-rust')).toBeNull();
    await act(async () => resolveLogin({ data: { session: null }, error: new Error('Invalid login') }));
    expect(find('error-auth')!.textContent).toContain('Invalid login');
    expect(find('mock-atlas')).toBeNull();
  });

  it('session loss invalidates an in-flight sign-in success', async () => {
    let resolveLogin!: (value: unknown) => void;
    mocks.signIn.mockImplementation(() => new Promise(resolve => { resolveLogin = resolve; }));
    await render(); await login();
    await act(async () => mocks.callback('SIGNED_OUT', null));
    await act(async () => resolveLogin({ data: { session }, error: null }));
    expect(find('mock-atlas')).toBeNull();
    expect(find('entrance-rust')).toBeNull();
  });

  it('a token refresh during presentation does not restart rust timing', async () => {
    await render(); await login(); await advance(300);
    await act(async () => mocks.callback('TOKEN_REFRESHED', session));
    await advance(200);
    await animationEnd(find('entrance-rust')!, 'rust-rise-to-cascade');
    expect(splash().classList.contains('is-entering')).toBe(true);
  });

  it.each(['rust-enter', 'welcome-enter', 'welcome-reveal', 'welcome-exit'])('session loss during %s cancels all timers and layers', async stage => {
    await render(); await login();
    if (stage !== 'rust-enter') {
      await advance(ENTRANCE_TIMING.rust);
      await animationEnd(find('entrance-rust')!, 'rust-rise-to-cascade');
    }
    if (['welcome-reveal', 'welcome-exit'].includes(stage)) await animationEnd(splash(), 'login-rise-up');
    if (stage === 'welcome-exit') await animationEnd(splash().querySelector('.orbit-route')!, 'welcome-route');
    await act(async () => mocks.callback('SIGNED_OUT', null));
    await advance(20000);
    expect(find('welcome-splash')).toBeNull();
    expect(find('entrance-rust')).toBeNull();
    expect(find('mock-atlas')).toBeNull();
    expect(find('button-auth-submit')).not.toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('unmount removes auth subscription and presentation timers', async () => {
    await render(); await login();
    await act(async () => root.unmount());
    expect(vi.getTimerCount()).toBe(0);
    expect(mocks.unsubscribe).toHaveBeenCalledOnce();
    root = createRoot(container);
  });

  it('reduced motion skips sweeps and promptly reveals the map', async () => {
    reduced = true;
    await render(); await login();
    for (let i = 0; i < 6; i++) await advance(0);
    expect(find('entrance-rust')).toBeNull();
    expect(find('welcome-splash')).toBeNull();
    expect(find('atlas-layer')!.hasAttribute('inert')).toBe(false);
  });

  it('missing animation events have bounded fallback completion', async () => {
    await render(); await login();
    await advance(0);
    await advance(ENTRANCE_TIMING.rust + ENTRANCE_TIMING.animationGrace);
    await advance(ENTRANCE_TIMING.paneRise + ENTRANCE_TIMING.animationGrace);
    await advance(ENTRANCE_TIMING.animationGrace);
    await advance(ENTRANCE_TIMING.exit + ENTRANCE_TIMING.animationGrace);
    expect(find('welcome-splash')).toBeNull();
    expect(find('atlas-layer')!.hasAttribute('inert')).toBe(false);
  });
});