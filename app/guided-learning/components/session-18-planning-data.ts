// Session 18 Data Layer & Types: Solution Design and Project Planning
// Grounded strictly in authorised Case F version 1 curriculum and capstone delivery constraints.

export interface CaseFInvoice {
  id: string;
  customer: string;
  dueDate: string;
  amount: number;
  ageBucket: 'Current' | '1-30 Days' | '31-60 Days' | '61-90 Days';
  notes: string;
}

export const CASE_F_INVOICES: CaseFInvoice[] = [
  {
    id: 'F01',
    customer: 'Asha Logistics',
    dueDate: '2026-10-31',
    amount: 10000,
    ageBucket: 'Current',
    notes: 'Due today (as-of 2026-10-31); strictly categorized as Current (0 days overdue).',
  },
  {
    id: 'F02',
    customer: 'Beacon Retail',
    dueDate: '2026-10-16',
    amount: 20000,
    ageBucket: '1-30 Days',
    notes: '15 days overdue; ₹5,000 disputed under damaged goods debit note; ₹15,000 undisputed.',
  },
  {
    id: 'F03',
    customer: 'Cedar Mobility',
    dueDate: '2026-09-16',
    amount: 30000,
    ageBucket: '31-60 Days',
    notes: '45 days overdue; requires executive payment plan reminder.',
  },
  {
    id: 'F04',
    customer: 'Delta Foods',
    dueDate: '2026-08-17',
    amount: 40000,
    ageBucket: '61-90 Days',
    notes: '75 days overdue; severe credit default risk; requires promoter follow-up.',
  },
];

export const CASE_F_LIQUIDITY_SUMMARY = {
  openingBankCash: 25000,
  unavoidable7DayOutflows: 45000,
  net7DayDeficit: 20000, // ₹45,000 - ₹25,000
  totalReceivables: 100000, // ₹10k + ₹20k + ₹30k + ₹40k
  totalDisputed: 5000, // Beacon debit note in suspense
  undisputedReceivables: 95000,
};

export const CAPSTONE_CONSTRAINTS = {
  maxWorkingDays: 10,
  maxStudentHours: 6.0,
  asOfDate: '2026-10-31',
  currency: 'INR',
  prohibitProductionWrites: true,
  prohibitCaseGJoin: true,
};

export interface SolutionOption {
  id: 'option-a' | 'option-b';
  title: string;
  subtitle: string;
  format: string;
  isRecommended: boolean;
  accuracy: string;
  updateability: string;
  effortAndFeasibility: string;
  verdict: string;
  verdictType: 'recommended' | 'rejected';
}

export const SOLUTION_OPTIONS: SolutionOption[] = [
  {
    id: 'option-a',
    title: 'Option A: Dynamic Spreadsheet Prototype',
    subtitle: 'Interactive Excel / Sheets financial model with live formula recalculations',
    format: 'Spreadsheet Model (.xlsx / Google Sheets)',
    isRecommended: true,
    accuracy:
      'High Mathematical Integrity: Uses transparent audit formulas (=SUM(), =MAX(0, AsOf - DueDate)) and a dedicated dispute suspense row. Prevents human transcription errors.',
    updateability:
      'Instant As-Of Date Refresh: Modifying a single date cell automatically recalculates days overdue, ageing buckets, and 7-day cash flow bridge without redesign.',
    effortAndFeasibility:
      'Feasible Within 6 Hours: Rapidly builds on existing Session 12 template; total squad effort is ~7.0 hours, with every individual student under the 6.0-hour cap.',
    verdict: 'SELECTED & APPROVED FOR CAPSTONE DELIVERY',
    verdictType: 'recommended',
  },
  {
    id: 'option-b',
    title: 'Option B: Static Slide-Only Presentation',
    subtitle: 'Narrative presentation deck with static screenshots and summary tables',
    format: 'Slide Presentation (.pptx / Google Slides)',
    isRecommended: false,
    accuracy:
      'Low Auditability: Contains static text numbers without underlying formula logic; cannot verify whether control totals or dispute quarantines balance correctly.',
    updateability:
      'Zero Scenario Flexibility: Every date change or debtor payment requires recalculating figures manually in external scratchpads and re-authoring slides.',
    effortAndFeasibility:
      'High Visual Overhead / Low Utility: Heavy slide layout time that delivers zero operational utility to the Managing Director during weekly Friday cash decisions.',
    verdict: 'REJECTED: FAILS AUDITABILITY & OPERATIONAL REFRESH TEST',
    verdictType: 'rejected',
  },
];

export interface ScopeItem {
  id: string;
  title: string;
  category: 'must-have' | 'nice-to-have' | 'exclusion';
  description: string;
  rationale: string;
  isIncluded: boolean;
}

