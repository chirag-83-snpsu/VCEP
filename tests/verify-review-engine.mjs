import assert from 'node:assert';
import { runAutomaticReview } from '../lib/review-engine/engine.ts';

console.log('Running VCEP Automatic Learning Review System Test Suite...\n');

// ---------------------------------------------------------------------
// TEST 1: Session 01 — Ideal Accurate Attempt
// ---------------------------------------------------------------------
console.log('--- TEST 1: Session 01 Ideal Attempt (Accurate Calculations) ---');
const s01Ideal = runAutomaticReview({
  sessionId: 1,
  lesson: { id: 1, title: 'How a Business Works', controlledAssessment: true },
  draft: {
    'concept:explain': 'Revenue records earned services at the point of invoice delivery, whereas cash collections represent bank deposits. Incurred expenses must be matched against earned revenue, while liquidity depends strictly on cash timing and retaining a mandatory minimum reserve buffer.',
    'team:contribution': 'Calculated the INR 30,000 cash shortfall and audited the delivery sign-off handoff to ensure billing occurs promptly.',
    'team:judgement': 'I refused to approve the upfront deposit until credit collections from September invoices are confirmed in the bank statement.',
    'check:0': 'yes',
  },
  practiceLabData: {
    calcRevenue: '140000',
    calcExpenses: '60000',
    calcProfit: '80000',
    calcCashCollected: '70000',
    calcCashPaid: '60000',
    calcNetCash: '10000',
    calcOpeningBank: '20000',
    calcClosingBank: '30000',
    calcReserve: '25000',
    calcAvailableAboveReserve: '5000',
    calcDepositShortfall: '30000',
    decisionRecommendation: 'Vayentra Labs cannot safely pay the INR 35,000 infrastructure deposit in September. Available cash above the INR 25,000 reserve is only INR 5,000, leaving an immediate INR 30,000 shortfall despite INR 80,000 recognised profit.',
  },
  workstationData: {
    shieldConfirmed: true,
  },
});

assert.strictEqual(s01Ideal.sessionId, 1);
assert.strictEqual(s01Ideal.overallStatus, 'reviewed', `Expected 'reviewed', got '${s01Ideal.overallStatus}'`);
assert.strictEqual(s01Ideal.stages.Overview.status, 'reviewed');
assert.strictEqual(s01Ideal.stages.Learn.status, 'reviewed');
assert.strictEqual(s01Ideal.stages.Case.status, 'reviewed');
assert.strictEqual(s01Ideal.stages.Work.status, 'reviewed');
assert.strictEqual(s01Ideal.stages.Team.status, 'reviewed');
assert.strictEqual(s01Ideal.hasErrors, false);
console.log('✓ Session 01 legacy ideal attempt verified: All 5 stages marked Reviewed with 0 errors.');

// ---------------------------------------------------------------------
// TEST 1-B: Session 01 Edition 3.1 Startup Experience (Ideal Attempt)
// ---------------------------------------------------------------------
console.log('\n--- TEST 1-B: Session 01 Edition 3.1 Startup Experience (Ideal Attempt) ---');
const s01Startup = runAutomaticReview({
  sessionId: 1,
  lesson: { id: 1, title: 'Start a Business. Think Like a Founder.', controlledAssessment: true },
  draft: {
    'concept:explain': 'Real startups prioritize customer trust and unit-economic margin over vanity metrics. Zerodha proved bootstrapping with zero ad spend creates extreme cost leverage, while Meesho and Nykaa scaled through disciplined fulfillment and authentic curation.',
    'team:contribution': 'Led the operational crisis audit as Operations Lead, securing alternate bike logistics and preserving 100% on-time delivery.',
    'team:judgement': 'We will not silently delay 40 student breakfast orders; proactive transparency with backup cycle delivery preserves customer retention.',
    'check:0': 'yes',
  },
  workstationData: {
    shieldConfirmed: true,
  },
  startupLabData: {
    selectedCaseId: 'quickbite',
    decisions: {
      decisionA: 'qa1',
      decisionB: 'qb1',
      decisionC: 'qc1',
      decisionD: 'qd1',
      decisionE: 'qe1',
    },
    boardroom: {
      roleId: 'role-operations',
      crisisChoice: 'strat-a',
      crisisRationale: 'We immediately notify all 40 customers via WhatsApp at 8:00 PM, offering a 25% credit voucher and dispatching through alternate bike couriers before 8:30 AM.',
      pitchProblem: 'Hostel students waste 45 minutes daily eating unhygienic oily diner food.',
      pitchSolution: 'QuickBite delivers hot, home-style thalis in under 20 minutes for ₹89.',
    },
    storyDecisions: {
      zerodha: 'opt-transparency',
      nykaa: 'opt-authenticity',
      meesho: 'opt-unit-economics',
    },
  },
});

