/**
 * Vivi AI Learning Partner - Core TypeScript Types & Contracts
 */

export type ViviMode = 'explain' | 'guide' | 'quiz' | 'check';

export type ViviLanguage = 'en' | 'kn' | 'kn-en';

export interface ViviLearningContext {
  sessionId?: number;
  sessionTitle?: string;
  section?: string;
  stage?: number | string;
  task?: string;
  userDraft?: string;
}

export interface ViviChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  mode?: ViviMode;
  language?: ViviLanguage;
  sources?: string[];
  isLockedOut?: boolean;
  error?: boolean;
  code?: string;
  retryable?: boolean;
  userQuery?: string;
}

export interface ViviChatRequest {
  conversationId: string;
  message: string;
  mode?: ViviMode;
  language?: ViviLanguage;
  context?: ViviLearningContext;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface ViviSSEEvent {
  type: 'chunk' | 'source' | 'done' | 'error' | 'lockout';
  content?: string;
  source?: string;
  error?: string;
}

export interface ViviSpeechRequest {
  text: string;
  messageId?: string;
  sessionId?: number;
  stage?: number | string;
  language?: ViviLanguage;
  speed?: number;
  voice?: string;
}
