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
// TEST 3-C: Session 03 — Workplace Communication Portfolio
// ---------------------------------------------------------------------
console.log('\n--- TEST 3-C: Session 03 Workplace Communication Portfolio ---');
const s03Compliant = runAutomaticReview({
  sessionId: 3,
  lesson: { id: 3, title: 'Workplace Communication' },
  draft: {
    'concept:explain': 'High invoiced sales revenue does not equal cash collection reliability. Granting credit limits without verifying payment dates creates severe bad debt risk for our enterprise.',
    'work-prompt:0': 'Dear Operations Manager,\n\nRegarding your request for the "best customers" report for today\'s 16:00 credit-limit review: our current working file contains total billed invoices, but customer payment and collection dates are missing.\n\nBasing credit-limit increases strictly on sales volume introduces bad debt risk if high-volume clients pay late. If Accounts provides collection logs by 12:30, I will deliver the ranked assessment by 14:00. Otherwise, I will rank by invoiced revenue with an explicit unverified payment caveat.\n\nPlease confirm your preferred approach by 12:00.\n\nRegards,\nCommercial Analyst',
    'work-prompt:1': 'Invoiced sales rankings are complete for all five key accounts. Awaiting the collection ledger from Accounts to verify payment speed. I will audit incoming records and send our next milestone update at 14:00.',
    'work-prompt:2': 'Accounts confirmed customer payment ledgers remain locked for audit. Granting credit increases without payment history risks severe default. I have prepared the report ranked by billed sales, explicitly flagging unverified credit risk. I will deliver this draft by 14:30 and provide a final update at 15:15 ahead of the 16:00 decision.',
    'team:contribution': 'Drafted the 120-word clarification email and 14:00 escalation message, establishing an objective fallback ranking with explicit payment disclaimers.',
    'team:judgement': 'I refused to rank customer creditworthiness using gross billed sales alone without verified bank collection dates.',
  },
  workstationData: {
    clarificationEmail: {
      recipient: 'Operations Manager <ops.manager@company.internal>',
      subject: 'Clarification: Criteria & Data for Best Customers Report',
      body: 'Dear Operations Manager,\n\nRegarding your request for the "best customers" report for today\'s 16:00 credit-limit review: our current working file contains total billed invoices, but customer payment and collection dates are missing.\n\nBasing credit-limit increases strictly on sales volume introduces bad debt risk if high-volume clients pay late. If Accounts provides collection logs by 12:30, I will deliver the ranked assessment by 14:00. Otherwise, I will rank by invoiced revenue with an explicit unverified payment caveat.\n\nPlease confirm your preferred approach by 12:00.\n\nRegards,\nCommercial Analyst',
    },
    progressUpdate: {
      recipient: 'Operations Manager <ops.manager@company.internal>',
      subject: 'Update: Best Customers Report Progress',
      body: 'Invoiced sales rankings are complete for all five key accounts. Awaiting the collection ledger from Accounts to verify payment speed. I will audit incoming records and send our next milestone update at 14:00.',
    },
    escalationMessage: {
      recipient: 'Operations Manager <ops.manager@company.internal>',
      subject: 'Escalation: Unavailability of Customer Payment Data',
      body: 'Accounts confirmed customer payment ledgers remain locked for audit. Granting credit increases without payment history risks severe default. I have prepared the report ranked by billed sales, explicitly flagging unverified credit risk. I will deliver this draft by 14:30 and provide a final update at 15:15 ahead of the 16:00 decision.',
    },
    diagnostic: {
      missingDataExplanation: 'Missing collection records, payment dates, days sales outstanding, and dispute logs from Accounts.',
      creditRiskExplanation: 'High invoiced sales revenue does not equal cash collection reliability. Granting credit limits without verifying payment dates creates severe bad debt risk for our enterprise.',
    },
    governance: {
      contributionSummary: 'Drafted the 120-word clarification email and 14:00 escalation message, establishing an objective fallback ranking with explicit payment disclaimers.',
      peerCorrection: 'Peer reviewer caught that I had omitted the 16:00 decision meeting context in the opening paragraph.',
      professionalBoundary: 'I refused to rank customer creditworthiness using gross billed sales alone without verified bank collection dates.',
    },
  },
});

assert.strictEqual(s03Compliant.sessionId, 3);
assert.strictEqual(s03Compliant.overallStatus, 'reviewed', `Expected 'reviewed', got '${s03Compliant.overallStatus}'`);
assert.strictEqual(s03Compliant.stages.Work.checks.find(c => c.id === 's03-w1-clarify')?.passed, true);
assert.strictEqual(s03Compliant.stages.Work.checks.find(c => c.id === 's03-w2-progress')?.passed, true);
assert.strictEqual(s03Compliant.stages.Work.checks.find(c => c.id === 's03-w3-escalation')?.passed, true);
assert.strictEqual(s03Compliant.stages.Work.checks.find(c => c.id === 's03-w4-tone')?.passed, true);
assert.strictEqual(s03Compliant.hasErrors, false);
console.log('✓ Session 03 compliant portfolio verified: All word limits, tone checks, and deadlines passed.');

// Test 3-C Non-compliant: Exceeding word limit & speculative language
const s03Excess = runAutomaticReview({
  sessionId: 3,
  lesson: { id: 3, title: 'Workplace Communication' },
  draft: {
    'concept:explain': 'Revenue and collections are different.',
    'work-prompt:0': 'Dear manager, I am writing this very long email that goes on and on with unnecessary words and speculative fluff. Hopefully we will find the data somewhere maybe in accounts or somewhere else. We might be able to guess who the best customers are because they buy a lot from us and probably pay on time so let us just assume they are good. I am so sorry for the delay and apologies for this confusion. We will see what happens later this afternoon. Let us hope for the best and fingers crossed that accounts gives us the report soon. Extra words to ensure we exceed the one hundred and twenty word limit comfortably. Adding more filler text to push the count way over the limit so that the corporate brevity check fails as expected in our automated test suite. Thank you.',
    'work-prompt:1': 'This progress update is deliberately written to exceed forty words so that the system catches the violation and triggers an executive brevity error in the review report to verify our boundary conditions, adding extra unnecessary details about various customer accounts and lengthy operational background stories.',
    'work-prompt:2': 'Short escalation.',
  },
  workstationData: {
    clarificationEmail: {
      recipient: 'ops.manager@company.internal',
      subject: '',
      body: 'Dear manager, I am writing this very long email that goes on and on with unnecessary words and speculative fluff. Hopefully we will find the data somewhere maybe in accounts or somewhere else. We might be able to guess who the best customers are because they buy a lot from us and probably pay on time so let us just assume they are good. I am so sorry for the delay and apologies for this confusion. We will see what happens later this afternoon. Let us hope for the best and fingers crossed that accounts gives us the report soon. Extra words to ensure we exceed the one hundred and twenty word limit comfortably. Adding more filler text to push the count way over the limit so that the corporate brevity check fails as expected in our automated test suite. Thank you.',
    },
    progressUpdate: {
      recipient: 'ops.manager@company.internal',
      subject: '',
      body: 'This progress update is deliberately written to exceed forty words so that the system catches the violation and triggers an executive brevity error in the review report to verify our boundary conditions, adding extra unnecessary details about various customer accounts and lengthy operational background stories.',
    },
    escalationMessage: {
      recipient: 'ops.manager@company.internal',
      subject: '',
      body: 'Short escalation.',
    },
  },
});

assert.strictEqual(s03Excess.hasErrors, true, 'Expected errors for exceeding word budgets');
assert.strictEqual(s03Excess.stages.Work.checks.find(c => c.id === 's03-w1-clarify')?.passed, false);
assert.strictEqual(s03Excess.stages.Work.checks.find(c => c.id === 's03-w2-progress')?.passed, false);
assert.strictEqual(s03Excess.stages.Work.checks.find(c => c.id === 's03-w4-tone')?.passed, false);
console.log('✓ Session 03 non-compliant attempt correctly flagged errors for word limits and speculative tone.');

// ---------------------------------------------------------------------
// TEST 3-D: Session 04 — Meetings and Reporting Governance
// ---------------------------------------------------------------------
console.log('\n--- TEST 3-D: Session 04 Meetings and Reporting Governance ---');
const s04Compliant = runAutomaticReview({
  sessionId: 4,
  lesson: { id: 4, title: 'Meetings and Reporting' },
  draft: {
    'concept:explain': 'Meeting minutes record binding decisions and unresolved risks rather than verbatim transcripts. Options are not approved until formally authorized by the budget owner. Operations Lead limit is ₹2,000, requiring General Manager sign-off at 15:00 for the ₹4,000 substitute fee.',
    'work-prompt:0': '00-02m: Context & 17:00 Delivery\n02-06m: Option Evaluation (Delay vs ₹4,000 Substitute)\n06-09m: Decision Authority (₹2,000 limit vs GM approval)\n09-12m: Action Allocation & RACI Deadlines',
    'work-prompt:1': 'Priya Nair: Hold substitute inventory by 14:30\nRohan Sharma: Present ₹4,000 variance to GM at 15:00\nKarthik Rao: Update client on dispatch by 15:30',
    'work-prompt:2': 'DONE: Conducted 12-minute review on supplier delay and pre-aligned PO.\nNEXT: Operations Lead presenting ₹4,000 variance to GM at 15:00.\nBLOCKER: Awaiting GM approval because ₹4,000 exceeds ₹2,000 lead limit.',
    'team:contribution': 'Acted as Minute-Taker, documented the 4-item agenda, and enforced the ₹2,000 Operations Lead ceiling to protect governance.',
    'team:judgement': 'I refused to guarantee 17:00 client delivery before the General Manager approves the ₹4,000 budget variance at 15:00.',
  },
  workstationData: {
    agenda: [
      { id: 'ag-1', timebox: '00–02 min', title: 'Context & Delivery Cutoff', objective: 'Review 17:00 client delivery commitment and delay', leadRole: 'Operations Lead' },
      { id: 'ag-2', timebox: '02–06 min', title: 'Option Evaluation', objective: 'Compare delay vs ₹4,000 substitute', leadRole: 'Procurement Lead' },
      { id: 'ag-3', timebox: '06–09 min', title: 'Decision Authority', objective: 'Acknowledge ₹2,000 limit and prep 15:00 GM sign-off', leadRole: 'Minute-Taker' },
      { id: 'ag-4', timebox: '09–12 min', title: 'Action Allocation', objective: 'Assign single owners and deadlines', leadRole: 'All Squad Members' },
    ],
    deliveryOptions: [
      { id: 'opt-delay', title: 'Option A: Primary Supplier Delay', costINR: 0, status: 'REJECTED' },
      { id: 'opt-substitute', title: 'Option B: Substitute Vendor', costINR: 4000, status: 'PENDING_APPROVAL', approvalRequiredBy: 'General Manager (at 15:00)' },
    ],
    actions: [
      { id: 'act-1', task: 'Hold substitute stock', owner: 'Priya Nair', deadline: '14:30 Today', blocker: 'Vendor quote', evidence: 'Stock hold email', status: 'Complete' },
      { id: 'act-2', task: 'Request emergency ₹4,000 PO approval from GM', owner: 'Rohan Sharma', deadline: '15:00 Today', blocker: 'Exceeds ₹2,000 lead limit', evidence: 'Signed PO #809', status: 'In Progress' },
      { id: 'act-3', task: 'Inform client of dispatch timeline', owner: 'Karthik Rao', deadline: '15:30 Today', blocker: 'Cannot promise until GM signs off at 15:00', evidence: 'Client email', status: 'Open' },
    ],
    dnbState: {
      done: 'Conducted 12-minute squad review on supplier delay. Evaluated ₹4,000 substitute cost versus contractual breach; pre-aligned emergency PO documentation for 15:00 GM review.',
      next: 'Procurement confirming substitute stock hold by 14:30; Operations Lead presenting ₹4,000 variance to General Manager at 15:00 sharp.',
      blocker: 'Awaiting General Manager sign-off at 15:00 because the ₹4,000 rush fee exceeds the Operations Lead’s ₹2,000 discretionary limit.',
    },
    governance: {
      contributionSummary: 'Acted as Minute-Taker, documented the 4-item agenda, and enforced the ₹2,000 Operations Lead ceiling to protect governance.',
      peerCorrection: 'Peer reviewer flagged that I had not specified an exact 15:00 clock deadline for the General Manager approval task.',
      professionalBoundary: 'I refused to guarantee 17:00 client delivery before the General Manager approves the ₹4,000 budget variance at 15:00.',
    },
  },
});

assert.strictEqual(s04Compliant.sessionId, 4);
assert.strictEqual(s04Compliant.overallStatus, 'reviewed', `Expected 'reviewed', got '${s04Compliant.overallStatus}'`);
assert.strictEqual(s04Compliant.stages.Work.checks.find(c => c.id === 's04-w1-agenda')?.passed, true);
assert.strictEqual(s04Compliant.stages.Work.checks.find(c => c.id === 's04-w2-decision-board')?.passed, true);
assert.strictEqual(s04Compliant.stages.Work.checks.find(c => c.id === 's04-w3-action-tracker')?.passed, true);
assert.strictEqual(s04Compliant.stages.Work.checks.find(c => c.id === 's04-w4-dnb')?.passed, true);
assert.strictEqual(s04Compliant.hasErrors, false);
console.log('✓ Session 04 compliant attempt verified: Agenda, authority limits, RACI actions, and DNB flash passed.');

// Test 3-D Non-compliant: Unauthorized expenditure approval (> ₹2,000 without GM) & missing owners
const s04Unauthorized = runAutomaticReview({
  sessionId: 4,
  lesson: { id: 4, title: 'Meetings and Reporting' },
  draft: {
    'concept:explain': 'Meetings are good for discussions.',
    'work-prompt:0': 'Agenda',
    'work-prompt:1': 'Actions',
    'work-prompt:2': 'DNB',
  },
  workstationData: {
    agenda: [],
    deliveryOptions: [
      { id: 'opt-substitute', title: 'Option B: Substitute Vendor', costINR: 4000, status: 'AUTHORISED', approvalRequiredBy: 'Operations Lead (Exceeds limit!)' },
    ],
    actions: [],
    dnbState: { done: '', next: '', blocker: '' },
  },
});

assert.strictEqual(s04Unauthorized.hasErrors, true, 'Expected errors for unauthorized approval and missing actions');
assert.strictEqual(s04Unauthorized.stages.Work.checks.find(c => c.id === 's04-w1-agenda')?.passed, false);
assert.strictEqual(s04Unauthorized.stages.Work.checks.find(c => c.id === 's04-w2-decision-board')?.passed, false);
assert.strictEqual(s04Unauthorized.stages.Work.checks.find(c => c.id === 's04-w3-action-tracker')?.passed, false);
assert.strictEqual(s04Unauthorized.stages.Work.checks.find(c => c.id === 's04-w4-dnb')?.passed, false);
console.log('✓ Session 04 non-compliant attempt correctly flagged errors for unauthorized expenditure and missing RACI actions.');

// ---------------------------------------------------------------------
// TEST 3-E: Session 05 — Accounting Transactions (Case A September Release)
// ---------------------------------------------------------------------
console.log('\n--- TEST 3-E: Session 05 Accounting Transactions (Case A) ---');
const s05Compliant = runAutomaticReview({
  sessionId: 5,
  lesson: { id: 5, title: 'Accounting Transactions' },
  draft: {
    'concept:explain': 'Double-entry accounting requires every debit to be balanced with an equal credit. In Case A, indirect tax and depreciation are intentionally excluded. A09 customer advance is classified as Unearned Revenue (Liability) because service performance occurs in October. A12 test equipment is capitalized as an Asset rather than expensed. A05 collection settles existing Accounts Receivable without double-counting revenue.',
    'team:contribution': 'Verified all 12 Case A commercial source vouchers, confirmed opening equity identity (₹100,000 Bank = Capital), and validated cross-foot journal equality at ₹208,500.',
    'team:judgement': 'I refused to treat the customer cash advance in A09 as revenue and resisted expensing the capital equipment in A12.',
  },
  workstationData: {
    rows: [
      { id: '1', docId: 'A01', debitAccount: 'Accounts Receivable', creditAccount: 'Service Revenue', amount: 60000 },
      { id: '2', docId: 'A02', debitAccount: 'Bank', creditAccount: 'Service Revenue', amount: 40000 },
      { id: '3', docId: 'A03', debitAccount: 'Rent Expense', creditAccount: 'Bank', amount: 12000 },
      { id: '4', docId: 'A04', debitAccount: 'Software Subscription Expense', creditAccount: 'Bank', amount: 6000 },
      { id: '5', docId: 'A05', debitAccount: 'Bank', creditAccount: 'Accounts Receivable', amount: 35000 },
      { id: '6', docId: 'A06', debitAccount: 'Contractor Expense', creditAccount: 'Bank', amount: 18000 },
      { id: '7', docId: 'A07', debitAccount: 'Wages Expense', creditAccount: 'Wages Payable', amount: 10000 },
      { id: '8', docId: 'A08', debitAccount: 'Wages Payable', creditAccount: 'Bank', amount: 4000 },
      { id: '9', docId: 'A09', debitAccount: 'Bank', creditAccount: 'Unearned Revenue (Liability)', amount: 15000 },
      { id: '10', docId: 'A10', debitAccount: 'Unearned Revenue (Liability)', creditAccount: 'Bank', amount: 3000 },
      { id: '11', docId: 'A11', debitAccount: 'Bank Charges Expense', creditAccount: 'Bank', amount: 500 },
      { id: '12', docId: 'A12', debitAccount: 'Equipment Asset (Capitalized)', creditAccount: 'Bank', amount: 5000 },
    ],
    exceptionsNotes: 'A09 is classified as Unearned Revenue liability because service delivery has not occurred in September. A12 is capitalized as an Asset per accrual rules. A05 settles Accounts Receivable.',
    governance: {
      studentId: 'STU-2026-ACC',
      fileVersion: 'StudentID_S05_v01',
      contributionSummary: 'Verified all 12 Case A commercial source vouchers, confirmed opening equity identity (₹100,000 Bank = Capital), and validated cross-foot journal equality at ₹208,500.',
      peerCorrection: 'Colleague caught that A09 had initially been keyed to Service Revenue, which I corrected to Unearned Revenue liability.',
      professionalBoundary: 'I refused to treat the customer cash advance in A09 as revenue and resisted expensing the capital equipment in A12.',
    },
  },
});

