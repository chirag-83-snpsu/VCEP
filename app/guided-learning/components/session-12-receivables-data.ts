/**
 * VCEP Session 12: Receivables and Working Capital — Canonical Data & State Model
 * Mission: Turn Overdue Invoices into a Cash Plan.
 * 
 * Source Grounding:
 * - Approved Drive Workbook: curriculum/archive/downloads/S12_Receivables_and_Working_Capital.docx
 * - Master Schema: app/guided-learning/drive-edition-3.json (Session 12)
 * - Case F Receivables and cash release as of 31 October 2026.
 */

export const S12_STORAGE_KEY = 'vcep:s12:drive-v3:student-workstation';
export const S12_PREVIEW_KEY = 'vcep-drive-edition3:session:12:preview';

export const CASE_F_AS_OF_DATE = '2026-10-31';
export const OPENING_BANK_BALANCE = 25000;
export const MANDATORY_7_DAY_PAYMENTS = 45000;
export const INITIAL_NO_COLLECTION_GAP = -20000; // ₹25,000 - ₹45,000 = -₹20,000

export type AgeingBucket = 'Current' | '1–30 Days' | '31–60 Days' | '61–90 Days' | '>90 Days';

export interface ReceivablesInvoiceItem {
  id: string; // 'F01' | 'F02' | 'F03' | 'F04'
  customer: string;
  invoiceDate: string;
  dueDate: string;
  outstandingINR: number;
  correctDaysOverdue: number;
  correctBucket: AgeingBucket;
  disputedAmountINR: number;
  undisputedAmountINR: number;
  paymentRiskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High (Severe Overdue)';
  defaultPriority: 'Priority 1 (Targeted)' | 'Priority 2 (Targeted)' | 'Priority 3 (Follow-up)' | 'Priority 4 (High Risk)';
  tacticalAction: string;
}

export const CASE_F_INVOICES: ReceivablesInvoiceItem[] = [
  {
    id: 'F01',
    customer: 'Asha Technologies',
    invoiceDate: '2026-10-01',
    dueDate: '2026-10-31',
    outstandingINR: 10000,
    correctDaysOverdue: 0,
    correctBucket: 'Current',
    disputedAmountINR: 0,
    undisputedAmountINR: 10000,
    paymentRiskLevel: 'Low',
    defaultPriority: 'Priority 1 (Targeted)',
    tacticalAction: 'Invoice due today on 31 Oct. Send friendly same-day payment prompt for ₹10,000 electronic remittance.',
  },
  {
    id: 'F02',
    customer: 'Beacon Media & Consulting',
    invoiceDate: '2026-09-16',
    dueDate: '2026-10-16',
    outstandingINR: 20000,
    correctDaysOverdue: 15,
    correctBucket: '1–30 Days',
    disputedAmountINR: 5000,
    undisputedAmountINR: 15000,
    paymentRiskLevel: 'Moderate',
    defaultPriority: 'Priority 2 (Targeted)',
    tacticalAction: 'Beacon disputes ₹5,000 billing variance. Demand immediate transfer of undisputed ₹15,000 by 2 Nov while isolating dispute.',
  },
  {
    id: 'F03',
    customer: 'Cedar Retail Systems',
    invoiceDate: '2026-08-17',
    dueDate: '2026-09-16',
    outstandingINR: 30000,
    correctDaysOverdue: 45,
    correctBucket: '31–60 Days',
    disputedAmountINR: 0,
    undisputedAmountINR: 30000,
    paymentRiskLevel: 'Elevated',
    defaultPriority: 'Priority 3 (Follow-up)',
    tacticalAction: '45 days overdue. Issue urgent payment demand; seek commitment for partial remittance (₹12,000–₹20,000) within 72 hours.',
  },
  {
    id: 'F04',
    customer: 'Delta Logistics Network',
    invoiceDate: '2026-07-18',
    dueDate: '2026-08-17',
    outstandingINR: 40000,
    correctDaysOverdue: 75,
    correctBucket: '61–90 Days',
    disputedAmountINR: 0,
    undisputedAmountINR: 40000,
    paymentRiskLevel: 'High (Severe Overdue)',
    defaultPriority: 'Priority 4 (High Risk)',
    tacticalAction: '75 days overdue. High bad-debt risk. Place credit hold; do not count on Delta for immediate 7-day payroll cash!',
  },
];

export interface CardinalCreditPrinciple {
  principleNum: number;
  title: string;
  description: string;
  badge: string;
  accentColor: string;
}

