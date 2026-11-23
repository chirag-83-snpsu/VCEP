'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  S04_STORAGE_KEY,
  OPERATIONS_LEAD_LIMIT_INR,
  SUBSTITUTE_FEE_INR,
  MANAGER_SYNC_TIME,
  CLIENT_DELIVERY_TIME,
  INITIAL_S04_STATE,
  S04_RUBRIC,
  countWords,
  loadSession04State,
  saveSession04State,
  type Session04WorkstationState,
  type RACIActionItem,
  type AgendaItem,
  type DeliveryOption,
  type SquadMeetingRole,
} from './session-04-meeting-data.ts';
import { evaluateSession04 } from '../../../lib/review-engine/session-rules/session-04.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  ShieldCheck,
  CheckSquare,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  UserCheck,
  Calendar,
  AlertCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Session04MeetingJourneyProps {
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
            <span>{whyOpen ? 'Hide meeting governance principle' : 'Why this matters'}</span>
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
              <strong>Corporate Governance Standard:</strong> {whyMatters}
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

export function Session04MeetingJourney({
  onUpdateDraft,
}: Session04MeetingJourneyProps) {
  const [state, setState] = useState<Session04WorkstationState>(loadSession04State);
  const [activeTaskId, setActiveTaskId] = useState<string>('S04-T01');
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);

  // 90-second rehearsal timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(90);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Hydrate on mount
  useEffect(() => {
    const loaded = loadSession04State();
    setState(loaded);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const handleStartTimer = () => setTimerRunning(true);
  const handlePauseTimer = () => setTimerRunning(false);
  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(90);
  };

  // State saver & draft synchronizer
  const updateState = (updater: (prev: Session04WorkstationState) => Session04WorkstationState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession04State(next);

      // Sync with parent draft
      if (onUpdateDraft) {
        onUpdateDraft('work-prompt:0', `${next.agenda.map((a) => `${a.timebox} - ${a.title}: ${a.objective}`).join('\n')}`);
        onUpdateDraft('work-prompt:1', `${next.actions.map((a) => `${a.task} [Owner: ${a.owner}, Due: ${a.deadline}, Proof: ${a.evidence}]`).join('\n')}`);
        onUpdateDraft('work-prompt:2', `DONE: ${next.dnbState.done}\nNEXT: ${next.dnbState.next}\nBLOCKER: ${next.dnbState.blocker}`);
        onUpdateDraft('concept:explain', `${next.minutes.keyDecisions} ${next.minutes.unresolvedItems}`);
        onUpdateDraft('team:contribution', next.governance.contributionSummary);
        onUpdateDraft('team:judgement', next.governance.professionalBoundary);
      }

      return next;
    });
  };

  // Handlers for RACI Actions
  const handleAddAction = () => {
    const newId = `act-${Date.now()}`;
    const newAction: RACIActionItem = {
      id: newId,
      task: 'New actionable task',
      owner: 'Assignee Name',
      authority: 'Designated Authority',
      deadline: '16:00 Today',
      blocker: 'None',
      evidence: 'Completion Record',
      status: 'Open',
    };
    updateState((prev) => ({
      ...prev,
      actions: [...prev.actions, newAction],
    }));
  };

  const handleUpdateAction = (id: string, field: keyof RACIActionItem, val: string) => {
    updateState((prev) => ({
      ...prev,
      actions: prev.actions.map((a) => (a.id === id ? { ...a, [field]: val } : a)),
    }));
  };

  const handleDeleteAction = (id: string) => {
    updateState((prev) => ({
      ...prev,
      actions: prev.actions.filter((a) => a.id !== id),
    }));
  };

  // Formative Review Evaluation
  const handleRunReview = () => {
    const report = evaluateSession04({
      sessionId: 4,
      lesson: {
        id: 4,
        title: 'Meetings and Reporting',
      },
      draft: {
        'concept:explain': `Meeting minutes record binding decisions and unresolved risks rather than verbatim transcripts. Options are not approved until formally authorized by the budget owner. Operations Lead limit is ₹2,000, requiring General Manager sign-off at 15:00 for the ₹4,000 substitute fee.`,
        'work-prompt:0': state.agenda.map((a) => `${a.timebox} - ${a.title}: ${a.objective}`).join('\n'),
        'work-prompt:1': state.actions.map((a) => `${a.task} [Owner: ${a.owner}, Due: ${a.deadline}]`).join('\n'),
        'work-prompt:2': `DONE: ${state.dnbState.done}\nNEXT: ${state.dnbState.next}\nBLOCKER: ${state.dnbState.blocker}`,
        'team:contribution': state.governance.contributionSummary,
        'team:judgement': state.governance.professionalBoundary,
      },
      workstationData: state,
    });
    setReviewReport(report);
  };

  // Reset workstation
  const handleReset = () => {
    if (typeof window !== 'undefined' && window.confirm('Reset all Session 04 meeting minutes and actions to default?')) {
      try {
        localStorage.removeItem(S04_STORAGE_KEY);
      } catch {}
      setState(INITIAL_S04_STATE);
      setReviewReport(null);
      handleResetTimer();
    }
  };

  // Word & Item Metrics
  const dnbTotalWords = useMemo(() => {
    return countWords(`${state.dnbState.done} ${state.dnbState.next} ${state.dnbState.blocker}`);
  }, [state.dnbState]);

  const validActions = useMemo(() => {
    return state.actions.filter((a) => a.task.trim() && a.owner.trim() && a.deadline.trim());
  }, [state.actions]);

  const substituteOpt = useMemo(() => {
    return state.deliveryOptions.find((o) => o.id === 'opt-substitute');
  }, [state.deliveryOptions]);

  return (
    <div className="vcep-session-root" style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px', color: '#0f172a' }}>
      {/* Top Banner Navigation Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(15, 118, 110, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f766e',
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f766e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Two Natural Headings · Session 04
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#17245c' }}>
              Understand Delivery Crisis &rarr; Run Meeting & Record Actions
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href="#vcep-area-crisis"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>1. Delivery Crisis</span>
          </a>
          <a
            href="#vcep-area-meeting"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: '#0f766e',
              border: '1px solid #0f766e',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>2. Run Meeting & Actions &rarr;</span>
          </a>
          <button
            type="button"
            onClick={handleReset}
            title="Reset workstation state"
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              background: 'transparent',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HEADING 1: UNDERSTAND THE DELIVERY CRISIS                                 */}
      {/* ========================================================================= */}
      <section
        id="vcep-area-crisis"
        aria-labelledby="vcep-heading-crisis"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: 'clamp(20px, 3vw, 28px)',
          marginBottom: '32px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            NATURAL HEADING 01
          </span>
          <h2
            id="vcep-heading-crisis"
            style={{ fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 800, color: '#17245c', margin: '4px 0 6px 0', letterSpacing: '-0.01em' }}
          >
            Understand the Delivery Crisis
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            Examine the delivery commitment, identify commercial authority limits, allocate squad roles, and establish a timeboxed 12-minute agenda.
          </p>
        </div>

        {/* 1.1 Crisis Briefing & Authority Limit Card */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '10px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={15} color="#f87171" />
              <span>Emergency Incident Briefing · Client SLA At Risk</span>
            </div>
            <span
              style={{
                background: '#dc2626',
                color: '#ffffff',
                fontSize: '10.5px',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 700,
              }}
            >
              CLIENT COMMITMENT: TODAY 17:00 IST
            </span>
          </div>

          <div style={{ padding: '20px', fontSize: '14px', lineHeight: 1.6, color: '#1e293b' }}>
            <p style={{ margin: '0 0 14px 0' }}>
              A key client delivery is promised for <strong>today at 17:00</strong>. The primary supplier confirms parts will arrive <strong>one day late</strong>. The client has not accepted a deadline extension. An alternative substitute vendor can supply the parts on time, but charges an additional <strong>₹4,000 rush fee</strong>.
            </p>

            {/* Authority Limit Matrix */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '12px',
                marginTop: '12px',
              }}
            >
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #0f766e' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase' }}>
                  Operations Lead Limit
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>
                  ₹2,000 Max
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Cannot approve the ₹4,000 substitute fee independently.
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #dc2626' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>
                  Substitute Rush Fee
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626', margin: '2px 0' }}>
                  +₹4,000 Extra
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Exceeds lead authority by ₹2,000. Requires General Manager sign-off.
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #ca8a04' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#ca8a04', textTransform: 'uppercase' }}>
                  Manager Availability
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>
                  15:00 Today
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Available for emergency budget variance review.
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #17245c' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#17245c', textTransform: 'uppercase' }}>
                  Client Delivery Cutoff
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#17245c', margin: '2px 0' }}>
                  17:00 Sharp
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Firm contractual deadline; no delay accepted by client.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1.2 Five Squad Roles Allocation */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={16} color="#0f766e" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Meeting Squad Role Allocation (Rotate for Practice)
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
            }}
          >
            {state.roles.map((r) => (
              <div
                key={r.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#17245c' }}>{r.roleName}</div>
                </div>
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#0f766e', marginBottom: '4px' }}>
                  Assigned: {r.assignedStudent}
                </div>
                <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.4, marginBottom: '4px' }}>
                  {r.mandate}
                </div>
                <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
                  Boundary: {r.authorityBoundary}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 01: PREPARE THE AGENDA (S04-T01)                                     */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S04-T01"
          taskNumber="TASK 01"
          title="Prepare the Agenda"
          instruction="Draft and configure a disciplined 12-minute, 4-item meeting agenda establishing context, option tradeoffs, authority escalation, and action allocation."
          whyMatters="Unstructured crisis meetings devolve into circular debate. A timeboxed agenda ensures every critical question—especially decision authority and action ownership—is addressed before irreversible deadlines pass."
          statusText="4 Items Structured (12 Min Timebox)"
          isActive={activeTaskId === 'S04-T01'}
          onSelectTask={() => setActiveTaskId('S04-T01')}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '12px',
            }}
          >
            {state.agenda.map((ag, idx) => (
              <div
                key={ag.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span
                    style={{
                      background: '#17245c',
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {ag.timebox}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#0f766e' }}>
                    Item 0{idx + 1}
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  {ag.title}
                </div>
                <p style={{ fontSize: '11.5px', color: '#64748b', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                  {ag.objective}
                </p>
                <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                  Lead: {ag.leadRole}
                </div>
              </div>
            ))}
          </div>
        </TaskCard>
      </section>

      {/* ========================================================================= */}
      {/* HEADING 2: RUN THE MEETING & RECORD ACTIONS                               */}
      {/* ========================================================================= */}
      <section
        id="vcep-area-meeting"
        aria-labelledby="vcep-heading-meeting"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: 'clamp(20px, 3vw, 28px)',
          marginBottom: '32px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            NATURAL HEADING 02
          </span>
          <h2
            id="vcep-heading-meeting"
            style={{ fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 800, color: '#17245c', margin: '4px 0 6px 0', letterSpacing: '-0.01em' }}
          >
            Run the Meeting &amp; Record Actions
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            Separate proposed options from authorised decisions, assign accountable action owners with strict clock deadlines, and deliver the 90-second Done-Next-Blocker flash report.
          </p>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 02: RUN THE MEETING (S04-T02)                                        */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S04-T02"
          taskNumber="TASK 02"
          title="Run the Meeting"
          instruction="Compare Option A (1-day supplier delay, ₹0 extra, SLA breach) versus Option B (emergency substitute vendor, +₹4,000 rush fee) and enforce commercial authority limits."
          whyMatters="In enterprise operations, a team preference is never an expenditure authorization. Expenditures exceeding lead thresholds (₹2,000) must be held pending formal approval from the budget owner (General Manager at 15:00)."
          statusText={
            substituteOpt?.status === 'PENDING_APPROVAL'
              ? 'Authority Safeguarded (Pending GM Sign-Off)'
              : substituteOpt?.status === 'AUTHORISED'
              ? 'Authorised (Valid Post-15:00 GM)'
              : 'Decision Under Review'
          }
          isActive={activeTaskId === 'S04-T02'}
          onSelectTask={() => setActiveTaskId('S04-T02')}
        >
          {/* Governance Notice Alert */}
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertTriangle size={18} color="#b45309" />
            <div style={{ fontSize: '12.5px', color: '#92400e', lineHeight: 1.5 }}>
              <strong>Governance Rule:</strong> No option automatically becomes approved merely because the squad selects it. Expenditures exceeding ₹2,000 require formal authorization from the General Manager at 15:00.
            </div>
          </div>

          {/* Delivery Options Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {state.deliveryOptions.map((opt) => (
              <div
                key={opt.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#17245c' }}>{opt.title}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background:
                        opt.status === 'AUTHORISED'
                          ? '#dcfce7'
                          : opt.status === 'REJECTED'
                          ? '#fee2e2'
                          : '#fef3c7',
                      color:
                        opt.status === 'AUTHORISED'
                          ? '#15803d'
                          : opt.status === 'REJECTED'
                          ? '#b91c1c'
                          : '#b45309',
                    }}
                  >
                    {opt.status.replace('_', ' ')}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '6px', fontSize: '12.5px', color: '#475569', marginBottom: '10px' }}>
                  <strong>Additional Cost:</strong>
                  <span style={{ fontWeight: 700, color: opt.costINR > 0 ? '#dc2626' : '#0f766e' }}>
                    ₹{opt.costINR.toLocaleString('en-IN')}
                  </span>

                  <strong>Delivery Time:</strong>
                  <span>{opt.deliveryTime}</span>

                  <strong>SLA Impact:</strong>
                  <span>{opt.slaImpact}</span>

                  <strong>Approval Gate:</strong>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{opt.approvalRequiredBy}</span>
                </div>

                <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                  {opt.rationale}
                </div>

                {opt.id === 'opt-substitute' && (
                  <div style={{ marginTop: '12px', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Update Decision Status:
                    </label>
                    <select
                      value={opt.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as DeliveryOption['status'];
                        updateState((prev) => ({
                          ...prev,
                          deliveryOptions: prev.deliveryOptions.map((o) =>
                            o.id === opt.id ? { ...o, status: newStatus } : o
                          ),
                        }));
                      }}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        fontSize: '12.5px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                      }}
                    >
                      <option value="PENDING_APPROVAL">Pending GM Sign-Off (Recommended for 13:00 meeting)</option>
                      <option value="AUTHORISED">Authorised (Only valid AFTER 15:00 GM sign-off)</option>
                      <option value="PROPOSED">Proposed for Discussion</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TaskCard>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 03: RECORD DECISIONS AND ACTIONS (S04-T03)                            */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S04-T03"
          taskNumber="TASK 03"
          title="Record Decisions and Actions"
          instruction="Record structured meeting minutes separating agreed decisions from unresolved risks, and populate a RACI action tracker with single individual owners and strict clock deadlines."
          whyMatters="Minutes and action items create corporate accountability. Vague assignments without single owners or exact clock deadlines (e.g. 14:30, 15:00) lead to missed handoffs and contractual defaults."
          statusText={`${validActions.length} Owned Actions Tracked`}
          isActive={activeTaskId === 'S04-T03'}
          onSelectTask={() => setActiveTaskId('S04-T03')}
        >
          {/* Executive Minutes Box */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#17245c', marginBottom: '6px' }}>
              Executive Meeting Minutes Summary
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
              Minutes capture binding decisions and unresolved risks—not a verbatim conversation transcript.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Meeting Title & Context:
                </label>
                <input
                  type="text"
                  value={state.minutes.meetingTitle}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateState((prev) => ({ ...prev, minutes: { ...prev.minutes, meetingTitle: val } }));
                  }}
                  style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Attendees & Squad Roles:
                </label>
                <input
                  type="text"
                  value={state.minutes.attendees}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateState((prev) => ({ ...prev, minutes: { ...prev.minutes, attendees: val } }));
                  }}
                  style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0f766e', marginBottom: '4px' }}>
                  Key Decisions Agreed:
                </label>
                <textarea
                  rows={2}
                  value={state.minutes.keyDecisions}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateState((prev) => ({ ...prev, minutes: { ...prev.minutes, keyDecisions: val } }));
                  }}
                  style={{ width: '100%', padding: '6px 10px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#dc2626', marginBottom: '4px' }}>
                  Unresolved Risks & Escalations (Manager 15:00 Gate):
                </label>
                <textarea
                  rows={2}
                  value={state.minutes.unresolvedItems}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateState((prev) => ({ ...prev, minutes: { ...prev.minutes, unresolvedItems: val } }));
                  }}
                  style={{ width: '100%', padding: '6px 10px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* RACI Action Tracker */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#17245c' }}>
                  RACI Action Item Tracker with Clock Deadlines
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Every task must have exactly 1 individual owner, a strict clock cutoff, and verifiable proof.
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddAction}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: '#0f766e',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={14} />
                <span>Add Action Item</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '10px 12px', width: '30%' }}>Task Description</th>
                    <th style={{ padding: '10px 12px', width: '18%' }}>Single Owner</th>
                    <th style={{ padding: '10px 12px', width: '12%' }}>Clock Deadline</th>
                    <th style={{ padding: '10px 12px', width: '18%' }}>Blocker / Dependency</th>
                    <th style={{ padding: '10px 12px', width: '12%' }}>Status</th>
                    <th style={{ padding: '10px 12px', width: '10%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.actions.map((act) => (
                    <tr key={act.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px' }}>
                        <input
                          type="text"
                          value={act.task}
                          onChange={(e) => handleUpdateAction(act.id, 'task', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px 6px',
                            fontSize: '12.5px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                          }}
                        />
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          Proof: {act.evidence}
                        </div>
                      </td>

                      <td style={{ padding: '8px 12px' }}>
                        <input
                          type="text"
                          value={act.owner}
                          onChange={(e) => handleUpdateAction(act.id, 'owner', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px 6px',
                            fontSize: '12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </td>

                      <td style={{ padding: '8px 12px' }}>
                        <input
                          type="text"
                          value={act.deadline}
                          onChange={(e) => handleUpdateAction(act.id, 'deadline', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px 6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#0f766e',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </td>

                      <td style={{ padding: '8px 12px' }}>
                        <input
                          type="text"
                          value={act.blocker}
                          onChange={(e) => handleUpdateAction(act.id, 'blocker', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px 6px',
                            fontSize: '11.5px',
                            color: '#b91c1c',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </td>

                      <td style={{ padding: '8px 12px' }}>
                        <select
                          value={act.status}
                          onChange={(e) => handleUpdateAction(act.id, 'status', e.target.value as any)}
                          style={{
                            padding: '4px',
                            fontSize: '11.5px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            background:
                              act.status === 'Complete'
                                ? '#dcfce7'
                                : act.status === 'In Progress'
                                ? '#fef3c7'
                                : '#ffffff',
                          }}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Complete">Complete</option>
                        </select>
                      </td>

                      <td style={{ padding: '8px 12px' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteAction(act.id)}
                          title="Delete action item"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TaskCard>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 04: UPDATE THE MANAGER (S04-T04)                                     */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S04-T04"
          taskNumber="TASK 04"
          title="Update the Manager"
          instruction="Deliver a crisp 90-second Done-Next-Blocker (DNB) executive flash report articulating what the squad completed, the next milestone, and the ₹4,000 manager approval blocker."
          whyMatters="Senior leaders require rapid operational awareness without wading through minutes. A structured 90-second Done-Next-Blocker flash report surfaces critical decision gates before irreversible deadlines."
          statusText={`${dnbTotalWords} Words Across DNB · ${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, '0')}`}
          isActive={activeTaskId === 'S04-T04'}
          onSelectTask={() => setActiveTaskId('S04-T04')}
        >
          {/* Interactive 90-Second Timer Widget */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase' }}>
                Interactive Practice Rehearsal
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#17245c' }}>
                90-Second Done-Next-Blocker Verbal Report
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Practise concise executive reporting: What did the squad complete? What is next? What is blocking progress?
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  color: timerSeconds <= 15 ? '#dc2626' : '#0f766e',
                  background: '#ffffff',
                  padding: '4px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                }}
              >
                {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
              </div>

              {!timerRunning ? (
                <button
                  type="button"
                  onClick={handleStartTimer}
                  style={{
                    background: '#0f766e',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Play size={14} />
                  <span>Start</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePauseTimer}
                  style={{
                    background: '#ca8a04',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Pause size={14} />
                  <span>Pause</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetTimer}
                style={{
                  background: '#ffffff',
                  color: '#64748b',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* DNB Form Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0f766e', marginBottom: '4px' }}>
                1. DONE (Accomplished in the 12-minute meeting):
              </label>
              <textarea
                rows={2}
                value={state.dnbState.done}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    dnbState: { ...prev.dnbState, done: val },
                  }));
                }}
                placeholder="e.g. Conducted emergency review, evaluated ₹4,000 substitute cost versus contractual breach, and pre-aligned PO documentation..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '13px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>
                2. NEXT (Upcoming milestone before 15:00 manager review):
              </label>
              <textarea
                rows={2}
                value={state.dnbState.next}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    dnbState: { ...prev.dnbState, next: val },
                  }));
                }}
                placeholder="e.g. Procurement confirming substitute stock hold by 14:30; briefing General Manager for emergency expenditure sign-off at 15:00 sharp..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '13px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#dc2626', marginBottom: '4px' }}>
                3. BLOCKER (Critical dependency / approval gate):
              </label>
              <textarea
                rows={2}
                value={state.dnbState.blocker}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    dnbState: { ...prev.dnbState, blocker: val },
                  }));
                }}
                placeholder="e.g. Awaiting General Manager sign-off at 15:00 because the ₹4,000 rush fee exceeds the Operations Lead's ₹2,000 discretionary limit..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '13px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </TaskCard>

        {/* ---------------------------------------------------- */}
        {/* GOVERNANCE, SQUAD PEER REVIEW & PORTFOLIO SIGN-OFF   */}
        {/* ---------------------------------------------------- */}
        <div
          style={{
            marginTop: '12px',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FileCheck size={18} color="#0f766e" />
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#17245c' }}>
              Portfolio Governance, Peer Review &amp; Autonomous Boundary
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                File Version Format (Required: StudentID_S04_v01):
              </label>
              <input
                type="text"
                value={state.governance.fileVersion}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    governance: { ...prev.governance, fileVersion: val },
                  }));
                }}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: '13px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                1. My Attributable Individual Contribution Today (&ge;15 words):
              </label>
              <textarea
                rows={2}
                value={state.governance.contributionSummary}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    governance: { ...prev.governance, contributionSummary: val },
                  }));
                }}
                placeholder="Acted as Minute-Taker, documented the 4-item agenda, and enforced the ₹2,000 Operations Lead ceiling..."
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: '12.5px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                2. One Correction Flagged by Peer Review (&ge;10 words):
              </label>
              <textarea
                rows={2}
                value={state.governance.peerCorrection}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    governance: { ...prev.governance, peerCorrection: val },
                  }));
                }}
                placeholder="Reviewer noticed I had not assigned a single owner to the substitute parts receipt task..."
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: '12.5px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                3. Autonomous Commercial Boundary (Quality Stance &ge;10 words):
              </label>
              <textarea
                rows={2}
                value={state.governance.professionalBoundary}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    governance: { ...prev.governance, professionalBoundary: val },
                  }));
                }}
                placeholder="I will not promise 17:00 client delivery or authorize ₹4,000 before the General Manager approves at 15:00..."
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: '12.5px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Formative Review Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Autosaved to workstation store · Evaluated against 10-point Drive Edition 3.0 rubric.
            </div>

            <button
              type="button"
              onClick={handleRunReview}
              style={{
                background: '#0f766e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ShieldCheck size={16} />
              <span>Run Automated Formative Review</span>
            </button>
          </div>

          {/* Review Report Output */}
          {reviewReport && (
            <div
              style={{
                marginTop: '16px',
                background: '#ffffff',
                padding: '16px',
                borderRadius: '8px',
                border: reviewReport.hasErrors ? '1px solid #fecdd3' : '1px solid #bbf7d0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {reviewReport.hasErrors ? (
                    <AlertTriangle size={18} color="#e11d48" />
                  ) : (
                    <CheckCircle2 size={18} color="#16a34a" />
                  )}
                  <span style={{ fontSize: '14px', fontWeight: 700, color: reviewReport.hasErrors ? '#e11d48' : '#16a34a' }}>
                    {reviewReport.overallSummary}
                  </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Checks Passed: {reviewReport.passedChecks} / {reviewReport.totalChecks}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '12px' }}>
                {Object.entries(reviewReport.stages).map(([stageName, stageData]) => (
                  <div
                    key={stageName}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: stageData.status === 'reviewed' ? '#f0fdf4' : stageData.status === 'needs_revision' ? '#fff1f2' : '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{stageName}: {stageData.title}</div>
                    <div style={{ fontSize: '11px', color: stageData.status === 'reviewed' ? '#16a34a' : stageData.status === 'needs_revision' ? '#e11d48' : '#64748b' }}>
                      {stageData.passedCount} / {stageData.totalCount} passed ({stageData.status})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 10-Point Corporate Rubric Display */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          fontSize: '12.5px',
          color: '#475569',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#17245c', textTransform: 'uppercase', marginBottom: '8px' }}>
          Approved Drive 3.0 Assessment Rubric (10 Marks Total)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {S04_RUBRIC.map((r) => (
            <div key={r.name} style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f766e', marginBottom: '4px' }}>
                <span>{r.name}</span>
                <span>{r.points} Marks</span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', lineHeight: 1.4 }}>
                {r.evidence}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
