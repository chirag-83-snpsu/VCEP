/**
 * Vivi AI Learning Partner - Server-Side Chat Controller & Security Gateway
 * Orchestrates session authentication, assessment security, context retrieval,
 * rate limiting, error classification, and real model streaming.
 */

import { ViviChatRequest } from './types';
import { checkControlledAssessmentGate } from './vivi-guardrails.server';
import { getAuthorizedCurriculumContext } from './vivi-context.server';
import {
  resolveProviderConfig,
  streamOpenAICompatible,
  streamCloudflareWorkersAI,
  streamLocalIntelligentTutor,
  ChatMessage,
  ViviProviderError,
} from './vivi-providers.server';

// In-memory sliding window rate limiter (keyed by user_id)
interface RateLimitBucket {
  count: number;
  resetAt: number;
  dailyCount: number;
  dailyResetAt: number;
}
const rateLimitMap = new Map<string, RateLimitBucket>();

const TEN_MINUTES_MS = 10 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MAX_PER_WINDOW = 15;
const MAX_PER_DAY = 60;

export function checkRateLimit(userId: string): { allowed: boolean; remaining: number; reason?: string } {
  const now = Date.now();
  let bucket = rateLimitMap.get(userId);

  if (!bucket) {
    bucket = {
      count: 0,
      resetAt: now + TEN_MINUTES_MS,
      dailyCount: 0,
      dailyResetAt: now + ONE_DAY_MS,
    };
    rateLimitMap.set(userId, bucket);
  }

  // Reset 10-minute window
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + TEN_MINUTES_MS;
  }

  // Reset daily window
  if (now > bucket.dailyResetAt) {
    bucket.dailyCount = 0;
    bucket.dailyResetAt = now + ONE_DAY_MS;
  }

  if (bucket.count >= MAX_PER_WINDOW) {
    const waitSec = Math.ceil((bucket.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      reason: `Rate limit reached. Please wait ${waitSec} seconds before asking your next question.`,
    };
  }

  if (bucket.dailyCount >= MAX_PER_DAY) {
    return {
      allowed: false,
      remaining: 0,
      reason: `Daily usage budget reached (${MAX_PER_DAY} questions). Usage refreshes tomorrow.`,
    };
  }

  bucket.count++;
  bucket.dailyCount++;
  return { allowed: true, remaining: MAX_PER_WINDOW - bucket.count };
}

/**
 * Builds versioned system instructions for Vivi AI Learning Partner.
 */
