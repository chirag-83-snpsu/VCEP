'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S03_STORAGE_KEY,
  MAX_CLARIFY_WORDS,
  MAX_PROGRESS_WORDS,
  MAX_ESCALATION_WORDS,
  SAMPLE_CUSTOMER_BILLINGS,
  INITIAL_S03_STATE,
  S03_RUBRIC,
  countWords,
  detectSpeculativeWords,
  loadSession03State,
  saveSession03State,
  type Session03WorkstationState,
} from './session-03-communication-data.ts';
import { evaluateSession03 } from '../../../lib/review-engine/session-rules/session-03.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Send,
  MessageSquare,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info,
  RotateCcw,
  Sparkles,
  UserCheck,
  FileCheck,
  Calendar,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Session03CommunicationJourneyProps {
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
            <span>{whyOpen ? 'Hide communication principle' : 'Why this matters'}</span>
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
              <strong>Corporate Communication Standard:</strong> {whyMatters}
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

export function Session03CommunicationJourney({
  onUpdateDraft,
}: Session03CommunicationJourneyProps) {
  const [state, setState] = useState<Session03WorkstationState>(loadSession03State);
  const [activeTaskId, setActiveTaskId] = useState<string>('S03-T01');
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);

  const WIZARD_STEPS = [
    { id: 'S03-T01' as const, num: 1, label: 'TASK 01: Clarify the Request', short: '1. Clarify' },
    { id: 'S03-T02' as const, num: 2, label: 'TASK 02: Report Your Progress', short: '2. Progress' },
    { id: 'S03-T03' as const, num: 3, label: 'TASK 03: Escalate the Risk', short: '3. Escalate' },
    { id: 'S03-T04' as const, num: 4, label: 'Portfolio Governance, Peer Review & Verification', short: '4. Governance' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  // Hydrate on mount
  useEffect(() => {
    const loaded = loadSession03State();
    setState(loaded);
  }, []);

  // Save changes & propagate to parent draft
  const updateState = (updater: (prev: Session03WorkstationState) => Session03WorkstationState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession03State(next);

      // Sync with parent draft
      if (onUpdateDraft) {
        onUpdateDraft('work-prompt:0', next.clarificationEmail.body);
        onUpdateDraft('work-prompt:1', next.progressUpdate.body);
        onUpdateDraft('work-prompt:2', next.escalationMessage.body);
        onUpdateDraft('concept:explain', next.diagnostic.creditRiskExplanation);
        onUpdateDraft('missing:analysis', next.diagnostic.missingDataExplanation);
        onUpdateDraft('team:contribution', next.governance.contributionSummary);
        onUpdateDraft('team:judgement', next.governance.professionalBoundary);
        onUpdateDraft('criteria:notes', next.diagnostic.proposedCriteria);
      }

      return next;
    });
  };

  // Word counts
  const clarifyWords = useMemo(() => countWords(state.clarificationEmail.body), [state.clarificationEmail.body]);
  const progressWords = useMemo(() => countWords(state.progressUpdate.body), [state.progressUpdate.body]);
  const escalateWords = useMemo(() => countWords(state.escalationMessage.body), [state.escalationMessage.body]);

  // Tone audits
  const clarifyToneIssues = useMemo(() => detectSpeculativeWords(state.clarificationEmail.body), [state.clarificationEmail.body]);
  const progressToneIssues = useMemo(() => detectSpeculativeWords(state.progressUpdate.body), [state.progressUpdate.body]);
  const escalateToneIssues = useMemo(() => detectSpeculativeWords(state.escalationMessage.body), [state.escalationMessage.body]);

  // Pre-draft diagnostic validation
  const isDiagnosticComplete = useMemo(() => {
    return (
      state.diagnostic.missingDataExplanation.trim().length > 15 &&
      state.diagnostic.creditRiskExplanation.trim().length > 15
    );
  }, [state.diagnostic]);

  // Run automatic review
  const handleRunReview = () => {
    const report = evaluateSession03({
      sessionId: 3,
      lesson: {
        id: 3,
        title: 'Workplace Communication',
      },
      draft: {
        'work-prompt:0': state.clarificationEmail.body,
        'work-prompt:1': state.progressUpdate.body,
        'work-prompt:2': state.escalationMessage.body,
        'concept:explain': state.diagnostic.creditRiskExplanation,
        'missing:analysis': state.diagnostic.missingDataExplanation,
        'team:contribution': state.governance.contributionSummary,
        'team:judgement': state.governance.professionalBoundary,
      },
      workstationData: state,
    });
    setReviewReport(report);
  };

  // Reset workstation
  const handleReset = () => {
    if (typeof window !== 'undefined' && window.confirm('Reset all Session 03 message drafts and notes?')) {
      try {
        localStorage.removeItem(S03_STORAGE_KEY);
      } catch {}
      setState(INITIAL_S03_STATE);
      setReviewReport(null);
    }
  };

  // Insert professional starter
  const handleApplyStarter = (type: 'clarify' | 'progress' | 'escalation') => {
    if (type === 'clarify') {
      updateState((prev) => ({
        ...prev,
        clarificationEmail: {
          ...prev.clarificationEmail,
          body:
            'Dear Operations Manager,\n\nRegarding your request for the "best customers" report for today\'s 16:00 credit-limit review: our current file contains total billed invoices, but customer payment and collection dates are missing.\n\nBasing credit-limit increases strictly on sales volume introduces bad debt risk if high-volume clients pay late. If Accounts provides collection logs by 12:30, I will deliver the ranked assessment by 14:00. Otherwise, I will rank by invoiced revenue with an explicit unverified payment caveat.\n\nPlease confirm your preferred approach by 12:00.\n\nRegards,\n[Your Name] · Commercial Analyst',
        },
      }));
    } else if (type === 'progress') {
      updateState((prev) => ({
        ...prev,
        progressUpdate: {
          ...prev.progressUpdate,
          body:
            'Invoiced sales rankings are complete for all five key accounts. Awaiting the collection ledger from Accounts to verify payment speed. I will audit incoming records and send our next milestone update at 14:00.',
        },
      }));
    } else if (type === 'escalation') {
      updateState((prev) => ({
        ...prev,
        escalationMessage: {
          ...prev.escalationMessage,
          body:
            'Accounts confirmed customer payment ledgers remain locked for audit. Granting credit increases without payment history risks severe default. I have prepared the report ranked by billed sales, explicitly flagging unverified credit risk. I will deliver this draft by 14:30 and provide a final update at 15:15 ahead of the 16:00 decision.',
        },
      }));
    }
  };

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
            <Mail size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f766e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Two Natural Headings · Session 03
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#17245c' }}>
              Understand Request &rarr; Compose Response Portfolio
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href="#vcep-area-request"
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
            <span>1. Understand the Request</span>
          </a>
          <a
            href="#vcep-area-compose"
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
            <span>2. Compose the Response &rarr;</span>
          </a>
          <button
            type="button"
            onClick={handleReset}
            title="Reset drafts to start fresh"
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
      {/* HEADING 1: UNDERSTAND THE MANAGER'S REQUEST                               */}
      {/* ========================================================================= */}
      <section
        id="vcep-area-request"
        aria-labelledby="vcep-heading-request"
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
            id="vcep-heading-request"
            style={{ fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 800, color: '#17245c', margin: '4px 0 6px 0', letterSpacing: '-0.01em' }}
          >
            Understand the Manager’s Request
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            Before drafting any reply, examine the manager’s brief, identify missing information, and uncover the critical business risks.
          </p>
        </div>

        {/* 1.1 Simulated Manager Inbox Card */}
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
              <Mail size={15} color="#38bdf8" />
              <span>Incoming Corporate Email · Internal Messaging Protocol</span>
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
              PRIORITY: TODAY 16:00 DECISION
            </span>
          </div>

          <div style={{ padding: '16px 20px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '6px', fontSize: '13px', color: '#475569' }}>
              <strong>From:</strong>
              <span>Operations Manager &lt;ops.manager@company.internal&gt;</span>
              <strong>To:</strong>
              <span>Commercial Analyst &lt;student.workstation@company.internal&gt;</span>
              <strong>Sent:</strong>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>Today, 11:00 AM IST</span>
              <strong>Subject:</strong>
              <span style={{ color: '#17245c', fontWeight: 700 }}>Send the best customers report today</span>
            </div>
          </div>

          <div style={{ padding: '20px', fontSize: '14.5px', lineHeight: 1.6, color: '#1e293b' }}>
            <p style={{ margin: '0 0 12px 0' }}>Hi Team,</p>
            <p style={{ margin: '0 0 12px 0', fontWeight: 500 }}>
              <em>&ldquo;Send the best customers report today.&rdquo;</em>
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Context: We have our executive committee meeting at <strong>16:00 sharp</strong> to select customer accounts eligible for credit-limit increases.
            </p>
          </div>
        </div>

        {/* 1.2 Timeline & Milestones Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
            Critical Operational Timeline (11:00 AM &rarr; 16:00 PM Decision)
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
            }}
          >
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #0f766e' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f766e' }}>11:00 AM · RECEIVED</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Ambiguous Request</div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>"Best" is undefined. Sales known; collections missing.</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #eab308' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#ca8a04' }}>12:00 PM · CUTOFF</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Clarification Alignment</div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>Manager confirms revenue vs collection criteria.</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb' }}>13:00 PM · SYNC</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Progress Checkpoint</div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>Report invoice rankings; flag pending ledger.</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>14:00 PM · ROADBLOCK</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Data Unavailable</div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>Accounts cannot provide logs. Escalation required.</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #17245c' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#17245c' }}>16:00 PM · DEADLINE</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Credit Decision</div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>Executive meeting approves or denies credit limits.</div>
            </div>
          </div>
        </div>

        {/* 1.3 Available Data vs Missing Information Grid */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
            Current Working File: Available Facts vs Missing Records
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '10px 14px' }}>Account Code & Client</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Billed Sales (Invoiced)</th>
                  <th style={{ padding: '10px 14px' }}>Payment Ledger & Aging</th>
                  <th style={{ padding: '10px 14px' }}>Credit Assessment Status</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_CUSTOMER_BILLINGS.map((c, idx) => (
                  <tr key={c.id} style={{ borderBottom: idx < SAMPLE_CUSTOMER_BILLINGS.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>
                      <div>{c.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.id}</div>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#0f766e', whiteSpace: 'nowrap' }}>
                      ₹{c.billedRevenueINR.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#fef2f2',
                          color: '#b91c1c',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        <AlertCircle size={12} />
                        LOCKED IN ACCOUNTS
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '12px', color: '#64748b' }}>
                      {c.paymentHistoryNotes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontStyle: 'italic' }}>
            Notice: Apex Retail has ₹48.5L in billed sales, but zero verified collection records. If Apex pays 120 days late or has disputed invoices, granting an increased credit limit risks a ₹48.5L bad-debt write-off!
          </div>
        </div>

        {/* 1.4 Interactive Diagnostic / Missing Info Inquiry */}
        <div
          style={{
            background: '#f8fafc',
            padding: '16px 20px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <HelpCircle size={18} color="#0f766e" />
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#17245c' }}>
              Pre-Draft Diagnostic: Identify the Missing Facts Before Writing
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                1. What specific information is MISSING from the manager’s brief?
              </label>
              <textarea
                rows={2}
                value={state.diagnostic.missingDataExplanation}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    diagnostic: { ...prev.diagnostic, missingDataExplanation: val },
                  }));
                }}
                placeholder="Identify missing payment history, collection speed (DSO), overdue aging, and clear definition of 'best'..."
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
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                2. Why does ranking by sales volume alone create risk for a 16:00 credit-limit decision?
              </label>
              <textarea
                rows={2}
                value={state.diagnostic.creditRiskExplanation}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    diagnostic: { ...prev.diagnostic, creditRiskExplanation: val },
                  }));
                }}
                placeholder="Explain the difference between invoiced revenue vs cash collection reliability and potential bad-debt write-offs..."
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

          {isDiagnosticComplete && (
            <div
              style={{
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12.5px',
                color: '#0f766e',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={16} />
              <span>Independent inquiry recorded! Proceed below to complete your numbered task cards.</span>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HEADING 2: COMPOSE THE RESPONSE                                           */}
      {/* ========================================================================= */}
      <section
        id="vcep-area-compose"
        aria-labelledby="vcep-heading-compose"
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
            id="vcep-heading-compose"
            style={{ fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 800, color: '#17245c', margin: '4px 0 6px 0', letterSpacing: '-0.01em' }}
          >
            Compose the Response
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            Complete the three substantive deliverables comprising your professional workplace portfolio in sequentially numbered bordered task cards below.
          </p>
        </div>

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
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid #0f766e' : '1px solid transparent',
                  background: isActive ? '#0f766e' : '#f8fafc',
                  color: isActive ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  flex: '1 1 auto',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10.5px',
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

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 01: CLARIFY THE REQUEST (S03-T01)                                    */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S03-T01"
          taskNumber="TASK 01"
          title="Clarify the Request"
          instruction="Draft an email to clarify whether 'best customers' means total sales or cash collected, requesting missing payment records."
          learningTakeaway="Never act on ambiguous instructions—clarify whether 'best' means sales volume or cash collections before the 16:00 deadline."
          whyMatters="In corporate finance, acting on ambiguous instructions risks severe bad-debt exposure. Clarifying definitions and dependencies upfront protects credit decisions and sets professional boundaries."
          statusText={
            clarifyWords === 0
              ? 'Not started'
              : clarifyWords > MAX_CLARIFY_WORDS
              ? `Exceeds Limit (${clarifyWords}/${MAX_CLARIFY_WORDS}w)`
              : `Draft Saved (${clarifyWords}/${MAX_CLARIFY_WORDS}w)`
          }
          isActive={activeTaskId === 'S03-T01'}
          onSelectTask={() => setActiveTaskId('S03-T01')}
        >
          {/* Sub-header Context Bar */}
          <div
            style={{
              background: '#f8fafc',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#17245c' }}>
                Deliverable 1: Clarification Email (Max 120 Words)
              </span>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Establish criteria before running unverified reports. Distinguish billed revenue from collection speed.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleApplyStarter('clarify')}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#0f766e',
                background: '#ffffff',
                border: '1px solid #0f766e',
                borderRadius: '6px',
                padding: '5px 10px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={13} />
              <span>Insert Template Starter</span>
            </button>
          </div>

          {/* Email Composer Fields */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', width: '60px' }}>To:</span>
              <input
                type="text"
                value={state.clarificationEmail.recipient}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    clarificationEmail: { ...prev.clarificationEmail, recipient: val },
                  }));
                }}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  fontSize: '13px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#ffffff',
                }}
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', width: '60px' }}>Subject:</span>
              <input
                type="text"
                value={state.clarificationEmail.subject}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    clarificationEmail: { ...prev.clarificationEmail, subject: val },
                  }));
                }}
                placeholder="e.g. Clarification: Criteria & Data for Best Customers Report"
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  fontSize: '13px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#ffffff',
                  fontWeight: 600,
                }}
              />
            </div>

            <div style={{ padding: '14px' }}>
              <textarea
                rows={8}
                value={state.clarificationEmail.body}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    clarificationEmail: { ...prev.clarificationEmail, body: val },
                  }));
                }}
                placeholder="Write your clarification email here (maximum 120 words)...&#10;&#10;1. Acknowledge the 16:00 credit decision context&#10;2. Clarify whether 'best' means sales volume or prompt collection speed&#10;3. State that payment history is missing and explain credit risk&#10;4. Request collection data with a specific cutoff (e.g. 12:00 / 12:30)&#10;5. Propose a backup plan and commit to the next update time"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Live Feedback & Word Budget Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: clarifyWords > MAX_CLARIFY_WORDS ? '#dc2626' : clarifyWords >= 40 ? '#0f766e' : '#f59e0b',
                  color: '#ffffff',
                }}
              >
                {clarifyWords} / {MAX_CLARIFY_WORDS} words
              </span>
              {clarifyWords > MAX_CLARIFY_WORDS && (
                <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
                  Exceeds 120-word corporate limit! Trim {clarifyWords - MAX_CLARIFY_WORDS} words.
                </span>
              )}
              {clarifyWords >= 40 && clarifyWords <= MAX_CLARIFY_WORDS && (
                <span style={{ fontSize: '12px', color: '#0f766e', fontWeight: 600 }}>
                  Within executive word budget (40–120 words).
                </span>
              )}
            </div>

            {clarifyToneIssues.length > 0 ? (
              <div style={{ fontSize: '12px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={14} />
                <span>Speculative language detected: &ldquo;{clarifyToneIssues.join(', ')}&rdquo;. Use factual terms.</span>
              </div>
            ) : (
              clarifyWords > 0 && (
                <div style={{ fontSize: '12px', color: '#0f766e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} />
                  <span>Objective, professional corporate tone verified.</span>
                </div>
              )
            )}
          </div>
        </TaskCard>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 02: REPORT YOUR PROGRESS (S03-T02)                                   */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S03-T02"
          taskNumber="TASK 02"
          title="Report Your Progress"
          instruction="Send a concise 13:00 progress update stating completed work, the pending collection ledger, and next checkpoint."
          learningTakeaway="Proactive mid-day updates keep leaders informed on completed work and dependencies without speculative excuses."
          whyMatters="Executive stakeholders need proactive predictability. Concise progress updates confirm completed milestones and surface upstream bottlenecks before deadlines are compromised."
          statusText={
            progressWords === 0
              ? 'Not started'
              : progressWords > MAX_PROGRESS_WORDS
              ? `Exceeds Limit (${progressWords}/${MAX_PROGRESS_WORDS}w)`
              : `Update Saved (${progressWords}/${MAX_PROGRESS_WORDS}w)`
          }
          isActive={activeTaskId === 'S03-T02'}
          onSelectTask={() => setActiveTaskId('S03-T02')}
        >
          {/* Sub-header Context Bar */}
          <div
            style={{
              background: '#f8fafc',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#17245c' }}>
                Deliverable 2: Mid-Day Progress Update (Max 40 Words)
              </span>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Provide a concise status check at 13:00 reporting invoiced progress, pending Accounts ledger, and next checkpoint.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleApplyStarter('progress')}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#0f766e',
                background: '#ffffff',
                border: '1px solid #0f766e',
                borderRadius: '6px',
                padding: '5px 10px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={13} />
              <span>Insert Template Starter</span>
            </button>
          </div>

          {/* Chat/Memo Style Composer */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ background: '#f1f5f9', padding: '10px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Channel / Recipient:</span>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f766e' }}>#commercial-operations &rarr; Operations Manager</span>
            </div>

            <div style={{ padding: '14px' }}>
              <textarea
                rows={4}
                value={state.progressUpdate.body}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    progressUpdate: { ...prev.progressUpdate, body: val },
                  }));
                }}
                placeholder="Draft your mid-day progress message (maximum 40 words)...&#10;&#10;e.g.: Invoiced sales rankings are complete for all 5 key accounts. Awaiting the collection ledger from Accounts to verify payment history. Next update will be provided at 14:00."
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Word budget & tone audit */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: progressWords > MAX_PROGRESS_WORDS ? '#dc2626' : progressWords >= 15 ? '#0f766e' : '#f59e0b',
                  color: '#ffffff',
                }}
              >
                {progressWords} / {MAX_PROGRESS_WORDS} words
              </span>
              {progressWords > MAX_PROGRESS_WORDS && (
                <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
                  Exceeds 40-word limit! Trim {progressWords - MAX_PROGRESS_WORDS} words.
                </span>
              )}
              {progressWords >= 15 && progressWords <= MAX_PROGRESS_WORDS && (
                <span style={{ fontSize: '12px', color: '#0f766e', fontWeight: 600 }}>
                  Within 40-word executive status budget (15–40 words).
                </span>
              )}
            </div>

            {progressToneIssues.length > 0 ? (
              <div style={{ fontSize: '12px', color: '#b91c1c' }}>
                Avoid speculative terms: &ldquo;{progressToneIssues.join(', ')}&rdquo;.
              </div>
            ) : (
              progressWords > 0 && (
                <div style={{ fontSize: '12px', color: '#0f766e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} />
                  <span>Objective status verified.</span>
                </div>
              )
            )}
          </div>
        </TaskCard>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 03: ESCALATE THE RISK (S03-T03)                                      */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S03-T03"
          taskNumber="TASK 03"
          title="Escalate the Risk"
          instruction="Alert management about the ₹1,45,000 credit limit risk using factual figures before the 16:00 credit meeting."
          learningTakeaway="Escalate commercial credit risks with exact figures early to prevent bad debt exposure."
          whyMatters="Silence during a roadblock causes corporate surprises. Timely, constructive escalations state the objective business risk and offer an actionable workaround so executive decision-makers are never blindsided."
          statusText={
            escalateWords === 0
              ? 'Not started'
              : escalateWords > MAX_ESCALATION_WORDS
              ? `Exceeds Limit (${escalateWords}/${MAX_ESCALATION_WORDS}w)`
              : `Escalation Saved (${escalateWords}/${MAX_ESCALATION_WORDS}w)`
          }
          isActive={activeTaskId === 'S03-T03'}
          onSelectTask={() => setActiveTaskId('S03-T03')}
        >
          {/* Roadblock Simulation Memo */}
          <div
            style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              padding: '14px 18px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#be123c', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
              <AlertCircle size={16} />
              <span>Simulated Roadblock at 14:00: Payment Data Unavailable</span>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#881337', lineHeight: 1.5 }}>
              <em>From Accounts Receivable (14:00):</em> &ldquo;The customer payment ledger is locked for quarterly reconciliation. No collection records can be released today.&rdquo;
            </p>
            <div style={{ fontSize: '12px', color: '#9f1239' }}>
              <strong>Your Action:</strong> Send an immediate formal escalation (&le;70 words). State the bad-debt risk, propose a constructive fallback (rank by invoiced sales with an explicit risk caveat), and set an achievable next update before the 16:00 credit meeting.
            </div>
          </div>

          <div
            style={{
              background: '#f8fafc',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#17245c' }}>
              Deliverable 3: 14:00 Escalation Message (Max 70 Words)
            </span>
            <button
              type="button"
              onClick={() => handleApplyStarter('escalation')}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#0f766e',
                background: '#ffffff',
                border: '1px solid #0f766e',
                borderRadius: '6px',
                padding: '4px 10px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={13} />
              <span>Insert Template Starter</span>
            </button>
          </div>

          {/* Composer */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', width: '60px' }}>Subject:</span>
              <input
                type="text"
                value={state.escalationMessage.subject}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    escalationMessage: { ...prev.escalationMessage, subject: val },
                  }));
                }}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  fontSize: '13px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#ffffff',
                  fontWeight: 600,
                }}
              />
            </div>

            <div style={{ padding: '14px' }}>
              <textarea
                rows={5}
                value={state.escalationMessage.body}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    escalationMessage: { ...prev.escalationMessage, body: val },
                  }));
                }}
                placeholder="Compose your escalation message (maximum 70 words)...&#10;&#10;1. State the data roadblock (collection ledger locked)&#10;2. Articulate the commercial risk (proceeding risks bad debt)&#10;3. Offer constructive fallback (invoiced ranking with explicit risk disclaimer)&#10;4. Provide next touchpoint before the 16:00 decision meeting"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Word budget */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: escalateWords > MAX_ESCALATION_WORDS ? '#dc2626' : escalateWords >= 20 ? '#0f766e' : '#f59e0b',
                  color: '#ffffff',
                }}
              >
                {escalateWords} / {MAX_ESCALATION_WORDS} words
              </span>
              {escalateWords > MAX_ESCALATION_WORDS && (
                <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
                  Exceeds 70-word limit! Trim {escalateWords - MAX_ESCALATION_WORDS} words.
                </span>
              )}
              {escalateWords >= 20 && escalateWords <= MAX_ESCALATION_WORDS && (
                <span style={{ fontSize: '12px', color: '#0f766e', fontWeight: 600 }}>
                  Within 70-word escalation limit (20–70 words).
                </span>
              )}
            </div>

            {escalateToneIssues.length > 0 ? (
              <div style={{ fontSize: '12px', color: '#b91c1c' }}>
                Avoid speculative terms: &ldquo;{escalateToneIssues.join(', ')}&rdquo;.
              </div>
            ) : (
              escalateWords > 0 && (
                <div style={{ fontSize: '12px', color: '#0f766e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} />
                  <span>Objective risk framing verified.</span>
                </div>
              )
            )}
          </div>
        </TaskCard>

        {/* ---------------------------------------------------- */}
        {/* GOVERNANCE, SQUAD PEER REVIEW & PORTFOLIO SIGN-OFF   */}
        {/* ---------------------------------------------------- */}
        <div
          style={{
            display: activeTaskId === 'S03-T04' ? 'block' : 'none',
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
              Portfolio Governance, Peer Review & Autonomous Boundary
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                File Version Format (Required: StudentID_S03_v01):
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
                placeholder="Authored the clarification email distinguishing billed sales from cash collections..."
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
                placeholder="Peer reviewer caught that I exceeded 120 words and failed to mention the 16:00 decision deadline..."
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
                placeholder="I will not recommend increasing credit limits for high-volume accounts without verified payment receipts..."
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
            {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Portfolio Complete ✓' : 'Save & Continue →'}
          </button>
        </footer>
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
          {S03_RUBRIC.map((r) => (
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
