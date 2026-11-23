'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  S02_STORAGE_KEY,
  INITIAL_SQUAD_MEMBERS,
  INITIAL_LAPTOP_SLOTS,
  S02_DECISION_OPTIONS,
  INITIAL_CHARTER_COMMITMENTS,
  INITIAL_ROTATIONS,
  S02_TRAINER_GUIDELINES,
  loadSession02State,
  type Session02WorkstationState,
  type SquadMember,
  type LaptopSlot,
  type SquadRoleType,
  type CharterCommitment,
  type RoleRotationSession,
} from './session-02-teamwork-data.ts';
import {
  Users,
  Clock,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Laptop,
  Mic,
  Play,
  Square,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
  Check,
  Briefcase,
  AlertCircle,
  HelpCircle,
  Send,
  Calendar,
  Sparkles,
  Workflow,
} from 'lucide-react';

interface Session02TeamworkJourneyProps {
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
            <span>{whyOpen ? 'Hide team principle' : 'Why this matters'}</span>
            {whyOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {whyOpen && (
            <div
              style={{
                marginTop: '8px',
                padding: '12px 14px',
                background: '#f0fdfa',
                border: '1px solid #ccfbf1',
                borderRadius: '8px',
                fontSize: '12.5px',
                color: '#0F766E',
                lineHeight: 1.5,
              }}
            >
              <strong>Corporate Accountability Principle:</strong> {whyMatters}
            </div>
          )}
        </div>
      )}

      {/* Inner Task Body */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
        {children}
      </div>
    </article>
  );
}

