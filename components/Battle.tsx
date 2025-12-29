import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSchoolStats, subscribeToStats } from '../lib/supabase';

export const Battle: React.FC = () => {
  const [stats, setStats] = useState({ yonsei: 0, korea: 0 });
  const [yonseiCount, setYonseiCount] = useState(0);
  const [koreaCount, setKoreaCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Fetch initial stats and subscribe to updates
  useEffect(() => {
    const fetchStats = async () => {
      const data = await getSchoolStats();
      setStats(data);
    };

    fetchStats();

    // Subscribe to real-time updates
    const subscription = subscribeToStats((newStats) => {
      setStats(newStats);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Animate counts when visible (ONE TIME ONLY)
  useEffect(() => {
    if (!isVisible || hasAnimated) return;

    setHasAnimated(true);
    const duration = 1500;
    const steps = 40;
    const intervalTime = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const ease = 1 - Math.pow(1 - progress, 3);

      setYonseiCount(Math.floor(stats.yonsei * ease));
      setKoreaCount(Math.floor(stats.korea * ease));

      if (currentStep >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isVisible, stats, hasAnimated]);

  // Update displayed counts when stats change (for real-time updates)
  useEffect(() => {
    if (hasAnimated) {
      setYonseiCount(stats.yonsei);
      setKoreaCount(stats.korea);
    }
  }, [stats, hasAnimated]);

  const total = stats.yonsei + stats.korea || 1;
  const yonseiPercent = (stats.yonsei / total) * 100;
  const koreaPercent = (stats.korea / total) * 100;

  return (
    <section id="battle" className="relative min-h-screen w-full overflow-hidden bg-brand-bg">
      {/* Static gauge backgrounds */}
      <div className="absolute inset-0">
        {/* Yonsei gauge from left */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            width: `${yonseiPercent}%`,
            transformOrigin: 'left center'
          }}
          className="absolute left-0 top-0 h-full bg-[#164075]/20"
        />
        {/* Korea gauge from right */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            width: `${koreaPercent}%`,
            transformOrigin: 'right center'
          }}
          className="absolute right-0 top-0 h-full bg-[#781820]/20"
        />
      </div>

      {/* Center divider line - static */}
      <div
        className="absolute top-0 bottom-0 w-px bg-accent-gold/30 z-10"
        style={{ left: `${yonseiPercent}%` }}
      />

      <motion.div
        className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 md:px-12 py-20"
        onViewportEnter={() => setIsVisible(true)}
        viewport={{ once: true, margin: "-20%" }}
      >
        {/* Title */}
        <div className="text-center mb-16">
          <p className="text-accent-gold/60 text-xs font-medium uppercase tracking-widest mb-3">
            실시간 참가 현황
          </p>
          <h2 className="font-sans font-black text-3xl md:text-5xl text-brand-text uppercase tracking-tight">
            창립제 지원 현황
          </h2>
        </div>

        {/* Main Battle Display */}
        <div className="flex justify-center items-center w-full max-w-4xl gap-8 md:gap-16">
          {/* YONSEI Side */}
          <div className="flex-1 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <span className="block text-5xl md:text-7xl lg:text-8xl font-black text-[#4B73A8]">
                {yonseiCount}
              </span>
            </motion.div>
            <p className="text-base md:text-lg tracking-[0.2em] font-bold text-[#4B73A8]">YONSEI</p>
            <p className="text-sm text-brand-line/50 mt-1">{Math.round(yonseiPercent)}%</p>
          </div>

          {/* VS Divider - Static */}
          <div className="flex flex-col items-center gap-2 px-2">
            <div className="w-px h-8 bg-accent-gold/30" />
            <span className="text-accent-gold/60 font-bold text-xl">VS</span>
            <div className="w-px h-8 bg-accent-gold/30" />
          </div>

          {/* KOREA Side */}
          <div className="flex-1 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-4"
            >
              <span className="block text-5xl md:text-7xl lg:text-8xl font-black text-[#A84B52]">
                {koreaCount}
              </span>
            </motion.div>
            <p className="text-base md:text-lg tracking-[0.2em] font-bold text-[#A84B52]">KOREA</p>
            <p className="text-sm text-brand-line/50 mt-1">{Math.round(koreaPercent)}%</p>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center mt-16 text-xs text-brand-line/40 uppercase tracking-widest">
          참가 신청으로 게이지에 기여해 주세요
        </p>
      </motion.div>
    </section>
  );
};