export type StageStatus = 'not_started' | 'in_progress' | 'reviewed' | 'needs_revision' | 'awaiting_trainer';

export type StageName = 'Overview' | 'Learn' | 'Case' | 'Work' | 'Team';

export interface ReviewCheckItem {
  id: string;
  title: string;
  description?: string;
  passed: boolean;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  studentValue?: string | number;
  expectedRequirement?: string;
  whyIncorrect?: string;
  conceptToRevisit?: string;
  actionTab: StageName;
  actionLabel?: string;
}

export interface StageReviewResult {
  stage: StageName;
  status: StageStatus;
  title: string;
  summary: string;
  checks: ReviewCheckItem[];
  passedCount: number;
  totalCount: number;
}

export interface SessionReviewReport {
  sessionId: number;
  overallStatus: StageStatus;
  overallSummary: string;
  stages: Record<StageName, StageReviewResult>;
  totalChecks: number;
  passedChecks: number;
  hasErrors: boolean;
  revisitRecommendations: string[];
}

export interface ReviewContext {
  sessionId: number;
  lesson?: any;
  draft: Record<string, string>;
  workstationData?: any;
  practiceLabData?: any;
  startupLabData?: any;
}

export type SessionReviewEvaluator = (context: ReviewContext) => SessionReviewReport;
