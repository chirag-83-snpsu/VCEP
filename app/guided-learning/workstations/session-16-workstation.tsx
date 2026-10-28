'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { DollarSign, Scale, TrendingUp, TrendingDown, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'vcep:s16:drive-v3:student-workstation';

export type Session16State = {
  discountPct: number;
  proposedVolume: number;
  memoText: string;
  checkedIndices: number[];
  timestamp?: string;
};

const defaultDecisionMemo =
  'Recommendation: Reject the blanket 10% volume discount across all 30 seats. While revenue rises from ₹2,50,000 to ₹2,70,000, unit contribution drops from ₹6,000 to ₹5,000. Total contribution remains unchanged at ₹1,50,000, yielding exactly ₹0 incremental profit (₹30,000 in both cases). Concurrently, capacity utilization surges to 100%, eliminating all operational flexibility and increasing service failure risk. Non-negotiable Counter-Proposal: Offer standard pricing (₹10,000) on the first 25 seats and a 10% discount (₹9,000) on incremental seats 26–30 only, generating ₹5,000 in genuine incremental profit.';

export function Session16Workstation() {
  const [state, setState] = useState<Session16State>({
    discountPct: 10,
    proposedVolume: 30,
    memoText: defaultDecisionMemo,
    checkedIndices: [],
  });
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (updated: Session16State) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    const withTime = { ...updated, timestamp };
    setState(withTime);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(withTime));
    } catch {}
  };

  const handleToggleCheck = (index: number) => {
    const next = state.checkedIndices.includes(index)
      ? state.checkedIndices.filter((i) => i !== index)
      : [...state.checkedIndices, index];
    saveState({ ...state, checkedIndices: next });
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState({
      discountPct: 10,
      proposedVolume: 30,
      memoText: defaultDecisionMemo,
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  // Fixed baseline model parameters
  const standardPrice = 10000;
  const variableCost = 4000;
  const fixedCost = 120000;
  const maxCapacity = 30;

  // Baseline calculations (25 seats @ ₹10k)
  const baseVolume = 25;
  const basePrice = standardPrice;
  const baseUnitContribution = basePrice - variableCost; // 6,000
  const baseRevenue = baseVolume * basePrice; // 250,000
  const baseTotalVC = baseVolume * variableCost; // 100,000
  const baseContribution = baseVolume * baseUnitContribution; // 150,000
  const baseProfit = baseContribution - fixedCost; // 30,000
  const baseBreakEven = fixedCost / baseUnitContribution; // 20
  const baseCapacityUtil = (baseVolume / maxCapacity) * 100; // 83.3%

  // Dynamic Proposed calculations
  const proposedPrice = standardPrice * (1 - state.discountPct / 100);
  const proposedUnitContribution = proposedPrice - variableCost;
  const proposedRevenue = state.proposedVolume * proposedPrice;
  const proposedTotalVC = state.proposedVolume * variableCost;
  const proposedContribution = state.proposedVolume * proposedUnitContribution;
  const proposedProfit = proposedContribution - fixedCost;
  const proposedBreakEven = proposedUnitContribution > 0 ? fixedCost / proposedUnitContribution : 0;
  const proposedCapacityUtil = (state.proposedVolume / maxCapacity) * 100;

  const incrementalProfit = proposedProfit - baseProfit;
  const incrementalRevenue = proposedRevenue - baseRevenue;

  // Memo word count
  const words = state.memoText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isMemoValid = wordCount > 0 && wordCount <= 130;

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Baseline and proposed break-even, contribution, and profit calculated with exact mathematical accuracy.' },
    { name: 'Reasoning', points: 2, evidence: 'Recognizes that 10% discount on 30 seats produces ₹0 incremental profit while exhausting 100% capacity.' },
    { name: 'Communication', points: 2, evidence: 'Clear commercial memo formulating an actionable counter-proposal to protect operating margins.' },
    { name: 'Professional Process', points: 2, evidence: 'Refuses to equate top-line revenue expansion with business profitability.' },
  ];

  const checklist = [
    'I calculated baseline Unit Contribution (₹6,000) and Break-Even Volume (20 seats).',
    'I calculated proposed Unit Contribution (₹5,000) and Break-Even Volume (24 seats).',
    'I identified that proposed Net Profit is identical to baseline (₹30,000), producing ₹0 incremental profit.',
    'I recognized the operational risk of operating at 100% capacity with zero reserve buffer.',
    'I drafted a commercial decision memo recommending rejection or a structured counter-proposal.',
    'I defined a non-negotiable approval condition (e.g. discounting only incremental seats 26–30).',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · COMMERCIAL DECISION & BREAK-EVEN STUDIO</span>
          <h3>Unit Contribution, Break-Even & Capacity Constraint Simulator</h3>
          <p>
            Commercial policy baseline: Standard price ₹10,000; variable cost ₹4,000; fixed overhead ₹1,20,000. Current volume is 25 seats; maximum capacity is 30 seats. Evaluate whether to accept a client proposal for 30 seats at a 10% discount.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Contribution Over Revenue:</strong> Incremental profit is determined by total contribution (Volume × Unit Contribution), not billed revenue.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Break-Even Shifts:</strong> Lowering price from ₹10k to ₹9k raises break-even volume from 20 to 24 seats, increasing downside business risk.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Capacity Exhaustion:</strong> Operating at 100% capacity with zero extra profit increases delivery stress without financial compensation.
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Commercial Matrix */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Scale size={18} /> Baseline vs Proposed Commercial Evaluation Matrix
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.15)', textAlign: 'left', color: '#17245C' }}>
                  <th style={{ padding: '8px 10px' }}>Commercial Metric</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Baseline (25 Seats)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Proposed (30 Seats @ 10% Disc)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Variance / Incremental</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '8px 10px' }}>Unit Selling Price</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{basePrice.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#b91c1c' }}>₹{proposedPrice.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#b91c1c', fontWeight: 600 }}>-₹{(basePrice - proposedPrice).toLocaleString('en-IN')} (-{state.discountPct}%)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '8px 10px' }}>Variable Cost per Seat</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{variableCost.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{variableCost.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#6b7280' }}>₹0</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(23, 36, 92, 0.02)', fontWeight: 600 }}>
                  <td style={{ padding: '8px 10px' }}>Unit Contribution (Price - VC)</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#17245C' }}>₹{baseUnitContribution.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#b91c1c' }}>₹{proposedUnitContribution.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#b91c1c' }}>-₹{(baseUnitContribution - proposedUnitContribution).toLocaleString('en-IN')}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '8px 10px' }}>Billed Revenue</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{baseRevenue.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#15803d', fontWeight: 600 }}>₹{proposedRevenue.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#15803d', fontWeight: 600 }}>+₹{incrementalRevenue.toLocaleString('en-IN')} (+8.0%)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '8px 10px' }}>Total Contribution</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>₹{baseContribution.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>₹{proposedContribution.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#4b5563' }}>₹0 (Identical!)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '8px 10px' }}>Fixed Operating Overhead</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{fixedCost.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{fixedCost.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#6b7280' }}>₹0</td>
                </tr>
                <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.2)', background: '#f8fafc', fontWeight: 700 }}>
                  <td style={{ padding: '10px', color: '#17245C' }}>Net Operating Profit</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#17245C', fontSize: '1rem' }}>₹{baseProfit.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#17245C', fontSize: '1rem' }}>₹{proposedProfit.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#b45309' }}>₹{incrementalProfit.toLocaleString('en-IN')} (ZERO GAIN!)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '8px 10px' }}>Break-Even Volume (Fixed ÷ Unit Contrib)</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{baseBreakEven.toFixed(0)} seats</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#b91c1c' }}>{proposedBreakEven.toFixed(0)} seats</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#b91c1c' }}>+{(proposedBreakEven - baseBreakEven).toFixed(0)} seats (Higher Risk)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '8px 10px' }}>Capacity Utilization (30 Seats Max)</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>{baseCapacityUtil.toFixed(1)}% (5 seats buffer)</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#b91c1c', fontWeight: 700 }}>{proposedCapacityUtil.toFixed(1)}% (0 buffer!)</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#b91c1c', fontWeight: 600 }}>+16.7 pp (Exhausted)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Interactive Pricing & Volume Simulator */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <DollarSign size={18} /> Interactive Sensitivity Simulator (Adjust Discount % & Volume)
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>Discount Percentage:</span>
                <span style={{ color: '#b91c1c' }}>{state.discountPct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={state.discountPct}
                onChange={(e) => saveState({ ...state, discountPct: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#17245C' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>Contracted Seats Volume:</span>
                <span style={{ color: '#17245C' }}>{state.proposedVolume} seats</span>
              </div>
              <input
                type="range"
                min={20}
                max={30}
                step={1}
                value={state.proposedVolume}
                onChange={(e) => saveState({ ...state, proposedVolume: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#17245C' }}
              />
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${incrementalProfit > 0 ? '#86efac' : incrementalProfit === 0 ? '#fde047' : '#fca5a5'}`,
              background: incrementalProfit > 0 ? '#f0fdf4' : incrementalProfit === 0 ? '#fefce8' : '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {incrementalProfit > 0 ? (
              <CheckCircle2 size={24} style={{ color: '#15803d', flexShrink: 0 }} />
            ) : incrementalProfit === 0 ? (
              <AlertTriangle size={24} style={{ color: '#b45309', flexShrink: 0 }} />
            ) : (
              <TrendingDown size={24} style={{ color: '#b91c1c', flexShrink: 0 }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: incrementalProfit > 0 ? '#166534' : incrementalProfit === 0 ? '#854d0e' : '#991b1b' }}>
                Incremental Profit Impact: ₹{incrementalProfit.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                {incrementalProfit === 0
                  ? 'Zero Economic Gain: You are operating 5 extra seats at 100% capacity without generating a single rupee of incremental net profit.'
                  : incrementalProfit > 0
                  ? 'Favorable Commercial Structure: The volume gain compensates for the price concession, adding net operating profit.'
                  : 'Value Destroying Deal: Discounting has diluted contribution so severely that total company profit drops below the 25-seat baseline!'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Commercial Recommendation Memo */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <FileText size={18} /> Commercial Recommendation Memo (Max 130 Words)
            </h4>
            <span
              style={{
                fontSize: '0.8rem',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 600,
                background: isMemoValid ? '#ecfdf5' : '#fee2e2',
                color: isMemoValid ? '#15803d' : '#b91c1c',
              }}
            >
              {wordCount} / 130 words {isMemoValid ? '✓' : '(Limit Exceeded!)'}
            </span>
          </div>

          <textarea
            rows={6}
            value={state.memoText}
            onChange={(e) => saveState({ ...state, memoText: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${isMemoValid ? '#d1d5db' : '#ef4444'}`,
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
          />
        </div>
      </div>

      {/* 5. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={16}
          sessionTitle="Commercial Decision Making"
          deliverableName="Commercial Decision Memo & Break-Even Evaluation"
          rubric={rubric}
          checklistItems={checklist}
          checkedIndices={state.checkedIndices}
          onToggleChecklist={handleToggleCheck}
          draftTimestamp={draftTimestamp}
          onClearDraft={handleReset}
        />
      </div>
    </div>
  );
}
