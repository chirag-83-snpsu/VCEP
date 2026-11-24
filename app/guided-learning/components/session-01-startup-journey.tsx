'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  STARTUP_STORIES,
  COLLEGE_PROBLEM_OPTIONS,
  OPPORTUNITY_QUESTIONS,
  VENTURE_CASES,
  PRICING_TRADE_OFF_OPTIONS,
  VAYENTRA_LABS_FINANCIAL_CASE,
  ORDER_TO_CASH_STEPS,
  STARTUP_STORAGE_KEY,
  loadStartupLabState,
  buildDefaultPitchDeck,
  type StartupLabState,
  type PitchSlide,
  type CollegeProblemOption,
} from './session-01-startup-data.ts';
import { ControlledAssessmentShield } from '../workstations/components/controlled-assessment-shield.tsx';
import {
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sliders,
  DollarSign,
  Target,
  FileText,
  Lightbulb,
  Check,
  Workflow,
  HelpCircle,
  Eye,
  EyeOff,
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
 * Clean Unified TaskCard Component
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
  isActive = true,
  onSelectTask,
  children,
}: TaskCardProps) {
  const [hintOpen, setHintOpen] = useState(false);

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
        padding: 'clamp(18px, 2.5vw, 28px)',
        marginBottom: '20px',
        boxShadow: isActive ? '0 4px 16px rgba(15, 118, 110, 0.05)' : 'none',
        outline: 'none',
        display: isActive ? 'block' : 'none',
      }}
    >
      {/* Task Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#0F766E',
            }}
          >
            {taskNumber}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {whyMatters && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setHintOpen(!hintOpen);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: hintOpen ? '#f0fdfa' : 'transparent',
                  border: '1px solid #ccfbf1',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#0F766E',
                  cursor: 'pointer',
                }}
              >
                <HelpCircle size={12} />
                <span>{hintOpen ? 'Hide Hint' : 'Need a hint?'}</span>
                {hintOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            )}
            {statusText && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#475569',
                  background: '#f1f5f9',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {statusText}
              </span>
            )}
          </div>
        </div>

        <h3
          style={{
            fontSize: 'clamp(17px, 2vw, 21px)',
            fontWeight: 800,
            color: '#17245C',
            margin: '0 0 4px',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
          {instruction}
        </p>

        {/* Collapsible Single Hint */}
        {hintOpen && whyMatters && (
          <div
            style={{
              marginTop: '10px',
              padding: '10px 14px',
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#0F766E',
              lineHeight: 1.45,
            }}
          >
            <strong>Founder Principle:</strong> {whyMatters}
          </div>
        )}
      </div>

      {/* Task Body */}
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
  const [shieldExpanded, setShieldExpanded] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState<'S01-T01' | 'S01-T02' | 'S01-T03' | 'S01-T04' | 'S01-T05'>('S01-T01');
  const [isCustomIdea, setIsCustomIdea] = useState(false);
  const [customIdeaText, setCustomIdeaText] = useState('');

  // Task 3: Interactive Startup Case Tabs & Live Calculator
  const [activeStoryId, setActiveStoryId] = useState<'zerodha' | 'nykaa' | 'meesho'>('zerodha');
  const [unitSellingPrice, setUnitSellingPrice] = useState<number>(90);
  const [unitDirectCost, setUnitDirectCost] = useState<number>(55);

  // Task 4: Prediction & Check Answer Gate
  const [financialAuditRevealed, setFinancialAuditRevealed] = useState(false);

  // Task 5: Deck Preview Mode
  const [deckPreviewMode, setDeckPreviewMode] = useState(false);

  // Stepper metadata
  const WIZARD_STEPS = [
    { id: 'S01-T01' as const, num: 1, label: 'Pick Idea', short: 'Idea' },
    { id: 'S01-T02' as const, num: 2, label: 'Test Idea', short: 'Test' },
    { id: 'S01-T03' as const, num: 3, label: 'Shape Model', short: 'Model' },
    { id: 'S01-T04' as const, num: 4, label: 'Cash Check', short: 'Cash' },
    { id: 'S01-T05' as const, num: 5, label: 'Pitch Deck', short: 'Deck' },
  ];

  const currentStepIdx = WIZARD_STEPS.findIndex((s) => s.id === activeTaskId);

  // Hydrate from localStorage and check Baseline A shield
  useEffect(() => {
    const loaded = loadStartupLabState();
    setLabState(loaded);
    if (loaded.pitchDeck?.activeSlideIndex !== undefined) {
      setActiveSlideIndex(loaded.pitchDeck.activeSlideIndex);
    }
    if (loaded.vlab?.calcAttempted) {
      setFinancialAuditRevealed(true);
    }
    try {
      const draft = JSON.parse(sessionStorage.getItem('vcep-drive-edition3:session:1:preview') || '{}');
      if (draft['check:0'] === 'yes') {
        setShieldConfirmed(true);
      }
    } catch {}

    // Expose task switcher for automated tests
    if (typeof window !== 'undefined') {
      (window as any).__setActiveTask = (id: any) => setActiveTaskId(id);
    }
  }, []);

  // Save state to localStorage and sync backward-compatible draft keys
  const saveLabState = (next: StartupLabState) => {
    setLabState(next);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STARTUP_STORAGE_KEY, JSON.stringify(next));
      }
    } catch {}
    syncDraftKeys(next);
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
    setShieldExpanded(false);
    try {
      const raw = sessionStorage.getItem('vcep-drive-edition3:session:1:preview');
      const draft = raw ? JSON.parse(raw) : {};
      draft['check:0'] = 'yes';
      sessionStorage.setItem('vcep-drive-edition3:session:1:preview', JSON.stringify(draft));
      onUpdateDraft?.('check:0', 'yes');
    } catch {}
  };

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
    const customCaseObj = VENTURE_CASES[0];
    const nextState: StartupLabState = {
      ...labState,
      stage1: {
        ...labState.stage1,
        selectedProblemId: 'custom-idea',
        opportunityStatement: customIdeaText.trim(),
        targetCampusPersona: 'Campus Students & Faculty',
        whyItMatters: 'Direct campus customer friction identified.',
      },
      opportunityBrief: {
        ...labState.opportunityBrief,
        customerProblem: customIdeaText.trim(),
        targetPersona: 'Campus Students & Faculty',
        existingAlternatives: 'Manual or fragmented alternatives.',
        whyItMatters: 'Direct campus customer friction identified.',
      },
    };
    saveLabState(nextState);
  };

  // Handle question updates in Task 2
  const handleUpdateQuestion = (
    key: 'targetCampusPersona' | 'opportunityStatement' | 'whyItMatters' | 'validationApproach',
    val: string
  ) => {
    const nextState: StartupLabState = {
      ...labState,
      stage1: {
        ...labState.stage1,
        [key]: val,
      },
    };
    saveLabState(nextState);
  };

  // Handle story decisions in Task 3
  const handleSelectStoryDecision = (storyId: string, optionId: string) => {
    const nextState: StartupLabState = {
      ...labState,
      storyDecisions: {
        ...(labState.storyDecisions || {}),
        [storyId]: optionId,
      },
    };
    saveLabState(nextState);
  };

  // Handle pricing trade-off in Task 3
  const handleSelectPricingTradeOff = (choiceId: string, consequence: string) => {
    const nextState: StartupLabState = {
      ...labState,
      pricingTradeOff: {
        choice: choiceId,
        rationale: consequence,
      },
    };
    saveLabState(nextState);
  };

  // Handle financial input change in Task 4
  const handleVlabCalcChange = (field: string, val: string) => {
    const cur = labState.vlab || {
      prediction: '',
      calcProfit: '25000',
      calcNetCash: '-10000',
      calcClosingBank: '10000',
      calcAvailableAboveReserve: '5000',
      calcPaymentShortfall: '10000',
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
      paymentRationale: 'Pay ₹5,000 from available free cash above safety reserve; defer remaining ₹10,000 until client receivables are collected.',
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
      paymentRationale: 'Pay ₹5,000 from available free cash above safety reserve; defer remaining ₹10,000 until client receivables are collected.',
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

  // Handle slide field change in Task 5
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

  // Advance to next wizard step
  const handleNextStep = () => {
    if (currentStepIdx < WIZARD_STEPS.length - 1) {
      setActiveTaskId(WIZARD_STEPS[currentStepIdx + 1].id);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      // Step 5 completed: scroll down to Official Submission Station
      const el = document.getElementById('vcep-official-submission-station');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setActiveTaskId(WIZARD_STEPS[currentStepIdx - 1].id);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Step completion indicators
  const stepCompleted = useMemo(() => ({
    1: Boolean(labState.stage1?.selectedProblemId),
    2: Boolean(labState.stage1?.opportunityStatement && labState.stage1?.targetCampusPersona),
    3: Boolean(labState.pricingTradeOff?.choice),
    4: Boolean(labState.vlab?.calcAttempted),
    5: Boolean(labState.reflectionChange),
  }), [labState]);

  const slides = labState.pitchDeck?.slides || [];
  const currentSlide = slides[activeSlideIndex] || slides[0];

  // Fixed 8 slide tab titles
  const SLIDE_SHORT_TITLES = [
    '1. Startup',
    '2. Problem',
    '3. Solution',
    '4. Market',
    '5. Model',
    '6. Traction',
    '7. Operations',
    '8. Ask',
  ];

  // Live Unit Economics Calculation
  const unitContributionMargin = unitSellingPrice - unitDirectCost;
  const unitMarginPercent = unitSellingPrice > 0 ? ((unitContributionMargin / unitSellingPrice) * 100).toFixed(1) : '0';

  return (
    <div
      className="vcep-simplified-workspace"
      style={{
        width: '100%',
        maxWidth: '1020px',
        margin: '0 auto',
        padding: '0 16px 48px',
        color: '#1e293b',
        fontFamily: 'inherit',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. SLEEK COLLAPSIBLE BASELINE DIAGNOSTIC A BANNER                          */}
      {/* ========================================================================= */}
      {!shieldConfirmed ? (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '12px 18px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="#d97706" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '13px', color: '#92400e', display: 'block' }}>
                  Baseline Diagnostic A (Trainer-Controlled)
                </strong>
                <span style={{ fontSize: '12px', color: '#b45309' }}>
                  60-minute invigilated diagnostic prior to interactive founder work.
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShieldExpanded(!shieldExpanded)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #fcd34d',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#92400e',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{shieldExpanded ? 'Hide Rules' : 'View Rules'}</span>
                {shieldExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              <button
                type="button"
                className="vcep-shield-confirm-btn"
                onClick={handleConfirmShield}
                style={{
                  background: '#d97706',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Check size={13} strokeWidth={3} />
                <span>Confirm & Begin</span>
              </button>
            </div>
          </div>

          {shieldExpanded && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #fcd34d' }}>
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
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#166534',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <CheckCircle2 size={15} color="#16a34a" />
            <span>Baseline Diagnostic A Completed Independently · Founder Workstation Active</span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Autosaved</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STICKY 5-STEP HORIZONTAL WIZARD STEPPER                                */}
      {/* ========================================================================= */}
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
        {WIZARD_STEPS.map((step, idx) => {
          const isActive = activeTaskId === step.id;
          const isDone = (stepCompleted as any)[step.num];

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => setActiveTaskId(step.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid #0f766e' : isDone ? '1px solid #bbf7d0' : '1px solid transparent',
                  background: isActive ? '#0f766e' : isDone ? '#f0fdf4' : '#f8fafc',
                  color: isActive ? '#ffffff' : isDone ? '#166534' : '#475569',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  flex: '1 1 auto',
                  justifyContent: 'center',
                }}
              >
                {isDone && !isActive ? (
                  <CheckCircle2 size={13} color="#16a34a" />
                ) : (
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: isActive ? '#ffffff' : '#e2e8f0',
                      color: isActive ? '#0f766e' : '#475569',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10.5px',
                      fontWeight: 800,
                    }}
                  >
                    {step.num}
                  </span>
                )}
                <span>{step.label}</span>
              </button>
              {idx < WIZARD_STEPS.length - 1 && (
                <span style={{ color: '#cbd5e1', fontSize: '11px', flexShrink: 0 }}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 3. TASK CONTAINERS (ONLY ACTIVE TASK RENDERED AT A TIME)                  */}
      {/* ========================================================================= */}
      <section id="vcep-area-opportunity" style={{ width: '100%' }}>
        {/* TASK 01: PICK IDEA */}
        <TaskCard
          taskId="S01-T01"
          taskNumber="TASK 01"
          title="Identify the Opportunity"
          instruction="Select a relatable campus friction or propose your own venture."
          whyMatters="Great ventures start from genuine daily friction. A focused customer persona saves development capital."
          statusText={labState.stage1?.selectedProblemId ? 'Selected' : 'Choose 1'}
          isActive={activeTaskId === 'S01-T01'}
          onSelectTask={() => setActiveTaskId('S01-T01')}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
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
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: isSelected ? '#f0fdfa' : '#ffffff',
                    border: isSelected ? '2px solid #0f766e' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(15, 118, 110, 0.08)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: isSelected ? '#0f766e' : '#64748b' }}>
                        {opt.category}
                      </span>
                      {isSelected && <CheckCircle2 size={15} color="#0f766e" />}
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                      {opt.title}
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                      {opt.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px dashed #ccfbf1', fontSize: '11px', color: '#0f766e', fontWeight: 600 }}>
                      Opportunity: {opt.opportunityHint}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Custom Option Card */}
            <div
              onClick={() => setIsCustomIdea(true)}
              tabIndex={0}
              role="button"
              aria-pressed={isCustomIdea}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                background: isCustomIdea ? '#f0fdfa' : '#ffffff',
                border: isCustomIdea ? '2px solid #0f766e' : '1px dashed #cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: isCustomIdea ? '#0f766e' : '#64748b' }}>
                    Custom Venture
                  </span>
                  {isCustomIdea && <CheckCircle2 size={15} color="#0f766e" />}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                  Enter Your Own Idea
                </div>
                <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                  Have an original campus or market problem? Define your own venture.
                </p>
              </div>

              {isCustomIdea ? (
                <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={customIdeaText}
                    onChange={(e) => setCustomIdeaText(e.target.value)}
                    placeholder="Describe problem & solution..."
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      fontSize: '11.5px',
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
                      padding: '5px 10px',
                      fontSize: '11.5px',
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
                <div style={{ marginTop: '10px', paddingTop: '6px', borderTop: '1px dashed #e2e8f0', fontSize: '11px', color: '#0f766e', fontWeight: 600 }}>
                  Click to type custom venture
                </div>
              )}
            </div>
          </div>
        </TaskCard>

        {/* TASK 02: TEST IDEA */}
        <TaskCard
          taskId="S01-T02"
          taskNumber="TASK 02"
          title="Test the Idea"
          instruction="Answer these 4 fundamental commercial questions to structure your customer proposition."
          whyMatters="Validating customer assumptions early prevents building products nobody will pay for."
          statusText={labState.stage1?.opportunityStatement ? '4 Answers Set' : 'Drafting'}
          isActive={activeTaskId === 'S01-T02'}
          onSelectTask={() => setActiveTaskId('S01-T02')}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
            }}
          >
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

              return (
                <div
                  key={cfg.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase' }}>
                        Question {cfg.number}
                      </span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                        {curValue.split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#17245c', marginBottom: '2px' }}>
                      {cfg.question}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '8px' }}>
                      {cfg.prompt}
                    </div>

                    {/* Max 3 Quick Insert Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                      {cfg.chips.slice(0, 3).map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleUpdateQuestion(updateKey, chip)}
                          style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            background: curValue === chip ? '#ccfbf1' : '#ffffff',
                            border: curValue === chip ? '1px solid #0f766e' : '1px solid #cbd5e1',
                            color: curValue === chip ? '#0f766e' : '#475569',
                            cursor: 'pointer',
                          }}
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={curValue}
                    onChange={(e) => handleUpdateQuestion(updateKey, e.target.value)}
                    placeholder={cfg.example}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '12.5px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#1e293b',
                      lineHeight: 1.4,
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </TaskCard>

        {/* TASK 03: SHAPE MODEL */}
        <TaskCard
          taskId="S01-T03"
          taskNumber="TASK 03"
          title="Shape the Business"
          instruction="Learn from real Indian founder models, calculate unit economics, and choose an early pricing trade-off."
          whyMatters="Startups fail when contribution margin is negative or when unsustainable discounts exhaust cash."
          statusText="Economics Set"
          isActive={activeTaskId === 'S01-T03'}
          onSelectTask={() => setActiveTaskId('S01-T03')}
        >
          {/* Part A: 3 Indian Startup Lessons in Tabs */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#17245c', textTransform: 'uppercase', marginBottom: '8px' }}>
              1. Real Indian Startup Model Lessons (Select to Inspect)
            </div>
            {/* Case Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {STARTUP_STORIES.map((s) => {
                const isSelected = activeStoryId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveStoryId(s.id as any)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: isSelected ? 700 : 500,
                      background: isSelected ? '#17245c' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#334155',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {s.company} ({s.foundingYear})
                  </button>
                );
              })}
            </div>

            {/* Active Story Card */}
            {(() => {
              const story = STARTUP_STORIES.find((s) => s.id === activeStoryId) || STARTUP_STORIES[0];
              const userChoice = labState.storyDecisions?.[story.id] || '';

              return (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '14px 16px',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>Friction:</div>
                      <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>{story.problem}</div>
                    </div>
                    <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase' }}>Founder Moat:</div>
                      <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>{story.model}</div>
                    </div>
                  </div>

                  {/* Decision Question */}
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#17245c', marginBottom: '6px' }}>
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
                            padding: '7px 10px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            background: isChosen ? (opt.isOptimal ? '#f0fdf4' : '#fef2f2') : '#ffffff',
                            border: isChosen ? (opt.isOptimal ? '1px solid #16a34a' : '1px solid #dc2626') : '1px solid #e2e8f0',
                            color: '#1e293b',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{opt.text}</span>
                          {isChosen && (
                            <span style={{ display: 'block', marginTop: '3px', fontSize: '10.5px', color: opt.isOptimal ? '#166534' : '#991b1b' }}>
                              {opt.feedback}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Part B: Interactive Unit Economics Calculator */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '16px 18px',
              marginBottom: '18px',
            }}
          >
            <div style={{ fontWeight: 700, color: '#17245c', fontSize: '13px', marginBottom: '10px' }}>
              2. Unit Economics & Pricing Calculator
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                  Revenue Model
                </label>
                <select
                  value={labState.pricingTradeOff?.choice || 'pt-scope'}
                  onChange={(e) => handleSelectPricingTradeOff(e.target.value, 'Commercial trade-off chosen')}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    background: '#ffffff',
                  }}
                >
                  <option value="pt-scope">Subscription Pass (Weekly / Monthly)</option>
                  <option value="pt-discount">Pay-per-Order / Pay-as-you-go</option>
                  <option value="pt-value">Flat Monthly Convenience Fee</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                  Selling Price / Unit (₹)
                </label>
                <input
                  type="number"
                  value={unitSellingPrice}
                  onChange={(e) => setUnitSellingPrice(Number(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                  Direct Cost / Unit (₹)
                </label>
                <input
                  type="number"
                  value={unitDirectCost}
                  onChange={(e) => setUnitDirectCost(Number(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                  Unit Contribution Margin
                </label>
                <div
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: unitContributionMargin > 0 ? '#f0fdf4' : '#fef2f2',
                    border: unitContributionMargin > 0 ? '1px solid #bbf7d0' : '1px solid #fecaca',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: unitContributionMargin > 0 ? '#166534' : '#b91c1c',
                  }}
                >
                  ₹{unitContributionMargin} / unit ({unitMarginPercent}%)
                </div>
              </div>
            </div>

            {/* Part C: Early Pricing Strategy */}
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#17245c', marginBottom: '6px' }}>
              Early Pricing Trade-Off Strategy:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              {PRICING_TRADE_OFF_OPTIONS.map((pto) => {
                const isChosen = (labState.pricingTradeOff?.choice || 'pt-scope') === pto.id;
                return (
                  <div
                    key={pto.id}
                    onClick={() => handleSelectPricingTradeOff(pto.id, pto.consequence)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      background: isChosen ? '#ffffff' : '#f8fafc',
                      border: isChosen ? '2px solid #0f766e' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: pto.isOptimal ? '#0f766e' : '#b91c1c', textTransform: 'uppercase' }}>
                        {pto.badge}
                      </span>
                      {isChosen && <Check size={13} color="#0f766e" strokeWidth={3} />}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#17245c' }}>{pto.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{pto.consequence}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </TaskCard>

        {/* TASK 04: CASH CHECK */}
        <TaskCard
          taskId="S01-T04"
          taskNumber="TASK 04"
          title="Check Business Reality"
          instruction="Inspect Vayentra Labs September records to distinguish paper profit from cash solvency."
          whyMatters="A venture can show healthy accounting profits while simultaneously running out of cash."
          statusText={financialAuditRevealed ? 'Audit Complete' : 'Pending Check'}
          isActive={activeTaskId === 'S01-T04'}
          onSelectTask={() => setActiveTaskId('S01-T04')}
        >
          {/* 4-Metric Mini-Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>1. Accrual Revenue</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#17245c' }}>₹1,00,000</div>
              <div style={{ fontSize: '10.5px', color: '#64748b' }}>Earned in September</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>2. Accrual Expenses</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#17245c' }}>₹75,000</div>
              <div style={{ fontSize: '10.5px', color: '#64748b' }}>Incurred in September</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>3. Cash Collected</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f766e' }}>₹60,000</div>
              <div style={{ fontSize: '10.5px', color: '#64748b' }}>Cash paid out: ₹70,000</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>4. Bank Opening</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#17245c' }}>₹20,000</div>
              <div style={{ fontSize: '10.5px', color: '#64748b' }}>Mandatory reserve: ₹5,000</div>
            </div>
          </div>

          {/* Prediction Challenge */}
          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#17245c', marginBottom: '6px' }}>
              Founder Decision: Can Vayentra Labs safely pay this ₹15,000 equipment delivery bill today?
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'yes', label: 'YES — ₹25,000 profit covers bill' },
                { id: 'no', label: 'NO — Cash liquidity is insufficient' },
                { id: 'not-sure', label: 'NOT SURE — Check cash timing' },
              ].map((p) => {
                const isSel = labState.vlab?.prediction === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleVlabCalcChange('prediction', p.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '16px',
                      fontSize: '11.5px',
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

          {/* 5 Financial Calculations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                1. Accounting Profit
              </label>
              <input
                type="text"
                value={labState.vlab?.calcProfit || ''}
                onChange={(e) => handleVlabCalcChange('calcProfit', e.target.value)}
                placeholder="₹25,000"
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                2. Net Cash Movement
              </label>
              <input
                type="text"
                value={labState.vlab?.calcNetCash || ''}
                onChange={(e) => handleVlabCalcChange('calcNetCash', e.target.value)}
                placeholder="-₹10,000"
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                3. Closing Bank Balance
              </label>
              <input
                type="text"
                value={labState.vlab?.calcClosingBank || ''}
                onChange={(e) => handleVlabCalcChange('calcClosingBank', e.target.value)}
                placeholder="₹10,000"
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                4. Free Cash (Above Reserve)
              </label>
              <input
                type="text"
                value={labState.vlab?.calcAvailableAboveReserve || ''}
                onChange={(e) => handleVlabCalcChange('calcAvailableAboveReserve', e.target.value)}
                placeholder="₹5,000"
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                5. Payment Shortfall
              </label>
              <input
                type="text"
                value={labState.vlab?.calcPaymentShortfall || ''}
                onChange={(e) => handleVlabCalcChange('calcPaymentShortfall', e.target.value)}
                placeholder="₹10,000"
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Reveal Button if answer not revealed */}
          {!financialAuditRevealed ? (
            <div style={{ textAlign: 'center', margin: '14px 0' }}>
              <button
                type="button"
                onClick={() => setFinancialAuditRevealed(true)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: '#0f766e',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles size={14} />
                <span>Check My Answer & Reveal Audit</span>
              </button>
            </div>
          ) : (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '12px',
                color: '#991b1b',
                lineHeight: 1.45,
                marginBottom: '16px',
              }}
            >
              <strong>The Reality Check Lesson:</strong> Vayentra Labs earned ₹25,000 profit, but experienced a −₹10,000 net cash outflow. After protecting the ₹5,000 safety reserve, only ₹5,000 free cash remains. Paying ₹15,000 today would create a <strong>₹10,000 deficit</strong> risking payroll insolvency.
              <div style={{ marginTop: '6px', color: '#0f766e', fontWeight: 600 }}>
                Recommendation: <strong>Reschedule / Defer</strong>. Pay ₹5,000 now; defer ₹10,000 until customer receivables are collected.
              </div>
            </div>
          )}

          {/* Compact Order-to-Cash 6-Row Table */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#17245c', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Workflow size={14} color="#0f766e" />
              <span>Order-to-Cash Process Handoffs</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '6px 8px' }}>Stage</th>
                    <th style={{ padding: '6px 8px' }}>Step Name</th>
                    <th style={{ padding: '6px 8px' }}>Responsible Role</th>
                    <th style={{ padding: '6px 8px' }}>Risk if Missing</th>
                  </tr>
                </thead>
                <tbody>
                  {ORDER_TO_CASH_STEPS.map((step) => {
                    const currentOwner = labState.vlab?.processOwners?.[step.id] || step.defaultOwner;
                    return (
                      <tr key={step.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '6px 8px', fontWeight: 700, color: '#0f766e' }}>0{step.stepNumber}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 600, color: '#1e293b' }}>{step.title}</td>
                        <td style={{ padding: '6px 8px' }}>
                          <select
                            value={currentOwner}
                            onChange={(e) => handleProcessOwnerChange(step.id, e.target.value)}
                            style={{ fontSize: '11px', padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          >
                            {step.roleOptions.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '6px 8px', color: '#64748b' }}>{step.riskIfMissing}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TaskCard>
      </section>

      {/* AREA B: PITCH DECK */}
      <section id="vcep-area-pitch-deck" style={{ width: '100%' }}>
        {/* TASK 05: PITCH DECK */}
        <TaskCard
          taskId="S01-T05"
          taskNumber="TASK 05"
          title="Build the Pitch Deck"
          instruction="Synthesize your business decisions into an 8-slide executive pitch deck."
          whyMatters="Defensible unit economics and clear communication convince investors that your model works."
          statusText="8 Slides Active"
          isActive={activeTaskId === 'S01-T05'}
          onSelectTask={() => setActiveTaskId('S01-T05')}
        >
          {/* 8-Slide Selector Tabs */}
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '6px',
              paddingBottom: '8px',
              marginBottom: '16px',
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
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: isActive ? '#17245c' : '#f8fafc',
                    border: isActive ? '1px solid #17245c' : '1px solid #e2e8f0',
                    color: isActive ? '#ffffff' : '#475569',
                    fontSize: '11.5px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flex: '0 0 auto',
                  }}
                >
                  {SLIDE_SHORT_TITLES[idx] || s.title}
                </button>
              );
            })}
          </div>

          {/* Slide Canvas */}
          {currentSlide && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '16px',
              }}
            >
              {/* Slide Topbar */}
              <div
                style={{
                  background: '#17245c',
                  padding: '12px 18px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#e5af2e', textTransform: 'uppercase' }}>
                    SLIDE 0{activeSlideIndex + 1} OF 08 · {currentSlide.subtitle}
                  </span>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '2px 0 0', color: '#ffffff' }}>
                    {currentSlide.title}
                  </h4>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setDeckPreviewMode(!deckPreviewMode)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: deckPreviewMode ? '#0f766e' : 'rgba(255,255,255,0.15)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {deckPreviewMode ? <EyeOff size={12} /> : <Eye size={12} />}
                    <span>{deckPreviewMode ? 'Edit Mode' : 'Preview Deck'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={activeSlideIndex === 0}
                    onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.15)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '11px',
                      cursor: activeSlideIndex === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={activeSlideIndex === slides.length - 1}
                    onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.15)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '11px',
                      cursor: activeSlideIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Slide Body */}
              <div style={{ padding: '16px 18px' }}>
                {!deckPreviewMode ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentSlide.fields.map((f) => (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                          {f.label}
                        </label>
                        {f.isTextArea ? (
                          <textarea
                            rows={2}
                            value={f.value}
                            onChange={(e) => handleUpdateSlideField(activeSlideIndex, f.key, e.target.value)}
                            placeholder={f.placeholder}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              fontSize: '12.5px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
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
                              padding: '8px 10px',
                              fontSize: '12.5px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              boxSizing: 'border-box',
                              fontFamily: 'inherit',
                            }}
                          />
                        )}
                      </div>
                    ))}
                    <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', borderLeft: '3px solid #e5af2e', paddingLeft: '8px' }}>
                      Coach Note: {currentSlide.speakerNotes}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#17245c', marginBottom: '12px' }}>
                      {currentSlide.title}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      {currentSlide.fields.map((f) => (
                        <div key={f.key} style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{f.label}</div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{f.value || '—'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Founder Self-Reflection Input */}
          <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
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
                padding: '8px 10px',
                fontSize: '12.5px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </TaskCard>
      </section>

      {/* ========================================================================= */}
      {/* 4. CLEAN FOOTER ACTION BAR                                                */}
      {/* ========================================================================= */}
      <footer
        style={{
          marginTop: '20px',
          padding: '14px 18px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <button
          type="button"
          disabled={currentStepIdx === 0}
          onClick={handlePrevStep}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: currentStepIdx === 0 ? '#f8fafc' : '#ffffff',
            color: currentStepIdx === 0 ? '#94a3b8' : '#1e293b',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: currentStepIdx === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <ArrowLeft size={14} />
          <span>Previous</span>
        </button>

        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
          Step {currentStepIdx + 1} of 5 · {WIZARD_STEPS[currentStepIdx].label}
        </span>

        <button
          type="button"
          onClick={handleNextStep}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            background: '#0f766e',
            color: '#ffffff',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(15, 118, 110, 0.2)',
          }}
        >
          <span>{currentStepIdx < WIZARD_STEPS.length - 1 ? 'Save & Continue' : 'Review & Submit Session'}</span>
          {currentStepIdx < WIZARD_STEPS.length - 1 ? <ArrowRight size={14} /> : <ChevronDown size={14} />}
        </button>
      </footer>
    </div>
  );
}
