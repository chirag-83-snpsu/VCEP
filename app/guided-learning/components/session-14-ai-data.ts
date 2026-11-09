/**
 * VCEP Session 14: AI Verification and Automation — Canonical Data & State Model
 * Mission: Audit the AI. Control the Workflow.
 * 
 * Source Grounding:
 * - Approved Drive Curriculum: curriculum/archive/downloads/S14_AI_Verification_and_Automation.docx
 * - Master Schema: app/guided-learning/drive-edition-3.json (Session 14)
 * - Case D: Three-Month MIS Release (July, August, September).
 */

export const S14_STORAGE_KEY = 'vcep:s14:drive-v3:student-workstation';
export const S14_PREVIEW_KEY = 'vcep-drive-edition3:session:14:preview';

// ==========================================
// 1. CASE D THREE-MONTH MIS CANONICAL SOURCE
// ==========================================

export interface CaseDRecord {
  measure: string;
  julyINR: number;
  augustINR: number;
  septemberINR: number;
  q1TotalINR: number;
  notes: string;
}

export const CASE_D_DATA: CaseDRecord[] = [
  {
    measure: 'Gross Revenue',
    julyINR: 100000,
    augustINR: 120000,
    septemberINR: 150000,
    q1TotalINR: 370000,
    notes: 'Jul→Aug +20.0%, Aug→Sep +25.0%. Net of tax.',
  },
  {
    measure: 'Direct Delivery Cost',
    julyINR: 40000,
    augustINR: 54000,
    septemberINR: 75000,
    q1TotalINR: 169000,
    notes: 'Sep cost escalated +38.9% MoM to reach 50.0% of revenue.',
  },
  {
    measure: 'Operating Overhead',
    julyINR: 35000,
    augustINR: 39000,
    septemberINR: 45000,
    q1TotalINR: 119000,
    notes: 'Aug→Sep +15.4% expansion.',
  },
  {
    measure: 'Operating Profit',
    julyINR: 25000,
    augustINR: 27000,
    septemberINR: 30000,
    q1TotalINR: 82000,
    notes: 'Operating margin compressed: 25.0% → 22.5% → 20.0%.',
  },
  {
    measure: 'Closing Receivables',
    julyINR: 30000,
    augustINR: 45000,
    septemberINR: 70000,
    q1TotalINR: 70000, // closing balance
    notes: 'Surged +133% vs July; represents 46.7% of monthly sales.',
  },
];

// ==========================================
// 2. FOUR-CLAIM AUDIT REGISTER
// ==========================================

export type AuditVerdict = 'FALSE' | 'MISLEADING' | 'FATAL_RECOMMENDATION' | 'ACCURATE';

export interface ClaimAuditItem {
  id: string; // 'CLM_01' | 'CLM_02' | 'CLM_03' | 'CLM_04'
  claimNum: number;
  topic: string;
  aiStatement: string;
  sourceReference: string;
  canonicalRecalculation: string;
  correctVerdict: AuditVerdict;
  canonicalCorrection: string;
  guidanceNotes: string;
}

