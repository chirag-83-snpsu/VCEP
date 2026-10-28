'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { ShieldCheck, AlertTriangle, FileCheck, CheckCircle2, ArrowRight, XCircle } from 'lucide-react';

const STORAGE_KEY = 'vcep:s11:drive-v3:student-workstation';

export type InvoiceAuditItem = {
  id: string;
  serial: string;
  pos: string;
  taxable: number;
  draftTax: string;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  status: 'Compliant' | 'Defect: Wrong Tax Type' | 'Defect: Missing Serial';
  auditNotes: string;
};

export type PurchaseMatchItem = {
  id: string;
  taxable: number;
  bookTax: number;
  statementTax: number | 'Not present';
  matched: boolean;
  action: 'Claim ITC' | 'Quarantine ITC & Escalate';
};

export type Session11State = {
  invoices: InvoiceAuditItem[];
  purchases: PurchaseMatchItem[];
  vendorNote: string;
  checkedIndices: number[];
  timestamp?: string;
};

const initialInvoices: InvoiceAuditItem[] = [
  {
    id: 'E01',
    serial: 'VL001',
    pos: 'Karnataka',
    taxable: 10000,
    draftTax: 'CGST 900; SGST 900',
    cgst: 900,
    sgst: 900,
    igst: 0,
    total: 11800,
    status: 'Compliant',
    auditNotes: 'Intra-state supply correctly charged at 9% CGST + 9% SGST.',
  },
  {
    id: 'E02',
    serial: 'VL002',
    pos: 'Tamil Nadu',
    taxable: 20000,
    draftTax: 'CGST 1800; SGST 1800',
    cgst: 0,
    sgst: 0,
    igst: 3600,
    total: 23600,
    status: 'Defect: Wrong Tax Type',
    auditNotes: 'Inter-state transaction (Place of Supply: Tamil Nadu). Reclassified from CGST/SGST to 18% IGST (₹3,600).',
  },
  {
    id: 'E03',
    serial: 'Missing (Unassigned)',
    pos: 'Karnataka',
    taxable: 5000,
    draftTax: 'CGST 450; SGST 450',
    cgst: 450,
    sgst: 450,
    igst: 0,
    total: 5900,
    status: 'Defect: Missing Serial',
    auditNotes: 'Missing mandatory tax invoice serial number. Under Rule 46 of CGST Rules, invoice cannot be dispatched.',
  },
];

const initialPurchases: PurchaseMatchItem[] = [
  { id: 'P01', taxable: 1000, bookTax: 180, statementTax: 180, matched: true, action: 'Claim ITC' },
  { id: 'P02', taxable: 2000, bookTax: 360, statementTax: 'Not present', matched: false, action: 'Quarantine ITC & Escalate' },
  { id: 'P03', taxable: 3000, bookTax: 540, statementTax: 540, matched: true, action: 'Claim ITC' },
];