export const INITIAL_SCOPE_ITEMS: ScopeItem[] = [
  {
    id: 'scope-1',
    title: 'Reviewed Ageing Queue (F01–F04, ₹1,00,000 Control Total)',
    category: 'must-have',
    description: 'Ingest 4 Case F invoices, classify F01 as Current, bucket F02–F04 into 1-30d, 31-60d, 61-90d.',
    rationale: 'Core operational visibility required to identify debtor age and prioritize recovery efforts.',
    isIncluded: true,
  },
  {
    id: 'scope-2',
    title: '7-Day Liquidity Deficit Model (₹20,000 Gap Bridge)',
    category: 'must-have',
    description: 'Connect ₹25,000 opening cash, ₹45,000 mandatory outflows, and collections schedule.',
    rationale: 'Essential cash model to prevent payroll default within 7 working days.',
    isIncluded: true,
  },
  {
    id: 'scope-3',
    title: 'Dispute Quarantine & Suspense Ledger (Beacon ₹5,000)',
    category: 'must-have',
    description: 'Isolate Beacon Retail ₹5,000 disputed sum into suspense; display ₹15,000 collectible.',
    rationale: 'Prevents misleading leadership into budgeting uncollectible funds for payroll.',
    isIncluded: true,
  },
  {
    id: 'scope-4',
    title: 'Client Handover Runbook (Read-Only Operational SOP)',
    category: 'must-have',
    description: 'Deliver documented spreadsheet model with cell protection and operational handover memo.',
    rationale: 'Ensures founder and finance team can operate model independently after project completion.',
    isIncluded: true,
  },
  {
    id: 'scope-5',
    title: 'Automated Debtor Email Draft Templates (Internal Review)',
    category: 'nice-to-have',
    description: 'Generate standardized payment reminder drafts for internal finance team approval.',
    rationale: 'Speeds up communication but must never be dispatched automatically without human sign-off.',
    isIncluded: true,
  },
  {
    id: 'scope-6',
    title: 'Visual Executive KPI Charts & Ageing Distribution Graph',
    category: 'nice-to-have',
    description: 'Add stacked bar charts visualizing overdue distribution across 30/60/90 days.',
    rationale: 'Improves presentation aesthetics if time permits within the 6-hour individual student limit.',
    isIncluded: false,
  },
  {
    id: 'scope-7',
    title: 'Direct Production System Writes / ERP Database Updates',
    category: 'exclusion',
    description: 'Prohibit direct API or database updates to accounting or ERP production systems.',
    rationale: 'STRICTLY PROHIBITED: Model is a decision support tool; accounting entries require certified personnel.',
    isIncluded: false,
  },
  {
    id: 'scope-8',
    title: 'Automated External Sending of Debt Demands to Clients',
    category: 'exclusion',
    description: 'Prohibit automatic bot or system emailing of payment demands directly to debtors.',
    rationale: 'STRICTLY PROHIBITED: Escalation demands require commercial relationship judgment by founders.',
    isIncluded: false,
  },
  {
    id: 'scope-9',
    title: 'Cross-Dataset Join Between Case F Invoices & Case G Leads',
    category: 'exclusion',
    description: 'Prohibit joining unverified CRM sales leads with verified accounting receivables ledger.',
    rationale: 'STRICTLY PROHIBITED: Zero common primary or foreign keys; joining them corrupts accounting controls.',
    isIncluded: false,
  },
];

export interface WbsTask {
  id: string;
  task: string;
  deliverable: string;
  owner: string;
  role: string;
  raci: 'R' | 'A' | 'C' | 'I';
  schedule: string;
  hours: number;
  dependency: string;
}

