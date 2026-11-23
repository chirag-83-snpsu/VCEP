/**
 * VCEP Session 13: AI for Commerce Professionals — Canonical Data & State Model
 * Mission: Use AI Responsibly. Verify the Work.
 * 
 * Source Grounding:
 * - Approved Drive Curriculum: curriculum/archive/downloads/S13_AI_for_Commerce_Professionals.docx
 * - Master Schema: app/guided-learning/drive-edition-3.json (Session 13)
 * - Case D: Three-Month MIS (July, August, September financial aggregates).
 */

export const S13_STORAGE_KEY = 'vcep:s13:drive-v3:student-workstation';
export const S13_PREVIEW_KEY = 'vcep-drive-edition3:session:13:preview';

// ==========================================
// 1. CASE D THREE-MONTH MIS CANONICAL SOURCE
// ==========================================

export interface CaseDMonthRecord {
  month: string;
  revenueINR: number;
  directCostsINR: number;
  grossProfitINR: number;
  grossMarginPct: number;
  overheadsINR: number;
  operatingProfitINR: number;
  operatingMarginPct: number;
  closingReceivablesINR: number;
  receivablesToRevenuePct: number;
  revenueGrowthMoMPct: number | null;
}

export const CASE_D_MONTHS: CaseDMonthRecord[] = [
  {
    month: 'July',
    revenueINR: 100000,
    directCostsINR: 40000,
    grossProfitINR: 60000,
    grossMarginPct: 60.0,
    overheadsINR: 35000,
    operatingProfitINR: 25000,
    operatingMarginPct: 25.0,
    closingReceivablesINR: 30000,
    receivablesToRevenuePct: 30.0,
    revenueGrowthMoMPct: null,
  },
  {
    month: 'August',
    revenueINR: 120000,
    directCostsINR: 54000,
    grossProfitINR: 66000,
    grossMarginPct: 55.0,
    overheadsINR: 39000,
    operatingProfitINR: 27000,
    operatingMarginPct: 22.5,
    closingReceivablesINR: 45000,
    receivablesToRevenuePct: 37.5,
    revenueGrowthMoMPct: 20.0, // (120 - 100) / 100 = +20.0%
  },
  {
    month: 'September',
    revenueINR: 150000,
    directCostsINR: 75000,
    grossProfitINR: 75000,
    grossMarginPct: 50.0,
    overheadsINR: 45000,
    operatingProfitINR: 30000,
    operatingMarginPct: 20.0,
    closingReceivablesINR: 70000,
    receivablesToRevenuePct: 46.7,
    revenueGrowthMoMPct: 25.0, // (150 - 120) / 120 = +25.0%
  },
];

export const CASE_D_SUMMARY = {
  totalRevenueINR: 370000,
  totalDirectCostsINR: 169000,
  totalGrossProfitINR: 201000,
  blendedGrossMarginPct: 54.3,
  totalOverheadsINR: 119000,
  totalOperatingProfitINR: 82000,
  blendedOperatingMarginPct: 22.2,
  latestReceivablesINR: 70000,
};

// ==========================================
// 2. DATA CLASSIFICATION (MINIMIZATION)
// ==========================================

export type DataCategory = 'safe-aggregate' | 'prohibited-private';

export interface DataClassificationItem {
  id: string;
  name: string;
  description: string;
  correctCategory: DataCategory;
  rationale: string;
}

export const DATA_CLASSIFICATION_ITEMS: DataClassificationItem[] = [
  {
    id: 'DCI_01',
    name: 'Monthly Gross Revenue Totals',
    description: 'Aggregated monthly sales totals (July ₹100k, August ₹120k, September ₹150k net of GST).',
    correctCategory: 'safe-aggregate',
    rationale: 'Sanitized high-level company totals contain no customer PII or confidential commercial identity.',
  },
  {
    id: 'DCI_02',
    name: 'Customer Entity Legal Names',
    description: 'Specific corporate client names (e.g. Apex Hospital, BioHealth Diagnostics, Cedar Retail).',
    correctCategory: 'prohibited-private',
    rationale: 'Customer counterparty identities and client lists are proprietary; pasting into public AI tools breaches confidentiality.',
  },
  {
    id: 'DCI_03',
    name: 'Departmental Direct Delivery Costs & Overheads',
    description: 'Aggregated cost pools (Direct costs ₹75k, Overheads ₹45k for September).',
    correctCategory: 'safe-aggregate',
    rationale: 'Safe for macro trend and margin analysis once vendor names and individual vouchers are removed.',
  },
  {
    id: 'DCI_04',
    name: 'Bank Account Numbers & IFSC Codes',
    description: 'Electronic payment credentials, corporate account numbers, and bank routing identifiers.',
    correctCategory: 'prohibited-private',
    rationale: 'Strictly prohibited. Critical banking security credentials must never touch external or unauthorized systems.',
  },
  {
    id: 'DCI_05',
    name: 'Closing Trade Receivables Balance',
    description: 'Balance sheet aggregate (Closing receivables ₹70,000 as of 30 September).',
    correctCategory: 'safe-aggregate',
    rationale: 'Anonymized financial metric suitable for working capital and cash conversion analysis.',
  },
  {
    id: 'DCI_06',
    name: 'Individual Invoices, GSTINs & Employee Salaries',
    description: 'Granular tax invoices, counterparty GST numbers, and employee-level payroll sheets.',
    correctCategory: 'prohibited-private',
    rationale: 'Statutory tax and employee confidential records; exposes personal and commercial trade secrets.',
  },
];

