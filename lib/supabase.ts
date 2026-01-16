import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Using mock data.');
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Types for database
export interface Registration {
    id?: string;
    name: string;
    phone: string;
    batch: string;
    school: 'YONSEI' | 'KOREA';
    is_sponsor: boolean;
    request?: string;
    is_paid?: boolean;
    is_checked_in?: boolean;
    created_at?: string;
}

export interface SchoolStats {
    school: string;
    count: number;
}

// API functions

// Check for duplicate registration (same name AND phone)
export const checkDuplicateRegistration = async (name: string, phone: string): Promise<{ exists: boolean; error?: string }> => {
    if (!supabase) {
        // Mock: always return no duplicate
        return { exists: false };
    }

    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('id')
            .eq('name', name)
            .eq('phone', phone)
            .limit(1);

        if (error) {
            console.error('Duplicate check error:', error);
            return { exists: false, error: error.message };
        }

        return { exists: (data && data.length > 0) };
    } catch (err) {
        console.error('Duplicate check error:', err);
        return { exists: false, error: 'Failed to check duplicate' };
    }
};

export const submitRegistration = async (data: Omit<Registration, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string; isDuplicate?: boolean }> => {
    if (!supabase) {
        console.log('Mock submission:', data);
        return { success: true };
    }

    try {
        // Check for duplicate first
        const duplicateCheck = await checkDuplicateRegistration(data.name, data.phone);
        if (duplicateCheck.exists) {
            return { success: false, error: '이미 동일한 이름과 연락처로 신청된 내역이 있습니다.', isDuplicate: true };
        }

        const { error } = await supabase
            .from('registrations')
            .insert([{
                name: data.name,
                phone: data.phone,
                batch: data.batch,
                school: data.school,
                is_sponsor: data.is_sponsor,
                request: data.request || ''
            }]);

        if (error) {
            console.error('Supabase error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Submit error:', err);
        return { success: false, error: 'Failed to submit registration' };
    }
};

export const getSchoolStats = async (): Promise<{ yonsei: number; korea: number }> => {
    if (!supabase) {
        // Return mock data if Supabase is not configured
        return { yonsei: 70, korea: 138 };
    }

    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('school');

        if (error) {
            console.error('Stats fetch error:', error);
            return { yonsei: 0, korea: 0 };
        }

        const yonsei = data?.filter(r => r.school === 'YONSEI').length || 0;
        const korea = data?.filter(r => r.school === 'KOREA').length || 0;

        return { yonsei, korea };
    } catch (err) {
        console.error('Stats error:', err);
        return { yonsei: 0, korea: 0 };
    }
};

// Real-time subscription for stats updates
export const subscribeToStats = (callback: (stats: { yonsei: number; korea: number }) => void) => {
    if (!supabase) {
        // Return mock unsubscribe function
        return { unsubscribe: () => { } };
    }

    const channel = supabase
        .channel('registrations-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'registrations' },
            async () => {
                const stats = await getSchoolStats();
                callback(stats);
            }
        )
        .subscribe();

    return {
        unsubscribe: () => {
            supabase.removeChannel(channel);
        }
    };
};

// Get registrants list by school
export interface Registrant {
    batch: string;
    name: string;
}

export const getRegistrantsBySchool = async (school: 'YONSEI' | 'KOREA'): Promise<Registrant[]> => {
    if (!supabase) {
        // Return mock data
        return [
            { batch: '29기', name: '홍길동' },
            { batch: '28기', name: '김철수' },
            { batch: '27기', name: '이영희' },
            { batch: '29기', name: '홍길동' },
            { batch: '28기', name: '김철수' },
            { batch: '27기', name: '이영희' },
        ];
    }

    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('batch, name')
            .eq('school', school)
            .order('batch', { ascending: true });

        if (error) {
            console.error('Registrants fetch error:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Registrants error:', err);
        return [];
    }
};

// Message Wall Types
export interface Message {
    id: string;
    content: string;
    color: string;
    rotation: number;
    likes_count: number;
    created_at: string;
}

export interface MessageComment {
    id: string;
    message_id: string;
    content: string;
    created_at: string;
}

