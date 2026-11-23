/**
 * VCEP Session 07: Excel and Data Cleaning — Canonical Data & State Model
 * Mission: Turn Messy Data into Reliable Data.
 * 
 * Source Grounding:
 * - Approved Drive Workbook: curriculum/archive/downloads/S07_Excel_and_Data_Cleaning.docx
 * - Schema: app/guided-learning/drive-edition-3.json (Session 7)
 */

export const S07_STORAGE_KEY = 'vcep:s07:drive-v3:student-workstation';
export const S07_PREVIEW_KEY = 'vcep-drive-edition3:session:7:preview';

// Canonical Math Constants
export const RAW_TOTAL_VOLUME_INR = 44000;
export const TARGET_CLEAN_TOTAL_INR = 25000;
export const TARGET_EXCEPTIONS_TOTAL_INR = 19000;
export const TARGET_ASHA_TOTAL_INR = 17000;
export const TARGET_BEACON_TOTAL_INR = 8000;

export interface RawReceiptItem {
  id: string;
  sourceId: string;
  receivedDate: string;
  customerRaw: string;
  amount: string;
  flag: string;
  flagType: 'duplicate' | 'invalid_date' | 'blank_amount' | 'ambiguous_date' | 'case_mismatch' | 'valid';
}

export interface CleanReceiptItem {
  id: string;
  cleanId: string;
  sourceId: string;
  isoDate: string;
  customerStandard: string;
  amount: number;
  rowStatus: 'Approved' | 'Pending Review' | 'Flagged';
}

export interface ExceptionItem {
  id: string;
  sourceId: string;
  rawCustomer: string;
  rawAmount: number | 'blank';
  rawDate: string;
  category: 'Duplicate Entry' | 'Invalid Date' | 'Missing Value' | 'Ambiguous Date Format';
  riskDescription: string;
  auditAction: string;
  status: 'Resolved / Excluded' | 'Quarantined (Suspense)';
  officerNotes: string;
}

export interface Session07WorkstationState {
  rawReceipts: RawReceiptItem[];
  cleanRows: CleanReceiptItem[];
  exceptions: ExceptionItem[];
  formulaNotes: string;
  governance: {
    studentId: string;
    fileVersion: string;
    contributionSummary: string;
    peerCorrection: string;
    professionalBoundary: string;
  };
  lastSaved?: string;
}

export const CASE_B_RAW_RECEIPTS: RawReceiptItem[] = [
  { id: '1', sourceId: 'R01', receivedDate: '2026-10-01', customerRaw: 'ASHA', amount: '12000', flag: 'Customer Uppercase (ASHA → Asha)', flagType: 'case_mismatch' },
  { id: '2', sourceId: 'R02', receivedDate: '2026-10-02', customerRaw: 'Beacon', amount: '8000', flag: 'First Instance (Verified Valid)', flagType: 'valid' },
  { id: '3', sourceId: 'R02', receivedDate: '2026-10-02', customerRaw: 'Beacon', amount: '8000', flag: 'Repeated Key / Duplicate Export', flagType: 'duplicate' },
  { id: '4', sourceId: 'R03', receivedDate: '2026-10-03', customerRaw: ' asha ', amount: '5000', flag: 'Whitespace & Lowercase ( asha  → Asha)', flagType: 'case_mismatch' },
  { id: '5', sourceId: 'R04', receivedDate: '2026-10-32', customerRaw: 'Beacon', amount: '7000', flag: 'Invalid Calendar Date (Oct 32)', flagType: 'invalid_date' },
  { id: '6', sourceId: 'R05', receivedDate: '2026-10-05', customerRaw: 'ASHA', amount: 'blank', flag: 'Missing / Blank Amount (Zeroing Prohibited)', flagType: 'blank_amount' },
  { id: '7', sourceId: 'R06', receivedDate: '10/11/26', customerRaw: 'Beacon', amount: '4000', flag: 'Ambiguous Date Format (10/11/26)', flagType: 'ambiguous_date' },
];

export const INITIAL_CLEAN_ROWS: CleanReceiptItem[] = [
  { id: 'c1', cleanId: 'C01', sourceId: 'R01', isoDate: '2026-10-01', customerStandard: 'Asha', amount: 12000, rowStatus: 'Approved' },
  { id: 'c2', cleanId: 'C02', sourceId: 'R02', isoDate: '2026-10-02', customerStandard: 'Beacon', amount: 8000, rowStatus: 'Approved' },
  { id: 'c3', cleanId: 'C03', sourceId: 'R03', isoDate: '2026-10-03', customerStandard: 'Asha', amount: 5000, rowStatus: 'Approved' },
];