assert.strictEqual(s05Compliant.sessionId, 5);
assert.strictEqual(s05Compliant.overallStatus, 'reviewed', `Expected 'reviewed', got '${s05Compliant.overallStatus}'`);
assert.strictEqual(s05Compliant.stages.Work.checks.find(c => c.id === 's05-w1-register')?.passed, true);
assert.strictEqual(s05Compliant.stages.Work.checks.find(c => c.id === 's05-w2-balance')?.passed, true);
assert.strictEqual(s05Compliant.stages.Work.checks.find(c => c.id === 's05-w3-advance-logic')?.passed, true);
assert.strictEqual(s05Compliant.stages.Work.checks.find(c => c.id === 's05-w4-receivable-logic')?.passed, true);
assert.strictEqual(s05Compliant.stages.Work.checks.find(c => c.id === 's05-w5-equipment-logic')?.passed, true);
assert.strictEqual(s05Compliant.hasErrors, false);
console.log('✓ Session 05 compliant attempt verified: 12 events, double-entry cross-foot balance (₹208,500), and accrual timing passed.');

// Test 3-E Non-compliant: A09 credited to revenue & out-of-balance entries
const s05Violations = runAutomaticReview({
  sessionId: 5,
  lesson: { id: 5, title: 'Accounting Transactions' },
  draft: {
    'concept:explain': 'Debit left, credit right.',
    'team:contribution': 'Just filled rows.',
    'team:judgement': 'No boundary.',
  },
  workstationData: {
    rows: [
      { id: '1', docId: 'A01', debitAccount: 'Accounts Receivable', creditAccount: 'Service Revenue', amount: 60000 },
      // A09 incorrectly booked to Service Revenue
      { id: '9', docId: 'A09', debitAccount: 'Bank', creditAccount: 'Service Revenue', amount: 15000 },
      // A12 incorrectly expensed
      { id: '12', docId: 'A12', debitAccount: 'Office Equipment Expense', creditAccount: 'Bank', amount: 5000 },
    ],
    governance: {
      studentId: '',
      fileVersion: 'Draft_Accounting',
    },
  },
});

assert.strictEqual(s05Violations.hasErrors, true, 'Expected errors for incomplete rows, incorrect revenue recognition, and expensed asset');
assert.strictEqual(s05Violations.stages.Work.checks.find(c => c.id === 's05-w1-register')?.passed, false);
assert.strictEqual(s05Violations.stages.Work.checks.find(c => c.id === 's05-w2-balance')?.passed, false);
assert.strictEqual(s05Violations.stages.Work.checks.find(c => c.id === 's05-w3-advance-logic')?.passed, false);
assert.strictEqual(s05Violations.stages.Work.checks.find(c => c.id === 's05-w5-equipment-logic')?.passed, false);
console.log('✓ Session 05 non-compliant attempt correctly flagged errors for advance timing, equipment capitalization, and unbalanced entries.');

// ---------------------------------------------------------------------
// TEST 3-F: Session 06 — Ledger and Month End Close (Case A Close)
// ---------------------------------------------------------------------
console.log('\n--- TEST 3-F: Session 06 Ledger and Month End Close ---');
const s06Compliant = runAutomaticReview({
  sessionId: 6,
  lesson: { id: 6, title: 'Ledger and Month End Close' },
  draft: {
    'concept:explain': 'A trial balance verifies that debits equal credits, but it cannot detect errors of principle or errors of omission. In Case A, Doc A05 was misposted to revenue. The correction journal reverses revenue to Accounts Receivable without modifying Bank cash, achieving an authentic balanced trial balance of ₹2,18,000 and net profit of ₹53,500.',
    'team:contribution': 'Prepared the month-end correction journal reversing ₹35,000 premature revenue to Trade Receivables, confirmed cash invariance, and validated the ₹2,18,000 trial balance.',
    'team:judgement': 'I refused to treat mathematical agreement of trial balance debits and credits as proof of financial statement accuracy.',
  },
  workstationData: {
    correctionJournal: {
      debitAccount: 'Service Revenue',
      creditAccount: 'Accounts Receivable',
      amount: 35000,
      sourceDoc: 'Doc A05 (Voucher DEP-2026-302 / INV-2026-101)',
      explanation: 'Reversing premature ₹35,000 revenue recognized on Apex Retail collection and applying against Trade Receivables. Bank cash is unchanged.',
      isApplied: true,
    },
    undetectedErrors: '1. Error of Principle: Posting an item to the wrong class of account (e.g. crediting revenue instead of a receivable). Debits still equal credits so the trial balance balances despite financial statement distortion.\n2. Error of Omission: Complete failure to record a transaction in both debit and credit sides.',
    checklist: [
      { id: 'chk-bank', title: 'Bank Ledger & Statement Verification', verified: true },
      { id: 'chk-receivables', title: 'Trade Receivables Aging & Collection Audit', verified: true },
      { id: 'chk-liabilities', title: 'Accruals & Unearned Liabilities Verification', verified: true },
      { id: 'chk-vouchers', title: 'Source Voucher Audit Trail Completeness', verified: true },
    ],
    governance: {
      studentId: 'STU-2026-ACC',
      fileVersion: 'StudentID_S06_v01',
      contributionSummary: 'Prepared the month-end correction journal reversing ₹35,000 premature revenue to Trade Receivables, confirmed cash invariance, and validated the ₹2,18,000 trial balance.',
      peerCorrection: 'Colleague confirmed that bank cash was correctly posted and must not be touched in the adjusting journal.',
      professionalBoundary: 'I refused to treat mathematical agreement of trial balance debits and credits as proof of financial statement accuracy.',
    },
  },
});

assert.strictEqual(s06Compliant.sessionId, 6);
assert.strictEqual(s06Compliant.overallStatus, 'reviewed', `Expected 'reviewed', got '${s06Compliant.overallStatus}'`);
assert.strictEqual(s06Compliant.stages.Work.checks.find(c => c.id === 's06-w1-correction-journal')?.passed, true);
assert.strictEqual(s06Compliant.stages.Work.checks.find(c => c.id === 's06-w2-trial-balance')?.passed, true);
assert.strictEqual(s06Compliant.stages.Work.checks.find(c => c.id === 's06-w3-income-statement')?.passed, true);
assert.strictEqual(s06Compliant.stages.Work.checks.find(c => c.id === 's06-w4-accounting-equation')?.passed, true);
assert.strictEqual(s06Compliant.stages.Work.checks.find(c => c.id === 's06-w5-undetectable-errors')?.passed, true);
assert.strictEqual(s06Compliant.stages.Work.checks.find(c => c.id === 's06-w6-close-checklist')?.passed, true);
assert.strictEqual(s06Compliant.hasErrors, false);
console.log('✓ Session 06 compliant month-end close verified: Correction journal, trial balance (₹218,000), profit (₹53,500), and close checklist passed.');

// Test 3-F Non-compliant: Touching bank cash in correction journal & uncorrected error
const s06CashTampering = runAutomaticReview({
  sessionId: 6,
  lesson: { id: 6, title: 'Ledger and Month End Close' },
  draft: {
    'concept:explain': 'Short note.',
    'team:contribution': 'None.',
    'team:judgement': 'None.',
  },
  workstationData: {
    correctionJournal: {
      debitAccount: 'Bank', // INCORRECT: Cash should not be touched
      creditAccount: 'Service Revenue',
      amount: 35000,
      isApplied: true,
    },
    errorCorrected: false,
    checklist: [],
  },
});

assert.strictEqual(s06CashTampering.hasErrors, true, 'Expected errors for cash tampering and uncorrected error state');
assert.strictEqual(s06CashTampering.stages.Work.checks.find(c => c.id === 's06-w1-correction-journal')?.passed, false);
assert.strictEqual(s06CashTampering.stages.Work.checks.find(c => c.id === 's06-w2-trial-balance')?.passed, false);
console.log('✓ Session 06 non-compliant attempt correctly flagged errors for cash tampering and uncorrected balances.');

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
// TEST 4-C: Session 09 — Business Finance & Performance Analysis
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-C: Session 09 Business Finance & Performance Analysis ---');
const s09Finance = runAutomaticReview({
  sessionId: 9,
  lesson: { id: 9, title: 'Business Finance and Performance' },
  draft: {
    'concept:explain': 'Gross margin measures revenue after direct delivery costs, falling 10 percentage points from 60% in July to 50% in September.',
    'team:contribution': 'Finance challenged Sales claims that revenue growth proves business health, citing margin compression and receivables buildup.',
    'team:judgement': 'I commit to never assuming reasons for cost changes without verifying underlying supplier contracts and collection records.',
  },
  workstationData: {
    userKpis: {
      julyGrossProfit: 60000,
      augustGrossProfit: 66000,
      septemberGrossProfit: 75000,
      julyOperatingProfit: 25000,
      augustOperatingProfit: 27000,
      septemberOperatingProfit: 30000,
      julyGrossMargin: 60.0,
      augustGrossMargin: 55.0,
      septemberGrossMargin: 50.0,
      julyOperatingMargin: 25.0,
      augustOperatingMargin: 22.5,
      septemberOperatingMargin: 20.0,
      revenueGrowthMoM: 25.0,
      profitGrowthMoM: 11.1,
      marginPpChangeMoM: -5.0,
    },
    findings: [
      '1. Gross margin dropped 10.0 percentage points from 60% in July to 50% in September as direct delivery costs surged 38.9%.',
      '2. Operating profit grew by only 11.1% while revenue grew 25.0%, diluting unit margins from 22.5% to 20.0%.',
      '3. Closing trade receivables rose 133% from ₹30,000 to ₹70,000, locking 46.7% of September revenue into uncollected credit.',
    ],
    uncertainty: 'Case D does not provide customer collection dates or reasons for cost changes, so discounting cannot be claimed without evidence.',
    investigation: 'Finance to audit 30/60/90-day debtor aging schedule and review vendor invoices for direct cost driver breakdowns.',
    executiveBriefing: 'Sales expansion cannot be celebrated when gross margins have compressed by 10 percentage points and ₹70,000 remains uncollected in receivables.',
    peerDefenseNote: 'Sales argues that +25% revenue expansion justifies higher commission payouts. Finance counters that each new rupee of revenue costs 50 paise in direct costs.',
  },
});

assert.strictEqual(s09Finance.sessionId, 9);
assert.strictEqual(s09Finance.overallStatus, 'reviewed');
assert.strictEqual(s09Finance.stages.Work.checks.find(c => c.id === 's09-w1-gross-profit')?.passed, true);
assert.strictEqual(s09Finance.stages.Work.checks.find(c => c.id === 's09-w2-operating-profit')?.passed, true);
assert.strictEqual(s09Finance.stages.Work.checks.find(c => c.id === 's09-w3-margins')?.passed, true);
assert.strictEqual(s09Finance.stages.Work.checks.find(c => c.id === 's09-w4-growth-rates')?.passed, true);
assert.strictEqual(s09Finance.stages.Work.checks.find(c => c.id === 's09-w5-three-findings')?.passed, true);
assert.strictEqual(s09Finance.stages.Work.checks.find(c => c.id === 's09-w6-uncertainty-investigation')?.passed, true);
console.log('✓ Session 09 financial analysis & management findings (GP ₹60k/66k/75k, GM 60/55/50%, Rev +25%, OP +11.1%) verified.');

// ---------------------------------------------------------------------
// TEST 4-D: Session 10 — MIS Dashboard & 150-Word Management Memo
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-D: Session 10 MIS Dashboard & Management Memo ---');
const s10Dashboard = runAutomaticReview({
  sessionId: 10,
  lesson: { id: 10, title: 'MIS Dashboard Development' },
  draft: {
    'concept:explain':
      'September revenue grew 25.0% to ₹1,50,000, but operating profit margin compressed from 22.5% to 20.0% due to a 38.9% surge in direct delivery costs (₹75,000). Concurrently, uncollected receivables rose to ₹70,000, locking 46.7% of monthly sales in unpaid customer accounts. Action 1: Operations Lead to audit direct supplier contracts by Friday to isolate material cost inflation. Action 2: Collections Lead to place credit holds on accounts overdue >30 days by Monday. Limitation: Case D does not supply customer-level payment dates or unit cost breakdowns.',
    'team:contribution':
      'The 4 KPI cards and 3-month trend chart immediately resolve the Managing Director’s 5-minute decision: they demonstrate that while top-line revenue is accelerating, gross margin compression (-5.0 pp) and receivables lockup (₹70,000) are eroding cash solvency. Executive attention is directed to direct costs rather than premature expansion bonuses.',
    'team:judgement':
      'I commit to always including assigned role owners and strict deadlines for any recommended action on executive management dashboards.',
  },
  workstationData: {
    managementQuestion:
      'Is our 25% September revenue growth converting into sustainable operating margin and cash, or are mounting delivery costs and uncollected trade receivables threatening liquidity?',
    directCostInput: 75000,
    selectedKpiIds: ['kpi-revenue', 'kpi-gross-margin', 'kpi-operating-margin', 'kpi-receivables'],
    memoText:
      'September revenue grew 25.0% to ₹1,50,000, but operating profit margin compressed from 22.5% to 20.0% due to a 38.9% surge in direct delivery costs (₹75,000). Concurrently, uncollected receivables rose to ₹70,000, locking 46.7% of monthly sales in unpaid customer accounts. Action 1: Operations Lead to audit direct supplier contracts by Friday to isolate material cost inflation. Action 2: Collections Lead to place credit holds on accounts overdue >30 days by Monday. Limitation: Case D does not supply customer-level payment dates or unit cost breakdowns.',
    visualizationJustification:
      'The 4 KPI cards and 3-month trend chart immediately resolve the Managing Director’s 5-minute decision: they demonstrate that while top-line revenue is accelerating, gross margin compression (-5.0 pp) and receivables lockup (₹70,000) are eroding cash solvency. Executive attention is directed to direct costs rather than premature expansion bonuses.',
  },
});

assert.strictEqual(s10Dashboard.sessionId, 10);
assert.strictEqual(s10Dashboard.overallStatus, 'reviewed');
assert.strictEqual(s10Dashboard.stages.Work.checks.find(c => c.id === 's10-w1-kpi-selection')?.passed, true);
assert.strictEqual(s10Dashboard.stages.Work.checks.find(c => c.id === 's10-w2-kpi-calculation')?.passed, true);
assert.strictEqual(s10Dashboard.stages.Work.checks.find(c => c.id === 's10-w3-sensitivity-test')?.passed, true);
assert.strictEqual(s10Dashboard.stages.Work.checks.find(c => c.id === 's10-w4-memo-length')?.passed, true);
assert.strictEqual(s10Dashboard.stages.Work.checks.find(c => c.id === 's10-w5-memo-structure')?.passed, true);
console.log('✓ Session 10 MIS dashboard & 150-word memo (4 KPIs, sensitivity test, 2 actions, 1 limitation) verified.');

