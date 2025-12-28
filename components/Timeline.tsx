import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Calendar, ImageIcon } from 'lucide-react';

interface TimelineEvent {
    id: string;
    title: string;
    date: string;
    images: string[];
    description: string;
    isUpcoming?: boolean;
}

const timelineData: TimelineEvent[] = [
    {
        id: '10000project',
        title: '10,000 Project',
        date: '9/5 ~ 9/19 29기 학회 활동',
        images: ['/images/timeline/10000project_1.jpg'],
        description: '창업의 첫 걸음, 1만원으로 수익 창출에 도전하는 프로젝트. 각 팀이 창의적인 아이디어로 실제 비즈니스를 경험했습니다.'
    },
    {
        id: 'lean',
        title: 'Lean Startup',
        date: '9/19 ~ 10/10',
        images: ['/images/timeline/lean_1.jpg', '/images/timeline/lean_2.jpg', '/images/timeline/lean_3.jpg'],
        description: '고객의 진짜 문제를 찾아내고 해결책을 설계하는 여정. 3주간의 집중 세션을 통해 린스타트업 방법론의 핵심을 체화했습니다.'
    },
    {
        id: 'bmbm',
        title: 'BMBM',
        date: '10/31',
        images: ['/images/timeline/bmbm_1.jpg'],
        description: '비즈니스 모델 발표와 피드백 세션. 현직 창업가들의 날카로운 조언을 받으며 아이디어를 가다듬었습니다.'
    },
    {
        id: 'mt',
        title: 'MT',
        date: '11/1 ~ 11/2',
        images: ['/images/timeline/mt_1.jpg'],
        description: '비즈니스 모델 발표와 피드백 세션. 현직 창업가들의 날카로운 조언을 받으며 아이디어를 가다듬었습니다.'
    },
    {
        id: 'alumni',
        title: 'ALUMNI LEAP',
        date: '11/1 ~ 11/21',
        images: ['/images/timeline/alumni_1.jpg', '/images/timeline/alumni_2.jpg', '/images/timeline/alumni_3.jpg'],
        description: '선배들의 커리어 이야기와 1:1 멘토링. 창업, 취업, VC 등 다양한 분야의 선배들과 깊이 있는 대화를 나눴습니다.'
    },
    {
        id: 'snusv',
        title: 'INSIDERS X SNUSV',
        date: '11/3',
        images: ['/images/timeline/snusv_1.jpg'],
        description: '서울대 벤처클럽과의 네트워킹 행사. 양교의 창업 열정이 만나 시너지를 만들어낸 특별한 자리였습니다.'
    },
    {
        id: 'ideathon',
        title: 'menTory IDEATHON',
        date: '11/15 ~ 11/16',
        images: ['/images/timeline/ideathon_1.jpg'],
        description: '48시간 아이디어톤! 멘토리와 함께한 집중 아이디에이션 캠프.'
    },
    {
        id: 'zuzu',
        title: 'ZUZU X CCB Party',
        date: '11/18',
        images: ['/images/timeline/zuzu_1.png'],
        description: 'ZUZU와 CCB가 함께한 네트워킹 파티. 스타트업 생태계의 다양한 플레이어들을 만났습니다.'
    },
    {
        id: 'next',
        title: 'INSIDERS X Next',
        date: '12/5',
        images: ['/images/timeline/next_1.jpg'],
        description: 'Next와의 네트워킹. VC 관점에서의 스타트업 평가 기준과 투자 유치 전략을 배웠습니다.'
    },
    {
        id: 'comeup',
        title: 'COMEUP 2025',
        date: '12/12',
        images: ['/images/timeline/comeup_1.jpg'],
        description: '국내 최대 스타트업 페스티벌 COMEUP에서 INSIDERS 라운지를 운영했습니다.'
    },
    {
        id: 'bold',
        title: 'BOLD Demo Day',
        date: '12/18',
        images: ['/images/timeline/bold_1.jpg'],
        description: 'BOLD 프로그램의 데모데이. 혁신적인 아이디어들이 세상에 공개되었습니다.'
    },
    {
        id: 'theventures',
        title: 'X TheVentures',
        date: '12/22',
        images: ['/images/timeline/theventures_1.jpg'],
        description: '더벤처스와의 네트워킹. 글로벌 투자 동향과 인사이트를 공유받았습니다.'
    },
    {
        id: 'mvp',
        title: 'MVP Project',
        date: '12/26 ~ 1/31',
        images: ['/images/timeline/mvp_1.jpg'],
        description: '실제 동작하는 MVP를 만드는 프로젝트. 기획부터 개발, 런칭까지 스타트업의 전 과정을 경험합니다.',
        isUpcoming: true
    },
    {
        id: 'demoday',
        title: 'DEMO DAY',
        date: '1/31',
        images: ['/images/timeline/demoday_1.jpg'],
        description: '29기의 모든 여정이 결실을 맺는 날. MVP 프로젝트의 최종 발표와 함께 한 학기의 성장을 공유합니다.',
        isUpcoming: true
    },
];

