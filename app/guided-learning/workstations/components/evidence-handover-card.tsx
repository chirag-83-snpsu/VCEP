'use client';

import React, { useState } from 'react';
import { FileCheck, Shield, RefreshCw } from 'lucide-react';

export type RubricItem = {
  name: string;
  points: number;
  evidence: string;
};

export type EvidenceHandoverProps = {
  sessionId: number;
  sessionTitle: string;
  deliverableName: string;
  rubric: RubricItem[];
  checklistItems: string[];
  checkedIndices: number[];
  onToggleChecklist?: (index: number) => void;
  draftTimestamp?: string;
  onClearDraft?: () => void;
  additionalSummary?: React.ReactNode;
};

export function EvidenceHandoverCard({
  sessionId,
  sessionTitle,
  deliverableName,
  rubric,
  checklistItems,
  checkedIndices,
  onToggleChecklist,
  draftTimestamp,
  onClearDraft,
  additionalSummary,
}: EvidenceHandoverProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  const totalPoints = rubric.reduce((sum, r) => sum + r.points, 0);
  const completedChecks = checkedIndices.length;
  const isAllChecked = completedChecks === checklistItems.length && checklistItems.length > 0;

  return (
    <div className="vcep-handover-card">
      <div className="vcep-handover-header">
        <div className="vcep-handover-badge">
          <FileCheck size={20} aria-hidden="true" />
        </div>
        <div className="vcep-handover-title-box">
          <span className="vcep-eyebrow">STAGE 06 · EVIDENCE HANDOVER</span>
          <h3>{deliverableName}</h3>
          <p>
            Review your work against corporate standards before completing formative practice for Session {String(sessionId).padStart(2, '0')}.
          </p>
        </div>
      </div>

      {additionalSummary && <div className="vcep-handover-summary-block">{additionalSummary}</div>}

      {/* Rubric Breakdown */}
      <div className="vcep-handover-rubric-section">
        <div className="vcep-rubric-header">
          <h4>Trainer 10-Point Formative Rubric</h4>
          <span className="vcep-total-badge">{totalPoints} Points Total</span>
        </div>
        <div className="vcep-rubric-grid">
          {rubric.map((r, idx) => (
            <div key={idx} className="vcep-rubric-cell">
              <div className="rubric-cell-top">
                <span className="rubric-name">{r.name}</span>
                <span className="rubric-pts">{r.points} / 10 pts</span>
              </div>
              <p className="rubric-evidence">{r.evidence}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Submission Verification Checklist */}
      <div className="vcep-handover-checklist-section">
        <div className="vcep-checklist-header">
          <h4>Pre-Handover Verification Checklist</h4>
          <span className="vcep-check-status">
            {completedChecks} of {checklistItems.length} Verified
          </span>
        </div>
        <div className="vcep-checklist-items">
          {checklistItems.map((item, idx) => {
            const isChecked = checkedIndices.includes(idx);
            return (
              <label key={idx} className={`vcep-check-label ${isChecked ? 'is-checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleChecklist?.(idx)}
                  className="vcep-check-input"
                />
                <span className="vcep-check-text">{item}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Export & Persistence Action Bar */}
      <div className="vcep-handover-actions">
        <div className="vcep-save-status">
          <div className="vcep-status-dot pulse" />
          <span>Practice draft cached in this browser {draftTimestamp ? `· ${draftTimestamp}` : ''}</span>
        </div>

        <div className="vcep-action-buttons">
          <div className="vcep-saved-badge">
            <FileCheck size={15} aria-hidden="true" />
            <span>Answers Saved in Platform</span>
          </div>

          {onClearDraft && (
            <div className="vcep-clear-guard">
              {confirmClear ? (
                <div className="confirm-row">
                  <span className="confirm-prompt">Erase this tab's draft?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearDraft();
                      setConfirmClear(false);
                    }}
                    className="vcep-btn-danger-confirm"
                  >
                    Confirm Erase
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="vcep-btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="vcep-btn-outline-danger"
                >
                  <RefreshCw size={13} aria-hidden="true" />
                  <span>Clear Practice Draft</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="vcep-handover-legal">
        <Shield size={14} aria-hidden="true" />
        <span>
          <strong>Academic & Grading Boundary:</strong> This interactive workstation records formative learning in your browser. Official college-assessed worksheets, grading rubrics, and faculty evaluations are conducted through the certified assessment portal.
        </span>
      </div>
    </div>
  );
}
