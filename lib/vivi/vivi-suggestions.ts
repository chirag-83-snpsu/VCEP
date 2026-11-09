import {
  SMART_SUGGESTIONS,
  SmartSuggestionItem,
  SuggestionCategory,
} from '@/components/vivi/smart-suggestions-data';
import { ViviMode, ViviLanguage } from '@/components/vivi/vivi-types';

export { SMART_SUGGESTIONS };
export type { SmartSuggestionItem, SuggestionCategory };

export interface GetSuggestionsParams {
  sessionId?: number;
  stage?: number | string;
  mode?: ViviMode;
  language?: ViviLanguage;
  limitPrimary?: number;
}

export interface CategorizedSuggestions {
  understand: SmartSuggestionItem[];
  solve: SmartSuggestionItem[];
  apply: SmartSuggestionItem[];
  practise: SmartSuggestionItem[];
}

export interface SmartSuggestionsResult {
  primary: SmartSuggestionItem[];
  categorized: CategorizedSuggestions;
  totalCount: number;
}

export interface QuickAction {
  id: string;
  icon: string;
  labelEn: string;
  labelKn: string;
  promptEn: string;
  promptKn: string;
}

export const CONVERSATIONAL_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'simple',
    icon: '💡',
    labelEn: 'Explain simply',
    labelKn: 'ಸರಳವಾಗಿ ವಿವರಿಸಿ',
    promptEn: 'Could you explain that more simply, using everyday analogies without complex jargon?',
    promptKn: 'ಇದನ್ನು ಯಾವುದೇ ಕಠಿಣ ಪದಗಳಿಲ್ಲದೆ, ದೈನಂದಿನ ಉದಾಹರಣೆಯೊಂದಿಗೆ ಇನ್ನಷ್ಟು ಸರಳವಾಗಿ ವಿವರಿಸಬಹುದೇ?',
  },
  {
    id: 'example',
    icon: '🏢',
    labelEn: 'Real example',
    labelKn: 'ನೈಜ ಉದಾಹರಣೆ',
    promptEn: 'Can you show me a concrete corporate example from an Indian business for this?',
    promptKn: 'ಇದಕ್ಕೆ ಭಾರತೀಯ ಕಂಪನಿಯಿಂದ ಒಂದು ಕಾಂಕ್ರೀಟ್ ನೈಜ ವ್ಯಾಪಾರ ಉದಾಹರಣೆಯನ್ನು ತೋರಿಸಬಹುದೇ?',
  },
  {
    id: 'steps',
    icon: '🔢',
    labelEn: 'Step-by-step',
    labelKn: 'ಹಂತ-ಹಂತವಾಗಿ',
    promptEn: 'Walk me through this step-by-step with clear numbers or stages.',
    promptKn: 'ಇದನ್ನು ಸ್ಪಷ್ಟ ಸಂಖ್ಯೆಗಳು ಅಥವಾ ಹಂತಗಳೊಂದಿಗೆ ಹಂತ-ಹಂತವಾಗಿ ವಿವರಿಸಿ.',
  },
  {
    id: 'alternative',
    icon: '🔀',
    labelEn: 'Another approach',
    labelKn: 'ಇನ್ನೊಂದು ವಿಧಾನ',
    promptEn: 'Is there an alternative method or another approach to solve or interpret this?',
    promptKn: 'ಇದನ್ನು ಪರಿಹರಿಸಲು ಅಥವಾ ವಿಶ್ಲೇಷಿಸಲು ಇನ್ನೊಂದು ಪರ್ಯಾಯ ವಿಧಾನವಿದೆಯೇ?',
  },
  {
    id: 'quiz',
    icon: '🎯',
    labelEn: 'Quiz me',
    labelKn: 'ನನ್ನನ್ನು ಪರೀಕ್ಷಿಸಿ',
    promptEn: 'Test my understanding with a quick 1-question practical scenario quiz on this.',
    promptKn: 'ಇದರ ಮೇಲೆ ಒಂದು ಸಣ್ಣ ಪ್ರಾಯೋಗಿಕ ಪ್ರಶ್ನೆ ಕೇಳಿ ನನ್ನ ತಿಳುವಳಿಕೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ.',
  },
];