assert.strictEqual(s01Startup.sessionId, 1);
assert.strictEqual(s01Startup.overallStatus, 'reviewed', `Expected 'reviewed', got '${s01Startup.overallStatus}'`);
assert.strictEqual(s01Startup.stages.Overview.status, 'reviewed');
assert.strictEqual(s01Startup.stages.Learn.status, 'reviewed');
assert.strictEqual(s01Startup.stages.Case.status, 'reviewed');
assert.strictEqual(s01Startup.stages.Work.status, 'reviewed');
assert.strictEqual(s01Startup.stages.Team.status, 'reviewed');
assert.strictEqual(s01Startup.hasErrors, false);
console.log('✓ Session 01 Edition 3.1 Startup Experience verified: 5 founder stages Reviewed with 0 errors.');

// ---------------------------------------------------------------------
// TEST 1-C: Session 01 Edition 3.1 Traps & Misconceptions
// ---------------------------------------------------------------------
console.log('\n--- TEST 1-C: Session 01 Edition 3.1 Traps & Misconceptions ---');
const s01StartupTraps = runAutomaticReview({
  sessionId: 1,
  lesson: { id: 1, title: 'Start a Business. Think Like a Founder.', controlledAssessment: true },
  draft: {
    'concept:explain': 'Just burn cash.',
  },
  workstationData: {
    shieldConfirmed: true,
  },
  startupLabData: {
    selectedCaseId: 'quickbite',
    decisions: {
      decisionA: 'qa1',
      decisionB: 'qb1',
      decisionC: 'qc2', // Feature bloat trap
      decisionD: 'qd2', // High cash burn paid ad trap
      decisionE: 'qe3', // Customer blame trap
    },
    boardroom: {
      roleId: 'role-operations',
      crisisChoice: 'strat-c', // Silent delay fatal trust breach
      crisisRationale: 'Just delay silently and hope nobody notices until tomorrow noon.',
    },
    storyDecisions: {
      zerodha: 'opt-free', // cash burning
      nykaa: 'opt-deep-discount', // cash burning
      meesho: 'opt-unlimited-free-ship', // unsustainable
    },
  },
});

assert.strictEqual(s01StartupTraps.overallStatus, 'needs_revision');
assert.strictEqual(s01StartupTraps.stages.Learn.status, 'needs_revision');
assert.strictEqual(s01StartupTraps.stages.Work.status, 'needs_revision');
assert.strictEqual(s01StartupTraps.stages.Team.status, 'needs_revision');
assert(s01StartupTraps.stages.Work.checks.some(c => c.id === 's01-w2-mvp' && c.status === 'failed'));
assert(s01StartupTraps.stages.Work.checks.some(c => c.id === 's01-w3-acquisition' && c.status === 'failed'));
assert(s01StartupTraps.stages.Work.checks.some(c => c.id === 's01-w4-delivery' && c.status === 'failed'));
assert(s01StartupTraps.stages.Team.checks.some(c => c.id === 's01-t2-crisis' && c.status === 'failed'));
console.log('✓ Session 01 Edition 3.1 Traps correctly diagnosed: Feature bloat, paid ad burn, and silent delay flagged.');

// ---------------------------------------------------------------------
// TEST 2: Session 01 — Misconceptions & Calculation Errors
// ---------------------------------------------------------------------
console.log('\n--- TEST 2: Session 01 Misconceptions & Calculation Errors ---');
const s01Errors = runAutomaticReview({
  sessionId: 1,
  lesson: { id: 1, title: 'How a Business Works' },
  draft: {
    'concept:explain': 'Revenue is cash and can be spent immediately on bills.', // misconception
    'work:analysis': 'Earlier case had 6,00,000 sales and 1,30,000 profit for HUL distributor.', // Edition 2 figures
  },
  practiceLabData: {
    calcProfit: '140000', // Forgot expenses
    calcNetCash: '80000', // Entered profit as cash
    calcClosingBank: '10000', // Didn't add opening
    calcAvailableAboveReserve: '30000', // Ignored reserve
    calcDepositShortfall: '0', // Claimed no shortfall
    decisionRecommendation: 'We can safely pay the deposit because profit is huge.', // Can pay claim
  },
});

