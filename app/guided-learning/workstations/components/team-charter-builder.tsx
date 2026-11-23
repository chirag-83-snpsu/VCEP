'use client';

import React, { useState, useId } from 'react';
import { Users, Laptop, Clock, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export type SquadMember = {
  id: string;
  name: string;
  role: 'Owner' | 'Reviewer' | 'Backup' | 'Support';
  sharesLaptop: boolean;
  travelsLongDistance: boolean;
  notes?: string;
};

export type LaptopSlot = {
  time: string;
  assignedMemberId: string;
  activity: string;
};

export type TeamCharterBuilderProps = {
  members: SquadMember[];
  slots: LaptopSlot[];
  onMembersChange?: (members: SquadMember[]) => void;
  onSlotsChange?: (slots: LaptopSlot[]) => void;
  readOnly?: boolean;
};

export function TeamCharterBuilder({
  members,
  slots,
  onMembersChange,
  onSlotsChange,
  readOnly = false,
}: TeamCharterBuilderProps) {
  const compId = useId();

  // Conflict calculation: Check if two laptop-sharing members have overlap or if slots exceed reasonable usage
  const sharingMembers = members.filter((m) => m.sharesLaptop);
  const sharingMemberIds = new Set(sharingMembers.map((m) => m.id));

  // Compute total keyboard minutes per member (each slot = 20 mins)
  const usageMinutes: Record<string, number> = {};
  members.forEach((m) => {
    usageMinutes[m.id] = 0;
  });
  slots.forEach((s) => {
    if (s.assignedMemberId && usageMinutes[s.assignedMemberId] !== undefined) {
      usageMinutes[s.assignedMemberId] += 20;
    }
  });

  const handleRoleChange = (memberId: string, newRole: SquadMember['role']) => {
    if (readOnly || !onMembersChange) return;
    const updated = members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m));
    onMembersChange(updated);
  };

  const handleSlotChange = (index: number, memberId: string, activity: string) => {
    if (readOnly || !onSlotsChange) return;
    const updated = [...slots];
    updated[index] = { ...updated[index], assignedMemberId: memberId, activity };
    onSlotsChange(updated);
  };

  return (
    <div className="vcep-charter-builder">
      {/* 1. Squad Accountability Matrix */}
      <div className="vcep-charter-section">
        <div className="vcep-charter-heading">
          <div className="vcep-icon-box">
            <Users size={18} aria-hidden="true" />
          </div>
          <div>
            <h4>5-Person Squad Accountability & Governance Matrix</h4>
            <p>Every milestone requires 1 Accountable Owner, 1 Independent Reviewer, and 1 Designated Backup.</p>
          </div>
        </div>

        <div className="vcep-roles-explainer">
          <div className="vcep-role-desc desc-owner">
            <span className="desc-title">Owner</span>
            <span className="desc-text">Performs calculations, compiles drafts, and commits to on-time delivery.</span>
          </div>
          <div className="vcep-role-desc desc-reviewer">
            <span className="desc-title">Reviewer</span>
            <span className="desc-text">Independent audit, verifies formulas and cross-foots before submission.</span>
          </div>
          <div className="vcep-role-desc desc-backup">
            <span className="desc-title">Backup</span>
            <span className="desc-text">Maintains continuous situational awareness; assumes owner/reviewer duties if absent.</span>
          </div>
        </div>

        <div className="vcep-charter-table-wrap" tabIndex={0} role="region" aria-label="Squad Matrix Table">
          <table className="vcep-charter-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '180px' }}>Squad Member</th>
                <th scope="col" style={{ width: '160px' }}>Assigned Role</th>
                <th scope="col" style={{ width: '220px' }}>Operational Constraints</th>
                <th scope="col">Specific Commitment & Backup Handover Plan</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="vcep-member-name">
                    <strong>{m.name}</strong>
                    {m.id === 'm1' && <span className="vcep-badge-you">You</span>}
                  </td>
                  <td>
                    {readOnly ? (
                      <span className={`vcep-role-pill role-${m.role.toLowerCase()}`}>{m.role}</span>
                    ) : (
                      <select
                        aria-label={`Role for ${m.name}`}
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.id, e.target.value as any)}
                        className="vcep-role-select"
                      >
                        <option value="Owner">Owner</option>
                        <option value="Reviewer">Reviewer</option>
                        <option value="Backup">Backup</option>
                        <option value="Support">Support</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <div className="vcep-constraints-list">
                      {m.sharesLaptop && (
                        <span className="vcep-constraint-tag tag-laptop">
                          <Laptop size={12} aria-hidden="true" /> Shares Laptop
                        </span>
                      )}
                      {m.travelsLongDistance && (
                        <span className="vcep-constraint-tag tag-travel">
                          <Clock size={12} aria-hidden="true" /> 90m Commute
                        </span>
                      )}
                      {!m.sharesLaptop && !m.travelsLongDistance && (
                        <span className="vcep-constraint-tag tag-standard">Personal Laptop</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="vcep-commitment-text">
                      {m.role === 'Owner'
                        ? 'Drafts initial financial schedule by 15:30. Issues escalation notice by 16:30 if blocked.'
                        : m.role === 'Reviewer'
                        ? 'Audits formulas and verifies cross-foot balance between 16:30 and 17:15. Signs off handover.'
                        : m.role === 'Backup'
                        ? 'Reviews data appendix in parallel. Stands ready to step into Owner/Reviewer role at 16:30.'
                        : 'Prepares offline documentation, customer communication drafts, and cross-checks data.'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Shared-Laptop Timeline Scheduler */}
      <div className="vcep-charter-section">
        <div className="vcep-charter-heading">
          <div className="vcep-icon-box">
            <Laptop size={18} aria-hidden="true" />
          </div>
          <div>
            <h4>Shared-Laptop 20-Minute Keyboard Rota (13:00–17:30)</h4>
            <p>
              Constraint rule: Student 1 & Student 2 share 1 physical device. No simultaneous keyboard usage is possible. Non-keyboard time is used for paper drafting, peer review, and verification.
            </p>
          </div>
        </div>

        {/* Keyboard Usage Fairness Indicator */}
        <div className="vcep-rota-meters">
          <span className="vcep-meter-title">Keyboard Time Allocation:</span>
          {members.map((m) => (
            <div key={m.id} className="vcep-meter-chip">
              <span className="m-name">{m.name}:</span>
              <span className="m-mins">{usageMinutes[m.id] || 0} min</span>
              {m.sharesLaptop && <span className="m-badge">(Shared device)</span>}
            </div>
          ))}
        </div>

        <div className="vcep-rota-grid" tabIndex={0} role="region" aria-label="Keyboard Rota Slots">
          {slots.map((slot, idx) => {
            const isAssigned = Boolean(slot.assignedMemberId);
            const assignedMember = members.find((m) => m.id === slot.assignedMemberId);
            const isSharedStudent = assignedMember?.sharesLaptop;

            return (
              <div
                key={idx}
                className={`vcep-rota-slot-card ${isAssigned ? 'is-assigned' : 'is-empty'} ${
                  isSharedStudent ? 'is-shared-device' : ''
                }`}
              >
                <div className="slot-time">
                  <Clock size={12} aria-hidden="true" />
                  <span>{slot.time}</span>
                </div>

                <div className="slot-controls">
                  {readOnly ? (
                    <div className="slot-static-member">{assignedMember?.name || 'Unassigned'}</div>
                  ) : (
                    <select
                      aria-label={`Assigned member for ${slot.time}`}
                      value={slot.assignedMemberId}
                      onChange={(e) => handleSlotChange(idx, e.target.value, slot.activity)}
                      className="vcep-slot-select"
                    >
                      <option value="">Unassigned</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.sharesLaptop ? '💻' : ''}
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    type="text"
                    aria-label={`Activity for ${slot.time}`}
                    disabled={readOnly}
                    value={slot.activity}
                    placeholder="e.g. Case B cleaning, formula audit..."
                    onChange={(e) => handleSlotChange(idx, slot.assignedMemberId, e.target.value)}
                    className="vcep-slot-activity-input"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="vcep-charter-footer-tip">
          <Shield size={14} aria-hidden="true" />
          <span>
            <strong>Corporate Governance Check:</strong> Realistic workplace planning accounts for transit delays and hardware limitations before the shift starts, not at 17:55 when the deadline arrives.
          </span>
        </div>
      </div>
    </div>
  );
}
