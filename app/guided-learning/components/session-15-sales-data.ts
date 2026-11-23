/**
 * VCEP Session 15: Customer and Sales Operations — Canonical Data & State Model
 * Mission: Manage the Pipeline. Own the Follow-Up.
 * 
 * Source Grounding:
 * - Approved Drive Curriculum: curriculum/archive/downloads/S15_Customer_and_Sales_Operations.docx
 * - Master Schema: app/guided-learning/drive-edition-3.json (Session 15)
 * - Case G: CRM release (8 distinct enquiries as of 31 October 2026).
 */

export const S15_STORAGE_KEY = 'vcep:s15:drive-v3:student-workstation';
export const S15_PREVIEW_KEY = 'vcep-drive-edition3:session:15:preview';

export const CASE_G_AS_OF_DATE = '2026-10-31';

// ==========================================
// 1. CASE G CRM CANONICAL SOURCE RECORDS
// ==========================================

export type LeadStage = 'Won' | 'Lost' | 'Open';
export type LeadActionStatus = 'Closed' | 'Overdue' | 'On Track';

export interface CaseGLeadRecord {
  id: string; // 'L01' through 'L08'
  sourceStage: LeadStage;
  sourceOwner: string;
  sourceNextAction: string;
  sourceDueDate: string;
  actionStatus: LeadActionStatus;
  overdueDays: number;
  needDescription: string;
  followupPriority?: 'Priority 1 (High)' | 'Priority 2 (Medium)' | 'Scheduled';
}

export const CASE_G_LEADS: CaseGLeadRecord[] = [
  {
    id: 'L01',
    sourceStage: 'Won',
    sourceOwner: 'Owner A',
    sourceNextAction: 'Archive handover',
    sourceDueDate: '-',
    actionStatus: 'Closed',
    overdueDays: 0,
    needDescription: 'Commercial agreement signed; handover to delivery team completed.',
  },
  {
    id: 'L02',
    sourceStage: 'Won',
    sourceOwner: 'Owner B',
    sourceNextAction: 'Archive handover',
    sourceDueDate: '-',
    actionStatus: 'Closed',
    overdueDays: 0,
    needDescription: 'Commercial agreement signed; delivery onboarded.',
  },
  {
    id: 'L03',
    sourceStage: 'Won',
    sourceOwner: 'Owner A',
    sourceNextAction: 'Archive handover',
    sourceDueDate: '-',
    actionStatus: 'Closed',
    overdueDays: 0,
    needDescription: 'Contract finalized; client in active implementation.',
  },
  {
    id: 'L04',
    sourceStage: 'Lost',
    sourceOwner: 'Owner C',
    sourceNextAction: 'Record reason',
    sourceDueDate: '-',
    actionStatus: 'Closed',
    overdueDays: 0,
    needDescription: 'Competitor selected due to specialized geographic coverage; logged in CRM.',
  },
  {
    id: 'L05',
    sourceStage: 'Lost',
    sourceOwner: 'Owner B',
    sourceNextAction: 'Record reason',
    sourceDueDate: '-',
    actionStatus: 'Closed',
    overdueDays: 0,
    needDescription: 'Project deferred to FY27 due to internal client budget reprioritization.',
  },
  {
    id: 'L06',
    sourceStage: 'Open',
    sourceOwner: 'Owner A',
    sourceNextAction: 'Confirm requirements',
    sourceDueDate: '2026-10-28',
    actionStatus: 'Overdue',
    overdueDays: 3, // 31 Oct - 28 Oct = 3 days overdue
    needDescription: 'Client requested custom analytics scope; need requirements confirmation before proposal expiry.',
    followupPriority: 'Priority 1 (High)',
  },
  {
    id: 'L07',
    sourceStage: 'Open',
    sourceOwner: 'Owner C',
    sourceNextAction: 'Review proposal',
    sourceDueDate: '2026-10-30',
    actionStatus: 'Overdue',
    overdueDays: 1, // 31 Oct - 30 Oct = 1 day overdue
    needDescription: 'Proposal delivered 25 Oct; awaiting executive committee feedback on pricing schedule.',
    followupPriority: 'Priority 2 (Medium)',
  },
  {
    id: 'L08',
    sourceStage: 'Open',
    sourceOwner: 'Owner B',
    sourceNextAction: 'Schedule call',
    sourceDueDate: '2026-11-03',
    actionStatus: 'On Track',
    overdueDays: 0, // Due in 3 days
    needDescription: 'Preliminary inbound enquiry; discovery call scheduled for 3 November.',
    followupPriority: 'Scheduled',
  },
];

