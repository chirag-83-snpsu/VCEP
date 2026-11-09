export type ViviMode = 'explain' | 'guide' | 'quiz' | 'check';

export type ViviLanguage = 'en' | 'kn' | 'kn-en';

export type ViviDisplayMode = 'compact' | 'expanded';

export type SpeechPlaybackState = 'idle' | 'loading' | 'playing' | 'paused';

export type SpeechSpeed = 0.85 | 0.95 | 1.10;

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

export interface ViviContextState {
  sessionId?: number;
  sessionTitle?: string;
  section?: string;
  stage?: number | string;
  task?: string;
}
