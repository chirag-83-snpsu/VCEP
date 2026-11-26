'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  STARTUP_STORIES,
  COLLEGE_PROBLEM_OPTIONS,
  VENTURE_CASES,
  STARTUP_STORAGE_KEY,
  loadStartupLabState,
  buildDefaultPitchDeck,
  type StartupLabState,
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
  DollarSign,
  Target,
  Check,
  HelpCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  Lightbulb,
  Send,
  Building2,
  TrendingUp,
} from 'lucide-react';

interface Session01StartupJourneyProps {
  onUpdateDraft?: (key: string, value: string) => void;
}

interface TaskCardProps {
  taskId: string;
  taskNumber: string;
  title: string;
  instruction: string;
  learningTakeaway: string;
  hintText?: string;
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
  learningTakeaway,
  hintText,
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
      {/* 1-Line Teaching Takeaway Banner */}
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
        <Lightbulb size={15} color="#0f766e" style={{ flexShrink: 0 }} />
        <span>{learningTakeaway}</span>
      </div>

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
            {hintText && (
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
        {hintOpen && hintText && (
          <div
            style={{
              marginTop: '10px',
              padding: '10px 14px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#334155',
              lineHeight: 1.45,
            }}
          >
            <strong>Founder Tip:</strong> {hintText}
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
  const [activeTaskId, setActiveTaskId] = useState<'S01-T01' | 'S01-T02' | 'S01-T03' | 'S01-T04' | 'S01-T05'>('S01-T01');

  // Step 1: Idea selection state
  const [isCustomIdea, setIsCustomIdea] = useState(false);
  const [customIdeaTitle, setCustomIdeaTitle] = useState('');
  const [customIdeaFriction, setCustomIdeaFriction] = useState('');

  // Step 2: 3 Focused solution inputs
  const [targetCustomer, setTargetCustomer] = useState(
    labState.stage1?.targetCampusPersona || 'Hostel students & PG residents without kitchen access'
  );
  const [solutionOffering, setSolutionOffering] = useState(
    labState.stage1?.opportunityStatement || 'Hot ₹90 homestyle meal box delivered at 1:15 PM'
  );
  const [whyYou, setWhyYou] = useState(
    labState.stage1?.whyItMatters || 'Guaranteed on-time delivery or 100% money-back refund'
  );

  // Step 3: Quick Concept & Unit Economics
  const [activeStartupStory, setActiveStartupStory] = useState<'zerodha' | 'meesho'>('zerodha');
  const [sellingPrice, setSellingPrice] = useState<number>(labState.unitPrice || 90);
  const [directCost, setDirectCost] = useState<number>(labState.unitCost || 55);
  const [monthlyUnits, setMonthlyUnits] = useState<number>(labState.expectedMonthlyUnits || 500);

  // Step 4: Cash check & decision
  const [cashDecision, setCashDecision] = useState<'yes' | 'no' | ''>(
    labState.cashDecision || (labState.vlab?.prediction === 'no' ? 'no' : labState.vlab?.prediction === 'yes' ? 'yes' : 'no')
  );
  const [cashRationale, setCashRationale] = useState<string>(
    labState.cashRationale || labState.vlab?.paymentRationale ||
    'Closing bank balance is only ₹10,000, leaving just ₹5,000 free cash after the ₹5,000 safety reserve. Paying ₹15,000 creates a ₹10,000 deficit.'
  );
  const [answerChecked, setAnswerChecked] = useState(Boolean(labState.vlab?.calcAttempted));

  // Step 5: 1-Page Pitch Card & First Step Action
  const [firstStepAction, setFirstStepAction] = useState<string>(
    labState.firstStepAction || labState.reflectionChange ||
    'Set up a free tasting table outside the hostel on Sunday to test willingness to pay.'
  );
  const [pitchPreviewMode, setPitchPreviewMode] = useState(false);

  const hasInitialSynced = useRef(false);

  // Wizard Steps metadata
  const WIZARD_STEPS = [
    { id: 'S01-T01' as const, num: 1, label: 'Pick Idea', short: 'Idea' },
    { id: 'S01-T02' as const, num: 2, label: 'Test Idea', short: 'Test' },
    { id: 'S01-T03' as const, num: 3, label: 'Shape Model', short: 'Model' },
    { id: 'S01-T04' as const, num: 4, label: 'Cash Check', short: 'Cash' },
    { id: 'S01-T05' as const, num: 5, label: 'Pitch Deck', short: 'Deck' },
  ];

  const currentStepIdx = WIZARD_STEPS.findIndex((s) => s.id === activeTaskId);

  // Unit Economics calculated metrics
  const unitProfit = sellingPrice - directCost;
  const unitMarginPercent = sellingPrice > 0 ? ((unitProfit / sellingPrice) * 100).toFixed(1) : '0';
  const totalMonthlyProfit = unitProfit * monthlyUnits;

  // Live 1-Sentence Pitch
  const oneSentencePitch = useMemo(() => {
    const cust = targetCustomer.trim() || 'campus students';
    const sol = solutionOffering.trim() || 'affordable daily services';
    const why = whyYou.trim() || 'it is faster and more reliable';
    return `We help ${cust} by providing ${sol}, because ${why}.`;
  }, [targetCustomer, solutionOffering, whyYou]);

  // Sync draft keys for review engine and platform grading
  const syncDraftKeys = (state: StartupLabState) => {
    try {
      const raw = sessionStorage.getItem('vcep-drive-edition3:session:1:preview');
      const draft = raw ? JSON.parse(raw) : {};

      // Shield
      draft['check:0'] = 'yes';
      onUpdateDraft?.('check:0', 'yes');

      // Stage 1 Concept & Opportunity
      const cust = targetCustomer.trim() || 'Hostel students';
      const sol = solutionOffering.trim() || 'Affordable daily meals';
      const why = whyYou.trim() || 'Guaranteed on-time delivery';
      const conceptText = `Venture: ${state.selectedCaseId}. Target customer: ${cust}. Solves customer friction by providing ${sol}. Chosen because: ${why}. Built on disciplined unit contribution margins and transparent pricing to protect liquidity.`;
      draft['concept:explain'] = conceptText;
      onUpdateDraft?.('concept:explain', conceptText);

      // Stage 4 Canvas & Analysis
      const activeCase = VENTURE_CASES.find((c) => c.id === state.selectedCaseId) || VENTURE_CASES[0];
      const prob = state.stage1?.opportunityStatement || activeCase.summary;
      const pricing = state.pricingTradeOff?.choice || 'pt-scope';
      draft['work:analysis'] = `Selected Venture: ${activeCase.name}. Core Problem: ${prob}. Beachhead Customer: ${cust}. Pricing Strategy: ${pricing}. Unit Margin: ₹${unitProfit} (${unitMarginPercent}%).`;
      onUpdateDraft?.('work:analysis', draft['work:analysis']);

      // Stage 5 Approved Vayentra Labs Financial figures sync
      draft['work:1:0:0:2'] = '25000';
      draft['work:1:0:1:2'] = '-10000';
      draft['work:1:0:2:2'] = '10000';
      draft['work:1:0:3:2'] = '5000';
      draft['work:1:0:4:2'] = '10000';

      onUpdateDraft?.('work:1:0:0:2', '25000');
      onUpdateDraft?.('work:1:0:1:2', '-10000');
      onUpdateDraft?.('work:1:0:2:2', '10000');
      onUpdateDraft?.('work:1:0:3:2', '5000');
      onUpdateDraft?.('work:1:0:4:2', '10000');

      // Process handoffs
      draft['team:contribution'] = 'Vayentra Labs Cash Audit: Identified ₹10,000 cash shortfall despite ₹25,000 accounting profit. Protected ₹5,000 emergency reserve.';
      onUpdateDraft?.('team:contribution', draft['team:contribution']);

      // Management payment recommendation
      const rec = cashDecision === 'yes' ? 'approve' : 'reschedule';
      draft['team:judgement'] = `Payment Decision: ${rec}. Rationale: ${cashRationale || 'Pay ₹5,000 from free cash; defer remaining ₹10,000 until customer receivables are collected.'}`;
      onUpdateDraft?.('team:judgement', draft['team:judgement']);

      // Reflection
      const refAction = firstStepAction || 'Interview 5 students outside the hostel gate on Sunday to validate willingness to pay.';
      draft['review:reflection'] = refAction;
      onUpdateDraft?.('review:reflection', refAction);

      sessionStorage.setItem('vcep-drive-edition3:session:1:preview', JSON.stringify(draft));
    } catch {}
  };

  // Save lab state to localStorage and sync draft keys
  const saveLabState = (next: StartupLabState) => {
    setLabState(next);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STARTUP_STORAGE_KEY, JSON.stringify(next));
      }
    } catch {}
    syncDraftKeys(next);
  };

  // Hydrate on mount
  useEffect(() => {
    const loaded = loadStartupLabState();
    setLabState(loaded);

    if (loaded.unitPrice) setSellingPrice(loaded.unitPrice);
    if (loaded.unitCost) setDirectCost(loaded.unitCost);
    if (loaded.expectedMonthlyUnits) setMonthlyUnits(loaded.expectedMonthlyUnits);
    if (loaded.cashDecision) setCashDecision(loaded.cashDecision);
    if (loaded.cashRationale) setCashRationale(loaded.cashRationale);
    if (loaded.firstStepAction) setFirstStepAction(loaded.firstStepAction);
    if (loaded.vlab?.calcAttempted) setAnswerChecked(true);

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

    if (!hasInitialSynced.current) {
      hasInitialSynced.current = true;
      syncDraftKeys(loaded);
    }
  }, []);

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

  // Step 1: Select 1 of 4 cards
  const handleSelectProblemCard = (opt: CollegeProblemOption) => {
    setIsCustomIdea(false);
    let mappedCaseId = 'quickbite';
    if (opt.id === 'prob-laundry') mappedCaseId = 'cleanwash';
    else if (opt.id === 'prob-food') mappedCaseId = 'quickbite';
    else if (opt.id === 'prob-inventory') mappedCaseId = 'digitlocal';

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
      decisions: {
        decisionA: mappedCaseId === 'quickbite' ? 'qa1' : mappedCaseId === 'cleanwash' ? 'ca1' : 'da1',
        decisionB: mappedCaseId === 'quickbite' ? 'qb1' : mappedCaseId === 'cleanwash' ? 'cb1' : 'db1',
        decisionC: mappedCaseId === 'quickbite' ? 'qc1' : mappedCaseId === 'cleanwash' ? 'cc1' : 'dc1',
        decisionD: mappedCaseId === 'quickbite' ? 'qd1' : mappedCaseId === 'cleanwash' ? 'cd1' : 'dd1',
        decisionE: mappedCaseId === 'quickbite' ? 'qe1' : mappedCaseId === 'cleanwash' ? 'ce1' : 'de1',
      },
      storyDecisions: {
        zerodha: 'opt-transparency',
        nykaa: 'opt-authenticity',
        meesho: 'opt-unit-economics',
      },
    };
    saveLabState(nextState);
  };

