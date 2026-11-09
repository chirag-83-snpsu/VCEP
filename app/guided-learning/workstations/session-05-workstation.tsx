'use client';

import React from 'react';
import { Session05AccountingJourney } from '../components/session-05-accounting-journey';

/**
 * Session 05 Workstation
 * Accounting Transactions — Work as an Accounts Executive.
 * 
 * Re-routes directly to the unified single-page Session05AccountingJourney
 * providing the two natural headings:
 * 1. Read the Source Transactions
 * 2. Prepare the Journal
 */
export function Session05Workstation() {
  return <Session05AccountingJourney />;
}
