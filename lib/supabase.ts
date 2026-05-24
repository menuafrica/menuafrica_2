import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

export const AuthService = {
    getFullProfile: async (userId: string) => {
        if (!isSupabaseConfigured) return null;
        const { data: profile } = await supabase.from('profiles').select('role, organization:organizations(*), restaurant:restaurants(*)').eq('id', userId).single();
        return profile;
    },
    createRestaurantAccount: async (name: string, slug: string, email: string) => {
        if (!isSupabaseConfigured) return null;
        await supabase.from('restaurants').insert([{ name, slug, email }]);
    }
};
