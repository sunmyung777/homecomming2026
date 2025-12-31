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

const MOCK_MESSAGES = [
    { id: '1', content: '안녕하세요! 인사이더스 화이팅! 🎉', color: '#fef08a', rotation: -3, created_at: new Date().toISOString() },
    { id: '2', content: '창립제 너무 기대돼요~ 케미스트리 강남에서 만나요!', color: '#d9f99d', rotation: 2, created_at: new Date().toISOString() },
    { id: '3', content: '선배님들 반가워요! 29기 파이팅 💪', color: '#a5f3fc', rotation: -1, created_at: new Date().toISOString() },
    { id: '4', content: '10기 OB입니다. 오랜만에 후배들 얼굴 보니 감회가 새롭네요 ㅎㅎ', color: '#c4b5fd', rotation: 4, created_at: new Date().toISOString() },
    { id: '5', content: '연고전도 하고 창립제도 하고... 인사이더스 최고 🏆', color: '#fecaca', rotation: -2, created_at: new Date().toISOString() },
    { id: '6', content: '15기인데 동기들 많이 왔으면 좋겠다!!', color: '#fbcfe8', rotation: 1, created_at: new Date().toISOString() },
    { id: '7', content: '후배님들 응원합니다 🙌 항상 건강하고 행복하세요', color: '#fde68a', rotation: -4, created_at: new Date().toISOString() },
    { id: '8', content: '2026년 새해 복 많이 받으세요! 창립제에서 봐요~', color: '#d9f99d', rotation: 3, created_at: new Date().toISOString() },
    { id: '9', content: '28기 막내였는데 벌써 29기가 들어오다니... 시간 빠르다', color: '#a5f3fc', rotation: -1, created_at: new Date().toISOString() },
    { id: '10', content: '인사이더스에서의 추억이 제 대학생활 최고의 기억입니다 ❤️', color: '#fef08a', rotation: 2, created_at: new Date().toISOString() },
    { id: '11', content: '22기입니다! 동기들 연락좀 해줘~', color: '#c4b5fd', rotation: -3, created_at: new Date().toISOString() },
    { id: '12', content: '다들 건강하게 잘 지내고 있죠? 창립제에서 만나요!', color: '#fbcfe8', rotation: 1, created_at: new Date().toISOString() },
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
