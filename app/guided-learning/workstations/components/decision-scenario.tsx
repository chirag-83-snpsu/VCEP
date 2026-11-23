'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export type DecisionOption = {
  id: string;
  title: string;
  actionSummary: string;
  governanceVerdict: 'Recommended' | 'High Risk' | 'Unacceptable';
  governanceAnalysis: string;
  auditTrailConsequence: string;
};

export type DecisionScenarioProps = {
  title: string;
  scenarioTime: string;
  deadlineTime: string;
  contextNarrative: string;
  options: DecisionOption[];
  selectedOptionId?: string;
  onSelectOption?: (optionId: string) => void;
  justificationNotes?: string;
  onJustificationChange?: (notes: string) => void;
  readOnly?: boolean;
};

export function DecisionScenario({
  title,
  scenarioTime,
  deadlineTime,
  contextNarrative,
  options,
  selectedOptionId,
  onSelectOption,
  justificationNotes = '',
  onJustificationChange,
  readOnly = false,
}: DecisionScenarioProps) {
  const selectedOption = options.find((o) => o.id === selectedOptionId);

  return (
    <div className="vcep-decision-scenario">
      <div className="vcep-scenario-banner">
        <div className="vcep-scenario-time-badge">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>URGENT DECISION CHECKPOINT · {scenarioTime}</span>
        </div>
        <div className="vcep-scenario-deadline">
          <span>Final Delivery Deadline: <strong>{deadlineTime}</strong></span>
        </div>
      </div>

      <div className="vcep-scenario-body">
        <h3 className="vcep-scenario-title">{title}</h3>
        <p className="vcep-scenario-narrative">{contextNarrative}</p>
      </div>

      <div className="vcep-options-grid" role="radiogroup" aria-label={title}>
        {options.map((opt) => {
          const isSelected = opt.id === selectedOptionId;
          const isRec = opt.governanceVerdict === 'Recommended';

          return (
            <div
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => !readOnly && onSelectOption?.(opt.id)}
              onKeyDown={(e) => {
                if (!readOnly && (e.key === ' ' || e.key === 'Enter')) {
                  e.preventDefault();
                  onSelectOption?.(opt.id);
                }
              }}
              className={`vcep-option-card ${isSelected ? 'is-selected' : ''} verdict-${opt.governanceVerdict.toLowerCase().replace(' ', '-')}`}
            >
              <div className="option-header">
                <div className="option-radio-indicator">
                  <div className={`radio-dot ${isSelected ? 'is-active' : ''}`} />
                </div>
                <div className="option-title-group">
                  <h4 className="option-title">{opt.title}</h4>
                  <span className={`option-verdict-pill pill-${opt.governanceVerdict.toLowerCase().replace(' ', '-')}`}>
                    {opt.governanceVerdict === 'Recommended' ? (
                      <CheckCircle size={12} aria-hidden="true" />
                    ) : (
                      <XCircle size={12} aria-hidden="true" />
                    )}
                    <span>{opt.governanceVerdict}</span>
                  </span>
                </div>
              </div>

              <p className="option-action">{opt.actionSummary}</p>

              {isSelected && (
                <div className="option-consequences">
                  <div className="consequence-item">
                    <span className="consequence-label">Governance Analysis:</span>
                    <span className="consequence-text">{opt.governanceAnalysis}</span>
                  </div>
                  <div className="consequence-item">
                    <span className="consequence-label">Audit Trail Impact:</span>
                    <span className="consequence-text">{opt.auditTrailConsequence}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedOption && (
        <div className="vcep-justification-area">
          <label className="vcep-field-label">
            <span>Corporate Escalation & Justification Note (Required for Submission)</span>
            <span className="field-hint">
              Explain why this action upholds delivery commitments while maintaining verifiable audit controls:
            </span>
          </label>
          <textarea
            rows={3}
            disabled={readOnly}
            value={justificationNotes}
            onChange={(e) => onJustificationChange?.(e.target.value)}
            placeholder="Document the exact handover communication, notifying the trainer and recording why the backup protocol was engaged..."
            className="vcep-textarea-input"
          />
        </div>
      )}
    </div>
  );
}
