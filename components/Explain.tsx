import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Explain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section id="about" ref={containerRef} className="relative min-h-[200vh] px-6 md:px-12">
      {/* Subtle background - single gradient only */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent-gold/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Sticky Left Side */}
          <div className="hidden md:block">
            <div className="sticky top-32 h-fit">
              <h2 className="font-sans font-black text-5xl lg:text-7xl tracking-tighter text-brand-text">
                위대한 질주
              </h2>
              <div className="h-0.5 w-24 bg-accent-gold mt-6" />
              <p className="font-mono text-accent-gold/70 mt-4 text-sm tracking-wide">[ɡæləp]</p>
              <p className="text-brand-text/40 text-xs mt-2 max-w-xs leading-relaxed">
                A horse's fastest pace, with all four feet off the ground together in each stride.
              </p>
            </div>
          </div>

          {/* Scrolling Right Side */}
          <div className="space-y-32 py-32">
            {/* Mobile visible title */}
            <div className="md:hidden mb-12">
              <h2 className="font-sans font-black text-5xl tracking-tighter text-brand-text">
                위대한 질주
              </h2>
              <div className="h-0.5 w-16 bg-accent-gold mt-4" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.6 }}
              className="relative pl-6 border-l border-accent-gold/20"
            >
              <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-brand-bg border-2 border-accent-gold/40 flex items-center justify-center text-xs text-accent-gold/60 font-bold">1</span>
              <h3 className="text-xl font-bold text-white mb-4">2026, 말의 해</h3>
              <p className="text-brand-text/60 text-base leading-loose">
                <span className="text-accent-gold font-medium">2026년 병오년</span>은 불의 에너지를 품은 말의 해입니다.
                <br />창립제는 각자의 자리에서 달려온 선배님들이, 지금을 점검하는 자리입니다.
                <br />혼자 고민하던 질문을, 같은 사고를 가진 사람들과 함께 확인하세요.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.6 }}
              className="relative pl-6 border-l border-accent-gold/20"
            >
              <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-brand-bg border-2 border-accent-gold/40 flex items-center justify-center text-xs text-accent-gold/60 font-bold">2</span>
              <h3 className="text-xl font-bold text-white mb-4">INSIDERS</h3>
              <p className="text-brand-text/60 text-base leading-loose">
                <span className="text-accent-gold font-medium">INSIDERS</span>는 항상 말보다 실행을 선택해온 단체입니다.
                <br />창립제를 통해 실행력을 다시 상기하고자 합니다.
                <br />비슷한 속도의 사람들과 만나야, 다음 단계가 더 선명해집니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.6 }}
              className="relative pl-6 border-l border-accent-gold/20"
            >
              <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-brand-bg border-2 border-accent-gold/40 flex items-center justify-center text-xs text-accent-gold/60 font-bold">3</span>
              <h3 className="text-xl font-bold text-white mb-4">쉬어가는 밤</h3>
              <p className="text-brand-text/60 text-base leading-loose">
                스프린트에는 휴식이 필요합니다.
                <br />창립제는 각자의 다음 질주를 시작하기 위해 모이는 밤입니다.
                <br />이 자리에서 재충전 후 각자의 삶에서 질주할 수 있길 바랍니다.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};