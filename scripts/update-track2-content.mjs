import fs from 'node:fs';
import path from 'node:path';

const FILE_PATH = path.resolve('/Users/yashvanthkrishnamurthy/Documents/Vayentra-Projects/VCEP/app/guided-learning/drive-edition-3.json');
const BACKUP_PATH = path.resolve('/Users/yashvanthkrishnamurthy/Documents/Vayentra-Projects/VCEP/app/guided-learning/drive-edition-3.backup.json');

console.log('--- UPDATING TRACK 2 (SESSIONS 07 TO 12) WITH APPROVED CONTENT STANDARD ---');

const sessions = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

// Ensure safe backup exists
if (!fs.existsSync(BACKUP_PATH)) {
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(sessions, null, 2));
  console.log('Created initial backup at:', BACKUP_PATH);
}

// ==========================================
// SESSION 07: Excel and Data Cleaning
// ==========================================
sessions[6].outcome = "Audit raw customer receipts, eliminate duplicates and date errors, build an approved clean dataset, and document exclusions in an Exception Log.";
sessions[6].deliverable = "Clean Dataset, Exception Log & Approved Collections Summary";
sessions[6].summary = "Clean messy corporate data without losing evidence or hiding exceptions.";
sessions[6].case = "Case B contains 7 raw receipt records totaling ₹44,000 from October. A data export glitch created a repeated ID, an impossible calendar date, an ambiguous date format, a blank receipt amount, and mixed-case customer names. Management asks for verified total receipts by customer. You must never delete suspect rows directly from raw data or replace missing amounts with zero.";
sessions[6].concept = "Corporate data cleaning follows a strict three-tier separation: keep raw imports untouched, build a verified clean dataset, and isolate unverified rows in an exception log. Duplicate detection uses unique transaction IDs rather than customer names alone. Silently deleting an unverified row or filling a missing value with ₹0 destroys the audit trail and hides missing cash from auditors.";
sessions[6].example = "In standard Excel syntax, =SUMIFS(C$2:C$10, B$2:B$10, \"Asha\") calculates receipts for customer Asha. In structured tables, =SUMIFS(Clean[Amount], Clean[Customer], \"Asha\") gives the same result. The formula =COUNTIF(A$2:A$10, A2) flags duplicate IDs (count > 1), but an accountant must inspect bank remittance advice before deciding which duplicate row to exclude.";
sessions[6].assignment = "Audit all 7 Case B raw receipt records into your workbook. Standardize customer names into proper case (\"Asha\", \"Beacon\"). Segregate the 3 verified valid receipts (R01, R02 first instance, R03) totaling ₹25,000 into Clean Data. Quarantine the 4 problematic records (duplicate R02, invalid date R04, blank R05, ambiguous date R06) totaling ₹19,000 into the Exception Log. Verify that Clean (₹25,000) + Exceptions (₹19,000) equals Raw (₹44,000) with zero variance.";
sessions[6].support = [
  "Preserve Raw: Keep raw receipt import intact on sheet 1. Clean Data: Move only verified records totaling ₹25,000 to sheet 2. Exception Log: Record the 4 suspect rows totaling ₹19,000 on sheet 3 with specific reason codes. Reconciliation Control: Confirm Clean + Exceptions = ₹44,000."
];
sessions[6].workPrompts = [
  "Customer Subtotals via =SUMIFS(): State approved collection totals for Asha (₹17,000) and Beacon (₹8,000), detailing the exact formula syntax used.",
  "Exception Register & Audit Decisions: List all 4 quarantined records, the specific defect for each (duplicate, invalid day 32, missing amount, ambiguous date format), and the required business resolution.",
  "Zero-Variance Reconciliation Proof: Show the mathematical proof proving that Raw Receipts (₹44,000) = Clean Approved (₹25,000) + Quarantined Exceptions (₹19,000)."
];
sessions[6].squad = "Pair up as Data Preparer and Audit Reviewer. The Reviewer attempts to replicate the ₹25,000 clean total from the Raw sheet using the student's documented Exception Log. The Reviewer changes one approved amount to confirm the customer SUMIFS summary automatically recalculates.";
sessions[6].reviewRoles = "Evaluator verifies three-tier data separation, checks that duplicate R02 and blank R05 are quarantined in the Exception Log rather than deleted or zeroed out, and confirms the ₹44,000 reconciliation equation balances perfectly.";
sessions[6].reflection = "What I learned about maintaining audit trails in Excel, and why replacing a blank cell with zero is a dangerous accounting mistake.";