function buildSystemInstruction(
  mode: string,
  language: string,
  curriculumExcerpt?: string,
  sessionTitle?: string
): string {
  const langDirective =
    language === 'kn'
      ? 'Language: Kannada (ಕನ್ನಡ). Respond in natural, grammatically correct Kannada script. You may include standard commerce terms in English in parentheses where helpful.'
      : language === 'kn-en'
      ? 'Language: Kanglish (Colloquial blend of Kannada and English). Blend friendly Kannada conversational phrases with standard English business terminology.'
      : 'Language: English. Clear, natural, professional Indian English.';

  let modeDirective = '';
  switch (mode) {
    case 'guide':
      modeDirective =
        'Mode: GUIDE ME (Socratic Tutoring). Provide step-by-step guidance, hints, and guiding questions. Never provide the complete final formula, exact numerical result, or pre-written final submission text. Encourage the student to perform the calculation or reasoning themselves.';
      break;
    case 'quiz':
      modeDirective =
        "Mode: QUIZ ME. Provide 2 targeted multiple-choice or short conceptual questions to test the student's understanding of this concept. Provide the correct answer and reasoning only after they respond.";
      break;
    case 'check':
      modeDirective =
        "Mode: CHECK MY THINKING. Review the student's thought process or draft against corporate standards. Identify what is correct, point out any flaws or missing items, and suggest one improvement.";
      break;
    case 'explain':
    default:
      modeDirective =
        "Mode: EXPLAIN CONCEPT. Directly answer the student's question. Clearly define and explain the core concept, break down key distinctions, give one simple relatable real-world example (e.g. café, retail store, or startup), and keep the explanation clear and digestible.";
      break;
  }

  return `
You are "Hi, Vivi!", the official AI Learning Partner of VCEP (Vayentra Corporate Experience Program).
You are an intelligent, context-aware AI tutor supporting Indian commerce and management undergraduates (B.Com / BBA) preparing for corporate careers.

Tone: Friendly, encouraging, intelligent, direct, concise, and professional.

${langDirective}
${modeDirective}

CRITICAL INSTRUCTIONS:
1. DIRECT ANSWER: Read and understand the student's exact question and answer it directly. Never give canned, pre-written introductions or identical paragraphs for different questions.
2. NO FORCED JARGON: Do NOT force generic corporate jargon (such as "audit trails", "reconciliation", "control totals", "verifiable evidence", or "ledger invariance") into responses unless the student's query is explicitly about accounting reconciliation, auditing, or ledger validation.
3. CONTEXT SENSITIVITY: 
   ${sessionTitle ? `- Current Active Session: ${sessionTitle}` : ''}
   - If the student asks about this specific session or its workstation, reference the provided approved curriculum context below.
   - If the student asks a general commerce, finance, startup, career, spreadsheet, or communication question (e.g. EBITDA, startup planning in Bengaluru, internship email, Excel duplicate removal), answer directly based on real-world best practices without forcing irrelevant course case facts.
4. EXAMPLES: Include exactly one simple, relatable practical example where appropriate.
5. LENGTH: Keep responses concise (typically 150 to 300 words). Offer to provide deeper steps or calculations if the student wants to explore further.
6. HONESTY: Never fabricate curriculum data, company numbers, or tax regulations.
7. INDEPENDENCE: If a student asks for solutions to graded exams, exit simulations, or assessments, politely refuse and remind them that independent work is required.
8. MULTI-APPROACH TUTORING:
   - When a student asks "Explain simply" or for a plain explanation: use an intuitive real-world analogy (e.g. neighborhood store, local distributor, or everyday household finance) without complex jargon.
   - When a student asks "Another approach" or alternative method: provide a valid alternative calculation framework, perspective, or workflow (e.g. direct vs indirect method, zero-variance bridge vs formula reconciliation).
   - When a student asks "Step-by-step": break down the solution into clear, numbered, verifiable steps showing inputs, arithmetic, and validation checks.
   - When a student asks for a "Real example" or corporate example: provide an authentic Indian business case (e.g. Bengaluru distributor, Infosys, Titan, Maruti Suzuki, or GST/TDS compliance).
   - When a student asks to "Quiz me": present a single concise business scenario question with 3-4 options or a prompt to decide, and wait for their response before grading.

${
  curriculumExcerpt
    ? `\n--- VCEP APPROVED CURRICULUM CONTEXT ---\n${curriculumExcerpt}\n--- END CURRICULUM CONTEXT ---`
    : ''
}
`.trim();
}

/**
 * Handles POST /api/vivi/chat requests
 */
