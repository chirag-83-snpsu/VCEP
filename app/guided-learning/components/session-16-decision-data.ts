/**
 * VCEP Session 16: Commercial Decision Making — Canonical Data & State Model
 * Mission: Make the Decision with Numbers.
 * 
 * Source Grounding:
 * - Approved Drive Curriculum: curriculum/archive/downloads/S16_Commercial_Decision_Making.docx
 * - Master Schema: app/guided-learning/drive-edition-3.json (Session 16)
 * - Essential Scenario: ₹10,000 net price, ₹4,000 variable cost, ₹1,20,000 fixed cost,
 *   baseline demand 25 seats, capacity 30. A 10% discount may increase demand to 30.
 */

export const S16_STORAGE_KEY = 'vcep:s16:drive-v3:student-workstation';
export const S16_PREVIEW_KEY = 'vcep-drive-edition3:session:16:preview';

// ==========================================
// 1. CANONICAL POLICY PARAMETERS & CONSTANTS
// ==========================================

export const BASELINE_PRICE = 10000;
export const VARIABLE_COST_PER_SEAT = 4000;
export const FIXED_COSTS = 120000;
export const BASELINE_DEMAND = 25;
export const MAX_CAPACITY = 30;
export const PROPOSED_DISCOUNT_PCT = 10;
export const PROPOSED_PRICE = 9000;
export const PROPOSED_DEMAND = 30;

// Computed Canonical Truths
export const CANONICAL_METRICS = {
  // Baseline (25 seats @ ₹10k)
  basePrice: BASELINE_PRICE,
  baseVC: VARIABLE_COST_PER_SEAT,
  baseUnitContribution: BASELINE_PRICE - VARIABLE_COST_PER_SEAT, // 6,000
  baseDemand: BASELINE_DEMAND,
  baseRevenue: BASELINE_DEMAND * BASELINE_PRICE, // 250,000
  baseTotalVC: BASELINE_DEMAND * VARIABLE_COST_PER_SEAT, // 100,000
  baseTotalContribution: BASELINE_DEMAND * (BASELINE_PRICE - VARIABLE_COST_PER_SEAT), // 150,000
  baseFixedCosts: FIXED_COSTS,
  baseOperatingProfit: 150000 - FIXED_COSTS, // 30,000
  baseBreakEvenSeats: Math.ceil(FIXED_COSTS / (BASELINE_PRICE - VARIABLE_COST_PER_SEAT)), // 20
  baseCapacityUtilPct: (BASELINE_DEMAND / MAX_CAPACITY) * 100, // 83.3%

  // Proposed 10% Discount (30 seats @ ₹9k)
  proposedPrice: PROPOSED_PRICE,
  proposedVC: VARIABLE_COST_PER_SEAT,
  proposedUnitContribution: PROPOSED_PRICE - VARIABLE_COST_PER_SEAT, // 5,000
  proposedDemand: PROPOSED_DEMAND,
  proposedRevenue: PROPOSED_DEMAND * PROPOSED_PRICE, // 270,000
  proposedTotalVC: PROPOSED_DEMAND * VARIABLE_COST_PER_SEAT, // 120,000
  proposedTotalContribution: PROPOSED_DEMAND * (PROPOSED_PRICE - VARIABLE_COST_PER_SEAT), // 150,000
  proposedFixedCosts: FIXED_COSTS,
  proposedOperatingProfit: 150000 - FIXED_COSTS, // 30,000
  proposedBreakEvenSeats: Math.ceil(FIXED_COSTS / (PROPOSED_PRICE - VARIABLE_COST_PER_SEAT)), // 24
  proposedCapacityUtilPct: (PROPOSED_DEMAND / MAX_CAPACITY) * 100, // 100.0%

  // Variances & Minimum Seats
  incrementalRevenue: 270000 - 250000, // +20,000 (+8.0%)
  incrementalContribution: 150000 - 150000, // 0
  incrementalProfit: 30000 - 30000, // 0 (Zero Economic Gain!)
  breakEvenVarianceSeats: 24 - 20, // +4 seats higher operational risk
  minDiscountedSeatsForBaselineProfit: 30, // Exactly 30 seats required to match ₹30k profit
};

// ==========================================
// 2. CARDINAL PRINCIPLES OF COMMERCIAL DECISIONS
// ==========================================

export interface DecisionPrinciple {
  principleNum: number;
  title: string;
  badge: string;
  description: string;
}