// Message Wall API Functions
const POST_IT_COLORS = ['#fef08a', '#fde68a', '#d9f99d', '#a5f3fc', '#c4b5fd', '#fecaca', '#fbcfe8'];

const MOCK_MESSAGES: Message[] = [
    { id: '1', content: '안녕하세요! 인사이더스 화이팅! 🎉', color: '#fef08a', rotation: -3, likes_count: 5, created_at: new Date().toISOString() },
    { id: '2', content: '창립제 너무 기대돼요~ 케미스트리 강남에서 만나요!', color: '#d9f99d', rotation: 2, likes_count: 3, created_at: new Date().toISOString() },
    { id: '3', content: '선배님들 반가워요! 29기 파이팅 💪', color: '#a5f3fc', rotation: -1, likes_count: 8, created_at: new Date().toISOString() },
    { id: '4', content: '10기 OB입니다. 오랜만에 후배들 얼굴 보니 감회가 새롭네요 ㅎㅎ', color: '#c4b5fd', rotation: 4, likes_count: 12, created_at: new Date().toISOString() },
    { id: '5', content: '연고전도 하고 창립제도 하고... 인사이더스 최고 🏆', color: '#fecaca', rotation: -2, likes_count: 7, created_at: new Date().toISOString() },
    { id: '6', content: '15기인데 동기들 많이 왔으면 좋겠다!!', color: '#fbcfe8', rotation: 1, likes_count: 4, created_at: new Date().toISOString() },
    { id: '7', content: '후배님들 응원합니다 🙌 항상 건강하고 행복하세요', color: '#fde68a', rotation: -4, likes_count: 15, created_at: new Date().toISOString() },
    { id: '8', content: '2026년 새해 복 많이 받으세요! 창립제에서 봐요~', color: '#d9f99d', rotation: 3, likes_count: 6, created_at: new Date().toISOString() },
    { id: '9', content: '28기 막내였는데 벌써 29기가 들어오다니... 시간 빠르다', color: '#a5f3fc', rotation: -1, likes_count: 2, created_at: new Date().toISOString() },
    { id: '10', content: '인사이더스에서의 추억이 제 대학생활 최고의 기억입니다 ❤️', color: '#fef08a', rotation: 2, likes_count: 20, created_at: new Date().toISOString() },
    { id: '11', content: '22기입니다! 동기들 연락좀 해줘~', color: '#c4b5fd', rotation: -3, likes_count: 9, created_at: new Date().toISOString() },
    { id: '12', content: '다들 건강하게 잘 지내고 있죠? 창립제에서 만나요!', color: '#fbcfe8', rotation: 1, likes_count: 11, created_at: new Date().toISOString() },
];

export const getMessages = async (): Promise<Message[]> => {
    if (!supabase) {
        return MOCK_MESSAGES;
    }

    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Messages fetch error (using mock data):', error);
            return MOCK_MESSAGES; // Return mock data on error
        }

        return data || MOCK_MESSAGES;
    } catch (err) {
        console.warn('Messages error (using mock data):', err);
        return MOCK_MESSAGES;
    }
};

