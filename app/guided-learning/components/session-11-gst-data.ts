/**
 * VCEP Session 11: GST and Invoice Review — Canonical Data & State Model
 * Mission: Review the Invoice Before You Approve It.
 * 
 * Source Grounding:
 * - Approved Drive Workbook: curriculum/archive/downloads/S11_GST_and_Invoice_Review.docx
 * - Master Schema: app/guided-learning/drive-edition-3.json (Session 11)
 * - Fictional domestic teaching policy: Supplier in Karnataka, 18% standard rate.
 */

export const S11_STORAGE_KEY = 'vcep:s11:drive-v3:student-workstation';
export const S11_PREVIEW_KEY = 'vcep-drive-edition3:session:11:preview';

export interface SalesInvoiceEvidence {
  id: string; // 'E01' | 'E02' | 'E03'
  invoiceSerial: string;
  invoiceDate: string;
  customerName: string;
  supplierLocation: string; // 'Karnataka'
  placeOfSupply: string; // 'Karnataka' | 'Tamil Nadu'
  hsnCode: string;
  taxableAmount: number;
  draftTaxInRecords: string;
  correctTaxType: 'Intra-State (CGST + SGST)' | 'Inter-State (IGST)';
  cgstRate: number; // 9 or 0
  sgstRate: number; // 9 or 0
  igstRate: number; // 0 or 18
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalInvoiceAmount: number;
  complianceStatus: 'Compliant' | 'Defect: Wrong Tax Type' | 'Defect: Missing Serial';
  defectSummary: string;
  requiredAction: string;
  lineItems: Array<{
    description: string;
    qty: number;
    unitPrice: number;
    amount: number;
  }>;
}

export const CASE_E_SALES_INVOICES: SalesInvoiceEvidence[] = [
  {
    id: 'E01',
    invoiceSerial: 'VL001',
    invoiceDate: '12-Oct-2026',
    customerName: 'Bengaluru Cloudworks Pvt Ltd',
    supplierLocation: 'Karnataka',
    placeOfSupply: 'Karnataka',
    hsnCode: '998314',
    taxableAmount: 10000,
    draftTaxInRecords: 'CGST 900; SGST 900',
    correctTaxType: 'Intra-State (CGST + SGST)',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 0,
    cgstAmount: 900,
    sgstAmount: 900,
    igstAmount: 0,
    totalInvoiceAmount: 11800,
    complianceStatus: 'Compliant',
    defectSummary: 'No defects. Intra-state supply within Karnataka correctly charged at 9% CGST (₹900) + 9% SGST (₹900).',
    requiredAction: 'Approve invoice for accounting posting and dispatch.',
    lineItems: [
      { description: 'Cloud infrastructure consulting services', qty: 10, unitPrice: 1000, amount: 10000 },
    ],
  },
  {
    id: 'E02',
    invoiceSerial: 'VL002',
    invoiceDate: '14-Oct-2026',
    customerName: 'Chennai Logistics Tech Ltd',
    supplierLocation: 'Karnataka',
    placeOfSupply: 'Tamil Nadu',
    hsnCode: '998315',
    taxableAmount: 20000,
    draftTaxInRecords: 'CGST 1800; SGST 1800',
    correctTaxType: 'Inter-State (IGST)',
    cgstRate: 0,
    sgstRate: 0,
    igstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 3600,
    totalInvoiceAmount: 23600,
    complianceStatus: 'Defect: Wrong Tax Type',
    defectSummary: 'Tax classification error. Draft invoice split ₹3,600 tax into CGST/SGST, but inter-state supply to Tamil Nadu requires 18% IGST.',
    requiredAction: 'Cancel draft tax distribution; reclassify to 18% IGST (₹3,600) and reissue corrected invoice.',
    lineItems: [
      { description: 'Supply chain analytics platform subscription', qty: 1, unitPrice: 20000, amount: 20000 },
    ],
  },
  {
    id: 'E03',
    invoiceSerial: 'Missing',
    invoiceDate: '16-Oct-2026',
    customerName: 'Mysuru Retail Ventures LLP',
    supplierLocation: 'Karnataka',
    placeOfSupply: 'Karnataka',
    hsnCode: '998311',
    taxableAmount: 5000,
    draftTaxInRecords: 'CGST 450; SGST 450',
    correctTaxType: 'Intra-State (CGST + SGST)',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 0,
    cgstAmount: 450,
    sgstAmount: 450,
    igstAmount: 0,
    totalInvoiceAmount: 5900,
    complianceStatus: 'Defect: Missing Serial',
    defectSummary: 'Compliance violation under Rule 46 of CGST Rules. Invoice lacks a mandatory sequential serial number.',
    requiredAction: 'Place on hold. Assign next consecutive serial number (e.g., VL003) before dispatching to customer.',
    lineItems: [
      { description: 'Database schema performance optimization', qty: 5, unitPrice: 1000, amount: 5000 },
    ],
  },
];

