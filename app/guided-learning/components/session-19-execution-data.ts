// Session 19 Data Layer & Types: Project Execution and Quality Assurance
// Grounded strictly in authorised Case F version 1 curriculum and testing specifications.

export interface RawInvoiceRecord {
  id: string;
  customer: string;
  dueDate: string; // ISO format: YYYY-MM-DD
  outstandingInr: number;
  contactRole: string;
  notes: string;
}

export const CASE_F_RAW_RECORDS: RawInvoiceRecord[] = [
  {
    id: 'F01',
    customer: 'Asha Logistics',
    dueDate: '2026-10-31',
    outstandingInr: 10000,
    contactRole: 'Billing Manager',
    notes: 'Due today as-of 31 Oct 2026; strictly classified as Current (0 days overdue).',
  },
  {
    id: 'F02',
    customer: 'Beacon Retail',
    dueDate: '2026-10-16',
    outstandingInr: 20000,
    contactRole: 'Finance Director',
    notes: '15 days overdue; ₹5,000 disputed under damaged goods debit note; ₹15,000 undisputed.',
  },
  {
    id: 'F03',
    customer: 'Cedar Mobility',
    dueDate: '2026-09-16',
    outstandingInr: 30000,
    contactRole: 'Procurement Lead',
    notes: '45 days overdue; requires executive payment plan follow-up.',
  },
  {
    id: 'F04',
    customer: 'Delta Foods',
    dueDate: '2026-08-17',
    outstandingInr: 40000,
    contactRole: 'Managing Director',
    notes: '75 days overdue; severe credit default risk; requires immediate promoter outreach.',
  },
];

export const CASE_F_BASELINE_SUMMARY = {
  asOfDate: '2026-10-31',
  currency: 'INR',
  totalControlAmount: 100000, // ₹1,00,000 exactly
  disputedAmount: 5000, // Beacon Retail debit note in suspense
  undisputedAmount: 95000,
  openingBankCash: 25000,
  unavoidable7DayOutflows: 45000,
  net7DayCashDeficit: 20000,
  invoiceCount: 4,
};

export type AgeingBucket = 'Current' | '1-30 Days' | '31-60 Days' | '61-90 Days';

