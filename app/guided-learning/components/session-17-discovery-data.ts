/**
 * VCEP Session 17: Industry Challenge Discovery — Canonical Data & State Model
 * Mission: Discover the Problem Before Building.
 * 
 * Source Grounding:
 * - Approved Drive Curriculum: curriculum/archive/downloads/S17_Industry_Challenge_Discovery.docx
 * - Master Schema: app/guided-learning/drive-edition-3.json (Session 17)
 * - Essential Scenario: Vayentra Labs founder reports slow cash visibility and requests a dashboard.
 *   Case F receivables (4 invoices, ₹1,00,000, ₹20k deficit) and Case G leads are available
 *   but CANNOT be reliably joined.
 */

export const S17_STORAGE_KEY = 'vcep:s17:drive-v3:student-workstation';
export const S17_PREVIEW_KEY = 'vcep-drive-edition3:session:17:preview';

// ==========================================
// 1. CANONICAL FINANCIAL CONTROLS & DATA
// ==========================================

export const CASE_F_AS_OF_DATE = '2026-10-31';

export interface CaseFInvoice {
  id: string;
  customer: string;
  dueDate: string;
  amountINR: number;
  overdueDays: number;
  agingBucket: 'Current' | '1–30 Days' | '31–60 Days' | '61–90+ Days';
  disputedAmountINR: number;
  statusNote: string;
}

export const CASE_F_INVOICES: CaseFInvoice[] = [
  {
    id: 'F01',
    customer: 'Asha',
    dueDate: '2026-10-31',
    amountINR: 10000,
    overdueDays: 0,
    agingBucket: 'Current',
    disputedAmountINR: 0,
    statusNote: 'Due today (31 Oct); classified as Current. Standard collection.',
  },
  {
    id: 'F02',
    customer: 'Beacon',
    dueDate: '2026-10-16',
    amountINR: 20000,
    overdueDays: 15,
    agingBucket: '1–30 Days',
    disputedAmountINR: 5000,
    statusNote: '₹5,000 under active dispute; undisputed ₹15,000 collectible.',
  },
  {
    id: 'F03',
    customer: 'Cedar',
    dueDate: '2026-09-16',
    amountINR: 30000,
    overdueDays: 45,
    agingBucket: '31–60 Days',
    disputedAmountINR: 0,
    statusNote: '45 days overdue; follow-up call required.',
  },
  {
    id: 'F04',
    customer: 'Delta',
    dueDate: '2026-08-17',
    amountINR: 40000,
    overdueDays: 75,
    agingBucket: '61–90+ Days',
    disputedAmountINR: 0,
    statusNote: '75 days overdue; highest collection risk, no payment promise logged.',
  },
];

export const CASE_F_LIQUIDITY_SUMMARY = {
  openingBankCash: 25000,
  unavoidable7DayOutflows: 45000,
  net7DayDeficit: 20000, // 25,000 - 45,000 = -20,000 deficit!
  totalReceivables: 100000,
  totalDisputed: 5000,
  undisputedReceivables: 95000,
  numberOfInvoices: 4,
};

export const CASE_G_CRM_SUMMARY = {
  totalInquiries: 8,
  wonLeads: 3,
  lostLeads: 2,
  openLeads: 3, // L06 (due 28 Oct), L07 (due 30 Oct), L08 (due 03 Nov)
};

export const NO_JOIN_KEY_SAFEGUARD = 
  'Critical Curriculum Safeguard: Case F accounting invoices and Case G CRM sales inquiries share NO common primary or foreign key. Never merge or join these separate datasets.';

// ==========================================
// 2. CARDINAL PRINCIPLES OF CHALLENGE DISCOVERY
// ==========================================

export interface DiscoveryPrinciple {
  principleNum: number;
  title: string;
  badge: string;
  description: string;
}

export const DISCOVERY_PRINCIPLES: DiscoveryPrinciple[] = [
  {
    principleNum: 1,
    title: 'Symptoms vs Root Causes',
    badge: 'Problem Discovery',
    description: 'Clients often ask for tools ("Build an AI dashboard"). Discovery uncovers the true operational bottleneck: an imminent ₹20,000 payroll deficit before Friday.',
  },
  {
    principleNum: 2,
    title: 'Data Boundary Integrity',
    badge: 'Dataset Boundary',
    description: 'Never assume systems can be joined without verified keys. Case F receivables and Case G inquiries remain strictly separate reporting streams.',
  },
  {
    principleNum: 3,
    title: 'Distinguish Claims from Facts',
    badge: 'Evidence Verification',
    description: 'Founder statements (e.g., "Leads will pay soon") are unverified opinions until reconciled against audited banking and ledger control totals.',
  },
  {
    principleNum: 4,
    title: '5-Element Problem Architecture',
    badge: '80-Word Standard',
    description: 'A professional statement names: User Persona → Measurable Problem → Root Cause Evidence → Business Consequence → Success Metric.',
  },
];