export const COMMERCIAL_DECISION_PRINCIPLES: DecisionPrinciple[] = [
  {
    principleNum: 1,
    title: 'Unit Contribution Drives Cash Flow',
    badge: 'Contribution Margin',
    description: 'Never evaluate a proposal solely on top-line revenue. A ₹20,000 revenue increase can produce ₹0 profit if unit contribution is compressed from ₹6,000 to ₹5,000.',
  },
  {
    principleNum: 2,
    title: 'The Zero-Gain Capacity Trap',
    badge: 'Capacity Constraint',
    description: 'Operating at 100% capacity (30 seats) with zero incremental profit eliminates all operational reserve buffers while multiplying delivery stress.',
  },
  {
    principleNum: 3,
    title: 'Break-Even Shift Increases Downside Risk',
    badge: 'Break-Even Surge',
    description: 'Discounting price by 10% elevates break-even volume from 20 to 24 seats. If demand softens by even two seats (28 seats), profits plunge by ₹10,000.',
  },
  {
    principleNum: 4,
    title: 'Non-Negotiable Margin Protection',
    badge: 'Commercial Governance',
    description: 'Counter unverified volume assumptions with tiered pricing (standard price on seats 1–25, discount on seats 26–30 only) or mandatory non-refundable deposits.',
  },
];

// ==========================================
// 3. PRESET SIMULATION SCENARIOS
// ==========================================

export interface CommercialScenario {
  id: string;
  name: string;
  badge: string;
  description: string;
  discountPct: number;
  price: number;
  demand: number;
  extraFixedCost: number;
  profitOutcome: number;
  varianceVsBaseline: number;
  riskLevel: 'Optimal' | 'Zero Gain' | 'High Risk' | 'Severe Loss' | 'Margin Protected';
}

export const COMMERCIAL_SCENARIOS: CommercialScenario[] = [
  {
    id: 'baseline',
    name: 'Approved Policy Baseline',
    badge: 'Current Policy',
    description: 'Standard pricing at ₹10,000 for 25 seats. Healthy 83.3% capacity with 5-seat operational buffer.',
    discountPct: 0,
    price: 10000,
    demand: 25,
    extraFixedCost: 0,
    profitOutcome: 30000,
    varianceVsBaseline: 0,
    riskLevel: 'Optimal',
  },
  {
    id: 'proposed_target',
    name: 'Proposed 10% Discount at Full Target',
    badge: 'Sales Proposal',
    description: 'Blanket 10% discount across all 30 seats. Revenue expands by ₹20k, but net profit is identical to baseline (₹0 gain) at 100% capacity.',
    discountPct: 10,
    price: 9000,
    demand: 30,
    extraFixedCost: 0,
    profitOutcome: 30000,
    varianceVsBaseline: 0,
    riskLevel: 'Zero Gain',
  },
  {
    id: 'soft_demand_ip04',
    name: 'Downside Drill: Soft Demand (IP 04)',
    badge: 'Downside Risk',
    description: 'Independent Practice 04: Discounted demand reaches only 28 seats. Net profit plummets to ₹20,000 (₹10,000 below baseline!).',
    discountPct: 10,
    price: 9000,
    demand: 28,
    extraFixedCost: 0,
    profitOutcome: 20000,
    varianceVsBaseline: -10000,
    riskLevel: 'High Risk',
  },
  {
    id: 'marketing_addon_ip04',
    name: 'Downside Drill: Extra Marketing Spend (IP 04)',
    badge: 'Marketing Burn',
    description: 'Independent Practice 04: Demand reaches 28 seats with ₹6,000 extra marketing spend. Operating profit collapses to ₹14,000 (₹16,000 below baseline!).',
    discountPct: 10,
    price: 9000,
    demand: 28,
    extraFixedCost: 6000,
    profitOutcome: 14000,
    varianceVsBaseline: -16000,
    riskLevel: 'Severe Loss',
  },
  {
    id: 'tiered_counter',
    name: 'Strategic Counter-Proposal: Tiered Pricing',
    badge: 'Recommended Counter',
    description: 'Standard ₹10,000 for baseline 25 seats, 10% discount (₹9,000) on incremental seats 26–30 only. Profit rises to ₹35,000 (+₹5,000 real gain!).',
    discountPct: 10, // On incremental only
    price: 9000,
    demand: 30,
    extraFixedCost: 0,
    profitOutcome: 35000,
    varianceVsBaseline: 5000,
    riskLevel: 'Margin Protected',
  },
];

// ==========================================
// 4. DEFAULT TEXTS & MEMO EXAMPLES
// ==========================================

export const MAX_MEMO_WORD_COUNT = 130;