export interface PurchaseRegisterItem {
  id: string; // 'P01' | 'P02' | 'P03'
  vendorBillNo: string;
  supplierName: string;
  taxableAmount: number;
  bookTax: number;
  statementTax: number | 'Not present';
  reconciliationStatus: 'Matched' | 'Unmatched / Exception';
  itcAction: 'Eligible for Verification' | 'Quarantine ITC & Escalate';
  riskAnalysis: string;
}

export const CASE_E_PURCHASES: PurchaseRegisterItem[] = [
  {
    id: 'P01',
    vendorBillNo: 'SUP-KA-8812',
    supplierName: 'Bengaluru Office Supplies Co',
    taxableAmount: 1000,
    bookTax: 180,
    statementTax: 180,
    reconciliationStatus: 'Matched',
    itcAction: 'Eligible for Verification',
    riskAnalysis: 'Fully matched against GSTR-2B inward statement. Retain delivery challan as corroborating evidence before claiming.',
  },
  {
    id: 'P02',
    vendorBillNo: 'VND-TN-9041',
    supplierName: 'Kaveri Server Hardware Works',
    taxableAmount: 2000,
    bookTax: 360,
    statementTax: 'Not present',
    reconciliationStatus: 'Unmatched / Exception',
    itcAction: 'Quarantine ITC & Escalate',
    riskAnalysis: 'Missing from auto-drafted GSTR-2B. Vendor has not filed GSTR-1. Claiming ₹360 ITC will attract tax notices and interest penalties.',
  },
  {
    id: 'P03',
    vendorBillNo: 'SUP-KA-9104',
    supplierName: 'Hubballi Network Systems',
    taxableAmount: 3000,
    bookTax: 540,
    statementTax: 540,
    reconciliationStatus: 'Matched',
    itcAction: 'Eligible for Verification',
    riskAnalysis: 'Fully matched against GSTR-2B inward statement. Retain commercial documentation for month-end credit verification.',
  },
];

export interface CardinalInvoiceRule {
  ruleNum: number;
  title: string;
  description: string;
  badge: string;
  accentColor: string;
}

export const CARDINAL_INVOICE_RULES: CardinalInvoiceRule[] = [
  {
    ruleNum: 1,
    title: 'Place of Supply Dictates Tax Head',
    description: 'Intra-state sales (Karnataka to Karnataka) incur 9% CGST + 9% SGST. Inter-state sales (Karnataka to Tamil Nadu) incur 18% IGST. Never apply 18% to each component.',
    badge: 'TAX CLASSIFICATION',
    accentColor: '#17245C',
  },
  {
    ruleNum: 2,
    title: 'Mandatory Sequential Serial Number',
    description: 'Under Rule 46 of CGST Rules, an invoice without a consecutive serial number cannot be legally issued or approved. Missing serials must be quarantined.',
    badge: 'STATUTORY COMPLIANCE',
    accentColor: '#b45309',
  },
  {
    ruleNum: 3,
    title: 'GSTR-2B Matching Rule for ITC',
    description: 'Having a paper purchase bill is not permission to claim tax credit. Credit can only be claimed if the bill appears on the inward portal statement (GSTR-2B).',
    badge: 'PORTAL RECONCILIATION',
    accentColor: '#0F766E',
  },
  {
    ruleNum: 4,
    title: 'Quarantine & Escalate Unmatched Credits',
    description: 'When purchase bills are absent from GSTR-2B (such as P02), quarantine the credit immediately and issue a formal inquiry to the vendor requesting GSTR-1 ARN.',
    badge: 'RISK MANAGEMENT',
    accentColor: '#b91c1c',
  },
];

