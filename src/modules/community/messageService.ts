import { supabase } from '@/src/lib/supabase';

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  created_at: string;
  updated_at: string;
  participants?: any[];
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video' | 'audio' | 'document';
  created_at: string;
  is_read: boolean;
  sender?: {
    full_name: string;
    avatar_url: string;
  };
}

export const messageService = {
  // Get all conversations for a user
  async getConversations(userId: string) {
    // 1. Get conversation IDs the user is part of
    const { data: participantData, error: participantError } = await supabase
      .from('conversation_participants')
      .select('conversation_id, last_read_at')
      .eq('user_id', userId);

    if (participantError || !participantData) {
      return { data: null, error: participantError };
    }

    const conversationIds = participantData.map(p => p.conversation_id);
    if (conversationIds.length === 0) return { data: [], error: null };

    // 2. Get the conversations with participants and latest message
    const { data: conversationsData, error: convError } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          user_id,
          profiles:user_id(id, full_name, avatar_url)
        ),
        messages(
          id, sender_id, content, media_url, media_type, created_at, is_read
        )
      `)
      .in('id', conversationIds)
      .order('updated_at', { ascending: false });

    if (convError || !conversationsData) {
      return { data: null, error: convError };
    }

    // Format the data
    const formattedConversations = conversationsData.map(conv => {
      // Sort messages to get the latest one
      const sortedMessages = (conv.messages as any[]).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const lastMessage = sortedMessages[0];

      // Calculate unread count (messages sent by others after last_read_at)
      const lastReadAt = participantData.find(p => p.conversation_id === conv.id)?.last_read_at;
      const unreadCount = sortedMessages.filter(m => 
        m.sender_id !== userId && 
        (!lastReadAt || new Date(m.created_at) > new Date(lastReadAt))
      ).length;

      return {
        ...conv,
        last_message: lastMessage,
        unread_count: unreadCount,
        // Remove messages array to save memory, we only need last_message here
        messages: undefined 
      };
    });

    return { data: formattedConversations, error: null };
  },

  // Get messages for a specific conversation
  async getMessages(conversationId: string, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    return { data, error };
  },

  // Send a new message
  async sendMessage(conversationId: string, senderId: string, content: string, mediaUrl?: string, mediaType?: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        media_url: mediaUrl,
        media_type: mediaType
      }])
      .select(`
        *,
        sender:sender_id(full_name, avatar_url)
      `)
      .single();

    return { data, error };
  },

  // Create or get a direct conversation between two users
  async createOrGetDirectConversation(userId1: string, userId2: string) {
    // Check if a direct conversation already exists
    const { data: existingData, error: searchError } = await supabase
      .rpc('get_direct_conversation', { user1_id: userId1, user2_id: userId2 });

    // If RPC doesn't exist, we do it manually
    if (searchError) {
      const { data: user1Convs } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId1);
        
      if (user1Convs && user1Convs.length > 0) {
        const convIds = user1Convs.map(c => c.conversation_id);
        const { data: commonConvs } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', userId2)
          .in('conversation_id', convIds);
          
        if (commonConvs && commonConvs.length > 0) {
          // Verify it's a direct conversation
          for (const conv of commonConvs) {
            const { data: convDetails } = await supabase
              .from('conversations')
              .select('type')
              .eq('id', conv.conversation_id)
              .single();
              
            if (convDetails?.type === 'direct') {
              return { data: { id: conv.conversation_id }, error: null };
            }
          }
        }
      }
    } else if (existingData) {
      return { data: { id: existingData }, error: null };
    }

    // Create new conversation
    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert([{ type: 'direct' }])
      .select()
      .single();

    if (createError || !newConv) return { data: null, error: createError };

    // Add participants
    await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: newConv.id, user_id: userId1 },
        { conversation_id: newConv.id, user_id: userId2 }
      ]);

    return { data: newConv, error: null };
  },

  // Mark conversation as read
  async markAsRead(conversationId: string, userId: string) {
    const { error } = await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .match({ conversation_id: conversationId, user_id: userId });
      
    return { error };
  },

  // Subscribe to new messages in a conversation
  subscribeToMessages(conversationId: string, callback: (message: any) => void) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  }
};
