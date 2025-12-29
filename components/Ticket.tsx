import React, { useState } from 'react';
import { School } from '../types';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

interface TicketProps {
  onSelect: (school: School) => void;
}

export const Ticket: React.FC<TicketProps> = ({ onSelect }) => {
  const [hoveredTicket, setHoveredTicket] = useState<'yonsei' | 'korea' | null>(null);

  return (
    <section id="ticket" className="relative min-h-screen w-full flex overflow-hidden">
      {/* Yonsei Ticket - Left Side */}
      <motion.div
        className="relative h-screen cursor-pointer overflow-hidden"
        animate={{
          width: hoveredTicket === 'korea' ? '40%' : hoveredTicket === 'yonsei' ? '60%' : '50%',
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHoveredTicket('yonsei')}
        onMouseLeave={() => setHoveredTicket(null)}
        onClick={() => onSelect(School.YONSEI)}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[#164075]" />

        {/* Ticket Content */}
        <div className="relative h-full flex flex-col justify-center items-center px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            {/* School badge */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src="/images/yonsei.svg"
                  alt="Yonsei Logo"
                  className="w-14 h-14 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Yonsei University</p>
            </div>

            {/* Main title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight">
              YONSEI
            </h2>
            <p className="text-white/50 text-base mb-6">연세대학교 동문</p>

            {/* Ticket details */}
            <div
              className={`space-y-2 mb-6 transition-opacity duration-300 ${hoveredTicket === 'yonsei' ? 'opacity-100' : 'opacity-60'
                }`}
            >
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <Calendar className="w-4 h-4" />
                <span>2026.1.16</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <Clock className="w-4 h-4" />
                <span>PM 8:00 ~</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4" />
                <span>케미스트리 강남</span>
              </div>
            </div>

            {/* Select button */}
            <motion.button
              animate={{
                opacity: hoveredTicket === 'yonsei' ? 1 : 0,
                y: hoveredTicket === 'yonsei' ? 0 : 10
              }}
              transition={{ duration: 0.2 }}
              className="px-6 py-3 bg-white text-[#164075] font-bold rounded-full flex items-center gap-2 mx-auto"
            >
              선택하기
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Korea Ticket - Right Side */}
      <motion.div
        className="relative h-screen cursor-pointer overflow-hidden"
        animate={{
          width: hoveredTicket === 'yonsei' ? '40%' : hoveredTicket === 'korea' ? '60%' : '50%',
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHoveredTicket('korea')}
        onMouseLeave={() => setHoveredTicket(null)}
        onClick={() => onSelect(School.KOREA)}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[#781820]" />

        {/* Ticket Content */}
        <div className="relative h-full flex flex-col justify-center items-center px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            {/* School badge */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src="/images/korea.svg"
                  alt="Korea Logo"
                  className="w-14 h-14 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Korea University</p>
            </div>

            {/* Main title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight">
              KOREA
            </h2>
            <p className="text-white/50 text-base mb-6">고려대학교 동문</p>

            {/* Ticket details */}
            <div
              className={`space-y-2 mb-6 transition-opacity duration-300 ${hoveredTicket === 'korea' ? 'opacity-100' : 'opacity-60'
                }`}
            >
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <Calendar className="w-4 h-4" />
                <span>2026.1.16</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <Clock className="w-4 h-4" />
                <span>PM 8:00 ~</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4" />
                <span>케미스트리 강남</span>
              </div>
            </div>

            {/* Select button */}
            <motion.button
              animate={{
                opacity: hoveredTicket === 'korea' ? 1 : 0,
                y: hoveredTicket === 'korea' ? 0 : 10
              }}
              transition={{ duration: 0.2 }}
              className="px-6 py-3 bg-white text-[#781820] font-bold rounded-full flex items-center gap-2 mx-auto"
            >
              선택하기
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 pointer-events-none z-10" />
    </section>
  );
};