// ==========================================
// SESSION 08: Bank Reconciliation
// ==========================================
sessions[7].outcome = "Identify timing differences versus bank-only charges, draft adjustment entries, and build a 3-column Bank Reconciliation Statement (BRS).";
sessions[7].deliverable = "Bank Reconciliation Statement & Timing Exception Report";
sessions[7].summary = "Reconcile cash book and bank statement balances using verified adjustment entries.";
sessions[7].case = "Case C October financial snapshot: your unadjusted Cash Book shows a debit balance of ₹87,500, while your Bank Statement reports a credit balance of ₹83,200. The bank statement reveals a ₹500 bank charge and ₹200 interest earned, neither of which is recorded in your books. Additionally, a customer deposit of ₹10,000 appears in your cash book but has not yet cleared the bank, and a supplier payment cheque of ₹6,000 issued to a vendor has not yet been presented for payment.";
sessions[7].concept = "A Bank Reconciliation Statement (BRS) explains the mathematical difference between your company's cash book and the bank's records. First, update your cash book for verified bank-only events (bank fees and interest earned). Second, reconcile temporary timing differences (unpresented cheques and deposits in transit) on the BRS schedule. A timing difference must never be recorded twice in the general ledger. A reconciliation that forces numbers to match with an unexplained plug violates internal controls.";
sessions[7].example = "To reconcile: Adjusted Cash Book = ₹87,500 − ₹500 (Bank Charges) + ₹200 (Interest Earned) = ₹87,200. Then bridge to Bank Statement: Adjusted Cash Book (₹87,200) + Unpresented Cheques (₹6,000) − Deposits in Transit (₹10,000) = ₹83,200. The calculated statement balance matches the actual bank statement of ₹83,200 exactly, giving a zero variance.";
sessions[7].assignment = "Calculate the adjusted Cash Book balance by posting journal entries for bank charges (₹500) and interest earned (₹200). Build a 3-column Bank Reconciliation Statement bridging your adjusted cash book balance to the actual bank statement balance of ₹83,200. Draft an Exception Log documenting the customer deposit in transit (₹10,000) and unpresented cheque (₹6,000) with follow-up owners and clearance target dates.";
sessions[7].support = [
  "Step 1: Adjust Cash Book for permanent bank-only items (Bank Charges ₹500, Interest ₹200). Adjusted Book Balance = ₹87,200. Step 2: Bridge to Bank Statement: Add Unpresented Cheque ₹6,000; Deduct Deposit in Transit ₹10,000. Reconciled Bank Statement = ₹83,200. Step 3: Verify variance equals ₹0."
];
sessions[7].workPrompts = [
  "Cash Book Adjustments & Journal Entries: Show the adjusted Cash Book calculation (₹87,200) and draft the two journal entries for bank charges (₹500 Dr Charges / Cr Bank) and interest earned (₹200 Dr Bank / Cr Interest Income).",
  "Three-Column Bank Reconciliation Statement: Present the complete bridge starting from Adjusted Cash Book (₹87,200) to Bank Statement Balance (₹83,200), demonstrating zero unexplained variance.",
  "Timing Exception Log & Clearance Schedule: Document the ₹10,000 deposit in transit and ₹6,000 unpresented cheque, assigning an action owner, banking partner reference, and follow-up clearance date."
];
sessions[7].squad = "Roleplay as Junior Accountant and Senior Finance Controller. The Controller tests the Accountant: \"Why don't we post another debit for the ₹10,000 customer deposit to make the numbers match?\" The Accountant must explain why posting a timing difference into the ledger causes duplicate revenue and false financial reporting.";
sessions[7].reviewRoles = "Reviewer audits that bank charges and interest are posted to the Cash Book, that timing items remain strictly within the BRS schedule, and that the final variance between calculated and actual statement balances is exactly ₹0.";
sessions[7].reflection = "How I distinguish between a permanent ledger adjustment and a temporary timing difference, and why forcing reconciliations damages professional credibility.";