export const CASE_D_CLAIMS: ClaimAuditItem[] = [
  {
    id: 'CLM_01',
    claimNum: 1,
    topic: 'Revenue Growth',
    aiStatement: 'September revenue grew 30% over August.',
    sourceReference: 'CaseD!B2:D2 (Revenue: Aug ₹120,000; Sep ₹150,000)',
    canonicalRecalculation: '(₹1,50,000 - ₹1,20,000) / ₹1,20,000 = ₹30,000 / ₹1,20,000 = 25.0%',
    correctVerdict: 'FALSE',
    canonicalCorrection: 'September revenue grew by +25.0% over August (a ₹30,000 top-line increase), not 30%.',
    guidanceNotes: 'The AI hallucinated a round 30% growth rate instead of calculating the exact +25.0% ratio.',
  },
  {
    id: 'CLM_02',
    claimNum: 2,
    topic: 'Operating Margin',
    aiStatement: 'Operating profit margin improved to 25%.',
    sourceReference: 'CaseD!B2:D5 (Sep Revenue ₹150k, Direct ₹75k, Overheads ₹45k -> Op Profit ₹30k)',
    canonicalRecalculation: '₹30,000 / ₹150,000 = 20.0% (down from 22.5% in Aug and 25.0% in Jul)',
    correctVerdict: 'FALSE',
    canonicalCorrection: 'Operating profit margin contracted from 22.5% to 20.0% (-2.5 pp MoM) as direct delivery costs surged +38.9%.',
    guidanceNotes: 'Margins decayed rather than improved. Direct costs reached 50.0% of revenue in September.',
  },
  {
    id: 'CLM_03',
    claimNum: 3,
    topic: 'Customer Payments / Receivables',
    aiStatement: 'Receivables of INR 70,000 prove customers are paying on time.',
    sourceReference: 'CaseD!B6:D6 (Closing Receivables: Jul ₹30k, Aug ₹45k, Sep ₹70k)',
    canonicalRecalculation: 'Receivables jumped +133% over Q1 and now consume 46.7% of monthly revenue. Case D provides zero collection timestamps.',
    correctVerdict: 'MISLEADING',
    canonicalCorrection: 'Elevated receivables of ₹70,000 reflect severe working capital lockup. Case D does not supply collection dates, making timely payment assertions an unsupported hallucination.',
    guidanceNotes: 'Never confuse balance sheet debt with prompt payment. Case D has no customer-level payment records.',
  },
  {
    id: 'CLM_04',
    claimNum: 4,
    topic: 'Commercial Discount Strategy',
    aiStatement: 'Offer every customer a 20% discount to maximize profits.',
    sourceReference: 'CaseD!B2:D5 (September Gross Profit ₹75k, Overheads ₹45k)',
    canonicalRecalculation: 'A 20% price cut on ₹150k yields ₹120k revenue. With direct costs at ₹75k, GP drops to ₹45k, which equals overheads (₹45k), reducing operating profit to ₹0.',
    correctVerdict: 'FATAL_RECOMMENDATION',
    canonicalCorrection: 'Reject blanket discounts. Direct costs already consume 50.0% of revenue; a 20% discount completely wipes out operating profit and accelerates cash burn.',
    guidanceNotes: 'A 20% price cut on already compressed margins triggers catastrophic financial loss.',
  },
];

// ==========================================
// 3. CORRECTED 120-WORD MANAGEMENT MEMO
// ==========================================

export const MAX_MEMO_WORD_COUNT = 120;

export const DEFAULT_CORRECTED_MEMO = 
  'September revenue expanded 25.0% MoM to ₹150,000 (Q1 total: ₹370,000). However, operating margin contracted from 22.5% to 20.0% as direct costs surged 38.9% to ₹75,000 (50.0% of revenue). Closing receivables spiked to ₹70,000 (46.7% of revenue), indicating heightened working capital lockup. Note: Source data does not provide customer-level payment dates or credit terms. We explicitly reject blanket 20% discounts, which would eliminate operating profits, and recommend auditing direct delivery costs.';

export function countWords(text: string): number {
  return (text || '').trim().split(/\s+/).filter(Boolean).length;
}

// ==========================================
// 4. CONTROLLED 5-STAGE WORKFLOW DEFINITION
// ==========================================

export interface WorkflowStageDefinition {
  id: string;
  stageNum: number;
  name: string;
  type: 'data-input' | 'automated-gate' | 'ai-draft' | 'human-audit' | 'human-signoff';
  purpose: string;
  stoppingConditionRule?: string;
  ownerRole: string;
}

export const WORKFLOW_STAGES: WorkflowStageDefinition[] = [
  {
    id: 'STG_01',
    stageNum: 1,
    name: '1. Ingest Data',
    type: 'data-input',
    purpose: 'Import Case D monthly revenue, cost pools, and receivables table.',
    ownerRole: 'Data Integration / Preparer',
  },
  {
    id: 'STG_02',
    stageNum: 2,
    name: '2. Review & Validation Gate',
    type: 'automated-gate',
    purpose: 'Automated type, completeness, and boundary check. Halts execution if any revenue cell is blank or non-numeric.',
    stoppingConditionRule: 'IF(OR(ISBLANK(Revenue), NOT(ISNUMBER(Revenue)), Revenue <= 0), "HALT_ERROR", "PASS")',
    ownerRole: 'Automated Rule Engine',
  },
  {
    id: 'STG_03',
    stageNum: 3,
    name: '3. Draft Commentary',
    type: 'ai-draft',
    purpose: 'Generate preliminary narrative draft strictly from validated inputs. Bounded prompt required.',
    ownerRole: 'Vivi AI Engine / Model',
  },
  {
    id: 'STG_04',
    stageNum: 4,
    name: '4. Human Verification Gate',
    type: 'human-audit',
    purpose: 'Audit each generated claim against source ledger; correct hallucinations and calculate exact ratios.',
    ownerRole: 'Quality Reviewer / Commercial Analyst',
  },
  {
    id: 'STG_05',
    stageNum: 5,
    name: '5. Approve & Release',
    type: 'human-signoff',
    purpose: 'Formal executive sign-off with named decision owner and timestamp. Prohibits automated external distribution.',
    ownerRole: 'Finance Controller / Decision Owner',
  },
];

