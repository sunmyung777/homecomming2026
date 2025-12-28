import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Rocket, Heart } from 'lucide-react';

export const Explain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.3, 1, 1, 0.3]);

  return (
    <section id="about" ref={containerRef} className="relative min-h-[200vh] px-6 md:px-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-accent-gold/8 to-transparent rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-gradient-to-r from-accent-teal/8 to-transparent rounded-full blur-[60px]" />
        {/* Floating particles */}
        <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-accent-gold/40 animate-float-slow" />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-accent-teal/30 animate-float-fast" />
        <div className="absolute bottom-32 left-1/3 w-1 h-1 rounded-full bg-accent-rose/40 animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Sticky Left Side - Fixed position while scrolling */}
          <div className="hidden md:block">
            <div className="sticky top-32 h-fit">
              <motion.h2
                className="font-sans font-black text-7xl lg:text-9xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-accent-gold via-accent-goldLight to-accent-gold/60 drop-shadow-[0_0_30px_rgba(201,169,98,0.3)]"
              >
                위대한 질주
              </motion.h2>
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-1.5 bg-gradient-to-r from-accent-gold via-accent-teal to-accent-gold mt-4 origin-left w-128 rounded-full"
              />
              <p className="font-mono text-accent-gold/80 mt-4 text-sm tracking-wide">[ɡæləp]</p>
              <p className="text-brand-text/50 text-xs mt-2 max-w-xs leading-relaxed">
                A horse's fastest pace, with all four feet off the ground together in each stride.
              </p>
            </div>
          </div>

          {/* Scrolling Right Side */}
          <div className="space-y-48 py-32">
            {/* Mobile visible title */}
            <div className="md:hidden mb-12">
              <h2 className="font-sans font-black text-6xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-accent-gold via-accent-goldLight to-accent-gold/60">
                위대한 질주
              </h2>
              <div className="h-1 w-128 bg-gradient-to-r from-accent-gold to-accent-teal mt-4 rounded-full" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.8 }}
              className="group relative"
            >
              <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-accent-goldLight">01</span>
                <div className="w-8 h-px bg-gradient-to-r from-accent-gold/50 to-transparent" />
                <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                  <Zap className="w-4 h-4 text-accent-gold" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">2026, The Year to Run</h3>
              <p className="text-brand-text/70 text-lg leading-loose">
                <span className="text-accent-gold font-semibold border-b border-accent-gold/50">2026년 병오년</span>은 불의 에너지를 품은 말의 해입니다.
                <br />창립제는 각자의 자리에서 달려온 선배님들이, 지금을 점검하는 자리입니다.
                <br />혼자 고민하던 질문을, 같은 사고를 가진 사람들과 함께 확인하세요.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.8 }}
              className="group relative"
            >
              <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-accent-goldLight">02</span>
                <div className="w-8 h-px bg-gradient-to-r from-accent-gold/50 to-transparent" />
                <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                  <Rocket className="w-4 h-4 text-accent-gold" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">INSIDERS</h3>
              <p className="text-brand-text/70 text-lg leading-loose">
                <span className="text-accent-gold font-semibold border-b border-accent-gold/50">INSIDERS</span>는 항상 말보다 실행을 선택해온 단체입니다.
                <br />창립제를 통해 실행력을 다시 상기하고자 합니다.
                <br />비슷한 속도의 사람들과 만나야, 다음 단계가 더 선명해집니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.8 }}
              className="group relative"
            >
              <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-accent-goldLight">03</span>
                <div className="w-8 h-px bg-gradient-to-r from-accent-gold/50 to-transparent" />
                <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                  <Heart className="w-4 h-4 text-accent-gold" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">REST</h3>
              <p className="text-brand-text/70 text-lg leading-loose">
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