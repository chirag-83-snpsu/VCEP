'use client';

import React from 'react';
import { Session19ExecutionJourney } from '../components/session-19-execution-journey';

/**
 * Session 19 Workstation
 * Project Execution and Quality Assurance — Build the Prototype. Prove It Works.
 *
 * Re-routes directly to the unified single-page Session19ExecutionJourney
 * providing the two natural headings:
 * 1. Build the Approved Solution (#vcep-area-build)
 * 2. Test & Record Evidence (#vcep-area-test)
 */
export function Session19Workstation() {
  return <Session19ExecutionJourney />;
}
