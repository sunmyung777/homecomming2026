import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, RotateCcw, Check, LogOut, Eye, RefreshCw } from 'lucide-react';
import {
    BalanceGameMember,
    BalanceGameQuestion,
    BalanceGameVote,
    getGroupMembers,
    getBalanceQuestions,
    getBalanceVotes,
    submitBalanceVote,
    resetGroupVote,
    subscribeToBalanceGame,
} from '../../lib/supabase';

// Colors from Battle.tsx
const COLORS = {
    blue: {
        primary: '#4B73A8',
        dark: '#164075',
        bg: 'rgba(22, 64, 117, 0.2)',
    },
    red: {
        primary: '#A84B52',
        dark: '#781820',
        bg: 'rgba(120, 24, 32, 0.2)',
    },
};

export const Recreation: React.FC = () => {
    // Login state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userGroup, setUserGroup] = useState<number | null>(null);
    const [loginError, setLoginError] = useState('');

    // Game state
    const [members, setMembers] = useState<BalanceGameMember[]>([]);
    const [questions, setQuestions] = useState<BalanceGameQuestion[]>([]);
    const [votes, setVotes] = useState<BalanceGameVote[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLeader, setIsLeader] = useState(false);

    // Load data from Supabase
    const loadData = async () => {
        const [membersData, questionsData, votesData] = await Promise.all([
            getGroupMembers(),
            getBalanceQuestions(),
            getBalanceVotes(),
        ]);
        setMembers(membersData);
        setQuestions(questionsData);
        setVotes(votesData);
        setLoading(false);

        // Update leader status if logged in
        if (userGroup && userName) {
            const member = membersData.find(
                m => m.group_number === userGroup && m.member_name === userName
            );
            setIsLeader(member?.is_leader || false);
        }
    };

    useEffect(() => {
        loadData();

        // Subscribe to real-time changes
        const subscription = subscribeToBalanceGame(loadData);

        // Load saved session
        const savedSession = localStorage.getItem('balanceGameSession');
        if (savedSession) {
            const session = JSON.parse(savedSession);
            setIsLoggedIn(true);
            setUserName(session.userName);
            setUserGroup(session.groupNumber);
        }

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Update leader status when login state changes
    useEffect(() => {
        if (userGroup && userName && members.length > 0) {
            const member = members.find(
                m => m.group_number === userGroup && m.member_name === userName
            );
            setIsLeader(member?.is_leader || false);
        }
    }, [userGroup, userName, members]);

    // Get active question
    const getActiveQuestion = (): BalanceGameQuestion | null => {
        return questions.find(q => q.is_active) || null;
    };

    // Get current vote for user's group
    const getCurrentVote = (): 'A' | 'B' | null => {
        const activeQuestion = getActiveQuestion();
        if (!activeQuestion || !userGroup) return null;
        const vote = votes.find(
            v => v.question_id === activeQuestion.id && v.group_number === userGroup
        );
        return vote?.vote || null;
    };

    // Get vote for any group
    const getVoteForGroup = (groupNumber: number): 'A' | 'B' | null => {
        const activeQuestion = getActiveQuestion();
        if (!activeQuestion) return null;
        const vote = votes.find(
            v => v.question_id === activeQuestion.id && v.group_number === groupNumber
        );
        return vote?.vote || null;
    };

    // Get leader for group
    const getLeaderForGroup = (groupNumber: number): string | null => {
        const leader = members.find(m => m.group_number === groupNumber && m.is_leader);
        return leader ? leader.member_name : null;
    };

    // Find group by member name
    const findGroupByName = (name: string): number | null => {
        const member = members.find(m => m.member_name === name);
        return member ? member.group_number : null;
    };

    // Handle login
    const handleLogin = () => {
        if (!userName.trim()) {
            setLoginError('이름을 입력해주세요');
            return;
        }

        const foundGroup = findGroupByName(userName.trim());
        if (!foundGroup) {
            setLoginError('명단에서 찾을 수 없습니다. 이름을 확인해주세요.');
            return;
        }

        setUserGroup(foundGroup);
        setLoginError('');

        // Check if user is the designated leader
        const member = members.find(
            m => m.group_number === foundGroup && m.member_name === userName.trim()
        );
        setIsLeader(member?.is_leader || false);

        localStorage.setItem('balanceGameSession', JSON.stringify({
            userName: userName.trim(),
            groupNumber: foundGroup,
        }));

        setIsLoggedIn(true);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('balanceGameSession');
        setIsLoggedIn(false);
        setUserName('');
        setUserGroup(null);
        setIsLeader(false);
    };

    // Handle vote (only for leaders)
    const handleVote = async (vote: 'A' | 'B') => {
        const activeQuestion = getActiveQuestion();
        if (!activeQuestion?.id || !userGroup || !isLeader) return;

        // Optimistic update: 즉시 UI 업데이트
        setVotes(prev => [
            ...prev.filter(v => !(v.question_id === activeQuestion.id && v.group_number === userGroup)),
            { question_id: activeQuestion.id, group_number: userGroup, vote, voter_name: userName }
        ]);

        await submitBalanceVote(activeQuestion.id, userGroup, vote, userName);
        // Realtime 구독이 자동으로 동기화
    };

    // Handle reset vote
    const handleResetVote = async () => {
        const activeQuestion = getActiveQuestion();
        if (!activeQuestion?.id || !userGroup || !isLeader) return;

        // Optimistic update: 즉시 UI에서 투표 제거
        setVotes(prev => prev.filter(v => !(v.question_id === activeQuestion.id && v.group_number === userGroup)));

        await resetGroupVote(activeQuestion.id, userGroup);
        // Realtime 구독이 자동으로 동기화
    };

    const activeQuestion = getActiveQuestion();
    const currentVote = getCurrentVote();
    const hasVoted = currentVote !== null;

    // Loading screen
    if (loading) {
        return (
            <div className="min-h-screen bg-brand-bg pt-20 px-4 pb-8 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full" />
            </div>
        );
    }

    // Login Screen
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-brand-bg pt-20 px-4 pb-8">
                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-brand-bg/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-gold/20 flex items-center justify-center">
                                <Users className="w-8 h-8 text-accent-gold" />
                            </div>
                            <h2 className="text-2xl font-bold text-brand-text mb-2">밸런스 게임</h2>
                            <p className="text-brand-line/60 text-sm">이름을 입력하면 조를 자동으로 찾아드려요</p>
                        </div>

                        {/* Name Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-brand-line/80 mb-2">
                                이름
                            </label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => {
                                    setUserName(e.target.value);
                                    setLoginError('');
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                placeholder="이름을 입력하세요"
                                className="w-full px-4 py-3 bg-brand-bg border border-white/10 rounded-xl text-brand-text placeholder-brand-line/30 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 transition-all"
                            />
                            {loginError && (
                                <p className="mt-2 text-sm text-red-400">{loginError}</p>
                            )}
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            disabled={!userName.trim()}
                            className="w-full py-4 bg-accent-gold text-brand-bg font-bold rounded-xl transition-all hover:bg-accent-gold/90 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            입장하기
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Balance Game Screen
    return (
        <div className="min-h-screen bg-brand-bg pt-20 px-4 pb-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-brand-text">{userGroup}조 - {userName}</h2>
                        <p className="text-sm text-brand-line/60">
                            {isLeader ? (
                                <span className="text-accent-gold">✨ 조장 (투표 가능)</span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> 관전 모드
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={loadData}
                            className="p-2 text-brand-line/60 hover:text-brand-text transition-colors"
                            title="새로고침"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-brand-line/60 hover:text-brand-text transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            나가기
                        </button>
                    </div>
                </div>

                {/* No Active Question */}
                {!activeQuestion && (
                    <div className="bg-brand-bg/50 border border-white/10 rounded-2xl p-8 text-center">
                        <p className="text-brand-line/50">진행 중인 질문이 없습니다</p>
                        <p className="text-sm text-brand-line/30 mt-2">관리자가 질문을 시작할 때까지 기다려주세요</p>
                    </div>
                )}

                {/* Active Question */}
                {activeQuestion && (
                    <>
                        {/* Current Question Display */}
                        <div className="mb-6 text-center">
                            <p className="text-xs text-brand-line/50 uppercase tracking-widest mb-2">현재 질문</p>
                            <h3 className="text-lg font-bold text-brand-text">
                                {activeQuestion.option_a} vs {activeQuestion.option_b}
                            </h3>
                        </div>

                        {/* Balance Game Buttons */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {/* Option A - Blue */}
                                <motion.button
                                    whileHover={{ scale: (hasVoted || !isLeader) ? 1 : 1.02 }}
                                    whileTap={{ scale: (hasVoted || !isLeader) ? 1 : 0.98 }}
                                    onClick={() => isLeader && !hasVoted && handleVote('A')}
                                    disabled={hasVoted || !isLeader}
                                    className={`relative aspect-[4/3] rounded-2xl border-2 transition-all duration-300 overflow-hidden ${currentVote === 'A'
                                        ? 'border-[#4B73A8] shadow-lg shadow-[#4B73A8]/30'
                                        : 'border-white/10 hover:border-[#4B73A8]/50'
                                        } ${!isLeader ? 'cursor-default' : ''}`}
                                    style={{
                                        background: currentVote === 'A' ? COLORS.blue.bg : 'transparent',
                                    }}
                                >
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                        <span
                                            className="text-xl md:text-2xl font-bold text-center"
                                            style={{ color: COLORS.blue.primary }}
                                        >
                                            {activeQuestion.option_a}
                                        </span>
                                        {currentVote === 'A' && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#4B73A8] flex items-center justify-center"
                                            >
                                                <Check className="w-5 h-5 text-white" />
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.button>

                                {/* Option B - Red */}
                                <motion.button
                                    whileHover={{ scale: (hasVoted || !isLeader) ? 1 : 1.02 }}
                                    whileTap={{ scale: (hasVoted || !isLeader) ? 1 : 0.98 }}
                                    onClick={() => isLeader && !hasVoted && handleVote('B')}
                                    disabled={hasVoted || !isLeader}
                                    className={`relative aspect-[4/3] rounded-2xl border-2 transition-all duration-300 overflow-hidden ${currentVote === 'B'
                                        ? 'border-[#A84B52] shadow-lg shadow-[#A84B52]/30'
                                        : 'border-white/10 hover:border-[#A84B52]/50'
                                        } ${!isLeader ? 'cursor-default' : ''}`}
                                    style={{
                                        background: currentVote === 'B' ? COLORS.red.bg : 'transparent',
                                    }}
                                >
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                        <span
                                            className="text-xl md:text-2xl font-bold text-center"
                                            style={{ color: COLORS.red.primary }}
                                        >
                                            {activeQuestion.option_b}
                                        </span>
                                        {currentVote === 'B' && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#A84B52] flex items-center justify-center"
                                            >
                                                <Check className="w-5 h-5 text-white" />
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.button>
                            </div>

                            {/* Reset Button - only for leaders */}
                            <AnimatePresence>
                                {hasVoted && isLeader && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-4 text-center"
                                    >
                                        <button
                                            onClick={handleResetVote}
                                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-brand-line/60 hover:text-brand-text border border-white/10 hover:border-white/20 rounded-xl transition-all"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            다시 선택
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Information for non-leaders */}
                            {!isLeader && (
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-brand-line/50">
                                        조장만 투표할 수 있습니다. 조장은 Admin에서 지정됩니다.
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        {/* Group Status Display */}
                        <div className="bg-brand-bg/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-brand-text mb-4">조별 현황</h3>

                            <div className="grid grid-cols-4 gap-3">
                                {Array.from({ length: 16 }, (_, i) => i + 1).map((groupNum) => {
                                    const vote = getVoteForGroup(groupNum);
                                    const leader = getLeaderForGroup(groupNum);
                                    const hasLeader = !!leader;
                                    const hasGroupVoted = vote !== null;
                                    const isActive = hasLeader && hasGroupVoted;

                                    return (
                                        <motion.div
                                            key={groupNum}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: groupNum * 0.03 }}
                                            className={`relative p-3 rounded-xl border transition-all ${isActive
                                                ? 'border-white/20 bg-white/5'
                                                : 'border-white/5 opacity-50'
                                                }`}
                                        >
                                            <div className="text-center">
                                                <span className="text-sm font-bold text-brand-text">
                                                    {groupNum}조
                                                </span>
                                                {leader && (
                                                    <p className="text-xs text-brand-line/50 truncate mt-1">
                                                        {leader}
                                                    </p>
                                                )}
                                                {vote && (
                                                    <div
                                                        className="mt-2 w-6 h-6 mx-auto rounded-full flex items-center justify-center text-xs font-bold text-white"
                                                        style={{
                                                            backgroundColor:
                                                                vote === 'A'
                                                                    ? COLORS.blue.primary
                                                                    : COLORS.red.primary,
                                                        }}
                                                    >
                                                        {vote}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-brand-line/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.blue.primary }} />
                                    <span>{activeQuestion.option_a}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.red.primary }} />
                                    <span>{activeQuestion.option_b}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-white/20" />
                                    <span>미투표</span>
                                </div>
                            </div>

                            {/* Vote Summary */}
                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-center gap-8 text-sm">
                                <span className="text-[#4B73A8]">
                                    A: {votes.filter(v => v.question_id === activeQuestion.id && v.vote === 'A').length}개 조
                                </span>
                                <span className="text-[#A84B52]">
                                    B: {votes.filter(v => v.question_id === activeQuestion.id && v.vote === 'B').length}개 조
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
