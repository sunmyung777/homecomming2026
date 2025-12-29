import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';

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
        id: '100000project',
        title: '100,000 Project',
        date: '9/5 ~ 9/19 29기 학회 활동',
        images: ['/images/timeline/10000project_1.jpg'],
        description: '창업의 첫 걸음, 10만원으로 수익 창출에 도전하는 프로젝트. 각 팀이 창의적인 아이디어로 실제 비즈니스를 경험했습니다.'
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
        description: '비즈니스 모델 발표와 피드백 세션. 해외 비즈니스 모델을 현지화하여 아이디어를 가다듬었습니다.'
    },
    {
        id: 'mt',
        title: 'MT',
        date: '11/1 ~ 11/2',
        images: ['/images/timeline/mt_1.jpg'],
        description: '29기들의 친목 도모 시간. 즐거운 2일을 보내며 더욱 끈끈해졌습니다.'
    },
    {
        id: 'alumni',
        title: 'ALUMNI LEAP',
        date: '11/1 ~ 11/21',
        images: ['/images/timeline/alumni_1.jpg', '/images/timeline/alumni_2.jpg', '/images/timeline/alumni_3.jpg'],
        description: '라이너와 함께 Liner for teams를 마케팅,세일즈 해보며 실전 감각을 기르고 다양한 방안을 모색했습니다.'
    },
    {
        id: 'snusv',
        title: 'INSIDERS X SNUSV',
        date: '11/3',
        images: ['/images/timeline/snusv_1.jpg'],
        description: 'SNUSV와 딥테크 학회를 모은 네트워킹 행사. 100명 넘는 학생들이 모여 각자의 분야에 대해 공유하는 뜻깊은 자리를 가졌습니다.'
    },
    {
        id: 'ideathon',
        title: 'menTory IDEATHON',
        date: '11/15 ~ 11/16',
        images: ['/images/timeline/ideathon_1.jpg'],
        description: '48시간 아이디어톤! menTory와 함께 농업 분야 비즈니스 모델 발굴을 위해 아이디어톤을 진행했습니다.'
    },
    {
        id: 'zuzu',
        title: 'ZUZU X CCB Party',
        date: '11/18',
        images: ['/images/timeline/zuzu_1.png'],
        description: 'ZUZU와 CCB가 함께한 네트워킹 파티. 여러 창업 단체 및 스타트업 플레이어들과 창업에 대한 진솔한 대화를 나누는 자리를 가졌습니다.'
    },
    {
        id: 'next',
        title: 'INSIDERS X NEXT',
        date: '12/5',
        images: ['/images/timeline/next_1.jpg'],
        description: '고려대 개발창업 학회 NEXT와의 네트워킹 행사. 서로 학회원들 간의 지식을 공유하며 다양한 인사이트를 주고 받았습니다.'
    },
    {
        id: 'comeup',
        title: 'COMEUP 2025',
        date: '12/12',
        images: ['/images/timeline/comeup_1.jpg'],
        description: '국내 최대 스타트업 페스티벌 COMEUP에서 INSIDERS 네트워킹 라운지를 운영했습니다.'
    },
    {
        id: 'bold',
        title: 'BOLD Demo Day',
        date: '12/18',
        images: ['/images/timeline/bold_1.jpg'],
        description: 'BOLD 프로그램의 데모데이. acting 기수, alumni 등 여러 인사이더스 팀이 출전해 우수한 성과를 이뤘습니다.'
    },
    {
        id: 'theventures',
        title: 'INSIDERS X TheVentures',
        date: '12/22',
        images: ['/images/timeline/theventures_1.jpg'],
        description: '더벤처스와의 네트워킹 행사. 소비재 창업에 관한 투자자와 창업가의 관점을 공유하고 네트워킹을 하는 시간을 가졌습니다.'
    },
    {
        id: 'mvp',
        title: 'MVP Project',
        date: '12/26 ~ 1/31',
        images: ['/images/timeline/mvp_1.jpg'],
        description: 'Pre-acting의 마무리를 장식하는 MVP 프로젝트. 기획부터 개발, 런칭까지 스타트업의 전 과정을 경험합니다.',
        isUpcoming: true
    },
    {
        id: 'demoday',
        title: 'INSIDERS DEMO DAY',
        date: '1/31',
        images: ['/images/timeline/demoday_1.jpg'],
        description: '29기의 모든 여정이 결실을 맺는 날. MVP 프로젝트의 최종 발표와 함께 한 학기의 성장을 공유합니다.',
        isUpcoming: true
    },
];

