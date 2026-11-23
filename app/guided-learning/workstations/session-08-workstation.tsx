'use client';

import React from 'react';
import { Session08ReconciliationJourney } from '../components/session-08-reconciliation-journey';

/**
 * Session 08 Workstation
 * Bank Reconciliation — Find the Difference. Prove the Balance.
 * 
 * Re-routes directly to the unified single-page Session08ReconciliationJourney
 * providing the two natural headings:
 * 1. Compare Bank & Books
 * 2. Prepare the Reconciliation
 */
export function Session08Workstation() {
  return <Session08ReconciliationJourney />;
}
