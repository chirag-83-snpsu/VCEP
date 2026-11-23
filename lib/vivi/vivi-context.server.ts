/**
 * Vivi AI Learning Partner - Permission-Aware Curriculum Retrieval
 * Retrieves authorized excerpts from drive-edition-3.json without exposing raw files.
 */

import { getAuthorizedLesson, GuidedLesson } from '@/lib/guided-content.server';

export interface CurriculumContextResult {
  allowed: boolean;
  reason?: string;
  excerpt?: string;
  sourceReference?: string;
}

/**
 * Verifies session unlock status against student's cohort policy in D1,
 * then retrieves a permission-gated curriculum excerpt.
 */
export async function getAuthorizedCurriculumContext(
  db: any,
  user: { id: string; role: string; cohort?: string; consent?: number },
  sessionId?: number,
  section?: string
): Promise<CurriculumContextResult> {
  // If no session specified, return general commerce context
  if (!sessionId || !Number.isInteger(sessionId) || sessionId < 1 || sessionId > 24) {
    return {
      allowed: true,
      excerpt: 'Topic: General Commerce, Business Operations, Finance and Professional Career Skills.',
      sourceReference: 'VCEP General Curriculum',
    };
  }

  // Admin and faculty bypass cohort release gates
  const isStaff = ['admin', 'faculty'].includes(user.role);

  if (!isStaff && user.role === 'student') {
    if (!user.consent) {
      return {
        allowed: false,
        reason: 'Participation consent is pending from your college coordinator.',
      };
    }

    if (!user.cohort) {
      return {
        allowed: false,
        reason: 'No active cohort assigned to your account.',
      };
    }

    // Verify cohort assignment & unlock policy
    const now = new Date().toISOString();
    const cohortRecord = await db
      .prepare('SELECT * FROM cohorts WHERE id=?')
      .bind(user.cohort)
      .first();

    if (!cohortRecord) {
      return { allowed: false, reason: 'Active cohort record not found.' };
    }

    const assignment = await db
      .prepare('SELECT * FROM assignments WHERE cohort=? AND session=?')
      .bind(user.cohort, sessionId)
      .first();

    if (assignment?.unlock && assignment.unlock > now) {
      return {
        allowed: false,
        reason: `Session ${sessionId} has not opened yet for your cohort (scheduled for ${new Date(
          assignment.unlock
        ).toLocaleDateString()}).`,
      };
    }

    if (cohortRecord.policy === 'sequential' && sessionId > 1) {
      const prevSub = await db
        .prepare(
          "SELECT id FROM submissions WHERE owner=? AND session=? AND status IN ('Submitted','Under review','Graded')"
        )
        .bind(user.id, sessionId - 1)
        .first();

      if (!prevSub) {
        return {
          allowed: false,
          reason: `Session ${sessionId} is locked. You must submit Session ${
            sessionId - 1
          } before unlocking this session.`,
        };
      }
    }
  }

  // Load lesson from server-only store
  const lesson: GuidedLesson | null = getAuthorizedLesson(sessionId);
  if (!lesson) {
    return { allowed: false, reason: 'Requested session curriculum not found.' };
  }

  // Construct compact, token-efficient curriculum excerpt
  const sourceTableHeaders = (lesson.sourceTables || [])
    .map((t) => `${t.title} [Fields: ${t.headers.slice(0, 5).join(', ')}]`)
    .join('; ');

  const rubricPoints = (lesson.rubric || [])
    .slice(0, 3)
    .map((r) => `${r.name}: ${r.evidence}`)
    .join(' | ');

  const excerpt = `
[APPROVED VCEP CURRICULUM CONTEXT - SESSION ${String(lesson.id).padStart(2, '0')}: ${lesson.title}]
- Track: Track ${lesson.track} | Expected Time: ${lesson.minutes} mins
- Learning Outcome: ${lesson.outcome}
- Professional Deliverable: ${lesson.deliverable}
- Core Case Summary: ${lesson.case ? lesson.case.slice(0, 300) : 'Standard corporate scenario'}...
- Available Source Data: ${sourceTableHeaders || 'Standard transaction workbook'}
- Quality Assurance / Rubric Standards: ${rubricPoints || 'Accurate accounting reconciliation'}
- Relevant Section: ${section || 'General Overview'}
[END APPROVED VCEP CURRICULUM CONTEXT]
`.trim();

  const sourceReference = `VCEP Session ${String(lesson.id).padStart(2, '0')} — ${lesson.title}`;

  return {
    allowed: true,
    excerpt,
    sourceReference,
  };
}
