/**
 * Vivi AI Learning Partner - Server-Side Speech Generation Controller
 * Handles POST /api/vivi/speech requests.
 * Orchestrates student authorization, assessment lockouts, rate limiting,
 * educational text normalization, and high-fidelity cloud TTS generation.
 */

import { ViviSpeechRequest } from './types';
import { checkControlledAssessmentGate } from './vivi-guardrails.server';
import { checkRateLimit } from './vivi-server';
import { resolveProviderConfig } from './vivi-providers.server';
import { normalizeEducationalSpeech } from './vivi-speech-normalizer';

export async function handleViviSpeech(
  req: Request,
  user: { id: string; email: string; name: string; role: string; cohort?: string },
  env?: any
): Promise<Response> {
  const reqStart = Date.now();
  const requestId = 'vivi_tts_' + Math.random().toString(36).slice(2, 10);

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: ViviSpeechRequest;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }

  const rawText = (body.text || '').trim();
  if (!rawText) {
    return Response.json({ error: 'Missing text content for speech generation' }, { status: 400 });
  }

  if (rawText.length > 2500) {
    return Response.json(
      { error: 'Text exceeds maximum speech limit (2,500 characters).' },
      { status: 413 }
    );
  }

  const language = body.language || 'en';
  const speed = Number(body.speed) || 0.95;
  const validSpeed = [0.85, 0.95, 1.1].includes(speed) ? speed : 0.95;

  // 1. Strict Controlled Assessment Security Check
  if (body.sessionId) {
    const assessmentCheck = checkControlledAssessmentGate(
      { sessionId: body.sessionId, stage: body.stage },
      rawText
    );
    if (!assessmentCheck.allowed) {
      return Response.json(
        {
          error:
            'Controlled Assessment Active: Speech generation is strictly disabled during Session 22 Exit B and Session 01 Stage 1 Baseline Diagnostic.',
          code: 'CONTROLLED_ASSESSMENT_LOCKOUT',
          isLockout: true,
        },
        { status: 403 }
      );
    }
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

  // 3. Prepare educational normalized speech text
  const normalizedText = normalizeEducationalSpeech(rawText, language);

  // 4. Resolve AI Model & TTS Provider Configuration
  const provider = resolveProviderConfig(env);

  if (provider.available && provider.apiKey) {
    try {
      let speechUrl = 'https://api.openai.com/v1/audio/speech';
      if (env?.VIVI_TTS_GATEWAY_URL || process.env.VIVI_TTS_GATEWAY_URL) {
        speechUrl = env?.VIVI_TTS_GATEWAY_URL || process.env.VIVI_TTS_GATEWAY_URL;
      } else if (provider.endpoint && provider.endpoint.includes('gateway.ai.cloudflare.com')) {
        speechUrl = provider.endpoint.replace(/\/chat\/completions\/?$/, '/audio/speech');
      } else if (env?.OPENAI_BASE_URL || process.env.OPENAI_BASE_URL) {
        const base = (env?.OPENAI_BASE_URL || process.env.OPENAI_BASE_URL).replace(/\/$/, '');
        speechUrl = `${base}/audio/speech`;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${provider.apiKey}`,
      };

      if (provider.gatewayToken) {
        headers['cf-aig-authorization'] = `Bearer ${provider.gatewayToken}`;
      }

      // Voice selection: "nova" is the signature warm, professional female adult educator voice
      const selectedVoice = body.voice === 'shimmer' ? 'shimmer' : 'nova';

      const ttsResponse = await fetch(speechUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'tts-1',
          input: normalizedText,
          voice: selectedVoice,
          response_format: 'mp3',
          speed: validSpeed,
        }),
      });

      if (ttsResponse.ok) {
        return new Response(ttsResponse.body, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff',
            'X-Vivi-Voice': selectedVoice,
            'X-Vivi-Speed': String(validSpeed),
            'X-Vivi-Duration-Ms': String(Date.now() - reqStart),
          },
        });
      }

      console.warn(
        `[Vivi TTS Upstream Warning] reqId=${requestId} status=${ttsResponse.status} text="${await ttsResponse.text()}"`
      );
    } catch (err: any) {
      console.error(
        `[Vivi TTS Upstream Error] reqId=${requestId} durationMs=${Date.now() - reqStart} error="${
          err.message || err
        }"`
      );
    }
  }

  // 5. High-Fidelity Client-Side Synthesis Fallback (Local Dev / Offline / Unconfigured Provider)
  return Response.json(
    {
      fallback: true,
      mode: 'client_synthesis',
      normalizedText,
      speed: validSpeed,
      language,
      voice: 'female-educator',
      reason: 'Cloud TTS provider unconfigured or offline. Utilizing enhanced client-side female synthesis.',
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, no-store',
      },
    }
  );
}
