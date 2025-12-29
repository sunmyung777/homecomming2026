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
                is_sponsor: data.is_sponsor
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