export function Session02TeamworkJourney({
  onUpdateDraft,
}: Session02TeamworkJourneyProps) {
  const [state, setState] = useState<Session02WorkstationState>(loadSession02State);
  const [saveStatus, setSaveStatus] = useState('Saved in this browser');
  const [showTrainerGuidance, setShowTrainerGuidance] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState('S02-T01');
  const [expandedWhyMatters, setExpandedWhyMatters] = useState<Record<string, boolean>>({});

  // 90-Second Speech Practice Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [speechSeconds, setSpeechSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    const loaded = loadSession02State();
    setState(loaded);
  }, []);

  // Timer effect for 90-second rehearsal
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSpeechSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Save state and synchronize review engine draft keys
  const saveState = (next: Session02WorkstationState) => {
    setState(next);
    setSaveStatus('Saving…');

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(S02_STORAGE_KEY, JSON.stringify(next));
      }
    } catch {}

    syncDraftKeys(next);

    setTimeout(() => {
      setSaveStatus('Saved in this browser');
    }, 300);
  };

  // Synchronize draft keys for Session 02 review engine rules
  const syncDraftKeys = (curState: Session02WorkstationState) => {
    try {
      const raw = sessionStorage.getItem('vcep-drive-edition3:session:2:preview');
      const draft = raw ? JSON.parse(raw) : {};

      // 1. Concept: Explain single-point accountability vs reviewer role
      const conceptText =
        'Accountability means exactly one individual owns the acceptance criteria for a deliverable. A reviewer provides cross-footing quality assurance, but oversight never dilutes primary delivery accountability.';
      draft['concept:explain'] = conceptText;
      onUpdateDraft?.('concept:explain', conceptText);

      // 2. Work-prompt:0 -> 90-Second Intro
      if (curState.introText) {
        draft['work-prompt:0'] = curState.introText;
        onUpdateDraft?.('work-prompt:0', curState.introText);
      }

      // 3. Work-prompt:1 -> Escalation Justification
      if (curState.justification) {
        draft['work-prompt:1'] = curState.justification;
        onUpdateDraft?.('work-prompt:1', curState.justification);
      }

      // 4. Team: Contribution
      if (curState.peerFeedback?.contributionSummary) {
        draft['team:contribution'] = curState.peerFeedback.contributionSummary;
        onUpdateDraft?.('team:contribution', curState.peerFeedback.contributionSummary);
      }

      // 5. Team: Judgement (Professional Boundary)
      if (curState.peerFeedback?.professionalBoundary) {
        draft['team:judgement'] = curState.peerFeedback.professionalBoundary;
        onUpdateDraft?.('team:judgement', curState.peerFeedback.professionalBoundary);
      }

      sessionStorage.setItem('vcep-drive-edition3:session:2:preview', JSON.stringify(draft));
    } catch {}
  };

  // Compute keyboard minutes per member (each slot = 20 mins)
  const keyboardMinutes = useMemo(() => {
    const counts: Record<string, number> = {};
    state.members.forEach((m) => {
      counts[m.id] = 0;
    });
    state.slots.forEach((s) => {
      if (s.assignedMemberId && counts[s.assignedMemberId] !== undefined) {
        counts[s.assignedMemberId] += 20;
      }
    });
    return counts;
  }, [state.members, state.slots]);

  // All members get at least 20 minutes check
  const allMembersMeet20Mins = useMemo(() => {
    return state.members.every((m) => (keyboardMinutes[m.id] || 0) >= 20);
  }, [state.members, keyboardMinutes]);

  // Handlers for Member updates
  const handleMemberRoleChange = (memberId: string, newRole: SquadRoleType) => {
    const updated = state.members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m));
    saveState({ ...state, members: updated });
  };

  // Handlers for Laptop Slot updates
  const handleSlotChange = (slotIndex: number, memberId: string, activity: string) => {
    const updated = [...state.slots];
    updated[slotIndex] = { ...updated[slotIndex], assignedMemberId: memberId, activity };
    saveState({ ...state, slots: updated });
  };

  // Handlers for Escalation option selection
  const handleSelectEscalationOption = (optId: string) => {
    let autoJust = state.justification;
    if (optId === 'opt-backup') {
      autoJust =
        'At 16:30, with Reviewer delayed in transit and delivery due at 18:00, we formally engage Backup (Student 3) per Clause 4 of our Squad Charter. Trainer notified via email; acting reviewer conducts independent cross-foot check from 16:45 to 17:30.';
    } else if (optId === 'opt-skip') {
      autoJust = 'Reviewer was absent in transit so we submitted directly without review at 16:30.';
    } else if (optId === 'opt-extend') {
      autoJust = 'We decided internally to postpone the submission deadline to tomorrow morning.';
    }
    saveState({ ...state, selectedOptionId: optId, justification: autoJust });
  };

  // Handlers for Charter Commitment edits
  const handleUpdateCharterCommitment = (id: string, newCommitment: string) => {
    const updated = state.charterCommitments.map((c) =>
      c.id === id ? { ...c, agreedCommitment: newCommitment } : c
    );
    saveState({ ...state, charterCommitments: updated });
  };

  // Handlers for Rotation changes
  const handleUpdateRotation = (sessionNum: number, field: 'myRole' | 'reviewerId', val: string) => {
    const updated = state.rotations.map((r) =>
      r.sessionNum === sessionNum ? { ...r, [field]: val } : r
    );
    saveState({ ...state, rotations: updated });
  };

  const wordCount = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      className="vcep-simplified-workspace"
      style={{
        width: '100%',
        maxWidth: '1040px',
        margin: '0 auto',
        padding: '0 16px 64px',
        color: '#1e293b',
        fontFamily: 'inherit',
      }}
    >
      {/* 1. Institutional Header Banner with Trainer Guidance */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          fontSize: '13px',
          color: '#166534',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <ShieldCheck size={18} color="#0f766e" />
          <span>VCEP Session 02 · Corporate Accountability & Teamwork Workbench</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={() => setShowTrainerGuidance(!showTrainerGuidance)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: showTrainerGuidance ? '#ffffff' : '#0f766e',
              background: showTrainerGuidance ? '#0f766e' : '#ffffff',
              border: '1px solid #99f6e4',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <Info size={14} />
            <span>{showTrainerGuidance ? 'Hide Trainer Guide' : 'Trainer Guidance'}</span>
          </button>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{saveStatus}</span>
        </div>
      </div>

      {/* Trainer Guidance Drawer (Faculty Only) */}
      {showTrainerGuidance && (
        <div
          style={{
            background: '#f8fafc',
            border: '1.5px solid #0f766e',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '32px',
            boxShadow: '0 6px 18px rgba(15, 118, 110, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={16} color="#0f766e" />
              <strong style={{ fontSize: '13px', color: '#17245c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Trainer Classroom Facilitator Guide · 135-Minute Cadence
              </strong>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f766e', background: '#ccfbf1', padding: '3px 8px', borderRadius: '4px' }}>
              Faculty Pacing
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', fontSize: '12.5px', color: '#334155', marginBottom: '14px' }}>
            {S02_TRAINER_GUIDELINES.pacing.map((p, i) => (
              <div key={i} style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>{p.time}: {p.phase}</div>
                <div>{p.description}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: '#0f766e', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
            <strong>Key Observable Milestone:</strong> {S02_TRAINER_GUIDELINES.observableOutcome}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HEADING 1: JOIN YOUR TEAM (#vcep-area-join)                               */}
      {/* ========================================================================= */}
      <section
        id="vcep-area-join"
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: 'clamp(20px, 3.5vw, 36px)',
          marginBottom: '36px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Section Header */}
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0f766e' }}>
              HEADING 1 · TEAM FORMATION & IDENTITY
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 800, color: '#17245c', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Join Your Team
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
            Orient to your squad, craft your 90-second professional introduction, and assign binding corporate roles.
          </p>
        </div>

        {/* Corporate Briefing Memo */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={16} color="#0f766e" />
              <strong style={{ fontSize: '13.5px', color: '#17245c' }}>
                Internal Operations Memo · Client Support Engagement S02
              </strong>
            </div>
            <span style={{ fontSize: '11.5px', color: '#475569', fontWeight: 600 }}>
              Deadline: 18:00 Sharp Today
            </span>
          </div>

          <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.6', marginBottom: '14px' }}>
            <p style={{ margin: '0 0 10px' }}>
              <strong>From:</strong> Pooja Sundaram, Senior Engagement Manager<br />
              <strong>To:</strong> Project Squad 02 (5 Members)
            </p>
            <p style={{ margin: '0 0 10px' }}>
              Welcome to the corporate engagement squad. You are responsible for delivering an audit-ready financial and client status file today by <strong>18:00 sharp</strong>.
            </p>
            <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
              <strong>Known Squad Operating Constraints:</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: '20px', color: '#475569', fontSize: '13px' }}>
                <li><strong>Hardware limitation:</strong> Two students (Student 1 & Student 2) share a single laptop during the sprint.</li>
                <li><strong>Commute delay:</strong> Student 3 commutes 90 minutes daily and arrives on campus at 14:20.</li>
                <li><strong>Absence risk:</strong> The designated reviewer may be delayed in transit during afternoon hours.</li>
                <li><strong>Management standard:</strong> Zero unreviewed files permitted. Status update required before any deadline is missed.</li>
              </ul>
            </div>
          </div>

          <div style={{ background: '#f0fdfa', borderLeft: '4px solid #0f766e', padding: '10px 14px', borderRadius: '0 8px 8px 0', fontSize: '12.5px', color: '#0f766e', lineHeight: '1.5' }}>
            <strong>The Core Professional Principle:</strong> Accountability means exactly <em>one owner</em> accepts a deliverable and confirms its quality. A reviewer checks work for accuracy but does not relieve the owner of primary responsibility. Workload fairness is judged by verifiable, attributable contributions, not speaking time.
          </div>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 01: INTRODUCE YOURSELF (S02-T01)                                     */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S02-T01"
          taskNumber="TASK 01"
          title="Introduce Yourself"
          instruction="Prepare and rehearse a 90-second professional introduction connecting a verifiable technical skill to an entry-level commerce task."
          whyMatters="Campus recruiters and team leads evaluate day-one competence in the first 60–90 seconds. Concrete claims linking technical skills (e.g. bank reconciliations) to specific tasks prove immediate utility and accountability."
          statusText={wordCount(state.introText) >= 25 ? 'Intro Saved & Synced' : 'Drafting Intro'}
          isActive={activeTaskId === 'S02-T01'}
          onSelectTask={() => setActiveTaskId('S02-T01')}
        >
          {/* Quick Skill Suggestion Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', alignSelf: 'center', fontWeight: 600 }}>Skill Prompts:</span>
            {[
              'Bank Reconciliation & Suspense Resolution',
              'Excel VLOOKUP, SUMIFS & Pivot Schedules',
              'Accounts Receivable Invoicing & Payment Follow-Up',
              'General Ledger Posting & Trial Balance Hygiene',
            ].map((skill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const updatedText = `I am a commerce professional specializing in ${skill}. I link source records to entry-level reconciliations, ensuring financial schedules have zero discrepancies and follow strict quad-eye review standards.`;
                  saveState({ ...state, introSkill: skill, introText: updatedText });
                }}
                style={{
                  fontSize: '11.5px',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  background: state.introSkill === skill ? '#ccfbf1' : '#ffffff',
                  border: state.introSkill === skill ? '1px solid #0f766e' : '1px solid #cbd5e1',
                  color: state.introSkill === skill ? '#0f766e' : '#475569',
                  cursor: 'pointer',
                  fontWeight: state.introSkill === skill ? 600 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                + {skill}
              </button>
            ))}
          </div>

          {/* Intro Text Input */}
          <textarea
            rows={3}
            value={state.introText}
            onChange={(e) => saveState({ ...state, introText: e.target.value })}
            placeholder="State your background, your core technical capability, and the entry-level role you can perform (25–180 words)..."
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: '13.5px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#1e293b',
              lineHeight: '1.5',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              marginBottom: '12px',
            }}
          />

          {/* 90-Second Speaking Rehearsal Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: speechSeconds > 90 ? '#b91c1c' : '#17245c',
                  background: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                }}
              >
                <Clock size={15} color={speechSeconds > 90 ? '#b91c1c' : '#0f766e'} />
                <span>
                  {Math.floor(speechSeconds / 60)}:{(speechSeconds % 60).toString().padStart(2, '0')} / 1:30
                </span>
              </div>

              {!isTimerRunning ? (
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: '#0f766e',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Play size={13} fill="#ffffff" />
                  <span>Start Practice Speaking</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: '#b91c1c',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Square size={13} fill="#ffffff" />
                  <span>Stop Speaking</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setSpeechSeconds(0);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#64748b',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {speechSeconds === 0 && 'Click "Start Practice Speaking" and rehearse reading your pitch aloud.'}
              {speechSeconds > 0 && speechSeconds <= 45 && 'Pacing: Opening segment (introduce degree & background).'}
              {speechSeconds > 45 && speechSeconds <= 75 && 'Pacing: Core competency & specific task delivery.'}
              {speechSeconds > 75 && speechSeconds <= 90 && 'Pacing: Ideal wrap-up window! Commit to on-time quality.'}
              {speechSeconds > 90 && 'Pacing Warning: Over 90 seconds. Condense for campus interviews.'}
            </div>

            <div style={{ fontSize: '11.5px', color: wordCount(state.introText) >= 25 && wordCount(state.introText) <= 180 ? '#166534' : '#b91c1c', fontWeight: 600 }}>
              {wordCount(state.introText)} words ({wordCount(state.introText) >= 25 && wordCount(state.introText) <= 180 ? '✓ Valid word count 25–180' : 'Target: 25–180 words'})
            </div>
          </div>
        </TaskCard>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 02: ASSIGN TEAM ROLES (S02-T02)                                      */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S02-T02"
          taskNumber="TASK 02"
          title="Assign Team Roles"
          instruction="Assign core functional roles across your 5-member squad and plan planned role rotations across Sessions 2 through 5."
          whyMatters="Clear role definitions prevent duplicate effort and unowned tasks. Rotating roles ensures every squad member builds balanced analytical, operational, and audit capabilities."
          statusText="Roles & Rotations Configured"
          isActive={activeTaskId === 'S02-T02'}
          onSelectTask={() => setActiveTaskId('S02-T02')}
        >
          {/* Part A: 5-Person Squad Role Allocation Matrix */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#17245c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              1. 5-Member Squad Role Matrix & Operating Constraints
            </div>
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#17245c' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Squad Member</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Assigned Role</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Hardware & Commute Constraint</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Assigned Delivery Responsibility</th>
                  </tr>
                </thead>
                <tbody>
                  {state.members.map((m, idx) => (
                    <tr key={m.id} style={{ borderBottom: idx < state.members.length - 1 ? '1px solid #f1f5f9' : 'none', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#17245c' }}>
                        {m.name}
                        {m.id === 'm1' && <span style={{ marginLeft: '6px', fontSize: '10px', background: '#ccfbf1', color: '#0f766e', padding: '2px 6px', borderRadius: '4px' }}>YOU</span>}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <select
                          value={m.role}
                          onChange={(e) => handleMemberRoleChange(m.id, e.target.value as SquadRoleType)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: '#17245c',
                          }}
                        >
                          <option value="Coordinator">Coordinator</option>
                          <option value="Finance Lead">Finance Lead</option>
                          <option value="Data Lead">Data Lead</option>
                          <option value="Client Communications Lead">Client Communications Lead</option>
                          <option value="Quality Reviewer">Quality Reviewer</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {m.sharesLaptop && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px', marginRight: '6px' }}>
                            <Laptop size={12} /> Shares Laptop
                          </span>
                        )}
                        {m.travelsLongDistance && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#4338ca', background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px' }}>
                            <Clock size={12} /> 90-Min Commute (Arrives 14:20)
                          </span>
                        )}
                        {!m.sharesLaptop && !m.travelsLongDistance && (
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Standard campus station</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#475569' }}>
                        {m.assignedResponsibility}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Part B: 4-Session Role Rotation Planner */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#17245c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              2. 4-Session Role Rotation Schedule (Sessions 2 through 5)
            </div>
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#17245c' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Session</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Curriculum Module</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>My Role</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Designated Reviewer</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700 }}>Session Deliverable</th>
                  </tr>
                </thead>
                <tbody>
                  {state.rotations.map((r, idx) => (
                    <tr key={r.sessionNum} style={{ borderBottom: idx < state.rotations.length - 1 ? '1px solid #f1f5f9' : 'none', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f766e' }}>
                        Session 0{r.sessionNum}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#17245c' }}>
                        {r.sessionTitle}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <select
                          value={r.myRole}
                          onChange={(e) => handleUpdateRotation(r.sessionNum, 'myRole', e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontSize: '12px',
                          }}
                        >
                          <option value="Coordinator">Coordinator</option>
                          <option value="Finance Lead">Finance Lead</option>
                          <option value="Data Lead">Data Lead</option>
                          <option value="Client Communications Lead">Client Communications Lead</option>
                          <option value="Quality Reviewer">Quality Reviewer</option>
                        </select>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <input
                          type="text"
                          value={r.reviewerId}
                          onChange={(e) => handleUpdateRotation(r.sessionNum, 'reviewerId', e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontSize: '12px',
                            width: '180px',
                          }}
                        />
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: '#475569' }}>
                        {r.deliverable}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* ========================================================================= */}
      {/* HEADING 2: BUILD YOUR PROFESSIONAL PROFILE & CHARTER                     */}
      {/* (#vcep-area-charter)                                                      */}
      {/* ========================================================================= */}
      <section
        id="vcep-area-charter"
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: 'clamp(20px, 3.5vw, 36px)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Section Header */}
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0f766e' }}>
              HEADING 2 · GOVERNANCE & CHARTER STUDIO
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 800, color: '#17245c', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Build Your Professional Profile & Charter
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
            Negotiate shared hardware time, codify binding quality standards, and resolve high-stakes operational escalations.
          </p>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 03: AGREE ON TEAM RULES (S02-T03)                                    */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S02-T03"
          taskNumber="TASK 03"
          title="Agree on Team Rules"
          instruction="Negotiate 20-minute shared laptop slots and establish binding charter commitments for file naming, turnaround SLAs, and quality reviews."
          whyMatters="A team charter eliminates daily friction by codifying expectations in advance. Equitable 20-minute device slots ensure every student gets hands-on practice, while standardized file naming prevents audit confusion."
          statusText={allMembersMeet20Mins ? 'Charter & Rota Ready' : 'In progress'}
          isActive={activeTaskId === 'S02-T03'}
          onSelectTask={() => setActiveTaskId('S02-T03')}
        >
          {/* Part A: 20-Minute Keyboard Time Negotiation (Shared Laptop Rota) */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#17245c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                1. 20-Minute Keyboard Time Negotiation (Shared Laptop)
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: allMembersMeet20Mins ? '#f0fdf4' : '#fffbeb',
                  border: allMembersMeet20Mins ? '1px solid #bbf7d0' : '1px solid #fde68a',
                  color: allMembersMeet20Mins ? '#166534' : '#92400e',
                  fontSize: '11.5px',
                  fontWeight: 700,
                }}
              >
                {allMembersMeet20Mins ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                <span>{allMembersMeet20Mins ? 'All 5 Members Meet ≥ 20 Mins Keyboard Time' : 'Under-allocated members detected'}</span>
              </div>
            </div>

            {/* Member Minutes Counter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {state.members.map((m) => {
                const mins = keyboardMinutes[m.id] || 0;
                const isOk = mins >= 20;
                return (
                  <div
                    key={m.id}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: isOk ? '#f0fdf4' : '#fef2f2',
                      border: isOk ? '1px solid #bbf7d0' : '1px solid #fecaca',
                      fontSize: '11.5px',
                      color: isOk ? '#166534' : '#991b1b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{m.name}:</span>
                    <span style={{ fontWeight: 800 }}>{mins} Mins</span>
                    {isOk ? <Check size={12} strokeWidth={3} /> : <span style={{ fontSize: '10px' }}>(Need ≥20)</span>}
                  </div>
                );
              })}
            </div>

            {/* Slots Table */}
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#17245c' }}>
                    <th style={{ padding: '8px 12px', fontWeight: 700 }}>Time Slot (20m)</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700 }}>Assigned Keyboard Member</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700 }}>Task / Working Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {state.slots.map((s, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < state.slots.length - 1 ? '1px solid #f1f5f9' : 'none', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: '#0f766e', whiteSpace: 'nowrap' }}>
                        {s.time}
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <select
                          value={s.assignedMemberId}
                          onChange={(e) => handleSlotChange(idx, e.target.value, s.activity)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontSize: '12px',
                            color: '#17245c',
                            fontWeight: 500,
                          }}
                        >
                          {state.members.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.role})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <input
                          type="text"
                          value={s.activity}
                          onChange={(e) => handleSlotChange(idx, s.assignedMemberId, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontSize: '12px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Part B: Editable Squad Governance Charter Studio */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#17245c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              2. Editable Squad Governance Charter (5 Core Clauses)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {state.charterCommitments.map((clause) => (
                <div
                  key={clause.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px 16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#0f766e', background: '#ccfbf1', padding: '2px 8px', borderRadius: '4px' }}>
                        {clause.category}
                      </span>
                      <strong style={{ fontSize: '13px', color: '#17245c' }}>
                        {clause.ownerAndBackup}
                      </strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '6px', fontStyle: 'italic' }}>
                    Clause Standard: {clause.standardClause}
                  </div>

                  <textarea
                    rows={2}
                    value={clause.agreedCommitment}
                    onChange={(e) => handleUpdateCharterCommitment(clause.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      fontSize: '12.5px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#1e293b',
                      lineHeight: '1.4',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </TaskCard>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 04: PLAN FOR SETBACKS (S02-T04)                                      */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S02-T04"
          taskNumber="TASK 04"
          title="Plan for Setbacks"
          instruction="Evaluate operational recovery options for an absent reviewer at 16:30, record a formal audit justification, and document personal contributions."
          whyMatters="Operational setbacks happen in every workplace. True professional accountability means activating pre-agreed backup procedures early rather than skipping quality checks or missing contract deadlines."
          statusText={wordCount(state.justification) >= 15 ? 'Escalation Documented' : 'Pending Justification'}
          isActive={activeTaskId === 'S02-T04'}
          onSelectTask={() => setActiveTaskId('S02-T04')}
        >
          {/* Part A: Absent Reviewer Escalation Decision Simulator (16:30 Crisis) */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#17245c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              1. 16:30 Absent Reviewer Crisis Decision (18:00 Deadline)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              {S02_DECISION_OPTIONS.map((opt) => {
                const isSelected = state.selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectEscalationOption(opt.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      background: isSelected ? '#ffffff' : '#f8fafc',
                      border: isSelected ? '2px solid #0f766e' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 14px rgba(15, 118, 110, 0.1)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: opt.isOptimal ? '#0f766e' : '#b91c1c',
                            background: opt.isOptimal ? '#f0fdf4' : '#fef2f2',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {opt.governanceVerdict}
                        </span>
                        {isSelected && <Check size={16} color="#0f766e" strokeWidth={3} />}
                      </div>

                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#17245c', marginBottom: '6px' }}>
                        {opt.title}
                      </div>

                      <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px', lineHeight: '1.4' }}>
                        {opt.actionSummary}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: '#334155', background: isSelected ? '#f0fdfa' : '#f1f5f9', padding: '6px 8px', borderRadius: '4px', borderLeft: isSelected ? '3px solid #0f766e' : '3px solid #cbd5e1' }}>
                        <strong>Audit Consequence:</strong> {opt.auditTrailConsequence}
                      </div>

                      {isSelected && (
                        <div style={{ marginTop: '6px', fontSize: '11.5px', color: opt.isOptimal ? '#166534' : '#991b1b', fontWeight: 600 }}>
                          {opt.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Written Audit Trail Justification */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px 16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                Written Audit Trail Justification (Record formal escalation note):
              </label>
              <textarea
                rows={3}
                value={state.justification}
                onChange={(e) => saveState({ ...state, justification: e.target.value })}
                placeholder="e.g. At 16:30, with Reviewer delayed in transit and delivery due at 18:00, we formally engage Backup (Student 3) per Clause 4 of our Squad Charter. Trainer notified via email; acting reviewer conducts independent cross-foot check from 16:45 to 17:30."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '12.5px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#1e293b',
                  lineHeight: '1.45',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '11.5px' }}>
                <span style={{ color: wordCount(state.justification) >= 15 ? '#166534' : '#b91c1c', fontWeight: 600 }}>
                  {wordCount(state.justification) >= 15 ? '✓ Audit justification valid (≥15 words)' : 'Requires ≥15 words for audit trail'}
                </span>
                <span style={{ color: '#94a3b8' }}>{wordCount(state.justification)} words</span>
              </div>
            </div>
          </div>

          {/* Part B: Individual Contribution, Peer Review & Quality Boundary Record */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '16px 18px',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#17245c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              2. Individual Contribution, Peer Review & Quality Boundary Record
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px', lineHeight: 1.4 }}>
              Record your attributable contribution, one specific correction from peer audit, and your non-negotiable professional quality boundary.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#17245c', marginBottom: '3px' }}>
                  1. My Attributable Individual Contribution Today:
                </label>
                <textarea
                  rows={2}
                  value={state.peerFeedback?.contributionSummary || ''}
                  onChange={(e) => {
                    const updatedFb = { ...state.peerFeedback, contributionSummary: e.target.value };
                    saveState({ ...state, peerFeedback: updatedFb });
                  }}
                  placeholder="Specify the exact schedules, calculations, or charter commitments you authored..."
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#17245c', marginBottom: '3px' }}>
                  2. One Correction Flagged by Peer Review:
                </label>
                <textarea
                  rows={2}
                  value={state.peerFeedback?.peerCorrection || ''}
                  onChange={(e) => {
                    const updatedFb = { ...state.peerFeedback, peerCorrection: e.target.value };
                    saveState({ ...state, peerFeedback: updatedFb });
                  }}
                  placeholder="What error, naming mismatch, or formula inconsistency did your reviewer catch?"
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#17245c', marginBottom: '3px' }}>
                  3. Autonomous Professional Boundary (Quality Stand):
                </label>
                <textarea
                  rows={2}
                  value={state.peerFeedback?.professionalBoundary || ''}
                  onChange={(e) => {
                    const updatedFb = { ...state.peerFeedback, professionalBoundary: e.target.value };
                    saveState({ ...state, peerFeedback: updatedFb });
                  }}
                  placeholder="State one condition under which you will refuse to approve or submit unverified work..."
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>
        </TaskCard>
      </section>
    </div>
  );
}
