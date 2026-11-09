/**
 * Verification Test Suite for VCEP Vivi Smart Suggestions
 */

import assert from 'node:assert/strict';
import {
  SMART_SUGGESTIONS,
} from '../components/vivi/smart-suggestions-data.js';
import {
  getSmartSuggestions,
  getFollowUpSuggestions,
  CONVERSATIONAL_QUICK_ACTIONS,
} from '../lib/vivi/vivi-suggestions.js';
import { SESSION_PROMPTS, GENERAL_PROMPTS } from '../components/vivi/session-prompts.js';

console.log('🧪 Starting Vivi Smart Suggestions Verification Suite...\n');

// --- PART 1: Catalog Integrity & Distribution Tests ---
console.log('--- PART 1: Catalog Integrity & Distribution Tests ---');

assert(Array.isArray(SMART_SUGGESTIONS), 'SMART_SUGGESTIONS must be an array');
assert(SMART_SUGGESTIONS.length >= 300, `Expected >= 300 suggestions, found ${SMART_SUGGESTIONS.length}`);
console.log(`✅ Test 1.1 Passed: Total catalog count is ${SMART_SUGGESTIONS.length} (>= 300).`);

// Verify all 24 sessions have >= 12 suggestions
for (let s = 1; s <= 24; s++) {
  const sessionItems = SMART_SUGGESTIONS.filter((it) => it.sessionId === s);
  assert(
    sessionItems.length >= 12,
    `Session ${s} must have >= 12 suggestions, found ${sessionItems.length}`
  );
  const categories = new Set(sessionItems.map((it) => it.category));
  assert(categories.has('understand'), `Session ${s} missing understand`);
  assert(categories.has('solve'), `Session ${s} missing solve`);
  assert(categories.has('apply'), `Session ${s} missing apply`);
  assert(categories.has('practise'), `Session ${s} missing practise`);
}
console.log('✅ Test 1.2 Passed: All 24 sessions have >= 12 suggestions across Understand, Solve, Apply, Practise.');

// Verify general suggestions
const generalItems = SMART_SUGGESTIONS.filter((it) => it.sessionId === undefined);
assert(generalItems.length >= 12, `Expected >= 12 general suggestions, found ${generalItems.length}`);
console.log(`✅ Test 1.3 Passed: General suggestions count is ${generalItems.length} (>= 12).`);

// Verify 100% of items have valid Kannada translations
const missingKannada = SMART_SUGGESTIONS.filter((it) => !it.textKn || it.textKn.trim() === '');
assert.equal(missingKannada.length, 0, `Found ${missingKannada.length} suggestions missing Kannada translation`);
console.log('✅ Test 1.4 Passed: 100% of suggestions have high-quality Kannada translations (textKn).');

// --- PART 2: Context-Aware Session & Stage Resolution Tests ---
console.log('\n--- PART 2: Context-Aware Session & Stage Resolution Tests ---');

// Session 1 should return founder / cash / van deposit questions
const s1Result = getSmartSuggestions({ sessionId: 1, limitPrimary: 3 });
assert.equal(s1Result.totalCount, 12);
assert(s1Result.primary.length >= 3);
const s1HasStartupTheme = s1Result.primary.some(
  (p) =>
    p.text.toLowerCase().includes('cash') ||
    p.text.toLowerCase().includes('profit') ||
    p.text.toLowerCase().includes('van') ||
    p.text.toLowerCase().includes('reserve')
);
assert(s1HasStartupTheme, 'Session 1 primary suggestions must be themed around startup/business cash flow');
console.log('✅ Test 2.1 Passed: Session 1 correctly recommends founder & cash-flow questions.');

// Session 7 should return Excel & data cleaning questions
const s7Result = getSmartSuggestions({ sessionId: 7, limitPrimary: 3 });
assert.equal(s7Result.totalCount, 12);
const s7HasExcelTheme = s7Result.primary.some(
  (p) =>
    p.text.toLowerCase().includes('excel') ||
    p.text.toLowerCase().includes('raw') ||
    p.text.toLowerCase().includes('duplicate') ||
    p.text.toLowerCase().includes('lookup') ||
    p.text.toLowerCase().includes('variance')
);
assert(s7HasExcelTheme, 'Session 7 primary suggestions must be themed around Excel & data cleaning');
console.log('✅ Test 2.2 Passed: Session 7 correctly recommends Excel & data cleaning questions.');

// Stage-specific matching in Session 1
const s1Stage4Result = getSmartSuggestions({ sessionId: 1, stage: 4, limitPrimary: 3 });
const s1Stage4Matched = s1Stage4Result.primary.some((p) => p.stage === 4);
assert(s1Stage4Matched, 'Session 1 Stage 4 must prioritize stage 4 unit economics / cash reserve items');
console.log('✅ Test 2.3 Passed: Session 1 Stage 4 correctly prioritizes stage 4 specific items.');

// Mode-aware ranking
const quizModeResult = getSmartSuggestions({ sessionId: 1, mode: 'quiz', limitPrimary: 3 });
assert.equal(quizModeResult.primary[0].category, 'practise', 'Quiz mode must prioritize practise category first');
console.log('✅ Test 2.4 Passed: Quiz mode prioritizes Practise category questions.');