// Single event card component - now uses state for instant switching
const EventCard: React.FC<{ event: TimelineEvent; isActive: boolean }> = ({ event, isActive }) => {
    const renderImages = () => {
        const images = event.images;
        const count = images.length;

        if (count === 1) {
            return (
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img src={images[0]} alt={event.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
            );
        } else {
            return (
                <>
                    <div className="absolute top-0 left-0 w-[55%] h-[70%] rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-10">
                        <img src={images[0]} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="absolute top-[15%] right-0 w-[50%] h-[55%] rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-20">
                        <img src={images[1]} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    {images[2] && (
                        <div className="absolute bottom-0 right-[10%] w-[45%] h-[45%] rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-30">
                            <img src={images[2]} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        </div>
                    )}
                </>
            );
        }
    };

    if (!isActive) return null;

    return (
        <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto w-full">
                {/* Left: Text Content */}
                <div className="space-y-4">
                    <p className="text-accent-gold/80 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                    </p>

                    <h2 className="font-sans font-black text-4xl md:text-5xl lg:text-6xl text-brand-text leading-[0.95]">
                        {event.title}
                    </h2>

                    {event.isUpcoming && (
                        <span className="inline-block px-3 py-1 bg-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-wider rounded-full animate-pulse">
                            Coming Soon
                        </span>
                    )}

                    <p className="text-brand-text/70 text-base md:text-lg leading-relaxed max-w-lg">
                        {event.description}
                    </p>
                </div>

                {/* Right: Images */}
                <div className="relative h-[280px] md:h-[350px] lg:h-[400px]">
                    {renderImages()}
                </div>
            </div>
        </motion.div>
    );
};

export const Timeline: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const eventCount = timelineData.length;

    // Update active index based on scroll position
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const newIndex = Math.min(
            Math.floor(latest * eventCount),
            eventCount - 1
        );
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    });

    // Scroll to specific event when clicking on timeline bar
    const scrollToEvent = (index: number) => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const containerTop = containerRef.current.offsetTop;
        const totalHeight = containerRef.current.scrollHeight;
        const sectionHeight = totalHeight / eventCount;

        const targetScrollPosition = containerTop + (index * sectionHeight);

        window.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth'
        });
    };

    return (
        <section id="timeline" ref={containerRef} className="relative bg-gradient-to-br from-brand-deep via-brand-bg to-brand-deep">
            {/* This creates the scroll height - each event gets ~100vh of scroll space */}
            <div style={{ height: `${eventCount * 100}vh` }}>
                {/* Sticky container that stays in view */}
                <div className="sticky top-0 h-screen overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-gold/5 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-accent-teal/5 to-transparent" />
                    </div>

                    {/* Main Content Area */}
                    <div className="relative z-10 h-[calc(100vh-160px)] flex items-center pt-16">
                        {timelineData.map((event, idx) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                isActive={idx === activeIndex}
                            />
                        ))}
                    </div>

                    {/* Bottom Timeline Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-[160px] bg-gradient-to-t from-brand-bg via-brand-bg/90 to-transparent">
                        <div className="h-full max-w-6xl mx-auto px-6 flex items-end pb-8">
                            <div className="relative w-full">
                                {/* Background line */}
                                <div className="absolute bottom-[22px] left-0 right-0 h-[2px] bg-brand-line/20" />

                                {/* Progress line */}
                                <motion.div
                                    className="absolute bottom-[22px] left-0 h-[2px] bg-accent-gold origin-left"
                                    style={{ scaleX: scrollYProgress }}
                                />

                                {/* Timeline items */}
                                <div className="relative flex justify-between">
                                    {timelineData.map((event, idx) => (
                                        <button
                                            key={event.id}
                                            onClick={() => scrollToEvent(idx)}
                                            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                                            style={{ flex: 1 }}
                                        >
                                            {/* Event name */}
                                            <span
                                                className={`text-[8px] md:text-[10px] font-medium text-center leading-tight mb-2 px-0.5 h-8 flex items-end justify-center transition-colors duration-200 ${idx === activeIndex ? 'text-accent-gold' : 'text-brand-line/40 hover:text-brand-line/70'
                                                    }`}
                                            >
                                                {event.title}
                                            </span>

                                            {/* Dot */}
                                            <div
                                                className={`w-3 h-3 rounded-full transition-all duration-200 ${idx === activeIndex
                                                    ? 'bg-accent-gold shadow-lg shadow-accent-gold/50'
                                                    : idx < activeIndex
                                                        ? 'bg-accent-gold/60'
                                                        : 'bg-brand-line/30 hover:bg-brand-line/50'
                                                    }`}
                                            />

                                            {/* Active bar indicator */}
                                            <div
                                                className={`w-10 h-1 rounded-full mt-2 transition-opacity duration-200 ${idx === activeIndex ? 'bg-accent-gold opacity-100' : 'opacity-0'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
