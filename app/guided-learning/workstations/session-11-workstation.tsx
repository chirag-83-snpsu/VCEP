'use client';

import React from 'react';
import { Session11GSTJourney } from '../components/session-11-gst-journey';

/**
 * Session 11 Workstation
 * GST and Invoice Review — Review the Invoice Before You Approve It.
 *
 * Re-routes directly to the unified single-page Session11GSTJourney
 * providing the two natural headings:
 * 1. Inspect the Invoice Evidence
 * 2. Verify Tax & Exceptions
 */
export function Session11Workstation() {
  return <Session11GSTJourney />;
}