// ==========================================
// 3. 6-PART STRUCTURED PROMPT ARCHITECTURE
// ==========================================

export interface PromptArchitecture {
  role: string;
  task: string;
  permittedSources: string;
  outputStructure: string;
  uncertaintyRule: string;
  explicitExclusions: string;
}

export const DEFAULT_PROMPT_ARCHITECTURE: PromptArchitecture = {
  role: 'Senior Commercial Finance Analyst advising executive management.',
  task: 'Analyze Q1 performance across revenue trajectory, cost escalation, margin compression, and closing receivables risk.',
  permittedSources: 'Strictly bounded to Case D 3-Month MIS aggregate figures (CaseD!B2:D6: July, August, September revenue, direct costs, overheads, closing receivables). No external knowledge.',
  outputStructure: 'A structured 4-bullet executive memo: (1) Revenue Trajectory, (2) Cost & Margin Compression, (3) Receivables & Working Capital Alert, (4) Concrete Management Recommendations.',
  uncertaintyRule: 'If a metric or underlying cause is not in the source table (such as customer payment dates or credit terms), state "Data not available in source"—do not invent numbers or assume collection timing.',
  explicitExclusions: 'Do not extrapolate Q2 numbers, do not recommend price cuts or blanket discounts, and do not make assumptions about individual customer payment behavior.',
};

// ==========================================
// 4. OFFLINE FLAWED AI DRAFT & VERIFICATION
// ==========================================

export const OFFLINE_FLAWED_DRAFT_TEXT = 
  'September revenue grew 30%. Operating margin improved to 25%. All customers paid on time. Offer every customer a 20% discount to improve profitability.';

export interface DraftVerificationItem {
  id: string;
  claimSnippet: string;
  claimStatus: 'False Metric' | 'Hallucination' | 'Fatal Recommendation';
  sourceGroundTruth: string;
  explanation: string;
}

export const DRAFT_VERIFICATION_ITEMS: DraftVerificationItem[] = [
  {
    id: 'VERIF_01',
    claimSnippet: 'September revenue grew 30%',
    claimStatus: 'False Metric',
    sourceGroundTruth: 'Actual revenue grew +25.0% MoM (from ₹120,000 in August to ₹150,000 in September).',
    explanation: 'Calculation: (150,000 - 120,000) / 120,000 = 30,000 / 120,000 = 25.0%. The AI hallucinated a 30% growth rate.',
  },
  {
    id: 'VERIF_02',
    claimSnippet: 'Operating margin improved to 25%',
    claimStatus: 'False Metric',
    sourceGroundTruth: 'Operating margin compressed to 20.0% in September (down from 22.5% in August and 25.0% in July).',
    explanation: 'September operating profit is ₹30,000 on ₹150,000 revenue = 20.0%. Margins compressed by 5.0 percentage points over Q1 because direct costs surged +38.9% MoM.',
  },
  {
    id: 'VERIF_03',
    claimSnippet: 'All customers paid on time',
    claimStatus: 'Hallucination',
    sourceGroundTruth: 'Case D provides NO collection dates or payment logs. Receivables actually surged to ₹70,000 (46.7% of revenue).',
    explanation: 'Pure hallucination. Case D contains aggregate balance sheet metrics only. A closing receivables spike of +55.6% MoM indicates deteriorating collections, not prompt payments.',
  },
  {
    id: 'VERIF_04',
    claimSnippet: 'Offer every customer a 20% discount to improve profitability',
    claimStatus: 'Fatal Recommendation',
    sourceGroundTruth: 'A 20% price cut would wipe out operating profits entirely and accelerate cash insolvency.',
    explanation: 'Direct costs already consume 50.0% of revenue (₹75k). A 20% discount reduces revenue to ₹120k, leaving ₹45k gross profit, which exactly equals September overheads (₹45k)—dropping operating profit to ₹0!',
  },
];

