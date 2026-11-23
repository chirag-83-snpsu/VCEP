import fs from 'node:fs';
import path from 'node:path';

const FILE_PATH = path.resolve('/Users/yashvanthkrishnamurthy/Documents/Vayentra-Projects/VCEP/app/guided-learning/drive-edition-3.json');
const BACKUP_PATH = path.resolve('/Users/yashvanthkrishnamurthy/Documents/Vayentra-Projects/VCEP/app/guided-learning/drive-edition-3.backup.json');

console.log('--- UPDATING TRACK 1 (SESSIONS 01 TO 06) WITH APPROVED CONTENT STANDARD ---');

const sessions = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

// 1. Create a safe backup if not already present
if (!fs.existsSync(BACKUP_PATH)) {
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(sessions, null, 2));
  console.log('Created backup at:', BACKUP_PATH);
}

// ==========================================
// SESSION 01: Start a Business. Think Like a Founder.
// ==========================================
sessions[0].outcome = "Discover how real businesses generate cash, build your venture model, and make high-stakes financial decisions in a simulated boardroom crisis.";
sessions[0].deliverable = "Startup Launch Canvas & Boardroom Crisis Decision Record";
sessions[0].concept = "In business, profit and cash flow are not the same thing. Revenue measures value earned from sales, while cash receipts reflect actual money deposited in your bank. A company can report strong accounting profits but still face bankruptcy if customer payments are delayed. Every operational handoff requires a clear owner, documented evidence, and an approval check.";
sessions[0].case = "Vayentra Labs delivers business consulting services. In September, the company earns ₹1,00,000 in revenue and incurs ₹75,000 in operating expenses. Clients pay ₹60,000 towards their invoices; cash paid out for expenses is ₹70,000. Opening bank balance is ₹20,000. An operations manager proposes spending the entire ₹25,000 accounting profit on new office equipment.";
sessions[0].example = "A project earns ₹8,000 on credit with ₹3,000 of immediate supplier costs. While accounting profit is ₹5,000 (₹8,000 − ₹3,000), immediate cash movement is negative ₹3,000 until the client actually settles the invoice.";
sessions[0].assignment = "Calculate September net profit, net cash movement, and closing bank balance. Map the 5-step process handoff from client order to cash receipt. Determine whether a ₹15,000 vendor payment can be made while maintaining a mandatory ₹5,000 emergency cash reserve.";
sessions[0].support = [
  "The 6-stage Startup Journey guides you through Founder Mindset, Startup Stories, Opportunity Discovery, Startup Canvas, Crisis Management, and Investor Pitch Deck."
];
sessions[0].workPrompts = [
  "Profit vs Cash Flow Breakdown: Calculate net profit, net cash movement, and closing bank balance.",
  "Process Handoff Map: Identify 3 critical failure points between order delivery and invoice collection, and name the owner responsible for preventing them.",
  "Payment Decision & Safety Reserve: Recommend whether to approve the ₹15,000 vendor payment, showing how your decision protects the ₹5,000 minimum bank reserve."
];
sessions[0].squad = "Assign 4 executive roles: Sales, Delivery, Finance, and Quality Review. The Finance Lead has 60 seconds to present to the team whether the ₹15,000 payment can be made without breaching the ₹5,000 safety reserve.";
sessions[0].reviewRoles = "Evaluator audits mathematical consistency between profit (₹25,000) and closing bank balance (₹10,000), and checks that the ₹5,000 emergency reserve is strictly respected.";
sessions[0].aiPolicy = "Use AI tools only to explore industry benchmarks. Check every calculation against source records. No AI during controlled assessments or individual defense.";
sessions[0].reflection = "What I discovered about the difference between accounting profit and real cash, and how I will apply this in corporate financial analysis.";

