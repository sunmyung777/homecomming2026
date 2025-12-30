import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSchoolStats, subscribeToStats, getRegistrantsBySchool, Registrant } from '../lib/supabase';
import { ChevronDown, ChevronUp } from 'lucide-react';

const INITIAL_SHOW_COUNT = 5;

export const Battle: React.FC = () => {
  const [stats, setStats] = useState({ yonsei: 0, korea: 0 });
  const [yonseiCount, setYonseiCount] = useState(0);
  const [koreaCount, setKoreaCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Registrant lists
  const [yonseiRegistrants, setYonseiRegistrants] = useState<Registrant[]>([]);
  const [koreaRegistrants, setKoreaRegistrants] = useState<Registrant[]>([]);
  const [showAllYonsei, setShowAllYonsei] = useState(false);
  const [showAllKorea, setShowAllKorea] = useState(false);

  // Blur control for participant list - set to false to reveal participants
  const isBlurred = true;

  // Fetch initial stats and registrants
  useEffect(() => {
    const fetchData = async () => {
      const statsData = await getSchoolStats();
      setStats(statsData);

      const yonseiData = await getRegistrantsBySchool('YONSEI');
      const koreaData = await getRegistrantsBySchool('KOREA');
      setYonseiRegistrants(yonseiData);
      setKoreaRegistrants(koreaData);
    };

    fetchData();

    const subscription = subscribeToStats(async (newStats) => {
      setStats(newStats);
      // Refresh registrant lists on stats change
      const yonseiData = await getRegistrantsBySchool('YONSEI');
      const koreaData = await getRegistrantsBySchool('KOREA');
      setYonseiRegistrants(yonseiData);
      setKoreaRegistrants(koreaData);
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

  // Update displayed counts when stats change
  useEffect(() => {
    if (hasAnimated) {
      setYonseiCount(stats.yonsei);
      setKoreaCount(stats.korea);
    }
  }, [stats, hasAnimated]);

  const total = stats.yonsei + stats.korea || 1;
  const yonseiPercent = (stats.yonsei / total) * 100;
  const koreaPercent = (stats.korea / total) * 100;

  // Registrant list component
  const RegistrantList = ({
    registrants,
    showAll,
    onToggle,
    color,
    isBlurred
  }: {
    registrants: Registrant[];
    showAll: boolean;
    onToggle: () => void;
    color: 'yonsei' | 'korea';
    isBlurred: boolean;
  }) => {
    const displayList = showAll ? registrants : registrants.slice(0, INITIAL_SHOW_COUNT);
    const hasMore = registrants.length > INITIAL_SHOW_COUNT;
    const remainingCount = registrants.length - INITIAL_SHOW_COUNT;

    if (registrants.length === 0) {
      return (
        <p className="text-brand-line/30 text-xs mt-4">아직 참가자가 없습니다</p>
      );
    }

    return (
      <div className="mt-4 w-full relative">
        {/* Overlay message when blurred */}
        {isBlurred && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <p className="text-brand-line/40 text-xs font-medium text-center px-2">
              참가자 명단이 곧 공개됩니다!
            </p>
          </div>
        )}

        <div className={`flex flex-col items-center gap-0.5 ${isBlurred ? 'blur-sm select-none' : ''}`}>
          {displayList.map((reg, idx) => (
            <span
              key={idx}
              className={`text-xs ${color === 'yonsei' ? 'text-[#4B73A8]/70' : 'text-[#A84B52]/70'
                }`}
            >
              {reg.batch} {reg.name}
            </span>
          ))}
        </div>


        {hasMore && !isBlurred && (
          <button
            onClick={onToggle}
            className={`mt-3 text-xs flex items-center justify-center gap-1 mx-auto transition-colors ${color === 'yonsei'
              ? 'text-[#4B73A8]/60 hover:text-[#4B73A8]'
              : 'text-[#A84B52]/60 hover:text-[#A84B52]'
              }`}
          >
            {showAll ? (
              <>접기 <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>+{remainingCount}명 더보기 <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <section id="battle" className="relative min-h-screen w-full overflow-hidden bg-brand-bg">
      {/* Static gauge backgrounds */}
      <div className="absolute inset-0">
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

      {/* Center divider line */}
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
        <div className="text-center mb-12">
          <p className="text-accent-gold/60 text-xs font-medium uppercase tracking-widest mb-3">
            실시간 참가 현황
          </p>
          <h2 className="font-sans font-black text-3xl md:text-5xl text-brand-text uppercase tracking-tight">
            창립제 지원 현황
          </h2>
        </div>

        {/* Main Battle Display */}
        <div className="flex justify-center items-start w-full max-w-4xl gap-4 md:gap-8">
          {/* YONSEI Side */}
          <div className="flex-1 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-2"
            >
              <span className="block text-5xl md:text-7xl lg:text-8xl font-black text-[#4B73A8]">
                {yonseiCount}
              </span>
            </motion.div>
            <p className="text-base md:text-lg tracking-[0.2em] font-bold text-[#4B73A8]">YONSEI</p>
            <p className="text-sm text-brand-line/50 mt-1">{Math.round(yonseiPercent)}%</p>

            {/* Inline registrant list */}
            <RegistrantList
              registrants={yonseiRegistrants}
              showAll={showAllYonsei}
              onToggle={() => setShowAllYonsei(!showAllYonsei)}
              color="yonsei"
              isBlurred={isBlurred}
            />
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center gap-2 px-2 pt-8">
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
              className="mb-2"
            >
              <span className="block text-5xl md:text-7xl lg:text-8xl font-black text-[#A84B52]">
                {koreaCount}
              </span>
            </motion.div>
            <p className="text-base md:text-lg tracking-[0.2em] font-bold text-[#A84B52]">KOREA</p>
            <p className="text-sm text-brand-line/50 mt-1">{Math.round(koreaPercent)}%</p>

            {/* Inline registrant list */}
            <RegistrantList
              registrants={koreaRegistrants}
              showAll={showAllKorea}
              onToggle={() => setShowAllKorea(!showAllKorea)}
              color="korea"
              isBlurred={isBlurred}
            />
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center mt-12 text-xs text-brand-line/40 uppercase tracking-widest">
          참가 신청으로 게이지에 기여해 주세요
        </p>
      </motion.div>
    </section>
  );
};