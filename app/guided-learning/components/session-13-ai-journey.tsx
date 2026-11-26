'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S13_STORAGE_KEY,
  CASE_D_MONTHS,
  CASE_D_SUMMARY,
  DATA_CLASSIFICATION_ITEMS,
  RESPONSIBLE_AI_PRINCIPLES,
  OFFLINE_FLAWED_DRAFT_TEXT,
  DRAFT_VERIFICATION_ITEMS,
  DEFAULT_PROMPT_ARCHITECTURE,
  DEFAULT_REVISED_MEMO,
  DEFAULT_AI_GOVERNANCE_LOG,
  S13_RUBRIC,
  loadSession13State,
  saveSession13State,
  clearSession13State,
  type Session13State,
  type DataCategory,
  type PromptArchitecture,
  type RevisedMemo,
  type AIGovernanceLog,
} from './session-13-ai-data.ts';
import { evaluateSession13 } from '../../../lib/review-engine/session-rules/session-13.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  ShieldCheck,
  ShieldAlert,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  RotateCcw,
  Copy,
  Check,
  FileText,
  Layers,
  TrendingUp,
  TrendingDown,
  Info,
  Lock,
  Unlock,
  Table,
  Eye,
  HelpCircle,
  ArrowRight,
  Send,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Session13AIJourneyProps {
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
            <span>{whyOpen ? 'Hide responsible AI principle' : 'Why this matters'}</span>
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

export function Session13AIJourney({ onUpdateDraft }: Session13AIJourneyProps) {
  const [state, setState] = useState<Session13State>(() => loadSession13State());
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [activeTabPrompt, setActiveTabPrompt] = useState<'preview' | 'edit'>('preview');
  const [activeTaskId, setActiveTaskId] = useState<string>('S13-T01');

  const WIZARD_STEPS = [
    { id: 'S13-T01' as const, num: 1, label: 'Task 01: Prepare Safe Inputs', short: '1. Boundaries' },
    { id: 'S13-T02' as const, num: 2, label: 'Task 02: Write a Professional Prompt', short: '2. Prompt' },
    { id: 'S13-T03' as const, num: 3, label: 'Task 03: Review the AI Draft', short: '3. Audit Draft' },
    { id: 'S13-T04' as const, num: 4, label: 'Task 04: Document Human Verification', short: '4. Governance' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  // Hydrate & initial sync
  useEffect(() => {
    const loaded = loadSession13State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', loaded.revisedMemo.revenueBullet + ' ' + loaded.revisedMemo.marginBullet);
      onUpdateDraft('team:contribution', loaded.governanceLog.humanFactChecksSummary);
      onUpdateDraft('team:judgement', loaded.governanceLog.autonomousHumanDecision);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session13State) => Session13State) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession13State(next);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', next.revisedMemo.revenueBullet + ' ' + next.revisedMemo.marginBullet);
        onUpdateDraft('team:contribution', next.governanceLog.humanFactChecksSummary);
        onUpdateDraft('team:judgement', next.governanceLog.autonomousHumanDecision);
      }
      return next;
    });
  };

  // 1. Data Classification handler
  const handleSelectCategory = (itemId: string, category: DataCategory) => {
    updateState((prev) => ({
      ...prev,
      classification: {
        ...prev.classification,
        [itemId]: category,
      },
    }));
  };

  const handleAutoClassifyAll = () => {
    const autoClassified: Record<string, DataCategory> = {};
    for (const item of DATA_CLASSIFICATION_ITEMS) {
      autoClassified[item.id] = item.correctCategory;
    }
    updateState((prev) => ({
      ...prev,
      classification: autoClassified,
    }));
  };

  // 2. Prompt Architecture updater
  const handlePromptChange = (field: keyof PromptArchitecture, val: string) => {
    updateState((prev) => ({
      ...prev,
      promptArchitecture: {
        ...prev.promptArchitecture,
        [field]: val,
      },
    }));
  };

  const handleCopyPrompt = () => {
    const p = state.promptArchitecture;
    const compiled = `[ROLE]\n${p.role}\n\n[TASK]\n${p.task}\n\n[PERMITTED SOURCES]\n${p.permittedSources}\n\n[OUTPUT STRUCTURE]\n${p.outputStructure}\n\n[UNCERTAINTY RULE]\n${p.uncertaintyRule}\n\n[EXPLICIT EXCLUSIONS]\n${p.explicitExclusions}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(compiled);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
      updateState((prev) => ({ ...prev, promptCopied: true }));
    }
  };

  // 3. Verification toggle
  const handleToggleVerification = (verifId: string) => {
    updateState((prev) => {
      const current = prev.verificationChecks[verifId] || false;
      return {
        ...prev,
        verificationChecks: {
          ...prev.verificationChecks,
          [verifId]: !current,
        },
      };
    });
  };

  const handleVerifyAllChecks = () => {
    const verified: Record<string, boolean> = {};
    for (const item of DRAFT_VERIFICATION_ITEMS) {
      verified[item.id] = true;
    }
    updateState((prev) => ({
      ...prev,
      verificationChecks: verified,
    }));
  };

  // 4. Memo updater
  const handleMemoChange = (field: keyof RevisedMemo, val: string) => {
    updateState((prev) => ({
      ...prev,
      revisedMemo: {
        ...prev.revisedMemo,
        [field]: val,
      },
    }));
  };

  // 5. Governance Log updater
  const handleLogChange = (field: keyof AIGovernanceLog, val: string) => {
    updateState((prev) => ({
      ...prev,
      governanceLog: {
        ...prev.governanceLog,
        [field]: val,
      },
    }));
  };

  // 6. Reset Workstation
  const handleReset = () => {
    if (window.confirm('Reset all Session 13 workbench inputs to starting state?')) {
      clearSession13State();
      const fresh = loadSession13State();
      setState(fresh);
      setReviewReport(null);
    }
  };

  // 7. Formative Review Runner
  const handleRunReview = () => {
    const ctx = {
      sessionId: 13,
      draft: {
        'concept:explain': state.revisedMemo.revenueBullet + ' ' + state.revisedMemo.marginBullet,
        'team:contribution': state.governanceLog.humanFactChecksSummary,
        'team:judgement': state.governanceLog.autonomousHumanDecision,
      },
      workstationData: {
        classification: state.classification,
        promptArchitecture: state.promptArchitecture,
        verificationChecks: state.verificationChecks,
        revisedMemo: state.revisedMemo,
        governanceLog: state.governanceLog,
        selfRubricScores: state.selfRubricScores,
        fileVersion: 'StudentID_S13_v01.xlsx',
      },
    };
    const report = evaluateSession13(ctx);
    setReviewReport(report);
  };

  // Computations
  const classificationProgress = useMemo(() => {
    const items = DATA_CLASSIFICATION_ITEMS;
    let correct = 0;
    let chosen = 0;
    for (const item of items) {
      if (state.classification[item.id]) chosen++;
      if (state.classification[item.id] === item.correctCategory) correct++;
    }
    return { chosen, correct, total: items.length };
  }, [state.classification]);

  const verifiedCount = useMemo(() => {
    return Object.values(state.verificationChecks).filter(Boolean).length;
  }, [state.verificationChecks]);

  return (
    <div className="vcep-session-clean-journey w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
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
      {/* ==================================================== */}
      {/* EXECUTIVE MISSION BANNER */}
      {/* ==================================================== */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>Session 13 · Professional Workplace Experience</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Use AI Responsibly. Verify the Work.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Generative AI tools accelerate financial formatting and draft synthesis, but blind reliance creates severe hazards: data confidentiality breaches, plausible-sounding hallucinations, and commercially fatal recommendations. Act as a Lead Commercial Analyst: classify inputs, build bounded prompts, audit flawed drafts against source ledgers, and sign a professional governance log.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href="#vcep-area-task"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>1. Choose Safe AI Task</span>
            </a>
            <a
              href="#vcep-area-verify"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 shadow-md transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>2. Create &amp; Verify Output</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* HEADING 1: CHOOSE A SAFE AI TASK (#vcep-area-task) */}
      {/* ==================================================== */}
      <section id="vcep-area-task" className="vcep-journey-stage-block space-y-8 scroll-mt-20">
        <div className="vcep-journey-section-header border-b border-slate-200 pb-4">
          <div className="vcep-journey-badge-row flex items-center gap-2 text-indigo-600 text-xs font-bold tracking-widest uppercase">
            <Lock className="w-4 h-4" />
            <span className="vcep-pill-navy">WORK AREA 01</span>
            <span className="vcep-pill-teal">DATA MINIMIZATION</span>
            <span className="vcep-pill-gold">BOUNDED PROMPT ARCHITECTURE</span>
          </div>
          <h2 className="vcep-journey-title text-2xl font-bold text-slate-900 mt-1">
            1. Choose a Safe AI Task
          </h2>
          <p className="vcep-journey-subtitle text-sm text-slate-600 mt-1">
            Establish data minimization boundaries before touching any AI model, then structure a 6-part bounded prompt that prevents ungrounded hallucinations.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TASK 01: PREPARE SAFE INPUTS (S13-T01) */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S13-T01"
          taskNumber="Task 01"
          title="Prepare Safe Inputs"
          instruction="Classify financial records into approved aggregates or private identifiers to establish data privacy boundaries."
          learningTakeaway="Never input sensitive customer PII or proprietary banking identifiers into public AI models."
          whyMatters="Under enterprise compliance, GDPR, and Indian DPDP guidelines, customer identities, individual salaries, and banking credentials must never be inputted into third-party AI models. Only high-level anonymized aggregates are safe for business intelligence."
          statusText={`${classificationProgress.correct} / ${classificationProgress.total} Safe`}
          isActive={activeTaskId === 'S13-T01'}
          onSelectTask={() => setActiveTaskId('S13-T01')}
        >
          {/* Principles Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {RESPONSIBLE_AI_PRINCIPLES.map((p) => (
              <div
                key={p.principleNum}
                style={{
                  padding: '12px',
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F766E' }}>
                    PRINCIPLE {p.principleNum}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: '#E0F2FE',
                      color: '#0369A1',
                      fontWeight: 600,
                    }}
                  >
                    {p.badge}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 700, color: '#17245C' }}>
                  {p.title}
                </h4>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#64748B', lineHeight: 1.45 }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>

          {/* Classification Gate */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Data Classification &amp; Boundary Checklist
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select <strong className="text-emerald-700">Safe Aggregate</strong> for sanitized totals or <strong className="text-rose-700">Prohibited Private</strong> for customer/banking secrets.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAutoClassifyAll}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors self-start sm:self-auto"
              >
                Apply Standard Classification
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DATA_CLASSIFICATION_ITEMS.map((item) => {
                const selected = state.classification[item.id];
                const isCorrect = selected === item.correctCategory;

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl p-4 border transition-all ${
                      selected
                        ? isCorrect
                          ? 'border-emerald-300 bg-emerald-50/40'
                          : 'border-rose-300 bg-rose-50/40'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {item.id}
                      </span>
                      {selected && (
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <Check className="w-3 h-3" /> Safe Boundary
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3" /> Breach Risk
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    <h5 className="text-sm font-bold text-slate-800 mt-2">
                      {item.name}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Classification Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleSelectCategory(item.id, 'safe-aggregate')}
                        className={`text-xs font-semibold py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                          selected === 'safe-aggregate'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Unlock className="w-3 h-3" />
                        <span>Safe Aggregate</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectCategory(item.id, 'prohibited-private')}
                        className={`text-xs font-semibold py-1.5 px-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                          selected === 'prohibited-private'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        <span>Prohibited Private</span>
                      </button>
                    </div>

                    {selected && (
                      <div className="mt-2 text-[11px] text-slate-500 italic">
                        {item.rationale}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TaskCard>

        {/* ---------------------------------------------------- */}
        {/* TASK 02: WRITE A PROFESSIONAL PROMPT (S13-T02) */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S13-T02"
          taskNumber="Task 02"
          title="Write a Professional Prompt"
          instruction="Structure a 6-part enterprise prompt with explicit roles, verified sources, and strict model exclusions."
          learningTakeaway="Ground AI prompts in specific source documents and forbid speculative hallucinations."
          whyMatters="Unguided prompts induce conversational AI models to invent plausible-sounding numbers and offer unqualified business advice. Explicit bounding forces the model to cite verified data and admit data limitations."
          statusText="6/6 Elements Bounded"
          isActive={activeTaskId === 'S13-T02'}
          onSelectTask={() => setActiveTaskId('S13-T02')}
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-600">
                Configure bounded parameters or view compiled enterprise prompt syntax:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTabPrompt(activeTabPrompt === 'preview' ? 'edit' : 'preview')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>{activeTabPrompt === 'preview' ? 'Customize Fields' : 'Compiled View'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Structured Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {activeTabPrompt === 'edit' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="text-indigo-600 font-mono">1.</span> Role Specification
                  </label>
                  <input
                    type="text"
                    value={state.promptArchitecture.role}
                    onChange={(e) => handlePromptChange('role', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="text-indigo-600 font-mono">2.</span> Precise Task Scope
                  </label>
                  <input
                    type="text"
                    value={state.promptArchitecture.task}
                    onChange={(e) => handlePromptChange('task', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="text-indigo-600 font-mono">3.</span> Permitted Sources (Bounding Fence)
                  </label>
                  <textarea
                    rows={2}
                    value={state.promptArchitecture.permittedSources}
                    onChange={(e) => handlePromptChange('permittedSources', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="text-indigo-600 font-mono">4.</span> Expected Output Structure
                  </label>
                  <textarea
                    rows={2}
                    value={state.promptArchitecture.outputStructure}
                    onChange={(e) => handlePromptChange('outputStructure', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="text-indigo-600 font-mono">5.</span> Uncertainty Handling Rule
                  </label>
                  <textarea
                    rows={2}
                    value={state.promptArchitecture.uncertaintyRule}
                    onChange={(e) => handlePromptChange('uncertaintyRule', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="text-indigo-600 font-mono">6.</span> Explicit Model Exclusions
                  </label>
                  <textarea
                    rows={2}
                    value={state.promptArchitecture.explicitExclusions}
                    onChange={(e) => handlePromptChange('explicitExclusions', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 text-slate-200 rounded-xl p-5 font-mono text-xs space-y-4 border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span>COMPILED ENTERPRISE AI PROMPT (BOUNDED TO CASE D)</span>
                  </div>
                  <span>6 of 6 Components Specified</span>
                </div>

                <div className="space-y-3 leading-relaxed">
                  <div>
                    <span className="text-indigo-400 font-bold">[1. ROLE]</span> {state.promptArchitecture.role}
                  </div>
                  <div>
                    <span className="text-indigo-400 font-bold">[2. TASK]</span> {state.promptArchitecture.task}
                  </div>
                  <div>
                    <span className="text-indigo-400 font-bold">[3. PERMITTED SOURCES]</span> {state.promptArchitecture.permittedSources}
                  </div>
                  <div>
                    <span className="text-indigo-400 font-bold">[4. OUTPUT STRUCTURE]</span> {state.promptArchitecture.outputStructure}
                  </div>
                  <div>
                    <span className="text-amber-400 font-bold">[5. UNCERTAINTY RULE]</span> {state.promptArchitecture.uncertaintyRule}
                  </div>
                  <div>
                    <span className="text-rose-400 font-bold">[6. EXPLICIT EXCLUSIONS]</span> {state.promptArchitecture.explicitExclusions}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TaskCard>
      </section>

      {/* ==================================================== */}
      {/* HEADING 2: CREATE & VERIFY THE OUTPUT (#vcep-area-verify) */}
      {/* ==================================================== */}
      <section id="vcep-area-verify" className="vcep-journey-stage-block space-y-8 scroll-mt-20">
        <div className="vcep-journey-section-header border-b border-slate-200 pb-4">
          <div className="vcep-journey-badge-row flex items-center gap-2 text-indigo-600 text-xs font-bold tracking-widest uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span className="vcep-pill-navy">WORK AREA 02</span>
            <span className="vcep-pill-teal">INDEPENDENT VERIFICATION</span>
            <span className="vcep-pill-gold">AI GOVERNANCE &amp; AUDIT TRAIL</span>
          </div>
          <h2 className="vcep-journey-title text-2xl font-bold text-slate-900 mt-1">
            2. Create &amp; Verify the Output
          </h2>
          <p className="vcep-journey-subtitle text-sm text-slate-600 mt-1">
            Compare generated or offline model commentary side-by-side with Case D financial ground truth. Identify hallucinations, calculate true ratios, draft the revised memo, and log the governance trail.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TASK 03: REVIEW THE AI DRAFT (S13-T03) */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S13-T03"
          taskNumber="Task 03"
          title="Review the AI Draft"
          instruction="Compare flawed AI text side-by-side with Case D financial ground truth to catch hallucinations."
          learningTakeaway="Always audit AI draft metrics against primary accounting records before accepting them."
          whyMatters="AI models generate syntactically convincing but factually incorrect assertions. An analyst must independently compute MoM growth (+25%), calculate true operating margin (20%), and reject hallucinated customer payment assumptions."
          statusText={`${verifiedCount} / 4 Claims Audited`}
          isActive={activeTaskId === 'S13-T03'}
          onSelectTask={() => setActiveTaskId('S13-T03')}
        >
          {/* Side-by-side Source vs Draft */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
            {/* Left: Case D Ground Truth Table (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Case D Three-Month MIS (Ground Truth)
                  </h4>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Range: CaseD!B2:D6
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2 px-2.5">Metric / Line Item</th>
                      <th className="py-2 px-2.5 text-right">July (₹)</th>
                      <th className="py-2 px-2.5 text-right">August (₹)</th>
                      <th className="py-2 px-2.5 text-right">September (₹)</th>
                      <th className="py-2 px-2.5 text-right">Q1 Trend / Analysis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 font-semibold text-slate-900">Gross Revenue</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹100,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹120,000</td>
                      <td className="py-2 px-2.5 text-right font-mono font-bold text-indigo-700">₹150,000</td>
                      <td className="py-2 px-2.5 text-right font-mono font-semibold">₹370,000 <span className="text-[10px] text-emerald-600">(+25.0% MoM)</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 text-slate-600">Direct Delivery Costs</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹40,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹54,000</td>
                      <td className="py-2 px-2.5 text-right font-mono font-semibold text-rose-600">₹75,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹169,000 <span className="text-[10px] text-rose-600">(+38.9%)</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-slate-50/50 font-medium">
                      <td className="py-2 px-2.5">Gross Profit</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹60,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹66,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹75,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹201,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 text-slate-500">Gross Margin %</td>
                      <td className="py-2 px-2.5 text-right font-mono">60.0%</td>
                      <td className="py-2 px-2.5 text-right font-mono">55.0%</td>
                      <td className="py-2 px-2.5 text-right font-mono text-amber-600 font-bold">50.0%</td>
                      <td className="py-2 px-2.5 text-right font-mono text-amber-600">54.3% (Compressed)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 text-slate-600">Overheads</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹35,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹39,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹45,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹119,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-indigo-50/40 font-bold">
                      <td className="py-2 px-2.5 text-indigo-950">Operating Profit</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹25,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹27,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹30,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹82,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-indigo-50/20">
                      <td className="py-2 px-2.5 font-semibold text-slate-900">Operating Margin %</td>
                      <td className="py-2 px-2.5 text-right font-mono font-medium">25.0%</td>
                      <td className="py-2 px-2.5 text-right font-mono font-medium">22.5%</td>
                      <td className="py-2 px-2.5 text-right font-mono font-bold text-rose-600">20.0%</td>
                      <td className="py-2 px-2.5 text-right font-mono font-semibold">22.2% (Decaying)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 text-slate-700 font-semibold">Closing Trade Receivables</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹30,000</td>
                      <td className="py-2 px-2.5 text-right font-mono">₹45,000</td>
                      <td className="py-2 px-2.5 text-right font-mono font-bold text-amber-600">₹70,000</td>
                      <td className="py-2 px-2.5 text-right font-mono text-amber-600">+133% vs Jul</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 text-slate-500">Receivables as % of Revenue</td>
                      <td className="py-2 px-2.5 text-right font-mono">30.0%</td>
                      <td className="py-2 px-2.5 text-right font-mono">37.5%</td>
                      <td className="py-2 px-2.5 text-right font-mono font-bold text-rose-600">46.7%</td>
                      <td className="py-2 px-2.5 text-right font-mono text-rose-600">Elevated Cash Lockup</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Crucial Audit Fact:</strong> Case D contains <em>only monthly financial line items</em>. It provides <strong>zero customer payment logs, collection receipts, or credit terms</strong>. Any assertion regarding customer payment behavior is an ungrounded hallucination.
                </span>
              </div>
            </div>

            {/* Right: Offline Flawed AI Draft (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Unverified Offline AI Draft
                  </h4>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-300">
                  Draft: S13-FLAWED-V01
                </span>
              </div>

              <div className="bg-rose-50/60 rounded-xl p-3.5 border border-rose-200 space-y-2">
                <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wide">
                  Raw AI Output (Generated without Bounding Fences):
                </p>
                <blockquote className="text-xs italic text-slate-800 border-l-4 border-rose-500 pl-3 py-1 leading-relaxed">
                  &ldquo;{OFFLINE_FLAWED_DRAFT_TEXT}&rdquo;
                </blockquote>
              </div>

              <div className="space-y-1.5">
                <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Diagnosed Flaws in this Draft:
                </h5>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong className="text-rose-600">False Revenue Metric:</strong> Claims 30% growth (true: 25.0%).</li>
                  <li><strong className="text-rose-600">False Margin Metric:</strong> Claims margin improved to 25% (true: dropped to 20.0%).</li>
                  <li><strong className="text-rose-600">Pure Hallucination:</strong> Claims all customers paid on time (zero source data).</li>
                  <li><strong className="text-rose-600">Fatal Recommendation:</strong> 20% discount wipes out entire operating profit!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Four-Point Verification Audit */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Four-Point Human Verification Audit
                </h4>
                <p className="text-xs text-slate-500">
                  Audit each AI assertion against the Case D ledger. Check off each finding to confirm fact-checking.
                </p>
              </div>
              <button
                type="button"
                onClick={handleVerifyAllChecks}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors self-start sm:self-auto"
              >
                Verify All 4 Flaws
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DRAFT_VERIFICATION_ITEMS.map((item, idx) => {
                const isChecked = state.verificationChecks[item.id] || false;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleVerification(item.id)}
                    className={`cursor-pointer rounded-xl p-4 border transition-all ${
                      isChecked
                        ? 'border-indigo-300 bg-indigo-50/40'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by div click
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Check 0{idx + 1}: &ldquo;{item.claimSnippet}&rdquo;
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.claimStatus === 'Fatal Recommendation'
                            ? 'bg-rose-100 text-rose-700'
                            : item.claimStatus === 'Hallucination'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.claimStatus}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                        <strong>Source Truth:</strong> {item.sourceGroundTruth}
                      </div>
                      <div className="text-slate-600 pl-1 leading-relaxed">
                        {item.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TaskCard>

        {/* ---------------------------------------------------- */}
        {/* TASK 04: DOCUMENT HUMAN VERIFICATION (S13-T04) */}
        {/* ---------------------------------------------------- */}
        <TaskCard
          taskId="S13-T04"
          taskNumber="Task 04"
          title="Document Human Verification"
          instruction="Draft human-verified management memo, maintain mandatory AI-use disclosure log, and submit governance review."
          learningTakeaway="Humans hold final accountability for all financial analysis and commercial recommendations."
          whyMatters="Enterprise governance requires a permanent audit trail documenting tools used, prompts issued, fact-checking audits conducted, and autonomous human decisions made. Human accountants retain legal and ethical liability for commercial counsel."
          statusText="Governance Log Signed"
          isActive={activeTaskId === 'S13-T04'}
          onSelectTask={() => setActiveTaskId('S13-T04')}
        >
          {/* Human-Revised Executive Management Memo */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Human-Revised Executive Management Memo
                </h4>
                <p className="text-xs text-slate-500">
                  Replace the flawed AI draft with verified, source-bounded commercial commentary for executive leadership.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>1. Revenue Trajectory (Month-on-Month Growth)</span>
                  <span className="text-[11px] font-mono text-emerald-600 font-normal">Must cite +25.0% MoM growth</span>
                </label>
                <textarea
                  rows={2}
                  value={state.revisedMemo.revenueBullet}
                  onChange={(e) => handleMemoChange('revenueBullet', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>2. Cost &amp; Margin Compression (Direct Cost Escalation)</span>
                  <span className="text-[11px] font-mono text-rose-600 font-normal">Must cite 20.0% operating margin decay</span>
                </label>
                <textarea
                  rows={2}
                  value={state.revisedMemo.marginBullet}
                  onChange={(e) => handleMemoChange('marginBullet', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>3. Working Capital Alert (Closing Receivables Spike)</span>
                  <span className="text-[11px] font-mono text-amber-600 font-normal">Must cite ₹70,000 receivables &amp; note lack of collection logs</span>
                </label>
                <textarea
                  rows={2}
                  value={state.revisedMemo.workingCapitalBullet}
                  onChange={(e) => handleMemoChange('workingCapitalBullet', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>4. Actionable Management Advice (Commercial Strategy)</span>
                  <span className="text-[11px] font-mono text-indigo-600 font-normal">Must reject price discounting; focus on credit control</span>
                </label>
                <textarea
                  rows={2}
                  value={state.revisedMemo.recommendationBullet}
                  onChange={(e) => handleMemoChange('recommendationBullet', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Mandatory AI Governance & Disclosure Log */}
          <div className="space-y-4 mb-8 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Mandatory AI-Use Disclosure &amp; Accountability Log
                </h4>
                <p className="text-xs text-slate-500">
                  Every enterprise artifact involving AI requires an immutable governance record tracking tools, inputs, prompt refs, human corrections, and autonomous judgment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  AI Tool &amp; Version / Run Date
                </label>
                <input
                  type="text"
                  value={state.governanceLog.aiToolAndDate}
                  onChange={(e) => handleLogChange('aiToolAndDate', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Permitted Source Reference
                </label>
                <input
                  type="text"
                  value={state.governanceLog.permittedInputRef}
                  onChange={(e) => handleLogChange('permittedInputRef', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Prompt Architecture Reference ID
                </label>
                <input
                  type="text"
                  value={state.governanceLog.promptArchitectureRef}
                  onChange={(e) => handleLogChange('promptArchitectureRef', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Human Reviewer Name &amp; Title
                </label>
                <input
                  type="text"
                  value={state.governanceLog.humanReviewerName}
                  onChange={(e) => handleLogChange('humanReviewerName', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Human Fact-Checking Audit Summary
                </label>
                <textarea
                  rows={2}
                  value={state.governanceLog.humanFactChecksSummary}
                  onChange={(e) => handleLogChange('humanFactChecksSummary', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Autonomous Human Managerial Judgment (Exercised Independently)
                </label>
                <textarea
                  rows={2}
                  value={state.governanceLog.autonomousHumanDecision}
                  onChange={(e) => handleLogChange('autonomousHumanDecision', e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Deliverable Handover & Formative Review Controls */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-base font-bold text-white">
                    Portfolio Handover &amp; Formative Evaluation
                  </h4>
                </div>
                <p className="text-xs text-slate-400">
                  Official deliverable: <code className="text-indigo-300 font-mono font-semibold">StudentID_S13_v01.xlsx</code> containing Verified Commentary &amp; AI Audit Sheet.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Inputs</span>
                </button>
                <button
                  type="button"
                  onClick={handleRunReview}
                  className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                  <span>Run Formative Review</span>
                </button>
              </div>
            </div>

            {/* Formative Review Drawer Output */}
            {reviewReport && (
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
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
                    <span className="font-bold text-xs text-slate-100">
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
                  <div className="space-y-1 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
                    <strong className="block text-amber-300 font-semibold">Recommendations to Address:</strong>
                    <ul className="list-disc list-inside space-y-0.5">
                      {reviewReport.revisitRecommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stage-by-Stage Checks Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1.5">
                  {Object.entries(reviewReport.stages).map(([stageName, stageData]) => (
                    <div
                      key={stageName}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1"
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
            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {S13_RUBRIC.map((crit) => (
                <div key={crit.id} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span>{crit.name}</span>
                    <span className="text-teal-400">{crit.weight}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{crit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </TaskCard>
      </section>

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
          {currentStepIdx === WIZARD_STEPS.length - 1 ? 'AI Workflow Complete ✓' : 'Save & Continue →'}
        </button>
      </footer>
    </div>
  );
}
