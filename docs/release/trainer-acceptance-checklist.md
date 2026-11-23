# VCEP v1.0 — Trainer Acceptance & Classroom Delivery Checklist

**Document:** Classroom Delivery Protocol & 135-Minute Timetable Verification  
**Release:** VCEP v1.0-RC1  
**Target:** Corporate Trainers, Classroom Facilitators & Faculty Mentors  

---

## 1. The 135-Minute Classroom Delivery Architecture

Every VCEP session is calibrated to a **135-minute (2 hours 15 minutes)** corporate simulation format. The interface at `/guided-learning` mirrors this timetable under the **Overview** stage.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              STANDARD 135-MINUTE TIMETABLE                              │
├───────────────┬─────────────────┬──────────────────┬───────┬──────────────┬────────────┤
│ 00 – 10 min   │ 10 – 25 min     │ 25 – 50 min      │ 50-60 │ 60 – 95 min  │ 95-135 min │
│ Recall & Goal │ Concept Briefing│ Individual Lab   │ BREAK │ Squad Lab    │ Review &   │
│ & Objectives  │ & Worked Example│ Working Tables   │(10 min│ & AI Prompt  │ Handover   │
└───────────────┴─────────────────┴──────────────────┴───────┴──────────────┴────────────┘
```

### Standard Session Timetable (Sessions 02–21, 23)
- `00–10 min (10m):` **Recall & Objective:** Connect previous session evidence; state today's measurable business mission.
- `10–25 min (15m):` **Trainer Concept & Worked Example:** Walk through the principle, explain the worked scenario, demonstrate common errors.
- `25–50 min (25m):` **Individual Attempt:** Students complete individual working tables and calculations on their own.
- `50–60 min (10m):` **Classroom Break:** 10-minute mental rest; screens off.
- `60–95 min (35m):` **Squad Challenge & Peer Verification:** 4–5 person squads challenge each other's assumptions and complete the team lab.
- `95–115 min (20m):` **Verification & Challenge Review:** Trainer cold-calls squads; challenges unsupported numbers; verifies controls.
- `115–130 min (15m):` **Revision & Self-Assessment:** Students complete the 5-point quality checklist, write reflections, and check rubric points.
- `130–135 min (05m):` **Session Close & Handover:** Students export their practice draft `.txt` and prepare for official assessed submission.

---

## 2. Controlled Assessment Timetables

### Session 01 — Baseline A Diagnostic (Unseen & Trainer-Controlled)
```
00–05 min (05m):  Briefing on diagnostic purpose and rules
05–65 min (60m):  Independent Baseline A Attempt (Strictly individual; no peer help; no AI)
65–75 min (10m):  Classroom Break
75–90 min (15m):  Core Concept Explanation (Revenue vs Cash vs Profit)
90–115 min (25m): Individual Business Lab (Vayentra Labs process mapping)
115–130 min (15m): Review & Verification
130–135 min (05m): Session Handover
```
*Trainer Rule: Do not distribute Baseline A diagnostic test papers before 00:05. Ensure all test sheets are collected at 00:65 before the break.*

### Session 22 — Exit B Examination & Structured Interviews
```
00–05 min (05m):  Instructions & Interview Schedule Briefing
05–65 min (60m):  Independent Exit B Attempt (Strictly individual; unseen case; no AI)
65–75 min (10m):  Classroom Break
75–110 min (35m): Structured Viva Interviews (3–5 minutes per student)
110–130 min (20m): Development Plan Formulation
130–135 min (05m): Close & Portfolio Handover
```
*Trainer Rule: AI prompt access is locked by the server on Session 22. Score interviews strictly using the 10-point rubric in the Review stage.*

### Session 24 — Corporate Demo Day & Industry Passport Audit
```
00–10 min (10m):  Reviewer & Guest Judge Briefing
10–100 min (90m): Six Squad Presentations (15 minutes per squad: 7m pitch, 3m demo, 5m Q&A)
100–120 min (20m): Individual Defense Viva Stations (2 minutes per student)
120–130 min (10m): Industry Passport Reconciliation & Audit
130–135 min (05m): Programme Close & Recognition
```

---

## 3. Stage-by-Stage Trainer Delivery Checklist

### Stage 1: Overview
- [ ] Direct students to `/guided-learning?session=:id`.
- [ ] Confirm the session title, track number, and today's business mission.
- [ ] Emphasize **Your Task** (what they will do) and **Your Evidence** (what they must produce).
- [ ] Check if the session has a **Controlled Assessment** amber warning (Sessions 01 and 22).

### Stage 2: Learn
- [ ] Review the **Concept Briefing** on the projector.
- [ ] Walk through the **Worked Example**, highlighting the methodology and calculations.
- [ ] Pause for 3 minutes: Have each student type their explanation in **"In your own words, how would you explain this to a colleague?"**.
- [ ] Ask 2 random students to read their explanation aloud.

### Stage 3: Case
- [ ] Review the **Business Simulation** narrative.
- [ ] Point out the **Reference Data** tables and notes.
- [ ] Remind students: *"Keep source records separate from your working assumptions"*.

### Stage 4: Work
- [ ] Announce the 25-minute individual work period.
- [ ] Ensure students enter values into the **Editable Working Sheet** tables.
- [ ] Verify students are filling out the **Work Prompts** and method notes.
- [ ] Circulate around the room; identify students who are guessing without looking at source tables.

### Stage 5: Team
- [ ] Form 4–5 student squads.
- [ ] Assign squad roles: Sales Lead, Delivery Lead, Finance Officer, Reviewer.
- [ ] Facilitate the **Team Challenge**.
- [ ] Ensure each student logs **"My contribution and one correction after team review"**.
- [ ] For sessions with approved AI prompts:
  - Students must complete their own attempt *before* copying the AI prompt.
  - Students click **"Copy approved prompt"** to test against their preferred AI tool.
  - Students record any hallucinated or unsupported figures in the AI verification log.
  - (Confirm AI is blocked on Session 22).

### Stage 6: Review & Handover
- [ ] Walk through the **Assessment Rubric** (/10 points).
- [ ] Ensure students check all 5 items in the **Before Handover Checklist**.
- [ ] Instruct students to click **"Export Draft ↓"** to save their local `.txt` evidence file.
- [ ] **Transfer to Assessed Worksheet:**
  - Instruct students to click **"Return to VCEP Home"** or open the **"Assessed Worksheet"** button.
  - Remind students: *"The Assessed Worksheet tests transfer of learning on an enterprise proxy (HUL/Titan/etc.). Do not blindly copy Vayentra Labs figures."*
  - Ensure students submit before the cohort deadline.
