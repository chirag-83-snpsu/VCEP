import fs from 'node:fs';
import path from 'node:path';

const FILE_PATH = path.resolve('/Users/yashvanthkrishnamurthy/Documents/Vayentra-Projects/VCEP/app/guided-learning/drive-edition-3.json');
const BACKUP_PATH = path.resolve('/Users/yashvanthkrishnamurthy/Documents/Vayentra-Projects/VCEP/app/guided-learning/drive-edition-3.backup.json');

console.log('--- UPDATING TRACK 3 (SESSIONS 13 TO 18) WITH APPROVED CONTENT STANDARD ---');

const sessions = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

// Ensure safe backup exists
if (!fs.existsSync(BACKUP_PATH)) {
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(sessions, null, 2));
  console.log('Created backup at:', BACKUP_PATH);
}

// ==========================================
// SESSION 13: AI for Commerce Professionals
// ==========================================
sessions[12].outcome = "Sanitize sensitive financial data under DPDP standards, structure high-precision AI prompts, and maintain an audit log of human verification.";
sessions[12].deliverable = "AI Data Protection Plan & Audited Management Brief";
sessions[12].summary = "Prepare safe AI inputs and verify business analysis without exposing confidential data.";
sessions[12].case = "A colleague proposes uploading raw customer names, banking details, and Case D financial figures into an unapproved public AI tool to draft an executive memo. Under enterprise compliance and India's Digital Personal Data Protection (DPDP) Act, exposing confidential business data violates client confidentiality and creates regulatory penalties. Your task is to establish a data sanitization protocol, formulate a constrained prompt, and retain full human ownership of the financial calculations.";
sessions[12].concept = "Enterprise AI requires choosing the task before the tool. Data minimization means redacting all identifiable entity names, account details, and private terms into synthetic role labels before prompting. An AI model generates fluent text, but fluency is never evidence of mathematical truth. In finance, every AI-generated claim must be cross-checked against immutable source ledgers, and every material assertion must be signed off by a human owner.";
sessions[12].example = "Non-compliant prompt: \"Here is Asha's bank statement showing ₹87,500; summarize why she is late.\" Compliant prompt: \"Using only the attached anonymized 3-month totals (July, August, September), draft a 120-word briefing on gross margin movement. Cite exact monthly figures. Do not extrapolate causes or invent unsupplied collection dates.\"";
sessions[12].assignment = "Construct a Data Minimization Plan identifying 3 confidential elements to redact from raw corporate records. Formulate a structured prompt with strict boundary conditions (explicit task, allowed data, zero speculation). Execute human verification on the generated draft, documenting line-by-line checks against Case D records in an AI Verification Log.";
sessions[12].support = [
  "Data Minimization Rules: 1. Replace client names with standard role labels (e.g., Customer A). 2. Strip live banking credentials. 3. Constrain model output strictly to supplied monthly figures. Offline fallback: Audit the flawed draft in Session 14."
];
sessions[12].workPrompts = [
  "Data Minimization & Redaction Plan: Identify 3 confidential items that must never be pasted into public AI models, stating the sanitization rule for each under corporate policy.",
  "Structured AI Prompt with Boundary Guards: Write the exact prompt used to instruct the model, showing role definition, source boundaries, and explicit prohibition of unverified claims.",
  "Human Verification & Audit Log: Document 3 verification checks performed on the AI output, citing source evidence from Case D to prove numerical accuracy."
];
sessions[12].squad = "Pair up as Data Preparer and Information Security Auditor. The Auditor challenges the prompt to test whether any proprietary client figures or identifiable details leak into external platforms. Measure actual minutes spent on human verification versus manual drafting.";
sessions[12].reviewRoles = "Reviewer checks that all customer identifiers are sanitized, that prompt instructions forbid hallucinated assumptions, and that every financial metric in the output is validated against Case D.";
sessions[12].reflection = "What I learned about data privacy when using generative AI, and why human verification is legally non-negotiable in corporate finance.";