export interface Session11WorkstationState {
  selectedInvoiceTab: string; // 'E01' | 'E02' | 'E03'
  invoiceAudits: {
    [key: string]: {
      checkedSerial: boolean;
      checkedPos: boolean;
      checkedTaxType: boolean;
      checkedValue: boolean;
      studentStatus: 'Compliant' | 'Defect: Wrong Tax Type' | 'Defect: Missing Serial';
      studentNotes: string;
    };
  };
  purchaseAudits: {
    [key: string]: {
      reconciliationStatus: 'Matched' | 'Unmatched / Exception';
      itcAction: 'Eligible for Verification' | 'Quarantine ITC & Escalate';
      studentNotes: string;
    };
  };
  vendorEscalationMemo: string;
  mentorQueryNote: string;
  governance: {
    studentId: string;
    fileVersion: string;
    taxPreparer: string;
    taxReviewer: string;
    decisionOwner: string;
  };
  checkedIndices: number[];
  lastSaved?: string;
}

export const DEFAULT_VENDOR_MEMO =
  `Subject: Urgent — Unmatched Purchase Invoice P02 Missing from GSTR-2B Portal Statement

Dear Accounts Team (Kaveri Server Hardware Works),

During our month-end GST reconciliation for the current tax period, we identified that purchase bill VND-TN-9041 (Taxable: ₹2,000, Tax: ₹360) is absent from our auto-drafted GSTR-2B portal statement.

Under Section 16(2)(aa) of the CGST Act, our company cannot claim ₹360 in Input Tax Credit until this invoice appears on the GST portal. We have quarantined this amount and placed invoice payment on hold.

Please confirm whether this invoice has been uploaded in your outward GSTR-1 return and provide the ARN filing reference by Friday 15:00.

Regards,
Tax & Compliance Accounts Executive
Bengaluru Enterprises`;

export const DEFAULT_MENTOR_NOTE =
  `Mentor Escalation Query:
1. Vendor Kaveri Hardware has not reflected Bill P02 on GSTR-2B. We have quarantined ₹360 ITC to avoid interest liabilities under Section 50.
2. Sales Invoice E02 was drafted with CGST/SGST for a Tamil Nadu buyer; we corrected this to 18% IGST (₹3,600).
3. Sales Invoice E03 has no serial number; we withheld dispatch pending assignment of sequential numbering under Rule 46.`;

