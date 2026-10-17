import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { Compass } from 'lucide-react';
import AuthPage from '@/pages/auth';
import AtlasPage from '@/pages/atlas';
import { supabase, configurationError } from '@/lib/supabase';
import { DemoExitError, exitDemo, isDemoUser } from '@/lib/demo';
import WelcomeSplash, { entranceTheme } from '@/components/welcome-splash';
import { ENTRANCE_TIMING, useEntrance } from '@/hooks/use-entrance';
import './login-transition.css';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const entrance = useEntrance();
  const { stage: entranceStage, start: startEntrance, cancel: cancelEntrance } = entrance;
  const userId = useRef<string | null>(null);
  const authAttempt = useRef(false);
  const demoExitAttempt = useRef(false);
  const applySessionRef = useRef<(next: Session | null) => void>(() => {});
  const authRevision = useRef(0);
  const panesEntering = entranceStage === 'rust-enter' || entranceStage === 'welcome-enter';

  useEffect(() => {
    document.title = 'Map Rolodex — Your private relationship atlas';
    if (configurationError) { setLoading(false); return; }
    let active = true;
    const applySession = (next: Session | null) => {
      if (!active) return;
      const id = next?.user.id || null;
      if (userId.current && userId.current !== id) queryClient.clear();
      userId.current = id;
      if (!next) {
        authAttempt.current = false;
        cancelEntrance();
      } else if (authAttempt.current) {
        authAttempt.current = false;
        setAuthError(null);
        startEntrance();
      }
      setSession(next);
      setLoading(false);
    };
    applySessionRef.current = applySession;
    const restoreRevision = authRevision.current;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, next) => {
      authRevision.current += 1;
      if (event === 'SIGNED_OUT' && !demoExitAttempt.current) {
        applySession(null);
        return;
      }
      // Login results must be validated before entering the app.
      if (!authAttempt.current && !demoExitAttempt.current) applySession(next);
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || authRevision.current !== restoreRevision || authAttempt.current) return;
      if (error) setAuthError(error.message);
      applySession(data.session);
    }).catch(error => {
      if (!active) return;
      setAuthError(error instanceof Error ? error.message : 'Could not restore your session.');
      setLoading(false);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [startEntrance, cancelEntrance]);

  const signOut = async () => {
    if (session && isDemoUser(session.user)) {
      demoExitAttempt.current = true;
      try {
        await exitDemo(supabase, session);
      } catch (error) {
        if (error instanceof DemoExitError && error.sessionLost) {
          applySessionRef.current(null);
          setAuthError(error.message);
        }
        throw error;
      } finally {
        demoExitAttempt.current = false;
      }
    } else {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    queryClient.clear();
    applySessionRef.current(null);
  };

  return <QueryClientProvider client={queryClient}>
    {loading ? <div className="shell" style={{ display: 'grid', placeItems: 'center' }} role="status" data-testid="status-restoring-session">
      <div style={{ textAlign: 'center' }}><span className="brand-mark" style={{ margin: '0 auto 20px' }}><Compass size={21} /></span><div className="skeleton" style={{ width: 160, height: 13, marginBottom: 9 }} /><div className="skeleton" style={{ width: 108, height: 9, margin: '0 auto' }} /></div>
    </div> : <>
      {session && <div data-testid="atlas-layer" inert={entranceStage !== 'none'} aria-hidden={entranceStage !== 'none'} style={entranceStage !== 'none' ? { pointerEvents: 'none' } : undefined}>
        <AtlasPage key={session.user.id} session={session} onSignOut={signOut} />
      </div>}
      {(!session || panesEntering) && <div className="login-auth-layer" inert={!!session} aria-hidden={!!session}>
        {authError && <div className="error-box" role="alert" style={{ position: 'fixed', zIndex: 60, right: 16, top: 16, maxWidth: 360 }} data-testid="error-session">Session error: {authError}<button onClick={() => setAuthError(null)} data-testid="button-dismiss-session-error">Dismiss</button></div>}
        <AuthPage
          onAuthAttempt={() => { authAttempt.current = true; }}
          onAuthAttemptSucceeded={next => { if (authAttempt.current) applySessionRef.current(next); }}
          onAuthAttemptCancelled={() => { authAttempt.current = false; }}
        />
      </div>}
      {session && entranceStage !== 'none' && <>
        <WelcomeSplash
          covered={panesEntering}
          entering={entranceStage === 'welcome-enter'}
          onEntryComplete={() => entrance.completeAnimation('welcome-enter')}
          entryDurationMs={ENTRANCE_TIMING.paneRise}
          revealing={entranceStage === 'welcome-enter' || entranceStage === 'welcome-reveal'}
          exiting={entranceStage === 'welcome-exit'}
          onRouteComplete={() => entrance.completeAnimation('welcome-reveal')}
          onExitComplete={() => entrance.completeAnimation('welcome-exit')}
          exitDurationMs={ENTRANCE_TIMING.exit}
          revealDurationMs={ENTRANCE_TIMING.reveal}
          reducedMotion={entrance.reducedMotion}
        />
        {panesEntering && <div
          className={`entrance-rust ${entranceStage === 'rust-enter' ? 'is-entering' : 'is-following'}${entrance.reducedMotion ? ' is-reduced' : ''}`}
          style={{ ...entranceTheme, '--rust-cascade-duration': `${ENTRANCE_TIMING.rust}ms`, '--rust-finish-duration': `${ENTRANCE_TIMING.rustFinish}ms` } as React.CSSProperties}
          aria-hidden="true"
          data-testid="entrance-rust"
          onAnimationEnd={event => {
            if (event.target === event.currentTarget && event.animationName === 'rust-rise-to-cascade') entrance.completeAnimation('rust-enter');
          }}
        />}
      </>}
    </>}
  </QueryClientProvider>;
}

export default App;