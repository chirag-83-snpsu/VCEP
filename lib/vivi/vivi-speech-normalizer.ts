/**
 * Educational Text Normalizer for Vivi AI Learning Partner
 * Prepares pedagogical content for natural, professional female text-to-speech.
 * Transforms raw markdown, Indian currency numerals, accounting formulas, and acronyms
 * into clean, conversational spoken sentences with appropriate pedagogical pauses.
 */

export function normalizeEducationalSpeech(rawText: string, language: string = 'en'): string {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText.trim();

  // If Kannada language, preserve Kannada Unicode characters while normalizing standard currency
  if (language === 'kn') {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
      .replace(/#+\s*/g, '')
      .replace(/^\s*[-*•]\s+/gm, '. ')
      .replace(/\|/g, ' ')
      .replace(/₹\s*([0-9,]+(?:\.[0-9]+)?)\s*(?:ಕೋಟಿ|Cr|Crore)/gi, '$1 ಕೋಟಿ ರೂಪಾಯಿಗಳು')
      .replace(/₹\s*([0-9,]+(?:\.[0-9]+)?)\s*(?:ಲಕ್ಷ|L|Lakh|Lakhs)/gi, '$1 ಲಕ್ಷ ರೂಪಾಯಿಗಳು')
      .replace(/₹\s*([0-9,]+(?:\.[0-9]+)?)/g, '$1 ರೂಪಾಯಿಗಳು ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 1. Remove markdown code blocks and blockquotes
  text = text.replace(/```[\s\S]*?```/g, ' [Code sample omitted] ');
  text = text.replace(/^>\s*/gm, '');

  // Multi-paragraph natural pauses
  text = text.replace(/\n\s*\n+/g, ' ... ');

  // 2. Normalize bold, italics, links, inline code, and headers
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  text = text.replace(/\*(.*?)\*/g, '$1');
  text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
  text = text.replace(/`([^`]+)`/g, '$1');
  text = text.replace(/#([0-9]+)/g, 'Number $1');
  text = text.replace(/#+\s*/g, '');

  // 3. Indian Currency Normalization:
  // e.g. ₹10 Crore -> 10 crore rupees, ₹15 Lakhs -> 15 lakh rupees, ₹25,000 -> 25000 rupees
  text = text.replace(/₹\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)\s*(?:Crore|crore|Cr(?![\.]))\b/g, '$1 crore rupees');
  text = text.replace(/₹\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)\s*(?:Lakhs|lakhs|Lakh|lakh|L|l)\b/g, '$1 lakh rupees');
  text = text.replace(/INR\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)\s*(?:Crore|crore|Cr(?![\.]))\b/gi, '$1 crore rupees');
  text = text.replace(/INR\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)\s*(?:Lakhs|lakhs|Lakh|lakh|L|l)\b/gi, '$1 lakh rupees');
  text = text.replace(/INR\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)/gi, '$1 rupees');

  // Replace standalone ₹ symbol with clean numerals + "rupees"
  text = text.replace(/₹\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)/g, (_, num) => {
    const cleanNum = num.replace(/,/g, '');
    return `${cleanNum} rupees`;
  });
  text = text.replace(/₹/g, 'rupees ');

  // 4. Accounting Ledger notation: Dr. -> Debit, Cr. -> Credit, A/c -> Account
  text = text.replace(/\bDr\.?\s*/g, 'Debit ');
  text = text.replace(/\bCr\.?\s*/g, 'Credit ');
  text = text.replace(/\bA\/c\b/gi, 'Account');

  // 5. Accounting & Commerce Acronyms Pronunciation Guide
  text = text.replace(/\bCOGS\b/g, 'cogs');
  text = text.replace(/\bP&L\b/gi, 'P and L');
  text = text.replace(/\bEBITDA\b/g, 'E-bit-da');
  text = text.replace(/\bCAGR\b/g, 'cag-er');
  text = text.replace(/\bBRS\b/g, 'B-R-S');
  text = text.replace(/\bMIS\b/g, 'M-I-S');
  text = text.replace(/\bGST\b/g, 'G-S-T');
  text = text.replace(/\bGSTR-2B\b/gi, 'G-S-T-R 2-B');
  text = text.replace(/\bITC\b/g, 'I-T-C');
  text = text.replace(/\bDSO\b/g, 'Days Sales Outstanding');
  text = text.replace(/\bMVP\b/g, 'M-V-P');
  text = text.replace(/\bROI\b/g, 'R-O-I');
  text = text.replace(/\bF&O\b/gi, 'Futures and Options');
  text = text.replace(/\bAUM\b/g, 'Assets Under Management');

  // 6. Mathematical & Formula Normalization
  text = text.replace(
    /([A-Za-z0-9\s]+)\s*=\s*([A-Za-z0-9\s]+)\s*-\s*([A-Za-z0-9\s]+)/g,
    (_, left, right1, right2) => `${left.trim()} equals ${right1.trim()} minus ${right2.trim()}`
  );
  text = text.replace(
    /([A-Za-z0-9\s]+)\s*=\s*([A-Za-z0-9\s]+)\s*\+\s*([A-Za-z0-9\s]+)/g,
    (_, left, right1, right2) => `${left.trim()} equals ${right1.trim()} plus ${right2.trim()}`
  );
  text = text.replace(
    /([A-Za-z0-9\s]+)\s*=\s*([A-Za-z0-9\s]+)\s*\/\s*([A-Za-z0-9\s]+)/g,
    (_, left, right1, right2) => `${left.trim()} equals ${right1.trim()} divided by ${right2.trim()}`
  );
  text = text.replace(/\s*×\s*/g, ' multiplied by ');
  text = text.replace(/\s*÷\s*/g, ' divided by ');

  // 7. List and table cleanup for natural pauses
  text = text.replace(/^\s*[-*•]\s+/gm, '. ');
  text = text.replace(/^\s*[0-9]+\.\s+/gm, (m) => `. Step ${m.trim()} `);
  text = text.replace(/\|/g, ' ');
  text = text.replace(/---/g, '');

  // 8. Clean excessive punctuation and whitespace while preserving intentional ellipses
  text = text.replace(/(?<!\.)\.\s*\.(?!\.)/g, '.');
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}