// ---------------------------------------------------------------------
// TEST 4-E: Session 11 — GST and Invoice Review (Case E)
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-E: Session 11 GST and Invoice Review ---');
const s11Compliant = runAutomaticReview({
  sessionId: 11,
  lesson: { id: 11, title: 'GST and Invoice Review' },
  draft: {
    'concept:explain': 'Review invoice evidence before calculating. Karnataka to Karnataka intra-state supply incurs 9% CGST + 9% SGST. Inter-state supply to Tamil Nadu incurs 18% IGST. Purchase matching to GSTR-2B inward statement is evidence for review, not automatic permission to claim credit.',
    'team:contribution': 'Acted as Tax Preparer, identified E02 tax classification defect (reclassified to IGST ₹3,600), flagged E03 missing serial, and quarantined P02 ₹360 credit.',
    'team:judgement': 'I refused to claim Input Tax Credit on P02 before the supplier files their GSTR-1 return and the bill appears on GSTR-2B.',
  },
  workstationData: {
    invoiceAudits: {
      E01: {
        checkedSerial: true,
        checkedPos: true,
        checkedTaxType: true,
        checkedValue: true,
        studentStatus: 'Compliant',
        studentNotes: 'Intra-state supply within Karnataka correctly charged at 9% CGST (₹900) + 9% SGST (₹900).',
      },
      E02: {
        checkedSerial: true,
        checkedPos: true,
        checkedTaxType: true,
        checkedValue: true,
        studentStatus: 'Defect: Wrong Tax Type',
        studentNotes: 'Inter-state transaction (Place of Supply: Tamil Nadu). Reclassified from CGST/SGST to 18% IGST (₹3,600).',
      },
      E03: {
        checkedSerial: false,
        checkedPos: true,
        checkedTaxType: true,
        checkedValue: true,
        studentStatus: 'Defect: Missing Serial',
        studentNotes: 'Missing mandatory tax invoice serial number under Rule 46 of CGST Rules.',
      },
    },
    purchaseAudits: {
      P01: {
        reconciliationStatus: 'Matched',
        itcAction: 'Eligible for Verification',
        studentNotes: 'Present in GSTR-2B (₹180). Eligible for credit verification upon delivery confirmation.',
      },
      P02: {
        reconciliationStatus: 'Unmatched / Exception',
        itcAction: 'Quarantine ITC & Escalate',
        studentNotes: 'Absent from GSTR-2B. Quarantined ₹360 ITC and issued vendor escalation query.',
      },
      P03: {
        reconciliationStatus: 'Matched',
        itcAction: 'Eligible for Verification',
        studentNotes: 'Present in GSTR-2B (₹540). Eligible for credit verification upon delivery confirmation.',
      },
    },
    vendorEscalationMemo:
      'Subject: Urgent — Unmatched Purchase Invoice P02 Missing from GSTR-2B Portal Statement\n\nDear Accounts Team (Kaveri Server Hardware Works),\n\nDuring our month-end GST reconciliation, we identified that purchase bill VND-TN-9041 (Taxable: ₹2,000, Tax: ₹360) is absent from our auto-drafted GSTR-2B statement. Under Section 16(2)(aa) of CGST Act, we cannot claim ₹360 in ITC until this invoice appears on the portal. We have quarantined this credit. Please confirm upload in your GSTR-1 and provide the ARN filing reference by Friday 15:00.\n\nRegards,\nTax & Compliance Executive',
    governance: {
      studentId: 'STU-2026-1102',
      fileVersion: 'StudentID_S11_v01.xlsx',
      taxPreparer: 'Aarav Tax Analyst',
      taxReviewer: 'Priya Senior Reviewer',
      decisionOwner: 'Finance Controller',
    },
  },
});

assert.strictEqual(s11Compliant.sessionId, 11);
assert.strictEqual(s11Compliant.overallStatus, 'reviewed');
assert.strictEqual(s11Compliant.stages.Work.checks.find(c => c.id === 's11-w1-sales-audit')?.passed, true);
assert.strictEqual(s11Compliant.stages.Work.checks.find(c => c.id === 's11-w2-tax-schedule')?.passed, true);
assert.strictEqual(s11Compliant.stages.Work.checks.find(c => c.id === 's11-w3-purchase-reconciliation')?.passed, true);
assert.strictEqual(s11Compliant.stages.Work.checks.find(c => c.id === 's11-w4-itc-quarantine')?.passed, true);
assert.strictEqual(s11Compliant.stages.Work.checks.find(c => c.id === 's11-w5-vendor-escalation')?.passed, true);
assert.strictEqual(s11Compliant.stages.Team.checks.find(c => c.id === 's11-t1-governance')?.passed, true);
console.log('✓ Session 11 GST invoice review & purchase reconciliation (E01–E03 audit, P01–P03 matching, ITC quarantine) verified.');

// ---------------------------------------------------------------------
// TEST 4-F: Session 12 — Receivables and Working Capital (Case F)
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-F: Session 12 Receivables and Working Capital ---');
const s12Compliant = runAutomaticReview({
  sessionId: 12,
  lesson: { id: 12, title: 'Receivables and Working Capital' },
  draft: {
    'concept:explain':
      'Days overdue is calculated strictly from due date: Max(0, 31 Oct minus Due Date). Current includes invoices due today. In 7-day cash forecasting, customer promises are not cash; only cleared receipts eliminate liquidity deficits. Beacon disputes ₹5,000 on F02, so we demand the undisputed ₹15,000 immediately.',
    'team:contribution':
      'Prioritized collecting Asha ₹10,000 (Current) and Beacon undisputed ₹15,000 (15 days overdue) to secure ₹25,000 in new cash, converting our initial -₹20,000 deficit into a +₹5,000 reserve buffer.',
    'team:judgement':
      'I refused to count on Delta (₹40,000, 75 days overdue) for emergency 7-day payroll because older debts have low immediate collection probability.',
  },
  workstationData: {
    invoiceAudits: {
      F01: {
        assignedBucket: 'Current',
        verifiedDaysOverdue: 0,
        isDaysVerified: true,
        isBucketVerified: true,
        notes: 'Due today (31 Oct). 0 days overdue. Classified as Current.',
      },
      F02: {
        assignedBucket: '1–30 Days',
        verifiedDaysOverdue: 15,
        isDaysVerified: true,
        isBucketVerified: true,
        notes: 'Due 16 Oct. 15 days overdue. ₹5,000 disputed, ₹15,000 undisputed.',
      },
      F03: {
        assignedBucket: '31–60 Days',
        verifiedDaysOverdue: 45,
        isDaysVerified: true,
        isBucketVerified: true,
        notes: 'Due 16 Sep. 45 days overdue. 31–60 days bucket.',
      },
      F04: {
        assignedBucket: '61–90 Days',
        verifiedDaysOverdue: 75,
        isDaysVerified: true,
        isBucketVerified: true,
        notes: 'Due 17 Aug. 75 days overdue. 61–90 days bucket. High risk.',
      },
    },
    targetedInvoiceIds: ['F01', 'F02'],
    beaconDisputeMessage:
      'Subject: Settlement of Undisputed Balance — Invoice F02 (₹15,000)\n\nDear Accounts Team (Beacon),\n\nWe acknowledge your billing query regarding the ₹5,000 variance on Invoice F02. While our operations lead reviews service logs for that specific portion, we request the immediate electronic remittance of the undisputed balance of ₹15,000 by Monday 2 November 2026 at 14:00. This protects your credit standing while we investigate the remaining ₹5,000.\n\nRegards,\nCredit Controller',
    governance: {
      studentId: 'STU-2026-1205',
      fileVersion: 'StudentID_S12_v01.xlsx',
      creditAnalyst: 'Tanvi Credit Analyst',
      treasuryLead: 'Karthik Treasury Lead',
      decisionOwner: 'Finance Controller',
    },
  },
});

assert.strictEqual(s12Compliant.sessionId, 12);
assert.strictEqual(s12Compliant.overallStatus, 'reviewed');
assert.strictEqual(s12Compliant.stages.Work.checks.find(c => c.id === 's12-w1-ageing-buckets')?.passed, true);
assert.strictEqual(s12Compliant.stages.Work.checks.find(c => c.id === 's12-w2-reconcile-totals')?.passed, true);
assert.strictEqual(s12Compliant.stages.Work.checks.find(c => c.id === 's12-w3-cash-gap-analytics')?.passed, true);
assert.strictEqual(s12Compliant.stages.Work.checks.find(c => c.id === 's12-w4-collection-plan')?.passed, true);
assert.strictEqual(s12Compliant.stages.Work.checks.find(c => c.id === 's12-w5-dispute-communication')?.passed, true);
assert.strictEqual(s12Compliant.stages.Team.checks.find(c => c.id === 's12-t1-governance')?.passed, true);
console.log('✓ Session 12 Receivables ageing & 7-day cash plan (F01–F04 buckets, ₹20k deficit closed, dispute isolated) verified.');

// ---------------------------------------------------------------------
// TEST 4-G: Session 13 — AI for Commerce Professionals (Case D Responsible AI)
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-G: Session 13 AI for Commerce Professionals (Case D) ---');
const s13Compliant = runAutomaticReview({
  sessionId: 13,
  lesson: { id: 13, title: 'AI for Commerce Professionals' },
  draft: {
    'concept:explain': 'Responsible AI in commercial finance requires four foundational principles: data minimization (never input private client or banking data), strict source bounding, mandatory human verification before communicating results, and clear governance disclosure logs. Flawed models frequently hallucinate percentages and produce commercially disastrous recommendations such as price discounting during periods of margin compression.',
    'team:contribution': 'Classified all 6 financial items into safe aggregates and prohibited private identifiers. Structured a 6-part bounded prompt for Case D MIS data, audited the flawed offline draft, identified 4 key errors, and authored a verified 4-bullet management memo with an audit disclosure log.',
    'team:judgement': 'I explicitly rejected the AI recommendation to offer a 20% discount, recognizing that direct costs had escalated to 50% of revenue and a price cut would completely eliminate operating profit.',
  },
  workstationData: {
    classification: {
      DCI_01: 'safe-aggregate',
      DCI_02: 'prohibited-private',
      DCI_03: 'safe-aggregate',
      DCI_04: 'prohibited-private',
      DCI_05: 'safe-aggregate',
      DCI_06: 'prohibited-private',
    },
    promptArchitecture: {
      role: 'Senior Commercial Finance Analyst advising executive management.',
      task: 'Analyze Q1 performance across revenue trajectory, cost escalation, margin compression, and closing receivables risk.',
      permittedSources: 'Strictly bounded to Case D 3-Month MIS aggregate figures (CaseD!B2:D6). No external knowledge.',
      outputStructure: 'A structured 4-bullet executive memo: (1) Revenue Trajectory, (2) Cost & Margin Compression, (3) Receivables & Working Capital Alert, (4) Concrete Management Recommendations.',
      uncertaintyRule: 'If a metric or underlying cause is not in the source table (such as customer payment dates or credit terms), state "Data not available in source"—do not invent numbers or assume collection timing.',
      explicitExclusions: 'Do not extrapolate Q2 numbers, do not recommend price cuts or blanket discounts, and do not make assumptions about individual customer payment behavior.',
    },
    verificationChecks: {
      VERIF_01: true,
      VERIF_02: true,
      VERIF_03: true,
      VERIF_04: true,
    },
    revisedMemo: {
      revenueBullet: 'Revenue Trajectory: Q1 gross revenue totaled ₹370,000, with September expanding +25.0% MoM (₹150,000 vs. ₹120,000 in August and ₹100,000 in July).',
      marginBullet: 'Cost & Margin Compression: Operating margin degraded from 25.0% in July to 20.0% in September, driven by a +38.9% surge in direct delivery costs (reaching 50.0% of revenue).',
      workingCapitalBullet: 'Working Capital Alert: Closing receivables escalated sharply to ₹70,000 (representing 46.7% of monthly revenue), indicating substantial cash lockup. Note: Source data does not provide customer-level payment dates.',
      recommendationBullet: 'Actionable Management Advice: Reject price discounts; immediately institute a formal receivables ageing review and audit direct cost escalations before taking on new delivery volume.',
    },
    governanceLog: {
      aiToolAndDate: 'Vivi AI Assistant / Offline AI Model (S13 Benchmark), 31 Oct 2026',
      permittedInputRef: 'CaseD!B2:D6 (Sanitized 3-Month Monthly Financial Aggregates)',
      promptArchitectureRef: 'S13-PROMPT-V01 (Role, Task, Source, Output, Uncertainty, Exclusions)',
      generatedDraftRef: 'DRAFT-S13-01 (Offline Unverified Draft)',
      humanFactChecksSummary: 'Audited 4 claims: Corrected Sep growth from 30% to 25%; corrected margin from 25% to 20%; flagged payment claim as hallucination; rejected 20% discount advice as commercially fatal.',
      humanReviewerName: 'Lead Commerce Analyst / Student Reviewer',
      autonomousHumanDecision: 'Flagged receivables surge to management, initiated credit control review, and frozen discretionary discounts to protect the 20% operating margin.',
    },
    fileVersion: 'StudentID_S13_v01.xlsx',
  },
});

assert.strictEqual(s13Compliant.sessionId, 13);
assert.strictEqual(s13Compliant.overallStatus, 'reviewed');
assert.strictEqual(s13Compliant.stages.Work.checks.find(c => c.id === 's13-w1-data-classification')?.passed, true);
assert.strictEqual(s13Compliant.stages.Work.checks.find(c => c.id === 's13-w2-prompt-architecture')?.passed, true);
assert.strictEqual(s13Compliant.stages.Work.checks.find(c => c.id === 's13-w3-draft-verification')?.passed, true);
assert.strictEqual(s13Compliant.stages.Work.checks.find(c => c.id === 's13-w4-human-revised-memo')?.passed, true);
assert.strictEqual(s13Compliant.stages.Work.checks.find(c => c.id === 's13-w5-ai-log-disclosure')?.passed, true);
assert.strictEqual(s13Compliant.stages.Team.checks.find(c => c.id === 's13-t1-governance')?.passed, true);
console.log('✓ Session 13 Responsible AI Workbench (Data minimization, 6-part prompt, 4-point verification audit, governance log) verified.');

// ---------------------------------------------------------------------
// TEST 4-H: Session 14 — AI Verification and Automation (Case D Workflow)
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-H: Session 14 AI Verification and Automation (Case D) ---');
const s14Compliant = runAutomaticReview({
  sessionId: 14,
  lesson: { id: 14, title: 'AI Verification and Automation' },
  draft: {
    'concept:explain': 'September revenue expanded 25.0% MoM to ₹150,000 (Q1 total: ₹370,000). However, operating margin contracted from 22.5% to 20.0% as direct costs surged 38.9% to ₹75,000 (50.0% of revenue). Closing receivables spiked to ₹70,000 (46.7% of revenue), indicating heightened working capital lockup. Note: Source data does not provide customer-level payment dates or credit terms. We explicitly reject blanket 20% discounts, which would eliminate operating profits, and recommend auditing direct delivery costs.',
    'team:contribution': 'Audited all 4 Case D claims: corrected revenue growth to 25.0%, margin to 20.0%, flagged receivables lockup, and rejected blanket discount. Implemented stopping condition for missing revenue.',
    'team:judgement': 'Halted pipeline execution during blank September revenue fault-injection drill to prevent unverified zero-growth release.',
  },
  workstationData: {
    claimAudits: {
      CLM_01: {
        userVerdict: 'FALSE',
        userRecalculation: '(150,000 - 120,000) / 120,000 = +25.0%',
        userCorrection: 'September revenue grew 25.0% MoM (₹30,000 expansion), not 30%.',
        isAudited: true,
      },
      CLM_02: {
        userVerdict: 'FALSE',
        userRecalculation: '₹30,000 / ₹150,000 = 20.0% (down from 22.5% in Aug and 25.0% in Jul)',
        userCorrection: 'Operating profit margin contracted to 20.0% due to a 38.9% surge in direct delivery costs.',
        isAudited: true,
      },
      CLM_03: {
        userVerdict: 'MISLEADING',
        userRecalculation: 'Receivables jumped +133% vs July to ₹70,000 (46.7% of revenue). Source has zero payment timestamps.',
        userCorrection: 'High receivables indicate working capital lockup. Claiming customers paid on time is an unsupported hallucination.',
        isAudited: true,
      },
      CLM_04: {
        userVerdict: 'FATAL_RECOMMENDATION',
        userRecalculation: 'A 20% discount cuts revenue to ₹120k; GP drops to ₹45k which equals overheads, leaving ₹0 operating profit.',
        userCorrection: 'Reject blanket discounts. Squeezing prices by 20% completely eliminates operating profit.',
        isAudited: true,
      },
    },
    correctedMemoText: 'September revenue expanded 25.0% MoM to ₹150,000 (Q1 total: ₹370,000). However, operating margin contracted from 22.5% to 20.0% as direct costs surged 38.9% to ₹75,000 (50.0% of revenue). Closing receivables spiked to ₹70,000 (46.7% of revenue), indicating heightened working capital lockup. Note: Source data does not provide customer-level payment dates or credit terms. We explicitly reject blanket 20% discounts, which would eliminate operating profits, and recommend auditing direct delivery costs.',
    selectedScenario: 'approved',
    stoppingConditionRule: 'IF(OR(ISBLANK(Revenue), NOT(ISNUMBER(Revenue)), Revenue <= 0), "HALT_ERROR", "PASS")',
    governance: {
      preparerName: 'Commercial Analyst / Student',
      reviewerName: 'Quality Lead / Senior Auditor',
      decisionOwnerName: 'Finance Controller',
      approvalStatus: 'Approved',
      approvalTimestamp: '2026-10-31 16:30 IST',
      autonomousDecisionStatement: 'Rejected AI blanket discount advice, verified +25.0% revenue growth, and halted release during missing-input drill.',
    },
    fileVersion: 'StudentID_S14_v01.xlsx',
  },
});

