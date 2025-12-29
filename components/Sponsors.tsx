import React from 'react';
import { Section } from './ui/Section';

const SPONSORS = [
  { name: '선배님 성함', company: '선배님 회사' },
];

export const Sponsors: React.FC = () => {
  return (
    <Section id="sponsors" fullScreen={false} className="py-32 border-t border-brand-line/10 bg-brand-bg">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <h3 className="font-sans font-bold text-3xl text-brand-text">
            Special Thanks To
          </h3>
          <p className="text-brand-line/50 mt-4 md:mt-0 text-sm">INSIDERS의 성장을 돕는 분들</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {SPONSORS.map((sponsor, idx) => (
            <div key={idx} className="group cursor-default border-t border-brand-line/20 pt-4 hover:border-brand-text transition-colors">
              <p className="text-lg text-brand-text font-bold mb-1 group-hover:text-white transition-colors">{sponsor.name}</p>
              <p className="text-xs text-brand-line uppercase tracking-wider">{sponsor.company}</p>
            </div>
          ))}
        </div>

        <div className="mt-32 pt-8 border-t border-brand-line/5 flex flex-col md:flex-row justify-between text-brand-line/40 text-xs tracking-wider">
          <p className="mb-2">INSIDERS 2026 창립제</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/insiders_mafia/" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
            <a href="mailto:insiders@insiders.co.kr" target="_blank" rel="noopener noreferrer">CONTACT</a>
          </div>
        </div>
      </div>
    </Section>
  );
};