  const handleCustomIdeaSelect = () => {
    setIsCustomIdea(true);
    const nextState: StartupLabState = {
      ...labState,
      selectedCaseId: 'quickbite',
      stage1: {
        ...labState.stage1,
        selectedProblemId: 'custom-idea',
        opportunityStatement: customIdeaTitle || 'Custom Campus Venture',
        targetCampusPersona: 'Campus Students & Faculty',
        whyItMatters: customIdeaFriction || 'Direct campus friction identified.',
      },
      decisions: {
        decisionA: 'qa1',
        decisionB: 'qb1',
        decisionC: 'qc1',
        decisionD: 'qd1',
        decisionE: 'qe1',
      },
      storyDecisions: {
        zerodha: 'opt-transparency',
        nykaa: 'opt-authenticity',
        meesho: 'opt-unit-economics',
      },
    };
    saveLabState(nextState);
  };

  // Step 2: Update 3 inputs
  const handleSaveStep2 = () => {
    const nextState: StartupLabState = {
      ...labState,
      stage1: {
        ...labState.stage1,
        targetCampusPersona: targetCustomer,
        opportunityStatement: solutionOffering,
        whyItMatters: whyYou,
      },
      boardroom: {
        ...labState.boardroom,
        pitchTarget: targetCustomer,
        pitchSolution: solutionOffering,
        pitchMoat: whyYou,
        pitchProblem: labState.stage1?.opportunityStatement || 'Daily campus friction',
      },
    };
    saveLabState(nextState);
  };

