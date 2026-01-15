import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Plus, Trash2, Play, Check, Edit2, Users, Crown, RotateCcw, UserPlus, Database, Search, CheckCircle, XCircle, DollarSign, ClipboardCheck } from 'lucide-react';
import {
    BalanceGameMember,
    BalanceGameQuestion,
    BalanceGameVote,
    Registration,
    getGroupMembers,
    addMember,
    removeMember,
    setGroupLeader,
    getBalanceQuestions,
    addBalanceQuestion,
    updateBalanceQuestion,
    deleteBalanceQuestion,
    setActiveQuestion,
    getBalanceVotes,
    subscribeToBalanceGame,
    seedBalanceGameData,
    getAllRegistrations,
    toggleCheckIn,
    togglePaid,
    subscribeToRegistrations,
} from '../lib/supabase';

// 간단한 비밀번호 보호 (1차 방어용)
const ADMIN_PASSWORD = '2026';

export const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const [members, setMembers] = useState<BalanceGameMember[]>([]);
    const [questions, setQuestions] = useState<BalanceGameQuestion[]>([]);
    const [votes, setVotes] = useState<BalanceGameVote[]>([]);
    const [loading, setLoading] = useState(true);
    const [newOptionA, setNewOptionA] = useState('');
    const [newOptionB, setNewOptionB] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editOptionA, setEditOptionA] = useState('');
    const [editOptionB, setEditOptionB] = useState('');
    const [activeTab, setActiveTab] = useState<'questions' | 'leaders' | 'members' | 'participants'>('questions');
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberGroup, setNewMemberGroup] = useState<number>(1);

    // 참가자 관리 관련 상태
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'checked' | 'unchecked'>('all');

    // 비밀번호 확인 핸들러
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setPasswordError(false);
        } else {
            setPasswordError(true);
            setPasswordInput('');
        }
    };

    // Load data from Supabase
    const loadData = async () => {
        setLoading(true);
        const [membersData, questionsData, votesData, registrationsData] = await Promise.all([
            getGroupMembers(),
            getBalanceQuestions(),
            getBalanceVotes(),
            getAllRegistrations(),
        ]);
        setMembers(membersData);
        setQuestions(questionsData);
        setVotes(votesData);
        setRegistrations(registrationsData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();

        // Subscribe to real-time changes
        const balanceSubscription = subscribeToBalanceGame(loadData);
        const registrationsSubscription = subscribeToRegistrations(loadData);

        return () => {
            balanceSubscription.unsubscribe();
            registrationsSubscription.unsubscribe();
        };
    }, []);

    // Get grouped members by group number
    const getGroupedMembers = () => {
        const grouped: { [key: number]: BalanceGameMember[] } = {};
        for (let i = 1; i <= 16; i++) {
            grouped[i] = [];
        }
        members.forEach(member => {
            if (grouped[member.group_number]) {
                grouped[member.group_number].push(member);
            }
        });
        return grouped;
    };

    // Get leader for a group
    const getLeaderForGroup = (groupNumber: number): string | null => {
        const leader = members.find(m => m.group_number === groupNumber && m.is_leader);
        return leader ? leader.member_name : null;
    };

    // Get active question
    const getActiveQuestion = (): BalanceGameQuestion | null => {
        return questions.find(q => q.is_active) || null;
    };

    // Get vote for a group
    const getVoteForGroup = (groupNumber: number): 'A' | 'B' | null => {
        const activeQuestion = getActiveQuestion();
        if (!activeQuestion) return null;
        const vote = votes.find(v => v.question_id === activeQuestion.id && v.group_number === groupNumber);
        return vote?.vote || null;
    };

    // Add new question
    const handleAddQuestion = async () => {
        if (!newOptionA.trim() || !newOptionB.trim()) return;
        await addBalanceQuestion(newOptionA.trim(), newOptionB.trim());
        setNewOptionA('');
        setNewOptionB('');
        loadData();
    };

    // Delete question
    const handleDeleteQuestion = async (id: string) => {
        await deleteBalanceQuestion(id);
        loadData();
    };

    // Set as current question
    const handleSetCurrent = async (question: BalanceGameQuestion) => {
        if (!question.id) return;
        await setActiveQuestion(question.id);
        loadData();
    };

    // Start editing
    const handleStartEdit = (question: BalanceGameQuestion) => {
        setEditingId(question.id || null);
        setEditOptionA(question.option_a);
        setEditOptionB(question.option_b);
    };

    // Save edit
    const handleSaveEdit = async (id: string) => {
        if (!editOptionA.trim() || !editOptionB.trim()) return;
        await updateBalanceQuestion(id, editOptionA.trim(), editOptionB.trim());
        setEditingId(null);
        loadData();
    };

    // Set group leader
    const handleSetLeader = async (groupNumber: number, memberName: string) => {
        const currentLeader = getLeaderForGroup(groupNumber);
        if (currentLeader === memberName) {
            await setGroupLeader(groupNumber, '');
        } else {
            await setGroupLeader(groupNumber, memberName);
        }
        loadData();
    };

    // Add new member
    const handleAddMember = async () => {
        if (!newMemberName.trim()) return;
        await addMember(newMemberGroup, newMemberName.trim());
        setNewMemberName('');
        loadData();
    };

    // Remove member
    const handleRemoveMember = async (id: string) => {
        if (!id) return;
        if (window.confirm('이 조원을 삭제하시겠습니까?')) {
            await removeMember(id);
            loadData();
        }
    };

    // Seed initial data
    const handleSeedData = async () => {
        if (window.confirm('초기 데이터를 Supabase에 등록하시겠습니까?')) {
            setLoading(true);
            await seedBalanceGameData();
            await loadData();
        }
    };

    const groupedMembers = getGroupedMembers();
    const activeQuestion = getActiveQuestion();

    // 비밀번호 입력 화면
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
                <div className="w-full max-w-sm">
                    <div className="bg-brand-bg/50 border border-white/10 rounded-2xl p-8">
                        <h1 className="text-xl font-bold text-brand-text text-center mb-2">관리자 페이지</h1>
                        <p className="text-sm text-brand-line/60 text-center mb-6">비밀번호를 입력하세요</p>

                        <form onSubmit={handlePasswordSubmit}>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="비밀번호"
                                className={`w-full px-4 py-3 bg-brand-bg border rounded-xl text-brand-text text-center placeholder-brand-line/30 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 mb-4 ${passwordError ? 'border-red-400' : 'border-white/10'
                                    }`}
                                autoFocus
                            />
                            {passwordError && (
                                <p className="text-red-400 text-sm text-center mb-4">비밀번호가 틀렸습니다</p>
                            )}
                            <button
                                type="submit"
                                className="w-full py-3 bg-accent-gold text-brand-bg font-bold rounded-xl transition-all hover:bg-accent-gold/90"
                            >
                                입장
                            </button>
                        </form>

                        <Link
                            to="/playground"
                            className="block mt-4 text-center text-sm text-brand-line/60 hover:text-brand-text transition-colors"
                        >
                            ← Playground로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg pt-6 px-4 pb-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-text">레크리에이션 관리</h1>
                        <p className="text-sm text-brand-line/60 mt-1">밸런스 게임 관리 (Supabase)</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSeedData}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-accent-gold hover:text-accent-gold/80 transition-colors border border-accent-gold/30 rounded-lg"
                            title="초기 데이터 등록"
                        >
                            <Database className="w-4 h-4" />
                            Seed
                        </button>
                        <Link
                            to="/playground"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-brand-line/60 hover:text-brand-text transition-colors border border-white/10 rounded-lg"
                        >
                            <Home className="w-4 h-4" />
                            Playground
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${activeTab === 'questions'
                            ? 'bg-accent-gold text-brand-bg'
                            : 'bg-white/5 text-brand-line/60 hover:text-brand-text'
                            }`}
                    >
                        질문 관리
                    </button>
                    <button
                        onClick={() => setActiveTab('leaders')}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'leaders'
                            ? 'bg-accent-gold text-brand-bg'
                            : 'bg-white/5 text-brand-line/60 hover:text-brand-text'
                            }`}
                    >
                        <Crown className="w-4 h-4" />
                        조장 지정
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'members'
                            ? 'bg-accent-gold text-brand-bg'
                            : 'bg-white/5 text-brand-line/60 hover:text-brand-text'
                            }`}
                    >
                        <UserPlus className="w-4 h-4" />
                        조원 관리
                    </button>
                    <button
                        onClick={() => setActiveTab('participants')}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'participants'
                            ? 'bg-accent-gold text-brand-bg'
                            : 'bg-white/5 text-brand-line/60 hover:text-brand-text'
                            }`}
                    >
                        <ClipboardCheck className="w-4 h-4" />
                        참가자
                    </button>
                </div>

                {/* Questions Tab */}
                {activeTab === 'questions' && (
                    <>
                        {/* Current Question Display */}
                        <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-2xl p-6 mb-8">
                            <h2 className="text-sm font-medium text-accent-gold mb-3">현재 진행 중인 질문</h2>
                            {activeQuestion ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 p-4 rounded-xl bg-[#164075]/30 border border-[#4B73A8]/30">
                                        <span className="text-[#4B73A8] font-bold">A. {activeQuestion.option_a}</span>
                                    </div>
                                    <span className="text-brand-line/40 font-bold">VS</span>
                                    <div className="flex-1 p-4 rounded-xl bg-[#781820]/30 border border-[#A84B52]/30">
                                        <span className="text-[#A84B52] font-bold">B. {activeQuestion.option_b}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-brand-line/50 text-center py-4">질문을 선택해주세요</p>
                            )}
                        </div>

                        {/* Vote Status */}
                        {activeQuestion && (
                            <div className="bg-brand-bg/50 border border-white/10 rounded-2xl p-6 mb-6">
                                <h2 className="text-lg font-bold text-brand-text mb-4">조별 투표 현황</h2>
                                <div className="grid grid-cols-4 gap-2">
                                    {Array.from({ length: 16 }, (_, i) => i + 1).map(groupNum => {
                                        const vote = getVoteForGroup(groupNum);
                                        const leader = getLeaderForGroup(groupNum);
                                        return (
                                            <div
                                                key={groupNum}
                                                className={`p-2 rounded-lg text-center ${vote ? 'bg-white/10' : 'bg-white/5 opacity-50'
                                                    }`}
                                            >
                                                <div className="text-xs text-brand-line/50">{groupNum}조</div>
                                                {vote ? (
                                                    <div
                                                        className={`text-sm font-bold ${vote === 'A' ? 'text-[#4B73A8]' : 'text-[#A84B52]'
                                                            }`}
                                                    >
                                                        {vote}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-brand-line/30">-</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 flex justify-center gap-8 text-xs text-brand-line/50">
                                    <span>A 선택: {votes.filter(v => v.question_id === activeQuestion.id && v.vote === 'A').length}개 조</span>
                                    <span>B 선택: {votes.filter(v => v.question_id === activeQuestion.id && v.vote === 'B').length}개 조</span>
                                </div>
                            </div>
                        )}

                        {/* Add New Question */}
                        <div className="bg-brand-bg/50 border border-white/10 rounded-2xl p-6 mb-6">
                            <h2 className="text-lg font-bold text-brand-text mb-4">새 질문 추가</h2>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    value={newOptionA}
                                    onChange={(e) => setNewOptionA(e.target.value)}
                                    placeholder="옵션 A"
                                    className="px-4 py-3 bg-brand-bg border border-white/10 rounded-xl text-brand-text placeholder-brand-line/30 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                                />
                                <input
                                    type="text"
                                    value={newOptionB}
                                    onChange={(e) => setNewOptionB(e.target.value)}
                                    placeholder="옵션 B"
                                    className="px-4 py-3 bg-brand-bg border border-white/10 rounded-xl text-brand-text placeholder-brand-line/30 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                                />
                            </div>
                            <button
                                onClick={handleAddQuestion}
                                disabled={!newOptionA.trim() || !newOptionB.trim()}
                                className="w-full py-3 bg-accent-gold text-brand-bg font-bold rounded-xl transition-all hover:bg-accent-gold/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                질문 추가
                            </button>
                        </div>

                        {/* Question List */}
                        <div className="bg-brand-bg/50 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-brand-text mb-4">질문 목록 ({questions.length}개)</h2>
                            <div className="space-y-3">
                                {questions.map((question) => (
                                    <motion.div
                                        key={question.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-xl border transition-all ${question.is_active
                                            ? 'border-accent-gold/50 bg-accent-gold/5'
                                            : 'border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        {editingId === question.id ? (
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={editOptionA}
                                                        onChange={(e) => setEditOptionA(e.target.value)}
                                                        className="px-3 py-2 bg-brand-bg border border-white/10 rounded-lg text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editOptionB}
                                                        onChange={(e) => setEditOptionB(e.target.value)}
                                                        className="px-3 py-2 bg-brand-bg border border-white/10 rounded-lg text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveEdit(question.id!)}
                                                        className="flex-1 py-2 text-sm font-medium text-accent-gold border border-accent-gold/30 rounded-lg hover:bg-accent-gold/10 transition-colors"
                                                    >
                                                        저장
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="flex-1 py-2 text-sm font-medium text-brand-line/60 border border-white/10 rounded-lg hover:text-brand-text transition-colors"
                                                    >
                                                        취소
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <span className="text-[#4B73A8] font-medium">{question.option_a}</span>
                                                    <span className="text-brand-line/40 mx-2">vs</span>
                                                    <span className="text-[#A84B52] font-medium">{question.option_b}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {question.is_active ? (
                                                        <span className="px-3 py-1.5 text-xs font-medium text-accent-gold bg-accent-gold/10 rounded-lg flex items-center gap-1">
                                                            <Check className="w-3 h-3" />
                                                            진행중
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleSetCurrent(question)}
                                                            className="p-2 text-brand-line/60 hover:text-accent-gold transition-colors"
                                                            title="이 질문으로 시작"
                                                        >
                                                            <Play className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleStartEdit(question)}
                                                        className="p-2 text-brand-line/60 hover:text-brand-text transition-colors"
                                                        title="수정"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteQuestion(question.id!)}
                                                        className="p-2 text-brand-line/60 hover:text-red-400 transition-colors"
                                                        title="삭제"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {questions.length === 0 && (
                                <p className="text-center text-brand-line/50 py-8">
                                    등록된 질문이 없습니다. Seed 버튼을 눌러 초기 데이터를 추가하세요.
                                </p>
                            )}
                        </div>
                    </>
                )}

                {/* Leaders Tab */}
                {activeTab === 'leaders' && (
                    <div className="bg-brand-bg/50 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-5 h-5 text-accent-gold" />
                            <h2 className="text-lg font-bold text-brand-text">조별 조장 지정</h2>
                        </div>
                        <p className="text-sm text-brand-line/60 mb-6">
                            각 조에서 투표할 수 있는 조장을 선택하세요. 조장만 밸런스 게임에서 투표할 수 있습니다.
                        </p>

                        <div className="space-y-4">
                            {Object.entries(groupedMembers).map(([groupNum, groupMembers]) => (
                                <div
                                    key={groupNum}
                                    className="p-4 rounded-xl border border-white/10"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-bold text-brand-text">{groupNum}조</span>
                                        {getLeaderForGroup(parseInt(groupNum)) && (
                                            <span className="text-xs text-accent-gold flex items-center gap-1">
                                                <Crown className="w-3 h-3" />
                                                {getLeaderForGroup(parseInt(groupNum))}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {groupMembers.length > 0 ? (
                                            groupMembers.map((member) => (
                                                <button
                                                    key={member.id}
                                                    onClick={() => handleSetLeader(member.group_number, member.member_name)}
                                                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${member.is_leader
                                                        ? 'bg-accent-gold text-brand-bg font-medium'
                                                        : 'bg-white/5 text-brand-line/70 hover:bg-white/10 hover:text-brand-text'
                                                        }`}
                                                >
                                                    {member.member_name}
                                                </button>
                                            ))
                                        ) : (
                                            <span className="text-xs text-brand-line/40">조원이 없습니다</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="mt-6 p-4 rounded-xl bg-accent-gold/10 border border-accent-gold/30">
                            <p className="text-sm text-accent-gold font-medium mb-2">
                                지정된 조장: {members.filter(m => m.is_leader).length}개 조
                            </p>
                            <p className="text-xs text-brand-line/60">
                                {members.filter(m => m.is_leader).map(m => `${m.group_number}조: ${m.member_name}`).join(', ') || '아직 지정된 조장이 없습니다'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Members Tab */}
                {activeTab === 'members' && (
                    <div className="space-y-6">
                        {/* Add Member */}
                        <div className="bg-brand-bg/50 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-brand-text mb-4">새 조원 추가</h2>
                            <div className="flex gap-3">
                                <select
                                    value={newMemberGroup}
                                    onChange={(e) => setNewMemberGroup(parseInt(e.target.value))}
                                    className="px-4 py-3 bg-brand-bg border border-white/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                                >
                                    {Array.from({ length: 16 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}조</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                    placeholder="이름"
                                    className="flex-1 px-4 py-3 bg-brand-bg border border-white/10 rounded-xl text-brand-text placeholder-brand-line/30 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                                />
                                <button
                                    onClick={handleAddMember}
                                    disabled={!newMemberName.trim()}
                                    className="px-6 py-3 bg-accent-gold text-brand-bg font-bold rounded-xl transition-all hover:bg-accent-gold/90 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <UserPlus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Member List by Group */}
                        <div className="bg-brand-bg/50 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-brand-text mb-4">조원 목록 (총 {members.length}명)</h2>
                            <div className="space-y-4">
                                {Object.entries(groupedMembers).map(([groupNum, groupMembers]) => (
                                    <div
                                        key={groupNum}
                                        className="p-4 rounded-xl border border-white/10"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-brand-text">{groupNum}조 ({groupMembers.length}명)</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {groupMembers.length > 0 ? (
                                                groupMembers.map((member) => (
                                                    <div
                                                        key={member.id}
                                                        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg ${member.is_leader
                                                            ? 'bg-accent-gold/20 text-accent-gold'
                                                            : 'bg-white/5 text-brand-line/70'
                                                            }`}
                                                    >
                                                        {member.is_leader && <Crown className="w-3 h-3" />}
                                                        <span>{member.member_name}</span>
                                                        <button
                                                            onClick={() => handleRemoveMember(member.id!)}
                                                            className="ml-1 text-red-400/50 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-xs text-brand-line/40">조원이 없습니다</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Participants Tab */}
                {activeTab === 'participants' && (
                    <div className="space-y-6">
                        {/* Search & Filter */}
                        <div className="bg-brand-bg/50 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-brand-text mb-4">참가자 검색</h2>
                            <div className="flex gap-3 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-line/40" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="이름 또는 연락처로 검색..."
                                        className="w-full pl-12 pr-4 py-3 bg-brand-bg border border-white/10 rounded-xl text-brand-text placeholder-brand-line/30 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === 'all'
                                        ? 'bg-accent-gold text-brand-bg'
                                        : 'bg-white/5 text-brand-line/60 hover:text-brand-text'
                                        }`}
                                >
                                    전체
                                </button>
                                <button
                                    onClick={() => setFilterStatus('unchecked')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filterStatus === 'unchecked'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white/5 text-brand-line/60 hover:text-brand-text'
                                        }`}
                                >
                                    <XCircle className="w-4 h-4" />
                                    체크인 안함
                                </button>
                                <button
                                    onClick={() => setFilterStatus('checked')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filterStatus === 'checked'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-white/5 text-brand-line/60 hover:text-brand-text'
                                        }`}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    체크인 완료
                                </button>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-brand-bg/50 border border-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-brand-text">{registrations.length}</div>
                                <div className="text-xs text-brand-line/60">전체 참가자</div>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-green-400">{registrations.filter(r => r.is_checked_in).length}</div>
                                <div className="text-xs text-green-400/60">체크인 완료</div>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-red-400">{registrations.filter(r => !r.is_checked_in).length}</div>
                                <div className="text-xs text-red-400/60">체크인 안함</div>
                            </div>
                        </div>

                        {/* Participants List */}
                        <div className="bg-brand-bg/50 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-brand-text mb-4">
                                참가자 목록 ({
                                    registrations
                                        .filter(r => {
                                            const matchesSearch = searchQuery === '' ||
                                                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                r.phone.includes(searchQuery);
                                            const matchesFilter = filterStatus === 'all' ||
                                                (filterStatus === 'checked' && r.is_checked_in) ||
                                                (filterStatus === 'unchecked' && !r.is_checked_in);
                                            return matchesSearch && matchesFilter;
                                        }).length
                                }명)
                            </h2>
                            <div className="space-y-3">
                                {registrations
                                    .filter(r => {
                                        const matchesSearch = searchQuery === '' ||
                                            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            r.phone.includes(searchQuery);
                                        const matchesFilter = filterStatus === 'all' ||
                                            (filterStatus === 'checked' && r.is_checked_in) ||
                                            (filterStatus === 'unchecked' && !r.is_checked_in);
                                        return matchesSearch && matchesFilter;
                                    })
                                    .map((registration) => (
                                        <motion.div
                                            key={registration.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-xl border transition-all ${registration.is_checked_in
                                                ? 'border-green-500/30 bg-green-500/5'
                                                : 'border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-bold text-brand-text">{registration.name}</span>
                                                        <span className={`px-2 py-0.5 text-xs rounded-full ${registration.school === 'YONSEI'
                                                            ? 'bg-[#164075]/30 text-[#4B73A8]'
                                                            : 'bg-[#781820]/30 text-[#A84B52]'
                                                            }`}
                                                        >
                                                            {registration.school === 'YONSEI' ? '연세' : '고려'}
                                                        </span>
                                                        <span className="text-xs text-brand-line/50">{registration.batch}</span>
                                                        {registration.is_sponsor && (
                                                            <span className="px-2 py-0.5 text-xs rounded-full bg-accent-gold/20 text-accent-gold">
                                                                후원자
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-brand-line/60">{registration.phone}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {/* 입금 상태 */}
                                                    <button
                                                        onClick={async () => {
                                                            await togglePaid(registration.id!, !registration.is_paid);
                                                            loadData();
                                                        }}
                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${registration.is_paid
                                                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                                            : 'bg-white/5 text-brand-line/40 hover:text-brand-text hover:bg-white/10'
                                                            }`}
                                                        title={registration.is_paid ? '입금 완료' : '입금 미확인'}
                                                    >
                                                        <DollarSign className="w-3 h-3" />
                                                        {registration.is_paid ? '입금완료' : '미입금'}
                                                    </button>
                                                    {/* 체크인 상태 */}
                                                    <button
                                                        onClick={async () => {
                                                            await toggleCheckIn(registration.id!, !registration.is_checked_in);
                                                            loadData();
                                                        }}
                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${registration.is_checked_in
                                                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                            : 'bg-white/5 text-brand-line/40 hover:text-brand-text hover:bg-white/10'
                                                            }`}
                                                        title={registration.is_checked_in ? '체크인 완료' : '체크인 대기'}
                                                    >
                                                        {registration.is_checked_in ? (
                                                            <>
                                                                <CheckCircle className="w-3 h-3" />
                                                                체크인 완료
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-3 h-3" />
                                                                체크인
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                {registrations.filter(r => {
                                    const matchesSearch = searchQuery === '' ||
                                        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        r.phone.includes(searchQuery);
                                    const matchesFilter = filterStatus === 'all' ||
                                        (filterStatus === 'checked' && r.is_checked_in) ||
                                        (filterStatus === 'unchecked' && !r.is_checked_in);
                                    return matchesSearch && matchesFilter;
                                }).length === 0 && (
                                        <p className="text-center text-brand-line/50 py-8">
                                            {searchQuery ? '검색 결과가 없습니다.' : '참가자가 없습니다.'}
                                        </p>
                                    )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
