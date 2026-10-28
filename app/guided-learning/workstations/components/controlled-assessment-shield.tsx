'use client';

import React, { useState } from 'react';
import { Lock, Clock, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export type ControlledAssessmentShieldProps = {
  assessmentName: string; // e.g. "Baseline A (Trainer-Controlled)"
  sessionMinutes: number; // e.g. 60 min
  instructions: string;
  isConfirmed: boolean;
  onConfirmChange: (confirmed: boolean) => void;
};

export function ControlledAssessmentShield({
  assessmentName,
  sessionMinutes,
  instructions,
  isConfirmed,
  onConfirmChange,
}: ControlledAssessmentShieldProps) {
  const checkboxId = React.useId();

  return (
    <div className={`vcep-controlled-shield ${isConfirmed ? 'is-unlocked' : 'is-locked'}`}>
      <div className="vcep-shield-top">
        <div className="vcep-shield-icon">
          {isConfirmed ? <ShieldCheck size={24} aria-hidden="true" /> : <Lock size={24} aria-hidden="true" />}
        </div>
        <div className="vcep-shield-title-area">
          <div className="vcep-shield-eyebrow">
            <span className="shield-tag">CONTROLLED ASSESSMENT</span>
            <span className="shield-time">
              <Clock size={13} aria-hidden="true" /> {sessionMinutes} MINUTES TIMED
            </span>
          </div>
          <h3>{assessmentName}</h3>
          <p className="vcep-shield-sub">{instructions}</p>
        </div>
      </div>

      <div className="vcep-shield-rules-box">
        <div className="rules-heading">
          <AlertTriangle size={15} aria-hidden="true" />
          <span>Strict Examination & Invigilation Rules:</span>
        </div>
        <ul className="rules-list">
          <li>Assessment papers and case datasets are issued directly by the course trainer.</li>
          <li>Work completely independently: zero AI assistance, peer collaboration, or external browsing.</li>
          <li>Spreadsheet calculations, source references, and formula working must be shown in full.</li>
          <li>Submissions are timestamped and audited for academic and professional integrity.</li>
        </ul>
      </div>

      <div className="vcep-shield-ack-box">
        <label
          className="vcep-ack-label"
          htmlFor={checkboxId}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: '12px',
            width: '100%',
            cursor: 'pointer',
          }}
        >
          <input
            id={checkboxId}
            type="checkbox"
            checked={isConfirmed}
            onChange={(e) => onConfirmChange(e.target.checked)}
            className="vcep-ack-checkbox"
            style={{
              width: '18px',
              minWidth: '18px',
              maxWidth: '18px',
              height: '18px',
              minHeight: '18px',
              maxHeight: '18px',
              padding: 0,
              margin: '2px 0 0 0',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          />
          <span
            className="vcep-ack-text"
            style={{
              flex: '1 1 auto',
              minWidth: 0,
              overflowWrap: 'break-word',
              wordBreak: 'normal',
              fontSize: '13px',
              lineHeight: 1.55,
            }}
          >
            <strong>Invigilation & Academic Honesty Acknowledgement:</strong> I understand that {assessmentName} is an independent evaluation. I confirm that all calculations and responses entered here represent solely my own verifiable work.
          </span>
        </label>
      </div>

      {isConfirmed && (
        <div className="vcep-shield-status-bar">
          <CheckCircle2 size={15} aria-hidden="true" />
          <span>Workstation Ready · Timed Independent Session Active</span>
        </div>
      )}
    </div>
  );
}