  // Step 3: Update Unit Economics
  const handleSaveStep3 = (price: number, cost: number, units: number) => {
    setSellingPrice(price);
    setDirectCost(cost);
    setMonthlyUnits(units);
    const nextState: StartupLabState = {
      ...labState,
      unitPrice: price,
      unitCost: cost,
      expectedMonthlyUnits: units,
      pricingTradeOff: {
        choice: 'pt-scope',
        rationale: 'Protect positive unit contribution margins while maintaining fair customer pricing.',
      },
    };
    saveLabState(nextState);
  };

  // Step 4: Decision & Check Answer
  const handleCheckAnswer = () => {
    setAnswerChecked(true);
    const nextVlab = {
      prediction: cashDecision as any,
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
      paymentRecommendation: cashDecision === 'yes' ? 'approve' : 'reschedule',
      paymentRationale: cashRationale,
    };
    const nextState: StartupLabState = {
      ...labState,
      cashDecision,
      cashRationale,
      vlab: nextVlab,
    };
    saveLabState(nextState);
  };

  // Step 5: Save First Step Action & Submit
  const handleSaveFirstStep = (actionText: string) => {
    setFirstStepAction(actionText);
    const nextState: StartupLabState = {
      ...labState,
      firstStepAction: actionText,
      reflectionChange: actionText,
    };
    saveLabState(nextState);
  };

