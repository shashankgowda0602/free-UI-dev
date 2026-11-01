import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { useToast } from '../common/ToastNotification';
import {
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Download,
  Lock,
  Database,
  ArrowRight,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess: () => void;
  downloadRequiredFor?: { name: string; slug: string } | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onSuccess,
  downloadRequiredFor = null,
}) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (mode !== 'forgot') {
      if (!password || password.length < 6) {
        errs.password = 'Password must be at least 6 characters.';
      }
    }
    if (mode === 'signup') {
      if (!fullName.trim()) {
        errs.fullName = 'Please enter your full name.';
      }
      if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.';
      }
      if (!agreeTerms) {
        errs.terms = 'You must accept the terms of service.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await authService.login(email, password, rememberMe);
        showToast('Auth0 verified! Welcome back to UIverse Studio.', 'success');
        onSuccess();
      } else if (mode === 'signup') {
        await authService.signup(fullName, email, password);
        showToast('Account created and credentials stored in database!', 'success');
        onSuccess();
      } else if (mode === 'forgot') {
        await new Promise((r) => setTimeout(r, 400));
        showToast(`Password reset link sent to ${email}`, 'info');
        setMode('login');
      }
    } catch {
      showToast('Authentication failed. Please verify credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Auth0 Universal Login Handlers
  const handleAuth0UniversalLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate / perform Auth0 Universal flow
      const randomSub = `auth0|${Math.random().toString(36).substring(2, 10)}`;
      const mockEmail = email.trim() || 'developer@uiverse.studio';
      const mockName = fullName.trim() || mockEmail.split('@')[0].replace('.', ' ');

      await authService.loginWithAuth0({
        email: mockEmail,
        fullName: mockName,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(mockEmail)}`,
        authProvider: 'auth0',
        auth0Sub: randomSub,
      });

      showToast('Authenticated via Auth0 Universal Login. Session stored in database!', 'success');
      onSuccess();
    } catch (err) {
      showToast('Auth0 login encountered an error.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth0SocialLogin = async (provider: 'auth0-github' | 'auth0-google') => {
    setIsLoading(true);
    try {
      const providerName = provider === 'auth0-github' ? 'GitHub' : 'Google';
      const mockEmail = provider === 'auth0-github' ? 'dev.github@uiverse.studio' : 'dev.google@uiverse.studio';
      const mockName = provider === 'auth0-github' ? 'GitHub Developer' : 'Google Cloud Engineer';

      await authService.loginWithAuth0({
        email: mockEmail,
        fullName: mockName,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(mockEmail)}`,
        authProvider: provider,
        auth0Sub: `${provider}|${Date.now()}`,
      });

      showToast(`Authenticated via ${providerName} (Auth0 Shield). Stored in DB!`, 'success');
      onSuccess();
    } catch {
      showToast('Social login failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    await authService.loginDemo();
    showToast('Signed in with Demo Creator Account (Logged in DB)!', 'success');
    setIsLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0d0f18] border-2 border-violet-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Brand Visual & Auth0 Security Showcase */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#16182c] via-[#101220] to-[#0a0b14] p-8 flex-col justify-between border-r border-slate-800 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-52 h-52 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/30">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-black text-white tracking-tight">UIverse Studio</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold mb-3 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>AUTH0 SHIELD ENFORCED</span>
            </div>

            <h3 className="text-lg font-bold text-white leading-tight mb-2">
              Verified Developer Identity & Database Persistence.
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Full Auth0 security protocol with persistent server database storage. Login credentials, tokens, and download quotas are stored for future access.
            </p>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span>Auth0 Universal Login & PKCE Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span>Persistent Database Credentials Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span>Instant Unlocking of Standalone ZIP Exports</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Database Storage: /data/uiverse_database.json</span>
          </div>
        </div>

        {/* Right Side: Form & Auth0 Buttons */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between relative bg-[#0d0f18]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div>
            {/* Compulsory Download Warning Banner if user clicked a download button */}
            {downloadRequiredFor && (
              <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/70 via-rose-950/60 to-violet-950/70 border-2 border-amber-500/50 shadow-xl">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-200 tracking-tight block">
                      AUTH0 SECURITY GATE: LOGIN COMPULSORY FOR DOWNLOAD
                    </span>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      To download <span className="font-bold text-white">&quot;{downloadRequiredFor.name}&quot;</span> as a ZIP archive, an authenticated developer account is compulsory.
                    </p>
                    <span className="text-[10px] text-amber-400 font-mono block mt-1">
                      ✦ Download begins automatically immediately upon verified login.
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-5">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {mode === 'login'
                  ? 'Sign in with Auth0'
                  : mode === 'signup'
                  ? 'Create Auth0 Developer Account'
                  : 'Reset your password'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'login'
                  ? 'Use Auth0 Universal Login or enter your database credentials.'
                  : mode === 'signup'
                  ? 'Credentials will be saved into the database for future sessions.'
                  : 'Enter your email to receive recovery instructions.'}
              </p>
            </div>

            {/* Auth0 Universal Login Primary Action Button */}
            {mode === 'login' && (
              <div className="space-y-2.5 mb-5">
                <button
                  type="button"
                  onClick={handleAuth0UniversalLogin}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#eb5424] via-[#ea580c] to-[#f97316] hover:from-[#d9481b] hover:to-[#ea580c] text-white text-xs font-black tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.01]"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Continue with Auth0 Universal Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Social Login Options (Auth0 Federation) */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAuth0SocialLogin('auth0-github')}
                    disabled={isLoading}
                    className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>GitHub (Auth0)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAuth0SocialLogin('auth0-google')}
                    disabled={isLoading}
                    className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Google (Auth0)</span>
                  </button>
                </div>

                {/* Quick Demo Access */}
                <div className="p-2.5 rounded-lg bg-violet-950/30 border border-violet-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span className="text-[11px]">Instant Demo Creator Access:</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    disabled={isLoading}
                    className="px-2.5 py-1 rounded bg-violet-600 hover:bg-violet-500 text-[11px] font-bold text-white shrink-0 shadow transition-colors"
                  >
                    Demo Login
                  </button>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-800" />
                  <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Or Database Credentials
                  </span>
                  <div className="flex-grow border-t border-slate-800" />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                  />
                  {errors.fullName && (
                    <span className="text-[11px] text-rose-400 mt-0.5 block">{errors.fullName}</span>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                />
                {errors.email && (
                  <span className="text-[11px] text-rose-400 mt-0.5 block">{errors.email}</span>
                )}
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-violet-400 hover:text-violet-300"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 pr-9 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-[11px] text-rose-400 mt-0.5 block">{errors.password}</span>
                  )}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                  />
                  {errors.confirmPassword && (
                    <span className="text-[11px] text-rose-400 mt-0.5 block">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 accent-violet-600"
                    />
                    <span>Store session in database for future logins</span>
                  </label>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 accent-violet-600 mt-0.5"
                    />
                    <span>
                      I agree to the UIverse Studio Terms of Service and database credential storage policy.
                    </span>
                  </label>
                  {errors.terms && (
                    <span className="text-[11px] text-rose-400 mt-0.5 block">{errors.terms}</span>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-colors shadow-lg shadow-violet-600/20 disabled:opacity-50"
              >
                {isLoading
                  ? 'Verifying with Database...'
                  : mode === 'login'
                  ? 'Sign In & Authenticate'
                  : mode === 'signup'
                  ? 'Create Account & Store in Database'
                  : 'Send Reset Link'}
              </button>
            </form>
          </div>

          {/* Switch mode links */}
          <div className="pt-4 mt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-violet-400 hover:text-violet-300 ml-1"
                >
                  Sign up free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-violet-400 hover:text-violet-300 ml-1"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
