'use client';

import React, { useState, useEffect } from 'react';
import {
  INITIAL_RUN_OF_SHOW,
  INITIAL_EXHIBITS,
  INITIAL_DEFENSE,
  INITIAL_PASSPORT_COMPETENCIES,
  INITIAL_CAREER_PLAN_90_DAY,
  INITIAL_SCORECARD,
  DEFAULT_STUDENT_CONTRIBUTION,
  DEFAULT_REVIEWER_CORRECTION,
  INITIAL_CHECKLIST_LABELS,
  S24_RUBRIC,
  DEFAULT_SESSION_24_STATE,
  type Session24State,
  type ApprovedExhibit,
  type PassportCompetency,
  type CareerMilestone90Day,
} from './session-24-passport-data';
import { useAutomaticReview } from '@/lib/review-engine/engine';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  Layers,
  Clock,
  UserCheck,
  Building,
  Briefcase,
  HelpCircle,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Database,
  Lock,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const STORAGE_KEY = 'vcep:s24:drive-v3:student-workstation';

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

interface Session24Props {
  onUpdateDraft?: (field: string, value: string) => void;
}

export function Session24PassportJourney({ onUpdateDraft }: Session24Props) {
  const [state, setState] = useState<Session24State>(DEFAULT_SESSION_24_STATE);
  const [activeTaskId, setActiveTaskId] = useState<string>('S24-T01');
  const [selectedExhibitId, setSelectedExhibitId] = useState<string>('EX-03');
  const [selectedCompetencyId, setSelectedCompetencyId] = useState<string>('PASSPORT-01');
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  // Sync with LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          ...parsed,
          defense: { ...prev.defense, ...(parsed.defense || {}) },
          governance: { ...prev.governance, ...(parsed.governance || {}) },
        }));
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (updated: Session24State) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setDraftTimestamp(timestamp);
    const withTime = { ...updated, timestamp };
    setState(withTime);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(withTime));
    } catch {}

    if (onUpdateDraft) {
      onUpdateDraft('work-prompt:0', `Assigned: ${updated.defense.assignedArtifactId} | Contrib: ${updated.defense.personalContribution}`);
      onUpdateDraft('work-prompt:1', updated.passport.map((p) => `${p.domain} (${p.verifiedArtifactId}): ${p.facultyEvaluationStatus}`).join(' | '));
      onUpdateDraft('work-prompt:2', updated.careerPlan.map((c) => `${c.horizon}: ${c.actionTitle}`).join(' | '));
      onUpdateDraft('team:contribution', updated.studentContribution);
      onUpdateDraft('team:judgement', updated.reviewerCorrection);
    }
  };

  const handleUpdateDefense = (field: keyof typeof state.defense, val: string) => {
    const updatedDefense = { ...state.defense, [field]: val };
    saveState({ ...state, defense: updatedDefense });
  };

  const handleUpdateCareerPlan = (index: number, field: keyof CareerMilestone90Day, val: string) => {
    const updatedPlan = [...state.careerPlan];
    updatedPlan[index] = { ...updatedPlan[index], [field]: val };
    saveState({ ...state, careerPlan: updatedPlan });
  };

  const toggleChecklist = (idx: number) => {
    const current = state.checklistIndices || [];
    const updated = current.includes(idx) ? current.filter((x) => x !== idx) : [...current, idx];
    saveState({ ...state, checklistIndices: updated });
  };

  // Real-time automatic review evaluation
  const reviewContextDraft = {
    'concept:explain': 'The VCEP Industry Passport is a competency-based professional transcript validating demonstrated workplace capabilities. Unlike traditional certificates of completion, the Passport records verifiable artifact IDs, objective scorecards, faculty sign-offs, and explicit skill boundaries.',
    'work-prompt:0': `Assigned: ${state.defense.assignedArtifactId} | Contrib: ${state.defense.personalContribution}`,
    'work-prompt:1': state.passport.map((p) => `${p.domain} (${p.verifiedArtifactId}): ${p.facultyEvaluationStatus}`).join(' | '),
    'work-prompt:2': state.careerPlan.map((c) => `${c.horizon}: ${c.actionTitle}`).join(' | '),
    'team:contribution': state.studentContribution,
    'team:judgement': state.reviewerCorrection,
  };

  const reviewReport = useAutomaticReview(24, { id: 24, title: 'Corporate Demo Day and Industry Passport' }, reviewContextDraft);

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;
  const currentExhibit = state.exhibits.find((e) => e.id === selectedExhibitId) || state.exhibits[0];

  const contribWords = wordCount(state.defense.personalContribution);
  const defectWords = wordCount(state.defense.defectCorrectionHistory);
  const methodWords = wordCount(state.defense.technicalMethodology);
  const limitsWords = wordCount(state.defense.scopeLimitations);

  const isDefenseComplete =
    contribWords >= 20 &&
    defectWords >= 20 &&
    methodWords >= 20 &&
    limitsWords >= 15;

  const totalScorecardMarks = state.scorecard.reduce((sum, sc) => sum + sc.awardedMarks, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1200px', margin: '0 auto', padding: '0 12px 60px' }}>
      {/* Session Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #17245C 0%, #0F766E 100%)',
          borderRadius: '16px',
          padding: '24px 28px',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(23, 36, 92, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ background: '#E5AF2E', color: '#17245C', fontSize: '0.75rem', fontWeight: 800, padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Session 24 · Capstone Culmination
              </span>
              <span style={{ fontSize: '0.85rem', color: '#99f6e4', fontWeight: 600 }}>
                Drive Edition 3.0 · Graduation & Certification
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#ffffff' }}>
              Corporate Demo Day and Industry Passport
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#ccfbf1', margin: 0, fontWeight: 500 }}>
              Mission: <strong>Show the Evidence. Own Your Growth.</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building size={14} color="#E5AF2E" /> Corporate Demo Day
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#34d399" /> Verified Industry Passport
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={14} color="#fcd34d" /> 90-Day Career Plan
            </span>
          </div>
        </div>

        {draftTimestamp && (
          <div style={{ marginTop: '16px', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={13} color="#34d399" /> Autosaved locally at {draftTimestamp}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* HEADING 1: PRESENT & DEFEND YOUR WORK (#vcep-area-present)                 */}
      {/* ========================================================================= */}
      <section id="vcep-area-present" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Building size={20} color="#17245C" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Demonstration Day & Individual Viva
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#17245C', margin: '0 0 6px' }}>
            1. Present & Defend Your Work
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            Cohort presents reviewed capstone deliverables before an external panel of corporate evaluators. External judges score
            independently before discussion. Every student must defend an assigned genuine artifact during a 2-minute individual defense station.
          </p>
        </div>

        {/* Demo Day Run-of-Show Protocol Banner */}
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Run-of-Show Protocol
              </span>
              <h3 style={{ fontSize: '1.15rem', color: '#17245C', margin: '2px 0 0', fontWeight: 700 }}>
                Faculty-Authorised Demo Day Run-of-Show
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
              Total Duration: 135 Minutes · Supervised Examination
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left', color: '#17245C' }}>
                  <th style={{ padding: '8px 10px' }}>Time Range</th>
                  <th style={{ padding: '8px 10px' }}>Activity Name</th>
                  <th style={{ padding: '8px 10px' }}>Participants</th>
                  <th style={{ padding: '8px 10px' }}>Format & Operating Rules</th>
                </tr>
              </thead>
              <tbody>
                {state.runOfShow.map((ros) => (
                  <tr key={ros.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 600, color: '#0F766E' }}>
                      {ros.timeRange}
                    </td>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>{ros.activityName}</td>
                    <td style={{ padding: '8px 10px', color: '#475569' }}>{ros.participants}</td>
                    <td style={{ padding: '8px 10px', color: '#64748b' }}>{ros.formatNotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* TASK 01: Present the Project (S24-T01)                              */}
        {/* ------------------------------------------------------------------- */}
        <TaskCard
          taskId="S24-T01"
          taskNumber="TASK 01"
          title="Present the Project"
          outputBadge="Reviewed Showcase & External Evaluation"
          instruction="Demonstrate approved business work and respond to reviewer questions before the external evaluation panel."
          whyMatters="External executive reviewers expect concise demonstrations of working solutions rather than slide-only promises. Presenting your approved business model with complete transparency into methodology establishes professional credibility."
          statusText={state.conflictCheckCertified ? 'Scorecard & COI Signoff Complete' : 'Reviewer Evaluation Ready'}
          persistenceText="Showcase & Scorecard Synced"
          isActive={activeTaskId === 'S24-T01'}
          onSelect={() => setActiveTaskId('S24-T01')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Approved Capstone Exhibits Library */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Capstone Exhibit Library
                  </span>
                  <h4 style={{ fontSize: '1.05rem', color: '#17245C', margin: '2px 0 0', fontWeight: 700 }}>
                    Source-Linked Approved Capstone Exhibits
                  </h4>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  5 Authenticated Student Deliverables
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                {state.exhibits.map((ex) => {
                  const isSelected = selectedExhibitId === ex.id;
                  return (
                    <div
                      key={ex.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExhibitId(ex.id);
                      }}
                      style={{
                        background: isSelected ? '#ffffff' : '#ffffff',
                        border: isSelected ? '2px solid #0F766E' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 4px 12px rgba(15, 118, 110, 0.15)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#E5AF2E', background: '#17245C', padding: '2px 6px', borderRadius: '4px' }}>
                          {ex.id}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#0F766E', fontWeight: 700 }}>{ex.artifactId}</span>
                      </div>
                      <strong style={{ fontSize: '0.82rem', color: '#17245C', display: 'block', margin: '4px 0 2px' }}>
                        {ex.title}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>{ex.curriculumSession}</span>
                      <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem', color: '#0F766E', fontWeight: 600 }}>
                        {ex.keyMetric}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Exhibit Detail Box */}
              <div style={{ background: '#ffffff', border: '1px solid #99f6e4', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#17245C', display: 'block' }}>
                    Active Exhibit: {currentExhibit.title} ({currentExhibit.artifactId})
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                    Official Submission File: <code>{currentExhibit.fileLink}</code> · Verified Case F / Version 2.0
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateDefense('assignedArtifactId', currentExhibit.artifactId);
                    setActiveTaskId('S24-T02');
                  }}
                  style={{
                    background: '#0F766E',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Assign to My Defense Station →
                </button>
              </div>
            </div>

            {/* Independent Judge Scorecard & Conflict Check */}
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    External Evaluation Panel
                  </span>
                  <h4 style={{ fontSize: '1.05rem', color: '#17245C', margin: '2px 0 0', fontWeight: 700 }}>
                    Independent Judge Scoring & Official Aggregation
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                    Aggregated Score: {totalScorecardMarks} / 10 Marks
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                {state.scorecard.map((sc) => (
                  <div key={sc.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>{sc.dimension}</strong>
                      <span style={{ background: '#0F766E', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {sc.awardedMarks} / {sc.maxMarks} Marks
                      </span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: '#475569', margin: '4px 0 0', lineHeight: 1.4 }}>
                      {sc.judgeComment}
                    </p>
                  </div>
                ))}
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.conflictCheckCertified}
                  onChange={(e) => saveState({ ...state, conflictCheckCertified: e.target.checked })}
                />
                <span style={{ fontSize: '0.78rem', color: '#115e59', fontWeight: 600 }}>
                  External Evaluator Conflict-of-Interest Sign-Off: Judges certify independent evaluation without prior coaching or direct managerial conflict.
                </span>
              </label>
            </div>
          </div>
        </TaskCard>

        {/* ------------------------------------------------------------------- */}
        {/* TASK 02: Defend Your Contribution (S24-T02)                        */}
        {/* ------------------------------------------------------------------- */}
        <TaskCard
          taskId="S24-T02"
          taskNumber="TASK 02"
          title="Defend Your Contribution"
          outputBadge="Attributable Individual Defense Station"
          instruction="Identify one personally attributable artifact and explain your method, evidence, defect correction history, and scope limitations in the 2-minute defense station."
          whyMatters="Team deliverables can obscure individual capability. Corporate assessors require each candidate to stand behind a specific piece of work, explain its mechanics, acknowledge defect remediation, and define where the solution stops."
          statusText={isDefenseComplete ? 'Defense Ready (All Minima Met)' : 'Defense In Progress'}
          persistenceText="Defense Responses Autosaved"
          isActive={activeTaskId === 'S24-T02'}
          onSelect={() => setActiveTaskId('S24-T02')}
        >
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Individual Oral Examination
                </span>
                <h4 style={{ fontSize: '1.05rem', color: '#17245C', margin: '2px 0 0', fontWeight: 700 }}>
                  Individual 2-Minute Artifact-Defense Station
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                Assigned: {state.defense.assignedArtifactId}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px', lineHeight: 1.4 }}>
              Team presentations never substitute for individual competence. Defend your personal contribution, formula mechanics,
              peer defect correction history, and scope boundaries before the external panel.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {/* 1. Personal Contribution */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                    1. My Personal Attributable Contribution
                  </label>
                  <span style={{ fontSize: '0.7rem', color: contribWords >= 20 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {contribWords} words (min 20)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.defense.personalContribution}
                  onChange={(e) => handleUpdateDefense('personalContribution', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', lineHeight: 1.4 }}
                />
              </div>

              {/* 2. Defect & Correction History */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                    2. Peer Review Defect & Correction History
                  </label>
                  <span style={{ fontSize: '0.7rem', color: defectWords >= 20 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {defectWords} words (min 20)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.defense.defectCorrectionHistory}
                  onChange={(e) => handleUpdateDefense('defectCorrectionHistory', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', lineHeight: 1.4 }}
                />
              </div>

              {/* 3. Technical Methodology */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                    3. Technical Methodology & Formula Mechanics
                  </label>
                  <span style={{ fontSize: '0.7rem', color: methodWords >= 20 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {methodWords} words (min 20)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.defense.technicalMethodology}
                  onChange={(e) => handleUpdateDefense('technicalMethodology', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', lineHeight: 1.4 }}
                />
              </div>

              {/* 4. Scope Limitations */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                    4. Scope Limitations & Relational Boundaries
                  </label>
                  <span style={{ fontSize: '0.7rem', color: limitsWords >= 15 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {limitsWords} words (min 15)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.defense.scopeLimitations}
                  onChange={(e) => handleUpdateDefense('scopeLimitations', e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', lineHeight: 1.4 }}
                />
              </div>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* ========================================================================= */}
      {/* HEADING 2: VERIFY YOUR INDUSTRY PASSPORT (#vcep-area-passport)             */}
      {/* ========================================================================= */}
      <section id="vcep-area-passport" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShieldCheck size={20} color="#0F766E" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Credential Verification & Career Progression
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#17245C', margin: '0 0 6px' }}>
            2. Verify Your Industry Passport
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            The VCEP Industry Passport reports demonstrated performance within its evaluated scope. Review your six verified
            competency domains, ensure unverified skills remain unverified, and establish a 90-day post-programme career acceleration plan.
          </p>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* TASK 03: Verify Your Industry Passport (S24-T03)                   */}
        {/* ------------------------------------------------------------------- */}
        <TaskCard
          taskId="S24-T03"
          taskNumber="TASK 03"
          title="Verify Your Industry Passport"
          outputBadge="6-Domain Competency Transcript"
          instruction="Review student identity, verified artifact IDs, reviewer record, competency scores, and explicit competence scope boundaries across the 6 evaluated domains."
          whyMatters="An Industry Passport is only as valuable as its verification rigor. Reviewing authentic artifact hashes, faculty sign-offs, and clear boundary notices guarantees that your credential represents genuine verified execution rather than superficial attendance."
          statusText="6 Domains Verified"
          persistenceText="Passport Transcript Verified"
          isActive={activeTaskId === 'S24-T03'}
          onSelect={() => setActiveTaskId('S24-T03')}
        >
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #0F766E',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 8px 20px -4px rgba(15, 118, 110, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#17245C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} color="#E5AF2E" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', color: '#17245C', margin: 0, fontWeight: 800 }}>
                    VCEP Official Industry Passport
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 600 }}>
                    Digital Competency Transcript · Authenticated Curriculum Hash: <code>VCEP-2026-ED3</code>
                  </span>
                </div>
              </div>
              <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> CERTIFIED & AUDITED
              </span>
            </div>

            {/* Explicit Credential Scope & Non-Guarantee Notice */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>
              <strong>Credential Boundary Notice:</strong> This transcript validates demonstrated technical competence in supervised simulated commercial environments (Case F & Case G). It certifies specific analytical methods and formula execution; it does not constitute an automatic guarantee of corporate employment or broad-scope professional licensure.
            </div>

            {/* Six Core Competency Domains Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {state.passport.map((comp) => {
                const isVerified = comp.facultyEvaluationStatus === 'VERIFIED';
                return (
                  <div
                    key={comp.id}
                    style={{
                      background: '#ffffff',
                      border: isVerified ? '1px solid #cbd5e1' : '1px solid #fde68a',
                      borderRadius: '8px',
                      padding: '14px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {comp.domain}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: isVerified ? '#dcfce7' : '#fef3c7',
                          color: isVerified ? '#166534' : '#92400e',
                        }}
                      >
                        {comp.facultyEvaluationStatus}
                      </span>
                    </div>
                    <strong style={{ fontSize: '0.9rem', color: '#17245C', display: 'block', marginBottom: '4px' }}>
                      {comp.title}
                    </strong>
                    <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 8px', lineHeight: 1.4 }}>
                      {comp.demonstratedProof}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '6px', fontSize: '0.7rem', color: '#64748b' }}>
                      <span><strong>Evidence ID:</strong> {comp.verifiedArtifactId}</span>
                      <span>Date: {comp.certifiedDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TaskCard>

        {/* ------------------------------------------------------------------- */}
        {/* TASK 04: Set Your 90-Day Plan (S24-T04)                             */}
        {/* ------------------------------------------------------------------- */}
        <TaskCard
          taskId="S24-T04"
          taskNumber="TASK 04"
          title="Set Your 90-Day Plan"
          outputBadge="Career Roadmap & Governance Sign-Off"
          instruction="Record three dated improvement actions across 30-day horizons with tangible progress evidence, squad peer review logs, and three-tier governance sign-offs."
          whyMatters="Completing the program is the beginning of career progression. Establishing structured 30-day horizons backed by tangible portfolio artifacts and formal governance sign-offs ensures continuous momentum and professional accountability."
          statusText={state.governance.humanAcknowledged ? 'Roadmap & Sign-Offs Complete' : 'Roadmap In Progress'}
          persistenceText="Roadmap & Sign-Offs Synced"
          isActive={activeTaskId === 'S24-T04'}
          onSelect={() => setActiveTaskId('S24-T04')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 90-Day Post-Programme Career Acceleration Plan */}
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Actionable Career Roadmap
                  </span>
                  <h4 style={{ fontSize: '1.05rem', color: '#17245C', margin: '2px 0 0', fontWeight: 700 }}>
                    90-Day Post-Programme Career Acceleration Plan
                  </h4>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Three Structured 30-Day Horizons
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px', lineHeight: 1.4 }}>
                Formulate three concrete career advancement milestones linking directly to verified VCEP evidence, case studies, and corporate job applications.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {state.careerPlan.map((milestone, idx) => (
                  <div key={milestone.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: '#17245C', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                          Horizon {idx + 1}
                        </span>
                        <strong style={{ fontSize: '0.88rem', color: '#17245C' }}>{milestone.horizon}</strong>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 600 }}>Due: {milestone.targetDueDate}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                          Action Description & Strategy
                        </label>
                        <textarea
                          rows={2}
                          value={milestone.actionPlan}
                          onChange={(e) => handleUpdateCareerPlan(idx, 'actionPlan', e.target.value)}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', lineHeight: 1.4 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                          Tangible Evidence of Progress
                        </label>
                        <textarea
                          rows={2}
                          value={milestone.evidenceOfProgress}
                          onChange={(e) => handleUpdateCareerPlan(idx, 'evidenceOfProgress', e.target.value)}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', lineHeight: 1.4 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Squad Contribution & Peer Defect Correction Log */}
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <UserCheck size={20} color="#17245C" />
                <h4 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                  Squad Contribution & Peer Review Defect Correction Log
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                      My Attributable Demo Day & Portfolio Contribution
                    </label>
                    <span style={{ fontSize: '0.7rem', color: wordCount(state.studentContribution) >= 25 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                      {wordCount(state.studentContribution)} words (min 25)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={state.studentContribution}
                    onChange={(e) => saveState({ ...state, studentContribution: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', lineHeight: 1.4 }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                      Peer Reviewer Defect Correction (Before vs After)
                    </label>
                    <span style={{ fontSize: '0.7rem', color: wordCount(state.reviewerCorrection) >= 25 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                      {wordCount(state.reviewerCorrection)} words (min 25)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={state.reviewerCorrection}
                    onChange={(e) => saveState({ ...state, reviewerCorrection: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', lineHeight: 1.4 }}
                  />
                </div>
              </div>
            </div>

            {/* Program Completion Checklist */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CheckCircle2 size={18} color="#0F766E" />
                <h4 style={{ fontSize: '1rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                  Demo Day & Industry Passport Completion Checklist
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {INITIAL_CHECKLIST_LABELS.map((item, idx) => {
                  const checked = (state.checklistIndices || []).includes(idx);
                  return (
                    <label
                      key={idx}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '8px 12px',
                        background: checked ? '#f0fdf4' : '#ffffff',
                        border: checked ? '1px solid #86efac' : '1px solid #e2e8f0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        color: checked ? '#166534' : '#334155',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleChecklist(idx)}
                        style={{ marginTop: '2px' }}
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Three-Tier Governance & Human Credential Acknowledgement */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <ShieldCheck size={18} color="#0F766E" />
                <h4 style={{ fontSize: '1rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                  Three-Tier Governance Sign-Off & Credential Release
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                    Candidate Graduate (Preparer)
                  </label>
                  <input
                    type="text"
                    value={state.governance.preparerName}
                    onChange={(e) =>
                      saveState({ ...state, governance: { ...state.governance, preparerName: e.target.value } })
                    }
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                    Faculty QA / External Judge
                  </label>
                  <input
                    type="text"
                    value={state.governance.reviewerName}
                    onChange={(e) =>
                      saveState({ ...state, governance: { ...state.governance, reviewerName: e.target.value } })
                    }
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                    Academic Dean / Placement Lead
                  </label>
                  <input
                    type="text"
                    value={state.governance.decisionOwner}
                    onChange={(e) =>
                      saveState({ ...state, governance: { ...state.governance, decisionOwner: e.target.value } })
                    }
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                    Official Deliverable Filename
                  </label>
                  <input
                    type="text"
                    value={state.governance.fileVersion}
                    onChange={(e) =>
                      saveState({ ...state, governance: { ...state.governance, fileVersion: e.target.value } })
                    }
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700, color: '#0F766E' }}
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={state.governance.humanAcknowledged}
                  onChange={(e) =>
                    saveState({
                      ...state,
                      governance: { ...state.governance, humanAcknowledged: e.target.checked },
                    })
                  }
                />
                <span style={{ fontSize: '0.78rem', color: '#17245C', fontWeight: 600 }}>
                  Mandatory Human Credential Acknowledgement: I certify that all Industry Passport competency claims reflect my own verified deliverables, that unverified skills remain unverified, and that no automatic placement guarantees have been claimed.
                </span>
              </label>
            </div>

            {/* 10-Point Educational Rubric Scorecard */}
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Award size={18} color="#17245C" />
                <h4 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                  10-Point Educational Rubric Compliance
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px' }}>
                Official summative grading rubric for Session 24 capstone portfolio, individual defense, and Industry Passport:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {S24_RUBRIC.map((r, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>{r.name}</strong>
                      <span style={{ background: '#0F766E', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {r.points} Marks
                      </span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: '#475569', margin: 0 }}>{r.evidence}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Automatic Formative Review Status Banner */}
            <div
              style={{
                background: reviewReport.overallStatus === 'reviewed' ? '#f0fdf4' : '#fffbeb',
                border: `1px solid ${reviewReport.overallStatus === 'reviewed' ? '#86efac' : '#fde68a'}`,
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={22} color={reviewReport.overallStatus === 'reviewed' ? '#15803d' : '#d97706'} />
                <div>
                  <strong style={{ fontSize: '1rem', color: reviewReport.overallStatus === 'reviewed' ? '#15803d' : '#b45309', display: 'block' }}>
                    {reviewReport.overallStatus === 'reviewed'
                      ? 'Automatic Review: Industry Passport Certified & Verified'
                      : 'Automatic Review: Verification In Progress'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: reviewReport.overallStatus === 'reviewed' ? '#166534' : '#92400e' }}>
                    {reviewReport.overallSummary}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {Object.values(reviewReport.stages).map((st) => (
                  <span
                    key={st.stage}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: st.status === 'reviewed' ? '#dcfce7' : '#fef3c7',
                      color: st.status === 'reviewed' ? '#166534' : '#92400e',
                    }}
                  >
                    {st.stage}: {st.status}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TaskCard>
      </section>
    </div>
  );
}