export const INITIAL_WBS_TASKS: WbsTask[] = [
  {
    id: 'T1',
    task: 'Case F Ingestion & Control Total Reconciliation',
    deliverable: 'Clean ledger table verifying SUM(F01:F04) === ₹1,00,000 with zero variance.',
    owner: 'Priya Sharma',
    role: 'Financial Modeler',
    raci: 'R',
    schedule: 'Days 1–2',
    hours: 1.5,
    dependency: 'Case F Frozen Baseline',
  },
  {
    id: 'T2',
    task: 'Ageing Logic & Boundary Rule Formulation',
    deliverable: 'Dynamic formula `=MAX(0, AsOf - DueDate)` classifying F01 as Current (0d) and F02-F04 in buckets.',
    owner: 'Arjun Kumar',
    role: 'Data Analyst',
    raci: 'R',
    schedule: 'Days 3–4',
    hours: 1.5,
    dependency: 'T1 (Control Total)',
  },
  {
    id: 'T3',
    task: 'Dispute Quarantine & Suspense Account Engine',
    deliverable: 'Dedicated suspense row isolating Beacon ₹5,000; undisputed ₹15,000 flagged for immediate recovery.',
    owner: 'Meera Nair',
    role: 'Risk & Audit Lead',
    raci: 'R',
    schedule: 'Day 5',
    hours: 1.0,
    dependency: 'T2 (Ageing Logic)',
  },
  {
    id: 'T4',
    task: '7-Day Liquidity Forecast Model & Deficit Bridge',
    deliverable: 'Cash schedule connecting ₹25k bank cash, ₹45k outflows, and collections to eliminate ₹20k deficit.',
    owner: 'Priya Sharma',
    role: 'Financial Modeler',
    raci: 'R',
    schedule: 'Days 6–7',
    hours: 1.5,
    dependency: 'T2, T3',
  },
  {
    id: 'T5',
    task: 'Acceptance Verification & Read-Only Handover Protocol',
    deliverable: 'Binary testing of 5 quality gates, read-only protection SOP, and handover memo to Managing Director.',
    owner: 'Rahul Deshmukh',
    role: 'Engagement Lead',
    raci: 'A',
    schedule: 'Days 8–10',
    hours: 1.5,
    dependency: 'T4 (Liquidity Model)',
  },
];

export interface AcceptanceCriterion {
  id: string;
  criterion: string;
  testMethod: string;
  expectedResult: string;
  verificationEvidence: string;
  passed: boolean;
}

export const INITIAL_ACCEPTANCE_CRITERIA: AcceptanceCriterion[] = [
  {
    id: 'AC1',
    criterion: 'Case F Control Total Reconciliation',
    testMethod: 'Formula audit: SUM(F01:F04) === 1,00,000 INR exactly with ₹0 unexplained variance.',
    expectedResult: 'Control total equals ₹1,00,000 across exactly 4 unique invoices. Pass.',
    verificationEvidence: 'SUM cell formula check on column D; variance flag === 0.',
    passed: true,
  },
  {
    id: 'AC2',
    criterion: 'Due-Today Classification Boundary Rule',
    testMethod: 'Boundary test: F01 due 2026-10-31 as-of 2026-10-31 must calculate 0 days overdue.',
    expectedResult: 'Categorized strictly as "Current" bucket, not overdue. Pass.',
    verificationEvidence: 'Logic `=IF(DueDate>=AsOfDate, "Current", ...)` returns Current for F01.',
    passed: true,
  },
  {
    id: 'AC3',
    criterion: 'Beacon Logistics Dispute Quarantine',
    testMethod: 'Audit test: Verify ₹5,000 disputed debit note is held in suspense and excluded from 7-day cash.',
    expectedResult: 'Quarantined in suspense; net collectible Beacon balance is ₹15,000. Pass.',
    verificationEvidence: 'Suspense row displays ₹5,000; net cash schedule takes ₹15,000 only.',
    passed: true,
  },
  {
    id: 'AC4',
    criterion: '7-Day Liquidity Deficit Feasibility Bridge',
    testMethod: 'Financial model test: ₹25,000 opening cash - ₹45,000 outflows + collections >= ₹0 closing cash.',
    expectedResult: 'Demonstrates ₹0 closing deficit without incurring short-term overdraft debt. Pass.',
    verificationEvidence: 'Closing cash formula shows surplus >= ₹0 on Day 7.',
    passed: true,
  },
  {
    id: 'AC5',
    criterion: 'Governance & Scope Boundary Verification',
    testMethod: 'Resource & security audit: Check that individual student effort <= 6.0 hours, and zero production writes.',
    expectedResult: 'All members <= 6.0 hours; read-only handover confirmed; zero join to Case G. Pass.',
    verificationEvidence: 'WBS hour calculation table confirms Max Individual <= 6.0h; sign-off verified.',
    passed: true,
  },
];

export interface RiskItem {
  id: string;
  title: string;
  category: 'operational' | 'scope' | 'governance' | 'compliance';
  impact: 'High' | 'Critical' | 'Medium';
  probability: 'Low' | 'Medium';
  mitigation: string;
  owner: string;
}

