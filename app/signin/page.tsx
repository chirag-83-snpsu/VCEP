'use client';

import { useState } from 'react';
import { VayentraEmblem } from '@/components/brand-logo';
import { safeRelativeReturnPath } from '@/lib/url-safety';
import {
  BriefcaseBusiness,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  Lock,
} from 'lucide-react';
import './signin.css';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsActivation, setNeedsActivation] = useState(false);

  // Read return_to safely from window.location if present
  const rawReturnTo =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('return_to')
      : null;
  const safeReturn = safeRelativeReturnPath(rawReturnTo);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setNeedsActivation(false);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Please enter your institutional email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        if (data.needsActivation) {
          setNeedsActivation(true);
        }
        throw new Error(data.error || 'Invalid email or password.');
      }

      // Successful authentication -> navigate to designated role workspace or safe return destination
      const target =
        safeReturn && safeReturn !== '/'
          ? safeReturn
          : data.redirectUrl || '/';
      window.location.href = target;
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the authentication service.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="vcep-auth-container">
      {/* 1. Left Executive Hero Panel */}
      <aside className="vcep-auth-sidebar" aria-label="Vayentra Programme Identity">
        {/* Layered Luminous Teal Fluid Wave Background */}
        <div className="vcep-auth-wave-container" aria-hidden="true">
          <svg
            className="vcep-auth-wave-svg"
            viewBox="0 0 900 900"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="waveFlow1" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.45" />
                <stop offset="35%" stopColor="#0f766e" stopOpacity="0.65" />
                <stop offset="70%" stopColor="#14b8a6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#080e24" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="waveFlow2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#0f766e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="crestGlow" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0f766e" stopOpacity="0.3" />
              </linearGradient>
              <filter id="waveBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="14" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ambient deep radial glow */}
            <circle cx="720" cy="720" r="380" fill="url(#waveFlow1)" filter="blur(60px)" opacity="0.7" />

            {/* Volumetric Silk Aurora Waves */}
            <path
              d="M 0 740 C 240 600, 520 780, 900 620 L 900 900 L 0 900 Z"
              fill="url(#waveFlow1)"
              opacity="0.55"
            />
            <path
              d="M 0 790 C 280 640, 560 760, 900 660 L 900 900 L 0 900 Z"
              fill="url(#waveFlow2)"
              opacity="0.65"
            />

            {/* Crisp Luminous Crest Lines */}
            <path
              d="M 20 810 C 290 640, 570 760, 900 640"
              stroke="url(#crestGlow)"
              strokeWidth="3"
              fill="none"
              filter="url(#waveBlur)"
              opacity="0.85"
            />
            <path
              d="M 0 750 C 260 610, 530 750, 900 630"
              stroke="url(#crestGlow)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Top: Authentic Brand Lockup */}
        <header className="vcep-auth-brand-top">
          <div className="vcep-auth-brand-lockup">
            <VayentraEmblem size={42} className="vcep-auth-brand-emblem" />
            <div className="vcep-auth-brand-titles">
              <div className="vcep-auth-brand-row">
                <span className="vcep-auth-brand-name">VAYENTRA</span>
                <span className="vcep-auth-badge-vcep">VCEP</span>
              </div>
              <span className="vcep-auth-brand-sub">COMMERCE WORKLAB</span>
            </div>
          </div>
        </header>

        {/* Center: Hero Statement with Glowing Vertical Accent */}
        <div className="vcep-auth-hero-center">
          <div className="vcep-auth-headline-wrap">
            <div className="vcep-auth-vertical-accent" aria-hidden="true" />
            <div className="vcep-auth-headline-text">
              <h1 className="vcep-auth-hero-title">
                Your corporate<br />commerce experience.
              </h1>
              <p className="vcep-auth-hero-desc">
                A structured, industry-aligned learning experience.
              </p>
            </div>
          </div>

          {/* Interactive Feature Badges */}
          <div className="vcep-auth-feature-pills">
            <div className="vcep-auth-pill">
              <div className="vcep-auth-pill-icon" aria-hidden="true">
                <BriefcaseBusiness size={18} />
              </div>
              <span className="vcep-auth-pill-text">Real Business Exposure</span>
            </div>

            <div className="vcep-auth-pill">
              <div className="vcep-auth-pill-icon" aria-hidden="true">
                <ShieldCheck size={18} />
              </div>
              <span className="vcep-auth-pill-text">Verified Learning Credentials</span>
            </div>
          </div>
        </div>

        {/* Bottom: Institutional Security & Trust */}
        <footer className="vcep-auth-sidebar-foot">
          <Lock size={13} aria-hidden="true" />
          <span>Vayentra Corporate Experience Program · Encrypted Session</span>
        </footer>
      </aside>

      {/* 2. Right Form Interaction Panel */}
      <main className="vcep-auth-main" id="main">
        {/* Mobile Branded Header (Visible on compact screens) */}
        <div className="vcep-auth-mobile-header" aria-hidden="true">
          <div className="vcep-auth-brand-lockup">
            <VayentraEmblem size={36} className="vcep-auth-brand-emblem" />
            <div className="vcep-auth-brand-titles">
              <div className="vcep-auth-brand-row">
                <span className="vcep-auth-brand-name">VAYENTRA</span>
                <span className="vcep-auth-badge-vcep">VCEP</span>
              </div>
              <span className="vcep-auth-brand-sub">COMMERCE WORKLAB</span>
            </div>
          </div>
        </div>

        {/* Elevated Form Card */}
        <div className="vcep-auth-card">
          <header className="vcep-auth-card-header">
            <h2 className="vcep-auth-card-title">Sign in to VCEP</h2>
            <p className="vcep-auth-card-desc">
              Access your workspace securely.
            </p>
          </header>

          {/* Error Banner */}
          {error && (
            <div
              className="vcep-auth-alert vcep-auth-alert-error"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle size={16} className="vcep-auth-alert-icon" aria-hidden="true" />
              <div className="vcep-auth-alert-body">
                <span>{error}</span>
                {needsActivation && (
                  <div className="vcep-auth-alert-action-wrap">
                    <a href="/activate" className="vcep-auth-alert-action">
                      Go to Account Activation &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sign-in Form */}
          <form onSubmit={handleSubmit} className="vcep-auth-form" noValidate>
            <div className="vcep-auth-field">
              <label htmlFor="signin-email" className="vcep-auth-label">
                Institutional Email
              </label>
              <div className="vcep-auth-input-wrap">
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu or faculty@college.edu"
                  className="vcep-auth-input"
                  disabled={loading}
                  aria-required="true"
                />
              </div>
            </div>

            <div className="vcep-auth-field">
              <label htmlFor="signin-password" className="vcep-auth-label">
                Password
              </label>
              <div className="vcep-auth-input-wrap">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="vcep-auth-input vcep-auth-input-password"
                  disabled={loading}
                  aria-required="true"
                />
                <button
                  type="button"
                  className="vcep-auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="vcep-auth-row-options">
              <label className="vcep-auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="vcep-auth-checkbox"
                />
                <span className="vcep-auth-checkbox-text">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="vcep-auth-btn-primary"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="vcep-auth-spinner" aria-hidden="true" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <footer className="vcep-auth-card-footer">
            <span className="vcep-auth-footer-prompt">First time here? </span>
            <a href="/activate" className="vcep-auth-link">
              Activate your account &rarr;
            </a>
          </footer>
        </div>
      </main>
    </div>
  );
}
