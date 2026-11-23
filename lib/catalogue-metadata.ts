/**
 * Safe public curriculum metadata.
 * Contains only titles, tracks and short outcome summaries.
 * Full case briefs, financial data, working tables, AI prompts
 * and rubrics are protected server-side in lib/guided-content.server.ts.
 */

export type SafeSessionMeta = {
  id: number;
  title: string;
  track: number;
  minutes: number;
  summary: string;
};

export const driveSummaries: Record<number, string> = {
  1: 'Discover how real businesses grow, then build your own startup idea.',
  2: 'Introduce yourself professionally and make verifiable teamwork commitments.',
  3: 'Clarify vague requests and communicate business risks without guessing.',
  4: 'Run purposeful meetings and record decisions, owners and deadlines.',
  5: 'Turn source documents into correct journal entries with evidence.',
  6: 'Close accounts, correct ledger errors and validate financial statements.',
  7: 'Clean messy records without losing evidence or hiding exceptions.',
  8: 'Reconcile book and bank balances using supported adjustments.',
  9: 'Evaluate growth, margins and receivables using verified figures.',
  10: 'Build a dashboard that helps managers make better decisions.',
  11: 'Review invoices and tax calculations using supplied case assumptions.',
  12: 'Prioritise collections and forecast cash without assuming promised payments.',
  13: 'Prepare safe AI inputs and verify business analysis.',
  14: 'Detect unsupported AI claims and build approval checkpoints.',
  15: 'Manage leads, conversion metrics and timely sales follow-ups.',
  16: 'Compare discounts, contribution and capacity before recommending prices.',
  17: 'Interview stakeholders and define a measurable business problem.',
  18: 'Plan a feasible solution with owners and acceptance tests.',
  19: 'Build and test a prototype using traceable business records.',
  20: 'Handle approved changes without destroying earlier versions or evidence.',
  21: 'Turn genuine project evidence into honest resume achievements.',
  22: 'Demonstrate independent ability through a controlled assessment and interview.',
  23: 'Prepare a credible business demonstration backed by tested evidence.',
  24: 'Defend your work and audit your competency record.',
};

export const safeCatalogue: SafeSessionMeta[] = [
  { id: 1, title: 'Start a Business. Think Like a Founder.', track: 1, minutes: 135, summary: driveSummaries[1] },
  { id: 2, title: 'Professional Identity and Teamwork', track: 1, minutes: 135, summary: driveSummaries[2] },
  { id: 3, title: 'Workplace Communication', track: 1, minutes: 135, summary: driveSummaries[3] },
  { id: 4, title: 'Meetings and Reporting', track: 1, minutes: 135, summary: driveSummaries[4] },
  { id: 5, title: 'Accounting Transactions', track: 1, minutes: 135, summary: driveSummaries[5] },
  { id: 6, title: 'Ledger and Month End Close', track: 1, minutes: 135, summary: driveSummaries[6] },
  { id: 7, title: 'Excel and Data Cleaning', track: 2, minutes: 135, summary: driveSummaries[7] },
  { id: 8, title: 'Bank Reconciliation', track: 2, minutes: 135, summary: driveSummaries[8] },
  { id: 9, title: 'Business Finance and Performance', track: 2, minutes: 135, summary: driveSummaries[9] },
  { id: 10, title: 'MIS Dashboard Development', track: 2, minutes: 135, summary: driveSummaries[10] },
  { id: 11, title: 'GST and Invoice Review', track: 2, minutes: 135, summary: driveSummaries[11] },
  { id: 12, title: 'Receivables and Working Capital', track: 2, minutes: 135, summary: driveSummaries[12] },
  { id: 13, title: 'AI for Commerce Professionals', track: 3, minutes: 135, summary: driveSummaries[13] },
  { id: 14, title: 'AI Verification and Automation', track: 3, minutes: 135, summary: driveSummaries[14] },
  { id: 15, title: 'Customer and Sales Operations', track: 3, minutes: 135, summary: driveSummaries[15] },
  { id: 16, title: 'Commercial Decision Making', track: 3, minutes: 135, summary: driveSummaries[16] },
  { id: 17, title: 'Industry Challenge Discovery', track: 3, minutes: 135, summary: driveSummaries[17] },
  { id: 18, title: 'Solution Design and Project Planning', track: 3, minutes: 135, summary: driveSummaries[18] },
  { id: 19, title: 'Project Execution and Quality Assurance', track: 4, minutes: 135, summary: driveSummaries[19] },
  { id: 20, title: 'Management Review and Change Control', track: 4, minutes: 135, summary: driveSummaries[20] },
  { id: 21, title: 'Resume and Portfolio Development', track: 4, minutes: 135, summary: driveSummaries[21] },
  { id: 22, title: 'Hiring Simulation and Exit Assessment', track: 4, minutes: 135, summary: driveSummaries[22] },
  { id: 23, title: 'Corporate Presentation Preparation', track: 4, minutes: 135, summary: driveSummaries[23] },
  { id: 24, title: 'Corporate Demo Day and Industry Passport', track: 4, minutes: 135, summary: driveSummaries[24] },
];
