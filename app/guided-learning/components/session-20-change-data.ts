/**
 * VCEP Session 20: Management Review and Change Control
 * Core Data Models, Baseline Metrics, Change Requests & Regression Specifications
 * Grounded strictly in Case F Version 1 -> Version 2 Approved Transition
 */

export interface InvoiceRecord {
  id: string;
  customer: string;
  dueDate: string; // ISO YYYY-MM-DD
  v1AmountInr: number;
  v2AmountInr: number;
  creditNoteInr: number;
  contactRole: string;
  auditNotes: string;
}

export const CASE_F_INVOICES_V1_V2: InvoiceRecord[] = [
  {
    id: 'F01',
    customer: 'Asha Logistics',
    dueDate: '2026-10-31',
    v1AmountInr: 10000,
    v2AmountInr: 10000,
    creditNoteInr: 0,
    contactRole: 'Billing Manager',
    notes: 'Due today as-of 31 Oct 2026; classified strictly as Current (0 days overdue) in both versions.',
  } as any,
  {
    id: 'F02',
    customer: 'Beacon Retail',
    dueDate: '2026-10-16',
    v1AmountInr: 20000,
    v2AmountInr: 15000,
    creditNoteInr: 5000,
    contactRole: 'Finance Director',
    notes: '15 days overdue; v1 gross ₹20k with ₹5k debit note dispute; v2 applies ₹5k credit note reducing gross to ₹15k undisputed.',
  } as any,
  {
    id: 'F03',
    customer: 'Cedar Mobility',
    dueDate: '2026-09-16',
    v1AmountInr: 30000,
    v2AmountInr: 30000,
    creditNoteInr: 0,
    contactRole: 'Procurement Lead',
    notes: '45 days overdue; 31–60 days bucket; requires executive structured payment plan follow-up.',
  } as any,
  {
    id: 'F04',
    customer: 'Delta Foods',
    dueDate: '2026-08-17',
    v1AmountInr: 40000,
    v2AmountInr: 40000,
    creditNoteInr: 0,
    contactRole: 'Managing Director',
    notes: '75 days overdue; 61–90 days bucket; severe credit default risk; promoter outreach required.',
  } as any,
];

export const V1_BASELINE_METRICS = {
  version: 'v1.0 (Frozen Baseline)',
  asOfDate: '2026-10-31',
  currency: 'INR',
  totalControlAmount: 100000, // ₹1,00,000
  f02GrossAmount: 20000,
  disputedAmount: 5000, // Beacon Retail debit note in suspense
  undisputedAmount: 95000,
  openingBankCash: 25000,
  sevenDayOutflows: 45000,
  sevenDayCashDeficit: 20000, // ₹25k - ₹45k = -₹20k
  invoiceCount: 4,
};