export const DEFAULT_DECISION_MEMO = 
  'Recommendation: Reject the blanket 10% volume discount across all 30 seats. While revenue expands from ₹2,50,000 to ₹2,70,000, unit contribution drops from ₹6,000 to ₹5,000. Total contribution remains unchanged at ₹1,50,000, generating exactly ₹0 incremental profit (₹30,000 in both cases). Furthermore, capacity utilization surges to 100%, eliminating operational buffer and raising break-even from 20 to 24 seats. Counter-Proposal: Offer standard pricing (₹10,000) on the first 25 seats and a 10% discount (₹9,000) on incremental seats 26–30 only, securing ₹5,000 in genuine incremental profit. Condition for Approval: Non-refundable upfront booking deposits for all 30 seats must be executed prior to cohort launch.';

export const DEFAULT_EVIDENCE_REQUIREMENTS = 
  'To substantiate the sales assumption of 30 seats demand, require: (1) signed corporate purchase order with non-cancellable terms; (2) 50% non-refundable advance deposit; and (3) named participant roster confirming 30 enrolled executives 14 days before delivery.';

// ==========================================
// 5. SESSION 16 STATE MODEL
// ==========================================

export interface Session16Governance {
  preparerName: string;
  reviewerName: string;
  decisionOwnerName: string;
  approvalStatus: 'Approved' | 'Conditional' | 'Rejected';
  signoffDate: string;
  fileVersion: string;
}

export interface Session16State {
  activeScenarioId: string;
  sliderDiscountPct: number;
  sliderVolume: number;
  extraFixedCost: number;
  enteredMinSeats: string;
  decisionRecommendation: 'REJECT' | 'CONDITIONAL' | 'COUNTER';
  decisionMemo: string;
  evidenceRequirements: string;
  governance: Session16Governance;
}

export const DEFAULT_SESSION_16_STATE: Session16State = {
  activeScenarioId: 'proposed_target',
  sliderDiscountPct: 10,
  sliderVolume: 30,
  extraFixedCost: 0,
  enteredMinSeats: '30',
  decisionRecommendation: 'COUNTER',
  decisionMemo: DEFAULT_DECISION_MEMO,
  evidenceRequirements: DEFAULT_EVIDENCE_REQUIREMENTS,
  governance: {
    preparerName: 'Commercial Analyst Lead',
    reviewerName: 'Finance Operations Manager',
    decisionOwnerName: 'Commercial Director',
    approvalStatus: 'Conditional',
    signoffDate: '2026-11-06',
    fileVersion: 'StudentID_S16_v01.xlsx',
  },
};

// ==========================================
// 6. PERSISTENCE HELPERS
// ==========================================

export function loadSession16State(): Session16State {
  if (typeof window === 'undefined') return DEFAULT_SESSION_16_STATE;
  try {
    const raw = localStorage.getItem(S16_STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION_16_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SESSION_16_STATE,
      ...parsed,
      governance: {
        ...DEFAULT_SESSION_16_STATE.governance,
        ...(parsed.governance || {}),
      },
    };
  } catch {
    return DEFAULT_SESSION_16_STATE;
  }
}

export function saveSession16State(state: Session16State): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(S16_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function clearSession16State(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(S16_STORAGE_KEY);
  } catch {}
}

// ==========================================
// 7. 10-POINT RUBRIC SPECIFICATION
// ==========================================

export interface RubricCriterion {
  id: string;
  name: string;
  marks: number;
  description: string;
  evidenceExpected: string;
}

export const S16_RUBRIC: RubricCriterion[] = [
  {
    id: 's16-crit-exec',
    name: 'Execution',
    marks: 4,
    description: 'Complete and accurate calculation of unit contribution, break-even volume, revenue, and operating profit across baseline and discounted cases.',
    evidenceExpected: 'Side-by-side comparative table with ₹6k vs ₹5k contribution, 20 vs 24 break-even seats, and ₹30k profit.',
  },
  {
    id: 's16-crit-reas',
    name: 'Reasoning',
    marks: 2,
    description: 'Explains method, source, capacity limits, and unverified demand risks; identifies the 30-seat break-even equivalence trap.',
    evidenceExpected: 'Explicit mathematical proof that 30 discounted seats yield ₹0 incremental gain at 100% capacity.',
  },
  {
    id: 's16-crit-comm',
    name: 'Communication',
    marks: 2,
    description: 'Clear commercial decision memo under 130 words with actionable counter-proposal and clear evidence requirements.',
    evidenceExpected: 'Concise executive memo with clear recommendation and verifiable demand conditions.',
  },
  {
    id: 's16-crit-proc',
    name: 'Professional Process',
    marks: 2,
    description: 'Source/version record (StudentID_S16_v01.xlsx), named review roles, and timely governance sign-off.',
    evidenceExpected: 'Preparer, reviewer, and decision owner named with versioned workbook submission.',
  },
];

