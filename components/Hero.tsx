import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface HeroProps {
  onRegisterClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegisterClick }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const posterY = useTransform(scrollY, [0, 500], [0, 80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col overflow-hidden pt-24 pb-8 px-6 md:px-12">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-brand-mid/30 via-accent-gold/10 to-transparent blur-[120px]"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-brand-deep/40 via-accent-teal/10 to-transparent blur-[100px]"
        />
        {/* Decorative particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-accent-gold/60 animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-accent-teal/50 animate-float-fast" />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-accent-rose/40 animate-float-delayed" />
        <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 rounded-full bg-accent-goldLight/30 animate-float-slow" />
      </div>

      {/* Top Left: Meta Data */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="z-10 relative mb-8"
      >
        <p className="text-accent-gold tracking-[0.2em] text-xs font-bold uppercase mb-2 flex items-center gap-2">
          Insiders Foundation Festival
        </p>
        <p className="text-brand-text/60 text-sm font-medium">
          2026.1.16 — Seoul
        </p>
      </motion.div>

      {/* Center Area: Typography + Poster */}
      <div className="z-10 relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 flex-1">
        {/* Main Typography */}
        <div>
          <motion.h1
            style={{ y: textY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans font-black text-5xl md:text-7xl lg:text-[9rem] text-brand-text leading-[0.9] tracking-tighter"
          >
            GREAT
            <br />
            <span className="md:ml-[10%] text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-accent-goldLight to-accent-gold bg-300% animate-gradient">
              GALLOP
            </span>
          </motion.h1>

          {/* Register Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            onClick={onRegisterClick}
            className="mt-8 group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-gold to-accent-goldLight text-brand-bg font-bold rounded-full hover:shadow-lg hover:shadow-accent-gold/30 hover:scale-105 transition-all duration-300"
          >
            참가신청
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Floating Poster Image */}
        <motion.div
          style={{ y: posterY }}
          initial={{ opacity: 0, x: 50, rotateY: -15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block relative flex-shrink-0"
        >
          {/* Glow effect behind poster */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/40 via-brand-mid/30 to-accent-teal/20 blur-[60px] scale-110 animate-pulse-glow" />
          <div className="relative animate-float">
            <img
              src="/images/poster.png"
              alt="GREAT GALLOP Event Poster"
              className="w-56 xl:w-72 rounded-2xl shadow-2xl shadow-brand-deep/50 border border-white/10"
            />
            {/* Corner accent */}
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-accent-gold/60 rounded-tr-lg" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-accent-teal/60 rounded-bl-lg" />
          </div>
        </motion.div>

        {/* Mobile Poster */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="lg:hidden flex justify-center"
        >
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/30 to-brand-mid/20 blur-[40px] scale-110" />
            <img
              src="/images/poster.png"
              alt="GREAT GALLOP Event Poster"
              className="relative w-40 rounded-xl shadow-xl border border-white/10"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom: Description */}
      <div className="z-10 relative flex flex-col md:flex-row justify-between items-end w-full max-w-7xl mx-auto border-t border-accent-gold/20 pt-6 mt-8">
        <motion.div
          style={{ opacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="hidden md:block"
        >
          <ChevronDown className="w-6 h-6 text-accent-gold/50" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-brand-text/80 text-sm md:text-base font-normal leading-relaxed max-w-md text-right"
        >
          2026 인사이더스 창립제에 선배님을 정중히 초대합니다.
          <br />
          INSIDERS의 지난 발자취와 도약의 순간.
          <br />
          <span className="text-accent-gold">그 빛나는 밤의 주인공이 되어주세요.</span>
        </motion.p>
      </div>
    </section>
  );
};