// ==========================================
// SESSION 09: Business Finance and Performance
// ==========================================
sessions[8].outcome = "Calculate gross profit, operating profit, and margins across 3 months of MIS data, distinguishing real margin expansion from volume growth.";
sessions[8].deliverable = "Financial Performance Report & Management Findings";
sessions[8].summary = "Evaluate revenue growth, cost of goods sold, and receivables using verified financial ratios.";
sessions[8].case = "Case D provides a 3-month Management Information System (MIS) release for July, August, and September. Billed revenue grows steadily each month (₹1,00,000 in July to ₹1,20,000 in August and ₹1,50,000 in September). However, direct delivery costs surge from ₹40,000 to ₹75,000, and trade receivables spike from ₹30,000 to ₹70,000. The business owner celebrates the 50% revenue growth, assuming the company is thriving. Management asks for an objective financial health assessment.";
sessions[8].concept = "Revenue growth does not guarantee profitability or solvency. Gross Margin (Gross Profit ÷ Revenue) measures profitability after direct delivery costs (Cost of Goods Sold). Operating Margin (Operating Profit ÷ Revenue) measures earnings after operating overheads. A percentage point change is the simple difference between two percentage rates, whereas percentage growth measures relative expansion. Rapidly rising receivables mean sales are tied up on credit rather than collected in the bank.";
sessions[8].example = "In July: Revenue = ₹1,00,000; Direct Costs = ₹40,000; Gross Profit = ₹60,000 (Gross Margin = 60.0%). Operating Overhead = ₹35,000; Operating Profit = ₹25,000 (Operating Margin = 25.0%). In September: Revenue = ₹1,50,000; Direct Costs = ₹75,000; Gross Profit = ₹75,000 (Gross Margin = 50.0%). Gross margin fell by 10.0 percentage points, revealing direct cost inefficiencies despite top-line sales growth.";
sessions[8].assignment = "Calculate Gross Profit, Operating Profit, Gross Margin %, and Operating Margin % for July, August, and September. Calculate percentage growth from August to September for Revenue and Operating Profit. Write 3 evidence-backed management findings analyzing the drop in profitability, 1 critical business uncertainty, and 1 concrete operational investigation into direct costs and receivables.";
sessions[8].support = [
  "Case D Baseline: July (Rev ₹1,00,000 | Direct ₹40,000 | Overhead ₹35,000 | AR ₹30,000), August (Rev ₹1,20,000 | Direct ₹54,000 | Overhead ₹39,000 | AR ₹45,000), September (Rev ₹1,50,000 | Direct ₹75,000 | Overhead ₹45,000 | AR ₹70,000). Keep numbers net of tax."
];
sessions[8].workPrompts = [
  "Financial KPI Calculations & Growth Rates: Calculate Gross Profit, Operating Profit, Gross Margin %, and Operating Margin % for all 3 months, plus August-to-September growth rates for Revenue and Operating Profit.",
  "Three Evidence-Backed Management Findings: Present 3 findings contrasting top-line sales expansion against the 10 percentage-point decline in Gross Margin and the 133% surge in outstanding receivables.",
  "Business Uncertainty & Operational Investigation: State 1 critical unverified assumption (e.g., whether cost surges were caused by client discounting or supplier inflation) and define a specific audit investigation to verify it."
];
sessions[8].squad = "Finance Lead and Sales Manager debate company performance. The Sales Manager argues: \"Revenue grew by 25% from August to September, so we should increase bonuses!\" The Finance Lead must counter using Case D evidence, explaining how direct cost expansion compressed operating margins from 22.5% to 20.0% while ₹70,000 in uncollected cash creates working capital risk.";
sessions[8].reviewRoles = "Evaluator verifies mathematical accuracy of all 3 months of margins, confirms student correctly calculates percentage point changes versus percentage growth, and ensures findings cite specific Case D data.";
sessions[8].reflection = "What I learned about looking beyond top-line revenue growth, and how gross margin analysis reveals hidden operational problems.";