// ==========================================
// 5. HUMAN-REVISED VERIFIED MEMO TEMPLATE
// ==========================================

export interface RevisedMemo {
  revenueBullet: string;
  marginBullet: string;
  workingCapitalBullet: string;
  recommendationBullet: string;
}

export const DEFAULT_REVISED_MEMO: RevisedMemo = {
  revenueBullet: 'Revenue Trajectory: Q1 gross revenue totaled ₹370,000, with September expanding +25.0% MoM (₹150,000 vs. ₹120,000 in August and ₹100,000 in July).',
  marginBullet: 'Cost & Margin Compression: Operating margin degraded from 25.0% in July to 20.0% in September, driven by a +38.9% surge in direct delivery costs (reaching 50.0% of revenue).',
  workingCapitalBullet: 'Working Capital Alert: Closing receivables escalated sharply to ₹70,000 (representing 46.7% of monthly revenue), indicating substantial cash lockup. Note: Source data does not provide customer-level payment dates.',
  recommendationBullet: 'Actionable Management Advice: Reject price discounts; immediately institute a formal receivables ageing review and audit direct cost escalations before taking on new delivery volume.',
};

// ==========================================
// 6. AI-USE GOVERNANCE / DISCLOSURE LOG
// ==========================================

export interface AIGovernanceLog {
  aiToolAndDate: string;
  permittedInputRef: string;
  promptArchitectureRef: string;
  generatedDraftRef: string;
  humanFactChecksSummary: string;
  humanReviewerName: string;
  autonomousHumanDecision: string;
}

export const DEFAULT_AI_GOVERNANCE_LOG: AIGovernanceLog = {
  aiToolAndDate: 'Vivi AI Assistant / Offline AI Model (S13 Benchmark), 31 Oct 2026',
  permittedInputRef: 'CaseD!B2:D6 (Sanitized 3-Month Monthly Financial Aggregates)',
  promptArchitectureRef: 'S13-PROMPT-V01 (Role, Task, Source, Output, Uncertainty, Exclusions)',
  generatedDraftRef: 'DRAFT-S13-01 (Offline Unverified Draft)',
  humanFactChecksSummary: 'Audited 4 claims: Corrected Sep growth from 30% to 25%; corrected margin from 25% to 20%; flagged payment claim as hallucination; rejected 20% discount advice as commercially fatal.',
  humanReviewerName: 'Lead Commerce Analyst / Student Reviewer',
  autonomousHumanDecision: 'Flagged receivables surge to management, initiated credit control review, and frozen discretionary discounts to protect the 20% operating margin.',
};

// ==========================================
// 7. CARDINAL RESPONSIBLE AI PRINCIPLES
// ==========================================

export interface ResponsibleAIPrinciple {
  principleNum: number;
  title: string;
  description: string;
  badge: string;
  accentColor: string;
}

export const RESPONSIBLE_AI_PRINCIPLES: ResponsibleAIPrinciple[] = [
  {
    principleNum: 1,
    title: 'Data Minimization & Boundary Control',
    description: 'Never feed private client names, bank account numbers, passwords, or employee compensation into external AI systems. Only aggregate, sanitized data is permitted.',
    badge: 'Confidentiality First',
    accentColor: 'indigo',
  },
  {
    principleNum: 2,
    title: 'Source Boundedness & Uncertainty Rules',
    description: 'AI models generate plausible-sounding text. You must explicitly restrict the AI to verified reference tables and instruct it to state "Not available" rather than guess.',
    badge: 'Bounded Prompts',
    accentColor: 'emerald',
  },
  {
    principleNum: 3,
    title: 'Mandatory Human Verification (Zero Blind Trust)',
    description: 'Every percentage, ratio, and assertion produced by AI must be audited by a human accountant against the source ledger before communicating to executives.',
    badge: 'Fact-Check Everything',
    accentColor: 'amber',
  },
  {
    principleNum: 4,
    title: 'Governance, Disclosure & Accountability',
    description: 'Professionals must maintain a clear audit trail documenting which tools were used, which prompts were fed, what errors were corrected, and what human judgments were exercised.',
    badge: 'Audit Trail',
    accentColor: 'rose',
  },
];

// ==========================================
// 8. SESSION 13 WORKSTATION STATE
// ==========================================

export interface Session13State {
  classification: Record<string, DataCategory>; // itemId -> chosen category
  promptArchitecture: PromptArchitecture;
  promptCopied: boolean;
  activeAIResponse: string;
  verificationChecks: Record<string, boolean>; // verifId -> checked/verified
  revisedMemo: RevisedMemo;
  governanceLog: AIGovernanceLog;
  selfRubricScores: Record<string, number>;
  lastSavedAt: string | null;
}