// ==========================================
// 3. CLIENT INTERVIEW DIALOGUE SIMULATOR
// ==========================================

export interface InterviewDialogueTurn {
  turnId: number;
  topic: string;
  founderStatement: string;
  validatedSourceFact: string;
  analyticalFinding: string;
}

export const INTERVIEW_DIALOGUE_TURNS: InterviewDialogueTurn[] = [
  {
    turnId: 1,
    topic: 'Requested Solution vs Root Problem',
    founderStatement: 'I have no visibility into unpaid bills. Our team is flying blind. I need an AI dashboard built immediately to solve our cash problem.',
    validatedSourceFact: 'Bank balance is ₹25,000, while committed 7-day outflows are ₹45,000. An immediate ₹20,000 liquidity deficit threatens Friday payroll.',
    analyticalFinding: 'The problem is not a lack of AI/visuals; it is a critical ₹20,000 cash deficit requiring prioritized debtor collections.',
  },
  {
    turnId: 2,
    topic: 'CRM Leads vs Accounting Invoices',
    founderStatement: 'Just join the CRM sales leads with our invoices so we know which hot prospects will pay off our receivables.',
    validatedSourceFact: 'Case G CRM inquiries contain no customer IDs or invoice references. There is NO valid join key between Case G and Case F.',
    analyticalFinding: 'Sales leads cannot be joined to invoices. Merging these tables creates invalid synthetic data and distorts audit controls.',
  },
  {
    turnId: 3,
    topic: 'Debtor Recovery Expectations',
    founderStatement: 'Delta owes ₹40,000 and Beacon owes ₹20,000. We can just collect from both this week and solve the cash squeeze.',
    validatedSourceFact: 'Delta is 75 days overdue with no payment promise. Beacon is actively disputing ₹5,000 due to alleged service deficiencies.',
    analyticalFinding: 'Beacon’s ₹5,000 must be quarantined in suspense. Only undisputed cash (Asha ₹10k, Beacon ₹15k) can realistically avert payroll deficit.',
  },
  {
    turnId: 4,
    topic: 'User Roles & Delivery Boundaries',
    founderStatement: 'Give me whatever format works, and make sure it has automated SMS payment reminders sent to all customers.',
    validatedSourceFact: 'Managing Director needs weekly liquidity sign-off; Collections Lead needs daily debtor action lists. SMS gateway is strictly out-of-scope.',
    analyticalFinding: 'Scope is strictly capped at a 10-working-day spreadsheet model requiring under 6 student hours. Automated gateways are excluded.',
  },
];

// ==========================================
// 4. EIGHT STRUCTURED DISCOVERY QUESTIONS
// ==========================================

export interface DiscoveryQuestion {
  id: string;
  dimension: 'Decisions' | 'Users' | 'Evidence' | 'Permissions' | 'Success';
  category: string;
  question: string;
  stakeholderAnswer: string;
  evidenceRequired: string;
}