// ==========================================
// SESSION 14: AI Verification and Automation
// ==========================================
sessions[13].outcome = "Audit 4 AI-generated business claims against Case D records, detect numerical hallucinations, and design automated validation checkpoints.";
sessions[13].deliverable = "AI Claim Audit Register & Corrected Executive Brief";
sessions[13].summary = "Detect unsupported AI claims and build approval checkpoints.";
sessions[13].case = "An unverified AI draft contains four confident assertions: 1. \"September revenue grew 30% over August.\" 2. \"Operating profit margin improved to 25%.\" 3. \"Receivables of ₹70,000 prove customers are paying promptly.\" 4. \"Management should offer a 20% discount to all customers to maximize profits.\" Audit all four statements against verified Case D source data and design an automated workflow that halts execution when inputs are invalid.";
sessions[13].concept = "An AI hallucination occurs when a language model states inaccurate calculations or false deductions with high linguistic confidence. Verification requires an explicit Claim Register linking every claim to its source figure, recalculation formula, audit verdict (Accurate, Misleading, or False), and factual correction. Automated workflows must enforce strict data validation: if a required field is blank or non-numeric, the workflow must visibly stop rather than proceed to generation.";
sessions[13].example = "Audit of Claim 1: Case D shows August Revenue = ₹1,20,000 and September Revenue = ₹1,50,000. Actual Growth = (₹1,50,000 − ₹1,20,000) ÷ ₹1,20,000 = 25.0%. The AI claim of 30.0% is False. Corrected assertion: \"September revenue grew by 25.0% over August, representing a ₹30,000 top-line expansion.\"";
sessions[13].assignment = "Audit all 4 AI claims against Case D in your Claim Register. Classify each claim as Accurate, Misleading, or False, providing mathematical recalculations. Draft a corrected 120-word executive memo. Specify an automated spreadsheet validation rule that halts processing if revenue data is missing or corrupted.";
sessions[13].support = [
  "The 4 AI Claims to Audit: 1. 30% revenue growth (False: actual is 25%). 2. 25% operating margin (False: actual fell from 22.5% to 20%). 3. ₹70,000 receivables prove timely payment (Misleading: receivables spiked 133%, locking cash). 4. Blanket 20% discount (False: would wipe out operating profits)."
];
sessions[13].workPrompts = [
  "AI Claim Audit Register: Audit all 4 claims, detailing the flawed assertion, the Case D source calculation, the audit verdict, and the corrected factual statement.",
  "Corrected 120-Word Executive Memo: Write a factual executive briefing replacing all hallucinated claims with verified Case D figures.",
  "Automated Validation Checkpoint Design: Describe a spreadsheet formula check (e.g., =ISNUMBER(), =COUNTBLANK()) that stops the workflow if input data is incomplete or invalid."
];
sessions[13].squad = "Conduct a fault-injection drill: intentionally set September revenue to a blank cell. The workflow must immediately trigger an alert and halt output generation rather than producing a zero-growth summary. The Quality Lead signs off only after the check triggers successfully.";
sessions[13].reviewRoles = "Reviewer confirms that all 4 flawed claims are audited with exact math from Case D, that the corrected memo does not exceed 120 words, and that the automated checkpoint prevents downstream reporting on corrupt data.";
sessions[13].reflection = "How detecting AI calculation errors changed my trust in automated summaries, and why independent verification is essential for junior analysts.";

