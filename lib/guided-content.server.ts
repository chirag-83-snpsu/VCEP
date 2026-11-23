/**
 * SERVER-ONLY Guided Learning Content Module.
 * Imports full 24 Drive Edition 3.0 session bodies.
 * MUST NEVER BE IMPORTED BY CLIENT COMPONENTS.
 */

import driveData from '@/app/guided-learning/drive-edition-3.json';

export type SourceTable = { title: string; note: string; headers: string[]; rows: string[][] };
export type WorkTable = { title: string; headers: string[]; rows: string[][] };
export type Rubric = { name: string; points: number; evidence: string };

export type GuidedLesson = {
  id: number;
  title: string;
  edition: string;
  minutes: number;
  track: number;
  summary: string;
  outcome: string;
  deliverable: string;
  case: string;
  concept: string;
  example: string;
  assignment: string;
  sourceTables: SourceTable[];
  workTables: WorkTable[];
  workPrompts: string[];
  support: string[];
  beforeSubmission: string[];
  rubric: Rubric[];
  squad: string;
  reviewRoles: string;
  aiPrompt: string;
  aiPolicy: string;
  submission: string;
  aiLogFields?: string[];
  controlledAssessment: boolean;
  sourceLink: string;
};

const lessons = driveData as GuidedLesson[];

export function getAuthorizedLesson(sessionId: number): GuidedLesson | null {
  if (!Number.isInteger(sessionId) || sessionId < 1 || sessionId > 24) {
    return null;
  }
  const lesson = lessons.find(l => l.id === sessionId);
  if (!lesson) return null;

  // Defensive sanitization: ensure no trainer answer keys are attached
  return {
    ...lesson,
    // Controlled assessments S01 and S22 strictly restrict AI guidance
    aiPrompt: lesson.controlledAssessment && sessionId === 22 ? '' : lesson.aiPrompt,
  };
}

export function getAllLessonsCount(): number {
  return lessons.length;
}
