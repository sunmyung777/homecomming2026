import React, { useState, useEffect } from 'react';
import { Section } from './ui/Section';
import { School, Participant } from '../types';
import { Check, Loader2, ArrowRight, Sparkles, Send } from 'lucide-react';
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
    isSponsor: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      // Auto-format phone number with dashes
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSchool) {
      alert('학교를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitRegistration({
        name: formData.name || '',
        phone: formData.phone || '',
        batch: formData.batch || '',
        school: selectedSchool === School.YONSEI ? 'YONSEI' : 'KOREA',
        is_sponsor: formData.isSponsor || false
      });

      if (result.success) {
        setIsSuccess(true);
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

  // Success popup modal component
  const SuccessModal = () => (
    <AnimatePresence>
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-bg/80 backdrop-blur-md"
            onClick={() => setIsSuccess(false)}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 text-center bg-gradient-to-br from-white/10 to-white/5 p-10 md:p-12 rounded-3xl border border-accent-gold/30 backdrop-blur-xl max-w-md w-full shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={() => setIsSuccess(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <span className="text-white/60 text-lg">×</span>
            </button>

            {/* Success icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-accent-gold/20 to-accent-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-gold to-accent-goldLight rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="font-sans font-bold text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-accent-goldLight mb-4">
              신청 완료!
            </h3>
            <p className="text-brand-line mb-6 leading-relaxed text-sm md:text-base">
              참가 신청이 완료되었습니다.<br />
              행사 관련 안내는 입력해주신 연락처로 발송됩니다.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full py-3 bg-gradient-to-r from-accent-gold to-accent-goldLight text-brand-bg font-bold rounded-xl hover:shadow-lg hover:shadow-accent-gold/30 transition-all"
              >
                확인
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ name: '', phone: '', batch: '', message: '', isSponsor: false });
                }}
                className="text-sm text-accent-gold/70 hover:text-accent-gold transition-colors flex items-center gap-2 justify-center"
              >
                <Sparkles className="w-4 h-4" />
                추가 신청하기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <Section id="register" className="relative overflow-hidden mt-20">
      {/* Success Modal */}
      <SuccessModal />

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-bl from-accent-gold/8 to-transparent rounded-full blur-[80px]" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-tr from-accent-teal/8 to-transparent rounded-full blur-[60px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-brand-mid/5 to-transparent rounded-full blur-[100px]" />
        {/* Floating particles */}
        <div className="absolute top-32 right-1/4 w-2 h-2 rounded-full bg-accent-gold/40 animate-float-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-accent-teal/30 animate-float-fast" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-accent-rose/40 animate-float-delayed" />
      </div>

      <div className="max-w-2xl mx-auto w-full relative z-10">
        {/* Header with enhanced styling */}
        <div className="mb-12 text-left border-l-2 border-gradient-to-b from-accent-gold to-accent-teal pl-6 relative">
          <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-accent-gold" />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent-gold/80 text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
              <Send className="w-3 h-3" />
              Register Now
            </p>
            <h2 className="font-sans font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-brand-text via-accent-gold to-brand-text mb-2">참가신청</h2>
            <p className="text-brand-line text-sm tracking-wide">INSIDERS 2026</p>
          </motion.div>
        </div>

        {/* Form with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 mb-4"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Custom School Toggle */}
            <div className="p-1.5 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl w-fit ">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSchool(School.YONSEI)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${selectedSchool === School.YONSEI
                    ? 'bg-gradient-to-r from-[#164075] to-[#4B73A8] text-white shadow-lg shadow-[#164075]/30'
                    : 'text-brand-line hover:text-white hover:bg-white/5'
                    }`}
                >
                  YONSEI
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSchool(School.KOREA)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${selectedSchool === School.KOREA
                    ? 'bg-gradient-to-r from-[#781820] to-[#A84B52] text-white shadow-lg shadow-[#781820]/30'
                    : 'text-brand-line hover:text-white hover:bg-white/5'
                    }`}
                >
                  KOREA
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="group">
                <label className="block text-xs font-bold text-accent-gold/80 uppercase tracking-wider mb-3">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-brand-text text-lg focus:border-accent-gold/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all placeholder:text-brand-line/40"
                  placeholder="성함을 입력해주세요"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-accent-gold/80 uppercase tracking-wider mb-3">Contact</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-brand-text text-lg focus:border-accent-gold/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all placeholder:text-brand-line/40"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-accent-gold/80 uppercase tracking-wider mb-3">Batch</label>
                  <div className="relative">
                    <select
                      name="batch"
                      required
                      value={formData.batch}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-brand-text text-lg focus:border-accent-gold/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-brand-bg text-brand-line">기수를 선택하세요</option>
                      {Array.from({ length: 29 }, (_, i) => 29 - i).map(num => (
                        <option key={num} value={`${num}기`} className="bg-brand-bg text-brand-text">
                          {num}기
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-accent-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Information Notice */}
            <div className="bg-gradient-to-br from-accent-gold/10 to-accent-teal/5 rounded-2xl p-6 border border-accent-gold/20">
              <h4 className="text-accent-gold font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                공지사항
              </h4>
              <div className="space-y-3 text-brand-text/80 text-sm leading-relaxed">
                <p><span className="text-accent-gold font-medium">날짜:</span> 2026년 1월 16일 (금)</p>
                <p><span className="text-accent-gold font-medium">시간:</span> 오후 8시 ~</p>
                <p><span className="text-accent-gold font-medium">장소:</span> 케미스트리 강남<br />
                  <span className="text-brand-line/60 text-xs ml-10">서울특별시 강남구 언주로94길 5 2층</span>
                </p>
                <div className="pt-2 border-t border-accent-gold/10 mt-3">
                  <p className="mb-1"><span className="text-accent-gold font-medium">참가비:</span></p>
                  <ul className="ml-4 space-y-1 text-brand-line/70">
                    <li>• 학회 수료 기수 (1기~27기): <span className="text-brand-text">4만원</span></li>
                    <li>• 학회 액팅 기수 (28기~29기): <span className="text-brand-text">2만원</span></li>
                  </ul>
                </div>
                <div className="pt-3 mt-3 bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-accent-gold font-medium mb-1">입금 계좌</p>
                  <p className="font-mono text-brand-text">012501-04-276014 (국민은행)</p>
                  <p className="text-brand-line/60 text-xs mt-1">인사이더스 / 설문 완료 후 입금 부탁드립니다!</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-accent-gold/5 to-accent-teal/5 rounded-xl border border-accent-gold/10">
              <input
                type="checkbox"
                name="isSponsor"
                id="isSponsor"
                checked={formData.isSponsor}
                onChange={handleChange}
                className="w-5 h-5 rounded border-accent-gold/40 bg-transparent text-accent-gold focus:ring-offset-brand-bg focus:ring-accent-gold cursor-pointer"
              />
              <label htmlFor="isSponsor" className="cursor-pointer text-brand-text/80 text-sm select-none flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-gold/60" />
                창립제 후원 의사가 있습니다.(운영진이 개별적으로 연락드리겠습니다)
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedSchool}
              className={`group w-full py-5 rounded-2xl mt-8 text-lg font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-3
                ${isSubmitting || !selectedSchool
                  ? 'bg-white/5 text-brand-line/40 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-accent-gold to-accent-goldLight text-brand-bg hover:shadow-lg hover:shadow-accent-gold/20 hover:scale-[1.02]'
                }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  참가 신청하기 <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </Section>
  );
};