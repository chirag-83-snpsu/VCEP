'use client';

import React, { useState, useEffect } from 'react';
import {
  SESSION_22_STORAGE_KEY,
  DEFAULT_SESSION_22_STATE,
  INITIAL_INTERVIEW_EVIDENCE,
  INITIAL_DEVELOPMENT_PLAN,
  CORE_VIVA_SCENARIOS,
  S22_RUBRIC,
  INITIAL_CHECKLIST_LABELS,
  InterviewEvidenceItem,
  DevelopmentMilestone,
  Session22State,
} from './session-22-hiring-data';
import {
  Lock,
  Clock,
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  ChevronRight,
  UserCheck,
  HelpCircle,
  FileSpreadsheet,
  Target,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

interface TaskCardProps {
  taskId: string;
  taskNumber: string;
  title: string;
  instruction: string;
  learningTakeaway?: string;
  whyMatters?: string;
  statusText?: string;
  persistenceText?: string;
  outputBadge?: string;
  isActive?: boolean;
  onSelect?: () => void;
  onSelectTask?: () => void;
  children: React.ReactNode;
}

function TaskCard({
  taskId,
  taskNumber,
  title,
  instruction,
  learningTakeaway,
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
        display: isActive ? 'block' : 'none',
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

      {/* Task Instruction */}
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
            aria-expanded={whyOpen}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0F766E',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            <HelpCircle size={13} />
            <span>Why this matters</span>
            {whyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {whyOpen && (
            <div
              style={{
                marginTop: '8px',
                padding: '12px 14px',
                background: '#F0FDFA',
                border: '1px solid #CCFBF1',
                borderRadius: '8px',
                fontSize: '12.5px',
                color: '#134E4A',
                lineHeight: 1.5,
              }}
            >
              {whyMatters}
            </div>
          )}
        </div>
      )}

      {/* Card Content / Work Area */}
      <div>{children}</div>
    </article>
  );
}

const WIZARD_STEPS = [
  { id: 'S22-T01' as const, num: 1, label: 'Task 01 — Prepare Interview Evidence', short: '1. Evidence' },
  { id: 'S22-T02' as const, num: 2, label: 'Task 02 — Defend Your Work', short: '2. Defend Work' },
  { id: 'S22-T03' as const, num: 3, label: 'Task 03 — Plan the Next 30 Days', short: '3. 30-Day Plan' },
];

interface Props {
  onUpdateDraft?: (field: string, value: any) => void;
}

