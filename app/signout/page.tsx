'use client';

import { useEffect } from 'react';
import BrandLogo from '@/components/brand-logo';
import { LogOut } from 'lucide-react';
import '../signin/signin.css';

export default function SignOutPage() {
  useEffect(() => {
    async function executeSignOut() {
      try {
        await fetch('/api/auth/signout', { method: 'POST' });
      } catch {}
      setTimeout(() => {
        window.location.href = '/signin';
      }, 800);
    }
    executeSignOut();
  }, []);

  return (
    <div className="vcep-auth-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="vcep-auth-card" style={{ textAlign: 'center', maxWidth: 380, margin: '40px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <BrandLogo size="md" />
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#f0fdfa',
            color: '#0f766e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <LogOut size={22} aria-hidden="true" />
        </div>
        <h2 className="vcep-auth-card-title" style={{ fontSize: 20 }}>
          Signing Out…
        </h2>
        <p className="vcep-auth-card-desc">
          Safely clearing your session credentials and closing your active workspace.
        </p>
      </div>
    </div>
  );
}
