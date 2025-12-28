import React, { useState } from 'react';
import { School } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket as TicketIcon, ArrowRight } from 'lucide-react';

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
          width: hoveredTicket === 'korea' ? '30%' : hoveredTicket === 'yonsei' ? '70%' : '50%',
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHoveredTicket('yonsei')}
        onMouseLeave={() => setHoveredTicket(null)}
        onClick={() => onSelect(School.YONSEI)}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a6e] via-[#164075] to-[#0f2847]" />

        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }} />
          <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full border border-white/20" />
          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full border border-white/10" />
        </div>

        {/* Ticket Content */}
        <div className="relative h-full flex flex-col justify-center items-center px-8 md:px-16">
          {/* Ticket stub line - right side (since showing right half) */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-white/20" style={{
            background: 'repeating-linear-gradient(to bottom, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)'
          }} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            {/* School badge */}
            <motion.div
              className="mb-8"
              animate={{ scale: hoveredTicket === 'yonsei' ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 overflow-hidden">
                {/* 로고 이미지 경로를 여기에 설정하세요 */}
                <img
                  src="/images/yonsei.svg"
                  alt="Yonsei Logo"
                  className="w-16 h-16 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <p className="text-white/50 text-xs uppercase tracking-[0.3em]">Yonsei University</p>
            </motion.div>

            {/* Main title */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight">
              YONSEI
            </h2>
            <p className="text-white/60 text-lg mb-8">연세대학교 동문</p>

            {/* Ticket details */}
            <motion.div
              className="space-y-3 mb-8"
              animate={{ opacity: hoveredTicket === 'yonsei' ? 1 : 0.7 }}
            >
              <div className="flex items-center justify-center gap-3 text-white/70">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">JAN 16, 2026</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/70">
                <Clock className="w-4 h-4" />
                <span className="text-sm">PM 8:00 ~</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/70">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">케미스트리 강남</span>
              </div>
            </motion.div>

            {/* Select button - only visible on hover */}
            <motion.button
              animate={{
                opacity: hoveredTicket === 'yonsei' ? 1 : 0,
                y: hoveredTicket === 'yonsei' ? 0 : 20
              }}
              transition={{ duration: 0.3 }}
              className="px-8 py-3 bg-white text-[#164075] font-bold rounded-full flex items-center gap-2 mx-auto hover:bg-white/90 transition-colors"
            >
              <TicketIcon className="w-5 h-5" />
              티켓 선택
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Ticket stub circles */}
          <div className="absolute right-[-12px] top-1/2 transform -translate-y-1/2">
            <div className="w-6 h-6 rounded-full bg-brand-bg" />
          </div>
        </div>
      </motion.div>

      {/* Korea Ticket - Right Side */}
      <motion.div
        className="relative h-screen cursor-pointer overflow-hidden"
        animate={{
          width: hoveredTicket === 'yonsei' ? '30%' : hoveredTicket === 'korea' ? '70%' : '50%',
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHoveredTicket('korea')}
        onMouseLeave={() => setHoveredTicket(null)}
        onClick={() => onSelect(School.KOREA)}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-bl from-[#8a2530] via-[#781820] to-[#4a0f14]" />

        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }} />
          <div className="absolute top-1/4 left-0 w-64 h-64 rounded-full border border-white/20" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full border border-white/10" />
        </div>

        {/* Ticket Content */}
        <div className="relative h-full flex flex-col justify-center items-center px-8 md:px-16">
          {/* Ticket stub line - left side (since showing left half) */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/20" style={{
            background: 'repeating-linear-gradient(to bottom, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)'
          }} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            {/* School badge */}
            <motion.div
              className="mb-8"
              animate={{ scale: hoveredTicket === 'korea' ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 overflow-hidden">
                {/* 로고 이미지 경로를 여기에 설정하세요 */}
                <img
                  src="/images/korea.svg"
                  alt="Korea Logo"
                  className="w-16 h-16 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <p className="text-white/50 text-xs uppercase tracking-[0.3em]">Korea University</p>
            </motion.div>

            {/* Main title */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight">
              KOREA
            </h2>
            <p className="text-white/60 text-lg mb-8">고려대학교 동문</p>

            {/* Ticket details */}
            <motion.div
              className="space-y-3 mb-8"
              animate={{ opacity: hoveredTicket === 'korea' ? 1 : 0.7 }}
            >
              <div className="flex items-center justify-center gap-3 text-white/70">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">JAN 16, 2026</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/70">
                <Clock className="w-4 h-4" />
                <span className="text-sm">PM 8:00 ~</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/70">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">케미스트리 강남</span>
              </div>
            </motion.div>

            {/* Select button - only visible on hover */}
            <motion.button
              animate={{
                opacity: hoveredTicket === 'korea' ? 1 : 0,
                y: hoveredTicket === 'korea' ? 0 : 20
              }}
              transition={{ duration: 0.3 }}
              className="px-8 py-3 bg-white text-[#781820] font-bold rounded-full flex items-center gap-2 mx-auto hover:bg-white/90 transition-colors"
            >
              <TicketIcon className="w-5 h-5" />
              티켓 선택
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Ticket stub circles */}
          <div className="absolute left-[-12px] top-1/2 transform -translate-y-1/2">
            <div className="w-6 h-6 rounded-full bg-brand-bg" />
          </div>
        </div>
      </motion.div>

      {/* Center divider line */}
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 transform -translate-x-1/2 pointer-events-none z-10"
        animate={{
          opacity: hoveredTicket ? 0 : 1,
          scaleY: hoveredTicket ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
      />

      {/* VS Badge */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        animate={{
          scale: hoveredTicket ? 0 : 1,
          opacity: hoveredTicket ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 rounded-full bg-brand-bg border-2 border-accent-gold/50 flex items-center justify-center shadow-xl">
          <span className="text-accent-gold font-black text-lg">VS</span>
        </div>
      </motion.div>
    </section>
  );
};