assert.strictEqual(s01Errors.overallStatus, 'needs_revision');
assert.strictEqual(s01Errors.stages.Overview.status, 'needs_revision');
assert.strictEqual(s01Errors.stages.Learn.status, 'needs_revision');
assert.strictEqual(s01Errors.stages.Case.status, 'needs_revision');
assert.strictEqual(s01Errors.stages.Work.status, 'needs_revision');
assert(s01Errors.stages.Work.checks.some(c => c.id === 's01-w1-profit' && c.status === 'failed'));
assert(s01Errors.stages.Work.checks.some(c => c.id === 's01-w2-netcash' && c.status === 'failed'));
assert(s01Errors.stages.Case.checks.some(c => c.id === 's01-c1-edition' && c.status === 'failed'));
assert(s01Errors.stages.Overview.checks.some(c => c.id === 's01-o2-dilemma' && c.status === 'failed'));
console.log('✓ Session 01 error detection verified: Profit, net cash, reserve breach, and Edition 2.0 traps correctly diagnosed.');

// ---------------------------------------------------------------------
// TEST 3: Session 02 — Teamwork & Governance Escalation
// ---------------------------------------------------------------------
console.log('\n--- TEST 3: Session 02 Teamwork & Escalation Governance ---');
const s02Good = runAutomaticReview({
  sessionId: 2,
  lesson: { id: 2, title: 'Professional Identity and Teamwork' },
  draft: {
    'concept:explain': 'Accountability means exactly one individual owns the acceptance criteria for a deliverable. A reviewer provides cross-footing quality assurance, but oversight never dilutes primary delivery accountability.',
    'team:contribution': 'I drafted the laptop rotation schedule and verified commute travel time buffers for team members.',
    'team:judgement': 'I will not submit unreviewed models even if a deadline is imminent.',
  },
  workstationData: {
    introText: 'I am a commerce specialist focused on reconciliations and MIS reporting, capable of managing accounts receivable schedules and identifying cash collection variances for enterprise support clients.',
    members: [
      { id: 'm1', name: 'Student 1', role: 'Team Lead' },
      { id: 'm2', name: 'Student 2', role: 'Data Modeler' },
      { id: 'm3', name: 'Student 3', role: 'Backup' },
      { id: 'm4', name: 'Student 4', role: 'Reviewer' },
    ],
    selectedOptionId: 'opt-backup',
    justification: 'At 16:30, with Reviewer delayed in transit, we activate designated Backup per Charter Clause 4 with email notification to Trainer.',
  },
});

assert.strictEqual(s02Good.sessionId, 2);
assert.strictEqual(s02Good.overallStatus, 'reviewed');
assert.strictEqual(s02Good.stages.Work.checks.find(c => c.id === 's02-w3-escalation')?.passed, true);
console.log('✓ Session 02 compliant escalation (Option A: Backup) verified.');

// Test Session 02 Non-compliant escalation (Option B: Skip review)
const s02Skip = runAutomaticReview({
  sessionId: 2,
  lesson: { id: 2, title: 'Professional Identity and Teamwork' },
  draft: {},
  workstationData: {
    selectedOptionId: 'opt-skip',
  },
});
assert.strictEqual(s02Skip.stages.Work.status, 'needs_revision');
const skipCheck = s02Skip.stages.Work.checks.find(c => c.id === 's02-w3-escalation');
assert.strictEqual(skipCheck?.status, 'failed');
assert(skipCheck?.whyIncorrect?.includes('Skipping review'));
console.log('✓ Session 02 non-compliant escalation (Skip Review) properly flagged as governance failure.');

// ---------------------------------------------------------------------
// TEST 4: Session 07 — Excel Data Cleaning & Reconciliation
// ---------------------------------------------------------------------
console.log('\n--- TEST 4: Session 07 Excel Cleaning & Reconciliation Proof ---');
const s07Clean = runAutomaticReview({
  sessionId: 7,
  lesson: { id: 7, title: 'Excel and Data Cleaning' },
  draft: {
    'concept:explain': 'Raw records must be preserved without in-place deletion. Suspect rows must be isolated into a quarantine suspense register to maintain zero reconciliation variance with raw banking inflows.',
    'team:contribution': 'Audited formula logic for =SUMIFS and confirmed date standard convention for October receipts without errors.',
    'team:judgement': 'I refused to replace the blank amount in R05 with zero to avoid masking an unpaid invoice.',
  },
  workstationData: {
    cleanRows: [
      { id: 'c1', customerStandard: 'Asha', amount: 12000 },
      { id: 'c2', customerStandard: 'Beacon', amount: 8000 },
      { id: 'c3', customerStandard: 'Asha', amount: 5000 },
    ],
    exceptions: [
      { id: 'e1', sourceId: 'R02', rawAmount: 8000, category: 'Duplicate' },
      { id: 'e2', sourceId: 'R04', rawAmount: 7000, category: 'Invalid Date' },
      { id: 'e3', sourceId: 'R05', rawAmount: 0, category: 'Missing Value' },
      { id: 'e4', sourceId: 'R06', rawAmount: 4000, category: 'Ambiguous Date' },
    ],
    formulaNotes: '=SUMIFS(Clean[Amount],Clean[Customer],"Asha") = 17000',
  },
});

