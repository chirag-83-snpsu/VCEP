'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { LayoutDashboard, Sliders, FileText, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const STORAGE_KEY = 'vcep:s10:drive-v3:student-workstation';

export type Session10State = {
  directCostInput: number;
  memoText: string;
  checkedIndices: number[];
  timestamp?: string;
};

const defaultMemo =
  'September revenue grew 25.0% to ₹1,50,000, but operating profit margin compressed from 22.5% to 20.0% due to a 38.9% surge in direct delivery costs (₹75,000). Concurrently, uncollected receivables rose to ₹70,000, locking 46.7% of monthly sales in unpaid customer accounts. Action 1: Operations Lead to audit direct supplier contracts by Friday to isolate material cost inflation. Action 2: Collections Lead to place credit holds on accounts overdue >30 days by Monday. Limitation: Case D does not supply customer-level payment dates or unit cost breakdowns.';

const initialSession10State: Session10State = {
  directCostInput: 75000,
  memoText: defaultMemo,
  checkedIndices: [],
};

export function Session10Workstation() {
  const [state, setState] = useState<Session10State>(initialSession10State);
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

  const saveState = (updated: Session10State) => {
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
    setState(initialSession10State);
    setDraftTimestamp('');
  };

  // Sensitivity Calculations
  const revenue = 150000;
  const directCost = state.directCostInput || 75000;
  const overhead = 45000;
  const receivables = 70000;

  const grossProfit = revenue - directCost;
  const grossMarginPct = (grossProfit / revenue) * 100;
  const operatingProfit = grossProfit - overhead;
  const operatingMarginPct = (operatingProfit / revenue) * 100;
  const receivablesToSalesPct = (receivables / revenue) * 100;

  // Memo Word Count
  const words = state.memoText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isMemoValidLength = wordCount > 0 && wordCount <= 150;

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Dashboard correctly links core KPIs and recalculates dynamically under direct cost sensitivity changes.' },
    { name: 'Reasoning', points: 2, evidence: 'Explains impact of direct cost changes on margins; identifies trade-off between sales and cash collection.' },
    { name: 'Communication', points: 2, evidence: 'Management memo strictly adheres to 150-word limit and includes Insight, Evidence, Actions, and Limitation.' },
    { name: 'Professional Process', points: 2, evidence: 'Assigns clear role owners and specific clock deadlines to both recommended management actions.' },
  ];

  const checklist = [
    'My dashboard features the 4 executive KPIs: Revenue, Gross Margin %, Operating Margin %, and Closing Receivables.',
    'I verified August vs September comparisons for all 4 KPIs.',
    'I conducted the sensitivity stress test by adjusting direct costs from ₹75,000 to ₹78,000.',
    'All calculation cards and margin percentages updated dynamically without formula errors.',
    'My management memo is within the 150-word corporate limit (Insight, Evidence, Action, Limitation).',
    'I assigned specific role owners and delivery deadlines to both recommended actions.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · EXECUTIVE DASHBOARD & MEMO STUDIO</span>
          <h3>One-Page Executive MIS Dashboard & Management Memo</h3>
          <p>
            Build an executive dashboard for senior leadership. The managing director has five minutes: display core KPI trends, test cost sensitivities, and provide actionable recommendations.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Executive Focus:</strong> Prioritize 4 core KPIs that drive solvency and profitability; eliminate decorative charts that distract from decisions.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Dynamic Recalculation:</strong> Formulas must recalculate instantly when underlying cost assumptions shift.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Action Accountability:</strong> A management memo without specific owners and strict deadlines produces no organizational results.
          </div>
        </div>
      </div>

      {/* 2. Executive 4-Card KPI Banner */}
      <div className="vcep-workstation-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* Card 1: Revenue */}
          <div className="v3-panel" style={{ margin: 0, padding: '16px', background: '#fff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase' }}>
              September Revenue
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#17245C', margin: '6px 0 2px' }}>
              ₹{revenue.toLocaleString('en-IN')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>
              <TrendingUp size={14} /> +25.0% MoM (Aug ₹1,20,000)
            </div>
          </div>

          {/* Card 2: Gross Margin */}
          <div className="v3-panel" style={{ margin: 0, padding: '16px', background: '#fff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase' }}>
              Gross Profit Margin
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: directCost > 75000 ? '#b91c1c' : '#17245C', margin: '6px 0 2px' }}>
              {grossMarginPct.toFixed(1)}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#b91c1c', fontWeight: 600 }}>
              <TrendingDown size={14} /> {(grossMarginPct - 55.0).toFixed(1)} pp MoM (Aug 55.0%)
            </div>
          </div>

          {/* Card 3: Operating Margin */}
          <div className="v3-panel" style={{ margin: 0, padding: '16px', background: '#fff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase' }}>
              Operating Margin
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: directCost > 75000 ? '#b91c1c' : '#17245C', margin: '6px 0 2px' }}>
              {operatingMarginPct.toFixed(1)}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#b91c1c', fontWeight: 600 }}>
              <TrendingDown size={14} /> {(operatingMarginPct - 22.5).toFixed(1)} pp MoM (Aug 22.5%)
            </div>
          </div>

          {/* Card 4: Receivables */}
          <div className="v3-panel" style={{ margin: 0, padding: '16px', background: '#fff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase' }}>
              Closing Receivables
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309', margin: '6px 0 2px' }}>
              ₹{receivables.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>
              {receivablesToSalesPct.toFixed(1)}% of Monthly Revenue
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sensitivity Stress-Tester */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <Sliders size={18} /> Management Sensitivity Stress-Tester
            </h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => saveState({ ...state, directCostInput: 75000 })}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: state.directCostInput === 75000 ? '#e0f2fe' : '#fff',
                  color: state.directCostInput === 75000 ? '#0369a1' : '#374151',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Baseline (₹75k)
              </button>
              <button
                type="button"
                onClick={() => saveState({ ...state, directCostInput: 78000 })}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: state.directCostInput === 78000 ? '#fee2e2' : '#fff',
                  color: state.directCostInput === 78000 ? '#b91c1c' : '#374151',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Stress Test (+₹3k Cost Surge)
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: '0 0 16px' }}>
            Test what happens to September Gross Margin and Operating Profit when direct delivery costs increase from ₹75,000 to ₹78,000.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <input
              type="range"
              min={70000}
              max={85000}
              step={1000}
              value={state.directCostInput}
              onChange={(e) => saveState({ ...state, directCostInput: Number(e.target.value) })}
              style={{ flex: 1, accentColor: '#17245C' }}
            />
            <span style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', color: '#17245C', minWidth: '90px', textAlign: 'right' }}>
              ₹{state.directCostInput.toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Calculated Gross Profit:</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#17245C' }}>₹{grossProfit.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Calculated Gross Margin %:</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: grossMarginPct < 50 ? '#b91c1c' : '#17245C' }}>
                {grossMarginPct.toFixed(1)}%
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Calculated Operating Profit:</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#17245C' }}>₹{operatingProfit.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Calculated Operating Margin %:</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: operatingMarginPct < 20 ? '#b91c1c' : '#17245C' }}>
                {operatingMarginPct.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 150-Word Executive Management Memo */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <FileText size={18} /> 150-Word Executive Management Memo
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  background: isMemoValidLength ? '#ecfdf5' : '#fee2e2',
                  color: isMemoValidLength ? '#15803d' : '#b91c1c',
                }}
              >
                {wordCount} / 150 words {isMemoValidLength ? '✓' : '(Limit Exceeded!)'}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 10px' }}>
            Structure: <strong>Insight</strong> (diagnosis) → <strong>Evidence</strong> (numbers) → <strong>2 Actions</strong> (owner + deadline) → <strong>Limitation</strong>.
          </p>

          <textarea
            rows={5}
            value={state.memoText}
            onChange={(e) => saveState({ ...state, memoText: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${isMemoValidLength ? '#d1d5db' : '#ef4444'}`,
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
          />
        </div>
      </div>

      {/* 5. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={10}
          sessionTitle="MIS Dashboard Development"
          deliverableName="1-Page MIS Dashboard & Actionable Management Memo"
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
