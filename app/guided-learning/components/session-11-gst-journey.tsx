'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  S11_STORAGE_KEY,
  CASE_E_SALES_INVOICES,
  CASE_E_PURCHASES,
  CARDINAL_INVOICE_RULES,
  loadSession11State,
  saveSession11State,
  clearSession11State,
  INITIAL_S11_STATE,
  S11_RUBRIC,
  S11_CHECKLIST,
  type Session11WorkstationState,
  type SalesInvoiceEvidence,
  type PurchaseRegisterItem,
} from './session-11-gst-data.ts';
import { evaluateSession11 } from '../../../lib/review-engine/session-rules/session-11.ts';
import type { SessionReviewReport } from '../../../lib/review-engine/types.ts';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Building,
  MapPin,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckSquare,
  AlertOctagon,
  Eye,
  Info,
  Clock,
  Send,
  Layers,
  Calculator,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Session11GSTJourneyProps {
  onUpdateDraft?: (key: string, value: string) => void;
}

interface TaskCardProps {
  taskId: string;
  taskNumber: string;
  title: string;
  instruction: string;
  learningTakeaway?: string;
  whyMatters?: string;
  statusText?: string;
  isActive?: boolean;
  onSelectTask?: () => void;
  children: React.ReactNode;
}

/**
 * Unified Premium TaskCard Component
 * Implements the VCEP single-task bordered card pattern.
 * Neutral 1px #DCE5E9 border, 16px radius, 3px teal left accent on active task.
 */