// ==========================================
// 5. WORKFLOW SIMULATION TEST SCENARIOS
// ==========================================

export type ScenarioId = 'normal' | 'blank_revenue' | 'restore_review' | 'rejected' | 'approved';

export interface WorkflowScenario {
  id: ScenarioId;
  name: string;
  description: string;
  injectedState: {
    septemberRevenueINR: number | null;
    isCorruptedInput: boolean;
  };
  expectedValidationGateStatus: 'PASSED' | 'HALTED_BLOCKED';
  expectedWorkflowOutcome: 'Draft Ready for Audit' | 'Pipeline Halted: Missing Revenue' | 'Rejection Logged' | 'Signed & Approved';
  actionPrompt: string;
}

export const WORKFLOW_SCENARIOS: WorkflowScenario[] = [
  {
    id: 'normal',
    name: 'Scenario 1: Normal Case D Input',
    description: 'All 3 months contain valid numeric data (Jul ₹100k, Aug ₹120k, Sep ₹150k).',
    injectedState: { septemberRevenueINR: 150000, isCorruptedInput: false },
    expectedValidationGateStatus: 'PASSED',
    expectedWorkflowOutcome: 'Draft Ready for Audit',
    actionPrompt: 'Pipeline runs normally. AI draft generated and routed to Human Verification Gate.',
  },
  {
    id: 'blank_revenue',
    name: 'Scenario 2: Fault-Injection (Blank September Revenue)',
    description: 'September revenue cell is intentionally set to blank/empty.',
    injectedState: { septemberRevenueINR: null, isCorruptedInput: true },
    expectedValidationGateStatus: 'HALTED_BLOCKED',
    expectedWorkflowOutcome: 'Pipeline Halted: Missing Revenue',
    actionPrompt: 'Validation Gate triggers immediate halt: "CRITICAL: September revenue missing. Halting workflow to prevent confident zero-growth hallucination."',
  },
  {
    id: 'restore_review',
    name: 'Scenario 3: Restore & Re-Validate',
    description: 'Restore September revenue to verified ₹150,000 and re-run automated check.',
    injectedState: { septemberRevenueINR: 150000, isCorruptedInput: false },
    expectedValidationGateStatus: 'PASSED',
    expectedWorkflowOutcome: 'Draft Ready for Audit',
    actionPrompt: 'Automated check passes. Reviewer re-authorizes generation with sanitized inputs.',
  },
  {
    id: 'rejected',
    name: 'Scenario 4: Rejection Drill (Uncorrected Claims)',
    description: 'Human reviewer rejects draft because AI recommended an unprofitable 20% discount and hallucinated collection dates.',
    injectedState: { septemberRevenueINR: 150000, isCorruptedInput: false },
    expectedValidationGateStatus: 'PASSED',
    expectedWorkflowOutcome: 'Rejection Logged',
    actionPrompt: 'Reviewer halts release: "Draft rejected: Unsubstantiated claims and dangerous commercial recommendation. Returned to preparer."',
  },
  {
    id: 'approved',
    name: 'Scenario 5: Verified Human Approval',
    description: 'All 4 claims verified, 120-word corrected memo attached, signed by named decision owner.',
    injectedState: { septemberRevenueINR: 150000, isCorruptedInput: false },
    expectedValidationGateStatus: 'PASSED',
    expectedWorkflowOutcome: 'Signed & Approved',
    actionPrompt: 'Formal sign-off recorded. Deliverable StudentID_S14_v01.xlsx released to executive management.',
  },
];

// ==========================================
// 6. SESSION 14 STATE MODEL
// ==========================================

export interface StudentClaimAuditState {
  userVerdict: AuditVerdict;
  userRecalculation: string;
  userCorrection: string;
  isAudited: boolean;
}