// Pipeline Counts & Truth
export const CASE_G_METRICS = {
  totalLeads: 8,
  wonLeads: 3,
  lostLeads: 2,
  openLeads: 3,
  closedLeads: 5, // 3 Won + 2 Lost
  allLeadWinRatePct: 37.5, // 3 / 8 = 37.5%
  closedLeadWinRatePct: 60.0, // 3 / 5 = 60.0%
};

// ==========================================
// 2. CARDINAL PRINCIPLES OF SALES OPERATIONS
// ==========================================

export interface SalesPrinciple {
  principleNum: number;
  title: string;
  badge: string;
  description: string;
}

export const SALES_OPERATIONS_PRINCIPLES: SalesPrinciple[] = [
  {
    principleNum: 1,
    title: 'Dual-Denominator Conversion Transparency',
    badge: 'Conversion Discipline',
    description: 'Always label your denominator: All-Lead Win Rate (3/8 = 37.5%) measures acquisition yield, while Closed-Lead Win Rate (3/5 = 60.0%) measures closing effectiveness on decided deals.',
  },
  {
    principleNum: 2,
    title: 'Preserve Historical Ground Truth',
    badge: 'Data Integrity',
    description: 'Never alter original source stages (Won/Lost/Open) to inflate pipeline forecasts. Update forward-looking action plans in separate operational columns.',
  },
  {
    principleNum: 3,
    title: 'Objective Need-Based Prioritization',
    badge: 'Zero-Bias Queue',
    description: 'Prioritize overdue actions strictly by business urgency and calendar due date. Never prioritize based on sensitive demographic or personal customer characteristics.',
  },
  {
    principleNum: 4,
    title: 'Milestone Clarity & Named Ownership',
    badge: 'Single Accountability',
    description: 'Every follow-up outreach must specify a single named owner, reference specific prior deliverables, and set a concrete clock deadline for the next customer interaction.',
  },
];

// ==========================================
// 3. DEFAULT PROFESSIONAL OUTREACH MESSAGES
// ==========================================

export const DEFAULT_FOLLOWUP_L06 = 
  'Subject: Follow-up on Analytics Service Scope & Requirements — Lead L06\n\nDear Client Leadership,\n\nI am writing to follow up on our discussion regarding your enterprise analytics requirements (due 28 October). Our technical team has finalized the proposed service scope and delivery milestones. Could we schedule a 15-minute alignment call tomorrow, Monday at 11:30 AM, to confirm your specifications so we can finalize the proposal?\n\nSincerely,\nOwner A, Sales Lead';

export const DEFAULT_FOLLOWUP_L07 = 
  'Subject: Follow-up: Commercial Proposal Review — Lead L07\n\nDear Accounts Team,\n\nFollowing up on our commercial proposal submitted on 25 October (action due 30 October), we would welcome the opportunity to review the pricing structure and address any technical questions your committee may have. Would you have 10 minutes available this Tuesday afternoon at 2:00 PM for a brief check-in?\n\nBest regards,\nOwner C, Commercial Lead';

export const DEFAULT_CONVERSION_EXPLANATION = 
  'The All-Lead Win Rate (3/8 = 37.5%) evaluates top-of-funnel acquisition yield across all 8 inquiries received, measuring overall marketing efficiency. Conversely, the Closed-Lead Win Rate (3/5 = 60.0%) isolates the 5 completed negotiations (3 Won, 2 Lost), measuring sales closing effectiveness once a deal reaches a decision. Both metrics are mathematically valid and tell complementary commercial stories when denominators are transparently disclosed.';

// ==========================================
// 4. SESSION 15 STATE MODEL
// ==========================================

export interface StudentLeadPlan {
  updatedNextAction: string;
  updatedOwner: string;
  updatedTargetDate: string;
  notes: string;
}