export const createMessage = async (content: string): Promise<{ success: boolean; message?: Message; error?: string }> => {
    if (!supabase) {
        const newMessage: Message = {
            id: Date.now().toString(),
            content,
            color: POST_IT_COLORS[Math.floor(Math.random() * POST_IT_COLORS.length)],
            rotation: (Math.random() - 0.5) * 10,
            likes_count: 0,
            created_at: new Date().toISOString()
        };
        return { success: true, message: newMessage };
    }

    try {
        const newMessage = {
            content,
            color: POST_IT_COLORS[Math.floor(Math.random() * POST_IT_COLORS.length)],
            rotation: (Math.random() - 0.5) * 10
        };

        const { data, error } = await supabase
            .from('messages')
            .insert([newMessage])
            .select()
            .single();

        if (error) {
            console.error('Create message error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, message: data };
    } catch (err) {
        console.error('Create message error:', err);
        return { success: false, error: 'Failed to create message' };
    }
};

export const getComments = async (messageId: string): Promise<MessageComment[]> => {
    if (!supabase) {
        return [
            { id: '1', message_id: messageId, content: '저도요! ㅎㅎ', created_at: new Date().toISOString() },
        ];
    }

    try {
        const { data, error } = await supabase
            .from('message_comments')
            .select('*')
            .eq('message_id', messageId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Comments fetch error:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Comments error:', err);
        return [];
    }
};

export const createComment = async (messageId: string, content: string): Promise<{ success: boolean; comment?: MessageComment; error?: string }> => {
    if (!supabase) {
        const newComment: MessageComment = {
            id: Date.now().toString(),
            message_id: messageId,
            content,
            created_at: new Date().toISOString()
        };
        return { success: true, comment: newComment };
    }

    try {
        const { data, error } = await supabase
            .from('message_comments')
            .insert([{ message_id: messageId, content }])
            .select()
            .single();

        if (error) {
            console.error('Create comment error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, comment: data };
    } catch (err) {
        console.error('Create comment error:', err);
        return { success: false, error: 'Failed to create comment' };
    }
};

export const likeMessage = async (messageId: string, isCurrentlyLiked: boolean): Promise<{ success: boolean; newCount?: number; error?: string }> => {
    const delta = isCurrentlyLiked ? -1 : 1; // Unlike = -1, Like = +1

    if (!supabase) {
        // Mock: just return success with toggled count
        return { success: true, newCount: Math.max(0, delta) };
    }

    try {
        // First get current count
        const { data: current, error: fetchError } = await supabase
            .from('messages')
            .select('likes_count')
            .eq('id', messageId)
            .single();

        if (fetchError) {
            console.warn('Like message fetch error:', fetchError);
            return { success: true, newCount: Math.max(0, delta) };
        }

        const newCount = Math.max(0, (current?.likes_count || 0) + delta);

        const { error: updateError } = await supabase
            .from('messages')
            .update({ likes_count: newCount })
            .eq('id', messageId);

        if (updateError) {
            console.warn('Like message update error:', updateError);
            return { success: true, newCount: Math.max(0, delta) };
        }

        return { success: true, newCount };
    } catch (err) {
        console.warn('Like message error:', err);
        return { success: true, newCount: Math.max(0, delta) };
    }
};

// ============================================
// Balance Game API Functions
// ============================================

// Types for Balance Game
export interface BalanceGameMember {
    id?: string;
    group_number: number;
    member_name: string;
    is_leader: boolean;
    created_at?: string;
}

export interface BalanceGameQuestion {
    id?: string;
    option_a: string;
    option_b: string;
    is_active: boolean;
    created_at?: string;
}

export interface BalanceGameVote {
    id?: string;
    question_id: string;
    group_number: number;
    vote: 'A' | 'B';
    voter_name: string;
    created_at?: string;
}

// Default members data (used when Supabase not available)
const DEFAULT_MEMBERS: BalanceGameMember[] = [
    // Group 1
    { group_number: 1, member_name: '김진우', is_leader: false },
    { group_number: 1, member_name: '박인엽', is_leader: false },
    { group_number: 1, member_name: '제지원', is_leader: false },
    { group_number: 1, member_name: '장수정', is_leader: false },
    { group_number: 1, member_name: '장윤지', is_leader: false },
    { group_number: 1, member_name: '전예은', is_leader: false },
    // Group 2
    { group_number: 2, member_name: '정근식', is_leader: false },
    { group_number: 2, member_name: '윤예슬', is_leader: false },
    { group_number: 2, member_name: '장유경', is_leader: false },
    { group_number: 2, member_name: '박인찬', is_leader: false },
    { group_number: 2, member_name: '박상화', is_leader: false },
    { group_number: 2, member_name: '김찬우', is_leader: false },
    // Group 3
    { group_number: 3, member_name: '이건호', is_leader: false },
    { group_number: 3, member_name: '윤성재', is_leader: false },
    { group_number: 3, member_name: '이청훈', is_leader: false },
    { group_number: 3, member_name: '정호수', is_leader: false },
    { group_number: 3, member_name: '이유진', is_leader: false },
    { group_number: 3, member_name: '전민호', is_leader: false },
    // Group 4
    { group_number: 4, member_name: '김강안', is_leader: false },
    { group_number: 4, member_name: '임관섭', is_leader: false },
    { group_number: 4, member_name: '홍진우', is_leader: false },
    { group_number: 4, member_name: '권기빈', is_leader: false },
    { group_number: 4, member_name: '이상준', is_leader: false },
    { group_number: 4, member_name: '장동욱', is_leader: false },
    // Group 5
    { group_number: 5, member_name: '이인하', is_leader: false },
    { group_number: 5, member_name: '홍선기', is_leader: false },
    { group_number: 5, member_name: '김유겸', is_leader: false },
    { group_number: 5, member_name: '김동영', is_leader: false },
    { group_number: 5, member_name: '임대한', is_leader: false },
    { group_number: 5, member_name: '백경환', is_leader: false },
    // Group 6
    { group_number: 6, member_name: '최윤영', is_leader: false },
    { group_number: 6, member_name: '김완성', is_leader: false },
    { group_number: 6, member_name: '여현수', is_leader: false },
    { group_number: 6, member_name: '박상혁', is_leader: false },
    { group_number: 6, member_name: '유소이', is_leader: false },
    { group_number: 6, member_name: '나혜미', is_leader: false },
    // Group 7
    { group_number: 7, member_name: '방역주', is_leader: false },
    { group_number: 7, member_name: '국진혁', is_leader: false },
    { group_number: 7, member_name: '김상우', is_leader: false },
    { group_number: 7, member_name: '추명현', is_leader: false },
    { group_number: 7, member_name: '류진명', is_leader: false },
    // Group 8
    { group_number: 8, member_name: '오상준', is_leader: false },
    { group_number: 8, member_name: '이수영', is_leader: false },
    { group_number: 8, member_name: '서예명', is_leader: false },
    { group_number: 8, member_name: '정세준', is_leader: false },
    { group_number: 8, member_name: '강하은', is_leader: false },
    // Group 9
    { group_number: 9, member_name: '정재원', is_leader: false },
    { group_number: 9, member_name: '이은석', is_leader: false },
    { group_number: 9, member_name: '김경민', is_leader: false },
    { group_number: 9, member_name: '송현섭', is_leader: false },
    { group_number: 9, member_name: '김우열', is_leader: false },
    // Group 10
    { group_number: 10, member_name: '권태안', is_leader: false },
    { group_number: 10, member_name: '김수연', is_leader: false },
    { group_number: 10, member_name: '이건우', is_leader: false },
    { group_number: 10, member_name: '정현우', is_leader: false },
    { group_number: 10, member_name: '이주은', is_leader: false },
    // Group 11
    { group_number: 11, member_name: '최익중', is_leader: false },
    { group_number: 11, member_name: '김호진', is_leader: false },
    { group_number: 11, member_name: '남예지', is_leader: false },
    { group_number: 11, member_name: '양승연', is_leader: false },
    { group_number: 11, member_name: '황현선', is_leader: false },
    // Group 12
    { group_number: 12, member_name: '허재성', is_leader: false },
    { group_number: 12, member_name: '이제홍', is_leader: false },
    { group_number: 12, member_name: '김태현', is_leader: false },
    { group_number: 12, member_name: '노은아', is_leader: false },
    { group_number: 12, member_name: '서지원', is_leader: false },
    // Group 13
    { group_number: 13, member_name: '이상헌', is_leader: false },
    { group_number: 13, member_name: '정준우', is_leader: false },
    { group_number: 13, member_name: '정진호', is_leader: false },
    { group_number: 13, member_name: '박상하', is_leader: false },
    { group_number: 13, member_name: '정래현', is_leader: false },
    // Group 14
    { group_number: 14, member_name: '김활', is_leader: false },
    { group_number: 14, member_name: '안세현', is_leader: false },
    { group_number: 14, member_name: '김도희', is_leader: false },
    { group_number: 14, member_name: '신주훈', is_leader: false },
    { group_number: 14, member_name: '신성준', is_leader: false },
    // Group 15
    { group_number: 15, member_name: '박현준', is_leader: false },
    { group_number: 15, member_name: '김예지', is_leader: false },
    { group_number: 15, member_name: '김민규', is_leader: false },
    { group_number: 15, member_name: '강지원', is_leader: false },
    { group_number: 15, member_name: '백민경', is_leader: false },
    // Group 16
    { group_number: 16, member_name: '황영진', is_leader: false },
    { group_number: 16, member_name: '정하진', is_leader: false },
    { group_number: 16, member_name: '전윤하', is_leader: false },
    { group_number: 16, member_name: '이승현', is_leader: false },
    { group_number: 16, member_name: '구본걸', is_leader: false },
];

const DEFAULT_QUESTIONS: BalanceGameQuestion[] = [
    { id: '1', option_a: '짜장', option_b: '짬뽕', is_active: false },
    { id: '2', option_a: '내가 만든 서비스, 아무 반응 없이 조용히 사라짐', option_b: '엄청 욕먹지만 쓰는 사람은 많음', is_active: false },
    { id: '3', option_a: '실력 SSS급인데 인간관계 지뢰 개발자', option_b: '인성 천사급인데 실력은 주니어 1년차 개발자', is_active: false },
    { id: '4', option_a: '나랑 진짜 잘 맞는 사람 1명', option_b: '나를 도와줄 수 있는 사람 10명', is_active: false },
    { id: '5', option_a: '말 한마디 하지 않는 팀원과 일하기', option_b: '내 모든 것을 알려고 하는 팀원과 일하기', is_active: false },
    { id: '6', option_a: '주말엔 고생했으니 나가서 놀아야 한다', option_b: '주말엔 고생했으니 집에서 쉬어야 한다', is_active: false },
];

// === GROUP MEMBERS ===
export const getGroupMembers = async (): Promise<BalanceGameMember[]> => {
    if (!supabase) return DEFAULT_MEMBERS;

    try {
        const { data, error } = await supabase
            .from('balance_game_groups')
            .select('*')
            .order('group_number', { ascending: true });

        if (error) {
            console.error('Get members error:', error);
            return DEFAULT_MEMBERS;
        }

        return data || DEFAULT_MEMBERS;
    } catch (err) {
        console.error('Get members error:', err);
        return DEFAULT_MEMBERS;
    }
};

export const addMember = async (groupNumber: number, memberName: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
        const { error } = await supabase
            .from('balance_game_groups')
            .insert([{ group_number: groupNumber, member_name: memberName, is_leader: false }]);

        if (error) {
            console.error('Add member error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Add member error:', err);
        return { success: false, error: 'Failed to add member' };
    }
};

export const removeMember = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
        const { error } = await supabase
            .from('balance_game_groups')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Remove member error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Remove member error:', err);
        return { success: false, error: 'Failed to remove member' };
    }
};

export const setGroupLeader = async (groupNumber: number, memberName: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
        // First, remove leader status from all members in the group
        await supabase
            .from('balance_game_groups')
            .update({ is_leader: false })
            .eq('group_number', groupNumber);

        // Then set the new leader
        if (memberName) {
            const { error } = await supabase
                .from('balance_game_groups')
                .update({ is_leader: true })
                .eq('group_number', groupNumber)
                .eq('member_name', memberName);

            if (error) {
                console.error('Set leader error:', error);
                return { success: false, error: error.message };
            }
        }

        return { success: true };
    } catch (err) {
        console.error('Set leader error:', err);
        return { success: false, error: 'Failed to set leader' };
    }
};

// === QUESTIONS ===
export const getBalanceQuestions = async (): Promise<BalanceGameQuestion[]> => {
    if (!supabase) return DEFAULT_QUESTIONS;

    try {
        const { data, error } = await supabase
            .from('balance_game_questions')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Get questions error:', error);
            return DEFAULT_QUESTIONS;
        }

        return data || DEFAULT_QUESTIONS;
    } catch (err) {
        console.error('Get questions error:', err);
        return DEFAULT_QUESTIONS;
    }
};

export const addBalanceQuestion = async (optionA: string, optionB: string): Promise<{ success: boolean; question?: BalanceGameQuestion; error?: string }> => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
        const { data, error } = await supabase
            .from('balance_game_questions')
            .insert([{ option_a: optionA, option_b: optionB, is_active: false }])
            .select()
            .single();

        if (error) {
            console.error('Add question error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, question: data };
    } catch (err) {
        console.error('Add question error:', err);
        return { success: false, error: 'Failed to add question' };
    }
};

export const updateBalanceQuestion = async (id: string, optionA: string, optionB: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
        const { error } = await supabase
            .from('balance_game_questions')
            .update({ option_a: optionA, option_b: optionB })
            .eq('id', id);

        if (error) {
            console.error('Update question error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Update question error:', err);
        return { success: false, error: 'Failed to update question' };
    }
};

export const deleteBalanceQuestion = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
        const { error } = await supabase
            .from('balance_game_questions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete question error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Delete question error:', err);
        return { success: false, error: 'Failed to delete question' };
    }
};