export const CARDINAL_CREDIT_PRINCIPLES: CardinalCreditPrinciple[] = [
  {
    principleNum: 1,
    title: 'Due Date Dictates Ageing, Not Issue Date',
    description: 'Days overdue = Max(0, As-of Date minus Due Date). An invoice due today (31 Oct) has 0 days overdue and belongs in Current.',
    badge: 'STATUTORY MEASUREMENT',
    accentColor: '#17245C',
  },
  {
    principleNum: 2,
    title: 'Promises & Invoices Are Not Cash',
    description: 'Paper revenue does not pay salaries. In 7-day liquidity forecasting, only cleared bank funds or high-probability collections count.',
    badge: 'LIQUIDITY GOVERNANCE',
    accentColor: '#0F766E',
  },
  {
    principleNum: 3,
    title: 'Isolate Disputed Balances Immediately',
    description: 'When a client disputes part of a bill (such as Beacon ₹5k), never delay the entire invoice. Collect the undisputed balance (₹15k) now.',
    badge: 'DISPUTE MANAGEMENT',
    accentColor: '#b45309',
  },
  {
    principleNum: 4,
    title: 'Older Debts Have Lower Conversion Probabilities',
    description: 'Do not rely on severely overdue accounts (Delta, 75 days) to solve emergency 7-day payroll deficits. Target current and fresh debts first.',
    badge: 'RISK CONTROL',
    accentColor: '#b91c1c',
  },
];

export interface InvoiceAuditState {
  assignedBucket: AgeingBucket;
  verifiedDaysOverdue: number;
  isDaysVerified: boolean;
  isBucketVerified: boolean;
  notes: string;
}

export interface Session12WorkstationState {
  invoiceAudits: Record<string, InvoiceAuditState>;
  targetedInvoiceIds: string[]; // e.g. ['F01', 'F02']
  beaconDisputeMessage: string;
  overdueReminderMessage: string;
  governance: {
    studentId: string;
    fileVersion: string;
    creditAnalyst: string;
    treasuryLead: string;
    decisionOwner: string;
  };
  checkedIndices: number[];
  lastSaved?: string;
}

export const DEFAULT_BEACON_DISPUTE_MESSAGE =
  `Subject: Immediate Settlement of Undisputed Balance — Invoice F02 (₹15,000) & Review of Disputed ₹5,000

Dear Accounts Team (Beacon Media & Consulting),

Thank you for your partnership. We acknowledge your billing query regarding the ₹5,000 variance on Invoice F02 (Total ₹20,000, Due 16 October 2026, 15 days overdue).

To ensure your account remains in good standing without credit holds while our operations team reviews service delivery logs for the ₹5,000 query, we request the immediate electronic remittance of the undisputed balance of ₹15,000 by Monday 2 November 2026 at 14:00.

Our Operations Lead will reach out before Wednesday with documentation on the remaining ₹5,000. Please confirm payment dispatch for the ₹15,000 undisputed portion.

Regards,
Credit & Working Capital Analyst
Vayentra Labs Enterprises`;

export const DEFAULT_OVERDUE_REMINDER_MESSAGE =
  `Subject: URGENT: Overdue Account Follow-Up — Invoice F03 (₹30,000, 45 Days Overdue)

Dear Finance & Accounts Team (Cedar Retail Systems),

Our month-end ledger review at 31 October 2026 shows that Invoice F03 for ₹30,000 (Due Date: 16 September 2026) is now 45 days overdue.

This outstanding balance exceeds our standard credit terms and has reached the 31–60 days ageing bracket. To maintain active service provisioning, please remit the full balance or an immediate initial instalment of ₹15,000 by Wednesday 4 November 2026.

Kindly forward the bank UTR / transaction confirmation upon transfer.

Regards,
Credit Control & Treasury Department
Vayentra Labs Enterprises`;

export const INITIAL_S12_STATE: Session12WorkstationState = {
  invoiceAudits: {
    F01: {
      assignedBucket: 'Current',
      verifiedDaysOverdue: 0,
      isDaysVerified: true,
      isBucketVerified: true,
      notes: 'Due today (31 Oct). 0 days overdue. Classified as Current. Priority 1 target for ₹10,000.',
    },
    F02: {
      assignedBucket: '1–30 Days',
      verifiedDaysOverdue: 15,
      isDaysVerified: true,
      isBucketVerified: true,
      notes: 'Due 16 Oct. 15 days overdue. ₹5,000 disputed, ₹15,000 undisputed. Priority 2 target for ₹15,000.',
    },
    F03: {
      assignedBucket: '31–60 Days',
      verifiedDaysOverdue: 45,
      isDaysVerified: true,
      isBucketVerified: true,
      notes: 'Due 16 Sep. 45 days overdue. 31–60 days bucket. Send urgent escalation reminder for ₹30,000.',
    },
    F04: {
      assignedBucket: '61–90 Days',
      verifiedDaysOverdue: 75,
      isDaysVerified: true,
      isBucketVerified: true,
      notes: 'Due 17 Aug. 75 days overdue. 61–90 days bucket. High bad-debt risk; place on credit hold.',
    },
  },
  targetedInvoiceIds: ['F01', 'F02'],
  beaconDisputeMessage: DEFAULT_BEACON_DISPUTE_MESSAGE,
  overdueReminderMessage: DEFAULT_OVERDUE_REMINDER_MESSAGE,
  governance: {
    studentId: 'STU-2026-1205',
    fileVersion: 'StudentID_S12_v01.xlsx',
    creditAnalyst: 'Tanvi Credit Analyst',
    treasuryLead: 'Karthik Treasury Lead',
    decisionOwner: 'Finance Controller',
  },
  checkedIndices: [0, 1, 2, 3, 4, 5],
};

