import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { Compass } from 'lucide-react';
import AuthPage from '@/pages/auth';
import AtlasPage from '@/pages/atlas';
import { supabase, configurationError } from '@/lib/supabase';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const userId = useRef<string | null>(null);

  useEffect(() => {
    document.title = 'Map Rolodex — Your private relationship atlas';
    if (configurationError) { setLoading(false); return; }
    let active = true;
    const applySession = (next: Session | null) => {
      if (!active) return;
      const id = next?.user.id || null;
      if (userId.current && userId.current !== id) queryClient.clear();
      userId.current = id;
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

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    queryClient.clear();
    setSession(null);
  };

  return <QueryClientProvider client={queryClient}>
    {loading ? <div className="shell" style={{ display: 'grid', placeItems: 'center' }} role="status" data-testid="status-restoring-session">
      <div style={{ textAlign: 'center' }}><span className="brand-mark" style={{ margin: '0 auto 20px' }}><Compass size={21} /></span><div className="skeleton" style={{ width: 160, height: 13, marginBottom: 9 }} /><div className="skeleton" style={{ width: 108, height: 9, margin: '0 auto' }} /></div>
    </div> : session ? <AtlasPage key={session.user.id} session={session} onSignOut={signOut} /> : <>
      {authError && <div className="error-box" role="alert" style={{ position: 'fixed', zIndex: 30, right: 16, top: 16, maxWidth: 360 }} data-testid="error-session">Session error: {authError}<button onClick={() => setAuthError(null)} data-testid="button-dismiss-session-error">Dismiss</button></div>}
      <AuthPage />
    </>}
  </QueryClientProvider>;
}

export default App;