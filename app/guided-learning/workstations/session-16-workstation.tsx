'use client';

import React from 'react';
import { Session16DecisionJourney } from '../components/session-16-decision-journey';

/**
 * Session 16 Workstation
 * Commercial Decision Making — Make the Decision with Numbers.
 *
 * Re-routes directly to the unified single-page Session16DecisionJourney
 * providing the two natural headings:
 * 1. Understand the Pricing Proposal
 * 2. Compare Scenarios & Decide
 */
export function Session16Workstation() {
  return <Session16DecisionJourney />;
}
