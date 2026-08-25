'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, LogoMark } from '../../../components/shared/Icons';
import { createSupabaseBrowserClient } from '../../../lib/supabase/client';

export default function StudioLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'access') setError('Your account is signed in but does not have Studio access yet. Ask an admin to add you.');
    if (params.get('error') === 'config') setError('Studio sign-in is not configured on this deployment. Add the Supabase public variables in Vercel and redeploy.');
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!email.trim() || !password) {
      setError('Enter the email and password assigned to your Studio account.');
      return;
    }

    if (!supabase) {
      setError('Studio sign-in is not configured on this deployment. Add the Supabase public variables in Vercel and redeploy.');
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      setError('That sign-in did not work. Check your details or ask an admin for access.');
      setLoading(false);
      return;
    }

    setNotice('Opening your workspace…');
    window.location.assign('/studio');
  };

  return (
    <main className="studio-login-page">
      <div className="studio-login-grid" aria-hidden="true" />
      <a className="studio-login-back" href="/"><ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to public site</a>
      <section className="studio-login-card" aria-labelledby="studio-login-title">
        <div className="studio-login-brand"><span><LogoMark color="#fef9ee" accent="#d68307" size={29} /></span><strong>CA360 Studio</strong></div>
        <span className="studio-kicker">PRIVATE WORKSPACE / SIGN IN</span>
        <h1 id="studio-login-title">Keep the doors<br /><em>moving.</em></h1>
        <p className="studio-login-intro">A calm place to care for mentors, requests, sessions, and the stories that make CA360 useful.</p>
        <form className="studio-login-form" onSubmit={submit}>
          <label htmlFor="studio-email">Email address</label>
          <input id="studio-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@careerarcadia360.org" required />
          <label htmlFor="studio-password">Password</label>
          <input id="studio-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your Studio password" required />
          {error && <p className="studio-login-error" role="alert">{error}</p>}
          {notice && <p className="studio-login-notice" role="status">{notice}</p>}
          <button className="studio-login-submit" type="submit" disabled={loading}>{loading ? 'Checking…' : 'Enter the Studio'} <ArrowRight size={15} /></button>
        </form>
        <p className="studio-login-foot">Need access? Contact the CA360 administrator.</p>
      </section>
    </main>
  );
}
