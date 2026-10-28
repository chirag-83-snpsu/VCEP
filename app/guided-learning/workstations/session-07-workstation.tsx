'use client';

import React, { useState, useEffect } from 'react';
import { SpreadsheetGrid, ColumnDef } from './components/spreadsheet-grid';
import { ReconciliationCard } from './components/reconciliation-card';
import { ExceptionLogStudio, ExceptionItem } from './components/exception-log-studio';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { Table, ShieldAlert, CheckCircle2, FileSpreadsheet, Eye, HelpCircle } from 'lucide-react';

const STORAGE_KEY = 'vcep:s07:drive-v3:student-workstation';

type RawReceipt = {
  id: string;
  sourceId: string;
  receivedDate: string;
  customerRaw: string;
  amount: string;
};

type CleanReceipt = {
  id: string;
  cleanId: string;
  sourceId: string;
  isoDate: string;
  customerStandard: string;
  amount: number;
  rowStatus: string;
};

const rawReceiptsData: RawReceipt[] = [
  { id: '1', sourceId: 'R01', receivedDate: '2026-10-01', customerRaw: 'ASHA', amount: '12000' },
  { id: '2', sourceId: 'R02', receivedDate: '2026-10-02', customerRaw: 'Beacon', amount: '8000' },
  { id: '3', sourceId: 'R02', receivedDate: '2026-10-02', customerRaw: 'Beacon', amount: '8000' },
  { id: '4', sourceId: 'R03', receivedDate: '2026-10-03', customerRaw: 'asha', amount: '5000' },
  { id: '5', sourceId: 'R04', receivedDate: '2026-10-32', customerRaw: 'Beacon', amount: '7000' },
  { id: '6', sourceId: 'R05', receivedDate: '2026-10-05', customerRaw: 'ASHA', amount: 'blank' },
  { id: '7', sourceId: 'R06', receivedDate: '10/11/26', customerRaw: 'Beacon', amount: '4000' },
];

const initialCleanData: CleanReceipt[] = [
  { id: 'c1', cleanId: 'C01', sourceId: 'R01', isoDate: '2026-10-01', customerStandard: 'Asha', amount: 12000, rowStatus: 'Approved' },
  { id: 'c2', cleanId: 'C02', sourceId: 'R02', isoDate: '2026-10-02', customerStandard: 'Beacon', amount: 8000, rowStatus: 'Approved' },
  { id: 'c3', cleanId: 'C03', sourceId: 'R03', isoDate: '2026-10-03', customerStandard: 'Asha', amount: 5000, rowStatus: 'Approved' },
];

