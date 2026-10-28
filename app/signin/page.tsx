'use client';

import { useState } from 'react';
import BrandLogo from '@/components/brand-logo';
import {
  BriefcaseBusiness,
  ShieldCheck,
  Award,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Lock,
} from 'lucide-react';
import './signin.css';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsActivation, setNeedsActivation] = useState(false);

  // Read return_to safely from window.location if present
  const returnTo =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('return_to') || '/'
      : '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setNeedsActivation(false);

    if (!email || !password) {
      setError('Please enter your institutional email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        if (data.needsActivation) {
          setNeedsActivation(true);
        }
        throw new Error(data.error || 'Invalid email or password.');
      }

      // Successful authentication -> navigate to designated role workspace
      const target =
        returnTo && returnTo !== '/' && returnTo !== '/signin'
          ? returnTo
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
      {/* Left Brand Identity Panel */}
      <aside className="vcep-auth-sidebar" aria-label="Vayentra Programme Identity">
        <div>
          <div className="vcep-auth-brand-head">
            <BrandLogo size="md" theme="dark" />
          </div>
          <div className="vcep-auth-tagline">VCEP Commerce WorkLab</div>
        </div>

        <div className="vcep-auth-sidebar-body">
          <h1 className="vcep-auth-hero-title">
            Experience corporate before you enter corporate.
          </h1>
          <p className="vcep-auth-hero-desc">
            A 24-session structured corporate experience program for undergraduate commerce professionals. Fictional cases, real professional habits.
          </p>

          <div className="vcep-auth-features">
            <div className="vcep-auth-feature-item">
              <div className="vcep-auth-feature-icon" aria-hidden="true">
                <BriefcaseBusiness size={16} />
              </div>
              <div className="vcep-auth-feature-text">
                <strong>24 Enterprise Indian Cases</strong>
                <span>From day-one operations to management review and exit simulation.</span>
              </div>
            </div>

            <div className="vcep-auth-feature-item">
              <div className="vcep-auth-feature-icon" aria-hidden="true">
                <ShieldCheck size={16} />
              </div>
              <div className="vcep-auth-feature-text">
                <strong>Verified Faculty Assessment</strong>
                <span>College-cohort multi-tenant isolation with verifiable rubric grading.</span>
              </div>
            </div>

            <div className="vcep-auth-feature-item">
              <div className="vcep-auth-feature-icon" aria-hidden="true">
                <Award size={16} />
              </div>
              <div className="vcep-auth-feature-text">
                <strong>Industry Readiness Passport</strong>
                <span>Proctored demo-day portfolio of authentic business artifacts.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vcep-auth-sidebar-foot">
          <Lock size={13} aria-hidden="true" />
          <span>Confidential institutional workspace · Encrypted session authentication</span>
        </div>
      </aside>

      {/* Right Interaction Panel */}
      <main className="vcep-auth-main" id="main">
        <div className="vcep-auth-card">
          <div className="vcep-auth-card-header">
            <h2 className="vcep-auth-card-title">Sign in to VCEP</h2>
            <p className="vcep-auth-card-desc">
              Access your learning, assignments and feedback.
            </p>
          </div>

          {error && (
            <div className="vcep-auth-alert vcep-auth-alert-error" role="alert" style={{ marginBottom: 18 }}>
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
              <div>
                <span>{error}</span>
                {needsActivation && (
                  <div style={{ marginTop: 8 }}>
                    <a href="/activate" className="vcep-auth-link">
                      Go to Account Activation →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

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
                  placeholder="Enter your account password"
                  className="vcep-auth-input"
                  style={{ paddingRight: 40 }}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="vcep-auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="vcep-auth-row-options">
              <label className="vcep-auth-checkbox-label">
                <input type="checkbox" defaultChecked className="vcep-auth-checkbox" />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="vcep-auth-btn-primary"
              disabled={loading}
            >
              <span>{loading ? 'Verifying credentials…' : 'Sign In'}</span>
              {!loading && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </form>

          <div className="vcep-auth-card-footer">
            <span>Enrolled but haven’t set up a password? </span>
            <a href="/activate" className="vcep-auth-link">
              Activate your account →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