export function calculateDaysOverdue(dueDateStr: string, asOfDateStr: string): number {
  const due = new Date(dueDateStr + 'T00:00:00Z').getTime();
  const asOf = new Date(asOfDateStr + 'T00:00:00Z').getTime();
  const diffDays = Math.floor((asOf - due) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function classifyAgeingBucket(daysOverdue: number): AgeingBucket {
  if (daysOverdue === 0) return 'Current';
  if (daysOverdue <= 30) return '1-30 Days';
  if (daysOverdue <= 60) return '31-60 Days';
  return '61-90 Days';
}

export interface QaAuditCheck {
  id: string;
  checkName: string;
  qualityStandard: string;
  auditMethod: string;
  formulaEvidence: string;
  status: 'VERIFIED PASS' | 'FLAGGED';
}

export const INITIAL_QA_CHECKS: QaAuditCheck[] = [
  {
    id: 'QA-01',
    checkName: 'Data Types & ISO Formatting',
    qualityStandard: 'Dates must strictly follow YYYY-MM-DD; currency in numeric INR with no text symbols in sum ranges.',
    auditMethod: 'Inspected raw cells across F01–F04; dates validated as ISO-8601, amounts stored as numeric integers.',
    formulaEvidence: '=ISNUMBER(D2) === TRUE; cell formatting set to Currency (INR).',
    status: 'VERIFIED PASS',
  },
  {
    id: 'QA-02',
    checkName: 'Formula Dynamic Ranges & Total Invariance',
    qualityStandard: 'Control total formulas must reference dynamic ranges without hardcoded numbers.',
    auditMethod: 'Formula audited: =SUM(Table_Receivables[Outstanding INR]); total equals ₹1,00,000 across all date states.',
    formulaEvidence: '=SUM(D2:D5) === 100000; difference flag = 0.',
    status: 'VERIFIED PASS',
  },
  {
    id: 'QA-03',
    checkName: 'Circular Reference & Dependency Audit',
    qualityStandard: 'Zero circular dependencies between cash flow model and receivables aging schedule.',
    auditMethod: 'Excel iteration calculation disabled; schedules flow unidirectionally (Ledger → Aging → Cash Model).',
    formulaEvidence: '0 circular dependency warnings detected across entire workbook.',
    status: 'VERIFIED PASS',
  },
  {
    id: 'QA-04',
    checkName: 'Duplicate Record & Blank Detector',
    qualityStandard: 'Duplicate invoice IDs or blank amount fields must halt calculation and surface visible exception alert.',
    auditMethod: 'Injected simulated duplicate ID F02 and blank cell; exception rule flagged violation with visible stop condition.',
    formulaEvidence: '=COUNTIF($A$2:$A$5, A2) > 1 -> Exception Triggered.',
    status: 'VERIFIED PASS',
  },
];

export interface AcceptanceTestRecord {
  id: string;
  testCategory: 'Normal source' | 'Due today' | 'As of next day' | 'Duplicate invoice' | 'Blank amount';
  name: string;
  testInput: string;
  expectedResult: string;
  actualDemonstrated: string;
  verdict: 'PASS' | 'FAIL';
  evidenceRef: string;
}

export const INITIAL_ACCEPTANCE_TESTS: AcceptanceTestRecord[] = [
  {
    id: 'AT-01',
    testCategory: 'Normal source',
    name: 'Normal Source Ingestion & Control Total Reconcile',
    testInput: 'Ingest 4 Case F version 1 invoices (F01–F04) as-of 2026-10-31.',
    expectedResult: 'All 4 invoices appear once; outstanding total equals ₹1,00,000; overdue buckets reconcile; dispute ₹5,000 isolated.',
    actualDemonstrated: '₹1,00,000 control total reconciled across 4 unique records; ₹5,000 Beacon dispute quarantined in suspense.',
    verdict: 'PASS',
    evidenceRef: 'Sheet "Receivables_v1" cell D6 === 100000; Suspense cell E6 === 5000.',
  },
  {
    id: 'AT-02',
    testCategory: 'Due today',
    name: 'Due-Today Boundary Rule Test',
    testInput: 'Invoice F01 due 2026-10-31 with As-Of Date set to 2026-10-31.',
    expectedResult: 'F01 calculates 0 days overdue; categorized strictly as "Current", not 1–30 Days Overdue.',
    actualDemonstrated: 'F01 correctly allocated to Current bucket (₹10,000); days overdue === 0.',
    verdict: 'PASS',
    evidenceRef: 'Formula `=MAX(0, $B$1 - DueDate)` yields 0; bucket lookup returns "Current".',
  },
  {
    id: 'AT-03',
    testCategory: 'As of next day',
    name: 'As-Of Next Day Reclassification & Control Invariance',
    testInput: 'Advance As-Of Date by +1 day from 2026-10-31 to 2026-11-01.',
    expectedResult: 'F01 reclassifies into 1–30 Days Overdue (1 day overdue); grand total remains ₹1,00,000 with ₹0 variance.',
    actualDemonstrated: 'F01 moved to 1–30d bucket (₹10,000); 1–30d total rose to ₹30,000; grand total unchanged at ₹1,00,000.',
    verdict: 'PASS',
    evidenceRef: 'Dynamic date parameter in cell $B$1 refreshed all 4 buckets with ₹0 variance.',
  },
  {
    id: 'AT-04',
    testCategory: 'Duplicate invoice',
    name: 'Duplicate Record Injection & Exception Alert',
    testInput: 'Inject duplicate invoice record with existing ID "F02" into table.',
    expectedResult: 'Duplicate is visibly flagged in red; exception banner appears; totals do not double-count.',
    actualDemonstrated: 'Duplicate ID F02 triggered visual alert and calculation halt warning; control total protected.',
    verdict: 'PASS',
    evidenceRef: 'Validation rule `=COUNTIF($A$2:$A$6, A2)>1` surfaced duplicate error tag.',
  },
  {
    id: 'AT-05',
    testCategory: 'Blank amount',
    name: 'Missing / Blank Amount Cell Exception Test',
    testInput: 'Simulate invoice with missing amount cell (empty string / blank).',
    expectedResult: 'Missing amount triggers visible calculation stop / exception rather than silently calculating as zero.',
    actualDemonstrated: 'Blank cell flagged with "MISSING AMOUNT - REQUIRES HUMAN REVIEW"; stop condition triggered.',
    verdict: 'PASS',
    evidenceRef: 'Formula `=IF(ISBLANK(D3), "ERROR: BLANK", ...)` halted silent zero conversion.',
  },
];

export interface Session19State {
  asOfDate: string; // '2026-10-31' or '2026-11-01' or custom
  simulatedDuplicate: boolean;
  simulatedBlank: boolean;
  qaChecks: QaAuditCheck[];
  acceptanceTests: AcceptanceTestRecord[];
  studentContribution: string;
  reviewerCorrection: string;
  handoverSummary: string;
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

export const DEFAULT_STUDENT_CONTRIBUTION =
  'Constructed the dynamic ageing calculation engine using `=MAX(0, $B$1 - DueDate)` and built the automated suspense account isolation for the ₹5,000 disputed Beacon Retail debit note. Maintained raw Case F records in an immutable table and linked formulas to dynamic parameter cell $B$1.';

export const DEFAULT_REVIEWER_CORRECTION =
  'Before correction: During peer testing, the reviewer discovered that shifting the as-of date to 1 November failed to move invoice F01 because the formula contained a hardcoded date string "2026-10-31" in cell E2.\nAfter correction: Replaced hardcoded date with absolute cell reference `$B$1`. Verified that F01 instantly reclassifies to 1–30 Days Overdue on 1 November while control total ₹1,00,000 is perfectly preserved.';

export const DEFAULT_HANDOVER_SUMMARY =
  'The audited receivables prototype v1.0 is handed over to the Managing Director and Accounts Lead of Vayentra Labs as a protected workbook (StudentID_S19_v01.xlsx). To refresh the model, the user updates the single As-Of Date cell ($B$1); all 4 overdue buckets recalculate dynamically. The disputed ₹5,000 remains quarantined in suspense. All 5 acceptance tests are verified PASS. NO live production system writes or automated debtor dispatch are authorized.';

export const DEFAULT_SESSION_19_STATE: Session19State = {
  asOfDate: '2026-10-31',
  simulatedDuplicate: false,
  simulatedBlank: false,
  qaChecks: INITIAL_QA_CHECKS,
  acceptanceTests: INITIAL_ACCEPTANCE_TESTS,
  studentContribution: DEFAULT_STUDENT_CONTRIBUTION,
  reviewerCorrection: DEFAULT_REVIEWER_CORRECTION,
  handoverSummary: DEFAULT_HANDOVER_SUMMARY,
  governance: {
    preparerName: 'Priya Sharma (Financial Modeler)',
    reviewerName: 'Meera Nair (Risk & Audit Lead)',
    decisionOwnerName: 'Rahul Deshmukh (Engagement Lead / MD Proxy)',
    approvalStatus: 'Approved',
    signoffDate: '2026-11-07',
    fileVersion: 'StudentID_S19_v01.xlsx',
  },
  checkedIndices: [0, 1, 2, 3, 4],
};

export const S19_RUBRIC = [
  {
    criterion: 'Execution (4 pts)',
    description: 'Builds working prototype v1.0, preserves raw tables, executes all 5 acceptance tests with objective evidence, and verifies date sensitivity.',
    maxScore: 4,
  },
  {
    criterion: 'Reasoning (2 pts)',
    description: 'Explains date boundary behavior (due-today vs next day) and proves control total invariance (₹1,00,000 with ₹0 variance).',
    maxScore: 2,
  },
  {
    criterion: 'Communication (2 pts)',
    description: 'Test register clearly documents test inputs, expected results, demonstrated outputs, and explicit PASS/FAIL verdicts.',
    maxScore: 2,
  },
  {
    criterion: 'Professional Process (2 pts)',
    description: 'Maintains individual contribution log, records authentic before/after peer review correction, and delivers reviewer-ready handover.',
    maxScore: 2,
  },
];

export const STORAGE_KEY = 'vcep:s19:drive-v3:student-workstation';

export function getStoredSession19State(): Session19State {
  if (typeof window === 'undefined') return DEFAULT_SESSION_19_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION_19_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SESSION_19_STATE,
      ...parsed,
      governance: { ...DEFAULT_SESSION_19_STATE.governance, ...(parsed.governance || {}) },
    };
  } catch {
    return DEFAULT_SESSION_19_STATE;
  }
}

export function setStoredSession19State(state: Session19State): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save Session 19 state to localStorage', e);
  }
}