export const V2_APPROVED_METRICS = {
  version: 'v2.0 (Approved Change Branch)',
  asOfDate: '2026-10-31',
  currency: 'INR',
  totalControlAmount: 95000, // ₹95,000 (-₹5,000 credit note)
  f02GrossAmount: 15000, // ₹15,000 (-₹5,000 credit note)
  disputedAmount: 0, // Extinguished by credit note
  undisputedAmount: 95000,
  openingBankCash: 25000, // Strictly Invariant! Zero cash collected
  sevenDayOutflows: 37000, // ₹37,000 (-₹8,000 deferral)
  sevenDayCashDeficit: 12000, // ₹25k - ₹37k = -₹12,000 (shrinks by ₹8,000)
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

export interface ChangeRequestEntry {
  id: string;
  changeType: 'Credit Note' | 'Supplier Deferral';
  authority: string;
  reason: string;
  affectedOutput: string;
  ledgerImpact: string;
  cashImpact: string;
  status: 'APPROVED & APPLIED' | 'UNDER REVIEW';
}

export const INITIAL_CHANGE_REQUESTS: ChangeRequestEntry[] = [
  {
    id: 'CR-01',
    changeType: 'Credit Note',
    authority: 'Managing Director / Commercial Lead (31 Oct 2026)',
    reason: 'Damaged goods return & SLA shortfall accepted by management following dispute review.',
    affectedOutput: 'Table_Receivables (F02 Beacon), 1–30 Days Overdue Bucket, Total Gross Receivables.',
    ledgerImpact: 'Beacon F02 reduced from ₹20,000 to ₹15,000; Total receivables reduce from ₹1,00,000 to ₹95,000.',
    cashImpact: '₹0 Bank Cash impact. Credit notes extinguish uncollectible debt; they do NOT collect cash.',
    status: 'APPROVED & APPLIED',
  },
  {
    id: 'CR-02',
    changeType: 'Supplier Deferral',
    authority: 'Finance Director / Cash Committee (31 Oct 2026)',
    reason: 'Rescheduled non-critical equipment maintenance payment from 03 Nov to 10 Nov (beyond Day 7).',
    affectedOutput: '7-Day Cash Outflow Forecast, 7-Day Net Cash Deficit / Shortfall.',
    ledgerImpact: '7-day mandatory cash outflows reduce from ₹45,000 to ₹37,000. Total expenses unchanged.',
    cashImpact: 'Deficit shrinks by ₹8,000 (from -₹20,000 to -₹12,000), reducing immediate Friday liquidity strain.',
    status: 'APPROVED & APPLIED',
  },
];

export interface RegressionTestRecord {
  id: string;
  category: 'Total Reconcile' | 'Due Today' | 'Next Day Shift' | 'Duplicate Halt' | 'Blank Halt' | 'Non-Cash Invariance';
  name: string;
  testInput: string;
  expectedResult: string;
  actualDemonstrated: string;
  verdict: 'PASS' | 'FAIL';
  evidenceRef: string;
}

export const INITIAL_REGRESSION_TESTS: RegressionTestRecord[] = [
  {
    id: 'RT-01',
    category: 'Total Reconcile',
    name: 'Version 2 Control Total & Ingestion Reconciliation',
    testInput: 'Ingest 4 Case F invoices under Version 2 (F02 at ₹15,000 after ₹5k credit note).',
    expectedResult: 'Total receivables equal ₹95,000 across 4 unique accounts; 1–30d bucket reflects ₹15,000.',
    actualDemonstrated: 'Total receivables = ₹95,000; 1–30d bucket = ₹15,000; control variance = ₹0.00.',
    verdict: 'PASS',
    evidenceRef: 'Cell D6 === 95000; =SUM(D2:D5) === 95000; diff = 0.',
  },
  {
    id: 'RT-02',
    category: 'Due Today',
    name: 'Due-Today Boundary Rule Test (v2.0 Regression)',
    testInput: 'Invoice F01 due 2026-10-31 with As-Of Date set to 2026-10-31.',
    expectedResult: 'F01 calculates 0 days overdue; allocated strictly to "Current", not 1–30 Days Overdue.',
    actualDemonstrated: 'F01 allocated to Current (₹10,000); 0 days overdue; boundary rule intact.',
    verdict: 'PASS',
    evidenceRef: 'Formula `=MAX(0, $B$1 - DueDate)` yields 0; bucket lookup returns "Current".',
  },
  {
    id: 'RT-03',
    category: 'Next Day Shift',
    name: 'As-Of Next Day Shift & Control Invariance (v2.0)',
    testInput: 'Advance As-Of Date from 2026-10-31 to 2026-11-01 in Version 2.',
    expectedResult: 'F01 shifts to 1–30d; 1–30d total becomes ₹25,000 (F01 ₹10k + F02 ₹15k); grand total stays ₹95,000.',
    actualDemonstrated: 'F01 reclassified to 1–30d; 1–30d bucket rose to ₹25,000; grand total unchanged at ₹95,000 with ₹0 variance.',
    verdict: 'PASS',
    evidenceRef: 'Dynamic date parameter $B$1 updated; sum across buckets remains ₹95,000.',
  },
  {
    id: 'RT-04',
    category: 'Duplicate Halt',
    name: 'Duplicate Invoice ID Exception Halt (v2.0)',
    testInput: 'Simulate duplicate invoice ID F02 injected into intake table.',
    expectedResult: 'Triggers visible exception alert; halts ingestion; protects ₹95,000 total from double-count.',
    actualDemonstrated: 'Stop condition triggered; validation halted; rule `=COUNTIF($A$2:$A$5, A2) > 1` verified.',
    verdict: 'PASS',
    evidenceRef: 'Exception banner active; ingestion rule blocked processing of row 5.',
  },
  {
    id: 'RT-05',
    category: 'Blank Halt',
    name: 'Missing / Blank Amount Exception Halt (v2.0)',
    testInput: 'Simulate blank amount cell in record F03 under Version 2.',
    expectedResult: 'Triggers audit exception warning; halts calculation; requires human verification.',
    actualDemonstrated: 'Data audit alert raised; blank cell flagged with human verification prompt.',
    verdict: 'PASS',
    evidenceRef: 'Missing value guard `=IF(ISBLANK(D3), "ERROR", ...)` caught empty cell.',
  },
  {
    id: 'RT-06',
    category: 'Non-Cash Invariance',
    name: 'Non-Cash Credit Note Invariance Audit',
    testInput: 'Audit bank cash account balance after applying ₹5,000 credit note to F02.',
    expectedResult: 'Bank cash remains strictly invariant at ₹25,000; zero cash inflow credited.',
    actualDemonstrated: 'Opening bank cash verified at ₹25,000 (diff = 0); credit note isolated to AR ledger.',
    verdict: 'PASS',
    evidenceRef: 'Cash ledger account 1010 unchanged at ₹25,000; journal Debit Sales Returns, Credit AR.',
  },
];

export const DEFAULT_VERSION_DEFENSE =
  'Client Pushback Defense: Client requested deleting Model v1.0 to avoid operational confusion. We firmly declined: Model v1.0 represents the certified baseline against which all change orders, dispute resolutions, and liquidity variances are measured. Deleting v1.0 destroys the audit trail, violates corporate change control governance, and prevents management from proving why the ₹8,000 cash deficit reduction occurred. Both versions are maintained side-by-side in distinct, version-controlled workbook sheets.';

export const DEFAULT_EXECUTIVE_MEMO =
  'To Managing Director & Board: Model v2.0 successfully incorporates two approved operational changes as of 31 October 2026. First, an approved ₹5,000 credit note issued to Beacon Retail resolves the invoice F02 damaged goods dispute, reducing gross receivables to ₹95,000 while injecting ₹0 new bank cash. Second, rescheduling ₹8,000 in non-critical supplier payments beyond Day 7 compresses mandatory outflows from ₹45,000 to ₹37,000. Against our ₹25,000 opening cash, the 7-day liquidity deficit contracts from -₹20,000 to -₹12,000. Prioritizing immediate collection of Asha Technologies (₹10,000, due today) will contain our remaining Friday liquidity shortfall to ₹2,000 without emergency borrowing.';

export const DEFAULT_STUDENT_CONTRIBUTION =
  'Engineered Version 2.0 change branch in the receivables model. Configured side-by-side delta schedules, implemented the ₹5,000 credit note accounting adjustment to Beacon F02 without cash distortion, recalculated the 7-day liquidity forecast (-₹12,000 gap), and re-executed all 5 regression tests.';

export const DEFAULT_REVIEWER_CORRECTION =
  'Before Review Defect: Preliminary draft initially treated the ₹5,000 credit note as an incoming cash collection in the cash flow schedule, incorrectly reporting opening cash as ₹30,000 and showing a ₹7,000 deficit. Peer Reviewer Correction: Identified the critical accounting violation that credit notes extinguish debt without generating cash; corrected cash flow model to maintain bank cash strictly invariant at ₹25,000, restoring true 7-day deficit to -₹12,000.';

export interface Session20State {
  activeVersion: 'v1.0' | 'v2.0';
  asOfDate: string;
  changeRequests: ChangeRequestEntry[];
  regressionTests: RegressionTestRecord[];
  simulatedDuplicate: boolean;
  simulatedBlank: boolean;
  versionDefense: string;
  executiveMemo: string;
  studentContribution: string;
  reviewerCorrection: string;
  governance: {
    preparerName: string;
    reviewerName: string;
    decisionOwner: string;
    auditStatus: string;
    fileVersion: string;
  };
  checklist: boolean[];
  timestamp?: string;
}

export const INITIAL_CHECKLIST_LABELS = [
  'I preserved Model v1.0 as an immutable baseline workbook and branched cleanly to Version 2.0.',
  'I applied the approved ₹5,000 credit note against Beacon F02, reducing receivables to ₹95,000.',
  'I verified that credit notes extinguish debt without generating bank cash (bank cash remains ₹25,000).',
  'I deferred ₹8,000 of supplier payments beyond Day 7, reducing 7-day outflows to ₹37,000.',
  'I calculated the revised 7-day liquidity deficit (-₹12,000 vs -₹20,000 baseline).',
  'I re-executed all 5 regression tests plus the non-cash invariance audit with verified PASS verdicts.',
  'I documented the Change Control Board log, version preservation defense, and executive briefing memo.',
];

export const DEFAULT_SESSION_20_STATE: Session20State = {
  activeVersion: 'v2.0',
  asOfDate: '2026-10-31',
  changeRequests: INITIAL_CHANGE_REQUESTS,
  regressionTests: INITIAL_REGRESSION_TESTS,
  simulatedDuplicate: false,
  simulatedBlank: false,
  versionDefense: DEFAULT_VERSION_DEFENSE,
  executiveMemo: DEFAULT_EXECUTIVE_MEMO,
  studentContribution: DEFAULT_STUDENT_CONTRIBUTION,
  reviewerCorrection: DEFAULT_REVIEWER_CORRECTION,
  governance: {
    preparerName: 'Priya Sharma (Financial Modeler)',
    reviewerName: 'Meera Nair (Quality Assurance Lead)',
    decisionOwner: 'Managing Director (Vayentra Labs)',
    auditStatus: 'Verified PASS (Ready for Handover)',
    fileVersion: 'StudentID_S20_v01.xlsx',
  },
  checklist: [true, true, true, true, true, true, true],
};

export const S20_STORAGE_KEY = 'vcep:s20:drive-v3:change-control-state';

export function loadSession20State(): Session20State {
  if (typeof window === 'undefined') return DEFAULT_SESSION_20_STATE;
  try {
    const raw = localStorage.getItem(S20_STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION_20_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SESSION_20_STATE,
      ...parsed,
      governance: { ...DEFAULT_SESSION_20_STATE.governance, ...(parsed.governance || {}) },
      checklist: Array.isArray(parsed.checklist) && parsed.checklist.length === 7
        ? parsed.checklist
        : DEFAULT_SESSION_20_STATE.checklist,
    };
  } catch {
    return DEFAULT_SESSION_20_STATE;
  }
}

export function setStoredSession20State(state: Session20State): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(S20_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export const S20_RUBRIC = [
  {
    name: 'Execution',
    points: 4,
    evidence: 'Correctly updates Model v2.0 reflecting ₹5,000 credit note and ₹8,000 supplier deferral; re-executes all 5 regression tests; verifies ₹95,000 total and -₹12,000 deficit.',
  },
  {
    name: 'Reasoning',
    points: 2,
    evidence: 'Strictly distinguishes credit note accounting adjustments from bank cash receipts; proves that payment deferral alters cash timing without changing total expenses.',
  },
  {
    name: 'Communication',
    points: 2,
    evidence: 'Issues concise, high-impact executive update (~90–120 words) detailing deficit reduction, non-cash nature of credit note, and immediate debtor recovery priorities.',
  },
  {
    name: 'Professional Process',
    points: 2,
    evidence: 'Preserves Model v1.0 baseline; defends version integrity against client deletion pushback; maintains CCB audit trail and named governance sign-offs.',
  },
];

