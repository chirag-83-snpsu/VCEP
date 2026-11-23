'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  STARTUP_STORIES,
  COLLEGE_PROBLEM_OPTIONS,
  OPPORTUNITY_QUESTIONS,
  VENTURE_CASES,
  BOARDROOM_ROLES,
  CRISIS_SCENARIO,
  CUSTOMER_INTERVIEW_QUESTIONS,
  PRICING_TRADE_OFF_OPTIONS,
  VAYENTRA_LABS_FINANCIAL_CASE,
  ORDER_TO_CASH_STEPS,
  TRAINER_GUIDELINES,
  STARTUP_STORAGE_KEY,
  loadStartupLabState,
  buildDefaultPitchDeck,
  type StartupLabState,
  type VentureCase,
  type PitchSlide,
  type CollegeProblemOption,
  type OrderToCashStep,
} from './session-01-startup-data.ts';
import { ControlledAssessmentShield } from '../workstations/components/controlled-assessment-shield.tsx';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sliders,
  DollarSign,
  Users,
  Target,
  FileText,
  Lightbulb,
  Check,
  TrendingUp,
  AlertTriangle,
  Send,
  RefreshCw,
  ExternalLink,
  Info,
  Layers,
  Briefcase,
  Workflow,
  CheckSquare,
} from 'lucide-react';

