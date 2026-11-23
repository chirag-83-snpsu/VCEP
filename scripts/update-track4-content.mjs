import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve('app/guided-learning/drive-edition-3.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const track4Updates = [
  // Session 19
  {
    id: 19,
    title: 'Project Execution and Quality Assurance',
    outcome: 'Execute 5 binary acceptance tests, verify formula integrity, and document individual contributions.',
    deliverable: 'Audited Model v1.0 & Quality Test Log',
    case: 'Continuing the Vayentra Labs Capstone: Ingest Case F version 1 into your receivables model. The as-of date is 31 October 2026. You must execute five quality assurance tests covering normal and failure cases, verify date boundary classifications, audit formula references, and record individual squad contributions.',
    concept: 'Quality Assurance (QA) verifies that financial models calculate accurately and handle edge cases gracefully. A structured test log records Test ID, Input, Expected Result, Actual Result, and Pass/Fail Verdict. An exception must remain visible with an auditable resolution rather than being hidden in calculations.',
    example: 'Date Boundary Test: Invoice F01 due on 31 October must classify as Current. Shifting the as-of date to 1 November must automatically move F01 into 1–30 Days Overdue while maintaining the ₹1,00,000 control total with ₹0 variance.',
    assignment: 'Verify Case F version 1 against the 5 acceptance criteria. Execute date boundary sensitivity tests for 31 October vs 1 November. Complete the Excel QA audit checklist (data types, formula consistency, circular references) and document your individual contribution log.',
    support: [
      'Quality Gates: 1. Case F control total = ₹1,00,000. 2. Due-today F01 classified as Current. 3. As-of date parameter refreshes aging buckets dynamically. 4. Disputed ₹5,000 isolated in suspense. 5. Individual effort <= 6 hours.'
    ],
    squad: 'Hold a quality assurance review. Each member must independently execute the 5 acceptance tests on another member’s workbook, log any formula errors or circular references, and verify the before-and-after correction.',
    reviewRoles: 'Reviewer verifies all 5 acceptance tests pass with objective evidence, checks for formula consistency, and confirms individual contributions are explicitly attributed.',
    aiPrompt: 'Provide an Excel quality assurance checklist for financial models. Include tests for circular references, date boundary logic, dynamic formulas, and error-handling functions. Do not modify the underlying financial data.',
    aiPolicy: 'Use approved AI tools only to audit formula logic and review test coverage. All calculations and test executions must be performed independently on source records. No AI during assessment gates.',
    summary: 'Test formula logic, verify edge cases, and log quality evidence.'
  },
  // Session 20
  {
    id: 20,
    title: 'Management Review and Change Control',
    outcome: 'Assess an approved change request, update the model from v1.0 to v2.0, and maintain an auditable change log.',
    deliverable: 'Revised Model v2.0 & Change Control Log',
    case: 'Management approves two operational changes as of 31 October: 1. Issue an approved ₹5,000 credit note against Beacon Logistics invoice F02 (reducing outstanding to ₹15,000). 2. Reschedule ₹8,000 in supplier payments beyond the 7-day window (reducing 7-day outflows from ₹45,000 to ₹37,000). No customer cash has been collected. You must update Model v1.0 to Model v2.0 while preserving version history.',
    concept: 'Change control ensures model revisions are authorized, traceable, and audited. A credit note reduces receivables; it does not generate bank cash. A payment deferral alters cash outflow timing, reducing short-term liquidity strain without altering total expenses. Version discipline requires saving Model v1.0 and branching to Model v2.0.',
    example: 'Credit Note Impact: Beacon F02 reduces from ₹20,000 to ₹15,000. Total receivables decrease to ₹95,000. Cash remains ₹25,000. 7-day outflows drop from ₹45,000 to ₹37,000, shrinking the net liquidity deficit from ₹20,000 to ₹12,000.',
    assignment: 'Construct the Change Control Log documenting authority, business reason, and quantitative impact. Update the model to Version 2.0, recalculate receivables buckets and 7-day liquidity, retest all 5 quality controls, and draft an executive briefing memo.',
    support: [
      'Approved Changes: 1. ₹5,000 credit note on F02 (Beacon). 2. ₹8,000 supplier payment deferral past Day 7. Net effect: Receivables = ₹95,000; 7-day outflows = ₹37,000; liquidity deficit shrinks from ₹20,000 to ₹12,000.'
    ],
    squad: 'Conduct a formal Change Control Board meeting. Verify that Version 1.0 is preserved as an immutable baseline, confirm the ₹5,000 credit note is not misclassified as cash received, and audit the revised 7-day cash schedule.',
    reviewRoles: 'Reviewer verifies the Change Log records approval authority, confirms receivables control total equals ₹95,000, and verifies the ₹8,000 deferral accurately recalculates 7-day closing liquidity.',
    aiPrompt: 'Draft a change impact note explaining how a ₹5,000 customer credit note and an ₹8,000 supplier payment deferral affect receivables, cash balances, and 7-day liquidity. Emphasize that credit notes do not inject cash.',
    aiPolicy: 'Use approved AI tools only to structure change memos. Verify all numerical changes against approved instructions. Retain separate Version 1.0 and Version 2.0 workbooks.',
    summary: 'Manage change requests, branch versions, and maintain an audit trail.'
  },
  // Session 21
  {
    id: 21,
    title: 'Resume and Portfolio Development',
    outcome: 'Transform verified course deliverables into impact-driven resume bullets and an evidence-linked portfolio index.',
    deliverable: 'Professional Resume Bullets & Portfolio Index',
    case: 'Undergraduate commerce resumes frequently make inflated, unverified claims (e.g. \"managed corporate accounts and boosted profit 40%\") that fail corporate background verification. You must translate your authentic VCEP project artifacts into verified, high-impact bullet points using the Google XYZ formula: Accomplished [X] as measured by [Y] by doing [Z].',
    concept: 'Corporate recruiters value verifiable evidence over vague self-praise. A professional resume item articulates the specific business task, quantitative scale, technical methodology, and verified business outcome. A portfolio index provides direct clickable links or document IDs for every claim.',
    example: 'Vague claim: \"Assisted with corporate accounting and reports.\" Professional XYZ bullet: \"Constructed a 4-account receivables aging model reconciling ₹1,00,000 in overdue invoices with zero variance, isolating ₹5,000 in disputed billings and averting a ₹20,000 payroll deficit.\"',
    assignment: 'Draft 3 evidence-backed resume bullets following the XYZ formula across Financial Modeling, Ledger Reconciliation, and AI Compliance. Build a 6-artifact portfolio index with document IDs and write a 90-word professional executive summary.',
    support: [
      'Portfolio Artifacts: 1. S07 Cleaned Ledger (₹44k reconciliation). 2. S08 Bank Rec (₹83.2k adjusted cash). 3. S10 MIS Dashboard (KPI matrix). 4. S11 GST Audit (GSTR-2B match). 5. S14 AI Verification (4 claims). 6. S18 Project Charter (WBS).'
    ],
    squad: 'Hold a peer resume audit. Audit each bullet point against the Anti-Inflation Standard. Challenge any assertion that cannot be verified with a specific VCEP deliverable ID and recalculation proof.',
    reviewRoles: 'Reviewer verifies all resume bullets adhere to the XYZ formula, checks that claims reference verified simulation artifacts, and confirms the professional summary is strictly <= 90 words.',
    aiPrompt: 'Convert the following verified accounting deliverables into 3 professional resume bullets using Google XYZ format: Accomplished [X] as measured by [Y] by doing [Z]. Highlight reconciliation, compliance, and governance without inflating authority.',
    aiPolicy: 'Use approved AI tools to refine phrasing and grammar. Every numerical claim must link to an actual VCEP project deliverable. Fictitious or unverified work experience is strictly prohibited.',
    summary: 'Build an evidence-linked resume and verifiable portfolio index.'
  },
  // Session 22
  {
    id: 22,
    title: 'Hiring Simulation and Exit Assessment',
    outcome: 'Complete the independent 60-minute Exit B practical assessment and defend reasoning in a structured technical viva.',
    deliverable: 'Exit Assessment B & Technical Interview Defense',
    case: 'You have 60 minutes to complete the unseen individual Exit B assessment under formal examination conditions. All AI assistance, external search, and peer collaboration are strictly locked. Following submission, you will defend your calculations, methodology, and ethical judgment in a 10-minute structured corporate interview.',
    concept: 'A technical interview tests practical competency under pressure. Recruiters evaluate your problem-solving method, error-handling transparency, and ethical resilience. Professional integrity requires acknowledging limitations and refusing to falsify or hide reconciliation discrepancies.',
    example: 'Technical Viva Defense: When asked why advance customer payments are liabilities, state: \"Advance collections represent unfulfilled performance obligations under Ind AS 115. They cannot be recognized as revenue until deliverables are accepted by the client.\"',
    assignment: 'Execute the timed Exit B assessment independently. Prepare defense responses for 5 core technical viva scenarios (accounting classification, bank timing differences, win-rate metrics, unit economics, and reporting ethics). Draft a 30-day post-assessment capability plan.',
    support: [
      'Controlled Conditions: 60-minute unseen practical examination. AI tools and peer consultation are strictly locked. Evaluated on execution accuracy, conceptual justification, and professional communication.'
    ],
    squad: 'Simulate the technical hiring panel. One student acts as Candidate defending their submission, while two squad members act as Technical Interviewers challenging assumptions, testing edge cases, and probing ethical boundaries.',
    reviewRoles: 'Faculty and external assessors evaluate independent execution, mathematical precision, conceptual clarity, and verbal technical defense without notes.',
    aiPrompt: '',
    aiPolicy: 'Strict server-side AI lockout. No generative AI, automated assistance, or internet searching permitted during Exit B assessment or the technical interview viva.',
    summary: 'Demonstrate independent mastery and defend technical reasoning.'
  },
  // Session 23
  {
    id: 23,
    title: 'Corporate Presentation Preparation',
    outcome: 'Structure a 6-slide executive deck, rehearse a 7-minute squad briefing with a 3-minute live demo, and prepare defense responses.',
    deliverable: '6-Slide Executive Deck & 7-Minute Pitch Plan',
    case: 'Your squad must deliver a 7-minute executive presentation to the Managing Director and Board of Vayentra Labs, followed by 8 minutes of technical questions. Exactly 3 minutes of your presentation must be dedicated to a live, working demonstration of Model v2.0. Every squad member must own and defend a distinct technical section.',
    concept: 'Executive presentations persuade through evidence, structure, and live verification. Senior leaders require concise briefings: Problem Context (1 min) → Methodology & Evidence (1 min) → Live Model Demo (3 min) → Commercial Counter-Proposal (1 min) → Governance & Boundaries (1 min).',
    example: 'Live Demo Script: \"Notice that when we change the as-of date to 1 November, invoice F01 shifts from Current to 1–30 Days Overdue, triggering an automated collection alert without altering the ₹95,000 control total.\"',
    assignment: 'Develop a 6-slide executive presentation following the standard VCEP corporate deck structure. Script the 3-minute live demonstration of Model v2.0, assign individual speaking roles with precise time budgets, and formulate responses to 3 tough reviewer challenge questions.',
    support: [
      'Presentation Guidelines: Total time = 7 minutes (strictly enforced). Live demo = exactly 3 minutes. Slides = maximum 6 slides. Followed by 8 minutes of panel questions. Every squad member must speak.'
    ],
    squad: 'Conduct a timed dry run of the 7-minute presentation with a live stopwatch. Enforce the 3-minute demonstration window and practice smooth speaker handoffs. Panel members ask three hostile challenge questions to test squad depth.',
    reviewRoles: 'Reviewer verifies the 6-slide deck covers all mandatory components, confirms the live demo fits within the 3-minute budget, and tests individual student speaking contributions.',
    aiPrompt: 'Create a 6-slide corporate presentation outline for a receivables aging model and liquidity forecast. Include slide headings, 3 bullet points per slide, speaker allocation, and a 3-minute live demo script. Do not exceed 6 slides.',
    aiPolicy: 'Use approved AI tools only to refine slide typography and rehearse presentation timing. All demonstrated data and calculations must originate from verified Model v2.0 records.',
    summary: 'Prepare a 6-slide deck and rehearse a 7-minute executive briefing.'
  },
  // Session 24
  {
    id: 24,
    title: 'Corporate Demo Day and Industry Passport',
    outcome: 'Deliver the final executive briefing to external judges, defend individual deliverables, and complete the Industry Passport competency record.',
    deliverable: 'Verified Industry Passport & 90-Day Career Plan',
    case: 'Demo Day: External corporate evaluators and industry practitioners assess your capstone delivery, challenge model assumptions, and conduct a 2-minute individual defense station for each candidate. Successful completion unlocks your verified VCEP Industry Passport credential and competency transcript.',
    concept: 'The VCEP Industry Passport is a competency-based professional transcript validating demonstrated workplace capabilities. Unlike traditional certificates of completion, the Passport records verifiable artifact IDs, objective scorecards, faculty sign-offs, and explicit skill boundaries.',
    example: 'Passport Competency Verification: \"Financial Modeling & Ledger Close: Independently demonstrated on Case F with zero variance; BRS timing bridge verified; AI verification log audit complete. Artifact IDs: S07-REC, S08-BRS, S18-WBS.\"',
    assignment: 'Deliver your final executive presentation on Demo Day and defend your individual contribution station. Review and verify your Industry Passport competency transcript, and formulate a concrete 90-day post-programme career acceleration plan.',
    support: [
      'Demo Day Protocol: 7-minute presentation + 8-minute Q&A before external panel. 2-minute individual viva defense per student. Final sign-off on 6 core competencies in the official Industry Passport.'
    ],
    squad: 'Participate in Demo Day as a cohesive corporate squad. Support teammates during panel questioning while ensuring each member independently defends their assigned technical domain and deliverables.',
    reviewRoles: 'External industry evaluators and faculty conduct independent scoring across Execution, Reasoning, Communication, and Professional Process, certifying final Industry Passport competency badges.',
    aiPrompt: 'Structure a 90-day post-graduation professional development plan for a commerce graduate specializing in financial analysis and AI-augmented accounting. Organize into 30-day, 60-day, and 90-day milestones with measurable portfolio goals.',
    aiPolicy: 'Use approved AI tools to explore professional certification pathways and structure 90-day action plans. The Industry Passport competency record reflects authentic, faculty-verified performance only.',
    summary: 'Present to external judges and verify your professional Industry Passport.'
  }
];

for (const update of track4Updates) {
  const index = update.id - 1;
  data[index] = {
    ...data[index],
    title: update.title,
    outcome: update.outcome,
    deliverable: update.deliverable,
    case: update.case,
    concept: update.concept,
    example: update.example,
    assignment: update.assignment,
    support: update.support,
    squad: update.squad,
    reviewRoles: update.reviewRoles,
    aiPrompt: update.aiPrompt,
    aiPolicy: update.aiPolicy,
    summary: update.summary,
    track: 4
  };
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated Track 4 (Sessions 19 to 24) in drive-edition-3.json!');
