import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { Compass } from 'lucide-react';
import AuthPage from '@/pages/auth';
import AtlasPage from '@/pages/atlas';
import WelcomeSplash from '@/components/welcome-splash';
import { supabase, configurationError } from '@/lib/supabase';
import './login-transition.css';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });
type EntranceStage = 'none' | 'auth-exit' | 'splash' | 'splash-exit';
const AUTH_EXIT_DURATION = 350;

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [entranceStage, setEntranceStage] = useState<EntranceStage>('none');
  const [mapReady, setMapReady] = useState(false);
  const [mapSlow, setMapSlow] = useState(false);
  const userId = useRef<string | null>(null);
  const authAttempt = useRef(false);
  const splashStartedAt = useRef(0);

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
        setEntranceStage('none');
        setMapReady(false);
      } else if (authAttempt.current) {
        authAttempt.current = false;
        setMapReady(false);
        setMapSlow(false);
        setEntranceStage('auth-exit');
      }
      setSession(next);
      setLoading(false);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => applySession(next));
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setAuthError(error.message);
      applySession(data.session);
    }).catch(error => {
      if (!active) return;
      setAuthError(error instanceof Error ? error.message : 'Could not restore your session.');
      setLoading(false);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (entranceStage !== 'auth-exit' && entranceStage !== 'splash-exit') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => {
      if (entranceStage === 'auth-exit') {
        splashStartedAt.current = performance.now();
        setEntranceStage('splash');
      } else {
        setEntranceStage('none');
      }
    }, reducedMotion ? 0 : entranceStage === 'auth-exit' ? AUTH_EXIT_DURATION : 1000);
    return () => window.clearTimeout(timer);
  }, [entranceStage]);

  useEffect(() => {
    if (entranceStage !== 'splash' || !mapReady) return;
    const remaining = Math.max(0, 1000 - (performance.now() - splashStartedAt.current));
    const timer = window.setTimeout(() => setEntranceStage('splash-exit'), remaining);
    return () => window.clearTimeout(timer);
  }, [entranceStage, mapReady]);

  useEffect(() => {
    if (entranceStage !== 'splash' || mapReady) return;
    const timer = window.setTimeout(() => setMapSlow(true), 10000);
    return () => window.clearTimeout(timer);
  }, [entranceStage, mapReady]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    queryClient.clear();
    setSession(null);
  };

  return <QueryClientProvider client={queryClient}>
    {loading ? <div className="shell" style={{ display: 'grid', placeItems: 'center' }} role="status" data-testid="status-restoring-session">
      <div style={{ textAlign: 'center' }}><span className="brand-mark" style={{ margin: '0 auto 20px' }}><Compass size={21} /></span><div className="skeleton" style={{ width: 160, height: 13, marginBottom: 9 }} /><div className="skeleton" style={{ width: 108, height: 9, margin: '0 auto' }} /></div>
    </div> : <>
      {session && <div inert={entranceStage !== 'none'} aria-hidden={entranceStage !== 'none'}>
        <AtlasPage key={session.user.id} session={session} onSignOut={signOut} onMapReady={() => setMapReady(true)} />
      </div>}
      {(!session || entranceStage === 'auth-exit') && <div
        className={`login-auth-layer${entranceStage === 'auth-exit' ? ' is-exiting' : ''}`}
        inert={entranceStage === 'auth-exit'}
        aria-hidden={entranceStage === 'auth-exit'}
      >
        {authError && <div className="error-box" role="alert" style={{ position: 'fixed', zIndex: 60, right: 16, top: 16, maxWidth: 360 }} data-testid="error-session">Session error: {authError}<button onClick={() => setAuthError(null)} data-testid="button-dismiss-session-error">Dismiss</button></div>}
        <AuthPage
          onAuthAttempt={() => { authAttempt.current = true; setMapReady(false); }}
          onAuthAttemptCancelled={() => { authAttempt.current = false; }}
        />
      </div>}
      {session && entranceStage !== 'none' && <WelcomeSplash
        covered={entranceStage === 'auth-exit'}
        exiting={entranceStage === 'splash-exit'}
        mapSlow={mapSlow && !mapReady}
        onOpenAnyway={() => setMapReady(true)}
      />}
    </>}
  </QueryClientProvider>;
}

export default App;