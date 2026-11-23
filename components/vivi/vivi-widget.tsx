'use client';

/**
 * Vivi AI Learning Partner - Voice & Conversational Assistant
 * Desktop floating button + responsive glassmorphism conversation drawer.
 * Supports: Text chat, Voice Input (Speech-to-Text), and Voice Output (Speech Synthesis).
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Sparkles,
  X,
  Send,
  Square,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  BookOpen,
  ShieldAlert,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Loader2,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  ExternalLink,
} from 'lucide-react';
import { ViviMode, ViviLanguage, ViviChatMessage, SpeechPlaybackState, SpeechSpeed, ViviDisplayMode } from './vivi-types';
import {
  getSmartSuggestions,
  getFollowUpSuggestions,
  CONVERSATIONAL_QUICK_ACTIONS,
  SmartSuggestionItem,
  SuggestionCategory,
} from '@/lib/vivi/vivi-suggestions';
import { ViviMarkdown } from './vivi-markdown';
import './vivi.css';

interface ViviWidgetProps {
  currentSessionId?: number;
  currentSessionTitle?: string;
  currentSection?: string;
  currentStage?: number | string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  } | null;
}

export default function ViviWidget({
  currentSessionId,
  currentSessionTitle,
  currentSection,
  currentStage,
  user,
}: ViviWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<ViviDisplayMode>('compact');
  const [mobileTab, setMobileTab] = useState<'chat' | 'explore'>('chat');
  const [mode, setMode] = useState<ViviMode>('explain');
  const [language, setLanguage] = useState<ViviLanguage>('en');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ViviChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});

  // Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [activeVoiceMsgId, setActiveVoiceMsgId] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<SpeechPlaybackState>('idle');
  const [speechSpeed, setSpeechSpeed] = useState<SpeechSpeed>(0.95);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Audio References & State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrlRef = useRef<string | null>(null);
  const abortAudioFetchRef = useRef<AbortController | null>(null);
  const speechVoicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);

  // Stop all active audio streams and cleanly dispose resources
  const stopAllAudio = useCallback(() => {
    // 1. Cancel in-flight network request
    if (abortAudioFetchRef.current) {
      abortAudioFetchRef.current.abort();
      abortAudioFetchRef.current = null;
    }

    // 2. Stop HTML5 Audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onplay = null;
      audioRef.current.onpause = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    // 3. Revoke blob object URL
    if (audioBlobUrlRef.current) {
      URL.revokeObjectURL(audioBlobUrlRef.current);
      audioBlobUrlRef.current = null;
    }

    // 4. Cancel browser SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setPlaybackState('idle');
    setActiveVoiceMsgId(null);
  }, []);

  // Check browser speech recognition & synthesis capabilities and load voices asynchronously
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSynthesis = 'speechSynthesis' in window;
      const hasRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setSpeechSupported(hasSynthesis || hasRecognition);

      if (hasSynthesis) {
        const loadVoices = () => {
          const v = window.speechSynthesis.getVoices();
          if (v && v.length > 0) {
            speechVoicesRef.current = v;
          }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  // Initialize or restore conversation history
  useEffect(() => {
    const cached = sessionStorage.getItem('vcep_vivi_messages');
    if (cached) {
      try {
        setMessages(JSON.parse(cached));
        return;
      } catch {}
    }

    // Default welcome message from Vivi
    const welcomeMsg: ViviChatMessage = {
      id: 'welcome_1',
      role: 'assistant',
      content:
        '**Hi, I am Vivi! Your Voice & AI Learning Partner.**\n\nI can explain corporate commerce concepts, guide you through workstation formulas, or speak directly with you! Tap the microphone to talk or choose a topic below.',
      createdAt: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);
  }, []);

  // Save conversation history to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('vcep_vivi_messages', JSON.stringify(messages.slice(-20)));
    }
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming, isOpen]);

  // Focus textarea when panel opens; stop audio when closed
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    } else {
      // Cancel speech playback if panel is closed
      stopAllAudio();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        setIsListening(false);
      }
    }
  }, [isOpen, stopAllAudio]);

  // Keyboard shortcut: Escape minimizes expanded mode, or closes compact panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (displayMode === 'expanded') {
          setDisplayMode('compact');
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, displayMode]);

  // Track & Curriculum Context
  const trackInfo = useMemo(() => {
    if (!currentSessionId) return { track: 'VCEP WorkLab', range: '01–24', theme: 'Commerce & Corporate Readiness' };
    if (currentSessionId <= 6) return { track: 'Track 1 · Corporate Foundations', range: '01–06', theme: 'Startup essentials & financial statements' };
    if (currentSessionId <= 12) return { track: 'Track 2 · Finance & Analytics', range: '07–12', theme: 'GST, analytics & corporate accounting' };
    if (currentSessionId <= 18) return { track: 'Track 3 · AI & Business Execution', range: '13–18', theme: 'Capital budgeting & AI commerce models' };
    return { track: 'Track 4 · Projects & Career', range: '19–24', theme: 'Executive capstone & industry readiness' };
  }, [currentSessionId]);

  // Smart Suggestions States
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | SuggestionCategory>('all');

  // Active contextual suggestions based on current session, stage, mode, language
  const smartResult = useMemo(() => {
    return getSmartSuggestions({
      sessionId: currentSessionId,
      stage: currentStage,
      mode,
      language,
      limitPrimary: 3,
    });
  }, [currentSessionId, currentStage, mode, language]);

  // Localized text helper for suggestions
  const getSuggestionText = useCallback(
    (sug: SmartSuggestionItem) => {
      if (language === 'kn') return sug.textKn || sug.text;
      if (language === 'kn-en') return sug.textKnEn || sug.text;
      return sug.text;
    },
    [language]
  );

  // Dynamic follow-ups derived from the most recent assistant answer
  const lastAssistantMsg = useMemo(() => {
    return messages.slice().reverse().find((m) => m.role === 'assistant' && !m.error && !m.isLockedOut);
  }, [messages]);

  const lastUserMsg = useMemo(() => {
    return messages.slice().reverse().find((m) => m.role === 'user');
  }, [messages]);

  const dynamicFollowUps = useMemo(() => {
    if (!lastAssistantMsg) return [];
    return getFollowUpSuggestions(
      lastAssistantMsg.content,
      lastUserMsg ? lastUserMsg.content : '',
      currentSessionId,
      language
    );
  }, [lastAssistantMsg?.id, lastUserMsg?.id, currentSessionId, language]);

  // Filtered list for "All Suggestions" drawer
  const drawerDisplayList = useMemo(() => {
    if (activeCategoryTab === 'all') {
      return [
        ...smartResult.categorized.understand,
        ...smartResult.categorized.solve,
        ...smartResult.categorized.apply,
        ...smartResult.categorized.practise,
      ];
    }
    return smartResult.categorized[activeCategoryTab] || [];
  }, [activeCategoryTab, smartResult]);

  // Speech-to-Text (Voice Input) Handler
  const toggleListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      return;
    }

    // Stop playback if assistant is speaking
    stopAllAudio();

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;

    // Match language
    if (language === 'kn') {
      recognition.lang = 'kn-IN';
    } else {
      recognition.lang = 'en-IN';
    }

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setInputMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }, [isListening, language, stopAllAudio]);

  // Select best female voice for browser speech synthesis fallback
  const getBestFemaleVoice = useCallback((lang: ViviLanguage): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = speechVoicesRef.current.length > 0 ? speechVoicesRef.current : window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    if (lang === 'kn') {
      const kn = voices.find((v) => v.lang.startsWith('kn') || v.name.toLowerCase().includes('kannada'));
      return kn || null;
    }

    // Explicit male exclusion to prevent Rishi, David, Alex, etc.
    const isMale = (name: string) => /\b(rishi|david|alex|fred|daniel|george|male|guy|mark|oliver|tom)\b/i.test(name);

    // 1. Prioritize Indian English Female
    const inFemale = voices.find(
      (v) =>
        (v.lang === 'en-IN' || v.name.includes('India') || v.lang.includes('en_IN')) &&
        (v.name.includes('Female') || v.name.includes('Veena') || v.name.includes('Kavya') || v.name.includes('Heera') || !isMale(v.name))
    );
    if (inFemale) return inFemale;

    // 2. High-quality English female educator voices (Google UK English Female, Samantha, Karen, Victoria, Zira, etc.)
    const enFemale = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        !isMale(v.name) &&
        (v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('serena') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('jenny'))
    );
    if (enFemale) return enFemale;

    // 3. Fallback to any non-male English voice
    return voices.find((v) => v.lang.startsWith('en') && !isMale(v.name)) || null;
  }, []);

  // Client speech synthesis fallback with natural female educator voice
  const speakClientFallback = useCallback(
    (textToSpeak: string, msgId: string, speed: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setVoiceNotice('Speech audio is not supported in this browser.');
        setPlaybackState('idle');
        setActiveVoiceMsgId(null);
        return;
      }

      window.speechSynthesis.cancel();

      // Check Kannada language support
      if (language === 'kn') {
        const knVoice = getBestFemaleVoice('kn');
        if (!knVoice) {
          setVoiceNotice('Kannada speech voice is not installed on this browser. Written explanation is shown above.');
          setPlaybackState('idle');
          setActiveVoiceMsgId(null);
          setTimeout(() => setVoiceNotice(null), 6000);
          return;
        }
      }

      // Quick clean for client text if not pre-normalized
      const clean = textToSpeak
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
        .replace(/#+\s*/g, '')
        .replace(/₹\s*([0-9,]+)/g, '$1 rupees')
        .replace(/₹/g, 'rupees ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!clean) {
        setPlaybackState('idle');
        setActiveVoiceMsgId(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(clean);
      const voice = getBestFemaleVoice(language);
      if (voice) utterance.voice = voice;
      utterance.rate = speed;
      utterance.pitch = 1.0;

      utterance.onstart = () => setPlaybackState('playing');
      utterance.onpause = () => setPlaybackState('paused');
      utterance.onresume = () => setPlaybackState('playing');
      utterance.onend = () => {
        setPlaybackState('idle');
        setActiveVoiceMsgId(null);
      };
      utterance.onerror = () => {
        setPlaybackState('idle');
        setActiveVoiceMsgId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [language, getBestFemaleVoice]
  );

  // Main speech player handler (Cloud Neural Voice with enhanced client fallback)
  const playSpeech = useCallback(
    async (m: ViviChatMessage, speedOverride?: SpeechSpeed) => {
      const targetSpeed = speedOverride || speechSpeed;

      // Toggle Pause/Resume if clicked on currently active message
      if (activeVoiceMsgId === m.id) {
        if (playbackState === 'playing') {
          if (audioRef.current) {
            audioRef.current.pause();
          } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.pause();
          }
          setPlaybackState('paused');
          return;
        }
        if (playbackState === 'paused') {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
          } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.resume();
          }
          setPlaybackState('playing');
          return;
        }
      }

      // Stop any other currently playing speech
      stopAllAudio();

      setActiveVoiceMsgId(m.id);
      setPlaybackState('loading');
      setVoiceNotice(null);

      // Stop voice input listening if active
      if (isListening && recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
        setIsListening(false);
      }

      const controller = new AbortController();
      abortAudioFetchRef.current = controller;

      try {
        const res = await fetch('/api/vivi/speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: m.content,
            messageId: m.id,
            sessionId: currentSessionId,
            stage: currentStage,
            language,
            speed: targetSpeed,
            voice: 'nova',
          }),
          signal: controller.signal,
        });

        // 1. Cloud TTS Audio Stream (audio/mpeg)
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('audio/mpeg')) {
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          audioBlobUrlRef.current = blobUrl;

          const audio = new Audio(blobUrl);
          audioRef.current = audio;
          audio.playbackRate = targetSpeed;

          audio.onplay = () => setPlaybackState('playing');
          audio.onpause = () => {
            if (audio.currentTime < audio.duration) setPlaybackState('paused');
          };
          audio.onended = () => {
            setPlaybackState('idle');
            setActiveVoiceMsgId(null);
          };
          audio.onerror = () => {
            console.warn('[Vivi Audio Error] Falling back to client synthesizer');
            speakClientFallback(m.content, m.id, targetSpeed);
          };

          await audio.play();
          return;
        }

        // 2. Client-side synthesis fallback (when cloud keys unconfigured or offline)
        let normalizedText = m.content;
        try {
          const data: any = await res.json();
          if (data && typeof data === 'object' && typeof data.normalizedText === 'string') {
            normalizedText = data.normalizedText;
          }
        } catch {}

        speakClientFallback(normalizedText, m.id, targetSpeed);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('[Vivi TTS Fetch Error] Falling back to client synthesizer:', err.message);
          speakClientFallback(m.content, m.id, targetSpeed);
        }
      }
    },
    [activeVoiceMsgId, playbackState, speechSpeed, currentSessionId, currentStage, language, isListening, stopAllAudio, speakClientFallback]
  );

  // Speed changer
  const changeSpeed = useCallback(
    (newSpeed: SpeechSpeed) => {
      setSpeechSpeed(newSpeed);
      if (audioRef.current) {
        audioRef.current.playbackRate = newSpeed;
      }
    },
    []
  );

  // Replay speech from beginning
  const replaySpeech = useCallback(
    (m: ViviChatMessage) => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        setPlaybackState('playing');
      } else {
        stopAllAudio();
        playSpeech(m, speechSpeed);
      }
    },
    [playSpeech, speechSpeed, stopAllAudio]
  );

  // Handle message sending & streaming
  const handleSend = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend || inputMessage).trim();
      if (!query || isStreaming) return;

      // Stop speech if active
      stopAllAudio();
      if (isListening && recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
        setIsListening(false);
      }

      const userMsgId = 'user_' + Date.now();
      const userMsg: ViviChatMessage = {
        id: userMsgId,
        role: 'user',
        content: query,
        createdAt: new Date().toISOString(),
        mode,
        language,
      };

      const assistantMsgId = 'asst_' + (Date.now() + 1);
      const assistantMsg: ViviChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
        mode,
        language,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInputMessage('');
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const historyPayload = messages
          .filter(
            (m) =>
              !m.error &&
              !m.isLockedOut &&
              !m.content.startsWith('⚠️') &&
              !m.content.startsWith('**Hi, I am Vivi!') &&
              m.content.trim().length > 0
          )
          .slice(-6)
          .map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }));

        const res = await fetch('/api/vivi/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: 'vivi_conv_' + (user?.id || 'anon'),
            message: query,
            mode,
            language,
            context: {
              sessionId: currentSessionId,
              sessionTitle: currentSessionTitle,
              section: currentSection,
              stage: currentStage,
            },
            history: historyPayload,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData: any = await res.json().catch(() => ({}));
          const errMsg = errData.error || `Server returned error (${res.status})`;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: `⚠️ **${errMsg}**`,
                    isLockedOut: Boolean(errData.isLockout),
                    error: true,
                    code: errData.code,
                    retryable: errData.retryable !== false,
                    userQuery: query,
                  }
                : m
            )
          );
          setIsStreaming(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No streaming body returned');

        const decoder = new TextDecoder();
        let buffer = '';
        let streamedContent = '';
        let sources: string[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(':')) continue;
            if (trimmed.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                if (parsed.type === 'chunk' && parsed.content) {
                  streamedContent += parsed.content;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: streamedContent } : m
                    )
                  );
                } else if (parsed.type === 'source' && parsed.source) {
                  sources.push(parsed.source);
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, sources: [...sources] } : m
                    )
                  );
                } else if (parsed.type === 'error') {
                  streamedContent += `\n\n⚠️ *${parsed.error}*`;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: streamedContent, error: true } : m
                    )
                  );
                }
              } catch {}
            }
          }
        }

        // Auto-voice readout if enabled
        if (autoVoiceEnabled && streamedContent) {
          playSpeech({
            id: assistantMsgId,
            role: 'assistant',
            content: streamedContent,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: `⚠️ Connection error: ${err.message}. Please retry.`,
                    error: true,
                  }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [inputMessage, isStreaming, mode, language, messages, currentSessionId, currentSessionTitle, currentSection, currentStage, user, autoVoiceEnabled, playSpeech, isListening]
  );

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    stopAllAudio();
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    stopAllAudio();
    const welcomeMsg: ViviChatMessage = {
      id: 'welcome_' + Date.now(),
      role: 'assistant',
      content:
        'Conversation refreshed! What commerce concept, workstation task, or professional skill would you like to explore?',
      createdAt: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);
    sessionStorage.removeItem('vcep_vivi_messages');
  };

  // Render message stream (shared across compact & expanded modes)
  const renderMessageList = (isExpanded: boolean) => (
    <div className={`vivi-messages ${isExpanded ? 'expanded' : ''}`} role="log" aria-live="polite">
      {messages.map((m) => (
        <div key={m.id} className={`vivi-msg-row ${m.role} ${isExpanded ? 'expanded' : ''}`}>
          <div
            className={`vivi-bubble ${m.isLockedOut ? 'lockout' : ''} ${
              m.error ? 'error' : ''
            } ${isExpanded ? 'expanded' : ''}`}
          >
            {/* Lockout Shield Icon */}
            {m.isLockedOut && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#b45309', fontWeight: 700, fontSize: 12 }}>
                <ShieldAlert size={16} />
                <span>Controlled Assessment Gate</span>
              </div>
            )}

            {/* Safe Markdown parsing */}
            <ViviMarkdown content={m.content} />

            {/* Curriculum Source Reference */}
            {m.sources && m.sources.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {m.sources.map((src, idx) => (
                  <span key={idx} className="vivi-source-badge">
                    <BookOpen size={11} />
                    {src}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Message Action Controls (Audio, Copy, Feedback, Transformations, Follow-ups) */}
          {m.role === 'assistant' && !m.error && m.content.length > 0 && (
            <div className="vivi-msg-actions-container">
              <div className="vivi-audio-control-bar">
                {/* Play / Pause / Resume Button */}
                <button
                  className={`vivi-audio-btn ${activeVoiceMsgId === m.id && playbackState !== 'idle' ? 'active' : ''}`}
                  onClick={() => playSpeech(m)}
                  title={
                    activeVoiceMsgId === m.id && playbackState === 'playing'
                      ? 'Pause playback'
                      : activeVoiceMsgId === m.id && playbackState === 'paused'
                      ? 'Resume playback'
                      : 'Listen to Vivi in natural female educator voice'
                  }
                  aria-label={
                    activeVoiceMsgId === m.id && playbackState === 'playing'
                      ? 'Pause speech'
                      : 'Listen to Vivi'
                  }
                >
                  {activeVoiceMsgId === m.id && playbackState === 'loading' ? (
                    <>
                      <Loader2 size={12} className="vivi-spin" />
                      <span>Loading...</span>
                    </>
                  ) : activeVoiceMsgId === m.id && playbackState === 'playing' ? (
                    <>
                      <Pause size={12} />
                      <span>Pause</span>
                      <span className="vivi-audio-wave">
                        <span className="vivi-wave-bar" />
                        <span className="vivi-wave-bar" />
                        <span className="vivi-wave-bar" />
                        <span className="vivi-wave-bar" />
                      </span>
                    </>
                  ) : activeVoiceMsgId === m.id && playbackState === 'paused' ? (
                    <>
                      <Play size={12} />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={12} />
                      <span>Listen</span>
                    </>
                  )}
                </button>

                {/* Replay & Stop (visible when active) */}
                {activeVoiceMsgId === m.id && playbackState !== 'idle' && (
                  <>
                    <button
                      className="vivi-audio-sub-btn"
                      onClick={() => replaySpeech(m)}
                      title="Replay from start"
                      aria-label="Replay speech from start"
                    >
                      <RotateCcw size={11} />
                      <span>Replay</span>
                    </button>
                    <button
                      className="vivi-audio-sub-btn"
                      onClick={stopAllAudio}
                      title="Stop audio"
                      aria-label="Stop audio"
                    >
                      <Square size={11} />
                      <span>Stop</span>
                    </button>
                  </>
                )}

                {/* Speed Selector (0.85x, 0.95x, 1.10x) */}
                <div className="vivi-speed-selector" title="Speech Speed">
                  {([0.85, 0.95, 1.10] as SpeechSpeed[]).map((spd) => (
                    <button
                      key={spd}
                      className={`vivi-speed-pill ${speechSpeed === spd ? 'active' : ''}`}
                      onClick={() => changeSpeed(spd)}
                      aria-label={`Set speed to ${spd}x`}
                    >
                      {spd === 0.95 ? '0.95×' : `${spd}×`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Non-blocking Notice Banner */}
              {activeVoiceMsgId === m.id && voiceNotice && (
                <div className="vivi-voice-notice" role="alert">
                  {voiceNotice}
                </div>
              )}

              <div className="vivi-msg-actions">
                <button
                  className="vivi-msg-action-btn"
                  onClick={() => handleCopy(m.id, m.content)}
                  title="Copy response"
                >
                  {copiedId === m.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  className="vivi-msg-action-btn"
                  onClick={() =>
                    setFeedbackGiven((prev) => ({ ...prev, [m.id]: 'up' }))
                  }
                  style={{ color: feedbackGiven[m.id] === 'up' ? '#0F766E' : undefined }}
                  title="Helpful"
                >
                  <ThumbsUp size={12} />
                </button>

                <button
                  className="vivi-msg-action-btn"
                  onClick={() =>
                    setFeedbackGiven((prev) => ({ ...prev, [m.id]: 'down' }))
                  }
                  style={{ color: feedbackGiven[m.id] === 'down' ? '#ef4444' : undefined }}
                  title="Needs Improvement"
                >
                  <ThumbsDown size={12} />
                </button>
              </div>

              {/* Quick Transformation Actions */}
              <div className="vivi-quick-actions-bar" aria-label="Transform answer">
                {CONVERSATIONAL_QUICK_ACTIONS.map((qa) => {
                  const label = language === 'kn' ? qa.labelKn : qa.labelEn;
                  const prompt = language === 'kn' ? qa.promptKn : qa.promptEn;
                  return (
                    <button
                      key={qa.id}
                      type="button"
                      className="vivi-quick-action-chip"
                      onClick={() => handleSend(prompt)}
                      disabled={isStreaming}
                      title={prompt}
                    >
                      <span className="vivi-quick-action-icon" aria-hidden="true">{qa.icon}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Contextual Follow-up Suggestions on Last Assistant Answer */}
              {lastAssistantMsg?.id === m.id && dynamicFollowUps.length > 0 && (
                <div className="vivi-followups-container">
                  <div className="vivi-followups-header">
                    <Sparkles size={11} className="vivi-sparkle-icon" />
                    <span>{language === 'kn' ? 'ಮುಂದಿನ ಪ್ರಶ್ನೆಗಳು' : 'Smart follow-ups'}</span>
                  </div>
                  <div className="vivi-followups-chips">
                    {dynamicFollowUps.map((fu) => {
                      const text = language === 'kn' ? fu.textKn : fu.text;
                      return (
                        <button
                          key={fu.id}
                          type="button"
                          className="vivi-followup-chip"
                          onClick={() => handleSend(text)}
                          disabled={isStreaming}
                        >
                          <span>{text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Retry Control on Transient Error */}
          {m.role === 'assistant' && m.error && m.retryable !== false && m.userQuery && (
            <div className="vivi-msg-actions">
              <button
                className="vivi-msg-action-btn vivi-retry-btn"
                onClick={() => handleSend(m.userQuery)}
                disabled={isStreaming}
                title="Retry asking this question"
              >
                <RotateCcw size={12} />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Typing Indicator */}
      {isStreaming && (
        <div className={`vivi-msg-row assistant ${isExpanded ? 'expanded' : ''}`}>
          <div className="vivi-bubble">
            <div className="vivi-typing-indicator">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );

  // Render Composer (shared across compact & expanded modes)
  const renderComposer = (isExpanded: boolean) => (
    <div className={`vivi-input-container ${isExpanded ? 'expanded' : ''}`}>
      <button
        className={`vivi-mic-btn ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        title={isListening ? 'Stop listening' : 'Speak to Vivi (Voice Input)'}
        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        disabled={isStreaming}
      >
        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      </button>

      <textarea
        ref={textareaRef}
        className={`vivi-textarea ${isExpanded ? 'expanded' : ''}`}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder={
          isListening
            ? 'Listening to your voice...'
            : isExpanded
            ? `Ask Vivi anything about Session ${currentSessionId || 1} (${mode} mode)...`
            : `Ask Vivi anything (${mode} mode)...`
        }
        rows={isExpanded ? 2 : 1}
        disabled={isStreaming}
        maxLength={1000}
      />

      {isStreaming ? (
        <button
          className="vivi-stop-btn"
          onClick={handleStop}
          title="Stop generation"
          aria-label="Stop generation"
        >
          <Square size={16} fill="currentColor" />
        </button>
      ) : (
        <button
          className="vivi-send-btn"
          onClick={() => handleSend()}
          disabled={!inputMessage.trim()}
          title="Send message (Enter)"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      )}
    </div>
  );

  // Render Left Sidebar for Expanded Workspace
  const renderSidebar = () => (
    <div className={`vivi-expanded-sidebar ${mobileTab === 'explore' ? 'mobile-visible' : 'mobile-hidden'}`}>
      {/* Current Lesson Card */}
      <div className="vivi-sidebar-card">
        <div className="vivi-sidebar-card-label">
          <Sparkles size={11} color="#E5AF2E" />
          <span>YOUR CURRENT LESSON</span>
        </div>
        <h4 className="vivi-sidebar-card-title">
          {currentSessionId
            ? `Session ${String(currentSessionId).padStart(2, '0')}: ${
                currentSessionTitle || 'Active Lesson'
              }`
            : 'VCEP Commerce WorkLab'}
        </h4>
        <p className="vivi-sidebar-card-meta">
          {currentStage ? `Stage ${currentStage}: Active Workstation · ` : ''}
          {trackInfo.track}
        </p>
        <button
          type="button"
          className="vivi-sidebar-activity-link"
          onClick={() => {
            setDisplayMode('compact');
          }}
          title="Return to workstation activity"
        >
          <span>Open learning activity</span>
          <ExternalLink size={11} />
        </button>
      </div>

      {/* How can I help? (Tutoring Modes Grid) */}
      <div className="vivi-sidebar-modes-section">
        <div className="vivi-sidebar-section-title">
          <span>HOW CAN I HELP?</span>
          <span style={{ fontSize: 9.5, color: '#0F766E', fontWeight: 600 }}>Active: {mode.toUpperCase()}</span>
        </div>
        <div className="vivi-sidebar-modes-grid" role="tablist" aria-label="Tutoring Modes">
          {[
            { id: 'explain', icon: '📖', name: 'Explain', desc: 'Clear business concepts & corporate examples' },
            { id: 'guide', icon: '💡', name: 'Guide Me', desc: 'Socratic hints without giving direct answers' },
            { id: 'quiz', icon: '🎯', name: 'Quiz Me', desc: 'Interactive commerce viva & quick practice' },
            { id: 'check', icon: '🔍', name: 'Check Work', desc: 'Critique your solution before submitting' },
          ].map((mItem) => (
            <button
              key={mItem.id}
              type="button"
              className={`vivi-sidebar-mode-card ${mode === mItem.id ? 'active' : ''}`}
              onClick={() => setMode(mItem.id as ViviMode)}
              role="tab"
              aria-selected={mode === mItem.id}
            >
              <div className="vivi-sidebar-mode-header">
                <span>{mItem.name}</span>
                <span className="vivi-sidebar-mode-icon">{mItem.icon}</span>
              </div>
              <div className="vivi-sidebar-mode-desc">{mItem.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Questions Section */}
      <div className="vivi-sidebar-suggestions">
        <div className="vivi-sidebar-section-title">
          <span>SUGGESTED QUESTIONS</span>
          <span style={{ fontSize: 9.5, color: '#64748b' }}>{smartResult.totalCount} prompts</span>
        </div>

        {/* Filter Tabs */}
        <div className="vivi-sidebar-cat-tabs" role="tablist">
          <button
            type="button"
            className={`vivi-sidebar-cat-pill ${activeCategoryTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategoryTab('all')}
          >
            All ({smartResult.totalCount})
          </button>
          <button
            type="button"
            className={`vivi-sidebar-cat-pill ${activeCategoryTab === 'understand' ? 'active' : ''}`}
            onClick={() => setActiveCategoryTab('understand')}
          >
            📘 Understand ({smartResult.categorized.understand.length})
          </button>
          <button
            type="button"
            className={`vivi-sidebar-cat-pill ${activeCategoryTab === 'solve' ? 'active' : ''}`}
            onClick={() => setActiveCategoryTab('solve')}
          >
            🛠️ Solve ({smartResult.categorized.solve.length})
          </button>
          <button
            type="button"
            className={`vivi-sidebar-cat-pill ${activeCategoryTab === 'apply' ? 'active' : ''}`}
            onClick={() => setActiveCategoryTab('apply')}
          >
            🏢 Apply ({smartResult.categorized.apply.length})
          </button>
          <button
            type="button"
            className={`vivi-sidebar-cat-pill ${activeCategoryTab === 'practise' ? 'active' : ''}`}
            onClick={() => setActiveCategoryTab('practise')}
          >
            🎯 Practise ({smartResult.categorized.practise.length})
          </button>
        </div>

        {/* Scrollable list of prompts */}
        <div className="vivi-sidebar-prompts-list">
          {drawerDisplayList.map((item) => {
            const text = getSuggestionText(item);
            const catLabel =
              item.category === 'understand' ? 'Understand' :
              item.category === 'solve' ? 'Solve' :
              item.category === 'apply' ? 'Apply' : 'Practise';
            const icon =
              item.category === 'understand' ? '📘' :
              item.category === 'solve' ? '🛠️' :
              item.category === 'apply' ? '🏢' : '🎯';

            return (
              <button
                key={item.id}
                type="button"
                className="vivi-sidebar-prompt-item"
                onClick={() => {
                  setMobileTab('chat');
                  handleSend(text);
                }}
                disabled={isStreaming}
                title={text}
              >
                <div className="vivi-sidebar-prompt-header">
                  <span className={`vivi-sidebar-prompt-badge ${item.category}`}>
                    {icon} {catLabel}
                  </span>
                  {item.stage && (
                    <span style={{ color: '#64748b' }}>Stage {item.stage}</span>
                  )}
                </div>
                <p className="vivi-sidebar-prompt-text">{text}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Floating Trigger Button */}
      {!isOpen && (
        <button
          className="vivi-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Open Vivi Voice & AI Learning Partner"
        >
          <Sparkles className="vivi-fab-sparkle" size={18} />
          <span>Ask Vivi</span>
          {speechSupported && <Mic size={14} style={{ opacity: 0.8 }} />}
        </button>
      )}

      {/* 2. Chat Drawer Backdrop (Mobile & Expanded Mode) */}
      {isOpen && (
        <div
          className={`vivi-panel-backdrop ${displayMode}`}
          onClick={() => {
            if (displayMode === 'expanded') {
              setDisplayMode('compact');
            } else {
              setIsOpen(false);
            }
          }}
          aria-hidden="true"
        />
      )}

      {/* 3. Main Glassmorphism Conversation Drawer / Workspace */}
      {isOpen && (
        <section
          className={`vivi-panel ${displayMode}`}
          role="dialog"
          aria-modal={displayMode === 'expanded'}
          aria-label="Vivi Voice & AI Learning Partner Panel"
        >
          {/* Header */}
          <div className={`vivi-header ${displayMode === 'expanded' ? 'expanded' : ''}`}>
            <div className="vivi-brand-info">
              <div className="vivi-avatar">
                <Sparkles size={displayMode === 'expanded' ? 18 : 18} />
              </div>
              <div className="vivi-title-group">
                <h3>{displayMode === 'expanded' ? 'Hi, Vivi! · Your AI Learning Partner' : 'Hi, Vivi!'}</h3>
                <p>{displayMode === 'expanded' ? 'Interactive Corporate Learning & Analysis Workspace' : 'Your Voice & AI Learning Partner'}</p>
              </div>
              {displayMode === 'expanded' && (
                <div className="vivi-header-context-pill">
                  <span className="vivi-dot-indicator" />
                  <span>{trackInfo.track}</span>
                  <span>·</span>
                  <span>{currentSessionId ? `Session ${String(currentSessionId).padStart(2, '0')}: ${currentSessionTitle || 'Active Lesson'}` : 'VCEP Commerce WorkLab'}</span>
                </div>
              )}
            </div>

            <div className="vivi-header-actions">
              {/* Auto Voice Toggle */}
              <button
                className={`vivi-icon-btn ${autoVoiceEnabled ? 'vivi-voice-toggle-active' : ''}`}
                onClick={() => {
                  const next = !autoVoiceEnabled;
                  setAutoVoiceEnabled(next);
                  if (!next) {
                    stopAllAudio();
                  }
                }}
                title={autoVoiceEnabled ? 'Voice Readout: ON (Click to Mute)' : 'Voice Readout: OFF (Click to Enable)'}
                aria-label="Toggle voice readout"
              >
                {autoVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Language Switcher */}
              <div className="vivi-lang-toggle" title="Switch Language">
                <button
                  className={`vivi-lang-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  EN
                </button>
                <button
                  className={`vivi-lang-btn ${language === 'kn' ? 'active' : ''}`}
                  onClick={() => setLanguage('kn')}
                >
                  ಕನ್ನಡ
                </button>
                <button
                  className={`vivi-lang-btn ${language === 'kn-en' ? 'active' : ''}`}
                  onClick={() => setLanguage('kn-en')}
                >
                  Mix
                </button>
              </div>

              {/* Reset Chat */}
              <button
                className="vivi-icon-btn"
                onClick={handleResetChat}
                title="New Conversation"
                aria-label="Start new conversation"
              >
                <RotateCcw size={15} />
              </button>

              {/* Expand / Minimise Toggle */}
              {displayMode === 'compact' ? (
                <button
                  className="vivi-icon-btn vivi-expand-btn"
                  onClick={() => setDisplayMode('expanded')}
                  title="Expand to Learning Workspace"
                  aria-label="Expand to Learning Workspace"
                >
                  <Maximize2 size={16} />
                </button>
              ) : (
                <button
                  className="vivi-icon-btn vivi-expand-btn"
                  onClick={() => setDisplayMode('compact')}
                  title="Minimise to Compact Chat"
                  aria-label="Minimise to Compact Chat"
                >
                  <Minimize2 size={16} />
                </button>
              )}

              {/* Close Button */}
              <button
                className="vivi-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close Vivi"
                aria-label="Close Vivi panel"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ================= COMPACT MODE LAYOUT ================= */}
          {displayMode === 'compact' && (
            <>
              {/* Context Banner */}
              <div className="vivi-context-bar">
                <span className="vivi-context-tag">
                  <span className="vivi-dot-indicator" />
                  {currentSessionId
                    ? `Session ${String(currentSessionId).padStart(2, '0')}: ${
                        currentSessionTitle || 'Active Lesson'
                      }`
                    : 'VCEP Workspace'}
                </span>
                {autoVoiceEnabled && (
                  <span className="vivi-voice-status-pill">
                    <Volume2 size={11} /> Voice Active
                  </span>
                )}
              </div>

              {/* Mode Selector */}
              <div className="vivi-mode-bar" role="tablist" aria-label="Tutoring Modes">
                <button
                  className={`vivi-mode-pill ${mode === 'explain' ? 'active' : ''}`}
                  onClick={() => setMode('explain')}
                  role="tab"
                  aria-selected={mode === 'explain'}
                >
                  📖 Explain
                </button>
                <button
                  className={`vivi-mode-pill ${mode === 'guide' ? 'active' : ''}`}
                  onClick={() => setMode('guide')}
                  role="tab"
                  aria-selected={mode === 'guide'}
                  title="Socratic hints without giving direct answers"
                >
                  💡 Guide Me
                </button>
                <button
                  className={`vivi-mode-pill ${mode === 'quiz' ? 'active' : ''}`}
                  onClick={() => setMode('quiz')}
                  role="tab"
                  aria-selected={mode === 'quiz'}
                >
                  🎯 Quiz Me
                </button>
                <button
                  className={`vivi-mode-pill ${mode === 'check' ? 'active' : ''}`}
                  onClick={() => setMode('check')}
                  role="tab"
                  aria-selected={mode === 'check'}
                >
                  🔍 Check My Thinking
                </button>
              </div>

              {/* Messages Stream */}
              {renderMessageList(false)}

              {/* Voice Listening Active Banner */}
              {isListening && (
                <div className="vivi-listening-banner">
                  <div className="vivi-listening-info">
                    <span className="vivi-audio-wave">
                      <span className="vivi-wave-bar" />
                      <span className="vivi-wave-bar" />
                      <span className="vivi-wave-bar" />
                      <span className="vivi-wave-bar" />
                    </span>
                    <span>Listening in {language === 'kn' ? 'Kannada' : 'English'}... Speak now</span>
                  </div>
                  <button
                    className="vivi-icon-btn"
                    onClick={toggleListening}
                    style={{ padding: '2px 6px', fontSize: 11 }}
                  >
                    Done
                  </button>
                </div>
              )}

              {/* Smart Contextual Suggestions Area */}
              <div className="vivi-smart-suggestions-container">
                <div className="vivi-suggestions-header">
                  <div className="vivi-suggestions-header-left">
                    <Sparkles size={13} className="vivi-sparkle-icon" />
                    <span className="vivi-suggestions-label">
                      {language === 'kn' ? 'ನಿಮಗಾಗಿ ಶಿಫಾರಸುಗಳು' : 'Suggested for you'}
                    </span>
                    {currentSessionId && (
                      <span className="vivi-suggestions-context-tag">
                        Session {String(currentSessionId).padStart(2, '0')}
                        {currentStage ? ` · Stage ${currentStage}` : ''}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="vivi-suggestions-toggle-btn"
                    onClick={() => setShowAllSuggestions((prev) => !prev)}
                    aria-expanded={showAllSuggestions}
                    title="View all categorized suggestions"
                  >
                    <span>
                      {showAllSuggestions
                        ? (language === 'kn' ? 'ಮುಚ್ಚಿ' : 'Hide')
                        : (language === 'kn' ? `ಎಲ್ಲಾ ${smartResult.totalCount}+ ಪ್ರಶ್ನೆಗಳು` : `All ${smartResult.totalCount}+ questions`)}
                    </span>
                    {showAllSuggestions ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>

                {/* Primary Pills (Clean, unclipped wrapping row, top 3) */}
                {!showAllSuggestions && (
                  <div className="vivi-primary-suggestions-wrap">
                    {smartResult.primary.slice(0, 3).map((item) => {
                      const text = getSuggestionText(item);
                      const icon =
                        item.category === 'understand' ? '📘' :
                        item.category === 'solve' ? '🛠️' :
                        item.category === 'apply' ? '🏢' : '🎯';

                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`vivi-smart-pill ${item.category}`}
                          onClick={() => handleSend(text)}
                          disabled={isStreaming}
                          title={text}
                        >
                          <span className="vivi-smart-pill-icon">{icon}</span>
                          <span className="vivi-smart-pill-text">{text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Expanded Drawer of All Categorized Suggestions */}
                {showAllSuggestions && (
                  <div className="vivi-suggestions-expanded-drawer">
                    <div className="vivi-suggestions-category-tabs" role="tablist">
                      <button
                        type="button"
                        className={`vivi-cat-tab ${activeCategoryTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveCategoryTab('all')}
                      >
                        {language === 'kn' ? 'ಎಲ್ಲಾ' : 'All'} ({smartResult.totalCount})
                      </button>
                      <button
                        type="button"
                        className={`vivi-cat-tab ${activeCategoryTab === 'understand' ? 'active' : ''}`}
                        onClick={() => setActiveCategoryTab('understand')}
                      >
                        📘 {language === 'kn' ? 'ತಿಳಿಯಿರಿ' : 'Understand'} ({smartResult.categorized.understand.length})
                      </button>
                      <button
                        type="button"
                        className={`vivi-cat-tab ${activeCategoryTab === 'solve' ? 'active' : ''}`}
                        onClick={() => setActiveCategoryTab('solve')}
                      >
                        🛠️ {language === 'kn' ? 'ಪರಿಹರಿಸಿ' : 'Solve'} ({smartResult.categorized.solve.length})
                      </button>
                      <button
                        type="button"
                        className={`vivi-cat-tab ${activeCategoryTab === 'apply' ? 'active' : ''}`}
                        onClick={() => setActiveCategoryTab('apply')}
                      >
                        🏢 {language === 'kn' ? 'ಅನ್ವಯಿಸಿ' : 'Apply'} ({smartResult.categorized.apply.length})
                      </button>
                      <button
                        type="button"
                        className={`vivi-cat-tab ${activeCategoryTab === 'practise' ? 'active' : ''}`}
                        onClick={() => setActiveCategoryTab('practise')}
                      >
                        🎯 {language === 'kn' ? 'ಅಭ್ಯಾಸ' : 'Practise'} ({smartResult.categorized.practise.length})
                      </button>
                    </div>

                    <div className="vivi-suggestions-cards-list">
                      {drawerDisplayList.map((item) => {
                        const text = getSuggestionText(item);
                        const catLabel =
                          item.category === 'understand' ? (language === 'kn' ? 'ತಿಳಿಯಿರಿ' : 'Understand') :
                          item.category === 'solve' ? (language === 'kn' ? 'ಪರಿಹರಿಸಿ' : 'Solve') :
                          item.category === 'apply' ? (language === 'kn' ? 'ಅನ್ವಯಿಸಿ' : 'Apply') :
                          (language === 'kn' ? 'ಅಭ್ಯಾಸ' : 'Practise');

                        const icon =
                          item.category === 'understand' ? '📘' :
                          item.category === 'solve' ? '🛠️' :
                          item.category === 'apply' ? '🏢' : '🎯';

                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`vivi-suggestion-card-item ${item.category}`}
                            onClick={() => {
                              setShowAllSuggestions(false);
                              handleSend(text);
                            }}
                            disabled={isStreaming}
                          >
                            <div className="vivi-suggestion-card-header">
                              <span className={`vivi-suggestion-card-badge ${item.category}`}>
                                {icon} {catLabel}
                              </span>
                              {item.stage && (
                                <span className="vivi-suggestion-card-stage">
                                  Stage {item.stage}
                                </span>
                              )}
                            </div>
                            <p className="vivi-suggestion-card-text">{text}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              {renderComposer(false)}

              {/* AI Voice Disclosure */}
              <div className="vivi-footer-disclosure">
                <span>Vivi Voice is an AI-generated learning assistant.</span>
              </div>
            </>
          )}

          {/* ================= EXPANDED LEARNING WORKSPACE LAYOUT ================= */}
          {displayMode === 'expanded' && (
            <>
              {/* Mobile Tab Switcher (Chat / Explore) */}
              <div className="vivi-mobile-nav-tabs">
                <button
                  type="button"
                  className={`vivi-mobile-tab-btn ${mobileTab === 'chat' ? 'active' : ''}`}
                  onClick={() => setMobileTab('chat')}
                >
                  💬 Conversation
                </button>
                <button
                  type="button"
                  className={`vivi-mobile-tab-btn ${mobileTab === 'explore' ? 'active' : ''}`}
                  onClick={() => setMobileTab('explore')}
                >
                  🧭 Explore Prompts & Modes ({smartResult.totalCount})
                </button>
              </div>

              {/* Dual-Pane Body Container */}
              <div className="vivi-expanded-body">
                {/* Left Sidebar (Always rendered; mobile visibility handled by CSS) */}
                {renderSidebar()}

                {/* Right Main Panel (Always rendered; mobile visibility handled by CSS) */}
                <div className={`vivi-expanded-main ${mobileTab === 'chat' ? 'mobile-visible' : 'mobile-hidden'}`}>
                    {/* Top Mode Status Bar */}
                    <div className="vivi-expanded-top-bar">
                      <div className="vivi-expanded-top-mode">
                        <span>
                          {mode === 'explain' ? '📖 Concept Explanation' :
                           mode === 'guide' ? '💡 Socratic Guidance' :
                           mode === 'quiz' ? '🎯 Quick Viva & Quiz' : '🔍 Draft Check & Critique'}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: '#64748b' }}>
                        Session {String(currentSessionId || 1).padStart(2, '0')} · {language.toUpperCase()}
                      </span>
                    </div>

                    {/* Messages Stream */}
                    {renderMessageList(true)}

                    {/* Voice Listening Active Banner */}
                    {isListening && (
                      <div className="vivi-listening-banner">
                        <div className="vivi-listening-info">
                          <span className="vivi-audio-wave">
                            <span className="vivi-wave-bar" />
                            <span className="vivi-wave-bar" />
                            <span className="vivi-wave-bar" />
                            <span className="vivi-wave-bar" />
                          </span>
                          <span>Listening in {language === 'kn' ? 'Kannada' : 'English'}... Speak now</span>
                        </div>
                        <button
                          className="vivi-icon-btn"
                          onClick={toggleListening}
                          style={{ padding: '2px 6px', fontSize: 11 }}
                        >
                          Done
                        </button>
                      </div>
                    )}

                    {/* Anchored Composer */}
                    {renderComposer(true)}

                    {/* Composer Helper Hint Row */}
                    <div className="vivi-input-hint-row">
                      <span>Press <strong>Enter</strong> to send · <strong>Shift+Enter</strong> for new line</span>
                      <span className="vivi-footer-disclosure">Vivi Voice is an AI-generated learning partner.</span>
                    </div>
                  </div>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