// ==========================================
// SESSION 10: MIS Dashboard Development
// ==========================================
sessions[9].outcome = "Design a 1-page executive dashboard displaying core financial KPIs and draft a 150-word management memo with 2 owned business actions.";
sessions[9].deliverable = "1-Page MIS Dashboard & Actionable Management Memo";
sessions[9].summary = "Build an executive MIS dashboard and write decision-useful recommendations for leadership.";
sessions[9].case = "The company managing director has exactly five minutes between client meetings to review business performance. Using the Case D 3-month dataset, you must design a 1-page Management Information System (MIS) dashboard. The dashboard must immediately show whether revenue expansion is generating cash and profit, highlight cost deterioration, and recommend immediate interventions. The director needs concrete facts and assigned accountability, not cluttered decorative graphs.";
sessions[9].concept = "An effective MIS dashboard begins with the business decision it must inform. Executive dashboards prioritize high-impact Key Performance Indicators (KPIs): top-line revenue trend, gross margin %, operating margin %, and closing receivables. Every KPI requires context: current level, prior period comparison, and directional trend. A professional management memo follows the Insight → Evidence → Action → Limitation framework. Recommendations without an identified owner and deadline are ignored.";
sessions[9].example = "A decision-useful executive briefing: \"September revenue grew 25.0% to ₹1,50,000, but operating profit margin compressed from 22.5% to 20.0% due to a 38.9% spike in direct delivery costs. Concurrently, uncollected receivables rose to ₹70,000 (46.7% of monthly sales). Recommended Action: Operations Lead to audit direct supplier contracts by Friday; Collections Lead to place credit holds on accounts overdue >30 days.\"";
sessions[9].assignment = "Construct a 1-page financial MIS dashboard in Excel or Sheets featuring 4 core KPI cards (Revenue, Gross Margin %, Operating Margin %, Closing Receivables), monthly performance trends, and dynamic formula links. Draft a crisp 150-word management memo outlining: 1. Core financial diagnosis, 2. Two specific operational actions with assigned owners and deadlines, 3. One data limitation requiring further investigation.";
sessions[9].support = [
  "Dashboard Structure: Top row: 4 KPI summary cards with August vs September comparisons. Middle section: Trend table showing 3-month figures and margin percentages. Bottom section: 150-word management memo with 2 owned action items."
];
sessions[9].workPrompts = [
  "Executive KPI Summary & Dynamic Formulas: Present the 4 core KPIs for September, showing comparative performance versus August and confirming dynamic formulas link directly to Case D data.",
  "150-Word Executive Management Memo: Write a concise briefing containing the core diagnosis, two concrete business actions with assigned role owners and target completion dates, and one data limitation.",
  "Sensitivity Stress Test: Document what happens to September Gross Margin and Operating Profit when direct delivery costs increase from ₹75,000 to ₹78,000."
];
sessions[9].squad = "Present a 3-minute executive briefing to your peer playing the Managing Director. The Director executes a live sensitivity check: change September direct delivery cost from ₹75,000 to ₹78,000. All KPI cards, margin calculations, and variance percentages must update dynamically in real time.";
sessions[9].reviewRoles = "Reviewer tests that the dashboard contains all 4 required KPIs, verifies the sensitivity stress test updates without broken formulas (#REF!, #VALUE!), and ensures the memo does not exceed 150 words while including two named owners.";
sessions[9].reflection = "How presenting data to executive leadership taught me to cut visual clutter and focus entirely on actionable financial insights.";

