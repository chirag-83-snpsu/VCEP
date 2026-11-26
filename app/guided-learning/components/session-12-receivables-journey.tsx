'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S12_STORAGE_KEY,
  CASE_F_AS_OF_DATE,
  OPENING_BANK_BALANCE,
  MANDATORY_7_DAY_PAYMENTS,
  INITIAL_NO_COLLECTION_GAP,
  CASE_F_INVOICES,
  CARDINAL_CREDIT_PRINCIPLES,
  calculateDaysOverdue,
  getBucketForDays,
  calculateCashForecast,
  loadSession12State,
  saveSession12State,
  clearSession12State,
  INITIAL_S12_STATE,
  S12_RUBRIC,
  S12_CHECKLIST,
  type Session12WorkstationState,
  type ReceivablesInvoiceItem,
  type AgeingBucket,
} from './session-12-receivables-data.ts';
import { evaluateSession12 } from '../../../lib/review-engine/session-rules/session-12.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Send,
  HelpCircle,
  Calendar,
  Layers,
  CheckSquare,
  AlertOctagon,
  Percent,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Session12ReceivablesJourneyProps {
  onUpdateDraft?: (key: string, value: string) => void;
}

interface TaskCardProps {
  taskId: string;
  taskNumber: string;
  title: string;
  instruction: string;
  learningTakeaway?: string;
  whyMatters?: string;
  statusText?: string;
  isActive?: boolean;
  onSelectTask?: () => void;
  children: React.ReactNode;
}

/**
 * Unified Premium TaskCard Component
 * Implements the VCEP single-task bordered card pattern.
 * Neutral 1px #DCE5E9 border, 16px radius, 3px teal left accent on active task.
 */