// ==========================================
// SESSION 02: Professional Identity and Teamwork
// ==========================================
sessions[1].outcome = "Deliver a 90-second campus placement introduction, distribute corporate roles across your squad, and establish binding accountability standards.";
sessions[1].deliverable = "Professional Profile and Squad Charter";
sessions[1].concept = "High-performing corporate teams run on clear ownership rather than informal friendships. Accountability means one individual owns a deliverable and confirms its quality before submission. A reviewer audits work for accuracy but does not relieve the owner of responsibility. Teamwork fairness is evaluated by documented, verifiable contributions rather than speaking time in meetings.";
sessions[1].case = "You join a 5-member project team with real-world constraints: two students share one laptop, one student commutes 90 minutes daily, and a reviewer is absent on submission day. Management requires an approved financial file submitted by 18:00 sharp, with an escalation update provided before any deadline is missed.";
sessions[1].example = "A professional commitment reads: \"I own receipt matching for Batch A. I will submit the match log by 17:00, and will escalate any missing invoice numbers to the team coordinator by 15:00.\"";
sessions[1].assignment = "Draft a 90-second professional introduction highlighting one verified technical skill for campus recruiters. Build a Team Charter specifying role owners, reviewer pairings, response turnaround windows, file naming conventions, and an emergency backup protocol for absent members.";
sessions[1].support = [
  "Use the Team Charter Builder in the interactive workstation to assign roles, schedule laptop sharing time, and configure your emergency backup protocols."
];
sessions[1].workPrompts = [
  "90-Second Professional Introduction: State your academic degree, your core technical capability (e.g., Excel/Ledgers), and the specific entry-level role you can perform.",
  "Ownership & Emergency Backup Protocol: Specify the action taken if a reviewer is absent at 16:30 for an 18:00 deadline.",
  "Team Charter Commitments & Rotation Schedule: Document the 5 squad roles, keyboard sharing schedule (20 mins/student), and communication SLA."
];
sessions[1].squad = "Allocate 5 core roles: Coordinator, Finance Lead, Data Lead, Client Communications Lead, and Quality Reviewer. Plan a device-sharing rotation that ensures each member gets at least 20 minutes of hands-on keyboard time during the session.";
sessions[1].reviewRoles = "Reviewer checks that the charter specifies a clear escalation time (16:30) and that laptop time is equitably distributed across all members.";
sessions[1].reflection = "How I demonstrated individual ownership today, and one communication habit I need to improve when coordinating under tight deadlines.";

// ==========================================
// SESSION 03: Workplace Communication
// ==========================================
sessions[2].outcome = "Write professional clarification emails, structured progress updates, and timely risk escalation messages under tight corporate deadlines.";
sessions[2].deliverable = "Workplace Communication Portfolio";
sessions[2].concept = "Professional business messages state the decision needed, available facts, missing information, proposed assumptions, and the exact time of the next update. Concision must never omit a material business risk. If critical data is missing, never make an unverified guess that alters a management decision.";
sessions[2].case = "At 11:00, your manager emails: \"Send the best customers report today.\" You have total billed invoice amounts, but collection dates and payment records are missing. At 16:00, the manager must select customers for a credit-limit increase. High-billing customers who pay late carry far higher credit risk than smaller, prompt-paying clients.";
sessions[2].example = "Professional subject line: \"September Debtor Review — Collection records needed by 14:00.\" First sentence: \"I can rank customers by billed sales immediately; I need payment receipts to verify credit reliability before your 16:00 meeting.\"";
sessions[2].assignment = "Write a 120-word clarification email outlining what data is available versus missing. Draft a 40-word mid-day progress update. Compose a 70-word escalation message if collection data is still unavailable at 14:00, offering an achievable next step.";
sessions[2].support = [
  "Received at 11:00: \"Send the best customers report today.\" Management decision at 16:00: approve credit limits. Available records: sales invoices only. Missing: customer payment history."
];
sessions[2].workPrompts = [
  "Clarification Email (Max 120 words): State the decision context, rank billed revenue, request collection data, and commit to an update time.",
  "Progress Update (Max 40 words): Provide a concise mid-day status check on data verification.",
  "Escalation Message (Max 70 words): Send a formal risk alert at 14:00 when missing payment data threatens the 16:00 credit decision, proposing an interim solution."
];
sessions[2].squad = "Pair up as sender and manager. The manager attempts to pressure the sender into ranking customers using sales alone. The sender must professionally explain why sales volume without payment reliability creates bad debt risk.";
sessions[2].reviewRoles = "Evaluator checks that the clarification email states the decision deadline (16:00) and does not exceed the 120-word corporate limit.";
sessions[2].reflection = "How I handled ambiguity today, and what I learned about protecting managers from making decisions on incomplete financial data.";