// ==========================================
// SESSION 15: Customer and Sales Operations
// ==========================================
sessions[14].outcome = "Maintain an active CRM pipeline, compute all-lead versus closed-lead conversion rates, and prioritize overdue commercial follow-ups.";
sessions[14].deliverable = "Sales Pipeline Funnel & Prioritized Lead Action Queue";
sessions[14].summary = "Manage leads, conversion metrics, and timely commercial follow-ups.";
sessions[14].case = "Case G presents 8 customer inquiries as of 31 October 2026. Three leads are closed Won (L01, L02, L03), two are closed Lost (L04, L05), and three remain Open (L06, L07, L08). Two open leads have overdue follow-up dates (L06 due 28 Oct; L07 due 30 Oct). The sales director asks for the company conversion rate and an immediate action queue. You must clearly explain why all-lead win rate and closed-lead win rate tell different business stories.";
sessions[14].concept = "Sales operations rely on disciplined Customer Relationship Management (CRM) tracking. A conversion funnel measures efficiency across sales stages, but calculations require transparent denominators: All-Lead Win Rate (Won ÷ Total Leads) measures overall acquisition efficiency, while Closed-Lead Win Rate (Won ÷ Closed Leads) measures negotiation closing effectiveness. Leaving undecided leads open indefinitely inflates pipeline projections and obscures sales bottlenecks.";
sessions[14].example = "In Case G: Total Leads = 8. Closed Leads = 3 (Won) + 2 (Lost) = 5. Open Leads = 3. All-Lead Win Rate = 3 ÷ 8 = 37.5%. Closed-Lead Win Rate = 3 ÷ 5 = 60.0%. Both percentages are valid, but confusing them misleads management on team closing capability.";
sessions[14].assignment = "Construct a CRM Pipeline Schedule for leads L01 to L08, recording stage, owner, next action, and due date. Calculate the All-Lead Win Rate (37.5%) and Closed-Lead Win Rate (60.0%). Identify the 2 overdue open leads as of 31 October and formulate prioritized follow-up actions with draft client outreach messages.";
sessions[14].support = [
  "Case G Summary: 8 Leads total. Closed: 3 Won (L01, L02, L03), 2 Lost (L04, L05). Open: L06 (due 28 Oct, OVERDUE), L07 (due 30 Oct, OVERDUE), L08 (due 03 Nov, On Track). As-of Date: 31 October 2026."
];
sessions[14].workPrompts = [
  "Funnel Conversion Rates & Denominator Analysis: Calculate All-Lead Win Rate (37.5%) and Closed-Lead Win Rate (60.0%), explaining why reporting closed-lead rate alone overstates pipeline velocity.",
  "Overdue Lead Priority Queue: List the 2 overdue leads (L06 and L07) as of 31 October, detailing the days overdue, assigned owner, and immediate operational remedy.",
  "Client Re-engagement Messages: Draft two professional client follow-up messages tailored to the specific business needs expressed in leads L06 and L07."
];
sessions[14].squad = "Roleplay as Sales Lead and Operations Coordinator. The Sales Lead wants to classify all 3 open leads as \"Probable Wins\" to meet quarterly forecast quotas. The Operations Coordinator must push back using Case G evidence, explaining why overdue actions indicate stalled interest requiring immediate re-qualification.";
sessions[14].reviewRoles = "Reviewer verifies accurate calculation of both conversion rates with stated formulas, checks that L06 and L07 are flagged as overdue against the 31 October baseline, and evaluates the professional tone of follow-up drafts.";
sessions[14].reflection = "What I learned about sales pipeline discipline, and why transparent funnel metrics prevent inaccurate revenue forecasting.";

// ==========================================
// SESSION 16: Commercial Decision Making
// ==========================================
sessions[15].outcome = "Calculate unit contribution and break-even volume, evaluate a 10% volume discount proposal, and formulate an evidence-backed commercial decision.";
sessions[15].deliverable = "Commercial Decision Memo & Break-Even Evaluation";
sessions[15].summary = "Analyze unit contribution, fixed overheads, and capacity constraints under discount proposals.";
sessions[15].case = "A corporate client offers to purchase your maximum operating capacity of 30 seats if granted a 10% volume discount across all seats. Policy baseline: Standard Unit Price = ₹10,000; Variable Cost per seat = ₹4,000; Fixed Operating Costs = ₹1,20,000; Current volume = 25 seats; Maximum physical capacity = 30 seats. Sales argues the deal should be accepted immediately because revenue will expand from ₹2,50,000 to ₹2,70,000. Management requests an objective commercial profitability evaluation.";
sessions[15].concept = "Commercial decisions evaluate incremental contribution rather than top-line revenue. Unit Contribution (Selling Price − Variable Cost) measures the cash generated per unit to pay fixed overheads. Break-Even Volume = Fixed Costs ÷ Unit Contribution. When operating at or near maximum capacity, discounting unit price reduces contribution margin. If variable costs remain unchanged, volume gains may generate zero additional profit while eliminating operational headroom and increasing delivery risk.";
sessions[15].example = "Baseline (25 seats @ ₹10k): Unit Contribution = ₹6,000. Total Contribution = 25 × ₹6,000 = ₹1,50,000. Net Profit = ₹1,50,000 − ₹1,20,000 = ₹30,000. Discounted Proposal (30 seats @ ₹9k): Unit Contribution = ₹9,000 − ₹4,000 = ₹5,000. Total Contribution = 30 × ₹5,000 = ₹1,50,000. Net Profit = ₹1,50,000 − ₹1,20,000 = ₹30,000. Profit is identical, but the company exhausts 100% capacity!";
sessions[15].assignment = "Calculate baseline and proposed Unit Contribution, Break-Even Volume, Total Revenue, and Net Profit. Prepare a comparative commercial matrix. Write a 120-word commercial recommendation memo stating whether to accept, reject, or counter-propose the client offer, establishing one non-negotiable condition for approval.";
sessions[15].support = [
  "Key Equations: Break-Even = ₹1,20,000 ÷ Unit Contribution. Baseline: Price ₹10k, Contribution ₹6k, Break-even 20 seats, Profit ₹30k. Proposed: Price ₹9k, Contribution ₹5k, Break-even 24 seats, Profit ₹30k. Incremental profit from 5 extra seats = ₹0."
];
sessions[15].workPrompts = [
  "Comparative Commercial Matrix: Present side-by-side metrics for baseline (25 seats) versus discounted proposal (30 seats), detailing Unit Price, Contribution Margin, Total Revenue, Fixed Costs, and Net Profit.",
  "Commercial Recommendation Memo: State your decision (Reject or Counter) in 120 words, explaining why expanding to 100% capacity for ₹0 incremental profit violates sound business management.",
  "Counter-Proposal Strategy & Margin Protection: Propose an alternative commercial structure (e.g., 10% discount on incremental seats only, or minimum 3-month contract commitment) that protects operating margin."
];
sessions[15].squad = "Debate between Sales Manager and Finance Controller. The Sales Manager argues: \"Revenue increases by ₹20,000, which looks great for market share!\" The Controller demonstrates that every extra seat carries delivery cost and operational strain without adding a single rupee of profit, proposing a tiered pricing structure instead.";
sessions[15].reviewRoles = "Reviewer confirms that break-even volumes are calculated correctly (20 seats baseline vs 24 seats proposed), verifies that incremental profit is recognized as ₹0, and evaluates the business feasibility of the counter-proposal.";
sessions[15].reflection = "How unit contribution analysis taught me that higher sales volume can sometimes destroy business value, and how to negotiate commercial contracts effectively.";