assert.strictEqual(s07Clean.sessionId, 7);
assert.strictEqual(s07Clean.overallStatus, 'reviewed');
assert.strictEqual(s07Clean.stages.Work.checks.find(c => c.id === 's07-w3-reconciliation-proof')?.passed, true);
assert.strictEqual(s07Clean.stages.Work.checks.find(c => c.id === 's07-w4-sumifs')?.passed, true);
console.log('✓ Session 07 Excel cleaning & zero-variance proof ($44k = $25k + $19k) verified.');

// ---------------------------------------------------------------------
// TEST 4-B: Session 08 — Bank Reconciliation & Zero-Variance Proof
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-B: Session 08 Bank Reconciliation & Zero-Variance Proof ---');
const s08BRS = runAutomaticReview({
  sessionId: 8,
  lesson: { id: 8, title: 'Bank Reconciliation' },
  draft: {
    'concept:explain': 'Permanent bank-only charges and interest must be adjusted in the cash book with journal entries. Temporary timing differences like unpresented cheques remain on the BRS schedule only and clear naturally.',
    'team:contribution': 'Explained to peer why unpresented cheques must not be posted twice to the general ledger, preventing false duplicate entries.',
    'team:judgement': 'I refused to insert an unexplained plug balance to force the reconciliation to agree.',
  },
  workstationData: {
    unadjustedBook: 87500,
    bankCharges: 500,
    interestEarned: 200,
    unpresentedCheque: 6000,
    depositInTransit: 10000,
    actualStatement: 83200,
    exceptionLog: [
      { id: 'e1', item: 'Deposit in Transit', amount: 10000 },
      { id: 'e2', item: 'Unpresented Cheque', amount: 6000 },
    ],
  },
});

assert.strictEqual(s08BRS.sessionId, 8);
assert.strictEqual(s08BRS.overallStatus, 'reviewed');
assert.strictEqual(s08BRS.stages.Work.checks.find(c => c.id === 's08-w1-adjusted-cashbook')?.passed, true);
assert.strictEqual(s08BRS.stages.Work.checks.find(c => c.id === 's08-w2-statement-bridge')?.passed, true);
assert.strictEqual(s08BRS.stages.Work.checks.find(c => c.id === 's08-w3-zero-variance')?.passed, true);
console.log('✓ Session 08 BRS zero-variance bridge (₹87.2k + ₹6k - ₹10k = ₹83.2k) verified.');

// ---------------------------------------------------------------------
// TEST 5: Generic Sessions (e.g. Session 11 GST, Session 22 Exit B)
// ---------------------------------------------------------------------
console.log('\n--- TEST 5: Generic Sessions & Controlled Assessment Guards ---');
const s22Exit = runAutomaticReview({
  sessionId: 22,
  lesson: {
    id: 22,
    title: 'Hiring Simulation and Exit Assessment',
    controlledAssessment: true,
    workPrompts: ['Exit B assessment file', 'Target role profile', 'Development plan'],
  },
  draft: {
    'concept:explain': 'Controlled exit assessment requires strict adherence to diagnostic conditions without unauthorized assistance. This ensures our skills reflect genuine workplace readiness and autonomous technical capability across financial modeling and corporate systems.',
    'work-prompt:0': 'Completed Exit B assessment workbook under faculty supervision following strict timed conditions without external assistance.',
    'work-prompt:1': 'Target role: Junior Financial Analyst at an enterprise services company handling MIS reporting and cash flow reconciliations.',
    'work-prompt:2': '90-day professional development plan focused on advanced financial modeling, GST reconciliations, and ERP ledger systems.',
    'team:contribution': 'Conducted structured mock interview simulations with partner, providing feedback on technical clarity, executive tone, and answer timing.',
    'team:judgement': 'Self-assessed competencies with evidence-backed portfolio references and realistic appraisals of areas requiring further practice.',
    'check:0': 'yes',
  },
});

assert.strictEqual(s22Exit.sessionId, 22);
assert.strictEqual(s22Exit.overallStatus, 'reviewed');
assert.strictEqual(s22Exit.stages.Work.checks.length, 4); // 3 prompts + analysis
console.log('✓ Generic session review engine & controlled assessment conditions verified.');

console.log('\n======================================================');
console.log('ALL REVIEW ENGINE UNIT & FORMULA TESTS PASSED CLEANLY!');
console.log('======================================================');
