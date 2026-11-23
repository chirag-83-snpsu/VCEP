/**
 * VCEP Session 05: Accounting Transactions — Canonical Data & State Model
 * Mission: Work as an Accounts Executive.
 * 
 * Source Grounding:
 * - Approved Drive Workbook: curriculum/archive/downloads/S05_Accounting_Transactions.docx
 * - Schema: app/guided-learning/drive-edition-3.json (Session 5)
 */

export const S05_STORAGE_KEY = 'vcep:s05:drive-v3:student-workstation';
export const S05_PREVIEW_KEY = 'vcep-drive-edition3:session:5:preview';

export const OPENING_BANK_DEBIT = 100000;
export const OPENING_CAPITAL_CREDIT = 100000;
export const TARGET_JOURNAL_TOTAL = 208500;

export interface AccountOption {
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
}

export const CHART_OF_ACCOUNTS: AccountOption[] = [
  // Assets
  { code: '1010', name: 'Bank', type: 'ASSET' },
  { code: '1020', name: 'Accounts Receivable', type: 'ASSET' },
  { code: '1510', name: 'Equipment Asset (Capitalized)', type: 'ASSET' },
  // Liabilities
  { code: '2010', name: 'Wages Payable', type: 'LIABILITY' },
  { code: '2020', name: 'Unearned Revenue (Liability)', type: 'LIABILITY' },
  // Equity
  { code: '3010', name: 'Owner Capital', type: 'EQUITY' },
  // Revenues
  { code: '4010', name: 'Service Revenue', type: 'REVENUE' },
  // Expenses
  { code: '5010', name: 'Rent Expense', type: 'EXPENSE' },
  { code: '5020', name: 'Software Subscription Expense', type: 'EXPENSE' },
  { code: '5030', name: 'Contractor Expense', type: 'EXPENSE' },
  { code: '5040', name: 'Wages Expense', type: 'EXPENSE' },
  { code: '5050', name: 'Bank Charges Expense', type: 'EXPENSE' },
];

export interface SourceVoucher {
  docId: string;
  date: string;
  documentType: string;
  voucherNumber: string;
  counterparty: string;
  amountINR: number;
  sourceEvent: string;
  excerpt: string;
  accountingNote: string;
  evidenceStatus: 'VERIFIED_AUDIT_READY' | 'RECONCILED';
}

