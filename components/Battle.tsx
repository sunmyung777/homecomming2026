import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSchoolStats, subscribeToStats, getRegistrantsBySchool, Registrant } from '../lib/supabase';
import { ChevronDown, ChevronUp } from 'lucide-react';

const INITIAL_SHOW_COUNT = 5;

// 가짜 데이터 - Supabase에 없는 경우에만 표시됨
const FAKE_YONSEI_REGISTRANTS: Registrant[] = [
  { batch: '20기', name: '국진혁' },
  { batch: '23기', name: '정하진' },
  { batch: '10기', name: '정재원' },
  { batch: '22기', name: '이제홍' },
  { batch: '4기', name: '김강안' },
  { batch: '13기', name: '박인엽' },
  { batch: '4기', name: '이인하' },
  { batch: '16기', name: '임관섭' },
  { batch: '3기', name: '이건호' },
  { batch: '12기', name: '이상헌' },
  { batch: '7기', name: '방역주' },
  { batch: '12기', name: '김활' },
  { batch: '17기', name: '김완성' },
  { batch: '12기', name: '박현준' },
  { batch: '22기', name: '정준우' },
  { batch: '1기', name: '김진우' },
  { batch: '22기', name: '안세현' },
  { batch: '21기', name: '김수연' },
  { batch: '5기', name: '최윤영' },
  { batch: '27기', name: '박인찬' },
  { batch: '26기', name: '김태현' },
  { batch: '26기', name: '정진호' },
  { batch: '24기', name: '김유겸' },
  { batch: '26기', name: '김도희' },
  { batch: '25기', name: '남예지' },
  { batch: '27기', name: '정호수' },
  { batch: '28기', name: '추명현' },
  { batch: '28기', name: '정세준' },
  { batch: '28기', name: '정현우' },
  { batch: '28기', name: '양승연' },
  { batch: '28기', name: '엄선명' },
];

const FAKE_KOREA_REGISTRANTS: Registrant[] = [
  { batch: '20기', name: '이수영' },
  { batch: '22기', name: '김예지' },
  { batch: '1기', name: '정근식' },
  { batch: '10기', name: '최익중' },
  { batch: '13기', name: '윤예슬' },
  { batch: '20기', name: '오경훈' },
  { batch: '7기', name: '오상준' },
  { batch: '11기', name: '허재성' },
  { batch: '23기', name: '제지원' },
  { batch: '20기', name: '이은석' },
  { batch: '23기', name: '이청훈' },
  { batch: '15기', name: '윤성재' },
  { batch: '24기', name: '김상우' },
  { batch: '24기', name: '서예명' },
  { batch: '26기', name: '김민규' },
  { batch: '27기', name: '권기빈' },
  { batch: '24기', name: '이건우' },
  { batch: '27기', name: '김동영' },
  { batch: '28기', name: '남영빈' },
  { batch: '28기', name: '윤준성' },
  { batch: '28기', name: '박재영' },
  { batch: '28기', name: '박상하' },
  { batch: '28기', name: '송시아' },
  { batch: '28기', name: '황지원' },
  { batch: '28기', name: '신주훈' },
  { batch: '28기', name: '강지원' },
];

// Helper function to merge fake data with real data (no duplicates)
const mergeWithFakeData = (realData: Registrant[], fakeData: Registrant[]): Registrant[] => {
  const realSet = new Set(realData.map(r => `${r.batch}-${r.name}`));
  const filteredFake = fakeData.filter(f => !realSet.has(`${f.batch}-${f.name}`));
  return [...realData, ...filteredFake];
};

// Helper function to filter out 29기 from the list
const filterOut29 = (registrants: Registrant[]): Registrant[] => {
  return registrants.filter(r => r.batch !== '29기');
};

// Helper function to sort by batch number (e.g., "29기" -> 29)
const sortByBatch = (registrants: Registrant[]): Registrant[] => {
  return [...registrants].sort((a, b) => {
    const batchA = parseInt(a.batch.replace(/[^0-9]/g, ''), 10) || 0;
    const batchB = parseInt(b.batch.replace(/[^0-9]/g, ''), 10) || 0;
    return batchA - batchB;
  });
};

// Helper function to mask name (middle character for 3+, last for 2)
const maskName = (name: string): string => {
  if (name.length <= 1) return name;
  if (name.length === 2) {
    return name[0] + '*';
  }
  // 3+ characters: mask middle character(s)
  const midIndex = Math.floor(name.length / 2);
  return name.slice(0, midIndex) + '*' + name.slice(midIndex + 1);
};

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
  const isBlurred = false;

  // Fetch initial stats and registrants
  useEffect(() => {
    const fetchData = async () => {
      const yonseiData = await getRegistrantsBySchool('YONSEI');
      const koreaData = await getRegistrantsBySchool('KOREA');

      // Merge with fake data (duplicates are automatically filtered)
      const mergedYonsei = mergeWithFakeData(yonseiData, FAKE_YONSEI_REGISTRANTS);
      const mergedKorea = mergeWithFakeData(koreaData, FAKE_KOREA_REGISTRANTS);

      // Filter out 29기 from both stats and display
      const filteredYonsei = filterOut29(mergedYonsei);
      const filteredKorea = filterOut29(mergedKorea);

      setStats({ yonsei: filteredYonsei.length, korea: filteredKorea.length });
      setYonseiRegistrants(sortByBatch(filteredYonsei));
      setKoreaRegistrants(sortByBatch(filteredKorea));
    };

    fetchData();

    const subscription = subscribeToStats(async () => {
      // Refresh registrant lists on stats change
      const yonseiData = await getRegistrantsBySchool('YONSEI');
      const koreaData = await getRegistrantsBySchool('KOREA');

      // Merge with fake data (duplicates are automatically filtered)
      const mergedYonsei = mergeWithFakeData(yonseiData, FAKE_YONSEI_REGISTRANTS);
      const mergedKorea = mergeWithFakeData(koreaData, FAKE_KOREA_REGISTRANTS);

      // Filter out 29기 from both stats and display
      const filteredYonsei = filterOut29(mergedYonsei);
      const filteredKorea = filterOut29(mergedKorea);

      setStats({ yonsei: filteredYonsei.length, korea: filteredKorea.length });
      setYonseiRegistrants(sortByBatch(filteredYonsei));
      setKoreaRegistrants(sortByBatch(filteredKorea));
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
              {reg.batch} {maskName(reg.name)}
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