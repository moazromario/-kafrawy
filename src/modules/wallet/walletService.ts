import { supabase } from '@/src/lib/supabase';

export const walletService = {
  async getBalance() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // Wallet doesn't exist yet, create one
      await supabase.from('wallets').insert({ user_id: user.id, balance: 0 });
      return { balance: 0, error: null };
    }

    return { balance: data?.balance || 0, error };
  },

  async getTransactions() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async submitTopup(amount: number, phoneNumber: string, receiptImage?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('wallet_topups')
      .insert({
        user_id: user.id,
        amount,
        phone_number: phoneNumber,
        receipt_image: receiptImage,
      })
      .select()
      .single();
    return { data, error };
  },

  async getTopupRequests() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('wallet_topups')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Admin functions
  async adminGetPendingTopups() {
    const { data, error } = await supabase
      .from('wallet_topups')
      .select(`
        *,
        profiles:user_id (full_name, email)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async adminApproveTopup(topupId: string) {
    const { data, error } = await supabase
      .from('wallet_topups')
      .update({ status: 'approved' })
      .eq('id', topupId);
    return { data, error };
  },

  async adminRejectTopup(topupId: string, notes: string) {
    const { data, error } = await supabase
      .from('wallet_topups')
      .update({ status: 'rejected', admin_notes: notes })
      .eq('id', topupId);
    return { data, error };
  },
};
