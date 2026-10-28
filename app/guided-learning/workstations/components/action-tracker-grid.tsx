'use client';

import React, { useState } from 'react';
import { CheckSquare, Clock, AlertCircle, FileText, UserCheck, Shield } from 'lucide-react';

export type ActionItem = {
  id: string;
  task: string;
  owner: string;
  authority: string;
  deadline: string;
  status: 'Open' | 'In Progress' | 'Complete' | 'Escalated';
  evidence: string;
};

export type ActionTrackerGridProps = {
  actions: ActionItem[];
  onActionChange?: (id: string, field: keyof ActionItem, value: string) => void;
  dnbState: { done: string; next: string; blocker: string };
  onDnbChange?: (field: 'done' | 'next' | 'blocker', value: string) => void;
  readOnly?: boolean;
};

export function ActionTrackerGrid({
  actions,
  onActionChange,
  dnbState,
  onDnbChange,
  readOnly = false,
}: ActionTrackerGridProps) {
  return (
    <div className="vcep-action-tracker">
      <div className="vcep-tracker-header">
        <div className="vcep-tracker-title">
          <CheckSquare size={18} aria-hidden="true" />
          <div>
            <h4>Meeting Decision & RACI Action Register</h4>
            <p>Every commercial commitment must have exactly one named owner, designated approval authority, and unambiguous cutoff.</p>
          </div>
        </div>
      </div>

      <div className="vcep-actions-table-wrap" tabIndex={0} role="region" aria-label="Action Items Table">
        <table className="vcep-actions-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '50px' }}>#</th>
              <th scope="col">Decision / Action Item</th>
              <th scope="col" style={{ width: '150px' }}>Accountable Owner</th>
              <th scope="col" style={{ width: '150px' }}>Approval Authority</th>
              <th scope="col" style={{ width: '120px' }}>Deadline</th>
              <th scope="col" style={{ width: '140px' }}>Status</th>
              <th scope="col">Verification Evidence</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((act, idx) => (
              <tr key={act.id}>
                <td className="cell-idx">{idx + 1}</td>
                <td>
                  {readOnly ? (
                    <span>{act.task}</span>
                  ) : (
                    <input
                      type="text"
                      aria-label={`Task ${idx + 1}`}
                      value={act.task}
                      onChange={(e) => onActionChange?.(act.id, 'task', e.target.value)}
                      placeholder="e.g. Approve ₹4,000 substitute PO..."
                      className="vcep-cell-input"
                    />
                  )}
                </td>
                <td>
                  {readOnly ? (
                    <span>{act.owner}</span>
                  ) : (
                    <input
                      type="text"
                      aria-label={`Owner for task ${idx + 1}`}
                      value={act.owner}
                      onChange={(e) => onActionChange?.(act.id, 'owner', e.target.value)}
                      placeholder="Single person"
                      className="vcep-cell-input"
                    />
                  )}
                </td>
                <td>
                  {readOnly ? (
                    <span>{act.authority}</span>
                  ) : (
                    <input
                      type="text"
                      aria-label={`Authority for task ${idx + 1}`}
                      value={act.authority}
                      onChange={(e) => onActionChange?.(act.id, 'authority', e.target.value)}
                      placeholder="e.g. Commercial Mgr"
                      className="vcep-cell-input"
                    />
                  )}
                </td>
                <td>
                  {readOnly ? (
                    <span>{act.deadline}</span>
                  ) : (
                    <input
                      type="text"
                      aria-label={`Deadline for task ${idx + 1}`}
                      value={act.deadline}
                      onChange={(e) => onActionChange?.(act.id, 'deadline', e.target.value)}
                      placeholder="e.g. 13:30 Today"
                      className="vcep-cell-input"
                    />
                  )}
                </td>
                <td>
                  {readOnly ? (
                    <span className={`status-pill status-${act.status.toLowerCase().replace(' ', '-')}`}>
                      {act.status}
                    </span>
                  ) : (
                    <select
                      aria-label={`Status for task ${idx + 1}`}
                      value={act.status}
                      onChange={(e) => onActionChange?.(act.id, 'status', e.target.value as any)}
                      className="vcep-cell-select"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Complete">Complete</option>
                      <option value="Escalated">Escalated</option>
                    </select>
                  )}
                </td>
                <td>
                  {readOnly ? (
                    <span>{act.evidence}</span>
                  ) : (
                    <input
                      type="text"
                      aria-label={`Evidence for task ${idx + 1}`}
                      value={act.evidence}
                      onChange={(e) => onActionChange?.(act.id, 'evidence', e.target.value)}
                      placeholder="e.g. Vendor PO PDF #809"
                      className="vcep-cell-input"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 90-Second Done-Next-Blocker (DNB) Executive Standup Card */}
      <div className="vcep-dnb-block">
        <div className="vcep-dnb-header">
          <Clock size={16} aria-hidden="true" />
          <h5>90-Second Done-Next-Blocker (DNB) Flash Update</h5>
        </div>
        <div className="vcep-dnb-grid">
          <div className="dnb-card dnb-done">
            <div className="dnb-title">DONE (Past 24 Hours)</div>
            <textarea
              rows={3}
              disabled={readOnly}
              value={dnbState.done}
              onChange={(e) => onDnbChange?.('done', e.target.value)}
              placeholder="Concrete verified deliverables finished with proof..."
            />
          </div>
          <div className="dnb-card dnb-next">
            <div className="dnb-title">NEXT (Target for Today 17:00)</div>
            <textarea
              rows={3}
              disabled={readOnly}
              value={dnbState.next}
              onChange={(e) => onDnbChange?.('next', e.target.value)}
              placeholder="Primary milestone being driven to completion right now..."
            />
          </div>
          <div className="dnb-card dnb-blocker">
            <div className="dnb-title">BLOCKER (Requiring Immediate Decision)</div>
            <textarea
              rows={3}
              disabled={readOnly}
              value={dnbState.blocker}
              onChange={(e) => onDnbChange?.('blocker', e.target.value)}
              placeholder="Specific obstacle, owner needed, or required approval..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