export interface GovernanceSignoff {
  preparerName: string;
  reviewerName: string;
  decisionOwnerName: string;
  approvalStatus: 'Pending Review' | 'Rejected' | 'Approved';
  approvalTimestamp: string;
  autonomousDecisionStatement: string;
}

export interface Session14State {
  claimAudits: Record<string, StudentClaimAuditState>; // claimId -> student input
  correctedMemoText: string;
  selectedScenario: ScenarioId;
  stoppingConditionActive: boolean;
  governance: GovernanceSignoff;
  fileVersion: string;
  lastSavedAt: string | null;
}

export const DEFAULT_SESSION_14_STATE: Session14State = {
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
  correctedMemoText: DEFAULT_CORRECTED_MEMO,
  selectedScenario: 'normal',
  stoppingConditionActive: false,
  governance: {
    preparerName: 'Commercial Analyst / Student',
    reviewerName: 'Quality Lead / Senior Auditor',
    decisionOwnerName: 'Finance Controller',
    approvalStatus: 'Approved',
    approvalTimestamp: '2026-10-31 16:30 IST',
    autonomousDecisionStatement: 'Rejected AI blanket discount advice, verified +25.0% revenue growth, and halted release during missing-input drill.',
  },
  fileVersion: 'StudentID_S14_v01.xlsx',
  lastSavedAt: null,
};

// Storage helpers
export function loadSession14State(): Session14State {
  if (typeof window === 'undefined') return DEFAULT_SESSION_14_STATE;
  try {
    const raw = localStorage.getItem(S14_STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION_14_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SESSION_14_STATE,
      ...parsed,
      claimAudits: { ...DEFAULT_SESSION_14_STATE.claimAudits, ...(parsed.claimAudits || {}) },
      governance: { ...DEFAULT_SESSION_14_STATE.governance, ...(parsed.governance || {}) },
    };
  } catch (e) {
    console.warn('[Session 14] Error loading state, returning default:', e);
    return DEFAULT_SESSION_14_STATE;
  }
}

export function saveSession14State(state: Session14State): void {
  if (typeof window === 'undefined') return;
  try {
    const toSave: Session14State = {
      ...state,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem(S14_STORAGE_KEY, JSON.stringify(toSave));
    localStorage.setItem(S14_PREVIEW_KEY, JSON.stringify({
      auditedClaimsCount: Object.values(toSave.claimAudits).filter(c => c.isAudited).length,
      memoWordCount: countWords(toSave.correctedMemoText),
      scenarioTested: toSave.selectedScenario,
      isApproved: toSave.governance.approvalStatus === 'Approved',
      updatedAt: toSave.lastSavedAt,
    }));
  } catch (e) {
    console.warn('[Session 14] Error saving state:', e);
  }
}

export function clearSession14State(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(S14_STORAGE_KEY);
  localStorage.removeItem(S14_PREVIEW_KEY);
}

// ==========================================
// 7. EDUCATIONAL RUBRIC DEFINITIONS
// ==========================================

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number;
  marks: number;
  description: string;
  evidenceExpected: string;
}

export const S14_RUBRIC: RubricCriterion[] = [
  {
    id: 'R01_EXECUTION',
    name: 'Execution',
    weight: 40,
    marks: 4,
    description: 'Complete and accurate required output across the 4-claim audit register and mathematical recalculations.',
    evidenceExpected: 'All 4 AI claims audited with exact math (25% growth, 20% margin, receivables lockup, discount impact).',
  },
  {
    id: 'R02_REASONING',
    name: 'Reasoning',
    weight: 20,
    marks: 2,
    description: 'Explain method, source data limits, stopping conditions, and avoid invented causality.',
    evidenceExpected: 'Explain why Case D contains no collection timestamps and specify stopping rules for missing inputs.',
  },
  {
    id: 'R03_COMMUNICATION',
    name: 'Communication',
    weight: 20,
    marks: 2,
    description: 'Clear, concise corrected memo (at most 120 words) that another professional can trace.',
    evidenceExpected: 'Concise executive memo citing verified figures, uncertainties, and commercial recommendations <= 120 words.',
  },
  {
    id: 'R04_PROCESS',
    name: 'Professional Process',
    weight: 20,
    marks: 2,
    description: 'Traceable version record, explicit human approval sign-off, and controlled workflow simulation test log.',
    evidenceExpected: 'StudentID_S14_v01.xlsx naming, named reviewer roles, and completed 5-scenario test log.',
  },
];

