'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  SESSION_21_STORAGE_KEY,
  DEFAULT_SESSION_21_STATE,
  AUTHORIZED_STUDENT_ARTIFACTS,
  PortfolioCategory,
  PortfolioArtifact,
  ResumeBullet,
  S21_RUBRIC,
  INITIAL_CHECKLIST_LABELS,
  Session21State,
} from './session-21-portfolio-data';
import {
  Award,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Search,
  Filter,
  Check,
  RefreshCw,
  Play,
  RotateCcw,
  Sparkles,
  Lock,
  ChevronRight,
  UserCheck,
  Target,
  HelpCircle,
  ChevronDown,
  ChevronUp,
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

interface Props {
  onUpdateDraft?: (field: string, value: any) => void;
}

export function Session21PortfolioJourney({ onUpdateDraft }: Props) {
  const [state, setState] = useState<Session21State>(DEFAULT_SESSION_21_STATE);
  const [activeTaskId, setActiveTaskId] = useState<string>('S21-T01');
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');
  const [selectedArtifactModal, setSelectedArtifactModal] = useState<PortfolioArtifact | null>(null);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(45);

  const WIZARD_STEPS = [
    { id: 'S21-T01' as const, num: 1, label: 'Task 01 — Find Verified Evidence', short: '1. Evidence' },
    { id: 'S21-T02' as const, num: 2, label: 'Task 02 — Write Resume Achievements', short: '2. Achievements' },
    { id: 'S21-T03' as const, num: 3, label: 'Task 03 — Create Professional Summary', short: '3. Summary' },
    { id: 'S21-T04' as const, num: 4, label: 'Task 04 — Build the Portfolio Index', short: '4. Portfolio Index' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_21_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  // 45-second recruiter challenge timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds]);

  const saveState = (updated: Session21State) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    const withTime = { ...updated, timestamp };
    setState(withTime);
    try {
      localStorage.setItem(SESSION_21_STORAGE_KEY, JSON.stringify(withTime));
    } catch {}
    if (onUpdateDraft) {
      onUpdateDraft('session-21-state', withTime);
    }
  };

  const handleReset = () => {
    saveState({ ...DEFAULT_SESSION_21_STATE, timestamp: new Date().toLocaleTimeString() });
    setTimerSeconds(45);
    setTimerActive(false);
  };

  const handleToggleChecklist = (index: number) => {
    const next = [...state.checklist];
    next[index] = !next[index];
    saveState({ ...state, checklist: next });
  };

  const handleSelectCategory = (cat: PortfolioCategory | 'All') => {
    saveState({ ...state, selectedCategory: cat });
  };

  // Filtered artifacts
  const filteredArtifacts = useMemo(() => {
    if (state.selectedCategory === 'All') return state.portfolio;
    return state.portfolio.filter((a) => a.category === state.selectedCategory);
  }, [state.portfolio, state.selectedCategory]);

  // Recruiter challenge handlers
  const handleSelectClaim = (bulletId: string) => {
    let claimTitle = '';
    let calcProof = '';
    let workLog = '';

    if (bulletId === 'B1') {
      claimTitle = 'Case F Receivables Ageing & 7-Day Liquidity Model (Session 20)';
      calcProof =
        'Mathematical Proof: Total Receivables = =SUM(D2:D5) = ₹95,000 across 4 accounts after ₹5,000 credit note. Cash Deficit: ₹25,000 opening cash - ₹37,000 7-day outflows (after ₹8,000 supplier deferral) = -₹12,000 deficit (shrunk by ₹8,000). Non-Cash Invariance: Bank cash remains strictly invariant at ₹25,000 because credit notes extinguish debt without generating bank cash.';
      workLog =
        'Workbook Evidence: StudentID_S20_v01.xlsx sheet "Model v2.0", cells D2:D5 and cash waterfall rows 18-24. Hash SHA-S20-CCB-MODEL-V2 verified by QA Lead on 31 Oct 2026.';
    } else if (bulletId === 'B2') {
      claimTitle = 'Multi-Source Accounting Reconciliation & BRS (Sessions 06 & 08)';
      calcProof =
        'Mathematical Proof: Adjusted Cash Book = Bank Statement ₹87,200 + Uncredited Deposits ₹6,000 - Unpresented Cheques ₹10,000 = ₹83,200. Zero unexplained difference against adjusted cash ledger.';
      workLog =
        'Workbook Evidence: StudentID_S08_v01.xlsx sheet "BRS_Bridge", cells C15:C22. Hash SHA-S08-BRS-83.2K-VERIFIED.';
    } else {
      claimTitle = 'Enterprise Generative AI Verification & Fail-Closed Guards (Session 14)';
      calcProof =
        'Mathematical Proof: AI Claim 1 asserted operating margin was 25.0%; verified trial balance proves actual margin was 20.0% (₹30,000 / ₹1,50,000). Discrepancy = 5.0%. Guard formula =IF(ISERROR(A1), "FAIL_CLOSED", ...) halts downstream processing.';
      workLog =
        'Document Evidence: StudentID_S14_v01.docx Section 2 "Audit Register" and Table 1. Hash SHA-S14-AIV-FAIL-CLOSED.';
    }

    saveState({
      ...state,
      recruiterChallenge: {
        ...state.recruiterChallenge,
        selectedClaimId: bulletId,
        claimTitle,
        calculationProof: calcProof,
        workLogEvidence: workLog,
        challengeCompleted: true,
      },
    });
  };

  // Bullet updater
  const handleUpdateBullet = (index: number, updatedFields: Partial<ResumeBullet>) => {
    const updatedBullets = [...state.bullets];
    const target = { ...updatedBullets[index], ...updatedFields };

    // Anti-inflation validator
    const fullTextLower = target.fullText.toLowerCase();
    const isInflated =
      fullTextLower.includes('improved profit 40%') ||
      fullTextLower.includes('boosted profit 40%') ||
      fullTextLower.includes('managed corporate accounts') && !target.isSimulatedFlagged;

    if (isInflated) {
      target.status = 'INFLATED';
      target.inflationReason =
        'Unverified live corporate impact claim! The underlying work was an academic simulation without verified live profit improvement.';
    } else {
      target.status = 'AUTHENTIC';
      target.inflationReason = undefined;
    }

    updatedBullets[index] = target;
    saveState({ ...state, bullets: updatedBullets });
  };

  // Professional summary words
  const summaryWords = state.summaryText.trim().split(/\s+/).filter(Boolean);
  const summaryWordCount = summaryWords.length;
  const isSummaryValid = summaryWordCount >= 75 && summaryWordCount <= 100;

  // Student contribution and peer correction word count
  const contributionWordCount = state.studentContribution.trim().split(/\s+/).filter(Boolean).length;
  const correctionWordCount = state.reviewerCorrection.trim().split(/\s+/).filter(Boolean).length;

  const categories: (PortfolioCategory | 'All')[] = [
    'All',
    'Accounting',
    'Reconciliation',
    'MIS',
    'Invoice review',
    'AI verification',
    'Capstone',
  ];

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
      {/* NATURAL HEADING 1: FIND YOUR EVIDENCE                          */}
      {/* ============================================================== */}
      <section id="vcep-area-evidence" className="vcep-workstation-section" style={{ marginBottom: '32px' }}>
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow" style={{ color: '#0F766E', fontWeight: 700, letterSpacing: '0.05em' }}>
            HEADING 1 · EVIDENCE MINING & RECRUITER VERIFICATION DRILL
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#17245C', margin: '4px 0 8px', fontWeight: 800 }}>
            1. Find Your Evidence
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            Turn Real Work into a Credible Resume. Select verified student deliverables from authorized VCEP coursework,
            eliminate ungrounded claims, and defend your actual calculations in a timed recruiter challenge.
          </p>
        </div>

        {/* TASK 01: FIND VERIFIED EVIDENCE */}
        <TaskCard
          taskNumber="01"
          taskId="S21-T01"
          title="Find Verified Evidence"
          outputBadge="Verified Evidence Library & Recruiter Defense"
          persistenceText="State Preserved"
          instruction="Audit verified coursework artifacts and practice defending quantitative model calculations in a 45-second challenge."
          learningTakeaway="Ground resume claims in verifiable project deliverables and mathematical evidence instead of inflated assertions."
          whyMatters="Recruiters and corporate hiring managers routinely reject candidates whose resumes make unsubstantiated claims or misrepresent academic simulations as enterprise profit gains. Grounding your resume in verified, cohort-authorized artifact IDs and mathematical proofs ensures complete defensibility under rigorous technical cross-examination."
          isActive={activeTaskId === 'S21-T01'}
          onSelect={() => setActiveTaskId('S21-T01')}
        >
          {/* Anti-Inflation Scenario Alert Banner */}
        <div
          style={{
            background: '#fffbeb',
            border: '1.5px solid #fcd34d',
            borderRadius: '10px',
            padding: '16px 20px',
            margin: '20px 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <AlertTriangle size={20} color="#b45309" />
            <strong style={{ fontSize: '0.95rem', color: '#92400e' }}>
              The Essential Scenario: Eliminating Fraudulent Resume Claims
            </strong>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#78350f', lineHeight: 1.5 }}>
            <em>
              "A student writes: 'Finance expert who improved company profit 40% and managed corporate accounts.' Their
              actual evidence was a supervised simulation with no measured live profit impact."
            </em>
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
              fontSize: '0.8rem',
              color: '#92400e',
              background: '#ffffff',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #fef3c7',
            }}
          >
            <div>
              <strong style={{ color: '#b91c1c' }}>❌ Why Recruiters Reject This:</strong> False employment claims fail
              corporate background checks immediately. Misrepresenting academic simulation as live P&L improvement destroys
              professional credibility.
            </div>
            <div>
              <strong style={{ color: '#15803d' }}>✓ How We Frame It Honestly:</strong> Name the exact task, scale, method,
              and measured result, and transparently identify the <code>[Simulated Project]</code> context.
            </div>
          </div>
        </div>

        {/* Core Principles Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #17245C',
              borderRadius: '6px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Award size={16} color="#17245C" />
              <strong style={{ fontSize: '0.85rem', color: '#17245C' }}>The Google XYZ Formula</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
              <strong>Accomplished [X]</strong> as measured by <strong>[Y]</strong> by doing <strong>[Z]</strong>. Specify
              the business problem, quantify the scale/outcome, and name the technical tool.
            </p>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #0F766E',
              borderRadius: '6px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <ShieldCheck size={16} color="#0F766E" />
              <strong style={{ fontSize: '0.85rem', color: '#0F766E' }}>Honest Context & Strict Ownership</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
              Never claim live enterprise employment for coursework. You may link only your own verified student deliverables,
              never another student's private work.
            </p>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #E5AF2E',
              borderRadius: '6px',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Lock size={16} color="#B45309" />
              <strong style={{ fontSize: '0.85rem', color: '#B45309' }}>Verifiable Evidence Hashes</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
              Every bullet point corresponds to an auditable artifact ID and cryptographic SHA verification hash in your
              portfolio index.
            </p>
          </div>
        </div>

        {/* Authorized Evidence Picker (Library) */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '18px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                Authorized VCEP Evidence Library (Student Cohort Isolated)
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Showing verified deliverables for <strong>StudentID_2026</strong> · Cohort VCEP-Alpha · Privacy Protected
              </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid #cbd5e1',
                    background: state.selectedCategory === cat ? '#17245C' : '#f8fafc',
                    color: state.selectedCategory === cat ? '#ffffff' : '#475569',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Artifacts Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Artifact ID</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Session</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Category</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Deliverable Title</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Verified Metric</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Verification Hash</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtifacts.map((art) => (
                  <tr key={art.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0F766E' }}>{art.id}</td>
                    <td style={{ padding: '8px 10px', color: '#64748b' }}>{art.session}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span
                        style={{
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                        }}
                      >
                        {art.category}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#17245C' }}>{art.title}</td>
                    <td style={{ padding: '8px 10px', color: '#334155' }}>{art.evidenceMetric}</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontSize: '0.72rem', color: '#15803d' }}>
                      {art.verificationHash}
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedArtifactModal(art)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          color: '#17245C',
                        }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Artifact Details */}
        {selectedArtifactModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '10px',
                padding: '24px',
                maxWidth: '550px',
                width: '100%',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F766E' }}>
                  {selectedArtifactModal.id} · {selectedArtifactModal.session}
                </span>
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {selectedArtifactModal.status}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#17245C', margin: '0 0 10px', fontWeight: 800 }}>
                {selectedArtifactModal.title}
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '12px', lineHeight: 1.5 }}>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>Deliverable File:</strong> <code>{selectedArtifactModal.deliverableFile}</code>
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>Verified Metric:</strong> {selectedArtifactModal.evidenceMetric}
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>My Contribution:</strong> {selectedArtifactModal.studentContribution}
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>Verification Hash:</strong> <code>{selectedArtifactModal.verificationHash}</code>
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Ownership & Visibility:</strong> {selectedArtifactModal.ownership} ·{' '}
                  {selectedArtifactModal.visibility}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setSelectedArtifactModal(null)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: '#17245C',
                    color: '#ffffff',
                    border: 'none',
                  }}
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 45-Second Recruiter Challenge Simulator */}
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #0F766E',
            borderRadius: '10px',
            padding: '18px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="#0F766E" />
                <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                  Squad Activity: 45-Second Recruiter Audit Challenge
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#475569', margin: '3px 0 0' }}>
                <em>"Partner chooses one claim and asks to see the calculation or work log immediately."</em> Prove your
                resume claim under live technical interrogation!
              </p>
            </div>

            {/* Countdown Timer Widget */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  background: timerSeconds <= 10 ? '#fee2e2' : '#f0fdf4',
                  border: `1px solid ${timerSeconds <= 10 ? '#f87171' : '#86efac'}`,
                  borderRadius: '6px',
                  padding: '6px 12px',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: timerSeconds <= 10 ? '#b91c1c' : '#15803d',
                  }}
                >
                  {timerSeconds}s
                </span>
                <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>REMAINING</span>
              </div>
              <button
                type="button"
                onClick={() => setTimerActive(!timerActive)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: timerActive ? '#b91c1c' : '#0F766E',
                  color: '#ffffff',
                  border: 'none',
                }}
              >
                {timerActive ? 'Pause Timer' : 'Start 45s Drill'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerSeconds(45);
                  setTimerActive(false);
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Select Claim to Prove */}
          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Select Resume Claim to Audit:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleSelectClaim('B1')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid #cbd5e1',
                  background: state.recruiterChallenge.selectedClaimId === 'B1' ? '#17245C' : '#f8fafc',
                  color: state.recruiterChallenge.selectedClaimId === 'B1' ? '#ffffff' : '#475569',
                }}
              >
                Claim B1: ₹1,00,000 Receivables & ₹12k Deficit
              </button>
              <button
                type="button"
                onClick={() => handleSelectClaim('B2')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid #cbd5e1',
                  background: state.recruiterChallenge.selectedClaimId === 'B2' ? '#17245C' : '#f8fafc',
                  color: state.recruiterChallenge.selectedClaimId === 'B2' ? '#ffffff' : '#475569',
                }}
              >
                Claim B2: ₹83,200 Bank Reconciliation & GST
              </button>
              <button
                type="button"
                onClick={() => handleSelectClaim('B3')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid #cbd5e1',
                  background: state.recruiterChallenge.selectedClaimId === 'B3' ? '#17245C' : '#f8fafc',
                  color: state.recruiterChallenge.selectedClaimId === 'B3' ? '#ffffff' : '#475569',
                }}
              >
                Claim B3: DPDP AI Audit & 5% Discrepancy
              </button>
            </div>
          </div>

          {/* Audit Proof Display */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '14px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase' }}>
                Mathematical Proof & Formula Defense
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#1e293b', lineHeight: 1.45 }}>
                {state.recruiterChallenge.calculationProof}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#17245C', textTransform: 'uppercase' }}>
                Auditable Workbook / Source Log Reference
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#1e293b', lineHeight: 1.45 }}>
                {state.recruiterChallenge.workLogEvidence}
              </p>
            </div>
          </div>
        </div>
        </TaskCard>
      </section>

      {/* ============================================================== */}
      {/* NATURAL HEADING 2: BUILD YOUR RESUME & PORTFOLIO               */}
      {/* ============================================================== */}
      <section id="vcep-area-portfolio" className="vcep-workstation-section" style={{ marginBottom: '32px' }}>
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow" style={{ color: '#0F766E', fontWeight: 700, letterSpacing: '0.05em' }}>
            HEADING 2 · RESUME BULLETS & PORTFOLIO INDEXING STUDIO
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#17245C', margin: '4px 0 8px', fontWeight: 800 }}>
            2. Build Your Resume & Portfolio
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0, maxWidth: '900px' }}>
            Craft three evidence-backed Google XYZ resume bullets, author a 90-word executive career summary,
            compile a six-item verifiable portfolio index, and certify governance signoffs.
          </p>
        </div>

        {/* TASK 02: WRITE RESUME ACHIEVEMENTS */}
        <TaskCard
          taskNumber="02"
          taskId="S21-T02"
          title="Write Resume Achievements"
          outputBadge="Three Google XYZ Bullets"
          persistenceText="Auto-saved"
          instruction="Draft and refine three evidence-backed resume bullets using the Google XYZ formula while avoiding ungrounded claims."
          learningTakeaway="Structure resume bullet points around measurable achievements and clear methodological contributions."
          whyMatters="The Google XYZ framework (Accomplished [X] measured by [Y] by doing [Z]) demonstrates technical competence with quantitative impact. Transparently tagging simulation projects highlights practical modeling capabilities without falsely claiming unauthorized corporate employment."
          isActive={activeTaskId === 'S21-T02'}
          onSelect={() => setActiveTaskId('S21-T02')}
        >
          {/* Three Google XYZ Resume Bullets Studio */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                Three Evidence-Linked Google XYZ Resume Bullets
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Accomplished [X] as measured by [Y] by doing [Z] · Explicitly identifies <code>[Simulated Project]</code> context
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>
              All 3 Bullets Evidence-Grounded ✓
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {state.bullets.map((b, idx) => (
              <div
                key={b.id}
                style={{
                  border: `1.5px solid ${b.status === 'INFLATED' ? '#f87171' : '#cbd5e1'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  background: b.status === 'INFLATED' ? '#fff1f2' : '#f8fafc',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#17245C', fontSize: '0.9rem' }}>{b.id}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F766E' }}>{b.domain}</span>
                    <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      Evidence: {b.evidenceRef}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={b.isSimulatedFlagged}
                        onChange={(e) => handleUpdateBullet(idx, { isSimulatedFlagged: e.target.checked })}
                        style={{ accentColor: '#0F766E' }}
                      />
                      <span>Tag [Simulated Project]</span>
                    </label>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: b.status === 'INFLATED' ? '#fee2e2' : '#dcfce7',
                        color: b.status === 'INFLATED' ? '#b91c1c' : '#15803d',
                      }}
                    >
                      {b.status === 'INFLATED' ? '⚠️ INFLATED CLAIM' : '✓ VERIFIED AUTHENTIC'}
                    </span>
                  </div>
                </div>

                {b.inflationReason && (
                  <div style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', fontSize: '0.75rem', color: '#991b1b', fontWeight: 600 }}>
                    {b.inflationReason}
                  </div>
                )}

                {/* Editable Full Bullet */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '3px' }}>
                    Full Resume Bullet Text:
                  </label>
                  <textarea
                    rows={2}
                    value={b.fullText}
                    onChange={(e) => handleUpdateBullet(idx, { fullText: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      lineHeight: 1.45,
                      fontFamily: 'inherit',
                      color: '#1e293b',
                    }}
                  />
                </div>

                {/* XYZ Components Breakdown */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '8px',
                    fontSize: '0.75rem',
                    color: '#475569',
                    background: '#ffffff',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <strong style={{ color: '#17245C' }}>X (Accomplished):</strong> {b.xAccomplished}
                  </div>
                  <div>
                    <strong style={{ color: '#0F766E' }}>Y (Measured Outcome):</strong> {b.yMeasured}
                  </div>
                  <div>
                    <strong style={{ color: '#B45309' }}>Z (Technical Method):</strong> {b.zMethod}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </TaskCard>

        {/* TASK 03: CREATE PROFESSIONAL SUMMARY */}
        <TaskCard
          taskNumber="03"
          taskId="S21-T03"
          title="Create Professional Summary"
          outputBadge="90-Word Career Summary & Skills View"
          persistenceText="Auto-saved"
          instruction="Author a 90-word executive professional summary aligned with verified commercial capabilities."
          learningTakeaway="Summarize technical proficiencies succinctly to communicate commercial value to prospective employers."
          whyMatters="A concise, disciplined executive summary immediately establishes professional positioning for entry-level roles. Keeping within 75–100 words forces clarity, highlights verified technical skills, and matches target role requirements without filler."
          isActive={activeTaskId === 'S21-T03'}
          onSelect={() => setActiveTaskId('S21-T03')}
        >
          {/* 90-Word Professional Summary & Role-Focused Skills */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                90-Word Professional Summary & Role-Focused Skills View
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Concise executive profile for resume header / LinkedIn About · Target: 75–100 words (~90 words)
              </p>
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 700,
                background: isSummaryValid ? '#dcfce7' : '#fee2e2',
                color: isSummaryValid ? '#15803d' : '#b91c1c',
              }}
            >
              {summaryWordCount} words (Target: 75–100 words) {isSummaryValid ? '✓' : '⚠️'}
            </span>
          </div>

          <textarea
            rows={4}
            value={state.summaryText}
            onChange={(e) => saveState({ ...state, summaryText: e.target.value })}
            placeholder="Draft your 90-word professional executive summary..."
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: `1px solid ${isSummaryValid ? '#cbd5e1' : '#f87171'}`,
              fontSize: '0.82rem',
              lineHeight: 1.45,
              fontFamily: 'inherit',
              color: '#1e293b',
              marginBottom: '16px',
            }}
          />

          {/* Role-Focused Skills Taxonomy View */}
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Verified Role-Focused Technical Skills Taxonomy:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <strong style={{ fontSize: '0.78rem', color: '#17245C', display: 'block', marginBottom: '4px' }}>
                Financial Modeling & Working Capital
              </strong>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', lineHeight: 1.35 }}>
                4-Account Ageing Models, 7-Day Cash Flow Waterfalls, ISO Date Logic, Scenario Deficit Forecasting.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <strong style={{ fontSize: '0.78rem', color: '#0F766E', display: 'block', marginBottom: '4px' }}>
                Statutory Accounting & Reconciliation
              </strong>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', lineHeight: 1.35 }}>
                Double-Entry Adjusting Journals, Corrected Trial Balances, 3-Column BRS Bridges, GST ITC Matching.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <strong style={{ fontSize: '0.78rem', color: '#B45309', display: 'block', marginBottom: '4px' }}>
                Responsible AI & Quality Assurance
              </strong>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', lineHeight: 1.35 }}>
                DPDP Data Minimization, 6-Part Structured Prompts, Automated Fail-Closed Formula Guards, Acceptance Testing.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <strong style={{ fontSize: '0.78rem', color: '#15803d', display: 'block', marginBottom: '4px' }}>
                Commercial Operations & Governance
              </strong>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', lineHeight: 1.35 }}>
                CRM Opportunity Funnels, Tiered Break-Even Pricing, Change Control Board (CCB) Logs, Executive Updates.
              </p>
            </div>
          </div>
        </div>
        </TaskCard>

        {/* TASK 04: BUILD THE PORTFOLIO INDEX */}
        <TaskCard
          taskNumber="04"
          taskId="S21-T04"
          title="Build the Portfolio Index"
          outputBadge="Six-Item Portfolio Index & Governance"
          persistenceText="State Preserved"
          instruction="Compile a six-item verifiable portfolio index with artifact hashes, skill gaps, and deliverable governance sign-offs."
          learningTakeaway="Curate an auditable portfolio index to demonstrate sustained work quality across commerce domains."
          whyMatters="A verifiable portfolio index provides cryptographic traceability for every deliverable, proving individual ownership. Documenting target skill gaps, peer corrections, and governance sign-offs completes the professional portfolio required for employment readiness."
          isActive={activeTaskId === 'S21-T04'}
          onSelect={() => setActiveTaskId('S21-T04')}
        >
          {/* Six-Item Linked Portfolio Index */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                Six-Item Verifiable Professional Portfolio Index
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Links six authentic VCEP deliverables across Accounting, Reconciliation, MIS, Invoice review, AI verification, and Capstone.
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 700 }}>
              6 of 6 Verified Genuine ✓
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Category</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Artifact ID</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Deliverable File</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Verified Metric</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Verification Hash</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.portfolio.map((art) => (
                  <tr key={art.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0F766E' }}>{art.category}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#17245C' }}>{art.id}</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#334155' }}>{art.deliverableFile}</td>
                    <td style={{ padding: '8px 10px', color: '#475569' }}>{art.evidenceMetric}</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontSize: '0.72rem', color: '#15803d' }}>
                      {art.verificationHash}
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ background: '#f0fdf4', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                        {art.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Development Priority & Next Practice Plan (Curriculum Docx Par 93) */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '18px',
            marginBottom: '24px',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
              Portfolio Development Priority & Next Practice Plan
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
              Identify one technical skill gap for your target entry-level role and establish a concrete practice commitment.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '14px',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Target Role for This Evidence:
              </label>
              <input
                type="text"
                value={state.recruiterChallenge.targetRole}
                onChange={(e) =>
                  saveState({
                    ...state,
                    recruiterChallenge: { ...state.recruiterChallenge, targetRole: e.target.value },
                  })
                }
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                One Skill Gap Identified:
              </label>
              <input
                type="text"
                value={state.recruiterChallenge.skillGapIdentified}
                onChange={(e) =>
                  saveState({
                    ...state,
                    recruiterChallenge: { ...state.recruiterChallenge, skillGapIdentified: e.target.value },
                  })
                }
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Specific Next Practice Task:
              </label>
              <input
                type="text"
                value={state.recruiterChallenge.nextPracticeTask}
                onChange={(e) =>
                  saveState({
                    ...state,
                    recruiterChallenge: { ...state.recruiterChallenge, nextPracticeTask: e.target.value },
                  })
                }
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>
          </div>
        </div>

        {/* Individual Contribution & Peer Review Defect Correction */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                My Specific Deliverable Contribution
              </h3>
              <span style={{ fontSize: '0.72rem', color: contributionWordCount >= 40 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                {contributionWordCount} words (min 40)
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 8px' }}>
              Document your personal work packages in compiling the portfolio index, evidence verification, and XYZ bullets.
            </p>
            <textarea
              rows={4}
              value={state.studentContribution}
              onChange={(e) => saveState({ ...state, studentContribution: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                lineHeight: 1.45,
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#17245C', margin: 0, fontWeight: 700 }}>
                Peer Reviewer Defect Challenge & Correction
              </h3>
              <span style={{ fontSize: '0.72rem', color: correctionWordCount >= 40 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                {correctionWordCount} words (min 40)
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 8px' }}>
              Detail the exact defect caught during peer review (e.g. 40% profit inflation) and the before/after correction.
            </p>
            <textarea
              rows={4}
              value={state.reviewerCorrection}
              onChange={(e) => saveState({ ...state, reviewerCorrection: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                lineHeight: 1.45,
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Change Control Governance & Pre-Submission Checklist */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#17245C', margin: '0 0 14px', fontWeight: 700 }}>
            Portfolio Governance, Verification Sign-off & Deliverable Certification
          </h3>

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
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Reviewer (Peer Recruiter / Faculty QA):
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
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Decision Owner (Hiring Manager / Placement Lead):
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
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Portfolio Audit Status:
              </label>
              <select
                value={state.governance.auditStatus}
                onChange={(e) =>
                  saveState({
                    ...state,
                    governance: { ...state.governance, auditStatus: e.target.value },
                  })
                }
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#fff' }}
              >
                <option value="Verified PASS (Ready for Corporate Portfolio Handover)">
                  Verified PASS (Ready for Corporate Portfolio Handover)
                </option>
                <option value="Conditional Approval">Conditional Approval</option>
                <option value="Under Review">Under Review</option>
                <option value="Draft Attempt">Draft Attempt</option>
              </select>
            </div>
          </div>

          {/* Pre-Submission Checklist */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
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
                  Automatic Portfolio Review: Verified Credible Resume
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#166534' }}>
                  All 3 XYZ bullets evidence-grounded, 6-item portfolio verified, and recruiter defense passed!
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>Estimated Rubric Score:</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>10 / 10 pts</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {S21_RUBRIC.map((r) => (
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
          {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Portfolio Ready ✓' : 'Save & Continue →'}
        </button>
      </footer>
    </div>
  );
}

