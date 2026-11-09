/**
 * VCEP Session 06: Ledger and Month End Close — Canonical Data & State Model
 * Mission: Close the Books with Confidence.
 * 
 * Source Grounding:
 * - Approved Drive Workbook: curriculum/archive/downloads/S06_Ledger_and_Month_End_Close.docx
 * - Schema: app/guided-learning/drive-edition-3.json (Session 6)
 */

export const S06_STORAGE_KEY = 'vcep:s06:drive-v3:student-workstation';
export const S06_PREVIEW_KEY = 'vcep-drive-edition3:session:6:preview';

// Canonical Math Constants
export const OPENING_BANK_DEBIT = 100000;
export const OPENING_CAPITAL_CREDIT = 100000;
export const ERROR_AMOUNT_INR = 35000;
export const TARGET_TRIAL_BALANCE_TOTAL = 218000;
export const DRAFT_TRIAL_BALANCE_TOTAL = 253000;
export const TARGET_REVENUE = 100000;
export const TARGET_TOTAL_EXPENSES = 46500;
export const TARGET_NET_PROFIT = 53500;
export const TARGET_ASSETS = 171500;
export const TARGET_LIABILITIES = 18000;
export const TARGET_EQUITY = 153500;

export interface LedgerPosting {
  date: string;
  ref: string;
  amount: number;
}

export interface TAccountModel {
  accountName: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  debits: LedgerPosting[];
  credits: LedgerPosting[];
}

export interface CorrectionJournalEntry {
  debitAccount: string;
  creditAccount: string;
  amount: number;
  sourceDoc: string;
  explanation: string;
  isApplied: boolean;
}

export interface TrialBalanceRow {
  account: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  debit: number;
  credit: number;
}

export interface CloseChecklistItem {
  id: string;
  title: string;
  description: string;
  verified: boolean;
}

export interface Session06WorkstationState {
  correctionJournal: CorrectionJournalEntry;
  undetectedErrors: string;
  checklist: CloseChecklistItem[];
  governance: {
    studentId: string;
    fileVersion: string;
    contributionSummary: string;
    peerCorrection: string;
    professionalBoundary: string;
  };
  lastSaved?: string;
}

export const INITIAL_CHECKLIST: CloseChecklistItem[] = [
  {
    id: 'chk-bank',
    title: 'Bank Ledger & Statement Verification',
    description: 'Verify closing bank balance of ₹1,41,500 matches bank advice with zero cash variance; cash was not affected by the A05 reclassification.',
    verified: true,
  },
  {
    id: 'chk-receivables',
    title: 'Trade Receivables Aging & Collection Audit',
    description: 'Reconcile Apex Retail account: ₹60,000 credit sales less ₹35,000 collection equals ₹25,000 ending receivable asset.',
    verified: true,
  },
  {
    id: 'chk-liabilities',
    title: 'Accruals & Unearned Liabilities Verification',
    description: 'Audit ending liabilities: Wages Payable ₹6,000 (after ₹4,000 disbursement) and Customer Advances ₹12,000 (after ₹3,000 refund).',
    verified: true,
  },
  {
    id: 'chk-vouchers',
    title: 'Source Voucher Audit Trail Completeness',
    description: 'Confirm all 12 Case A events have auditable document IDs (A01–A12) on file with no missing synthetic vouchers.',
    verified: true,
  },
];

export const INITIAL_CORRECTION_JOURNAL: CorrectionJournalEntry = {
  debitAccount: 'Service Revenue',
  creditAccount: 'Accounts Receivable',
  amount: 35000,
  sourceDoc: 'Doc A05 (Voucher DEP-2026-302 / INV-2026-101)',
  explanation: 'Reversing premature ₹35,000 revenue recognized on Apex Retail collection and applying against Trade Receivables. Bank cash is unchanged as it was correctly debited in A05.',
  isApplied: true,
};

export const INITIAL_S06_STATE: Session06WorkstationState = {
  correctionJournal: INITIAL_CORRECTION_JOURNAL,
  undetectedErrors: '1. Error of Principle: Posting an item to the wrong class of account (e.g. crediting revenue instead of a receivable, or debiting an expense instead of capitalizing an asset). Both debits and credits equal, so the trial balance balances despite financial statement distortion.\n2. Error of Omission: Complete failure to record a transaction in both debit and credit sides. Debits still equal credits, leaving the trial balance balanced while transactions are missing.',
  checklist: INITIAL_CHECKLIST,
  governance: {
    studentId: 'STU-2026-ACC',
    fileVersion: 'StudentID_S06_v01',
    contributionSummary: '',
    peerCorrection: '',
    professionalBoundary: '',
  },
};

export const S06_RUBRIC = [
  {
    name: 'Execution',
    points: 4,
    evidence: 'Complete and accurate ledger postings, correction journal (Dr Revenue ₹35,000, Cr AR ₹35,000), balanced trial balance (₹2,18,000), and income statement (₹53,500).',
  },
  {
    name: 'Reasoning',
    points: 2,
    evidence: 'Verifies accounting equation Assets (₹1,71,500) = Liabilities (₹18,000) + Equity (₹153,500); explains why balanced TB does not prove absence of errors.',
  },
  {
    name: 'Communication',
    points: 2,
    evidence: 'Clear correction journal citing Doc A05 reference, and structured close checklist explaining cash invariance.',
  },
  {
    name: 'Professional Process',
    points: 2,
    evidence: 'Source and version record StudentID_S06_v01, complete close checklist sign-off, and autonomous quality boundary.',
  },
];

