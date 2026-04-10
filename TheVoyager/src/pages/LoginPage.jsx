import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/planner';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // OAuth redirects externally, no navigate needed
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-surface relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/8 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/8 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-headline font-extrabold text-primary tracking-tight">The Ethereal Voyager</h1>
          </Link>
          <p className="text-on-surface-variant mt-2 text-sm">Your AI travel concierge awaits.</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10 shadow-[0_32px_64px_rgba(0,0,0,0.06)] border border-outline-variant/10">
          <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-1">Welcome back</h2>
          <p className="text-on-surface-variant text-sm mb-8">Sign in to continue your journey.</p>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-error/10 border border-error/20 text-error p-4 rounded-xl text-sm font-medium">
              <span className="material-symbols-outlined text-lg shrink-0">error</span>
              {error}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            id="google-signin-btn"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-outline-variant/20 bg-surface hover:bg-surface-container-low transition-all font-semibold text-on-surface text-sm mb-6 hover:border-outline-variant/40 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {googleLoading ? (
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-outline-variant/20" />
            <span className="mx-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-outline-variant/20" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-xl">mail</span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-xl">lock</span>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant text-sm"
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-bold text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 mt-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">login</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline transition-all">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
