/**
 * VCEP Session 08: Bank Reconciliation — Canonical Data & State Model
 * Mission: Find the Difference. Prove the Balance.
 * 
 * Source Grounding:
 * - Approved Drive Workbook: curriculum/archive/downloads/S08_Bank_Reconciliation.docx
 * - Master Schema: app/guided-learning/drive-edition-3.json (Session 08)
 * - Review Engine: lib/review-engine/session-rules/session-08.ts
 */

export const S08_STORAGE_KEY = 'vcep:s08:drive-v3:student-workstation';
export const S08_PREVIEW_KEY = 'vcep-drive-edition3:session:8:preview';

// Canonical Financial Figures (Case C October Snapshot)
export const UNADJUSTED_CASHBOOK_INR = 87500;
export const BANK_CHARGES_INR = 500;
export const INTEREST_EARNED_INR = 200;
export const ADJUSTED_CASHBOOK_INR = 87200; // 87,500 - 500 + 200
export const UNPRESENTED_CHEQUE_INR = 6000;
export const DEPOSIT_IN_TRANSIT_INR = 10000;
export const ACTUAL_STATEMENT_INR = 83200;
export const TARGET_VARIANCE_INR = 0; // 87,200 + 6,000 - 10,000 = 83,200 => variance = 0

export type DiscrepancyClassification = 'book_adjustment' | 'timing_difference' | 'unexplained_item' | 'unclassified';

export interface DiscrepancyItem {
  id: string;
  title: string;
  amount: number;
  direction: 'inflow' | 'outflow';
  sourceReference: string;
  reportedIn: 'Bank Statement Only' | 'Cash Book Only';
  correctClassification: 'book_adjustment' | 'timing_difference';
  userClassification: DiscrepancyClassification;
  explanation: string;
  isMatched: boolean;
}

export interface LedgerRow {
  id: string;
  date: string;
  ref: string;
  description: string;
  debit?: number;
  credit?: number;
  balance: number;
  matched: boolean;
  isDiscrepancy?: boolean;
}

export interface StatementRow {
  id: string;
  date: string;
  ref: string;
  description: string;
  withdrawals?: number; // Debit
  deposits?: number;    // Credit
  balance: number;
  matched: boolean;
  isDiscrepancy?: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  drAccount: string;
  crAccount: string;
  amount: number;
  narration: string;
  verified: boolean;
}

export interface TimingExceptionItem {
  id: string;
  item: string;
  amount: number;
  source: string;
  owner: string;
  targetDate: string;
  status: 'In Transit' | 'Unpresented' | 'Cleared';
}

export interface Session08WorkstationState {
  unadjustedBook: number;
  bankCharges: number;
  interestEarned: number;
  unpresentedCheque: number;
  depositInTransit: number;
  actualStatement: number;
  discrepancies: DiscrepancyItem[];
  journalEntries: JournalEntry[];
  exceptionLog: TimingExceptionItem[];
  peerChallengeNote: string;
  antiPlugPledge: string;
  governance: {
    studentId: string;
    fileVersion: string;
    contributionSummary: string;
    peerCorrection: string;
  };
  checkedIndices: number[];
  lastSaved?: string;
}

// Side-by-side Ledger: Company Cash Book (Bank Account)
export const CASE_C_CASHBOOK_ROWS: LedgerRow[] = [
  { id: 'cb1', date: '2026-10-01', ref: 'OB-01', description: 'Opening Balance b/d', debit: 65500, balance: 65500, matched: true },
  { id: 'cb2', date: '2026-10-08', ref: 'CHQ-102', description: 'Receipt: Asha Retail (Collection)', debit: 18000, balance: 83500, matched: true },
  { id: 'cb3', date: '2026-10-15', ref: 'CHQ-4399', description: 'Payment: Skyline Logistics', credit: 2000, balance: 81500, matched: true },
  { id: 'cb4', date: '2026-10-28', ref: 'SLIP-9821', description: 'Deposit: Apex Enterprises (In Transit)', debit: 10000, balance: 91500, matched: false, isDiscrepancy: true },
  { id: 'cb5', date: '2026-10-30', ref: 'CHQ-4401', description: 'Payment: Zenith Supplies (Unpresented)', credit: 6000, balance: 85500, matched: false, isDiscrepancy: true },
  { id: 'cb6', date: '2026-10-31', ref: 'CL-01', description: 'Closing Balance c/d (Unadjusted Book)', balance: 87500, matched: false },
];

