'use client';
import { useEffect, useRef } from 'react';
import { initFacultyChart, SessionMetric } from './faculty-chart';
import { detectGraphicsTier } from './engine-utils';

interface FacultyChartViewProps {
  metrics: SessionMetric[];
}

export default function FacultyChartView({ metrics }: FacultyChartViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const tier = detectGraphicsTier().tier;
    if (tier === 'Static') return;

    const handle = initFacultyChart(containerRef.current, metrics, tier);
    return () => {
      handle.destroy();
    };
  }, [metrics]);

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-bold text-[#0d2b36]">3D Cohort Performance Landscape</h3>
        <span className="text-xs text-[#596f70]">Drag to rotate • Height = Mean Grade / 10</span>
      </div>
      <div
        ref={containerRef}
        className="w-full h-[360px] rounded-xl overflow-hidden shadow-md border border-[#d1dbd4] bg-[#0a1e27]"
        aria-label="3D Cohort Performance Matrix"
      />
    </div>
  );
}
