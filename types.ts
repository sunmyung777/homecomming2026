import React from 'react';

export enum School {
  YONSEI = 'YONSEI',
  KOREA = 'KOREA'
}

export interface Participant {
  name: string;
  phone: string;
  batch: string; // e.g., 29기
  school: School | null;
  isSponsor: boolean;
}

export interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}