assert.strictEqual(s14Compliant.sessionId, 14);
assert.strictEqual(s14Compliant.overallStatus, 'reviewed');
assert.strictEqual(s14Compliant.stages.Work.checks.find(c => c.id === 's14-w1-claim-register')?.passed, true);
assert.strictEqual(s14Compliant.stages.Work.checks.find(c => c.id === 's14-w2-revenue-recalculation')?.passed, true);
assert.strictEqual(s14Compliant.stages.Work.checks.find(c => c.id === 's14-w3-corrected-memo')?.passed, true);
assert.strictEqual(s14Compliant.stages.Work.checks.find(c => c.id === 's14-w4-workflow-stopping-condition')?.passed, true);
assert.strictEqual(s14Compliant.stages.Work.checks.find(c => c.id === 's14-w5-scenario-simulation')?.passed, true);
assert.strictEqual(s14Compliant.stages.Team.checks.find(c => c.id === 's14-t1-governance')?.passed, true);
console.log('✓ Session 14 AI Verification & Controlled Workflow (4-claim audit register, 120-word memo, stopping conditions, simulation drill) verified.');

// ---------------------------------------------------------------------
// TEST 4-I: Session 15 — Customer and Sales Operations (Case G CRM Pipeline)
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-I: Session 15 Customer and Sales Operations (Case G) ---');
const s15Compliant = runAutomaticReview({
  sessionId: 15,
  lesson: { id: 15, title: 'Customer and Sales Operations' },
  draft: {
    'concept:explain': 'The All-Lead Win Rate (3/8 = 37.5%) evaluates top-of-funnel acquisition yield across all 8 inquiries received, measuring overall marketing efficiency. Conversely, the Closed-Lead Win Rate (3/5 = 60.0%) isolates the 5 completed negotiations (3 Won, 2 Lost), measuring sales closing effectiveness once a deal reaches a decision. Both metrics are mathematically valid and tell complementary commercial stories when denominators are transparently disclosed.',
    'work-prompt:0': 'Subject: Follow-up on Analytics Service Scope & Requirements — Lead L06\n\nDear Client Leadership,\n\nI am writing to follow up on our discussion regarding your enterprise analytics requirements (due 28 October). Our technical team has finalized the proposed service scope and delivery milestones. Could we schedule a 15-minute alignment call tomorrow, Monday at 11:30 AM, to confirm your specifications so we can finalize the proposal?\n\nSincerely,\nOwner A, Sales Lead',
    'work-prompt:1': 'Subject: Follow-up: Commercial Proposal Review — Lead L07\n\nDear Accounts Team,\n\nFollowing up on our commercial proposal submitted on 25 October (action due 30 October), we would welcome the opportunity to review the pricing structure and address any technical questions your committee may have. Would you have 10 minutes available this Tuesday afternoon at 2:00 PM for a brief check-in?\n\nBest regards,\nOwner C, Commercial Lead',
    'team:contribution': 'Mapped all 8 Case G inquiries, computed All-Lead Win Rate (37.5%) and Closed-Lead Win Rate (60.0%), prioritized overdue leads L06 and L07, and drafted professional follow-up messages.',
    'team:judgement': 'Refused to classify open undecided leads as probable wins, preserving realistic forecast accuracy and preventing sales pipeline distortion.',
  },
  workstationData: {
    leadPlans: {
      L01: { updatedNextAction: 'Archive handover', updatedOwner: 'Owner A', updatedTargetDate: 'Completed', notes: 'Closed Won. Handover completed.' },
      L02: { updatedNextAction: 'Archive handover', updatedOwner: 'Owner B', updatedTargetDate: 'Completed', notes: 'Closed Won. Onboarding active.' },
      L03: { updatedNextAction: 'Archive handover', updatedOwner: 'Owner A', updatedTargetDate: 'Completed', notes: 'Closed Won. Implementation started.' },
      L04: { updatedNextAction: 'Record reason', updatedOwner: 'Owner C', updatedTargetDate: 'Logged', notes: 'Closed Lost. Logged competitor win.' },
      L05: { updatedNextAction: 'Record reason', updatedOwner: 'Owner B', updatedTargetDate: 'Logged', notes: 'Closed Lost. Client deferred budget to FY27.' },
      L06: { updatedNextAction: 'Confirm requirements via 15-min call', updatedOwner: 'Owner A', updatedTargetDate: '2026-11-01', notes: 'Priority 1: 3 days overdue. Re-confirm scope.' },
      L07: { updatedNextAction: 'Review proposal check-in', updatedOwner: 'Owner C', updatedTargetDate: '2026-11-02', notes: 'Priority 2: 1 day overdue. Follow up on pricing review.' },
      L08: { updatedNextAction: 'Conduct discovery call', updatedOwner: 'Owner B', updatedTargetDate: '2026-11-03', notes: 'On Track: Call scheduled for 3 Nov.' },
    },
    enteredAllLeadRate: '37.5',
    enteredClosedLeadRate: '60.0',
    conversionExplanation: 'The All-Lead Win Rate (3/8 = 37.5%) evaluates top-of-funnel acquisition yield across all 8 inquiries received, measuring overall marketing efficiency. Conversely, the Closed-Lead Win Rate (3/5 = 60.0%) isolates the 5 completed negotiations (3 Won, 2 Lost), measuring sales closing effectiveness once a deal reaches a decision. Both metrics are mathematically valid and tell complementary commercial stories when denominators are transparently disclosed.',
    messageL06: 'Subject: Follow-up on Analytics Service Scope & Requirements — Lead L06\n\nDear Client Leadership,\n\nI am writing to follow up on our discussion regarding your enterprise analytics requirements (due 28 October). Our technical team has finalized the proposed service scope and delivery milestones. Could we schedule a 15-minute alignment call tomorrow, Monday at 11:30 AM, to confirm your specifications so we can finalize the proposal?\n\nSincerely,\nOwner A, Sales Lead',
    messageL07: 'Subject: Follow-up: Commercial Proposal Review — Lead L07\n\nDear Accounts Team,\n\nFollowing up on our commercial proposal submitted on 25 October (action due 30 October), we would welcome the opportunity to review the pricing structure and address any technical questions your committee may have. Would you have 10 minutes available this Tuesday afternoon at 2:00 PM for a brief check-in?\n\nBest regards,\nOwner C, Commercial Lead',
    governance: {
      preparerName: 'Sales Operations Associate',
      salesReviewerName: 'Commercial Sales Lead',
      decisionOwnerName: 'VP of Commercial Operations',
      fileVersion: 'StudentID_S15_v01.xlsx',
      signoffDate: '2026-10-31',
    },
    fileVersion: 'StudentID_S15_v01.xlsx',
  },
});

assert.strictEqual(s15Compliant.sessionId, 15);
assert.strictEqual(s15Compliant.overallStatus, 'reviewed');
assert.strictEqual(s15Compliant.stages.Work.checks.find(c => c.id === 's15-w1-crm-table')?.passed, true);
assert.strictEqual(s15Compliant.stages.Work.checks.find(c => c.id === 's15-w2-all-lead-win-rate')?.passed, true);
assert.strictEqual(s15Compliant.stages.Work.checks.find(c => c.id === 's15-w3-closed-lead-win-rate')?.passed, true);
assert.strictEqual(s15Compliant.stages.Work.checks.find(c => c.id === 's15-w4-overdue-action-queue')?.passed, true);
assert.strictEqual(s15Compliant.stages.Work.checks.find(c => c.id === 's15-w5-followup-messages')?.passed, true);
assert.strictEqual(s15Compliant.stages.Team.checks.find(c => c.id === 's15-t1-governance')?.passed, true);
console.log('✓ Session 15 Customer & Sales Operations (Case G CRM pipeline, dual win rates 37.5% & 60.0%, overdue action queue, client follow-up outreach) verified.');

// ---------------------------------------------------------------------
// TEST 4-J: Session 16 — Commercial Decision Making (Scenario Model & Memo)
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-J: Session 16 Commercial Decision Making (Scenario Model & Memo) ---');
const s16Compliant = runAutomaticReview({
  sessionId: 16,
  lesson: { id: 16, title: 'Commercial Decision Making' },
  draft: {
    'concept:explain': 'Unit Contribution (Selling Price minus Variable Cost) measures cash generated per unit to pay fixed overheads. Lowering unit price compresses unit contribution from ₹6,000 to ₹5,000, forcing break-even to jump from 20 to 24 seats. When physical capacity is capped at 30 seats, volume expansion cannot generate incremental profit.',
    'work-prompt:0': 'Comparative Commercial Matrix: Baseline 25 seats @ ₹10k generates ₹2,50,000 revenue, ₹1,50,000 contribution, and ₹30,000 profit (break-even 20 seats). Proposed 30 seats @ ₹9k generates ₹2,70,000 revenue, ₹1,50,000 contribution, and ₹30,000 profit (break-even 24 seats). Incremental profit is exactly ₹0.',
    'work-prompt:1': 'Recommendation: Reject the blanket 10% volume discount across all 30 seats. While revenue expands from ₹2,50,000 to ₹2,70,000, unit contribution drops from ₹6,000 to ₹5,000. Total contribution remains unchanged at ₹1,50,000, generating exactly ₹0 incremental profit (₹30,000 in both cases). Furthermore, capacity utilization surges to 100%, eliminating operational buffer and raising break-even from 20 to 24 seats. Counter-Proposal: Offer standard pricing (₹10,000) on the first 25 seats and a 10% discount (₹9,000) on incremental seats 26–30 only, securing ₹5,000 in genuine incremental profit. Condition for Approval: Non-refundable upfront booking deposits for all 30 seats must be executed prior to cohort launch.',
    'work-prompt:2': 'Required evidence to verify 30-seat demand assumption: (1) executed non-cancellable purchase agreement; (2) 50% non-refundable advance booking deposit; (3) named participant roster received 14 days prior to delivery.',
    'team:contribution': 'Calculated baseline and proposed break-even volumes (20 vs 24 seats), identified zero incremental profit at 100% capacity, and formulated a tiered counter-proposal.',
    'team:judgement': 'Refused to approve price discounting based on top-line revenue expansion alone, protecting company operating margin and operational reserve buffer.',
  },
  workstationData: {
    activeScenarioId: 'proposed_target',
    sliderDiscountPct: 10,
    sliderVolume: 30,
    extraFixedCost: 0,
    enteredMinSeats: '30',
    decisionRecommendation: 'COUNTER',
    decisionMemo: 'Recommendation: Reject the blanket 10% volume discount across all 30 seats. While revenue expands from ₹2,50,000 to ₹2,70,000, unit contribution drops from ₹6,000 to ₹5,000. Total contribution remains unchanged at ₹1,50,000, generating exactly ₹0 incremental profit (₹30,000 in both cases). Furthermore, capacity utilization surges to 100%, eliminating operational buffer and raising break-even from 20 to 24 seats. Counter-Proposal: Offer standard pricing (₹10,000) on the first 25 seats and a 10% discount (₹9,000) on incremental seats 26–30 only, securing ₹5,000 in genuine incremental profit. Condition for Approval: Non-refundable upfront booking deposits for all 30 seats must be executed prior to cohort launch.',
    evidenceRequirements: 'Required evidence to verify 30-seat demand assumption: (1) executed non-cancellable purchase agreement; (2) 50% non-refundable advance booking deposit; (3) named participant roster received 14 days prior to delivery.',
    governance: {
      preparerName: 'Commercial Analyst Lead',
      reviewerName: 'Finance Operations Manager',
      decisionOwnerName: 'Commercial Director',
      approvalStatus: 'Conditional',
      signoffDate: '2026-11-06',
      fileVersion: 'StudentID_S16_v01.xlsx',
    },
    fileVersion: 'StudentID_S16_v01.xlsx',
  },
});

assert.strictEqual(s16Compliant.sessionId, 16);
assert.strictEqual(s16Compliant.overallStatus, 'reviewed');
assert.strictEqual(s16Compliant.stages.Work.checks.find(c => c.id === 's16-w1-comparative-matrix')?.passed, true);
assert.strictEqual(s16Compliant.stages.Work.checks.find(c => c.id === 's16-w2-breakeven-calculation')?.passed, true);
assert.strictEqual(s16Compliant.stages.Work.checks.find(c => c.id === 's16-w3-minimum-seats-proof')?.passed, true);
assert.strictEqual(s16Compliant.stages.Work.checks.find(c => c.id === 's16-w4-sensitivity-scenarios')?.passed, true);
assert.strictEqual(s16Compliant.stages.Work.checks.find(c => c.id === 's16-w5-decision-memo')?.passed, true);
assert.strictEqual(s16Compliant.stages.Team.checks.find(c => c.id === 's16-t1-governance')?.passed, true);
assert.strictEqual(s16Compliant.stages.Team.checks.find(c => c.id === 's16-t2-rubric-compliance')?.passed, true);
console.log('✓ Session 16 Commercial Decision Making (pricing matrix, break-even 20 vs 24, 30 seats proof, memo & tiered counter-proposal) verified.');