export const DEFAULT_SESSION_13_STATE: Session13State = {
  classification: {},
  promptArchitecture: { ...DEFAULT_PROMPT_ARCHITECTURE },
  promptCopied: false,
  activeAIResponse: OFFLINE_FLAWED_DRAFT_TEXT,
  verificationChecks: {},
  revisedMemo: { ...DEFAULT_REVISED_MEMO },
  governanceLog: { ...DEFAULT_AI_GOVERNANCE_LOG },
  selfRubricScores: {
    'R01_MINIMIZATION': 1,
    'R02_PROMPT_BOUNDING': 1,
    'R03_VERIFICATION': 1,
    'R04_AUDIT_LOG': 1,
  },
  lastSavedAt: null,
};

// Storage helper functions
export function loadSession13State(): Session13State {
  if (typeof window === 'undefined') return DEFAULT_SESSION_13_STATE;
  try {
    const raw = localStorage.getItem(S13_STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION_13_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SESSION_13_STATE,
      ...parsed,
      classification: { ...DEFAULT_SESSION_13_STATE.classification, ...(parsed.classification || {}) },
      promptArchitecture: { ...DEFAULT_SESSION_13_STATE.promptArchitecture, ...(parsed.promptArchitecture || {}) },
      verificationChecks: { ...DEFAULT_SESSION_13_STATE.verificationChecks, ...(parsed.verificationChecks || {}) },
      revisedMemo: { ...DEFAULT_SESSION_13_STATE.revisedMemo, ...(parsed.revisedMemo || {}) },
      governanceLog: { ...DEFAULT_SESSION_13_STATE.governanceLog, ...(parsed.governanceLog || {}) },
      selfRubricScores: { ...DEFAULT_SESSION_13_STATE.selfRubricScores, ...(parsed.selfRubricScores || {}) },
    };
  } catch (e) {
    console.warn('[Session 13] Failed to parse stored state, falling back to default:', e);
    return DEFAULT_SESSION_13_STATE;
  }
}

export function saveSession13State(state: Session13State): void {
  if (typeof window === 'undefined') return;
  try {
    const toSave: Session13State = {
      ...state,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem(S13_STORAGE_KEY, JSON.stringify(toSave));
    localStorage.setItem(S13_PREVIEW_KEY, JSON.stringify({
      classificationCompleted: Object.keys(toSave.classification).length === DATA_CLASSIFICATION_ITEMS.length,
      verifiedChecksCount: Object.values(toSave.verificationChecks).filter(Boolean).length,
      hasRevisedMemo: Boolean(toSave.revisedMemo.revenueBullet && toSave.revisedMemo.recommendationBullet),
      governanceLogComplete: Boolean(toSave.governanceLog.humanFactChecksSummary && toSave.governanceLog.autonomousHumanDecision),
      updatedAt: toSave.lastSavedAt,
    }));
  } catch (e) {
    console.warn('[Session 13] Failed to persist state:', e);
  }
}

export function clearSession13State(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(S13_STORAGE_KEY);
  localStorage.removeItem(S13_PREVIEW_KEY);
}

// ==========================================
// 9. RUBRIC & CHECKLIST DEFINITIONS
// ==========================================

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number;
  description: string;
  evaluationFocus: string;
}

export const S13_RUBRIC: RubricCriterion[] = [
  {
    id: 'R01_MINIMIZATION',
    name: 'Data Minimization & Confidentiality Safeguards',
    weight: 25,
    description: 'Clear segregation between safe aggregate figures and prohibited client identifiers / banking details.',
    evaluationFocus: 'Did the analyst prevent proprietary customer names and bank details from being pasted into public prompts?',
  },
  {
    id: 'R02_PROMPT_BOUNDING',
    name: '6-Part Structured Prompt Architecture',
    weight: 25,
    description: 'Inclusion of Role, Task, Permitted Sources, Output Structure, Uncertainty Rule, and Explicit Exclusions.',
    evaluationFocus: 'Is the prompt strictly bounded to Case D tables with explicit prohibitions against hallucination?',
  },
  {
    id: 'R03_VERIFICATION',
    name: 'Rigorous Human Fact-Checking & Margin Audit',
    weight: 30,
    description: 'Systematic verification of AI output against Case D source; identifying false growth, margin decay, and hallucinations.',
    evaluationFocus: 'Did the analyst detect the 25% true growth, 20% margin compression, receivables spike, and reject the dangerous discount advice?',
  },
  {
    id: 'R04_AUDIT_LOG',
    name: 'Governance Trail & Autonomous Human Decision',
    weight: 20,
    description: 'Documenting the AI tool, prompt, output reference, human corrections, and autonomous human managerial judgment.',
    evaluationFocus: 'Does the final deliverable include a signed disclosure log and professional accountability trail?',
  },
];