// Side-by-side Commercial Bank Statement (Bank Account #8812)
export const CASE_C_STATEMENT_ROWS: StatementRow[] = [
  { id: 'st1', date: '2026-10-01', ref: 'OB-BANK', description: 'Opening Balance b/f', deposits: 65500, balance: 65500, matched: true },
  { id: 'st2', date: '2026-10-09', ref: 'CLR-102', description: 'Clearing: Asha Retail Deposit', deposits: 18000, balance: 83500, matched: true },
  { id: 'st3', date: '2026-10-16', ref: 'CLR-4399', description: 'Clearing: Skyline Logistics Cheque', withdrawals: 2000, balance: 81500, matched: true },
  { id: 'st4', date: '2026-10-31', ref: 'ADV-S881', description: 'Monthly Bank Service Charges', withdrawals: 500, balance: 81000, matched: false, isDiscrepancy: true },
  { id: 'st5', date: '2026-10-31', ref: 'INT-OCT', description: 'Savings Interest Earned Credit', deposits: 200, balance: 81200, matched: false, isDiscrepancy: true },
  { id: 'st6', date: '2026-10-31', ref: 'CL-BANK', description: 'Closing Statement Balance (Actual Cr)', balance: 83200, matched: false },
];

// Initial Discrepancies to Classify
export const INITIAL_DISCREPANCIES: DiscrepancyItem[] = [
  {
    id: 'd1',
    title: 'Monthly Bank Service Charges',
    amount: 500,
    direction: 'outflow',
    sourceReference: 'Bank Advice #S-881',
    reportedIn: 'Bank Statement Only',
    correctClassification: 'book_adjustment',
    userClassification: 'book_adjustment',
    explanation: 'Debited directly by bank. Not recorded in cash book. Requires permanent adjustment journal: Dr Bank Charges ₹500, Cr Bank Account ₹500.',
    isMatched: true,
  },
  {
    id: 'd2',
    title: 'Savings Account Interest Earned',
    amount: 200,
    direction: 'inflow',
    sourceReference: 'Bank Credit Memo #INT-OCT',
    reportedIn: 'Bank Statement Only',
    correctClassification: 'book_adjustment',
    userClassification: 'book_adjustment',
    explanation: 'Credited directly by bank. Not recorded in cash book. Requires permanent adjustment journal: Dr Bank Account ₹200, Cr Interest Income ₹200.',
    isMatched: true,
  },
  {
    id: 'd3',
    title: 'Customer Deposit in Transit (Apex Enterprises)',
    amount: 10000,
    direction: 'inflow',
    sourceReference: 'Pay-in Slip #9821',
    reportedIn: 'Cash Book Only',
    correctClassification: 'timing_difference',
    userClassification: 'timing_difference',
    explanation: 'Already entered in cash book. Bank clearing cycle pending. Reconciled on BRS schedule only (deduct from book). Do NOT post journal entry.',
    isMatched: true,
  },
  {
    id: 'd4',
    title: 'Unpresented Cheque to Vendor (Zenith Supplies)',
    amount: 6000,
    direction: 'outflow',
    sourceReference: 'Cheque Counterfoil #4401',
    reportedIn: 'Cash Book Only',
    correctClassification: 'timing_difference',
    userClassification: 'timing_difference',
    explanation: 'Already entered in cash book as payment. Vendor has not presented cheque to bank yet. Reconciled on BRS schedule only (add to book). Do NOT post journal entry.',
    isMatched: true,
  },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j1',
    date: '2026-10-31',
    drAccount: 'Bank Charges (Operating Expense)',
    crAccount: 'Bank Account (Current Asset)',
    amount: 500,
    narration: 'Being monthly account maintenance fees debited directly by bank recorded in cash book.',
    verified: true,
  },
  {
    id: 'j2',
    date: '2026-10-31',
    drAccount: 'Bank Account (Current Asset)',
    crAccount: 'Interest Income (Other Revenue)',
    amount: 200,
    narration: 'Being savings account interest credited directly by bank recorded in cash book.',
    verified: true,
  },
];