// ---------------------------------------------------------------------
// TEST 4-K: Session 17 — Industry Challenge Discovery (Capstone Discovery Brief)
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-K: Session 17 Industry Challenge Discovery (Capstone Brief) ---');
const s17Compliant = runAutomaticReview({
  sessionId: 17,
  lesson: { id: 17, title: 'Industry Challenge Discovery' },
  draft: {
    'concept:explain': 'Discovery interviews separate client symptoms (asking for an AI dashboard) from root operational causes (imminent ₹20k payroll deficit). A 5-element problem statement specifies Persona, Problem, Evidence, Consequence, and Success Metric while respecting strict dataset boundaries.',
    'work-prompt:0': 'Documented 8 discovery questions covering user personas, high-stakes decisions, verified data sources, system join limitations, aging rules, dispute quarantine, scope boundaries, and measurable success metrics.',
    'work-prompt:1': 'The Managing Director of Vayentra Labs lacks visibility into ₹1,00,000 across 4 outstanding client invoices, creating a ₹20,000 liquidity deficit against upcoming payroll obligations. Because sales leads and invoice ledgers lack verified data keys, collections teams cannot prioritize debtors. We will construct a 7-day cash deficit model and receivables aging schedule that reconciles to Case F with zero variance within 10 working days.',
    'work-prompt:2': 'Documented 3 critical invalidating assumptions (collectibility of 4 invoices, reliance on unjoined Case G leads, dashboard sufficiency without collections outreach) and defined next discovery action.',
    'team:contribution': 'Conducted structured discovery interview with simulated founder, mapped Case F and G datasets separately, drafted 80-word problem statement, and verified data permissions.',
    'team:judgement': 'Refused to attempt synthetic joins between CRM leads and invoice ledgers, preventing corrupted controls and protecting audit integrity.',
    'problem:statement': 'The Managing Director of Vayentra Labs lacks visibility into ₹1,00,000 across 4 outstanding client invoices, creating a ₹20,000 liquidity deficit against upcoming payroll obligations. Because sales leads and invoice ledgers lack verified data keys, collections teams cannot prioritize debtors. We will construct a 7-day cash deficit model and receivables aging schedule that reconciles to Case F with zero variance within 10 working days.',
    'next:action': 'Obtain signed dispute documentation from Beacon Logistics regarding the ₹5,000 service dispute, and schedule a 30-minute alignment call with the Managing Director to approve formal debtor escalation thresholds.',
  },
  workstationData: {
    questions: [
      { id: 'Q1', dimension: 'Users', category: 'Target User Persona', question: 'Who will use this?', stakeholderAnswer: 'MD and Collections Lead', evidenceRequired: 'Role matrix' },
      { id: 'Q2', dimension: 'Decisions', category: 'High-Stakes Decision', question: 'Which decision is blocked?', stakeholderAnswer: 'Closing ₹20k deficit', evidenceRequired: '7-day outflow schedule' },
      { id: 'Q3', dimension: 'Evidence', category: 'Available Data Sources', question: 'What records exist?', stakeholderAnswer: 'Case F 4 invoices', evidenceRequired: '₹1,00,000 control total' },
      { id: 'Q4', dimension: 'Permissions', category: 'System Join Limitation', question: 'Can we join Case F and G?', stakeholderAnswer: 'No join key exists', evidenceRequired: 'Zero join log' },
      { id: 'Q5', dimension: 'Decisions', category: 'Aging Calculation Rules', question: 'How are overdue days calculated?', stakeholderAnswer: '31 Oct baseline', evidenceRequired: 'Aging buckets' },
      { id: 'Q6', dimension: 'Evidence', category: 'Dispute Quarantine', question: 'How is Beacon dispute handled?', stakeholderAnswer: 'Quarantine ₹5,000', evidenceRequired: 'Dispute queue' },
      { id: 'Q7', dimension: 'Permissions', category: 'Scope Boundaries', question: 'Are SMS gateways included?', stakeholderAnswer: 'Strictly out of scope', evidenceRequired: 'Scope charter' },
      { id: 'Q8', dimension: 'Success', category: 'Measurable Success Metric', question: 'What proves success?', stakeholderAnswer: 'Zero variance to Case F', evidenceRequired: 'Reconciliation proof' },
    ],
    problemStatement: 'The Managing Director of Vayentra Labs lacks visibility into ₹1,00,000 across 4 outstanding client invoices, creating a ₹20,000 liquidity deficit against upcoming payroll obligations. Because sales leads and invoice ledgers lack verified data keys, collections teams cannot prioritize debtors. We will construct a 7-day cash deficit model and receivables aging schedule that reconciles to Case F with zero variance within 10 working days.',
    permissions: [
      { id: 'p1', title: 'Privacy', description: 'Confidential client data', isCompliant: true },
      { id: 'p2', title: 'Separation', description: 'Credit note approval separation', isCompliant: true },
      { id: 'p3', title: 'Read-only', description: 'Read-only bank access', isCompliant: true },
      { id: 'p4', title: 'No AI leak', description: 'No external AI upload', isCompliant: true },
      { id: 'p5', title: 'Boundary', description: 'Zero join between Case F and G', isCompliant: true },
    ],
    assumptions: [
      { id: 1, assumptionText: 'All 4 invoices collectible', invalidationTrigger: 'Beacon dispute upheld or Delta defaults', evidenceMitigation: 'Quarantine ₹5k' },
      { id: 2, assumptionText: 'Case G leads cover deficit', invalidationTrigger: 'No foreign key join exists', evidenceMitigation: 'Exclude unclosed leads' },
      { id: 3, assumptionText: 'Dashboard alone collects cash', invalidationTrigger: 'Software does not collect money without debtor contact', evidenceMitigation: 'Prioritized call list' },
    ],
    nextDiscoveryAction: 'Obtain signed dispute documentation from Beacon Logistics regarding the ₹5,000 service dispute, and schedule a 30-minute alignment call with the Managing Director to approve formal debtor escalation thresholds.',
    governance: {
      preparerName: 'Lead Discovery Analyst',
      reviewerName: 'Senior Project Manager',
      decisionOwnerName: 'Vayentra Labs Founder / MD',
      approvalStatus: 'Approved',
      signoffDate: '2026-11-06',
      fileVersion: 'StudentID_S17_v01.xlsx',
    },
    fileVersion: 'StudentID_S17_v01.xlsx',
  },
});

assert.strictEqual(s17Compliant.sessionId, 17);
assert.strictEqual(s17Compliant.overallStatus, 'reviewed');
assert.strictEqual(s17Compliant.stages.Work.checks.find(c => c.id === 's17-w1-interview-distinction')?.passed, true);
assert.strictEqual(s17Compliant.stages.Work.checks.find(c => c.id === 's17-w2-discovery-questions')?.passed, true);
assert.strictEqual(s17Compliant.stages.Work.checks.find(c => c.id === 's17-w3-case-separation')?.passed, true);
assert.strictEqual(s17Compliant.stages.Work.checks.find(c => c.id === 's17-w4-problem-statement')?.passed, true);
assert.strictEqual(s17Compliant.stages.Work.checks.find(c => c.id === 's17-w5-invalidating-assumptions')?.passed, true);
assert.strictEqual(s17Compliant.stages.Team.checks.find(c => c.id === 's17-t1-governance')?.passed, true);
assert.strictEqual(s17Compliant.stages.Team.checks.find(c => c.id === 's17-t2-rubric-compliance')?.passed, true);
console.log('✓ Session 17 Industry Challenge Discovery (interview simulator, 8 questions, 80-word statement, assumptions & permissions) verified.');

// ---------------------------------------------------------------------
// TEST 4-L: Session 18 — Solution Design and Project Planning (Capstone Charter)
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-L: Session 18 Solution Design and Project Planning (Capstone Charter) ---');
const s18Compliant = runAutomaticReview({
  sessionId: 18,
  lesson: { id: 18, title: 'Solution Design and Project Planning' },
  draft: {
    'concept:explain': 'Dynamic spreadsheet models allow live formula transparency and date refresh, whereas static presentations force clients to do manual mental math during cash crunches. A 10-day WBS with RACI designations strictly limits individual effort to <= 6 hours while 5 binary acceptance gates ensure zero-variance delivery.',
    'work-prompt:0': 'Option A (Dynamic Spreadsheet Prototype) is selected because it enables live formula transparency (=SUM, =MAX) and immediate recalculation when the Managing Director updates the As-Of Date. Option B (Static Slide Deck) provides only static images that cannot simulate collections timing or verify whether the ₹20,000 liquidity deficit is eliminated without error.',
    'work-prompt:1': 'Constructed 10-day WBS allocating 5 sequential work packages across 4 student team members, with maximum individual allocation capped at 3.0 hours (well below 6.0h ceiling).',
    'work-prompt:2': 'The capstone solution is handed over to the Managing Director and Accounts Lead of Vayentra Labs as a protected Excel workbook (StudentID_S18_v01.xlsx) with live formulas. In accordance with project governance, NO direct production database writes or automated external debtor notifications are authorized. All operational updates must be reviewed by the internal finance lead.',
    'team:contribution': 'Formulated 10-day WBS, evaluated architectural options, enforced 6.0-hour individual cap, and established 5 binary acceptance test gates.',
    'team:judgement': 'Strictly excluded automated external debtor emailing and production database writes to safeguard audit controls and client relationships.',
  },
  workstationData: {
    selectedSolution: 'option-a',
    solutionRationale: 'Option A (Dynamic Spreadsheet Prototype) is selected because it enables live formula transparency (=SUM, =MAX) and immediate recalculation when the Managing Director updates the As-Of Date. Option B (Static Slide Deck) provides only static images that cannot simulate collections timing or verify whether the ₹20,000 liquidity deficit is eliminated without error.',
    scopeItems: [
      { id: 'scope-1', title: 'Reviewed Ageing Queue', category: 'must-have', isIncluded: true },
      { id: 'scope-2', title: '7-Day Liquidity Deficit Model', category: 'must-have', isIncluded: true },
      { id: 'scope-3', title: 'Dispute Quarantine & Suspense', category: 'must-have', isIncluded: true },
      { id: 'scope-4', title: 'Client Handover Runbook', category: 'must-have', isIncluded: true },
      { id: 'scope-5', title: 'Automated Reminders Drafts', category: 'nice-to-have', isIncluded: true },
      { id: 'scope-6', title: 'Visual Executive KPI Charts', category: 'nice-to-have', isIncluded: false },
      { id: 'scope-7', title: 'Direct Production System Writes', category: 'exclusion', isIncluded: false },
      { id: 'scope-8', title: 'Automated External Sending', category: 'exclusion', isIncluded: false },
      { id: 'scope-9', title: 'Case F / Case G Join', category: 'exclusion', isIncluded: false },
    ],
    tasks: [
      { id: 'T1', task: 'Case F Ingestion & Reconcile', owner: 'Priya Sharma', raci: 'R', hours: 1.5, schedule: 'Days 1-2', dependency: 'Frozen Baseline' },
      { id: 'T2', task: 'Ageing Logic & Bucketing', owner: 'Arjun Kumar', raci: 'R', hours: 1.5, schedule: 'Days 3-4', dependency: 'T1' },
      { id: 'T3', task: 'Dispute Quarantine Engine', owner: 'Meera Nair', raci: 'R', hours: 1.0, schedule: 'Day 5', dependency: 'T2' },
      { id: 'T4', task: '7-Day Liquidity Forecast', owner: 'Priya Sharma', raci: 'R', hours: 1.5, schedule: 'Days 6-7', dependency: 'T2, T3' },
      { id: 'T5', task: 'Quality Acceptance & Handover', owner: 'Rahul Deshmukh', raci: 'A', hours: 1.5, schedule: 'Days 8-10', dependency: 'T4' },
    ],
    acceptanceCriteria: [
      { id: 'AC1', criterion: 'Case F Control Total Reconciliation', passed: true },
      { id: 'AC2', criterion: 'Due-Today Classification Rule', passed: true },
      { id: 'AC3', criterion: 'Beacon Logistics Dispute Quarantine', passed: true },
      { id: 'AC4', criterion: '7-Day Liquidity Deficit Feasibility Bridge', passed: true },
      { id: 'AC5', criterion: 'Governance & Scope Boundary Verification', passed: true },
    ],
    risks: [
      { id: 'R1', title: 'Attempted Live Production Writes', category: 'compliance', impact: 'Critical', probability: 'Low', mitigation: 'Strictly read-only model' },
      { id: 'R2', title: 'Scope Creep via Automated Dispatch', category: 'scope', impact: 'High', probability: 'Medium', mitigation: 'Internal draft review only' },
      { id: 'R3', title: 'Corrupt Cross-Dataset Joining', category: 'governance', impact: 'Critical', probability: 'Low', mitigation: 'Zero-join policy enforced' },
      { id: 'R4', title: 'Student Workload Exceeding 6h Cap', category: 'operational', impact: 'Medium', probability: 'Medium', mitigation: 'Strict 10-day WBS breakdown' },
    ],
    handoverNotes: 'The capstone solution is handed over to the Managing Director and Accounts Lead of Vayentra Labs as a protected Excel workbook (StudentID_S18_v01.xlsx) with live formulas. In accordance with project governance, NO direct production database writes or automated external debtor notifications are authorized. All operational updates must be reviewed by the internal finance lead.',
    governance: {
      preparerName: 'Priya Sharma (Financial Modeler)',
      reviewerName: 'Meera Nair (Risk & Audit Lead)',
      decisionOwnerName: 'Rahul Deshmukh (Engagement Lead / MD Proxy)',
      approvalStatus: 'Approved',
      signoffDate: '2026-11-06',
      fileVersion: 'StudentID_S18_v01.xlsx',
    },
    checkedIndices: [0, 1, 2, 3, 4],
    fileVersion: 'StudentID_S18_v01.xlsx',
  },
});

assert.strictEqual(s18Compliant.sessionId, 18);
assert.strictEqual(s18Compliant.overallStatus, 'reviewed');
assert.strictEqual(s18Compliant.stages.Work.checks.find(c => c.id === 's18-w1-solution-selection')?.passed, true);
assert.strictEqual(s18Compliant.stages.Work.checks.find(c => c.id === 's18-w2-scope-discipline')?.passed, true);
assert.strictEqual(s18Compliant.stages.Work.checks.find(c => c.id === 's18-w3-wbs-schedule')?.passed, true);
assert.strictEqual(s18Compliant.stages.Work.checks.find(c => c.id === 's18-w4-acceptance-tests')?.passed, true);
assert.strictEqual(s18Compliant.stages.Work.checks.find(c => c.id === 's18-w5-risk-handover')?.passed, true);
assert.strictEqual(s18Compliant.stages.Team.checks.find(c => c.id === 's18-t1-governance')?.passed, true);
assert.strictEqual(s18Compliant.stages.Team.checks.find(c => c.id === 's18-t2-rubric-compliance')?.passed, true);
console.log('✓ Session 18 Solution Design and Project Planning (architecture evaluation, scope discipline, 10-day WBS <= 6h, 5 acceptance gates, and read-only handover) verified.');

// ---------------------------------------------------------------------
// TEST 4-M: Session 19 — Project Execution and Quality Assurance (Prototype & QA)
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-M: Session 19 Project Execution and Quality Assurance (Prototype & QA) ---');
const s19Compliant = runAutomaticReview({
  sessionId: 19,
  lesson: { id: 19, title: 'Project Execution and Quality Assurance' },
  draft: {
    'concept:explain': 'Quality assurance checks normal execution and edge cases. In Case F version 1, date boundary testing proves that invoice F01 due on 31 October is Current, but reclassifies to 1-30 Days Overdue on 1 November while preserving the ₹1,00,000 control total with ₹0 variance.',
    'work-prompt:0': 'Constructed the dynamic ageing calculation engine using =MAX(0, $B$1 - DueDate) and built the automated suspense account isolation for the ₹5,000 disputed Beacon Retail debit note. Maintained raw Case F records in an immutable table and linked formulas to dynamic parameter cell $B$1.',
    'work-prompt:1': 'Before correction: During peer testing, the reviewer discovered that shifting the as-of date to 1 November failed to move invoice F01 because the formula contained a hardcoded date string "2026-10-31" in cell E2.\nAfter correction: Replaced hardcoded date with absolute cell reference $B$1. Verified that F01 instantly reclassifies to 1–30 Days Overdue on 1 November while control total ₹1,00,000 is perfectly preserved.',
    'team:contribution': 'Constructed dynamic ageing formulas, verified boundary date sensitivity, executed 5 QA acceptance tests, and resolved peer reviewer formula defect.',
    'team:judgement': 'Prohibited silent blank amount conversions and duplicate invoice IDs by implementing visible validation stop alerts.',
    'handover:summary': 'The audited receivables prototype v1.0 is handed over to the Managing Director and Accounts Lead of Vayentra Labs as a protected workbook (StudentID_S19_v01.xlsx). To refresh the model, the user updates the single As-Of Date cell ($B$1); all 4 overdue buckets recalculate dynamically. The disputed ₹5,000 remains quarantined in suspense. All 5 acceptance tests are verified PASS. NO live production system writes or automated debtor dispatch are authorized.',
  },
  workstationData: {
    asOfDate: '2026-10-31',
    qaChecks: [
      { id: 'QA-01', checkName: 'Data Types', status: 'VERIFIED PASS' },
      { id: 'QA-02', checkName: 'Dynamic Ranges', status: 'VERIFIED PASS' },
      { id: 'QA-03', checkName: 'Circular Reference Audit', status: 'VERIFIED PASS' },
      { id: 'QA-04', checkName: 'Duplicate & Blank Detector', status: 'VERIFIED PASS' },
    ],
    acceptanceTests: [
      { id: 'AT-01', testCategory: 'Normal source', verdict: 'PASS' },
      { id: 'AT-02', testCategory: 'Due today', verdict: 'PASS' },
      { id: 'AT-03', testCategory: 'As of next day', verdict: 'PASS' },
      { id: 'AT-04', testCategory: 'Duplicate invoice', verdict: 'PASS' },
      { id: 'AT-05', testCategory: 'Blank amount', verdict: 'PASS' },
    ],
    studentContribution: 'Constructed the dynamic ageing calculation engine using =MAX(0, $B$1 - DueDate) and built the automated suspense account isolation for the ₹5,000 disputed Beacon Retail debit note. Maintained raw Case F records in an immutable table and linked formulas to dynamic parameter cell $B$1.',
    reviewerCorrection: 'Before correction: During peer testing, the reviewer discovered that shifting the as-of date to 1 November failed to move invoice F01 because the formula contained a hardcoded date string "2026-10-31" in cell E2.\nAfter correction: Replaced hardcoded date with absolute cell reference $B$1. Verified that F01 instantly reclassifies to 1–30 Days Overdue on 1 November while control total ₹1,00,000 is perfectly preserved.',
    handoverSummary: 'The audited receivables prototype v1.0 is handed over to the Managing Director and Accounts Lead of Vayentra Labs as a protected workbook (StudentID_S19_v01.xlsx). To refresh the model, the user updates the single As-Of Date cell ($B$1); all 4 overdue buckets recalculate dynamically. The disputed ₹5,000 remains quarantined in suspense. All 5 acceptance tests are verified PASS. NO live production system writes or automated debtor dispatch are authorized.',
    governance: {
      preparerName: 'Priya Sharma (Financial Modeler)',
      reviewerName: 'Meera Nair (Risk & Audit Lead)',
      decisionOwnerName: 'Rahul Deshmukh (Engagement Lead / MD Proxy)',
      approvalStatus: 'Approved',
      signoffDate: '2026-11-07',
      fileVersion: 'StudentID_S19_v01.xlsx',
    },
    checkedIndices: [0, 1, 2, 3, 4],
    fileVersion: 'StudentID_S19_v01.xlsx',
  },
});