export function Session11Workstation() {
  const [invoices, setInvoices] = useState<InvoiceAuditItem[]>(initialInvoices);
  const [purchases, setPurchases] = useState<PurchaseMatchItem[]>(initialPurchases);
  const [vendorNote, setVendorNote] = useState(
    'Subject: Urgent — Unmatched Invoice P02 missing from GSTR-2B Statement\n\nDear Vendor Accounts Team,\n\nOur month-end GST review indicates that purchase bill P02 (Taxable ₹2,000, Tax ₹360) is absent from our auto-drafted GSTR-2B statement. Please confirm whether this invoice was uploaded in your outward GSTR-1 return for the current filing period. Under GST regulations, we cannot claim ₹360 in Input Tax Credit until the invoice appears on the portal. Please provide the ARN reference by 15:00 tomorrow.'
  );
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.purchases) setPurchases(parsed.purchases);
        if (parsed.vendorNote) setVendorNote(parsed.vendorNote);
        if (parsed.checkedIndices) setCheckedIndices(parsed.checkedIndices);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (
    inv: InvoiceAuditItem[],
    pur: PurchaseMatchItem[],
    note: string,
    checks: number[]
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          invoices: inv,
          purchases: pur,
          vendorNote: note,
          checkedIndices: checks,
          timestamp,
        })
      );
    } catch {}
  };

  const handleToggleCheck = (index: number) => {
    const next = checkedIndices.includes(index)
      ? checkedIndices.filter((i) => i !== index)
      : [...checkedIndices, index];
    setCheckedIndices(next);
    saveState(invoices, purchases, vendorNote, next);
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setInvoices(initialInvoices);
    setPurchases(initialPurchases);
    setVendorNote('');
    setCheckedIndices([]);
    setDraftTimestamp('');
  };

  // Tax calculations
  const eligibleItc = purchases.filter((p) => p.matched).reduce((sum, p) => sum + p.bookTax, 0);
  const quarantinedItc = purchases.filter((p) => !p.matched).reduce((sum, p) => sum + p.bookTax, 0);

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'All 3 sales invoices audited with correct tax classifications; purchase register matched against GSTR-2B.' },
    { name: 'Reasoning', points: 2, evidence: 'Explains why E02 requires IGST instead of CGST/SGST and why claiming unmatched ITC on P02 is illegal.' },
    { name: 'Communication', points: 2, evidence: 'Clear vendor query email requesting GSTR-1 ARN confirmation with specific invoice and tax amounts.' },
    { name: 'Professional Process', points: 2, evidence: 'Quarantines unmatched tax credit without taking premature deductions on tax liabilities.' },
  ];

  const checklist = [
    'I audited sales invoice E01 and confirmed 9% CGST (₹900) + 9% SGST (₹900) for intra-state supply in Karnataka.',
    'I identified the tax type error on E02 (Place of Supply: Tamil Nadu) and reclassified it to 18% IGST (₹3,600).',
    'I flagged the compliance defect on E03 (missing mandatory invoice serial number).',
    'I matched purchase bills P01 and P03 to the inward portal statement (₹720 eligible ITC).',
    'I quarantined purchase bill P02 (₹360 tax credit) because it is absent from GSTR-2B.',
    'I drafted a formal vendor inquiry requesting proof of GSTR-1 filing before claiming credit.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · INTERACTIVE GST AUDIT WORKSTATION</span>
          <h3>Domestic GST Invoice Review & GSTR-2B Inward Matching</h3>
          <p>
            Case E Domestic Training Policy: Karnataka supplier baseline. Place of supply determines CGST+SGST vs IGST. Reconcile purchase ledger to auto-drafted inward portal records before claiming Input Tax Credit.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Intra-State vs Inter-State:</strong> Karnataka to Karnataka = 9% CGST + 9% SGST; Karnataka to Tamil Nadu = 18% IGST. Never charge both.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Mandatory Invoice Serial:</strong> An invoice without a sequential serial number cannot be legally issued under Rule 46 of CGST Rules.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>GSTR-2B Matching Rule:</strong> Paper invoice alone is not sufficient; tax credit can only be claimed if the supplier uploads the bill to the GST portal.
          </div>
        </div>
      </div>

      {/* 2. Sales Invoice Audit Table */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <FileCheck size={18} /> Sales Invoice Review & Reclassification Table
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.15)', textAlign: 'left', color: '#17245C' }}>
                  <th style={{ padding: '8px 10px' }}>ID</th>
                  <th style={{ padding: '8px 10px' }}>Serial #</th>
                  <th style={{ padding: '8px 10px' }}>Place of Supply</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Taxable (INR)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Draft Tax</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>CGST (9%)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>SGST (9%)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>IGST (18%)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Correct Total</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Audit Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>{inv.id}</td>
                    <td style={{ padding: '8px 10px', color: inv.serial.includes('Missing') ? '#b91c1c' : '#111827', fontWeight: inv.serial.includes('Missing') ? 700 : 400 }}>
                      {inv.serial}
                    </td>
                    <td style={{ padding: '8px 10px' }}>{inv.pos}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{inv.taxable.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontSize: '0.75rem', color: '#6b7280' }}>{inv.draftTax}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: inv.cgst > 0 ? '#111827' : '#9ca3af' }}>
                      {inv.cgst > 0 ? `₹${inv.cgst.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: inv.sgst > 0 ? '#111827' : '#9ca3af' }}>
                      {inv.sgst > 0 ? `₹${inv.sgst.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: inv.igst > 0 ? '#0F766E' : '#9ca3af', fontWeight: inv.igst > 0 ? 700 : 400 }}>
                      {inv.igst > 0 ? `₹${inv.igst.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#17245C' }}>
                      ₹{inv.total.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          background: inv.status === 'Compliant' ? '#dcfce7' : '#fee2e2',
                          color: inv.status === 'Compliant' ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Purchase Matching & GSTR-2B Reconciliation */}
      <div className="vcep-workstation-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Purchase Register Match Table */}
          <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
              <ShieldCheck size={18} /> Purchase Register vs Inward Statement (GSTR-2B)
            </h4>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.15)', textAlign: 'left', color: '#17245C' }}>
                    <th style={{ padding: '8px' }}>Purchase ID</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Book Tax</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Portal Tax</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <td style={{ padding: '8px', fontWeight: 600, color: '#17245C' }}>{p.id}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>₹{p.bookTax.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: p.matched ? '#111827' : '#b91c1c', fontWeight: p.matched ? 400 : 600 }}>
                        {p.matched ? `₹${Number(p.statementTax).toLocaleString('en-IN')}` : p.statementTax}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        {p.matched ? (
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontWeight: 600 }}>
                            Matched
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c', fontWeight: 600 }}>
                            Missing
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: p.matched ? '#15803d' : '#b45309' }}>
                        {p.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reconciliation Totals Banner */}
            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#6b7280' }}>Eligible ITC to Claim:</span>{' '}
                <strong style={{ color: '#15803d' }}>₹{eligibleItc.toLocaleString('en-IN')}</strong> (P01 + P03)
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>Quarantined Suspense:</span>{' '}
                <strong style={{ color: '#b91c1c' }}>₹{quarantinedItc.toLocaleString('en-IN')}</strong> (P02)
              </div>
            </div>
          </div>

          {/* Vendor Escalation Message */}
          <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 8px' }}>
              <AlertTriangle size={18} /> Vendor Escalation Message (Unmatched P02)
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 10px' }}>
              Draft an urgent query to the vendor requesting their GSTR-1 filing ARN to clear the ₹360 credit.
            </p>
            <textarea
              rows={7}
              value={vendorNote}
              onChange={(e) => {
                setVendorNote(e.target.value);
                saveState(invoices, purchases, e.target.value, checkedIndices);
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                lineHeight: 1.4,
              }}
            />
          </div>
        </div>
      </div>

      {/* 4. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={11}
          sessionTitle="GST and Invoice Review"
          deliverableName="Invoice Audit Report & GSTR-2B Matching Schedule"
          rubric={rubric}
          checklistItems={checklist}
          checkedIndices={checkedIndices}
          onToggleChecklist={handleToggleCheck}
          draftTimestamp={draftTimestamp}
          onClearDraft={handleReset}
        />
      </div>
    </div>
  );
}