// ==========================================
// SESSION 11: GST and Invoice Review
// ==========================================
sessions[10].outcome = "Review domestic tax invoices, verify CGST/SGST versus IGST rates under Indian tax rules, and match purchase bills against inward statements.";
sessions[10].deliverable = "Invoice Audit Report & GSTR-2B Matching Schedule";
sessions[10].summary = "Review domestic GST invoices, verify tax calculations, and reconcile inward purchase records.";
sessions[10].case = "Case E provides three sales invoices (E01, E02, E03) issued by a Karnataka-based firm and a purchase ledger containing three bills (P01, P02, P03) to reconcile against the tax portal's inward statement. Under the synthetic domestic training policy, an 18% standard rate applies: Intra-State transactions (Place of Supply: Karnataka) require 9% CGST + 9% SGST; Inter-State transactions (Place of Supply: Tamil Nadu) require 18% IGST. Sales invoice E03 is missing its mandatory serial number, and purchase bill P02 is missing from the inward tax portal statement.";
sessions[10].concept = "In Indian GST compliance, the Place of Supply determines the tax structure: intra-state sales incur equal Central GST (CGST) and State GST (SGST), while inter-state transactions incur Integrated GST (IGST). Never apply both taxes at the full 18% rate. On the procurement side, claiming Input Tax Credit (ITC) requires matching your purchase bills against the government portal's auto-drafted inward statement (GSTR-2B). If a supplier fails to upload their invoice, your company cannot claim the tax credit without risking tax penalties.";
sessions[10].example = "Intra-State: Invoice E01 has taxable value ₹10,000 with Place of Supply Karnataka. CGST @ 9% = ₹900, SGST @ 9% = ₹900. Total Invoice = ₹11,800. Inter-State: Invoice E02 has taxable value ₹20,000 with Place of Supply Tamil Nadu. IGST @ 18% = ₹3,600 (not CGST/SGST). Total Invoice = ₹23,600. Correcting E02 eliminates a ₹3,600 tax classification error.";
sessions[10].assignment = "Audit sales invoices E01 to E03: calculate correct tax components, determine correct invoice totals, and flag the compliance defect on E03 (missing serial number). Reconcile purchase records P01 to P03 against the inward portal statement: confirm matching tax credits (P01 ₹180, P03 ₹540) and quarantine P02 (₹360 book tax missing from portal) into an exception report for vendor follow-up.";
sessions[10].support = [
  "Training GST Policy: Karnataka supplier. Intra-State (POS Karnataka): 9% CGST + 9% SGST = 18%. Inter-State (POS Tamil Nadu): 18% IGST. Review checklist: 1. Place of Supply, 2. Mandatory Invoice Serial, 3. Tax Components, 4. GSTR-2B Inward Portal Match."
];
sessions[10].workPrompts = [
  "Sales Invoice Audit & Tax Component Breakdown: Audit E01, E02, and E03, detailing correct CGST, SGST, IGST amounts and explaining why draft tax on E02 (billed as CGST/SGST instead of IGST) was non-compliant.",
  "Invoice Compliance Defect & Correction: Explain why invoice E03 cannot be legally issued without a sequential serial number and state the required rectification under GST rules.",
  "Inward Purchase Reconciliation & ITC Action: Report the reconciliation results for P01, P02, and P03, explaining the financial and tax risk of claiming Input Tax Credit on P02 before the supplier files their return."
];
sessions[10].squad = "Roleplay as Junior Tax Accountant and Vendor Relationship Manager. The Vendor Manager demands: \"Let's claim the ₹360 tax credit on P02 anyway—we have the paper bill!\" The Accountant must professionally explain why claiming unmatched ITC creates legal notices, interest liabilities, and audit disallowance under GST regulations.";
sessions[10].reviewRoles = "Reviewer verifies that E02 correctly applies 18% IGST (₹3,600), flags E03 for missing invoice serial number, and confirms P02 is quarantined as unmatched with a vendor follow-up action.";
sessions[10].reflection = "What I learned about Indian GST mechanics, and why reconciling purchase registers against portal data is essential for claiming tax credits safely.";