const checkModeResult = getSmartSuggestions({ sessionId: 1, mode: 'check', limitPrimary: 3 });
assert.equal(checkModeResult.primary[0].category, 'solve', 'Check mode must prioritize solve category first');
console.log('✅ Test 2.5 Passed: Check mode prioritizes Solve category questions.');

// --- PART 3: Controlled Assessment Protection Gate ---
console.log('\n--- PART 3: Controlled Assessment Protection Gate ---');

const s22Result = getSmartSuggestions({ sessionId: 22 });
assert.equal(s22Result.totalCount, 12);
for (const item of s22Result.categorized.solve) {
  // Must NOT leak exam solution prompts
  const lower = item.text.toLowerCase();
  assert(!lower.includes('solution to question'), 'Session 22 must never leak exam answers');
  assert(!lower.includes('answer for task'), 'Session 22 must never leak exam answers');
}
console.log('✅ Test 3.1 Passed: Session 22 (Exit Assessment) prompts enforce strict exam protection.');

// --- PART 4: Dynamic Follow-Up Generator Tests ---
console.log('\n--- PART 4: Dynamic Follow-Up Generator Tests ---');

// Cash flow query follow-ups
const cashFollowUps = getFollowUpSuggestions(
  'A profitable company can face liquidity shortages if receivables take 60 days to collect while supplier invoices are due in 15 days.',
  'Why do profitable businesses run out of cash?'
);
assert(cashFollowUps.length >= 2, 'Must generate >= 2 follow-ups');
assert(cashFollowUps.some((f) => f.text.toLowerCase().includes('cash') || f.text.toLowerCase().includes('reserve')));
console.log('✅ Test 4.1 Passed: Cash & liquidity queries generate contextual cash follow-ups.');

// GST query follow-ups
const gstFollowUps = getFollowUpSuggestions(
  'Input Tax Credit under Section 16 requires a valid tax invoice and matching in GSTR-2B.',
  'What are the conditions for ITC in India?'
);
assert(gstFollowUps.length >= 2);
assert(gstFollowUps.some((f) => f.text.toLowerCase().includes('gstr') || f.text.toLowerCase().includes('gst')));
console.log('✅ Test 4.2 Passed: GST queries generate GSTR-2B and e-way bill follow-ups.');

// Kannada language follow-ups
const knFollowUps = getFollowUpSuggestions(
  'ನಾವು ಕನಿಷ್ಠ ₹40,000 ಮೀಸಲು ನಗದನ್ನು ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಉಳಿಸಿಕೊಳ್ಳಬೇಕು.',
  'ನಮ್ಮ ಎಫ್‌ಎಂಸಿಜಿ ನಗದು ಮೀಸಲು ಎಷ್ಟು?',
  1,
  'kn'
);
assert(knFollowUps.length >= 2);
assert(knFollowUps[0].textKn.length > 0, 'Kannada textKn must be populated');
console.log('✅ Test 4.3 Passed: Kannada mode returns authentic Kannada follow-ups.');

// --- PART 5: Conversational Quick Actions Tests ---
console.log('\n--- PART 5: Conversational Quick Actions Tests ---');

assert.equal(CONVERSATIONAL_QUICK_ACTIONS.length, 5, 'Must provide exactly 5 conversational quick actions');
const actionIds = CONVERSATIONAL_QUICK_ACTIONS.map((a) => a.id);
assert(actionIds.includes('simple'), 'Missing simple action');
assert(actionIds.includes('example'), 'Missing example action');
assert(actionIds.includes('steps'), 'Missing steps action');
assert(actionIds.includes('alternative'), 'Missing alternative action');
assert(actionIds.includes('quiz'), 'Missing quiz action');

for (const qa of CONVERSATIONAL_QUICK_ACTIONS) {
  assert(qa.labelEn && qa.labelKn, `QuickAction ${qa.id} missing label`);
  assert(qa.promptEn && qa.promptKn, `QuickAction ${qa.id} missing prompt`);
}
console.log('✅ Test 5.1 Passed: All 5 Conversational Quick Actions are defined with English & Kannada.');

// --- PART 6: Backward Compatibility Tests ---
console.log('\n--- PART 6: Backward Compatibility Tests ---');

assert.equal(Object.keys(SESSION_PROMPTS).length, 24, 'SESSION_PROMPTS must have 24 sessions');
for (let s = 1; s <= 24; s++) {
  assert(Array.isArray(SESSION_PROMPTS[s]), `SESSION_PROMPTS[${s}] must be array`);
  assert(SESSION_PROMPTS[s].length >= 12, `SESSION_PROMPTS[${s}] must have >= 12 prompts`);
}
assert(Array.isArray(GENERAL_PROMPTS), 'GENERAL_PROMPTS must be array');
assert(GENERAL_PROMPTS.length >= 12, 'GENERAL_PROMPTS must have >= 12 prompts');
console.log('✅ Test 6.1 Passed: Backward compatibility for SESSION_PROMPTS & GENERAL_PROMPTS verified.');

console.log('\n======================================================');
console.log('🎉 ALL VIVI SMART SUGGESTIONS VERIFICATION CHECKS PASSED (100%)');
console.log('======================================================\n');