export const INITIAL_DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  {
    id: 'Q1',
    dimension: 'Users',
    category: 'Target User Persona',
    question: 'Who will use this financial model daily to make operational decisions?',
    stakeholderAnswer: 'The Managing Director (for weekly liquidity sign-off) and the Collections Lead (for daily debtor calls).',
    evidenceRequired: 'Role accountability matrix and sign-off workflow.',
  },
  {
    id: 'Q2',
    dimension: 'Decisions',
    category: 'High-Stakes Decision',
    question: 'Which critical management decision is currently blocked by lack of visibility?',
    stakeholderAnswer: 'Deciding which client to contact first to cover a ₹20,000 cash deficit before Friday payroll without taking emergency debt.',
    evidenceRequired: '7-day cash obligations breakdown (₹45,000 unavoidable outflows).',
  },
  {
    id: 'Q3',
    dimension: 'Evidence',
    category: 'Available Data Sources',
    question: 'What source ledgers are verified and authorized for this capstone project?',
    stakeholderAnswer: 'Case F Receivables Ledger (4 invoices totaling ₹1,00,000) and opening bank balance of ₹25,000.',
    evidenceRequired: 'Case F version 1 ledger records with ₹1,00,000 control total.',
  },
  {
    id: 'Q4',
    dimension: 'Permissions',
    category: 'System Join Limitation',
    question: 'Can we connect the CRM sales leads (Case G) to accounting invoices (Case F)?',
    stakeholderAnswer: 'No primary key or common customer ID exists between Case F and Case G. They must remain separate datasets.',
    evidenceRequired: 'Explicit project scope exclusion log confirming zero join.',
  },
  {
    id: 'Q5',
    dimension: 'Decisions',
    category: 'Aging Calculation Rules',
    question: 'How should overdue days and aging buckets be determined as of 31 October 2026?',
    stakeholderAnswer: 'Days Overdue = Max(0, 31 Oct - Due Date). Invoices due on 31 Oct (F01 Asha) are Current, not overdue.',
    evidenceRequired: 'Standardized aging schedule formula test (0d, 15d, 45d, 75d).',
  },
  {
    id: 'Q6',
    dimension: 'Evidence',
    category: 'Dispute Quarantine',
    question: 'How should Beacon Logistics’ ₹5,000 disputed balance within F02 be handled?',
    stakeholderAnswer: 'Isolate the ₹5,000 in suspense. Do not count it as confirmed cash until operations signs off on deliverables.',
    evidenceRequired: 'Separate line item on cash forecast and dispute queue.',
  },
  {
    id: 'Q7',
    dimension: 'Permissions',
    category: 'Scope Boundaries & Resources',
    question: 'Are automated SMS gateways or payment gateway integrations included in project scope?',
    stakeholderAnswer: 'Strictly excluded. Version 1 is a verified spreadsheet workbook and decision memo capped at 6 student hours over 10 days.',
    evidenceRequired: 'Out-of-scope charter boundary agreement.',
  },
  {
    id: 'Q8',
    dimension: 'Success',
    category: 'Measurable Success Metric',
    question: 'What quantitative test proves the project has succeeded on Demo Day?',
    stakeholderAnswer: 'All 4 Case F invoices accounted for with zero variance (₹1,00,000 total), and 7-day cash forecast demonstrates closing surplus.',
    evidenceRequired: 'Zero-variance reconciliation proof on Case F control total.',
  },
];

// ==========================================
// 5. 80-WORD BUSINESS PROBLEM STATEMENT
// ==========================================

export const MAX_PROBLEM_STATEMENT_WORDS = 80;

export const DEFAULT_PROBLEM_STATEMENT = 
  'The Managing Director of Vayentra Labs lacks visibility into ₹1,00,000 across 4 outstanding client invoices, creating a ₹20,000 liquidity deficit against upcoming payroll obligations. Because sales leads and invoice ledgers lack verified data keys, collections teams cannot prioritize debtors. We will construct a 7-day cash deficit model and receivables aging schedule that reconciles to Case F with zero variance within 10 working days.';

// ==========================================
// 6. DATA PERMISSIONS CHECKLIST
// ==========================================

export interface DataPermissionCheck {
  id: string;
  title: string;
  description: string;
  isCompliant: boolean;
}

export const INITIAL_DATA_PERMISSIONS: DataPermissionCheck[] = [
  {
    id: 'perm-privacy',
    title: 'Customer Financial Confidentiality',
    description: 'Customer names (Asha, Beacon, Cedar, Delta) and ledger amounts are treated as confidential corporate data.',
    isCompliant: true,
  },
  {
    id: 'perm-separation',
    title: 'Separation of Duties in Dispute Handling',
    description: 'Credit note adjustments on Beacon’s ₹5,000 dispute cannot be executed by collections analysts without controller approval.',
    isCompliant: true,
  },
  {
    id: 'perm-readonly',
    title: 'Read-Only Banking Ledger Access',
    description: 'Opening bank cash (₹25,000) and committed outflows (₹45,000) are read-only baseline records; no manual tampering permitted.',
    isCompliant: true,
  },
  {
    id: 'perm-no-ai-leak',
    title: 'No External AI Data Leakage',
    description: 'Sensitive client invoice numbers and customer dispute claims must not be uploaded to unapproved public AI tools.',
    isCompliant: true,
  },
  {
    id: 'perm-boundary',
    title: 'Case F & Case G Boundary Preservation',
    description: 'Explicit compliance policy barring synthetic join keys between CRM leads and accounting receivables.',
    isCompliant: true,
  },
];

// ==========================================
// 7. INVALIDATING ASSUMPTIONS & EVIDENCE MAP
// ==========================================

export interface InvalidatingAssumption {
  id: number;
  assumptionText: string;
  invalidationTrigger: string;
  evidenceMitigation: string;
}