function TaskCard({
  taskId,
  taskNumber,
  title,
  instruction,
  learningTakeaway,
  whyMatters,
  statusText,
  isActive,
  onSelectTask,
  children,
}: TaskCardProps) {
  const [whyOpen, setWhyOpen] = useState(false);

  return (
    <article
      id={taskId.toLowerCase()}
      data-task-id={taskId}
      onClick={onSelectTask}
      tabIndex={0}
      aria-label={`${taskNumber}: ${title}`}
      style={{
        display: isActive ? 'block' : 'none',
        background: '#ffffff',
        border: '1px solid #DCE5E9',
        borderLeft: isActive ? '3px solid #0F766E' : '1px solid #DCE5E9',
        borderRadius: '16px',
        padding: 'clamp(18px, 2.5vw, 24px)',
        marginBottom: '20px',
        boxShadow: isActive ? '0 4px 16px rgba(15, 118, 110, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        outline: 'none',
      }}
    >
      {/* 1-Line Teaching Takeaway Banner */}
      {learningTakeaway && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f0fdfa',
            border: '1px solid #ccfbf1',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '16px',
            fontSize: '12px',
            color: '#0f766e',
            fontWeight: 600,
          }}
        >
          <Sparkles size={15} color="#0f766e" style={{ flexShrink: 0 }} />
          <span>💡 <strong>What you&apos;ll learn:</strong> {learningTakeaway}</span>
        </div>
      )}

      {/* Task Card Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '10px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#0F766E',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {taskNumber}
            </span>
            <span style={{ color: '#cbd5e1' }}>·</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
              Ref: {taskId}
            </span>
          </div>
          <h3
            style={{
              fontSize: 'clamp(17px, 2vw, 20px)',
              fontWeight: 800,
              color: '#17245C',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
        </div>

        {statusText && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '11.5px',
              color: '#0F766E',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={13} />
            <span>{statusText}</span>
          </div>
        )}
      </div>

      {/* Task Instruction (1-2 sentences) */}
      <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 14px', lineHeight: 1.55 }}>
        {instruction}
      </p>

      {/* Accessible Collapsible Why This Matters */}
      {whyMatters && (
        <div style={{ marginBottom: '18px' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setWhyOpen(!whyOpen);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#0F766E',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <HelpCircle size={13} />
            <span>{whyOpen ? 'Hide statutory principle' : 'Why this matters'}</span>
            {whyOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {whyOpen && (
            <div
              style={{
                marginTop: '10px',
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '8px',
                borderLeft: '3px solid #0F766E',
                fontSize: '12.5px',
                color: '#334155',
                lineHeight: 1.6,
              }}
            >
              {whyMatters}
            </div>
          )}
        </div>
      )}

      <div>{children}</div>
    </article>
  );
}

export function Session11GSTJourney({ onUpdateDraft }: Session11GSTJourneyProps) {
  const [state, setState] = useState<Session11WorkstationState>(INITIAL_S11_STATE);
  const [reviewReport, setReviewReport] = useState<SessionReviewReport | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string>('S11-T01');

  const WIZARD_STEPS = [
    { id: 'S11-T01' as const, num: 1, label: 'TASK 01: Inspect the Invoices', short: '1. Invoices' },
    { id: 'S11-T02' as const, num: 2, label: 'TASK 02: Verify Tax Calculations', short: '2. Tax' },
    { id: 'S11-T03' as const, num: 3, label: 'TASK 03: Match Purchase Records', short: '3. Purchases' },
    { id: 'S11-T04' as const, num: 4, label: 'TASK 04: Report Exceptions', short: '4. Exceptions' },
  ];

  const currentStepIdx = useMemo(() => {
    return Math.max(0, WIZARD_STEPS.findIndex((s) => s.id === activeTaskId));
  }, [activeTaskId]);

  // Hydrate on mount
  useEffect(() => {
    const loaded = loadSession11State();
    setState(loaded);
    if (onUpdateDraft) {
      onUpdateDraft('concept:explain', loaded.vendorEscalationMemo);
      onUpdateDraft('team:contribution', loaded.mentorQueryNote);
      onUpdateDraft('team:judgement', loaded.governance.decisionOwner);
    }
  }, []);

  // Update state helper with auto-persistence and draft sync
  const updateState = (updater: (prev: Session11WorkstationState) => Session11WorkstationState) => {
    setState((prev) => {
      const next = updater(prev);
      saveSession11State(next);
      if (onUpdateDraft) {
        onUpdateDraft('concept:explain', next.vendorEscalationMemo);
        onUpdateDraft('team:contribution', next.mentorQueryNote);
        onUpdateDraft('team:judgement', next.governance.decisionOwner);
      }
      return next;
    });
  };

  const handleSelectInvoiceTab = (tabId: string) => {
    updateState((prev) => ({ ...prev, selectedInvoiceTab: tabId }));
  };

  const handleToggleInvoiceAuditCheck = (
    invoiceId: string,
    field: 'checkedSerial' | 'checkedPos' | 'checkedTaxType' | 'checkedValue'
  ) => {
    updateState((prev) => {
      const current = prev.invoiceAudits[invoiceId] || {
        checkedSerial: false,
        checkedPos: false,
        checkedTaxType: false,
        checkedValue: false,
        studentStatus: 'Compliant',
        studentNotes: '',
      };
      return {
        ...prev,
        invoiceAudits: {
          ...prev.invoiceAudits,
          [invoiceId]: {
            ...current,
            [field]: !current[field],
          },
        },
      };
    });
  };

  const handleUpdateInvoiceStatus = (
    invoiceId: string,
    status: 'Compliant' | 'Defect: Wrong Tax Type' | 'Defect: Missing Serial'
  ) => {
    updateState((prev) => {
      const current = prev.invoiceAudits[invoiceId] || {
        checkedSerial: false,
        checkedPos: false,
        checkedTaxType: false,
        checkedValue: false,
        studentStatus: status,
        studentNotes: '',
      };
      return {
        ...prev,
        invoiceAudits: {
          ...prev.invoiceAudits,
          [invoiceId]: {
            ...current,
            studentStatus: status,
          },
        },
      };
    });
  };

  const handleUpdateInvoiceNotes = (invoiceId: string, notes: string) => {
    updateState((prev) => {
      const current = prev.invoiceAudits[invoiceId] || {
        checkedSerial: false,
        checkedPos: false,
        checkedTaxType: false,
        checkedValue: false,
        studentStatus: 'Compliant',
        studentNotes: '',
      };
      return {
        ...prev,
        invoiceAudits: {
          ...prev.invoiceAudits,
          [invoiceId]: {
            ...current,
            studentNotes: notes,
          },
        },
      };
    });
  };

  const handleUpdatePurchaseAudit = (
    purchaseId: string,
    field: 'reconciliationStatus' | 'itcAction' | 'studentNotes',
    val: any
  ) => {
    updateState((prev) => {
      const current = prev.purchaseAudits[purchaseId] || {
        reconciliationStatus: 'Matched',
        itcAction: 'Eligible for Verification',
        studentNotes: '',
      };
      return {
        ...prev,
        purchaseAudits: {
          ...prev.purchaseAudits,
          [purchaseId]: {
            ...current,
            [field]: val,
          },
        },
      };
    });
  };

  const handleToggleCheck = (index: number) => {
    updateState((prev) => {
      const nextChecked = prev.checkedIndices.includes(index)
        ? prev.checkedIndices.filter((i) => i !== index)
        : [...prev.checkedIndices, index];
      return { ...prev, checkedIndices: nextChecked };
    });
  };

  const handleReset = () => {
    clearSession11State();
    setState(INITIAL_S11_STATE);
    setReviewReport(null);
  };

  const handleRunReview = () => {
    const report = evaluateSession11({
      sessionId: 11,
      draft: {
        'concept:explain': state.vendorEscalationMemo,
        'team:contribution': state.mentorQueryNote,
        'team:judgement': state.governance.decisionOwner,
      },
      workstationData: state,
    });
    setReviewReport(report);
  };

  // Selected Invoice object
  const activeInvoice = useMemo(() => {
    return (
      CASE_E_SALES_INVOICES.find((inv) => inv.id === state.selectedInvoiceTab) ||
      CASE_E_SALES_INVOICES[0]
    );
  }, [state.selectedInvoiceTab]);

  const activeAudit = state.invoiceAudits[activeInvoice.id] || {
    checkedSerial: true,
    checkedPos: true,
    checkedTaxType: true,
    checkedValue: true,
    studentStatus: 'Compliant',
    studentNotes: '',
  };

  // Memo Word Count
  const memoWords = (state.vendorEscalationMemo || '').trim().split(/\s+/).filter(Boolean);
  const memoWordCount = memoWords.length;

  // Purchase summary metrics
  const totalBookPurchaseTax = CASE_E_PURCHASES.reduce((sum, p) => sum + p.bookTax, 0); // ₹1,080
  const verifiedMatchedTax = CASE_E_PURCHASES.filter(
    (p) => state.purchaseAudits[p.id]?.reconciliationStatus === 'Matched'
  ).reduce((sum, p) => sum + p.bookTax, 0); // ₹720
  const quarantinedTax = CASE_E_PURCHASES.filter(
    (p) => state.purchaseAudits[p.id]?.reconciliationStatus !== 'Matched'
  ).reduce((sum, p) => sum + p.bookTax, 0); // ₹360

  return (
    <div className="vcep-session-clean-journey">
      {/* Sticky Horizontal Stepper */}
      <nav
        aria-label="Session Tasks Stepper"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 25,
          background: '#ffffff',
          borderRadius: '12px',
          padding: '8px 12px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          gap: '6px',
        }}
      >
        {WIZARD_STEPS.map((step) => {
          const isActive = activeTaskId === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveTaskId(step.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0f766e' : '#475569',
                background: isActive ? '#f0fdfa' : 'transparent',
                border: isActive ? '1px solid #99f6e4' : '1px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: isActive ? '#0f766e' : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#475569',
                  fontSize: '10px',
                  fontWeight: 700,
                }}
              >
                {step.num}
              </span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </nav>
      {/* =========================================================================
          HEADING 1: INSPECT THE INVOICE EVIDENCE (#vcep-area-invoices)
         ========================================================================= */}
      <div id="vcep-area-invoices" className="vcep-journey-stage-block">
        <div className="vcep-journey-section-header">
          <div className="vcep-journey-badge-row">
            <span className="vcep-pill-navy">WORK AREA 01</span>
            <span className="vcep-pill-teal">AUTHENTIC INVOICE EVIDENCE</span>
            <span className="vcep-pill-gold">STATUTORY GATEKEEPER</span>
          </div>
          <h2 className="vcep-journey-title">1. Inspect the Invoice Evidence</h2>
          <p className="vcep-journey-subtitle">
            Act as Junior Tax Accountant for a Karnataka-based corporate enterprise. Inspect the three original Case E sales invoices before authorizing posting or dispatch. Check serial numbering, supplier location, place of supply, and tax heads.
          </p>
        </div>

        {/* TASK 01: Inspect the Invoices */}
        <TaskCard
          taskId="S11-T01"
          taskNumber="TASK 01"
          title="Inspect the Invoices"
          instruction="Review three sales invoices to check sequential numbering, supplier locations, and place of supply."
          learningTakeaway="Valid GST invoices require uninterrupted serial numbers, correct place of supply, and proper GSTINs."
          whyMatters="Under Section 31 and Rule 46 of the CGST Rules, an invoice is a legally binding tax document. Approving invoices with missing serial numbers or incorrect place-of-supply classifications creates statutory liabilities and blocks client input credit."
          statusText={`${activeInvoice.id} Audited (${activeAudit.studentStatus})`}
          isActive={activeTaskId === 'S11-T01'}
          onSelectTask={() => setActiveTaskId('S11-T01')}
        >
          {/* 4 Cardinal Invoice Review Rules Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {CARDINAL_INVOICE_RULES.map((rule) => (
              <div
                key={rule.ruleNum}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: '#f1f5f9',
                      color: rule.accentColor,
                    }}
                  >
                    RULE {rule.ruleNum}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748B' }}>
                    {rule.badge}
                  </span>
                </div>
                <strong style={{ fontSize: '0.92rem', color: '#17245C' }}>{rule.title}</strong>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                  {rule.description}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Invoice Selector Tabs */}
          <div className="vcep-clean-rules-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="vcep-eyebrow">CASE E SALES INVOICE VIEWER</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Select Sales Invoice Document to Inspect
                </h4>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {CASE_E_SALES_INVOICES.map((inv) => {
                  const isSelected = state.selectedInvoiceTab === inv.id;
                  const audit = state.invoiceAudits[inv.id];
                  const status = audit?.studentStatus || inv.complianceStatus;
                  const isCompliant = status === 'Compliant';

                  return (
                    <button
                      key={inv.id}
                      type="button"
                      onClick={() => handleSelectInvoiceTab(inv.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #0F766E' : '1px solid #cbd5e1',
                        background: isSelected ? '#F0FDFA' : '#ffffff',
                        color: isSelected ? '#0F766E' : '#334155',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{inv.id}</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>({inv.invoiceSerial})</span>
                      {isCompliant ? (
                        <CheckCircle2 size={14} color="#15803d" />
                      ) : (
                        <AlertTriangle size={14} color="#b91c1c" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Authentic Rendered Tax Invoice Document */}
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                marginBottom: '20px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {/* Invoice Top Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #17245C', paddingBottom: '14px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F766E', letterSpacing: '0.08em' }}>
                    DOMESTIC TAX INVOICE · SECTION 31 CGST ACT
                  </span>
                  <h3 style={{ margin: '2px 0 0', fontSize: '1.25rem', color: '#17245C', fontWeight: 800 }}>
                    VAYENTRA COMMERCE LABS PVT LTD
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>
                    Registered Office: MG Road, Bengaluru, Karnataka — 560001
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#17245C', fontWeight: 600 }}>
                    Supplier Location: <span style={{ color: '#0F766E' }}>Karnataka (State Code 29)</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-block', padding: '4px 10px', background: activeInvoice.invoiceSerial === 'Missing' ? '#fee2e2' : '#f1f5f9', borderRadius: '6px', border: activeInvoice.invoiceSerial === 'Missing' ? '1px solid #ef4444' : '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', textTransform: 'uppercase' }}>Invoice Serial Number</span>
                    <strong style={{ fontSize: '1.05rem', color: activeInvoice.invoiceSerial === 'Missing' ? '#b91c1c' : '#17245C' }}>
                      {activeInvoice.invoiceSerial === 'Missing' ? '⚠️ MISSING (RULE 46 DEFECT)' : activeInvoice.invoiceSerial}
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '6px' }}>
                    Date of Invoice: <strong>{activeInvoice.invoiceDate}</strong>
                  </div>
                </div>
              </div>

              {/* Bill To & Place of Supply Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', background: '#F8FAFC', padding: '14px', borderRadius: '6px', marginBottom: '18px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>
                    Billed To (Customer Details):
                  </span>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#17245C', marginTop: '2px' }}>
                    {activeInvoice.customerName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                    Destination Address: {activeInvoice.placeOfSupply}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>
                    Statutory Place of Supply (POS):
                  </span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: activeInvoice.placeOfSupply === 'Tamil Nadu' ? '#0369a1' : '#0F766E', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} />
                    {activeInvoice.placeOfSupply} ({activeInvoice.placeOfSupply === 'Karnataka' ? 'Intra-State Supply' : 'Inter-State Supply'})
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>
                    {activeInvoice.placeOfSupply === 'Karnataka'
                      ? 'Same State as Supplier → Subject to 9% CGST + 9% SGST'
                      : 'Different State from Supplier → Subject to 18% IGST'}
                  </div>
                </div>
              </div>

              {/* Invoice Line Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#17245C', color: '#ffffff' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Item Description</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>HSN/SAC</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Qty</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Unit Rate (₹)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Taxable Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInvoice.lineItems.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 12px', color: '#1E293B', fontWeight: 500 }}>{item.description}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'monospace', color: '#475569' }}>{activeInvoice.hsnCode}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>{item.qty}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{item.unitPrice.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#17245C' }}>
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Draft Tax in Records vs Statutory Required Tax Comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', borderTop: '2px solid #e2e8f0', paddingTop: '14px' }}>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#991b1b', fontWeight: 800 }}>
                    Draft Invoice Tax in Current Billing File:
                  </span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#b91c1c', margin: '4px 0' }}>
                    {activeInvoice.draftTaxInRecords}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#7f1d1d' }}>
                    {activeInvoice.id === 'E02'
                      ? '⚠️ CRITICAL ERROR: Billed as CGST/SGST, but customer POS is Tamil Nadu (requires IGST)!'
                      : activeInvoice.id === 'E03'
                      ? '⚠️ RULE 46 BREACH: Tax amounts are calculated, but mandatory serial is missing!'
                      : '✓ Draft matches statutory intra-state requirements.'}
                  </div>
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#166534', fontWeight: 800 }}>
                    Statutory Approved Tax Heads & Correct Total:
                  </span>
                  <div style={{ fontSize: '0.85rem', color: '#14532d', margin: '4px 0' }}>
                    {activeInvoice.placeOfSupply === 'Karnataka' ? (
                      <>
                        CGST @ 9%: <strong>₹{activeInvoice.cgstAmount.toLocaleString('en-IN')}</strong> | SGST @ 9%: <strong>₹{activeInvoice.sgstAmount.toLocaleString('en-IN')}</strong>
                      </>
                    ) : (
                      <>
                        IGST @ 18%: <strong>₹{activeInvoice.igstAmount.toLocaleString('en-IN')}</strong> (No CGST/SGST)
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>
                    Correct Gross Total: ₹{activeInvoice.totalInvoiceAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Gatekeeper Audit Decision Card */}
            <div style={{ background: '#F8FAFC', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '18px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: '#17245C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={18} color="#0F766E" /> Gatekeeper Audit Checklist for {activeInvoice.id}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={activeAudit.checkedSerial}
                    onChange={() => handleToggleInvoiceAuditCheck(activeInvoice.id, 'checkedSerial')}
                    style={{ accentColor: '#17245C', width: '16px', height: '16px' }}
                  />
                  <span>Mandatory Serial Number Present</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={activeAudit.checkedPos}
                    onChange={() => handleToggleInvoiceAuditCheck(activeInvoice.id, 'checkedPos')}
                    style={{ accentColor: '#17245C', width: '16px', height: '16px' }}
                  />
                  <span>Place of Supply Verified ({activeInvoice.placeOfSupply})</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={activeAudit.checkedTaxType}
                    onChange={() => handleToggleInvoiceAuditCheck(activeInvoice.id, 'checkedTaxType')}
                    style={{ accentColor: '#17245C', width: '16px', height: '16px' }}
                  />
                  <span>Tax Heads Assigned (CGST+SGST vs IGST)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={activeAudit.checkedValue}
                    onChange={() => handleToggleInvoiceAuditCheck(activeInvoice.id, 'checkedValue')}
                    style={{ accentColor: '#17245C', width: '16px', height: '16px' }}
                  />
                  <span>Taxable Value Verified (₹{activeInvoice.taxableAmount.toLocaleString('en-IN')})</span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Auditor Compliance Verdict:
                  </label>
                  <select
                    value={activeAudit.studentStatus}
                    onChange={(e) => handleUpdateInvoiceStatus(activeInvoice.id, e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: '#ffffff',
                      color: activeAudit.studentStatus === 'Compliant' ? '#15803d' : '#b91c1c',
                    }}
                  >
                    <option value="Compliant">Compliant — Approve for Posting & Dispatch</option>
                    <option value="Defect: Wrong Tax Type">Defect: Wrong Tax Type (Reclassify to IGST)</option>
                    <option value="Defect: Missing Serial">Defect: Missing Serial (Hold under Rule 46)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Required Action / Audit Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={activeAudit.studentNotes}
                    onChange={(e) => handleUpdateInvoiceNotes(activeInvoice.id, e.target.value)}
                    placeholder="Record defect summary and required action..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </TaskCard>
      </div>

      {/* =========================================================================
          HEADING 2: VERIFY TAX & EXCEPTIONS (#vcep-area-tax)
         ========================================================================= */}
      <div id="vcep-area-tax" className="vcep-journey-stage-block">
        <div className="vcep-journey-section-header">
          <div className="vcep-journey-badge-row">
            <span className="vcep-pill-navy">WORK AREA 02</span>
            <span className="vcep-pill-teal">TAX COMPUTATION & RECONCILIATION</span>
            <span className="vcep-pill-gold">PORTAL MATCHING</span>
          </div>
          <h2 className="vcep-journey-title">2. Verify Tax & Exceptions</h2>
          <p className="vcep-journey-subtitle">
            Compile the complete sales tax schedule, reconcile purchase bills P01–P03 against the government GSTR-2B inward statement, and quarantine unmatched tax credit with an actionable vendor inquiry.
          </p>
        </div>

        {/* TASK 02: Verify Tax Calculations */}
        <TaskCard
          taskId="S11-T02"
          taskNumber="TASK 02"
          title="Verify Tax Calculations"
          instruction="Verify tax schedules across intra-state (9% CGST + 9% SGST) and inter-state (18% IGST) supplies."
          learningTakeaway="Intra-state sales split equally into CGST/SGST, while inter-state sales use IGST."
          whyMatters="Tax heads are legally non-interchangeable: CGST and SGST cannot offset IGST errors on outward billing. Ensuring correct 9%+9% intra-state vs 18% inter-state allocation protects the enterprise from tax re-assessment."
          statusText="Output Tax: ₹6,300 · Gross: ₹41,300"
          isActive={activeTaskId === 'S11-T02'}
          onSelectTask={() => setActiveTaskId('S11-T02')}
        >
          {/* Master Sales Tax Computation Schedule */}
          <div className="vcep-clean-rules-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="vcep-eyebrow">STATUTORY SCHEDULE</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Case E Master Sales Tax Computation Schedule
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 700 }}>
                18% Domestic Teaching Policy
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#17245C', color: '#ffffff' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Invoice ID</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Serial No.</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Place of Supply</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Taxable INR</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>CGST 9%</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>SGST 9%</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>IGST 18%</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total INR</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {CASE_E_SALES_INVOICES.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#17245C' }}>{inv.id}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: inv.invoiceSerial === 'Missing' ? '#b91c1c' : '#334155' }}>
                        {inv.invoiceSerial}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#334155' }}>
                        <span style={{ fontWeight: 600 }}>{inv.placeOfSupply}</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>
                          {inv.placeOfSupply === 'Karnataka' ? 'Intra-State' : 'Inter-State'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                        ₹{inv.taxableAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: inv.cgstAmount > 0 ? '#15803d' : '#94a3b8' }}>
                        ₹{inv.cgstAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: inv.sgstAmount > 0 ? '#15803d' : '#94a3b8' }}>
                        ₹{inv.sgstAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: inv.igstAmount > 0 ? '#0369a1' : '#94a3b8', fontWeight: inv.igstAmount > 0 ? 700 : 400 }}>
                        ₹{inv.igstAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#17245C' }}>
                        ₹{inv.totalInvoiceAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            background: inv.complianceStatus === 'Compliant' ? '#dcfce7' : '#fee2e2',
                            color: inv.complianceStatus === 'Compliant' ? '#15803d' : '#b91c1c',
                          }}
                        >
                          {inv.complianceStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#F1F5F9', borderTop: '2px solid #17245C', fontWeight: 800 }}>
                    <td colSpan={3} style={{ padding: '10px 12px', color: '#17245C' }}>TOTAL STATUTORY SALES LIABILITY:</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#17245C' }}>₹35,000</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#15803d' }}>₹1,350</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#15803d' }}>₹1,350</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0369a1' }}>₹3,600</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#17245C', fontSize: '0.95rem' }}>₹41,300</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.72rem', color: '#64748B' }}>
                      Output Tax: ₹6,300
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </TaskCard>

        {/* TASK 03: Match Purchase Records */}
        <TaskCard
          taskId="S11-T03"
          taskNumber="TASK 03"
          title="Match Purchase Records"
          instruction="Reconcile purchase register records against auto-drafted GSTR-2B and isolate missing input tax credits."
          learningTakeaway="Only claim input tax credit (ITC) when vendor invoices appear in your official GSTR-2B."
          whyMatters="Under Section 16(2)(aa) of the CGST Act, possessing a paper tax invoice does not permit claiming Input Tax Credit unless the supplier has uploaded the invoice to the government portal. Quarantining unmatched items prevents interest and penalty exposure."
          statusText={`Matched: ₹${verifiedMatchedTax} · Quarantined: ₹${quarantinedTax}`}
          isActive={activeTaskId === 'S11-T03'}
          onSelectTask={() => setActiveTaskId('S11-T03')}
        >
          {/* Purchase Register vs GSTR-2B Inward Statement Reconciliation */}
          <div className="vcep-clean-rules-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="vcep-eyebrow">PROCUREMENT TAX RECONCILIATION</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Purchase Register vs GSTR-2B Auto-Drafted Inward Statement
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 700 }}>
                Do Not Auto-Grant ITC Without Portal Presence
              </span>
            </div>

            {/* Quick KPI Stat Banners */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Total Book Purchase Tax:</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17245C' }}>₹{totalBookPurchaseTax.toLocaleString('en-IN')}</div>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>3 Purchase Invoices</span>
              </div>

              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: '0.72rem', color: '#166534' }}>Verified Matched ITC (GSTR-2B):</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#15803d' }}>₹{verifiedMatchedTax.toLocaleString('en-IN')}</div>
                <span style={{ fontSize: '0.7rem', color: '#15803d' }}>P01 (₹180) + P03 (₹540)</span>
              </div>

              <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '0.72rem', color: '#991b1b' }}>Quarantined Tax Credit (Hold):</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#b91c1c' }}>₹{quarantinedTax.toLocaleString('en-IN')}</div>
                <span style={{ fontSize: '0.7rem', color: '#b91c1c' }}>P02 Absent from Portal</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#0F766E', color: '#ffffff' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Purchase ID</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Vendor Bill No.</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Supplier Name</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Taxable INR</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Book Tax INR</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>GSTR-2B Statement Tax</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Reconciliation Verdict</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>ITC Action</th>
                  </tr>
                </thead>
                <tbody>
                  {CASE_E_PURCHASES.map((p) => {
                    const audit = state.purchaseAudits[p.id] || {
                      reconciliationStatus: p.reconciliationStatus,
                      itcAction: p.itcAction,
                      studentNotes: '',
                    };
                    const isMatched = audit.reconciliationStatus === 'Matched';

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#17245C' }}>{p.id}</td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{p.vendorBillNo}</td>
                        <td style={{ padding: '10px 12px' }}>{p.supplierName}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                          ₹{p.taxableAmount.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#17245C' }}>
                          ₹{p.bookTax.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: isMatched ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
                          {p.statementTax === 'Not present' ? 'Not present (0)' : `₹${p.statementTax.toLocaleString('en-IN')}`}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <select
                            value={audit.reconciliationStatus}
                            onChange={(e) => handleUpdatePurchaseAudit(p.id, 'reconciliationStatus', e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              background: isMatched ? '#dcfce7' : '#fee2e2',
                              color: isMatched ? '#15803d' : '#b91c1c',
                              border: '1px solid #cbd5e1',
                            }}
                          >
                            <option value="Matched">Matched</option>
                            <option value="Unmatched / Exception">Unmatched / Exception</option>
                          </select>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <select
                            value={audit.itcAction}
                            onChange={(e) => handleUpdatePurchaseAudit(p.id, 'itcAction', e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              background: audit.itcAction === 'Eligible for Verification' ? '#e0f2fe' : '#fef3c7',
                              color: audit.itcAction === 'Eligible for Verification' ? '#0369a1' : '#92400e',
                              border: '1px solid #cbd5e1',
                            }}
                          >
                            <option value="Eligible for Verification">Eligible for Verification</option>
                            <option value="Quarantine ITC & Escalate">Quarantine ITC & Escalate</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TaskCard>

        {/* TASK 04: Report Exceptions */}
        <TaskCard
          taskId="S11-T04"
          taskNumber="TASK 04"
          title="Report Exceptions"
          instruction="Document invoice defects, draft vendor inquiry for GSTR-1 proof, and submit mentor briefing."
          learningTakeaway="Isolate non-compliant tax items quickly and request vendor ARN proof before filing returns."
          whyMatters="Unresolved reconciliation gaps must be formally escalated with traceable invoice IDs and deadlines. Professional governance requires segregating unverified tax credits and obtaining senior mentor sign-off before period close."
          statusText={`Vendor Inquiry (${memoWordCount} words) · ${state.governance.fileVersion}`}
          isActive={activeTaskId === 'S11-T04'}
          onSelectTask={() => setActiveTaskId('S11-T04')}
        >
          {/* Part A: Invoice Exception Report Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertTriangle size={18} color="#b45309" />
                <strong style={{ fontSize: '0.92rem', color: '#92400e' }}>Invoice E02 Exception (Wrong Tax Type)</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#78350f', lineHeight: 1.45 }}>
                <strong>Issue:</strong> Draft billing file charged ₹1,800 CGST + ₹1,800 SGST on a supply to Tamil Nadu.<br />
                <strong>Rectification:</strong> Place of supply outside Karnataka mandates 18% Integrated GST (₹3,600). Eliminates ₹3,600 tax classification error.
              </p>
            </div>

            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertOctagon size={18} color="#b91c1c" />
                <strong style={{ fontSize: '0.92rem', color: '#991b1b' }}>Invoice E03 Exception (Missing Serial Number)</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#7f1d1d', lineHeight: 1.45 }}>
                <strong>Issue:</strong> Draft invoice lacks a mandatory consecutive serial number under Rule 46 of CGST Rules.<br />
                <strong>Rectification:</strong> Withhold physical dispatch. Assign next serial in sequence (VL003) before client receipt.
              </p>
            </div>
          </div>

          {/* Part B: Vendor Inquiry & Mentor Escalation Communication */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Vendor Inquiry Email */}
            <div className="vcep-clean-rules-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#17245C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={16} color="#0F766E" /> Vendor Inquiry Memo (P02 Quarantine)
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {memoWordCount} words
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 10px' }}>
                Draft a formal notice to vendor Kaveri Server Hardware Works regarding missing bill VND-TN-9041 and request GSTR-1 ARN reference.
              </p>
              <textarea
                rows={8}
                value={state.vendorEscalationMemo}
                onChange={(e) => updateState((prev) => ({ ...prev, vendorEscalationMemo: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  lineHeight: 1.45,
                }}
              />
            </div>

            {/* Mentor Escalation Note */}
            <div className="vcep-clean-rules-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#17245C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={16} color="#E5AF2E" /> Senior Accounting Mentor Briefing
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Internal Audit Note</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 10px' }}>
                Document your professional reasoning for the mentor: E02 tax head correction, E03 dispatch hold, and P02 credit quarantine.
              </p>
              <textarea
                rows={8}
                value={state.mentorQueryNote}
                onChange={(e) => updateState((prev) => ({ ...prev, mentorQueryNote: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  lineHeight: 1.45,
                }}
              />
            </div>
          </div>

          {/* Part C: Deliverable Handover, Rubric & Formative Review */}
          <div className="vcep-clean-rules-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="vcep-eyebrow">PORTFOLIO HANDOVER & RUBRIC GOVERNANCE</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#17245C' }}>
                  Session 11 Deliverable Submission & Verification
                </h4>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleRunReview}
                  style={{
                    background: '#17245C',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles size={14} /> Run Formative Review
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    background: '#ffffff',
                    color: '#64748B',
                    border: '1px solid #cbd5e1',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '18px', background: '#F8FAFC', padding: '14px', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Deliverable File Name:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#17245C', fontFamily: 'monospace' }}>
                  {state.governance.fileVersion}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Tax Preparer:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
                  {state.governance.taxPreparer}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Senior Reviewer:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
                  {state.governance.taxReviewer}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Decision Owner:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
                  {state.governance.decisionOwner}
                </div>
              </div>
            </div>

            {/* Interactive Checklist */}
            <div style={{ marginBottom: '18px' }}>
              <h5 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#17245C' }}>
                Statutory Quality Checklist (Confirm before submission):
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                {S11_CHECKLIST.map((item, idx) => {
                  const isChecked = state.checkedIndices.includes(idx);
                  return (
                    <label
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '0.78rem',
                        color: isChecked ? '#17245C' : '#64748B',
                        background: isChecked ? '#F0FDFA' : '#ffffff',
                        border: isChecked ? '1px solid #99F6E4' : '1px solid #e2e8f0',
                        padding: '10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCheck(idx)}
                        style={{ accentColor: '#0F766E', marginTop: '2px' }}
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 10-Point Rubric Breakdown */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>
                Authorized 10-Point Formative Rubric
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '8px' }}>
                {S11_RUBRIC.map((r, i) => (
                  <div key={i} style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.82rem', color: '#17245C' }}>{r.name}</strong>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F766E' }}>{r.points} Marks</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35 }}>{r.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TaskCard>
      </div>

      {/* Review Report Drawer / Modal */}
      {reviewReport && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="vcep-eyebrow">AUTOMATIC FORMATIVE EVALUATOR</span>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', color: '#17245C' }}>
                  Session 11 GST Audit Evaluation Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewReport(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: reviewReport.hasErrors ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${reviewReport.hasErrors ? '#fecaca' : '#bbf7d0'}`,
                marginBottom: '16px',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: reviewReport.hasErrors ? '#b91c1c' : '#15803d' }}>
                Status: {reviewReport.overallStatus.toUpperCase()} ({reviewReport.passedChecks} of {reviewReport.totalChecks} Checks Passed)
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: reviewReport.hasErrors ? '#7f1d1d' : '#14532d' }}>
                {reviewReport.overallSummary}
              </p>
            </div>

            {/* Stage Checklists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {Object.entries(reviewReport.stages).map(([stageName, stageData]) => (
                <div key={stageName} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#17245C' }}>{stageName} · {stageData.title}</strong>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: stageData.status === 'reviewed' ? '#dcfce7' : '#fee2e2',
                        color: stageData.status === 'reviewed' ? '#15803d' : '#b91c1c',
                        fontWeight: 700,
                      }}
                    >
                      {stageData.passedCount} / {stageData.totalCount} Passed
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {stageData.checks.map((chk) => (
                      <div
                        key={chk.id}
                        style={{
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px',
                          color: chk.passed ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {chk.passed ? <CheckCircle2 size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> : <AlertTriangle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />}
                        <div>
                          <strong>{chk.title}:</strong> {chk.description}
                          {chk.studentValue && (
                            <span style={{ display: 'block', color: '#64748B', fontSize: '0.72rem' }}>
                              Recorded: {chk.studentValue}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setReviewReport(null)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: '#17245C',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Close Evaluation Report
            </button>
          </div>
        </div>
      )}

      {/* Sticky Footer Navigation Bar */}
      <footer
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 20,
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '12px 16px',
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.03)',
          borderRadius: '0 0 16px 16px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            const prevIdx = Math.max(0, currentStepIdx - 1);
            setActiveTaskId(WIZARD_STEPS[prevIdx].id);
          }}
          disabled={currentStepIdx === 0}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: currentStepIdx === 0 ? '#f1f5f9' : '#ffffff',
            color: currentStepIdx === 0 ? '#94a3b8' : '#334155',
            fontSize: '13px',
            fontWeight: 600,
            cursor: currentStepIdx === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          &larr; Previous
        </button>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
          Step {currentStepIdx + 1} of {WIZARD_STEPS.length}
        </div>
        <button
          type="button"
          onClick={() => {
            if (currentStepIdx < WIZARD_STEPS.length - 1) {
              setActiveTaskId(WIZARD_STEPS[currentStepIdx + 1].id);
            }
          }}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            background: '#0f766e',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {currentStepIdx === WIZARD_STEPS.length - 1 ? 'Tax Verification Complete ✓' : 'Save & Continue →'}
        </button>
      </footer>
    </div>
  );
}
