import { supabase } from '@/src/lib/supabase';

export const workersService = {
  async getWorkers(specialty?: string) {
    let query = supabase
      .from('workers')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url, location)
      `);
    
    if (specialty) {
      query = query.eq('specialty', specialty);
    }

    const { data, error } = await query.order('rating', { ascending: false });
    return { data, error };
  },

  async getWorkerById(userId: string) {
    const { data, error } = await supabase
      .from('workers')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url, location, bio)
      `)
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  async requestService(workerId: string, description: string, scheduledAt: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        client_id: user.id,
        worker_id: workerId,
        description,
        scheduled_at: scheduledAt,
      })
      .select()
      .single();
    return { data, error };
  },

  async getMyRequests() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        profiles:worker_id (full_name, avatar_url)
      `)
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getWorkerRequests() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        profiles:client_id (full_name, avatar_url)
      `)
      .eq('worker_id', user.id)
      .order('created_at', { ascending: false });
    return { data, error };
  },
};
