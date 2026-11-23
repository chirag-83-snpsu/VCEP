import type { ReviewContext, SessionReviewReport, SessionReviewEvaluator } from './types.ts';
import { evaluateSession01 } from './session-rules/session-01.ts';
import { evaluateSession02 } from './session-rules/session-02.ts';
import { evaluateSession03 } from './session-rules/session-03.ts';
import { evaluateSession04 } from './session-rules/session-04.ts';
import { evaluateSession05 } from './session-rules/session-05.ts';
import { evaluateSession06 } from './session-rules/session-06.ts';
import { evaluateSession07 } from './session-rules/session-07.ts';
import { evaluateSession08 } from './session-rules/session-08.ts';
import { evaluateSession09 } from './session-rules/session-09.ts';
import { evaluateSession10 } from './session-rules/session-10.ts';
import { evaluateSession11 } from './session-rules/session-11.ts';
import { evaluateSession12 } from './session-rules/session-12.ts';
import { evaluateSession13 } from './session-rules/session-13.ts';
import { evaluateSession14 } from './session-rules/session-14.ts';
import { evaluateSession15 } from './session-rules/session-15.ts';
import { evaluateSession16 } from './session-rules/session-16.ts';
import { evaluateSession17 } from './session-rules/session-17.ts';
import { evaluateSession18 } from './session-rules/session-18.ts';
import { evaluateSession19 } from './session-rules/session-19.ts';
import { evaluateSession20 } from './session-rules/session-20.ts';
import { evaluateSession21 } from './session-rules/session-21.ts';
import { evaluateSession22 } from './session-rules/session-22.ts';
import { evaluateSession23 } from './session-rules/session-23.ts';
import { evaluateSession24 } from './session-rules/session-24.ts';
import { evaluateGenericSession } from './session-rules/generic-session.ts';

const registry: Record<number, SessionReviewEvaluator> = {
  1: evaluateSession01,
  2: evaluateSession02,
  3: evaluateSession03,
  4: evaluateSession04,
  5: evaluateSession05,
  6: evaluateSession06,
  7: evaluateSession07,
  8: evaluateSession08,
  9: evaluateSession09,
  10: evaluateSession10,
  11: evaluateSession11,
  12: evaluateSession12,
  13: evaluateSession13,
  14: evaluateSession14,
  15: evaluateSession15,
  16: evaluateSession16,
  17: evaluateSession17,
  18: evaluateSession18,
  19: evaluateSession19,
  20: evaluateSession20,
  21: evaluateSession21,
  22: evaluateSession22,
  23: evaluateSession23,
  24: evaluateSession24,
};

export function getSessionEvaluator(sessionId: number): SessionReviewEvaluator {
  return registry[sessionId] || evaluateGenericSession;
}

export function evaluateReview(ctx: ReviewContext): SessionReviewReport {
  const evaluator = getSessionEvaluator(ctx.sessionId);
  return evaluator(ctx);
}
