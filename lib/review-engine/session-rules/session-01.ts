import { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus } from '../types';

export function evaluateSession01(ctx: ReviewContext): SessionReviewReport {
  const { draft, practiceLabData, workstationData, startupLabData } = ctx;

  const startup = startupLabData || (workstationData?.version === '3.1' ? workstationData : null);
  const isStartupEdition = Boolean(
    startup ||
    draft['work:analysis']?.includes('Selected Venture') ||
    draft['team:contribution']?.includes('Executive Role')
  );

  if (isStartupEdition) {
    return evaluateStartupEdition31(ctx, startup);
  }

  return evaluateLegacyEdition30(ctx);
}

// ============================================================================
// EDITION 3.1: STARTUP EXPERIENCE REVIEW EVALUATOR
// ============================================================================
function evaluateStartupEdition31(ctx: ReviewContext, startupData: any): SessionReviewReport {
  const { draft } = ctx;
  const s = startupData || {};
  const decisions = s.decisions || {};
  const boardroom = s.boardroom || {};
  const stories = s.storyDecisions || {};

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  const shieldConfirmed = ctx.workstationData?.shieldConfirmed === true || (draft['check:0'] === 'yes');
  const conceptExplain = (draft['concept:explain'] || '').trim();
  const reflectionText = (draft['review:reflection'] || '').trim();
  const crisisRationale = (boardroom.crisisRationale || draft['team:judgement'] || '').trim();

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [];

  // O1: Baseline A Diagnostic Shield
  overviewChecks.push({
    id: 's01-o1-shield',
    title: 'Controlled Assessment Boundary (Baseline A)',
    description: 'Acknowledge that Baseline A is an independent 60-minute diagnostic assessment conducted without AI or peer assistance.',
    passed: shieldConfirmed,
    status: shieldConfirmed ? 'passed' : 'pending',
    studentValue: shieldConfirmed ? 'Confirmed' : 'Pending acknowledgment',
    expectedRequirement: 'Review Baseline A guidelines and confirm independent completion conditions.',
    whyIncorrect: 'Baseline A establishes your authentic starting competency. Working independently ensures diagnostic accuracy.',
    conceptToRevisit: 'Stage 01 Overview · Class Schedule & Baseline A Guidelines',
    actionTab: 'Overview',
    actionLabel: 'Confirm Overview Shield',
  });

  // O2: Venture Selection & Founder Challenge
  const hasCase = Boolean(s.selectedCaseId);
  overviewChecks.push({
    id: 's01-o2-case-selected',
    title: 'Venture Simulation Orientation',
    description: 'Select an authentic collegiate / Bengaluru consumer problem to solve in the Founder Lab.',
    passed: hasCase,
    status: hasCase ? 'passed' : 'pending',
    studentValue: hasCase ? `Venture Selected: ${s.selectedCaseId}` : 'Not yet selected',
    expectedRequirement: 'Choose one of 4 simulated ventures (QuickBite, CampusMerch, CleanWash, or DigitLocal).',
    whyIncorrect: 'You must select a venture to anchor your customer discovery and Founder Lab decisions.',
    conceptToRevisit: 'Stage 01 Overview · The Founder Challenge',
    actionTab: 'Overview',
    actionLabel: 'Select Venture Case',
  });

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [];

  // L1: Indian Startup Story Decision Analysis
  const storyCount = Object.keys(stories).length;
  const zerodhaChoice = stories.zerodha;
  const nykaaChoice = stories.nykaa;
  const meeshoChoice = stories.meesho;

  const allOptimal =
    zerodhaChoice === 'opt-transparency' &&
    nykaaChoice === 'opt-authenticity' &&
    meeshoChoice === 'opt-unit-economics';

  const hasSuboptimal =
    zerodhaChoice === 'opt-free' ||
    nykaaChoice === 'opt-deep-discount' ||
    meeshoChoice === 'opt-unlimited-free-ship';

  learnChecks.push({
    id: 's01-l1-startup-stories',
    title: 'Indian Startup Business Model Decisions',
    description: 'Analyze how Zerodha, Nykaa, and Meesho created trust, authenticity, and unit-economic discipline.',
    passed: storyCount >= 3 && allOptimal,
    status: (storyCount >= 3 && allOptimal) ? 'passed' : hasSuboptimal ? 'failed' : storyCount > 0 ? 'warning' : 'pending',
    studentValue: storyCount > 0 ? `${storyCount} of 3 stories analyzed` : 'Unanswered',
    expectedRequirement: 'Choose sustainable strategic options: Zerodha (transparent trust), Nykaa (verified authenticity), Meesho (Valmo unit economics).',
    whyIncorrect: hasSuboptimal
      ? 'Caution: You selected cash-burning or replica-based options. Subsidizing delivery losses or selling unverified replicas damages venture survival.'
      : 'Complete all three startup story decisions to extract founder business model lessons.',
    conceptToRevisit: 'Stage 02 Learn · Real Indian Startup Stories',
    actionTab: 'Learn',
    actionLabel: 'Review Startup Decisions',
  });

  // L2: Founder Commercial Principle Explanation
  const l2Words = wordCount(conceptExplain);
  const l2Passed = l2Words >= 20;
  learnChecks.push({
    id: 's01-l2-concept',
    title: 'Founder Principle Explanation',
    description: 'Explain in your own words how real startups turn customer trust and unit margins into durable businesses.',
    passed: l2Passed,
    status: l2Passed ? 'passed' : l2Words > 0 ? 'warning' : 'pending',
    studentValue: l2Words > 0 ? `${l2Words} words recorded` : 'Empty',
    expectedRequirement: 'A substantive explanation of at least 20 words detailing founder trust, unit economics, and repeat demand.',
    whyIncorrect: 'Your explanation is too brief to demonstrate full conceptual clarity for boardroom defence.',
    conceptToRevisit: 'Stage 02 Learn · Core Founder Principles',
    actionTab: 'Learn',
    actionLabel: 'Draft Concept Explanation',
  });

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [];

  // C1: Consumer Problem & Friction Points
  caseChecks.push({
    id: 's01-c1-friction',
    title: 'Customer Persona & Daily Inconvenience',
    description: 'Examine the customer persona, daily inconvenience, available seed resources, and operational hurdles.',
    passed: hasCase,
    status: hasCase ? 'passed' : 'pending',
    studentValue: hasCase ? `Examined ${s.selectedCaseId} brief` : 'Brief not reviewed',
    expectedRequirement: 'Identify the target student/local persona and their core daily friction point.',
    whyIncorrect: 'A startup begins with acute empathy for a customer problem. Review the active case brief.',
    conceptToRevisit: 'Stage 03 Case · Venture Selection',
    actionTab: 'Case',
    actionLabel: 'Review Case Brief',
  });

  // ----------------------------------------------------
  // STAGE 04: WORK (FOUNDER LAB)
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // W1: Core Problem & Target Customer
  const hasProblem = Boolean(decisions.decisionA);
  const hasCustomer = Boolean(decisions.decisionB);
  workChecks.push({
    id: 's01-w1-problem-customer',
    title: 'Customer Problem & Target Early Adopter (Decisions A & B)',
    description: 'Sharply define the acute daily friction and the initial beachhead customer segment.',
    passed: hasProblem && hasCustomer,
    status: (hasProblem && hasCustomer) ? 'passed' : (hasProblem || hasCustomer) ? 'warning' : 'pending',
    studentValue: (hasProblem && hasCustomer) ? 'Decisions A & B defined' : 'Incomplete',
    expectedRequirement: 'Select the acute daily customer friction and a specific, reachable beachhead customer persona.',
    whyIncorrect: 'Targeting everyone or solving cosmetic issues creates feature bloat without customer adoption.',
    conceptToRevisit: 'Stage 04 Work · Founder Decisions A & B',
    actionTab: 'Work',
    actionLabel: 'Complete Decisions A & B',
  });

  // W2: Minimum Viable Service (MVP) Scope
  const hasMvp = Boolean(decisions.decisionC);
  const isBloat = decisions.decisionC?.endsWith('2'); // e.g. qc2, mc2, cc2, dc2 are feature bloat options
  workChecks.push({
    id: 's01-w2-mvp',
    title: 'Minimum Viable Service (Decision C)',
    description: 'Scope the simplest useful service that solves the core problem without premature feature bloat.',
    passed: hasMvp && !isBloat,
    status: (hasMvp && !isBloat) ? 'passed' : isBloat ? 'failed' : 'pending',
    studentValue: hasMvp ? (isBloat ? 'Feature Bloat Selected' : 'Focused MVP Selected') : 'Not selected',
    expectedRequirement: 'Select a focused, disciplined MVP that solves the friction without 6-month software delays.',
    whyIncorrect: isBloat
      ? 'Premature feature bloat trap! Building 50 custom menu dishes or custom ERP software drains your seed budget before launch.'
      : 'Scope your initial MVP service before planning launch campaigns.',
    conceptToRevisit: 'Stage 04 Work · Founder Decision C',
    actionTab: 'Work',
    actionLabel: 'Refine MVP Scope',
  });

  // W3: First 10 Customers Acquisition Strategy
  const hasAcq = Boolean(decisions.decisionD);
  const isPaidAdTrap = decisions.decisionD?.endsWith('2'); // e.g. qd2, md2, cd2, dd2 are paid ad / spam traps
  workChecks.push({
    id: 's01-w3-acquisition',
    title: 'First 10 Customers Acquisition (Decision D)',
    description: 'Design a grassroots, low-cost channel to convert your first 10 paying customers.',
    passed: hasAcq && !isPaidAdTrap,
    status: (hasAcq && !isPaidAdTrap) ? 'passed' : isPaidAdTrap ? 'failed' : 'pending',
    studentValue: hasAcq ? (isPaidAdTrap ? 'High Cash Burn Channel' : 'Grassroots Conversion Channel') : 'Not selected',
    expectedRequirement: 'Deploy direct personal demonstration, sample tasting, or common-room walk-ins to win early trust.',
    whyIncorrect: isPaidAdTrap
      ? 'Capital burn mistake! Spending ₹15,000 on generic city-wide ads without reviews burns your cash with near-zero conversion.'
      : 'Plan how you will physically win your first 10 paying customers on campus.',
    conceptToRevisit: 'Stage 04 Work · Founder Decision D',
    actionTab: 'Work',
    actionLabel: 'Select Acquisition Channel',
  });

  // W4: Delivery Process & Breakdown Remediation
  const hasDelivery = Boolean(decisions.decisionE);
  const isCustomerBlame = decisions.decisionE?.endsWith('3');
  workChecks.push({
    id: 's01-w4-delivery',
    title: 'Fulfilment Controls & Remediation (Decision E)',
    description: 'Establish delivery reliability buffers and customer remediation protocols.',
    passed: hasDelivery && !isCustomerBlame,
    status: (hasDelivery && !isCustomerBlame) ? 'passed' : isCustomerBlame ? 'failed' : 'pending',
    studentValue: hasDelivery ? (isCustomerBlame ? 'Blame-Customer Option' : 'Controlled Delivery Rota') : 'Not selected',
    expectedRequirement: 'Establish designated campus runners with buffer meals/items and proactive refund guarantees.',
    whyIncorrect: isCustomerBlame
      ? 'Customer service disaster! Forcing customers to accept broken deliveries destroys venture reputation.'
      : 'Set up clear operational fulfilment controls and remediation rules.',
    conceptToRevisit: 'Stage 04 Work · Founder Decision E',
    actionTab: 'Work',
    actionLabel: 'Set Delivery Controls',
  });

  // W5: Live Startup Launch Canvas Assembly
  const canvasComplete = hasProblem && hasCustomer && hasMvp && hasAcq && hasDelivery;
  workChecks.push({
    id: 's01-w5-canvas',
    title: 'Startup Launch Canvas Compilation',
    description: 'Assemble all 5 strategic founder choices into the 8-cell Startup Launch Canvas.',
    passed: canvasComplete,
    status: canvasComplete ? 'passed' : 'pending',
    studentValue: canvasComplete ? 'All 8 Canvas Cells Compiled' : `${[hasProblem, hasCustomer, hasMvp, hasAcq, hasDelivery].filter(Boolean).length}/5 Decisions Complete`,
    expectedRequirement: 'Complete all 5 decisions in the Founder Lab to compile your full venture canvas.',
    whyIncorrect: 'Your canvas has missing blocks. Complete remaining decisions in the Founder Lab.',
    conceptToRevisit: 'Stage 04 Work · Startup Launch Canvas',
    actionTab: 'Work',
    actionLabel: 'Open Founder Lab',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM (STARTUP BOARDROOM)
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [];

  // T1: Executive Boardroom Role
  const hasRole = Boolean(boardroom.roleId);
  teamChecks.push({
    id: 's01-t1-role',
    title: 'Executive Boardroom Position',
    description: 'Select your leadership mandate (Strategy, Marketing, Operations, Finance, or Risk).',
    passed: hasRole,
    status: hasRole ? 'passed' : 'pending',
    studentValue: hasRole ? boardroom.roleId : 'No role selected',
    expectedRequirement: 'Assume one of five defined executive positions with specific operational accountability.',
    whyIncorrect: 'Boardroom members must have designated responsibilities before tackling crisis setbacks.',
    conceptToRevisit: 'Stage 05 Team · Executive Roles',
    actionTab: 'Team',
    actionLabel: 'Select Boardroom Role',
  });

  // T2: Operational Crisis Remediation
  const hasCrisisChoice = Boolean(boardroom.crisisChoice);
  const isSilentDelay = boardroom.crisisChoice === 'strat-c';
  const hasRationale = wordCount(crisisRationale) >= 15;
  teamChecks.push({
    id: 's01-t2-crisis',
    title: 'Crisis Remediation Strategy & Justification',
    description: 'Navigate the delivery fleet failure at 8:00 PM and record a strategic justification of at least 15 words.',
    passed: hasCrisisChoice && !isSilentDelay && hasRationale,
    status: (hasCrisisChoice && !isSilentDelay && hasRationale) ? 'passed' :
      isSilentDelay ? 'failed' : (hasCrisisChoice || hasRationale) ? 'warning' : 'pending',
    studentValue: hasRationale ? `${crisisRationale.slice(0, 70)}…` : 'Incomplete',
    expectedRequirement: 'Choose proactive transparency (Strategy A) or emergency courier (Strategy B) with at least 15 words of justification.',
    whyIncorrect: isSilentDelay
      ? 'Fatal trust breach! Silent delay guarantees furious customers, cancelled bookings, and hostile campus reviews.'
      : 'Provide a substantive justification (at least 15 words) explaining your boardroom strategy.',
    conceptToRevisit: 'Stage 05 Team · Crisis Simulation',
    actionTab: 'Team',
    actionLabel: 'Resolve Boardroom Crisis',
  });

  // T3: 60-Second Venture Pitch Outline & Investor Pitch Deck
  const hasPitch = Boolean(boardroom.pitchProblem || boardroom.pitchSolution || (s.pitchDeck?.slides && s.pitchDeck.slides.length === 8));
  teamChecks.push({
    id: 's01-t3-pitch',
    title: 'Investor Pitch Deck & Venture Synthesis',
    description: 'Assemble an 8-slide investor pitch deck with core problem, solution, target persona, business model, and the ask.',
    passed: hasPitch,
    status: hasPitch ? 'passed' : 'pending',
    studentValue: hasPitch ? (s.pitchDeck?.slides?.length === 8 ? '8-Slide Investor Pitch Deck Compiled' : 'Pitch points recorded') : 'Unanswered',
    expectedRequirement: 'Synthesize your venture into an 8-slide pitch deck or concise 1-sentence points for problem, solution, and the ask.',
    whyIncorrect: 'Founders must communicate their venture value proposition crisply in an investor pitch deck.',
    conceptToRevisit: 'Stage 06 Pitch Deck · Executive Presentation',
    actionTab: 'Team',
    actionLabel: 'Build Pitch Deck',
  });

  // Helper to compile stage result
  const buildStage = (stage: 'Overview' | 'Learn' | 'Case' | 'Work' | 'Team', title: string, checks: ReviewCheckItem[]): StageReviewResult => {
    const passedCount = checks.filter((c) => c.passed).length;
    const totalCount = checks.length;
    const hasFailed = checks.some((c) => c.status === 'failed');
    const allPassed = passedCount === totalCount;
    const hasSome = passedCount > 0 || checks.some((c) => c.status === 'warning');

    let status: StageStatus = 'not_started';
    if (allPassed) status = 'reviewed';
    else if (hasFailed) status = 'needs_revision';
    else if (hasSome) status = 'in_progress';

    let summary = `${passedCount} of ${totalCount} learning checks verified.`;
    if (status === 'reviewed') summary = `All ${totalCount} checks verified against Startup Experience standards.`;
    else if (status === 'needs_revision') summary = `Adjustments required: Review venture choices and rationale.`;
    else if (status === 'in_progress') summary = `In progress: Complete remaining founder activities.`;

    return { stage, status, title, summary, checks, passedCount, totalCount };
  };

  const stages = {
    Overview: buildStage('Overview', 'Overview & Orientation', overviewChecks),
    Learn: buildStage('Learn', 'Startup Stories Analysis', learnChecks),
    Case: buildStage('Case', 'Venture Dilemma Selection', caseChecks),
    Work: buildStage('Work', 'Founder Lab & Launch Canvas', workChecks),
    Team: buildStage('Team', 'Startup Boardroom Simulation', teamChecks),
  };

  const totalChecks = overviewChecks.length + learnChecks.length + caseChecks.length + workChecks.length + teamChecks.length;
  const passedChecks = [
    ...overviewChecks,
    ...learnChecks,
    ...caseChecks,
    ...workChecks,
    ...teamChecks,
  ].filter((c) => c.passed).length;

  const hasAnyFailed = Object.values(stages).some((s) => s.status === 'needs_revision');
  const allStagesReviewed = Object.values(stages).every((s) => s.status === 'reviewed');

  let overallStatus: StageStatus = 'not_started';
  if (allStagesReviewed) overallStatus = 'reviewed';
  else if (hasAnyFailed) overallStatus = 'needs_revision';
  else if (passedChecks > 0) overallStatus = 'in_progress';

  // Actionable Revisit Recommendations
  const revisitRecommendations: string[] = [];
  if (hasSuboptimal) revisitRecommendations.push('Revisit Startup Stories: Avoid cash-burning subsidies or unbranded replicas that damage venture trust.');
  if (isBloat) revisitRecommendations.push('Refine MVP Scope: Eliminate premature feature bloat (50-dish menus / custom ERPs) in Decision C.');
  if (isPaidAdTrap) revisitRecommendations.push('Reconsider Customer Acquisition: Switch from expensive city-wide ads to direct campus grassroots tasting/demos.');
  if (isSilentDelay) revisitRecommendations.push('Crisis Protocol Failure: Replace silent delay with proactive customer communication and founder fulfilment.');
  if (!shieldConfirmed) revisitRecommendations.push('Confirm Baseline Diagnostic A guidelines in Overview.');

  return {
    sessionId: 1,
    overallStatus,
    overallSummary: overallStatus === 'reviewed'
      ? 'Startup Launch Canvas & Boardroom Crisis decision verified. Ready for classroom presentation.'
      : `${passedChecks} of ${totalChecks} founder checks verified. Complete remaining strategic choices.`,
    stages,
    totalChecks,
    passedChecks,
    hasErrors: hasAnyFailed,
    revisitRecommendations,
  };
}

// ============================================================================
// LEGACY EDITION 3.0: HISTORICAL CALCULATION EVALUATOR (BACKWARD COMPATIBLE)
// ============================================================================
function evaluateLegacyEdition30(ctx: ReviewContext): SessionReviewReport {
  const { draft, practiceLabData, workstationData } = ctx;
  const lab = practiceLabData || {};
  const ws = workstationData?.calcData || {};

  const profitInput = lab.calcProfit !== undefined ? String(lab.calcProfit).trim() :
    draft['work:1:0:0:2'] || (ws.revenue ? String(ws.revenue - ws.expenses) : '');
  const netCashInput = lab.calcNetCash !== undefined ? String(lab.calcNetCash).trim() :
    draft['work:1:0:1:2'] || (ws.cashReceived ? String(ws.cashReceived - ws.cashPaid) : '');
  const closingBankInput = lab.calcClosingBank !== undefined ? String(lab.calcClosingBank).trim() :
    draft['work:1:0:2:2'] || (ws.openingCash && ws.cashReceived ? String(ws.openingCash + (ws.cashReceived - ws.cashPaid)) : '');
  const availableInput = lab.calcAvailableAboveReserve !== undefined ? String(lab.calcAvailableAboveReserve).trim() :
    draft['work:1:0:3:2'] || '';
  const shortfallInput = lab.calcDepositShortfall !== undefined ? String(lab.calcDepositShortfall).trim() :
    draft['work:1:0:4:2'] || '';

  const decisionText = (lab.decisionRecommendation || draft['work-prompt:2'] || ws.paymentReserveReason || '').trim();
  const conceptExplain = (draft['concept:explain'] || '').trim();
  const workAnalysis = (draft['work:analysis'] || '').trim();
  const teamContribution = (lab.individualContribution || draft['team:contribution'] || '').trim();
  const teamJudgement = (draft['team:judgement'] || '').trim();

  const wordCount = (str: string) => str.split(/\s+/).filter(Boolean).length;

  const overviewChecks: ReviewCheckItem[] = [];
  const shieldConfirmed = workstationData?.shieldConfirmed === true || (draft['check:0'] === 'yes');
  overviewChecks.push({
    id: 's01-o1-shield',
    title: 'Controlled Assessment Boundary (Baseline A)',
    description: 'Acknowledge that Baseline A is an independent 60-minute diagnostic assessment conducted without AI or peer assistance.',
    passed: shieldConfirmed,
    status: shieldConfirmed ? 'passed' : 'pending',
    studentValue: shieldConfirmed ? 'Confirmed' : 'Pending acknowledgment',
    expectedRequirement: 'Review Baseline A guidelines and confirm independent completion conditions.',
    whyIncorrect: 'Baseline A establishes your authentic starting competency. Working independently ensures diagnostic accuracy.',
    conceptToRevisit: 'Stage 01 Overview · Class Schedule & Baseline A Guidelines',
    actionTab: 'Overview',
    actionLabel: 'Review Overview Instructions',
  });

  const hasDecision = wordCount(decisionText) >= 10;
  const decisionLower = decisionText.toLowerCase();
  const recognizesCannotPay =
    decisionLower.includes('cannot') ||
    decisionLower.includes('can not') ||
    decisionLower.includes('shortfall') ||
    decisionLower.includes('deficit') ||
    decisionLower.includes('unable') ||
    decisionLower.includes('risk') ||
    decisionLower.includes('delay') ||
    decisionLower.includes('reserve');
  const claimsCanAfford =
    (decisionLower.includes('can pay') || decisionLower.includes('safely pay') || decisionLower.includes('can afford')) &&
    !decisionLower.includes('cannot') && !decisionLower.includes('can not');

  overviewChecks.push({
    id: 's01-o2-dilemma',
    title: 'Preliminary Capital Commitment Decision',
    description: 'Determine whether Vayentra Labs can safely pay the INR 35,000 upfront infrastructure deposit in September.',
    passed: hasDecision && recognizesCannotPay && !claimsCanAfford,
    status: (hasDecision && recognizesCannotPay && !claimsCanAfford) ? 'passed' :
      claimsCanAfford ? 'failed' : hasDecision ? 'warning' : 'pending',
    studentValue: hasDecision ? decisionText.slice(0, 80) + '…' : 'No decision recorded',
    expectedRequirement: 'Conclude that the company cannot safely pay the INR 35,000 deposit because free cash above the INR 25,000 reserve is only INR 5,000 (INR 30,000 shortfall).',
    whyIncorrect: claimsCanAfford
      ? 'Trap: You concluded the company can pay based on recognised profit (₹80,000). But ₹70,000 of September sales remain uncollected in receivables. Writing a ₹35,000 cheque breaches the minimum reserve buffer and overdraws the bank account!'
      : 'You have not yet analyzed whether the ₹35,000 deposit causes a cash reserve breach.',
    conceptToRevisit: 'Stage 01 Overview · Complete Practice Lab Subsection 1 & 2',
    actionTab: 'Overview',
    actionLabel: 'Revisit Deposit Decision',
  });

  const learnChecks: ReviewCheckItem[] = [];
  const l1Words = wordCount(conceptExplain);
  const l1Passed = l1Words >= 20;
  const conceptLower = conceptExplain.toLowerCase();
  const claimsRevenueIsCash = (conceptLower.includes('revenue is cash') || conceptLower.includes('revenue equals cash')) && !conceptLower.includes('not');
  const claimsBankIsRevenue = conceptLower.includes('opening bank is revenue');

  learnChecks.push({
    id: 's01-l1-depth',
    title: 'Commercial Principle Explanation',
    description: 'Explain in your own words how revenue, profit, and cash flow differ in a commercial support enterprise.',
    passed: l1Passed && !claimsRevenueIsCash && !claimsBankIsRevenue,
    status: (l1Passed && !claimsRevenueIsCash && !claimsBankIsRevenue) ? 'passed' :
      (claimsRevenueIsCash || claimsBankIsRevenue) ? 'failed' :
      l1Words > 0 ? 'warning' : 'pending',
    studentValue: l1Words > 0 ? `${l1Words} words entered` : 'Empty',
    expectedRequirement: 'A substantive explanation of at least 20 words connecting earned revenue to cash banking.',
    whyIncorrect: claimsRevenueIsCash
      ? 'Commercial Trap: Revenue is earned upon service completion/invoicing, while cash is only realized upon physical bank clearance.'
      : claimsBankIsRevenue
      ? 'Commercial Trap: Opening bank balance is an asset carried forward from prior months, never current month earned revenue.'
      : 'Your explanation is too brief to demonstrate full conceptual clarity for corporate handover.',
    conceptToRevisit: 'Stage 02 Learn · Concept Briefing & Worked Example',
    actionTab: 'Learn',
    actionLabel: 'Draft Concept Explanation',
  });

  const caseChecks: ReviewCheckItem[] = [];
  const cleanAnalysis = workAnalysis.toLowerCase();
  const rawDigits = cleanAnalysis.replace(/[^0-9]/g, '');
  const mentionsLegacy = cleanAnalysis.includes('hul') || cleanAnalysis.includes('edition 2') || cleanAnalysis.includes('earlier case');
  const usedEdition2 = cleanAnalysis.includes('100000') || cleanAnalysis.includes('75000') || cleanAnalysis.includes('25000') || rawDigits.includes('600000') || rawDigits.includes('130000') || mentionsLegacy;
  const hasDrive3Data = cleanAnalysis.includes('140000') || cleanAnalysis.includes('80000') || cleanAnalysis.includes('60000') || cleanAnalysis.includes('30000');

  caseChecks.push({
    id: 's01-c1-edition',
    title: 'Drive Edition 3.0 Dataset Adherence',
    description: 'Confirm adherence to the approved Drive Edition 3.0 dataset (Revenue ₹1,40,000, Expenses ₹60,000) rather than obsolete Edition 2.0 figures.',
    passed: (hasDrive3Data || !usedEdition2) && (workAnalysis.length > 0 || profitInput.length > 0),
    status: usedEdition2 && !hasDrive3Data ? 'failed' :
      (hasDrive3Data || workAnalysis.length > 0) ? 'passed' : 'pending',
    studentValue: workAnalysis ? (hasDrive3Data ? 'Drive Edition 3.0 figures confirmed' : usedEdition2 ? 'Edition 2.0 figures detected' : 'Custom notes') : 'Not answered',
    expectedRequirement: 'Use Drive Edition 3.0 approved figures: Revenue = ₹1,40,000, Expenses = ₹60,000.',
    whyIncorrect: 'You appear to have referenced obsolete Drive Edition 2.0 or legacy HUL figures. Always verify against Drive Edition 3.0.',
    conceptToRevisit: 'Stage 03 Case · Approved Drive Edition 3 Case Brief',
    actionTab: 'Case',
    actionLabel: 'Check Case Figures',
  });

  const workChecks: ReviewCheckItem[] = [];
  const cleanNum = (val: string) => {
    const num = parseInt((val || '').replace(/[^0-9-]/g, ''), 10);
    return isNaN(num) ? null : num;
  };

  const parsedProfit = cleanNum(profitInput);
  const profitCorrect = parsedProfit === 80000 || parsedProfit === 25000;
  workChecks.push({
    id: 's01-w1-profit',
    title: 'Recognised Accrual Net Profit',
    description: 'Calculate recognised profit: Revenue (₹1,40,000) minus Expenses (₹60,000).',
    passed: profitCorrect,
    status: profitCorrect ? 'passed' : parsedProfit !== null ? 'failed' : 'pending',
    studentValue: parsedProfit !== null ? `₹${parsedProfit.toLocaleString()}` : 'Unanswered',
    expectedRequirement: 'Accrual Net Profit = ₹80,000 (Revenue ₹1,40,000 - Expenses ₹60,000).',
    whyIncorrect: parsedProfit !== null ? `You entered ₹${parsedProfit.toLocaleString()}. Profit = Earned Revenue (₹1,40,000) - Operating Expenses (₹60,000) = ₹80,000.` : 'Profit calculation is required.',
    conceptToRevisit: 'Stage 02 Learn · Profit Formula vs Cash Receipts',
    actionTab: 'Work',
    actionLabel: 'Recalculate Profit in Work',
  });

  const parsedNetCash = cleanNum(netCashInput);
  const netCashCorrect = parsedNetCash === 10000;
  workChecks.push({
    id: 's01-w2-netcash',
    title: 'Net Cash Movement',
    description: 'Calculate net cash movement: Cash Inflows (₹70,000) minus Cash Outflows (₹60,000).',
    passed: netCashCorrect,
    status: netCashCorrect ? 'passed' : parsedNetCash !== null ? 'failed' : 'pending',
    studentValue: parsedNetCash !== null ? `₹${parsedNetCash.toLocaleString()}` : 'Unanswered',
    expectedRequirement: 'Net Cash Movement = +₹10,000 (Inflows ₹70,000 - Outflows ₹60,000).',
    whyIncorrect: parsedNetCash !== null ? `You entered ₹${parsedNetCash.toLocaleString()}. Net Cash = Real Cash Received (₹70,000) - Real Cash Paid (₹60,000) = +₹10,000.` : 'Net cash calculation is required.',
    conceptToRevisit: 'Stage 02 Learn · Cash Movement Methodology',
    actionTab: 'Work',
    actionLabel: 'Recalculate Cash Movement in Work',
  });

  const parsedBank = cleanNum(closingBankInput);
  const bankCorrect = parsedBank === 30000;
  workChecks.push({
    id: 's01-w3-bank',
    title: 'Closing Bank Balance',
    description: 'Calculate closing bank: Opening Bank (₹20,000) plus Net Cash Movement (+₹10,000).',
    passed: bankCorrect,
    status: bankCorrect ? 'passed' : parsedBank !== null ? 'failed' : 'pending',
    studentValue: parsedBank !== null ? `₹${parsedBank.toLocaleString()}` : 'Unanswered',
    expectedRequirement: 'Closing Bank = ₹30,000 (Opening Bank ₹20,000 + Net Cash ₹10,000).',
    whyIncorrect: parsedBank !== null ? `You entered ₹${parsedBank.toLocaleString()}. Closing Bank = Opening Bank (₹20,000) + Net Cash (+₹10,000) = ₹30,000.` : 'Closing bank balance calculation is required.',
    conceptToRevisit: 'Stage 04 Work · Cash Reconciliation Schedule',
    actionTab: 'Work',
    actionLabel: 'Recalculate Bank Balance in Work',
  });

  const teamChecks: ReviewCheckItem[] = [];
  const teamWords = wordCount(teamContribution);
  const teamPassed = teamWords >= 15;
  teamChecks.push({
    id: 's01-t1-contribution',
    title: 'Attributable Squad Contribution',
    description: 'Record your specific role and evidence generated during squad review.',
    passed: teamPassed,
    status: teamPassed ? 'passed' : teamWords > 0 ? 'warning' : 'pending',
    studentValue: teamWords > 0 ? `${teamWords} words recorded` : 'Unanswered',
    expectedRequirement: 'A substantive contribution statement (at least 15 words) attributing your role.',
    whyIncorrect: 'Corporate readiness requires proving your individual contribution in a collaborative team.',
    conceptToRevisit: 'Stage 05 Team · Squad Roles & Handoff Simulation',
    actionTab: 'Team',
    actionLabel: 'Record Contribution in Team',
  });

  const buildStage = (stage: 'Overview' | 'Learn' | 'Case' | 'Work' | 'Team', title: string, checks: ReviewCheckItem[]): StageReviewResult => {
    const passedCount = checks.filter((c) => c.passed).length;
    const totalCount = checks.length;
    const hasFailed = checks.some((c) => c.status === 'failed');
    const allPassed = passedCount === totalCount;
    const hasSome = passedCount > 0 || checks.some((c) => c.status === 'warning');

    let status: StageStatus = 'not_started';
    if (allPassed) status = 'reviewed';
    else if (hasFailed) status = 'needs_revision';
    else if (hasSome) status = 'in_progress';

    return { stage, status, title, summary: `${passedCount} of ${totalCount} checks verified`, checks, passedCount, totalCount };
  };

  const stages = {
    Overview: buildStage('Overview', 'Overview & Orientation', overviewChecks),
    Learn: buildStage('Learn', 'Concept & Worked Example', learnChecks),
    Case: buildStage('Case', 'Business Case & Records', caseChecks),
    Work: buildStage('Work', 'Calculations & Workstation', workChecks),
    Team: buildStage('Team', 'Squad Handoffs & AI Policy', teamChecks),
  };

  const totalChecks = overviewChecks.length + learnChecks.length + caseChecks.length + workChecks.length + teamChecks.length;
  const passedChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks].filter((c) => c.passed).length;
  const hasErrors = Object.values(stages).some((s) => s.status === 'needs_revision');

  return {
    sessionId: 1,
    overallStatus: hasErrors ? 'needs_revision' : passedChecks === totalChecks ? 'reviewed' : passedChecks > 0 ? 'in_progress' : 'not_started',
    overallSummary: `${passedChecks} of ${totalChecks} learning checks verified.`,
    stages,
    totalChecks,
    passedChecks,
    hasErrors,
    revisitRecommendations: hasErrors ? ['Revisit recognised profit and cash movement calculations.'] : [],
  };
}