export interface Session15State {
  leadPlans: Record<string, StudentLeadPlan>; // leadId -> student plan
  enteredAllLeadRate: string;
  enteredClosedLeadRate: string;
  conversionExplanation: string;
  messageL06: string;
  messageL07: string;
  governance: {
    preparerName: string;
    salesReviewerName: string;
    decisionOwnerName: string;
    fileVersion: string;
    signoffDate: string;
  };
  lastSavedAt: string | null;
}

export const DEFAULT_SESSION_15_STATE: Session15State = {
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
  conversionExplanation: DEFAULT_CONVERSION_EXPLANATION,
  messageL06: DEFAULT_FOLLOWUP_L06,
  messageL07: DEFAULT_FOLLOWUP_L07,
  governance: {
    preparerName: 'Sales Operations Associate',
    salesReviewerName: 'Commercial Sales Lead',
    decisionOwnerName: 'VP of Commercial Operations',
    fileVersion: 'StudentID_S15_v01.xlsx',
    signoffDate: '2026-10-31',
  },
  lastSavedAt: null,
};

// Storage helper functions
export function loadSession15State(): Session15State {
  if (typeof window === 'undefined') return DEFAULT_SESSION_15_STATE;
  try {
    const raw = localStorage.getItem(S15_STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION_15_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SESSION_15_STATE,
      ...parsed,
      leadPlans: { ...DEFAULT_SESSION_15_STATE.leadPlans, ...(parsed.leadPlans || {}) },
      governance: { ...DEFAULT_SESSION_15_STATE.governance, ...(parsed.governance || {}) },
    };
  } catch (e) {
    console.warn('[Session 15] Failed to parse state from localStorage, using default:', e);
    return DEFAULT_SESSION_15_STATE;
  }
}

export function saveSession15State(state: Session15State): void {
  if (typeof window === 'undefined') return;
  try {
    const toSave: Session15State = {
      ...state,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem(S15_STORAGE_KEY, JSON.stringify(toSave));
    localStorage.setItem(S15_PREVIEW_KEY, JSON.stringify({
      allLeadRate: toSave.enteredAllLeadRate,
      closedLeadRate: toSave.enteredClosedLeadRate,
      hasMessages: Boolean(toSave.messageL06 && toSave.messageL07),
      fileVersion: toSave.governance.fileVersion,
      updatedAt: toSave.lastSavedAt,
    }));
  } catch (e) {
    console.warn('[Session 15] Failed to save state to localStorage:', e);
  }
}

export function clearSession15State(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(S15_STORAGE_KEY);
  localStorage.removeItem(S15_PREVIEW_KEY);
}

// ==========================================
// 5. EDUCATIONAL RUBRIC
// ==========================================

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number;
  marks: number;
  description: string;
  evidenceExpected: string;
}

export const S15_RUBRIC: RubricCriterion[] = [
  {
    id: 'R01_EXECUTION',
    name: 'Execution',
    weight: 40,
    marks: 4,
    description: 'Complete and accurate CRM tracker, dual conversion rate calculations, and overdue task identification.',
    evidenceExpected: 'All 8 leads recorded; All-Lead Win Rate (37.5%) and Closed-Lead Win Rate (60.0%) correctly computed; L06/L07 flagged.',
  },
  {
    id: 'R02_REASONING',
    name: 'Reasoning',
    weight: 20,
    marks: 2,
    description: 'Explain difference between all-lead and closed-lead win rates; prioritize follow-ups by need and due date.',
    evidenceExpected: 'Clear explanation of denominators (Total 8 vs Closed 5) and pushback against pipeline inflation.',
  },
  {
    id: 'R03_COMMUNICATION',
    name: 'Communication',
    weight: 20,
    marks: 2,
    description: 'Professional, courteous, and actionable commercial outreach messages for L06 and L07.',
    evidenceExpected: 'Two well-structured client follow-up messages with clear context, proposed meeting time, and professional tone.',
  },
  {
    id: 'R04_PROCESS',
    name: 'Professional Process',
    weight: 20,
    marks: 2,
    description: 'Traceable file versioning, named review roles, and absence of fabricated links to accounting ledgers.',
    evidenceExpected: 'StudentID_S15_v01.xlsx naming convention, named reviewers, and no synthetic joins to Case F.',
  },
];

