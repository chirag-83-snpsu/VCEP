/**
 * VCEP Session 10: MIS Dashboard Development — Canonical Data & State Model
 * Mission: Build a Dashboard That Supports Decisions.
 * 
 * Source Grounding:
 * - Approved Drive Workbook: curriculum/archive/downloads/S10_MIS_Dashboard_Development.docx
 * - Master Schema: app/guided-learning/drive-edition-3.json (Session 10)
 */

export const S10_STORAGE_KEY = 'vcep:s10:drive-v3:student-workstation';
export const S10_PREVIEW_KEY = 'vcep-drive-edition3:session:10:preview';

// Canonical Case D Source Cells (Net of Tax, in INR)
export interface SourceRow {
  cellRef: string;
  metric: string;
  july: number;
  august: number;
  september: number;
}

export const CASE_D_SOURCE_CELLS: SourceRow[] = [
  { cellRef: 'CaseD!B2:D2', metric: 'Billed Revenue (Net of Tax)', july: 100000, august: 120000, september: 150000 },
  { cellRef: 'CaseD!B3:D3', metric: 'Direct Delivery Cost (COGS)', july: 40000, august: 54000, september: 75000 },
  { cellRef: 'CaseD!B4:D4', metric: 'Operating Overhead (Opex)', july: 35000, august: 39000, september: 45000 },
  { cellRef: 'CaseD!B5:D5', metric: 'Closing Trade Receivables', july: 30000, august: 45000, september: 70000 },
];

// KPI Definition & Decision Mapping
export interface KPIDefinition {
  id: string;
  name: string;
  formulaCell: string;
  augustValue: number | string;
  septemberBaseline: number | string;
  decisionSupported: string;
  owner: string;
}

export const EXECUTIVE_KPIS: KPIDefinition[] = [
  {
    id: 'kpi-revenue',
    name: 'Billed Revenue',
    formulaCell: '=CaseD!D2',
    augustValue: '₹1,20,000',
    septemberBaseline: '₹1,50,000 (+25.0%)',
    decisionSupported: 'Evaluates top-line commercial demand and market expansion rate.',
    owner: 'Commercial Director',
  },
  {
    id: 'kpi-gross-margin',
    name: 'Gross Profit Margin %',
    formulaCell: '=(D2-D3)/D2',
    augustValue: '55.0%',
    septemberBaseline: '50.0% (-5.0 pp)',
    decisionSupported: 'Evaluates direct delivery cost efficiency and client pricing power.',
    owner: 'Operations Lead',
  },
  {
    id: 'kpi-operating-margin',
    name: 'Operating Margin %',
    formulaCell: '=((D2-D3)-D4)/D2',
    augustValue: '22.5%',
    septemberBaseline: '20.0% (-2.5 pp)',
    decisionSupported: 'Evaluates bottom-line operational leverage after overhead allocations.',
    owner: 'Finance Controller',
  },
  {
    id: 'kpi-receivables',
    name: 'Closing Trade Receivables',
    formulaCell: '=CaseD!D5',
    augustValue: '₹45,000',
    septemberBaseline: '₹70,000 (46.7% of Rev)',
    decisionSupported: 'Evaluates working capital liquidity exposure and uncollected credit risk.',
    owner: 'Credit & Collections Lead',
  },
];

// Sensitivity recalculation helper
export function calculateMISMetrics(directCost: number) {
  const revenue = 150000;
  const overhead = 45000;
  const receivables = 70000;

  const grossProfit = revenue - directCost;
  const grossMarginPct = (grossProfit / revenue) * 100;
  const operatingProfit = grossProfit - overhead;
  const operatingMarginPct = (operatingProfit / revenue) * 100;
  const receivablesToSalesPct = (receivables / revenue) * 100;

  // August comparisons
  const augGrossMargin = 55.0;
  const augOperatingMargin = 22.5;
  const augOperatingProfit = 27000;

  const gmMoMPp = grossMarginPct - augGrossMargin;
  const omMoMPp = operatingMarginPct - augOperatingMargin;
  const opGrowthPct = ((operatingProfit - augOperatingProfit) / augOperatingProfit) * 100;

  return {
    revenue,
    directCost,
    overhead,
    receivables,
    grossProfit,
    grossMarginPct,
    operatingProfit,
    operatingMarginPct,
    receivablesToSalesPct,
    gmMoMPp,
    omMoMPp,
    opGrowthPct,
  };
}

