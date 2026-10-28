'use client';

import React from 'react';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  className?: string;
  showSubtitle?: boolean;
};

export function VayentraEmblem({ size = 38, className = '' }: { size?: number; className?: string }) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`} 
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src="/vayentra-logo.png"
        alt="Vayentra Logo"
        width={size}
        height={size}
        className="w-full h-full object-contain rounded-md select-none"
        loading="eager"
      />
    </div>
  );
}

export default function BrandLogo({
  size = 'md',
  theme = 'light',
  className = '',
  showSubtitle = true,
}: BrandLogoProps) {
  const pixelSize = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-3 select-none text-left ${className}`}>
      <VayentraEmblem size={pixelSize} />
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className="font-bold tracking-wider text-[15px]"
            style={{ color: isDark ? '#FFFFFF' : '#17245C' }}
          >
            VAYENTRA
          </span>
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded tracking-wide text-[10px]"
            style={{
              backgroundColor: isDark ? 'rgba(229,175,46,0.2)' : 'rgba(23,36,92,0.08)',
              color: isDark ? '#E5AF2E' : '#17245C',
            }}
          >
            VCEP
          </span>
        </div>
        {showSubtitle && (
          <span
            className="text-[10px] font-semibold tracking-widest uppercase mt-0.5"
            style={{ color: isDark ? '#94A3B8' : '#64748B' }}
          >
            Commerce WorkLab
          </span>
        )}
      </div>
    </div>
  );
}
