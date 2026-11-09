'use client';

import React from 'react';
import { Session20ChangeJourney } from '../components/session-20-change-journey';

/**
 * Session 20 Workstation
 * Management Review and Change Control — Control the Change. Keep the Evidence.
 *
 * Re-routes directly to the unified single-page Session20ChangeJourney
 * providing the two natural headings:
 * 1. Review the Approved Change (#vcep-area-review)
 * 2. Update & Retest the Model (#vcep-area-update)
 */
export function Session20Workstation() {
  return <Session20ChangeJourney />;
}
