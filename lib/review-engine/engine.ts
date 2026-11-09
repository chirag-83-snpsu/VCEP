'use client';

import { useMemo, useState, useEffect } from 'react';
import type { ReviewContext, SessionReviewReport } from './types.ts';
import { evaluateReview } from './registry.ts';

export function runAutomaticReview(ctx: ReviewContext): SessionReviewReport {
  return evaluateReview(ctx);
}

export function useAutomaticReview(
  sessionId: number,
  lesson: any,
  draft: Record<string, string>
): SessionReviewReport {
  const [workstationData, setWorkstationData] = useState<any>(null);
  const [practiceLabData, setPracticeLabData] = useState<any>(null);
  const [startupLabData, setStartupLabData] = useState<any>(null);

  // Sync with local storage workstation & practice lab data
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (sessionId === 1) {
        const startupRaw = localStorage.getItem('vcep:s01:edition-3.1:startup-lab');
        if (startupRaw) setStartupLabData(JSON.parse(startupRaw));
        else setStartupLabData(null);

        const labRaw = localStorage.getItem('vcep:s01:drive-v3:complete-practice-lab');
        if (labRaw) setPracticeLabData(JSON.parse(labRaw));
        else setPracticeLabData(null);

        const wsRaw = localStorage.getItem('vcep:s01:drive-v3:student-workstation');
        if (wsRaw) setWorkstationData(JSON.parse(wsRaw));
        else setWorkstationData(null);
      } else {
        const padded = String(sessionId).padStart(2, '0');
        const wsRaw = localStorage.getItem(`vcep:s${padded}:drive-v3:student-workstation`);
        if (wsRaw) setWorkstationData(JSON.parse(wsRaw));
        else setWorkstationData(null);
        setPracticeLabData(null);
        setStartupLabData(null);
      }
    } catch {}
  }, [sessionId, draft]);

  // Compute review report with 300ms debouncing or reactive memoization
  const report = useMemo(() => {
    const ctx: ReviewContext = {
      sessionId,
      lesson,
      draft,
      workstationData,
      practiceLabData,
      startupLabData,
    };
    return evaluateReview(ctx);
  }, [sessionId, lesson, draft, workstationData, practiceLabData, startupLabData]);

  return report;
}
