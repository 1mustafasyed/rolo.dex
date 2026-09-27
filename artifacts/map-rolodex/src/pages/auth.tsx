import { useState, type FormEvent } from 'react';
import { ArrowRight, Compass, LockKeyhole } from 'lucide-react';
import { supabase, configurationError } from '@/lib/supabase';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null); setNotice(null); setPending(true);
    try {
      if (configurationError) throw new Error(configurationError);
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({ email: email.trim(), password });
        if (authError) throw authError;
        if (!data.session) setNotice('Check your inbox to confirm your email, then come back and sign in. If you already have an account, choose sign in instead.');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Authentication failed. Please try again.');
    } finally { setPending(false); }
  };
  const changeMode = () => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setNotice(null); };
  return <main className="auth-page">
    <section className="auth-art" aria-label="Map Rolodex introduction">
      <div className="brand"><span className="brand-mark"><Compass size={21} strokeWidth={1.4} /></span><span className="brand-name">Map Rolodex</span></div>
      <div className="auth-visual" aria-hidden="true"><span className="auth-line a" /><span className="auth-line b" /><span className="auth-pin one" /><span className="auth-pin two" /><span className="auth-pin three" /><span className="auth-pin four" /></div>
      <div className="auth-hero"><span className="eyebrow">A private relationship atlas / Est. wherever you are</span><h1>People make<br />a place <em>matter.</em></h1><p>A quiet place to remember who you know, where they are, and the story behind the connection. Cities, not live locations.</p></div>
    </section>
    <section className="auth-form-side">
      <div className="auth-card">
        <span className="eyebrow">Your atlas awaits</span>
        <h2>{mode === 'signin' ? 'Welcome back.' : 'Start your atlas.'}</h2>
        <p>{mode === 'signin' ? 'Sign in to find your people, wherever the map takes you.' : 'Create your private space for connections across the world.'}</p>
        <form onSubmit={submit}>
          <div className="field"><label htmlFor="auth-email">Email address</label><input id="auth-email" data-testid="input-auth-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></div>
          <div className="field"><label htmlFor="auth-password">Password</label><input id="auth-password" data-testid="input-auth-password" type="password" minLength={6} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 6 characters" /></div>
          {configurationError && <div className="error-box" role="alert">{configurationError}</div>}
          {error && <div className="error-box" role="alert" data-testid="error-auth">{error}</div>}
          {notice && <div className="notice" role="status" data-testid="status-email-confirmation">{notice}</div>}
          <button className="primary-btn" type="submit" disabled={pending || !!configurationError} data-testid="button-auth-submit">{pending ? 'One moment...' : mode === 'signin' ? 'Sign in to your atlas' : 'Create account'} <ArrowRight size={16} /></button>
        </form>
        <div className="auth-switch">{mode === 'signin' ? 'New here?' : 'Already have an account?'}{' '}<button type="button" onClick={changeMode} data-testid="button-auth-toggle">{mode === 'signin' ? 'Create an account' : 'Sign in'}</button></div>
        <div className="auth-foot"><LockKeyhole size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />Private by design. Your map shows known cities, never live locations.</div>
      </div>
    </section>
  </main>;
}