/**
 * Retrieves context-aware smart suggestions filtered by session and stage,
 * ranked by mode, with primary picks and full categorized drawer items.
 */
export function getSmartSuggestions({
  sessionId,
  stage,
  mode = 'explain',
  limitPrimary = 3,
}: GetSuggestionsParams): SmartSuggestionsResult {
  // 1. Filter suggestions by session
  let candidates: SmartSuggestionItem[];
  if (sessionId && sessionId >= 1 && sessionId <= 24) {
    candidates = SMART_SUGGESTIONS.filter((s) => s.sessionId === sessionId);
    if (candidates.length === 0) {
      candidates = SMART_SUGGESTIONS.filter((s) => s.sessionId === undefined);
    }
  } else {
    candidates = SMART_SUGGESTIONS.filter((s) => s.sessionId === undefined);
  }

  // 2. Separate into categories
  const categorized: CategorizedSuggestions = {
    understand: candidates.filter((s) => s.category === 'understand'),
    solve: candidates.filter((s) => s.category === 'solve'),
    apply: candidates.filter((s) => s.category === 'apply'),
    practise: candidates.filter((s) => s.category === 'practise'),
  };

  // 3. Stage-aware matching: if stage is provided (e.g. Session 1 startup stages 1-6)
  let stageMatched: SmartSuggestionItem[] = [];
  if (stage !== undefined && stage !== null) {
    const stageNum = Number(stage);
    if (!isNaN(stageNum) && stageNum > 0) {
      stageMatched = candidates.filter((s) => s.stage === stageNum);
    }
  }

  // 4. Rank primary picks based on user mode
  // If user is in Quiz mode -> pick from Practise first
  // If user is in Check mode -> pick from Solve first
  // If user is in Guide mode -> pick from Solve & Apply
  // Default Explain -> pick from Understand, Apply, Solve
  const primaryPicks: SmartSuggestionItem[] = [];

  // Always include stage-matched items first if available
  for (const item of stageMatched) {
    if (!primaryPicks.find((p) => p.id === item.id) && primaryPicks.length < limitPrimary) {
      primaryPicks.push(item);
    }
  }

  const preferredCategoryOrder: SuggestionCategory[] =
    mode === 'quiz'
      ? ['practise', 'apply', 'understand', 'solve']
      : mode === 'check'
      ? ['solve', 'apply', 'understand', 'practise']
      : mode === 'guide'
      ? ['solve', 'understand', 'apply', 'practise']
      : ['understand', 'solve', 'apply', 'practise'];

  for (const cat of preferredCategoryOrder) {
    const catItems = categorized[cat];
    for (const item of catItems) {
      if (primaryPicks.length >= limitPrimary) break;
      if (!primaryPicks.find((p) => p.id === item.id)) {
        primaryPicks.push(item);
      }
    }
    if (primaryPicks.length >= limitPrimary) break;
  }

  return {
    primary: primaryPicks,
    categorized,
    totalCount: candidates.length,
  };
}

export interface FollowUpItem {
  id: string;
  text: string;
  textKn: string;
}

/**
 * Deterministically derives 2-3 high-relevance follow-up questions
 * based on the assistant's previous answer and conversation context.
 */