export const setActiveQuestion = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
        // First, check if this question is already active
        const { data: currentQuestion, error: fetchError } = await supabase
            .from('balance_game_questions')
            .select('is_active')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Fetch question error:', fetchError);
            return { success: false, error: fetchError.message };
        }

        const isCurrentlyActive = currentQuestion?.is_active || false;

        // Deactivate ALL questions first (this ensures clean state)
        const { error: deactivateError } = await supabase
            .from('balance_game_questions')
            .update({ is_active: false })
            .not('id', 'is', null);  // Match all rows

        if (deactivateError) {
            console.error('Deactivate questions error:', deactivateError);
            return { success: false, error: deactivateError.message };
        }

        // If the question was already active, we just deactivated it (toggle off)
        // If it was not active, activate it now
        if (!isCurrentlyActive) {
            const { error: activateError } = await supabase
                .from('balance_game_questions')
                .update({ is_active: true })
                .eq('id', id);

            if (activateError) {
                console.error('Activate question error:', activateError);
                return { success: false, error: activateError.message };
            }
        }

        // Clear all votes when changing/toggling question
        await supabase
            .from('balance_game_votes')
            .delete()
            .not('id', 'is', null);  // Match all rows

        return { success: true };
    } catch (err) {
        console.error('Set active question error:', err);
        return { success: false, error: 'Failed to set active question' };
    }
};