export const S12_RUBRIC = [
  { name: 'Execution', points: 4, evidence: 'Correctly computes days overdue from due date, categorizes all 4 invoices into aging buckets, and presents balanced 7-day cash forecast.' },
  { name: 'Reasoning', points: 2, evidence: 'Explains why promises are not cash, isolates Beacon’s ₹5,000 dispute, and explains why Delta (75 days overdue) is not reliable for immediate payroll.' },
  { name: 'Communication', points: 2, evidence: 'Drafts professional dispute query to Beacon requesting immediate settlement of undisputed ₹15,000 and clear overdue reminder to Cedar.' },
  { name: 'Professional Process', points: 2, evidence: 'Assigns clear role owners, action dates, and evidence links; preserves deliverable StudentID_S12_v01.xlsx.' },
];

export const S12_CHECKLIST = [
  'I calculated days overdue using due dates (not issue dates) as of 31 October 2026.',
  'I assigned invoices to correct buckets: F01 Current, F02 1–30d, F03 31–60d, F04 61–90d.',
  'I reconciled the four invoice totals to verify exactly ₹1,00,000 outstanding.',
  'I identified the initial 7-day cash deficit of ₹20,000 (₹25,000 bank minus ₹45,000 outflows).',
  'I prioritized collecting Beacon’s undisputed ₹15,000 and Asha’s ₹10,000 to close the deficit.',
  'I drafted a dispute clarification for Beacon isolating the ₹5,000 query while securing ₹15,000.',
];

export function calculateDaysOverdue(asOfDateStr: string, dueDateStr: string): number {
  const asOf = new Date(asOfDateStr).getTime();
  const due = new Date(dueDateStr).getTime();
  const diffDays = Math.round((asOf - due) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getBucketForDays(days: number): AgeingBucket {
  if (days === 0) return 'Current';
  if (days <= 30) return '1–30 Days';
  if (days <= 60) return '31–60 Days';
  if (days <= 90) return '61–90 Days';
  return '>90 Days';
}

export function calculateCashForecast(targetedIds: string[]) {
  const openingBank = OPENING_BANK_BALANCE; // ₹25,000
  const mandatoryPayments = MANDATORY_7_DAY_PAYMENTS; // ₹45,000
  const initialGap = openingBank - mandatoryPayments; // -₹20,000

  // Calculate projected receipts based on targeted selections:
  // For F02, only undisputed amount (₹15,000) can be collected!
  let projectedReceipts = 0;
  for (const id of targetedIds) {
    const inv = CASE_F_INVOICES.find((i) => i.id === id);
    if (inv) {
      projectedReceipts += inv.undisputedAmountINR;
    }
  }

  const closingCash = openingBank + projectedReceipts - mandatoryPayments;
  const isDeficitClosed = closingCash >= 0;

  return {
    openingBank,
    mandatoryPayments,
    initialGap,
    projectedReceipts,
    closingCash,
    isDeficitClosed,
  };
}

export function loadSession12State(): Session12WorkstationState {
  if (typeof window === 'undefined') return INITIAL_S12_STATE;
  try {
    const raw = localStorage.getItem(S12_STORAGE_KEY);
    if (!raw) return INITIAL_S12_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_S12_STATE,
      ...parsed,
      invoiceAudits: {
        ...INITIAL_S12_STATE.invoiceAudits,
        ...(parsed.invoiceAudits || {}),
      },
      governance: {
        ...INITIAL_S12_STATE.governance,
        ...(parsed.governance || {}),
      },
    };
  } catch {
    return INITIAL_S12_STATE;
  }
}

export function saveSession12State(state: Session12WorkstationState): void {
  if (typeof window === 'undefined') return;
  try {
    const withTimestamp = {
      ...state,
      lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    localStorage.setItem(S12_STORAGE_KEY, JSON.stringify(withTimestamp));
  } catch {}
}

export function clearSession12State(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(S12_STORAGE_KEY);
  } catch {}
}

