'use client';

import React from 'react';
import { Session18PlanningJourney } from '../components/session-18-planning-journey';

/**
 * Session 18 Workstation
 * Solution Design and Project Planning — Choose a Solution. Plan the Delivery.
 *
 * Re-routes directly to the unified single-page Session18PlanningJourney
 * providing the two natural headings:
 * 1. Select the Feasible Solution (#vcep-area-solution)
 * 2. Plan Tasks & Acceptance Tests (#vcep-area-plan)
 */
export function Session18Workstation() {
  return <Session18PlanningJourney />;
}