export const INITIAL_EXCEPTIONS: ExceptionItem[] = [
  {
    id: 'e1',
    sourceId: 'R02 (Row 3)',
    rawCustomer: 'Beacon',
    rawAmount: 8000,
    rawDate: '2026-10-02',
    category: 'Duplicate Entry',
    riskDescription: 'Overstates cash collections by ₹8,000 if counted twice; collection officer confirms repeated export of 1 receipt.',
    auditAction: 'Excluded duplicate from Clean; retained in Raw archive.',
    status: 'Resolved / Excluded',
    officerNotes: 'Confirmed single transaction by bank remittance advice.',
  },
  {
    id: 'e2',
    sourceId: 'R04',
    rawCustomer: 'Beacon',
    rawAmount: 7000,
    rawDate: '2026-10-32',
    category: 'Invalid Date',
    riskDescription: 'Calendar error (October has 31 days). Corrupts month-end aging and automated date sorting.',
    auditAction: 'Quarantined in Suspense. Awaiting revised invoice.',
    status: 'Quarantined (Suspense)',
    officerNotes: 'Clarification requested from billing team on actual issue date.',
  },
  {
    id: 'e3',
    sourceId: 'R05',
    rawCustomer: 'ASHA',
    rawAmount: 'blank',
    rawDate: '2026-10-05',
    category: 'Missing Value',
    riskDescription: 'Replacing a missing receipt amount with ₹0 creates false certainty; the amount cannot be confirmed without source evidence.',
    auditAction: 'Held in Quarantine. Zeroing strictly prohibited.',
    status: 'Quarantined (Suspense)',
    officerNotes: 'Pending collection officer or bank source confirmation of the unknown amount.',
  },
  {
    id: 'e4',
    sourceId: 'R06',
    rawCustomer: 'Beacon',
    rawAmount: 4000,
    rawDate: '10/11/26',
    category: 'Ambiguous Date Format',
    riskDescription: 'Format ambiguity (10 Nov vs 11 Oct). Misstates fiscal reporting quarter and tax periods.',
    auditAction: 'Quarantined pending vendor master date convention confirmation.',
    status: 'Quarantined (Suspense)',
    officerNotes: 'Customer invoice format query logged.',
  },
];

export const INITIAL_S07_STATE: Session07WorkstationState = {
  rawReceipts: CASE_B_RAW_RECEIPTS,
  cleanRows: INITIAL_CLEAN_ROWS,
  exceptions: INITIAL_EXCEPTIONS,
  formulaNotes: '=SUMIFS(Clean[Amount], Clean[Customer], "Asha") = ₹17,000\n=SUMIFS(Clean[Amount], Clean[Customer], "Beacon") = ₹8,000\n=COUNTIF(Raw[ID], [@ID]) flags duplicate keys.\nKnown numeric Raw (₹44,000) = Approved (₹25,000) + Known-value exceptions (₹19,000). R05 remains unknown; it is NOT ₹0.',
  governance: {
    studentId: 'STU-2026-DAT',
    fileVersion: 'StudentID_S07_v01',
    contributionSummary: '',
    peerCorrection: '',
    professionalBoundary: '',
  },
};

export const S07_RUBRIC = [
  {
    name: 'Execution',
    points: 4,
    evidence: 'Accurate Clean table (R01, R02, R03: ₹25,000); 4 tracked exceptions (3 known amounts totaling ₹19,000 plus R05 unknown); and known-value bridge ₹44,000 = ₹25,000 + ₹19,000.',
  },
  {
    name: 'Reasoning',
    points: 2,
    evidence: 'Explains quarantine vs deletion principle; refuses to replace blank amounts with zero.',
  },
  {
    name: 'Communication',
    points: 2,
    evidence: 'Documented =SUMIFS and =COUNTIF formulas and customer standardisation mapping (ASHA / asha → Asha).',
  },
  {
    name: 'Professional Process',
    points: 2,
    evidence: 'Source and version record StudentID_S07_v01, complete exception audit trail, and anti-zeroing commitment.',
  },
];

export function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function loadSession07State(): Session07WorkstationState {
  if (typeof window === 'undefined') return INITIAL_S07_STATE;
  try {
    const raw = localStorage.getItem(S07_STORAGE_KEY);
    if (!raw) return INITIAL_S07_STATE;
    const parsed = JSON.parse(raw);
    return {
      rawReceipts: Array.isArray(parsed.rawReceipts) ? parsed.rawReceipts : CASE_B_RAW_RECEIPTS,
      cleanRows: Array.isArray(parsed.cleanRows) ? parsed.cleanRows : INITIAL_CLEAN_ROWS,
      exceptions: Array.isArray(parsed.exceptions) ? parsed.exceptions : INITIAL_EXCEPTIONS,
      formulaNotes: parsed.formulaNotes || INITIAL_S07_STATE.formulaNotes,
      governance: {
        studentId: parsed.governance?.studentId || 'STU-2026-DAT',
        fileVersion: parsed.governance?.fileVersion || 'StudentID_S07_v01',
        contributionSummary: parsed.governance?.contributionSummary || '',
        peerCorrection: parsed.governance?.peerCorrection || '',
        professionalBoundary: parsed.governance?.professionalBoundary || '',
      },
      lastSaved: parsed.lastSaved || parsed.timestamp,
    };
  } catch (err) {
    console.warn('[Session07] Error loading persisted state:', err);
    return INITIAL_S07_STATE;
  }
}

export function saveSession07State(state: Session07WorkstationState): void {
  if (typeof window === 'undefined') return;
  try {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const payload = {
      ...state,
      lastSaved: time,
      timestamp: time,
    };
    localStorage.setItem(S07_STORAGE_KEY, JSON.stringify(payload));
    sessionStorage.setItem(S07_PREVIEW_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Session07] Error saving state:', err);
  }
}