export const INITIAL_ASSUMPTIONS: InvalidatingAssumption[] = [
  {
    id: 1,
    assumptionText: 'Assumption 1: All 4 Case F invoices (₹1,00,000 total) are fully collectible without bad debt write-offs.',
    invalidationTrigger: 'Invalidated if Beacon’s ₹5,000 dispute leads to a full credit note or Delta defaults on its 75-day overdue balance.',
    evidenceMitigation: 'Quarantine ₹5,000 in suspense and require customer credit verification before counting receipts in 7-day cash plan.',
  },
  {
    id: 2,
    assumptionText: 'Assumption 2: Case G sales inquiries can be relied upon to provide immediate liquidity for payroll.',
    invalidationTrigger: 'Invalidated because Case G inquiries lack foreign keys to Case F invoices, and open inquiries (L06–L08) have no signed contracts.',
    evidenceMitigation: 'Enforce strict dataset separation; exclude all unclosed sales inquiries from immediate 7-day cash coverage.',
  },
  {
    id: 3,
    assumptionText: 'Assumption 3: Delivering a visual dashboard alone will automatically accelerate cash collections.',
    invalidationTrigger: 'Invalidated because software cannot collect money without active, prioritized human debtor outreach and payment agreements.',
    evidenceMitigation: 'Deliver actionable prioritized debtor call lists with named ownership and call milestone dates rather than static graphs.',
  },
];

export const DEFAULT_NEXT_DISCOVERY_ACTION = 
  'Next Discovery Action: Obtain signed dispute documentation from Beacon Logistics regarding the ₹5,000 service dispute, and schedule a 30-minute alignment call with the Managing Director to approve formal debtor escalation thresholds.';

// ==========================================
// 8. SESSION 17 STATE MODEL
// ==========================================

export interface Session17Governance {
  preparerName: string;
  reviewerName: string;
  decisionOwnerName: string;
  approvalStatus: 'Approved' | 'Conditional' | 'Draft';
  signoffDate: string;
  fileVersion: string;
}

export interface Session17State {
  questions: DiscoveryQuestion[];
  problemStatement: string;
  permissions: DataPermissionCheck[];
  assumptions: InvalidatingAssumption[];
  nextDiscoveryAction: string;
  governance: Session17Governance;
}

export const DEFAULT_SESSION_17_STATE: Session17State = {
  questions: INITIAL_DISCOVERY_QUESTIONS,
  problemStatement: DEFAULT_PROBLEM_STATEMENT,
  permissions: INITIAL_DATA_PERMISSIONS,
  assumptions: INITIAL_ASSUMPTIONS,
  nextDiscoveryAction: DEFAULT_NEXT_DISCOVERY_ACTION,
  governance: {
    preparerName: 'Lead Discovery Analyst',
    reviewerName: 'Senior Project Manager',
    decisionOwnerName: 'Vayentra Labs Founder / MD',
    approvalStatus: 'Approved',
    signoffDate: '2026-11-06',
    fileVersion: 'StudentID_S17_v01.xlsx',
  },
};

// ==========================================
// 9. PERSISTENCE HELPERS
// ==========================================

export function loadSession17State(): Session17State {
  if (typeof window === 'undefined') return DEFAULT_SESSION_17_STATE;
  try {
    const raw = localStorage.getItem(S17_STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION_17_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SESSION_17_STATE,
      ...parsed,
      governance: {
        ...DEFAULT_SESSION_17_STATE.governance,
        ...(parsed.governance || {}),
      },
    };
  } catch {
    return DEFAULT_SESSION_17_STATE;
  }
}

export function saveSession17State(state: Session17State): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(S17_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function clearSession17State(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(S17_STORAGE_KEY);
  } catch {}
}

// ==========================================
// 10. 10-POINT RUBRIC SPECIFICATION
// ==========================================

export interface RubricCriterion {
  id: string;
  name: string;
  marks: number;
  description: string;
  evidenceExpected: string;
}

export const S17_RUBRIC: RubricCriterion[] = [
  {
    id: 's17-crit-exec',
    name: 'Execution',
    marks: 4,
    description: 'Complete discovery interview record, 8 questions across all dimensions, and separate Case F/G data mapping.',
    evidenceExpected: 'All 8 questions documented, Case F 4 invoices mapped, and zero join between Case F and G verified.',
  },
  {
    id: 's17-crit-reas',
    name: 'Reasoning',
    marks: 2,
    description: 'Distinguishes founder statements from verified facts; identifies 3 critical invalidating assumptions and project boundaries.',
    evidenceExpected: 'Evidence separating dashboard request from ₹20k deficit, plus 3 explicit invalidation triggers.',
  },
  {
    id: 's17-crit-comm',
    name: 'Communication',
    marks: 2,
    description: 'Concise 80-word problem statement following the 5-element framework (Persona, Problem, Evidence, Consequence, Success).',
    evidenceExpected: 'Problem statement <= 80 words containing all 5 architectural elements.',
  },
  {
    id: 's17-crit-proc',
    name: 'Professional Process',
    marks: 2,
    description: 'Data permissions checklist complete, named review roles recorded, and deliverable StudentID_S17_v01.xlsx logged.',
    evidenceExpected: '5 data permission items verified, named review roles, and versioned file reference.',
  },
];