export function Session22HiringJourney({ onUpdateDraft }: Props) {
  const [activeTaskId, setActiveTaskId] = useState<string>('S22-T01');
  const [state, setState] = useState<Session22State>(DEFAULT_SESSION_22_STATE);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');
  const [activeScenarioId, setActiveScenarioId] = useState<string>('V1');

  const currentStepIdx = Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_22_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (updated: Session22State) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    const withTime = { ...updated, timestamp };
    setState(withTime);
    try {
      localStorage.setItem(SESSION_22_STORAGE_KEY, JSON.stringify(withTime));
    } catch {}
    if (onUpdateDraft) {
      onUpdateDraft('session-22-state', withTime);
    }
  };

  const handleReset = () => {
    saveState({ ...DEFAULT_SESSION_22_STATE, timestamp: new Date().toLocaleTimeString() });
  };

  const handleToggleChecklist = (index: number) => {
    const next = [...state.checklist];
    next[index] = !next[index];
    saveState({ ...state, checklist: next });
  };

  const handleUpdateEvidence = (index: number, updatedFields: Partial<InterviewEvidenceItem>) => {
    const next = [...state.interviewEvidence];
    next[index] = { ...next[index], ...updatedFields };
    saveState({ ...state, interviewEvidence: next });
  };

  const handleUpdateMilestone = (index: number, updatedFields: Partial<DevelopmentMilestone>) => {
    const next = [...state.developmentPlan];
    next[index] = { ...next[index], ...updatedFields };
    saveState({ ...state, developmentPlan: next });
  };

  // Word count validators
  const strongestWords = state.strongestTaskReflection.trim().split(/\s+/).filter(Boolean).length;
  const ethicalWords = state.ethicalResponse.trim().split(/\s+/).filter(Boolean).length;
  const contribWords = state.studentContribution.trim().split(/\s+/).filter(Boolean).length;
  const correctWords = state.reviewerCorrection.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="vcep-workstation-root" style={{ color: '#17245C' }}>
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

      {/* ============================================================== */}
      {/* NATURAL HEADING 1: PREPARE FOR THE HIRING CONVERSATION         */}
      {/* ============================================================== */}
      <section id="vcep-area-prepare" className="vcep-workstation-section" style={{ marginBottom: '32px' }}>
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow" style={{ color: '#0F766E', fontWeight: 700, letterSpacing: '0.05em' }}>
            HEADING 1 · CONTROLLED ASSESSMENT PROTOCOL & TECHNICAL VIVA ORIENTATION
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#17245C', margin: '4px 0 8px', fontWeight: 800 }}>
            1. Prepare for the Hiring Conversation
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            Show Your Skills Independently. Review controlled examination conditions for the unseen 60-minute Exit B
            assessment, clarify pre-test logistics, and practice structured technical viva defense across core VCEP concepts.
          </p>
        </div>

        {/* Controlled Assessment Security Banner */}
        <div
          style={{
            background: '#17245C',
            border: '1.5px solid #312e81',
            borderRadius: '10px',
            padding: '18px 22px',
            color: '#ffffff',
            margin: '20px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={22} style={{ color: '#E5AF2E' }} />
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#E5AF2E',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  OFFICIAL SUMMATIVE EXAMINATION · PROTOCOL RESTRICTION
                </span>
                <h3 style={{ margin: '2px 0 0', color: '#ffffff', fontSize: '1.25rem', fontWeight: 800 }}>
                  Controlled Exit B Assessment & Technical Hiring Viva
                </h3>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.1)',
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Clock size={16} style={{ color: '#E5AF2E' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                60 MIN INDEPENDENT · ZERO AI ASSISTANCE
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: '0 0 12px', lineHeight: 1.5 }}>
            <strong>Assessment Security Notice:</strong> The unseen individual Exit B assessment is delivered separately by
            faculty through protected institutional channels. Test questions and solution keys never enter public client
            bundles or AI retrieval indexes. During both Exit B and your three-minute viva interview, all generative AI
            and peer assistance are strictly locked.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '10px',
              fontSize: '0.78rem',
              color: '#e2e8f0',
              background: 'rgba(0,0,0,0.25)',
              padding: '12px',
              borderRadius: '6px',
            }}
          >
            <div>
              <strong style={{ color: '#E5AF2E' }}>1. Unseen Independent Execution:</strong> Full certification requires
              verifying your unassisted spreadsheet modeling ability under timed pressure.
            </div>
            <div>
              <strong style={{ color: '#38bdf8' }}>2. Technical Viva Defense:</strong> Execute and defend. Be prepared to
              explain every formula, date rule, and accounting classification under panel interrogation.
            </div>
            <div>
              <strong style={{ color: '#4ade80' }}>3. Uncompromising Integrity:</strong> Uphold ICAI ethics. Never plug
              unverified discrepancies or conceal suspense items to force a reconciliation.
            </div>
          </div>
        </div>

        {/* Pre-Assessment Logistical Clarifications (Permitted Logistics Only) */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '18px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <HelpCircle size={18} color="#0F766E" />
            <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
              Pre-Assessment Logistics & Verification Guidelines (Permitted Orientation)
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px' }}>
            Review these verified logistical instructions prior to receiving your unseen Exit B question paper from the faculty lead.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            {state.clarificationQuestions.map((q, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '0.8rem',
                  color: '#334155',
                  lineHeight: 1.45,
                }}
              >
                <strong style={{ color: '#0F766E', display: 'block', marginBottom: '3px' }}>
                  Rule {idx + 1}:
                </strong>
                {q}
              </div>
            ))}
          </div>
        </div>

        {/* TASK 01: PREPARE INTERVIEW EVIDENCE */}
        <TaskCard
          taskId="S22-T01"
          taskNumber="TASK 01"
          title="Prepare Interview Evidence"
          instruction="Review five core technical viva scenarios to ground your interview defense in verified portfolio deliverables."
          learningTakeaway="Anchor viva explanations in verified portfolio calculations rather than theoretical textbook definitions."
          whyMatters="Enterprise hiring panels test practical execution and technical reasoning under pressure. Inspecting core VCEP commercial scenarios and selecting genuine portfolio corrections allows candidates to demonstrate unvarnished authenticity, show exact calculation methods, and label uncertainty without pretension."
          outputBadge="Viva Defense Scenarios & Portfolio Evidence"
          persistenceText="State Preserved"
          isActive={activeTaskId === 'S22-T01'}
          onSelectTask={() => setActiveTaskId('S22-T01')}
        >
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                  Five Core Technical Viva Voce Defense Scenarios
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                  Practice articulating your technical reasoning across foundational VCEP commerce standards.
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 700 }}>
                Select Scenario to Inspect Defense
              </span>
            </div>

            {/* Scenario Selector Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {CORE_VIVA_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveScenarioId(s.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid #cbd5e1',
                    background: activeScenarioId === s.id ? '#17245C' : '#ffffff',
                    color: activeScenarioId === s.id ? '#ffffff' : '#475569',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {s.id}: {s.category}
                </button>
              ))}
            </div>

            {/* Active Scenario Card */}
            {(() => {
              const active = CORE_VIVA_SCENARIOS.find((s) => s.id === activeScenarioId) || CORE_VIVA_SCENARIOS[0];
              return (
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #0F766E',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase' }}>
                      {active.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      Technical Focus: {active.keyTechnicalConcept}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.92rem', color: '#17245C', fontWeight: 800, margin: '6px 0 10px', lineHeight: 1.4 }}>
                    Examiner Question: "{active.examinerQuestion}"
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                      color: '#1e293b',
                      lineHeight: 1.5,
                    }}
                  >
                    <strong style={{ color: '#15803d', display: 'block', marginBottom: '4px' }}>
                      Model Candidate Defense (STAR+V Framework):
                    </strong>
                    {active.candidateDefense}
                  </div>
                </div>
              );
            })()}
          </div>
        </TaskCard>
      </section>

      {/* ============================================================== */}
      {/* NATURAL HEADING 2: COMPLETE YOUR VERIFIED REVIEW               */}
      {/* ============================================================== */}
      <section id="vcep-area-review" className="vcep-workstation-section" style={{ marginBottom: '32px' }}>
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow" style={{ color: '#0F766E', fontWeight: 700, letterSpacing: '0.05em' }}>
            HEADING 2 · THREE-MINUTE STRUCTURED INTERVIEW & 30-DAY ACTION PLAN
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#17245C', margin: '4px 0 8px', fontWeight: 800 }}>
            2. Complete Your Verified Review
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            Structure your viva voce defense across three mandatory prompts: a completed task, a verified error correction,
            and an ethical escalation decision. Capture human interviewer feedback and formulate a concrete 30-day development plan.
          </p>
        </div>

        {/* TASK 02: DEFEND YOUR WORK */}
        <TaskCard
          taskId="S22-T02"
          taskNumber="TASK 02"
          title="Defend Your Work"
          instruction="Complete the three-part STAR+V evidence register and defend error corrections and ethical escalation boundaries."
          learningTakeaway="Articulate technical accomplishments and ethical positions using structured, auditable evidence."
          whyMatters="Technical interviews require proving personal contribution, error correction, and ethical firmness. Articulating the exact mathematical verification and refusing to conceal suspense discrepancies proves commercial integrity and readiness for fiduciary responsibility."
          outputBadge="Three-Part STAR+V & Ethical Defense"
          persistenceText={draftTimestamp ? `Auto-saved at ${draftTimestamp}` : 'Auto-saved'}
          isActive={activeTaskId === 'S22-T02'}
          onSelectTask={() => setActiveTaskId('S22-T02')}
        >
          {/* Three-Part Structured Interview Evidence Register (STAR+V) */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                  Three-Part Structured Viva Voce Evidence Register
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                  Required Prompts (Curriculum Docx Par 24–30): Task Completed · Error Corrected · Decision Escalated
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>
                All 3 STAR+V Cases Complete ✓
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {state.interviewEvidence.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#17245C', fontSize: '0.85rem' }}>{item.id}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F766E' }}>{item.prompt}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      Ref: {item.evidenceRef}
                    </span>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '3px' }}>
                      Defense Topic Title:
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateEvidence(idx, { title: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 700, color: '#17245C' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                        Situation (Context & Problem):
                      </label>
                      <textarea
                        rows={2}
                        value={item.situation}
                        onChange={(e) => handleUpdateEvidence(idx, { situation: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                        Personal Task (What Was Yours):
                      </label>
                      <textarea
                        rows={2}
                        value={item.personalTask}
                        onChange={(e) => handleUpdateEvidence(idx, { personalTask: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                        Action Taken (Technical Method):
                      </label>
                      <textarea
                        rows={2}
                        value={item.actionTaken}
                        onChange={(e) => handleUpdateEvidence(idx, { actionTaken: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                        Result Verified (Mathematical Proof):
                      </label>
                      <textarea
                        rows={2}
                        value={item.resultVerified}
                        onChange={(e) => handleUpdateEvidence(idx, { resultVerified: e.target.value })}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ethical Escalation Challenge Reflection (ICAI Code of Ethics) */}
          <div style={{ background: '#fefce8', border: '1.5px solid #b45309', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <AlertTriangle size={18} color="#b45309" />
              <h4 style={{ fontSize: '1rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                Ethical Cross-Examination: Refusal to Conceal Suspense Discrepancies
              </h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 10px', lineHeight: 1.45 }}>
              <em>"What would you do if a manager asked you to hide an unverified ₹5,000 difference or remove a suspense account to force the ledger to cross-foot before Friday close?"</em>
            </p>

            <textarea
              rows={4}
              value={state.ethicalResponse}
              onChange={(e) => saveState({ ...state, ethicalResponse: e.target.value })}
              placeholder="Explain your ethical compliance boundary and professional escalation steps under ICAI standards..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                lineHeight: 1.45,
                fontFamily: 'inherit',
                color: '#1e293b',
                background: '#ffffff',
                marginBottom: '6px',
              }}
            />
            <div style={{ textAlign: 'right', fontSize: '0.72rem', color: ethicalWords >= 35 ? '#15803d' : '#b45309', fontWeight: 600 }}>
              {ethicalWords} words (min 35 words required)
            </div>
          </div>

          {/* Strongest Independent Task Reflection */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
              <h4 style={{ fontSize: '1rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                My Strongest Independent Task Reflection (Curriculum Docx Par 41–44)
              </h4>
              <span style={{ fontSize: '0.72rem', color: strongestWords >= 35 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                {strongestWords} words (min 35 words)
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 10px' }}>
              Describe your single strongest autonomous accomplishment in VCEP, detailing mathematical proof and limitation awareness.
            </p>

            <textarea
              rows={3}
              value={state.strongestTaskReflection}
              onChange={(e) => saveState({ ...state, strongestTaskReflection: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                lineHeight: 1.45,
                fontFamily: 'inherit',
                color: '#1e293b',
                background: '#ffffff',
              }}
            />
          </div>
        </TaskCard>

        {/* TASK 03: PLAN THE NEXT 30 DAYS */}
        <TaskCard
          taskId="S22-T03"
          taskNumber="TASK 03"
          title="Plan the Next 30 Days"
          instruction="Formulate a 30-day post-assessment improvement plan and record human interviewer feedback and governance sign-offs."
          learningTakeaway="Translate hiring panel feedback into actionable development commitments and career progression milestones."
          whyMatters="Professional competence is dynamic; top performers convert hiring panel feedback into actionable development commitments. Structuring a 30-day plan with concrete capability milestones and governance sign-offs establishes a clear trajectory toward corporate placement."
          outputBadge="30-Day Plan & Panel Feedback"
          persistenceText="State Preserved"
          isActive={activeTaskId === 'S22-T03'}
          onSelectTask={() => setActiveTaskId('S22-T03')}
        >
          {/* 30-Day Post-Assessment Development Plan Table */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                  30-Day Post-Assessment Competency Improvement Plan
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                  Formulated after faculty feedback (Curriculum Docx Par 31–34 & 45–48): Capability Gap · Practice Action · Review Date
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 700 }}>
                3 Structured Milestones ✓
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', background: '#ffffff', borderRadius: '6px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C', width: '160px' }}>Milestone Window</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Identified Capability Gap</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Concrete Practice Action</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C', width: '160px' }}>Target Review Date</th>
                  </tr>
                </thead>
                <tbody>
                  {state.developmentPlan.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0F766E' }}>{m.milestone}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <input
                          type="text"
                          value={m.capabilityGap}
                          onChange={(e) => handleUpdateMilestone(idx, { capabilityGap: e.target.value })}
                          style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                        />
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <textarea
                          rows={2}
                          value={m.practiceAction}
                          onChange={(e) => handleUpdateMilestone(idx, { practiceAction: e.target.value })}
                          style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                        />
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <input
                          type="text"
                          value={m.reviewDate}
                          onChange={(e) => handleUpdateMilestone(idx, { reviewDate: e.target.value })}
                          style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Human-Led Interviewer Feedback & Evaluation Panel */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} color="#17245C" />
                <h4 style={{ fontSize: '1rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                  Human-Led Viva Voce Panel Evaluation & Faculty Feedback
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>INTERVIEW RESULT:</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                  {state.governance.interviewScore} / 10 pts (Passed)
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 10px' }}>
              Independent human assessment: evaluated on mathematical precision, conceptual justification, and professional ethics (not accent or fluency).
            </p>

            <textarea
              rows={3}
              value={state.interviewerFeedback}
              onChange={(e) => saveState({ ...state, interviewerFeedback: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                lineHeight: 1.45,
                fontFamily: 'inherit',
                color: '#1e293b',
                background: '#ffffff',
                marginBottom: '16px',
              }}
            />

            {/* Individual Contribution & Peer Correction */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#17245C' }}>
                    My Specific Deliverable Contribution:
                  </span>
                  <span style={{ fontSize: '0.7rem', color: contribWords >= 35 ? '#15803d' : '#b45309' }}>
                    {contribWords} words (min 35)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.studentContribution}
                  onChange={(e) => saveState({ ...state, studentContribution: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', background: '#ffffff' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#17245C' }}>
                    One Correction from Peer / Panel Review:
                  </span>
                  <span style={{ fontSize: '0.7rem', color: correctWords >= 35 ? '#15803d' : '#b45309' }}>
                    {correctWords} words (min 35)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.reviewerCorrection}
                  onChange={(e) => saveState({ ...state, reviewerCorrection: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', background: '#ffffff' }}
                />
              </div>
            </div>
          </div>

          {/* Three-Tier Governance & Certification Sign-Off */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1rem', color: '#17245C', margin: '0 0 14px', fontWeight: 700 }}>
              Hiring Simulation Governance, Certification Sign-off & Deliverable Tracking
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                  Preparer (Candidate Student):
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
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                  Reviewer (Faculty QA / Panel Lead):
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
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                  Decision Owner (Placement Director / Dean):
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
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                  Assessment Status:
                </label>
                <select
                  value={state.governance.auditStatus}
                  onChange={(e) =>
                    saveState({
                      ...state,
                      governance: { ...state.governance, auditStatus: e.target.value },
                    })
                  }
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff' }}
                >
                  <option value="Verified PASS (Certified Independent Competency)">
                    Verified PASS (Certified Independent Competency)
                  </option>
                  <option value="Conditional Approval">Conditional Approval</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Draft Attempt">Draft Attempt</option>
                </select>
              </div>
            </div>

            {/* Pre-Submission Verification Checklist */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
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
                    Automatic Assessment Review: Exit B & Viva Verified
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#166534' }}>
                    Controlled assessment protocol, 3 STAR+V interview cases, ethical defense, and 30-day plan verified!
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>Estimated Rubric Score:</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>10 / 10 pts</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {S22_RUBRIC.map((r) => (
                <div key={r.name} style={{ background: '#ffffff', borderRadius: '6px', padding: '10px', border: '1px solid #dcfce7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#17245C' }}>{r.name}</strong>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>{r.points} marks</span>
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

      {/* Sticky Bottom Navigation Footer */}
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
          {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Interview Preparation Complete ✓' : 'Save & Continue →'}
        </button>
      </footer>
    </div>
  );
}

