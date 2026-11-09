'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  INITIAL_AGENDA,
  INITIAL_SLIDES,
  INITIAL_EXEC_SUMMARY,
  INITIAL_CHALLENGES,
  INITIAL_PERMISSIONS,
  DEFAULT_DEMO_SCRIPT,
  DEFAULT_STUDENT_CONTRIBUTION,
  DEFAULT_REVIEWER_CORRECTION,
  INITIAL_CHECKLIST_LABELS,
  S23_RUBRIC,
  DEFAULT_SESSION_23_STATE,
  type Session23State,
  type PresentationSlide,
  type DefenseChallenge,
  type AgendaSection,
} from './session-23-presentation-data';
import { useAutomaticReview } from '@/lib/review-engine/engine';
import {
  Presentation,
  Clock,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  ChevronRight,
  UserCheck,
  Award,
  ExternalLink,
  Info,
  Calendar,
  Sparkles,
  HelpCircle,
  TrendingDown,
  ArrowRight,
  Database,
  Lock,
  Target,
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

const STORAGE_KEY = 'vcep:s23:drive-v3:student-workstation';

interface Session23Props {
  onUpdateDraft?: (field: string, value: string) => void;
}

export function Session23PresentationJourney({ onUpdateDraft }: Session23Props) {
  const [activeTaskId, setActiveTaskId] = useState<string>('S23-T01');
  const [state, setState] = useState<Session23State>(DEFAULT_SESSION_23_STATE);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string>('CH-01');
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          ...parsed,
          governance: { ...prev.governance, ...(parsed.governance || {}) },
          execSummary: { ...prev.execSummary, ...(parsed.execSummary || {}) },
          demoRehearsal: { ...prev.demoRehearsal, ...(parsed.demoRehearsal || {}) },
        }));
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (updated: Session23State) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setDraftTimestamp(timestamp);
    const withTime = { ...updated, timestamp };
    setState(withTime);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(withTime));
    } catch {}

    if (onUpdateDraft) {
      onUpdateDraft('work-prompt:0', updated.challenges.map((c) => `${c.id}: ${c.studentDefenseAnswer || c.squadDefenseStrategy}`).join(' | '));
      onUpdateDraft('work-prompt:1', updated.demoScript);
      onUpdateDraft('team:contribution', updated.studentContribution);
      onUpdateDraft('team:judgement', updated.reviewerCorrection);
    }
  };

  // Stopwatch Logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleUpdateSlide = (index: number, field: keyof PresentationSlide, val: any) => {
    const updatedSlides = [...state.slides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: val };
    saveState({ ...state, slides: updatedSlides });
  };

  const handleUpdateExecSummary = (field: keyof typeof state.execSummary, val: string) => {
    const updatedSummary = { ...state.execSummary, [field]: val };
    saveState({ ...state, execSummary: updatedSummary });
  };

  const handleUpdateChallenge = (id: string, answer: string) => {
    const updatedChallenges = state.challenges.map((c) =>
      c.id === id ? { ...c, studentDefenseAnswer: answer } : c
    );
    saveState({ ...state, challenges: updatedChallenges });
  };

  const togglePermission = (id: string) => {
    const current = state.checkedPermissions || [];
    const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    saveState({ ...state, checkedPermissions: updated });
  };

  const toggleChecklist = (idx: number) => {
    const current = state.checklistIndices || [];
    const updated = current.includes(idx) ? current.filter((x) => x !== idx) : [...current, idx];
    saveState({ ...state, checklistIndices: updated });
  };

  // Real-time automatic review evaluation
  const reviewContextDraft = {
    'concept:explain': 'Executive presentations persuade through evidence, structure, and live verification. Senior leaders require concise briefings: Problem Context (1 min) → Methodology & Evidence (1 min) → Live Model Demo (3 min) → Commercial Counter-Proposal (1 min) → Governance & Boundaries (1 min).',
    'work-prompt:0': state.challenges.map((c) => `${c.id}: ${c.studentDefenseAnswer || c.squadDefenseStrategy}`).join(' | '),
    'work-prompt:1': state.demoScript,
    'team:contribution': state.studentContribution,
    'team:judgement': state.reviewerCorrection,
  };

  const reviewReport = useAutomaticReview(23, { id: 23, title: 'Corporate Presentation Preparation' }, reviewContextDraft);

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;
  const currentSlide = state.slides[selectedSlideIndex] || state.slides[0];

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
                Session 23
              </span>
              <span style={{ fontSize: '0.85rem', color: '#99f6e4', fontWeight: 600 }}>
                Drive Edition 3.0 · Capstone Presentation
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#ffffff' }}>
              Corporate Presentation Preparation
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#ccfbf1', margin: 0, fontWeight: 500 }}>
              Mission: <strong>Present the Work. Defend the Decision.</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Presentation size={14} color="#E5AF2E" /> 6-Slide Executive Deck
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#34d399" /> 7m Pitch (3m Live Demo)
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={14} color="#fcd34d" /> 8m Panel Q&A
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
      {/* HEADING 1: CHOOSE WHAT MANAGEMENT NEEDS (#vcep-area-management)           */}
      {/* ========================================================================= */}
      <section id="vcep-area-management" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Layers size={20} color="#17245C" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Executive Briefing Architecture
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#17245C', margin: '0 0 6px' }}>
            1. Choose What Management Needs
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            Senior management decisions depend on brevity, evidence, and verifiable numbers. Structure an up-to-six-slide deck
            and a one-page executive summary that clearly articulate the business problem, baseline facts, working model,
            commercial trade-offs, and explicit scope boundaries.
          </p>
        </div>

        {/* Executive Presentation Ground Rules Banner */}
        <div
          style={{
            background: '#041d3a',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #1e3a8a',
            color: '#f8fafc',
            marginBottom: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} color="#E5AF2E" />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#93c5fd', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                OFFICIAL CAPSTONE SPECIFICATION · MANAGEMENT GROUND RULES
              </span>
              <h3 style={{ margin: '2px 0 0', color: '#ffffff', fontSize: '1.15rem', fontWeight: 700 }}>
                Seven-Minute Squad Presentation with Three-Minute Live Demo Inside
              </h3>
            </div>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: '0 0 14px', lineHeight: 1.5 }}>
            <strong>The Executive Scenario:</strong> Your squad receives exactly seven minutes to present to the Managing Director
            and Board of Vayentra Labs. Exactly three minutes within that seven must be a live working demonstration of Model v2.0.
            An eight-minute cross-examination follows immediately. A business reviewer must judge supervised usability.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            <div style={{ background: '#092348', border: '1px solid #1e3a8a', borderRadius: '8px', padding: '10px 12px' }}>
              <span style={{ fontSize: '0.72rem', color: '#93c5fd', display: 'block', fontWeight: 700 }}>SLIDE DISCIPLINE</span>
              <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>Strict Max 6 Slides</strong>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '3px 0 0' }}>Problem, evidence, demo, recommendation, limits, handover.</p>
            </div>
            <div style={{ background: '#092348', border: '1px solid #1e3a8a', borderRadius: '8px', padding: '10px 12px' }}>
              <span style={{ fontSize: '0.72rem', color: '#93c5fd', display: 'block', fontWeight: 700 }}>TIME BUDGET</span>
              <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>7 Min Total (3 Min Demo)</strong>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '3px 0 0' }}>Strict stop at 7:00; 8:00 of panel questions follows.</p>
            </div>
            <div style={{ background: '#092348', border: '1px solid #1e3a8a', borderRadius: '8px', padding: '10px 12px' }}>
              <span style={{ fontSize: '0.72rem', color: '#93c5fd', display: 'block', fontWeight: 700 }}>CORE VERDICT</span>
              <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>Supervised Usability</strong>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '3px 0 0' }}>Reviewer must judge whether model is safe to deploy.</p>
            </div>
          </div>
        </div>

        {/* TASK 01: STRUCTURE THE STORY */}
        <TaskCard
          taskId="S23-T01"
          taskNumber="TASK 01"
          title="Structure the Story"
          instruction="Draft the one-page executive summary covering problem context, source evidence, working demo method, commercial decision, scope limitations, and next steps."
          whyMatters="Executive boards need actionable decision documents before oral pitches. Structuring the narrative into six clear sections ensures leadership understands the operational risk, baseline financial facts, and verified model outcomes before the live demonstration."
          outputBadge="Executive Briefing Document"
          persistenceText={draftTimestamp ? `Auto-saved at ${draftTimestamp}` : 'Auto-saved'}
          isActive={activeTaskId === 'S23-T01'}
          onSelectTask={() => setActiveTaskId('S23-T01')}
        >
          {/* One-Page Executive Summary Editor */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Written Briefing Deliverable
                </span>
                <h4 style={{ fontSize: '1.1rem', color: '#17245C', margin: '2px 0 0', fontWeight: 700 }}>
                  One-Page Executive Summary Briefing
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                6 Mandatory Sections · Target: Concise Commercial Rigor
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px', lineHeight: 1.4 }}>
              Distill the capstone project into six crisp paragraphs ready for immediate executive review prior to the oral pitch.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {/* 1. Problem Context */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#17245C' }}>1. Business Problem Context</strong>
                  <span style={{ fontSize: '0.7rem', color: wordCount(state.execSummary.problemContext) >= 15 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {wordCount(state.execSummary.problemContext)} words (min 15)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.execSummary.problemContext}
                  onChange={(e) => handleUpdateExecSummary('problemContext', e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', lineHeight: 1.4 }}
                />
              </div>

              {/* 2. Source Evidence */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#17245C' }}>2. Source Records & Baseline Evidence</strong>
                  <span style={{ fontSize: '0.7rem', color: wordCount(state.execSummary.sourceEvidence) >= 15 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {wordCount(state.execSummary.sourceEvidence)} words (min 15)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.execSummary.sourceEvidence}
                  onChange={(e) => handleUpdateExecSummary('sourceEvidence', e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', lineHeight: 1.4 }}
                />
              </div>

              {/* 3. Working Demo Method */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#17245C' }}>3. Working Demonstration Method</strong>
                  <span style={{ fontSize: '0.7rem', color: wordCount(state.execSummary.workingDemoMethod) >= 20 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {wordCount(state.execSummary.workingDemoMethod)} words (min 20)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.execSummary.workingDemoMethod}
                  onChange={(e) => handleUpdateExecSummary('workingDemoMethod', e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', lineHeight: 1.4 }}
                />
              </div>

              {/* 4. Commercial Decision */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#17245C' }}>4. Commercial Decision & Counter-Proposal</strong>
                  <span style={{ fontSize: '0.7rem', color: wordCount(state.execSummary.commercialDecision) >= 15 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {wordCount(state.execSummary.commercialDecision)} words (min 15)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.execSummary.commercialDecision}
                  onChange={(e) => handleUpdateExecSummary('commercialDecision', e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', lineHeight: 1.4 }}
                />
              </div>

              {/* 5. Scope Limitations */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#17245C' }}>5. Scope Boundaries & Relational Limits</strong>
                  <span style={{ fontSize: '0.7rem', color: wordCount(state.execSummary.scopeLimitations) >= 15 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {wordCount(state.execSummary.scopeLimitations)} words (min 15)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.execSummary.scopeLimitations}
                  onChange={(e) => handleUpdateExecSummary('scopeLimitations', e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', lineHeight: 1.4 }}
                />
              </div>

              {/* 6. Next Steps & Handover */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#17245C' }}>6. Next Steps & Supervised Handover</strong>
                  <span style={{ fontSize: '0.7rem', color: wordCount(state.execSummary.nextStepsHandover) >= 15 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {wordCount(state.execSummary.nextStepsHandover)} words (min 15)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={state.execSummary.nextStepsHandover}
                  onChange={(e) => handleUpdateExecSummary('nextStepsHandover', e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', lineHeight: 1.4 }}
                />
              </div>
            </div>
          </div>
        </TaskCard>

        {/* TASK 02: BUILD THE PRESENTATION */}
        <TaskCard
          taskId="S23-T02"
          taskNumber="TASK 02"
          title="Build the Presentation"
          instruction="Construct up to six factual presentation slides tied directly to verified capstone evidence records and approved change orders."
          whyMatters="Slide discipline prevents cognitive overload. A concise six-slide deck forces presenters to focus strictly on verified calculations, concrete change orders (CR-01 and CR-02), and defensible trade-offs rather than speculative claims."
          outputBadge="6-Slide Executive Deck"
          persistenceText="State Preserved"
          isActive={activeTaskId === 'S23-T02'}
          onSelectTask={() => setActiveTaskId('S23-T02')}
        >
          {/* 6-Slide Presentation Builder */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Executive Deck Studio
                </span>
                <h4 style={{ fontSize: '1.1rem', color: '#17245C', margin: '2px 0 0', fontWeight: 700 }}>
                  Inside-VCEP Six-Slide Presentation Builder
                </h4>
              </div>
              <span style={{ fontSize: '0.78rem', background: '#e2e8f0', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                Slide {selectedSlideIndex + 1} of 6
              </span>
            </div>

            {/* Slide Navigation Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '18px' }}>
              {state.slides.map((s, idx) => (
                <button
                  key={s.slideNum}
                  type="button"
                  onClick={() => setSelectedSlideIndex(idx)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '6px',
                    border: selectedSlideIndex === idx ? '2px solid #0F766E' : '1px solid #cbd5e1',
                    background: selectedSlideIndex === idx ? '#f0fdfa' : '#ffffff',
                    color: selectedSlideIndex === idx ? '#0F766E' : '#475569',
                    fontWeight: selectedSlideIndex === idx ? 700 : 500,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Slide {s.slideNum}
                </button>
              ))}
            </div>

            {/* Active Slide Editor & Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              {/* Left: Interactive Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Slide {currentSlide.slideNum} Title
                  </label>
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={(e) => handleUpdateSlide(selectedSlideIndex, 'title', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#17245C', background: '#ffffff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Key Slide Takeaways (3 Bullet Points, 1 per line)
                  </label>
                  <textarea
                    rows={4}
                    value={currentSlide.keyPoints.join('\n')}
                    onChange={(e) => handleUpdateSlide(selectedSlideIndex, 'keyPoints', e.target.value.split('\n'))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', lineHeight: 1.4, color: '#1e293b', background: '#ffffff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Approved Capstone Evidence Reference
                  </label>
                  <input
                    type="text"
                    value={currentSlide.evidenceReference}
                    onChange={(e) => handleUpdateSlide(selectedSlideIndex, 'evidenceReference', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', color: '#0F766E', fontWeight: 600, background: '#ffffff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Speaker Script & Defense Notes
                  </label>
                  <textarea
                    rows={3}
                    value={currentSlide.speakerNotes}
                    onChange={(e) => handleUpdateSlide(selectedSlideIndex, 'speakerNotes', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', color: '#334155', background: '#ffffff' }}
                  />
                </div>
              </div>

              {/* Right: Slide Visual Canvas Card */}
              <div
                style={{
                  background: '#17245C',
                  borderRadius: '10px',
                  padding: '20px',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
                  boxShadow: '0 4px 12px rgba(23, 36, 92, 0.15)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#E5AF2E', fontWeight: 800, textTransform: 'uppercase' }}>
                      VAYENTRA LABS · EXECUTIVE BRIEFING
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Slide {currentSlide.slideNum} / 6</span>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', color: '#ffffff', margin: '0 0 14px', fontWeight: 700 }}>
                    {currentSlide.title || 'Untitled Slide'}
                  </h4>
                  <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                    {currentSlide.keyPoints.filter(Boolean).map((pt, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
                  <span><strong>Source Ref:</strong> {currentSlide.evidenceReference}</span>
                  <span style={{ background: '#0F766E', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>Verified Model v2.0</span>
                </div>
              </div>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* ========================================================================= */}
      {/* HEADING 2: REHEARSE YOUR DEMONSTRATION (#vcep-area-rehearsal)              */}
      {/* ========================================================================= */}
      <section id="vcep-area-rehearsal" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Play size={20} color="#0F766E" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Execution & Defense Rehearsal
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#17245C', margin: '0 0 6px' }}>
            2. Rehearse Your Demonstration
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            Rehearse the exact seven-minute pitch with a working demonstration of Model v2.0 inside. Test live dynamic date refreshes,
            enforce zero-variance control totals, and master the mathematical defense for three hostile reviewer challenge questions.
          </p>
        </div>

        {/* TASK 03: TEST THE LIVE DEMONSTRATION */}
        <TaskCard
          taskId="S23-T03"
          taskNumber="TASK 03"
          title="Test the Live Demonstration"
          instruction="Rehearse the seven-minute squad agenda, verify source scope permissions, and test the dynamic As-Of date refresh in Model v2.0 showing zero variance in control totals."
          whyMatters="Live software demonstrations fail if timing or permissions are unverified. Rehearsing the exact 3-minute demo inside the 7-minute window and proving mathematical invariance under dynamic date shifts builds executive confidence."
          outputBadge="7m Rehearsal & Model v2.0 Demo"
          persistenceText="State Preserved"
          isActive={activeTaskId === 'S23-T03'}
          onSelectTask={() => setActiveTaskId('S23-T03')}
        >
          {/* 7-Minute Pitch Timer & Rehearsal Schedule */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Rehearsal Stopwatch
                </span>
                <h4 style={{ fontSize: '1.1rem', color: '#17245C', margin: '2px 0 0', fontWeight: 700 }}>
                  Interactive 7-Minute Presentation Pacing Control
                </h4>
              </div>

              {/* Stopwatch Widget */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0f172a', borderRadius: '10px', padding: '8px 16px', color: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#38bdf8" />
                  <span style={{ fontFamily: 'monospace', fontSize: '1.35rem', fontWeight: 700, color: timerSeconds > 420 ? '#ef4444' : '#38bdf8' }}>
                    {formatTimer(timerSeconds)}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>/ 07:00</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    style={{
                      background: isTimerRunning ? '#f59e0b' : '#10b981',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(0);
                    }}
                    style={{
                      background: '#334155',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Agenda Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', background: '#ffffff', borderRadius: '6px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left', color: '#17245C' }}>
                    <th style={{ padding: '8px 10px' }}>Segment Window</th>
                    <th style={{ padding: '8px 10px' }}>Topic & Objective</th>
                    <th style={{ padding: '8px 10px' }}>Assigned Speaker</th>
                    <th style={{ padding: '8px 10px' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {state.agenda.map((ag) => {
                    const isDemo = ag.durationMinutes === 3;
                    return (
                      <tr
                        key={ag.id}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: isDemo ? '#f0fdfa' : 'transparent',
                          fontWeight: isDemo ? 600 : 400,
                        }}
                      >
                        <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: isDemo ? '#0F766E' : '#334155' }}>
                          {ag.minuteRange}
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ color: '#17245C', fontWeight: 600 }}>{ag.sectionName}</span>
                          <span style={{ display: 'block', fontSize: '0.74rem', color: '#64748b' }}>{ag.coreObjective}</span>
                        </td>
                        <td style={{ padding: '8px 10px', color: '#475569' }}>{ag.assignedSpeaker}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <span
                            style={{
                              background: isDemo ? '#0F766E' : '#e2e8f0',
                              color: isDemo ? '#ffffff' : '#334155',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                            }}
                          >
                            {ag.durationMinutes} min {isDemo ? '· LIVE DEMO' : ''}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Source Records & Scope Permission Checker */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Database size={18} color="#0F766E" />
              <h4 style={{ fontSize: '1rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                Source & Permission Integrity Checker
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px' }}>
              Certify that all presentation claims and working demonstration formulas adhere strictly to authorized VCEP curriculum releases:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {INITIAL_PERMISSIONS.map((p) => {
                const isChecked = (state.checkedPermissions || []).includes(p.id);
                return (
                  <label
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: isChecked ? '#f0fdfa' : '#ffffff',
                      border: isChecked ? '1px solid #99f6e4' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePermission(p.id)}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.82rem', color: '#17245C', display: 'block' }}>{p.label}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.detail}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Supervised Model v2.0 Demonstration */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Supervised Model v2.0 Demonstration
                </span>
                <h4 style={{ fontSize: '1.1rem', color: '#17245C', margin: '2px 0 0', fontWeight: 700 }}>
                  Live Model v2.0 Refresh & Date Shift Rehearsal
                </h4>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>As-Of Date Toggle:</span>
                <button
                  type="button"
                  onClick={() =>
                    saveState({
                      ...state,
                      demoRehearsal: {
                        ...state.demoRehearsal,
                        asOfDate: state.demoRehearsal.asOfDate === '2026-10-31' ? '2026-11-01' : '2026-10-31',
                      },
                    })
                  }
                  style={{
                    background: state.demoRehearsal.asOfDate === '2026-11-01' ? '#0F766E' : '#17245C',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Calendar size={13} /> {state.demoRehearsal.asOfDate} (Click to Switch)
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px', lineHeight: 1.4 }}>
              In the 3-minute live demonstration, demonstrate that switching the As-Of date from 31-Oct to 01-Nov dynamically shifts
              Asha Technologies from <em>Current</em> to <em>1–30 Days Overdue</em>, while the reconciled total remains ₹95,000.
            </p>

            {/* Model Live Data Table */}
            <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', background: '#ffffff', borderRadius: '6px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left', color: '#17245C' }}>
                    <th style={{ padding: '6px 8px' }}>Inv ID</th>
                    <th style={{ padding: '6px 8px' }}>Customer</th>
                    <th style={{ padding: '6px 8px' }}>Due Date</th>
                    <th style={{ padding: '6px 8px' }}>Baseline INR</th>
                    <th style={{ padding: '6px 8px' }}>Credit Note</th>
                    <th style={{ padding: '6px 8px' }}>Model v2.0 INR</th>
                    <th style={{ padding: '6px 8px' }}>Aging Bucket ({state.demoRehearsal.asOfDate})</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', background: state.demoRehearsal.asOfDate === '2026-11-01' ? '#fef3c7' : 'transparent' }}>
                    <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>F01</td>
                    <td style={{ padding: '6px 8px', fontWeight: 600 }}>Asha Technologies</td>
                    <td style={{ padding: '6px 8px' }}>2026-10-31</td>
                    <td style={{ padding: '6px 8px' }}>₹10,000</td>
                    <td style={{ padding: '6px 8px', color: '#64748b' }}>₹0</td>
                    <td style={{ padding: '6px 8px', fontWeight: 700 }}>₹10,000</td>
                    <td style={{ padding: '6px 8px' }}>
                      <span
                        style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: state.demoRehearsal.asOfDate === '2026-11-01' ? '#f59e0b' : '#10b981',
                          color: '#ffffff',
                        }}
                      >
                        {state.demoRehearsal.asOfDate === '2026-11-01' ? '1–30 Days Overdue (1 day)' : 'Current (Due Today)'}
                      </span>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>F02</td>
                    <td style={{ padding: '6px 8px', fontWeight: 600 }}>Beacon Logistics</td>
                    <td style={{ padding: '6px 8px' }}>2026-10-16</td>
                    <td style={{ padding: '6px 8px' }}>₹20,000</td>
                    <td style={{ padding: '6px 8px', color: '#dc2626', fontWeight: 600 }}>-₹5,000 (CR-01)</td>
                    <td style={{ padding: '6px 8px', fontWeight: 700 }}>₹15,000</td>
                    <td style={{ padding: '6px 8px' }}><span style={{ background: '#f59e0b', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>1–30 Days Overdue</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>F03</td>
                    <td style={{ padding: '6px 8px', fontWeight: 600 }}>Cedar Enterprises</td>
                    <td style={{ padding: '6px 8px' }}>2026-09-16</td>
                    <td style={{ padding: '6px 8px' }}>₹30,000</td>
                    <td style={{ padding: '6px 8px', color: '#64748b' }}>₹0</td>
                    <td style={{ padding: '6px 8px', fontWeight: 700 }}>₹30,000</td>
                    <td style={{ padding: '6px 8px' }}><span style={{ background: '#ea580c', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>31–60 Days Overdue</span></td>
                  </tr>
                  <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                    <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>F04</td>
                    <td style={{ padding: '6px 8px', fontWeight: 600 }}>Delta Systems</td>
                    <td style={{ padding: '6px 8px' }}>2026-08-17</td>
                    <td style={{ padding: '6px 8px' }}>₹40,000</td>
                    <td style={{ padding: '6px 8px', color: '#64748b' }}>₹0</td>
                    <td style={{ padding: '6px 8px', fontWeight: 700 }}>₹40,000</td>
                    <td style={{ padding: '6px 8px' }}><span style={{ background: '#dc2626', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>61–90+ Days Overdue</span></td>
                  </tr>
                  <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                    <td colSpan={3} style={{ padding: '8px', color: '#17245C' }}>CONTROL TOTALS (Zero Variance Invariance):</td>
                    <td style={{ padding: '8px' }}>₹1,00,000</td>
                    <td style={{ padding: '8px', color: '#dc2626' }}>-₹5,000</td>
                    <td style={{ padding: '8px', color: '#0F766E' }}>₹95,000</td>
                    <td style={{ padding: '8px', color: '#15803d' }}>✓ Invariant at ₹95,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Demonstration Click Script */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Three-Minute Live Demonstration Step-by-Step Click Script
              </label>
              <textarea
                rows={4}
                value={state.demoScript}
                onChange={(e) => saveState({ ...state, demoScript: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', lineHeight: 1.4, color: '#17245C', background: '#ffffff' }}
              />
            </div>
          </div>
        </TaskCard>

        {/* TASK 04: PRACTISE THE DEFENCE */}
        <TaskCard
          taskId="S23-T04"
          taskNumber="TASK 04"
          title="Practise the Defence"
          instruction="Formulate rigorous verbal defenses for three hostile reviewer challenge questions, log individual squad contributions and peer defect corrections, and certify governance sign-offs."
          whyMatters="Cross-examination tests candidate depth and fiduciary integrity. Defending the commercial discount trap, Beacon default resilience, and CRM isolation proves true ownership and workplace readiness."
          outputBadge="Panel Defense & Sign-Offs"
          persistenceText="State Preserved"
          isActive={activeTaskId === 'S23-T04'}
          onSelectTask={() => setActiveTaskId('S23-T04')}
        >
          {/* Three Tough Reviewer Challenge Defense Drills */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Eight-Minute Q&A Defense Drills
                </span>
                <h4 style={{ fontSize: '1.1rem', color: '#17245C', margin: '2px 0 0', fontWeight: 700 }}>
                  Three Tough Reviewer Cross-Examination Defenses
                </h4>
              </div>
              <span style={{ fontSize: '0.78rem', background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                Hostile Reviewer Simulation
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {state.challenges.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveChallengeId(c.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: activeChallengeId === c.id ? '2px solid #17245C' : '1px solid #cbd5e1',
                    background: activeChallengeId === c.id ? '#17245C' : '#ffffff',
                    color: activeChallengeId === c.id ? '#ffffff' : '#475569',
                    fontWeight: activeChallengeId === c.id ? 700 : 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {c.id}
                </button>
              ))}
            </div>

            {/* Active Challenge Card */}
            {(() => {
              const challenge = state.challenges.find((c) => c.id === activeChallengeId) || state.challenges[0];
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <HelpCircle size={16} color="#d97706" />
                      <strong style={{ fontSize: '0.88rem', color: '#92400e' }}>Panel Question:</strong>
                    </div>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#78350f', margin: '0 0 6px' }}>
                      "{challenge.reviewerQuestion}"
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#b45309' }}>
                      <strong>Key Vulnerability:</strong> {challenge.keyVulnerability}
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Candidate Verbal Defense Response (Show calculations and internal control principles):
                    </label>
                    <textarea
                      rows={4}
                      value={challenge.studentDefenseAnswer || challenge.squadDefenseStrategy}
                      onChange={(e) => handleUpdateChallenge(challenge.id, e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', lineHeight: 1.4, color: '#17245C', background: '#ffffff' }}
                    />
                  </div>

                  <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '8px', padding: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', display: 'block', marginBottom: '2px' }}>
                      OFFICIAL SQUAD MODEL DEFENSE:
                    </span>
                    <p style={{ fontSize: '0.78rem', color: '#115e59', margin: 0, lineHeight: 1.4 }}>
                      {challenge.squadDefenseStrategy}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Attributable Contribution & Peer Defect Correction */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <UserCheck size={20} color="#17245C" />
              <h4 style={{ fontSize: '1.1rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                Squad Contribution & Peer Defect Correction Log
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                    My Attributable Slide & Rehearsal Contribution
                  </label>
                  <span style={{ fontSize: '0.7rem', color: wordCount(state.studentContribution) >= 25 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {wordCount(state.studentContribution)} words (min 25)
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={state.studentContribution}
                  onChange={(e) => saveState({ ...state, studentContribution: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', lineHeight: 1.4, background: '#ffffff' }}
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
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', lineHeight: 1.4, background: '#ffffff' }}
                />
              </div>
            </div>
          </div>

          {/* Three-Tier Governance & Deliverable File Tracking */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldCheck size={18} color="#0F766E" />
              <h4 style={{ fontSize: '1rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                Three-Tier Governance Sign-Off & Deliverable Tracking
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                  Candidate Squad Lead (Preparer)
                </label>
                <input
                  type="text"
                  value={state.governance.preparerName}
                  onChange={(e) =>
                    saveState({ ...state, governance: { ...state.governance, preparerName: e.target.value } })
                  }
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 600, background: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                  Faculty QA / Peer Reviewer
                </label>
                <input
                  type="text"
                  value={state.governance.reviewerName}
                  onChange={(e) =>
                    saveState({ ...state, governance: { ...state.governance, reviewerName: e.target.value } })
                  }
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 600, background: '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                  Managing Director / Decision Owner
                </label>
                <input
                  type="text"
                  value={state.governance.decisionOwner}
                  onChange={(e) =>
                    saveState({ ...state, governance: { ...state.governance, decisionOwner: e.target.value } })
                  }
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 600, background: '#ffffff' }}
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
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700, color: '#0F766E', background: '#ffffff' }}
                />
              </div>
            </div>
          </div>

          {/* 10-Point Educational Rubric Scorecard */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Award size={18} color="#17245C" />
              <h4 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                10-Point Educational Rubric Compliance
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px' }}>
              Official assessment criteria for Session 23 capstone presentation and executive summary:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              {S23_RUBRIC.map((r, idx) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
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
                    ? 'Automatic Review: Corporate Presentation Ready for Review'
                    : 'Automatic Review: Preparation In Progress'}
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
        </TaskCard>
      </section>
    </div>
  );
}

