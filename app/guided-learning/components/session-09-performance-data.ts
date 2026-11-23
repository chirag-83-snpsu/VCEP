/**
 * VCEP Session 09: Business Finance and Performance — Canonical Data & State Model
 * Mission: Read the Numbers. Challenge the Story.
 * 
 * Source Grounding:
 * - Approved Drive Workbook: curriculum/archive/downloads/S09_Business_Finance_and_Performance.docx
 * - Master Schema: app/guided-learning/drive-edition-3.json (Session 09)
 */

export const S09_STORAGE_KEY = 'vcep:s09:drive-v3:student-workstation';
export const S09_PREVIEW_KEY = 'vcep-drive-edition3:session:9:preview';

// Canonical Case D Monthly Data (Net of Tax, in INR)
export interface MonthMIS {
  month: 'July' | 'August' | 'September';
  revenue: number;
  directCost: number;
  overhead: number;
  receivables: number;
}

export const CASE_D_MONTHLY_INPUTS: MonthMIS[] = [
  { month: 'July', revenue: 100000, directCost: 40000, overhead: 35000, receivables: 30000 },
  { month: 'August', revenue: 120000, directCost: 54000, overhead: 39000, receivables: 45000 },
  { month: 'September', revenue: 150000, directCost: 75000, overhead: 45000, receivables: 70000 },
];

// Calculated Financial KPIs
export interface CalculatedMonthKPI {
  month: 'July' | 'August' | 'September';
  grossProfit: number;
  operatingProfit: number;
  grossMarginPct: number;
  operatingMarginPct: number;
  arToRevenuePct: number;
}

export const TARGET_MONTH_KPIS: Record<'July' | 'August' | 'September', CalculatedMonthKPI> = {
  July: {
    month: 'July',
    grossProfit: 60000,
    operatingProfit: 25000,
    grossMarginPct: 60.0,
    operatingMarginPct: 25.0,
    arToRevenuePct: 30.0,
  },
  August: {
    month: 'August',
    grossProfit: 66000,
    operatingProfit: 27000,
    grossMarginPct: 55.0,
    operatingMarginPct: 22.5,
    arToRevenuePct: 37.5,
  },
  September: {
    month: 'September',
    grossProfit: 75000,
    operatingProfit: 30000,
    grossMarginPct: 50.0,
    operatingMarginPct: 20.0,
    arToRevenuePct: 46.7,
  },
};

// MoM Growth Benchmarks (September vs August)
export const GROWTH_BENCHMARKS = {
  revenueGrowthPct: 25.0, // (150k - 120k) / 120k * 100
  directCostGrowthPct: 38.9, // (75k - 54k) / 54k * 100
  grossProfitGrowthPct: 13.6, // (75k - 66k) / 66k * 100
  operatingProfitGrowthPct: 11.1, // (30k - 27k) / 27k * 100
  receivablesGrowthPct: 55.6, // (70k - 45k) / 45k * 100
  grossMarginPpChange: -5.0, // 50.0 - 55.0
  operatingMarginPpChange: -2.5, // 20.0 - 22.5
  quarterlyGrossMarginPpChange: -10.0, // 50.0 - 60.0
};

export interface Session09WorkstationState {
  // Calculated figures (student can adjust or verify)
  userKpis: {
    julyGrossProfit: number;
    augustGrossProfit: number;
    septemberGrossProfit: number;
    julyOperatingProfit: number;
    augustOperatingProfit: number;
    septemberOperatingProfit: number;
    julyGrossMargin: number;
    augustGrossMargin: number;
    septemberGrossMargin: number;
    julyOperatingMargin: number;
    augustOperatingMargin: number;
    septemberOperatingMargin: number;
    revenueGrowthMoM: number;
    profitGrowthMoM: number;
    marginPpChangeMoM: number;
  };
  // Three evidenced observations
  findings: [string, string, string];
  // One critical uncertainty (unverified data gap)
  uncertainty: string;
  // One concrete investigation
  investigation: string;
  // Executive briefing note
  executiveBriefing: string;
  // Peer review / squad defense note
  peerDefenseNote: string;
  // Governance & file metadata
  governance: {
    studentId: string;
    fileVersion: string;
    preparerRole: string;
    reviewerRole: string;
  };
  checkedIndices: number[];
  lastSaved?: string;
}

