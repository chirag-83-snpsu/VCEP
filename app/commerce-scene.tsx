'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Choice } from './components';
import { detectGraphicsTier, GraphicsTier } from './three/engine-utils';
import { initHeroScene, HeroSceneHandle } from './three/hero-scene';
import { initCityMap, CityMapHandle, SessionStatusMap, DISTRICT_INFO } from './three/city-map';
import {
  initConceptExplainer,
  ExplainerHandle,
  CONCEPT_DEFINITIONS,
  ConceptDefinition,
} from './three/concept-explainers';
import { initProgressSpire, ProgressSpireHandle } from './three/progress-spire';

interface CommerceSceneProps {
  sessions: any[];
  completed?: number[];
  graded?: number[];
  submissions?: any[];
  onOpen: (sessionId: number) => void;
  initialView?: 'hero' | 'map' | 'explainer' | 'progress';
  initialConceptId?: string;
}

export default function CommerceScene({
  sessions,
  completed = [],
  graded = [],
  submissions = [],
  onOpen,
  initialView = 'map',
  initialConceptId = 'supply-chain',
}: CommerceSceneProps) {
  const [view, setView] = useState<'hero' | 'map' | 'explainer' | 'progress'>(initialView);
  const [userMode, setUserMode] = useState<string>('full');
  const [tier, setTier] = useState<GraphicsTier>('Full');
  const [selectedConcept, setSelectedConcept] = useState<string>(initialConceptId);
  const [explainerStep, setExplainerStep] = useState<number>(0);
  const [districtFilter, setDistrictFilter] = useState<number>(0); // 0 = all
  const [errorMsg, setErrorMsg] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const activeHandleRef = useRef<any>(null);

  // Load user 3D preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vcep-visual-mode');
      if (saved) setUserMode(saved);
    } catch {}
  }, []);

  // Update tier whenever preference changes
  useEffect(() => {
    try {
      localStorage.setItem('vcep-visual-mode', userMode);
    } catch {}

    const cap = detectGraphicsTier(userMode);
    setTier(cap.tier);
    if (!cap.hasWebGL2 && userMode !== 'off') {
      setErrorMsg('Hardware WebGL 2 is unavailable. Accessible 2D views are enabled below.');
    } else {
      setErrorMsg('');
    }
  }, [userMode]);

  // Construct status map for the 24 sessions
  const statusMap: SessionStatusMap = {};
  sessions.forEach((s) => {
    const sub = (submissions || []).find((q: any) => q.session === s.id);
    let st: any = 'Not started';
    let score: number | undefined = undefined;

    if (sub) {
      st = sub.status || 'Submitted';
      if (sub.grade) {
        try {
          const g = JSON.parse(sub.grade);
          score = (g.execution || 0) + (g.reasoning || 0) + (g.communication || 0) + (g.process || 0);
        } catch {}
      }
    } else if (graded.includes(s.id)) {
      st = 'Graded';
    } else if (completed.includes(s.id)) {
      st = 'Submitted';
    }

    statusMap[s.id] = {
      status: st,
      score,
      title: s.title,
      company: (s as any).company,
    };
  });

  // Mount active 3D Scene when view or tier changes
  useEffect(() => {
    if (tier === 'Static' || !containerRef.current) {
      if (activeHandleRef.current?.destroy) {
        activeHandleRef.current.destroy();
        activeHandleRef.current = null;
      }
      return;
    }

    const host = containerRef.current;
    let handle: any = null;

    try {
      if (view === 'hero') {
        handle = initHeroScene(host, tier);
        const onMouseMove = (e: MouseEvent) => {
          const rect = host.getBoundingClientRect();
          const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
          handle.setPointer(normX, normY);
        };
        host.addEventListener('mousemove', onMouseMove);
        const origDestroy = handle.destroy;
        handle.destroy = () => {
          host.removeEventListener('mousemove', onMouseMove);
          origDestroy();
        };
      } else if (view === 'map') {
        handle = initCityMap(
          host,
          sessions,
          statusMap,
          (sId) => {
            onOpen(sId);
          },
          tier
        );
      } else if (view === 'explainer') {
        handle = initConceptExplainer(
          host,
          selectedConcept,
          (step) => setExplainerStep(step),
          tier
        );
      } else if (view === 'progress') {
        handle = initProgressSpire(host, completed.length, graded.length, tier);
      }
    } catch (err: any) {
      console.warn('3D initialization failed, falling back to static:', err);
      setErrorMsg('3D visual encountered an issue. Accessible text alternatives are shown below.');
      setTier('Static');
    }

    activeHandleRef.current = handle;

    return () => {
      if (activeHandleRef.current?.destroy) {
        activeHandleRef.current.destroy();
        activeHandleRef.current = null;
      }
    };
  }, [view, tier, selectedConcept, completed.length, graded.length]);

  const activeDef: ConceptDefinition =
    CONCEPT_DEFINITIONS.find((c) => c.id === selectedConcept) || CONCEPT_DEFINITIONS[0];

  return (
    <section className="scene-panel no-print" aria-label="Interactive 3D Commerce Experience">
      {/* Header Bar */}
      <div className="scene-head">
        <div>
          <p className="eyebrow">COMMERCE IN MOTION • INTERACTIVE 3D LAB</p>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            {view === 'hero' && 'The Commerce World (Hero Panorama)'}
            {view === 'map' && '24-Session City Map (4 Districts)'}
            {view === 'explainer' && activeDef.title}
            {view === 'progress' && 'Your Dynamic 3D Career Spire'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {view === 'hero' && 'Ambient simulation of global commerce: maritime cargo, port logistics, banking towers, and market trends.'}
            {view === 'map' && 'Explore all 24 sessions organized into 4 industrial districts. Tap any building to inspect and launch.'}
            {view === 'explainer' && activeDef.objective}
            {view === 'progress' && `Watch your personal commerce tower grow as you complete all 24 sessions (${completed.length}/24 finished).`}
          </p>
        </div>

        {/* View and Mode Selectors */}
        <div className="scene-controls flex flex-wrap gap-3 items-end">
          <Choice
            label="Visual Mode"
            value={userMode}
            onChange={setUserMode}
            items={[
              { value: 'full', label: 'Full 3D' },
              { value: 'reduced', label: 'Reduced 3D' },
              { value: 'off', label: 'Off (Text Only)' },
            ]}
          />
          <Choice
            label="Explore Mode"
            value={view}
            onChange={(v: any) => setView(v)}
            items={[
              { value: 'map', label: 'City Map' },
              { value: 'hero', label: 'Hero World' },
              { value: 'explainer', label: 'Concept Explainers' },
              { value: 'progress', label: 'Career Spire' },
            ]}
          />
        </div>
      </div>

      {/* 3D Viewport or Static Poster */}
      {tier !== 'Static' ? (
        <div className="relative mt-4">
          <div
            ref={containerRef}
            className="scene-canvas w-full h-[400px] rounded-xl overflow-hidden shadow-inner border border-teal-800/60 bg-[#091e26]"
            aria-hidden="true"
          />

          {/* Canvas HUD Overlay */}
          <div className="scene-caption flex justify-between items-center py-2 px-3 text-xs text-slate-300 bg-[#0d2b36]/90 border-t border-teal-900/60 rounded-b-xl">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {tier} Tier Rendering •{' '}
                {view === 'map' && 'Click building to inspect • Drag to Orbit'}
                {view === 'hero' && 'Mouse parallax active'}
                {view === 'explainer' && 'Drag to rotate 3D model'}
                {view === 'progress' && `${graded.length} graded floors`}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              {view === 'map' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-teal-950/80 text-white border-teal-700"
                    onClick={() => activeHandleRef.current?.resetView()}
                  >
                    Reset View
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Static 2D Fallback */
        <div className="p-8 my-4 text-center bg-teal-950/60 border border-teal-800 rounded-xl">
          <p className="text-amber-300 font-semibold mb-2">3D Graphics Paused / Disabled</p>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Interactive 3D is turned off or unsupported on this device. All curriculum navigation, interactive stages, and worksheets remain fully functional below.
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="mt-2 text-xs text-amber-300 bg-amber-950/50 p-2 rounded border border-amber-800" role="status">
          {errorMsg}
        </div>
      )}

      {/* Accessible Controls & Transcripts per View */}
      {view === 'map' && (
        <div className="mt-4" aria-label="Accessible 24-Session Map Selector">
          {/* District Quick Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Button
              size="sm"
              variant={districtFilter === 0 ? 'default' : 'outline'}
              onClick={() => {
                setDistrictFilter(0);
                activeHandleRef.current?.resetView();
              }}
              className="text-xs h-8"
            >
              All Districts (1–24)
            </Button>
            {DISTRICT_INFO.map((d, idx) => (
              <Button
                key={d.id}
                size="sm"
                variant={districtFilter === d.id ? 'default' : 'outline'}
                onClick={() => {
                  setDistrictFilter(d.id);
                  activeHandleRef.current?.focusDistrict(idx);
                }}
                className="text-xs h-8"
              >
                District {d.id}: {d.name} ({d.range[0]}–{d.range[1]})
              </Button>
            ))}
          </div>

          {/* Accessible Grid Buttons for All 24 Sessions */}
          <div className="map-buttons grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {sessions
              .filter((s) => districtFilter === 0 || (s.id >= (districtFilter - 1) * 6 + 1 && s.id <= districtFilter * 6))
              .map((s: any) => {
                const info = statusMap[s.id];
                const isGraded = info?.status === 'Graded';
                const isDone = ['Submitted', 'Under review', 'Graded'].includes(info?.status);
                return (
                  <Button
                    key={s.id}
                    variant={isGraded ? 'default' : 'outline'}
                    size="sm"
                    className={`text-xs h-9 font-semibold ${
                      isGraded
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        : isDone
                        ? 'border-cyan-500 text-cyan-300'
                        : 'border-teal-700'
                    }`}
                    title={`Session ${s.id}: ${s.title} (${info?.status})`}
                    aria-label={`Open session ${s.id}: ${s.title}. Status: ${info?.status}`}
                    onClick={() => {
                      activeHandleRef.current?.focusSession(s.id);
                      onOpen(s.id);
                    }}
                  >
                    {String(s.id).padStart(2, '0')}
                    {isGraded ? ' ★' : isDone ? ' ✓' : ''}
                  </Button>
                );
              })}
          </div>
        </div>
      )}

      {view === 'explainer' && (
        <div className="mt-4 lesson-controls" aria-label="Case Study Concept Explainer">
          {/* Concept Switcher */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CONCEPT_DEFINITIONS.map((c) => (
              <Button
                key={c.id}
                size="sm"
                variant={selectedConcept === c.id ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedConcept(c.id);
                  setExplainerStep(0);
                }}
                className="text-xs h-8"
              >
                {c.title}
              </Button>
            ))}
          </div>

          {/* Interactive Steps */}
          <div className="flex flex-wrap gap-2 mb-3">
            {activeDef.stages.map((st, idx) => (
              <Button
                key={st.name}
                size="sm"
                variant={explainerStep === idx ? 'default' : 'outline'}
                aria-pressed={explainerStep === idx}
                onClick={() => {
                  setExplainerStep(idx);
                  activeHandleRef.current?.setStep(idx);
                }}
                className="text-xs h-8"
              >
                {idx + 1}. {st.name}
              </Button>
            ))}
          </div>

          {/* Active Stage Narrative Card */}
          <div className="p-4 bg-teal-950/70 border border-teal-800 rounded-lg text-sm text-slate-200" aria-live="polite">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <span className="text-amber-300 font-bold text-xs uppercase tracking-wider">
                  Stage {explainerStep + 1} of {activeDef.stages.length}: {activeDef.stages[explainerStep].name}
                </span>
                <p className="font-semibold text-white mt-1 text-base">{activeDef.stages[explainerStep].shortDesc}</p>
                <p className="text-slate-300 mt-1 leading-relaxed">{activeDef.stages[explainerStep].details}</p>
              </div>

              {activeDef.stages[explainerStep].metricLabel && (
                <div className="bg-[#0e2a35] px-4 py-2 rounded-lg border border-teal-700/60 text-right min-w-[140px]">
                  <span className="text-[10px] text-slate-400 block uppercase">
                    {activeDef.stages[explainerStep].metricLabel}
                  </span>
                  <span className="text-amber-300 font-bold text-sm">
                    {activeDef.stages[explainerStep].metricValue}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'progress' && (
        <div className="mt-4 p-4 bg-teal-950/70 border border-teal-800 rounded-lg text-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-teal-900/40 rounded-lg border border-teal-800">
              <span className="text-2xl font-bold text-white">{completed.length} / 24</span>
              <span className="block text-xs text-slate-400 mt-1">Sessions Completed</span>
            </div>
            <div className="p-3 bg-teal-900/40 rounded-lg border border-teal-800">
              <span className="text-2xl font-bold text-emerald-400">{graded.length} / 24</span>
              <span className="block text-xs text-slate-400 mt-1">Faculty Graded</span>
            </div>
            <div className="p-3 bg-teal-900/40 rounded-lg border border-teal-800">
              <span className="text-2xl font-bold text-amber-300">
                {Math.round((completed.length / 24) * 100)}%
              </span>
              <span className="block text-xs text-slate-400 mt-1">Spire Completion</span>
            </div>
            <div className="p-3 bg-teal-900/40 rounded-lg border border-teal-800">
              <span className="text-2xl font-bold text-cyan-300">
                {Math.floor(completed.length / 6)} / 4
              </span>
              <span className="block text-xs text-slate-400 mt-1">Districts Mastered</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