export async function handleViviChat(
  req: Request,
  db: any,
  user: { id: string; email: string; name: string; role: string; cohort?: string; consent?: number },
  env?: any
): Promise<Response> {
  const reqStart = Date.now();
  const requestId = 'vivi_req_' + Math.random().toString(36).slice(2, 10);

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: ViviChatRequest;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }

  const message = (body.message || '').trim();
  if (!message) {
    return Response.json({ error: 'Please enter a question or topic for Vivi.' }, { status: 400 });
  }

  if (message.length > 1000) {
    return Response.json(
      { error: 'Message exceeds 1,000 character limit. Please ask a more concise question.' },
      { status: 413 }
    );
  }

  const mode = body.mode || 'explain';
  const language = body.language || 'en';
  const context = body.context || {};

  // 1. Strict Controlled Assessment Security Check
  const assessmentCheck = checkControlledAssessmentGate(context, message);
  if (!assessmentCheck.allowed) {
    return Response.json(
      {
        error: assessmentCheck.reason,
        code: 'CONTROLLED_ASSESSMENT_LOCKOUT',
        isLockout: assessmentCheck.isLockout,
        retryable: false,
      },
      { status: 403 }
    );
  }

  // 2. Per-User Rate Limiting
  const rateLimit = checkRateLimit(user.id);
  if (!rateLimit.allowed) {
    return Response.json(
      {
        error: rateLimit.reason,
        code: 'RATE_LIMIT_EXCEEDED',
        retryable: true,
      },
      { status: 429 }
    );
  }

  // 3. Permission-Gated Curriculum Retrieval
  let curriculumExcerpt = '';
  let sourceReference: string | undefined;

  if (context.sessionId) {
    const curriculum = await getAuthorizedCurriculumContext(
      db,
      user,
      context.sessionId,
      context.section
    );
    if (!curriculum.allowed) {
      return Response.json(
        {
          error: curriculum.reason,
          code: 'UNAUTHORIZED_CURRICULUM',
          retryable: false,
        },
        { status: 403 }
      );
    }
    curriculumExcerpt = curriculum.excerpt || '';
    sourceReference = curriculum.sourceReference;
  }

  // 4. Verify AI Model Provider Configuration
  const provider = resolveProviderConfig(env);
  if (!provider.available) {
    // Step 6 Requirement: Friendly student error with structured code
    console.warn(
      `[Vivi Provider Warning] reqId=${requestId} user=${user.id} error="Missing provider credentials in runtime environment"`
    );
    return Response.json(
      {
        error: "Vivi couldn't connect right now. Please try again.",
        code: 'PROVIDER_UNCONFIGURED',
        retryable: false,
      },
      { status: 503 }
    );
  }

  // 5. Build Master System Instruction
  const systemInstruction = buildSystemInstruction(
    mode,
    language,
    curriculumExcerpt,
    context.sessionTitle
  );

  // 6. Assemble Conversation Messages with Memory Protection
  const messages: ChatMessage[] = [{ role: 'system', content: systemInstruction }];

  if (body.history && Array.isArray(body.history)) {
    const sanitizedHistory = body.history
      .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
      .slice(-6);

    for (const h of sanitizedHistory) {
      const content = h.content.trim();
      if (content && !content.startsWith('⚠️') && !content.startsWith('**Hi, I am Vivi!')) {
        messages.push({ role: h.role, content: content.slice(0, 1000) });
      }
    }
  }

  messages.push({ role: 'user', content: message });

  // 7. Stream Genuine Model Response
  let responseStream: ReadableStream<Uint8Array>;
  try {
    if ((provider.provider === 'openai' || provider.provider === 'cloudflare-gateway') && provider.apiKey) {
      responseStream = await streamOpenAICompatible(
        provider.endpoint!,
        provider.apiKey,
        provider.model,
        {
          messages,
          maxTokens: 800,
          temperature: 0.3,
        },
        provider.gatewayToken
      );
    } else if (provider.provider === 'workers-ai' && env?.AI) {
      responseStream = await streamCloudflareWorkersAI(env.AI, provider.model, {
        messages,
        maxTokens: 800,
        temperature: 0.3,
      });
    } else if (provider.provider === 'local-intelligent') {
      responseStream = streamLocalIntelligentTutor(
        { messages },
        curriculumExcerpt,
        context.sessionTitle,
        mode,
        language
      );
    } else {
      return Response.json(
        {
          error: "Vivi couldn't connect right now. Please try again.",
          code: 'PROVIDER_UNCONFIGURED',
          retryable: false,
        },
        { status: 503 }
      );
    }
  } catch (err: any) {
    const statusCode = err instanceof ViviProviderError ? err.status : 502;
    const errorCode = err instanceof ViviProviderError ? err.code : 'PROVIDER_ERROR';
    const retryable = err instanceof ViviProviderError ? err.retryable : true;

    // Step 6: Log sanitized diagnostics on the server, hide stack traces from students
    console.error(
      `[Vivi Chat Provider Error] reqId=${requestId} user=${user.id} status=${statusCode} code=${errorCode} durationMs=${
        Date.now() - reqStart
      } error="${err.message || err}"`
    );

    return Response.json(
      {
        error: "Vivi couldn't connect right now. Please try again.",
        code: errorCode,
        retryable,
      },
      { status: statusCode }
    );
  }

  // 8. Prepend source reference metadata event if curriculum was used
  const encoder = new TextEncoder();
  const transformedStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      if (sourceReference) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'source', source: sourceReference })}\n\n`
          )
        );
      }
      const reader = responseStream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(value);
      }
      controller.close();
    },
  });

  return new Response(transformedStream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Content-Type-Options': 'nosniff',
      'X-Accel-Buffering': 'no',
    },
  });
}
