'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S09_STORAGE_KEY,
  CASE_D_MONTHLY_INPUTS,
  TARGET_MONTH_KPIS,
  GROWTH_BENCHMARKS,
  INITIAL_S09_STATE,
  S09_RUBRIC,
  S09_CHECKLIST,
  loadSession09State,
  saveSession09State,
  type Session09WorkstationState,
  type MonthMIS,
} from './session-09-performance-data.ts';
import { evaluateSession09 } from '../../../lib/review-engine/session-rules/session-09.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Scale,
  Sparkles,
  RotateCcw,
  CheckSquare,
  AlertOctagon,
  ShieldCheck,
  Calculator,
  ArrowRight,
  Eye,
  Info,
  Clock,
  Layers,
  BarChart3,
  Percent,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
} from 'lucide-react';

interface Session09PerformanceJourneyProps {
  onUpdateDraft?: (key: string, value: string) => void;
}

interface TaskCardProps {
  taskId: string;
  taskNumber: string;
  title: string;
  instruction: string;
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
            <span>{whyOpen ? 'Hide analysis principle' : 'Why this matters'}</span>
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

export function Session09PerformanceJourney({
  onUpdateDraft,
}: Session09PerformanceJourneyProps) {
  const [state, setState] = useState<Session09WorkstationState>(INITIAL_S09_STATE);
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string>('S09-T01');

  // Hydrate on mount
  useEffect(() => {
    const loaded = loadSession09State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', loaded.findings.join('\n\n'));
      onUpdateDraft('team:contribution', loaded.peerDefenseNote);
      onUpdateDraft('team:judgement', loaded.executiveBriefing);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session09WorkstationState) => Session09WorkstationState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession09State(next);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', next.findings.join('\n\n'));
        onUpdateDraft('team:contribution', next.peerDefenseNote);
        onUpdateDraft('team:judgement', next.executiveBriefing);
      }
      return next;
    });
  };

  const handleFindingChange = (index: number, value: string) => {
    updateState((prev) => {
      const updatedFindings = [...prev.findings] as [string, string, string];
      updatedFindings[index] = value;
      return { ...prev, findings: updatedFindings };
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

  const runReviewEvaluation = () => {
    const report = evaluateSession09({
      sessionId: 9,
      draft: {
        'concept:explain': state.findings.join('\n\n'),
        'team:contribution': state.peerDefenseNote,
        'team:judgement': state.executiveBriefing,
      },
      workstationData: {
        userKpis: state.userKpis,
        findings: state.findings,
        uncertainty: state.uncertainty,
        investigation: state.investigation,
        executiveBriefing: state.executiveBriefing,
        peerDefenseNote: state.peerDefenseNote,
      },
    });
    setReviewReport(report);
  };

  const handleResetToApproved = () => {
    if (confirm('Reset Session 09 to approved Case D baseline data?')) {
      try {
        localStorage.removeItem(S09_STORAGE_KEY);
      } catch {}
      setState(INITIAL_S09_STATE);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', INITIAL_S09_STATE.findings.join('\n\n'));
        onUpdateDraft('team:contribution', INITIAL_S09_STATE.peerDefenseNote);
        onUpdateDraft('team:judgement', INITIAL_S09_STATE.executiveBriefing);
      }
    }
  };

  // Quick Derived Metrics
  const july = CASE_D_MONTHLY_INPUTS[0];
  const august = CASE_D_MONTHLY_INPUTS[1];
  const september = CASE_D_MONTHLY_INPUTS[2];

  const countWords = (s: string) => (s ? s.trim().split(/\s+/).filter(Boolean).length : 0);

  return (
    <div className="vcep-session-clean-journey">
      {/* =========================================================================
          HEADING 1: REVIEW THE BUSINESS PERFORMANCE (#vcep-area-performance)
         ========================================================================= */}
      <section id="vcep-area-performance" aria-labelledby="heading-area-performance" className="vcep-journey-stage-block">
        <div className="vcep-journey-section-header">
          <div className="vcep-journey-badge-row">
            <span className="vcep-pill-navy">WORK AREA 01</span>
            <span className="vcep-pill-teal">CASE D THREE-MONTH MIS</span>
            <span className="vcep-pill-gold">INTERACTIVE FINANCE MATRIX</span>
          </div>
          <h2 id="heading-area-performance" className="vcep-journey-title">
            1. Review the Business Performance
          </h2>
          <p className="vcep-journey-subtitle">
            Evaluate quarterly revenue expansion against direct cost inflation, margin compression, and mounting receivables. Challenge management&rsquo;s assumption that top-line growth proves business health.
          </p>
        </div>

        {/* TASK 01: Read the Financial Data (S09-T01) */}
        <TaskCard
          taskId="S09-T01"
          taskNumber="TASK 01"
          title="Read the Financial Data"
          instruction="Inspect Case D monthly MIS source inputs across July, August, and September with verified units (INR net of tax) and reporting periods."
          whyMatters="Reliable financial analysis begins with verified source records. Mixing separate cases (e.g. combining Case D with Case A) or misunderstanding tax status distorts all downstream executive metrics."
          statusText="Case D Verified (Net of Tax)"
          isActive={activeTaskId === 'S09-T01'}
          onSelectTask={() => setActiveTaskId('S09-T01')}
        >
          {/* Case D Monthly MIS Source Records Grid */}
          <div className="vcep-sheet-card" style={{ border: '1px solid rgba(23, 36, 92, 0.15)', borderRadius: '12px', background: '#ffffff', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ padding: '14px 18px', background: 'rgba(23, 36, 92, 0.04)', borderBottom: '1px solid rgba(23, 36, 92, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#17245C', textTransform: 'uppercase' }}>
                  SOURCE RECORD INPUTS
                </span>
                <h4 style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 700, color: '#17245C' }}>
                  Case D Three-Month MIS Release (Approved Teaching Release)
                </h4>
              </div>
              <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: '#e0e7ff', color: '#3730a3', fontWeight: 600 }}>
                INR Net of Tax · Sessions 9, 10, 13 &amp; 14
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '10px 14px' }}>Measure / Accounting Definition</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', width: '130px' }}>July (INR)</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', width: '130px' }}>August (INR)</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', width: '140px' }}>September (INR)</th>
                    <th style={{ padding: '10px 14px', width: '220px' }}>Audit Nature</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#17245C' }}>Billed Revenue</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>₹{july.revenue.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>₹{august.revenue.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#17245C' }}>₹{september.revenue.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', fontSize: '0.76rem', color: '#64748B' }}>Recognised customer billing (accrual basis)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#dc2626' }}>Direct Delivery Cost</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#dc2626' }}>₹{july.directCost.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#dc2626' }}>₹{august.directCost.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#dc2626', fontWeight: 700 }}>₹{september.directCost.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', fontSize: '0.76rem', color: '#64748B' }}>Recognised expense (direct COGS)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#475569' }}>Operating Overhead</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>₹{july.overhead.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>₹{august.overhead.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700 }}>₹{september.overhead.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', fontSize: '0.76rem', color: '#64748B' }}>Recognised expense (fixed/period opex)</td>
                  </tr>
                  <tr style={{ background: '#fffbeb' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#b45309' }}>Closing Receivables</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#b45309' }}>₹{july.receivables.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#b45309' }}>₹{august.receivables.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#b45309', fontWeight: 800 }}>₹{september.receivables.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 14px', fontSize: '0.76rem', color: '#92400e', fontWeight: 600 }}>Balance at a date (NOT cash loss or collection)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ padding: '10px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748B' }}>
              <strong>Case Boundary Guard:</strong> Case D is a separate educational release. Collection dates and causes of cost expansion are not supplied and must not be guessed.
            </div>
          </div>
        </TaskCard>

        {/* TASK 02: Calculate Performance (S09-T02) */}
        <TaskCard
          taskId="S09-T02"
          taskNumber="TASK 02"
          title="Calculate Performance"
          instruction="Derive monthly gross and operating profits, calculate margin percentages, and compute August-to-September growth rates using traceable formulas."
          whyMatters="Formulas establish complete audit traceability. Calculating both Gross Profit and Operating Profit exposes whether profitability erosion stems from direct operational costs (COGS) or administrative overhead."
          statusText="KPIs Reconciled (+25% Rev vs +11.1% OP)"
          isActive={activeTaskId === 'S09-T02'}
          onSelectTask={() => setActiveTaskId('S09-T02')}
        >
          {/* 3-Month Performance Matrix Card */}
          <div className="vcep-sheet-card" style={{ border: '1px solid rgba(23, 36, 92, 0.15)', borderRadius: '12px', background: '#ffffff', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ padding: '14px 18px', background: 'rgba(23, 36, 92, 0.04)', borderBottom: '1px solid rgba(23, 36, 92, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#17245C', textTransform: 'uppercase' }}>
                  PERFORMANCE MATRIX
                </span>
                <h4 style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 700, color: '#17245C' }}>
                  Monthly KPI Computations &amp; Trend Analysis
                </h4>
              </div>
              <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: '#e0e7ff', color: '#3730a3', fontWeight: 600 }}>
                Traceable Ratios
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid rgba(23, 36, 92, 0.15)', textAlign: 'left', color: '#17245C' }}>
                    <th style={{ padding: '12px 14px' }}>Financial Metric &amp; Line Item</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', width: '130px' }}>July (INR)</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', width: '130px' }}>August (INR)</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', width: '140px' }}>September (INR)</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', width: '210px' }}>August → September Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 1. Revenue */}
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '11px 14px', fontWeight: 600, color: '#17245C' }}>
                      Billed Revenue (Net of Tax)
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right' }}>₹{july.revenue.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right' }}>₹{august.revenue.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 700, color: '#17245C' }}>
                      ₹{september.revenue.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                        +25.0% Revenue Growth
                      </span>
                    </td>
                  </tr>

                  {/* 2. Direct Delivery Cost */}
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '11px 14px', paddingLeft: '28px', color: '#dc2626' }}>
                      Less: Direct Delivery Costs (COGS)
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', color: '#dc2626' }}>- ₹{july.directCost.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', color: '#dc2626' }}>- ₹{august.directCost.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>
                      - ₹{september.directCost.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c', fontWeight: 700 }}>
                        +38.9% Cost Escalation ⚠
                      </span>
                    </td>
                  </tr>

                  {/* 3. Gross Profit */}
                  <tr style={{ borderBottom: '1px solid #cbd5e1', background: 'rgba(23, 36, 92, 0.02)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#17245C' }}>
                      Gross Profit (Revenue – Direct Costs)
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600 }}>₹{state.userKpis.julyGrossProfit.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600 }}>₹{state.userKpis.augustGrossProfit.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#17245C' }}>
                      ₹{state.userKpis.septemberGrossProfit.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
                        +13.6% GP Expansion
                      </span>
                    </td>
                  </tr>

                  {/* 4. Gross Margin % */}
                  <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.15)', background: '#faf5ff' }}>
                    <td style={{ padding: '11px 14px', fontWeight: 700, color: '#6b21a8' }}>
                      Gross Margin % (GP ÷ Revenue)
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 700, color: '#6b21a8' }}>
                      {state.userKpis.julyGrossMargin.toFixed(1)}%
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 700, color: '#6b21a8' }}>
                      {state.userKpis.augustGrossMargin.toFixed(1)}%
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 800, color: '#6b21a8', fontSize: '0.95rem' }}>
                      {state.userKpis.septemberGrossMargin.toFixed(1)}%
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fee2e2', color: '#991b1b', fontWeight: 800 }}>
                        -5.0 pp MoM (-10.0 pp Qtr) 📉
                      </span>
                    </td>
                  </tr>

                  {/* 5. Operating Overhead */}
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '11px 14px', paddingLeft: '28px', color: '#64748B' }}>
                      Less: Operating Overhead (Opex)
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', color: '#64748B' }}>- ₹{july.overhead.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', color: '#64748B' }}>- ₹{august.overhead.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', color: '#64748B' }}>- ₹{september.overhead.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569' }}>
                        +15.4% Overhead Growth
                      </span>
                    </td>
                  </tr>

                  {/* 6. Operating Profit */}
                  <tr style={{ borderBottom: '1px solid #cbd5e1', background: 'rgba(15, 118, 110, 0.03)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F766E' }}>
                      Operating Profit (Gross Profit – Overhead)
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600 }}>₹{state.userKpis.julyOperatingProfit.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600 }}>₹{state.userKpis.augustOperatingProfit.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#0F766E' }}>
                      ₹{state.userKpis.septemberOperatingProfit.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', fontWeight: 700 }}>
                        +11.1% Profit Growth
                      </span>
                    </td>
                  </tr>

                  {/* 7. Operating Margin % */}
                  <tr style={{ borderBottom: '2px solid rgba(15, 118, 110, 0.2)', background: 'rgba(15, 118, 110, 0.05)' }}>
                    <td style={{ padding: '11px 14px', fontWeight: 700, color: '#0F766E' }}>
                      Operating Margin % (OP ÷ Revenue)
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 700, color: '#0F766E' }}>
                      {state.userKpis.julyOperatingMargin.toFixed(1)}%
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 700, color: '#0F766E' }}>
                      {state.userKpis.augustOperatingMargin.toFixed(1)}%
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 800, color: '#0F766E', fontSize: '0.95rem' }}>
                      {state.userKpis.septemberOperatingMargin.toFixed(1)}%
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fee2e2', color: '#991b1b', fontWeight: 800 }}>
                        -2.5 pp MoM (-5.0 pp Qtr) 📉
                      </span>
                    </td>
                  </tr>

                  {/* 8. Closing Trade Receivables */}
                  <tr style={{ background: '#fffbeb', fontWeight: 600 }}>
                    <td style={{ padding: '12px 14px', color: '#b45309' }}>
                      Closing Trade Receivables (Uncollected Cash Balance)
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#b45309' }}>₹{july.receivables.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#b45309' }}>₹{august.receivables.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#b45309', fontSize: '0.95rem' }}>
                      ₹{september.receivables.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', fontWeight: 800 }}>
                        +133.3% Surge (46.7% of Rev) 🚨
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem', color: '#475569' }}>
              <span><strong>Diagnostic Rule:</strong> Percentage point differences measure margin erosion; percent growth measures volume expansion.</span>
              <span><strong>Formula Proof:</strong> Revenue (+25.0%), Operating Profit (+11.1%), Gross Margin MoM (-5.0 pp).</span>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* =========================================================================
          HEADING 2: WRITE THE MANAGEMENT FINDINGS (#vcep-area-findings)
         ========================================================================= */}
      <section id="vcep-area-findings" aria-labelledby="heading-area-findings" className="vcep-journey-stage-block">
        <div className="vcep-journey-section-header">
          <div className="vcep-journey-badge-row">
            <span className="vcep-pill-navy">WORK AREA 02</span>
            <span className="vcep-pill-teal">EXECUTIVE FINDINGS</span>
            <span className="vcep-pill-gold">MANAGEMENT BRIEFING</span>
          </div>
          <h2 id="heading-area-findings" className="vcep-journey-title">
            2. Write the Management Findings
          </h2>
          <p className="vcep-journey-subtitle">
            Synthesize your numerical analysis into 3 evidence-backed findings, 1 critical business uncertainty, 1 operational investigation, and an executive briefing for leadership.
          </p>
        </div>

        {/* TASK 03: Challenge the Sales Story (S09-T03) */}
        <TaskCard
          taskId="S09-T03"
          taskNumber="TASK 03"
          title="Challenge the Sales Story"
          instruction="Analyze direct cost escalation, profit decoupling, and mounting receivables; explain why top-line growth alone does not prove business health."
          whyMatters="Top-line sales expansion can mask severe internal deterioration. When direct costs grow faster than revenue and sales remain uncollected on customer ledgers, scaling accelerates cash burn and threatens corporate solvency."
          statusText="Story Evaluated (3 Gauges Reviewed)"
          isActive={activeTaskId === 'S09-T03'}
          onSelectTask={() => setActiveTaskId('S09-T03')}
        >
          {/* Analytical Intelligence Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Gauge 1: Margin Compression */}
            <div style={{ border: '1px solid #fecaca', borderRadius: '10px', padding: '14px', background: '#fff5f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>MARGIN EROSION</span>
                <Percent size={16} color="#dc2626" />
              </div>
              <strong style={{ fontSize: '1.25rem', color: '#b91c1c', display: 'block' }}>-10.0 Percentage Points</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#4b5563', lineHeight: 1.4 }}>
                Gross margin collapsed from 60.0% in July to 50.0% in September because direct costs surged +87.5% while revenue only grew +50.0%.
              </p>
            </div>

            {/* Gauge 2: Profit Decoupling */}
            <div style={{ border: '1px solid #fef3c7', borderRadius: '10px', padding: '14px', background: '#fffbeb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>GROWTH DECOUPLING</span>
                <TrendingUp size={16} color="#d97706" />
              </div>
              <strong style={{ fontSize: '1.25rem', color: '#b45309', display: 'block' }}>+25.0% Rev vs. +11.1% OP</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#4b5563', lineHeight: 1.4 }}>
                Revenue expanded twice as fast as operating profit between August and September, indicating that each incremental sale generates less bottom-line profit.
              </p>
            </div>

            {/* Gauge 3: Working Capital Risk */}
            <div style={{ border: '1px solid #fed7aa', borderRadius: '10px', padding: '14px', background: '#fff7ed' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>LIQUIDITY EXPOSURE</span>
                <AlertTriangle size={16} color="#ea580c" />
              </div>
              <strong style={{ fontSize: '1.25rem', color: '#c2410c', display: 'block' }}>₹70,000 Uncollected (46.7%)</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#4b5563', lineHeight: 1.4 }}>
                Trade receivables rose from ₹30,000 to ₹70,000 (+133.3%). Nearly half of September revenue is locked up on customer balance sheets rather than in bank cash.
              </p>
            </div>
          </div>

          {/* 4 Cardinal Corporate Finance Rules */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            <div className="vcep-rule-item">
              <div className="rule-header">
                <span className="rule-badge">RULE 1</span>
                <strong className="rule-title">Gross Margin as Direct Efficiency Test</strong>
              </div>
              <p className="rule-desc">
                Gross margin measures revenue remaining after direct delivery costs. When gross margin falls, the business is giving away product value or facing cost inflation.
              </p>
            </div>
            <div className="vcep-rule-item">
              <div className="rule-header">
                <span className="rule-badge">RULE 2</span>
                <strong className="rule-title">Percentage Points vs % Growth</strong>
              </div>
              <p className="rule-desc">
                Never confuse a percentage-point difference (55% to 50% is -5.0 pp) with percentage growth. Conflating them distorts board-level financial reports.
              </p>
            </div>
            <div className="vcep-rule-item">
              <div className="rule-header">
                <span className="rule-badge">RULE 3</span>
                <strong className="rule-title">Operating Leverage Discipline</strong>
              </div>
              <p className="rule-desc">
                Healthy scaling requires operating profit to grow faster than revenue. When profit lags revenue, the business is scaling operational inefficiencies.
              </p>
            </div>
            <div className="vcep-rule-item">
              <div className="rule-header">
                <span className="rule-badge">RULE 4</span>
                <strong className="rule-title">Receivables Are Not Cash</strong>
              </div>
              <p className="rule-desc">
                Uncollected accounts receivable cannot fund payroll, rent, or vendors. Rapidly rising AR during sales expansion signals high credit risk and liquidity stress.
              </p>
            </div>
          </div>

          {/* Squad Activity: Finance Counter-Argument to Sales Manager */}
          <div className="vcep-clean-rules-card">
            <span className="vcep-eyebrow">SQUAD ACTIVITY &amp; PROFESSIONAL DEBATE</span>
            <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: '#17245C', fontWeight: 700 }}>
              Finance Counter-Argument to Sales Manager
            </h4>
            <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#64748B' }}>
              Sales Manager: <em>&ldquo;Revenue grew +25% from August to September, so we should increase bonuses!&rdquo;</em> Document Finance’s counter-argument explaining cost intensity and uncollected receivables.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#17245C' }}>
                FINANCE DEFENSE NOTE:
              </label>
              <span style={{ fontSize: '0.72rem', color: countWords(state.peerDefenseNote) >= 15 ? '#0F766E' : '#dc2626', fontWeight: 600 }}>
                {countWords(state.peerDefenseNote)} words (min 15 required)
              </span>
            </div>
            <textarea
              rows={3}
              value={state.peerDefenseNote}
              onChange={(e) => updateState((prev) => ({ ...prev, peerDefenseNote: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                color: '#1e293b',
                fontFamily: 'inherit',
              }}
              placeholder="Explain why revenue expansion with collapsed margins and uncollected cash cannot fund bonuses..."
            />
          </div>
        </TaskCard>

        {/* TASK 04: Write Management Findings (S09-T04) */}
        <TaskCard
          taskId="S09-T04"
          taskNumber="TASK 04"
          title="Write Management Findings"
          instruction="Record three evidence-backed findings, a critical uncertainty (missing data gap), one audit investigation, and complete governance sign-off."
          whyMatters="Finance leaders must distinguish verifiable facts from unproven speculation. Clearly stating what is unknown prevents premature management blunders and directs investigative focus where it is needed."
          statusText="Findings & Governance Complete"
          isActive={activeTaskId === 'S09-T04'}
          onSelectTask={() => setActiveTaskId('S09-T04')}
        >
          {/* 3 Evidenced Observations Editor */}
          <div className="vcep-sheet-card" style={{ border: '1px solid rgba(23, 36, 92, 0.15)', borderRadius: '12px', background: '#ffffff', padding: '18px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <FileText size={18} color="#17245C" />
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#17245C' }}>
                Three Evidence-Backed Management Findings
              </h4>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: '0.8rem', color: '#64748B' }}>
              Each finding must reference specific figures from Case D (margins, growth rates, or receivables balances) and explain the business implication.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#17245C', marginBottom: '6px' }}>
                  <span>FINDING 01: GROSS MARGIN COMPRESSION &amp; DIRECT COST SURGE</span>
                  <span style={{ color: countWords(state.findings[0]) >= 15 ? '#0F766E' : '#dc2626', fontWeight: 600 }}>
                    {countWords(state.findings[0])} words (min 15)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={state.findings[0]}
                  onChange={(e) => handleFindingChange(0, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    color: '#1e293b',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Analyze the drop in gross margin from 60% to 50% and direct cost surge..."
                />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#17245C', marginBottom: '6px' }}>
                  <span>FINDING 02: DECOUPLING OF REVENUE EXPANSION AND OPERATING PROFIT</span>
                  <span style={{ color: countWords(state.findings[1]) >= 15 ? '#0F766E' : '#dc2626', fontWeight: 600 }}>
                    {countWords(state.findings[1])} words (min 15)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={state.findings[1]}
                  onChange={(e) => handleFindingChange(1, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    color: '#1e293b',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Analyze why operating profit grew only +11.1% while revenue expanded +25%..."
                />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#17245C', marginBottom: '6px' }}>
                  <span>FINDING 03: TRADE RECEIVABLES EXPLOSION &amp; WORKING CAPITAL RISK</span>
                  <span style={{ color: countWords(state.findings[2]) >= 15 ? '#0F766E' : '#dc2626', fontWeight: 600 }}>
                    {countWords(state.findings[2])} words (min 15)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={state.findings[2]}
                  onChange={(e) => handleFindingChange(2, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    color: '#1e293b',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Analyze how uncollected receivables surged 133% and tie up operating cash..."
                />
              </div>
            </div>
          </div>

          {/* Uncertainty and Investigation Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Critical Business Uncertainty */}
            <div className="vcep-sheet-card" style={{ border: '1px solid #fed7aa', borderRadius: '12px', background: '#fffaf5', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <AlertTriangle size={18} color="#ea580c" />
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#9a3412' }}>
                  Critical Business Uncertainty (Missing Data Gap)
                </h4>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#64748B' }}>
                Identify one vital piece of information not supplied in Case D that prevents a definitive causal diagnosis.
              </p>
              <textarea
                rows={4}
                value={state.uncertainty}
                onChange={(e) => updateState((prev) => ({ ...prev, uncertainty: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #fdba74',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  color: '#1e293b',
                  fontFamily: 'inherit',
                  background: '#ffffff',
                }}
                placeholder="State the missing information (e.g. collection dates, credit terms, unit price changes)..."
              />
            </div>

            {/* Operational Investigation Plan */}
            <div className="vcep-sheet-card" style={{ border: '1px solid #a7f3d0', borderRadius: '12px', background: '#f0fdf4', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <CheckCircle2 size={18} color="#059669" />
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#166534' }}>
                  Operational Audit Investigation Plan
                </h4>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#64748B' }}>
                Define the specific investigation you will lead, assigning an owner, source records, and deadline.
              </p>
              <textarea
                rows={4}
                value={state.investigation}
                onChange={(e) => updateState((prev) => ({ ...prev, investigation: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #86efac',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  color: '#1e293b',
                  fontFamily: 'inherit',
                  background: '#ffffff',
                }}
                placeholder="Assign follow-up owner, specific documents (debtor aging, supplier invoices), and target date..."
              />
            </div>
          </div>

          {/* Executive Management Briefing Memo */}
          <div className="vcep-clean-rules-card" style={{ marginBottom: '24px' }}>
            <span className="vcep-eyebrow">LEADERSHIP SYNTHESIS</span>
            <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: '#17245C', fontWeight: 700 }}>
              Concise Executive Management Briefing (Board Memo)
            </h4>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#17245C' }}>
                EXECUTIVE BRIEFING NOTE:
              </label>
              <span style={{ fontSize: '0.72rem', color: countWords(state.executiveBriefing) >= 15 ? '#0F766E' : '#dc2626', fontWeight: 600 }}>
                {countWords(state.executiveBriefing)} words (min 15 required)
              </span>
            </div>
            <textarea
              rows={3}
              value={state.executiveBriefing}
              onChange={(e) => updateState((prev) => ({ ...prev, executiveBriefing: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                color: '#1e293b',
                fontFamily: 'inherit',
              }}
              placeholder="Synthesize the findings for senior leadership: advise on growth, margins, and cash collection..."
            />
          </div>

          {/* Pre-Submission Verification Checklist */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#17245C', fontWeight: 700 }}>
              Pre-Submission Verification Checklist:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
              {S09_CHECKLIST.map((item, idx) => {
                const isChecked = state.checkedIndices.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleCheck(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: isChecked ? '#f0fdf4' : '#f8fafc',
                      border: isChecked ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      color: isChecked ? '#166534' : '#475569',
                    }}
                  >
                    <CheckSquare size={15} color={isChecked ? '#16a34a' : '#94a3b8'} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Portfolio Sign-Off & Governance */}
          <div className="vcep-clean-rules-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <span className="vcep-eyebrow">PORTFOLIO EVIDENCE &amp; AUDIT SIGN-OFF</span>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#17245C', fontWeight: 700 }}>
                  Finance Analysis Artifact: {state.governance.fileVersion}
                </h4>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="vcep-btn-primary"
                  onClick={runReviewEvaluation}
                  style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={14} />
                  <span>Run Formative Review</span>
                </button>
                <button
                  type="button"
                  className="v3-outline"
                  onClick={handleResetToApproved}
                  style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RotateCcw size={14} />
                  <span>Reset Case D Baseline</span>
                </button>
              </div>
            </div>

            {/* Governance Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#17245C', marginBottom: '4px' }}>
                  STUDENT CANDIDATE ID
                </label>
                <input
                  type="text"
                  value={state.governance.studentId}
                  onChange={(e) =>
                    updateState((prev) => ({
                      ...prev,
                      governance: { ...prev.governance, studentId: e.target.value },
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#17245C', marginBottom: '4px' }}>
                  WORKING FILE VERSION
                </label>
                <input
                  type="text"
                  value={state.governance.fileVersion}
                  onChange={(e) =>
                    updateState((prev) => ({
                      ...prev,
                      governance: { ...prev.governance, fileVersion: e.target.value },
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#17245C', marginBottom: '4px' }}>
                  PREPARER ROLE
                </label>
                <input
                  type="text"
                  value={state.governance.preparerRole}
                  onChange={(e) =>
                    updateState((prev) => ({
                      ...prev,
                      governance: { ...prev.governance, preparerRole: e.target.value },
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#17245C', marginBottom: '4px' }}>
                  REVIEWER ROLE
                </label>
                <input
                  type="text"
                  value={state.governance.reviewerRole}
                  onChange={(e) =>
                    updateState((prev) => ({
                      ...prev,
                      governance: { ...prev.governance, reviewerRole: e.target.value },
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 10-Point Rubric Table */}
          <div>
            <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#17245C', fontWeight: 700 }}>
              Approved 10-Point Evaluation Rubric (10 Marks Total):
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '8px 12px' }}>Criterion</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', width: '80px' }}>Points</th>
                    <th style={{ padding: '8px 12px' }}>Evidence Expected from Candidate</th>
                  </tr>
                </thead>
                <tbody>
                  {S09_RUBRIC.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: '#17245C' }}>{r.name}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#0F766E' }}>{r.points} pts</td>
                      <td style={{ padding: '8px 12px', color: '#475569' }}>{r.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formative Review Modal / Drawer */}
          {reviewReport && (
            <div
              style={{
                marginTop: '20px',
                border: '2px solid #0f766e',
                borderRadius: '12px',
                padding: '20px',
                background: '#f0fdfa',
                boxShadow: '0 4px 12px rgba(15, 118, 110, 0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} color="#0f766e" />
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f766e', fontWeight: 700 }}>
                    Formative Review Report · Session 09
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewReport(null)}
                  style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', color: '#64748B', cursor: 'pointer' }}
                >
                  ✕ Close
                </button>
              </div>

              <p style={{ margin: '0 0 16px', fontSize: '0.86rem', color: '#134e4a', fontWeight: 600 }}>
                {reviewReport.overallSummary}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {Object.entries(reviewReport.stages).map(([stageName, stageResult]) => (
                  <div
                    key={stageName}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #ccfbf1',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.82rem', color: '#17245C' }}>{stageResult.title}</strong>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: stageResult.status === 'reviewed' ? '#dcfce7' : '#fee2e2',
                          color: stageResult.status === 'reviewed' ? '#15803d' : '#b91c1c',
                          fontWeight: 700,
                        }}
                      >
                        {stageResult.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569' }}>
                      {stageResult.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TaskCard>
      </section>
    </div>
  );
}
