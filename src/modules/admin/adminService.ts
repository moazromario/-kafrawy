import { supabase } from '@/src/lib/supabase';

export const adminService = {
  async getStats() {
    // In a real app, these would be RPC calls or complex queries
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: orderCount } = await supabase.from('delivery_orders').select('*', { count: 'exact', head: true });

    return {
      users: userCount || 0,
      posts: postCount || 0,
      products: productCount || 0,
      orders: orderCount || 0,
    };
  },

  async getUsers(limit = 20) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async updateUserRole(userId: string, role: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);
    return { error };
  },

  async getPendingTopups() {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url)
      `)
      .eq('type', 'topup')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async approveTopup(transactionId: string, userId: string, amount: number) {
    // This should ideally be a database transaction (RPC)
    const { error: transError } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', transactionId);
    
    if (transError) throw transError;

    // Update wallet balance
    const { data: wallet } = await supabase.from('wallets').select('balance').eq('user_id', userId).single();
    const newBalance = (Number(wallet?.balance) || 0) + amount;

    const { error: walletError } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', userId);
    
    return { error: walletError };
  }
};
