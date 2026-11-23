/**
 * Vivi AI Learning Partner - Backward Compatible Session Prompts
 * Re-exports from comprehensive smart suggestions catalog
 */

import { SMART_SUGGESTIONS, SmartSuggestionItem } from './smart-suggestions-data';

export * from './smart-suggestions-data';
export * from '@/lib/vivi/vivi-suggestions';

// Build legacy record for any components expecting SESSION_PROMPTS[sessionId] -> string[]
export const SESSION_PROMPTS: Record<number, string[]> = {};

for (let s = 1; s <= 24; s++) {
  const sessionItems = SMART_SUGGESTIONS.filter((it) => it.sessionId === s);
  SESSION_PROMPTS[s] = sessionItems.map((it) => it.text);
}

// Build legacy array for general prompts
export const GENERAL_PROMPTS: string[] = SMART_SUGGESTIONS.filter(
  (it) => it.sessionId === undefined
).map((it) => it.text);
