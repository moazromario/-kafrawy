import { supabase } from '@/src/lib/supabase';

export const messagingService = {
  async getConversations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_participants!inner (user_id),
        messages (content, created_at, sender_id)
      `)
      .eq('conversation_participants.user_id', user.id)
      .order('last_message_at', { ascending: false });
    
    // Note: In a real app, you'd need to fetch the OTHER participant's profile separately or via a more complex join
    return { data, error };
  },

  async getMessages(conversationId: string, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:sender_id (full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data: data?.reverse(), error };
  },

  async sendMessage(conversationId: string, content: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
      })
      .select()
      .single();
    return { data, error };
  },

  async startConversation(otherUserId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // 1. Check if conversation already exists
    // (Simplified check for 1-on-1)
    
    // 2. Create new conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();
    
    if (convError) throw convError;

    // 3. Add participants
    const participants = [
      { conversation_id: conversation.id, user_id: user.id },
      { conversation_id: conversation.id, user_id: otherUserId },
    ];

    const { error: partError } = await supabase.from('conversation_participants').insert(participants);
    if (partError) throw partError;

    return { conversation, error: null };
  },

  subscribeToMessages(conversationId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`chat-${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, callback)
      .subscribe();
  },
};
