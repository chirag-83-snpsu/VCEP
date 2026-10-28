'use client';

import React, { useState } from 'react';
import { Mail, Clock, AlertTriangle, CheckCircle, FileText, Send } from 'lucide-react';

export type EmailMessage = {
  id: string;
  stageName: string;
  timeContext: string;
  maxWords: number;
  recipient: string;
  subject: string;
  body: string;
  guidance: string;
  requiredElements: string[];
};

export type EmailStudioProps = {
  messages: EmailMessage[];
  activeMessageId: string;
  onSelectMessage: (id: string) => void;
  onMessageChange: (id: string, field: 'recipient' | 'subject' | 'body', val: string) => void;
  readOnly?: boolean;
};

export function EmailStudio({
  messages,
  activeMessageId,
  onSelectMessage,
  onMessageChange,
  readOnly = false,
}: EmailStudioProps) {
  const currentMsg = messages.find((m) => m.id === activeMessageId) || messages[0];

  const countWords = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const wordCount = countWords(currentMsg.body);
  const isOverBudget = wordCount > currentMsg.maxWords;
  const isNearLimit = wordCount >= currentMsg.maxWords * 0.85 && !isOverBudget;

  // Tone analysis: Check for speculative or unprofessional phrases
  const speculativeWords = ['hope', 'hopefully', 'maybe', 'sorry', 'guess', 'feel like', 'obviously', 'somehow'];
  const foundSpeculative = speculativeWords.filter((w) =>
    currentMsg.body.toLowerCase().includes(w)
  );

  return (
    <div className="vcep-email-studio">
      <div className="vcep-email-tabs-bar">
        {messages.map((m) => {
          const isActive = m.id === activeMessageId;
          const wCount = countWords(m.body);
          const isComplete = wCount > 0 && wCount <= m.maxWords;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMessage(m.id)}
              className={`vcep-email-tab-btn ${isActive ? 'is-active' : ''}`}
            >
              <div className="tab-stage">{m.stageName}</div>
              <div className="tab-meta">
                <Clock size={11} aria-hidden="true" />
                <span>{m.timeContext}</span>
                <span className="tab-wc">({wCount}/{m.maxWords}w)</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="vcep-email-pane">
        <div className="vcep-email-guidance-banner">
          <div className="guidance-title">
            <Mail size={16} aria-hidden="true" />
            <span>{currentMsg.stageName} ({currentMsg.timeContext})</span>
          </div>
          <p className="guidance-desc">{currentMsg.guidance}</p>
          <div className="guidance-elements">
            <strong>Mandatory Inclusions:</strong>
            <ul>
              {currentMsg.requiredElements.map((elem, idx) => (
                <li key={idx}>{elem}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="vcep-email-composer">
          <div className="vcep-composer-header">
            <div className="composer-field">
              <label htmlFor="email-to-input">To:</label>
              <input
                id="email-to-input"
                type="text"
                disabled={readOnly}
                value={currentMsg.recipient}
                onChange={(e) => onMessageChange(currentMsg.id, 'recipient', e.target.value)}
                placeholder="e.g. Operations Manager <ops.manager@company.internal>"
              />
            </div>
            <div className="composer-field">
              <label htmlFor="email-subject-input">Subject:</label>
              <input
                id="email-subject-input"
                type="text"
                disabled={readOnly}
                value={currentMsg.subject}
                onChange={(e) => onMessageChange(currentMsg.id, 'subject', e.target.value)}
                placeholder="Clear, professional subject with date/time reference..."
              />
            </div>
          </div>

          <div className="vcep-composer-body">
            <textarea
              aria-label={`Email body for ${currentMsg.stageName}`}
              rows={8}
              disabled={readOnly}
              value={currentMsg.body}
              onChange={(e) => onMessageChange(currentMsg.id, 'body', e.target.value)}
              placeholder="Draft your professional message here. Use objective facts, state dependencies clearly, and specify the next touchpoint..."
            />
          </div>

          <div className="vcep-composer-footer">
            <div className="vcep-word-meter">
              <span className={`meter-count ${isOverBudget ? 'is-danger' : isNearLimit ? 'is-warning' : 'is-ok'}`}>
                {wordCount} / {currentMsg.maxWords} Words
              </span>
              {isOverBudget && (
                <span className="meter-warning">
                  <AlertTriangle size={12} aria-hidden="true" /> Exceeds maximum word budget by {wordCount - currentMsg.maxWords} words. Tighten phrasing.
                </span>
              )}
            </div>

            {foundSpeculative.length > 0 && (
              <div className="vcep-tone-alert">
                <AlertTriangle size={12} aria-hidden="true" />
                <span>
                  <strong>Tone Review:</strong> Found speculative phrasing (<em>"{foundSpeculative.join('", "')}"</em>). Replace emotional or uncertain language with verifiable operational commitments.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
