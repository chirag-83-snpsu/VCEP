'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CASE_F_INVOICES_V1_V2,
  V1_BASELINE_METRICS,
  V2_APPROVED_METRICS,
  calculateDaysOverdue,
  classifyAgeingBucket,
  DEFAULT_SESSION_20_STATE,
  loadSession20State,
  setStoredSession20State,
  S20_RUBRIC,
  INITIAL_CHECKLIST_LABELS,
  type Session20State,
  type ChangeRequestEntry,
  type RegressionTestRecord,
} from './session-20-change-data';
import {
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertTriangle,
  Info,
  Layers,
  Lock,
  Unlock,
  Target,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface TaskCardProps {
  taskId: string;
  taskNumber: string;
  title: string;
  instruction: string;
  whyMatters?: string;
  statusText?: string;
  persistenceText?: string;
  outputBadge?: string;
  isActive?: boolean;
  onSelect?: () => void;
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
  whyMatters,
  statusText,
  persistenceText,
  outputBadge,
  isActive,
  onSelect,
  onSelectTask,
  children,
}: TaskCardProps) {
  const [whyOpen, setWhyOpen] = useState(false);
  const resolvedStatus = statusText || persistenceText || 'State Preserved';
  const handleSelect = onSelect || onSelectTask;

  return (
    <article
      id={taskId.toLowerCase()}
      data-task-id={taskId}
      onClick={handleSelect}
      tabIndex={0}
      aria-label={`${taskNumber}: ${title}`}
      style={{
        background: '#ffffff',
        border: '1px solid #DCE5E9',
        borderLeft: isActive ? '3px solid #0F766E' : '1px solid #DCE5E9',
        borderRadius: '16px',
        padding: 'clamp(18px, 2.5vw, 24px)',
        marginBottom: '28px',
        boxShadow: isActive ? '0 4px 16px rgba(15, 118, 110, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        outline: 'none',
      }}
    >
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
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>·</span>
            <span
              style={{
                fontSize: '11px',
                color: '#64748B',
                fontFamily: 'monospace',
                background: '#F1F5F9',
                padding: '1px 6px',
                borderRadius: '4px',
              }}
            >
              Ref: {taskId}
            </span>
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: 'clamp(16px, 1.5vw, 18px)',
              fontWeight: 700,
              color: '#17245C',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {outputBadge && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#F8FAFC',
                color: '#334155',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '3px 10px',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              <Target size={12} color="#0F766E" />
              <span>{outputBadge}</span>
            </span>
          )}
          {resolvedStatus && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#F0FDFA',
                color: '#0F766E',
                border: '1px solid #99F6E4',
                borderRadius: '20px',
                padding: '3px 10px',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={13} />
              <span>{resolvedStatus}</span>
            </div>
          )}
        </div>
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
            <span>{whyOpen ? 'Hide operational rationale' : 'Why this matters'}</span>
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

interface Session20ChangeJourneyProps {
  onUpdateDraft?: (key: string, value: string) => void;
}