const initialExceptionsData: ExceptionItem[] = [
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
    riskDescription: 'Replacing blank with ₹0 creates false certainty and conceals an unpaid invoice amount.',
    auditAction: 'Held in Quarantine. Zeroing strictly prohibited.',
    status: 'Quarantined (Suspense)',
    officerNotes: 'Pending bank statement confirmation of deposited amount.',
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

export function Session07Workstation() {
  const [activeSheet, setActiveSheet] = useState<'raw' | 'clean' | 'exceptions'>('clean');
  const [cleanRows, setCleanRows] = useState<CleanReceipt[]>(initialCleanData);
  const [exceptions, setExceptions] = useState<ExceptionItem[]>(initialExceptionsData);
  const [formulaNotes, setFormulaNotes] = useState(
    '=SUMIFS(Clean[Amount],Clean[Customer],"Asha") = ₹17,000\n=SUMIFS(Clean[Amount],Clean[Customer],"Beacon") = ₹8,000\n=COUNTIF(Raw[ID],[@ID]) identifies repeated row keys.'
  );
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cleanRows) setCleanRows(parsed.cleanRows);
        if (parsed.exceptions) setExceptions(parsed.exceptions);
        if (parsed.formulaNotes) setFormulaNotes(parsed.formulaNotes);
        if (parsed.checkedIndices) setCheckedIndices(parsed.checkedIndices);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (
    updatedClean: CleanReceipt[],
    updatedExceptions: ExceptionItem[],
    updatedNotes: string,
    updatedChecks: number[]
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          cleanRows: updatedClean,
          exceptions: updatedExceptions,
          formulaNotes: updatedNotes,
          checkedIndices: updatedChecks,
          timestamp,
        })
      );
    } catch {}
  };

  const handleCleanChange = (rowIndex: number, columnKey: string, value: any) => {
    const updated = [...cleanRows];
    updated[rowIndex] = { ...updated[rowIndex], [columnKey]: value };
    setCleanRows(updated);
    saveState(updated, exceptions, formulaNotes, checkedIndices);
  };

  const handleExceptionChange = (id: string, field: keyof ExceptionItem, value: string) => {
    const updated = exceptions.map((e) => (e.id === id ? { ...e, [field]: value } : e));
    setExceptions(updated);
    saveState(cleanRows, updated, formulaNotes, checkedIndices);
  };

  const handleToggleCheck = (index: number) => {
    const next = checkedIndices.includes(index)
      ? checkedIndices.filter((i) => i !== index)
      : [...checkedIndices, index];
    setCheckedIndices(next);
    saveState(cleanRows, exceptions, formulaNotes, next);
  };

  // Calculations for reconciliation
  const rawTotalCount = 7;
  const rawTotalAmount = 44000; // Case B control total: R01 (₹12k) + R02 (₹8k) + R02 (₹8k) + R03 (₹5k) + R04 (₹7k) + R05 (₹0) + R06 (₹4k) = ₹44,000
  const approvedTotalCount = cleanRows.length;
  const approvedTotalAmount = cleanRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const quarantineTotalCount = exceptions.length;
  const quarantineTotalAmount = exceptions.reduce((sum, e) => {
    const val = Number(e.rawAmount);
    return isNaN(val) ? sum : sum + val;
  }, 0);

  // Customer breakouts
  const ashaTotal = cleanRows
    .filter((r) => r.customerStandard.toLowerCase() === 'asha')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const ashaCount = cleanRows.filter((r) => r.customerStandard.toLowerCase() === 'asha').length;

  const beaconTotal = cleanRows
    .filter((r) => r.customerStandard.toLowerCase() === 'beacon')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const beaconCount = cleanRows.filter((r) => r.customerStandard.toLowerCase() === 'beacon').length;

  const handleClear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setCleanRows(initialCleanData);
    setExceptions(initialExceptionsData);
    setFormulaNotes('');
    setCheckedIndices([]);
    setDraftTimestamp('');
  };

  const rawColumns: ColumnDef<RawReceipt>[] = [
    { key: 'sourceId', header: 'Raw ID', width: '80px', align: 'center' },
    { key: 'receivedDate', header: 'Received Date', width: '130px' },
    { key: 'customerRaw', header: 'Customer Raw String', width: '150px' },
    { key: 'amount', header: 'Amount Value', align: 'right', format: (val) => val === 'blank' ? 'blank (missing)' : `₹${Number(val).toLocaleString('en-IN')}` },
  ];

  const cleanColumns: ColumnDef<CleanReceipt>[] = [
    { key: 'cleanId', header: 'Clean ID', width: '90px', align: 'center' },
    { key: 'sourceId', header: 'Source ID', width: '90px', align: 'center' },
    { key: 'isoDate', header: 'ISO Date (YYYY-MM-DD)', width: '160px', editable: true },
    { key: 'customerStandard', header: 'Customer Standard Name', width: '180px', editable: true },
    { key: 'amount', header: 'Approved Amount (INR)', width: '160px', align: 'right', editable: true, formula: '=SUMIFS(Clean[Amount],Clean[Customer],A2)', format: (val) => `₹${Number(val).toLocaleString('en-IN')}` },
    { key: 'rowStatus', header: 'Audit Status', width: '120px' },
  ];

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Complete, accurate Clean model with standardized customer names and ISO dates.' },
    { name: 'Reasoning', points: 2, evidence: 'Explains why blank amount cannot be zeroed and why duplicate was excluded.' },
    { name: 'Communication', points: 2, evidence: 'Clear exception log with audit actions; live formula view demonstrated.' },
    { name: 'Professional Process', points: 2, evidence: 'Three-way reconciliation balances: Raw Inflow = Approved Clean + Exceptions.' },
  ];

  const checklist = [
    'I preserved the Raw Receipts table as an immutable read-only archive.',
    'I standardized customer names to "Asha" and "Beacon" per the master catalogue.',
    'I removed duplicate R02 and logged the confirmed collection officer sign-off.',
    'I quarantined R04 (invalid date 2026-10-32) and R06 (ambiguous date 10/11/26).',
    'I did NOT replace R05 blank amount with ₹0 (prohibited zeroing).',
    'My Clean totals match: Asha ₹17,000 + Beacon ₹8,000 = ₹25,000.',
    'My live reconciliation proof balances exactly: 7 Raw = 3 Clean + 4 Exceptions.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Context & Business Principle */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 01 · DATA ARCHITECTURE & CASE B BRIEF</span>
          <h3>Preserve Raw, Transform into Clean, Document Exceptions</h3>
          <p>
            Case B raw receipts: Repeated ID, invalid calendar date (2026-10-32), ambiguous format (10/11/26), blank amount, and mixed-case names (<code>ASHA</code> / <code>asha</code>). The commercial manager requests verified total receipts by customer.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Never Overwrite Raw:</strong> Always maintain the raw source dataset as an unedited historical archive.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Standardize into Clean:</strong> Enforce ISO-8601 dates and proper-case customer names.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Isolate in Exceptions:</strong> Never guess missing values or zero out blanks. Full financial exposure must remain visible.
          </div>
        </div>
      </div>

      {/* 2. 3-Sheet Tabbed Spreadsheet Studio */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 02 · 3-SHEET WORKBOOK ENGINE</span>
          <h3>Case B Multi-Sheet Workbook</h3>
          <p>
            Toggle between the 3 working sheets below. View the formula bar, inspect standardized values, and review the quarantine log.
          </p>
        </div>

        <div className="vcep-sheet-tabs-bar">
          <button
            type="button"
            className={`vcep-sheet-tab ${activeSheet === 'clean' ? 'is-active' : ''}`}
            onClick={() => setActiveSheet('clean')}
          >
            <FileSpreadsheet size={15} aria-hidden="true" />
            <span>Sheet 2: Clean Working Model ({cleanRows.length} rows · ₹{approvedTotalAmount.toLocaleString('en-IN')})</span>
          </button>
          <button
            type="button"
            className={`vcep-sheet-tab ${activeSheet === 'raw' ? 'is-active' : ''}`}
            onClick={() => setActiveSheet('raw')}
          >
            <Table size={15} aria-hidden="true" />
            <span>Sheet 1: Raw Receipts Archive ({rawReceiptsData.length} rows · Read-Only)</span>
          </button>
          <button
            type="button"
            className={`vcep-sheet-tab ${activeSheet === 'exceptions' ? 'is-active' : ''}`}
            onClick={() => setActiveSheet('exceptions')}
          >
            <ShieldAlert size={15} aria-hidden="true" />
            <span>Sheet 3: Exception & Quarantine Log ({exceptions.length} rows)</span>
          </button>
        </div>

        <div className="vcep-sheet-content-pane">
          {activeSheet === 'clean' && (
            <SpreadsheetGrid
              title="Sheet 2: Approved Clean Receipts"
              data={cleanRows}
              columns={cleanColumns}
              onChange={handleCleanChange}
              summaryRow={
                <tr className="vcep-spreadsheet-summary-row">
                  <td colSpan={5} style={{ textAlign: 'right', fontWeight: 600 }}>
                    Approved Clean Receipts Total (=SUM):
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#0F766E' }}>
                    ₹{approvedTotalAmount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: '#0F766E' }}>
                    3 Validated Records
                  </td>
                </tr>
              }
            />
          )}

          {activeSheet === 'raw' && (
            <div>
              <div className="vcep-raw-immutable-notice">
                <span>Immutable Source Archive · This sheet reflects data exactly as imported from Case B.</span>
              </div>
              <SpreadsheetGrid
                title="Sheet 1: Raw Case B Import"
                data={rawReceiptsData}
                columns={rawColumns}
                readOnly={true}
                showFormulaToggle={false}
              />
            </div>
          )}

          {activeSheet === 'exceptions' && (
            <ExceptionLogStudio
              exceptions={exceptions}
              onChange={handleExceptionChange}
            />
          )}
        </div>
      </div>

      {/* 3. Live Reconciliation & Customer Breakout */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 03 · EXPOSURE CONTROL & INDEPENDENT RECONCILIATION</span>
          <h3>Cross-Foot Reconciliation & Customer Subtotals</h3>
          <p>
            Verify that every single rupee from Raw is accounted for across Approved Clean receipts and Quarantined Suspense records.
          </p>
        </div>

        <ReconciliationCard
          rawCount={rawTotalCount}
          rawAmount={rawTotalAmount}
          approvedCount={approvedTotalCount}
          approvedAmount={approvedTotalAmount}
          quarantineCount={quarantineTotalCount}
          quarantineAmount={quarantineTotalAmount}
          customerBreakdown={[
            { name: 'Asha (R01 ₹12k + R03 ₹5k)', amount: ashaTotal, count: ashaCount },
            { name: 'Beacon (R02 ₹8k)', amount: beaconTotal, count: beaconCount },
          ]}
        />

        <div className="vcep-field-group" style={{ marginTop: '1.25rem' }}>
          <label className="vcep-field-label">
            <span>Peer Audit Log & Live Formulas (=SUMIFS)</span>
            <span className="field-hint">
              Document your Excel formulas and the results of your peer reproduction audit:
            </span>
          </label>
          <textarea
            rows={3}
            value={formulaNotes}
            onChange={(e) => {
              setFormulaNotes(e.target.value);
              saveState(cleanRows, exceptions, e.target.value, checkedIndices);
            }}
            className="vcep-textarea-input"
          />
        </div>
      </div>

      {/* 4. Evidence Handover & Pre-Submission Review */}
      <EvidenceHandoverCard
        sessionId={7}
        sessionTitle="Excel and Data Cleaning"
        deliverableName="Clean Dataset, Exception Register and Formula Model"
        rubric={rubric}
        checklistItems={checklist}
        checkedIndices={checkedIndices}
        onToggleChecklist={handleToggleCheck}
        draftTimestamp={draftTimestamp}
        onClearDraft={handleClear}
      />
    </div>
  );
}