// === VOTES ===
export const getBalanceVotes = async (questionId?: string): Promise<BalanceGameVote[]> => {
    if (!supabase) return [];

    try {
        let query = supabase
            .from('balance_game_votes')
            .select('*');

        if (questionId) {
            query = query.eq('question_id', questionId);
        }

        const { data, error } = await query.order('created_at', { ascending: true });

        if (error) {
            console.error('Get votes error:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Get votes error:', err);
        return [];
    }
};

export const submitBalanceVote = async (questionId: string, groupNumber: number, vote: 'A' | 'B', voterName: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
        const { error } = await supabase
            .from('balance_game_votes')
            .upsert([{
                question_id: questionId,
                group_number: groupNumber,
                vote,
                voter_name: voterName
            }], { onConflict: 'question_id,group_number' });

        if (error) {
            console.error('Submit vote error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Submit vote error:', err);
        return { success: false, error: 'Failed to submit vote' };
    }
};

export const resetGroupVote = async (questionId: string, groupNumber: number): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
        const { error } = await supabase
            .from('balance_game_votes')
            .delete()
            .eq('question_id', questionId)
            .eq('group_number', groupNumber);

        if (error) {
            console.error('Reset vote error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Reset vote error:', err);
        return { success: false, error: 'Failed to reset vote' };
    }
};

