'use client';

import { useState, useEffect } from 'react';
import BrandLogo from '@/components/brand-logo';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Users,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import '../signin/signin.css';

export default function ActivatePage() {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [invitation, setInvitation] = useState<{
    email: string;
    role: string;
    cohortName: string;
  } | null>(null);

  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Initialize from URL search param if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const initialToken = urlParams.get('token') || '';
    if (initialToken) {
      setToken(initialToken);
      verifyToken(initialToken);
    }
  }, []);

  async function verifyToken(t: string) {
    if (!t.trim()) return;
    setVerifying(true);
    setError('');
    try {
      const res = await fetch(`/api/auth/invitation?token=${encodeURIComponent(t.trim())}`);
      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || 'Invitation link is invalid or has expired.');
      }
      setInvitation(data);
    } catch (err: any) {
      setInvitation(null);
      setError(err.message || 'Invitation is invalid.');
    } finally {
      setVerifying(false);
    }
  }

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Please provide your invitation token.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          password,
          name: name.trim() || undefined,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || 'Failed to activate account.');
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = data.redirectUrl || '/';
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Activation failed.');
      setSubmitting(false);
    }
  }

  return (
    <div className="vcep-auth-container">
      <aside className="vcep-auth-sidebar" aria-label="Vayentra Programme Identity">
        <div>
          <div className="vcep-auth-brand-head">
            <BrandLogo size="md" theme="dark" />
          </div>
          <div className="vcep-auth-tagline">VCEP Account Activation</div>
        </div>

        <div className="vcep-auth-sidebar-body">
          <h1 className="vcep-auth-hero-title">
            Activate your institutional learning account.
          </h1>
          <p className="vcep-auth-hero-desc">
            Your college coordinator has provisioned your placement in VCEP Commerce WorkLab. Verify your identity and set a secure password to begin.
          </p>

          <div className="vcep-auth-features">
            <div className="vcep-auth-feature-item">
              <div className="vcep-auth-feature-icon" aria-hidden="true">
                <GraduationCap size={16} />
              </div>
              <div className="vcep-auth-feature-text">
                <strong>Enrolled Cohort Placement</strong>
                <span>Assigned directly to your college academic division.</span>
              </div>
            </div>

            <div className="vcep-auth-feature-item">
              <div className="vcep-auth-feature-icon" aria-hidden="true">
                <Users size={16} />
              </div>
              <div className="vcep-auth-feature-text">
                <strong>Faculty & Peer Collaboration</strong>
                <span>Direct submission, feedback and rubric scoring from instructors.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vcep-auth-sidebar-foot">
          <Lock size={13} aria-hidden="true" />
          <span>Single-use encrypted activation token</span>
        </div>
      </aside>

      <main className="vcep-auth-main" id="main">
        <div className="vcep-auth-card">
          <div className="vcep-auth-card-header">
            <h2 className="vcep-auth-card-title">Activate Account</h2>
            <p className="vcep-auth-card-desc">
              Complete your profile setup to access your learning workspace.
            </p>
          </div>

          {error && (
            <div className="vcep-auth-alert vcep-auth-alert-error" role="alert" style={{ marginBottom: 18 }}>
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="vcep-auth-alert vcep-auth-alert-info" role="status" style={{ marginBottom: 18 }}>
              <CheckCircle2 size={17} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
              <span>Account activated successfully! Redirecting to your workspace…</span>
            </div>
          )}

          {!invitation && (
            <div style={{ marginBottom: 20 }}>
              <div className="vcep-auth-field">
                <label htmlFor="token-input" className="vcep-auth-label">
                  Invitation Token
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    id="token-input"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="vcep_act_..."
                    className="vcep-auth-input"
                    disabled={verifying}
                  />
                  <button
                    type="button"
                    onClick={() => verifyToken(token)}
                    className="vcep-auth-btn-primary"
                    style={{ padding: '0 18px', height: 44 }}
                    disabled={verifying || !token.trim()}
                  >
                    {verifying ? 'Checking…' : 'Verify'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {invitation && (
            <form onSubmit={handleActivate} className="vcep-auth-form" noValidate>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '12px 14px',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                <div>
                  <span style={{ color: '#64748b' }}>Account: </span>
                  <strong>{invitation.email}</strong>
                </div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ color: '#64748b' }}>Cohort: </span>
                  <strong>{invitation.cohortName}</strong> ·{' '}
                  <span style={{ textTransform: 'capitalize', color: '#0f766e', fontWeight: 600 }}>
                    {invitation.role}
                  </span>
                </div>
              </div>

              <div className="vcep-auth-field">
                <label htmlFor="user-name" className="vcep-auth-label">
                  Full Legal Name
                </label>
                <input
                  id="user-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="vcep-auth-input"
                  disabled={submitting}
                />
              </div>

              <div className="vcep-auth-field">
                <label htmlFor="create-password" className="vcep-auth-label">
                  Create Password (min. 8 characters)
                </label>
                <div className="vcep-auth-input-wrap">
                  <input
                    id="create-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    className="vcep-auth-input"
                    style={{ paddingRight: 40 }}
                    disabled={submitting}
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

              <div className="vcep-auth-field">
                <label htmlFor="confirm-password" className="vcep-auth-label">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="vcep-auth-input"
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                className="vcep-auth-btn-primary"
                disabled={submitting || success}
              >
                <span>{submitting ? 'Setting up account…' : 'Activate Account & Continue'}</span>
                {!submitting && <ArrowRight size={16} aria-hidden="true" />}
              </button>
            </form>
          )}

          <div className="vcep-auth-card-footer">
            <span>Already have an active account? </span>
            <a href="/signin" className="vcep-auth-link">
              Sign In →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
