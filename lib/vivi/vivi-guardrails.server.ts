/**
 * Vivi AI Learning Partner - Guardrails & Controlled-Assessment Protection
 * Strictly enforces exam security and anti-cheating policies server-side.
 */

import { ViviLearningContext } from './types';

export interface GuardrailCheckResult {
  allowed: boolean;
  reason?: string;
  isLockout?: boolean;
}

const FORBIDDEN_EXAM_PATTERNS = [
  /give me the answers? to (session 22|exit b|baseline a|the exam|the test)/i,
  /solve (session 22|exit b|baseline a) for me/i,
  /viva (voce)? (answers?|cheat sheet|script to pass)/i,
  /write my (official|final|graded) submission/i,
  /ignore (all )?previous instructions/i,
  /system prompt/i,
  /pretend you are not (vivi|an ai tutor)/i,
];

/**
 * Validates whether the student's current learning context permits AI assistance.
 * Controlled assessments (Session 22 Exit B & Session 01 Stage 1 Baseline A) are strictly locked out.
 */
export function checkControlledAssessmentGate(
  context?: ViviLearningContext,
  message?: string
): GuardrailCheckResult {
  const sessionId = context?.sessionId;
  const stage = context?.stage;

  // 1. Mandatory Hard Lockout: Session 22 (Exit B Hiring Simulation & Exit Assessment)
  if (sessionId === 22) {
    return {
      allowed: false,
      isLockout: true,
      reason:
        'Controlled Assessment Active: Vivi is strictly disabled during Session 22 (Exit B Hiring Simulation & Exit Assessment). Certified independent student evidence is required by your institution.',
    };
  }

  // 2. Mandatory Hard Lockout: Session 01 Stage 1 (Baseline A Diagnostic)
  if (sessionId === 1 && (stage === 1 || stage === '1' || stage === 'baseline' || stage === 'diagnostic')) {
    return {
      allowed: false,
      isLockout: true,
      reason:
        'Controlled Assessment Active: Vivi is disabled during Session 01 Baseline A Diagnostic. Please complete this diagnostic using your own current understanding.',
    };
  }

  // 3. Prompt-level Examination Extraction Detection
  if (message) {
    for (const pattern of FORBIDDEN_EXAM_PATTERNS) {
      if (pattern.test(message)) {
        return {
          allowed: false,
          isLockout: false,
          reason:
            'Assessment Guardrail: I am your learning partner, not an exam solver! I can explain general business and commerce concepts, but I cannot write or provide solutions for graded assessments or viva voce evaluations.',
        };
      }
    }
  }

  return { allowed: true };
}
