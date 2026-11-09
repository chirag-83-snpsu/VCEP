'use client';

import React from 'react';
import { Session21PortfolioJourney } from '../components/session-21-portfolio-journey';

interface Props {
  onUpdateDraft?: (field: string, value: any) => void;
}

export function Session21Workstation({ onUpdateDraft }: Props) {
  return <Session21PortfolioJourney onUpdateDraft={onUpdateDraft} />;
}
