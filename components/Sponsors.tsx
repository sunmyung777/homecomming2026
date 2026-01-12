import React from 'react';
import { Section } from './ui/Section';

interface Sponsor {
  name: string;
  company: string;
  logo?: string; // 로고 이미지 경로 (선택적)
  url?: string;  // 회사 웹사이트 링크 (선택적)
}

const SPONSORS: Sponsor[] = [
  { name: '12기 이상헌', company: 'Voithru', logo: '/images/voithru.png', url: 'https://voithru.com/' },
  { name: '3기 이건호', company: '샐러디', logo: '/images/salady.jpg', url: 'https://salady.com/' },
  { name: '1기 정근식', company: 'Refilled', logo: '/images/refilled.png', url: 'https://refilled.co.kr/' },
  { name: '24기 서예명 이건우 홍서혜', company: '위글리', logo: '/images/weglee.jpeg', url: 'https://www.instagram.com/weglee.official/' },
  { name: '26기 전윤하', company: 'HOWEVER', logo: '/images/however.jpg', url: 'https://www.instagram.com/however.kr/' },
];

export const Sponsors: React.FC = () => {
  const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => (
    <>
      {/* 로고가 있을 경우 표시 */}
      {sponsor.logo && (
        <div className="mb-3 h-12 flex items-center">
          <img
            src={sponsor.logo}
            alt={`${sponsor.company} 로고`}
            className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>
      )}
      <p className="text-lg text-brand-text font-bold mb-1 group-hover:text-white transition-colors">{sponsor.name}</p>
      <p className="text-xs text-brand-line uppercase tracking-wider">{sponsor.company}</p>
    </>
  );

  return (
    <Section id="sponsors" fullScreen={false} className="py-32 border-t border-brand-line/10 bg-brand-bg">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <h3 className="font-sans font-bold text-3xl text-brand-text">
            Special Thanks To
          </h3>
          <p className="text-brand-line/50 mt-4 md:mt-0 text-sm">INSIDERS의 성장을 돕는 분들</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {SPONSORS.map((sponsor, idx) => (
            sponsor.url ? (
              <a
                key={idx}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer border-t border-brand-line/20 pt-4 hover:border-brand-text transition-colors block"
              >
                <SponsorCard sponsor={sponsor} />
              </a>
            ) : (
              <div key={idx} className="group cursor-default border-t border-brand-line/20 pt-4 hover:border-brand-text transition-colors">
                <SponsorCard sponsor={sponsor} />
              </div>
            )
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