assert.strictEqual(s19Compliant.sessionId, 19);
assert.strictEqual(s19Compliant.overallStatus, 'reviewed');
assert.strictEqual(s19Compliant.stages.Work.checks.find(c => c.id === 's19-w1-prototype-prototype')?.passed, true);
assert.strictEqual(s19Compliant.stages.Work.checks.find(c => c.id === 's19-w2-date-sensitivity')?.passed, true);
assert.strictEqual(s19Compliant.stages.Work.checks.find(c => c.id === 's19-w3-acceptance-tests')?.passed, true);
assert.strictEqual(s19Compliant.stages.Work.checks.find(c => c.id === 's19-w4-exception-handling')?.passed, true);
assert.strictEqual(s19Compliant.stages.Work.checks.find(c => c.id === 's19-w5-peer-correction')?.passed, true);
assert.strictEqual(s19Compliant.stages.Team.checks.find(c => c.id === 's19-t1-governance')?.passed, true);
assert.strictEqual(s19Compliant.stages.Team.checks.find(c => c.id === 's19-t2-rubric-compliance')?.passed, true);
console.log('✓ Session 19 Project Execution and Quality Assurance (prototype v1.0, date sensitivity, 5 executed tests, exception alerts, and peer correction) verified.');

// ---------------------------------------------------------------------
// TEST 4-N: Session 20 — Management Review and Change Control (Model v2.0)
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-N: Session 20 Management Review and Change Control (Model v2.0) ---');
const s20Compliant = runAutomaticReview({
  sessionId: 20,
  lesson: { id: 20, title: 'Management Review and Change Control' },
  draft: {
    'concept:explain': 'A change request records authority, reason, affected outputs, and required regression tests. A credit note reduces receivables without creating a bank cash receipt. A payment deferral reschedules short-term cash outflow timing without altering historical expenses or total vendor liabilities. Model v1.0 must be preserved as the baseline audit trail.',
    'work-prompt:0': 'RT-01: PASS, RT-02: PASS, RT-03: PASS, RT-04: PASS, RT-05: PASS, RT-06: PASS',
    'work-prompt:1': 'To Managing Director & Board: Model v2.0 successfully incorporates two approved operational changes as of 31 October 2026. First, an approved ₹5,000 credit note issued to Beacon Retail resolves the invoice F02 damaged goods dispute, reducing gross receivables to ₹95,000 while injecting ₹0 new bank cash. Second, rescheduling ₹8,000 in non-critical supplier payments beyond Day 7 compresses mandatory outflows from ₹45,000 to ₹37,000. Against our ₹25,000 opening cash, the 7-day liquidity deficit contracts from -₹20,000 to -₹12,000. Prioritizing immediate collection of Asha Technologies (₹10,000, due today) will contain our remaining Friday liquidity shortfall to ₹2,000 without emergency borrowing.',
    'team:contribution': 'Engineered Version 2.0 change branch in receivables model, configured side-by-side delta schedule, implemented ₹5,000 credit note without cash distortion, and recalculated 7-day deficit to -₹12,000.',
    'team:judgement': 'Defended preservation of Model v1.0 against client request to delete it, maintaining corporate auditability and baseline verification.',
    'executive:memo': 'To Managing Director & Board: Model v2.0 successfully incorporates two approved operational changes as of 31 October 2026. First, an approved ₹5,000 credit note issued to Beacon Retail resolves the invoice F02 damaged goods dispute, reducing gross receivables to ₹95,000 while injecting ₹0 new bank cash. Second, rescheduling ₹8,000 in non-critical supplier payments beyond Day 7 compresses mandatory outflows from ₹45,000 to ₹37,000. Against our ₹25,000 opening cash, the 7-day liquidity deficit contracts from -₹20,000 to -₹12,000. Prioritizing immediate collection of Asha Technologies (₹10,000, due today) will contain our remaining Friday liquidity shortfall to ₹2,000 without emergency borrowing.',
  },
  workstationData: {
    activeVersion: 'v2.0',
    asOfDate: '2026-10-31',
    changeRequests: [
      { id: 'CR-01', changeType: 'Credit Note', authority: 'MD', reason: 'Damaged goods', status: 'APPROVED & APPLIED' },
      { id: 'CR-02', changeType: 'Supplier Deferral', authority: 'Finance Lead', reason: 'Cash timing', status: 'APPROVED & APPLIED' },
    ],
    regressionTests: [
      { id: 'RT-01', category: 'Total Reconcile', verdict: 'PASS' },
      { id: 'RT-02', category: 'Due Today', verdict: 'PASS' },
      { id: 'RT-03', category: 'Next Day Shift', verdict: 'PASS' },
      { id: 'RT-04', category: 'Duplicate Halt', verdict: 'PASS' },
      { id: 'RT-05', category: 'Blank Halt', verdict: 'PASS' },
      { id: 'RT-06', category: 'Non-Cash Invariance', verdict: 'PASS' },
    ],
    versionDefense: 'Client Pushback Defense: Client requested deleting Model v1.0 to avoid operational confusion. We firmly declined: Model v1.0 represents the certified baseline against which all change orders, dispute resolutions, and liquidity variances are measured. Deleting v1.0 destroys the audit trail and violates corporate change control governance.',
    executiveMemo: 'To Managing Director & Board: Model v2.0 successfully incorporates two approved operational changes as of 31 October 2026. First, an approved ₹5,000 credit note issued to Beacon Retail resolves the invoice F02 damaged goods dispute, reducing gross receivables to ₹95,000 while injecting ₹0 new bank cash. Second, rescheduling ₹8,000 in non-critical supplier payments beyond Day 7 compresses mandatory outflows from ₹45,000 to ₹37,000. Against our ₹25,000 opening cash, the 7-day liquidity deficit contracts from -₹20,000 to -₹12,000. Prioritizing immediate collection of Asha Technologies (₹10,000, due today) will contain our remaining Friday liquidity shortfall to ₹2,000 without emergency borrowing.',
    studentContribution: 'Engineered Version 2.0 change branch in receivables model, configured side-by-side delta schedule, implemented ₹5,000 credit note without cash distortion, and recalculated 7-day deficit to -₹12,000.',
    reviewerCorrection: 'Before correction: Preliminary draft initially treated the ₹5,000 credit note as incoming cash, incorrectly reporting opening cash as ₹30,000. Peer correction: Fixed cash flow model to maintain bank cash strictly invariant at ₹25,000.',
    governance: {
      preparerName: 'Priya Sharma (Financial Modeler)',
      reviewerName: 'Meera Nair (Risk & Audit Lead)',
      decisionOwner: 'Managing Director (Vayentra Labs)',
      auditStatus: 'Verified PASS (Ready for Handover)',
      fileVersion: 'StudentID_S20_v01.xlsx',
    },
  },
});

assert.strictEqual(s20Compliant.sessionId, 20);
assert.strictEqual(s20Compliant.overallStatus, 'reviewed');
assert.strictEqual(s20Compliant.stages.Work.checks.find(c => c.id === 's20-w1-ccb-log')?.passed, true);
assert.strictEqual(s20Compliant.stages.Work.checks.find(c => c.id === 's20-w2-model-v2-recalculation')?.passed, true);
assert.strictEqual(s20Compliant.stages.Work.checks.find(c => c.id === 's20-w3-non-cash-credit-audit')?.passed, true);
assert.strictEqual(s20Compliant.stages.Work.checks.find(c => c.id === 's20-w4-regression-tests')?.passed, true);
assert.strictEqual(s20Compliant.stages.Work.checks.find(c => c.id === 's20-w5-version-defense')?.passed, true);
assert.strictEqual(s20Compliant.stages.Work.checks.find(c => c.id === 's20-w6-executive-memo')?.passed, true);
assert.strictEqual(s20Compliant.stages.Team.checks.find(c => c.id === 's20-t1-governance')?.passed, true);
assert.strictEqual(s20Compliant.stages.Team.checks.find(c => c.id === 's20-t2-rubric-compliance')?.passed, true);
console.log('✓ Session 20 Management Review and Change Control (Model v2.0, CCB log, non-cash credit audit, 5 regression tests, and executive memo) verified.');

// ---------------------------------------------------------------------
// TEST 4-O: Session 21 — Resume and Portfolio Development
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-O: Session 21 Resume and Portfolio Development ---');
const s21Compliant = runAutomaticReview({
  sessionId: 21,
  lesson: { id: 21, title: 'Resume and Portfolio Development' },
  draft: {
    'concept:explain': 'A credible achievement names the task, method, scale, result, and context. Supervised simulation work is valuable when described honestly using the Google XYZ formula. Inflated claims such as boosting live corporate profit 40% fail background verification.',
    'work-prompt:1': 'Commerce and finance professional specializing in financial modeling, statutory accounting compliance, and enterprise AI auditing through rigorous simulation projects. Independently reconciled ₹1,00,000 in receivables schedules with zero variance, structured three-column bank reconciliations with timing bridges, and governed project scope within disciplined deadlines. Adept at auditing generative AI outputs under DPDP standards, constructing fail-closed spreadsheet controls, and translating complex financial data into executive management updates. Seeking a Junior Financial Analyst or Compliance Associate role to deploy verified analytical rigor in corporate operations.',
    'team:contribution': 'Curated and indexed 6 authentic VCEP project artifacts covering accounting, reconciliation, MIS, GST audit, AI governance, and capstone change control. Authored 3 high-impact Google XYZ resume bullets explicitly identifying the simulated project context to prevent misrepresentation.',
    'team:judgement': 'Before Review Defect: Preliminary draft claimed "Improved company profit by 40% and managed corporate client accounts", misrepresenting simulation. Peer Reviewer Correction: Restructured into an authentic Google XYZ bullet prefaced with [Simulated Project] and verified by artifact VCEP-ART-S20.',
  },
  workstationData: {
    bullets: [
      {
        id: 'B1',
        domain: 'Financial Modeling & Working Capital',
        contextTag: '[Simulated Project]',
        fullText: '[Simulated Project] Engineered a 4-account receivables ageing model reconciling ₹1,00,000 in overdue invoices with zero variance, and structured a 7-day liquidity forecast contracting a ₹20,000 deficit to ₹12,000 via vendor payment rescheduling.',
        isSimulatedFlagged: true,
        status: 'AUTHENTIC',
      },
      {
        id: 'B2',
        domain: 'Statutory Accounting & Forensic Audit',
        contextTag: '[Simulated Project]',
        fullText: '[Simulated Project] Structured multi-source accounting reconciliations across general ledger, bank, and GST returns, verifying ₹83,200 adjusted bank cash with zero variance and quarantining ₹5,000 in ineligible input tax credit.',
        isSimulatedFlagged: true,
        status: 'AUTHENTIC',
      },
      {
        id: 'B3',
        domain: 'Responsible AI Auditing & Quality Assurance',
        contextTag: '[Simulated Project]',
        fullText: '[Simulated Project] Audited generative AI commercial models under DPDP standards, catching 4 numerical hallucinations including a 5% margin discrepancy and engineering automated fail-closed spreadsheet controls.',
        isSimulatedFlagged: true,
        status: 'AUTHENTIC',
      },
    ],
    portfolio: [
      { id: 'VCEP-ART-S06', category: 'Accounting', deliverableFile: 'StudentID_S06_v01.xlsx', verificationHash: 'SHA-S06-TB-218K-BALANCED' },
      { id: 'VCEP-ART-S08', category: 'Reconciliation', deliverableFile: 'StudentID_S08_v01.xlsx', verificationHash: 'SHA-S08-BRS-83.2K-VERIFIED' },
      { id: 'VCEP-ART-S10', category: 'MIS', deliverableFile: 'StudentID_S10_v01.xlsx', verificationHash: 'SHA-S10-MIS-DASH-150K' },
      { id: 'VCEP-ART-S11', category: 'Invoice review', deliverableFile: 'StudentID_S11_v01.xlsx', verificationHash: 'SHA-S11-GST-ITC-MATCHED' },
      { id: 'VCEP-ART-S14', category: 'AI verification', deliverableFile: 'StudentID_S14_v01.docx', verificationHash: 'SHA-S14-AIV-FAIL-CLOSED' },
      { id: 'VCEP-ART-S20', category: 'Capstone', deliverableFile: 'StudentID_S20_v01.xlsx', verificationHash: 'SHA-S20-CCB-MODEL-V2' },
    ],
    summaryText: 'Commerce and finance professional specializing in financial modeling, statutory accounting compliance, and enterprise AI auditing through rigorous simulation projects. Independently reconciled ₹1,00,000 in receivables schedules with zero variance, structured three-column bank reconciliations with timing bridges, and governed project scope within disciplined deadlines. Adept at auditing generative AI outputs under DPDP standards, constructing fail-closed spreadsheet controls, and translating complex financial data into executive management updates. Seeking a Junior Financial Analyst or Compliance Associate role to deploy verified analytical rigor in corporate operations.',
    recruiterChallenge: {
      selectedClaimId: 'B1',
      calculationProof: 'Mathematical Proof: Total Receivables = =SUM(D2:D5) = ₹95,000 across 4 accounts after ₹5,000 credit note. Cash Deficit: ₹25,000 opening cash - ₹37,000 7-day outflows (after ₹8,000 supplier deferral) = -₹12,000 deficit. Bank cash invariant at ₹25,000.',
      skillGapIdentified: 'Advanced DCF modeling and automated PowerQuery ETL pipeline integration.',
      nextPracticeTask: 'Construct a dynamic three-statement corporate forecasting model in Excel.',
      challengeCompleted: true,
    },
    studentContribution: 'Curated and indexed 6 authentic VCEP project artifacts covering accounting, reconciliation, MIS, GST audit, AI governance, and capstone change control. Authored 3 high-impact Google XYZ resume bullets explicitly identifying the simulated project context to prevent misrepresentation.',
    reviewerCorrection: 'Before Review Defect: Preliminary draft claimed "Improved company profit by 40% and managed corporate client accounts", misrepresenting simulation. Peer Reviewer Correction: Restructured into an authentic Google XYZ bullet prefaced with [Simulated Project] and verified by artifact VCEP-ART-S20.',
    governance: {
      preparerName: 'Candidate Student',
      reviewerName: 'Peer Recruiter (QA Lead)',
      decisionOwner: 'Hiring Manager (Placement Lead)',
      fileVersion: 'StudentID_S21_v01.docx',
    },
  },
});

assert.strictEqual(s21Compliant.sessionId, 21);
assert.strictEqual(s21Compliant.overallStatus, 'reviewed');
assert.strictEqual(s21Compliant.stages.Work.checks.find(c => c.id === 's21-w1-xyz-bullets')?.passed, true);
assert.strictEqual(s21Compliant.stages.Work.checks.find(c => c.id === 's21-w2-portfolio-index')?.passed, true);
assert.strictEqual(s21Compliant.stages.Work.checks.find(c => c.id === 's21-w3-summary-words')?.passed, true);
assert.strictEqual(s21Compliant.stages.Work.checks.find(c => c.id === 's21-w4-recruiter-challenge')?.passed, true);
assert.strictEqual(s21Compliant.stages.Team.checks.find(c => c.id === 's21-t1-governance')?.passed, true);
assert.strictEqual(s21Compliant.stages.Team.checks.find(c => c.id === 's21-t2-rubric-compliance')?.passed, true);
console.log('✓ Session 21 Resume and Portfolio Development (3 XYZ bullets, 6-item portfolio index, 90-word summary, and recruiter defense) verified.');