// ==========================================
// SESSION 17: Industry Challenge Discovery
// ==========================================
sessions[16].outcome = "Conduct a structured client discovery interview, translate stakeholder complaints into measurable problem statements, and map data boundary conditions.";
sessions[16].deliverable = "Capstone Discovery Brief & Business Problem Statement";
sessions[16].summary = "Interview stakeholders and define a measurable business problem.";
sessions[16].case = "The founder of Vayentra Labs reports: \"I have no real-time visibility into cash flow or unpaid invoices, and our collections team is flying blind. I need an executive dashboard.\" Available source records include the Case F Receivables Ledger (4 invoices, ₹1,00,000 outstanding) and Case G CRM Inquiries. Crucially, there is no verified primary key connecting sales leads to accounting invoices. Your capstone project must deliver a reliable 7-day cash visibility and receivables aging solution within 10 working days, using no more than 6 individual student hours.";
sessions[16].concept = "Discovery interviews separate perceived symptoms from underlying operational causes. Stakeholders often request technical tools (\"We need AI\" or \"Build a dashboard\") when the underlying root cause is disorganized data or missing process ownership. A professional business problem statement follows a 5-element framework: User Persona → Measurable Problem → Root Cause Evidence → Business Consequence → Quantifiable Success Metric. Assumptions must be documented explicitly before designing a solution.";
sessions[16].example = "Flawed statement: \"The client needs a cool automated dashboard to fix finance.\" Professional statement: \"The managing director lacks visibility into ₹1,00,000 in outstanding customer receivables, risking a ₹20,000 liquidity shortfall on upcoming payroll. We will deliver a verified aging schedule and 7-day cash forecast reconciling to Case F within 10 working days.\"";
sessions[16].assignment = "Formulate 8 structured discovery questions across user needs, data sources, constraints, and success criteria. Document findings from the simulated client interview. Draft a crisp 80-word business problem statement. Identify 3 critical project assumptions and state explicit data boundary exclusions (e.g., no join between Case F and Case G).";
sessions[16].support = [
  "Capstone Constraints: 10 working days delivery window. Maximum 6 hours extra individual time per student. Immutable baseline: Case F version 1 records (₹1,00,000 receivables, ₹25,000 bank, ₹45,000 payments). No live database writes authorized."
];
sessions[16].workPrompts = [
  "Structured Discovery Interview Record: Document 8 discovery questions and findings covering user roles, process bottlenecks, data limitations, and required outputs.",
  "80-Word Business Problem Statement: Define the commercial challenge using the Persona → Problem → Evidence → Consequence → Success Metric framework.",
  "Project Boundary & Data Exclusions Log: Identify 3 critical business assumptions and define explicit out-of-scope boundaries to protect project delivery."
];
sessions[16].squad = "Roleplay as Lead Business Analyst and Managing Director. The Director attempts to expand project scope by asking for automatic payment gateways and customer SMS reminders. The Analyst must professionally establish project boundaries, focusing on core receivables visibility within the 10-day timeline.";
sessions[16].reviewRoles = "Reviewer checks that the problem statement does not exceed 80 words, contains all 5 required elements, and explicitly notes that Case F invoices cannot be joined to Case G leads without customer master keys.";
sessions[16].reflection = "What I learned about framing business problems effectively, and how discovery interviews prevent scope creep and project failure.";