// === REAL-TIME SUBSCRIPTIONS ===
export const subscribeToBalanceGame = (callback: () => void) => {
    if (!supabase) {
        return { unsubscribe: () => { } };
    }

    const channel = supabase
        .channel('balance-game-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'balance_game_groups' }, callback)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'balance_game_questions' }, callback)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'balance_game_votes' }, callback)
        .subscribe();

    return {
        unsubscribe: () => {
            supabase.removeChannel(channel);
        }
    };
};

// === SEED DATA ===
export const seedBalanceGameData = async (): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
        // Check if data already exists
        const { data: existingMembers } = await supabase
            .from('balance_game_groups')
            .select('id')
            .limit(1);

        if (existingMembers && existingMembers.length > 0) {
            return { success: true }; // Already seeded
        }

        // Seed members
        const { error: membersError } = await supabase
            .from('balance_game_groups')
            .insert(DEFAULT_MEMBERS.map(m => ({
                group_number: m.group_number,
                member_name: m.member_name,
                is_leader: m.is_leader
            })));

        if (membersError) {
            console.error('Seed members error:', membersError);
            return { success: false, error: membersError.message };
        }

        // Seed questions
        const { error: questionsError } = await supabase
            .from('balance_game_questions')
            .insert(DEFAULT_QUESTIONS.map(q => ({
                option_a: q.option_a,
                option_b: q.option_b,
                is_active: q.is_active
            })));

        if (questionsError) {
            console.error('Seed questions error:', questionsError);
            return { success: false, error: questionsError.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Seed data error:', err);
        return { success: false, error: 'Failed to seed data' };
    }
};

// ============================================
// 참가자 관리 API Functions (Admin)
// ============================================

// 모든 참가자 목록 조회
export const getAllRegistrations = async (): Promise<Registration[]> => {
    if (!supabase) {
        // Mock data for development
        return [
            { id: '1', name: '홍길동', phone: '010-1234-5678', batch: '29기', school: 'YONSEI', is_sponsor: false, is_paid: true, is_checked_in: true, created_at: new Date().toISOString() },
            { id: '2', name: '김철수', phone: '010-2345-6789', batch: '28기', school: 'KOREA', is_sponsor: true, is_paid: true, is_checked_in: false, created_at: new Date().toISOString() },
            { id: '3', name: '이영희', phone: '010-3456-7890', batch: '27기', school: 'YONSEI', is_sponsor: false, is_paid: false, is_checked_in: false, created_at: new Date().toISOString() },
        ];
    }

    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get registrations error:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Get registrations error:', err);
        return [];
    }
};

