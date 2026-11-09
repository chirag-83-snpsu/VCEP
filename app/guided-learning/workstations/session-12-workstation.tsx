'use client';

import React from 'react';
import { Session12ReceivablesJourney } from '../components/session-12-receivables-journey';

/**
 * Session 12 Workstation
 * Receivables and Working Capital — Turn Overdue Invoices into a Cash Plan.
 *
 * Re-routes directly to the unified single-page Session12ReceivablesJourney
 * providing the two natural headings:
 * 1. Understand Who Owes What
 * 2. Build the Collection & Cash Plan
 */
export function Session12Workstation() {
  return <Session12ReceivablesJourney />;
}