export interface Session10WorkstationState {
  managementQuestion: string;
  directCostInput: number; // Baseline ₹75k vs Stress Test ₹78k
  selectedKpiIds: string[];
  memoText: string;
  visualizationJustification: string;
  governance: {
    studentId: string;
    fileVersion: string;
    action1Owner: string;
    action1Deadline: string;
    action2Owner: string;
    action2Deadline: string;
  };
  checkedIndices: number[];
  lastSaved?: string;
}

export const DEFAULT_MEMO_TEXT =
  'September revenue expanded 25.0% to ₹1,50,000, but operating margin compressed from 22.5% to 20.0% due to a 38.9% surge in direct delivery costs (₹75,000). Concurrently, trade receivables spiked to ₹70,000, locking 46.7% of monthly sales in uncollected credit. Action 1: Operations Lead to audit direct supplier delivery contracts by Friday to isolate material cost inflation. Action 2: Collections Lead to enforce credit holds on accounts overdue >30 days by Monday. Limitation: Case D does not supply a collection ledger or customer payment dates.';

export const DEFAULT_JUSTIFICATION =
  'The 4 KPI cards and 3-month trend chart immediately resolve the Managing Director’s 5-minute decision: they demonstrate that while top-line revenue is accelerating, gross margin compression (-5.0 pp) and receivables lockup (₹70,000) are eroding cash solvency. Executive attention is directed to direct costs rather than premature expansion bonuses.';

export const INITIAL_S10_STATE: Session10WorkstationState = {
  managementQuestion:
    'Is our 25% September revenue growth converting into sustainable operating margin and cash, or are mounting delivery costs and uncollected trade receivables threatening liquidity?',
  directCostInput: 75000,
  selectedKpiIds: ['kpi-revenue', 'kpi-gross-margin', 'kpi-operating-margin', 'kpi-receivables'],
  memoText: DEFAULT_MEMO_TEXT,
  visualizationJustification: DEFAULT_JUSTIFICATION,
  governance: {
    studentId: 'STU-2026-1044',
    fileVersion: 'StudentID_S10_v01.xlsx',
    action1Owner: 'Operations Lead (Priya Nair)',
    action1Deadline: 'Friday 17:00',
    action2Owner: 'Collections Lead (Rohan Sharma)',
    action2Deadline: 'Monday 12:00',
  },
  checkedIndices: [0, 1, 2, 3, 4, 5],
};

export const S10_RUBRIC = [
  { name: 'Execution', points: 4, evidence: 'Dashboard correctly links core KPIs and recalculates dynamically under direct cost sensitivity changes.' },
  { name: 'Reasoning', points: 2, evidence: 'Explains impact of direct cost changes on margins; identifies trade-off between sales and cash collection.' },
  { name: 'Communication', points: 2, evidence: 'Management memo strictly adheres to 150-word limit and includes Insight, Evidence, Actions, and Limitation.' },
  { name: 'Professional Process', points: 2, evidence: 'Assigns clear role owners and specific clock deadlines to both recommended management actions.' },
];

export const S10_CHECKLIST = [
  'My dashboard features the 4 executive KPIs: Revenue, Gross Margin %, Operating Margin %, and Closing Receivables.',
  'I verified August vs September comparisons for all 4 KPIs.',
  'I conducted the sensitivity stress test by adjusting direct costs from ₹75,000 to ₹78,000.',
  'All calculation cards and margin percentages updated dynamically without formula errors.',
  'My management memo is within the 150-word corporate limit (Insight, Evidence, Action, Limitation).',
  'I assigned specific role owners and delivery deadlines to both recommended actions.',
];

export function countWords(text: string): number {
  return (text || '').trim().split(/\s+/).filter(Boolean).length;
}

export function loadSession10State(): Session10WorkstationState {
  if (typeof window === 'undefined') return INITIAL_S10_STATE;
  try {
    const saved = localStorage.getItem(S10_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_S10_STATE,
        ...parsed,
        governance: { ...INITIAL_S10_STATE.governance, ...(parsed.governance || {}) },
      };
    }
  } catch {}
  return INITIAL_S10_STATE;
}

export function saveSession10State(state: Session10WorkstationState): void {
  if (typeof window === 'undefined') return;
  try {
    const withTimestamp = {
      ...state,
      lastSaved: new Date().toLocaleTimeString(),
    };
    localStorage.setItem(S10_STORAGE_KEY, JSON.stringify(withTimestamp));
  } catch {}
}