// ==========================================
// SESSION 04: Meetings and Reporting
// ==========================================
sessions[3].outcome = "Organize and run a focused business meeting, document binding decisions, and track action items with owners and deadlines.";
sessions[3].deliverable = "Meeting Minutes & Action Tracker";
sessions[3].concept = "Corporate meeting minutes record actionable decisions and unresolved risks, not a verbatim transcript of conversations. Escalation moves a decision to the authorized person before a delay causes contractual penalties. A solution is never officially approved simply because team members prefer it; it requires formal sign-off from the budget owner.";
sessions[3].case = "A key client delivery is due today at 17:00. Your primary supplier confirms parts will arrive one day late. An alternative supplier can deliver today, but charges an additional ₹4,000 rush fee. The operations lead can authorize up to ₹2,000; the general manager is available for emergency budget sign-off at 15:00 today.";
sessions[3].example = "Action item record: \"Operations Lead to confirm substitute inventory by 14:30; General Manager to approve or reject ₹4,000 cost variance at 15:00; Client Lead to inform customer of confirmed delivery by 15:30.\"";
sessions[3].assignment = "Prepare a 4-item meeting agenda. Conduct a 12-minute squad meeting. Document two delivery options, approval authority limits, assigned action owners, and strict deadlines. Deliver a 90-second verbal status report (Done, Next, Blockers).";
sessions[3].support = [
  "Meeting roles: Operations Lead explains supplier delay and ₹2,000 authority limit; Procurement Lead presents ₹4,000 substitute option; Client Lead protects agreed delivery commitment; General Manager decides on budget variance; Minute-Taker records action owners and deadlines."
];
sessions[3].workPrompts = [
  "Meeting Agenda & Options Log: List the 4 agenda items, compare the two delivery options, and state the exact approval authority required.",
  "Action Tracker with Deadlines: Record 3 time-bound actions specifying who owns each task, the exact deadline, and the expected evidence.",
  "Executive Done-Next-Blocker Update: Write a 90-second structured status briefing for the general manager."
];
sessions[3].squad = "Conduct a mock meeting rotating chair and minute-taker. Midway through, the client calls demanding an unconditional guarantee. Respond professionally without making an unauthorized financial commitment.";
sessions[3].reviewRoles = "Reviewer verifies that every action item in the tracker has a single individual owner, a specific clock time (e.g., 14:30, 15:00), and a testable output.";
sessions[3].reflection = "What I learned about managing meeting time efficiently, and how clear action tracking prevents project delays.";