export const INITIAL_S11_STATE: Session11WorkstationState = {
  selectedInvoiceTab: 'E01',
  invoiceAudits: {
    E01: {
      checkedSerial: true,
      checkedPos: true,
      checkedTaxType: true,
      checkedValue: true,
      studentStatus: 'Compliant',
      studentNotes: 'Intra-state supply within Karnataka correctly charged at 9% CGST (₹900) and 9% SGST (₹900). Total ₹11,800 is verified.',
    },
    E02: {
      checkedSerial: true,
      checkedPos: true,
      checkedTaxType: true,
      checkedValue: true,
      studentStatus: 'Defect: Wrong Tax Type',
      studentNotes: 'Inter-state transaction (Place of Supply: Tamil Nadu). Reclassified from draft CGST/SGST to 18% IGST (₹3,600). Total ₹23,600.',
    },
    E03: {
      checkedSerial: false,
      checkedPos: true,
      checkedTaxType: true,
      checkedValue: true,
      studentStatus: 'Defect: Missing Serial',
      studentNotes: 'Missing mandatory tax invoice serial number. Under Rule 46, invoice cannot be issued or dispatched until numbered.',
    },
  },
  purchaseAudits: {
    P01: {
      reconciliationStatus: 'Matched',
      itcAction: 'Eligible for Verification',
      studentNotes: 'Present in GSTR-2B (₹180). Eligible for credit verification upon receipt confirmation.',
    },
    P02: {
      reconciliationStatus: 'Unmatched / Exception',
      itcAction: 'Quarantine ITC & Escalate',
      studentNotes: 'Absent from GSTR-2B. Quarantined ₹360 ITC and issued vendor escalation query.',
    },
    P03: {
      reconciliationStatus: 'Matched',
      itcAction: 'Eligible for Verification',
      studentNotes: 'Present in GSTR-2B (₹540). Eligible for credit verification upon receipt confirmation.',
    },
  },
  vendorEscalationMemo: DEFAULT_VENDOR_MEMO,
  mentorQueryNote: DEFAULT_MENTOR_NOTE,
  governance: {
    studentId: 'STU-2026-1102',
    fileVersion: 'StudentID_S11_v01.xlsx',
    taxPreparer: 'Aarav Tax Analyst',
    taxReviewer: 'Priya Senior Reviewer',
    decisionOwner: 'Finance Controller',
  },
  checkedIndices: [0, 1, 2, 3, 4, 5],
};

export const S11_RUBRIC = [
  { name: 'Execution', points: 4, evidence: 'Complete and accurate sales invoice audit, tax computation schedule, and purchase matching schedule.' },
  { name: 'Reasoning', points: 2, evidence: 'Explains why E02 requires IGST instead of CGST/SGST and justifies why claiming unmatched ITC on P02 is non-compliant.' },
  { name: 'Communication', points: 2, evidence: 'Drafts clear vendor escalation memo requesting GSTR-1 upload proof and ARN reference with specific invoice numbers.' },
  { name: 'Professional Process', points: 2, evidence: 'Quarantines unmatched tax credit without premature deduction; specifies file deliverable StudentID_S11_v01.xlsx.' },
];

export const S11_CHECKLIST = [
  'I audited sales invoice E01 and confirmed 9% CGST (₹900) + 9% SGST (₹900) for intra-state supply in Karnataka.',
  'I identified the tax type error on E02 (Place of Supply: Tamil Nadu) and reclassified it to 18% IGST (₹3,600).',
  'I flagged the compliance defect on E03 (missing mandatory invoice serial number under Rule 46).',
  'I matched purchase bills P01 and P03 to the inward portal statement (₹720 verified ITC).',
  'I quarantined purchase bill P02 (₹360 tax credit) because it is absent from the GSTR-2B statement.',
  'I drafted a formal vendor inquiry requesting proof of GSTR-1 filing and ARN reference before claiming credit.',
];

export function loadSession11State(): Session11WorkstationState {
  if (typeof window === 'undefined') return INITIAL_S11_STATE;
  try {
    const raw = localStorage.getItem(S11_STORAGE_KEY);
    if (!raw) return INITIAL_S11_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_S11_STATE,
      ...parsed,
      invoiceAudits: {
        ...INITIAL_S11_STATE.invoiceAudits,
        ...(parsed.invoiceAudits || {}),
      },
      purchaseAudits: {
        ...INITIAL_S11_STATE.purchaseAudits,
        ...(parsed.purchaseAudits || {}),
      },
      governance: {
        ...INITIAL_S11_STATE.governance,
        ...(parsed.governance || {}),
      },
    };
  } catch {
    return INITIAL_S11_STATE;
  }
}

export function saveSession11State(state: Session11WorkstationState): void {
  if (typeof window === 'undefined') return;
  try {
    const withTimestamp = {
      ...state,
      lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    localStorage.setItem(S11_STORAGE_KEY, JSON.stringify(withTimestamp));
  } catch {}
}

export function clearSession11State(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(S11_STORAGE_KEY);
  } catch {}
}