// ==========================================
// SESSION 18: Solution Design and Project Planning
// ==========================================
sessions[17].outcome = "Compare architectural solution options, construct a 10-day Work Breakdown Structure (WBS), and define 5 testable acceptance criteria.";
sessions[17].deliverable = "Solution Architecture & 10-Day Project Charter";
sessions[17].summary = "Plan a feasible solution with owners and acceptance tests.";
sessions[17].case = "Continuing the Capstone Challenge for Vayentra Labs: You must design a delivery plan to construct the receivables aging model, 7-day cash flow scenario, and timing exception log within 10 working days. Student effort is strictly capped at 6 additional hours per member. You must compare an integrated spreadsheet model against a slide-only briefing, select the optimal delivery approach, assign individual task owners with RACI designations, and define five testable acceptance criteria.";
sessions[17].concept = "Project planning bridges business requirements to practical execution. A Work Breakdown Structure (WBS) decomposes a project into manageable work packages, each with an assigned owner, time estimate, and delivery dependency. Acceptance criteria establish binary (pass/fail) quality conditions that must be demonstrated before client sign-off. A RACI matrix clarifies role governance: Responsible (does work), Accountable (owns outcome), Consulted (provides input), and Informed (receives updates). Scope discipline ensures delivery on time and within budget.";
sessions[17].example = "Vague criterion: \"The cash view should be accurate.\" Testable acceptance criterion: \"The 7-day cash forecast incorporates ₹25,000 opening bank balance, deducts ₹45,000 mandatory payments, adds targeted collections, and demonstrates closing liquidity with ₹0 unexplained variance.\"";
sessions[17].assignment = "Evaluate Solution Option A (Dynamic Spreadsheet Workstation) versus Option B (Static Slide Presentation), documenting 3 comparative evaluation factors. Construct a 10-day Work Breakdown Schedule allocating tasks within the 6-hour individual student cap. Define 5 testable acceptance criteria covering Case F reconciliation, aging buckets, dispute quarantine, and handover.";
sessions[17].support = [
  "Solution Criteria: 1. Case F reconciliation control total = ₹1,00,000. 2. Due-today invoice (F01) classified as Current. 3. Disputed ₹5,000 isolated into suspense. 4. 7-day cash forecast balances. 5. Total hours <= 6 per student over 10 days."
];
sessions[17].workPrompts = [
  "Solution Architecture Evaluation: Compare Option A (Dynamic Spreadsheet) vs Option B (Static Presentation), justifying your selected solution on user utility, auditability, and delivery feasibility.",
  "Ten-Day Work Breakdown Schedule & RACI: Present the task schedule specifying task name, owner, RACI designation, estimated hours (<= 6 hrs/member), and sequential dependencies.",
  "Five Testable Acceptance Criteria: Define 5 pass/fail quality benchmarks that the client must inspect and verify before signing off on project completion."
];
sessions[17].squad = "Hold a formal project governance meeting. Review individual hour allocations to ensure no squad member exceeds the 6-hour limit. Reviewer tests that each of the 5 acceptance criteria can be evaluated with a simple binary pass/fail test.";
sessions[17].reviewRoles = "Reviewer checks that the schedule accounts for dependencies, verifies student hours sum to <= 6 hours per member, and confirms acceptance criteria are unambiguous and testable.";
sessions[17].reflection = "What I learned about project scoping and work breakdown structures, and how clear acceptance criteria ensure professional client alignment.";

// Write back to file
fs.writeFileSync(FILE_PATH, JSON.stringify(sessions, null, 2), 'utf8');
console.log('Successfully updated Sessions 13 to 18 in drive-edition-3.json!');