export function getFollowUpSuggestions(
  lastAssistantMsg: string,
  userQuery: string,
  sessionId?: number,
  language: ViviLanguage = 'en'
): FollowUpItem[] {
  const combined = `${userQuery} ${lastAssistantMsg}`.toLowerCase();
  const followUps: FollowUpItem[] = [];

  // Rule 1: Cash / Liquidity / Working Capital
  if (
    combined.includes('cash') ||
    combined.includes('liquidity') ||
    combined.includes('working capital') ||
    combined.includes('ನಗದು') ||
    combined.includes('ಬಂಡವಾಳ')
  ) {
    followUps.push({
      id: 'fu_cash_1',
      text: 'How do I protect minimum cash reserves during unexpected demand surges?',
      textKn: 'ಅನಿರೀಕ್ಷಿತ ಬೇಡಿಕೆ ಹೆಚ್ಚಾದಾಗ ಕನಿಷ್ಠ ನಗದು ಮೀಸಲನ್ನು ಹೇಗೆ ರಕ್ಷಿಸುವುದು?',
    });
    followUps.push({
      id: 'fu_cash_2',
      text: 'What are the main warning signs of a business running out of cash?',
      textKn: 'ವ್ಯವಹಾರದಲ್ಲಿ ನಗದು ಖಾಲಿಯಾಗುತ್ತಿರುವ ಮುಖ್ಯ ಮುನ್ಸೂಚನೆಗಳು ಯಾವುವು?',
    });
  }

  // Rule 2: Profit / Margin / EBITDA
  if (
    combined.includes('margin') ||
    combined.includes('profit') ||
    combined.includes('ebitda') ||
    combined.includes('ಲಾಭ')
  ) {
    followUps.push({
      id: 'fu_margin_1',
      text: 'Can a company have healthy EBITDA but still fail financially?',
      textKn: 'ಉತ್ತಮ EBITDA ಇದ್ದರೂ ಕಂಪನಿ ಆರ್ಥಿಕವಾಗಿ ವಿಫಲವಾಗಲು ಸಾಧ್ಯವೇ?',
    });
    followUps.push({
      id: 'fu_margin_2',
      text: 'What is the fastest lever to improve operating margins in retail?',
      textKn: 'ಚಿಲ್ಲರೆ ವ್ಯಾಪಾರದಲ್ಲಿ ಆಪರೇಟಿಂಗ್ ಮಾರ್ಜಿನ್ ಹೆಚ್ಚಿಸಲು ಅತಿ ವೇಗದ ವಿಧಾನ ಯಾವುದು?',
    });
  }

  // Rule 3: Reconciliation / BRS / Ledger
  if (
    combined.includes('reconciliation') ||
    combined.includes('brs') ||
    combined.includes('ledger') ||
    combined.includes('ಸಮನ್ವಯ') ||
    combined.includes('ಲೆಡ್ಜರ್')
  ) {
    followUps.push({
      id: 'fu_brs_1',
      text: 'How do I investigate a persistent ₹1,000 rounding discrepancy?',
      textKn: 'ಬಗೆಹರಿಯದ ₹1,000 ರೌಂಡಿಂಗ್ ವ್ಯತ್ಯಾಸವನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸುವುದು?',
    });
    followUps.push({
      id: 'fu_brs_2',
      text: 'What documentation do auditors require for unpresented cheques past 90 days?',
      textKn: '90 ದಿನ ಮೀರಿದ ಬಿಡುಗಡೆಯಾಗದ ಚೆಕ್‌ಗಳಿಗೆ ಆಡಿಟರ್‌ಗಳು ಯಾವ ಪುರಾವೆ ಕೇಳುತ್ತಾರೆ?',
    });
  }

  // Rule 4: GST / Tax / ITC / Invoice
  if (
    combined.includes('gst') ||
    combined.includes('itc') ||
    combined.includes('tax') ||
    combined.includes('invoice') ||
    combined.includes('ಜಿಎಸ್‌ಟಿ')
  ) {
    followUps.push({
      id: 'fu_gst_1',
      text: 'What happens if a vendor’s GSTR-1 does not match our GSTR-2B?',
      textKn: 'ಮಾರಾಟಗಾರರ GSTR-1 ನಮ್ಮ GSTR-2B ಗೆ ಹೊಂದಿಕೆಯಾಗದಿದ್ದರೆ ಏನಾಗುತ್ತದೆ?',
    });
    followUps.push({
      id: 'fu_gst_2',
      text: 'When is an e-way bill mandatory alongside a tax invoice in Karnataka?',
      textKn: 'ಕರ್ನಾಟಕದಲ್ಲಿ ತೆರಿಗೆ ಇನ್‌ವಾಯ್ಸ್ ಜೊತೆಗೆ ಇ-ವೇ ಬಿಲ್ ಯಾವಾಗ ಕಡ್ಡಾಯ?',
    });
  }

  // Rule 5: Excel / Formulas / Data
  if (
    combined.includes('excel') ||
    combined.includes('formula') ||
    combined.includes('vlookup') ||
    combined.includes('xlookup') ||
    combined.includes('ಸೂತ್ರ')
  ) {
    followUps.push({
      id: 'fu_excel_1',
      text: 'How do I audit and trace precedent cells in a complex formula?',
      textKn: 'ಸಂಕೀರ್ಣ ಸೂತ್ರದಲ್ಲಿ ಕೋಶಗಳ ಮೂಲವನ್ನು (Precedent Cells) ಹೇಗೆ ಪರಿಶೀಲಿಸುವುದು?',
    });
    followUps.push({
      id: 'fu_excel_2',
      text: 'Why does XLOOKUP replace VLOOKUP in modern corporate analytics?',
      textKn: 'ಕಾರ್ಪೊರೇಟ್ ವಿಶ್ಲೇಷಣೆಯಲ್ಲಿ VLOOKUP ಗಿಂತ XLOOKUP ಏಕೆ ಹೆಚ್ಚು ಜನಪ್ರಿಯ?',
    });
  }

  // Rule 6: Interview / Resume / Capstone / Career
  if (
    combined.includes('interview') ||
    combined.includes('resume') ||
    combined.includes('portfolio') ||
    combined.includes('career') ||
    combined.includes('ಸಂದರ್ಶನ') ||
    combined.includes('ರೆಸ್ಯೂಮ್')
  ) {
    followUps.push({
      id: 'fu_career_1',
      text: 'How do I demonstrate commercial judgment during a practical viva?',
      textKn: 'ಪ್ರಾಯೋಗಿಕ ವೈವಾ ಸಂದರ್ಶನದಲ್ಲಿ ವ್ಯವಹಾರ ವಿವೇಚನೆಯನ್ನು ಹೇಗೆ ಪ್ರದರ್ಶಿಸುವುದು?',
    });
    followUps.push({
      id: 'fu_career_2',
      text: 'What is the best way to explain a calculation error without panicking?',
      textKn: 'ಗಾಬರಿಯಾಗದೆ ಲೆಕ್ಕಾಚಾರದ ತಪ್ಪನ್ನು ಸಂದರ್ಶಕರಿಗೆ ಹೇಗೆ ವಿವರಿಸಬೇಕು?',
    });
  }

  // Fallback defaults if fewer than 2 matched
  if (followUps.length < 2) {
    followUps.push({
      id: 'fu_def_1',
      text: 'How does an Indian corporate team handle this in everyday practice?',
      textKn: 'ಭಾರತೀಯ ಕಾರ್ಪೊರೇಟ್ ತಂಡವು ದೈನಂದಿನ ಕೆಲಸದಲ್ಲಿ ಇದನ್ನು ಹೇಗೆ ಅನ್ವಯಿಸುತ್ತದೆ?',
    });
    followUps.push({
      id: 'fu_def_2',
      text: 'What is the most common mistake fresh analysts make with this?',
      textKn: 'ಹೊಸ ವಿಶ್ಲೇಷಕರು ಇದರಲ್ಲಿ ಮಾಡುವ ಅತ್ಯಂತ ಸಾಮಾನ್ಯ ತಪ್ಪು ಯಾವುದು?',
    });
  }

  // Return at most 3 follow-ups
  return followUps.slice(0, 3);
}