// ---------------------------------------------------------------------
// TEST 4-P: Session 22 — Hiring Simulation and Exit Assessment
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-P: Session 22 Hiring Simulation and Exit Assessment ---');
const s22Compliant = runAutomaticReview({
  sessionId: 22,
  lesson: { id: 22, title: 'Hiring Simulation and Exit Assessment' },
  draft: {
    'concept:explain': 'Controlled exit assessment requires strict adherence to diagnostic conditions without unauthorized assistance. Practical interview tests execution and reasoning under clear constraints: ask clarification questions, show workings, and label uncertainty.',
    'work-prompt:0': 'The candidate demonstrated exceptional technical reasoning and mathematical clarity during the viva voce. Formulas, ledger reconciliations, and timing bridges were explained with precision. The candidate firmly articulated the non-cash nature of credit notes and displayed uncompromising ethical resilience when challenged with the suspense plug scenario.',
    'work-prompt:1': 'My strongest independent accomplishment was engineering the Case F Version 2.0 working capital and change control model. When an approved ₹5,000 credit note was issued to Beacon Retail and an ₹8,000 supplier payment was deferred beyond Day 7, I proved mathematically that accounts receivable contracted to ₹95,000, the 7-day cash gap contracted to -₹12,000, and opening bank cash remained strictly invariant at ₹25,000.',
    'team:contribution': 'Completed the 60-minute unseen Exit B practical assessment independently under strict examination conditions. Structured three comprehensive STAR+V interview evidence cases covering receivables modeling, non-cash credit note correction, and ethical escalation. Formulated a 30-day post-assessment capability development plan.',
    'team:judgement': 'If a manager instructed me to remove an unverified ₹5,000 suspense item or plug a discrepancy to close the books on Friday, I would firmly refuse. Under ICAI professional standards, writing off or concealing unreconciled balances without source vouchers constitutes fraudulent financial misstatement. I would maintain the ₹5,000 in an isolated suspense account and escalate to the Finance Director.',
  },
  workstationData: {
    interviewEvidence: [
      {
        id: 'IE-01',
        prompt: 'A task I completed',
        title: 'Case F Receivables Ageing & 7-Day Liquidity Forecast Model',
        situation: 'Client faced an impending Friday payroll default with a -₹20,000 cash deficit and ₹1,00,000 in unstratified receivables.',
        personalTask: 'Independently built a dynamic 4-account ageing schedule and 7-day liquidity forecast linking opening bank cash and supplier outflows.',
        actionTaken: 'Applied ISO date boundary formulas, isolated ₹5,000 debit note dispute in suspense, and evaluated a supplier payment rescheduling order.',
        resultVerified: 'Reconciled ₹95,000 receivables total with zero variance and contracted net cash deficit to -₹12,000, proving bank cash remained strictly invariant at ₹25,000.',
        evidenceRef: 'VCEP-ART-S20 / StudentID_S20_v01.xlsx',
      },
      {
        id: 'IE-02',
        prompt: 'An error I corrected',
        title: 'Non-Cash Credit Note Accounting Violation Correction',
        situation: 'Preliminary model draft treated an approved ₹5,000 credit note issued to Beacon Retail as a bank cash collection, inflating opening cash to ₹30,000.',
        personalTask: 'Audit the general ledger cash flow schedule and enforce statutory accounting principles regarding non-cash debt extinguishment.',
        actionTaken: 'Corrected double-entry journals to debit Sales Returns and credit Accounts Receivable without debiting Bank Cash; isolated cash ledger account 1010.',
        resultVerified: 'Restored opening bank cash to invariant ₹25,000; accurately reflected true remaining 7-day cash gap of -₹12,000, preventing operational overdraft.',
        evidenceRef: 'VCEP-ART-S20 / Regression Test RT-06',
      },
      {
        id: 'IE-03',
        prompt: 'A decision I escalated',
        title: 'Ethical Refusal to Plug ₹5,000 Disputed Suspense Balance',
        situation: 'A fictional corporate manager pressured the accounting team to remove an unverified ₹5,000 damaged goods dispute from suspense to force the trial balance to cross-foot.',
        personalTask: 'Uphold professional accounting ethics under ICAI standards, prevent financial misstatement, and protect the immutable audit trail.',
        actionTaken: 'Respectfully refused to write off or plug the unverified item; documented the vendor claim in a formal Change Control Board register and escalated through approved compliance channels.',
        resultVerified: 'Prevented fraudulent financial misstatement; secured formal credit note authorization (CR-01) backed by debit notes and management review signoff.',
        evidenceRef: 'VCEP-ART-S20 / CCB Change Order CR-01',
      },
    ],
    developmentPlan: [
      {
        milestone: 'Milestone 1 (Day 1–10)',
        capabilityGap: 'Advanced three-statement DCF financial modeling and automated PowerQuery ETL pipeline integration.',
        practiceAction: 'Construct a dynamic three-statement corporate forecasting model linking income statement, balance sheet, and debt sweep cash waterfall in Excel.',
        reviewDate: 'Day 10 (Post-Exit B Review)',
      },
      {
        milestone: 'Milestone 2 (Day 11–20)',
        capabilityGap: 'Statutory GST input tax credit (ITC) reconciliation under GSTR-2B and statutory Rule 36(4) restrictions.',
        practiceAction: 'Re-run statutory tax invoice compliance audits matching 50 purchase register transactions against GSTR-2B data, identifying and quarantining non-compliant vendors.',
        reviewDate: 'Day 20 (Mid-Month Review)',
      },
      {
        milestone: 'Milestone 3 (Day 21–30)',
        capabilityGap: 'Verbal articulation of financial sensitivity trade-offs and capital allocation under interview time constraints.',
        practiceAction: 'Conduct timed mock viva presentations explaining breakeven shifts, capacity constraints, and unit economics to non-finance executive hiring panels.',
        reviewDate: 'Day 30 (Final Certification Handover)',
      },
    ],
    strongestTaskReflection: 'My strongest independent accomplishment was engineering the Case F Version 2.0 working capital and change control model. When an approved ₹5,000 credit note was issued to Beacon Retail and an ₹8,000 supplier payment was deferred beyond Day 7, I proved mathematically that accounts receivable contracted to ₹95,000, the 7-day cash gap contracted to -₹12,000, and opening bank cash remained strictly invariant at ₹25,000.',
    ethicalResponse: 'If a manager instructed me to remove an unverified ₹5,000 suspense item or plug a discrepancy to close the books on Friday, I would firmly refuse. Under ICAI professional standards, writing off or concealing unreconciled balances without source vouchers constitutes fraudulent financial misstatement. I would maintain the ₹5,000 in an isolated suspense account and escalate to the Finance Director.',
    interviewerFeedback: 'The candidate demonstrated exceptional technical reasoning and mathematical clarity during the viva voce. Formulas, ledger reconciliations, and timing bridges were explained with precision. The candidate firmly articulated the non-cash nature of credit notes and displayed uncompromising ethical resilience when challenged with the suspense plug scenario.',
    studentContribution: 'Completed the 60-minute unseen Exit B practical assessment independently under strict examination conditions. Structured three comprehensive STAR+V interview evidence cases covering receivables modeling, non-cash credit note correction, and ethical escalation. Formulated a 30-day post-assessment capability development plan.',
    reviewerCorrection: 'Before Interview Defect: Candidate initially struggled to explain the mathematical mechanism by which an ₹8,000 supplier deferral narrows the 7-day cash gap without reducing vendor liabilities. Peer Reviewer Correction: Interviewer challenged candidate to distinguish short-term cash flow timing from accrued balance sheet liabilities; candidate successfully demonstrated that total accounts payable remains unaltered while 7-day liquidity contracts by ₹8,000.',
    governance: {
      preparerName: 'Candidate Student',
      reviewerName: 'Dr. Anita Roy (Faculty QA / Panel Lead)',
      decisionOwner: 'Prof. Rajesh Menon (Placement Director)',
      fileVersion: 'StudentID_S22_v01.docx',
    },
  },
});

assert.strictEqual(s22Compliant.sessionId, 22);
assert.strictEqual(s22Compliant.overallStatus, 'reviewed');
assert.strictEqual(s22Compliant.stages.Work.checks.find(c => c.id === 's22-w1-interview-evidence')?.passed, true);
assert.strictEqual(s22Compliant.stages.Work.checks.find(c => c.id === 's22-w2-ethical-escalation')?.passed, true);
assert.strictEqual(s22Compliant.stages.Work.checks.find(c => c.id === 's22-w3-development-plan')?.passed, true);
assert.strictEqual(s22Compliant.stages.Team.checks.find(c => c.id === 's22-t1-governance')?.passed, true);
assert.strictEqual(s22Compliant.stages.Team.checks.find(c => c.id === 's22-t2-rubric-compliance')?.passed, true);
console.log('✓ Session 22 Hiring Simulation and Exit Assessment (3 STAR+V cases, ethical defense, 30-day plan, and viva panel feedback) verified.');

// ---------------------------------------------------------------------
// TEST 4-Q: Session 23 — Corporate Presentation Preparation
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-Q: Session 23 Corporate Presentation Preparation ---');
const s23Compliant = runAutomaticReview({
  sessionId: 23,
  lesson: { id: 23, title: 'Corporate Presentation Preparation' },
  draft: {
    'concept:explain': 'Executive presentations persuade through evidence, structure, and live verification. Senior leaders require concise briefings: Problem Context (1 min) → Methodology & Evidence (1 min) → Live Model Demo (3 min) → Commercial Counter-Proposal (1 min) → Governance & Boundaries (1 min).',
    'work-prompt:0': '1. Challenge questions: 10% discount trap proved to yield ₹0 profit at 100% capacity; Beacon default mitigated by Asha collection; CRM pipeline separated due to lack of relational join key.',
    'work-prompt:1': '1. Navigate to "Control Total" sheet: Point to cell E6 showing ₹95,000 reconciled to source records.\n2. In cell B2, toggle As-Of Date from 2026-10-31 to 2026-11-01: Show the audience how invoice F01 shifts automatically from Current into 1–30 Days Overdue while the total remains ₹95,000.\n3. Navigate to "Cash Forecast" sheet: Highlight line 14 showing mandatory outflows reduced to ₹37,000 following the ₹8,000 deferral, leaving our deficit at ₹12,000.\n4. Show the collections recovery scenario: Adding Asha Technologies (₹10,000) produces a viable closing bank balance of ₹3,000 by Friday.',
    'team:contribution': 'Designed and formatted Slides 3 and 4 covering Model v2.0 change orders and the live demonstration protocol. Rehearsed the 3-minute dynamic aging demonstration in Excel and formulated the mathematical defense for the 10% commercial discount challenge.',
    'team:judgement': 'Before Rehearsal Defect: Preliminary script stated that deferring an ₹8,000 supplier payment decreased company liabilities by ₹8,000. Peer Reviewer Correction: Interviewer challenged candidate to clarify that total balance sheet accounts payable remains unchanged; candidate corrected the script to explain that deferral solely shifts 7-day cash flow timing.',
  },
  workstationData: {
    agenda: [
      { id: 'A1', minuteRange: '0:00 – 1:00', durationMinutes: 1, sectionName: 'Problem Statement & Liquidity Context', assignedSpeaker: 'Rahul D. (Engagement Lead)', coreObjective: 'Introduce Vayentra Labs context and highlight the ₹20,000 Friday payroll deficit.' },
      { id: 'A2', minuteRange: '1:00 – 2:00', durationMinutes: 1, sectionName: 'Financial Baseline & Case F Evidence', assignedSpeaker: 'Priya S. (Financial Modeler)', coreObjective: 'Present the ₹1,00,000 receivables ledger and the ₹25,000 opening bank balance.' },
      { id: 'A3', minuteRange: '2:00 – 5:00', durationMinutes: 3, sectionName: 'Live Working Demonstration (Model v2.0)', assignedSpeaker: 'Priya S. & Arjun K. (Modeler & Analyst)', coreObjective: 'Show live dynamic aging shift (+1 day) and demonstrate deficit reduction to ₹12,000.' },
      { id: 'A4', minuteRange: '5:00 – 6:00', durationMinutes: 1, sectionName: 'Commercial Decision & Counter-Proposal', assignedSpeaker: 'Meera N. (Commercial Strategist)', coreObjective: 'Prove why the 10% discount yields ₹0 incremental gain and propose tiered pricing.' },
      { id: 'A5', minuteRange: '6:00 – 7:00', durationMinutes: 1, sectionName: 'Governance, Limitations & Handover', assignedSpeaker: 'Rahul D. (Engagement Lead)', coreObjective: 'State explicit scope exclusions (no CRM join key) and invite panel questions.' },
    ],
    slides: [
      { slideNum: 1, title: 'Executive Overview & Squad Roles', keyPoints: ['Vayentra Labs Capstone Project', 'Squad roles and RACI assignments', '7-Minute briefing with 3-minute demo'], evidenceReference: 'Session 18 Project Charter' },
      { slideNum: 2, title: 'The Liquidity Challenge: ₹20,000 Deficit', keyPoints: ['₹1,00,000 receivables locked', '₹25k bank cash vs ₹45k outflows', 'Urgent payroll deficit'], evidenceReference: 'Case F Baseline Ledger' },
      { slideNum: 3, title: 'Model v2.0 Architecture & Approved Changes', keyPoints: ['₹5k credit note on F02 (₹95k total)', '₹8k supplier outflow deferred', 'Deficit compressed to -₹12,000'], evidenceReference: 'Change Control Log CR-01 & CR-02' },
      { slideNum: 4, title: 'Live Working Demonstration (3 Minutes)', keyPoints: ['Dynamic As-Of Date sensitivity', '₹95,000 invariant control total', '7-day cash forecast recovery'], evidenceReference: 'Live Excel Model v2.0' },
      { slideNum: 5, title: 'Commercial Decision: The 10% Discount Trap', keyPoints: ['25 seats @ ₹10k = ₹30k profit', '30 seats @ ₹9k = identical ₹30k profit', 'Counter-proposal: Tiered pricing'], evidenceReference: 'Session 16 Break-Even Simulator' },
      { slideNum: 6, title: 'Governance, Scope Boundaries & Reviewer Handover', keyPoints: ['Strict Case F and Case G isolation', '6.0 hours individual effort cap respected', 'Read-only handover package'], evidenceReference: 'Quality Assurance Test Register' },
    ],
    execSummary: {
      problemContext: 'Vayentra Labs faced an acute Friday payroll crisis with a -₹20,000 cash deficit. Opening bank cash was ₹25,000 against unavoidable seven-day operating outflows of ₹45,000, while ₹1,00,000 in customer receivables remained unstratified and overdue.',
      sourceEvidence: 'Case F baseline records established four unpaid invoices totaling ₹1,00,000: Asha Technologies (F01: ₹10,000), Beacon Logistics (F02: ₹20,000), Cedar Enterprises (F03: ₹30,000), and Delta Systems (F04: ₹40,000). Beacon disputed ₹5,000 within F02.',
      workingDemoMethod: 'Model v2.0 applies dynamic ISO date formulas (=MAX(0, AsOfDate - DueDate)) and formal CCB changes: a ₹5,000 credit note on F02 contracted receivables to ₹95,000, and an ₹8,000 vendor deferral compressed 7-day outflows to ₹37,000, narrowing the deficit to -₹12,000 while opening cash remained invariant at ₹25,000.',
      commercialDecision: 'Rejected a blanket 10% discount on 30 seats, which mathematically generates ₹0 incremental profit (₹30,000 vs baseline ₹30,000) while exhausting 100% capacity. Recommended tiered pricing for seats 26–30 to secure ₹5,000 in incremental operating profit.',
      scopeLimitations: 'Case F receivables invoices and Case G CRM sales inquiries share no common identifier or primary key; combining them violates audit integrity. Student effort was strictly disciplined under the approved 6.0-hour cap.',
      nextStepsHandover: 'Deliver the password-protected, read-only Model v2.0 workbook to the Head of Finance, establish a daily 9:00 AM as-of date refresh routine, and isolate disputed balances in suspense until physical credit notes are executed.',
    },
    challenges: [
      { id: 'CH-01', reviewerQuestion: 'Why did your squad recommend against offering a 10% discount on all 30 seats?', squadDefenseStrategy: 'We proved mathematically that selling 30 seats at ₹9,000 generates exactly ₹30,000 profit—identical to our 25-seat baseline. The company would take on 5 additional client accounts and operate at 100% capacity with zero reserve buffer for ₹0 incremental profit.', studentDefenseAnswer: 'Selling 30 seats at ₹9,000 generates ₹2,70,000 revenue. With ₹4,000 variable costs per seat (₹1,20,000 total) and ₹1,20,000 fixed overheads, net profit is ₹30,000—exactly equal to 25 seats at standard price.' },
      { id: 'CH-02', reviewerQuestion: 'What contingency exists if Beacon Logistics refuses to pay the remaining ₹15,000?', squadDefenseStrategy: 'Model v2.0 already isolated Beacon in suspense. Our ₹12,000 deficit is resolved by collecting Asha Technologies (₹10,000) and drawing ₹2,000 from working capital reserves, leaving operational payroll safe even in a total Beacon default.', studentDefenseAnswer: 'Our liquidity forecast does not rely on Beacon F02 for Friday payroll. By collecting Asha F01 (₹10,000, due 31 Oct), our remaining gap is just ₹2,000, which is comfortably absorbed by available bank reserves.' },
      { id: 'CH-03', reviewerQuestion: 'Why did you not combine the CRM sales pipeline with your receivables workbook?', squadDefenseStrategy: 'As confirmed in our discovery phase (Session 17), Case F accounting invoices and Case G CRM inquiries share no primary key or foreign identifier. Merging them would create false relational links and violate data boundary integrity.', studentDefenseAnswer: 'Case F invoices have statutory tax voucher IDs, whereas Case G leads are top-of-funnel marketing inquiries. There is no unique join key between them. Merging them into general ledger receivables violates Ind AS 115 and corrupts audit trails.' },
    ],
    demoScript: '1. Navigate to "Control Total" sheet: Point to cell E6 showing ₹95,000 reconciled to source records.\n2. In cell B2, toggle As-Of Date from 2026-10-31 to 2026-11-01: Show the audience how invoice F01 shifts automatically from Current into 1–30 Days Overdue while the total remains ₹95,000.\n3. Navigate to "Cash Forecast" sheet: Highlight line 14 showing mandatory outflows reduced to ₹37,000 following the ₹8,000 deferral, leaving our deficit at ₹12,000.\n4. Show the collections recovery scenario: Adding Asha Technologies (₹10,000) produces a viable closing bank balance of ₹3,000 by Friday.',
    checkedPermissions: ['P1', 'P2', 'P3', 'P4', 'P5'],
    studentContribution: 'Designed and formatted Slides 3 and 4 covering Model v2.0 change orders and the live demonstration protocol. Rehearsed the 3-minute dynamic aging demonstration in Excel and formulated the mathematical defense for the 10% commercial discount challenge.',
    reviewerCorrection: 'Before Rehearsal Defect: Preliminary script stated that deferring an ₹8,000 supplier payment decreased company liabilities by ₹8,000. Peer Reviewer Correction: Interviewer challenged candidate to clarify that total balance sheet accounts payable remains unchanged; candidate corrected the script to explain that deferral solely shifts 7-day cash flow timing.',
    governance: {
      preparerName: 'Candidate Student (Squad Lead)',
      reviewerName: 'Dr. Anita Roy (Faculty QA / Peer Reviewer)',
      decisionOwner: 'Prof. Rajesh Menon (Managing Director / Board Chair)',
      fileVersion: 'StudentID_S23_v01.pptx',
    },
  },
});