// 참가자 체크인 상태 토글
export const toggleCheckIn = async (id: string, isCheckedIn: boolean): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: true }; // Mock success

    try {
        const { error } = await supabase
            .from('registrations')
            .update({ is_checked_in: isCheckedIn })
            .eq('id', id);

        if (error) {
            console.error('Toggle check-in error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Toggle check-in error:', err);
        return { success: false, error: 'Failed to toggle check-in' };
    }
};

// 참가자 입금 상태 토글
export const togglePaid = async (id: string, isPaid: boolean): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: true }; // Mock success

    try {
        const { error } = await supabase
            .from('registrations')
            .update({ is_paid: isPaid })
            .eq('id', id);

        if (error) {
            console.error('Toggle paid error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Toggle paid error:', err);
        return { success: false, error: 'Failed to toggle paid status' };
    }
};

// 실시간 참가자 목록 구독
export const subscribeToRegistrations = (callback: () => void) => {
    if (!supabase) {
        return { unsubscribe: () => { } };
    }

    const channel = supabase
        .channel('registrations-admin-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, callback)
        .subscribe();

    return {
        unsubscribe: () => {
            supabase.removeChannel(channel);
        }
    };
};

// 현장 등록 (이름, 기수, 학교만으로 빠르게 등록 + 자동 체크인)
export const addOnSiteRegistration = async (
    name: string,
    batch: string,
    school: 'YONSEI' | 'KOREA'
): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) return { success: true }; // Mock success

    try {
        const { error } = await supabase
            .from('registrations')
            .insert([{
                name,
                batch,
                school,
                phone: '현장등록',
                is_sponsor: false,
                is_paid: true,  // 현장 결제 완료
                is_checked_in: true,  // 자동 체크인
            }]);

        if (error) {
            console.error('On-site registration error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('On-site registration error:', err);
        return { success: false, error: 'Failed to add on-site registration' };
    }
};
