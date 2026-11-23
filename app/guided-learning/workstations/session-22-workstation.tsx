'use client';

import React from 'react';
import { Session22HiringJourney } from '../components/session-22-hiring-journey';

interface Props {
  onUpdateDraft?: (field: string, value: any) => void;
}

export function Session22Workstation({ onUpdateDraft }: Props) {
  return <Session22HiringJourney onUpdateDraft={onUpdateDraft} />;
}