export const INITIAL_RISK_REGISTER: RiskItem[] = [
  {
    id: 'R1',
    title: 'Attempted Live Production System Writes',
    category: 'compliance',
    impact: 'Critical',
    probability: 'Low',
    mitigation: 'Deliver spreadsheet model as a strictly read-only decision aid. All formal accounting entries must be executed manually by certified finance staff.',
    owner: 'Rahul Deshmukh (Engagement Lead)',
  },
  {
    id: 'R2',
    title: 'Scope Creep via Automated Reminder Dispatch',
    category: 'scope',
    impact: 'High',
    probability: 'Medium',
    mitigation: 'Strictly prohibit automated email/SMS dispatch. Scope is restricted to internal draft generation subject to manual review by the Managing Director.',
    owner: 'Meera Nair (Risk & Audit Lead)',
  },
  {
    id: 'R3',
    title: 'Corrupt Cross-Dataset Joining with Case G',
    category: 'governance',
    impact: 'Critical',
    probability: 'Low',
    mitigation: 'Enforce zero-join policy. Case G sales inquiries have no primary/foreign key linking to Case F invoices and must remain isolated.',
    owner: 'Arjun Kumar (Data Analyst)',
  },
  {
    id: 'R4',
    title: 'Student Workload Exceeding 6.0-Hour Individual Cap',
    category: 'operational',
    impact: 'Medium',
    probability: 'Medium',
    mitigation: 'Enforce strict 10-day WBS breakdown. Total squad hours = 7.0h; maximum individual allocation is 3.0h (Priya), well below the 6.0h ceiling.',
    owner: 'Rahul Deshmukh (Engagement Lead)',
  },
];

export interface Session18State {
  selectedSolution: 'option-a' | 'option-b';
  solutionRationale: string;
  scopeItems: ScopeItem[];
  tasks: WbsTask[];
  acceptanceCriteria: AcceptanceCriterion[];
  risks: RiskItem[];
  handoverNotes: string;
  governance: {
    preparerName: string;
    reviewerName: string;
    decisionOwnerName: string;
    approvalStatus: 'Draft' | 'Under Review' | 'Approved' | 'Conditional';
    signoffDate: string;
    fileVersion: string;
  };
  checkedIndices: number[];
  timestamp?: string;
}

export const DEFAULT_SOLUTION_RATIONALE =
  'Option A (Dynamic Spreadsheet Prototype) is selected because it enables live formula transparency (=SUM, =MAX) and immediate recalculation when the Managing Director updates the As-Of Date. Option B (Static Slide Deck) provides only static images that cannot simulate collections timing or verify whether the ₹20,000 liquidity deficit is eliminated without error.';

export const DEFAULT_HANDOVER_NOTES =
  'The capstone solution is handed over to the Managing Director and Accounts Lead of Vayentra Labs as a protected Excel workbook (StudentID_S18_v01.xlsx) with live formulas. In accordance with project governance, NO direct production database writes or automated external debtor notifications are authorized. All operational updates must be reviewed by the internal finance lead.';

export const DEFAULT_SESSION_18_STATE: Session18State = {
  selectedSolution: 'option-a',
  solutionRationale: DEFAULT_SOLUTION_RATIONALE,
  scopeItems: INITIAL_SCOPE_ITEMS,
  tasks: INITIAL_WBS_TASKS,
  acceptanceCriteria: INITIAL_ACCEPTANCE_CRITERIA,
  risks: INITIAL_RISK_REGISTER,
  handoverNotes: DEFAULT_HANDOVER_NOTES,
  governance: {
    preparerName: 'Priya Sharma (Financial Modeler)',
    reviewerName: 'Meera Nair (Risk & Audit Lead)',
    decisionOwnerName: 'Rahul Deshmukh (Engagement Lead / MD Proxy)',
    approvalStatus: 'Approved',
    signoffDate: '2026-11-06',
    fileVersion: 'StudentID_S18_v01.xlsx',
  },
  checkedIndices: [0, 1, 2, 3, 4],
};

export const S18_RUBRIC = [
  {
    criterion: 'Execution (4 pts)',
    description: 'Selects feasible spreadsheet solution, constructs 10-day WBS with RACI, and verifies 5 binary acceptance criteria.',
    maxScore: 4,
  },
  {
    criterion: 'Reasoning (2 pts)',
    description: 'Justifies spreadsheet selection over static slides based on accuracy, updateability, and delivery feasibility within 6h.',
    maxScore: 2,
  },
  {
    criterion: 'Communication (2 pts)',
    description: 'WBS clearly distinguishes Responsible, Accountable, Consulted, and Informed role designations with clean dependencies.',
    maxScore: 2,
  },
  {
    criterion: 'Professional Process (2 pts)',
    description: 'Strictly governs student effort within the 6-hour individual cap, enforces read-only boundaries, and logs risks.',
    maxScore: 2,
  },
];

export const STORAGE_KEY = 'vcep:s18:drive-v3:student-workstation';

export function getStoredSession18State(): Session18State {
  if (typeof window === 'undefined') return DEFAULT_SESSION_18_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION_18_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SESSION_18_STATE,
      ...parsed,
      governance: { ...DEFAULT_SESSION_18_STATE.governance, ...(parsed.governance || {}) },
    };
  } catch {
    return DEFAULT_SESSION_18_STATE;
  }
}

export function setStoredSession18State(state: Session18State): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save Session 18 state to localStorage', e);
  }
}