export const INITIAL_EXCEPTION_LOG: TimingExceptionItem[] = [
  {
    id: 'e1',
    item: 'Customer Deposit in Transit (Apex Enterprises)',
    amount: 10000,
    source: 'Bank Pay-in Slip #9821',
    owner: 'Collections Lead (Accounts Receivable)',
    targetDate: '2026-11-03',
    status: 'In Transit',
  },
  {
    id: 'e2',
    item: 'Unpresented Cheque to Vendor (Zenith Supplies)',
    amount: 6000,
    source: 'Cheque Counterfoil #4401',
    owner: 'Accounts Payable Lead (Treasury)',
    targetDate: '2026-11-04',
    status: 'Unpresented',
  },
];

export const S08_RUBRIC = [
  { name: 'Execution', points: 4, evidence: '3-column BRS balances with exact zero unexplained variance to the bank statement (₹83,200).' },
  { name: 'Reasoning', points: 2, evidence: 'Correctly distinguishes permanent ledger adjustments from temporary timing differences.' },
  { name: 'Communication', points: 2, evidence: 'Accurate journal narrations and clear timing exception log with follow-up owners.' },
  { name: 'Professional Process', points: 2, evidence: 'No unexplained plugs used; zero-variance bridge fully documented.' },
];

export const S08_CHECKLIST = [
  'I identified the unadjusted Cash Book debit balance (₹87,500) and Bank Statement credit balance (₹83,200).',
  'I posted permanent adjustments into the Cash Book: Bank Charges ₹500 (Cr) and Interest Earned ₹200 (Dr).',
  'My adjusted Cash Book balance equals exactly ₹87,200.',
  'I placed timing items on the BRS schedule: Added Unpresented Cheque (₹6,000) and Deducted Deposit in Transit (₹10,000).',
  'My calculated statement balance matches the bank statement: ₹83,200 with exactly ₹0 variance.',
  'I created an Exception Log assigning follow-up owners and clearance target dates for timing items.',
];

export const INITIAL_S08_STATE: Session08WorkstationState = {
  unadjustedBook: UNADJUSTED_CASHBOOK_INR,
  bankCharges: BANK_CHARGES_INR,
  interestEarned: INTEREST_EARNED_INR,
  unpresentedCheque: UNPRESENTED_CHEQUE_INR,
  depositInTransit: DEPOSIT_IN_TRANSIT_INR,
  actualStatement: ACTUAL_STATEMENT_INR,
  discrepancies: INITIAL_DISCREPANCIES,
  journalEntries: INITIAL_JOURNAL_ENTRIES,
  exceptionLog: INITIAL_EXCEPTION_LOG,
  peerChallengeNote:
    'The ₹10,000 customer deposit is already entered in our Cash Book as a debit to Bank and credit to Customer Receivables. It is simply in transit through the clearinghouse. Posting it again would duplicate cash assets and understate receivables, creating fictitious accounting entries. Timing differences clear naturally through the banking network and must never receive journal entries.',
  antiPlugPledge:
    'I affirm that no unexplained plugs, suspense dumps, or forced balancing entries have been created. Financial reconciliations must achieve zero variance purely through verified source documents and auditable timing differences.',
  governance: {
    studentId: 'STU-2026-0881',
    fileVersion: 'StudentID_S08_v01.xlsx',
    contributionSummary: 'Prepared side-by-side comparison, classified 4 discrepancies, computed adjusted cash book balance (₹87,200), and proved 3-column BRS zero-variance bridge to bank statement (₹83,200).',
    peerCorrection: 'Peer controller challenged posting timing items; verified that timing items clear naturally and do not receive ledger entries.',
  },
  checkedIndices: [0, 1, 2, 3, 4, 5],
};

export function loadSession08State(): Session08WorkstationState {
  if (typeof window === 'undefined') return INITIAL_S08_STATE;
  try {
    const saved = localStorage.getItem(S08_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_S08_STATE,
        ...parsed,
        discrepancies: parsed.discrepancies?.length ? parsed.discrepancies : INITIAL_DISCREPANCIES,
        journalEntries: parsed.journalEntries?.length ? parsed.journalEntries : INITIAL_JOURNAL_ENTRIES,
        exceptionLog: parsed.exceptionLog?.length ? parsed.exceptionLog : INITIAL_EXCEPTION_LOG,
      };
    }
  } catch {}
  return INITIAL_S08_STATE;
}

export function saveSession08State(state: Session08WorkstationState): void {
  if (typeof window === 'undefined') return;
  try {
    const withTimestamp = {
      ...state,
      lastSaved: new Date().toLocaleTimeString(),
    };
    localStorage.setItem(S08_STORAGE_KEY, JSON.stringify(withTimestamp));
  } catch {}
}

