import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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

  // Animate counts when visible
  useEffect(() => {
    if (!isVisible || hasAnimated) return;

    setHasAnimated(true);
    const duration = 2000;
    const steps = 60;
    const intervalTime = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const ease = 1 - Math.pow(1 - progress, 4);

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

  const total = stats.yonsei + stats.korea || 1; // Prevent division by zero
  const yonseiPercent = (stats.yonsei / total) * 100;
  const koreaPercent = (stats.korea / total) * 100;
  const leader = stats.yonsei > stats.korea ? 'yonsei' : 'korea';

  return (
    <section id="battle" className="relative min-h-screen w-full overflow-hidden">
      {/* Full section gauge - fills from left and right to center */}
      <div className="absolute inset-0">
        {/* Yonsei gauge from left */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            width: `${yonseiPercent}%`,
            transformOrigin: 'left center'
          }}
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#164075]/30 via-[#4B73A8]/20 to-[#4B73A8]/10"
        />
        {/* Korea gauge from right */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            width: `${koreaPercent}%`,
            transformOrigin: 'right center'
          }}
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-[#781820]/30 via-[#A84B52]/20 to-[#A84B52]/10"
        />
      </div>

      {/* Oscillating meeting point effect */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 z-20"
        style={{ left: `${yonseiPercent}%`, marginLeft: '-0.5px' }}
        animate={isVisible ? {
          x: [0, 3, -3, 2, -2, 1, -1, 0],
          opacity: [0.3, 0.8, 0.8, 0.6, 0.6, 0.4, 0.4, 0.3]
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-to-b from-transparent via-accent-gold/60 to-transparent" />
      </motion.div>

      {/* Subtle winning team glow */}
      <div className="absolute inset-0 pointer-events-none">
        {leader === 'yonsei' ? (
          <div className="absolute inset-0 bg-gradient-to-r from-[#4B73A8]/3 to-transparent" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-l from-[#A84B52]/3 to-transparent" />
        )}
        {/* Decorative particles */}
        <div className="absolute top-20 left-1/4 w-3 h-3 rounded-full bg-[#4B73A8]/30 animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-[#A84B52]/30 animate-float-fast" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-accent-gold/20 animate-float-delayed" />
      </div>

      <motion.div
        className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 md:px-12 py-20"
        onViewportEnter={() => setIsVisible(true)}
        viewport={{ once: true, margin: "-20%" }}
      >
        {/* Title */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-accent-gold/80 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span className="tracking-widest uppercase">Live</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <h2 className="font-sans font-black text-4xl md:text-6xl text-brand-text mb-4 uppercase tracking-tight">
            창립제 지원 현황
          </h2>
          <p className="text-brand-line/60 font-medium">지금 참가 신청해서 게이지에 기여해 주세요!</p>
        </div>

        {/* Main Battle Display */}
        <div className="flex justify-center items-center w-full max-w-5xl gap-4 md:gap-8">
          {/* YONSEI Side */}
          <div className="flex-1 flex flex-col items-center group">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isVisible ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="relative mb-6"
            >
              <div className="absolute -inset-8 bg-[#4B73A8]/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative block text-6xl md:text-8xl lg:text-9xl font-black text-[#4B73A8] drop-shadow-[0_0_30px_rgba(75,115,168,0.5)]">
                {yonseiCount}
              </span>
            </motion.div>
            <p className="text-lg md:text-xl tracking-[0.3em] font-bold text-[#4B73A8]">YONSEI</p>
            <p className="text-sm text-brand-line/50 mt-2">{Math.round(yonseiPercent)}%</p>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center gap-3 px-4">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-accent-gold/40 to-transparent" />
            <motion.span
              className="text-accent-gold/80 font-black text-2xl md:text-4xl italic drop-shadow-[0_0_10px_rgba(201,169,98,0.3)]"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              VS
            </motion.span>
            <div className="w-px h-12 bg-gradient-to-t from-transparent via-accent-gold/40 to-transparent" />
          </div>

          {/* KOREA Side */}
          <div className="flex-1 flex flex-col items-center group">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isVisible ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative mb-6"
            >
              <div className="absolute -inset-8 bg-[#A84B52]/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative block text-6xl md:text-8xl lg:text-9xl font-black text-[#A84B52] drop-shadow-[0_0_30px_rgba(168,75,82,0.5)]">
                {koreaCount}
              </span>
            </motion.div>
            <p className="text-lg md:text-xl tracking-[0.3em] font-bold text-[#A84B52]">KOREA</p>
            <p className="text-sm text-brand-line/50 mt-2">{Math.round(koreaPercent)}%</p>
          </div>
        </div>

        {/* Bottom indicator */}
        <p className="text-center mt-16 text-xs text-accent-gold/50 uppercase tracking-widest flex items-center justify-center gap-2">
          <span className="w-8 h-px bg-accent-gold/20"></span>
          선배님들의 많은 참여 부탁드립니다!
          <span className="w-8 h-px bg-accent-gold/20"></span>
        </p>
      </motion.div>
    </section>
  );
};