function TaskCard({
  taskId,
  taskNumber,
  title,
  instruction,
  learningTakeaway,
  whyMatters,
  statusText,
  isActive,
  onSelectTask,
  children,
}: TaskCardProps) {
  const [whyOpen, setWhyOpen] = useState(false);

  return (
    <article
      id={taskId.toLowerCase()}
      data-task-id={taskId}
      onClick={onSelectTask}
      tabIndex={0}
      aria-label={`${taskNumber}: ${title}`}
      style={{
        display: isActive ? 'block' : 'none',
        background: '#ffffff',
        border: '1px solid #DCE5E9',
        borderLeft: isActive ? '3px solid #0F766E' : '1px solid #DCE5E9',
        borderRadius: '16px',
        padding: 'clamp(18px, 2.5vw, 24px)',
        marginBottom: '20px',
        boxShadow: isActive ? '0 4px 16px rgba(15, 118, 110, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        outline: 'none',
      }}
    >
      {/* 1-Line Teaching Takeaway Banner */}
      {learningTakeaway && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f0fdfa',
            border: '1px solid #ccfbf1',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '16px',
            fontSize: '12px',
            color: '#0f766e',
            fontWeight: 600,
          }}
        >
          <Sparkles size={15} color="#0f766e" style={{ flexShrink: 0 }} />
          <span>💡 <strong>What you&apos;ll learn:</strong> {learningTakeaway}</span>
        </div>
      )}

      {/* Task Card Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '10px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#0F766E',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {taskNumber}
            </span>
            <span style={{ color: '#cbd5e1' }}>·</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
              Ref: {taskId}
            </span>
          </div>
          <h3
            style={{
              fontSize: 'clamp(17px, 2vw, 20px)',
              fontWeight: 800,
              color: '#17245C',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
        </div>

        {statusText && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '11.5px',
              color: '#0F766E',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={13} />
            <span>{statusText}</span>
          </div>
        )}
      </div>

      {/* Task Instruction (1-2 sentences) */}
      <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 14px', lineHeight: 1.55 }}>
        {instruction}
      </p>

      {/* Accessible Collapsible Why This Matters */}
      {whyMatters && (
        <div style={{ marginBottom: '18px' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setWhyOpen(!whyOpen);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#0F766E',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <HelpCircle size={13} />
            <span>{whyOpen ? 'Hide credit principle' : 'Why this matters'}</span>
            {whyOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {whyOpen && (
            <div
              style={{
                marginTop: '10px',
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '8px',
                borderLeft: '3px solid #0F766E',
                fontSize: '12.5px',
                color: '#334155',
                lineHeight: 1.6,
              }}
            >
              {whyMatters}
            </div>
          )}
        </div>
      )}

      <div>{children}</div>
    </article>
  );
}

export function Session12ReceivablesJourney({ onUpdateDraft }: Session12ReceivablesJourneyProps) {
  const [state, setState] = useState<Session12WorkstationState>(INITIAL_S12_STATE);
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string>('S12-T01');

  const WIZARD_STEPS = [
    { id: 'S12-T01' as const, num: 1, label: 'TASK 01: Prepare the Ageing', short: '1. Ageing' },
    { id: 'S12-T02' as const, num: 2, label: 'TASK 02: Identify the Cash Gap', short: '2. Cash Gap' },
    { id: 'S12-T03' as const, num: 3, label: 'TASK 03: Manage the Dispute', short: '3. Dispute' },
    { id: 'S12-T04' as const, num: 4, label: 'TASK 04: Plan Collections', short: '4. Collections' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  // Hydrate on mount
  useEffect(() => {
    const loaded = loadSession12State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', loaded.beaconDisputeMessage);
      onUpdateDraft('team:contribution', loaded.overdueReminderMessage);
      onUpdateDraft('team:judgement', loaded.governance.decisionOwner);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session12WorkstationState) => Session12WorkstationState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession12State(next);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', next.beaconDisputeMessage);
        onUpdateDraft('team:contribution', next.overdueReminderMessage);
        onUpdateDraft('team:judgement', next.governance.decisionOwner);
      }
      return next;
    });
  };

  const handleUpdateBucket = (invoiceId: string, bucket: AgeingBucket) => {
    updateState((prev) => {
      const current = prev.invoiceAudits[invoiceId] || {
        assignedBucket: bucket,
        verifiedDaysOverdue: 0,
        isDaysVerified: true,
        isBucketVerified: true,
        notes: '',
      };
      return {
        ...prev,
        invoiceAudits: {
          ...prev.invoiceAudits,
          [invoiceId]: {
            ...current,
            assignedBucket: bucket,
            isBucketVerified: true,
          },
        },
      };
    });
  };

  const handleToggleTargetInvoice = (invoiceId: string) => {
    updateState((prev) => {
      const exists = prev.targetedInvoiceIds.includes(invoiceId);
      const next = exists
        ? prev.targetedInvoiceIds.filter((id) => id !== invoiceId)
        : [...prev.targetedInvoiceIds, invoiceId];
      return { ...prev, targetedInvoiceIds: next };
    });
  };

  const handleToggleCheck = (index: number) => {
    updateState((prev) => {
      const nextChecked = prev.checkedIndices.includes(index)
        ? prev.checkedIndices.filter((i) => i !== index)
        : [...prev.checkedIndices, index];
      return { ...prev, checkedIndices: nextChecked };
    });
  };

  const handleReset = () => {
    clearSession12State();
    setState(INITIAL_S12_STATE);
    setReviewReport(null);
  };

  const handleRunReview = () => {
    const report = evaluateSession12({
      sessionId: 12,
      draft: {
        'concept:explain': state.beaconDisputeMessage,
        'team:contribution': state.overdueReminderMessage,
        'team:judgement': state.governance.decisionOwner,
      },
      workstationData: state,
    });
    setReviewReport(report);
  };

  // Cash forecast calculations based on current targeted selections
  const forecast = useMemo(() => {
    return calculateCashForecast(state.targetedInvoiceIds);
  }, [state.targetedInvoiceIds]);

  // Word counts
  const disputeWords = (state.beaconDisputeMessage || '').trim().split(/\s+/).filter(Boolean).length;
  const reminderWords = (state.overdueReminderMessage || '').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="vcep-session-clean-journey">
      {/* Sticky Horizontal Stepper */}
      <nav
        aria-label="Session Tasks Stepper"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 25,
          background: '#ffffff',
          borderRadius: '12px',
          padding: '8px 12px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          gap: '6px',
        }}
      >
        {WIZARD_STEPS.map((step) => {
          const isActive = activeTaskId === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveTaskId(step.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0f766e' : '#475569',
                background: isActive ? '#f0fdfa' : 'transparent',
                border: isActive ? '1px solid #99f6e4' : '1px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: isActive ? '#0f766e' : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#475569',
                  fontSize: '10px',
                  fontWeight: 700,
                }}
              >
                {step.num}
              </span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </nav>
      {/* =========================================================================
          HEADING 1: UNDERSTAND WHO OWES WHAT (#vcep-area-ageing)
         ========================================================================= */}
      <div id="vcep-area-ageing" className="vcep-journey-stage-block">
        <div className="vcep-journey-section-header">
          <div className="vcep-journey-badge-row">
            <span className="vcep-pill-navy">WORK AREA 01</span>
            <span className="vcep-pill-teal">RECEIVABLES AGEING ANALYSIS</span>
            <span className="vcep-pill-gold">DUE-DATE MEASUREMENT</span>
          </div>
          <h2 className="vcep-journey-title">1. Understand Who Owes What</h2>
          <p className="vcep-journey-subtitle">
            As of 31 October 2026, four customer invoices total ₹1,00,000 in outstanding credit. Measure days overdue from payment due dates, categorize debts into standard 30-day ageing buckets, and isolate disputed balances before building the cash plan.
          </p>
        </div>

        {/* TASK 01: Prepare the Ageing */}
        <TaskCard
          taskId="S12-T01"
          taskNumber="TASK 01"
          title="Prepare the Ageing"
          instruction="Categorise unpaid invoices into standard ageing buckets using due dates to measure overdue exposure."
          learningTakeaway="Age unpaid customer invoices by due date to prioritize collections and identify bad debts."
          whyMatters="Days overdue must be calculated strictly from the payment due date: Days Overdue = Max(0, As-of Date - Due Date). Invoices due today are current, not overdue. Relying on invoice issue dates misstates portfolio liquidity risk."
          statusText="4 Invoices Aged · ₹1,00,000 Reconciled"
          isActive={activeTaskId === 'S12-T01'}
          onSelectTask={() => setActiveTaskId('S12-T01')}
        >
          {/* 4 Cardinal Credit Control Principles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {CARDINAL_CREDIT_PRINCIPLES.map((principle) => (
              <div
                key={principle.principleNum}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: '#f1f5f9',
                      color: principle.accentColor,
                    }}
                  >
                    PRINCIPLE {principle.principleNum}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B' }}>
                    {principle.badge}
                  </span>
                </div>
                <strong style={{ fontSize: '0.92rem', color: '#17245C' }}>{principle.title}</strong>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                  {principle.description}
                </p>
              </div>
            ))}
          </div>

          {/* Case F Receivables Ageing Table */}
          <div className="vcep-clean-rules-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="vcep-eyebrow">CASE F DEBTORS LEDGER AS OF 31 OCT 2026</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Receivables Ageing Schedule &amp; Overdue Verification
                </h4>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 700 }}>
                As-of Date: {CASE_F_AS_OF_DATE}
              </span>
            </div>

            <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#17245C', color: '#ffffff' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Invoice ID</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Customer</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Due Date</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Outstanding INR</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Days Overdue</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Ageing Bucket</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Disputed (₹)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Undisputed (₹)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Credit Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {CASE_F_INVOICES.map((inv) => {
                    const audit = state.invoiceAudits[inv.id] || {
                      assignedBucket: inv.correctBucket,
                      verifiedDaysOverdue: inv.correctDaysOverdue,
                      isDaysVerified: true,
                      isBucketVerified: true,
                      notes: '',
                    };
                    const isCurrent = audit.assignedBucket === 'Current';
                    const isDisputed = inv.disputedAmountINR > 0;

                    return (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#17245C' }}>{inv.id}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#334155' }}>{inv.customer}</td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#475569' }}>{inv.dueDate}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#17245C' }}>
                          ₹{inv.outstandingINR.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: inv.correctDaysOverdue === 0 ? '#15803d' : inv.correctDaysOverdue > 60 ? '#b91c1c' : '#b45309' }}>
                          {inv.correctDaysOverdue} days
                          <span style={{ fontSize: '0.7rem', display: 'block', color: '#64748B' }}>
                            {inv.correctDaysOverdue === 0 ? 'Due Today' : `${inv.correctDaysOverdue}d past due`}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <select
                            value={audit.assignedBucket}
                            onChange={(e) => handleUpdateBucket(inv.id, e.target.value as AgeingBucket)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              background: isCurrent ? '#f0fdf4' : audit.assignedBucket === '61–90 Days' ? '#fee2e2' : '#f8fafc',
                              color: isCurrent ? '#15803d' : audit.assignedBucket === '61–90 Days' ? '#b91c1c' : '#17245C',
                              border: '1px solid #cbd5e1',
                            }}
                          >
                            <option value="Current">Current (Due Today)</option>
                            <option value="1–30 Days">1–30 Days Overdue</option>
                            <option value="31–60 Days">31–60 Days Overdue</option>
                            <option value="61–90 Days">61–90 Days Overdue</option>
                            <option value=">90 Days">&gt;90 Days Overdue</option>
                          </select>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: isDisputed ? '#b91c1c' : '#94a3b8', fontWeight: isDisputed ? 700 : 400 }}>
                          {isDisputed ? `₹${inv.disputedAmountINR.toLocaleString('en-IN')}` : '₹0'}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#15803d' }}>
                          ₹{inv.undisputedAmountINR.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              background: inv.paymentRiskLevel === 'Low' ? '#dcfce7' : inv.paymentRiskLevel === 'Moderate' ? '#fef3c7' : '#fee2e2',
                              color: inv.paymentRiskLevel === 'Low' ? '#15803d' : inv.paymentRiskLevel === 'Moderate' ? '#92400e' : '#b91c1c',
                            }}
                          >
                            {inv.paymentRiskLevel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#F1F5F9', borderTop: '2px solid #17245C', fontWeight: 800 }}>
                    <td colSpan={3} style={{ padding: '10px 12px', color: '#17245C' }}>TOTAL RECEIVABLES PORTFOLIO:</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#17245C', fontSize: '0.95rem' }}>₹1,00,000</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748B' }}>4 Invoices</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748B' }}>100% Reconciled</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#b91c1c' }}>₹5,000 Disputed</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#15803d' }}>₹95,000 Collectible</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.72rem', color: '#64748B' }}>31 Oct 2026</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Ageing Distribution Visual Summary */}
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#17245C' }}>
                  Receivables Ageing Distribution (% of ₹1,00,000 Total Portfolio)
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                  70% of debt is &gt;30 days overdue
                </span>
              </div>

              {/* Stacked Percentage Bar */}
              <div style={{ display: 'flex', height: '14px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: '10%', background: '#15803d' }} title="Current: ₹10,000 (10%)" />
                <div style={{ width: '20%', background: '#0F766E' }} title="1–30 Days: ₹20,000 (20%)" />
                <div style={{ width: '30%', background: '#E5AF2E' }} title="31–60 Days: ₹30,000 (30%)" />
                <div style={{ width: '40%', background: '#b91c1c' }} title="61–90 Days: ₹40,000 (40%)" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', fontSize: '0.74rem' }}>
                <div>
                  <span style={{ color: '#15803d', fontWeight: 700 }}>● Current (0d):</span> ₹10,000 (10%)
                </div>
                <div>
                  <span style={{ color: '#0F766E', fontWeight: 700 }}>● 1–30d (15d):</span> ₹20,000 (20%)
                </div>
                <div>
                  <span style={{ color: '#E5AF2E', fontWeight: 700 }}>● 31–60d (45d):</span> ₹30,000 (30%)
                </div>
                <div>
                  <span style={{ color: '#b91c1c', fontWeight: 700 }}>● 61–90d (75d):</span> ₹40,000 (40%)
                </div>
                <div>
                  <span style={{ color: '#64748B', fontWeight: 700 }}>● &gt;90d:</span> ₹0 (0%)
                </div>
              </div>
            </div>
          </div>
        </TaskCard>
      </div>

      {/* =========================================================================
          HEADING 2: BUILD THE COLLECTION & CASH PLAN (#vcep-area-plan)
         ========================================================================= */}
      <div id="vcep-area-plan" className="vcep-journey-stage-block">
        <div className="vcep-journey-section-header">
          <div className="vcep-journey-badge-row">
            <span className="vcep-pill-navy">WORK AREA 02</span>
            <span className="vcep-pill-teal">TACTICAL CASH FORECAST</span>
            <span className="vcep-pill-gold">DISPUTE RESOLUTION</span>
          </div>
          <h2 className="vcep-journey-title">2. Build the Collection &amp; Cash Plan</h2>
          <p className="vcep-journey-subtitle">
            Bridge the ₹20,000 7-day liquidity deficit. Select target customer collections, enforce credit discipline on undisputed balances, and compose formal dispute clarification notices.
          </p>
        </div>

        {/* TASK 02: Identify the Cash Gap */}
        <TaskCard
          taskId="S12-T02"
          taskNumber="TASK 02"
          title="Identify the Cash Gap"
          instruction="Compare bank cash with 7-day payment obligations to determine the true net cash shortfall."
          learningTakeaway="Never count uncollected receivables as cash when planning unavoidable weekly payments."
          whyMatters="Revenue recorded in books does not pay vendor bills or employee salaries. A short-term cash forecast must separate cleared opening bank balances from pending collections to expose the true liquidity deficit."
          statusText={forecast.isDeficitClosed ? '✓ ₹20,000 Deficit Closed' : '⚠️ Deficit: -₹20,000'}
          isActive={activeTaskId === 'S12-T02'}
          onSelectTask={() => setActiveTaskId('S12-T02')}
        >
          {/* 7-Day Cash Gap Analytics & Target Simulator */}
          <div className="vcep-clean-rules-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="vcep-eyebrow">7-DAY LIQUIDITY STRESS TEST</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Cash Inflow Simulator &amp; Deficit Elimination Matrix
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Payroll &amp; Outflow Window: 1–7 November 2026
              </span>
            </div>

            {/* 3 Key Financial Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '18px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Opening Bank Balance</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#17245C', margin: '4px 0' }}>
                  ₹{OPENING_BANK_BALANCE.toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 600 }}>Cleared funds at 31 Oct</span>
              </div>

              <div style={{ background: '#fef2f2', padding: '14px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '0.72rem', color: '#991b1b', textTransform: 'uppercase' }}>Unavoidable 7-Day Payments</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b91c1c', margin: '4px 0' }}>
                  ₹{MANDATORY_7_DAY_PAYMENTS.toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#991b1b' }}>Salaries, rent &amp; utilities</span>
              </div>

              <div
                style={{
                  background: forecast.isDeficitClosed ? '#f0fdf4' : '#fff1f2',
                  padding: '14px',
                  borderRadius: '8px',
                  border: `1px solid ${forecast.isDeficitClosed ? '#bbf7d0' : '#fecdd3'}`,
                }}
              >
                <span style={{ fontSize: '0.72rem', color: forecast.isDeficitClosed ? '#166534' : '#9f1239', textTransform: 'uppercase' }}>
                  Projected Closing Cash Balance
                </span>
                <div
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: forecast.isDeficitClosed ? '#15803d' : '#b91c1c',
                    margin: '4px 0',
                  }}
                >
                  {forecast.closingCash >= 0 ? `+₹${forecast.closingCash.toLocaleString('en-IN')}` : `-₹${Math.abs(forecast.closingCash).toLocaleString('en-IN')}`}
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: forecast.isDeficitClosed ? '#15803d' : '#b91c1c' }}>
                  {forecast.isDeficitClosed ? '✓ ₹20,000 Deficit Closed (Surplus Reserve)' : '⚠️ Liquidity Deficit (Action Required!)'}
                </span>
              </div>
            </div>

            {/* Interactive Collection Target Selector */}
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <h5 style={{ margin: '0 0 10px', fontSize: '0.88rem', color: '#17245C' }}>
                Select Customer Collections for the 7-Day Push:
              </h5>
              <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: '#475569' }}>
                Target high-probability debtors to cover the ₹20,000 deficit. Note: For Beacon (F02), only the undisputed ₹15,000 can be projected.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {CASE_F_INVOICES.map((inv) => {
                  const isSelected = state.targetedInvoiceIds.includes(inv.id);
                  const isDisputed = inv.disputedAmountINR > 0;

                  return (
                    <div
                      key={inv.id}
                      onClick={() => handleToggleTargetInvoice(inv.id)}
                      style={{
                        border: isSelected ? '2px solid #0F766E' : '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '12px',
                        background: isSelected ? '#F0FDFA' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#17245C' }}>{inv.customer}</strong>
                          <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>
                            Invoice {inv.id} · {inv.correctDaysOverdue}d Overdue ({inv.correctBucket})
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            background: isSelected ? '#ccfbf1' : '#f1f5f9',
                            color: isSelected ? '#0F766E' : '#64748B',
                          }}
                        >
                          {isSelected ? 'TARGETED' : 'EXCLUDED'}
                        </span>
                      </div>

                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Target Collection:</span>
                        <strong style={{ fontSize: '0.95rem', color: '#0F766E' }}>
                          ₹{inv.undisputedAmountINR.toLocaleString('en-IN')}
                        </strong>
                      </div>

                      {isDisputed && (
                        <span style={{ display: 'block', marginTop: '4px', fontSize: '0.7rem', color: '#b91c1c' }}>
                          ⚠️ ₹5,000 disputed is quarantined &amp; excluded from target
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#334155' }}>
                  Total Projected Collections: <strong style={{ color: '#0F766E', fontSize: '0.95rem' }}>₹{forecast.projectedReceipts.toLocaleString('en-IN')}</strong>
                </span>
                <span style={{ fontSize: '0.76rem', color: forecast.isDeficitClosed ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
                  {forecast.isDeficitClosed
                    ? '✓ Sufficient to clear ₹20,000 deficit and leave surplus'
                    : '⚠️ Insufficient collections! Must target at least ₹20,000'}
                </span>
              </div>
            </div>
          </div>
        </TaskCard>

        {/* TASK 03: Manage the Dispute */}
        <TaskCard
          taskId="S12-T03"
          taskNumber="TASK 03"
          title="Manage the Dispute"
          instruction="Isolate the ₹5,000 billing query without issuing credit notes and request undisputed settlement."
          learningTakeaway="Separate disputed line items immediately while collecting undisputed invoice balances without delay."
          whyMatters="When a customer queries an invoice item, never hold up the entire invoice. Quarantining the disputed portion while demanding immediate payment of the undisputed balance preserves operating cash flow and establishes clear commercial evidence."
          statusText={`Dispute Isolated: ₹5,000 · Undisputed: ₹15,000 (${disputeWords} words)`}
          isActive={activeTaskId === 'S12-T03'}
          onSelectTask={() => setActiveTaskId('S12-T03')}
        >
          {/* Beacon Dispute Email */}
          <div className="vcep-clean-rules-card" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="vcep-eyebrow">DISPUTE SETTLEMENT PROTOCOL</span>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#17245C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={16} color="#0F766E" /> Beacon Dispute Settlement Message
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {disputeWords} words
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 10px' }}>
              Isolate the ₹5,000 dispute while demanding immediate remittance of the undisputed ₹15,000 by 2 November.
            </p>
            <textarea
              rows={8}
              value={state.beaconDisputeMessage}
              onChange={(e) => updateState((prev) => ({ ...prev, beaconDisputeMessage: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                lineHeight: 1.45,
              }}
            />
          </div>
        </TaskCard>

        {/* TASK 04: Plan Collections */}
        <TaskCard
          taskId="S12-T04"
          taskNumber="TASK 04"
          title="Plan Collections"
          instruction="Prioritise debtor collections, draft urgent payment escalation reminders, and complete portfolio review."
          learningTakeaway="Systematic collection escalations protect operating cash flow and preserve commercial relationships."
          whyMatters="Older debts carry exponentially higher default risks. Emergency cash recovery must prioritize high-probability fresh accounts while formally escalating severely overdue balances before placing accounts on credit hold."
          statusText={`Overdue Notice (${reminderWords} words) · ${state.governance.fileVersion}`}
          isActive={activeTaskId === 'S12-T04'}
          onSelectTask={() => setActiveTaskId('S12-T04')}
        >
          {/* Tactical Collection Priority Queue */}
          <div className="vcep-clean-rules-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="vcep-eyebrow">OPERATIONAL WORKFLOW</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Tactical Collection Priority Queue
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 700 }}>
                Ranked by Recovery Probability
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {CASE_F_INVOICES.map((inv) => (
                <div
                  key={inv.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    borderLeft: `4px solid ${
                      inv.defaultPriority.includes('Priority 1')
                        ? '#15803d'
                        : inv.defaultPriority.includes('Priority 2')
                        ? '#0F766E'
                        : inv.defaultPriority.includes('Priority 3')
                        ? '#E5AF2E'
                        : '#b91c1c'
                    }`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: inv.defaultPriority.includes('Priority 1')
                          ? '#15803d'
                          : inv.defaultPriority.includes('Priority 2')
                          ? '#0F766E'
                          : inv.defaultPriority.includes('Priority 3')
                          ? '#b45309'
                          : '#b91c1c',
                      }}
                    >
                      {inv.defaultPriority.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#17245C' }}>
                      ₹{inv.outstandingINR.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.92rem', color: '#17245C' }}>{inv.customer}</strong>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>
                    {inv.tacticalAction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cedar / Delta Payment Reminder */}
          <div className="vcep-clean-rules-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#17245C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#E5AF2E" /> Overdue Debt Escalation Notice
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {reminderWords} words
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 10px' }}>
              Formal escalation notice for Cedar (Invoice F03, 45 days overdue, ₹30,000) requesting immediate transfer.
            </p>
            <textarea
              rows={8}
              value={state.overdueReminderMessage}
              onChange={(e) => updateState((prev) => ({ ...prev, overdueReminderMessage: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                fontFamily: 'inherit',
                lineHeight: 1.45,
              }}
            />
          </div>

          {/* Portfolio Handover, Rubric & Formative Review */}
          <div className="vcep-clean-rules-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="vcep-eyebrow">PORTFOLIO HANDOVER &amp; RUBRIC GOVERNANCE</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Session 12 Deliverable Submission &amp; Verification
                </h4>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleRunReview}
                  style={{
                    background: '#17245C',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles size={14} /> Run Formative Review
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    background: '#ffffff',
                    color: '#64748B',
                    border: '1px solid #cbd5e1',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '18px', background: '#F8FAFC', padding: '14px', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Deliverable File Name:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#17245C', fontFamily: 'monospace' }}>
                  {state.governance.fileVersion}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Credit Analyst:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
                  {state.governance.creditAnalyst}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Treasury Lead:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
                  {state.governance.treasuryLead}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Decision Owner:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
                  {state.governance.decisionOwner}
                </div>
              </div>
            </div>

            {/* Interactive Checklist */}
            <div style={{ marginBottom: '18px' }}>
              <h5 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#17245C' }}>
                Credit Control &amp; Cash Planning Checklist:
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                {S12_CHECKLIST.map((item, idx) => {
                  const isChecked = state.checkedIndices.includes(idx);
                  return (
                    <label
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '0.78rem',
                        color: isChecked ? '#17245C' : '#64748B',
                        background: isChecked ? '#F0FDFA' : '#ffffff',
                        border: isChecked ? '1px solid #99F6E4' : '1px solid #e2e8f0',
                        padding: '10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCheck(idx)}
                        style={{ accentColor: '#0F766E', marginTop: '2px' }}
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 10-Point Rubric Breakdown */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>
                Authorized 10-Point Formative Rubric
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '8px' }}>
                {S12_RUBRIC.map((r, i) => (
                  <div key={i} style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.82rem', color: '#17245C' }}>{r.name}</strong>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F766E' }}>{r.points} Marks</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35 }}>{r.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TaskCard>
      </div>

      {/* Review Report Drawer / Modal */}
      {reviewReport && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="vcep-eyebrow">AUTOMATIC FORMATIVE EVALUATOR</span>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', color: '#17245C' }}>
                  Session 12 Receivables &amp; Working Capital Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewReport(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: reviewReport.hasErrors ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${reviewReport.hasErrors ? '#fecaca' : '#bbf7d0'}`,
                marginBottom: '16px',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: reviewReport.hasErrors ? '#b91c1c' : '#15803d' }}>
                Status: {reviewReport.overallStatus.toUpperCase()} ({reviewReport.passedChecks} of {reviewReport.totalChecks} Checks Passed)
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: reviewReport.hasErrors ? '#7f1d1d' : '#14532d' }}>
                {reviewReport.overallSummary}
              </p>
            </div>

            {/* Stage Checklists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {Object.entries(reviewReport.stages).map(([stageName, stageData]) => (
                <div key={stageName} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#17245C' }}>{stageName} · {stageData.title}</strong>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: stageData.status === 'reviewed' ? '#dcfce7' : '#fee2e2',
                        color: stageData.status === 'reviewed' ? '#15803d' : '#b91c1c',
                        fontWeight: 700,
                      }}
                    >
                      {stageData.passedCount} / {stageData.totalCount} Passed
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {stageData.checks.map((chk) => (
                      <div
                        key={chk.id}
                        style={{
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px',
                          color: chk.passed ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {chk.passed ? <CheckCircle2 size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> : <AlertTriangle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />}
                        <div>
                          <strong>{chk.title}:</strong> {chk.description}
                          {chk.studentValue && (
                            <span style={{ display: 'block', color: '#64748B', fontSize: '0.72rem' }}>
                              Recorded: {chk.studentValue}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setReviewReport(null)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: '#17245C',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Close Evaluation Report
            </button>
          </div>
        </div>
      )}

      {/* Sticky Footer Navigation Bar */}
      <footer
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 20,
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '12px 16px',
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.03)',
          borderRadius: '0 0 16px 16px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            const prevIdx = Math.max(0, currentStepIdx - 1);
            setActiveTaskId(WIZARD_STEPS[prevIdx].id);
          }}
          disabled={currentStepIdx === 0}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: currentStepIdx === 0 ? '#f1f5f9' : '#ffffff',
            color: currentStepIdx === 0 ? '#94a3b8' : '#334155',
            fontSize: '13px',
            fontWeight: 600,
            cursor: currentStepIdx === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          &larr; Previous
        </button>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
          Step {currentStepIdx + 1} of {WIZARD_STEPS.length}
        </div>
        <button
          type="button"
          onClick={() => {
            if (currentStepIdx < WIZARD_STEPS.length - 1) {
              setActiveTaskId(WIZARD_STEPS[currentStepIdx + 1].id);
            }
          }}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            background: '#0f766e',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Working Capital Plan Complete ✓' : 'Save & Continue →'}
        </button>
      </footer>
    </div>
  );
}