export const INITIAL_S09_STATE: Session09WorkstationState = {
  userKpis: {
    julyGrossProfit: 60000,
    augustGrossProfit: 66000,
    septemberGrossProfit: 75000,
    julyOperatingProfit: 25000,
    augustOperatingProfit: 27000,
    septemberOperatingProfit: 30000,
    julyGrossMargin: 60.0,
    augustGrossMargin: 55.0,
    septemberGrossMargin: 50.0,
    julyOperatingMargin: 25.0,
    augustOperatingMargin: 22.5,
    septemberOperatingMargin: 20.0,
    revenueGrowthMoM: 25.0,
    profitGrowthMoM: 11.1,
    marginPpChangeMoM: -5.0,
  },
  findings: [
    '1. Severe Gross Margin Compression: While revenue grew 25.0% MoM to ₹1,50,000, direct delivery costs escalated by 38.9% to ₹75,000. As a direct consequence, Gross Margin fell by 5.0 percentage points from August (55.0% to 50.0%) and 10.0 percentage points from July (60.0% to 50.0%), proving that incremental volume is significantly less profitable.',
    '2. Decoupling of Revenue and Operating Profit: Top-line revenue expanded 25.0% from August to September, but operating profit grew by only 11.1% (₹27,000 to ₹30,000), resulting in an operating margin erosion from 22.5% to 20.0%. Growth is diluting unit profitability rather than generating operating leverage.',
    '3. Critical Trade Receivables Lockup: Closing accounts receivable jumped by 55.6% MoM from ₹45,000 to ₹70,000 (+133.3% since July). Receivables now represent 46.7% of total September revenue. The company is generating paper billing growth without collecting operational cash, creating severe working capital risk.',
  ],
  uncertainty:
    'Case D supplies financial totals net of tax but does not disclose whether direct cost escalation was caused by unapproved sales discounting, raw material price surges, or delivery inefficiencies. Furthermore, collection dates and customer credit terms are missing from the data release.',
  investigation:
    'Finance Lead to extract a 30/60/90-day Debtor Aging Schedule by Friday to identify overdue accounts, and audit supplier purchase orders against contract billing rates to isolate the specific operational drivers of direct cost expansion.',
  executiveBriefing:
    'Executive Summary: Management’s assumption that 25% revenue growth proves business health is dangerously flawed. Growth has been accompanied by a 10.0 percentage point gross margin collapse and a ₹70,000 receivables buildup. We recommend halting expansion bonuses until cash collection is verified and direct delivery cost drivers are audited.',
  peerDefenseNote:
    'Sales argues that +25% revenue expansion justifies higher commission payouts. Finance counters that each new rupee of revenue costs 50 paise in direct costs (up from 40 paise in July) while ₹70,000 remains unpaid on customer accounts. Growth without cash collection and margin discipline threatens company solvency.',
  governance: {
    studentId: 'STU-2026-0922',
    fileVersion: 'StudentID_S09_v01.xlsx',
    preparerRole: 'Corporate Financial Analyst',
    reviewerRole: 'Senior Finance Controller',
  },
  checkedIndices: [0, 1, 2, 3, 4, 5],
};

export const S09_RUBRIC = [
  { name: 'Execution', points: 4, evidence: 'All monthly gross profits, operating profits, margins, and growth rates calculated accurately.' },
  { name: 'Reasoning', points: 2, evidence: 'Distinguishes between % revenue growth and percentage point margin compression with clear evidence.' },
  { name: 'Communication', points: 2, evidence: 'Presents 3 structured findings, 1 material business uncertainty, and 1 actionable investigation.' },
  { name: 'Professional Process', points: 2, evidence: 'Refuses to accept top-line sales growth as proof of health without cash/margin verification.' },
];

export const S09_CHECKLIST = [
  'I calculated Gross Profit (Revenue - Direct Cost) and Operating Profit (Gross Profit - Overhead) for all 3 months.',
  'I computed Gross Margin % and Operating Margin % for July, August, and September.',
  'I calculated MoM revenue growth (+25.0%) and operating profit growth (+11.1%) from August to September.',
  'I analyzed the 10.0 percentage point compression in Gross Margin between July and September.',
  'I noted that receivables rose from ₹30,000 to ₹70,000 (representing 46.7% of monthly sales).',
  'I documented 3 evidence-backed findings, 1 critical uncertainty, and 1 investigation plan.',
];

export function loadSession09State(): Session09WorkstationState {
  if (typeof window === 'undefined') return INITIAL_S09_STATE;
  try {
    const saved = localStorage.getItem(S09_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_S09_STATE,
        ...parsed,
        userKpis: { ...INITIAL_S09_STATE.userKpis, ...(parsed.userKpis || {}) },
        findings: parsed.findings?.length === 3 ? parsed.findings : INITIAL_S09_STATE.findings,
        governance: { ...INITIAL_S09_STATE.governance, ...(parsed.governance || {}) },
      };
    }
  } catch {}
  return INITIAL_S09_STATE;
}

export function saveSession09State(state: Session09WorkstationState): void {
  if (typeof window === 'undefined') return;
  try {
    const withTimestamp = {
      ...state,
      lastSaved: new Date().toLocaleTimeString(),
    };
    localStorage.setItem(S09_STORAGE_KEY, JSON.stringify(withTimestamp));
  } catch {}
}

