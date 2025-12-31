import React, { useState, useEffect } from 'react';
import { Section } from './ui/Section';
import { School, Participant } from '../types';
import { Check, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitRegistration } from '../lib/supabase';

interface RegisterProps {
  selectedSchool: School | null;
  setSelectedSchool: (school: School | null) => void;
}

export const Register: React.FC<RegisterProps> = ({ selectedSchool, setSelectedSchool }) => {
  const [formData, setFormData] = useState<Partial<Participant> & { message?: string }>({
    name: '',
    phone: '',
    batch: '',
    message: '',
    isSponsor: false,
    request: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSponsorToast, setShowSponsorToast] = useState(false);

  useEffect(() => {
    if (selectedSchool) {
      setFormData(prev => ({ ...prev, school: selectedSchool }));
    }
  }, [selectedSchool]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const type = (e.target as HTMLInputElement).type;

    if (name === 'phone') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      let formatted = numbersOnly;
      if (numbersOnly.length > 3 && numbersOnly.length <= 7) {
        formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      } else if (numbersOnly.length > 7) {
        formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
      }
      setFormData(prev => ({ ...prev, phone: formatted }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSponsorToggle = () => {
    const newValue = !formData.isSponsor;
    setFormData(prev => ({ ...prev, isSponsor: newValue }));
    if (newValue) {
      setShowSponsorToast(true);
      setTimeout(() => setShowSponsorToast(false), 3000);
    }
  };

  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSchool) {
      alert('학교를 선택해주세요.');
      return;
    }

    await actualSubmit();
  };

  const actualSubmit = async (withSponsor?: boolean) => {
    setIsSubmitting(true);

    try {
      const result = await submitRegistration({
        name: formData.name || '',
        phone: formData.phone || '',
        batch: formData.batch || '',
        school: selectedSchool === School.YONSEI ? 'YONSEI' : 'KOREA',
        is_sponsor: formData.isSponsor ?? false,
        request: formData.request || ''
      });

      if (result.success) {
        setIsSuccess(true);
      } else if (result.isDuplicate) {
        setIsDuplicate(true);
      } else {
        alert('신청 중 오류가 발생했습니다: ' + (result.error || '다시 시도해주세요.'));
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal component
  const Modal = ({ show, onClose, isError, title, message, buttonText }: {
    show: boolean;
    onClose: () => void;
    isError?: boolean;
    title: string;
    message: string;
    buttonText: string;
  }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-bg/90"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 text-center bg-brand-deep p-10 rounded-2xl border border-white/10 max-w-sm w-full"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <span className="text-white/50 text-lg">×</span>
            </button>

            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${isError ? 'bg-red-500/20' : 'bg-accent-gold/20'
              }`}>
              {isError ? (
                <span className="text-red-400 text-2xl font-bold">!</span>
              ) : (
                <Check className="w-8 h-8 text-accent-gold" />
              )}
            </div>

            <h3 className={`font-bold text-2xl mb-3 ${isError ? 'text-red-400' : 'text-accent-gold'}`}>
              {title}
            </h3>
            <p className="text-brand-line mb-6 text-sm leading-relaxed">
              {message}
            </p>

            <button
              onClick={onClose}
              className={`w-full py-3 font-bold rounded-xl transition-colors ${isError
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-accent-gold text-brand-bg hover:bg-accent-goldLight'
                }`}
            >
              {buttonText}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Toast Component for sponsor feedback
  const SponsorToast = () => (
    <AnimatePresence>
      {showSponsorToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3"
        >
          <span className="text-2xl">🙇</span>
          <span className="font-medium">감사합니다! 개별적으로 정중히 안내드리겠습니다</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <Section id="register" className="relative overflow-hidden mt-20">
      {/* Sponsor Toast */}
      <SponsorToast />
      {/* Success Modal */}
      <Modal
        show={isSuccess}
        onClose={() => setIsSuccess(false)}
        title="신청 완료!"
        message="참가 신청이 완료되었습니다. 행사 관련 안내는 입력해주신 연락처로 발송됩니다."
        buttonText="확인"
      />

      {/* Duplicate Modal */}
      <Modal
        show={isDuplicate}
        onClose={() => setIsDuplicate(false)}
        isError
        title="이미 신청됨"
        message="동일한 이름과 연락처로 이미 참가 신청이 완료되었습니다."
        buttonText="확인"
      />

      <div className="max-w-2xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent-gold/60 text-xs uppercase tracking-widest mb-2">참가 신청</p>
            <h2 className="font-sans font-bold text-3xl text-brand-text">INSIDERS 창립제 2026</h2>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 rounded-2xl border border-white/10 p-8 md:p-10 mb-16"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* School Toggle */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setSelectedSchool(School.YONSEI)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSchool === School.YONSEI
                  ? 'bg-[#164075] text-white'
                  : 'text-brand-line hover:text-white'
                  }`}
              >
                YONSEI
              </button>
              <button
                type="button"
                onClick={() => setSelectedSchool(School.KOREA)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSchool === School.KOREA
                  ? 'bg-[#781820] text-white'
                  : 'text-brand-line hover:text-white'
                  }`}
              >
                KOREA
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-brand-line/70 uppercase tracking-wider mb-2">이름</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 px-4 text-brand-text focus:border-accent-gold/50 focus:outline-none transition-colors placeholder:text-brand-line/30"
                  placeholder="성함을 입력해주세요"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brand-line/70 uppercase tracking-wider mb-2">연락처</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 px-4 text-brand-text focus:border-accent-gold/50 focus:outline-none transition-colors placeholder:text-brand-line/30"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-line/70 uppercase tracking-wider mb-2">기수</label>
                  <div className="relative">
                    <select
                      name="batch"
                      required
                      value={formData.batch}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 px-4 text-brand-text focus:border-accent-gold/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-brand-bg text-brand-line">기수 선택</option>
                      {Array.from({ length: 29 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={`${num}기`} className="bg-brand-bg text-brand-text">
                          {num}기
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-brand-line/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Info */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/5 space-y-3 text-sm">
              <h4 className="text-accent-gold font-medium uppercase text-xs tracking-wider mb-3">행사 정보</h4>
              <p><span className="text-brand-line/50">날짜:</span> <span className="text-brand-text">2026년 1월 16일 (금)</span></p>
              <p><span className="text-brand-line/50">시간:</span> <span className="text-brand-text">오후 8시 ~</span></p>
              <p><span className="text-brand-line/50">장소:</span> <span className="text-brand-text">케미스트리 강남</span></p>
              <div className="pt-3 border-t border-white/5 mt-3">
                <p className="text-brand-line/50 mb-1">참가비:</p>
                <ul className="ml-3 space-y-1 text-brand-text">
                  <li>• 1기~27기: 4만원</li>
                  <li>• 28기~29기: 2만원</li>
                </ul>
              </div>
              <div className="pt-3 border-t border-white/5">
                <p className="text-brand-line/50 mb-1">입금 계좌</p>
                <p className="font-mono text-brand-text">012501-04-276014 국민은행 / 예금주 : 인사이더스</p>
              </div>
            </div>

            {/* Sponsor Card - Premium Design */}
            <motion.div
              onClick={handleSponsorToggle}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2 overflow-hidden ${formData.isSponsor
                ? 'border-amber-400/60 bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-yellow-500/15'
                : 'border-amber-400/20 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5 hover:border-amber-400/40'
                }`}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-300/5 to-amber-400/0 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  {/* Icon & Toggle */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${formData.isSponsor
                      ? 'bg-amber-400/30 shadow-lg shadow-amber-500/20'
                      : 'bg-amber-400/10'
                      }`}>
                      <span className="text-2xl">{formData.isSponsor ? '✨' : '💛'}</span>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg text-amber-300">
                        INSIDERS의 다음 세대를 응원하고 싶습니다
                      </h4>
                      {/* Toggle indicator */}
                      <div className={`flex-shrink-0 w-10 h-6 rounded-full transition-all duration-300 flex items-center ${formData.isSponsor
                        ? 'bg-amber-400 justify-end'
                        : 'bg-white/10 justify-start'
                        }`}>
                        <motion.div
                          layout
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className={`w-5 h-5 rounded-full mx-0.5 transition-colors ${formData.isSponsor ? 'bg-white' : 'bg-white/50'
                            }`}
                        />
                      </div>
                    </div>

                    <p className="text-brand-line/90 text-sm leading-relaxed mb-3">
                      선배님의 후원은 다음 세대 INSIDERS의 운영에 사용됩니다.
                    </p>

                    {/* Reassurance badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-xs text-brand-line/70">
                        <Check size={12} className="text-amber-400" /> 금액 자유
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-xs text-brand-line/70">
                        <Check size={12} className="text-amber-400" /> 참여 여부 자유
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-xs text-brand-line/70">
                        <Check size={12} className="text-amber-400" /> 체크만 해주셔도 충분합니다
                      </span>
                    </div>

                    {/* Motivational line */}
                    <p className="text-xs text-amber-400/80 italic">
                      ✦ 선배님의 작은 응원이 INSIDERS 2026을 만듭니다
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected state glow effect */}
              {formData.isSponsor && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/5 via-transparent to-amber-400/5 pointer-events-none"
                />
              )}
            </motion.div>

            {/* Request Field (Optional) */}
            <div>
              <label className="block text-xs font-medium text-brand-line/70 uppercase tracking-wider mb-2">
                요청사항 <span className="text-brand-line/40">(선택)</span>
              </label>
              <textarea
                name="request"
                value={formData.request}
                onChange={handleChange}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 px-4 text-brand-text focus:border-accent-gold/50 focus:outline-none transition-colors placeholder:text-brand-line/30 resize-none"
                placeholder="29기 운영진에게 바라는 점을 자유롭게 말씀해 주세요 (ex. 함께하고 싶은 선배님, NN기 친구들 많이 불러주세요~ 등)"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedSchool}
              className={`w-full py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isSubmitting || !selectedSchool
                ? 'bg-white/5 text-brand-line/30 cursor-not-allowed'
                : 'bg-accent-gold text-brand-bg hover:bg-accent-goldLight'
                }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  참가 신청하기 <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </Section>
  );
};