'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S10_STORAGE_KEY,
  CASE_D_SOURCE_CELLS,
  EXECUTIVE_KPIS,
  calculateMISMetrics,
  countWords,
  loadSession10State,
  saveSession10State,
  INITIAL_S10_STATE,
  S10_RUBRIC,
  S10_CHECKLIST,
  type Session10WorkstationState,
} from './session-10-dashboard-data.ts';
import { evaluateSession10 } from '../../../lib/review-engine/session-rules/session-10.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  LayoutDashboard,
  Sliders,
  FileText,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  DollarSign,
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
  Table,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Session10DashboardJourneyProps {
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
            <span>{whyOpen ? 'Hide dashboard principle' : 'Why this matters'}</span>
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

export function Session10DashboardJourney({
  onUpdateDraft,
}: Session10DashboardJourneyProps) {
  const [state, setState] = useState<Session10WorkstationState>(INITIAL_S10_STATE);
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string>('S10-T01');

  const WIZARD_STEPS = [
    { id: 'S10-T01' as const, num: 1, label: 'TASK 01: Select Decision KPIs', short: '1. Select KPIs' },
    { id: 'S10-T02' as const, num: 2, label: 'TASK 02: Build the Dashboard', short: '2. Build Dashboard' },
    { id: 'S10-T03' as const, num: 3, label: 'TASK 03: Test the Refresh', short: '3. Stress Test' },
    { id: 'S10-T04' as const, num: 4, label: 'TASK 04: Present the Insight', short: '4. Executive Memo' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  // Hydrate on mount
  useEffect(() => {
    const loaded = loadSession10State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', loaded.memoText);
      onUpdateDraft('team:contribution', loaded.visualizationJustification);
      onUpdateDraft('team:judgement', loaded.managementQuestion);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session10WorkstationState) => Session10WorkstationState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession10State(next);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', next.memoText);
        onUpdateDraft('team:contribution', next.visualizationJustification);
        onUpdateDraft('team:judgement', next.managementQuestion);
      }
      return next;
    });
  };

  const handleToggleKpi = (id: string) => {
    updateState((prev) => {
      const exists = prev.selectedKpiIds.includes(id);
      const next = exists ? prev.selectedKpiIds.filter((k) => k !== id) : [...prev.selectedKpiIds, id];
      return { ...prev, selectedKpiIds: next };
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

  // Sensitivity Calculations
  const metrics = useMemo(() => {
    return calculateMISMetrics(state.directCostInput);
  }, [state.directCostInput]);

  const memoWordCount = useMemo(() => {
    return countWords(state.memoText);
  }, [state.memoText]);

  const isMemoValidLength = memoWordCount >= 25 && memoWordCount <= 150;

  const runReviewEvaluation = () => {
    const report = evaluateSession10({
      sessionId: 10,
      draft: {
        'concept:explain': state.memoText,
        'team:contribution': state.visualizationJustification,
        'team:judgement': state.managementQuestion,
      },
      workstationData: {
        managementQuestion: state.managementQuestion,
        directCostInput: state.directCostInput,
        selectedKpiIds: state.selectedKpiIds,
        memoText: state.memoText,
        visualizationJustification: state.visualizationJustification,
      },
    });
    setReviewReport(report);
  };

  const handleResetToApproved = () => {
    if (confirm('Reset Session 10 to approved Case D baseline data?')) {
      try {
        localStorage.removeItem(S10_STORAGE_KEY);
      } catch {}
      setState(INITIAL_S10_STATE);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', INITIAL_S10_STATE.memoText);
        onUpdateDraft('team:contribution', INITIAL_S10_STATE.visualizationJustification);
        onUpdateDraft('team:judgement', INITIAL_S10_STATE.managementQuestion);
      }
    }
  };

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
          HEADING 1: CHOOSE THE MANAGEMENT QUESTION (#vcep-area-question)
         ========================================================================= */}
      <div id="vcep-area-question" className="vcep-journey-stage-block">
        <div className="vcep-journey-section-header">
          <div className="vcep-journey-badge-row">
            <span className="vcep-pill-navy">WORK AREA 01</span>
            <span className="vcep-pill-teal">EXECUTIVE DECISION ARCHITECTURE</span>
            <span className="vcep-pill-gold">FIVE-MINUTE EXECUTIVE WINDOW</span>
          </div>
          <h2 className="vcep-journey-title">1. Choose the Management Question</h2>
          <p className="vcep-journey-subtitle">
            The Managing Director has five minutes between meetings. Avoid decorative charts: frame the single decision question that guides the dashboard, inspect verified source cells, and select the core KPIs.
          </p>
        </div>

        {/* TASK 01: Select Decision KPIs */}
        <TaskCard
          taskId="S10-T01"
          taskNumber="TASK 01"
          title="Select Decision KPIs"
          instruction="Define the core executive management question and select four vital KPIs supporting executive decisions."
          learningTakeaway="Every dashboard must answer one clear management question with decision-driving metrics."
          whyMatters="A professional MIS dashboard begins with the business decision leadership must make, not decorative charts. Mapping explicit source cells and accountability owners ensures that every metric drives operational action."
          statusText={`${state.selectedKpiIds.length} of 4 KPIs Selected`}
          isActive={activeTaskId === 'S10-T01'}
          onSelectTask={() => setActiveTaskId('S10-T01')}
        >
          {/* Executive Decision Question Framing Card */}
          <div className="vcep-sheet-card" style={{ border: '1px solid rgba(23, 36, 92, 0.15)', borderRadius: '12px', background: '#ffffff', padding: '18px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <HelpCircle size={18} color="#17245C" />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                The Core Management Decision Question
              </h4>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: '#64748B' }}>
              A professional executive dashboard does not begin with visual styling—it begins with the business question leadership must answer.
            </p>
            <textarea
              rows={2}
              value={state.managementQuestion}
              onChange={(e) => updateState((prev) => ({ ...prev, managementQuestion: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.86rem',
                fontWeight: 600,
                lineHeight: 1.5,
                color: '#17245C',
                fontFamily: 'inherit',
                background: '#f8fafc',
              }}
              placeholder="State the executive management question..."
            />
          </div>

          {/* Verified Case D Source Cells Grid */}
          <div className="vcep-sheet-card" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', background: '#ffffff', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ padding: '14px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', color: '#17245C', textTransform: 'uppercase' }}>
                  VERIFIED SOURCE COORDINATES
                </span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Case D Monthly MIS Source Cells (Net of Tax)
                </h4>
              </div>
              <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontFamily: 'monospace' }}>
                Sheet: CaseD!B2:D5
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '8px 12px', width: '130px' }}>Cell Address</th>
                    <th style={{ padding: '8px 12px' }}>Measure / Source Record</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>July (INR)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>August (INR)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>September (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {CASE_D_SOURCE_CELLS.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#0F766E', fontWeight: 600 }}>
                        {row.cellRef}
                      </td>
                      <td style={{ padding: '8px 12px', color: '#1e293b', fontWeight: 500 }}>{row.metric}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', color: '#475569' }}>₹{row.july.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', color: '#475569' }}>₹{row.august.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#17245C' }}>
                        ₹{row.september.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* KPI Selection & Decision Mapping */}
          <div className="vcep-clean-rules-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span className="vcep-eyebrow">KPI DECISION MAPPING</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Select Core Executive KPIs for the One-Page Dashboard
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {state.selectedKpiIds.length} of 4 KPIs Selected
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {EXECUTIVE_KPIS.map((kpi) => {
                const isSelected = state.selectedKpiIds.includes(kpi.id);
                return (
                  <div
                    key={kpi.id}
                    onClick={() => handleToggleKpi(kpi.id)}
                    style={{
                      border: isSelected ? '2px solid #0f766e' : '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '14px',
                      background: isSelected ? '#f0fdfa' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.92rem', color: '#17245C' }}>{kpi.name}</strong>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: isSelected ? '#ccfbf1' : '#f1f5f9',
                          color: isSelected ? '#0f766e' : '#64748B',
                          fontWeight: 700,
                        }}
                      >
                        {isSelected ? 'ACTIVE' : 'EXCLUDED'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: '#0F766E', fontFamily: 'monospace', marginBottom: '6px' }}>
                      Formula: {kpi.formulaCell}
                    </div>
                    <p style={{ margin: '0 0 8px', fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>
                      {kpi.decisionSupported}
                    </p>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>
                      <strong>Accountable Owner:</strong> {kpi.owner}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TaskCard>
      </div>

      {/* =========================================================================
          HEADING 2: BUILD THE MIS DASHBOARD (#vcep-area-dashboard)
         ========================================================================= */}
      <div id="vcep-area-dashboard" className="vcep-journey-stage-block">
        <div className="vcep-journey-section-header">
          <div className="vcep-journey-badge-row">
            <span className="vcep-pill-navy">WORK AREA 02</span>
            <span className="vcep-pill-teal">ONE-PAGE EXECUTIVE DASHBOARD</span>
            <span className="vcep-pill-gold">DYNAMIC SENSITIVITY TEST</span>
          </div>
          <h2 className="vcep-journey-title">2. Build the MIS Dashboard</h2>
          <p className="vcep-journey-subtitle">
            Assemble the four core executive KPI cards, 3-month multi-metric performance visualization, sensitivity stress-tester, and 150-word actionable management memo.
          </p>
        </div>

        {/* TASK 02: Build the Dashboard */}
        <TaskCard
          taskId="S10-T02"
          taskNumber="TASK 02"
          title="Build the Dashboard"
          instruction="Review the live KPI cards and three-month multi-metric trajectory charts across Q3."
          learningTakeaway="Trace live dashboard cards to underlying ledger data to confirm data consistency."
          whyMatters="Executive dashboards must reveal trends and structural shifts at a glance. Comparing revenue growth against cost growth and receivables accumulation immediately signals margin compression and working capital risk."
          statusText="Executive Strip Active"
          isActive={activeTaskId === 'S10-T02'}
          onSelectTask={() => setActiveTaskId('S10-T02')}
        >
          {/* 4 Core Executive KPI Cards Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Card 1: Revenue */}
            <div className="vcep-sheet-card" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', background: '#ffffff', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase' }}>
                  SEPTEMBER REVENUE
                </span>
                <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#0F766E' }}>=CaseD!D2</span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#17245C', margin: '4px 0' }}>
                ₹{metrics.revenue.toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>
                <TrendingUp size={14} /> +25.0% MoM (Aug ₹1,20,000)
              </div>
            </div>

            {/* Card 2: Gross Margin % */}
            <div className="vcep-sheet-card" style={{ border: '1px solid #fecaca', borderRadius: '12px', background: '#ffffff', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                  GROSS MARGIN %
                </span>
                <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#b91c1c' }}>=(D2-D3)/D2</span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: metrics.grossMarginPct < 50 ? '#b91c1c' : '#17245C', margin: '4px 0' }}>
                {metrics.grossMarginPct.toFixed(1)}%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#b91c1c', fontWeight: 700 }}>
                <TrendingDown size={14} /> {metrics.gmMoMPp.toFixed(1)} pp MoM (Aug 55.0%)
              </div>
            </div>

            {/* Card 3: Operating Margin % */}
            <div className="vcep-sheet-card" style={{ border: '1px solid #fed7aa', borderRadius: '12px', background: '#ffffff', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>
                  OPERATING MARGIN %
                </span>
                <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#c2410c' }}>=((D2-D3)-D4)/D2</span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: metrics.operatingMarginPct < 20 ? '#b91c1c' : '#17245C', margin: '4px 0' }}>
                {metrics.operatingMarginPct.toFixed(1)}%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#b91c1c', fontWeight: 700 }}>
                <TrendingDown size={14} /> {metrics.omMoMPp.toFixed(1)} pp MoM (Aug 22.5%)
              </div>
            </div>

            {/* Card 4: Closing Receivables */}
            <div className="vcep-sheet-card" style={{ border: '1px solid #fef3c7', borderRadius: '12px', background: '#ffffff', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                  CLOSING RECEIVABLES
                </span>
                <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#b45309' }}>=CaseD!D5</span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>
                ₹{metrics.receivables.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 700 }}>
                {metrics.receivablesToSalesPct.toFixed(1)}% of Monthly Revenue
              </div>
            </div>
          </div>

          {/* 3-Month Multi-Metric Performance Visualization */}
          <div className="vcep-sheet-card" style={{ border: '1px solid rgba(23, 36, 92, 0.15)', borderRadius: '12px', background: '#ffffff', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#17245C', textTransform: 'uppercase' }}>
                  EXECUTIVE TREND VISUALIZER
                </span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Three-Month Trajectory: Revenue Expansion vs. Direct Cost Surge &amp; Receivables
                </h4>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.74rem', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', background: '#17245C', borderRadius: '2px' }} /> Revenue
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', background: '#dc2626', borderRadius: '2px' }} /> Direct Costs
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '10px', height: '10px', background: '#d97706', borderRadius: '2px' }} /> Receivables
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {/* July Bar Block */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: 700, color: '#17245C', fontSize: '0.85rem' }}>
                  <span>July Performance</span>
                  <span>GM: 60.0%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                      <span>Revenue</span>
                      <span>₹1,00,000</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '66.6%', height: '100%', background: '#17245C' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                      <span>Direct Delivery Cost</span>
                      <span>₹40,000 (40%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '40%', height: '100%', background: '#dc2626' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                      <span>Closing Receivables</span>
                      <span>₹30,000 (30%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '30%', height: '100%', background: '#d97706' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* August Bar Block */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: 700, color: '#17245C', fontSize: '0.85rem' }}>
                  <span>August Performance</span>
                  <span>GM: 55.0%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                      <span>Revenue</span>
                      <span>₹1,20,000</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '80%', height: '100%', background: '#17245C' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                      <span>Direct Delivery Cost</span>
                      <span>₹54,000 (45%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '54%', height: '100%', background: '#dc2626' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                      <span>Closing Receivables</span>
                      <span>₹45,000 (37.5%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '45%', height: '100%', background: '#d97706' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* September Bar Block */}
              <div style={{ border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', background: '#fff5f5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: 700, color: '#17245C', fontSize: '0.85rem' }}>
                  <span>September Performance</span>
                  <span style={{ color: '#b91c1c' }}>GM: {metrics.grossMarginPct.toFixed(1)}%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                      <span>Revenue</span>
                      <span>₹1,50,000</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: '#17245C' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                      <span>Direct Delivery Cost</span>
                      <span>₹{metrics.directCost.toLocaleString('en-IN')} ({(metrics.directCost / 1500).toFixed(1)}%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(metrics.directCost / 150000) * 100}%`, height: '100%', background: '#dc2626' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
                      <span>Closing Receivables</span>
                      <span>₹70,000 (46.7%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '70%', height: '100%', background: '#d97706' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TaskCard>

        {/* TASK 03: Test the Refresh */}
        <TaskCard
          taskId="S10-T03"
          taskNumber="TASK 03"
          title="Test the Refresh"
          instruction="Simulate direct cost increase from ₹75,000 to ₹78,000 to test dynamic dashboard recalculations."
          learningTakeaway="Stress-test formulas to ensure all margins and visual warnings update dynamically."
          whyMatters="A trustworthy MIS model must respond dynamically to parameter updates. Stress-testing direct delivery costs reveals how vulnerable operating profit is to cost slippage and validates the model's structural formula integrity."
          statusText={state.directCostInput === 78000 ? 'Stress Test Active (+₹3k Surge)' : 'Baseline Direct Cost (₹75k)'}
          isActive={activeTaskId === 'S10-T03'}
          onSelectTask={() => setActiveTaskId('S10-T03')}
        >
          {/* Interactive Recalculation Sensitivity Tester */}
          <div className="vcep-clean-rules-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <span className="vcep-eyebrow">DYNAMIC RECALCULATION &amp; SENSITIVITY TEST</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Stress-Tester: Test September Direct Cost Volatility
                </h4>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => updateState((prev) => ({ ...prev, directCostInput: 75000 }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: state.directCostInput === 75000 ? '#e0f2fe' : '#ffffff',
                    color: state.directCostInput === 75000 ? '#0369a1' : '#475569',
                    fontWeight: state.directCostInput === 75000 ? 700 : 500,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  Baseline (₹75k)
                </button>
                <button
                  type="button"
                  onClick={() => updateState((prev) => ({ ...prev, directCostInput: 78000 }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: state.directCostInput === 78000 ? '#fee2e2' : '#ffffff',
                    color: state.directCostInput === 78000 ? '#b91c1c' : '#475569',
                    fontWeight: state.directCostInput === 78000 ? 700 : 500,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  Stress Test (+₹3k Surge: ₹78k)
                </button>
              </div>
            </div>

            <p style={{ margin: '0 0 14px', fontSize: '0.8rem', color: '#64748B' }}>
              Peer Review Check: Adjust direct delivery costs from ₹75,000 to ₹78,000 to verify that all affected KPI cards, margin ratios, and variance indicators recalculate in real time without broken formulas.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
              <input
                type="range"
                min={70000}
                max={85000}
                step={1000}
                value={state.directCostInput}
                onChange={(e) => updateState((prev) => ({ ...prev, directCostInput: Number(e.target.value) }))}
                style={{ flex: 1, accentColor: '#17245C' }}
              />
              <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'monospace', color: '#17245C', minWidth: '95px', textAlign: 'right' }}>
                ₹{state.directCostInput.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Gross Profit:</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#17245C' }}>
                  ₹{metrics.grossProfit.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Gross Margin %:</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: metrics.grossMarginPct < 50 ? '#b91c1c' : '#17245C' }}>
                  {metrics.grossMarginPct.toFixed(1)}%
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Operating Profit:</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#17245C' }}>
                  ₹{metrics.operatingProfit.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Operating Margin %:</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: metrics.operatingMarginPct < 20 ? '#b91c1c' : '#17245C' }}>
                  {metrics.operatingMarginPct.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* 4 Cardinal Executive Dashboard Rules */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontWeight: 700 }}>RULE 1</span>
                <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>Start with the Decision</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748B', lineHeight: 1.4 }}>
                Never build charts without an underlying question. A dashboard widget that does not drive an operational action wastes executive attention.
              </p>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontWeight: 700 }}>RULE 2</span>
                <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>Strict Units &amp; Periods</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748B', lineHeight: 1.4 }}>
                Every KPI card must explicitly state currency (INR), calendar period (September), and comparison baseline (August MoM).
              </p>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#fef3c7', color: '#92400e', fontWeight: 700 }}>RULE 3</span>
                <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>Dynamic Linkage Rule</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748B', lineHeight: 1.4 }}>
                Never hardcode computed metrics. All cards and charts must recalculate dynamically through live formula relationships.
              </p>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c', fontWeight: 700 }}>RULE 4</span>
                <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>Owned Actions Required</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748B', lineHeight: 1.4 }}>
                An executive memo must assign specific role owners and clock deadlines; recommendations without accountability are ignored.
              </p>
            </div>
          </div>
        </TaskCard>

        {/* TASK 04: Present the Insight */}
        <TaskCard
          taskId="S10-T04"
          taskNumber="TASK 04"
          title="Present the Insight"
          instruction="Draft a 150-word executive memo with clear diagnosis, 2 action owners, and data limitations."
          learningTakeaway="Summarize dashboard insights concisely with numerical evidence and designated action owners."
          whyMatters="Dashboards alone do not generate business outcomes; clear executive communication does. Concise memos with specific role owners, explicit deadlines, and honest data caveats enable leadership to execute swift corrective action."
          statusText={`${memoWordCount} / 150 words · ${isMemoValidLength ? 'Compliant' : 'Non-compliant'}`}
          isActive={activeTaskId === 'S10-T04'}
          onSelectTask={() => setActiveTaskId('S10-T04')}
        >
          {/* 150-Word Executive Management Memo */}
          <div className="vcep-sheet-card" style={{ border: '1px solid rgba(23, 36, 92, 0.15)', borderRadius: '12px', background: '#ffffff', padding: '18px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#17245C" />
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  150-Word Executive Management Memo
                </h4>
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  background: isMemoValidLength ? '#ecfdf5' : '#fee2e2',
                  color: isMemoValidLength ? '#15803d' : '#b91c1c',
                }}
              >
                {memoWordCount} / 150 words {isMemoValidLength ? '✓ (Compliant)' : '(Limit Exceeded!)'}
              </span>
            </div>

            <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#64748B' }}>
              Structure: <strong>Insight</strong> (Diagnosis) → <strong>Evidence</strong> (Case D metrics) → <strong>Two Actions</strong> (Owner + Deadline) → <strong>Limitation</strong> (No collection ledger).
            </p>

            <textarea
              rows={5}
              value={state.memoText}
              onChange={(e) => updateState((prev) => ({ ...prev, memoText: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${isMemoValidLength ? '#cbd5e1' : '#ef4444'}`,
                fontSize: '0.86rem',
                lineHeight: 1.55,
                color: '#1e293b',
                fontFamily: 'inherit',
                marginBottom: '14px',
              }}
              placeholder="Draft the 150-word executive briefing memo..."
            />

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#17245C', marginBottom: '6px' }}>
                WHY THIS VISUALIZATION SUPPORTS THE EXECUTIVE DECISION:
              </label>
              <textarea
                rows={3}
                value={state.visualizationJustification}
                onChange={(e) => updateState((prev) => ({ ...prev, visualizationJustification: e.target.value }))}
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
                placeholder="Explain how the 4 KPI cards and 3-month trend visualizer answer the Managing Director's 5-minute question..."
              />
            </div>
          </div>

          {/* Portfolio Sign-off & Rubric */}
          <div className="vcep-clean-rules-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <span className="vcep-eyebrow">PORTFOLIO EVIDENCE &amp; AUDIT SIGN-OFF</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  MIS Dashboard Artifact: {state.governance.fileVersion}
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

            {/* Checklist */}
            <div style={{ marginBottom: '18px' }}>
              <h5 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#17245C' }}>Pre-Submission Verification Checklist:</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                {S10_CHECKLIST.map((item, idx) => {
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

            {/* 10-Point Rubric Table */}
            <div>
              <h5 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#17245C' }}>Approved 10-Point Evaluation Rubric:</h5>
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
                    {S10_RUBRIC.map((r, i) => (
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
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0f766e' }}>
                    Formative Review Report · Session 10
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
      </div>

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
          {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Dashboard Complete ✓' : 'Save & Continue →'}
        </button>
      </footer>
    </div>
  );
}
