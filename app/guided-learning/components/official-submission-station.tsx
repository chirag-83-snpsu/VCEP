'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import baseSessions from '@/lib/sessions.json';
import { requiredAnswers, totalGrade } from '@/lib/rules';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
  Save,
  RotateCcw,
  Sparkles,
  FileText,
  Award,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Check,
  HelpCircle,
  ExternalLink,
  Paperclip,
  UploadCloud,
  FileUp,
  Download,
} from 'lucide-react';

interface OfficialSubmissionStationProps {
  session: number;
  user: any;
  draftAnswers: Record<string, string>;
  onUpdateDraftAnswer: (key: string, value: string) => void;
  onUpdateBatch?: (updates: Record<string, string>) => void;
  bootSubmissions?: any[];
  onSubmissionSuccess?: () => void;
}

interface CloudDraftState {
  answers: Record<string, string>;
  revision: number;
  status: string;
  updated?: string;
}

export function OfficialSubmissionStation({
  session,
  user,
  draftAnswers,
  onUpdateDraftAnswer,
  onUpdateBatch,
  bootSubmissions = [],
  onSubmissionSuccess,
}: OfficialSubmissionStationProps) {
  const [localSyncAnswers, setLocalSyncAnswers] = useState<Record<string, string>>({});
  const [cloudDraft, setCloudDraft] = useState<CloudDraftState | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [integrityChecked, setIntegrityChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [recentReceipt, setRecentReceipt] = useState<any>(null);
  const [answersExpanded, setAnswersExpanded] = useState(true);
  const [evidenceFiles, setEvidenceFiles] = useState<any[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sessionDef = useMemo(() => {
    return (baseSessions as any[]).find((s) => s.id === session) || (baseSessions as any[])[0];
  }, [session]);

  // Find existing official submission from boot
  const existingSubmission = useMemo(() => {
    return (bootSubmissions || []).find((s: any) => s.session === session) || recentReceipt;
  }, [bootSubmissions, session, recentReceipt]);

  // Determine current active status
  const currentStatus = useMemo(() => {
    if (existingSubmission?.status) return existingSubmission.status;
    if (cloudDraft?.status) return cloudDraft.status;
    return 'Draft';
  }, [existingSubmission, cloudDraft]);

  const isSubmittedOrGraded = ['Submitted', 'Under review', 'Graded'].includes(currentStatus);
  const isReturned = currentStatus === 'Returned';
  const isGraded = currentStatus === 'Graded' || Boolean(existingSubmission?.grade);

  // Parse grade if present
  const parsedGrade = useMemo(() => {
    if (!existingSubmission?.grade) return null;
    try {
      return typeof existingSubmission.grade === 'string'
        ? JSON.parse(existingSubmission.grade)
        : existingSubmission.grade;
    } catch {
      return null;
    }
  }, [existingSubmission]);

  const gradeScore = useMemo(() => {
    if (!parsedGrade) return null;
    return totalGrade(parsedGrade);
  }, [parsedGrade]);

  // Load cloud draft from server on session change
  const loadCloudDraft = useCallback(async () => {
    if (!user || user.role !== 'student') return;
    setLoadingDraft(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/draft/${session}`);
      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.uploads && Array.isArray(data.uploads)) {
          setEvidenceFiles(data.uploads);
        }
        if (data.draft) {
          const loadedAnswers =
            typeof data.draft.answers === 'string'
              ? JSON.parse(data.draft.answers)
              : data.draft.answers || {};
          setCloudDraft({
            answers: loadedAnswers,
            revision: data.draft.revision ?? 0,
            status: data.draft.status ?? 'Draft',
            updated: data.draft.updated,
          });

          // Sync cloud answers to parent draft state if local answer is empty
          for (const [k, v] of Object.entries(loadedAnswers)) {
            if (typeof v === 'string' && v.trim() && !draftAnswers[k]) {
              onUpdateDraftAnswer(k, v);
            }
          }
        }
      }
    } catch {
      // offline or unauthenticated fallback
    } finally {
      setLoadingDraft(false);
    }
  }, [session, user, onUpdateDraftAnswer, draftAnswers]);

  useEffect(() => {
    loadCloudDraft();
  }, [session, user?.id]);

  // Read evidence files from existing submission or local uploads
  const displayEvidenceFiles = useMemo(() => {
    if (existingSubmission?.answers) {
      try {
        const a =
          typeof existingSubmission.answers === 'string'
            ? JSON.parse(existingSubmission.answers)
            : existingSubmission.answers;
        if (a?._evidence) {
          const files = typeof a._evidence === 'string' ? JSON.parse(a._evidence) : a._evidence;
          if (Array.isArray(files) && files.length > 0) return files;
        }
      } catch {}
    }
    return evidenceFiles;
  }, [existingSubmission, evidenceFiles]);

  // Upload Evidence File Handler
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File exceeds the 5 MB limit. Please select a smaller file.');
      return;
    }
    setUploadingFile(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/upload/${session}`, {
        method: 'POST',
        body: formData,
      });
      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload evidence file.');
      }
      setEvidenceFiles((prev) => [...prev, data]);
      setSuccessMsg(`Evidence file "${data.filename}" (${Math.round(data.size / 1024)} KB) attached.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Evidence upload failed.');
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Compile combined answers: draftAnswers + cloudDraft.answers + localSyncAnswers
  const combinedAnswers = useMemo(() => {
    return {
      ...(cloudDraft?.answers || {}),
      ...draftAnswers,
      ...localSyncAnswers,
    };
  }, [cloudDraft, draftAnswers, localSyncAnswers]);

  // Check required fields based on official rules
  const missingFields = useMemo(() => {
    if (!sessionDef) return [];
    return requiredAnswers(sessionDef, combinedAnswers);
  }, [sessionDef, combinedAnswers]);

  const totalRequiredCount = useMemo(() => {
    if (!sessionDef) return 7;
    return requiredAnswers(sessionDef, {}).length;
  }, [sessionDef]);

  const completedCount = Math.max(0, totalRequiredCount - missingFields.length);
  const completionPercentage = Math.round((completedCount / totalRequiredCount) * 100);

  // Handle local and parent answer changes
  const handleAnswerChange = (key: string, value: string) => {
    setLocalSyncAnswers((prev) => ({ ...prev, [key]: value }));
    onUpdateDraftAnswer(key, value);
  };

  // Copy only an actual student-written response where its curriculum field mapping
  // is reviewed and explicit. Never insert worked examples, answers, or governance
  // declarations to satisfy official assessment requirements.
  const handleSyncFromTaskCards = () => {
    if (session === 1 || session === 22) {
      setErrorMsg('Controlled assessment answers must be completed independently under faculty instructions. No automatic answer transfer is available.');
      return;
    }

    // Session 03 has a verified one-to-one match with its approved workbook:
    // clarification email, 40-word progress update, 70-word escalation message.
    // Other sessions must be mapped individually against source workbooks before
    // automatic transfer is enabled. Students can always submit manually.
    const fieldMappings: Record<number, Record<string, string>> = {
      3: {
        b0r0c1: 'work-prompt:0',
        b0r1c1: 'work-prompt:1',
        b0r2c1: 'work-prompt:2',
      },
    };
    const mapping = fieldMappings[session] || {};
    const newAnswers: Record<string, string> = {};
    for (const [officialKey, workKey] of Object.entries(mapping)) {
      const authored = draftAnswers[workKey];
      if (!combinedAnswers[officialKey]?.trim() && typeof authored === 'string' && authored.trim()) {
        newAnswers[officialKey] = authored;
      }
    }

    const count = Object.keys(newAnswers).length;
    if (count === 0) {
      setSuccessMsg('No eligible student-written task responses found. Please enter your own required answers and evidence in the official fields below.');
      return;
    }
    setLocalSyncAnswers((prev) => ({ ...prev, ...newAnswers }));
    if (onUpdateBatch) onUpdateBatch(newAnswers);
    else for (const [key, value] of Object.entries(newAnswers)) onUpdateDraftAnswer(key, value);
    setErrorMsg(null);
    setSuccessMsg(`Copied ${count} student-written field(s). Check them before saving or submitting.`);
  };

  // Save Cloud Draft
  const handleSaveDraft = async () => {
    if (!user) {
      setErrorMsg('Please sign in with your enrolled student account to save cloud work.');
      return;
    }
    setSavingDraft(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const currentRev = cloudDraft?.revision ?? 0;
      const sanitizedAnswers: Record<string, string> = {};
      for (const [k, v] of Object.entries(combinedAnswers)) {
        if (typeof v === 'string' && /^[\w:-]{1,80}$/.test(k)) {
          sanitizedAnswers[k] = v;
        }
      }

      const res = await fetch(`/api/draft/${session}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: sanitizedAnswers,
          revision: currentRev,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save cloud draft.');
      }

      setCloudDraft({
        answers: data.answers || combinedAnswers,
        revision: data.revision,
        status: cloudDraft?.status || 'Draft',
        updated: data.updated,
      });

      setSuccessMsg(`Cloud draft saved (Revision ${data.revision}) at ${new Date(data.updated).toLocaleTimeString()}.`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving cloud draft.');
    } finally {
      setSavingDraft(false);
    }
  };

  // Submit Official Attempt
  const handleSubmitOfficial = async () => {
    if (!user) {
      setErrorMsg('Please sign in with your enrolled student account to submit.');
      return;
    }

    if (!integrityChecked) {
      setErrorMsg('You must check the Attributable Work & Integrity Declaration before submitting.');
      return;
    }

    if (missingFields.length > 0) {
      setErrorMsg(`Cannot submit: ${missingFields.length} required field(s) still need completion.`);
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Ensure latest changes are saved to cloud draft first
      const currentRev = cloudDraft?.revision ?? 0;
      const sanitizedAnswers: Record<string, string> = {};
      for (const [k, v] of Object.entries(combinedAnswers)) {
        if (typeof v === 'string' && /^[\w:-]{1,80}$/.test(k)) {
          sanitizedAnswers[k] = v;
        }
      }

      const saveRes = await fetch(`/api/draft/${session}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: sanitizedAnswers,
          revision: currentRev,
        }),
      });

      const saveData = (await saveRes.json()) as any;
      if (!saveRes.ok) {
        throw new Error(saveData.error || 'Failed to save changes before submission.');
      }

      const confirmedRevision = saveData.revision;

      // 2. Submit official attempt
      const submitRes = await fetch(`/api/submit/${session}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revision: confirmedRevision,
          integrity: true,
        }),
      });

      const submitData = (await submitRes.json()) as any;
      if (!submitRes.ok) {
        throw new Error(submitData.error || 'Official submission failed.');
      }

      setRecentReceipt(submitData);
      setCloudDraft((prev) => (prev ? { ...prev, status: 'Submitted', revision: confirmedRevision } : null));
      setSuccessMsg(`Official attempt submitted successfully! Receipt: ${submitData.receipt}`);

      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting official attempt.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="vcep-official-submission-station"
      data-testid="official-submission-station"
      style={{
        marginTop: '36px',
        marginBottom: '48px',
        background: '#ffffff',
        border: isGraded ? '2px solid #0f766e' : isSubmittedOrGraded ? '2px solid #0284c7' : '1px solid #DCE5E9',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(18, 43, 58, 0.06)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
      aria-label="Official Assessment and Submission Station"
    >
      {/* 1. Header Banner */}
      <div
        style={{
          padding: '24px 28px',
          background: isGraded
            ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)'
            : isSubmittedOrGraded
            ? 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)'
            : isReturned
            ? 'linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)'
            : 'linear-gradient(135deg, #fafbfc 0%, #ffffff 100%)',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isGraded ? '#0f766e' : isSubmittedOrGraded ? '#0284c7' : '#64748B',
              }}
            >
              OFFICIAL ASSESSMENT & SUBMISSION · SESSION {String(session).padStart(2, '0')}: {session === 1 ? 'Start a Business. Think Like a Founder.' : sessionDef.title}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700,
                background: isGraded
                  ? '#dcfce7'
                  : isSubmittedOrGraded
                  ? '#e0f2fe'
                  : isReturned
                  ? '#ffe4e6'
                  : '#f1f5f9',
                color: isGraded
                  ? '#166534'
                  : isSubmittedOrGraded
                  ? '#0369a1'
                  : isReturned
                  ? '#9f1239'
                  : '#475569',
              }}
            >
              {isGraded ? (
                <>
                  <Award size={14} /> Graded ({gradeScore}/10 Marks)
                </>
              ) : currentStatus === 'Submitted' ? (
                <>
                  <ShieldCheck size={14} /> Submitted · In Faculty Review Queue
                </>
              ) : currentStatus === 'Under review' ? (
                <>
                  <Clock size={14} /> Under Faculty Review
                </>
              ) : isReturned ? (
                <>
                  <RotateCcw size={14} /> Returned for Revision
                </>
              ) : (
                <>
                  <FileText size={14} /> Working Draft
                </>
              )}
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            {isGraded
              ? 'Official Faculty Assessment & Grade Certification'
              : isSubmittedOrGraded
              ? 'Official Attempt Submitted & Verified'
              : isReturned
              ? 'Attempt Returned — Revision Required'
              : 'Submit Session Worksheet for Faculty Review'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', margin: 0 }}>
            {isGraded
              ? 'Your submission has been reviewed and graded against the 10-point VCEP commercial competency rubric.'
              : isSubmittedOrGraded
              ? 'Your answers are locked in the institutional registry and routed to your faculty review queue.'
              : isReturned
              ? 'Review your faculty feedback below, update your answers, and resubmit your revised attempt.'
              : 'Review your case answers, confirm attributable integrity, and submit your official attempt for faculty grading.'}
          </p>
        </div>

        {/* Progress or Score Chip */}
        <div style={{ textAlign: 'right' }}>
          {isGraded ? (
            <div
              style={{
                background: '#0f766e',
                color: '#ffffff',
                padding: '10px 18px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                FINAL SCORE
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, lineHeight: 1.1 }}>
                {gradeScore} <span style={{ fontSize: '14px', fontWeight: 500 }}>/ 10</span>
              </div>
            </div>
          ) : !isSubmittedOrGraded ? (
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                textAlign: 'right',
              }}
            >
              <div style={{ color: '#64748B', fontSize: '11px', fontWeight: 600 }}>READINESS</div>
              <div style={{ fontWeight: 700, color: completedCount === totalRequiredCount ? '#0f766e' : '#D97706' }}>
                {completedCount} of {totalRequiredCount} required fields complete ({completionPercentage}%)
              </div>
            </div>
          ) : (
            <div
              style={{
                background: '#F0F9FF',
                border: '1px solid #BAE6FD',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                textAlign: 'right',
              }}
            >
              <div style={{ color: '#0369a1', fontSize: '11px', fontWeight: 600 }}>SUBMISSION RECEIPT</div>
              <div style={{ fontWeight: 700, color: '#0369a1', fontFamily: 'monospace' }}>
                {(existingSubmission?.id || recentReceipt?.receipt || '').slice(0, 18)}...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Feedback / Alerts Banner */}
      {errorMsg && (
        <div
          role="alert"
          style={{
            margin: '16px 28px 0',
            padding: '12px 16px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            color: '#991B1B',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          style={{
            margin: '16px 28px 0',
            padding: '12px 16px',
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: '8px',
            color: '#166534',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3. GRADED VIEW: Official Rubric Score & Written Feedback */}
      {isGraded && (
        <div style={{ padding: '24px 28px' }}>
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Official 10-Point Rubric Breakdown
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
              }}
            >
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>EXECUTION & ACCURACY</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f766e', marginTop: '4px' }}>
                  {parsedGrade?.execution ?? '—'} <span style={{ fontSize: '13px', color: '#94A3B8' }}>/ 4</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Calculation correctness</div>
              </div>

              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>REASONING & METHOD</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f766e', marginTop: '4px' }}>
                  {parsedGrade?.reasoning ?? '—'} <span style={{ fontSize: '13px', color: '#94A3B8' }}>/ 2</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Analysis & deduction</div>
              </div>

              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>COMMUNICATION</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f766e', marginTop: '4px' }}>
                  {parsedGrade?.communication ?? '—'} <span style={{ fontSize: '13px', color: '#94A3B8' }}>/ 2</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Clarity & brevity</div>
              </div>

              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>PROCESS & VERIFICATION</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f766e', marginTop: '4px' }}>
                  {parsedGrade?.process ?? '—'} <span style={{ fontSize: '13px', color: '#94A3B8' }}>/ 2</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Audit trail & integrity</div>
              </div>
            </div>

            {/* Written Faculty Feedback */}
            {existingSubmission?.feedback && (
              <div
                style={{
                  marginTop: '18px',
                  padding: '16px',
                  background: '#ffffff',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  Faculty Review Commentary:
                </div>
                <blockquote
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: '#334155',
                    fontStyle: 'italic',
                    borderLeft: '3px solid #0f766e',
                    paddingLeft: '12px',
                  }}
                >
                  "{existingSubmission.feedback}"
                </blockquote>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B' }}>
            <span>Submission Receipt: <code style={{ color: '#0F172A' }}>{existingSubmission?.id}</code></span>
            <span>Reviewed & Graded by Institutional Faculty</span>
          </div>

          {displayEvidenceFiles && displayEvidenceFiles.length > 0 && (
            <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Paperclip size={14} color="#0f766e" /> Attached Evidence Documents ({displayEvidenceFiles.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {displayEvidenceFiles.map((file: any, fIdx: number) => (
                  <div key={file.id || fIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{file.filename} ({file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Verified'})</span>
                    {file.id && (
                      <a href={`/api/file/${file.id}`} download={file.filename} style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 600 }}>Download Evidence</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. RETURNED VIEW: Notice of Revision Required */}
      {isReturned && (
        <div style={{ padding: '20px 28px', background: '#FFF1F2', borderBottom: '1px solid #FECDD3' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <RotateCcw size={20} color="#E11D48" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '14px', color: '#9F1239', display: 'block' }}>
                Revision Requested by Faculty Reviewer
              </strong>
              <p style={{ fontSize: '13px', color: '#881337', marginTop: '4px', lineHeight: '1.5' }}>
                {existingSubmission?.feedback ||
                  'Your faculty reviewer has returned this attempt for refinement. Please update your answers below and resubmit.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUBMITTED (LOCKED) RECEIPT CARD */}
      {isSubmittedOrGraded && !isGraded && (
        <div style={{ padding: '24px 28px' }}>
          <div
            style={{
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <ShieldCheck size={24} color="#0284c7" />
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0369A1' }}>
                  Official Attempt Recorded & Locked
                </h3>
                <span style={{ fontSize: '12px', color: '#0284C7' }}>
                  Awaiting review by your assigned faculty evaluator
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginTop: '16px',
                background: '#ffffff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #E0F2FE',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>RECEIPT IDENTIFIER</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace', marginTop: '2px' }}>
                  {existingSubmission?.id || recentReceipt?.receipt}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>SUBMITTED AT</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>
                  {existingSubmission?.created ? new Date(existingSubmission.created).toLocaleString() : 'Just now'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>TIMELINESS STATUS</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: existingSubmission?.late ? '#D97706' : '#166534', marginTop: '2px' }}>
                  {existingSubmission?.late ? 'Submitted Late' : 'On-Time Submission'}
                </div>
              </div>
            </div>

            {displayEvidenceFiles && displayEvidenceFiles.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #BAE6FD' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0369A1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Paperclip size={14} color="#0284c7" /> Attached Evidence Documents ({displayEvidenceFiles.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {displayEvidenceFiles.map((file: any, fIdx: number) => (
                    <div key={file.id || fIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#ffffff', border: '1px solid #BAE6FD', borderRadius: '6px', fontSize: '12px' }}>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{file.filename} ({file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Attached'})</span>
                      {file.id && (
                        <a href={`/api/file/${file.id}`} download={file.filename} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>Download Evidence</a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p style={{ fontSize: '12px', color: '#0369A1', marginTop: '14px', lineHeight: '1.5' }}>
              <strong>Notice:</strong> Your worksheet and attributable declaration are locked against edits during faculty evaluation. Once graded, your score breakdown and written feedback will automatically appear here.
            </p>
          </div>
        </div>
      )}

      {/* 6. WORKING ANSWERS & SUBMISSION SECTION (Active when Draft or Returned) */}
      {(!isSubmittedOrGraded || isReturned) && (
        <div style={{ padding: '24px 28px' }}>
          {/* Action to sync from tasks */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '14px 18px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              marginBottom: '24px',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Completed the task cards above?
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Only your own completed responses may be transferred. Review every official answer and attach required evidence. No model answers or declarations are auto-filled.
              </div>
            </div>
            {session === 3 && <button
              type="button"
              onClick={handleSyncFromTaskCards}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: '#ffffff',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#0f766e',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={14} />
              Copy My Written Messages
            </button>}
          </div>

          {/* Section: The 3 Calculation / Decision Verification Answers */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              1. Required Work & Evidence (Block 0)
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
              Enter your original work for each required item. Include calculations, written responses, and source references as appropriate to this session.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {sessionDef.blocks?.[0]?.rows?.map((row: any[], rIndex: number) => {
                const promptText = row[0] || `Verification Check ${rIndex + 1}`;
                const fieldKey = `b0r${rIndex}c1`;
                const value = combinedAnswers[fieldKey] || '';
                const isComplete = Boolean(value.trim());

                return (
                  <div
                    key={fieldKey}
                    style={{
                      padding: '14px 16px',
                      background: '#ffffff',
                      border: isComplete ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                      borderRadius: '8px',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label
                        htmlFor={fieldKey}
                        style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span>Row {rIndex + 1}: {promptText}</span>
                        <span style={{ color: '#E11D48', fontWeight: 700 }}>*</span>
                      </label>
                      {isComplete && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                          <Check size={12} /> Complete
                        </span>
                      )}
                    </div>
                    <input
                      id={fieldKey}
                      type="text"
                      placeholder={`Enter answer / short working for: ${promptText}`}
                      value={value}
                      onChange={(e) => handleAnswerChange(fieldKey, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '13px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        background: '#F8FAFC',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Synthesis Decision */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              2. Professional Summary & Judgement (Block 1)
            </h3>
            <div
              style={{
                padding: '16px',
                background: '#ffffff',
                border: combinedAnswers['b1']?.trim() ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="submission-b1" style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                  {sessionDef.blocks?.[1]?.title || 'Synthesis Recommendation'} <span style={{ color: '#E11D48' }}>*</span>
                </label>
                {combinedAnswers['b1']?.trim() && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                    <Check size={12} /> Complete
                  </span>
                )}
              </div>
              <textarea
                id="submission-b1"
                rows={3}
                placeholder="Summarize your own conclusion or recommendation, using the evidence relevant to this session..."
                value={combinedAnswers['b1'] || ''}
                onChange={(e) => handleAnswerChange('b1', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '13px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  background: '#F8FAFC',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Section: Supporting Evidence & Attachments */}
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  3. Supporting Evidence & Attachments (Optional, up to 5 files)
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', margin: 0 }}>
                  Upload spreadsheets, slides, clean data, or PDF documentation (PNG, JPEG, PDF, DOCX · Max 5 MB each).
                </p>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadFile}
                  accept=".png,.jpeg,.jpg,.pdf,.docx"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile || (displayEvidenceFiles?.length || 0) >= 5}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: '#ffffff',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#0f766e',
                    cursor: uploadingFile || (displayEvidenceFiles?.length || 0) >= 5 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <UploadCloud size={15} />
                  {uploadingFile ? 'Uploading...' : 'Attach Evidence File'}
                </button>
              </div>
            </div>

            {displayEvidenceFiles && displayEvidenceFiles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {displayEvidenceFiles.map((file: any, fIdx: number) => (
                  <div
                    key={file.id || fIdx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Paperclip size={16} color="#0f766e" />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{file.filename}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Attached Evidence'} · {file.mime || 'Document'}
                        </div>
                      </div>
                    </div>
                    {file.id && (
                      <a
                        href={`/api/file/${file.id}`}
                        download={file.filename}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#0f766e',
                          textDecoration: 'none',
                          padding: '4px 10px',
                          background: '#E6FFFA',
                          borderRadius: '6px',
                        }}
                      >
                        <Download size={13} /> View / Download
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '16px',
                  background: '#F8FAFC',
                  border: '1px dashed #CBD5E1',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#64748B',
                  fontSize: '12px',
                  marginTop: '10px',
                }}
              >
                No evidence files attached yet. You can attach your case spreadsheet, presentation slides, or audit export.
              </div>
            )}
          </div>

          {/* Section: Attributability & Governance (contribution, aiUse, reflection) */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              4. Attributable Governance & AI Disclosure
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
              Declare your individual contribution, disclose AI interaction, and log quality verification.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Contribution */}
              <div
                style={{
                  padding: '14px 16px',
                  background: '#ffffff',
                  border: combinedAnswers['contribution']?.trim() ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label htmlFor="submission-contribution" style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    My Individual Contribution (1 sentence) <span style={{ color: '#E11D48' }}>*</span>
                  </label>
                  {combinedAnswers['contribution']?.trim() && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                      <Check size={12} /> Complete
                    </span>
                  )}
                </div>
                <input
                  id="submission-contribution"
                  type="text"
                  placeholder="e.g. I verified the invoice receipts against the GL register and resolved the 3 duplicate entries."
                  value={combinedAnswers['contribution'] || ''}
                  onChange={(e) => handleAnswerChange('contribution', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    background: '#F8FAFC',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* AI Disclosure */}
              <div
                style={{
                  padding: '14px 16px',
                  background: '#ffffff',
                  border: combinedAnswers['aiUse']?.trim() ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label htmlFor="submission-aiUse" style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    AI Usage & Verification (max 40 words, or "No AI used") <span style={{ color: '#E11D48' }}>*</span>
                  </label>
                  {combinedAnswers['aiUse']?.trim() && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                      <Check size={12} /> Complete
                    </span>
                  )}
                </div>
                <input
                  id="submission-aiUse"
                  type="text"
                  placeholder="e.g. No AI used; verified calculations manually against original case vouchers."
                  value={combinedAnswers['aiUse'] || ''}
                  onChange={(e) => handleAnswerChange('aiUse', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    background: '#F8FAFC',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Reflection */}
              <div
                style={{
                  padding: '14px 16px',
                  background: '#ffffff',
                  border: combinedAnswers['reflection']?.trim() ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label htmlFor="submission-reflection" style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    One-Sentence Reflection & Improvement <span style={{ color: '#E11D48' }}>*</span>
                  </label>
                  {combinedAnswers['reflection']?.trim() && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                      <Check size={12} /> Complete
                    </span>
                  )}
                </div>
                <input
                  id="submission-reflection"
                  type="text"
                  placeholder="e.g. In future reconciliation, I will flag non-sequential invoice IDs before filtering dates."
                  value={combinedAnswers['reflection'] || ''}
                  onChange={(e) => handleAnswerChange('reflection', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    background: '#F8FAFC',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 4. Integrity Declaration Checkbox */}
          <div
            style={{
              padding: '16px 20px',
              background: integrityChecked ? '#F0FDF4' : '#F8FAFC',
              border: integrityChecked ? '1px solid #86EFAC' : '1px solid #CBD5E1',
              borderRadius: '10px',
              marginBottom: '24px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '13px',
                lineHeight: '1.5',
                color: '#1E293B',
              }}
            >
              <input
                id="submission-integrity-checkbox"
                type="checkbox"
                checked={integrityChecked}
                onChange={(e) => setIntegrityChecked(e.target.checked)}
                style={{
                  marginTop: '3px',
                  width: '18px',
                  height: '18px',
                  accentColor: '#0f766e',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
              <span>
                <strong>Attributable Work & Integrity Declaration:</strong> I confirm this is my own attributable work. I have disclosed all AI assistance, verified evidence against case records, and adhere to VCEP commercial practice standards.
              </span>
            </label>
          </div>

          {/* 5. Primary Actions Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              paddingTop: '16px',
              borderTop: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B' }}>
              <span style={{ fontWeight: 600 }}>
                Cloud Draft: Revision {cloudDraft?.revision ?? 0}
              </span>
              <span>·</span>
              <span>
                {cloudDraft?.updated ? `Saved ${new Date(cloudDraft.updated).toLocaleTimeString()}` : 'Not yet saved to cloud'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft || submitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  background: '#ffffff',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1E293B',
                  cursor: savingDraft ? 'wait' : 'pointer',
                }}
              >
                <Save size={15} />
                {savingDraft ? 'Saving Draft...' : 'Save Cloud Draft'}
              </button>

              <button
                id="submission-submit-btn"
                type="button"
                onClick={handleSubmitOfficial}
                disabled={submitting || savingDraft || !integrityChecked || missingFields.length > 0}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  background:
                    missingFields.length === 0 && integrityChecked
                      ? '#0f766e'
                      : '#94A3B8',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#ffffff',
                  cursor:
                    missingFields.length === 0 && integrityChecked && !submitting
                      ? 'pointer'
                      : 'not-allowed',
                  boxShadow:
                    missingFields.length === 0 && integrityChecked
                      ? '0 2px 8px rgba(15, 118, 110, 0.3)'
                      : 'none',
                }}
              >
                <Send size={15} />
                {submitting ? 'Submitting Attempt...' : isReturned ? 'Resubmit Official Attempt →' : 'Submit Official Attempt →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
