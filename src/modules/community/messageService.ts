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
    try {
      const response = await fetch(`/api/conversations/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  // Get messages for a specific conversation
  async getMessages(conversationId: string, limit = 50) {
    try {
      const response = await fetch(`/api/messages/${conversationId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  // Send a new message
  async sendMessage(conversationId: string, senderId: string, content: string, mediaUrl?: string, mediaType?: string) {
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId, sender_id: senderId, content, media_url: mediaUrl, media_type: mediaType })
      });
      if (!response.ok) throw new Error('Failed to send message');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  // Create or get a direct conversation between two users
  async createOrGetDirectConversation(userId1: string, userId2: string) {
    try {
      // First check if a direct conversation already exists
      const { data: convs } = await this.getConversations(userId1);
      const existing = convs?.find((c: any) => 
        c.type === 'direct' && c.participants?.some((p: any) => p.id === userId2)
      );

      if (existing) return { data: existing, error: null };

      // If not exists, create one using local API
      const response = await fetch('/api/conversations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_ids: [userId1, userId2],
          type: 'direct'
        })
      });
      
      if (!response.ok) throw new Error('Failed to create conversation');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
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