// ==========================================
// SESSION 05: Accounting Transactions
// ==========================================
sessions[4].outcome = "Analyze real business source records, classify commercial events, and prepare error-free double-entry journal entries.";
sessions[4].deliverable = "Transaction Register & General Journal";
sessions[4].concept = "Double-entry accounting reflects the fundamental truth of business exchanges: every transaction impacts at least two accounts. Debits increase assets and expenses; credits increase liabilities, equity, and revenue. Collecting an outstanding customer invoice brings in cash but reduces accounts receivable—it does not create new sales revenue. A customer advance is a liability until the promised service is actually delivered.";
sessions[4].case = "You are given Case A containing 12 real commercial source documents from September (invoices, bank vouchers, salary sheets, rent agreements). All transaction amounts in this baseline accounting session exclude indirect tax. No depreciation is required for this one-month recording period. Record all entries directly from source documents.";
sessions[4].example = "A client pays an existing invoice of ₹8,000 by bank transfer: Debit Bank Account ₹8,000 (Asset increases), Credit Trade Receivables ₹8,000 (Asset decreases). Revenue was already recognized when the service was originally delivered.";
sessions[4].assignment = "Build a Transaction Register listing Document ID, Business Event, Debit Account, Credit Account, Amount in INR, and Source Evidence Status. Journalize all 12 September transactions. Flag the required documentation needed for accrued wages and customer advances.";
sessions[4].support = [
  "Case A represents a pure double-entry foundation exercise. Focus on proper account classification (Asset, Liability, Equity, Revenue, Expense) before advancing to GST in Session 11."
];
sessions[4].workPrompts = [
  "Journal Classifications & Evidence Audit: Record all 12 events in the General Journal, explaining the accounting logic for customer advances and accrued expenses."
];
sessions[4].squad = "Pair up as preparer and reviewer. Each student explains two journal entries without software assistance. The reviewer challenges why equipment purchases must be capitalized on the balance sheet rather than expensed as an operating cost.";
sessions[4].reviewRoles = "Reviewer audits all 12 entries against Case A source vouchers, confirming debits equal credits and advance payments are credited to liability accounts.";
sessions[4].reflection = "How analyzing source documents changed my understanding of journal entries, and why separating revenue from cash collections protects financial integrity.";

// ==========================================
// SESSION 06: Ledger and Month End Close
// ==========================================
sessions[5].outcome = "Post journal transactions to general ledgers, rectify posting errors with rectification entries, and prepare an adjusted trial balance.";
sessions[5].deliverable = "General Ledger Accounts & Month-End Close Pack";
sessions[5].concept = "A trial balance verifies that total debits equal total credits; however, an agreeing trial balance does not prove accounts are error-free. Compensating errors or posting an entry to the wrong account still balance mathematically. Closing accounts requires source voucher completeness, accrued expense adjustments, liability verifications, and an audit trail for every correction journal.";
sessions[5].case = "Continue Case A. In the draft ledger, a trainee accountant mistakenly credited a ₹35,000 customer advance collection as new sales revenue. The bank posting of ₹35,000 is correct. Management requests you to close the September accounts, rectify the error, and explain why an agreeing trial balance failed to catch this mistake.";
sessions[5].example = "When an advance collection from a customer is mistakenly credited to Revenue, reverse the excess revenue and credit Trade Receivables: Debit Sales Revenue ₹35,000, Credit Trade Receivables ₹35,000. Cash and bank balances remain completely unchanged.";
sessions[5].assignment = "Post Case A journal entries into T-account ledgers. Draft the rectification journal entry for the ₹35,000 posting error. Produce a closing Trial Balance, calculate corrected net profit, and confirm the Accounting Equation (Assets = Liabilities + Equity). State two accounting errors that a trial balance cannot detect.";
sessions[5].support = [
  "Closing workflow: 1. Post entries to T-accounts, 2. Identify the ₹35,000 misclassification, 3. Record rectification entry in Journal, 4. Prepare Adjusted Trial Balance, 5. Calculate corrected Net Profit."
];
sessions[5].workPrompts = [
  "Accounting Equation & Profit Check: Calculate corrected net profit and prove that Total Assets equal Total Liabilities plus Owner Equity.",
  "Rectification Journal & Audit Trail: Document the journal entry to correct the ₹35,000 error, citing the source document and explaining why cash remains unaffected."
];
sessions[5].squad = "Conduct a formal month-end close meeting: Preparer presents the ₹35,000 correction, Reviewer audits the supporting bank advice, and the Manager signs off only after bank, receivables, and liability balances are fully reconciled.";
sessions[5].reviewRoles = "Reviewer checks that the rectification entry debits Revenue and credits Receivables for ₹35,000, and verifies that the Trial Balance totals agree.";
sessions[5].reflection = "What I learned about internal controls during month-end close, and why an agreeing trial balance is not proof of accounting accuracy.";

// Write back to file
fs.writeFileSync(FILE_PATH, JSON.stringify(sessions, null, 2), 'utf8');
console.log('Successfully updated Sessions 01 to 06 in drive-edition-3.json!');
