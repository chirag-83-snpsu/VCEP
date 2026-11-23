'use client';

import { useState } from 'react';
import BrandLogo from '@/components/brand-logo';
import { Clock, RefreshCw, LogOut, ShieldAlert } from 'lucide-react';
import '../../signin/signin.css';

export default function AccountPendingPage() {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');

  async function checkStatus() {
    setChecking(true);
    setMessage('');
    try {
      const res = await fetch('/api/boot');
      const data = (await res.json()) as any;
      if (data.user && data.user.role !== 'pending') {
        window.location.href = data.user.role === 'admin' ? '/?view=admin' : data.user.role === 'faculty' ? '/?view=faculty' : '/';
        return;
      }
      setMessage('Your enrollment is still awaiting roster confirmation. Please check back shortly.');
    } catch {
      setMessage('Could not connect to the workspace service.');
    } finally {
      setChecking(false);
    }
  }

  async function handleSignOut() {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } finally {
      window.location.href = '/signin';
    }
  }

  return (
    <div className="vcep-auth-container">
      <aside className="vcep-auth-sidebar" aria-label="Vayentra Programme Identity">
        <div>
          <div className="vcep-auth-brand-head">
            <BrandLogo size="md" theme="dark" />
          </div>
          <div className="vcep-auth-tagline">VCEP College Enrollment</div>
        </div>

        <div className="vcep-auth-sidebar-body">
          <h1 className="vcep-auth-hero-title">
            Enrolment verification in progress.
          </h1>
          <p className="vcep-auth-hero-desc">
            VCEP Commerce WorkLab operates within strict college cohort boundaries. Each participant must be confirmed on an official institutional roster before accessing course materials.
          </p>
        </div>

        <div className="vcep-auth-sidebar-foot">
          <ShieldAlert size={13} aria-hidden="true" />
          <span>Multi-tenant academic privacy shielding</span>
        </div>
      </aside>

      <main className="vcep-auth-main" id="main">
        <div className="vcep-auth-card" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
            }}
          >
            <Clock size={28} aria-hidden="true" />
          </div>

          <h2 className="vcep-auth-card-title">Enrolment Pending</h2>
          <p className="vcep-auth-card-desc" style={{ marginBottom: 24 }}>
            Your account is authenticated, but your college coordinator has not yet assigned you to an active academic cohort.
          </p>

          {message && (
            <div
              className="vcep-auth-alert vcep-auth-alert-info"
              style={{ textAlign: 'left', marginBottom: 20 }}
            >
              <span>{message}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              type="button"
              onClick={checkStatus}
              className="vcep-auth-btn-primary"
              disabled={checking}
            >
              <RefreshCw size={16} className={checking ? 'animate-spin' : ''} aria-hidden="true" />
              <span>{checking ? 'Checking roster…' : 'Check Enrolment Status'}</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              style={{
                height: 44,
                background: 'transparent',
                border: '1.5px solid #e2e8f0',
                borderRadius: 8,
                color: '#64748b',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <LogOut size={15} aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="vcep-auth-card-footer" style={{ textAlign: 'left' }}>
            <strong>What should I do?</strong>
            <p style={{ margin: '6px 0 0', lineHeight: 1.5 }}>
              Please reach out to your department faculty coordinator or college administrator to verify your institutional email on the VCEP roster.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