interface Session01StartupJourneyProps {
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
            <span>{whyOpen ? 'Hide founder principle' : 'Why this matters'}</span>
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
              <strong>Founder Commercial Principle:</strong> {whyMatters}
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

export function Session01StartupJourney({
  onUpdateDraft,
}: Session01StartupJourneyProps) {
  const [labState, setLabState] = useState<StartupLabState>(loadStartupLabState);
  const [shieldConfirmed, setShieldConfirmed] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved in this browser');
  const [showTrainerGuidance, setShowTrainerGuidance] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState('S01-T01');
  const [expandedWhyMatters, setExpandedWhyMatters] = useState<Record<string, boolean>>({});
  const [isCustomIdea, setIsCustomIdea] = useState(false);
  const [customIdeaText, setCustomIdeaText] = useState('');

  // Hydrate from localStorage and check Baseline A shield
  useEffect(() => {
    const loaded = loadStartupLabState();
    setLabState(loaded);
    if (loaded.pitchDeck?.activeSlideIndex !== undefined) {
      setActiveSlideIndex(loaded.pitchDeck.activeSlideIndex);
    }
    try {
      const draft = JSON.parse(sessionStorage.getItem('vcep-drive-edition3:session:1:preview') || '{}');
      if (draft['check:0'] === 'yes') {
        setShieldConfirmed(true);
      }
    } catch {}
  }, []);

  // Save state to localStorage and sync backward-compatible draft keys
  const saveLabState = (next: StartupLabState) => {
    setLabState(next);
    setSaveStatus('Saving…');

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STARTUP_STORAGE_KEY, JSON.stringify(next));
      }
    } catch {}

    syncDraftKeys(next);

    setTimeout(() => {
      setSaveStatus('Saved in this browser');
    }, 300);
  };

  // Sync draft keys for review engine & platform grading compatibility
  const syncDraftKeys = (state: StartupLabState) => {
    try {
      const raw = sessionStorage.getItem('vcep-drive-edition3:session:1:preview');
      const draft = raw ? JSON.parse(raw) : {};

      // Stage 1 Concept & Opportunity
      if (state.stage1) {
        draft['concept:explain'] = `Opportunity: ${state.stage1.opportunityStatement}. Target: ${state.stage1.targetCampusPersona}. Why: ${state.stage1.whyItMatters}`;
        onUpdateDraft?.('concept:explain', draft['concept:explain']);
      }

      // Stage 4 Canvas & Analysis
      const activeCase = VENTURE_CASES.find((c) => c.id === state.selectedCaseId) || VENTURE_CASES[0];
      const prob = state.stage1?.opportunityStatement || activeCase.summary;
      const persona = state.stage1?.targetCampusPersona || activeCase.persona;
      const pricing = state.pricingTradeOff?.choice || 'Scope Pruning';
      draft['work:analysis'] = `Venture: ${activeCase.name}. Problem: ${prob}. Customer: ${persona}. Pricing Trade-off: ${pricing}.`;
      onUpdateDraft?.('work:analysis', draft['work:analysis']);

      // Stage 5 Approved Vayentra Labs Financial figures sync
      if (state.vlab) {
        draft['work:1:0:0:2'] = String(state.vlab.calcProfit || '');
        draft['work:1:0:1:2'] = String(state.vlab.calcNetCash || '');
        draft['work:1:0:2:2'] = String(state.vlab.calcClosingBank || '');
        draft['work:1:0:3:2'] = String(state.vlab.calcAvailableAboveReserve || '');
        draft['work:1:0:4:2'] = String(state.vlab.calcPaymentShortfall || '');

        onUpdateDraft?.('work:1:0:0:2', draft['work:1:0:0:2']);
        onUpdateDraft?.('work:1:0:1:2', draft['work:1:0:1:2']);
        onUpdateDraft?.('work:1:0:2:2', draft['work:1:0:2:2']);
        onUpdateDraft?.('work:1:0:3:2', draft['work:1:0:3:2']);
        onUpdateDraft?.('work:1:0:4:2', draft['work:1:0:4:2']);

        // Process handoffs
        draft['team:contribution'] = `Order-to-Cash Process: ${state.vlab.processOrder.join(' -> ')}. Delivery Owner: ${state.vlab.processOwners?.delivery || 'Delivery Manager'}.`;
        onUpdateDraft?.('team:contribution', draft['team:contribution']);

        // Management payment recommendation
        draft['team:judgement'] = `Payment Decision: ${state.vlab.paymentRecommendation}. Rationale: ${state.vlab.paymentRationale}`;
        onUpdateDraft?.('team:judgement', draft['team:judgement']);
      }

      // Stage 6 Reflection
      if (state.reflectionChange) {
        draft['review:reflection'] = state.reflectionChange;
        onUpdateDraft?.('review:reflection', state.reflectionChange);
      }

      sessionStorage.setItem('vcep-drive-edition3:session:1:preview', JSON.stringify(draft));
    } catch {}
  };

  const handleConfirmShield = () => {
    setShieldConfirmed(true);
    try {
      const raw = sessionStorage.getItem('vcep-drive-edition3:session:1:preview');
      const draft = raw ? JSON.parse(raw) : {};
      draft['check:0'] = 'yes';
      sessionStorage.setItem('vcep-drive-edition3:session:1:preview', JSON.stringify(draft));
      onUpdateDraft?.('check:0', 'yes');
    } catch {}
  };

  // Active venture case helper
  const activeCase = useMemo(() => {
    return VENTURE_CASES.find((c) => c.id === (labState.selectedCaseId || 'quickbite')) || VENTURE_CASES[0];
  }, [labState.selectedCaseId]);

  // Handle problem selection from 4 relatable options or custom
  const handleSelectProblemOption = (opt: CollegeProblemOption) => {
    setIsCustomIdea(false);
    let mappedCaseId = 'quickbite';
    if (opt.id === 'prob-laundry') mappedCaseId = 'cleanwash';
    else if (opt.id === 'prob-food') mappedCaseId = 'quickbite';
    else if (opt.id === 'prob-inventory') mappedCaseId = 'digitlocal';
    else if (opt.id === 'prob-support') mappedCaseId = 'digitlocal';

    const caseObj = VENTURE_CASES.find((c) => c.id === mappedCaseId) || VENTURE_CASES[0];

    const nextState: StartupLabState = {
      ...labState,
      selectedCaseId: mappedCaseId,
      stage1: {
        ...labState.stage1,
        selectedProblemId: opt.id,
        opportunityStatement: opt.opportunityHint,
        targetCampusPersona: caseObj.persona,
        whyItMatters: opt.friction,
      },
      opportunityBrief: {
        ...labState.opportunityBrief,
        customerProblem: opt.description,
        targetPersona: caseObj.persona,
        existingAlternatives: opt.friction,
        whyItMatters: opt.friction,
      },
      // Keep pitch deck slides in sync
      pitchDeck: {
        ...labState.pitchDeck,
        slides: buildDefaultPitchDeck(caseObj, labState.decisions, {
          selectedProblemId: opt.id,
          targetCampusPersona: caseObj.persona,
          opportunityStatement: opt.opportunityHint,
          whyItMatters: opt.friction,
        }, labState.boardroom),
      },
    };
    saveLabState(nextState);
  };

  // Handle custom venture input
  const handleCustomVentureSubmit = () => {
    if (!customIdeaText.trim()) return;
    setIsCustomIdea(true);
    const customCaseObj = VENTURE_CASES[0]; // Quickbite baseline
    const nextState: StartupLabState = {
      ...labState,
      stage1: {
        ...labState.stage1,
        selectedProblemId: 'custom-idea',
        opportunityStatement: customIdeaText.trim(),
        targetCampusPersona: 'Campus Students & Faculty',
        whyItMatters: 'Direct custom market friction identified by student founder.',
      },
      opportunityBrief: {
        ...labState.opportunityBrief,
        customerProblem: customIdeaText.trim(),
        targetPersona: 'Campus Students & Faculty',
        existingAlternatives: 'Manual workarounds and delays.',
        whyItMatters: 'Direct custom market friction identified by student founder.',
      },
      pitchDeck: {
        ...labState.pitchDeck,
        slides: buildDefaultPitchDeck(customCaseObj, labState.decisions, {
          selectedProblemId: 'custom-idea',
          targetCampusPersona: 'Campus Students & Faculty',
          opportunityStatement: customIdeaText.trim(),
          whyItMatters: 'Direct custom market friction identified by student founder.',
        }, labState.boardroom),
      },
    };
    saveLabState(nextState);
  };

  // Handle question updates
  const handleUpdateQuestion = (field: 'targetCampusPersona' | 'opportunityStatement' | 'whyItMatters' | 'validationApproach', val: string) => {
    const updatedStage1 = {
      ...labState.stage1,
      [field]: val,
    };
    const nextState: StartupLabState = {
      ...labState,
      stage1: updatedStage1,
      pitchDeck: {
        ...labState.pitchDeck,
        slides: buildDefaultPitchDeck(activeCase, labState.decisions, updatedStage1, labState.boardroom),
      },
    };
    saveLabState(nextState);
  };

  // Toggle "Why this matters" accordion
  const toggleWhyMatters = (qId: string) => {
    setExpandedWhyMatters((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Handle story decision
  const handleSelectStoryDecision = (storyId: string, optId: string) => {
    const nextState: StartupLabState = {
      ...labState,
      storyDecisions: {
        ...labState.storyDecisions,
        [storyId]: optId,
      },
    };
    saveLabState(nextState);
  };

  // Handle pricing trade-off
  const handleSelectPricingTradeOff = (choiceId: string, rationale: string) => {
    const nextState: StartupLabState = {
      ...labState,
      pricingTradeOff: {
        choice: choiceId,
        rationale,
      },
    };
    saveLabState(nextState);
  };

  // Handle Vayentra Labs calculation update
  const handleVlabCalcChange = (field: string, val: string) => {
    const cur = labState.vlab || {
      prediction: '',
      calcProfit: '',
      calcNetCash: '',
      calcClosingBank: '',
      calcAvailableAboveReserve: '',
      calcPaymentShortfall: '',
      calcAttempted: true,
      processOrder: ['enquiry', 'order', 'delivery', 'invoice', 'collection', 'receipt'],
      processOwners: {
        enquiry: 'Sales Lead',
        order: 'Sales Lead',
        delivery: 'Delivery Manager',
        invoice: 'Finance Officer',
        collection: 'Finance Officer',
        receipt: 'Finance Officer',
      },
      paymentRecommendation: 'reschedule',
      paymentRationale: 'Pay ₹5,000 from available cash above safety reserve; defer remaining ₹10,000 until client receivables are collected.',
    };
    const nextVlab = {
      ...cur,
      [field]: val,
      calcAttempted: true,
    };
    const nextState: StartupLabState = {
      ...labState,
      vlab: nextVlab,
    };
    saveLabState(nextState);
  };

  // Handle process owner change in Order-to-Cash
  const handleProcessOwnerChange = (stepId: string, newOwner: string) => {
    const cur = labState.vlab || {
      prediction: '',
      calcProfit: '',
      calcNetCash: '',
      calcClosingBank: '',
      calcAvailableAboveReserve: '',
      calcPaymentShortfall: '',
      calcAttempted: true,
      processOrder: ['enquiry', 'order', 'delivery', 'invoice', 'collection', 'receipt'],
      processOwners: {
        enquiry: 'Sales Lead',
        order: 'Sales Lead',
        delivery: 'Delivery Manager',
        invoice: 'Finance Officer',
        collection: 'Finance Officer',
        receipt: 'Finance Officer',
      },
      paymentRecommendation: 'reschedule',
      paymentRationale: 'Pay ₹5,000 from available cash above safety reserve; defer remaining ₹10,000 until client receivables are collected.',
    };
    const nextOwners = {
      ...(cur.processOwners || {}),
      [stepId]: newOwner,
    };
    const nextState: StartupLabState = {
      ...labState,
      vlab: {
        ...cur,
        processOwners: nextOwners,
      },
    };
    saveLabState(nextState);
  };

  // Handle slide field change
  const handleUpdateSlideField = (slideIndex: number, fieldKey: string, newVal: string) => {
    const curSlides = [...(labState.pitchDeck?.slides || [])];
    if (!curSlides[slideIndex]) return;

    const targetSlide = { ...curSlides[slideIndex] };
    targetSlide.fields = targetSlide.fields.map((f) =>
      f.key === fieldKey ? { ...f, value: newVal } : f
    );
    curSlides[slideIndex] = targetSlide;

    const nextState: StartupLabState = {
      ...labState,
      pitchDeck: {
        ...labState.pitchDeck,
        slides: curSlides,
      },
    };
    saveLabState(nextState);
  };

  // Navigation helpers to scroll smoothly to areas
  const scrollToArea = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const slides = labState.pitchDeck?.slides || [];
  const currentSlide = slides[activeSlideIndex] || slides[0];

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
      {/* ========================================================================= */}
      {/* 1. CONTROLLED ASSESSMENT BARRIER: BASELINE DIAGNOSTIC A (60 MIN)          */}
      {/* ========================================================================= */}
      {!shieldConfirmed ? (
        <div style={{ marginBottom: '24px' }}>
          <ControlledAssessmentShield
            assessmentName="Baseline Diagnostic A (Trainer-Controlled)"
            sessionMinutes={60}
            instructions="Complete your 60-minute diagnostic baseline independently on paper/faculty sheet before starting the founder workshop. Baseline results diagnose authentic prior competence."
            isConfirmed={shieldConfirmed}
            onConfirmChange={(c) => {
              if (c) handleConfirmShield();
            }}
          />
        </div>
      ) : (
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
            <span>Baseline Diagnostic A Completed Independently · Founder Workstation Active</span>
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
      )}

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
                Trainer Classroom Facilitator Guide (135-Minute Cadence)
              </strong>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f766e', background: '#ccfbf1', padding: '3px 8px', borderRadius: '4px' }}>
              Faculty Pacing
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', fontSize: '12.5px', color: '#334155' }}>
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>00–05m: Mission Orientation</div>
              <div>Frame the core objective: Identify a customer friction point and develop an investable proposition.</div>
            </div>
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>05–65m: Baseline Diagnostic A</div>
              <div>Strict independent invigilated assessment without AI or peer assistance (10-point rubric).</div>
            </div>
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>65–75m: Health & Mental Break</div>
              <div>10-minute reset before commencing hands-on entrepreneurial simulation.</div>
            </div>
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f766e', marginBottom: '4px' }}>75–135m: Opportunity & Pitch Challenge</div>
              <div>Students work through Tasks 01–04 in Area A and compile Task 05 (8-Slide Investor Pitch) in Area B.</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AREA A: UNDERSTAND THE BUSINESS OPPORTUNITY (#vcep-area-opportunity)       */}
      {/* ========================================================================= */}
      <section
        id="vcep-area-opportunity"
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: 'clamp(20px, 3.5vw, 36px)',
          marginBottom: '36px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Area A Header */}
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0f766e' }}>
              AREA A · FOUNDER WORKLAB
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 800, color: '#17245c', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Understand the Business Opportunity
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
            Find a real problem. Build a business idea. Pitch your solution.
          </p>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 01: IDENTIFY THE OPPORTUNITY (S01-T01)                               */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S01-T01"
          taskNumber="TASK 01"
          title="Identify the Opportunity"
          instruction="Select a relatable campus scenario or propose an original one to target an acute daily customer friction."
          whyMatters="Great ventures start from genuine customer friction rather than abstract technical ideas. Choosing a clear persona focuses your value proposition and saves development capital."
          statusText={labState.stage1?.selectedProblemId ? 'Problem Selected' : 'Not started'}
          isActive={activeTaskId === 'S01-T01'}
          onSelectTask={() => setActiveTaskId('S01-T01')}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '14px',
              marginBottom: '16px',
            }}
          >
            {COLLEGE_PROBLEM_OPTIONS.map((opt) => {
              const isSelected = !isCustomIdea && labState.stage1?.selectedProblemId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectProblemOption(opt)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectProblemOption(opt);
                    }
                  }}
                  style={{
                    padding: '16px 18px',
                    borderRadius: '12px',
                    background: isSelected ? '#f0fdfa' : '#ffffff',
                    border: isSelected ? '2px solid #0f766e' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(15, 118, 110, 0.08)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    outline: 'none',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: isSelected ? '#0f766e' : '#64748b',
                        }}
                      >
                        {opt.category}
                      </span>
                      {isSelected && (
                        <span style={{ color: '#0f766e' }}>
                          <CheckCircle2 size={16} />
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#17245c', marginBottom: '6px' }}>
                      {opt.title}
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                      {opt.description}
                    </p>
                  </div>
                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0', fontSize: '11.5px', color: '#0f766e', fontWeight: 600 }}>
                    Hint: {opt.opportunityHint}
                  </div>
                </div>
              );
            })}

            {/* Custom Business Idea Option */}
            <div
              onClick={() => setIsCustomIdea(true)}
              tabIndex={0}
              role="button"
              aria-pressed={isCustomIdea}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsCustomIdea(true);
                }
              }}
              style={{
                padding: '16px 18px',
                borderRadius: '12px',
                background: isCustomIdea ? '#f0fdfa' : '#ffffff',
                border: isCustomIdea ? '2px solid #0f766e' : '1px dashed #cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                outline: 'none',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: isCustomIdea ? '#0f766e' : '#64748b' }}>
                    Custom Venture
                  </span>
                  {isCustomIdea && (
                    <span style={{ color: '#0f766e' }}>
                      <CheckCircle2 size={16} />
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#17245c', marginBottom: '6px' }}>
                  Enter Your Own Business Idea
                </div>
                <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                  Have a specific campus or local market problem in mind? Craft your own custom venture.
                </p>
              </div>

              {isCustomIdea ? (
                <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={customIdeaText}
                    onChange={(e) => setCustomIdeaText(e.target.value)}
                    placeholder="Describe problem & solution..."
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomVentureSubmit();
                    }}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: '#0f766e',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0', fontSize: '11.5px', color: '#0f766e', fontWeight: 600 }}>
                  Click to type custom problem & solution
                </div>
              )}
            </div>
          </div>

          <div style={{ fontSize: '11.5px', color: '#64748b', fontStyle: 'italic' }}>
            Note: The opportunity scenarios above are educational illustrations designed to practice commercial thinking, not formal market research.
          </div>
        </TaskCard>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 02: TEST THE IDEA (S01-T02)                                          */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S01-T02"
          taskNumber="TASK 02"
          title="Test the Idea"
          instruction="Structure your proposition by defining the customer persona, core problem, unique value, and early validation method."
          whyMatters="Validating early assumptions with direct customer conversations prevents building services that nobody is willing to pay for."
          statusText={labState.stage1?.opportunityStatement ? '4 Questions Synced' : 'In progress'}
          isActive={activeTaskId === 'S01-T02'}
          onSelectTask={() => setActiveTaskId('S01-T02')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {OPPORTUNITY_QUESTIONS.map((cfg) => {
              let curValue = '';
              let updateKey: 'targetCampusPersona' | 'opportunityStatement' | 'whyItMatters' | 'validationApproach' = 'targetCampusPersona';

              if (cfg.id === 'q1-who') {
                curValue = labState.stage1?.targetCampusPersona || '';
                updateKey = 'targetCampusPersona';
              } else if (cfg.id === 'q2-what') {
                curValue = labState.stage1?.opportunityStatement || '';
                updateKey = 'opportunityStatement';
              } else if (cfg.id === 'q3-why') {
                curValue = labState.stage1?.whyItMatters || '';
                updateKey = 'whyItMatters';
              } else if (cfg.id === 'q4-how') {
                curValue = labState.stage1?.validationApproach || (labState.decisions?.decisionD ? 'Grassroots direct customer demonstration' : '');
                updateKey = 'validationApproach';
              }

              const isWhyOpen = Boolean(expandedWhyMatters[cfg.id]);

              return (
                <div
                  key={cfg.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px 20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase' }}>
                        Question {cfg.number}
                      </span>
                      <h4 style={{ fontSize: '15.5px', fontWeight: 700, color: '#17245c', margin: '2px 0 4px' }}>
                        {cfg.question}
                      </h4>
                      <div style={{ fontSize: '12.5px', color: '#64748b' }}>{cfg.prompt}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWhyMatters(cfg.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#0f766e',
                        background: '#f0fdfa',
                        border: '1px solid #ccfbf1',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        cursor: 'pointer',
                      }}
                    >
                      <span>Why this matters</span>
                      {isWhyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>

                  {/* Optional Collapsed Explanation */}
                  {isWhyOpen && (
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid #99f6e4',
                        borderRadius: '8px',
                        padding: '12px 14px',
                        fontSize: '12.5px',
                        color: '#0f766e',
                        lineHeight: '1.5',
                        marginBottom: '12px',
                      }}
                    >
                      <strong>Founder Commercial Principle:</strong> {cfg.whyMatters}
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '12px 0 10px' }}>
                    <span style={{ fontSize: '11.5px', color: '#64748b', alignSelf: 'center', fontWeight: 600 }}>Suggestions:</span>
                    {cfg.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleUpdateQuestion(updateKey, chip)}
                        style={{
                          fontSize: '11.5px',
                          padding: '4px 10px',
                          borderRadius: '16px',
                          background: curValue === chip ? '#ccfbf1' : '#ffffff',
                          border: curValue === chip ? '1px solid #0f766e' : '1px solid #cbd5e1',
                          color: curValue === chip ? '#0f766e' : '#475569',
                          cursor: 'pointer',
                          fontWeight: curValue === chip ? 600 : 500,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>

                  {/* Text Input Area */}
                  <textarea
                    rows={2}
                    value={curValue}
                    onChange={(e) => handleUpdateQuestion(updateKey, e.target.value)}
                    placeholder={cfg.example}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '13.5px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#1e293b',
                      lineHeight: '1.5',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />

                  {/* Live Feedback Indicator */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11.5px' }}>
                    <span style={{ color: curValue.trim().length >= 10 ? '#166534' : '#64748b', fontWeight: 500 }}>
                      {curValue.trim().length >= 10 ? '✓ Response recorded & synced' : 'Enter at least a few words'}
                    </span>
                    <span style={{ color: '#94a3b8' }}>{curValue.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>
              );
            })}
          </div>
        </TaskCard>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 03: SHAPE THE BUSINESS (S01-T03)                                     */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S01-T03"
          taskNumber="TASK 03"
          title="Shape the Business"
          instruction="Analyze proven founder models, establish your startup's unit economics, and resolve early customer pricing trade-offs."
          whyMatters="Startups do not fail from a lack of ideas; they fail when unit contribution margin is negative or when unsustainable discounts exhaust operational capacity."
          statusText="Economics Configured"
          isActive={activeTaskId === 'S01-T03'}
          onSelectTask={() => setActiveTaskId('S01-T03')}
        >
          {/* Part A: Real-World Startup Inspiration Decisions */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#17245c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              1. Real Indian Startup Model Lessons
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {STARTUP_STORIES.map((story) => {
                const userChoice = labState.storyDecisions?.[story.id] || '';
                return (
                  <div
                    key={story.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#17245c' }}>
                          {story.company}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>
                          {story.location} · {story.foundingYear}
                        </span>
                      </div>

                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>Customer Friction:</div>
                        <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0 0', lineHeight: '1.4' }}>{story.problem}</p>
                      </div>

                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase' }}>Founder Solution:</div>
                        <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0 0', lineHeight: '1.4' }}>{story.model}</p>
                      </div>

                      <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '6px', borderLeft: '3px solid #0f766e', marginBottom: '12px' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase' }}>Practical Founder Lesson:</div>
                        <div style={{ fontSize: '11.5px', color: '#1e293b', marginTop: '2px', lineHeight: '1.35' }}>
                          {story.id === 'zerodha' && 'Radical pricing transparency and user trust create a durable word-of-mouth moat with zero advertising spend.'}
                          {story.id === 'nykaa' && 'Verified authenticity and curated customer experience beat race-to-the-bottom discounting.'}
                          {story.id === 'meesho' && 'Removing friction and logistics costs for unorganized sellers unlocks mass grassroots network effects.'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#17245c', marginBottom: '6px' }}>
                        Decision: {story.decisionPrompt}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {story.options.map((opt) => {
                          const isChosen = userChoice === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleSelectStoryDecision(story.id, opt.id)}
                              style={{
                                textAlign: 'left',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                background: isChosen ? (opt.isOptimal ? '#f0fdf4' : '#fef2f2') : '#ffffff',
                                border: isChosen ? (opt.isOptimal ? '1px solid #16a34a' : '1px solid #dc2626') : '1px solid #e2e8f0',
                                color: '#1e293b',
                                cursor: 'pointer',
                                lineHeight: '1.35',
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>{opt.text}</span>
                              {isChosen && (
                                <div style={{ marginTop: '4px', fontSize: '11px', color: opt.isOptimal ? '#166534' : '#991b1b' }}>
                                  {opt.feedback}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Part B: Your Startup Unit Economics */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '18px 20px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontWeight: 700, color: '#17245c', fontSize: '14.5px', marginBottom: '12px' }}>
              2. Your Startup Unit Economics & Commercial Model
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Revenue Model
                </label>
                <select
                  value={labState.pricingTradeOff?.choice || 'pt-scope'}
                  onChange={(e) => handleSelectPricingTradeOff(e.target.value, 'Commercial trade-off chosen')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '13px',
                    color: '#1e293b',
                  }}
                >
                  <option value="pt-scope">Subscription Pass (Weekly / Monthly)</option>
                  <option value="pt-discount">Pay-per-Order / Pay-as-you-go</option>
                  <option value="pt-value">Flat Monthly Convenience Fee</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Illustrative Selling Price / Unit
                </label>
                <input
                  type="text"
                  defaultValue="₹90 per meal / delivery"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '13px',
                    color: '#1e293b',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Estimated Direct Cost / Unit
                </label>
                <input
                  type="text"
                  defaultValue="₹55 (ingredients, runner, container)"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '13px',
                    color: '#1e293b',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Unit Contribution Margin
                </label>
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#166534',
                  }}
                >
                  ₹35 / unit (+38.8% margin)
                </div>
              </div>
            </div>

            {/* Part C: Early-Customer Pricing Trade-Off Strategy */}
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#17245c', marginBottom: '8px' }}>
                Early-Customer Pricing Trade-Off: How do you handle early price resistance?
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {PRICING_TRADE_OFF_OPTIONS.map((pto) => {
                  const isChosen = (labState.pricingTradeOff?.choice || 'pt-scope') === pto.id;
                  return (
                    <div
                      key={pto.id}
                      onClick={() => handleSelectPricingTradeOff(pto.id, pto.consequence)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        background: isChosen ? '#ffffff' : '#f1f5f9',
                        border: isChosen ? '2px solid #0f766e' : '1px solid #cbd5e1',
                        cursor: 'pointer',
                        boxShadow: isChosen ? '0 2px 8px rgba(15, 118, 110, 0.08)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: pto.isOptimal ? '#0f766e' : '#b91c1c', textTransform: 'uppercase' }}>
                          {pto.badge}
                        </span>
                        {isChosen && <Check size={14} color="#0f766e" strokeWidth={3} />}
                      </div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                        {pto.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: '1.4' }}>
                        {pto.consequence}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TaskCard>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 04: CHECK BUSINESS REALITY (S01-T04)                                  */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S01-T04"
          taskNumber="TASK 04"
          title="Check Business Reality"
          instruction="Inspect the separate Vayentra Labs September records to distinguish accounting profit from cash solvency, map order-to-cash handoffs, and recommend a solvent payment decision."
          whyMatters="A company can show healthy accounting profits on accrual while simultaneously experiencing negative cash flow and facing imminent payroll insolvency."
          statusText={labState.vlab?.calcAttempted ? 'Financial Audit Complete' : 'In progress'}
          isActive={activeTaskId === 'S01-T04'}
          onSelectTask={() => setActiveTaskId('S01-T04')}
        >
          {/* Institutional Boundary Warning */}
          <div
            style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#92400e',
              lineHeight: 1.45,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0 }} />
            <span>
              <strong>Institutional Boundary Notice:</strong> These figures belong strictly to the approved Vayentra Labs commercial simulation and are completely separate from your student startup projections.
            </span>
          </div>

          <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: '0 0 14px' }}>
            {VAYENTRA_LABS_FINANCIAL_CASE.scenario}
          </p>

          {/* Quick Prediction Challenge */}
          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#17245c', marginBottom: '8px' }}>
              Founder Prediction: Can Vayentra Labs safely pay this ₹15,000 equipment bill today?
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'yes', label: 'YES — ₹25,000 profit covers the bill' },
                { id: 'no', label: 'NO — Cash liquidity is insufficient' },
                { id: 'not-sure', label: 'NOT SURE — Must inspect cash timing' },
              ].map((p) => {
                const isSel = labState.vlab?.prediction === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleVlabCalcChange('prediction', p.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: isSel ? '#0f766e' : '#ffffff',
                      border: isSel ? '1px solid #0f766e' : '1px solid #cbd5e1',
                      color: isSel ? '#ffffff' : '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5 Financial Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                1. Accounting Profit
              </label>
              <input
                type="text"
                value={labState.vlab?.calcProfit || ''}
                onChange={(e) => handleVlabCalcChange('calcProfit', e.target.value)}
                placeholder="₹25,000"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: '10.5px', color: '#64748b' }}>₹1,00,000 − ₹75,000</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                2. Net Cash Movement
              </label>
              <input
                type="text"
                value={labState.vlab?.calcNetCash || ''}
                onChange={(e) => handleVlabCalcChange('calcNetCash', e.target.value)}
                placeholder="-₹10,000"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: '10.5px', color: '#64748b' }}>₹60,000 − ₹70,000</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                3. Closing Bank Balance
              </label>
              <input
                type="text"
                value={labState.vlab?.calcClosingBank || ''}
                onChange={(e) => handleVlabCalcChange('calcClosingBank', e.target.value)}
                placeholder="₹10,000"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: '10.5px', color: '#64748b' }}>₹20,000 + (-₹10,000)</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                4. Free Cash (Above Reserve)
              </label>
              <input
                type="text"
                value={labState.vlab?.calcAvailableAboveReserve || ''}
                onChange={(e) => handleVlabCalcChange('calcAvailableAboveReserve', e.target.value)}
                placeholder="₹5,000"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: '10.5px', color: '#64748b' }}>₹10,000 − ₹5,000 reserve</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                5. Payment Shortfall
              </label>
              <input
                type="text"
                value={labState.vlab?.calcPaymentShortfall || ''}
                onChange={(e) => handleVlabCalcChange('calcPaymentShortfall', e.target.value)}
                placeholder="₹10,000"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: '10.5px', color: '#64748b' }}>₹15,000 bill − ₹5,000 free</span>
            </div>
          </div>

          {/* Verification Insight */}
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', fontSize: '12.5px', color: '#991b1b', lineHeight: '1.5', marginBottom: '20px' }}>
            <strong>The Reality Check Lesson:</strong> Vayentra Labs earned ₹25,000 in profit, but experienced a −₹10,000 net cash outflow. After safeguarding the ₹5,000 safety reserve, only ₹5,000 in free cash remains. Paying ₹15,000 today would trigger a <strong>₹10,000 cash deficit</strong> and risk payroll insolvency.
          </div>

          {/* Order-to-Cash Process Mapping & Handoff Controls */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Workflow size={16} color="#0f766e" />
              <strong style={{ fontSize: '13px', color: '#17245c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Order-to-Cash Business Process Mapping & Operational Handoffs
              </strong>
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 12px', lineHeight: 1.4 }}>
              Map the 6 stages of revenue realization. Every handoff requires an explicit role owner and evidence control to prevent cash leakage.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {ORDER_TO_CASH_STEPS.map((step) => {
                const currentOwner = labState.vlab?.processOwners?.[step.id] || step.defaultOwner;
                return (
                  <div
                    key={step.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e' }}>
                          Stage 0{step.stepNumber}
                        </span>
                        <select
                          value={currentOwner}
                          onChange={(e) => handleProcessOwnerChange(step.id, e.target.value)}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            color: '#1e293b',
                          }}
                        >
                          {step.roleOptions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.35, marginBottom: '6px' }}>
                        {step.description}
                      </div>
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#b91c1c', borderTop: '1px dashed #f1f5f9', paddingTop: '4px', lineHeight: 1.3 }}>
                      <strong>Risk if missing:</strong> {step.riskIfMissing}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Recommendation & Reserve Preservation */}
          <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f766e', marginBottom: '6px' }}>
              Managerial Payment Recommendation:
            </div>
            <p style={{ fontSize: '12px', color: '#115e59', margin: '0 0 10px', lineHeight: 1.45 }}>
              Recommendation: <strong>Reschedule / Defer</strong>. Pay ₹5,000 from available free cash above the safety reserve; defer remaining ₹10,000 until client receivables are collected.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', background: '#ccfbf1', color: '#0f766e', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                Safety Reserve Protected: ₹5,000
              </span>
              <span style={{ fontSize: '11px', background: '#ccfbf1', color: '#0f766e', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                Cash Solvency Preserved
              </span>
              <span style={{ fontSize: '11px', background: '#ccfbf1', color: '#0f766e', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                ICAI Accrual Discipline Observed
              </span>
            </div>
          </div>
        </TaskCard>

        {/* Transition Callout Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #17245c 0%, #0f766e 100%)',
            borderRadius: '14px',
            padding: '24px 28px',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 8px 24px rgba(23, 36, 92, 0.15)',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#99f6e4' }}>
              Your Business Idea Is Taking Shape
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0 6px', color: '#ffffff' }}>
              Synthesize Your Work into a Professional Pitch Deck
            </h3>
            <p style={{ fontSize: '13.5px', color: '#ccfbf1', margin: 0, maxWidth: '600px', lineHeight: '1.5' }}>
              We have organized your customer problem, target persona, unit economics, and operational controls into an 8-slide executive pitch deck ready for presentation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => scrollToArea('vcep-area-pitch-deck')}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: '#e5af2e',
              border: 'none',
              color: '#17245c',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(229, 175, 46, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Build My Pitch Deck ↓</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* AREA B: CREATE YOUR INVESTOR PITCH DECK (#vcep-area-pitch-deck)            */}
      {/* ========================================================================= */}
      <section
        id="vcep-area-pitch-deck"
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: 'clamp(20px, 3.5vw, 36px)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Area B Header */}
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0f766e' }}>
                AREA B · EXECUTIVE DELIVERABLE
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 800, color: '#17245c', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Create Your Investor Pitch Deck
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
              8 editable slides automatically synthesized from your business decisions. Edit, preview, and practice your pitch.
            </p>
          </div>

          <button
            type="button"
            onClick={() => scrollToArea('vcep-area-opportunity')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#0f766e',
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <span>↑ Refine Business Inputs</span>
          </button>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* TASK 05: BUILD THE PITCH DECK (S01-T05)                                   */}
        {/* ------------------------------------------------------------------------- */}
        <TaskCard
          taskId="S01-T05"
          taskNumber="TASK 05"
          title="Build the Pitch Deck"
          instruction="Populate, edit, and rehearse your eight-slide investor pitch synthesized automatically from your business decisions."
          whyMatters="Clear communication and defensible unit economics convince partners and investors that your operational model is sound."
          statusText="8 Slides Active"
          isActive={activeTaskId === 'S01-T05'}
          onSelectTask={() => setActiveTaskId('S01-T05')}
        >
          {/* 8-Slide Thumbnails / Selector */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            {slides.map((s, idx) => {
              const isActive = activeSlideIndex === idx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '8px',
                    background: isActive ? '#17245c' : '#f8fafc',
                    border: isActive ? '1px solid #17245c' : '1px solid #e2e8f0',
                    color: isActive ? '#ffffff' : '#475569',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 800, opacity: isActive ? 0.9 : 0.6, textTransform: 'uppercase' }}>
                    Slide 0{idx + 1}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.title.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Slide Presentation Canvas */}
          {currentSlide && (
            <div
              style={{
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '28px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Slide Top Banner */}
              <div
                style={{
                  background: '#17245c',
                  padding: '16px 24px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#e5af2e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    SLIDE 0{activeSlideIndex + 1} OF 08 · {currentSlide.subtitle}
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0', color: '#ffffff' }}>
                    {currentSlide.title}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={activeSlideIndex === 0}
                    onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: activeSlideIndex === 0 ? 'rgba(255,255,255,0.1)' : '#ffffff',
                      border: 'none',
                      color: activeSlideIndex === 0 ? 'rgba(255,255,255,0.4)' : '#17245c',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: activeSlideIndex === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    disabled={activeSlideIndex === slides.length - 1}
                    onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: activeSlideIndex === slides.length - 1 ? 'rgba(255,255,255,0.1)' : '#ffffff',
                      border: 'none',
                      color: activeSlideIndex === slides.length - 1 ? 'rgba(255,255,255,0.4)' : '#17245c',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: activeSlideIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Slide Fields Editor */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentSlide.fields.map((f) => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      {f.label}
                    </label>
                    {f.isTextArea ? (
                      <textarea
                        rows={3}
                        value={f.value}
                        onChange={(e) => handleUpdateSlideField(activeSlideIndex, f.key, e.target.value)}
                        placeholder={f.placeholder}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          fontSize: '13.5px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#1e293b',
                          lineHeight: '1.5',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={f.value}
                        onChange={(e) => handleUpdateSlideField(activeSlideIndex, f.key, e.target.value)}
                        placeholder={f.placeholder}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          fontSize: '13.5px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#1e293b',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                        }}
                      />
                    )}
                  </div>
                ))}

                {/* Speaker Notes */}
                <div
                  style={{
                    background: '#f1f5f9',
                    borderLeft: '4px solid #e5af2e',
                    padding: '12px 16px',
                    borderRadius: '0 8px 8px 0',
                    marginTop: '8px',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#17245c', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Founder Pitch Coaching Notes:
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.45' }}>
                    {currentSlide.speakerNotes}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Peer Review Rubric & Metacognitive Reflection */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '22px 24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#17245c', margin: 0 }}>
                Classroom Pitch Practice & Self-Reflection
              </h4>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
                Final Student Review Step
              </span>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px', lineHeight: '1.5' }}>
              Practice presenting your 8 slides in 2 minutes with a peer founder. Use this rubric to audit pitch defensibility.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '18px' }}>
              {[
                { id: 'problemClear', label: '1. Problem Clarity', desc: 'Audience feels acute customer friction immediately.' },
                { id: 'solutionBelievable', label: '2. Solution Believability', desc: 'MVP can realistically be delivered on day one.' },
                { id: 'businessModelClear', label: '3. Financial Realism', desc: 'Unit contribution margin is positive without burn.' },
                { id: 'tradeoffExplained', label: '4. Trade-off Justification', desc: 'Founder defends pricing and operational choices.' },
              ].map((crit) => (
                <div
                  key={crit.id}
                  style={{
                    background: '#ffffff',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#17245c', marginBottom: '2px' }}>
                    {crit.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                    {crit.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Founder Self-Reflection Input */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#17245c', marginBottom: '6px' }}>
                Founder Reflection: "One decision I would change or test further before launching is..."
              </label>
              <textarea
                rows={2}
                value={labState.reflectionChange || ''}
                onChange={(e) => {
                  const nextState: StartupLabState = {
                    ...labState,
                    reflectionChange: e.target.value,
                  };
                  saveLabState(nextState);
                }}
                placeholder="e.g., I would spend more time interviewing early customers directly rather than assuming their willingness to pay upfront."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '13.5px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#1e293b',
                  lineHeight: '1.5',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        </TaskCard>
      </section>
    </div>
  );
}