assert.strictEqual(s23Compliant.sessionId, 23);
assert.strictEqual(s23Compliant.overallStatus, 'reviewed');
assert.strictEqual(s23Compliant.stages.Work.checks.find(c => c.id === 's23-w1-slide-deck')?.passed, true);
assert.strictEqual(s23Compliant.stages.Work.checks.find(c => c.id === 's23-w2-exec-summary')?.passed, true);
assert.strictEqual(s23Compliant.stages.Work.checks.find(c => c.id === 's23-w3-rehearsal-timer')?.passed, true);
assert.strictEqual(s23Compliant.stages.Work.checks.find(c => c.id === 's23-w4-reviewer-defense')?.passed, true);
assert.strictEqual(s23Compliant.stages.Team.checks.find(c => c.id === 's23-t1-governance')?.passed, true);
assert.strictEqual(s23Compliant.stages.Team.checks.find(c => c.id === 's23-t2-rubric-compliance')?.passed, true);
console.log('✓ Session 23 Corporate Presentation Preparation (6 slides, 1-page summary, 7m rehearsal, 3m demo, and Q&A defenses) verified.');

// ---------------------------------------------------------------------
// TEST 4-R: Session 24 — Corporate Demo Day and Industry Passport
// ---------------------------------------------------------------------
console.log('\n--- TEST 4-R: Session 24 Corporate Demo Day and Industry Passport ---');
const s24Compliant = runAutomaticReview({
  sessionId: 24,
  lesson: { id: 24, title: 'Corporate Demo Day and Industry Passport' },
  draft: {
    'concept:explain': 'The VCEP Industry Passport is a competency-based professional transcript validating demonstrated workplace capabilities. Unlike traditional certificates of completion, the Passport records verifiable artifact IDs, objective scorecards, faculty sign-offs, and explicit skill boundaries.',
    'work-prompt:0': 'Judge feedback noted flawless execution of Model v2.0 dynamic demonstration. Personal defense justified the non-cash credit note journal entry and suspense account isolation without balance sheet liabilities distortion.',
    'work-prompt:1': 'Industry Passport audit verified all 6 core competencies: Finance Execution (S07/S20), Business Technology (S10/S19), Business Judgement (S16/S23), AI Verification (S13/S14), Communication (S03/S23), and Professional Practice (S18/S20).',
    'work-prompt:2': '90-day career acceleration plan formulated across three 30-day horizons: advanced modeling with Power BI/PowerQuery, two published case studies on professional networks, and targeted corporate FP&A interviews.',
    'team:contribution': 'Delivered the 7-minute squad capstone briefing and independently defended Exhibit EX-03 (Model v2.0 Change Control Board Log) during the 2-minute individual defense station. Verified all six Industry Passport competency domains against authenticated VCEP artifact hashes.',
    'team:judgement': 'Before Defense Defect: Preliminary defense claimed that deferring an ₹8,00,00 supplier payment decreased balance sheet accounts payable. Peer Reviewer Correction: Faculty lead challenged candidate on liability timing; candidate corrected the defense to articulate that total vendor liabilities remain unchanged while 7-day liquidity contracts by ₹8,000.',
  },
  workstationData: {
    exhibits: [
      { id: 'EX-01', artifactId: 'VCEP-ART-S18', title: 'Capstone Project Charter & Scope Work Breakdown (WBS)', curriculumSession: 'Session 18', keyMetric: '10-Day Delivery Schedule', fileLink: 'StudentID_S18_v01.xlsx' },
      { id: 'EX-02', artifactId: 'VCEP-ART-S19', title: 'Model v1.0 Prototype & 5 Executed QA Test Logs', curriculumSession: 'Session 19', keyMetric: '5 Verified Regression Tests', fileLink: 'StudentID_S19_v01.xlsx' },
      { id: 'EX-03', artifactId: 'VCEP-ART-S20', title: 'Model v2.0 Change Control Board Log & Liquidity Bridge', curriculumSession: 'Session 20', keyMetric: '₹95,000 Receivables / -₹12,000 Deficit', fileLink: 'StudentID_S20_v01.xlsx' },
      { id: 'EX-04', artifactId: 'VCEP-ART-S22', title: 'Exit B Controlled Assessment & Viva Voce Defense Dossier', curriculumSession: 'Session 22', keyMetric: '60m Timed Independent Execution', fileLink: 'StudentID_S22_v01.docx' },
      { id: 'EX-05', artifactId: 'VCEP-ART-S23', title: 'Six-Slide Executive Deck & One-Page Briefing Summary', curriculumSession: 'Session 23', keyMetric: '7m Pitch / 3m Live Demo', fileLink: 'StudentID_S23_v01.pptx' },
    ],
    defense: {
      assignedArtifactId: 'VCEP-ART-S20',
      artifactTitle: 'Case F Model v2.0 Change Control Board Log & Dynamic Liquidity Forecast',
      personalContribution: 'Independently engineered the dynamic receivables aging schedule and 7-day liquidity forecast in Model v2.0. Implemented Change Order CR-01 (₹5,000 credit note on Beacon F02) and Change Order CR-02 (₹8,000 supplier deferral), verifying zero unexplained variance.',
      defectCorrectionHistory: 'Before Defense Defect: Preliminary draft improperly credited bank cash for the ₹5,000 credit note, inflating opening cash to ₹30,000. Peer Reviewer Correction: Interviewer challenged non-cash debt accounting; I corrected double-entry journals to debit Sales Returns and credit Accounts Receivable without touching cash ledger account 1010.',
      technicalMethodology: 'Applied ISO date boundary formulas (=MAX(0, AsOfDate - DueDate)) across four accounts to dynamically categorize receivables into Current, 1–30, 31–60, and 61–90+ days overdue. Modeled weekly cash waterfall showing mandatory outflows compressed to ₹37,000, deficit narrowed to -₹12,000, and opening bank cash strictly invariant at ₹25,000.',
      scopeLimitations: 'Case F receivables invoices and Case G CRM marketing inquiries share no relational foreign key; combining them violates audit integrity. The model does not auto-execute banking sweeps and requires supervised human oversight under the approved 6.0-hour individual work cap.',
    },
    passport: [
      { id: 'PASSPORT-01', domain: 'Finance execution', title: 'Working Capital Modeling & Receivables Reconciliation', verifiedArtifactId: 'VCEP-ART-S07 & VCEP-ART-S20', demonstratedProof: 'Reconciled ₹1,00,000 baseline receivables to ₹95,000 post-credit note with zero variance; proved mathematical invariance of ₹25,000 opening bank cash.', facultyEvaluationStatus: 'VERIFIED', certifiedDate: '2026-10-31' },
      { id: 'PASSPORT-02', domain: 'Business technology', title: 'Dynamic Spreadsheet Engineering & Financial Automation', verifiedArtifactId: 'VCEP-ART-S10 & VCEP-ART-S19', demonstratedProof: 'Constructed dynamic date sensitivity formulas (=MAX(0, AsOfDate-DueDate)) refreshing aging schedules automatically; executed 5 QA regression test suites.', facultyEvaluationStatus: 'VERIFIED', certifiedDate: '2026-10-31' },
      { id: 'PASSPORT-03', domain: 'Business judgement', title: 'Commercial Break-Even & Unit Economics Analysis', verifiedArtifactId: 'VCEP-ART-S16 & VCEP-ART-S23', demonstratedProof: 'Proved mathematically that granting a 10% discount on 30 seats generates ₹0 incremental profit while exhausting 100% capacity; structured tiered counter-proposal.', facultyEvaluationStatus: 'VERIFIED', certifiedDate: '2026-10-31' },
      { id: 'PASSPORT-04', domain: 'AI verification', title: 'Responsible AI Auditing & Data Minimization (DPDP Act)', verifiedArtifactId: 'VCEP-ART-S13 & VCEP-ART-S14', demonstratedProof: 'Executed four-point data minimization sanitization under DPDP Act; established fail-closed stopping conditions preventing unverified AI hallucination propagation.', facultyEvaluationStatus: 'VERIFIED', certifiedDate: '2026-10-31' },
      { id: 'PASSPORT-05', domain: 'Communication', title: 'Executive Presentation & Cross-Examination Defense', verifiedArtifactId: 'VCEP-ART-S03 & VCEP-ART-S23', demonstratedProof: 'Delivered 7-minute executive briefing with 3-minute live working demonstration; successfully defended 3 hostile panel questions during 8-minute Q&A.', facultyEvaluationStatus: 'VERIFIED', certifiedDate: '2026-10-31' },
      { id: 'PASSPORT-06', domain: 'Professional practice', title: 'Change Control Governance & Audit Trail Integrity', verifiedArtifactId: 'VCEP-ART-S18 & VCEP-ART-S20', demonstratedProof: 'Maintained formal Change Control Board register (CR-01 & CR-02); upheld ICAI Code of Ethics by refusing to conceal disputed suspense balances to balance books.', facultyEvaluationStatus: 'VERIFIED', certifiedDate: '2026-10-31' },
    ],
    careerPlan: [
      { id: 'CP-01', horizon: 'Day 1–30', actionTitle: 'Advanced Modeling', actionPlan: 'Construct dynamic 3-statement forecasting model linking income statement, balance sheet, and debt sweep.', evidenceOfProgress: 'Completed 3-statement model with zero variance.', targetDueDate: 'Day 30' },
      { id: 'CP-02', horizon: 'Day 31–60', actionTitle: 'Case Studies', actionPlan: 'Author two technical case study articles on professional networks documenting BRS bridge and discount trap.', evidenceOfProgress: 'Two published case studies linking to verified VCEP artifact hashes.', targetDueDate: 'Day 60' },
      { id: 'CP-03', horizon: 'Day 61–90', actionTitle: 'Placement', actionPlan: 'Target 5 corporate FP&A roles defending verified Industry Passport transcript and live Model v2.0.', evidenceOfProgress: 'Completed 3 technical hiring interviews supported by verified Passport.', targetDueDate: 'Day 90' },
    ],
    scorecard: [
      { id: 'SC-01', dimension: 'Execution', maxMarks: 4, awardedMarks: 4, judgeComment: 'Flawless 3-minute live demonstration; Model v2.0 recalculated dynamically with zero variance.' },
      { id: 'SC-02', dimension: 'Reasoning', maxMarks: 2, awardedMarks: 2, judgeComment: 'Exceptional defense of commercial trade-offs and mathematical rejection of the 10% discount trap.' },
      { id: 'SC-03', dimension: 'Communication', maxMarks: 2, awardedMarks: 2, judgeComment: 'Clear executive briefing, crisp slide design, and highly professional verbal articulation.' },
      { id: 'SC-04', dimension: 'Professional Process', maxMarks: 2, awardedMarks: 2, judgeComment: 'Complete audit trail, verified CCB log, and strict adherence to 6.0-hour effort cap.' },
    ],
    conflictCheckCertified: true,
    studentContribution: 'Delivered the 7-minute squad capstone briefing and independently defended Exhibit EX-03 (Model v2.0 Change Control Board Log) during the 2-minute individual defense station. Verified all six Industry Passport competency domains against authenticated VCEP artifact hashes.',
    reviewerCorrection: 'Before Defense Defect: Preliminary defense claimed that deferring an ₹8,000 supplier payment decreased balance sheet accounts payable. Peer Reviewer Correction: Faculty lead challenged candidate on liability timing; candidate corrected the defense to articulate that total vendor liabilities remain unchanged while 7-day liquidity contracts by ₹8,000.',
    governance: {
      preparerName: 'Candidate Student (Lead Presenter)',
      reviewerName: 'Dr. Anita Roy (Faculty QA / External Judge Panel)',
      decisionOwner: 'Prof. Rajesh Menon (Academic Dean / Placement Director)',
      fileVersion: 'StudentID_S24_v01.pdf',
      humanAcknowledged: true,
    },
  },
});

assert.strictEqual(s24Compliant.sessionId, 24);
assert.strictEqual(s24Compliant.overallStatus, 'reviewed');
assert.strictEqual(s24Compliant.stages.Work.checks.find(c => c.id === 's24-w1-artifact-defense')?.passed, true);
assert.strictEqual(s24Compliant.stages.Work.checks.find(c => c.id === 's24-w2-passport-verification')?.passed, true);
assert.strictEqual(s24Compliant.stages.Work.checks.find(c => c.id === 's24-w3-career-plan')?.passed, true);
assert.strictEqual(s24Compliant.stages.Work.checks.find(c => c.id === 's24-w4-judge-scorecard')?.passed, true);
assert.strictEqual(s24Compliant.stages.Team.checks.find(c => c.id === 's24-t1-governance')?.passed, true);
assert.strictEqual(s24Compliant.stages.Team.checks.find(c => c.id === 's24-t2-rubric-compliance')?.passed, true);
console.log('✓ Session 24 Corporate Demo Day & Industry Passport (individual defense, 6-domain passport, 90-day plan, and judge scorecard) verified.');

// ---------------------------------------------------------------------
// TEST 5: Generic Sessions (e.g. Session 99 Extension Lab)
// ---------------------------------------------------------------------
console.log('\n--- TEST 5: Generic Sessions & Controlled Assessment Guards ---');
const s99Generic = runAutomaticReview({
  sessionId: 99,
  lesson: {
    id: 99,
    title: 'Post-Capstone Corporate Extension Lab',
    controlledAssessment: false,
    workPrompts: ['Project charter', 'Milestone report', 'Handover notes'],
  },
  draft: {
    'concept:explain': 'Workplace project simulation requires integrating multiple accounting, finance, and operational competencies into a cohesive professional workflow to produce verified corporate deliverables.',
    'work-prompt:0': 'Project charter executed with approved scope boundaries and WBS deliverables.',
    'work-prompt:1': 'Milestone report detailing progress against scheduled deadlines and resource allocations.',
    'work-prompt:2': 'Handover notes and audit logs certified and delivered for stakeholder review.',
    'team:contribution': 'Collaborated actively with squad members to reconcile inter-departmental variances and implemented peer feedback corrections across all working schedules.',
    'team:judgement': 'Verified formulas and financial calculations independently without external assistance, adhering strictly to internal control procedures.',
    'check:0': 'yes',
  },
});

assert.strictEqual(s99Generic.sessionId, 99);
assert.strictEqual(s99Generic.overallStatus, 'reviewed');
assert.strictEqual(s99Generic.stages.Work.checks.length, 4); // 3 prompts + analysis
console.log('✓ Generic session review engine & controlled assessment conditions verified.');

console.log('\n======================================================');
console.log('ALL REVIEW ENGINE UNIT & FORMULA TESTS PASSED CLEANLY!');
console.log('======================================================');
