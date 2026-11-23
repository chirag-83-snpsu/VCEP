/**
 * VCEP Vivi AI Learning Partner - Context-Aware Smart Suggestions Catalog
 * Comprehensive 24-Session Curriculum Database with English, Kannada, and Kanglish
 * Categories: Understand (📘), Solve (🛠️), Apply (🏢), Practise (🎯)
 */

export type SuggestionCategory = 'understand' | 'solve' | 'apply' | 'practise';

export interface SmartSuggestionItem {
  id: string;
  sessionId?: number;
  stage?: number | string;
  category: SuggestionCategory;
  text: string;
  textKn: string;
  textKnEn?: string;
  tags?: string[];
}

export const SMART_SUGGESTIONS: SmartSuggestionItem[] = [
  {
    "id": "sug_1_understand_1",
    "sessionId": 1,
    "stage": 1,
    "category": "understand",
    "text": "What is the fundamental difference between earned profit and closing cash?",
    "textKn": "ಗಳಿಸಿದ ಲಾಭ ಮತ್ತು ಕೈಯಲ್ಲಿರುವ ನಗದಿನ ನಡುವಿನ ಮುಖ್ಯ ವ್ಯತ್ಯಾಸವೇನು?",
    "textKnEn": "Galasida labha mattu kaiyalliruva nagadina naduvina mukya vyathyasavenu?",
    "tags": [
      "profit",
      "cash",
      "accounting"
    ]
  },
  {
    "id": "sug_1_understand_2",
    "sessionId": 1,
    "stage": 3,
    "category": "understand",
    "text": "Why does a profitable business still face cash flow shortages in India?",
    "textKn": "ಲಾಭದಲ್ಲಿರುವ ವ್ಯಾಪಾರಕ್ಕೂ ಭಾರತದಲ್ಲಿ ನಗದು ಕೊರತೆ ಏಕೆ ಎದುರಾಗುತ್ತದೆ?",
    "textKnEn": "Labhadalliruva vyaparadallu Bharatadalli nagadu korate eke eduraguttade?",
    "tags": [
      "cash-flow",
      "working-capital"
    ]
  },
  {
    "id": "sug_1_understand_3",
    "sessionId": 1,
    "stage": 4,
    "category": "understand",
    "text": "Explain the 10% founder cash reserve policy and why liquidity matters.",
    "textKn": "ಶೇಕಡಾ 10ರ ಸ್ಥಾಪಕರ ನಗದು ಮೀಸಲು ನಿಯಮ ಮತ್ತು ದ್ರವ್ಯತೆಯ ಮಹತ್ವವನ್ನು ವಿವರಿಸಿ.",
    "textKnEn": "10% sthapakara nagadu meesalu niyama mattu dravyateya mahatvavannu vivarisi.",
    "tags": [
      "founder-reserve",
      "liquidity"
    ]
  },
  {
    "id": "sug_1_solve_4",
    "sessionId": 1,
    "stage": 1,
    "category": "solve",
    "text": "Walk me through calculating closing cash from customer receipts and supplier payments.",
    "textKn": "ಗ್ರಾಹಕರಿಂದ ಬಂದ ಹಣ ಮತ್ತು ಪೂರೈಕೆದಾರರ ಪಾವತಿಗಳಿಂದ ಅಂತಿಮ ನಗದು ಲೆಕ್ಕಾಚಾರ ಹೇಗೆ ಮಾಡುವುದು?",
    "textKnEn": "Customer receipts mattu supplier payments inda closing cash hege calculate maduvudu?",
    "tags": [
      "calculation",
      "mini-ledger"
    ]
  },
  {
    "id": "sug_1_solve_5",
    "sessionId": 1,
    "stage": 4,
    "category": "solve",
    "text": "How do I calculate whether we have enough cash above the ₹40,000 reserve for the van deposit?",
    "textKn": "ವ್ಯಾನ್ ಠೇವಣಿಗಾಗಿ ₹40,000 ಮೀಸಲು ಮೊತ್ತಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ನಗದು ಇದೆಯೇ ಎಂದು ಲೆಕ್ಕ ಹಾಕುವುದು ಹೇಗೆ?",
    "textKnEn": "Van deposit gagi 40,000 reserve meeri cash ideya endu hege calculate maduvudu?",
    "tags": [
      "van-deposit",
      "reserve"
    ]
  },
  {
    "id": "sug_1_solve_6",
    "sessionId": 1,
    "stage": 2,
    "category": "solve",
    "text": "What formula should I use to check if current revenue covers immediate operating liabilities?",
    "textKn": "ಪ್ರಸ್ತುತ ಆದಾಯವು ತುರ್ತು ಕಾರ್ಯಾಚರಣೆಯ ಬಾಧ್ಯತೆಗಳನ್ನು ಸರಿದೂಗಿಸುತ್ತದೆಯೇ ಎಂದು ಪರೀಕ್ಷಿಸಲು ಯಾವ ಸೂತ್ರ ಬಳಸಬೇಕು?",
    "textKnEn": "Current revenue immediate liabilities cover madutta endu check madalu yav formula beku?",
    "tags": [
      "operating-liabilities"
    ]
  },
  {
    "id": "sug_1_apply_7",
    "sessionId": 1,
    "stage": 5,
    "category": "apply",
    "text": "In the Namma FMCG Bengaluru case, why should the owner defer the delivery-van deposit?",
    "textKn": "ನಮ್ಮ ಎಫ್‌ಎಂಸಿಜಿ ಬೆಂಗಳೂರು ಪ್ರಕರಣದಲ್ಲಿ, ಮಾಲೀಕರು ಡೆಲಿವರಿ ವ್ಯಾನ್ ಠೇವಣಿಯನ್ನು ಏಕೆ ಮುಂದೂಡಬೇಕು?",
    "textKnEn": "Namma FMCG case nalli delivery van deposit eke defer madabeku?",
    "tags": [
      "hul",
      "fmcg",
      "case"
    ]
  },
  {
    "id": "sug_1_apply_8",
    "sessionId": 1,
    "stage": 3,
    "category": "apply",
    "text": "How do Indian FMCG distributors manage credit periods for 40 neighbourhood Kirana stores?",
    "textKn": "ಭಾರತೀಯ ಎಫ್‌ಎಂಸಿಜಿ ವಿತರಕರು 40 ಸ್ಥಳೀಯ ಕಿರಾಣಿ ಅಂಗಡಿಗಳ ಸಾಲದ ಅವಧಿಯನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸುತ್ತಾರೆ?",
    "textKnEn": "Indian FMCG distributors Kirana angadi credit hege manage madtare?",
    "tags": [
      "kirana",
      "credit-terms"
    ]
  },
  {
    "id": "sug_1_apply_9",
    "sessionId": 1,
    "stage": 6,
    "category": "apply",
    "text": "If a retailer offers ₹60,000 today with a 2% discount, should Namma FMCG accept it?",
    "textKn": "ಚಿಲ್ಲರೆ ವ್ಯಾಪಾರಿಯೊಬ್ಬರು 2% ರಿಯಾಯಿತಿಯೊಂದಿಗೆ ಇಂದು ₹60,000 ನೀಡಿದರೆ, ನಮ್ಮ ಎಫ್‌ಎಂಸಿಜಿ ಅದನ್ನು ಸ್ವೀಕರಿಸಬೇಕೇ?",
    "textKnEn": "Retailer 2% discount ge 60000 kottare accept madbahuda?",
    "tags": [
      "cash-discount",
      "twist"
    ]
  },
  {
    "id": "sug_1_practise_10",
    "sessionId": 1,
    "stage": 2,
    "category": "practise",
    "text": "Test me: If revenue is ₹6,00,000, expenses are ₹4,70,000, and receipts are ₹3,90,000, what is the profit?",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಆದಾಯ ₹6,00,000, ಖರ್ಚು ₹4,70,000 ಮತ್ತು ವಸೂಲಿ ₹3,90,000 ಆದರೆ, ಲಾಭ ಎಷ್ಟು?",
    "textKnEn": "Test: Revenue 6L, expenses 4.7L, receipts 3.9L adare profit estu?",
    "tags": [
      "quiz",
      "profit-calculation"
    ]
  },
  {
    "id": "sug_1_practise_11",
    "sessionId": 1,
    "stage": 5,
    "category": "practise",
    "text": "Challenge me to write a 40-word management decision regarding the van deposit.",
    "textKn": "ವ್ಯಾನ್ ಠೇವಣಿ ಕುರಿತು 40 ಪದಗಳ ನಿರ್ವಹಣಾ ಶಿಫಾರಸು ಬರೆಯಲು ನನಗೆ ಸವಾಲು ನೀಡಿ.",
    "textKnEn": "Van deposit bagge 40-word decision bariyoke challenge kodi.",
    "tags": [
      "management-decision"
    ]
  },
  {
    "id": "sug_1_practise_12",
    "sessionId": 1,
    "stage": 6,
    "category": "practise",
    "text": "Ask me to defend the liquidity position against a growth-focused sales manager.",
    "textKn": "ಮಾರಾಟ ವ್ಯವಸ್ಥಾಪಕರ ವಿರುದ್ಧ ಕಂಪನಿಯ ನಗದು ದ್ರವ್ಯತೆಯನ್ನು ಸಮರ್ಥಿಸಿಕೊಳ್ಳಲು ನನ್ನನ್ನು ಸಿದ್ಧಪಡಿಸಿ.",
    "textKnEn": "Sales manager viruddha cash defend madalu nanage practice kodi.",
    "tags": [
      "squad-lab",
      "roleplay"
    ]
  },
  {
    "id": "sug_2_understand_13",
    "sessionId": 2,
    "category": "understand",
    "text": "What is the distinction between an Action Owner and a Reviewer in a corporate squad?",
    "textKn": "ಕಾರ್ಪೊರೇಟ್ ತಂಡದಲ್ಲಿ ಆಕ್ಷನ್ ಮಾಲೀಕ (Owner) ಮತ್ತು ವಿಮರ್ಶಕ (Reviewer) ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?",
    "textKnEn": "Action owner mattu reviewer naduvina difference enu?",
    "tags": [
      "roles",
      "raci",
      "charter"
    ]
  },
  {
    "id": "sug_2_understand_14",
    "sessionId": 2,
    "category": "understand",
    "text": "Why is accountability in corporate deliverables different from college group projects?",
    "textKn": "ಕಾಲೇಜು ಗ್ರೂಪ್ ಪ್ರಾಜೆಕ್ಟ್‌ಗಿಂತ ಕಾರ್ಪೊರೇಟ್ ತಂಡದ ಹೊಣೆಗಾರಿಕೆ ಏಕೆ ಭಿನ್ನವಾಗಿದೆ?",
    "textKnEn": "College project ginta corporate accountability eke bere?",
    "tags": [
      "accountability"
    ]
  },
  {
    "id": "sug_2_understand_15",
    "sessionId": 2,
    "category": "understand",
    "text": "Explain the purpose of a squad charter and role rotation schedules.",
    "textKn": "ತಂಡದ ಸನ್ನದು (Squad Charter) ಮತ್ತು ಪಾತ್ರ ಬದಲಾವಣೆ ವೇಳಾಪಟ್ಟಿಯ ಉದ್ದೇಶವನ್ನು ವಿವರಿಸಿ.",
    "textKnEn": "Squad charter mattu role rotation schedule purpose enu?",
    "tags": [
      "charter"
    ]
  },
  {
    "id": "sug_2_solve_16",
    "sessionId": 2,
    "category": "solve",
    "text": "How do I draft a structured 60-second professional self-introduction for a corporate setting?",
    "textKn": "ಕಾರ್ಪೊರೇಟ್ ಪರಿಸರಕ್ಕಾಗಿ 60 ಸೆಕೆಂಡ್‌ಗಳ ವೃತ್ತಿಪರ ಪರಿಚಯವನ್ನು ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "60 second professional self intro hege draft madodu?",
    "tags": [
      "introduction",
      "elevator-pitch"
    ]
  },
  {
    "id": "sug_2_solve_17",
    "sessionId": 2,
    "category": "solve",
    "text": "How do I handle a squad teammate who misses an agreed documentation deadline?",
    "textKn": "ನಿಗದಿಪಡಿಸಿದ ಗಡುವನ್ನು ತಪ್ಪಿಸುವ ಸಹೋದ್ಯೋಗಿಯನ್ನು ಹೇಗೆ ವೃತ್ತಿಪರವಾಗಿ ನಿಭಾಯಿಸುವುದು?",
    "textKnEn": "Deadline miss mado teammate na hege handle madodu?",
    "tags": [
      "conflict-resolution"
    ]
  },
  {
    "id": "sug_2_solve_18",
    "sessionId": 2,
    "category": "solve",
    "text": "What steps ensure clear acceptance criteria before starting a squad deliverable?",
    "textKn": "ತಂಡದ ಕೆಲಸವನ್ನು ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ಸ್ವೀಕಾರ ಮಾನದಂಡಗಳನ್ನು (Acceptance Criteria) ಹೇಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳುವುದು?",
    "textKnEn": "Acceptance criteria clear madoke yav steps beku?",
    "tags": [
      "acceptance-criteria"
    ]
  },
  {
    "id": "sug_2_apply_19",
    "sessionId": 2,
    "category": "apply",
    "text": "How does Infosys structure cross-functional delivery squads for client engagements?",
    "textKn": "ಇನ್ಫೋಸಿಸ್ ಕ್ಲೈಂಟ್ ಪ್ರಾಜೆಕ್ಟ್‌ಗಳಿಗಾಗಿ ವಿಭಿನ್ನ ಕಾರ್ಯ ತಂಡಗಳನ್ನು ಹೇಗೆ ರಚಿಸುತ್ತದೆ?",
    "textKnEn": "Infosys cross functional delivery squads hege structure madtare?",
    "tags": [
      "infosys",
      "squad-structure"
    ]
  },
  {
    "id": "sug_2_apply_20",
    "sessionId": 2,
    "category": "apply",
    "text": "How should a junior commerce graduate communicate their specific strengths during squad onboarding?",
    "textKn": "ತಂಡ ಸೇರ್ಪಡೆ ಸಂದರ್ಭದಲ್ಲಿ ಕಿರಿಯ ಕಾಮರ್ಸ್ ಪದವೀಧರರು ತಮ್ಮ ಸಾಮರ್ಥ್ಯಗಳನ್ನು ಹೇಗೆ ತಿಳಿಸಬೇಕು?",
    "textKnEn": "Junior commerce graduate squad onboarding alli strengths hege helbeku?",
    "tags": [
      "onboarding"
    ]
  },
  {
    "id": "sug_2_apply_21",
    "sessionId": 2,
    "category": "apply",
    "text": "What does professional etiquette look like in an Indian IT services delivery center?",
    "textKn": "ಭಾರತೀಯ ಐಟಿ ಸೇವಾ ಸಂಸ್ಥೆಯಲ್ಲಿ ವೃತ್ತಿಪರ ನಡವಳಿಕೆ ಹೇಗಿರಬೇಕು?",
    "textKnEn": "Indian IT delivery center alli professional etiquette hegirtade?",
    "tags": [
      "workplace-etiquette"
    ]
  },
  {
    "id": "sug_2_practise_22",
    "sessionId": 2,
    "category": "practise",
    "text": "Critique my 30-second self-introduction and suggest corporate improvements.",
    "textKn": "ನನ್ನ 30 ಸೆಕೆಂಡ್‌ಗಳ ಪರಿಚಯವನ್ನು ವಿಮರ್ಶಿಸಿ ಕಾರ್ಪೊರೇಟ್ ಶೈಲಿಯ ಸುಧಾರಣೆಗಳನ್ನು ತಿಳಿಸಿ.",
    "textKnEn": "Nanna 30 second self intro review madi improvements heli.",
    "tags": [
      "self-intro",
      "feedback"
    ]
  },
  {
    "id": "sug_2_practise_23",
    "sessionId": 2,
    "category": "practise",
    "text": "Simulate a scenario: My teammate missed their review slot before a 5 PM client submission.",
    "textKn": "ಸನ್ನಿವೇಶ ಅಭ್ಯಾಸ: ಸಂಜೆ 5 ಗಂಟೆಯ ಕ್ಲೈಂಟ್ ಸಲ್ಲಿಕೆಗೆ ಮುನ್ನ ಸಹೋದ್ಯೋಗಿ ವಿಮರ್ಶೆಯನ್ನು ತಪ್ಪಿಸಿದ್ದಾರೆ.",
    "textKnEn": "Teammate review miss madidre 5 PM client submission ge en madodu?",
    "tags": [
      "scenario"
    ]
  },
  {
    "id": "sug_2_practise_24",
    "sessionId": 2,
    "category": "practise",
    "text": "Quiz me on assigning RACI roles for a financial reporting deliverable.",
    "textKn": "ಹಣಕಾಸು ವರದಿ ಸಲ್ಲಿಕೆಗೆ RACI ಪಾತ್ರಗಳನ್ನು ನಿಗದಿಪಡಿಸುವ ಕುರಿತು ನನ್ನನ್ನು ಪ್ರಶ್ನಿಸಿ.",
    "textKnEn": "Financial report ge RACI roles assign madoke quiz kodi.",
    "tags": [
      "raci-quiz"
    ]
  },
  {
    "id": "sug_3_understand_25",
    "sessionId": 3,
    "category": "understand",
    "text": "What makes a corporate email clear, actionable, and executive-ready?",
    "textKn": "ಕಾರ್ಪೊರೇಟ್ ಇಮೇಲ್ ಸ್ಪಷ್ಟ, ಪರಿಣಾಮಕಾರಿ ಮತ್ತು ಕಾರ್ಯಸಾಧ್ಯವಾಗಲು ಏನು ಅಗತ್ಯ?",
    "textKnEn": "Corporate email clear mattu executive ready agoke en beku?",
    "tags": [
      "email",
      "clarity"
    ]
  },
  {
    "id": "sug_3_understand_26",
    "sessionId": 3,
    "category": "understand",
    "text": "Explain the 4-hour client communication SLA and why acknowledgment matters.",
    "textKn": "4 ಗಂಟೆಗಳ ಕ್ಲೈಂಟ್ ಸಂವಹನ ಎಸ್‌ಎಲ್‌ಎ (SLA) ನಿಯಮ ಮತ್ತು ಸ್ವೀಕೃತಿ ಸಂದೇಶದ ಮಹತ್ವವನ್ನು ವಿವರಿಸಿ.",
    "textKnEn": "4 hour client communication SLA eke important?",
    "tags": [
      "sla",
      "acknowledgment"
    ]
  },
  {
    "id": "sug_3_understand_27",
    "sessionId": 3,
    "category": "understand",
    "text": "When should an issue be escalated to management versus resolved at the squad level?",
    "textKn": "ಸಮಸ್ಯೆಯನ್ನು ತಂಡದ ಮಟ್ಟದಲ್ಲೇ ಬಗೆಹರಿಸುವುದು ಯಾವಾಗ ಮತ್ತು ಮೇಲಧಿಕಾರಿಗಳಿಗೆ ಕೊಂಡೊಯ್ಯುವುದು ಯಾವಾಗ?",
    "textKnEn": "Yavaga issue escalate madbeku mattu yavaga resolve madbeku?",
    "tags": [
      "escalation-hierarchy"
    ]
  },
  {
    "id": "sug_3_solve_28",
    "sessionId": 3,
    "category": "solve",
    "text": "Show me the standard structure for an urgent project escalation email.",
    "textKn": "ತುರ್ತು ಯೋಜನಾ ಎಸ್ಕೆಲೇಶನ್ ಇಮೇಲ್ ಬರೆಯುವ ವೃತ್ತಿಪರ ವಿನ್ಯಾಸವನ್ನು ತೋರಿಸಿ.",
    "textKnEn": "Urgent project escalation email standard structure torsi.",
    "tags": [
      "escalation-email"
    ]
  },
  {
    "id": "sug_3_solve_29",
    "sessionId": 3,
    "category": "solve",
    "text": "How do I politely inform a senior manager that required client data is missing?",
    "textKn": "ಅಗತ್ಯವಿರುವ ಕ್ಲೈಂಟ್ ಮಾಹಿತಿ ಬಂದಿಲ್ಲವೆಂದು ಹಿರಿಯ ಮ್ಯಾನೇಜರ್‌ಗೆ ವಿನಮ್ರವಾಗಿ ಹೇಗೆ ತಿಳಿಸುವುದು?",
    "textKnEn": "Senior manager ge missing data bagge politely hege helodu?",
    "tags": [
      "polite-communication"
    ]
  },
  {
    "id": "sug_3_solve_30",
    "sessionId": 3,
    "category": "solve",
    "text": "How do I draft an Executive Incident Summary with decision, impact, and next steps?",
    "textKn": "ನಿರ್ಧಾರ, ಪರಿಣಾಮ ಮತ್ತು ಮುಂದಿನ ಕ್ರಮಗಳನ್ನು ಒಳಗೊಂಡ ಘಟನಾ ಸಾರಾಂಶವನ್ನು ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "Executive incident summary decision impact next steps inda hege draft madodu?",
    "tags": [
      "incident-report"
    ]
  },
  {
    "id": "sug_3_apply_31",
    "sessionId": 3,
    "category": "apply",
    "text": "How does an Infosys delivery team communicate a billing data discrepancy to a client?",
    "textKn": "ಇನ್ಫೋಸಿಸ್ ತಂಡವು ಬಿಲ್ಲಿಂಗ್ ಡೇಟಾ ವ್ಯತ್ಯಾಸವನ್ನು ಕ್ಲೈಂಟ್‌ಗೆ ಹೇಗೆ ವೃತ್ತಿಪರವಾಗಿ ತಿಳಿಸುತ್ತದೆ?",
    "textKnEn": "Infosys billing discrepancy na client ge hege communicate madtare?",
    "tags": [
      "infosys-client"
    ]
  },
  {
    "id": "sug_3_apply_32",
    "sessionId": 3,
    "category": "apply",
    "text": "What subject line format gets immediate attention from busy corporate stakeholders?",
    "textKn": "ಕಾರ್ಯನಿರತ ಕಾರ್ಪೊರೇಟ್ ಅಧಿಕಾರಿಗಳ ತಕ್ಷಣದ ಗಮನ ಸೆಳೆಯುವ ಸಬ್ಜೆಕ್ಟ್ ಲೈನ್ ಹೇಗಿರಬೇಕು?",
    "textKnEn": "Busy corporate stakeholders attention gelloke subject line hegira beku?",
    "tags": [
      "subject-lines"
    ]
  },
  {
    "id": "sug_3_apply_33",
    "sessionId": 3,
    "category": "apply",
    "text": "How do I document an oral phone agreement in a formal follow-up email?",
    "textKn": "ಫೋನ್ ಸಂಭಾಷಣೆಯಲ್ಲಿ ಆದ ಒಪ್ಪಂದವನ್ನು ಔಪಚಾರಿಕ ಫಾಲೋ-ಅಪ್ ಇಮೇಲ್‌ನಲ್ಲಿ ಹೇಗೆ ದಾಖಲಿಸುವುದು?",
    "textKnEn": "Phone discussion na formal follow up email alli hege confirm madodu?",
    "tags": [
      "written-record"
    ]
  },
  {
    "id": "sug_3_practise_34",
    "sessionId": 3,
    "category": "practise",
    "text": "Give me a poorly written student email and ask me to rewrite it professionally.",
    "textKn": "ಅಪೂರ್ಣವಾಗಿ ಬರೆದ ವಿದ್ಯಾರ್ಥಿ ಇಮೇಲ್ ನೀಡಿ, ಅದನ್ನು ವೃತ್ತಿಪರವಾಗಿ ಪುನಃ ಬರೆಯಲು ಸವಾಲು ನೀಡಿ.",
    "textKnEn": "Kettadagi iro email kottu professional agi rewrite madoke heli.",
    "tags": [
      "email-rewrite"
    ]
  },
  {
    "id": "sug_3_practise_35",
    "sessionId": 3,
    "category": "practise",
    "text": "Test me: Write a 3-sentence update explaining a 1-day deliverable delay.",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: 1 ದಿನದ ವಿಳಂಬವನ್ನು ವಿವರಿಸುವ 3-ವಾಕ್ಯಗಳ ಸಂಕ್ಷಿಪ್ತ ಅಪ್‌ಡೇಟ್ ಬರೆಯಿರಿ.",
    "textKnEn": "1 day delay explain mado 3 sentence update bariyo test kodi.",
    "tags": [
      "delay-update"
    ]
  },
  {
    "id": "sug_3_practise_36",
    "sessionId": 3,
    "category": "practise",
    "text": "Evaluate this email draft: \"Hey, can you send the numbers ASAP?\"",
    "textKn": "ಈ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ: \"ಹೇ, ನನಗೆ ಅಂಕಿಅಂಶಗಳನ್ನು ಬೇಗನೆ ಕಳುಹಿಸಬಹುದೇ?\"",
    "textKnEn": "Ee email draft na evaluate madi improvements heli.",
    "tags": [
      "critique"
    ]
  },
  {
    "id": "sug_4_understand_37",
    "sessionId": 4,
    "category": "understand",
    "text": "What is the exact purpose of Minutes of Meeting (MoM) in a corporate review?",
    "textKn": "ಕಾರ್ಪೊರೇಟ್ ಸಭೆಯಲ್ಲಿ ಸಭಾ ನಡಾವಳಿಗಳ (MoM) ನಿಖರ ಉದ್ದೇಶವೇನು?",
    "textKnEn": "Corporate review nalli Minutes of Meeting (MoM) mukya purpose enu?",
    "tags": [
      "mom",
      "meetings"
    ]
  },
  {
    "id": "sug_4_understand_38",
    "sessionId": 4,
    "category": "understand",
    "text": "Why should MoM record decisions and owners rather than a word-for-word transcript?",
    "textKn": "ಸಭಾ ನಡಾವಳಿಯು ಪೂರ್ಣ ಸಂಭಾಷಣೆಗಿಂತ ನಿರ್ಧಾರಗಳು ಮತ್ತು ಜವಾಬ್ದಾರರನ್ನು ಏಕೆ ದಾಖಲಿಸಬೇಕು?",
    "textKnEn": "Word to word transcript badalu decisions mattu owners eke record madbeku?",
    "tags": [
      "decisions-over-notes"
    ]
  },
  {
    "id": "sug_4_understand_39",
    "sessionId": 4,
    "category": "understand",
    "text": "How does a 15-minute daily standup meeting improve delivery velocity?",
    "textKn": "15 ನಿಮಿಷಗಳ ದೈನಂದಿನ ಸ್ಟ್ಯಾಂಡಪ್ ಸಭೆಯು ಕೆಲಸದ ವೇಗವನ್ನು ಹೇಗೆ ಹೆಚ್ಚಿಸುತ್ತದೆ?",
    "textKnEn": "15-min daily standup hege delivery velocity improve madatte?",
    "tags": [
      "standup"
    ]
  },
  {
    "id": "sug_4_solve_40",
    "sessionId": 4,
    "category": "solve",
    "text": "How do I structure an MoM table with Item, Discussion, Decision, Owner, and Deadline?",
    "textKn": "ಐಟಂ, ಚರ್ಚೆ, ನಿರ್ಧಾರ, ಜವಾಬ್ದಾರರು ಮತ್ತು ಗಡುವನ್ನು ಒಳಗೊಂಡ MoM ಕೋಷ್ಟಕವನ್ನು ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "MoM table Item Decision Owner Deadline hege format madodu?",
    "tags": [
      "mom-format"
    ]
  },
  {
    "id": "sug_4_solve_41",
    "sessionId": 4,
    "category": "solve",
    "text": "What steps should I take if an action owner disagrees with a deadline recorded in the MoM?",
    "textKn": "ದಾಖಲಾದ ಗಡುವಿಗೆ ಜವಾಬ್ದಾರರು ಅಸಮ್ಮತಿ ಸೂಚಿಸಿದರೆ ಯಾವ ಕ್ರಮ ಕೈಗೊಳ್ಳಬೇಕು?",
    "textKnEn": "Action owner deadline ge oppadiddare hege resolve madodu?",
    "tags": [
      "deadline-conflict"
    ]
  },
  {
    "id": "sug_4_solve_42",
    "sessionId": 4,
    "category": "solve",
    "text": "How do I write clear, unambiguous action items so there is no confusion later?",
    "textKn": "ನಂತರ ಯಾವುದೇ ಗೊಂದಲವಿಲ್ಲದಂತೆ ಸ್ಪಷ್ಟ ಆಕ್ಷನ್ ಐಟಂಗಳನ್ನು ಹೇಗೆ ಬರೆಯುವುದು?",
    "textKnEn": "Clear unambiguous action items hege bariyodu?",
    "tags": [
      "action-items"
    ]
  },
  {
    "id": "sug_4_apply_43",
    "sessionId": 4,
    "category": "apply",
    "text": "How does Maruti Suzuki track dealer supply chain bottlenecks during weekly reviews?",
    "textKn": "ಮಾರುತಿ ಸುಜುಕಿ ಸಾಪ್ತಾಹಿಕ ಪರಿಶೀಲನೆಯಲ್ಲಿ ಡೀಲರ್ ಸಪ್ಲೈ ಚೈನ್ ಅಡೆತಡೆಗಳನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸುತ್ತದೆ?",
    "textKnEn": "Maruti Suzuki dealer review meetings hege conduct madtare?",
    "tags": [
      "maruti",
      "supply-chain"
    ]
  },
  {
    "id": "sug_4_apply_44",
    "sessionId": 4,
    "category": "apply",
    "text": "What documentation standard is expected when escalating an unresolved meeting issue?",
    "textKn": "ಸಭೆಯಲ್ಲಿ ಬಗೆಹರಿಯದ ವಿಷಯವನ್ನು ಮೇಲಧಿಕಾರಿಗಳಿಗೆ ಕೊಂಡೊಯ್ಯುವಾಗ ಯಾವ ದಾಖಲೆಗಳು ಅಗತ್ಯ?",
    "textKnEn": "Unresolved meeting issue escalate madoke yav documentation beku?",
    "tags": [
      "escalation-standard"
    ]
  },
  {
    "id": "sug_4_apply_45",
    "sessionId": 4,
    "category": "apply",
    "text": "How should a meeting facilitator manage participants who go off-topic?",
    "textKn": "ವಿಷಯಾಂತರ ಮಾಡುವ ಭಾಗವಹಿಸುವವರನ್ನು ಸಭೆಯ ನಿರ್ವಾಹಕರು ಹೇಗೆ ನಿಯಂತ್ರಣದಲ್ಲಿಡಬೇಕು?",
    "textKnEn": "Off-topic hogovranna meeting alli hege redirect madodu?",
    "tags": [
      "meeting-facilitation"
    ]
  },
  {
    "id": "sug_4_practise_46",
    "sessionId": 4,
    "category": "practise",
    "text": "Given raw meeting notes, convert them into an executive MoM with 3 clear decisions.",
    "textKn": "ಕಚ್ಚಾ ಸಭಾ ಟಿಪ್ಪಣಿಗಳನ್ನು ನೀಡಿ, ಅವುಗಳನ್ನು 3 ಸ್ಪಷ್ಟ ನಿರ್ಧಾರಗಳಿರುವ MoM ಆಗಿ ಪರಿವರ್ತಿಸಲು ಹೇಳಿ.",
    "textKnEn": "Raw meeting notes kottu executive MoM convert madoke test kodi.",
    "tags": [
      "mom-exercise"
    ]
  },
  {
    "id": "sug_4_practise_47",
    "sessionId": 4,
    "category": "practise",
    "text": "Test me on writing an agenda for a 30-minute monthly financial close review.",
    "textKn": "30 ನಿಮಿಷಗಳ ಮಾಸಿಕ ಹಣಕಾಸು ಮುಕ್ತಾಯ ಸಭೆಯ ಅಜೆಂಡಾ ಬರೆಯುವ ಪರೀಕ್ಷೆ ನೀಡಿ.",
    "textKnEn": "30-min financial review meeting agenda bariyoke quiz kodi.",
    "tags": [
      "agenda-test"
    ]
  },
  {
    "id": "sug_4_practise_48",
    "sessionId": 4,
    "category": "practise",
    "text": "Simulate a 2-minute daily standup update for a finance intern.",
    "textKn": "ಹಣಕಾಸು ಇಂಟರ್ನ್‌ಗಾಗಿ 2 ನಿಮಿಷಗಳ ದೈನಂದಿನ ಸ್ಟ್ಯಾಂಡಪ್ ಅಪ್‌ಡೇಟ್ ಅಭ್ಯಾಸ ನಡೆಸಿ.",
    "textKnEn": "Finance intern daily standup update simulate madi.",
    "tags": [
      "standup-simulation"
    ]
  },
  {
    "id": "sug_5_understand_49",
    "sessionId": 5,
    "category": "understand",
    "text": "Explain the Golden Rules of Accounting and why debits must equal credits.",
    "textKn": "ಲೆಕ್ಕಪತ್ರದ ಗೋಲ್ಡನ್ ನಿಯಮಗಳು ಮತ್ತು ಡೆಬಿಟ್-ಕ್ರೆಡಿಟ್ ಸಮನಾಗಿರಬೇಕಾದ ಕಾರಣವನ್ನು ವಿವರಿಸಿ.",
    "textKnEn": "Golden Rules of Accounting mattu debit-credit equality eke important?",
    "tags": [
      "accounting-rules",
      "debit-credit"
    ]
  },
  {
    "id": "sug_5_understand_50",
    "sessionId": 5,
    "category": "understand",
    "text": "What is the conceptual difference between Capital Expenditure and Revenue Expenditure?",
    "textKn": "ಬಂಡವಾಳ ವೆಚ್ಚ (Capex) ಮತ್ತು ಆದಾಯ ವೆಚ್ಚ (Opex) ನಡುವಿನ ಮುಖ್ಯ ವ್ಯತ್ಯಾಸವೇನು?",
    "textKnEn": "Capital expenditure mattu revenue expenditure difference enu?",
    "tags": [
      "capex-opex"
    ]
  },
  {
    "id": "sug_5_understand_51",
    "sessionId": 5,
    "category": "understand",
    "text": "Why are accrued expenses recorded before cash is actually paid?",
    "textKn": "ವಾಸ್ತವವಾಗಿ ಹಣ ಪಾವತಿಸುವ ಮೊದಲೇ ಬರಬೇಕಾದ ವೆಚ್ಚಗಳನ್ನು (Accrued Expenses) ಏಕೆ ದಾಖಲಿಸಲಾಗುತ್ತದೆ?",
    "textKnEn": "Accrued expenses cash pay agoke munche eke record madtare?",
    "tags": [
      "accruals"
    ]
  },
  {
    "id": "sug_5_solve_52",
    "sessionId": 5,
    "category": "solve",
    "text": "Show me the journal entries for purchasing ₹1,50,000 raw material on credit with 18% GST.",
    "textKn": "18% ಜಿಎಸ್‌ಟಿಯೊಂದಿಗೆ ಸಾಲದ ಮೇಲೆ ₹1,50,000 ಕಚ್ಚಾ ವಸ್ತು ಖರೀದಿಗೆ ಜರ್ನಲ್ ಎಂಟ್ರಿಗಳನ್ನು ತೋರಿಸಿ.",
    "textKnEn": "1.5L raw material purchase on credit with 18% GST journal entry hege pass madodu?",
    "tags": [
      "journal-entry",
      "gst-accounting"
    ]
  },
  {
    "id": "sug_5_solve_53",
    "sessionId": 5,
    "category": "solve",
    "text": "How do I verify the authenticity of a vendor tax invoice before posting an entry?",
    "textKn": "ಎಂಟ್ರಿ ಮಾಡುವ ಮೊದಲು ಮಾರಾಟಗಾರರ ತೆರಿಗೆ ಇನ್‌ವಾಯ್ಸ್‌ನ ದೃಢೀಕರಣವನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸುವುದು?",
    "textKnEn": "Vendor tax invoice authenticity hege verify madodu?",
    "tags": [
      "invoice-verification"
    ]
  },
  {
    "id": "sug_5_solve_54",
    "sessionId": 5,
    "category": "solve",
    "text": "How do I record a prepaid insurance payment spanning across two financial years?",
    "textKn": "ಎರಡು ಹಣಕಾಸು ವರ್ಷಗಳಿಗೆ ಹರಡಿರುವ ಮುಂಗಡ ವಿಮಾ ಪಾವತಿಯನ್ನು ಹೇಗೆ ದಾಖಲಿಸುವುದು?",
    "textKnEn": "Two financial years prepaid insurance payment hege record madodu?",
    "tags": [
      "prepaid-expenses"
    ]
  },
  {
    "id": "sug_5_apply_55",
    "sessionId": 5,
    "category": "apply",
    "text": "In Titan’s retail operations, how are customer advance deposits for jewelry recorded?",
    "textKn": "ಟೈಟಾನ್‌ನ ಚಿಲ್ಲರೆ ವಹಿವಾಟಿನಲ್ಲಿ, ಗ್ರಾಹಕರ ಆಭರಣ ಮುಂಗಡ ಠೇವಣಿಗಳನ್ನು ಹೇಗೆ ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತದೆ?",
    "textKnEn": "Titan retail operations alli customer advance deposits hege record agatte?",
    "tags": [
      "titan",
      "customer-advances"
    ]
  },
  {
    "id": "sug_5_apply_56",
    "sessionId": 5,
    "category": "apply",
    "text": "What internal controls prevent duplicate vendor payments in a manufacturing company?",
    "textKn": "ಉತ್ಪಾದನಾ ಕಂಪನಿಯಲ್ಲಿ ಮಾರಾಟಗಾರರಿಗೆ ಎರಡು ಬಾರಿ ಪಾವತಿಯಾಗುವುದನ್ನು ತಡೆಯುವ ನಿಯಂತ್ರಣಗಳು ಯಾವುವು?",
    "textKnEn": "Duplicate vendor payments thadiyoke yav internal controls beku?",
    "tags": [
      "internal-controls"
    ]
  },
  {
    "id": "sug_5_apply_57",
    "sessionId": 5,
    "category": "apply",
    "text": "Why does the Indian Accounting Standard (Ind AS) mandate the accrual principle?",
    "textKn": "ಭಾರತೀಯ ಲೆಕ್ಕಪತ್ರ ಮಾನದಂಡಗಳು (Ind AS) ಸಂಚಿತ ತತ್ವವನ್ನು (Accrual Principle) ಏಕೆ ಕಡ್ಡಾಯಗೊಳಿಸುತ್ತವೆ?",
    "textKnEn": "Ind AS accrual principle eke mandatory madide?",
    "tags": [
      "ind-as",
      "compliance"
    ]
  },
  {
    "id": "sug_5_practise_58",
    "sessionId": 5,
    "category": "practise",
    "text": "Test me with 3 transaction scenarios and ask me to provide the correct debit and credit.",
    "textKn": "3 ವಹಿವಾಟಿನ ಸನ್ನಿವೇಶಗಳನ್ನು ನೀಡಿ ಸರಿಯಾದ ಡೆಬಿಟ್ ಮತ್ತು ಕ್ರೆಡಿಟ್ ತಿಳಿಸಲು ನನ್ನನ್ನು ಪರೀಕ್ಷಿಸಿ.",
    "textKnEn": "3 transactions kottu debit-credit pass madoke quiz kodi.",
    "tags": [
      "debit-credit-quiz"
    ]
  },
  {
    "id": "sug_5_practise_59",
    "sessionId": 5,
    "category": "practise",
    "text": "Spot the error: A bookkeeper debited Rent Expense and credited Cash for an advance security deposit.",
    "textKn": "ದೋಷ ಪತ್ತೆ ಮಾಡಿ: ಭದ್ರತಾ ಠೇವಣಿಗಾಗಿ ಬಾಡಿಗೆ ಖರ್ಚನ್ನು ಡೆಬಿಟ್ ಮಾಡಿ ನಗದನ್ನು ಕ್ರೆಡಿಟ್ ಮಾಡಲಾಗಿದೆ.",
    "textKnEn": "Spot the error: Security deposit ge Rent Expense debit madidare sari na?",
    "tags": [
      "error-spotting"
    ]
  },
  {
    "id": "sug_5_practise_60",
    "sessionId": 5,
    "category": "practise",
    "text": "Classify these 5 expenses into Capex or Opex with reasons.",
    "textKn": "ಈ 5 ವೆಚ್ಚಗಳನ್ನು ಬಂಡವಾಳ ಅಥವಾ ಆದಾಯ ವೆಚ್ಚಗಳಾಗಿ ವರ್ಗೀಕರಿಸಲು ಪರೀಕ್ಷೆ ನೀಡಿ.",
    "textKnEn": "5 expenses kottu Capex or Opex classify madoke test kodi.",
    "tags": [
      "capex-opex-test"
    ]
  },
  {
    "id": "sug_6_understand_61",
    "sessionId": 6,
    "category": "understand",
    "text": "What are the 5 standard steps in a corporate month-end ledger close?",
    "textKn": "ಕಾರ್ಪೊರೇಟ್ ಮಾಸಾಂತ್ಯದ ಲೆಡ್ಜರ್ ಮುಕ್ತಾಯದಲ್ಲಿರುವ 5 ಪ್ರಮುಖ ಹಂತಗಳು ಯಾವುವು?",
    "textKnEn": "Month end close 5 standard steps yavudu?",
    "tags": [
      "month-end-close",
      "ledger"
    ]
  },
  {
    "id": "sug_6_understand_62",
    "sessionId": 6,
    "category": "understand",
    "text": "Can a Trial Balance balance even if there are fundamental accounting errors?",
    "textKn": "ಮೂಲಭೂತ ಲೆಕ್ಕಪತ್ರ ದೋಷಗಳಿದ್ದರೂ ಟ್ರಯಲ್ ಬ್ಯಾಲೆನ್ಸ್ ಸಮನಾಗಿರಲು ಸಾಧ್ಯವೇ?",
    "textKnEn": "Trial balance tally adaru errors irbahuda?",
    "tags": [
      "trial-balance-errors"
    ]
  },
  {
    "id": "sug_6_understand_63",
    "sessionId": 6,
    "category": "understand",
    "text": "Explain why adjusting entries are required for unearned revenue and depreciation.",
    "textKn": "ಗಳಿಸದ ಆದಾಯ ಮತ್ತು ಸವಕಳಿಗಾಗಿ ಸರಿಹೊಂದಿಸುವ ನಮೂದುಗಳು (Adjusting Entries) ಏಕೆ ಬೇಕು?",
    "textKnEn": "Unearned revenue mattu depreciation ge adjusting entries eke beku?",
    "tags": [
      "adjusting-entries"
    ]
  },
  {
    "id": "sug_6_solve_64",
    "sessionId": 6,
    "category": "solve",
    "text": "How do I detect a transposition error when the trial balance difference is divisible by 9?",
    "textKn": "ವ್ಯತ್ಯಾಸವು 9 ರಿಂದ ಭಾಗವಾದಾಗ ಟ್ರಾನ್ಸ್‌ಪೊಸಿಷನ್ ದೋಷವನ್ನು ಹೇಗೆ ಕಂಡುಹಿಡಿಯುವುದು?",
    "textKnEn": "Trial balance difference 9 inda divide adre error hege detect madodu?",
    "tags": [
      "transposition-error"
    ]
  },
  {
    "id": "sug_6_solve_65",
    "sessionId": 6,
    "category": "solve",
    "text": "What is the step-by-step process for reconciling a sub-ledger with the General Ledger control account?",
    "textKn": "ಜನರಲ್ ಲೆಡ್ಜರ್ ಜೊತೆಗೆ ಸಬ್-ಲೆಡ್ಜರ್ ಸಮನ್ವಯಗೊಳಿಸುವ ಹಂತ-ಹಂತದ ಪ್ರಕ್ರಿಯೆ ಯಾವುದು?",
    "textKnEn": "Sub-ledger na General Ledger control account jote hege reconcile madodu?",
    "tags": [
      "sub-ledger-reconciliation"
    ]
  },
  {
    "id": "sug_6_solve_66",
    "sessionId": 6,
    "category": "solve",
    "text": "Show me how to draft a month-end close checklist with owner and sign-off timestamps.",
    "textKn": "ಜವಾಬ್ದಾರರು ಮತ್ತು ಅನುಮೋದನೆ ಸಮಯವನ್ನು ಒಳಗೊಂಡ ಮಾಸಾಂತ್ಯದ ಪರಿಶೀಲನಾ ಪಟ್ಟಿಯನ್ನು ತೋರಿಸಿ.",
    "textKnEn": "Month end close checklist with signoff timestamps hege banisodu?",
    "tags": [
      "close-checklist"
    ]
  },
  {
    "id": "sug_6_apply_67",
    "sessionId": 6,
    "category": "apply",
    "text": "How does an IT services leader like Infosys close books across multiple global currencies?",
    "textKn": "ಇನ್ಫೋಸಿಸ್‌ನಂತಹ ಸಂಸ್ಥೆಯು ವಿವಿಧ ಜಾಗತಿಕ ಕರೆನ್ಸಿಗಳಲ್ಲಿ ಮಾಸಾಂತ್ಯದ ಲೆಕ್ಕಗಳನ್ನು ಹೇಗೆ ಮುಕ್ತಾಯಗೊಳಿಸುತ್ತದೆ?",
    "textKnEn": "Infosys multiple currencies alli month end close hege madtare?",
    "tags": [
      "infosys",
      "multi-currency"
    ]
  },
  {
    "id": "sug_6_apply_68",
    "sessionId": 6,
    "category": "apply",
    "text": "What happens if a cutoff error occurs where sales from the next month are booked early?",
    "textKn": "ಮುಂದಿನ ತಿಂಗಳ ಮಾರಾಟವನ್ನು ಮೊದಲೇ ದಾಖಲಿಸುವ ಕಟ್-ಆಫ್ ದೋಷ ಸಂಭವಿಸಿದರೆ ಏನಾಗುತ್ತದೆ?",
    "textKnEn": "Sales cutoff error adre financial statements mela en impact agatte?",
    "tags": [
      "cutoff-error"
    ]
  },
  {
    "id": "sug_6_apply_69",
    "sessionId": 6,
    "category": "apply",
    "text": "How do auditors verify balance sheet substantiation during year-end closure?",
    "textKn": "ವರ್ಷಾಂತ್ಯದ ಮುಕ್ತಾಯದ ಸಮಯದಲ್ಲಿ ಲೆಕ್ಕ ಪರಿಶೋಧಕರು ಆಸ್ತಿ-ಹೊಣೆಗಾರಿಕೆ ಸಮರ್ಥನೆಯನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸುತ್ತಾರೆ?",
    "textKnEn": "Auditors balance sheet substantiation hege verify madtare?",
    "tags": [
      "audit-substantiation"
    ]
  },
  {
    "id": "sug_6_practise_70",
    "sessionId": 6,
    "category": "practise",
    "text": "Given an unbalanced trial balance of ₹18,000 difference, guide me to locate the discrepancy.",
    "textKn": "₹18,000 ವ್ಯತ್ಯಾಸವಿರುವ ಟ್ರಯಲ್ ಬ್ಯಾಲೆನ್ಸ್ ನೀಡಿ, ಆ ದೋಷವನ್ನು ಪತ್ತೆಹಚ್ಚಲು ನನಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಿ.",
    "textKnEn": "18,000 difference iro trial balance alli error find madoke help madi.",
    "tags": [
      "trial-balance-quiz"
    ]
  },
  {
    "id": "sug_6_practise_71",
    "sessionId": 6,
    "category": "practise",
    "text": "Test my knowledge on closing temporary accounts to Retained Earnings.",
    "textKn": "ತಾತ್ಕಾಲಿಕ ಖಾತೆಗಳನ್ನು ಉಳಿಸಿಕೊಂಡ ಗಳಿಕೆಗೆ (Retained Earnings) ಮುಕ್ತಾಯಗೊಳಿಸುವ ಬಗ್ಗೆ ಪ್ರಶ್ನಿಸಿ.",
    "textKnEn": "Temporary accounts Retained Earnings ge close mado bagge quiz kodi.",
    "tags": [
      "closing-entries-quiz"
    ]
  },
  {
    "id": "sug_6_practise_72",
    "sessionId": 6,
    "category": "practise",
    "text": "Explain how an unrecorded ₹50,000 supplier invoice impacts both P&L and Balance Sheet.",
    "textKn": "ದಾಖಲಾಗದ ₹50,000 ಪೂರೈಕೆದಾರರ ಇನ್‌ವಾಯ್ಸ್ ಲಾಭ-ನಷ್ಟ ಮತ್ತು ಬ್ಯಾಲೆನ್ಸ್ ಶೀಟ್ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?",
    "textKnEn": "Unrecorded 50k invoice P&L mattu Balance sheet mela hege effect agatte?",
    "tags": [
      "impact-analysis"
    ]
  },
  {
    "id": "sug_7_understand_73",
    "sessionId": 7,
    "category": "understand",
    "text": "What is the \"Preserve Raw, Transform Clean, Document Exceptions\" principle in Excel?",
    "textKn": "ಎಕ್ಸೆಲ್‌ನಲ್ಲಿ \"ಕಚ್ಚಾ ಡೇಟಾ ಉಳಿಸಿ, ಸ್ವಚ್ಛಗೊಳಿಸಿ, ವಿನಾಯಿತಿಗಳನ್ನು ದಾಖಲಿಸಿ\" ತತ್ವದ ಅರ್ಥವೇನು?",
    "textKnEn": "Excel alli Raw, Clean, Exceptions principle enu?",
    "tags": [
      "excel",
      "data-cleaning"
    ]
  },
  {
    "id": "sug_7_understand_74",
    "sessionId": 7,
    "category": "understand",
    "text": "Why is a composite business key better than customer name alone for duplicate detection?",
    "textKn": "ನಕಲು ಪತ್ತೆಗೆ ಕೇವಲ ಗ್ರಾಹಕರ ಹೆಸರಿಗಿಂತ ಸಂಯೋಜಿತ ವ್ಯವಹಾರ ಕೀಲಿ (Business Key) ಏಕೆ ಉತ್ತಮ?",
    "textKnEn": "Duplicate find madoke customer name ginta composite business key eke better?",
    "tags": [
      "business-key",
      "duplicates"
    ]
  },
  {
    "id": "sug_7_understand_75",
    "sessionId": 7,
    "category": "understand",
    "text": "Explain why trailing spaces and non-breaking spaces corrupt VLOOKUP and XLOOKUP.",
    "textKn": "ಖಾಲಿ ಜಾಗಗಳು (Trailing Spaces) VLOOKUP ಮತ್ತು XLOOKUP ಸೂತ್ರಗಳನ್ನು ಹೇಗೆ ಹಾಳುಮಾಡುತ್ತವೆ?",
    "textKnEn": "Trailing spaces Excel formulas na hege break madatte?",
    "tags": [
      "trim-clean",
      "lookup"
    ]
  },
  {
    "id": "sug_7_solve_76",
    "sessionId": 7,
    "category": "solve",
    "text": "How do I build the ₹44,000 billing variance bridge in Excel between billed and collected?",
    "textKn": "ಬಿಲ್ ಮಾಡಿದ ಮತ್ತು ಸಂಗ್ರಹಿಸಿದ ಮೊತ್ತದ ನಡುವೆ ₹44,000 ವ್ಯತ್ಯಾಸ ಸೇತುವೆಯನ್ನು ಎಕ್ಸೆಲ್‌ನಲ್ಲಿ ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "Excel nalli 44k billing variance bridge hege build madodu?",
    "tags": [
      "variance-bridge",
      "hul"
    ]
  },
  {
    "id": "sug_7_solve_77",
    "sessionId": 7,
    "category": "solve",
    "text": "Show me the formula combining TRIM, CLEAN, and UPPER to standardize customer names.",
    "textKn": "ಗ್ರಾಹಕರ ಹೆಸರುಗಳನ್ನು ಸಮರ್ಪಕಗೊಳಿಸಲು TRIM, CLEAN ಮತ್ತು UPPER ಸಂಯೋಜಿಸುವ ಸೂತ್ರವನ್ನು ತೋರಿಸಿ.",
    "textKnEn": "TRIM CLEAN UPPER combine mado formula torsi.",
    "tags": [
      "excel-formulas"
    ]
  },
  {
    "id": "sug_7_solve_78",
    "sessionId": 7,
    "category": "solve",
    "text": "How do I construct a multi-criteria XLOOKUP or INDEX-MATCH in modern Excel?",
    "textKn": "ಆಧುನಿಕ ಎಕ್ಸೆಲ್‌ನಲ್ಲಿ ಬಹು-ಮಾನದಂಡಗಳ XLOOKUP ಅಥವಾ INDEX-MATCH ಅನ್ನು ಹೇಗೆ ನಿರ್ಮಿಸುವುದು?",
    "textKnEn": "Multi criteria XLOOKUP or INDEX MATCH hege construct madodu?",
    "tags": [
      "xlookup"
    ]
  },
  {
    "id": "sug_7_apply_79",
    "sessionId": 7,
    "category": "apply",
    "text": "In HUL distributor analytics, how do analysts cleanse monthly secondary sales data?",
    "textKn": "ಎಚ್‌ಯುಎಲ್ ವಿತರಕರ ವಿಶ್ಲೇಷಣೆಯಲ್ಲಿ ಮಾಸಿಕ ದ್ವಿತೀಯ ಮಾರಾಟದ ಡೇಟಾವನ್ನು ಹೇಗೆ ಸ್ವಚ್ಛಗೊಳಿಸಲಾಗುತ್ತದೆ?",
    "textKnEn": "HUL distributor secondary sales data hege cleanse madtare?",
    "tags": [
      "hul",
      "secondary-sales"
    ]
  },
  {
    "id": "sug_7_apply_80",
    "sessionId": 7,
    "category": "apply",
    "text": "How does an erroneous GSTIN format in raw billing data halt invoice e-way bill generation?",
    "textKn": "ಕಚ್ಚಾ ಬಿಲ್ಲಿಂಗ್‌ನಲ್ಲಿ ತಪ್ಪು ಜಿಎಸ್‌ಟಿ ಸಂಖ್ಯೆಯು ಇ-ವೇ ಬಿಲ್ ರಚನೆಯನ್ನು ಹೇಗೆ ತಡೆಯುತ್ತದೆ?",
    "textKnEn": "Wrong GSTIN format e-way bill generation hege stop madatte?",
    "tags": [
      "gstin-validation"
    ]
  },
  {
    "id": "sug_7_apply_81",
    "sessionId": 7,
    "category": "apply",
    "text": "What audit trail should be preserved when removing 120 duplicate entries from a sales ledger?",
    "textKn": "ಮಾರಾಟ ಲೆಡ್ಜರ್‌ನಿಂದ 120 ನಕಲುಗಳನ್ನು ತೆಗೆದುಹಾಕುವಾಗ ಯಾವ ಆಡಿಟ್ ಟ್ರಯಲ್ ಸಂರಕ್ಷಿಸಬೇಕು?",
    "textKnEn": "Duplicate entries remove madovaga yav audit trail maintain madbeku?",
    "tags": [
      "data-audit-trail"
    ]
  },
  {
    "id": "sug_7_practise_82",
    "sessionId": 7,
    "category": "practise",
    "text": "Test me: Write an Excel formula to flag duplicate invoice numbers across two store branches.",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಎರಡು ಅಂಗಡಿ ಶಾಖೆಗಳ ನಡುವೆ ನಕಲಿ ಇನ್‌ವಾಯ್ಸ್ ಸಂಖ್ಯೆಗಳನ್ನು ಗುರುತಿಸಲು ಎಕ್ಸೆಲ್ ಸೂತ್ರ ಬರೆಯಿರಿ.",
    "textKnEn": "Two branches duplicate invoices find mado Excel formula quiz kodi.",
    "tags": [
      "formula-quiz"
    ]
  },
  {
    "id": "sug_7_practise_83",
    "sessionId": 7,
    "category": "practise",
    "text": "Guide me through nesting IF and ISERROR to handle missing vendor codes gracefully.",
    "textKn": "ಕಾಣೆಯಾದ ಮಾರಾಟಗಾರರ ಕೋಡ್‌ಗಳನ್ನು ಸರಿಪಡಿಸಲು IF ಮತ್ತು ISERROR ಬಳಸುವ ವಿಧಾನವನ್ನು ಕಲಿಸಿ.",
    "textKnEn": "Missing vendor codes ge IF ISERROR nest mado test kodi.",
    "tags": [
      "nested-formulas"
    ]
  },
  {
    "id": "sug_7_practise_84",
    "sessionId": 7,
    "category": "practise",
    "text": "Challenge me to write a formula that reconciles a ₹44,000 variance between 2 ledger sheets.",
    "textKn": "ಎರಡು ಲೆಡ್ಜರ್ ಶೀಟ್‌ಗಳ ನಡುವಿನ ₹44,000 ವ್ಯತ್ಯಾಸವನ್ನು ಸರಿದೂಗಿಸುವ ಸೂತ್ರವನ್ನು ಬರೆಯಲು ಸವಾಲು ನೀಡಿ.",
    "textKnEn": "₹44k variance reconcile mado Excel exercise challenge kodi.",
    "tags": [
      "reconciliation-challenge"
    ]
  },
  {
    "id": "sug_8_understand_85",
    "sessionId": 8,
    "category": "understand",
    "text": "What is the conceptual difference between a timing difference and an actual bank error in a BRS?",
    "textKn": "ಬಿಆರ್‌ಎಸ್‌ನಲ್ಲಿ ಸಮಯದ ವ್ಯತ್ಯಾಸ (Timing Difference) ಮತ್ತು ಬ್ಯಾಂಕ್ ದೋಷದ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?",
    "textKnEn": "BRS alli timing difference mattu bank error naduvina difference enu?",
    "tags": [
      "brs",
      "timing-differences"
    ]
  },
  {
    "id": "sug_8_understand_86",
    "sessionId": 8,
    "category": "understand",
    "text": "Why must genuine bank-only charges be recorded in cash book before reconciling?",
    "textKn": "ಸಮನ್ವಯಗೊಳಿಸುವ ಮುನ್ನ ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಶುಲ್ಕಗಳನ್ನು ಕ್ಯಾಶ್ ಬುಕ್‌ನಲ್ಲಿ ಏಕೆ ದಾಖಲಿಸಲೇಬೇಕು?",
    "textKnEn": "Bank charges na cash book alli munche eke record madbeku?",
    "tags": [
      "cash-book-update"
    ]
  },
  {
    "id": "sug_8_understand_87",
    "sessionId": 8,
    "category": "understand",
    "text": "Explain the zero-variance BRS bridge principle.",
    "textKn": "ಶೂನ್ಯ-ವ್ಯತ್ಯಾಸ ಬಿಆರ್‌ಎಸ್ ಬ್ರಿಡ್ಜ್ (Zero-Variance Bridge) ತತ್ವವನ್ನು ವಿವರಿಸಿ.",
    "textKnEn": "Zero-variance BRS bridge principle enu?",
    "tags": [
      "zero-variance"
    ]
  },
  {
    "id": "sug_8_solve_88",
    "sessionId": 8,
    "category": "solve",
    "text": "How do I treat unpresented cheques versus uncredited deposits when reconciling starting from cash book balance?",
    "textKn": "ಕ್ಯಾಶ್ ಬುಕ್ ಬ್ಯಾಲೆನ್ಸ್‌ನಿಂದ ಪ್ರಾರಂಭಿಸುವಾಗ ಬಿಡುಗಡೆಯಾಗದ ಚೆಕ್‌ಗಳು ಮತ್ತು ಜಮೆಯಾಗದ ಠೇವಣಿಗಳನ್ನು ಹೇಗೆ ಪರಿಗಣಿಸುವುದು?",
    "textKnEn": "Unpresented cheques mattu uncredited deposits BRS alli hege adjust madodu?",
    "tags": [
      "unpresented-cheques"
    ]
  },
  {
    "id": "sug_8_solve_89",
    "sessionId": 8,
    "category": "solve",
    "text": "Show me the step-by-step formula to calculate adjusted cash book balance.",
    "textKn": "ಹೊಂದಾಣಿಕೆ ಮಾಡಿದ ಕ್ಯಾಶ್ ಬುಕ್ ಬ್ಯಾಲೆನ್ಸ್ ಲೆಕ್ಕಾಚಾರ ಮಾಡುವ ಹಂತ-ಹಂತದ ವಿಧಾನವನ್ನು ತೋರಿಸಿ.",
    "textKnEn": "Adjusted cash book balance formula step by step torsi.",
    "tags": [
      "adjusted-cash-book"
    ]
  },
  {
    "id": "sug_8_solve_90",
    "sessionId": 8,
    "category": "solve",
    "text": "How do I reconcile auto-debit payments (NACH / ECS) that do not appear in the company ledger?",
    "textKn": "ಕಂಪನಿಯ ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ಕಾಣಿಸದ ಸ್ವಯಂಚಾಲಿತ ಡೆಬಿಟ್ (NACH/ECS) ಪಾವತಿಗಳನ್ನು ಹೇಗೆ ಸರಿಹೊಂದಿಸುವುದು?",
    "textKnEn": "NACH / ECS auto debits na ledger jote hege reconcile madodu?",
    "tags": [
      "auto-debits"
    ]
  },
  {
    "id": "sug_8_apply_91",
    "sessionId": 8,
    "category": "apply",
    "text": "In Titan showroom operations, how are daily credit card swipe settlements reconciled against bank credits?",
    "textKn": "ಟೈಟಾನ್ ಶೋರೂಮ್‌ಗಳಲ್ಲಿ, ದೈನಂದಿನ ಕಾರ್ಡ್ ಸ್ವೈಪ್ ವಹಿವಾಟುಗಳನ್ನು ಬ್ಯಾಂಕ್ ಜಮೆಯೊಂದಿಗೆ ಹೇಗೆ ಸಮನ್ವಯಗೊಳಿಸಲಾಗುತ್ತದೆ?",
    "textKnEn": "Titan showrooms alli daily card swipe settlements BRS hege madtare?",
    "tags": [
      "titan",
      "card-settlement"
    ]
  },
  {
    "id": "sug_8_apply_92",
    "sessionId": 8,
    "category": "apply",
    "text": "What fraud risks exist if bank reconciliations are delayed past 30 days?",
    "textKn": "ಬ್ಯಾಂಕ್ ಸಮನ್ವಯವು 30 ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚು ವಿಳಂಬವಾದರೆ ಯಾವ ವಂಚನೆಯ ಅಪಾಯಗಳು ಉಂಟಾಗಬಹುದು?",
    "textKnEn": "BRS delay adre yav fraud risks ide?",
    "tags": [
      "fraud-prevention"
    ]
  },
  {
    "id": "sug_8_apply_93",
    "sessionId": 8,
    "category": "apply",
    "text": "How does direct bank feed integration in modern ERPs reduce manual BRS effort?",
    "textKn": "ಆಧುನಿಕ ಈಆರ್‌ಪಿಗಳಲ್ಲಿ ನೇರ ಬ್ಯಾಂಕ್ ಫೀಡ್ ಏಕೀಕರಣವು ಹಸ್ತಚಾಲಿತ ಕೆಲಸವನ್ನು ಹೇಗೆ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ?",
    "textKnEn": "Modern ERP bank feed BRS effort na hege kadime madatte?",
    "tags": [
      "erp-reconciliation"
    ]
  },
  {
    "id": "sug_8_practise_94",
    "sessionId": 8,
    "category": "practise",
    "text": "Test me: Cash book shows ₹85,000, unpresented cheque is ₹12,000, bank charge is ₹500. What is bank statement balance?",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಕ್ಯಾಶ್ ಬುಕ್ ₹85,000, ಬಿಡುಗಡೆಯಾಗದ ಚೆಕ್ ₹12,000, ಬ್ಯಾಂಕ್ ಶುಲ್ಕ ₹500 ತೋರಿಸಿದರೆ ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್ ಎಷ್ಟು?",
    "textKnEn": "BRS quiz: Cash book 85k, unpresented 12k, bank charge 500 adre bank balance estu?",
    "tags": [
      "brs-quiz"
    ]
  },
  {
    "id": "sug_8_practise_95",
    "sessionId": 8,
    "category": "practise",
    "text": "Spot the mistake in this BRS: Adding bank interest earned to bank statement balance.",
    "textKn": "ದೋಷ ಹುಡುಕಿ: ಬ್ಯಾಂಕ್ ಸ್ಟೇಟ್‌ಮೆಂಟ್ ಬ್ಯಾಲೆನ್ಸ್‌ಗೆ ಬ್ಯಾಂಕ್ ಗಳಿಸಿದ ಬಡ್ಡಿಯನ್ನು ಕೂಡಿಸಲಾಗಿದೆ.",
    "textKnEn": "Spot BRS error: Bank interest bank statement balance ge add madidare sari na?",
    "tags": [
      "brs-error"
    ]
  },
  {
    "id": "sug_8_practise_96",
    "sessionId": 8,
    "category": "practise",
    "text": "Challenge me to construct a 4-line BRS bridge from a complex scenario.",
    "textKn": "ಸಂಕೀರ್ಣ ಸನ್ನಿವೇಶದಿಂದ 4 ಸಾಲುಗಳ ಬಿಆರ್‌ಎಸ್ ಸೇತುವೆ ನಿರ್ಮಿಸಲು ನನಗೆ ಸವಾಲು ನೀಡಿ.",
    "textKnEn": "Complex BRS scenario bridge construct mado test kodi.",
    "tags": [
      "brs-challenge"
    ]
  },
  {
    "id": "sug_9_understand_97",
    "sessionId": 9,
    "category": "understand",
    "text": "What is the precise difference between Gross Margin, Operating Margin, and Net Profit Margin?",
    "textKn": "ಗ್ರಾಸ್ ಮಾರ್ಜಿನ್, ಆಪರೇಟಿಂಗ್ ಮಾರ್ಜಿನ್ ಮತ್ತು ನಿವ್ವಳ ಲಾಭದ ಮಾರ್ಜಿನ್ ನಡುವಿನ ನಿಖರ ವ್ಯತ್ಯಾಸವೇನು?",
    "textKnEn": "Gross margin, operating margin mattu net margin difference enu?",
    "tags": [
      "margins",
      "hul"
    ]
  },
  {
    "id": "sug_9_understand_98",
    "sessionId": 9,
    "category": "understand",
    "text": "What is EBITDA and why do Indian corporate finance analysts use it to compare performance?",
    "textKn": "EBITDA ಎಂದರೇನು ಮತ್ತು ಭಾರತೀಯ ಕಾರ್ಪೊರೇಟ್ ವಿಶ್ಲೇಷಕರು ಕಂಪನಿಗಳನ್ನು ಹೋಲಿಸಲು ಇದನ್ನು ಏಕೆ ಬಳಸುತ್ತಾರೆ?",
    "textKnEn": "EBITDA andrene mattu performance compare madoke eke use madtare?",
    "tags": [
      "ebitda"
    ]
  },
  {
    "id": "sug_9_understand_99",
    "sessionId": 9,
    "category": "understand",
    "text": "How does the Cash Conversion Cycle (CCC) impact business solvency?",
    "textKn": "ನಗದು ಪರಿವರ್ತನೆ ಚಕ್ರ (CCC) ಕಂಪನಿಯ ಆರ್ಥಿಕ ಸಾಮರ್ಥ್ಯದ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?",
    "textKnEn": "Cash Conversion Cycle solvency mela hege effect agatte?",
    "tags": [
      "cash-conversion-cycle"
    ]
  },
  {
    "id": "sug_9_solve_100",
    "sessionId": 9,
    "category": "solve",
    "text": "Show me the formula to calculate Gross Profit Margin and Operating Margin from revenue and COGS.",
    "textKn": "ಆದಾಯ ಮತ್ತು ಮಾರಾಟವಾದ ಸರಕುಗಳ ವೆಚ್ಚದಿಂದ (COGS) ಗ್ರಾಸ್ ಮಾರ್ಜಿನ್ ಮತ್ತು ಆಪರೇಟಿಂಗ್ ಮಾರ್ಜಿನ್ ಲೆಕ್ಕಾಚಾರ ಮಾಡುವ ವಿಧಾನ ತೋರಿಸಿ.",
    "textKnEn": "Gross margin mattu operating margin COGS inda calculate mado formula torsi.",
    "tags": [
      "margin-formulas"
    ]
  },
  {
    "id": "sug_9_solve_101",
    "sessionId": 9,
    "category": "solve",
    "text": "How do I calculate Days Sales Outstanding (DSO) and Days Inventory Outstanding (DIO)?",
    "textKn": "DSO (ಬಾಕಿ ವಸೂಲಾತಿ ದಿನಗಳು) ಮತ್ತು DIO (ದಾಸ್ತಾನು ದಿನಗಳು) ಅನ್ನು ಹೇಗೆ ಲೆಕ್ಕ ಹಾಕುವುದು?",
    "textKnEn": "DSO mattu DIO calculate mado steps yavudu?",
    "tags": [
      "dso-dio"
    ]
  },
  {
    "id": "sug_9_solve_102",
    "sessionId": 9,
    "category": "solve",
    "text": "Walk me through building a Year-over-Year (YoY) revenue and margin variance waterfall.",
    "textKn": "ವಾರ್ಷಿಕ ಆದಾಯ ಮತ್ತು ಮಾರ್ಜಿನ್ ವ್ಯತ್ಯಾಸದ ವಾಟರ್‌ಫಾಲ್ ಚಾರ್ಟ್ ಅನ್ನು ಹೇಗೆ ನಿರ್ಮಿಸುವುದು?",
    "textKnEn": "YoY revenue margin waterfall chart hege build madodu?",
    "tags": [
      "waterfall-variance"
    ]
  },
  {
    "id": "sug_9_apply_103",
    "sessionId": 9,
    "category": "apply",
    "text": "In HUL FY24-25 reporting, turnover was ₹60,680 Cr and EBITDA was ₹14,289 Cr. What was their EBITDA margin?",
    "textKn": "ಎಚ್‌ಯುಎಲ್ FY24-25 ರಲ್ಲಿ ₹60,680 ಕೋಟಿ ವಹಿವಾಟು ಮತ್ತು ₹14,289 ಕೋಟಿ EBITDA ಇತ್ತು. ಅವರ EBITDA ಮಾರ್ಜಿನ್ ಎಷ್ಟು?",
    "textKnEn": "HUL FY24-25 EBITDA margin calculate madi explain madi.",
    "tags": [
      "hul",
      "ebitda-calculation"
    ]
  },
  {
    "id": "sug_9_apply_104",
    "sessionId": 9,
    "category": "apply",
    "text": "Why do Indian consumer goods companies maintain negative or low working capital cycles?",
    "textKn": "ಭಾರತೀಯ ಎಫ್‌ಎಂಸಿಜಿ ಕಂಪನಿಗಳು ನಕಾರಾತ್ಮಕ ಅಥವಾ ಕಡಿಮೆ ಕಾರ್ಯಕಾರಿ ಬಂಡವಾಳ ಚಕ್ರವನ್ನು ಏಕೆ ಹೊಂದಿರುತ್ತವೆ?",
    "textKnEn": "FMCG companies negative working capital eke maintain madtare?",
    "tags": [
      "negative-working-capital"
    ]
  },
  {
    "id": "sug_9_apply_105",
    "sessionId": 9,
    "category": "apply",
    "text": "How does rising raw material inflation affect gross margin versus fixed overheads?",
    "textKn": "ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳ ಬೆಲೆ ಏರಿಕೆಯು ಗ್ರಾಸ್ ಮಾರ್ಜಿನ್ ಮತ್ತು ಸ್ಥಿರ ವೆಚ್ಚಗಳ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?",
    "textKnEn": "Inflation gross margin vs fixed overheads mela hege impact madatte?",
    "tags": [
      "inflation-margin"
    ]
  },
  {
    "id": "sug_9_practise_106",
    "sessionId": 9,
    "category": "practise",
    "text": "Test me: Revenue is ₹50 Lakh, COGS is ₹32 Lakh, OpEx is ₹8 Lakh. Calculate GM% and Op Margin%.",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಆದಾಯ ₹50 ಲಕ್ಷ, COGS ₹32 ಲಕ್ಷ, ಆಪರೇಟಿಂಗ್ ವೆಚ್ಚ ₹8 ಲಕ್ಷ. ಗ್ರಾಸ್ ಮತ್ತು ಆಪರೇಟಿಂಗ್ ಮಾರ್ಜಿನ್ ಲೆಕ್ಕ ಹಾಕಿ.",
    "textKnEn": "Test: Revenue 50L, COGS 32L, OpEx 8L adre GM% mattu Operating margin% estu?",
    "tags": [
      "margin-quiz"
    ]
  },
  {
    "id": "sug_9_practise_107",
    "sessionId": 9,
    "category": "practise",
    "text": "Interpret this result: Company A has 40% Gross Margin but 2% Net Margin. What is wrong?",
    "textKn": "ವಿಶ್ಲೇಷಿಸಿ: ಕಂಪನಿ A ಯಲ್ಲಿ 40% ಗ್ರಾಸ್ ಮಾರ್ಜಿನ್ ಇದ್ದರೂ ಕೇವಲ 2% ನಿವ್ವಳ ಮಾರ್ಜಿನ್ ಇದೆ. ಸಮಸ್ಯೆಯೇನು?",
    "textKnEn": "Company A 40% GM but 2% Net Margin adre en problem irbodu?",
    "tags": [
      "financial-interpretation"
    ]
  },
  {
    "id": "sug_9_practise_108",
    "sessionId": 9,
    "category": "practise",
    "text": "Challenge me to calculate the Cash Conversion Cycle given DIO=45, DSO=30, DPO=60.",
    "textKn": "DIO=45, DSO=30, DPO=60 ನೀಡಿದಾಗ ಕ್ಯಾಶ್ ಕನ್ವರ್ಶನ್ ಸೈಕಲ್ ಲೆಕ್ಕಹಾಕುವ ಪರೀಕ್ಷೆ ನೀಡಿ.",
    "textKnEn": "DIO 45, DSO 30, DPO 60 kottaga CCC calculate mado test kodi.",
    "tags": [
      "ccc-quiz"
    ]
  },
  {
    "id": "sug_10_understand_109",
    "sessionId": 10,
    "category": "understand",
    "text": "What makes an executive MIS dashboard decision-focused rather than just a data dump?",
    "textKn": "ಕೇವಲ ಡೇಟಾ ತುಂಬುವ ಬದಲು ಎಂಐಎಸ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ನಿರ್ಧಾರ-ಕೇಂದ್ರಿತವಾಗಲು ಏನು ಬೇಕು?",
    "textKnEn": "MIS dashboard data dump agade decision focused agoke en beku?",
    "tags": [
      "mis",
      "dashboard"
    ]
  },
  {
    "id": "sug_10_understand_110",
    "sessionId": 10,
    "category": "understand",
    "text": "Explain the Visual Hierarchy principle in financial dashboards (KPI cards vs breakdown tables).",
    "textKn": "ಹಣಕಾಸು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗಳಲ್ಲಿ ದೃಶ್ಯ ಶ್ರೇಣಿಯ ತತ್ವವನ್ನು (KPI ಕಾರ್ಡ್‌ಗಳು ಮತ್ತು ವಿವರ ಕೋಷ್ಟಕಗಳು) ವಿವರಿಸಿ.",
    "textKnEn": "Dashboard visual hierarchy KPI cards breakdown tables eke important?",
    "tags": [
      "visual-hierarchy"
    ]
  },
  {
    "id": "sug_10_understand_111",
    "sessionId": 10,
    "category": "understand",
    "text": "Why must every KPI card display period, unit, benchmark, and source reference?",
    "textKn": "ಪ್ರತಿ ಕೆಪಿಐ ಕಾರ್ಡ್ ಅವಧಿ, ಘಟಕ, ಮಾನದಂಡ ಮತ್ತು ಮೂಲದ ಉಲ್ಲೇಖವನ್ನು ಏಕೆ ಹೊಂದಿರಬೇಕು?",
    "textKnEn": "KPI card alli period unit benchmark source eke irlebeku?",
    "tags": [
      "kpi-standards"
    ]
  },
  {
    "id": "sug_10_solve_112",
    "sessionId": 10,
    "category": "solve",
    "text": "How do I design a top-line KPI executive summary card showing Actual vs Target with % variance?",
    "textKn": "ಶೇಕಡಾವಾರು ವ್ಯತ್ಯಾಸದೊಂದಿಗೆ ವಾಸ್ತವ vs ಗುರಿ ತೋರಿಸುವ ಉನ್ನತ ಮಟ್ಟದ KPI ಕಾರ್ಡ್ ಅನ್ನು ಹೇಗೆ ವಿನ್ಯಾಸಗೊಳಿಸುವುದು?",
    "textKnEn": "Actual vs Target % variance torsuva KPI card hege design madodu?",
    "tags": [
      "kpi-card"
    ]
  },
  {
    "id": "sug_10_solve_113",
    "sessionId": 10,
    "category": "solve",
    "text": "Show me how to build dynamic color-coded conditional formatting for budget variances in Excel.",
    "textKn": "ಎಕ್ಸೆಲ್‌ನಲ್ಲಿ ಬಜೆಟ್ ವ್ಯತ್ಯಾಸಗಳಿಗಾಗಿ ಡೈನಾಮಿಕ್ ಬಣ್ಣ-ಕೋಡೆಡ್ ಷರತ್ತುಬದ್ಧ ಫಾರ್ಮ್ಯಾಟಿಂಗ್ ಅನ್ನು ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "Conditional formatting budget variance ge Excel alli hege set madodu?",
    "tags": [
      "conditional-formatting"
    ]
  },
  {
    "id": "sug_10_solve_114",
    "sessionId": 10,
    "category": "solve",
    "text": "How do I create interactive slicers and drill-downs without breaking calculation models?",
    "textKn": "ಲೆಕ್ಕಾಚಾರದ ಮಾದರಿಗಳಿಗೆ ಧಕ್ಕೆ ಬಾರದಂತೆ ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಸ್ಲೈಸರ್‌ಗಳು ಮತ್ತು ಡ್ರಿಲ್-ಡೌನ್‌ಗಳನ್ನು ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "Slicers mattu drill-downs model break agade hege create madodu?",
    "tags": [
      "excel-slicers"
    ]
  },
  {
    "id": "sug_10_apply_115",
    "sessionId": 10,
    "category": "apply",
    "text": "In Maruti Suzuki dealership management, which 4 operational KPIs are reviewed every Monday?",
    "textKn": "ಮಾರುತಿ ಸುಜುಕಿ ಡೀಲರ್‌ಶಿಪ್ ನಿರ್ವಹಣೆಯಲ್ಲಿ ಪ್ರತಿ ಸೋಮವಾರ ಯಾವ 4 ಕಾರ್ಯಾಚರಣೆಯ KPI ಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ?",
    "textKnEn": "Maruti Suzuki dealership management alli yav 4 KPIs Monday review madtare?",
    "tags": [
      "maruti",
      "dealership-kpi"
    ]
  },
  {
    "id": "sug_10_apply_116",
    "sessionId": 10,
    "category": "apply",
    "text": "How does an MIS reporting lead communicate an alarming inventory build-up to leadership?",
    "textKn": "ಅಪಾಯಕಾರಿ ದಾಸ್ತಾನು ಹೆಚ್ಚಳವನ್ನು ಎಂಐಎಸ್ ವರದಿಗಾರರು ನಾಯಕತ್ವಕ್ಕೆ ಹೇಗೆ ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸುತ್ತಾರೆ?",
    "textKnEn": "Inventory build-up na leadership ge MIS lead hege present madtare?",
    "tags": [
      "inventory-alert"
    ]
  },
  {
    "id": "sug_10_apply_117",
    "sessionId": 10,
    "category": "apply",
    "text": "What is the risk of \"Metric Fixation\" where employees game a KPI instead of improving business health?",
    "textKn": "ನೌಕರರು ಕಂಪನಿಯ ಆರೋಗ್ಯ ಸುಧಾರಿಸುವ ಬದಲು ಕೇವಲ ಕೆಪಿಐ ಗುರಿ ತಲುಪಲು ಯತ್ನಿಸುವ ಅಪಾಯವೇನು?",
    "textKnEn": "Metric fixation risk enu?",
    "tags": [
      "kpi-gaming"
    ]
  },
  {
    "id": "sug_10_practise_118",
    "sessionId": 10,
    "category": "practise",
    "text": "Given 10 operational metrics, help me choose the top 4 for a CEO-level summary dashboard.",
    "textKn": "10 ಮೆಟ್ರಿಕ್‌ಗಳನ್ನು ನೀಡಿ ಸಿಇಒ ಮಟ್ಟದ ಸಾರಾಂಶ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗಾಗಿ ಅಗ್ರ 4 ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಮಾರ್ಗದರ್ಶನ ನೀಡಿ.",
    "textKnEn": "10 metrics inda CEO dashboard ge top 4 select mado test kodi.",
    "tags": [
      "metric-selection"
    ]
  },
  {
    "id": "sug_10_practise_119",
    "sessionId": 10,
    "category": "practise",
    "text": "Test me: Write a 2-sentence executive commentary for a dashboard showing a 14% sales decline.",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: 14% ಮಾರಾಟ ಕುಸಿತ ತೋರಿಸುವ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ 2-ವಾಕ್ಯಗಳ ಕಾರ್ಯನಿರ್ವಾಹಕ ವಿವರಣೆ ಬರೆಯಿರಿ.",
    "textKnEn": "14% sales decline ge 2 sentence executive commentary bariyoke test kodi.",
    "tags": [
      "commentary-test"
    ]
  },
  {
    "id": "sug_10_practise_120",
    "sessionId": 10,
    "category": "practise",
    "text": "Critique this chart proposal: Using a 3D pie chart with 14 slices for regional expense distribution.",
    "textKn": "ಈ ಚಾರ್ಟ್ ಪ್ರಸ್ತಾವನೆಯನ್ನು ವಿಮರ್ಶಿಸಿ: 14 ವಿಭಾಗಗಳಿರುವ 3D ಪೈ ಚಾರ್ಟ್ ಬಳಸುವುದು ಸರಿಯೇ?",
    "textKnEn": "14 slices iro 3D pie chart expense distribution ge use madbahuda?",
    "tags": [
      "chart-critique"
    ]
  },
  {
    "id": "sug_11_understand_121",
    "sessionId": 11,
    "category": "understand",
    "text": "What are the rules for determining CGST, SGST, and IGST based on Place of Supply?",
    "textKn": "ಸರಬರಾಜು ಸ್ಥಳವನ್ನು (Place of Supply) ಆಧರಿಸಿ CGST, SGST ಮತ್ತು IGST ನಿರ್ಧರಿಸುವ ನಿಯಮಗಳು ಯಾವುವು?",
    "textKnEn": "Place of supply nodi CGST SGST IGST hege decide madtare?",
    "tags": [
      "gst",
      "place-of-supply"
    ]
  },
  {
    "id": "sug_11_understand_122",
    "sessionId": 11,
    "category": "understand",
    "text": "What are the 4 mandatory conditions under Section 16 to claim Input Tax Credit (ITC)?",
    "textKn": "ಇನ್‌ಪುಟ್ ಟ್ಯಾಕ್ಸ್ ಕ್ರೆಡಿಟ್ (ITC) ಪಡೆಯಲು ಸೆಕ್ಷನ್ 16 ರ ಅಡಿಯಲ್ಲಿರುವ 4 ಕಡ್ಡಾಯ ಷರತ್ತುಗಳು ಯಾವುವು?",
    "textKnEn": "Section 16 prakara Input Tax Credit (ITC) claim madoke yav 4 conditions beku?",
    "tags": [
      "itc",
      "section-16"
    ]
  },
  {
    "id": "sug_11_understand_123",
    "sessionId": 11,
    "category": "understand",
    "text": "Why is GSTR-2B matching essential before releasing payment to a vendor?",
    "textKn": "ಮಾರಾಟಗಾರರಿಗೆ ಹಣ ಪಾವತಿಸುವ ಮೊದಲು GSTR-2B ಹೊಂದಾಣಿಕೆ ಏಕೆ ಅತ್ಯಗತ್ಯ?",
    "textKnEn": "Vendor ge payment madoke munche GSTR-2B matching eke important?",
    "tags": [
      "gstr-2b",
      "compliance"
    ]
  },
  {
    "id": "sug_11_solve_124",
    "sessionId": 11,
    "category": "solve",
    "text": "How do I identify defective invoice line items that lack mandatory HSN codes or valid GSTIN?",
    "textKn": "ಕಡ್ಡಾಯ ಎಚ್‌ಎಸ್‌ಎನ್ ಕೋಡ್ ಅಥವಾ ಮಾನ್ಯ ಜಿಎಸ್‌ಟಿ ಸಂಖ್ಯೆ ಇಲ್ಲದ ದೋಷಪೂರಿತ ಇನ್‌ವಾಯ್ಸ್‌ಗಳನ್ನು ಹೇಗೆ ಗುರುತಿಸುವುದು?",
    "textKnEn": "HSN code or GSTIN missing iro invoice line items hege spot madodu?",
    "tags": [
      "hsn-gstin",
      "invoice-audit"
    ]
  },
  {
    "id": "sug_11_solve_125",
    "sessionId": 11,
    "category": "solve",
    "text": "Show me the formula to reverse ineligible ITC under Rule 42 in accounting software.",
    "textKn": "ಅಕೌಂಟಿಂಗ್ ತಂತ್ರಾಂಶದಲ್ಲಿ ರೂಲ್ 42 ರ ಅಡಿಯಲ್ಲಿ ಅನರ್ಹ ITC ಯನ್ನು ಹಿಂತಿರುಗಿಸುವ (Reverse) ವಿಧಾನವನ್ನು ತೋರಿಸಿ?",
    "textKnEn": "Rule 42 prakara ineligible ITC reverse mado steps torsi.",
    "tags": [
      "itc-reversal"
    ]
  },
  {
    "id": "sug_11_solve_126",
    "sessionId": 11,
    "category": "solve",
    "text": "How do I reconcile vendor-claimed tax against portal-reflected tax to avoid tax notices?",
    "textKn": "ತೆರಿಗೆ ನೋಟಿಸ್ ತಪ್ಪಿಸಲು ಪೋರ್ಟಲ್‌ನಲ್ಲಿರುವ ತೆರಿಗೆಯೊಂದಿಗೆ ಮಾರಾಟಗಾರರ ತೆರಿಗೆಯನ್ನು ಹೇಗೆ ಸಮನ್ವಯಗೊಳಿಸುವುದು?",
    "textKnEn": "Vendor tax vs portal tax mismatch reconcile mado formula yavudu?",
    "tags": [
      "tax-reconciliation"
    ]
  },
  {
    "id": "sug_11_apply_127",
    "sessionId": 11,
    "category": "apply",
    "text": "In HUL distributor billing, how are multi-product baskets with 5%, 12%, and 18% GST handled?",
    "textKn": "ಎಚ್‌ಯುಎಲ್ ವಿತರಕರ ಬಿಲ್ಲಿಂಗ್‌ನಲ್ಲಿ 5%, 12% ಮತ್ತು 18% ಜಿಎಸ್‌ಟಿ ಹೊಂದಿರುವ ವಿವಿಧ ಉತ್ಪನ್ನಗಳನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸಲಾಗುತ್ತದೆ?",
    "textKnEn": "HUL billing alli 5% 12% 18% GST items hege manage madtare?",
    "tags": [
      "hul",
      "mixed-tax-rates"
    ]
  },
  {
    "id": "sug_11_apply_128",
    "sessionId": 11,
    "category": "apply",
    "text": "What happens if a supplier files GSTR-1 quarterly but your company claims ITC monthly?",
    "textKn": "ಪೂರೈಕೆದಾರರು ತ್ರೈಮಾಸಿಕವಾಗಿ GSTR-1 ಸಲ್ಲಿಸಿದರೆ ನಿಮ್ಮ ಕಂಪನಿ ಮಾಸಿಕವಾಗಿ ITC ಪಡೆಯುವುದು ಹೇಗೆ?",
    "textKnEn": "Supplier quarterly GSTR-1 file madidre ITC monthly claim madoke baratta?",
    "tags": [
      "qrmp-scheme"
    ]
  },
  {
    "id": "sug_11_apply_129",
    "sessionId": 11,
    "category": "apply",
    "text": "How does a corporate finance executive handle a GST discrepancy notice (DRC-01C)?",
    "textKn": "ಜಿಎಸ್‌ಟಿ ವ್ಯತ್ಯಾಸದ ನೋಟಿಸ್ (DRC-01C) ಬಂದಾಗ ಹಣಕಾಸು ಕಾರ್ಯನಿರ್ವಾಹಕರು ಅದನ್ನು ಹೇಗೆ ನಿಭಾಯಿಸುತ್ತಾರೆ?",
    "textKnEn": "GST notice DRC-01C bandaga corporate finance team hege reply madtare?",
    "tags": [
      "gst-notices"
    ]
  },
  {
    "id": "sug_11_practise_130",
    "sessionId": 11,
    "category": "practise",
    "text": "Test me: An invoice from Chennai to Bengaluru lists IGST instead of CGST+SGST. Is this correct?",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಚೆನ್ನೈನಿಂದ ಬೆಂಗಳೂರಿಗೆ ಬಂದ ಇನ್‌ವಾಯ್ಸ್‌ನಲ್ಲಿ CGST+SGST ಬದಲಿಗೆ IGST ಇದೆ. ಇದು ಸರಿಯೇ?",
    "textKnEn": "Chennai inda Bengaluru invoice ge IGST hakidare correct na?",
    "tags": [
      "interstate-quiz"
    ]
  },
  {
    "id": "sug_11_practise_131",
    "sessionId": 11,
    "category": "practise",
    "text": "Audit this invoice: Total ₹1,18,000, Taxable ₹1,00,000, 18% GST, but Vendor GSTIN shows Cancelled.",
    "textKn": "ಈ ಇನ್‌ವಾಯ್ಸ್ ಪರಿಶೀಲಿಸಿ: ಒಟ್ಟು ₹1,18,000, ತೆರಿಗೆಯ ಮೊತ್ತ ₹1,00,000, ಆದರೆ ಮಾರಾಟಗಾರರ ಜಿಎಸ್‌ಟಿ ರದ್ದಾಗಿದೆ.",
    "textKnEn": "Vendor GSTIN cancelled adre ITC claim madbahuda?",
    "tags": [
      "audit-challenge"
    ]
  },
  {
    "id": "sug_11_practise_132",
    "sessionId": 11,
    "category": "practise",
    "text": "Quiz me on the mandatory invoice disclosures required under Indian GST law.",
    "textKn": "ಭಾರತೀಯ ಜಿಎಸ್‌ಟಿ ಕಾಯ್ದೆಯ ಅಡಿಯಲ್ಲಿ ಇನ್‌ವಾಯ್ಸ್‌ನಲ್ಲಿ ಇರಬೇಕಾದ ಕಡ್ಡಾಯ ಅಂಶಗಳ ಕುರಿತು ಪರೀಕ್ಷೆ ನೀಡಿ.",
    "textKnEn": "GST invoice mandatory fields bagge quiz kodi.",
    "tags": [
      "gst-mandatory-fields"
    ]
  },
  {
    "id": "sug_12_understand_133",
    "sessionId": 12,
    "category": "understand",
    "text": "What is an Accounts Receivable Aging Schedule and why is 30-60-90 days the standard benchmark?",
    "textKn": "ಖಾತೆಗಳ ಬಾಕಿ ವಯಸ್ಸಿನ ವೇಳಾಪಟ್ಟಿ (Aging Schedule) ಎಂದರೇನು ಮತ್ತು 30-60-90 ದಿನಗಳು ಏಕೆ ಮುಖ್ಯ ಮಾನದಂಡ?",
    "textKnEn": "Receivables aging schedule 30-60-90 days eke standard benchmark agide?",
    "tags": [
      "receivables",
      "aging-schedule"
    ]
  },
  {
    "id": "sug_12_understand_134",
    "sessionId": 12,
    "category": "understand",
    "text": "Explain Days Sales Outstanding (DSO) and how high DSO drains liquidity.",
    "textKn": "ಬಾಕಿ ವಸೂಲಾತಿ ದಿನಗಳನ್ನು (DSO) ವಿವರಿಸಿ ಮತ್ತು ಹೆಚ್ಚಿನ DSO ನಗದು ದ್ರವ್ಯತೆಯನ್ನು ಹೇಗೆ ಕುಗ್ಗಿಸುತ್ತದೆ?",
    "textKnEn": "DSO andrene mattu high DSO cash flow na hege drain madatte?",
    "tags": [
      "dso",
      "liquidity"
    ]
  },
  {
    "id": "sug_12_understand_135",
    "sessionId": 12,
    "category": "understand",
    "text": "Why does the as-of date boundary drastically shift overdue buckets (e.g. 31 Oct vs 01 Nov)?",
    "textKn": "ದಿನಾಂಕದ ಮಿತಿ (As-of Date) ಬದಲಾದಾಗ ಓವರ್‌ಡ್ಯೂ ಬಕೆಟ್‌ಗಳು ಏಕೆ ಸಂಪೂರ್ಣವಾಗಿ ಬದಲಾಗುತ್ತವೆ?",
    "textKnEn": "As-of date change adaga overdue buckets eke change agatte?",
    "tags": [
      "as-of-date"
    ]
  },
  {
    "id": "sug_12_solve_136",
    "sessionId": 12,
    "category": "solve",
    "text": "Show me the Excel formula using MAX(0, AsOfDate - DueDate) to calculate exact days overdue.",
    "textKn": "ನಿಖರವಾದ ಬಾಕಿ ದಿನಗಳನ್ನು ಲೆಕ್ಕಹಾಕಲು MAX(0, AsOfDate - DueDate) ಬಳಸುವ ಎಕ್ಸೆಲ್ ಸೂತ್ರವನ್ನು ತೋರಿಸಿ.",
    "textKnEn": "Excel formula MAX(0, AsOfDate - DueDate) days overdue calculate madoke torsi.",
    "tags": [
      "days-overdue-formula"
    ]
  },
  {
    "id": "sug_12_solve_137",
    "sessionId": 12,
    "category": "solve",
    "text": "How do I categorize receivables into Current, 1-30, 31-60, 61-90, and 90+ buckets in Excel?",
    "textKn": "ಎಕ್ಸೆಲ್‌ನಲ್ಲಿ ಬಾಕಿ ಮೊತ್ತವನ್ನು ಕರೆಂಟ್, 1-30, 31-60, 61-90 ಮತ್ತು 90+ ಬಕೆಟ್‌ಗಳಾಗಿ ಹೇಗೆ ವರ್ಗೀಕರಿಸುವುದು?",
    "textKnEn": "Receivables buckets Current 1-30 31-60 61-90 90+ hege categorize madodu?",
    "tags": [
      "aging-buckets"
    ]
  },
  {
    "id": "sug_12_solve_138",
    "sessionId": 12,
    "category": "solve",
    "text": "How do I prioritize which corporate debtors to call first when cash is constrained?",
    "textKn": "ನಗದು ಕೊರತೆಯಿದ್ದಾಗ ಯಾವ ಸಾಲಗಾರರನ್ನು ಮೊದಲು ಸಂಪರ್ಕಿಸಬೇಕು ಎಂಬುದನ್ನು ಹೇಗೆ ಆದ್ಯತೆ ನೀಡುವುದು?",
    "textKnEn": "Debtor collection prioritization hege madodu?",
    "tags": [
      "collection-prioritization"
    ]
  },
  {
    "id": "sug_12_apply_139",
    "sessionId": 12,
    "category": "apply",
    "text": "In HUL distributor networks, how do credit managers balance sales targets with collection risks?",
    "textKn": "ಎಚ್‌ಯುಎಲ್ ವಿತರಕರ ಜಾಲದಲ್ಲಿ, ಕ್ರೆಡಿಟ್ ಮ್ಯಾನೇಜರ್‌ಗಳು ಮಾರಾಟದ ಗುರಿಗಳು ಮತ್ತು ವಸೂಲಾತಿ ಅಪಾಯಗಳನ್ನು ಹೇಗೆ ಸರಿದೂಗಿಸುತ್ತಾರೆ?",
    "textKnEn": "HUL distributor network alli sales targets vs collection risk balance hege madtare?",
    "tags": [
      "hul",
      "credit-management"
    ]
  },
  {
    "id": "sug_12_apply_140",
    "sessionId": 12,
    "category": "apply",
    "text": "What commercial incentives (like 2/10 net 30 cash discounts) accelerate customer collections?",
    "textKn": "ಗ್ರಾಹಕರಿಂದ ಶೀಘ್ರ ಪಾವತಿ ಪಡೆಯಲು ಯಾವ ರಿಯಾಯಿತಿ ಪ್ರೋತ್ಸಾಹಗಳನ್ನು (2/10 ನೆಟ್ 30) ನೀಡಲಾಗುತ್ತದೆ?",
    "textKnEn": "Cash discount incentives customer collections hege accelerate madatte?",
    "tags": [
      "cash-discounts"
    ]
  },
  {
    "id": "sug_12_apply_141",
    "sessionId": 12,
    "category": "apply",
    "text": "When should a delinquent corporate receivable be escalated to legal notice or written off as Bad Debt?",
    "textKn": "ಗ್ರಾಹಕರ ಸಾಲವನ್ನು ಯಾವಾಗ ಕಾನೂನು ನೋಟಿಸ್‌ಗೆ ಕಳುಹಿಸಬೇಕು ಅಥವಾ ಕೆಟ್ಟ ಸಾಲ (Bad Debt) ಎಂದು ಪರಿಗಣಿಸಬೇಕು?",
    "textKnEn": "Delinquent receivable legal notice ge yavaga escalate madbeku?",
    "tags": [
      "bad-debt-escalation"
    ]
  },
  {
    "id": "sug_12_practise_142",
    "sessionId": 12,
    "category": "practise",
    "text": "Test me: An invoice was due on 15 Oct. As-of date is 10 Nov. What is the overdue category?",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಇನ್‌ವಾಯ್ಸ್ ಗಡುವು ಅಕ್ಟೋಬರ್ 15 ಆಗಿತ್ತು. ಇಂದಿನ ದಿನಾಂಕ ನವೆಂಬರ್ 10. ಇದು ಯಾವ ಬಕೆಟ್‌ಗೆ ಸೇರುತ್ತದೆ?",
    "textKnEn": "Invoice due Oct 15, As-of date Nov 10 adre days overdue estu?",
    "tags": [
      "aging-quiz"
    ]
  },
  {
    "id": "sug_12_practise_143",
    "sessionId": 12,
    "category": "practise",
    "text": "Given 5 debtors with varying balances and aging, guide me to prioritize collection calls.",
    "textKn": "ವಿವಿಧ ಬಾಕಿ ಮೊತ್ತಗಳಿರುವ 5 ಸಾಲಗಾರರನ್ನು ನೀಡಿ ಯಾರಿಗೆ ಮೊದಲು ಕರೆ ಮಾಡಬೇಕೆಂದು ಪರೀಕ್ಷಿಸಿ.",
    "textKnEn": "5 debtors list kottu collection call prioritization quiz kodi.",
    "tags": [
      "collection-exercise"
    ]
  },
  {
    "id": "sug_12_practise_144",
    "sessionId": 12,
    "category": "practise",
    "text": "Challenge me to calculate DSO given Total Receivables = ₹18 Lakh and Annual Credit Sales = ₹1.2 Cr.",
    "textKn": "ಒಟ್ಟು ಬಾಕಿ ₹18 ಲಕ್ಷ ಮತ್ತು ವಾರ್ಷಿಕ ಸಾಲದ ಮಾರಾಟ ₹1.2 ಕೋಟಿ ಇದ್ದಾಗ DSO ಲೆಕ್ಕಹಾಕುವ ಪರೀಕ್ಷೆ ನೀಡಿ.",
    "textKnEn": "Receivables 18L, Credit sales 1.2Cr adre DSO calculate mado test kodi.",
    "tags": [
      "dso-calculation"
    ]
  },
  {
    "id": "sug_13_understand_145",
    "sessionId": 13,
    "category": "understand",
    "text": "What is Data Minimization when interacting with public enterprise AI models?",
    "textKn": "ಸಾರ್ವಜನಿಕ ಕಾರ್ಪೊರೇಟ್ AI ಮಾದರಿಗಳನ್ನು ಬಳಸುವಾಗ ಡೇಟಾ ಕನಿಷ್ಠೀಕರಣ (Data Minimization) ಎಂದರೇನು?",
    "textKnEn": "Enterprise AI use madovaga Data Minimization andrene?",
    "tags": [
      "ai",
      "data-minimization"
    ]
  },
  {
    "id": "sug_13_understand_146",
    "sessionId": 13,
    "category": "understand",
    "text": "Why must proprietary company financial models and PAN/bank numbers never be uploaded to generic AI tools?",
    "textKn": "ಸ್ವಾಮ್ಯದ ಹಣಕಾಸು ಮಾದರಿಗಳು ಮತ್ತು ಪ್ಯಾನ್/ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಸಾರ್ವಜನಿಕ AI ಪರಿಕರಗಳಿಗೆ ಏಕೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಬಾರದು?",
    "textKnEn": "Company proprietary models and PAN/bank details public AI ge eke upload madbardu?",
    "tags": [
      "ai-privacy"
    ]
  },
  {
    "id": "sug_13_understand_147",
    "sessionId": 13,
    "category": "understand",
    "text": "Explain the anatomy of an effective AI Boundary Prompt for financial analysis.",
    "textKn": "ಹಣಕಾಸು ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಪರಿಣಾಮಕಾರಿ AI ಬೌಂಡರಿ ಪ್ರಾಂಪ್ಟ್‌ನ ಪ್ರಮುಖ ಅಂಶಗಳನ್ನು ವಿವರಿಸಿ.",
    "textKnEn": "Financial analysis ge effective AI Boundary Prompt anatomy enu?",
    "tags": [
      "boundary-prompts"
    ]
  },
  {
    "id": "sug_13_solve_148",
    "sessionId": 13,
    "category": "solve",
    "text": "Show me how to sanitize a customer dataset before using AI to write follow-up reminder emails.",
    "textKn": "ಫಾಲೋ-ಅಪ್ ಇಮೇಲ್‌ಗಳನ್ನು ರಚಿಸಲು AI ಬಳಸುವ ಮುನ್ನ ಗ್ರಾಹಕರ ಡೇಟಾವನ್ನು ಹೇಗೆ ಗೌಪ್ಯವಾಗಿ ಸಿದ್ಧಪಡಿಸುವುದು?",
    "textKnEn": "AI ge data kodo munche customer dataset sanitize hege madodu?",
    "tags": [
      "data-sanitization"
    ]
  },
  {
    "id": "sug_13_solve_149",
    "sessionId": 13,
    "category": "solve",
    "text": "How do I write a prompt that forces an AI to state assumptions and cite only provided source numbers?",
    "textKn": "ನೀಡಲಾದ ಸಂಖ್ಯೆಗಳನ್ನು ಮಾತ್ರ ಉಲ್ಲೇಖಿಸಲು ಮತ್ತು ಊಹೆಗಳನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಲು AI ಗೆ ಪ್ರಾಂಪ್ಟ್ ಬರೆಯುವುದು ಹೇಗೆ?",
    "textKnEn": "Provided source numbers matra use mado boundary prompt hege bareyodu?",
    "tags": [
      "prompt-engineering"
    ]
  },
  {
    "id": "sug_13_solve_150",
    "sessionId": 13,
    "category": "solve",
    "text": "How do I detect hallucinated citations in AI-generated financial summaries?",
    "textKn": "AI ರಚಿಸಿದ ಹಣಕಾಸು ಸಾರಾಂಶಗಳಲ್ಲಿ ಕಾಲ್ಪನಿಕ ಉಲ್ಲೇಖಗಳನ್ನು (Hallucinations) ಹೇಗೆ ಕಂಡುಹಿಡಿಯುವುದು?",
    "textKnEn": "AI financial summaries alli hallucinations hege detect madodu?",
    "tags": [
      "hallucination-detection"
    ]
  },
  {
    "id": "sug_13_apply_151",
    "sessionId": 13,
    "category": "apply",
    "text": "How does Infosys define AI governance policies for junior analysts writing client reports?",
    "textKn": "ಕ್ಲೈಂಟ್ ವರದಿಗಳನ್ನು ಬರೆಯುವ ಜೂನಿಯರ್ ವಿಶ್ಲೇಷಕರಿಗೆ ಇನ್ಫೋಸಿಸ್ AI ಆಡಳಿತ ನೀತಿಗಳನ್ನು ಹೇಗೆ ರೂಪಿಸಿದೆ?",
    "textKnEn": "Infosys AI governance policy for client reporting hegide?",
    "tags": [
      "infosys",
      "ai-governance"
    ]
  },
  {
    "id": "sug_13_apply_152",
    "sessionId": 13,
    "category": "apply",
    "text": "What are the copyright and confidentiality risks of using AI in commercial advisory?",
    "textKn": "ವಾಣಿಜ್ಯ ಸಲಹಾ ಸೇವೆಯಲ್ಲಿ AI ಬಳಸುವಾಗ ಕೃತಿಸ್ವಾಮ್ಯ ಮತ್ತು ಗೌಪ್ಯತೆಯ ಅಪಾಯಗಳು ಯಾವುವು?",
    "textKnEn": "Commercial advisory alli AI use madidre confidentiality risks enu?",
    "tags": [
      "ip-compliance"
    ]
  },
  {
    "id": "sug_13_apply_153",
    "sessionId": 13,
    "category": "apply",
    "text": "How should a business analyst disclose AI assistance in a client presentation deliverable?",
    "textKn": "ಕ್ಲೈಂಟ್ ಪ್ರಸ್ತುತಿಯಲ್ಲಿ AI ಸಹಾಯ ಪಡೆದಿರುವುದನ್ನು ವ್ಯಾಪಾರ ವಿಶ್ಲೇಷಕರು ಹೇಗೆ ಪಾರದರ್ಶಕವಾಗಿ ಬಹಿರಂಗಪಡಿಸಬೇಕು?",
    "textKnEn": "Client deliverable alli AI usage na hege transparent agi disclose madbeku?",
    "tags": [
      "ai-disclosure"
    ]
  },
  {
    "id": "sug_13_practise_154",
    "sessionId": 13,
    "category": "practise",
    "text": "Critique this prompt: \"Summarize this balance sheet and tell me what stocks to buy.\"",
    "textKn": "ಈ ಪ್ರಾಂಪ್ಟ್ ವಿಮರ್ಶಿಸಿ: \"ಈ ಬ್ಯಾಲೆನ್ಸ್ ಶೀಟ್ ಸಂಕ್ಷಿಪ್ತಗೊಳಿಸಿ ಮತ್ತು ನಾನು ಯಾವ ಷೇರುಗಳನ್ನು ಖರೀದಿಸಬೇಕೆಂದು ತಿಳಿಸಿ.\"",
    "textKnEn": "Ee prompt review madi safe boundary prompt agi convert madi.",
    "tags": [
      "prompt-critique"
    ]
  },
  {
    "id": "sug_13_practise_155",
    "sessionId": 13,
    "category": "practise",
    "text": "Test me on converting an unsafe, data-leaking prompt into an enterprise-safe prompt.",
    "textKn": "ಗೌಪ್ಯತೆ ಉಲ್ಲಂಘಿಸುವ ಪ್ರಾಂಪ್ಟ್ ಅನ್ನು ಕಾರ್ಪೊರೇಟ್-ಸುರಕ್ಷಿತ ಪ್ರಾಂಪ್ಟ್ ಆಗಿ ಪರಿವರ್ತಿಸುವ ಪರೀಕ್ಷೆ ನೀಡಿ.",
    "textKnEn": "Data-leaking prompt na corporate-safe prompt agi transform mado test kodi.",
    "tags": [
      "prompt-transformation"
    ]
  },
  {
    "id": "sug_13_practise_156",
    "sessionId": 13,
    "category": "practise",
    "text": "Given an AI-generated memo with one fabricated statistic, help me spot the hallucination.",
    "textKn": "ಒಂದು ಕಾಲ್ಪನಿಕ ಅಂಕಿಅಂಶವಿರುವ AI ಮೆಮೊ ನೀಡಿ ಆ ತಪ್ಪು ಮಾಹಿತಿಯನ್ನು ಪತ್ತೆಹಚ್ಚಲು ನನಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಿ.",
    "textKnEn": "Fabricated statistic iro AI memo kottu hallucination find mado test kodi.",
    "tags": [
      "hallucination-hunt"
    ]
  },
  {
    "id": "sug_14_understand_157",
    "sessionId": 14,
    "category": "understand",
    "text": "What is the 3-Point Claim Verification standard for AI-assisted outputs?",
    "textKn": "AI-ಸಹಾಯದ ಫಲಿತಾಂಶಗಳಿಗಾಗಿ 3-ಪಾಯಿಂಟ್ ಕ್ಲೈಮ್ ಪರಿಶೀಲನಾ ಮಾನದಂಡ (Claim Verification) ಎಂದರೇನು?",
    "textKnEn": "AI outputs ge 3-point claim verification standard andrene?",
    "tags": [
      "ai-verification",
      "audit"
    ]
  },
  {
    "id": "sug_14_understand_158",
    "sessionId": 14,
    "category": "understand",
    "text": "Why is a Human-in-the-Loop (HITL) checkpoint legally and commercially non-negotiable?",
    "textKn": "ಮಾನವ ಪರಿಶೀಲನಾ ಚೆಕ್‌ಪಾಯಿಂಟ್ (HITL) ಕಾನೂನುಬದ್ಧವಾಗಿ ಮತ್ತು ವಾಣಿಜ್ಯಿಕವಾಗಿ ಏಕೆ ಕಡ್ಡಾಯವಾಗಿದೆ?",
    "textKnEn": "Human in the Loop (HITL) checkpoint eke non-negotiable agide?",
    "tags": [
      "hitl",
      "governance"
    ]
  },
  {
    "id": "sug_14_understand_159",
    "sessionId": 14,
    "category": "understand",
    "text": "Explain the purpose of an AI Audit Register linking claim, source cell, recalculation, and sign-off.",
    "textKn": "ಕ್ಲೈಮ್, ಮೂಲ ಕೋಶ, ಮರುಲೆಕ್ಕಾಚಾರ ಮತ್ತು ಸಹಿಯನ್ನು ಜೋಡಿಸುವ AI ಆಡಿಟ್ ರಿಜಿಸ್ಟರ್‌ನ ಉದ್ದೇಶವೇನು?",
    "textKnEn": "AI Audit Register claim, source, recalculation, sign-off purpose enu?",
    "tags": [
      "audit-register"
    ]
  },
  {
    "id": "sug_14_solve_160",
    "sessionId": 14,
    "category": "solve",
    "text": "Show me how to construct an Audit Register table in Excel to verify AI summaries.",
    "textKn": "AI ಸಾರಾಂಶಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಎಕ್ಸೆಲ್‌ನಲ್ಲಿ ಆಡಿಟ್ ರಿಜಿಸ್ಟರ್ ಕೋಷ್ಟಕವನ್ನು ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "AI summaries verify madoke Excel Audit Register table hege create madodu?",
    "tags": [
      "audit-register-table"
    ]
  },
  {
    "id": "sug_14_solve_161",
    "sessionId": 14,
    "category": "solve",
    "text": "How do I recalculate AI-generated compound growth rates (CAGR) from raw financial tables?",
    "textKn": "ಕಚ್ಚಾ ಕೋಷ್ಟಕಗಳಿಂದ AI ರಚಿಸಿದ ಸಂಯುಕ್ತ ವಾರ್ಷಿಕ ಬೆಳವಣಿಗೆ ದರವನ್ನು (CAGR) ಹಸ್ತಚಾಲಿತವಾಗಿ ಮರುಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ?",
    "textKnEn": "AI generated CAGR na raw table inda hege recalculate madi verify madodu?",
    "tags": [
      "cagr-verification"
    ]
  },
  {
    "id": "sug_14_solve_162",
    "sessionId": 14,
    "category": "solve",
    "text": "What steps should I follow when an AI tool changes accounting terminology incorrectly?",
    "textKn": "AI ಉಪಕರಣವು ಲೆಕ್ಕಪತ್ರದ ತಾಂತ್ರಿಕ ಪದಗಳನ್ನು ತಪ್ಪಾಗಿ ಬದಲಾಯಿಸಿದಾಗ ಯಾವ ಕ್ರಮ ಕೈಗೊಳ್ಳಬೇಕು?",
    "textKnEn": "AI terminology thappagi change madidre hege correct madodu?",
    "tags": [
      "terminology-audit"
    ]
  },
  {
    "id": "sug_14_apply_163",
    "sessionId": 14,
    "category": "apply",
    "text": "In an Infosys enterprise workflow, what sign-off is required before sending an AI-drafted email to an external vendor?",
    "textKn": "ಇನ್ಫೋಸಿಸ್‌ನಲ್ಲಿ ಹೊರಗಿನ ಮಾರಾಟಗಾರರಿಗೆ AI ರಚಿತ ಇಮೇಲ್ ಕಳುಹಿಸುವ ಮುನ್ನ ಯಾವ ಅನುಮೋದನೆ ಅಗತ್ಯ?",
    "textKnEn": "Infosys workflow alli AI-drafted email vendor ge kalso munche yav sign-off beku?",
    "tags": [
      "infosys",
      "workflow-approval"
    ]
  },
  {
    "id": "sug_14_apply_164",
    "sessionId": 14,
    "category": "apply",
    "text": "What commercial liabilities arise if an unverified AI summary misstates contract renewal dates?",
    "textKn": "ಪರಿಶೀಲಿಸದ AI ಸಾರಾಂಶವು ಒಪ್ಪಂದದ ದಿನಾಂಕವನ್ನು ತಪ್ಪಾಗಿ ಹೇಳಿದರೆ ಕಂಪನಿಗೆ ಯಾವ ನಷ್ಟ ಉಂಟಾಗುತ್ತದೆ?",
    "textKnEn": "AI unverified summary contract date thappagi helidre yav legal liability baratte?",
    "tags": [
      "legal-liability"
    ]
  },
  {
    "id": "sug_14_apply_165",
    "sessionId": 14,
    "category": "apply",
    "text": "How can automated workflow scripts alert analysts when an AI hallucination threshold is breached?",
    "textKn": "AI ದೋಷದ ಮಿತಿ ಮೀರಿದಾಗ ಸ್ವಯಂಚಾಲಿತ ಸ್ಕ್ರಿಪ್ಟ್‌ಗಳು ವಿಶ್ಲೇಷಕರಿಗೆ ಹೇಗೆ ಎಚ್ಚರಿಕೆ ನೀಡಬಹುದು?",
    "textKnEn": "Automated workflow scripts AI error alert hege trigger madatte?",
    "tags": [
      "automation-guards"
    ]
  },
  {
    "id": "sug_14_practise_166",
    "sessionId": 14,
    "category": "practise",
    "text": "Audit this paragraph: Find which of the 3 claims cannot be substantiated from the source table.",
    "textKn": "ಈ ಪ್ಯಾರಾಗ್ರಾಫ್ ಆಡಿಟ್ ಮಾಡಿ: ನೀಡಲಾದ ಕೋಷ್ಟಕದಲ್ಲಿ ಸಮರ್ಥಿಸಲಾಗದ 3 ರಲ್ಲಿ 1 ಹೇಳಿಕೆಯನ್ನು ಪತ್ತೆಹಚ್ಚಿ.",
    "textKnEn": "Audit paragraph: Source table alli illada statement find mado exercise kodi.",
    "tags": [
      "audit-exercise"
    ]
  },
  {
    "id": "sug_14_practise_167",
    "sessionId": 14,
    "category": "practise",
    "text": "Test me: Build a claim verification row for a statement asserting \"Profits surged 45% YoY\".",
    "textKn": "\"ಲಾಭವು ವಾರ್ಷಿಕವಾಗಿ 45% ಹೆಚ್ಚಾಗಿದೆ\" ಎಂಬ ಹೇಳಿಕೆಗೆ ಕ್ಲೈಮ್ ಪರಿಶೀಲನಾ ಸಾಲನ್ನು ರಚಿಸುವ ಪರೀಕ್ಷೆ ನೀಡಿ.",
    "textKnEn": "Claim verification row build mado test kodi.",
    "tags": [
      "verification-quiz"
    ]
  },
  {
    "id": "sug_14_practise_168",
    "sessionId": 14,
    "category": "practise",
    "text": "Evaluate this AI summary against source financial statements and grade its reliability.",
    "textKn": "ಮೂಲ ಹಣಕಾಸು ವರದಿಗಳ ವಿರುದ್ಧ ಈ AI ಸಾರಾಂಶವನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ ಅದರ ನಿಖರತೆಯನ್ನು ಶ್ರೇಣೀಕರಿಸಿ.",
    "textKnEn": "AI summary reliability evaluate madi grade kodo challenge kodi.",
    "tags": [
      "grading-challenge"
    ]
  },
  {
    "id": "sug_15_understand_169",
    "sessionId": 15,
    "category": "understand",
    "text": "What is the operational difference between an all-lead win rate and a qualified opportunity win rate?",
    "textKn": "ಒಟ್ಟು ಲೀಡ್ ಗೆಲುವಿನ ಪ್ರಮಾಣ ಮತ್ತು ಅರ್ಹ ಅವಕಾಶಗಳ ಗೆಲುವಿನ ಪ್ರಮಾಣದ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?",
    "textKnEn": "All-lead win rate mattu qualified opportunity win rate difference enu?",
    "tags": [
      "crm",
      "sales-funnel"
    ]
  },
  {
    "id": "sug_15_understand_170",
    "sessionId": 15,
    "category": "understand",
    "text": "How does SLA response time directly impact customer churn and sales conversion?",
    "textKn": "ಗ್ರಾಹಕರ ಪರಿಹಾರ ಸಮಯ (SLA) ಮಾರಾಟ ಪರಿವರ್ತನೆ ಮತ್ತು ಗ್ರಾಹಕ ಧಾರಣೆಯ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?",
    "textKnEn": "SLA response time conversion mattu churn mela hege effect madatte?",
    "tags": [
      "sla-impact"
    ]
  },
  {
    "id": "sug_15_understand_171",
    "sessionId": 15,
    "category": "understand",
    "text": "Explain the stages of an enterprise B2B sales pipeline from Lead to Closed-Won.",
    "textKn": "ಲೀಡ್‌ನಿಂದ ಒಪ್ಪಂದ ಮುಕ್ತಾಯದವರೆಗೆ ಕಾರ್ಪೊರೇಟ್ ಬಿ2ಬಿ ಮಾರಾಟದ ಹಂತಗಳನ್ನು ವಿವರಿಸಿ.",
    "textKnEn": "B2B sales pipeline stages Lead to Closed-Won explain madi.",
    "tags": [
      "pipeline-stages"
    ]
  },
  {
    "id": "sug_15_solve_172",
    "sessionId": 15,
    "category": "solve",
    "text": "How do I build a CRM pipeline tracker in Excel with conversion percentages per stage?",
    "textKn": "ಪ್ರತಿ ಹಂತದ ಪರಿವರ್ತನೆ ಶೇಕಡಾವಾರು ಹೊಂದಿರುವ CRM ಟ್ರ್ಯಾಕರ್ ಅನ್ನು ಎಕ್ಸೆಲ್‌ನಲ್ಲಿ ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "Excel alli CRM pipeline tracker with conversion % hege build madodu?",
    "tags": [
      "crm-tracker"
    ]
  },
  {
    "id": "sug_15_solve_173",
    "sessionId": 15,
    "category": "solve",
    "text": "Show me how to construct an SLA Severity Matrix (P1 Critical, P2 High, P3 Medium, P4 Low).",
    "textKn": "ಎಸ್‌ಎಲ್‌ಎ ತೀವ್ರತೆಯ ಮ್ಯಾಟ್ರಿಕ್ಸ್ (P1 ನಿರ್ಣಾಯಕ, P2 ಉನ್ನತ, P3 ಮಧ್ಯಮ, P4 ಸಾಮಾನ್ಯ) ರಚಿಸುವ ವಿಧಾನ ತೋರಿಸಿ.",
    "textKnEn": "SLA Severity Matrix P1 to P4 hege structure madodu?",
    "tags": [
      "severity-matrix"
    ]
  },
  {
    "id": "sug_15_solve_174",
    "sessionId": 15,
    "category": "solve",
    "text": "How do I calculate customer churn rate and customer lifetime value (LTV)?",
    "textKn": "ಗ್ರಾಹಕರ ನಷ್ಟದ ಪ್ರಮಾಣ (Churn Rate) ಮತ್ತು ಗ್ರಾಹಕರ ಜೀವಿತಾವಧಿ ಮೌಲ್ಯವನ್ನು (LTV) ಹೇಗೆ ಲೆಕ್ಕ ಹಾಕುವುದು?",
    "textKnEn": "Churn rate mattu Customer Lifetime Value (LTV) calculate mado formula enu?",
    "tags": [
      "churn-ltv"
    ]
  },
  {
    "id": "sug_15_apply_175",
    "sessionId": 15,
    "category": "apply",
    "text": "In Maruti Suzuki dealerships, how are service complaint escalation tickets handled to prevent brand churn?",
    "textKn": "ಮಾರುತಿ ಸುಜುಕಿ ಡೀಲರ್‌ಶಿಪ್‌ಗಳಲ್ಲಿ ಗ್ರಾಹಕರ ಸೇವಾ ದೂರುಗಳ ಪರಿಹಾರಕ್ಕೆ ಯಾವ ವ್ಯವಸ್ಥೆ ಇದೆ?",
    "textKnEn": "Maruti Suzuki dealerships alli customer service complaints hege handle madtare?",
    "tags": [
      "maruti",
      "dealership-service"
    ]
  },
  {
    "id": "sug_15_apply_176",
    "sessionId": 15,
    "category": "apply",
    "text": "What root causes explain why 60% of leads drop off between Product Demo and Commercial Quotation?",
    "textKn": "ಡೆಮೊ ಮತ್ತು ಬೆಲೆ ಕೋಟೇಶನ್ ನಡುವೆ 60% ಗ್ರಾಹಕರು ಏಕೆ ಹಿಂದೆ ಸರಿಯುತ್ತಾರೆ ಎಂಬುದರ ಮೂಲ ಕಾರಣಗಳೇನು?",
    "textKnEn": "Demo to quotation drop off ge main root causes enu?",
    "tags": [
      "funnel-leakage"
    ]
  },
  {
    "id": "sug_15_apply_177",
    "sessionId": 15,
    "category": "apply",
    "text": "How does a CRM lead scoring model help a business development associate prioritize 200 daily inquiries?",
    "textKn": "ದೈನಂದಿನ 200 ವಿಚಾರಣೆಗಳಲ್ಲಿ ಯಾರಿಗೆ ಆದ್ಯತೆ ನೀಡಬೇಕೆಂದು ಲೀಡ್ ಸ್ಕೋರಿಂಗ್ ಮಾಡೆಲ್ ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ?",
    "textKnEn": "Lead scoring model 200 daily inquiries prioritize madoke hege help agatte?",
    "tags": [
      "lead-scoring"
    ]
  },
  {
    "id": "sug_15_practise_178",
    "sessionId": 15,
    "category": "practise",
    "text": "Test me: 500 leads generated, 150 qualified, 45 sent quotes, 18 closed-won. Calculate conversion rates.",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: 500 ಲೀಡ್‌ಗಳು, 150 ಅರ್ಹ, 45 ಕೋಟೇಶನ್, 18 ಮುಕ್ತಾಯ. ಹಂತವಾರು ಪರಿವರ್ತನೆ ದರ ಲೆಕ್ಕ ಹಾಕಿ.",
    "textKnEn": "500 leads, 150 qualified, 45 quotes, 18 won adre stage conversion rates calculate madi.",
    "tags": [
      "funnel-quiz"
    ]
  },
  {
    "id": "sug_15_practise_179",
    "sessionId": 15,
    "category": "practise",
    "text": "Assign SLA severity levels (P1 to P4) to these 3 real-world customer support incidents.",
    "textKn": "ಈ 3 ನೈಜ ಗ್ರಾಹಕ ಸೇವಾ ಘಟನೆಗಳಿಗೆ ಎಸ್‌ಎಲ್‌ಎ ತೀವ್ರತೆಯ ಮಟ್ಟಗಳನ್ನು (P1 ನಿಂದ P4) ನಿಗದಿಪಡಿಸುವ ಪರೀಕ್ಷೆ ನೀಡಿ.",
    "textKnEn": "3 customer incidents ge SLA priority P1-P4 assign mado test kodi.",
    "tags": [
      "severity-test"
    ]
  },
  {
    "id": "sug_15_practise_180",
    "sessionId": 15,
    "category": "practise",
    "text": "Challenge me to write a professional turnaround email for an escalated P1 customer issue.",
    "textKn": "ಉಲ್ಬಣಗೊಂಡ P1 ಗ್ರಾಹಕ ಸಮಸ್ಯೆಗೆ ವೃತ್ತಿಪರ ಪರಿಹಾರ ಇಮೇಲ್ ಬರೆಯಲು ನನಗೆ ಸವಾಲು ನೀಡಿ.",
    "textKnEn": "Escalated P1 complaint ge apology & resolution email bariyoke challenge kodi.",
    "tags": [
      "customer-email"
    ]
  },
  {
    "id": "sug_16_understand_181",
    "sessionId": 16,
    "category": "understand",
    "text": "What is Contribution Margin and why is it superior to Gross Margin for short-term decisions?",
    "textKn": "ಕೊಡುಗೆ ಮಾರ್ಜಿನ್ (Contribution Margin) ಎಂದರೇನು ಮತ್ತು ಅಲ್ಪಾವಧಿ ನಿರ್ಧಾರಗಳಿಗೆ ಇದು ಏಕೆ ಉತ್ತಮ?",
    "textKnEn": "Contribution margin andrene mattu short term decisions ge eke best?",
    "tags": [
      "contribution-margin",
      "break-even"
    ]
  },
  {
    "id": "sug_16_understand_182",
    "sessionId": 16,
    "category": "understand",
    "text": "Explain the Break-even Point formula in both units and monetary value.",
    "textKn": "ಘಟಕಗಳು ಮತ್ತು ಹಣದ ಮೌಲ್ಯ ಎರಡರಲ್ಲೂ ಬ್ರೇಕ್-ಈವನ್ ಪಾಯಿಂಟ್ (Break-even) ಸೂತ್ರವನ್ನು ವಿವರಿಸಿ.",
    "textKnEn": "Break-even point units mattu rupee value formula explain madi.",
    "tags": [
      "break-even-formula"
    ]
  },
  {
    "id": "sug_16_understand_183",
    "sessionId": 16,
    "category": "understand",
    "text": "How do commercial managers evaluate a \"Make vs Buy\" proposal?",
    "textKn": "ವ್ಯಾಪಾರ ವ್ಯವಸ್ಥಾಪಕರು \"ಸ್ವಂತ ತಯಾರಿ vs ಹೊರಗಿನ ಖರೀದಿ\" (Make vs Buy) ಪ್ರಸ್ತಾವನೆಯನ್ನು ಹೇಗೆ ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತಾರೆ?",
    "textKnEn": "Make vs Buy proposal evaluate hege madtare?",
    "tags": [
      "make-vs-buy"
    ]
  },
  {
    "id": "sug_16_solve_184",
    "sessionId": 16,
    "category": "solve",
    "text": "Show me how to calculate break-even sales when fixed costs are ₹20 Lakh and contribution margin ratio is 40%.",
    "textKn": "ಸ್ಥಿರ ವೆಚ್ಚ ₹20 ಲಕ್ಷ ಮತ್ತು ಕೊಡುಗೆ ಅನುಪಾತ 40% ಇದ್ದಾಗ ಬ್ರೇಕ್-ಈವನ್ ಮಾರಾಟವನ್ನು ಹೇಗೆ ಲೆಕ್ಕ ಹಾಕುವುದು?",
    "textKnEn": "Fixed cost 20L, contribution margin 40% adre break-even sales hege calculate madodu?",
    "tags": [
      "break-even-calc"
    ]
  },
  {
    "id": "sug_16_solve_185",
    "sessionId": 16,
    "category": "solve",
    "text": "How do I evaluate whether accepting a special discount order of 5,000 units covers variable costs?",
    "textKn": "5,000 ಘಟಕಗಳ ವಿಶೇಷ ರಿಯಾಯಿತಿ ಆದೇಶವು ಬದಲಾಗುವ ವೆಚ್ಚಗಳನ್ನು ಸರಿದೂಗಿಸುತ್ತದೆಯೇ ಎಂದು ಹೇಗೆ ಪರೀಕ್ಷಿಸುವುದು?",
    "textKnEn": "Special discount order accept madbahuda variable cost cover agutta hege evaluate madodu?",
    "tags": [
      "special-order"
    ]
  },
  {
    "id": "sug_16_solve_186",
    "sessionId": 16,
    "category": "solve",
    "text": "How do I build a sensitivity table in Excel for varying price points and expected volumes?",
    "textKn": "ವಿವಿಧ ಬೆಲೆಗಳು ಮತ್ತು ನಿರೀಕ್ಷಿತ ಪ್ರಮಾಣಗಳಿಗೆ ಎಕ್ಸೆಲ್‌ನಲ್ಲಿ ಸಂವೇದನಾ ಕೋಷ್ಟಕವನ್ನು (Sensitivity Table) ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "Excel sensitivity data table price vs volume hege build madodu?",
    "tags": [
      "sensitivity-analysis"
    ]
  },
  {
    "id": "sug_16_apply_187",
    "sessionId": 16,
    "category": "apply",
    "text": "In Titan’s manufacturing division, how is production allocated when machine hours are constrained?",
    "textKn": "ಟೈಟಾನ್‌ನ ಉತ್ಪಾದನಾ ವಿಭಾಗದಲ್ಲಿ, ಯಂತ್ರದ ಸಮಯ ಸೀಮಿತವಾಗಿದ್ದಾಗ ಉತ್ಪಾದನೆಯನ್ನು ಹೇಗೆ ಹಂಚಿಕೆ ಮಾಡಲಾಗುತ್ತದೆ?",
    "textKnEn": "Titan manufacturing alli limiting factor machine hours idaga production hege allocate madtare?",
    "tags": [
      "titan",
      "limiting-factor"
    ]
  },
  {
    "id": "sug_16_apply_188",
    "sessionId": 16,
    "category": "apply",
    "text": "Why does offering an excessive 15% volume discount destroy corporate profitability if fixed costs are high?",
    "textKn": "ಸ್ಥಿರ ವೆಚ್ಚಗಳು ಹೆಚ್ಚಿರುವಾಗ 15% ರಿಯಾಯಿತಿ ನೀಡುವುದು ಕಂಪನಿಯ ಲಾಭದಾಯಕತೆಯನ್ನು ಹೇಗೆ ನಾಶಮಾಡುತ್ತದೆ?",
    "textKnEn": "High fixed cost idaga 15% volume discount profitability hege spoil madatte?",
    "tags": [
      "discount-impact"
    ]
  },
  {
    "id": "sug_16_apply_189",
    "sessionId": 16,
    "category": "apply",
    "text": "How should a finance analyst defend declining an unprofitable high-volume corporate client?",
    "textKn": "ಲಾಭವಿಲ್ಲದ ದೊಡ್ಡ ಕಾರ್ಪೊರೇಟ್ ಕ್ಲೈಂಟ್‌ನ ಪ್ರಸ್ತಾವನೆಯನ್ನು ನಿರಾಕರಿಸುವುದನ್ನು ಹಣಕಾಸು ವಿಶ್ಲೇಷಕರು ಹೇಗೆ ಸಮರ್ಥಿಸಿಕೊಳ್ಳಬೇಕು?",
    "textKnEn": "Unprofitable client decline madoke financial justification hege kododu?",
    "tags": [
      "client-profitability"
    ]
  },
  {
    "id": "sug_16_practise_190",
    "sessionId": 16,
    "category": "practise",
    "text": "Test me: Selling price is ₹500, Variable cost is ₹300, Fixed costs are ₹6,00,000. Calculate Break-even units.",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಮಾರಾಟ ಬೆಲೆ ₹500, ವೆಚ್ಚ ₹300, ಸ್ಥಿರ ವೆಚ್ಚ ₹6,00,000. ಬ್ರೇಕ್-ಈವನ್ ಘಟಕಗಳನ್ನು ಲೆಕ್ಕ ಹಾಕಿ.",
    "textKnEn": "Price ₹500, VC ₹300, FC ₹6L adre Break-even units estu?",
    "tags": [
      "break-even-quiz"
    ]
  },
  {
    "id": "sug_16_practise_191",
    "sessionId": 16,
    "category": "practise",
    "text": "A client wants a 10% discount for 20% higher volume. Guide me to calculate the profit impact.",
    "textKn": "ಗ್ರಾಹಕರೊಬ್ಬರು 20% ಹೆಚ್ಚಿನ ಖರೀದಿಗೆ 10% ರಿಯಾಯಿತಿ ಕೇಳಿದ್ದಾರೆ. ಲಾಭದ ಮೇಲಿನ ಪರಿಣಾಮ ಲೆಕ್ಕಹಾಕಲು ನನಗೆ ಸಹಾಯ ಮಾಡಿ.",
    "textKnEn": "10% discount for 20% volume profit impact calculate mado exercise kodi.",
    "tags": [
      "discount-exercise"
    ]
  },
  {
    "id": "sug_16_practise_192",
    "sessionId": 16,
    "category": "practise",
    "text": "Evaluate this Make vs Buy case: Making costs ₹45/unit (incl ₹15 fixed), buying costs ₹35/unit. What is the decision?",
    "textKn": "ಸ್ವಂತ ತಯಾರಿ ₹45 (₹15 ಸ್ಥಿರ ಸೇರಿ), ಹೊರಗಿನಿಂದ ₹35. ತಯಾರಿಸಬೇಕೇ ಅಥವಾ ಖರೀದಿಸಬೇಕೇ? ನಿರ್ಧಾರ ತಿಳಿಸಿ.",
    "textKnEn": "Make ₹45 vs Buy ₹35 decision analysis quiz kodi.",
    "tags": [
      "make-buy-quiz"
    ]
  },
  {
    "id": "sug_17_understand_193",
    "sessionId": 17,
    "category": "understand",
    "text": "What is the MECE principle (Mutually Exclusive, Collectively Exhaustive) in business problem definition?",
    "textKn": "ವ್ಯಾಪಾರ ಸಮಸ್ಯೆ ನಿರೂಪಣೆಯಲ್ಲಿ MECE ತತ್ವದ (ಪರಸ್ಪರ ಪ್ರತ್ಯೇಕ, ಸಾಮೂಹಿಕ ಸಮಗ್ರ) ಅರ್ಥವೇನು?",
    "textKnEn": "Business problem definition alli MECE principle andrene?",
    "tags": [
      "mece",
      "problem-discovery"
    ]
  },
  {
    "id": "sug_17_understand_194",
    "sessionId": 17,
    "category": "understand",
    "text": "How does the \"5 Whys\" root cause analysis distinguish superficial symptoms from true systemic defects?",
    "textKn": "5 ವೈಸ್ (5 Whys) ವಿಧಾನವು ಮೇಲ್ಮೈ ಲಕ್ಷಣಗಳನ್ನು ಮೂಲ ವ್ಯವಸ್ಥಿತ ದೋಷಗಳಿಂದ ಹೇಗೆ ಪ್ರತ್ಯೇಕಿಸುತ್ತದೆ?",
    "textKnEn": "5 Whys root cause analysis symptom vs real problem hege separate madatte?",
    "tags": [
      "5-whys"
    ]
  },
  {
    "id": "sug_17_understand_195",
    "sessionId": 17,
    "category": "understand",
    "text": "Why must a project scope statement explicitly define \"Out-of-Scope\" boundaries?",
    "textKn": "ಯೋಜನೆಯ ವ್ಯಾಪ್ತಿ ಹೇಳಿಕೆಯು \"ವ್ಯಾಪ್ತಿಗೆ ಸೇರದ ವಿಷಯಗಳನ್ನು\" (Out of Scope) ಏಕೆ ಸ್ಪಷ್ಟವಾಗಿ ವ್ಯಾಖ್ಯಾನಿಸಬೇಕು?",
    "textKnEn": "Project scope out-of-scope boundaries eke clearly mention madbeku?",
    "tags": [
      "scope-creep"
    ]
  },
  {
    "id": "sug_17_solve_196",
    "sessionId": 17,
    "category": "solve",
    "text": "Show me how to structure a professional 1-page Problem Statement with Context, Defect, Metric, and Impact.",
    "textKn": "ಸಂದರ್ಭ, ದೋಷ, ಅಳತೆಗೋಲು ಮತ್ತು ಪರಿಣಾಮವನ್ನು ಒಳಗೊಂಡ 1-ಪುಟದ ಸಮಸ್ಯೆ ನಿರೂಪಣೆಯನ್ನು ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "1-page problem statement context defect metric impact inda hege format madodu?",
    "tags": [
      "problem-statement"
    ]
  },
  {
    "id": "sug_17_solve_197",
    "sessionId": 17,
    "category": "solve",
    "text": "How do I conduct a 20-minute client discovery interview without asking leading or biased questions?",
    "textKn": "ಪೂರ್ವಾಗ್ರಹ ಪೀಡಿತ ಪ್ರಶ್ನೆಗಳಿಲ್ಲದೆ 20 ನಿಮಿಷಗಳ ಗ್ರಾಹಕ ಅನ್ವೇಷಣಾ ಸಂದರ್ಶನವನ್ನು ಹೇಗೆ ನಡೆಸುವುದು?",
    "textKnEn": "Leading questions illade 20-min client discovery interview hege conduct madodu?",
    "tags": [
      "client-interview"
    ]
  },
  {
    "id": "sug_17_solve_198",
    "sessionId": 17,
    "category": "solve",
    "text": "How do I build a Fishbone (Ishikawa) diagram in a corporate spreadsheet for process bottlenecks?",
    "textKn": "ಪ್ರಕ್ರಿಯೆಯ ಅಡೆತಡೆಗಳಿಗಾಗಿ ಫಿಶ್‌ಬೋನ್ (ಇಶಿಕಾವಾ) ರೇಖಾಚಿತ್ರವನ್ನು ಎಕ್ಸೆಲ್‌ನಲ್ಲಿ ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "Fishbone Ishikawa diagram spreadsheet alli hege structure madodu?",
    "tags": [
      "fishbone-diagram"
    ]
  },
  {
    "id": "sug_17_apply_199",
    "sessionId": 17,
    "category": "apply",
    "text": "In Maruti Suzuki supply chains, how was dealer spare part turnaround time diagnosed?",
    "textKn": "ಮಾರುತಿ ಸುಜುಕಿ ಪೂರೈಕೆ ಜಾಲದಲ್ಲಿ ಡೀಲರ್ ಬಿಡಿಭಾಗಗಳ ವಿತರಣಾ ಸಮಯದ ವಿಳಂಬವನ್ನು ಹೇಗೆ ಪತ್ತೆಹಚ್ಚಲಾಯಿತು?",
    "textKnEn": "Maruti Suzuki dealer spare parts delay hege diagnose madidru?",
    "tags": [
      "maruti",
      "supply-chain-discovery"
    ]
  },
  {
    "id": "sug_17_apply_200",
    "sessionId": 17,
    "category": "apply",
    "text": "What happens when a project team solves the wrong problem because user assumptions were unverified?",
    "textKn": "ಬಳಕೆದಾರರ ಊಹೆಗಳನ್ನು ಪರಿಶೀಲಿಸದೆ ತಪ್ಪಾದ ಸಮಸ್ಯೆಯನ್ನು ಪರಿಹರಿಸಲು ಹೊರಟರೆ ಏನಾಗುತ್ತದೆ?",
    "textKnEn": "Wrong problem solve madidre project failure risks enu?",
    "tags": [
      "unverified-assumptions"
    ]
  },
  {
    "id": "sug_17_apply_201",
    "sessionId": 17,
    "category": "apply",
    "text": "How does a business analyst map a current-state (\"As-Is\") versus future-state (\"To-Be\") process flow?",
    "textKn": "ಪ್ರಸ್ತುತ ಪ್ರಕ್ರಿಯೆ (As-Is) ಮತ್ತು ಭವಿಷ್ಯದ ಪ್ರಕ್ರಿಯೆಯ (To-Be) ನಡುವಿನ ಹರಿವನ್ನು ವಿಶ್ಲೇಷಕರು ಹೇಗೆ ರಚಿಸುತ್ತಾರೆ?",
    "textKnEn": "As-Is vs To-Be process flow hege map madtare?",
    "tags": [
      "process-mapping"
    ]
  },
  {
    "id": "sug_17_practise_202",
    "sessionId": 17,
    "category": "practise",
    "text": "Apply the 5 Whys technique to this problem: \"Invoices were delivered 4 days late to clients.\"",
    "textKn": "ಈ ಸಮಸ್ಯೆಗೆ 5 ವೈಸ್ ವಿಧಾನ ಅನ್ವಯಿಸಿ: \"ಕ್ಲೈಂಟ್‌ಗಳಿಗೆ ಇನ್‌ವಾಯ್ಸ್‌ಗಳು 4 ದಿನ ತಡವಾಗಿ ತಲುಪಿವೆ.\"",
    "textKnEn": "Invoices delivered 4 days late ge 5 Whys root cause analysis mado exercise kodi.",
    "tags": [
      "5-whys-exercise"
    ]
  },
  {
    "id": "sug_17_practise_203",
    "sessionId": 17,
    "category": "practise",
    "text": "Test me on writing 3 distinct Out-of-Scope boundaries for an inventory automation project.",
    "textKn": "ದಾಸ್ತಾನು ಯಾಂತ್ರೀಕೃತ ಯೋಜನೆಗಾಗಿ 3 ಸ್ಪಷ್ಟ \"ವ್ಯಾಪ್ತಿಯಿಂದ ಹೊರಗಿರುವ\" ಮಿತಿಗಳನ್ನು ಬರೆಯುವ ಪರೀಕ್ಷೆ ನೀಡಿ.",
    "textKnEn": "Inventory automation project ge 3 out-of-scope boundaries bariyo test kodi.",
    "tags": [
      "scope-quiz"
    ]
  },
  {
    "id": "sug_17_practise_204",
    "sessionId": 17,
    "category": "practise",
    "text": "Critique this vague problem statement: \"Our team needs better software because things are slow.\"",
    "textKn": "ಈ ಅಸ್ಪಷ್ಟ ಸಮಸ್ಯೆ ನಿರೂಪಣೆಯನ್ನು ವಿಮರ್ಶಿಸಿ: \"ನಮ್ಮ ತಂಡಕ್ಕೆ ಉತ್ತಮ ಸಾಫ್ಟ್‌ವೇರ್ ಬೇಕು ಏಕೆಂದರೆ ಕೆಲಸ ನಿಧಾನವಾಗಿದೆ.\"",
    "textKnEn": "Vague problem statement review madi measurable problem statement agi change madi.",
    "tags": [
      "statement-critique"
    ]
  },
  {
    "id": "sug_18_understand_205",
    "sessionId": 18,
    "category": "understand",
    "text": "What makes an Acceptance Criterion testable and unambiguous in project design?",
    "textKn": "ಯೋಜನಾ ವಿನ್ಯಾಸದಲ್ಲಿ ಸ್ವೀಕಾರ ಮಾನದಂಡವನ್ನು (Acceptance Criterion) ಪರೀಕ್ಷಿಸಬಹುದಾದಂತೆ ಮಾಡುವುದು ಹೇಗೆ?",
    "textKnEn": "Project design alli Acceptance Criteria testable agoke en beku?",
    "tags": [
      "solution-design",
      "acceptance-criteria"
    ]
  },
  {
    "id": "sug_18_understand_206",
    "sessionId": 18,
    "category": "understand",
    "text": "Explain the Critical Path Method (CPM) and why dependencies dictate project completion dates.",
    "textKn": "ಕ್ರಿಟಿಕಲ್ ಪಾತ್ ಮೆಥಡ್ (CPM) ಮತ್ತು ಪರಸ್ಪರ ಅವಲಂಬನೆಗಳು ಯೋಜನೆಯ ಮುಕ್ತಾಯ ದಿನಾಂಕವನ್ನು ಹೇಗೆ ನಿರ್ಧರಿಸುತ್ತವೆ?",
    "textKnEn": "Critical Path Method (CPM) dependencies project timeline hege dictate madatte?",
    "tags": [
      "cpm",
      "dependencies"
    ]
  },
  {
    "id": "sug_18_understand_207",
    "sessionId": 18,
    "category": "understand",
    "text": "What is the purpose of a Project Risk Mitigation Matrix (Probability vs Impact)?",
    "textKn": "ಯೋಜನಾ ಅಪಾಯ ತಗ್ಗಿಸುವ ಮ್ಯಾಟ್ರಿಕ್ಸ್‌ನ (ಸಂಭವನೀಯತೆ vs ಪರಿಣಾಮ) ಉದ್ದೇಶವೇನು?",
    "textKnEn": "Project Risk Mitigation Matrix probability vs impact purpose enu?",
    "tags": [
      "risk-matrix"
    ]
  },
  {
    "id": "sug_18_solve_208",
    "sessionId": 18,
    "category": "solve",
    "text": "How do I construct a 10-day milestone implementation roadmap with owners and deliverable gates?",
    "textKn": "ಮಾಲೀಕರು ಮತ್ತು ಹಂತಗಳನ್ನು ಒಳಗೊಂಡ 10-ದಿನಗಳ ಮೈಲಿಗಲ್ಲು ಅನುಷ್ಠಾನ ಮಾರ್ಗಸೂಚಿಯನ್ನು ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "10-day milestone implementation roadmap owners & gates jote hege build madodu?",
    "tags": [
      "project-roadmap"
    ]
  },
  {
    "id": "sug_18_solve_209",
    "sessionId": 18,
    "category": "solve",
    "text": "Show me how to map task dependencies in a spreadsheet without specialized PM software.",
    "textKn": "ಯಾವುದೇ ವಿಶೇಷ ಸಾಫ್ಟ್‌ವೇರ್ ಇಲ್ಲದೆ ಎಕ್ಸೆಲ್‌ನಲ್ಲಿ ಕಾರ್ಯಗಳ ಅವಲಂಬನೆಯನ್ನು ಹೇಗೆ ನಕ್ಷೆ ಮಾಡುವುದು?",
    "textKnEn": "Spreadsheet alli task dependencies hege map madodu?",
    "tags": [
      "task-mapping"
    ]
  },
  {
    "id": "sug_18_solve_210",
    "sessionId": 18,
    "category": "solve",
    "text": "How do I calculate buffer time to absorb unexpected delays without extending client deadlines?",
    "textKn": "ಕ್ಲೈಂಟ್ ಗಡುವನ್ನು ವಿಸ್ತರಿಸದೆ ಅನಿರೀಕ್ಷಿತ ವಿಳಂಬಗಳನ್ನು ಸರಿಹೊಂದಿಸಲು ಬಫರ್ ಸಮಯವನ್ನು ಹೇಗೆ ಲೆಕ್ಕ ಹಾಕುವುದು?",
    "textKnEn": "Buffer time hege calculate madodu deadlines protect madoke?",
    "tags": [
      "buffer-calculation"
    ]
  },
  {
    "id": "sug_18_apply_211",
    "sessionId": 18,
    "category": "apply",
    "text": "In Infosys client delivery, how do project managers prevent Scope Creep during sprint planning?",
    "textKn": "ಇನ್ಫೋಸಿಸ್ ಕ್ಲೈಂಟ್ ಕೆಲಸಗಳಲ್ಲಿ, ಯೋಜನಾ ವ್ಯವಸ್ಥಾಪಕರು ಸ್ಪ್ರಿಂಟ್ ಸಮಯದಲ್ಲಿ ಕೆಲಸ ಹೆಚ್ಚಾಗುವುದನ್ನು (Scope Creep) ಹೇಗೆ ತಡೆಯುತ್ತಾರೆ?",
    "textKnEn": "Infosys sprint planning alli scope creep hege control madtare?",
    "tags": [
      "infosys",
      "scope-control"
    ]
  },
  {
    "id": "sug_18_apply_212",
    "sessionId": 18,
    "category": "apply",
    "text": "What contingency plan should be invoked if a core squad analyst falls ill during execution?",
    "textKn": "ಯೋಜನೆ ಜಾರಿಯಲ್ಲಿರುವಾಗ ಪ್ರಮುಖ ವಿಶ್ಲೇಷಕರು ಅನಾರೋಗ್ಯಕ್ಕೊಳಗಾದರೆ ಯಾವ ತುರ್ತು ಯೋಜನೆಯನ್ನು ಜಾರಿಗೊಳಿಸಬೇಕು?",
    "textKnEn": "Core squad analyst ill adre yav contingency plan follow madbeku?",
    "tags": [
      "contingency-planning"
    ]
  },
  {
    "id": "sug_18_apply_213",
    "sessionId": 18,
    "category": "apply",
    "text": "How does a project manager conduct an effective weekly stakeholder status check-in?",
    "textKn": "ಯೋಜನಾ ವ್ಯವಸ್ಥಾಪಕರು ಪರಿಣಾಮಕಾರಿ ಸಾಪ್ತಾಹಿಕ ಪಾಲುದಾರರ ಪ್ರಗತಿ ಪರಿಶೀಲನೆಯನ್ನು ಹೇಗೆ ನಡೆಸುತ್ತಾರೆ?",
    "textKnEn": "Stakeholder weekly status check-in meeting hege run madtare?",
    "tags": [
      "stakeholder-reporting"
    ]
  },
  {
    "id": "sug_18_practise_214",
    "sessionId": 18,
    "category": "practise",
    "text": "Given 6 tasks with estimated hours and dependencies, identify the critical path.",
    "textKn": "ಅಂದಾಜು ಗಂಟೆಗಳು ಮತ್ತು ಅವಲಂಬನೆಗಳನ್ನು ಹೊಂದಿರುವ 6 ಕಾರ್ಯಗಳನ್ನು ನೀಡಿ ಕ್ರಿಟಿಕಲ್ ಪಾತ್ ಗುರುತಿಸಲು ಹೇಳಿ.",
    "textKnEn": "6 tasks kottu Critical Path find mado exercise quiz kodi.",
    "tags": [
      "cpm-quiz"
    ]
  },
  {
    "id": "sug_18_practise_215",
    "sessionId": 18,
    "category": "practise",
    "text": "Write 2 testable acceptance criteria for a \"Daily Sales Automated Email Notification\".",
    "textKn": "\"ದೈನಂದಿನ ಮಾರಾಟ ಸ್ವಯಂಚಾಲಿತ ಇಮೇಲ್ ಅಧಿಸೂಚನೆ\"ಗಾಗಿ 2 ಪರೀಕ್ಷಿಸಬಹುದಾದ ಸ್ವೀಕಾರ ಮಾನದಂಡಗಳನ್ನು ಬರೆಯಿರಿ.",
    "textKnEn": "Daily sales email alert ge 2 testable acceptance criteria bariyoke test kodi.",
    "tags": [
      "acceptance-criteria-quiz"
    ]
  },
  {
    "id": "sug_18_practise_216",
    "sessionId": 18,
    "category": "practise",
    "text": "Rank these 3 risks by severity: Database corruption, 2-hour server downtime, missing email logo.",
    "textKn": "ಈ 3 ಅಪಾಯಗಳನ್ನು ತೀವ್ರತೆಯ ಆಧಾರದ ಮೇಲೆ ಶ್ರೇಣೀಕರಿಸಿ: ಡೇಟಾ ನಷ್ಟ, 2 ಗಂಟೆ ಸರ್ವರ್ ಸ್ಥಗಿತ, ಇಮೇಲ್ ಲೋಗೋ ಕೊರತೆ.",
    "textKnEn": "3 project risks severity rank mado challenge kodi.",
    "tags": [
      "risk-ranking"
    ]
  },
  {
    "id": "sug_19_understand_217",
    "sessionId": 19,
    "category": "understand",
    "text": "What is \"Control Total Invariance\" and why is it the gold standard in financial QA?",
    "textKn": "ಹಣಕಾಸಿನ ಗುಣಮಟ್ಟ ಖಾತರಿಯಲ್ಲಿ (QA) \"ಕಂಟ್ರೋಲ್ ಟೋಟಲ್ ಇನ್ವೇರಿಯನ್ಸ್\" (ಸ್ಥಿರ ನಿಯಂತ್ರಣ ಮೊತ್ತ) ಎಂದರೇನು?",
    "textKnEn": "Financial QA alli Control Total Invariance andrene mattu eke gold standard?",
    "tags": [
      "qa",
      "control-totals",
      "invariance"
    ]
  },
  {
    "id": "sug_19_understand_218",
    "sessionId": 19,
    "category": "understand",
    "text": "Why is As-Of Date Sensitivity (e.g. 31 Oct midnight vs 01 Nov 00:01) critical for ledger audits?",
    "textKn": "ಲೆಡ್ಜರ್ ಲೆಕ್ಕಪರಿಶೋಧನೆಗೆ ದಿನಾಂಕ ಮತ್ತು ಸಮಯದ ಸಂವೇದನೆ (31 ಅಕ್ಟೋಬರ್ vs 01 ನವೆಂಬರ್) ಏಕೆ ನಿರ್ಣಾಯಕ?",
    "textKnEn": "As-of date sensitivity 31 Oct vs 01 Nov ledger audit ge eke critical?",
    "tags": [
      "as-of-date-audit"
    ]
  },
  {
    "id": "sug_19_understand_219",
    "sessionId": 19,
    "category": "understand",
    "text": "Explain the difference between normal cases, boundary cases, and negative test cases.",
    "textKn": "ಸಾಮಾನ್ಯ ಪರೀಕ್ಷೆಗಳು, ಗಡಿ ಪ್ರಕರಣಗಳು (Boundary) ಮತ್ತು ನಕಾರಾತ್ಮಕ ಪರೀಕ್ಷಾ ಪ್ರಕರಣಗಳ (Negative) ವ್ಯತ್ಯಾಸವೇನು?",
    "textKnEn": "Normal cases, boundary cases mattu negative test cases difference explain madi.",
    "tags": [
      "test-case-types"
    ]
  },
  {
    "id": "sug_19_solve_220",
    "sessionId": 19,
    "category": "solve",
    "text": "How do I design a 4-point Excel Quality Assurance matrix for complex financial models?",
    "textKn": "ಸಂಕೀರ್ಣ ಹಣಕಾಸು ಮಾದರಿಗಳಿಗಾಗಿ 4-ಹಂತದ ಎಕ್ಸೆಲ್ ಗುಣಮಟ್ಟ ಭರವಸೆ ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಅನ್ನು ಹೇಗೆ ವಿನ್ಯಾಸಗೊಳಿಸುವುದು?",
    "textKnEn": "Complex financial models ge 4-point Excel QA matrix hege design madodu?",
    "tags": [
      "excel-qa-matrix"
    ]
  },
  {
    "id": "sug_19_solve_221",
    "sessionId": 19,
    "category": "solve",
    "text": "Show me how to write automated cell checks that display \"BALANCED\" in green or \"ERROR: ₹X\" in red.",
    "textKn": "ಹಸಿರು ಬಣ್ಣದಲ್ಲಿ \"BALANCED\" ಅಥವಾ ಕೆಂಪು ಬಣ್ಣದಲ್ಲಿ \"ERROR: ₹X\" ತೋರಿಸುವ ಎಕ್ಸೆಲ್ ಸ್ವಯಂಚಾಲಿತ ಪರಿಶೀಲನೆ ಸೂತ್ರ ತೋರಿಸಿ.",
    "textKnEn": "Excel formula green \"BALANCED\" or red \"ERROR ₹X\" torsoke hege set madodu?",
    "tags": [
      "audit-checks-formula"
    ]
  },
  {
    "id": "sug_19_solve_222",
    "sessionId": 19,
    "category": "solve",
    "text": "How do I document a failed test case with steps to reproduce, expected vs actual result, and severity?",
    "textKn": "ಮರುಸೃಷ್ಟಿಸುವ ಹಂತಗಳು, ನಿರೀಕ್ಷಿತ vs ನೈಜ ಫಲಿತಾಂಶಗಳೊಂದಿಗೆ ವಿಫಲವಾದ ಪರೀಕ್ಷಾ ಪ್ರಕರಣವನ್ನು ಹೇಗೆ ದಾಖಲಿಸುವುದು?",
    "textKnEn": "Failed test case steps, expected vs actual result jote hege log madodu?",
    "tags": [
      "defect-logging"
    ]
  },
  {
    "id": "sug_19_apply_223",
    "sessionId": 19,
    "category": "apply",
    "text": "In Titan’s billing systems, how are rounding errors (fractions of paise) controlled across 10,000 invoices?",
    "textKn": "ಟೈಟಾನ್‌ನ ಬಿಲ್ಲಿಂಗ್‌ನಲ್ಲಿ 10,000 ಇನ್‌ವಾಯ್ಸ್‌ಗಳಲ್ಲಿ ಪೈಸೆಗಳ ರೌಂಡಿಂಗ್ ದೋಷಗಳನ್ನು ಹೇಗೆ ನಿಯಂತ್ರಿಸಲಾಗುತ್ತದೆ?",
    "textKnEn": "Titan billing system alli 10,000 invoices rounding differences hege control madtare?",
    "tags": [
      "titan",
      "rounding-controls"
    ]
  },
  {
    "id": "sug_19_apply_224",
    "sessionId": 19,
    "category": "apply",
    "text": "What happens if a financial model has hardcoded values inside formulas instead of dynamic cell references?",
    "textKn": "ಡೈನಾಮಿಕ್ ಕೋಶಗಳ ಬದಲಿಗೆ ಸೂತ್ರಗಳೊಳಗೆ ಸ್ಥಿರ ಮೌಲ್ಯಗಳನ್ನು (Hardcoded) ಬರೆದರೆ ಯಾವ ಅಪಾಯ ಉಂಟಾಗುತ್ತದೆ?",
    "textKnEn": "Hardcoded values inside formulas calculation model na hege corrupt madatte?",
    "tags": [
      "hardcoding-risks"
    ]
  },
  {
    "id": "sug_19_apply_225",
    "sessionId": 19,
    "category": "apply",
    "text": "How does a senior QA auditor verify that all test scripts were executed independently?",
    "textKn": "ಎಲ್ಲಾ ಪರೀಕ್ಷೆಗಳನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ನಡೆಸಲಾಗಿದೆ ಎಂಬುದನ್ನು ಹಿರಿಯ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಕರು ಹೇಗೆ ಪರಿಶೀಲಿಸುತ್ತಾರೆ?",
    "textKnEn": "Senior QA auditor test execution independence hege verify madtare?",
    "tags": [
      "independent-verification"
    ]
  },
  {
    "id": "sug_19_practise_226",
    "sessionId": 19,
    "category": "practise",
    "text": "Test me: Write 3 test cases (1 normal, 1 boundary, 1 invalid) for a GST rate input field.",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಜಿಎಸ್‌ಟಿ ದರ ನಮೂದು ಕ್ಷೇತ್ರಕ್ಕಾಗಿ 3 ಪರೀಕ್ಷಾ ಪ್ರಕರಣಗಳನ್ನು (ಸಾಮಾನ್ಯ, ಗಡಿ, ಅಮಾನ್ಯ) ಬರೆಯಿರಿ.",
    "textKnEn": "GST rate field ge 1 normal, 1 boundary, 1 invalid test case bariyo quiz kodi.",
    "tags": [
      "test-case-writing"
    ]
  },
  {
    "id": "sug_19_practise_227",
    "sessionId": 19,
    "category": "practise",
    "text": "Spot the flaw: A formula sums A1:A20, but new row A21 was inserted yesterday.",
    "textKn": "ದೋಷ ಹುಡುಕಿ: ಸೂತ್ರವು A1:A20 ಅನ್ನು ಕೂಡಿಸುತ್ತದೆ, ಆದರೆ ನಿನ್ನೆ ಹೊಸ ಸಾಲು A21 ಅನ್ನು ಸೇರಿಸಲಾಗಿದೆ.",
    "textKnEn": "A1:A20 formula idaga row A21 insert adre flaw spot madi fix heli.",
    "tags": [
      "formula-flaw"
    ]
  },
  {
    "id": "sug_19_practise_228",
    "sessionId": 19,
    "category": "practise",
    "text": "Challenge me to build a control total reconciliation check between two data tables.",
    "textKn": "ಎರಡು ಡೇಟಾ ಕೋಷ್ಟಕಗಳ ನಡುವೆ ಕಂಟ್ರೋಲ್ ಟೋಟಲ್ ಸಮನ್ವಯ ಪರಿಶೀಲನೆಯನ್ನು ನಿರ್ಮಿಸಲು ಸವಾಲು ನೀಡಿ.",
    "textKnEn": "Two tables control total check formula challenge kodi.",
    "tags": [
      "control-total-challenge"
    ]
  },
  {
    "id": "sug_20_understand_229",
    "sessionId": 20,
    "category": "understand",
    "text": "What is the role of a Change Control Board (CCB) in enterprise financial systems?",
    "textKn": "ಕಾರ್ಪೊರೇಟ್ ಹಣಕಾಸು ವ್ಯವಸ್ಥೆಗಳಲ್ಲಿ ಬದಲಾವಣೆ ನಿಯಂತ್ರಣ ಮಂಡಳಿಯ (CCB) ಪಾತ್ರವೇನು?",
    "textKnEn": "Enterprise financial systems alli Change Control Board (CCB) role enu?",
    "tags": [
      "change-control",
      "ccb"
    ]
  },
  {
    "id": "sug_20_understand_230",
    "sessionId": 20,
    "category": "understand",
    "text": "Why must production financial spreadsheets never be modified without an approved Change Request (CR)?",
    "textKn": "ಅನುಮೋದಿತ ಬದಲಾವಣೆ ವಿನಂತಿ (CR) ಇಲ್ಲದೆ ಲೈವ್ ಎಕ್ಸೆಲ್ ಶೀಟ್‌ಗಳನ್ನು ಏಕೆ ಮಾರ್ಪಡಿಸಬಾರದು?",
    "textKnEn": "Approved Change Request illade live models eke edit madbardu?",
    "tags": [
      "change-request"
    ]
  },
  {
    "id": "sug_20_understand_231",
    "sessionId": 20,
    "category": "understand",
    "text": "How does a Credit Note impact the sales ledger, GST liability, and inventory accounts?",
    "textKn": "ಕ್ರೆಡಿಟ್ ನೋಟ್ ಮಾರಾಟ ಲೆಡ್ಜರ್, ಜಿಎಸ್‌ಟಿ ಬಾಧ್ಯತೆ ಮತ್ತು ದಾಸ್ತಾನು ಖಾತೆಗಳ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?",
    "textKnEn": "Credit Note sales ledger, GST liability, inventory mela hege affect madatte?",
    "tags": [
      "credit-note"
    ]
  },
  {
    "id": "sug_20_solve_232",
    "sessionId": 20,
    "category": "solve",
    "text": "How do I calculate the deficit and cash flow impact when deferring an ₹8,000 vendor invoice?",
    "textKn": "₹8,000 ಮಾರಾಟಗಾರರ ಇನ್‌ವಾಯ್ಸ್ ಮುಂದೂಡಿದಾಗ ನಗದು ಹರಿವಿನ ಕೊರತೆಯ ಮೇಲಿನ ಪರಿಣಾಮವನ್ನು ಹೇಗೆ ಲೆಕ್ಕ ಹಾಕುವುದು?",
    "textKnEn": "8,000 invoice defer madidaga cash flow deficit impact hege calculate madodu?",
    "tags": [
      "invoice-deferral",
      "deficit"
    ]
  },
  {
    "id": "sug_20_solve_233",
    "sessionId": 20,
    "category": "solve",
    "text": "Show me the standard documentation required to move a financial model from v1.0 to v2.0.",
    "textKn": "ಹಣಕಾಸು ಮಾದರಿಯನ್ನು v1.0 ನಿಂದ v2.0 ಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಲು ಅಗತ್ಯವಿರುವ ಅಧಿಕೃತ ದಾಖಲಾತಿಯನ್ನು ತೋರಿಸಿ.",
    "textKnEn": "Financial model v1.0 inda v2.0 ge move madoke standard doc template torsi.",
    "tags": [
      "version-control"
    ]
  },
  {
    "id": "sug_20_solve_234",
    "sessionId": 20,
    "category": "solve",
    "text": "How do I record a formal audit trail log detailing Who, When, What, and Why for each formula change?",
    "textKn": "ಪ್ರತಿ ಸೂತ್ರದ ಬದಲಾವಣೆಗೆ ಯಾರು, ಯಾವಾಗ, ಏನು ಮತ್ತು ಏಕೆ ಎಂದು ದಾಖಲಿಸುವ ಆಡಿಟ್ ಟ್ರಯಲ್ ಲಾಗ್ ಅನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸುವುದು?",
    "textKnEn": "Formula change audit trail log Who, When, What, Why hege record madodu?",
    "tags": [
      "audit-trail-log"
    ]
  },
  {
    "id": "sug_20_apply_235",
    "sessionId": 20,
    "category": "apply",
    "text": "In Maruti Suzuki plant operations, how are engineering change notices (ECN) reconciled with cost models?",
    "textKn": "ಮಾರುತಿ ಸುಜುಕಿ ಕಾರ್ಖಾನೆಯಲ್ಲಿ ಎಂಜಿನಿಯರಿಂಗ್ ಬದಲಾವಣೆಗಳನ್ನು ವೆಚ್ಚದ ಮಾದರಿಗಳೊಂದಿಗೆ ಹೇಗೆ ಸಮನ್ವಯಗೊಳಿಸಲಾಗುತ್ತದೆ?",
    "textKnEn": "Maruti Suzuki ECN changes cost models jote hege reconcile agatte?",
    "tags": [
      "maruti",
      "ecn-change"
    ]
  },
  {
    "id": "sug_20_apply_236",
    "sessionId": 20,
    "category": "apply",
    "text": "What catastrophic errors occur when two analysts edit different versions of a budget offline?",
    "textKn": "ಇಬ್ಬರು ವಿಶ್ಲೇಷಕರು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಬಜೆಟ್‌ನ ವಿಭಿನ್ನ ಆವೃತ್ತಿಗಳನ್ನು ತಿದ್ದಿದಾಗ ಯಾವ ತಪ್ಪುಗಳು ಸಂಭವಿಸುತ್ತವೆ?",
    "textKnEn": "Two analysts separate offline copies edit madidre version conflict hege resolve madodu?",
    "tags": [
      "version-conflict"
    ]
  },
  {
    "id": "sug_20_apply_237",
    "sessionId": 20,
    "category": "apply",
    "text": "How does an analyst prepare for an executive management change review with senior directors?",
    "textKn": "ಹಿರಿಯ ನಿರ್ದೇಶಕರೊಂದಿಗೆ ಅಧಿಕೃತ ಬದಲಾವಣೆ ಪರಿಶೀಲನಾ ಸಭೆಗೆ ವಿಶ್ಲೇಷಕರು ಹೇಗೆ ಸಿದ್ಧರಾಗಬೇಕು?",
    "textKnEn": "Senior management review meeting ge analyst hege prepare agbeku?",
    "tags": [
      "executive-review"
    ]
  },
  {
    "id": "sug_20_practise_238",
    "sessionId": 20,
    "category": "practise",
    "text": "Test me: Write a formal 3-point Change Request justification for updating a depreciation schedule.",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಸವಕಳಿ ವೇಳಾಪಟ್ಟಿ ನವೀಕರಿಸಲು ಅಧಿಕೃತ 3-ಅಂಶಗಳ ಬದಲಾವಣೆ ವಿನಂತಿ ಸಮರ್ಥನೆಯನ್ನು ಬರೆಯಿರಿ.",
    "textKnEn": "Depreciation schedule update ge Change Request justification bariyo test kodi.",
    "tags": [
      "cr-justification"
    ]
  },
  {
    "id": "sug_20_practise_239",
    "sessionId": 20,
    "category": "practise",
    "text": "Simulate a CCB defense: Justify why a formula fix cannot wait for the monthly release cycle.",
    "textKn": "ಬದಲಾವಣೆ ಮಂಡಳಿಯ ಮುಂದೆ ಸಮರ್ಥನೆ: ಸೂತ್ರದ ದೋಷವನ್ನು ತಿಂಗಳ ಮುಕ್ತಾಯದವರೆಗೆ ಏಕೆ ಕಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲವೆಂದು ತಿಳಿಸಿ.",
    "textKnEn": "Emergency formula patch CCB board munde justify mado roleplay kodi.",
    "tags": [
      "ccb-defense"
    ]
  },
  {
    "id": "sug_20_practise_240",
    "sessionId": 20,
    "category": "practise",
    "text": "Draft the journal entry and GST adjustment for issuing a ₹5,900 credit note (incl 18% GST).",
    "textKn": "₹5,900 ರ ಕ್ರೆಡಿಟ್ ನೋಟ್‌ಗಾಗಿ (18% ಜಿಎಸ್‌ಟಿ ಸೇರಿ) ಜರ್ನಲ್ ನಮೂದು ಮತ್ತು ಜಿಎಸ್‌ಟಿ ಹೊಂದಾಣಿಕೆಯನ್ನು ಬರೆಯಿರಿ.",
    "textKnEn": "₹5,900 credit note (incl 18% GST) journal entry & GST adjustment draft madi.",
    "tags": [
      "credit-note-quiz"
    ]
  },
  {
    "id": "sug_21_understand_241",
    "sessionId": 21,
    "category": "understand",
    "text": "Explain Google’s XYZ Resume Bullet formula: \"Accomplished [X], as measured by [Y], by doing [Z]\".",
    "textKn": "ಗೂಗಲ್‌ನ XYZ ರೆಸ್ಯೂಮ್ ಸೂತ್ರವನ್ನು ವಿವರಿಸಿ: \"[Z] ಮಾಡುವ ಮೂಲಕ, [Y] ನಿಂದ ಅಳೆಯಲಾದ, [X] ಸಾಧಿಸಲಾಗಿದೆ\".",
    "textKnEn": "Google XYZ resume bullet formula: Accomplished X, measured by Y, by doing Z explain madi.",
    "tags": [
      "resume",
      "xyz-formula"
    ]
  },
  {
    "id": "sug_21_understand_242",
    "sessionId": 21,
    "category": "understand",
    "text": "What is the \"Anti-Inflation Filter\" and why do recruiters penalize exaggerated claims on fresh graduate CVs?",
    "textKn": "ರೆಸ್ಯೂಮ್‌ನಲ್ಲಿ \"ಅತಿಶಯೋಕ್ತಿ ತಡೆ ನಿಯಮ\" ಎಂದರೇನು ಮತ್ತು ನೇಮಕಾತಿದಾರರು ಉತ್ಪ್ರೇಕ್ಷಿತ ಅಂಶಗಳನ್ನು ಏಕೆ ತಿರಸ್ಕರಿಸುತ್ತಾರೆ?",
    "textKnEn": "Anti-inflation filter andrene mattu freshers exaggerated claims hakidre eke reject agtare?",
    "tags": [
      "anti-inflation"
    ]
  },
  {
    "id": "sug_21_understand_243",
    "sessionId": 21,
    "category": "understand",
    "text": "How does a 6-artifact verified portfolio prove corporate readiness over generic certificates?",
    "textKn": "6 ಅಧಿಕೃತ ಪ್ರಾಜೆಕ್ಟ್ ಆಧಾರಿತ ಪೋರ್ಟ್‌ಫೋಲಿಯೋ ಸಾಮಾನ್ಯ ಪ್ರಮಾಣಪತ್ರಗಳಿಗಿಂತ ಹೇಗೆ ಹೆಚ್ಚು ಮೌಲ್ಯಯುತವಾಗಿದೆ?",
    "textKnEn": "6-artifact verified portfolio normal certificates ginta eke powerful?",
    "tags": [
      "portfolio"
    ]
  },
  {
    "id": "sug_21_solve_244",
    "sessionId": 21,
    "category": "solve",
    "text": "How do I convert my VCEP Session 7 Excel variance bridge into a compelling corporate resume bullet?",
    "textKn": "ನನ್ನ ಎಕ್ಸೆಲ್ ಬಿಲ್ಲಿಂಗ್ ವ್ಯತ್ಯಾಸ ಪರಿಹಾರದ ಕೆಲಸವನ್ನು ಆಕರ್ಷಕ ರೆಸ್ಯೂಮ್ ಬುಲೆಟ್ ಆಗಿ ಹೇಗೆ ಪರಿವರ್ತಿಸುವುದು?",
    "textKnEn": "Session 7 Excel variance work na XYZ resume bullet agi hege convert madodu?",
    "tags": [
      "resume-bullet"
    ]
  },
  {
    "id": "sug_21_solve_245",
    "sessionId": 21,
    "category": "solve",
    "text": "Show me how to structure an evidence-linked portfolio summary with links to raw models and audit logs.",
    "textKn": "ಕಚ್ಚಾ ಮಾದರಿಗಳು ಮತ್ತು ಆಡಿಟ್ ಲಾಗ್‌ಗಳೊಂದಿಗೆ ಪುರಾವೆ-ಲಿಂಕ್ ಮಾಡಲಾದ ಪೋರ್ಟ್‌ಫೋಲಿಯೊ ಸಾರಾಂಶವನ್ನು ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "Evidence-linked portfolio summary models & audit logs jote hege structure madodu?",
    "tags": [
      "portfolio-structure"
    ]
  },
  {
    "id": "sug_21_solve_246",
    "sessionId": 21,
    "category": "solve",
    "text": "How do I concisely describe complex GST reconciliation experience without sounding generic?",
    "textKn": "ಸಾಮಾನ್ಯವೆನಿಸದಂತೆ ಸಂಕೀರ್ಣ ಜಿಎಸ್‌ಟಿ ಸಮನ್ವಯ ಅನುಭವವನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ಹೇಗೆ ವಿವರಿಸುವುದು?",
    "textKnEn": "GST reconciliation experience na resume alli impressive agi hege explain madodu?",
    "tags": [
      "experience-description"
    ]
  },
  {
    "id": "sug_21_apply_247",
    "sessionId": 21,
    "category": "apply",
    "text": "What specific financial and analytics keywords do Infosys campus recruiters screen for in B.Com/BBA CVs?",
    "textKn": "ಇನ್ಫೋಸಿಸ್ ಕ್ಯಾಂಪಸ್ ನೇಮಕಾತಿದಾರರು ಬಿಕಾಂ/ಬಿಬಿಎ ರೆಸ್ಯೂಮ್‌ಗಳಲ್ಲಿ ಯಾವ ಹಣಕಾಸು ಕೀವರ್ಡ್‌ಗಳನ್ನು ಹುಡುಕುತ್ತಾರೆ?",
    "textKnEn": "Infosys recruiters B.Com/BBA resumes alli yav keywords screen madtare?",
    "tags": [
      "infosys",
      "recruitment-keywords"
    ]
  },
  {
    "id": "sug_21_apply_248",
    "sessionId": 21,
    "category": "apply",
    "text": "How should a candidate explain academic gaps or career pivots credibly using practical skills?",
    "textKn": "ಪ್ರಾಯೋಗಿಕ ಕೌಶಲ್ಯಗಳನ್ನು ಬಳಸಿ ಶಿಕ್ಷಣದ ಅಂತರವನ್ನು (Gaps) ವಿಶ್ವಾಸಾರ್ಹವಾಗಿ ಹೇಗೆ ವಿವರಿಸಬೇಕು?",
    "textKnEn": "Academic gaps na interview alli credibly hege explain madodu?",
    "tags": [
      "career-gaps"
    ]
  },
  {
    "id": "sug_21_apply_249",
    "sessionId": 21,
    "category": "apply",
    "text": "How does LinkedIn profile alignment with GitHub/portfolio artifacts build recruiter trust?",
    "textKn": "ಲಿಂಕ್ಡ್‌ಇನ್ ಪ್ರೊಫೈಲ್ ಪೋರ್ಟ್‌ಫೋಲಿಯೊ ಜೊತೆಗೆ ಹೊಂದಿಕೆಯಾಗುವುದು ನೇಮಕಾತಿದಾರರಲ್ಲಿ ನಂಬಿಕೆಯನ್ನು ಹೇಗೆ ಬೆಳೆಸುತ್ತದೆ?",
    "textKnEn": "LinkedIn profile portfolio artifacts jote match agodu trust hege build madatte?",
    "tags": [
      "linkedin-credibility"
    ]
  },
  {
    "id": "sug_21_practise_250",
    "sessionId": 21,
    "category": "practise",
    "text": "Critique this resume bullet: \"Assisted with bank reconciliation and financial accounting.\"",
    "textKn": "ಈ ರೆಸ್ಯೂಮ್ ಬುಲೆಟ್ ವಿಮರ್ಶಿಸಿ: \"ಬ್ಯಾಂಕ್ ಸಮನ್ವಯ ಮತ್ತು ಹಣಕಾಸು ಲೆಕ್ಕಪತ್ರದಲ್ಲಿ ಸಹಾಯ ಮಾಡಲಾಗಿದೆ.\"",
    "textKnEn": "Ee weak bullet point review madi XYZ format alli rewrite madi.",
    "tags": [
      "bullet-critique"
    ]
  },
  {
    "id": "sug_21_practise_251",
    "sessionId": 21,
    "category": "practise",
    "text": "Transform my coursework on BRS into an XYZ bullet demonstrating quantifiable impact.",
    "textKn": "ನನ್ನ ಬಿಆರ್‌ಎಸ್ ಕೋರ್ಸ್‌ವರ್ಕ್ ಅನ್ನು ಅಳೆಯಬಹುದಾದ ಪ್ರಭಾವವನ್ನು ಪ್ರದರ್ಶಿಸುವ XYZ ಬುಲೆಟ್ ಆಗಿ ಪರಿವರ್ತಿಸಿ.",
    "textKnEn": "BRS coursework na quantifiable XYZ bullet agi transform mado test kodi.",
    "tags": [
      "xyz-transformation"
    ]
  },
  {
    "id": "sug_21_practise_252",
    "sessionId": 21,
    "category": "practise",
    "text": "Test me: Write a 1-sentence headline for a commerce graduate specializing in financial operations.",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಹಣಕಾಸು ಕಾರ್ಯಾಚರಣೆಯಲ್ಲಿ ಪರಿಣತಿ ಹೊಂದಿರುವ ಕಾಮರ್ಸ್ ಪದವೀಧರರಿಗೆ 1-ವಾಕ್ಯದ ಹೆಡ್‌ಲೈನ್ ಬರೆಯಿರಿ.",
    "textKnEn": "Commerce graduate financial operations profile ge 1-sentence headline test kodi.",
    "tags": [
      "headline-quiz"
    ]
  },
  {
    "id": "sug_22_understand_253",
    "sessionId": 22,
    "category": "understand",
    "text": "What are corporate interviewers evaluating during a technical commerce viva voce?",
    "textKn": "ತಾಂತ್ರಿಕ ಕಾಮರ್ಸ್ ವೈವಾ (Viva Voce) ಸಂದರ್ಶನದ ಸಮಯದಲ್ಲಿ ಸಂದರ್ಶಕರು ಏನನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತಾರೆ?",
    "textKnEn": "Technical commerce viva voce interview alli interviewers en evaluate madtare?",
    "tags": [
      "interview",
      "viva-voce",
      "assessment"
    ]
  },
  {
    "id": "sug_22_understand_254",
    "sessionId": 22,
    "category": "understand",
    "text": "Explain the STAR method (Situation, Task, Action, Result) for behavioral questions.",
    "textKn": "ವರ್ತನೆಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಲು STAR ವಿಧಾನವನ್ನು (ಸನ್ನಿವೇಶ, ಕಾರ್ಯ, ಕ್ರಮ, ಫಲಿತಾಂಶ) ವಿವರಿಸಿ.",
    "textKnEn": "Behavioral questions ge STAR method (Situation, Task, Action, Result) explain madi.",
    "tags": [
      "star-method"
    ]
  },
  {
    "id": "sug_22_understand_255",
    "sessionId": 22,
    "category": "understand",
    "text": "Why is acknowledging what you do NOT know better than guessing in a corporate interview?",
    "textKn": "ಕಾರ್ಪೊರೇಟ್ ಸಂದರ್ಶನದಲ್ಲಿ ಊಹಿಸಿ ಉತ್ತರಿಸುವುದಕ್ಕಿಂತ ತಿಳಿಯದಿರುವುದನ್ನು ಒಪ್ಪಿಕೊಳ್ಳುವುದು ಏಕೆ ಉತ್ತಮ?",
    "textKnEn": "Interview alli guess mado badalu honestly gottilla anodu eke better?",
    "tags": [
      "interview-honesty",
      "integrity"
    ]
  },
  {
    "id": "sug_22_solve_256",
    "sessionId": 22,
    "category": "solve",
    "text": "How do I structure my thoughts in 5 seconds before answering a complex technical question?",
    "textKn": "ಸಂಕೀರ್ಣ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸುವ ಮೊದಲು 5 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ನನ್ನ ಆಲೋಚನೆಗಳನ್ನು ಹೇಗೆ ಸಂಘಟಿಸುವುದು?",
    "textKnEn": "Complex question answer mado munche 5 seconds alli thoughts hege structure madodu?",
    "tags": [
      "thought-structuring"
    ]
  },
  {
    "id": "sug_22_solve_257",
    "sessionId": 22,
    "category": "solve",
    "text": "How do I handle an interviewer who challenges my calculation or pushes back on my assumption?",
    "textKn": "ನನ್ನ ಲೆಕ್ಕಾಚಾರವನ್ನು ಪ್ರಶ್ನಿಸುವ ಅಥವಾ ಆಕ್ಷೇಪ ವ್ಯಕ್ತಪಡಿಸುವ ಸಂದರ್ಶಕರನ್ನು ಶಾಂತವಾಗಿ ಹೇಗೆ ನಿಭಾಯಿಸುವುದು?",
    "textKnEn": "Interviewer calculation challenge madidre calmly hege defend madodu?",
    "tags": [
      "defending-answers"
    ]
  },
  {
    "id": "sug_22_solve_258",
    "sessionId": 22,
    "category": "solve",
    "text": "What techniques keep my speaking pace moderate and articulate under interview pressure?",
    "textKn": "ಸಂದರ್ಶನದ ಒತ್ತಡದಲ್ಲಿಯೂ ನನ್ನ ಮಾತಿನ ವೇಗವನ್ನು ನಿಯಂತ್ರಣದಲ್ಲಿಡಲು ಮತ್ತು ಸ್ಪಷ್ಟವಾಗಿಡಲು ಯಾವ ತಂತ್ರಗಳಿವೆ?",
    "textKnEn": "Interview pressure alli speaking pace calm & articulate agi hege maintain madodu?",
    "tags": [
      "interview-calmness"
    ]
  },
  {
    "id": "sug_22_apply_259",
    "sessionId": 22,
    "category": "apply",
    "text": "In an Infosys hiring simulation, how do candidates demonstrate professional business judgment?",
    "textKn": "ಇನ್ಫೋಸಿಸ್ ಸಂದರ್ಶನದಲ್ಲಿ ಅಭ್ಯರ್ಥಿಗಳು ತಮ್ಮ ವೃತ್ತಿಪರ ವ್ಯವಹಾರ ವಿವೇಚನೆಯನ್ನು ಹೇಗೆ ಪ್ರದರ್ಶಿಸುತ್ತಾರೆ?",
    "textKnEn": "Infosys hiring simulation alli professional business judgement hege torsodu?",
    "tags": [
      "infosys",
      "business-judgment"
    ]
  },
  {
    "id": "sug_22_apply_260",
    "sessionId": 22,
    "category": "apply",
    "text": "How should an accounting fresher respond when an interviewer asks about an ethical reporting conflict?",
    "textKn": "ವರದಿಯಲ್ಲಿನ ನೈತಿಕ ಸಂಘರ್ಷದ ಕುರಿತು ಪ್ರಶ್ನಿಸಿದಾಗ ಕಾಮರ್ಸ್ ಹೊಸಬರು ಹೇಗೆ ವೃತ್ತಿಪರವಾಗಿ ಪ್ರತಿಕ್ರಿಯಿಸಬೇಕು?",
    "textKnEn": "Ethical reporting conflict bagge question kelidaga hege answer madbeku?",
    "tags": [
      "ethics",
      "integrity"
    ]
  },
  {
    "id": "sug_22_apply_261",
    "sessionId": 22,
    "category": "apply",
    "text": "What insightful questions should a candidate ask the interviewer at the end of the session?",
    "textKn": "ಸಂದರ್ಶನದ ಕೊನೆಯಲ್ಲಿ ಅಭ್ಯರ್ಥಿಯು ಸಂದರ್ಶಕರಿಗೆ ಕೇಳಬೇಕಾದ ಅರ್ಥಪೂರ್ಣ ಪ್ರಶ್ನೆಗಳು ಯಾವುವು?",
    "textKnEn": "Interview end alli interviewer ge yav meaningful questions kelbeku?",
    "tags": [
      "candidate-questions"
    ]
  },
  {
    "id": "sug_22_practise_262",
    "sessionId": 22,
    "category": "practise",
    "text": "Ask me a tough behavioral question: \"Tell me about a time you made a serious calculation mistake.\"",
    "textKn": "ನನ್ನನ್ನು ಪರೀಕ್ಷಿಸಿ: \"ನೀವು ಲೆಕ್ಕಾಚಾರದಲ್ಲಿ ದೊಡ್ಡ ತಪ್ಪು ಮಾಡಿದ ಸನ್ನಿವೇಶ ಮತ್ತು ಅದನ್ನು ಹೇಗೆ ಸರಿಪಡಿಸಿದಿರಿ ಎಂದು ತಿಳಿಸಿ.\"",
    "textKnEn": "Behavioral question practice: \"Tell me about a calculation mistake you made and fixed.\"",
    "tags": [
      "behavioral-practice"
    ]
  },
  {
    "id": "sug_22_practise_263",
    "sessionId": 22,
    "category": "practise",
    "text": "Critique my response: I explain why I chose commerce, focusing on impact and quantitative problem solving.",
    "textKn": "ನನ್ನ ಉತ್ತರವನ್ನು ವಿಮರ್ಶಿಸಿ: ನಾನು ಕಾಮರ್ಸ್ ಏಕೆ ಆರಿಸಿಕೊಂಡೆ ಎಂಬುದರ ಸಮರ್ಥನೆ ನೀಡುತ್ತೇನೆ.",
    "textKnEn": "Nanu commerce eke choose madide anno explanation review madi tips kodi.",
    "tags": [
      "response-critique"
    ]
  },
  {
    "id": "sug_22_practise_264",
    "sessionId": 22,
    "category": "practise",
    "text": "Simulate a 2-minute mock viva opening: \"Walk me through your professional background and core strengths.\"",
    "textKn": "2 ನಿಮಿಷಗಳ ಅಣಕು ವೈವಾ ಆರಂಭ: \"ನಿಮ್ಮ ವೃತ್ತಿಪರ ಹಿನ್ನೆಲೆ ಮತ್ತು ಪ್ರಮುಖ ಸಾಮರ್ಥ್ಯಗಳನ್ನು ಪರಿಚಯಿಸಿ.\"",
    "textKnEn": "Mock viva opening: \"Walk me through your background and strengths\" simulate madi.",
    "tags": [
      "mock-viva"
    ]
  },
  {
    "id": "sug_23_understand_265",
    "sessionId": 23,
    "category": "understand",
    "text": "What is the optimal structure for a 7-minute executive capstone presentation?",
    "textKn": "7 ನಿಮಿಷಗಳ ಕಾರ್ಯನಿರ್ವಾಹಕ ಕ್ಯಾಪ್‌ಸ್ಟೋನ್ ಪ್ರಸ್ತುತಿಗೆ ಸೂಕ್ತವಾದ ವಿನ್ಯಾಸ ಯಾವುದು?",
    "textKnEn": "7-minute executive capstone presentation optimal structure enu?",
    "tags": [
      "presentation",
      "executive-pitch"
    ]
  },
  {
    "id": "sug_23_understand_266",
    "sessionId": 23,
    "category": "understand",
    "text": "How does the \"Headline + Proof Point + Recommendation\" slide standard eliminate clutter?",
    "textKn": "\"ಮುಖ್ಯಾಂಶ + ಪುರಾವೆ + ಶಿಫಾರಸು\" ಸ್ಲೈಡ್ ನಿಯಮವು ಗೊಂದಲವನ್ನು ಹೇಗೆ ನಿವಾರಿಸುತ್ತದೆ?",
    "textKnEn": "Headline Proof Recommendation slide rule clutter hege eliminate madatte?",
    "tags": [
      "slide-design"
    ]
  },
  {
    "id": "sug_23_understand_267",
    "sessionId": 23,
    "category": "understand",
    "text": "Why should a live spreadsheet demonstration be timeboxed to exactly 3 minutes?",
    "textKn": "ಲೈವ್ ಎಕ್ಸೆಲ್ ಮಾದರಿಯ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಯನ್ನು ನಿಖರವಾಗಿ 3 ನಿಮಿಷಗಳಿಗೆ ಏಕೆ ಸೀಮಿತಗೊಳಿಸಬೇಕು?",
    "textKnEn": "Live spreadsheet demonstration 3 minutes ge eke timebox madbeku?",
    "tags": [
      "live-demo"
    ]
  },
  {
    "id": "sug_23_solve_268",
    "sessionId": 23,
    "category": "solve",
    "text": "How do I structure a live financial model demonstration showing Input -> Control -> Output -> Sensitivity?",
    "textKn": "ಇನ್‌ಪುಟ್ -> ಕಂಟ್ರೋಲ್ -> ಔಟ್‌ಪುಟ್ -> ಸಂವೇದನೆ ತೋರಿಸುವ ಹಣಕಾಸು ಮಾದರಿಯ ಲೈವ್ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಯನ್ನು ಹೇಗೆ ರಚಿಸುವುದು?",
    "textKnEn": "Financial model demo Input Control Output Sensitivity hege walk through madodu?",
    "tags": [
      "model-walkthrough"
    ]
  },
  {
    "id": "sug_23_solve_269",
    "sessionId": 23,
    "category": "solve",
    "text": "Show me how to anticipate and prepare backup slides for the 5 toughest jury questions.",
    "textKn": "ತೀರ್ಪುಗಾರರ 5 ಕಠಿಣ ಪ್ರಶ್ನೆಗಳನ್ನು ನಿರೀಕ್ಷಿಸಿ ಬ್ಯಾಕಪ್ ಸ್ಲೈಡ್‌ಗಳನ್ನು ಹೇಗೆ ಸಿದ್ಧಪಡಿಸುವುದು?",
    "textKnEn": "Toughest jury questions anticipate madi backup slides hege build madodu?",
    "tags": [
      "backup-slides"
    ]
  },
  {
    "id": "sug_23_solve_270",
    "sessionId": 23,
    "category": "solve",
    "text": "How do I present complex variance data to non-finance senior executives without losing their attention?",
    "textKn": "ಹಣಕಾಸೇತರ ಹಿರಿಯ ಅಧಿಕಾರಿಗಳಿಗೆ ಸಂಕೀರ್ಣ ವ್ಯತ್ಯಾಸ ಡೇಟಾವನ್ನು ಆಕರ್ಷಕವಾಗಿ ಹೇಗೆ ಪ್ರಸ್ತುತಪಡಿಸುವುದು?",
    "textKnEn": "Non-finance executives ge complex numbers hege simply present madodu?",
    "tags": [
      "executive-storytelling"
    ]
  },
  {
    "id": "sug_23_apply_271",
    "sessionId": 23,
    "category": "apply",
    "text": "In Titan executive committee reviews, how do business heads defend capital investment proposals?",
    "textKn": "ಟೈಟಾನ್ ಕಾರ್ಯಕಾರಿ ಸಮಿತಿಯ ಸಭೆಗಳಲ್ಲಿ ಬಂಡವಾಳ ಹೂಡಿಕೆ ಪ್ರಸ್ತಾಪಗಳನ್ನು ವ್ಯವಸ್ಥಾಪಕರು ಹೇಗೆ ಸಮರ್ಥಿಸಿಕೊಳ್ಳುತ್ತಾರೆ?",
    "textKnEn": "Titan executive committee reviews alli capital proposals hege defend madtare?",
    "tags": [
      "titan",
      "board-defense"
    ]
  },
  {
    "id": "sug_23_apply_272",
    "sessionId": 23,
    "category": "apply",
    "text": "What should a presenter do if their live spreadsheet crashes or formulas show #REF! during a live pitch?",
    "textKn": "ಲೈವ್ ಪ್ರಸ್ತುತಿಯ ಸಮಯದಲ್ಲಿ ಎಕ್ಸೆಲ್ ಕ್ರಾಶ್ ಆದರೆ ಅಥವಾ #REF! ದೋಷ ತೋರಿಸಿದರೆ ಪ್ರೆಸೆಂಟರ್ ಏನು ಮಾಡಬೇಕು?",
    "textKnEn": "Live demo time alli spreadsheet crash adre hege handle madodu?",
    "tags": [
      "contingency-handling"
    ]
  },
  {
    "id": "sug_23_apply_273",
    "sessionId": 23,
    "category": "apply",
    "text": "How does confident body language and voice modulation change audience perception of financial data?",
    "textKn": "ಆತ್ಮವಿಶ್ವಾಸದ ದೈಹಿಕ ಭಾಷೆ ಮತ್ತು ಧ್ವನಿ ಏರಿಳಿತವು ಹಣಕಾಸು ಡೇಟಾದ ಪ್ರಭಾವವನ್ನು ಹೇಗೆ ಹೆಚ್ಚಿಸುತ್ತದೆ?",
    "textKnEn": "Body language mattu voice modulation financial presentation ge eke vital?",
    "tags": [
      "presentation-delivery"
    ]
  },
  {
    "id": "sug_23_practise_274",
    "sessionId": 23,
    "category": "practise",
    "text": "Test me: Give a 60-second opening hook for a presentation on working capital optimization.",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಕಾರ್ಯಕಾರಿ ಬಂಡವಾಳ ಸುಧಾರಣೆಯ ಕುರಿತ ಪ್ರಸ್ತುತಿಗೆ 60 ಸೆಕೆಂಡ್‌ಗಳ ಆಕರ್ಷಕ ಆರಂಭವನ್ನು ನೀಡಿ.",
    "textKnEn": "Working capital optimization presentation ge 60-second opening pitch kodi.",
    "tags": [
      "opening-pitch"
    ]
  },
  {
    "id": "sug_23_practise_275",
    "sessionId": 23,
    "category": "practise",
    "text": "Challenge me with 2 tough jury questions challenging my project assumptions.",
    "textKn": "ನನ್ನ ಯೋಜನೆಯ ಊಹೆಗಳನ್ನು ಪ್ರಶ್ನಿಸುವ 2 ಕಠಿಣ ತೀರ್ಪುಗಾರರ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ನನ್ನನ್ನು ಪರೀಕ್ಷಿಸಿ.",
    "textKnEn": "Jury tough questions simulate madi defend madoke challenge kodi.",
    "tags": [
      "jury-grilling"
    ]
  },
  {
    "id": "sug_23_practise_276",
    "sessionId": 23,
    "category": "practise",
    "text": "Critique this slide layout: 4 tables, 2 charts, and 8 bullet points on a single slide.",
    "textKn": "ಈ ಸ್ಲೈಡ್ ವಿಮರ್ಶಿಸಿ: ಒಂದೇ ಸ್ಲೈಡ್‌ನಲ್ಲಿ 4 ಕೋಷ್ಟಕಗಳು, 2 ಚಾರ್ಟ್‌ಗಳು ಮತ್ತು 8 ಬುಲೆಟ್ ಪಾಯಿಂಟ್‌ಗಳಿವೆ.",
    "textKnEn": "Too much info on single slide critique madi executive layout suggest madi.",
    "tags": [
      "slide-critique"
    ]
  },
  {
    "id": "sug_24_understand_277",
    "sessionId": 24,
    "category": "understand",
    "text": "What is the VCEP Official Industry Passport and what does it prove to corporate recruiters?",
    "textKn": "ವಿಸಿಇಪಿ ಅಧಿಕೃತ ಇಂಡಸ್ಟ್ರಿ ಪಾಸ್‌ಪೋರ್ಟ್ ಎಂದರೇನು ಮತ್ತು ಅದು ಕಾರ್ಪೊರೇಟ್ ನೇಮಕಾತಿದಾರರಿಗೆ ಏನನ್ನು ದೃಢೀಕರಿಸುತ್ತದೆ?",
    "textKnEn": "VCEP Official Industry Passport andrene mattu recruiters ge en prove madatte?",
    "tags": [
      "industry-passport",
      "credentials"
    ]
  },
  {
    "id": "sug_24_understand_278",
    "sessionId": 24,
    "category": "understand",
    "text": "How does verified competency evidence differ from self-reported skills on a resume?",
    "textKn": "ಪರಿಶೀಲಿಸಿದ ಸಾಮರ್ಥ್ಯದ ಪುರಾವೆಯು ರೆಸ್ಯೂಮ್‌ನಲ್ಲಿ ನಾವೇ ಬರೆಯುವ ಸಾಮಾನ್ಯ ಕೌಶಲ್ಯಗಳಿಗಿಂತ ಹೇಗೆ ಭಿನ್ನವಾಗಿದೆ?",
    "textKnEn": "Verified competency evidence self-reported skills ginta hege superior?",
    "tags": [
      "competency-evidence"
    ]
  },
  {
    "id": "sug_24_understand_279",
    "sessionId": 24,
    "category": "understand",
    "text": "What are the 3 critical priorities for a commerce graduate during their First 90 Days in a corporate role?",
    "textKn": "ಕಾರ್ಪೊರೇಟ್ ಕೆಲಸಕ್ಕೆ ಸೇರಿದ ಮೊದಲ 90 ದಿನಗಳಲ್ಲಿ ಕಾಮರ್ಸ್ ಪದವೀಧರರ 3 ಪ್ರಮುಖ ಆದ್ಯತೆಗಳು ಯಾವುವು?",
    "textKnEn": "Corporate role First 90 Days alli 3 critical priorities yavudu?",
    "tags": [
      "first-90-days"
    ]
  },
  {
    "id": "sug_24_solve_280",
    "sessionId": 24,
    "category": "solve",
    "text": "How do I articulate my 24-session VCEP experience to a hiring manager in under 2 minutes?",
    "textKn": "ನೇಮಕಾತಿ ವ್ಯವಸ್ಥಾಪಕರಿಗೆ ನನ್ನ 24-ಅಧಿವೇಶನಗಳ ವಿಸಿಇಪಿ ಅನುಭವವನ್ನು 2 ನಿಮಿಷಗಳಲ್ಲಿ ಹೇಗೆ ಪರಿಣಾಮಕಾರಿಯಾಗಿ ವಿವರಿಸುವುದು?",
    "textKnEn": "Hiring manager ge 24-session VCEP journey 2 minutes alli hege pitch madodu?",
    "tags": [
      "program-pitch"
    ]
  },
  {
    "id": "sug_24_solve_281",
    "sessionId": 24,
    "category": "solve",
    "text": "Show me how to map my VCEP verified badges to the specific job description requirements of a Financial Analyst.",
    "textKn": "ಹಣಕಾಸು ವಿಶ್ಲೇಷಕರ ಹುದ್ದೆಯ ವಿವರಣೆಗೆ ನನ್ನ ವಿಸಿಇಪಿ ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ಹೇಗೆ ಜೋಡಿಸುವುದು?",
    "textKnEn": "Financial Analyst job description ge VCEP badges hege map madodu?",
    "tags": [
      "badge-mapping"
    ]
  },
  {
    "id": "sug_24_solve_282",
    "sessionId": 24,
    "category": "solve",
    "text": "How do I craft a professional transition plan from student mindset to executive workplace discipline?",
    "textKn": "ವಿದ್ಯಾರ್ಥಿ ಮನಸ್ಥಿತಿಯಿಂದ ವೃತ್ತಿಪರ ಕಾರ್ಪೊರೇಟ್ ಶಿಸ್ತಿಗೆ ಪರಿವರ್ತನೆಯಾಗಲು ಯೋಜನೆಯನ್ನು ಹೇಗೆ ರೂಪಿಸುವುದು?",
    "textKnEn": "Student mindset inda corporate professional transition plan hege create madodu?",
    "tags": [
      "mindset-transition"
    ]
  },
  {
    "id": "sug_24_apply_283",
    "sessionId": 24,
    "category": "apply",
    "text": "In corporate finance departments at Titan, how are entry-level associates inducted and onboarded?",
    "textKn": "ಟೈಟಾನ್‌ನ ಹಣಕಾಸು ವಿಭಾಗಗಳಲ್ಲಿ ಹೊಸ ಉದ್ಯೋಗಿಗಳಿಗೆ ತರಬೇತಿ ಮತ್ತು ಜವಾಬ್ದಾರಿ ಹಸ್ತಾಂತರ ಹೇಗೆ ನಡೆಯುತ್ತದೆ?",
    "textKnEn": "Titan corporate finance entry level onboarding hege iratte?",
    "tags": [
      "titan",
      "onboarding"
    ]
  },
  {
    "id": "sug_24_apply_284",
    "sessionId": 24,
    "category": "apply",
    "text": "What professional networks and continuous learning habits accelerate promotion from Associate to Senior Analyst?",
    "textKn": "ಅಸೋಸಿಯೇಟ್‌ನಿಂದ ಸೀನಿಯರ್ ವಿಶ್ಲೇಷಕರಾಗಿ ಬಡ್ತಿ ಪಡೆಯಲು ಯಾವ ವೃತ್ತಿಪರ ಜಾಲ ಮತ್ತು ಕಲಿಯುವ ಅಭ್ಯಾಸಗಳು ಸಹಕಾರಿ?",
    "textKnEn": "Associate inda Senior Analyst promotion ge yav learning habits beku?",
    "tags": [
      "career-acceleration"
    ]
  },
  {
    "id": "sug_24_apply_285",
    "sessionId": 24,
    "category": "apply",
    "text": "How does a corporate professional maintain highest ethical standards when pressured by aggressive quarterly targets?",
    "textKn": "ತ್ರೈಮಾಸಿಕ ಗುರಿಗಳ ಒತ್ತಡವಿದ್ದರೂ ಕಾರ್ಪೊರೇಟ್ ಉದ್ಯೋಗಿ ಉನ್ನತ ನೈತಿಕ ಮಾನದಂಡಗಳನ್ನು ಹೇಗೆ ಕಾಯ್ದುಕೊಳ್ಳಬೇಕು?",
    "textKnEn": "Quarterly targets pressure idaga ethical standards hege maintain madbeku?",
    "tags": [
      "corporate-ethics"
    ]
  },
  {
    "id": "sug_24_practise_286",
    "sessionId": 24,
    "category": "practise",
    "text": "Test me: Pitch your VCEP Industry Passport to a Head of Finance in 90 seconds.",
    "textKn": "ಪರೀಕ್ಷಿಸಿ: ಹಣಕಾಸು ಮುಖ್ಯಸ್ಥರಿಗೆ ನಿಮ್ಮ ವಿಸಿಇಪಿ ಇಂಡಸ್ಟ್ರಿ ಪಾಸ್‌ಪೋರ್ಟ್ ಅನ್ನು 90 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಪರಿಚಯಿಸಿ.",
    "textKnEn": "90-second Industry Passport pitch to Head of Finance simulate madi.",
    "tags": [
      "passport-pitch"
    ]
  },
  {
    "id": "sug_24_practise_287",
    "sessionId": 24,
    "category": "practise",
    "text": "What would you do on Day 1, Day 30, and Day 60 as a new corporate finance intern? Walk me through.",
    "textKn": "ಹೊಸ ಹಣಕಾಸು ಇಂಟರ್ನ್ ಆಗಿ 1ನೇ ದಿನ, 30ನೇ ದಿನ ಮತ್ತು 60ನೇ ದಿನ ನೀವು ಏನು ಮಾಡುತ್ತೀರಿ? ವಿವರಿಸಿ.",
    "textKnEn": "Day 1, Day 30, Day 60 plan for finance intern walk me through.",
    "tags": [
      "90-day-plan-quiz"
    ]
  },
  {
    "id": "sug_24_practise_288",
    "sessionId": 24,
    "category": "practise",
    "text": "Final reflection: What is the single most transformative professional habit you developed in VCEP?",
    "textKn": "ಅಂತಿಮ ಅವಲೋಕನ: ವಿಸಿಇಪಿಯಲ್ಲಿ ನೀವು ಬೆಳೆಸಿಕೊಂಡ ಏಕೈಕ ಅತ್ಯುತ್ತಮ ವೃತ್ತಿಪರ ಅಭ್ಯಾಸ ಯಾವುದು?",
    "textKnEn": "VCEP nalli neevu kalita single most valuable professional habit enu?",
    "tags": [
      "final-reflection"
    ]
  },
  {
    "id": "sug_gen_understand_289",
    "category": "understand",
    "text": "What is the difference between Revenue, Gross Profit, and Net Profit?",
    "textKn": "ಆದಾಯ, ಒಟ್ಟು ಲಾಭ ಮತ್ತು ನಿವ್ವಳ ಲಾಭದ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?",
    "textKnEn": "Revenue, Gross profit mattu Net profit difference enu?",
    "tags": [
      "general",
      "profit"
    ]
  },
  {
    "id": "sug_gen_understand_290",
    "category": "understand",
    "text": "Explain Working Capital and why running out of cash destroys profitable businesses.",
    "textKn": "ಕಾರ್ಯಕಾರಿ ಬಂಡವಾಳವನ್ನು ವಿವರಿಸಿ ಮತ್ತು ನಗದು ಖಾಲಿಯಾಗುವುದು ಲಾಭದಾಯಕ ವ್ಯವಹಾರವನ್ನು ಹೇಗೆ ನಾಶಪಡಿಸುತ್ತದೆ?",
    "textKnEn": "Working capital andrene mattu cash illadiddare business eke close agatte?",
    "tags": [
      "general",
      "working-capital"
    ]
  },
  {
    "id": "sug_gen_understand_291",
    "category": "understand",
    "text": "What is EBITDA and why is it used as a primary business valuation metric?",
    "textKn": "EBITDA ಎಂದರೇನು ಮತ್ತು ವ್ಯವಹಾರ ಮೌಲ್ಯಮಾಪನಕ್ಕೆ ಇದನ್ನು ಏಕೆ ಮುಖ್ಯವಾಗಿ ಬಳಸಲಾಗುತ್ತದೆ?",
    "textKnEn": "EBITDA andrene valuation ge eke use madtare?",
    "tags": [
      "general",
      "ebitda"
    ]
  },
  {
    "id": "sug_gen_solve_292",
    "category": "solve",
    "text": "How do I calculate working capital from a company Balance Sheet?",
    "textKn": "ಕಂಪನಿಯ ಬ್ಯಾಲೆನ್ಸ್ ಶೀಟ್‌ನಿಂದ ಕಾರ್ಯಕಾರಿ ಬಂಡವಾಳವನ್ನು ಹೇಗೆ ಲೆಕ್ಕ ಹಾಕುವುದು?",
    "textKnEn": "Balance sheet inda working capital hege calculate madodu?",
    "tags": [
      "general",
      "working-capital-formula"
    ]
  },
  {
    "id": "sug_gen_solve_293",
    "category": "solve",
    "text": "Show me how to structure an executive email escalating an urgent project blocker.",
    "textKn": "ಯೋಜನೆಯ ತುರ್ತು ಅಡೆತಡೆಯನ್ನು ಮೇಲಧಿಕಾರಿಗಳಿಗೆ ತಿಳಿಸುವ ಕಾರ್ಪೊರೇಟ್ ಇಮೇಲ್ ರಚಿಸುವ ವಿಧಾನವನ್ನು ತೋರಿಸಿ.",
    "textKnEn": "Project blocker escalate mado executive email structure torsi.",
    "tags": [
      "general",
      "email"
    ]
  },
  {
    "id": "sug_gen_solve_294",
    "category": "solve",
    "text": "How do I identify and reconcile bank timing differences in a cash book?",
    "textKn": "ಕ್ಯಾಶ್ ಬುಕ್‌ನಲ್ಲಿ ಬ್ಯಾಂಕ್ ಸಮಯದ ವ್ಯತ್ಯಾಸಗಳನ್ನು ಹೇಗೆ ಗುರುತಿಸುವುದು ಮತ್ತು ಸಮನ್ವಯಗೊಳಿಸುವುದು?",
    "textKnEn": "Cash book bank timing differences hege reconcile madodu?",
    "tags": [
      "general",
      "reconciliation"
    ]
  },
  {
    "id": "sug_gen_apply_295",
    "category": "apply",
    "text": "What core habits differentiate an undergraduate student from an enterprise professional?",
    "textKn": "ಪದವಿ ವಿದ್ಯಾರ್ಥಿ ಮತ್ತು ಕಾರ್ಪೊರೇಟ್ ವೃತ್ತಿಪರರ ನಡುವಿನ ವ್ಯತ್ಯಾಸವನ್ನು ನಿರ್ಧರಿಸುವ ಪ್ರಮುಖ ಅಭ್ಯಾಸಗಳು ಯಾವುವು?",
    "textKnEn": "Student mindset inda corporate professional habits hege change agatte?",
    "tags": [
      "general",
      "professionalism"
    ]
  },
  {
    "id": "sug_gen_apply_296",
    "category": "apply",
    "text": "How do Indian businesses manage working capital during festive demand surges?",
    "textKn": "ಭಾರತೀಯ ವ್ಯಾಪಾರಗಳು ಹಬ್ಬದ ಋತುವಿನಲ್ಲಿ ಕಾರ್ಯಕಾರಿ ಬಂಡವಾಳವನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸುತ್ತವೆ?",
    "textKnEn": "Festive season demand alli Indian companies working capital hege manage madtare?",
    "tags": [
      "general",
      "festive-working-capital"
    ]
  },
  {
    "id": "sug_gen_apply_297",
    "category": "apply",
    "text": "How does a junior commerce associate prepare for their first weekly executive review?",
    "textKn": "ಕಿರಿಯ ಕಾಮರ್ಸ್ ಉದ್ಯೋಗಿ ತಮ್ಮ ಮೊದಲ ಸಾಪ್ತಾಹಿಕ ಪ್ರಗತಿ ಪರಿಶೀಲನಾ ಸಭೆಗೆ ಹೇಗೆ ಸಿದ್ಧರಾಗಬೇಕು?",
    "textKnEn": "Junior commerce associate first weekly review ge hege prepare agbeku?",
    "tags": [
      "general",
      "review-prep"
    ]
  },
  {
    "id": "sug_gen_practise_298",
    "category": "practise",
    "text": "Help me prepare a concise, high-impact 60-second self-introduction for an interview.",
    "textKn": "ಸಂದರ್ಶನಕ್ಕಾಗಿ ಪ್ರಭಾವಶಾಲಿ 60 ಸೆಕೆಂಡ್‌ಗಳ ಸ್ವಯಂ ಪರಿಚಯವನ್ನು ಸಿದ್ಧಪಡಿಸಲು ನನಗೆ ಸಹಾಯ ಮಾಡಿ.",
    "textKnEn": "Interview ge 60-second high impact self introduction prepare madoke help madi.",
    "tags": [
      "general",
      "self-intro"
    ]
  },
  {
    "id": "sug_gen_practise_299",
    "category": "practise",
    "text": "Test me on calculating Gross Margin and Net Margin from a short income statement.",
    "textKn": "ಸಣ್ಣ ಆದಾಯ ಪಟ್ಟಿಯಿಂದ ಗ್ರಾಸ್ ಮಾರ್ಜಿನ್ ಮತ್ತು ನೆಟ್ ಮಾರ್ಜಿನ್ ಲೆಕ್ಕಹಾಕುವ ಪರೀಕ್ಷೆ ನೀಡಿ.",
    "textKnEn": "Income statement inda GM% mattu NM% calculate mado test kodi.",
    "tags": [
      "general",
      "margin-quiz"
    ]
  },
  {
    "id": "sug_gen_practise_300",
    "category": "practise",
    "text": "Simulate a scenario: A client questions an invoice variance. How should I respond professionally?",
    "textKn": "ಸನ್ನಿವೇಶ ಅಭ್ಯಾಸ: ಕ್ಲೈಂಟ್ ಇನ್‌ವಾಯ್ಸ್ ವ್ಯತ್ಯಾಸವನ್ನು ಪ್ರಶ್ನಿಸಿದ್ದಾರೆ. ವೃತ್ತಿಪರವಾಗಿ ಹೇಗೆ ಉತ್ತರಿಸಬೇಕು?",
    "textKnEn": "Client invoice variance question kelidaga professional reply simulate madi.",
    "tags": [
      "general",
      "client-scenario"
    ]
  }
];
