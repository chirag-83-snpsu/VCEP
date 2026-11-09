'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S15_STORAGE_KEY,
  CASE_G_AS_OF_DATE,
  CASE_G_LEADS,
  CASE_G_METRICS,
  SALES_OPERATIONS_PRINCIPLES,
  DEFAULT_FOLLOWUP_L06,
  DEFAULT_FOLLOWUP_L07,
  DEFAULT_CONVERSION_EXPLANATION,
  S15_RUBRIC,
  loadSession15State,
  saveSession15State,
  clearSession15State,
  type Session15State,
  type StudentLeadPlan,
  type CaseGLeadRecord,
} from './session-15-sales-data.ts';
import { evaluateSession15 } from '../../../lib/review-engine/session-rules/session-15.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  Users,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  FileText,
  Table,
  Check,
  Mail,
  HelpCircle,
  TrendingUp,
  ListOrdered,
  UserCheck,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Target,
} from 'lucide-react';

interface Session15SalesJourneyProps {
  onUpdateDraft?: (key: string, value: string) => void;
}

interface TaskCardProps {
  taskId: string;
  taskNumber: string;
  title: string;
  instruction: string;
  whyMatters?: string;
  statusText?: string;
  outputBadge?: string;
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
  outputBadge,
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
          {statusText && (
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
              <span>{statusText}</span>
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

export function Session15SalesJourney({ onUpdateDraft }: Session15SalesJourneyProps) {
  const [state, setState] = useState<Session15State>(() => loadSession15State());
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string>('S15-T01');

  // Initial mount sync
  useEffect(() => {
    const loaded = loadSession15State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', loaded.conversionExplanation);
      onUpdateDraft('work-prompt:0', loaded.messageL06);
      onUpdateDraft('work-prompt:1', loaded.messageL07);
      onUpdateDraft(
        'team:contribution',
        `All-Lead Win Rate: ${loaded.enteredAllLeadRate}%, Closed-Lead Win Rate: ${loaded.enteredClosedLeadRate}%`
      );
      onUpdateDraft('team:judgement', loaded.governance.decisionOwnerName);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session15State) => Session15State) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession15State(next);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', next.conversionExplanation);
        onUpdateDraft('work-prompt:0', next.messageL06);
        onUpdateDraft('work-prompt:1', next.messageL07);
        onUpdateDraft(
          'team:contribution',
          `All-Lead Win Rate: ${next.enteredAllLeadRate}%, Closed-Lead Win Rate: ${next.enteredClosedLeadRate}%`
        );
        onUpdateDraft('team:judgement', next.governance.decisionOwnerName);
      }
      return next;
    });
  };

  // 1. Lead Plan Handler
  const handleUpdateLeadPlan = (leadId: string, field: keyof StudentLeadPlan, val: string) => {
    updateState((prev) => ({
      ...prev,
      leadPlans: {
        ...prev.leadPlans,
        [leadId]: {
          ...(prev.leadPlans[leadId] || {
            updatedNextAction: '',
            updatedOwner: '',
            updatedTargetDate: '',
            notes: '',
          }),
          [field]: val,
        },
      },
    }));
  };

  // 2. Conversion Handlers
  const handleRateChange = (field: 'enteredAllLeadRate' | 'enteredClosedLeadRate', val: string) => {
    updateState((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleExplanationChange = (val: string) => {
    updateState((prev) => ({
      ...prev,
      conversionExplanation: val,
    }));
  };

  // 3. Message Handlers
  const handleMessageChange = (field: 'messageL06' | 'messageL07', val: string) => {
    updateState((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  // 4. Governance Handler
  const handleGovernanceChange = (field: string, val: string) => {
    updateState((prev) => ({
      ...prev,
      governance: {
        ...prev.governance,
        [field]: val,
      },
    }));
  };

  // 5. Reset Handler
  const handleReset = () => {
    if (window.confirm('Reset all Session 15 CRM pipeline and follow-up entries to default state?')) {
      clearSession15State();
      const fresh = loadSession15State();
      setState(fresh);
      setReviewReport(null);
    }
  };

  // 6. Formative Review Runner
  const handleRunReview = () => {
    const ctx = {
      sessionId: 15,
      stageId: 'Work',
      draft: {
        'concept:explain': state.conversionExplanation,
        'work-prompt:0': state.messageL06,
        'work-prompt:1': state.messageL07,
        'team:contribution': `All-Lead Win Rate: ${state.enteredAllLeadRate}%, Closed-Lead Win Rate: ${state.enteredClosedLeadRate}%`,
        'team:judgement': state.governance.decisionOwnerName,
      },
      workstationData: {
        leadPlans: state.leadPlans,
        enteredAllLeadRate: state.enteredAllLeadRate,
        enteredClosedLeadRate: state.enteredClosedLeadRate,
        conversionExplanation: state.conversionExplanation,
        messageL06: state.messageL06,
        messageL07: state.messageL07,
        governance: state.governance,
        fileVersion: state.governance.fileVersion || 'StudentID_S15_v01.xlsx',
      },
    };
    const report = evaluateSession15(ctx);
    setReviewReport(report);
  };

  // Calculations
  const isAllLeadRateAccurate = useMemo(() => {
    const val = parseFloat(state.enteredAllLeadRate.replace('%', ''));
    return Math.abs(val - 37.5) < 0.1 || state.enteredAllLeadRate.includes('37.5');
  }, [state.enteredAllLeadRate]);

  const isClosedLeadRateAccurate = useMemo(() => {
    const val = parseFloat(state.enteredClosedLeadRate.replace('%', ''));
    return Math.abs(val - 60.0) < 0.1 || state.enteredClosedLeadRate.includes('60');
  }, [state.enteredClosedLeadRate]);

  // Overdue leads
  const overdueLeads = useMemo(() => {
    return CASE_G_LEADS.filter((l) => l.actionStatus === 'Overdue');
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* ==================================================== */}
      {/* EXECUTIVE MISSION BANNER */}
      {/* ==================================================== */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>Session 15 · Professional Workplace Experience</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Manage the Pipeline. Own the Follow-Up.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Commercial revenue depends on transparent conversion metrics and disciplined follow-up cadences. In Case G, you are handed eight distinct inquiries as of 31 October 2026: three Won, two Lost, and three Open. Calculate the All-Lead Win Rate (37.5%) versus Closed-Lead Win Rate (60.0%), isolate overdue actions for L06 and L07, and compose targeted client outreach messages.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href="#vcep-area-pipeline"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md transition-colors"
            >
              <span>1. Review Sales Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#vcep-area-crm"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/30 text-sm font-semibold transition-colors"
            >
              <span>2. Build CRM Action Queue</span>
              <Users className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 4 Cardinal Principles of Sales Operations */}
        <div className="mt-8 pt-6 border-t border-indigo-900/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SALES_OPERATIONS_PRINCIPLES.map((principle) => (
            <div
              key={principle.principleNum}
              className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  RULE 0{principle.principleNum}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  {principle.badge}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-100">{principle.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* HEADING 1: REVIEW THE SALES PIPELINE */}
      {/* ==================================================== */}
      <section id="vcep-area-pipeline" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase">
            <Filter className="w-4 h-4" />
            <span>Natural Heading 01</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Review the Sales Pipeline
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Inspect the eight Case G inquiry records, preserve original source stages, and update operational action plans with single-owner accountability.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TASK 01: REVIEW THE LEAD QUEUE */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S15-T01"
          taskNumber="TASK 01"
          title="Task 01 — Review the Lead Queue"
          instruction="Inspect the eight distinct Case G inquiry records as of 31 October 2026. Verify stages (3 Won, 2 Lost, 3 Open) and note the strict curriculum safeguard against linking to Case F invoices."
          whyMatters="Stable stage definitions and zero synthetic data merges are fundamental to pipeline integrity. In commercial operations, combining unrelated customer records creates fictitious accounts and invalid forecasts."
          statusText="Case G Ground Truth (8 Leads)"
          outputBadge="Output: Validated 8-Lead Source Queue"
          isActive={activeTaskId === 'S15-T01'}
          onSelectTask={() => setActiveTaskId('S15-T01')}
        >
          {/* Summary Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Total Leads</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">8 Inquiries</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">Closed Won</span>
              <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">3 Leads (37.5%)</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-300/80 dark:border-slate-700">
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Closed Lost</span>
              <span className="text-lg font-bold text-slate-700 dark:text-slate-300">2 Leads (25.0%)</span>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-200/80 dark:border-indigo-800/60">
              <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">Open Pipeline</span>
              <span className="text-lg font-bold text-indigo-800 dark:text-indigo-200">3 Leads (37.5%)</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/80 dark:border-amber-800/60">
              <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wider block">Baseline Date</span>
              <span className="text-lg font-bold text-amber-800 dark:text-amber-200 font-mono">31 Oct 2026</span>
            </div>
          </div>

          {/* Master Case G CRM Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Table className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Case G CRM Release (8 Distinct Enquiries as of 31 October 2026)</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Baseline As-of Date: <strong>2026-10-31</strong>. One row per distinct inquiry; no duplicates.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                No Verified Join Key to Case F Invoices
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Lead ID</th>
                    <th className="py-2.5 px-3">Source Stage</th>
                    <th className="py-2.5 px-3">Lead Owner</th>
                    <th className="py-2.5 px-3">Source Next Action</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Action Status (as of 31 Oct)</th>
                    <th className="py-2.5 px-3">Operational Need Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {CASE_G_LEADS.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {lead.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            lead.sourceStage === 'Won'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : lead.sourceStage === 'Lost'
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          {lead.sourceStage}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {lead.sourceOwner}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        {lead.sourceNextAction}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {lead.sourceDueDate}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 ${
                            lead.actionStatus === 'Overdue'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : lead.actionStatus === 'Closed'
                              ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {lead.actionStatus === 'Overdue' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                          {lead.actionStatus === 'Overdue' ? `${lead.overdueDays}d Overdue` : lead.actionStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
                        {lead.needDescription}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Curriculum Safeguard Callout */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Curriculum Boundary Rule:</strong> There is <strong>no verified join key</strong> linking Case G inquiries to Case F invoices or customers. Do NOT combine these separate teaching datasets or fabricate customer names or demographic traits.
              </div>
            </div>
          </div>
        </TaskCard>

        {/* ---------------------------------------------------- */}
        {/* TASK 02: UPDATE THE CRM */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S15-T02"
          taskNumber="TASK 02"
          title="Task 02 — Update the CRM Schedule"
          instruction="Maintain an operational working schedule for all 8 inquiries. Preserve original source stages while logging updated next action, single designated owner, and target resolution date."
          whyMatters="Single ownership prevents overlapping customer communications and conflicting commitments. Original historical stages must remain unaltered to preserve audit trails."
          statusText="8 / 8 Active Plans Tracked"
          outputBadge="Output: Active CRM Working Schedule"
          isActive={activeTaskId === 'S15-T02'}
          onSelectTask={() => setActiveTaskId('S15-T02')}
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>CRM Working Schedule — Operational Action Planning</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Verify individual ownership and forward-looking target dates. Source stages are immutable.
                </p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Auto-saved to Browser Storage
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 w-16">Lead ID</th>
                    <th className="py-2.5 px-3 w-24">Source Stage</th>
                    <th className="py-2.5 px-3 w-36">Assigned Owner</th>
                    <th className="py-2.5 px-3">Updated Next Action</th>
                    <th className="py-2.5 px-3 w-36">Target Date</th>
                    <th className="py-2.5 px-3">Operational Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {CASE_G_LEADS.map((lead) => {
                    const plan = state.leadPlans[lead.id] || {
                      updatedNextAction: lead.sourceNextAction,
                      updatedOwner: lead.sourceOwner,
                      updatedTargetDate: lead.sourceDueDate,
                      notes: '',
                    };

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                          {lead.id}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              lead.sourceStage === 'Won'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : lead.sourceStage === 'Lost'
                                ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            }`}
                          >
                            {lead.sourceStage}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={plan.updatedOwner}
                            onChange={(e) => handleUpdateLeadPlan(lead.id, 'updatedOwner', e.target.value)}
                            className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={plan.updatedNextAction}
                            onChange={(e) => handleUpdateLeadPlan(lead.id, 'updatedNextAction', e.target.value)}
                            className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={plan.updatedTargetDate}
                            onChange={(e) => handleUpdateLeadPlan(lead.id, 'updatedTargetDate', e.target.value)}
                            className="w-full font-mono text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={plan.notes}
                            onChange={(e) => handleUpdateLeadPlan(lead.id, 'notes', e.target.value)}
                            placeholder="Add operational notes..."
                            className="w-full text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
              <strong>Single Accountability Check:</strong> Every lead must have exactly one designated owner. Verify that no two account leads have been assigned to handle the same enquiry.
            </div>
          </div>
        </TaskCard>
      </section>

      {/* ==================================================== */}
      {/* HEADING 2: BUILD THE CRM ACTION QUEUE */}
      {/* ==================================================== */}
      <section id="vcep-area-crm" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase">
            <ListOrdered className="w-4 h-4" />
            <span>Natural Heading 02</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Build the CRM Action Queue
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Calculate dual-denominator conversion rates, isolate overdue open actions as of 31 October, and compose professional customer follow-up outreach.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TASK 03: CALCULATE CONVERSION */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S15-T03"
          taskNumber="TASK 03"
          title="Task 03 — Calculate Conversion Funnel Metrics"
          instruction="Calculate both All-Lead Win Rate (3/8 = 37.5%) and Closed-Lead Win Rate (3/5 = 60.0%). Transparently state explicit denominators and draft a commercial narrative explaining the difference between acquisition yield and closing effectiveness."
          whyMatters="A conversion funnel is mathematically meaningless without explicit denominators. Blending top-of-funnel inquiries with closed decisions masks sales bottlenecks and skews revenue forecasts."
          statusText="Dual Denominators (37.5% & 60.0%)"
          outputBadge="Output: Dual Win-Rate Analysis"
          isActive={activeTaskId === 'S15-T03'}
          onSelectTask={() => setActiveTaskId('S15-T03')}
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Dual-Denominator Win Rate Engine</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                A sales conversion funnel is meaningful only when denominators are transparently labeled. Calculate both rates using Case G records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Metric 1: All-Lead Win Rate */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Acquisition Yield
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Formula: 3 Won ÷ 8 Total
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  All-Lead Win Rate
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Measures the percentage of total top-of-funnel customer inquiries converted to signed revenue.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <div className="relative w-36">
                    <input
                      type="text"
                      value={state.enteredAllLeadRate}
                      onChange={(e) => handleRateChange('enteredAllLeadRate', e.target.value)}
                      className="w-full text-base font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 pr-8 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
                  </div>
                  {isAllLeadRateAccurate ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> 37.5% Verified
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      Expected: 3 / 8 = 37.5%
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Labeled Denominator: <strong>8 Total Inquiries</strong> (3 Won, 2 Lost, 3 Open)
                </div>
              </div>

              {/* Metric 2: Closed-Lead Win Rate */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Closing Effectiveness
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Formula: 3 Won ÷ 5 Closed
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Closed-Lead Win Rate
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Measures sales closing efficiency strictly on completed negotiations that have reached a final decision.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <div className="relative w-36">
                    <input
                      type="text"
                      value={state.enteredClosedLeadRate}
                      onChange={(e) => handleRateChange('enteredClosedLeadRate', e.target.value)}
                      className="w-full text-base font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 pr-8 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
                  </div>
                  {isClosedLeadRateAccurate ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> 60.0% Verified
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      Expected: 3 / 5 = 60.0%
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Labeled Denominator: <strong>5 Closed Deals</strong> (3 Won + 2 Lost; excludes 3 Open)
                </div>
              </div>
            </div>

            {/* Conversion Explanation */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Commercial Narrative & Conversion Explanation
                </label>
                <span className="text-[11px] text-slate-400">
                  {state.conversionExplanation.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={3}
                value={state.conversionExplanation}
                onChange={(e) => handleExplanationChange(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </TaskCard>

        {/* ---------------------------------------------------- */}
        {/* TASK 04: PRIORITISE FOLLOW-UP */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S15-T04"
          taskNumber="TASK 04"
          title="Task 04 — Prioritise Follow-Up & Compose Outreach"
          instruction="Filter open inquiries overdue as of 31 October 2026 (L06: 3 days overdue, L07: 1 day overdue). Draft two professional, milestone-driven follow-up communications referencing prior touchpoints and specific meeting times."
          whyMatters="Follow-ups must be prioritized strictly by business urgency and calendar due date, never demographic or personal traits. Clear deadlines with concrete meeting requests maximize deal velocity."
          statusText="2 Overdue Leads (L06 & L07)"
          outputBadge="Output: 2 Overdue Outreach Drafts"
          isActive={activeTaskId === 'S15-T04'}
          onSelectTask={() => setActiveTaskId('S15-T04')}
        >
          <div className="space-y-6">
            {/* Overdue Queue Cards */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Prioritized Overdue Action Queue (As of 31 October 2026)</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Prioritize open inquiries strictly by business urgency and calendar overdue days. Never prioritize by personal or demographic characteristics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {overdueLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
                        {lead.id}
                      </span>
                      <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                        {lead.followupPriority}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                      {lead.overdueDays} Days Overdue
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                    <div>
                      <strong>Action Required:</strong> {lead.sourceNextAction}
                    </div>
                    <div>
                      <strong>Assigned Owner:</strong> {lead.sourceOwner}
                    </div>
                    <div>
                      <strong>Source Due Date:</strong>{' '}
                      <span className="font-mono text-rose-600 font-semibold">{lead.sourceDueDate}</span> (As-of date: 31 Oct)
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-rose-100 dark:border-rose-900/30 text-[11px] text-slate-600 dark:text-slate-300">
                      <strong>Expressed Need:</strong> {lead.needDescription}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Two Professional Outreach Messages */}
            <div className="space-y-4 pt-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Two Professional Commercial Follow-Up Messages</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Draft targeted follow-up messages for L06 (Confirming Requirements) and L07 (Proposal Review Check-in) with clear milestone dates and professional tone.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Message 1: L06 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="text-indigo-600 font-mono font-bold">1.</span> Follow-Up for Lead L06 (Owner A)
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">Due: 28 Oct (3d Overdue)</span>
                  </div>
                  <textarea
                    rows={7}
                    value={state.messageL06}
                    onChange={(e) => handleMessageChange('messageL06', e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed font-sans"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Context: Requirements confirmation</span>
                    <span>{state.messageL06.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>

                {/* Message 2: L07 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="text-indigo-600 font-mono font-bold">2.</span> Follow-Up for Lead L07 (Owner C)
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">Due: 30 Oct (1d Overdue)</span>
                  </div>
                  <textarea
                    rows={7}
                    value={state.messageL07}
                    onChange={(e) => handleMessageChange('messageL07', e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed font-sans"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Context: Proposal pricing check-in</span>
                    <span>{state.messageL07.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deliverable Governance & Explicit Review Sign-off */}
            <div className="space-y-4 pt-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Deliverable Governance & Named Review Roles</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Record individual accountability. Single ownership per inquiry ensures no duplicate assignments across sales operations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Preparer Name & Title
                  </label>
                  <input
                    type="text"
                    value={state.governance.preparerName}
                    onChange={(e) => handleGovernanceChange('preparerName', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Sales Operations Reviewer
                  </label>
                  <input
                    type="text"
                    value={state.governance.salesReviewerName}
                    onChange={(e) => handleGovernanceChange('salesReviewerName', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Commercial Decision Owner
                  </label>
                  <input
                    type="text"
                    value={state.governance.decisionOwnerName}
                    onChange={(e) => handleGovernanceChange('decisionOwnerName', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Portfolio Handover & Formative Review Drawer */}
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-base font-bold text-white">
                      Portfolio Handover & Formative Review
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Official deliverable file: <code className="text-indigo-300 font-mono font-semibold">{state.governance.fileVersion}</code> containing CRM Tracker, Dual Win-Rate Analysis, and Outreach Queue.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset Inputs</span>
                  </button>
                  <button
                    onClick={handleRunReview}
                    className="text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-md transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Run Formative Review</span>
                  </button>
                </div>
              </div>

              {/* Formative Review Drawer Output */}
              {reviewReport && (
                <div className="rounded-xl bg-slate-950 p-5 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          reviewReport.overallStatus === 'reviewed'
                            ? 'bg-emerald-500'
                            : reviewReport.overallStatus === 'needs_revision'
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                      ></span>
                      <span className="font-bold text-sm text-slate-100">
                        Review Status: {reviewReport.overallStatus.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      Passed {reviewReport.passedChecks} of {reviewReport.totalChecks} Checks ({Math.round((reviewReport.passedChecks / reviewReport.totalChecks) * 100)}%)
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {reviewReport.overallSummary}
                  </p>

                  {reviewReport.revisitRecommendations.length > 0 && (
                    <div className="space-y-1.5 p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
                      <strong className="block text-amber-300 font-semibold">Recommendations to Address:</strong>
                      <ul className="list-disc list-inside space-y-1">
                        {reviewReport.revisitRecommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Stage-by-Stage Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {Object.entries(reviewReport.stages).map(([stageName, stageData]) => (
                      <div
                        key={stageName}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{stageData.title}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              stageData.status === 'reviewed'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : stageData.status === 'needs_revision'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {stageData.passedCount} / {stageData.totalCount}
                          </span>
                        </div>
                        <div className="space-y-1 text-slate-400">
                          {stageData.checks.map((chk) => (
                            <div key={chk.id} className="flex items-center gap-1.5 text-[11px]">
                              {chk.passed ? (
                                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              ) : (
                                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                              )}
                              <span className={chk.passed ? 'text-slate-300' : 'text-amber-300'}>
                                {chk.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Educational Rubric Preview */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {S15_RUBRIC.map((crit) => (
                  <div key={crit.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>{crit.name}</span>
                      <span className="text-indigo-400">{crit.marks} pts</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{crit.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      Evidence: {crit.evidenceExpected}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TaskCard>
      </section>
    </div>
  );
}
