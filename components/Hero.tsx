import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface HeroProps {
  onRegisterClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegisterClick }) => {
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 50]);
  const posterY = useTransform(scrollY, [0, 500], [0, 40]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col overflow-hidden pt-24 pb-8 px-6 md:px-12">
      {/* Subtle background gradient - single, understated */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-mid/10 to-transparent" />
      </div>

      {/* Top Left: Meta Data */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="z-10 relative mb-8"
      >
        <p className="text-accent-gold tracking-[0.2em] text-xs font-bold uppercase mb-2">
          Insiders 창립제 2026
        </p>
        <p className="text-brand-text/60 text-sm font-medium">
          2026.1.16 · 케미스트리 강남
        </p>
      </motion.div>

      {/* Center Area: Typography + Poster */}
      <div className="z-10 relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 flex-1">
        {/* Main Typography */}
        <div>
          <motion.h1
            style={{ y: textY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans font-black text-5xl md:text-7xl lg:text-[9rem] text-brand-text leading-[0.9] tracking-tighter"
          >
            GREAT
            <br />
            <span className="md:ml-[10%] text-accent-gold">
              GALLOP
            </span>
          </motion.h1>

          {/* Register Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            onClick={onRegisterClick}
            className="mt-8 group inline-flex items-center gap-3 px-8 py-4 bg-accent-gold text-brand-bg font-bold rounded-full hover:bg-accent-goldLight transition-colors duration-200"
          >
            지금 신청하기
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Poster Image - Desktop */}
        <motion.div
          style={{ y: posterY }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block relative flex-shrink-0"
        >
          <img
            src="/images/poster.png"
            alt="GREAT GALLOP Event Poster"
            className="w-56 xl:w-72 rounded-2xl shadow-2xl shadow-brand-deep/50 border border-white/10"
          />
        </motion.div>

        {/* Mobile Poster */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="lg:hidden flex justify-center"
        >
          <img
            src="/images/poster.png"
            alt="GREAT GALLOP Event Poster"
            className="relative w-40 rounded-xl shadow-xl border border-white/10"
          />
        </motion.div>
      </div>

      {/* Bottom: Description */}
      <div className="z-10 relative flex flex-col md:flex-row justify-between items-end w-full max-w-7xl mx-auto border-t border-white/10 pt-6 mt-8">
        <motion.div
          style={{ opacity }}
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="hidden md:block"
        >
          <ChevronDown className="w-6 h-6 text-accent-gold/60" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-brand-text/70 text-sm md:text-base font-normal leading-relaxed max-w-md text-right"
        >
          2026년 1월 16일, 인사이더스 동문이 한자리에 모입니다.
          <br />
          <span className="text-accent-gold">오래된 친구와 새로운 이야기.</span>
        </motion.p>
      </div>
    </section>
  );
};