// ==========================================
// SESSION 12: Receivables and Working Capital
// ==========================================
sessions[11].outcome = "Categorize outstanding customer invoices into 30-day aging buckets, identify overdue credit risks, and construct a 7-day cash forecast.";
sessions[11].deliverable = "Receivables Aging Schedule & 7-Day Cash Action Plan";
sessions[11].summary = "Build aging schedules, prioritize customer collections, and forecast 7-day cash flows.";
sessions[11].case = "Case F as of 31 October 2026: four client invoices totaling ₹1,00,000 remain outstanding. Bank balance is currently ₹25,000, while unavoidable operating expenses (salaries, rent, utilities) due within the next 7 days total ₹45,000. Customer Beacon disputes ₹5,000 on its ₹20,000 invoice (F02) due to a billing disagreement. None of the four customers has paid yet. If cash collections fail, the company faces a ₹20,000 liquidity deficit and will default on immediate payroll and vendor commitments.";
sessions[11].concept = "Managing working capital requires distinguishing between customer promises and cleared cash in the bank. Days overdue is calculated from the agreed payment due date: Days Overdue = Max(0, As-of Date − Due Date). An invoice due today is classified as Current, not overdue. In receivables management, overdue balances are categorized into aging buckets (Current, 1–30, 31–60, 61–90, >90 days). The older an unpaid invoice becomes, the higher the risk of bad debt. A short-term cash forecast must separate confirmed cash from disputed or contingent collections.";
sessions[11].example = "As of 31 October: Invoice F01 (Asha, ₹10,000, due 31 Oct) has 0 days overdue → Current. Invoice F02 (Beacon, ₹20,000, due 16 Oct) has 15 days overdue → 1–30 Days Bucket (with ₹5,000 disputed). Invoice F03 (Cedar, ₹30,000, due 16 Sep) has 45 days overdue → 31–60 Days Bucket. Invoice F04 (Delta, ₹40,000, due 17 Aug) has 75 days overdue → 61–90 Days Bucket.";
sessions[11].assignment = "Construct a Receivables Aging Schedule categorizing invoices F01 through F04 into appropriate aging buckets. Calculate the immediate 7-day cash deficit (₹25,000 opening bank − ₹45,000 unavoidable payments = ₹20,000 cash gap). Prioritize customer collections to close the cash gap, establishing the follow-up sequence. Draft a formal dispute resolution message for Beacon's ₹5,000 claim and a collection reminder for the undisputed balance.";
sessions[11].support = [
  "As-of Date: 31 October 2026. Current: F01 (₹10,000). 1–30 Days: F02 (₹20,000, ₹5k disputed). 31–60 Days: F03 (₹30,000). 61–90 Days: F04 (₹40,000). Unavoidable Outflows: ₹45,000. Opening Bank: ₹25,000. Cash Deficit to cover: ₹20,000."
];
sessions[11].workPrompts = [
  "Receivables Aging Schedule: Present the aging classification for all 4 invoices (F01–F04), detailing customer name, invoice amount, days overdue, and assigned aging bucket.",
  "7-Day Cash Forecast & Deficit Closure Strategy: Show opening bank balance (₹25,000), mandatory payments (₹45,000), and the exact collection priority required to cover the ₹20,000 cash deficit without relying on disputed funds.",
  "Disputed Balance Communication & Escalation: Draft a professional email to customer Beacon addressing the ₹5,000 billing dispute while securing immediate payment for the undisputed ₹15,000 portion."
];
sessions[11].squad = "Roleplay as Credit Controller and Operations Manager. The Operations Manager wants to assume customer Delta will pay its ₹40,000 bill tomorrow to cover payroll. The Credit Controller must point to Delta's 75-day overdue status, explain why high-aging debts have low collection probability, and prioritize collecting current and undisputed accounts first.";
sessions[11].reviewRoles = "Reviewer verifies correct calculation of days overdue from due dates, checks that Beacon's ₹5,000 dispute is isolated, and confirms the 7-day cash forecast demonstrates how the ₹20,000 deficit is closed using verified collections.";
sessions[11].reflection = "What I learned about credit control and liquidity management, and why cash flow forecasting is vital for keeping a company solvent.";

// Write back to file
fs.writeFileSync(FILE_PATH, JSON.stringify(sessions, null, 2), 'utf8');
console.log('Successfully updated Sessions 07 to 12 in drive-edition-3.json!');
