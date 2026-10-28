'use client';

import React from 'react';

type SessionIconProps = {
  session: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withContainer?: boolean;
};

// SVG Icon artwork for all 24 sessions
function IconArtwork({ session, size }: { session: number; size: number }) {
  const navy = '#17245C';
  const teal = '#0F766E';
  const gold = '#E5AF2E';

  switch (session) {
    // 01. How a Business Works — Business building and growth
    case 1:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="7" width="10" height="14" rx="1.5" stroke={navy} />
          <path d="M6 10h1M6 14h1M6 18h1M10 10h1M10 14h1M10 18h1" stroke={navy} />
          <path d="M13 13h8v8h-8z" rx="1" stroke={teal} />
          <path d="M14 6l4-4 3 3" stroke={gold} />
          <path d="M21 2v4h-4" stroke={gold} />
        </svg>
      );

    // 02. Professional Identity and Teamwork — Professional team
    case 2:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="7" r="3.5" stroke={navy} />
          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={navy} />
          <circle cx="5" cy="9" r="2.5" stroke={teal} />
          <path d="M2 20v-1a3 3 0 0 1 3-3h1" stroke={teal} />
          <circle cx="19" cy="9" r="2.5" stroke={teal} />
          <path d="M22 20v-1a3 3 0 0 0-3-3h-1" stroke={teal} />
          <circle cx="12" cy="7" r="1" fill={gold} />
        </svg>
      );

    // 03. Workplace Communication — Speech bubbles
    case 3:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a6.5 6.5 0 0 1-6.5 6.5H10l-4 4v-4.5A6.5 6.5 0 0 1 14.5 5h0A6.5 6.5 0 0 1 21 11.5z" stroke={navy} />
          <path d="M8 12a4.5 4.5 0 0 1-4.5-4.5v0A4.5 4.5 0 0 1 8 3h4a4.5 4.5 0 0 1 4.5 4.5" stroke={teal} />
          <circle cx="10.5" cy="11.5" r="1" fill={gold} />
          <circle cx="14" cy="11.5" r="1" fill={navy} />
          <circle cx="17.5" cy="11.5" r="1" fill={teal} />
        </svg>
      );

    // 04. Meetings and Reporting — Presentation and meeting
    case 4:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="12" rx="2" stroke={navy} />
          <path d="M8 21l4-6 4 6" stroke={navy} />
          <path d="M6 8h4M6 11h8" stroke={teal} />
          <circle cx="18" cy="8" r="1.5" fill={gold} />
          <circle cx="7" cy="17" r="1.5" stroke={teal} />
          <circle cx="17" cy="17" r="1.5" stroke={teal} />
        </svg>
      );

    // 05. Accounting Transactions — Financial document and coin
    case 5:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 4v16a2 2 0 0 0 2 2h8" stroke={navy} />
          <path d="M4 4a2 2 0 0 1 2-2h8l5 5v5" stroke={navy} />
          <path d="M8 8h4M8 12h4M8 16h2" stroke={teal} />
          <circle cx="18" cy="18" r="4" stroke={gold} strokeWidth="2" />
          <path d="M18 16v4M16.5 17.5h3" stroke={gold} />
        </svg>
      );

    // 06. Ledger and Month End Close — Ledger and clock
    case 6:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" stroke={navy} />
          <path d="M7 3v18M11 7h3M11 11h3" stroke={teal} />
          <circle cx="17" cy="17" r="5" fill="#F0F7FA" stroke={gold} strokeWidth="2" />
          <path d="M17 14.5v2.5l1.5 1.5" stroke={navy} />
        </svg>
      );

    // 07. Excel and Data Cleaning — Spreadsheet and cleaning sparkle
    case 7:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke={navy} />
          <path d="M3 10h18M3 15h18M9 4v16M15 4v16" stroke={teal} />
          <path d="M19 2l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill={gold} stroke={gold} strokeWidth="1" />
          <circle cx="12" cy="12.5" r="1" fill={gold} />
        </svg>
      );

    // 08. Bank Reconciliation — Bank and matching arrows
    case 8:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8L12 3l9 5" stroke={navy} />
          <path d="M4 8v10M20 8v10M2 18h20" stroke={navy} />
          <path d="M8 8v7M12 8v7M16 8v7" stroke={teal} />
          <path d="M7 21h10M17 21l-2-2M15 23l2-2" stroke={gold} strokeWidth="2" />
          <path d="M17 19H7M7 19l2-2M9 21L7 19" stroke={teal} strokeWidth="1.5" />
        </svg>
      );

    // 09. Business Finance and Performance — Growing financial chart
    case 9:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 20h18" stroke={navy} />
          <path d="M5 16l4-5 4 3 6-8" stroke={teal} strokeWidth="2.2" />
          <circle cx="19" cy="6" r="2.5" fill={gold} stroke={navy} strokeWidth="1.5" />
          <rect x="7" y="14" width="2" height="6" fill={navy} />
          <rect x="11" y="11" width="2" height="9" fill={navy} />
          <rect x="15" y="8" width="2" height="12" fill={teal} />
        </svg>
      );

    // 10. MIS Dashboard Development — Analytics dashboard
    case 10:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="18" rx="2" stroke={navy} />
          <path d="M2 8h20M7 8v13" stroke={navy} />
          <rect x="9.5" y="11" width="4" height="7" rx="0.5" fill={teal} />
          <rect x="15" y="13" width="4" height="5" rx="0.5" fill={navy} />
          <circle cx="4.5" cy="5.5" r="1" fill={gold} />
          <path d="M10 5.5h8" stroke={teal} />
        </svg>
      );

    // 11. GST and Invoice Review — Invoice and magnifying glass
    case 11:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 3h11l5 5v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke={navy} />
          <path d="M7 8h4M7 12h3M7 16h2" stroke={teal} />
          <circle cx="15.5" cy="14.5" r="3.5" fill="#F0F7FA" stroke={gold} strokeWidth="2" />
          <path d="M18 17l3.5 3.5" stroke={gold} strokeWidth="2.5" />
        </svg>
      );

    // 12. Receivables and Working Capital — Money circulation
    case 12:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" stroke={navy} />
          <path d="M12 9.5v5M10.5 11h3" stroke={navy} />
          <path d="M12 3a9 9 0 0 1 8.5 6M20.5 9h-4M20.5 9v-4" stroke={gold} strokeWidth="2" />
          <path d="M12 21a9 9 0 0 1-8.5-6M3.5 15h4M3.5 15v4" stroke={teal} strokeWidth="2" />
        </svg>
      );

    // 13. AI for Commerce Professionals — AI brain and circuits
    case 13:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5v.5A3 3 0 0 0 4 11a3 3 0 0 0 1 2.3A3.5 3.5 0 0 0 6 18h3.5v2" stroke={navy} />
          <path d="M14.5 4a3.5 3.5 0 0 1 3.5 3.5v.5A3 3 0 0 1 20 11a3 3 0 0 1-1 2.3A3.5 3.5 0 0 1 18 18h-3.5v2" stroke={navy} />
          <path d="M12 4v16" stroke={teal} />
          <circle cx="12" cy="8" r="1.5" fill={gold} />
          <circle cx="12" cy="14" r="1.5" fill={gold} />
          <path d="M9.5 8h2.5M12 14h2.5" stroke={teal} />
        </svg>
      );

    // 14. AI Verification and Automation — Verified document and gear
    case 14:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h7" stroke={navy} />
          <path d="M14 2l6 6v4" stroke={navy} />
          <path d="M8 12l2.5 2.5 5-5" stroke={teal} strokeWidth="2.2" />
          <circle cx="18" cy="18" r="2.5" fill="#F0F7FA" stroke={gold} strokeWidth="1.8" />
          <path d="M18 14.5v1M18 20.5v1M14.5 18h1M20.5 18h1" stroke={gold} strokeWidth="2" />
        </svg>
      );

    // 15. Customer and Sales Operations — Customers and target
    case 15:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="7" r="3" stroke={navy} />
          <path d="M3 18v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" stroke={navy} />
          <circle cx="17" cy="12" r="5" stroke={teal} />
          <circle cx="17" cy="12" r="2.5" stroke={gold} />
          <circle cx="17" cy="12" r="0.8" fill={navy} />
        </svg>
      );

    // 16. Commercial Decision Making — Directional decision signpost
    case 16:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2v20M9 22h6" stroke={navy} />
          <path d="M12 5h6l3 3-3 3h-6V5z" fill="#F0F7FA" stroke={teal} />
          <path d="M12 12H6l-3 3 3 3h6v-6z" fill="#F0F7FA" stroke={gold} />
          <circle cx="12" cy="8" r="1" fill={navy} />
          <circle cx="12" cy="15" r="1" fill={navy} />
        </svg>
      );

    // 17. Industry Challenge Discovery — Research magnifying glass
    case 17:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke={navy} strokeWidth="2" />
          <path d="M21 21l-4.5-4.5" stroke={navy} strokeWidth="2.5" />
          <circle cx="11" cy="11" r="3" stroke={teal} />
          <path d="M11 6v2M11 14v2M6 11h2M14 11h2" stroke={teal} />
          <circle cx="11" cy="11" r="1" fill={gold} />
        </svg>
      );

    // 18. Solution Design and Project Planning — Lightbulb and planning gear
    case 18:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18h6M10 21h4" stroke={navy} />
          <path d="M12 2a7 7 0 0 0-4 12.8V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.2A7 7 0 0 0 12 2z" stroke={teal} />
          <circle cx="12" cy="8" r="2.5" fill="#F0F7FA" stroke={gold} strokeWidth="1.8" />
          <path d="M12 4v1M12 11v1M8.5 7.5l.8.8M14.7 7.5l-.8.8" stroke={gold} />
        </svg>
      );

    // 19. Project Execution and Quality Assurance — Quality checklist
    case 19:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="3" width="16" height="18" rx="2" stroke={navy} />
          <path d="M8 3v3h8V3" stroke={navy} />
          <path d="M7 10l2 2 4-4" stroke={teal} strokeWidth="2.2" />
          <path d="M7 16l2 2 4-4" stroke={gold} strokeWidth="2.2" />
          <path d="M15 11h3M15 17h3" stroke={navy} />
        </svg>
      );

    // 20. Management Review and Change Control — Improvement and refresh cycle
    case 20:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke={teal} strokeWidth="2" />
          <path d="M3 3v5h5" stroke={teal} strokeWidth="2" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" stroke={gold} strokeWidth="2" />
          <path d="M21 21v-5h-5" stroke={gold} strokeWidth="2" />
          <circle cx="12" cy="12" r="2" fill={navy} />
        </svg>
      );

    // 21. Resume and Portfolio Development — Professional CV and achievement badge
    case 21:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={navy} />
          <path d="M14 2v6h6" stroke={navy} />
          <circle cx="9" cy="9" r="1.8" fill={teal} />
          <path d="M7 13h5M7 16h8" stroke={navy} />
          <circle cx="17.5" cy="16.5" r="3" fill="#F0F7FA" stroke={gold} strokeWidth="2" />
          <path d="M17.5 19.5v2.5l1.5-1 1.5 1v-2.5" fill={gold} />
        </svg>
      );

    // 22. Hiring Simulation and Exit Assessment — Professional interview
    case 22:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="6" cy="8" r="3" stroke={navy} />
          <path d="M1 18v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1" stroke={navy} />
          <circle cx="18" cy="8" r="3" stroke={teal} />
          <path d="M13 18v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1" stroke={teal} />
          <path d="M10 16h4" stroke={gold} strokeWidth="2" />
          <path d="M12 14v4" stroke={gold} strokeWidth="2" />
        </svg>
      );

    // 23. Corporate Presentation Preparation — Business presentation screen
    case 23:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="13" rx="2" stroke={navy} />
          <path d="M12 16v5M8 21h8" stroke={navy} />
          <path d="M6 12l3-4 3 2 4-5" stroke={teal} strokeWidth="2" />
          <circle cx="16" cy="5" r="1" fill={gold} />
          <rect x="15" y="8" width="3" height="4" fill={gold} />
        </svg>
      );

    // 24. Corporate Demo Day and Industry Passport — Stage, award and audience
    case 24:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9V4h12v5a6 6 0 0 1-12 0z" fill="#F0F7FA" stroke={gold} strokeWidth="2" />
          <path d="M6 5H3a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h1" stroke={navy} />
          <path d="M18 5h3a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-1" stroke={navy} />
          <path d="M12 15v3M8 21h8" stroke={teal} strokeWidth="2" />
          <circle cx="12" cy="8" r="1.5" fill={gold} />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke={navy} />
          <path d="M9 9h6v6H9z" stroke={teal} />
        </svg>
      );
  }
}

export default function SessionIcon({
  session,
  size = 'md',
  className = '',
  withContainer = true,
}: SessionIconProps) {
  const containerPx = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11 md:w-12 md:h-12';
  const iconPx = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;

  if (!withContainer) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <IconArtwork session={session} size={iconPx} />
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 rounded-xl transition-transform duration-200 group-hover:scale-105 ${containerPx} ${className}`}
      style={{
        backgroundColor: '#F0F7FA',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(23, 36, 92, 0.04)',
      }}
      aria-hidden="true"
    >
      <IconArtwork session={session} size={iconPx} />
    </div>
  );
}