export function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Calculates trial balance and financial statements based on correction journal state
 */
export function calculateFinancialStatements(correctionApplied: boolean) {
  // Accounts
  const bankDebit = 141500;
  const receivablesDebit = correctionApplied ? 25000 : 60000;
  const equipmentDebit = 5000;
  const rentDebit = 12000;
  const softwareDebit = 6000;
  const contractorDebit = 18000;
  const wageExpenseDebit = 10000;
  const bankChargesDebit = 500;

  const wagesPayableCredit = 6000;
  const customerAdvancesCredit = 12000;
  const capitalCredit = 100000;
  const revenueCredit = correctionApplied ? 100000 : 135000;

  const totalDebits =
    bankDebit +
    receivablesDebit +
    equipmentDebit +
    rentDebit +
    softwareDebit +
    contractorDebit +
    wageExpenseDebit +
    bankChargesDebit;

  const totalCredits =
    wagesPayableCredit + customerAdvancesCredit + capitalCredit + revenueCredit;

  const totalExpenses =
    rentDebit + softwareDebit + contractorDebit + wageExpenseDebit + bankChargesDebit;

  const netProfit = revenueCredit - totalExpenses;

  const totalAssets = bankDebit + receivablesDebit + equipmentDebit;
  const totalLiabilities = wagesPayableCredit + customerAdvancesCredit;
  const totalEquity = capitalCredit + netProfit;

  const equationBalanced = totalAssets === totalLiabilities + totalEquity;

  const trialBalanceRows: TrialBalanceRow[] = [
    { account: 'Bank', type: 'Asset', debit: bankDebit, credit: 0 },
    { account: 'Trade Receivables', type: 'Asset', debit: receivablesDebit, credit: 0 },
    { account: 'Equipment Asset (Capitalized)', type: 'Asset', debit: equipmentDebit, credit: 0 },
    { account: 'Rent Expense', type: 'Expense', debit: rentDebit, credit: 0 },
    { account: 'Software Subscription Expense', type: 'Expense', debit: softwareDebit, credit: 0 },
    { account: 'Contractor Expense', type: 'Expense', debit: contractorDebit, credit: 0 },
    { account: 'Wages Expense', type: 'Expense', debit: wageExpenseDebit, credit: 0 },
    { account: 'Bank Charges Expense', type: 'Expense', debit: bankChargesDebit, credit: 0 },
    { account: 'Wages Payable', type: 'Liability', debit: 0, credit: wagesPayableCredit },
    { account: 'Customer Advances (Liability)', type: 'Liability', debit: 0, credit: customerAdvancesCredit },
    { account: 'Owner Capital', type: 'Equity', debit: 0, credit: capitalCredit },
    { account: 'Service Revenue', type: 'Revenue', debit: 0, credit: revenueCredit },
  ];

  return {
    trialBalanceRows,
    totalDebits,
    totalCredits,
    isTrialBalanceEqual: totalDebits === totalCredits,
    isTargetBalance: totalDebits === TARGET_TRIAL_BALANCE_TOTAL && totalCredits === TARGET_TRIAL_BALANCE_TOTAL,
    revenue: revenueCredit,
    totalExpenses,
    netProfit,
    isTargetProfit: netProfit === TARGET_NET_PROFIT,
    totalAssets,
    totalLiabilities,
    totalEquity,
    equationBalanced,
  };
}

export function loadSession06State(): Session06WorkstationState {
  if (typeof window === 'undefined') return INITIAL_S06_STATE;
  try {
    const raw = localStorage.getItem(S06_STORAGE_KEY);
    if (!raw) return INITIAL_S06_STATE;
    const parsed = JSON.parse(raw);
    return {
      correctionJournal: parsed.correctionJournal || {
        ...INITIAL_CORRECTION_JOURNAL,
        isApplied: parsed.errorCorrected !== undefined ? parsed.errorCorrected : true,
        explanation: parsed.correctionNote || INITIAL_CORRECTION_JOURNAL.explanation,
      },
      undetectedErrors: parsed.undetectedErrors || INITIAL_S06_STATE.undetectedErrors,
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist : INITIAL_CHECKLIST,
      governance: {
        studentId: parsed.governance?.studentId || 'STU-2026-ACC',
        fileVersion: parsed.governance?.fileVersion || 'StudentID_S06_v01',
        contributionSummary: parsed.governance?.contributionSummary || '',
        peerCorrection: parsed.governance?.peerCorrection || '',
        professionalBoundary: parsed.governance?.professionalBoundary || '',
      },
      lastSaved: parsed.lastSaved || parsed.timestamp,
    };
  } catch (err) {
    console.warn('[Session06] Error loading persisted state:', err);
    return INITIAL_S06_STATE;
  }
}

export function saveSession06State(state: Session06WorkstationState): void {
  if (typeof window === 'undefined') return;
  try {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const payload = {
      ...state,
      lastSaved: time,
      timestamp: time,
      // Backward compatibility fields
      errorCorrected: state.correctionJournal.isApplied,
      correctionNote: state.correctionJournal.explanation,
    };
    localStorage.setItem(S06_STORAGE_KEY, JSON.stringify(payload));
    sessionStorage.setItem(S06_PREVIEW_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Session06] Error saving state:', err);
  }
}