// Single event card component
const EventCard: React.FC<{ event: TimelineEvent; isActive: boolean }> = ({ event, isActive }) => {
    const renderImages = () => {
        const images = event.images;
        const count = images.length;

        if (count === 1) {
            return (
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10">
                    <img src={images[0]} alt={event.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
            );
        } else {
            return (
                <>
                    <div className="absolute top-0 left-0 w-[55%] h-[70%] rounded-xl overflow-hidden border border-white/10 z-10">
                        <img src={images[0]} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="absolute top-[15%] right-0 w-[50%] h-[55%] rounded-xl overflow-hidden border border-white/10 z-20">
                        <img src={images[1]} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    {images[2] && (
                        <div className="absolute bottom-0 right-[10%] w-[45%] h-[45%] rounded-xl overflow-hidden border border-white/10 z-30">
                            <img src={images[2]} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        </div>
                    )}
                </>
            );
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isActive && (
                <motion.div
                    key={event.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto w-full">
                        {/* Left: Text Content */}
                        <div className="space-y-4">
                            <p className="text-accent-gold/60 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {event.date}
                            </p>

                            <h2 className="font-sans font-black text-4xl md:text-5xl text-brand-text leading-tight">
                                {event.title}
                            </h2>

                            {event.isUpcoming && (
                                <span className="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold text-xs font-medium uppercase tracking-wider rounded-full">
                                    Coming Soon
                                </span>
                            )}

                            <p className="text-brand-text/60 text-base leading-relaxed max-w-lg">
                                {event.description}
                            </p>
                        </div>

                        {/* Right: Images */}
                        <div className="relative h-[280px] md:h-[350px] lg:h-[400px]">
                            {renderImages()}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
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

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Use round instead of floor with offset to prevent off-by-one at boundaries
        const newIndex = Math.min(
            Math.max(0, Math.round(latest * (eventCount - 1))),
            eventCount - 1
        );
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    });

    const scrollToEvent = (index: number) => {
        if (!containerRef.current) return;

        const containerTop = containerRef.current.offsetTop;
        const totalHeight = containerRef.current.scrollHeight;
        // Adjusted to match the new index formula
        const targetScrollPosition = containerTop + (index / (eventCount - 1)) * (totalHeight - window.innerHeight);

        window.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth'
        });
    };

    return (
        <section id="timeline" ref={containerRef} className="relative bg-brand-deep">
            {/* Reduced scroll height: 70vh per event instead of 100vh */}
            <div style={{ height: `${eventCount * 70}vh` }}>
                {/* Sticky container */}
                <div className="sticky top-0 h-screen overflow-hidden">
                    {/* Main Content Area */}
                    <div className="relative z-10 h-[calc(100vh-140px)] flex items-center pt-16">
                        {timelineData.map((event, idx) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                isActive={idx === activeIndex}
                            />
                        ))}
                    </div>

                    {/* Bottom Timeline Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-t from-brand-deep to-transparent">
                        <div className="h-full max-w-6xl mx-auto px-6 flex items-end pb-8">
                            <div className="relative w-full">
                                {/* Background line */}
                                <div className="absolute bottom-5 left-0 right-0 h-px bg-white/10" />

                                {/* Progress line */}
                                <motion.div
                                    className="absolute bottom-5 left-0 h-px bg-accent-gold origin-left"
                                    style={{ scaleX: scrollYProgress }}
                                />

                                {/* Timeline items */}
                                <div className="relative flex justify-between">
                                    {timelineData.map((event, idx) => (
                                        <button
                                            key={event.id}
                                            onClick={() => scrollToEvent(idx)}
                                            className="flex flex-col items-center cursor-pointer group"
                                            style={{ flex: 1 }}
                                        >
                                            {/* Event name */}
                                            <span
                                                className={`text-[8px] md:text-[10px] font-medium text-center leading-tight mb-2 px-0.5 h-8 flex items-end justify-center transition-colors duration-200 ${idx === activeIndex ? 'text-accent-gold' : 'text-brand-line/30 group-hover:text-brand-line/60'
                                                    }`}
                                            >
                                                {event.title}
                                            </span>

                                            {/* Dot - larger for better touch target */}
                                            <div
                                                className={`w-4 h-4 rounded-full transition-all duration-200 ${idx === activeIndex
                                                    ? 'bg-accent-gold'
                                                    : idx < activeIndex
                                                        ? 'bg-accent-gold/50'
                                                        : 'bg-white/20 group-hover:bg-white/30'
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