  const handleNextStep = () => {
    if (currentStepIdx < WIZARD_STEPS.length - 1) {
      setActiveTaskId(WIZARD_STEPS[currentStepIdx + 1].id);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
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
    2: Boolean(targetCustomer && solutionOffering && whyYou),
    3: Boolean(sellingPrice > 0 && directCost >= 0),
    4: Boolean(answerChecked),
    5: Boolean(firstStepAction.trim()),
  }), [labState, targetCustomer, solutionOffering, whyYou, sellingPrice, directCost, answerChecked, firstStepAction]);

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
        {/* ========================================================================= */}
        {/* STEP 1: PICK A REAL PROBLEM                                               */}
        {/* ========================================================================= */}
        <TaskCard
          taskId="S01-T01"
          taskNumber="TASK 01"
          title="Pick a Real Problem"
          instruction="Choose 1 campus friction below or enter your own original business idea."
          learningTakeaway="Great businesses start by solving a real daily problem people will gladly pay to fix."
          hintText="Focus on frequent hassles. Problems people face daily or weekly create natural repeat customers."
          statusText={labState.stage1?.selectedProblemId ? 'Selected ✓' : 'Choose 1'}
          isActive={activeTaskId === 'S01-T01'}
          onSelectTask={() => setActiveTaskId('S01-T01')}
        >
          {/* 4 Clean Scannable Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            {/* Card 1: Laundry */}
            {(() => {
              const opt = COLLEGE_PROBLEM_OPTIONS[0];
              const isSelected = !isCustomIdea && labState.stage1?.selectedProblemId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectProblemCard(opt)}
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
                        Hostel Service
                      </span>
                      {isSelected && <CheckCircle2 size={16} color="#0f766e" />}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                      Student Laundry Service
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                      Students spend 4 hours hand-washing clothes or wait 6 days for local dhobis.
                    </p>
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #ccfbf1', fontSize: '11.5px', color: '#0f766e', fontWeight: 600 }}>
                      ✨ Founder Insight: High repeat weekly demand with immediate upfront cash payment.
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Card 2: Food */}
            {(() => {
              const opt = COLLEGE_PROBLEM_OPTIONS[1];
              const isSelected = !isCustomIdea && labState.stage1?.selectedProblemId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectProblemCard(opt)}
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
                        Food & Dining
                      </span>
                      {isSelected && <CheckCircle2 size={16} color="#0f766e" />}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                      Hostel Mess Food Delivery
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                      Hostel food is unhygienic and oily; food delivery apps cost ₹250+ per meal.
                    </p>
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #ccfbf1', fontSize: '11.5px', color: '#0f766e', fontWeight: 600 }}>
                      ✨ Founder Insight: Daily necessity with high frequency and zero customer acquisition cost on campus.
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Card 3: Kirana / Stationery */}
            {(() => {
              const opt = COLLEGE_PROBLEM_OPTIONS[2];
              const isSelected = !isCustomIdea && labState.stage1?.selectedProblemId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectProblemCard(opt)}
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
                        Campus Retail
                      </span>
                      {isSelected && <CheckCircle2 size={16} color="#0f766e" />}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                      Campus Essentials & Stationery
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                      Campus stores run out of exam pens and notebooks right before morning tests.
                    </p>
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #ccfbf1', fontSize: '11.5px', color: '#0f766e', fontWeight: 600 }}>
                      ✨ Founder Insight: Urgent deadline need where convenience beats price sensitivity.
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Card 4: My Own Idea */}
            <div
              onClick={handleCustomIdeaSelect}
              tabIndex={0}
              role="button"
              aria-pressed={isCustomIdea}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                background: isCustomIdea ? '#f0fdfa' : '#ffffff',
                border: isCustomIdea ? '2px solid #0f766e' : '1px dashed #cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
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
                  {isCustomIdea && <CheckCircle2 size={16} color="#0f766e" />}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                  Enter My Own Idea
                </div>
                <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                  Have an original campus or business idea? Define your customer problem.
                </p>
              </div>

              {isCustomIdea ? (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input
                    type="text"
                    value={customIdeaTitle}
                    onChange={(e) => setCustomIdeaTitle(e.target.value)}
                    placeholder="Venture name or service..."
                    style={{
                      padding: '5px 8px',
                      fontSize: '11.5px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                  <input
                    type="text"
                    value={customIdeaFriction}
                    onChange={(e) => setCustomIdeaFriction(e.target.value)}
                    placeholder="Customer pain point..."
                    style={{
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
                      handleCustomIdeaSelect();
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
                    Save My Idea
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0', fontSize: '11.5px', color: '#0f766e', fontWeight: 600 }}>
                  Click to define original idea
                </div>
              )}
            </div>
          </div>
        </TaskCard>

        {/* ========================================================================= */}
        {/* STEP 2: DEFINE YOUR SOLUTION                                              */}
        {/* ========================================================================= */}
        <TaskCard
          taskId="S01-T02"
          taskNumber="TASK 02"
          title="Define Your Solution"
          instruction="Define your target customer, product offering, and competitive advantage in 3 short inputs."
          learningTakeaway="A strong pitch clearly states who pays you, what you sell, and why you are the best choice."
          hintText="Keep it simple. You don't need a complex mobile app to solve an urgent problem on campus."
          statusText={targetCustomer && solutionOffering && whyYou ? 'Pitch Ready ✓' : 'Drafting'}
          isActive={activeTaskId === 'S01-T02'}
          onSelectTask={() => setActiveTaskId('S01-T02')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Field 1: Target Customer */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                1. Target Customer (Who pays you?)
              </label>
              {/* Starter Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {[
                  'Hostel students & PG residents without kitchen access',
                  'Day scholars commuting daily via local trains/buses',
                  'College club heads & fest organizing committees',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTargetCustomer(chip);
                      handleSaveStep2();
                    }}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: targetCustomer === chip ? '#ccfbf1' : '#ffffff',
                      border: targetCustomer === chip ? '1px solid #0f766e' : '1px solid #cbd5e1',
                      color: targetCustomer === chip ? '#0f766e' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    + {chip}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={targetCustomer}
                onChange={(e) => {
                  setTargetCustomer(e.target.value);
                  handleSaveStep2();
                }}
                placeholder="e.g. 1st & 2nd year undergraduates living in campus hostels"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  fontSize: '12.5px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Field 2: Your Solution */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                2. Your Solution (What are you selling?)
              </label>
              {/* Starter Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {[
                  'Hot ₹90 homestyle meal box delivered at 1:15 PM sharp',
                  '24-hour wash, dry, and fold laundry pass by bag weight',
                  'Exam prep kits & emergency stationery delivered at hostel gate',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSolutionOffering(chip);
                      handleSaveStep2();
                    }}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: solutionOffering === chip ? '#ccfbf1' : '#ffffff',
                      border: solutionOffering === chip ? '1px solid #0f766e' : '1px solid #cbd5e1',
                      color: solutionOffering === chip ? '#0f766e' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    + {chip}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={solutionOffering}
                onChange={(e) => {
                  setSolutionOffering(e.target.value);
                  handleSaveStep2();
                }}
                placeholder="e.g. Standardized 24-hr wash and fold service priced by bag"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  fontSize: '12.5px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Field 3: Why You? */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
                3. Why You? (Why will they choose you over alternatives?)
              </label>
              {/* Starter Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {[
                  'Guaranteed on-time delivery or 100% money-back refund',
                  'Half the price of commercial apps with zero hidden delivery surcharges',
                  'Direct campus gate access with zero lost items or delivery confusion',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setWhyYou(chip);
                      handleSaveStep2();
                    }}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: whyYou === chip ? '#ccfbf1' : '#ffffff',
                      border: whyYou === chip ? '1px solid #0f766e' : '1px solid #cbd5e1',
                      color: whyYou === chip ? '#0f766e' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    + {chip}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={whyYou}
                onChange={(e) => {
                  setWhyYou(e.target.value);
                  handleSaveStep2();
                }}
                placeholder="e.g. Guaranteed punctuality at half the price of food delivery apps"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  fontSize: '12.5px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Live 1-Sentence Pitch Preview Box */}
            <div
              style={{
                background: '#f0fdfa',
                border: '1px solid #5eead4',
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <Sparkles size={18} color="#0f766e" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#0f766e', letterSpacing: '0.04em' }}>
                  Your Live 1-Sentence Pitch
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#134e4a', marginTop: '4px', lineHeight: 1.45 }}>
                  &ldquo;{oneSentencePitch}&rdquo;
                </div>
              </div>
            </div>
          </div>
        </TaskCard>

        {/* ========================================================================= */}
        {/* STEP 3: CHECK YOUR PRICING & PROFIT                                       */}
        {/* ========================================================================= */}
        <TaskCard
          taskId="S01-T03"
          taskNumber="TASK 03"
          title="Check Your Pricing & Profit"
          instruction="Inspect a proven Indian startup model, then calculate your unit economics and monthly profit."
          learningTakeaway="Every product sold must earn a profit after direct costs—volume cannot fix negative margins."
          hintText="Selling price minus direct cost is profit per unit. Aim to keep contribution margin above 20%."
          statusText={unitProfit > 0 ? `₹${unitProfit}/unit (${unitMarginPercent}%)` : 'Calculate'}
          isActive={activeTaskId === 'S01-T03'}
          onSelectTask={() => setActiveTaskId('S01-T03')}
        >
          {/* Part A: 1 Concise Real-World Concept Card (Toggleable Zerodha vs Meesho) */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#17245c', textTransform: 'uppercase' }}>
                Startup Business Model Lesson
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActiveStartupStory('zerodha')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: activeStartupStory === 'zerodha' ? 700 : 500,
                    background: activeStartupStory === 'zerodha' ? '#17245c' : '#f1f5f9',
                    color: activeStartupStory === 'zerodha' ? '#ffffff' : '#334155',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Zerodha (Transparent Pricing)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStartupStory('meesho')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: activeStartupStory === 'meesho' ? 700 : 500,
                    background: activeStartupStory === 'meesho' ? '#17245c' : '#f1f5f9',
                    color: activeStartupStory === 'meesho' ? '#ffffff' : '#334155',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Meesho (Unit-Cost Discipline)
                </button>
              </div>
            </div>

            {/* Active Story Card Content */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '10px',
              }}
            >
              {activeStartupStory === 'zerodha' ? (
                <>
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>
                      Problem They Solved:
                    </div>
                    <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                      Opaque brokerage fees (up to 1% per trade) and hidden charges blocked everyday Indians from investing.
                    </div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase' }}>
                      Smart Business Model:
                    </div>
                    <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                      Zero brokerage for long-term equity; flat ₹20 for intraday. Zero ad spend—transparent pricing drove viral customer trust.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>
                      Problem They Solved:
                    </div>
                    <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                      Small manufacturers in Tier-2/3 towns could not afford 20%–30% platform commissions on existing marketplaces.
                    </div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase' }}>
                      Smart Business Model:
                    </div>
                    <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                      0% seller commission; monetizes via seller ads and built dedicated logistics (Valmo) to reduce shipping costs per order.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Part B: Simple Unit Economics Calculator */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '16px 18px',
            }}
          >
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#17245c', marginBottom: '12px' }}>
              Unit Economics Calculator (Test Your Margins)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                  Selling Price / Unit (₹)
                </label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => handleSaveStep3(Number(e.target.value) || 0, directCost, monthlyUnits)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                  Direct Cost / Unit (₹)
                </label>
                <input
                  type="number"
                  value={directCost}
                  onChange={(e) => handleSaveStep3(sellingPrice, Number(e.target.value) || 0, monthlyUnits)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                  Expected Monthly Sales (Units)
                </label>
                <input
                  type="number"
                  value={monthlyUnits}
                  onChange={(e) => handleSaveStep3(sellingPrice, directCost, Number(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                    fontWeight: 600,
                  }}
                />
              </div>
            </div>

            {/* Calculated Output Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Profit per Unit
                </span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: unitProfit > 0 ? '#166534' : '#dc2626', marginTop: '2px' }}>
                  ₹{unitProfit}
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Profit Margin %
                </span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: Number(unitMarginPercent) >= 20 ? '#166534' : '#d97706', marginTop: '2px' }}>
                  {unitMarginPercent}%
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Estimated Monthly Profit
                </span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: totalMonthlyProfit > 0 ? '#0f766e' : '#dc2626', marginTop: '2px' }}>
                  ₹{totalMonthlyProfit.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Dynamic 1-Line Tip */}
            {Number(unitMarginPercent) < 20 ? (
              <div style={{ fontSize: '12px', color: '#b45309', background: '#fef3c7', padding: '8px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} color="#d97706" style={{ flexShrink: 0 }} />
                <span>⚠️ Warning: Margin is below 20%. Any delivery delay or small discount will cause you to lose money on every order.</span>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: '#166534', background: '#f0fdf4', padding: '8px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                <span>✅ Healthy Unit Economics: You earn ₹{unitProfit} per unit ({unitMarginPercent}%) to cover marketing and fixed costs.</span>
              </div>
            )}
          </div>
        </TaskCard>

        {/* ========================================================================= */}
        {/* STEP 4: PROFIT VS. CASH REALITY CHECK                                     */}
        {/* ========================================================================= */}
        <TaskCard
          taskId="S01-T04"
          taskNumber="TASK 04"
          title="Profit vs. Cash Reality Check"
          instruction="Decide whether Vayentra Labs can safely pay a ₹15,000 vendor bill from its September cash flow."
          learningTakeaway="Profit on paper does not equal cash in hand—bills can only be paid with real money in the bank."
          hintText="Opening cash was ₹20,000, but net cash flow was negative (-₹10,000). Always protect the ₹5,000 safety buffer."
          statusText={answerChecked ? 'Audit Verified ✓' : 'Decision Required'}
          isActive={activeTaskId === 'S01-T04'}
          onSelectTask={() => setActiveTaskId('S01-T04')}
        >
          {/* 4-Stat Summary Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Revenue Earned</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#17245c', marginTop: '2px' }}>₹1,00,000</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Invoiced in September</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Expenses Incurred</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#17245c', marginTop: '2px' }}>₹75,000</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Cost of operations</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Cash Collected</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f766e', marginTop: '2px' }}>₹60,000</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Cash paid out: ₹70,000</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Opening Bank</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#17245c', marginTop: '2px' }}>₹20,000</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Safety reserve: ₹5,000</div>
            </div>
          </div>

          {/* Decision Prompt & Input */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 18px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#17245c', marginBottom: '8px' }}>
              Founder Decision: Can Vayentra Labs safely pay this ₹15,000 equipment bill today?
            </div>

            {/* Yes / No Toggle */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => setCashDecision('yes')}
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: cashDecision === 'yes' ? '2px solid #0f766e' : '1px solid #cbd5e1',
                  background: cashDecision === 'yes' ? '#f0fdfa' : '#ffffff',
                  color: cashDecision === 'yes' ? '#0f766e' : '#475569',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                }}
              >
                Yes (Pay the ₹15,000 bill)
              </button>
              <button
                type="button"
                onClick={() => setCashDecision('no')}
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: cashDecision === 'no' ? '2px solid #0f766e' : '1px solid #cbd5e1',
                  background: cashDecision === 'no' ? '#f0fdfa' : '#ffffff',
                  color: cashDecision === 'no' ? '#0f766e' : '#475569',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                }}
              >
                No (Insufficient free cash)
              </button>
            </div>

            {/* Why Textarea */}
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
              Why? (Explain your reasoning in 1–2 sentences)
            </label>
            <textarea
              rows={2}
              value={cashRationale}
              onChange={(e) => setCashRationale(e.target.value)}
              placeholder="e.g. No, because closing bank balance is only ₹10,000, leaving just ₹5,000 free cash after the safety reserve."
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

            {/* Check Answer Button */}
            {!answerChecked && (
              <div style={{ marginTop: '12px', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={handleCheckAnswer}
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
                  <span>Check Answer</span>
                </button>
              </div>
            )}
          </div>

          {/* Visual Breakdown Revealed Only After Check Answer */}
          {answerChecked && (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '16px 18px',
                marginBottom: '10px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#166534', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>Financial Reality Breakdown</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Paper Profit:</span>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>+₹25,000</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Net Cash Flow:</span>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>-₹10,000</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Closing Bank:</span>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>₹10,000</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Safety Buffer:</span>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#d97706' }}>₹5,000</div>
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 10px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#166534', fontWeight: 700 }}>Free Cash:</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#166534' }}>₹5,000</div>
                </div>
              </div>

              {/* Highlighted 1-Sentence Lesson */}
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '12.5px',
                  color: '#991b1b',
                  lineHeight: 1.45,
                }}
              >
                <strong>📌 The Golden Lesson:</strong> Profit on paper doesn&rsquo;t pay bills—cash in the bank does.
                <div style={{ marginTop: '4px', color: '#0f766e', fontWeight: 600 }}>
                  Recommendation: Reschedule payment. Pay ₹5,000 from available free cash today; defer remaining ₹10,000 until customer receivables arrive.
                </div>
              </div>
            </div>
          )}
        </TaskCard>
      </section>

      {/* AREA B: PITCH DECK & EXECUTIVE 1-PAGE SUMMARY */}
      <section id="vcep-area-pitch-deck" style={{ width: '100%' }}>
        {/* ========================================================================= */}
        {/* STEP 5: YOUR 1-PAGE BUSINESS PITCH                                        */}
        {/* ========================================================================= */}
        <TaskCard
          taskId="S01-T05"
          taskNumber="TASK 05"
          title="Your 1-Page Business Pitch"
          instruction="Review your executive pitch card, set your 1st customer test this week, and submit Session 1."
          learningTakeaway="A simple 1-page business pitch helps you test assumptions with real customers before spending money."
          hintText="Test your offer directly with 5 real people before building anything complex or expensive."
          statusText={firstStepAction ? 'Ready to Submit ✓' : 'Drafting'}
          isActive={activeTaskId === 'S01-T05'}
          onSelectTask={() => setActiveTaskId('S01-T05')}
        >
          {/* Executive 1-Page Pitch Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            {/* Pitch Card Header */}
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
                  Founder Executive Summary
                </span>
                <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '2px 0 0', color: '#ffffff' }}>
                  {labState.stage1?.selectedProblemId === 'prob-laundry' ? 'Student Laundry Service' :
                   labState.stage1?.selectedProblemId === 'prob-food' ? 'Hostel Mess Food Delivery' :
                   labState.stage1?.selectedProblemId === 'prob-inventory' ? 'Campus Essentials & Stationery' :
                   customIdeaTitle || 'Campus Venture Pitch'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPitchPreviewMode(!pitchPreviewMode)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  background: pitchPreviewMode ? '#0f766e' : 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                {pitchPreviewMode ? <EyeOff size={12} /> : <Eye size={12} />}
                <span>{pitchPreviewMode ? 'Edit Mode' : 'Preview Pitch Card'}</span>
              </button>
            </div>

            {/* 4 Clean Sections in Pitch Card */}
            <div style={{ padding: '16px 18px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  marginBottom: '14px',
                }}
              >
                {/* Section 1: Customer & Problem */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase', marginBottom: '4px' }}>
                    1. Beachhead Customer
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#17245c' }}>
                    {targetCustomer}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                    <strong>Friction:</strong> {labState.stage1?.opportunityStatement || 'High cost & daily inconvenience'}
                  </div>
                </div>

                {/* Section 2: Solution & Pitch */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase', marginBottom: '4px' }}>
                    2. Core Proposition
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#17245c' }}>
                    {solutionOffering}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                    <strong>Advantage:</strong> {whyYou}
                  </div>
                </div>

                {/* Section 3: Unit Economics */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase', marginBottom: '4px' }}>
                    3. Unit Economics
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#17245c' }}>
                    ₹{sellingPrice} Price · ₹{directCost} Direct Cost
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 700, marginTop: '4px' }}>
                    ₹{unitProfit}/unit profit ({unitMarginPercent}% margin) · ~₹{totalMonthlyProfit.toLocaleString('en-IN')}/mo
                  </div>
                </div>

                {/* Section 4: Cash Management Rule */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase', marginBottom: '4px' }}>
                    4. Cash Solvency Rule
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#17245c' }}>
                    Profit ≠ Liquid Cash
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                    Preserve ₹5,000 emergency buffer; defer capital outlays until receivables clear.
                  </div>
                </div>
              </div>

              {/* Live 1-Sentence Pitch in Pitch Card */}
              <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '8px', padding: '10px 14px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase' }}>
                  Executive Pitch Line:
                </span>
                <p style={{ fontSize: '12.5px', color: '#134e4a', margin: '3px 0 0', fontWeight: 600, fontStyle: 'italic' }}>
                  &ldquo;{oneSentencePitch}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* 1 Final Input: My First Step This Week */}
          <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#17245c', marginBottom: '4px' }}>
              My First Step This Week (How will you test this with 5 real customers?)
            </label>
            {/* Starter Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {[
                'Set up a free tasting table outside the hostel on Sunday',
                'Interview 5 classmates about their biggest daily laundry delay',
                'Offer a 3-day prepaid meal trial with 100% money-back guarantee',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSaveFirstStep(chip)}
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: firstStepAction === chip ? '#ccfbf1' : '#ffffff',
                    border: firstStepAction === chip ? '1px solid #0f766e' : '1px solid #cbd5e1',
                    color: firstStepAction === chip ? '#0f766e' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  + {chip}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              value={firstStepAction}
              onChange={(e) => handleSaveFirstStep(e.target.value)}
              placeholder="e.g. Talk to 5 hostel students in Block A this evening to confirm willingness to pay ₹90 for a delivered homestyle lunch."
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
          <span>{currentStepIdx < WIZARD_STEPS.length - 1 ? 'Save & Continue' : 'Review & Submit Session 1'}</span>
          {currentStepIdx < WIZARD_STEPS.length - 1 ? <ArrowRight size={14} /> : <Send size={14} />}
        </button>
      </footer>
    </div>
  );
}