export function Session20ChangeJourney({ onUpdateDraft }: Session20ChangeJourneyProps) {
  const [state, setState] = useState<Session20State>(DEFAULT_SESSION_20_STATE);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');
  const [activeTaskId, setActiveTaskId] = useState<string>('S20-T01');

  useEffect(() => {
    const loaded = loadSession20State();
    setState(loaded);
    if (loaded.timestamp) setDraftTimestamp(loaded.timestamp);
  }, []);

  const saveState = (updated: Session20State) => {
    const timestamp = new Date().toLocaleTimeString();
    const withTimestamp = { ...updated, timestamp };
    setState(withTimestamp);
    setDraftTimestamp(timestamp);
    setStoredSession20State(withTimestamp);

    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', updated.versionDefense);
      onUpdateDraft('work-prompt:0', updated.regressionTests.map(t => `${t.id}: ${t.verdict}`).join(', '));
      onUpdateDraft('work-prompt:1', updated.executiveMemo);
      onUpdateDraft('team:contribution', updated.studentContribution);
      onUpdateDraft('team:judgement', updated.reviewerCorrection);
      onUpdateDraft('executive:memo', updated.executiveMemo);
    }
  };

  const isV2 = state.activeVersion === 'v2.0';

  const handleToggleVersion = (version: 'v1.0' | 'v2.0') => {
    saveState({ ...state, activeVersion: version });
  };

  const handleSetAsOfDate = (newDate: string) => {
    saveState({ ...state, asOfDate: newDate });
  };

  const handleToggleDuplicateSimulation = () => {
    saveState({ ...state, simulatedDuplicate: !state.simulatedDuplicate });
  };

  const handleToggleBlankSimulation = () => {
    saveState({ ...state, simulatedBlank: !state.simulatedBlank });
  };

  const handleToggleTestVerdict = (testId: string) => {
    const updated = state.regressionTests.map((t) =>
      t.id === testId ? { ...t, verdict: (t.verdict === 'PASS' ? 'FAIL' : 'PASS') as 'PASS' | 'FAIL' } : t
    );
    saveState({ ...state, regressionTests: updated });
  };

  const handleToggleChecklist = (index: number) => {
    const next = [...state.checklist];
    next[index] = !next[index];
    saveState({ ...state, checklist: next });
  };

  const handleReset = () => {
    saveState({ ...DEFAULT_SESSION_20_STATE, timestamp: new Date().toLocaleTimeString() });
  };

  // Recomputed Model Schedule for active version & as-of date
  const processedSchedule = useMemo(() => {
    return CASE_F_INVOICES_V1_V2.map((inv) => {
      const grossAmount = isV2 ? inv.v2AmountInr : inv.v1AmountInr;
      const creditNote = isV2 ? inv.creditNoteInr : 0;
      const daysOverdue = calculateDaysOverdue(inv.dueDate, state.asOfDate);
      const bucket = classifyAgeingBucket(daysOverdue);
      return {
        ...inv,
        grossAmount,
        creditNote,
        daysOverdue,
        bucket,
      };
    });
  }, [isV2, state.asOfDate]);

  // Bucket totals calculation
  interface BucketTotals {
    Current: number;
    '1-30 Days': number;
    '31-60 Days': number;
    '61-90 Days': number;
    totalSum: number;
    variance: number;
    expectedControl: number;
  }

  const bucketTotals: BucketTotals = useMemo(() => {
    const totals: Record<string, number> = {
      Current: 0,
      '1-30 Days': 0,
      '31-60 Days': 0,
      '61-90 Days': 0,
    };
    processedSchedule.forEach((item) => {
      totals[item.bucket] = (totals[item.bucket] || 0) + item.grossAmount;
    });
    const totalSum =
      (totals['Current'] || 0) +
      (totals['1-30 Days'] || 0) +
      (totals['31-60 Days'] || 0) +
      (totals['61-90 Days'] || 0);
    const expectedControl = isV2 ? 95000 : 100000;
    const variance = totalSum - expectedControl;
    return {
      Current: totals['Current'] || 0,
      '1-30 Days': totals['1-30 Days'] || 0,
      '31-60 Days': totals['31-60 Days'] || 0,
      '61-90 Days': totals['61-90 Days'] || 0,
      totalSum,
      variance,
      expectedControl,
    };
  }, [processedSchedule, isV2]);

  // Cash gap calculation
  const cashMetrics = useMemo(() => {
    const bankCash = 25000; // Strictly Invariant! Zero cash collected
    const sevenDayOutflows = isV2 ? 37000 : 45000;
    const cashDeficit = sevenDayOutflows - bankCash; // 20k in v1, 12k in v2
    const totalReceivables = isV2 ? 95000 : 100000;
    return { bankCash, sevenDayOutflows, cashDeficit, totalReceivables };
  }, [isV2]);

  // Executive Memo validation
  const memoWords = state.executiveMemo.trim().split(/\s+/).filter(Boolean);
  const memoWordCount = memoWords.length;
  const isMemoValid = memoWordCount >= 70 && memoWordCount <= 140;

  // Version defense word count
  const defenseWords = state.versionDefense.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="vcep-workstation-root" style={{ color: '#17245C' }}>
      {/* ============================================================== */}
      {/* NATURAL HEADING 1: REVIEW THE APPROVED CHANGE                  */}
      {/* ============================================================== */}
      <section id="vcep-area-review" className="vcep-workstation-section" style={{ marginBottom: '32px' }}>
        <div className="vcep-section-title-wrap" style={{ marginBottom: '16px' }}>
          <span className="vcep-eyebrow" style={{ color: '#0F766E', fontWeight: 700, letterSpacing: '0.05em' }}>
            HEADING 1 · MANAGEMENT REVIEW & CHANGE CONTROL BOARD
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#17245C', margin: '4px 0 8px', fontWeight: 800 }}>
            1. Review the Approved Change
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            Control the Change. Keep the Evidence. Compare baseline Model v1.0 against approved change orders,
            document Change Control Board authority and reasons, verify the accounting distinction between credit notes and cash receipts,
            and defend version discipline.
          </p>
        </div>

        {/* Change Principles Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #17245C',
              borderRadius: '8px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <DollarSign size={16} color="#17245C" />
              <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>Credit Note $\ne$ Cash Receipt</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
              A credit note reduces accounts receivable; it injects <strong>zero bank cash</strong>.
              Opening bank cash remains strictly invariant at <strong>₹25,000</strong>.
            </p>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #0F766E',
              borderRadius: '8px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Clock size={16} color="#0F766E" />
              <strong style={{ fontSize: '0.85rem', color: '#0F766E' }}>Payment Deferral $\ne$ Expense Cancellation</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
              Rescheduling an ₹8,000 supplier payment modifies <strong>7-day cash flow timing only</strong>.
              Total vendor liabilities and historical operating expenses remain unaltered.
            </p>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #E5AF2E',
              borderRadius: '8px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <GitBranch size={16} color="#B45309" />
              <strong style={{ fontSize: '0.85rem', color: '#B45309' }}>Version Discipline (v1.0 vs v2.0)</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
              Never overwrite or delete Model v1.0. Model v1.0 is preserved as the frozen baseline against which
              management proves all variance and audit trails.
            </p>
          </div>
        </div>

        {/* TASK 01: REVIEW THE CHANGE REQUEST */}
        <TaskCard
          taskId="S20-T01"
          taskNumber="TASK 01"
          title="Review the Change Request"
          instruction="Review the Change Control Board (CCB) approved change orders, identify affected financial outputs, and defend baseline Version 1.0 preservation against client pushback."
          whyMatters="Change governance ensures every modification to financial records has documented business justification and named authority. Retaining Version 1.0 as an immutable baseline is essential for regulatory auditability and proving why cash variances occur without confusion."
          outputBadge="Approved CCB Register + Version Defense"
          statusText="2 Change Orders Approved · CCB Active"
          isActive={activeTaskId === 'S20-T01'}
          onSelectTask={() => setActiveTaskId('S20-T01')}
        >
          {/* Sub-section: Change Control Board (CCB) Approved Order Register Table */}
          <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#17245C', margin: '0 0 12px', fontWeight: 700 }}>
              Change Control Board (CCB) Approved Order Register
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', background: '#ffffff', borderRadius: '6px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C', width: '80px' }}>Order ID</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C', width: '130px' }}>Type</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C', width: '170px' }}>Approving Authority</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Business Reason</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Ledger Impact</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C', width: '160px' }}>Cash Impact</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C', width: '110px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {state.changeRequests.map((cr) => (
                    <tr key={cr.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#17245C' }}>{cr.id}</td>
                      <td style={{ padding: '10px', fontWeight: 600, color: '#0F766E' }}>{cr.changeType}</td>
                      <td style={{ padding: '10px', color: '#334155' }}>{cr.authority}</td>
                      <td style={{ padding: '10px', color: '#475569' }}>{cr.reason}</td>
                      <td style={{ padding: '10px', color: '#334155', fontWeight: 500 }}>{cr.ledgerImpact}</td>
                      <td style={{ padding: '10px', color: cr.changeType === 'Credit Note' ? '#b91c1c' : '#15803d', fontWeight: 600 }}>
                        {cr.cashImpact}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span
                          style={{
                            background: '#f0fdf4',
                            color: '#15803d',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          {cr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-section: Client Pushback Defense */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={18} color="#B45309" />
              <h4 style={{ fontSize: '0.95rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                Client Scenario Simulation: Defense of Version 1 Baseline
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 10px', lineHeight: 1.4 }}>
              <em>The client requests that you completely overwrite or delete Model v1.0 to avoid operational confusion.</em>{' '}
              Explain corporate version control discipline and why Model v1.0 must remain permanently archived as the baseline.
            </p>
            <textarea
              rows={4}
              value={state.versionDefense}
              onChange={(e) => saveState({ ...state, versionDefense: e.target.value })}
              placeholder="Explain why Version 1.0 must be preserved rather than deleted..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                lineHeight: 1.45,
                fontFamily: 'inherit',
                color: '#1e293b',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: '#64748b' }}>
              <span>Must defend baseline auditability and refusal to delete Model v1.0.</span>
              <span>{defenseWords} words</span>
            </div>
          </div>
        </TaskCard>

        {/* TASK 02: APPLY VERSION 2 CHANGES */}
        <TaskCard
          taskId="S20-T02"
          taskNumber="TASK 02"
          title="Apply Version 2 Changes"
          instruction="Implement the approved ₹5,000 Beacon Retail credit note in the receivables schedule and reflect the ₹8,000 supplier payment deferral in 7-day liquidity forecasts."
          whyMatters="Applying approved credit notes directly extinguishes disputed debtor balances while leaving bank cash strictly invariant. Rescheduling supplier outflows modifies short-term liquidity timing to compress working capital deficits without altering overall liabilities."
          outputBadge="Version 2.0 Change Branch + Delta Metrics"
          statusText="Model v2.0 Applied · Zero Cash Added"
          isActive={activeTaskId === 'S20-T02'}
          onSelectTask={() => setActiveTaskId('S20-T02')}
        >
          {/* Sub-section: Side-by-Side Version 1 vs Version 2 Metric Delta Cards */}
          <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                Side-by-Side Version 1 vs Version 2 Metric Delta
              </h4>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                As-of Date: <strong>31 October 2026</strong> · Approved Case Release
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              {/* Metric 1: Total Receivables */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Total Receivables
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17245C' }}>₹95,000</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', textDecoration: 'line-through' }}>₹1,00,000</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 600 }}>
                  -₹5,000 (Beacon F02 Credit Note)
                </span>
              </div>

              {/* Metric 2: Beacon F02 Gross */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Beacon F02 Balance
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17245C' }}>₹15,000</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', textDecoration: 'line-through' }}>₹20,000</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 600 }}>
                  ₹5k Suspense Dispute Resolved
                </span>
              </div>

              {/* Metric 3: Bank Cash */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>
                  Bank Cash (Invariant)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>₹25,000</span>
                  <span style={{ fontSize: '0.78rem', color: '#15803d' }}>v1 === v2</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>
                  ✓ Zero Cash Collected from Credit Note
                </span>
              </div>

              {/* Metric 4: 7-Day Outflows */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  7-Day Mandatory Outflows
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17245C' }}>₹37,000</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', textDecoration: 'line-through' }}>₹45,000</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 600 }}>
                  -₹8,000 (Supplier Payment Deferral)
                </span>
              </div>

              {/* Metric 5: Net Cash Deficit */}
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                  7-Day Net Cash Deficit
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b91c1c' }}>-₹12,000</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', textDecoration: 'line-through' }}>-₹20,000</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                  +₹8,000 Improvement (Deficit Shrunk)
                </span>
              </div>
            </div>
          </div>

          {/* Sub-section: Active Model Branch Switcher */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Active Model Branch Switcher
            </span>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => handleToggleVersion('v1.0')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid #cbd5e1',
                  background: !isV2 ? '#17245C' : '#ffffff',
                  color: !isV2 ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease',
                }}
              >
                Model v1.0 (Frozen Baseline)
              </button>
              <button
                type="button"
                onClick={() => handleToggleVersion('v2.0')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid #0F766E',
                  background: isV2 ? '#0F766E' : '#ffffff',
                  color: isV2 ? '#ffffff' : '#0F766E',
                  transition: 'all 0.15s ease',
                }}
              >
                Model v2.0 (Approved Changes)
              </button>
              <span style={{ fontSize: '0.78rem', color: isV2 ? '#0F766E' : '#475569', fontWeight: 600 }}>
                {isV2
                  ? '✓ Version 2 active: ₹5,000 credit note and ₹8,000 deferral applied; control total is ₹95,000.'
                  : '🔒 Version 1 baseline active: ₹1,00,000 total with ₹5,000 Beacon dispute in suspense.'}
              </span>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* ============================================================== */}
      {/* NATURAL HEADING 2: UPDATE & RETEST THE MODEL                   */}
      {/* ============================================================== */}
      <section id="vcep-area-update" className="vcep-workstation-section" style={{ marginBottom: '32px' }}>
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow" style={{ color: '#0F766E', fontWeight: 700, letterSpacing: '0.05em' }}>
            HEADING 2 · VERSION 2 RECALCULATION & 5-TEST REGRESSION AUDIT
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#17245C', margin: '4px 0 8px', fontWeight: 800 }}>
            2. Update & Retest the Model
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            Regenerate total receivables, affected ageing buckets, and the 7-day cash forecast. Re-execute the five
            acceptance tests as formal regression controls, and draft an executive briefing update detailing the reduced deficit.
          </p>
        </div>

        {/* TASK 03: RECALCULATE AND RETEST */}
        <TaskCard
          taskNumber="03"
          taskId="S20-T03"
          title="Recalculate and Retest"
          outputBadge="Updated Totals & Regression Register"
          persistenceText="Calculated & Verified"
          whyMatters="Under strict change control, modifying inputs requires proving that core formulas and validation gates still function identically. Recalculating receivables across age buckets and re-running all 5 regression tests ensures the model remains mathematically sound and resilient against bad data before management sign-off."
          instruction="Recalculate receivables across ageing buckets, test the date shift invariant, verify automated exception halts, and execute the five regression tests."
          isActive={activeTaskId === 'S20-T03'}
          onSelect={() => setActiveTaskId('S20-T03')}
        >
          {/* Model Version & Date Parameter Controls */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '16px',
            margin: '20px 0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Active Model Branch
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleToggleVersion('v1.0')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid #cbd5e1',
                  background: !isV2 ? '#17245C' : '#ffffff',
                  color: !isV2 ? '#ffffff' : '#475569',
                }}
              >
                Model v1.0 (Frozen Baseline)
              </button>
              <button
                type="button"
                onClick={() => handleToggleVersion('v2.0')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid #0F766E',
                  background: isV2 ? '#0F766E' : '#ffffff',
                  color: isV2 ? '#ffffff' : '#0F766E',
                }}
              >
                Model v2.0 (Approved Changes)
              </button>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Calculation Date Parameter ($B$1)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleSetAsOfDate('2026-10-31')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid #cbd5e1',
                  background: state.asOfDate === '2026-10-31' ? '#17245C' : '#ffffff',
                  color: state.asOfDate === '2026-10-31' ? '#ffffff' : '#475569',
                }}
              >
                31 Oct 2026 (Baseline)
              </button>
              <button
                type="button"
                onClick={() => handleSetAsOfDate('2026-11-01')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid #cbd5e1',
                  background: state.asOfDate === '2026-11-01' ? '#0F766E' : '#ffffff',
                  color: state.asOfDate === '2026-11-01' ? '#ffffff' : '#475569',
                }}
              >
                01 Nov 2026 (+1 Day Shift)
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Reconciled Model Total
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#17245C' }}>
              ₹{bucketTotals.totalSum.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
              Zero Variance (diff = ₹{bucketTotals.variance}) ✓
            </span>
          </div>
        </div>

        {/* Dynamic Ageing Buckets Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>CURRENT (0 DAYS)</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17245C', margin: '4px 0' }}>
              ₹{bucketTotals.Current.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#475569' }}>
              {state.asOfDate === '2026-10-31' ? 'F01 Asha (Due Today)' : 'None (F01 shifted to 1–30d)'}
            </span>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>1–30 DAYS OVERDUE</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F766E', margin: '4px 0' }}>
              ₹{bucketTotals['1-30 Days'].toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#475569' }}>
              {isV2 ? 'F02 Beacon (₹15,000)' : 'F02 Beacon (₹20,000)'}
            </span>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>31–60 DAYS OVERDUE</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17245C', margin: '4px 0' }}>
              ₹{bucketTotals['31-60 Days'].toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#475569' }}>F03 Cedar Mobility (₹30,000)</span>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>61–90 DAYS OVERDUE</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17245C', margin: '4px 0' }}>
              ₹{bucketTotals['61-90 Days'].toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#475569' }}>F04 Delta Foods (₹40,000)</span>
          </div>
        </div>

        {/* Dynamic Receivables Schedule Table */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: '0 0 12px', fontWeight: 700 }}>
            Receivables Schedule ({state.activeVersion} · As-Of {state.asOfDate})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>ID</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Customer</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Due Date</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Days Overdue</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Ageing Bucket</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>v1 Amount</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Credit Note</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Net Gross INR</th>
                </tr>
              </thead>
              <tbody>
                {processedSchedule.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0', background: row.id === 'F02' && isV2 ? '#f0fdf4' : undefined }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>{row.id}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#334155' }}>{row.customer}</td>
                    <td style={{ padding: '8px 10px', color: '#475569' }}>{row.dueDate}</td>
                    <td style={{ padding: '8px 10px', color: '#475569' }}>{row.daysOverdue} days</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span
                        style={{
                          background: row.bucket === 'Current' ? '#dcfce7' : '#f1f5f9',
                          color: row.bucket === 'Current' ? '#15803d' : '#334155',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        {row.bucket}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', color: '#64748b' }}>₹{row.v1AmountInr.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '8px 10px', color: row.creditNote > 0 ? '#b91c1c' : '#94a3b8', fontWeight: row.creditNote > 0 ? 700 : 400 }}>
                      {row.creditNote > 0 ? `-₹${row.creditNote.toLocaleString('en-IN')}` : '₹0'}
                    </td>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>
                      ₹{row.grossAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
                <tr style={{ background: '#f8fafc', fontWeight: 800, borderTop: '2px solid #cbd5e1' }}>
                  <td colSpan={5} style={{ padding: '10px' }}>
                    Reconciled Model Totals:
                  </td>
                  <td style={{ padding: '10px', color: '#64748b' }}>₹1,00,000</td>
                  <td style={{ padding: '10px', color: isV2 ? '#b91c1c' : '#94a3b8' }}>{isV2 ? '-₹5,000' : '₹0'}</td>
                  <td style={{ padding: '10px', color: '#17245C', fontSize: '0.9rem' }}>
                    ₹{bucketTotals.totalSum.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Defensive Exception Simulator for Version 2 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: '0 0 8px', fontWeight: 700 }}>
            Edge-Case & Invariant Exception Simulator (v2.0)
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 14px' }}>
            Verify that technical controls established in Session 19 continue to halt processing upon bad data injection.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div
              style={{
                background: state.simulatedDuplicate ? '#fff1f2' : '#f8fafc',
                border: `1.5px solid ${state.simulatedDuplicate ? '#f87171' : '#cbd5e1'}`,
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>Regression Test 4: Duplicate ID</strong>
                <button
                  type="button"
                  onClick={handleToggleDuplicateSimulation}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: state.simulatedDuplicate ? '#b91c1c' : '#ffffff',
                    color: state.simulatedDuplicate ? '#ffffff' : '#475569',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  {state.simulatedDuplicate ? 'CLEAR INJECTION' : 'INJECT DUPLICATE F02'}
                </button>
              </div>
              {state.simulatedDuplicate ? (
                <div style={{ background: '#fee2e2', padding: '8px 10px', borderRadius: '5px', fontSize: '0.75rem', color: '#991b1b', fontWeight: 600 }}>
                  ⚠️ STOP CONDITION TRIGGERED: Duplicate invoice ID 'F02' detected! Ingestion halted. Version 2 total protected from double-counting.
                </div>
              ) : (
                <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
                  ✓ Ingestion rule <code>=COUNTIF($A$2:$A$5, A2) &gt; 1</code> active and ready.
                </div>
              )}
            </div>

            <div
              style={{
                background: state.simulatedBlank ? '#fffbeb' : '#f8fafc',
                border: `1.5px solid ${state.simulatedBlank ? '#fcd34d' : '#cbd5e1'}`,
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>Regression Test 5: Blank Amount Cell</strong>
                <button
                  type="button"
                  onClick={handleToggleBlankSimulation}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: state.simulatedBlank ? '#b45309' : '#ffffff',
                    color: state.simulatedBlank ? '#ffffff' : '#475569',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  {state.simulatedBlank ? 'CLEAR INJECTION' : 'INJECT BLANK AMOUNT'}
                </button>
              </div>
              {state.simulatedBlank ? (
                <div style={{ background: '#fef3c7', padding: '8px 10px', borderRadius: '5px', fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>
                  ⚠️ DATA AUDIT EXCEPTION: Blank amount cell in F03! Calculation paused. Manual verification required.
                </div>
              ) : (
                <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
                  ✓ Missing value guard `=IF(ISBLANK(D3), "ERROR", ...)` active.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Five Regression & Acceptance Tests Register */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                Five Executed Regression Tests Register (v2.0)
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                All five approved test categories from Session 18 & 19 re-executed under Version 2.0 with objective evidence.
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
              {state.regressionTests.filter((t) => t.verdict === 'PASS').length} / {state.regressionTests.length} Tests Verified PASS
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C', width: '70px' }}>ID</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C', width: '110px' }}>Category</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C', width: '180px' }}>Test Name</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Test Input</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Expected Result</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Demonstrated Actual Output</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C', width: '80px', textAlign: 'center' }}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {state.regressionTests.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>{t.id}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0F766E' }}>{t.category}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#1e293b' }}>{t.name}</td>
                    <td style={{ padding: '8px 10px', color: '#475569' }}>{t.testInput}</td>
                    <td style={{ padding: '8px 10px', color: '#475569' }}>{t.expectedResult}</td>
                    <td style={{ padding: '8px 10px', color: '#334155', fontWeight: 500 }}>{t.actualDemonstrated}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleTestVerdict(t.id)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: t.verdict === 'PASS' ? '#dcfce7' : '#fee2e2',
                          color: t.verdict === 'PASS' ? '#15803d' : '#991b1b',
                          border: `1px solid ${t.verdict === 'PASS' ? '#86efac' : '#fca5a5'}`,
                        }}
                      >
                        {t.verdict}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </TaskCard>

        {/* TASK 04: ISSUE THE MANAGER UPDATE */}
        <TaskCard
          taskNumber="04"
          taskId="S20-T04"
          title="Issue the Manager Update"
          outputBadge="Executive Memo & Change Sign-Off"
          persistenceText="Auto-saved"
          whyMatters="Executive decisions depend on unvarnished transparency regarding financial liquidity. Communicating the ₹8,000 operational improvement alongside the persistent ₹12,000 cash deficit, individual contributions, and verified peer defect corrections establishes complete auditability and governance."
          instruction="Draft an executive update memo (70–140 words), document individual contribution and peer defect resolution, execute CCB governance sign-offs, and complete the final verification checklist."
          isActive={activeTaskId === 'S20-T04'}
          onSelect={() => setActiveTaskId('S20-T04')}
        >
          {/* Executive Manager Briefing Update */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
              Executive Manager Update & Remaining Uncertainty
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 700,
                background: isMemoValid ? '#dcfce7' : '#fee2e2',
                color: isMemoValid ? '#15803d' : '#b91c1c',
              }}
            >
              {memoWordCount} words (Target: 70–140 words)
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 10px', lineHeight: 1.4 }}>
            Draft a concise executive briefing to the Managing Director and Board detailing: the two approved changes, the non-cash
            nature of the credit note, the revised ₹12,000 cash deficit, and immediate debtor collection priorities (Asha F01).
          </p>
          <textarea
            rows={4}
            value={state.executiveMemo}
            onChange={(e) => saveState({ ...state, executiveMemo: e.target.value })}
            placeholder="Draft your executive management update..."
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
              lineHeight: 1.45,
              fontFamily: 'inherit',
              color: '#1e293b',
            }}
          />
        </div>

        {/* Individual Contribution & Peer Review Defect Correction */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#17245C', margin: '0 0 6px', fontWeight: 700 }}>
              My Specific Deliverable Contribution:
            </h3>
            <textarea
              rows={3}
              value={state.studentContribution}
              onChange={(e) => saveState({ ...state, studentContribution: e.target.value })}
              placeholder="Detail your personal contribution to Model v2.0 and change control..."
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                lineHeight: 1.4,
                fontFamily: 'inherit',
                color: '#1e293b',
              }}
            />
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', textAlign: 'right' }}>
              {state.studentContribution.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#17245C', margin: '0 0 6px', fontWeight: 700 }}>
              Peer Reviewer Correction (Before vs After):
            </h3>
            <textarea
              rows={3}
              value={state.reviewerCorrection}
              onChange={(e) => saveState({ ...state, reviewerCorrection: e.target.value })}
              placeholder="Document one authentic defect caught during peer review and resolved..."
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                lineHeight: 1.4,
                fontFamily: 'inherit',
                color: '#1e293b',
              }}
            />
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', textAlign: 'right' }}>
              {state.reviewerCorrection.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        </div>

        {/* Quality Assurance Sign-off & Deliverable Ownership */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: '0 0 14px', fontWeight: 700 }}>
            Change Control Governance & Quality Assurance Sign-off
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Preparer (Financial Controller):
              </label>
              <input
                type="text"
                value={state.governance.preparerName}
                onChange={(e) =>
                  saveState({
                    ...state,
                    governance: { ...state.governance, preparerName: e.target.value },
                  })
                }
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Reviewer (Quality Assurance Lead):
              </label>
              <input
                type="text"
                value={state.governance.reviewerName}
                onChange={(e) =>
                  saveState({
                    ...state,
                    governance: { ...state.governance, reviewerName: e.target.value },
                  })
                }
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Decision Owner (MD / Board Lead):
              </label>
              <input
                type="text"
                value={state.governance.decisionOwner}
                onChange={(e) =>
                  saveState({
                    ...state,
                    governance: { ...state.governance, decisionOwner: e.target.value },
                  })
                }
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                CCB Audit Status:
              </label>
              <select
                value={state.governance.auditStatus}
                onChange={(e) =>
                  saveState({
                    ...state,
                    governance: { ...state.governance, auditStatus: e.target.value },
                  })
                }
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#fff' }}
              >
                <option value="Verified PASS (Ready for Handover)">Verified PASS (Ready for Handover)</option>
                <option value="Conditional Approval">Conditional Approval</option>
                <option value="Under Review">Under Review</option>
                <option value="Draft Attempt">Draft Attempt</option>
              </select>
            </div>
          </div>

          {/* Pre-Submission Checklist */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#17245C', display: 'block', marginBottom: '8px' }}>
              Student Pre-Submission Verification Checklist:
            </span>
            <div style={{ display: 'grid', gap: '6px' }}>
              {INITIAL_CHECKLIST_LABELS.map((item, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={state.checklist[idx]}
                    onChange={() => handleToggleChecklist(idx)}
                    style={{ accentColor: '#0F766E' }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Deliverable File: <strong>{state.governance.fileVersion}</strong> · {draftTimestamp ? `Saved at ${draftTimestamp}` : 'Saved locally'}
            </span>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.75rem',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Reset Defaults
            </button>
          </div>
        </div>

        {/* Automatic Review Engine Rubric Card */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={22} color="#15803d" />
              <div>
                <strong style={{ fontSize: '1rem', color: '#15803d', display: 'block' }}>
                  Automatic Change Control Review: Model v2.0 Verified
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#166534' }}>
                  Model v2.0, ₹5k credit note, ₹8k deferral, 5 regression tests, and non-cash audit verified!
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>Estimated Rubric Score:</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>10 / 10 pts</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {S20_RUBRIC.map((r) => (
              <div key={r.name} style={{ background: '#ffffff', borderRadius: '6px', padding: '10px', border: '1px solid #dcfce7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#17245C' }}>{r.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>{r.points} pts</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', lineHeight: 1.35 }}>
                  {r.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>
        </TaskCard>
      </section>
    </div>
  );
}