export const CASE_A_VOUCHERS: SourceVoucher[] = [
  {
    docId: 'A01',
    date: 'Sep 02',
    documentType: 'Tax Invoice & Acceptance Memo',
    voucherNumber: 'INV-2026-101',
    counterparty: 'Apex Retail Distributors Ltd',
    amountINR: 60000,
    sourceEvent: 'Completed service on credit; client acceptance and invoice issued',
    excerpt: 'Delivery of completed commercial analytics portal accepted. Payment terms: Net 30 days.',
    accountingNote: 'Service performed; recognize revenue and create trade receivable asset.',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
  {
    docId: 'A02',
    date: 'Sep 04',
    documentType: 'Bank Credit Advice & Cash Memo',
    voucherNumber: 'CR-2026-084',
    counterparty: 'Bharat Logix Infra Pvt',
    amountINR: 40000,
    sourceEvent: 'Completed service paid immediately into bank',
    excerpt: 'Direct NEFT transfer received for on-demand consulting services delivered on Sep 04.',
    accountingNote: 'Immediate cash sale; debit bank asset and credit service revenue.',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
  {
    docId: 'A03',
    date: 'Sep 05',
    documentType: 'Landlord Cheque Receipt & Lease Note',
    voucherNumber: 'RENT-SEP-01',
    counterparty: 'Prestige Commercial Parks',
    amountINR: 12000,
    sourceEvent: 'September rent paid by bank',
    excerpt: 'Monthly lease rental for commercial office premises for September.',
    accountingNote: 'Operating expense of the current period; debit expense, credit bank.',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
  {
    docId: 'A04',
    date: 'Sep 06',
    documentType: 'SaaS Invoice & Card Advice',
    voucherNumber: 'SUB-2026-992',
    counterparty: 'CloudStack Analytics Inc',
    amountINR: 6000,
    sourceEvent: 'September software subscription paid by bank',
    excerpt: 'Monthly enterprise cloud software platform access charges.',
    accountingNote: 'Monthly software operating expense; debit subscription expense, credit bank.',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
  {
    docId: 'A05',
    date: 'Sep 10',
    documentType: 'Bank Deposit Confirmation',
    voucherNumber: 'DEP-2026-302',
    counterparty: 'Apex Retail Distributors Ltd',
    amountINR: 35000,
    sourceEvent: 'Bank collection against A01 invoice',
    excerpt: 'Part payment received via RTGS against Tax Invoice INV-2026-101 (Doc A01).',
    accountingNote: 'Collection of existing receivable! Debit Bank, Credit Accounts Receivable. Do NOT recognize revenue again.',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
  {
    docId: 'A06',
    date: 'Sep 12',
    documentType: 'Contractor Work Slip & NEFT Ref',
    voucherNumber: 'CON-2026-441',
    counterparty: 'Vanguard Technical Services',
    amountINR: 18000,
    sourceEvent: 'September contractor service paid by bank',
    excerpt: 'Specialist IT engineering support for infrastructure maintenance.',
    accountingNote: 'Direct outsourced operating expense; debit contractor expense, credit bank.',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
  {
    docId: 'A07',
    date: 'Sep 20',
    documentType: 'Approved Payroll Schedule',
    voucherNumber: 'PAY-2026-09A',
    counterparty: 'Operations Support Staff',
    amountINR: 10000,
    sourceEvent: 'September wages earned but unpaid; approved wage schedule',
    excerpt: 'Monthly certified payroll register for period ended Sep 20. Disbursement scheduled Sep 22.',
    accountingNote: 'Accrual principle: expense recognized when earned. Debit Wages Expense, Credit Wages Payable (Liability).',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
  {
    docId: 'A08',
    date: 'Sep 22',
    documentType: 'Payroll Bank Transfer Advice',
    voucherNumber: 'NEFT-PAY-092',
    counterparty: 'Operations Support Staff',
    amountINR: 4000,
    sourceEvent: 'Bank payment against A07 wage liability',
    excerpt: 'Partial wage disbursement drawn from corporate bank account against Sep 20 schedule.',
    accountingNote: 'Liability settlement! Debit Wages Payable, Credit Bank. Do NOT record wage expense twice.',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
  {
    docId: 'A09',
    date: 'Sep 24',
    documentType: 'Client Advance Receipt Voucher',
    voucherNumber: 'ADV-2026-015',
    counterparty: 'Zenith Pharma Chem',
    amountINR: 15000,
    sourceEvent: 'Refundable customer advance received in bank; future service',
    excerpt: 'Upfront retainer deposit received for analytics project commencing in October.',
    accountingNote: 'Unearned customer advance is a LIABILITY until service is delivered. Debit Bank, Credit Unearned Revenue.',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
  {
    docId: 'A10',
    date: 'Sep 26',
    documentType: 'Refund Debit Advice & Memo',
    voucherNumber: 'REF-2026-003',
    counterparty: 'Zenith Pharma Chem',
    amountINR: 3000,
    sourceEvent: 'Part of A09 advance refunded by bank',
    excerpt: 'Refund issued upon revised client scope reduction on October project.',
    accountingNote: 'Reduces the customer advance liability; Debit Unearned Revenue, Credit Bank.',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
  {
    docId: 'A11',
    date: 'Sep 28',
    documentType: 'Bank Statement Advice Note',
    voucherNumber: 'BNK-CHG-SEP',
    counterparty: 'State Bank Corporate Branch',
    amountINR: 500,
    sourceEvent: 'Bank charge shown on bank advice',
    excerpt: 'Routine commercial bank account maintenance and RTGS charges.',
    accountingNote: 'Bank service cost; Debit Bank Charges Expense, Credit Bank.',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
  {
    docId: 'A12',
    date: 'Sep 29',
    documentType: 'Asset Purchase Invoice & Warranty',
    voucherNumber: 'EQP-2026-88',
    counterparty: 'Dell ProTech Hardware',
    amountINR: 5000,
    sourceEvent: 'Equipment bought and paid through bank',
    excerpt: 'High-performance testing laptop acquired for laboratory deployment.',
    accountingNote: 'Capital expenditure! Debit Equipment Asset (Capitalized), Credit Bank. NOT an operating expense.',
    evidenceStatus: 'VERIFIED_AUDIT_READY',
  },
];

export interface JournalRowState {
  id: string;
  docId: string;
  date: string;
  sourceEvent: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  evidenceType: string;
  status: 'Verified' | 'Flagged' | 'Quarantined';
}

export const INITIAL_JOURNAL_ROWS: JournalRowState[] = [
  { id: '1', docId: 'A01', date: 'Sep 02', sourceEvent: 'Completed service on credit; invoice issued', debitAccount: 'Accounts Receivable', creditAccount: 'Service Revenue', amount: 60000, evidenceType: 'Signed Tax Invoice & Acceptance', status: 'Verified' },
  { id: '2', docId: 'A02', date: 'Sep 04', sourceEvent: 'Completed service paid immediately into bank', debitAccount: 'Bank', creditAccount: 'Service Revenue', amount: 40000, evidenceType: 'Bank Receipt & Cash Memo', status: 'Verified' },
  { id: '3', docId: 'A03', date: 'Sep 05', sourceEvent: 'September rent paid by bank', debitAccount: 'Rent Expense', creditAccount: 'Bank', amount: 12000, evidenceType: 'Landlord Receipt & Bank Advice', status: 'Verified' },
  { id: '4', docId: 'A04', date: 'Sep 06', sourceEvent: 'September software subscription paid by bank', debitAccount: 'Software Subscription Expense', creditAccount: 'Bank', amount: 6000, evidenceType: 'Vendor Tax Invoice', status: 'Verified' },
  { id: '5', docId: 'A05', date: 'Sep 10', sourceEvent: 'Bank collection against A01 invoice', debitAccount: 'Bank', creditAccount: 'Accounts Receivable', amount: 35000, evidenceType: 'Bank Deposit Confirmation', status: 'Verified' },
  { id: '6', docId: 'A06', date: 'Sep 12', sourceEvent: 'September contractor service paid by bank', debitAccount: 'Contractor Expense', creditAccount: 'Bank', amount: 18000, evidenceType: 'Contractor Work Slip & Advice', status: 'Verified' },
  { id: '7', docId: 'A07', date: 'Sep 20', sourceEvent: 'September wages earned but unpaid', debitAccount: 'Wages Expense', creditAccount: 'Wages Payable', amount: 10000, evidenceType: 'Approved Payroll Schedule', status: 'Verified' },
  { id: '8', docId: 'A08', date: 'Sep 22', sourceEvent: 'Bank payment against A07 wage liability', debitAccount: 'Wages Payable', creditAccount: 'Bank', amount: 4000, evidenceType: 'Payroll Bank Transfer Ref', status: 'Verified' },
  { id: '9', docId: 'A09', date: 'Sep 24', sourceEvent: 'Refundable customer advance received in bank', debitAccount: 'Bank', creditAccount: 'Unearned Revenue (Liability)', amount: 15000, evidenceType: 'Client Advance Receipt Voucher', status: 'Verified' },
  { id: '10', docId: 'A10', date: 'Sep 26', sourceEvent: 'Part of A09 advance refunded by bank', debitAccount: 'Unearned Revenue (Liability)', creditAccount: 'Bank', amount: 3000, evidenceType: 'Bank Debit Advice & Refund Slip', status: 'Verified' },
  { id: '11', docId: 'A11', date: 'Sep 28', sourceEvent: 'Bank charge shown on bank advice', debitAccount: 'Bank Charges Expense', creditAccount: 'Bank', amount: 500, evidenceType: 'Bank Statement Advice Note', status: 'Verified' },
  { id: '12', docId: 'A12', date: 'Sep 29', sourceEvent: 'Equipment bought and paid through bank', debitAccount: 'Equipment Asset (Capitalized)', creditAccount: 'Bank', amount: 5000, evidenceType: 'Asset Purchase Invoice & Warranty', status: 'Verified' },
];

export interface Session05WorkstationState {
  rows: JournalRowState[];
  selectedVoucherId: string;
  exceptionsNotes: string;
  governance: {
    studentId: string;
    fileVersion: string;
    contributionSummary: string;
    peerCorrection: string;
    professionalBoundary: string;
  };
  lastSaved?: string;
}

export const INITIAL_S05_STATE: Session05WorkstationState = {
  rows: INITIAL_JOURNAL_ROWS,
  selectedVoucherId: 'A01',
  exceptionsNotes: 'A09 is classified as Unearned Revenue (Liability) because service delivery has not occurred in September. A12 is capitalized as an Equipment Asset rather than expensed, per accrual accounting principles. A05 collection reduces Accounts Receivable and does not create new revenue.',
  governance: {
    studentId: 'STU-2026-ACC',
    fileVersion: 'StudentID_S05_v01',
    contributionSummary: '',
    peerCorrection: '',
    professionalBoundary: '',
  },
};

export const S05_RUBRIC = [
  {
    name: 'Execution',
    points: 4,
    evidence: 'All 12 Case A events accurately journalized with debit/credit cross-foot balance of ₹208,500.',
  },
  {
    name: 'Reasoning',
    points: 2,
    evidence: 'Correctly classifies unearned advance as liability and equipment as capitalized asset; avoids double revenue on A05.',
  },
  {
    name: 'Communication',
    points: 2,
    evidence: 'Professional journal descriptions citing specific doc IDs, dates, and evidence voucher numbers.',
  },
  {
    name: 'Professional Process',
    points: 2,
    evidence: 'Source evidence verified for each transaction before entering into official books; file versioning StudentID_S05_v01.',
  },
];

export function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function loadSession05State(): Session05WorkstationState {
  if (typeof window === 'undefined') return INITIAL_S05_STATE;
  try {
    const raw = localStorage.getItem(S05_STORAGE_KEY);
    if (!raw) return INITIAL_S05_STATE;
    const parsed = JSON.parse(raw);
    return {
      rows: parsed.rows || INITIAL_JOURNAL_ROWS,
      selectedVoucherId: parsed.selectedVoucherId || 'A01',
      exceptionsNotes: parsed.exceptionsNotes || INITIAL_S05_STATE.exceptionsNotes,
      governance: {
        studentId: parsed.governance?.studentId || 'STU-2026-ACC',
        fileVersion: parsed.governance?.fileVersion || 'StudentID_S05_v01',
        contributionSummary: parsed.governance?.contributionSummary || '',
        peerCorrection: parsed.governance?.peerCorrection || '',
        professionalBoundary: parsed.governance?.professionalBoundary || '',
      },
      lastSaved: parsed.lastSaved || parsed.timestamp,
    };
  } catch (err) {
    console.warn('[Session05] Error loading persisted state:', err);
    return INITIAL_S05_STATE;
  }
}

export function saveSession05State(state: Session05WorkstationState): void {
  if (typeof window === 'undefined') return;
  try {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const payload = {
      ...state,
      lastSaved: time,
      timestamp: time,
    };
    localStorage.setItem(S05_STORAGE_KEY, JSON.stringify(payload));
    sessionStorage.setItem(S05_PREVIEW_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Session05] Error saving state:', err);
  }
}

