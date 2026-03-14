import { supabase } from '@/src/lib/supabase';

export interface ReligiousContent {
  id: string;
  type: 'verse' | 'hadith' | 'dua';
  content: string;
  source: string;
  created_at: string;
}

export const religiousService = {
  async getDailyContent(): Promise<{ data: ReligiousContent | null; error: any }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('religious_content')
        .select('*')
        .eq('created_at', today)
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};
