import { ReviewContext, SessionReviewReport, SessionReviewEvaluator } from './types';
import { evaluateSession01 } from './session-rules/session-01';
import { evaluateSession02 } from './session-rules/session-02';
import { evaluateSession07 } from './session-rules/session-07';
import { evaluateSession08 } from './session-rules/session-08';
import { evaluateGenericSession } from './session-rules/generic-session';

const registry: Record<number, SessionReviewEvaluator> = {
  1: evaluateSession01,
  2: evaluateSession02,
  7: evaluateSession07,
  8: evaluateSession08,
};

export function getSessionEvaluator(sessionId: number): SessionReviewEvaluator {
  return registry[sessionId] || evaluateGenericSession;
}

export function evaluateReview(ctx: ReviewContext): SessionReviewReport {
  const evaluator = getSessionEvaluator(ctx.sessionId);
  return evaluator(ctx);
}
