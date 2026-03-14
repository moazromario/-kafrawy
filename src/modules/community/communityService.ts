import { supabase } from '@/src/lib/supabase';

export interface Post {
  id: string;
  user_id: string;
  page_id?: string;
  group_id?: string;
  content: string;
  privacy: 'public' | 'friends' | 'only_me' | 'custom';
  feeling?: string;
  activity?: string;
  location?: string;
  background_color?: string;
  is_pinned: boolean;
  is_hidden: boolean;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at?: string;
  user_reaction?: string | null;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
  post_media?: PostMedia[];
}

export interface PostMedia {
  id: string;
  url: string;
  media_type: 'image' | 'video' | 'document';
  display_order: number;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  user_id: string;
  content: string;
  media_url?: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at?: string;
  user_reaction?: string | null;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

export const communityService = {
  // --- Media ---
  async uploadMedia(file: File, type: 'image' | 'video' | 'document'): Promise<{ url: string | null; error: any }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('community_media')
        .upload(filePath, file);

      if (uploadError && (uploadError.message?.includes('Bucket not found') || (uploadError as any).error === 'Bucket not found')) {
        const { error: createError } = await supabase.storage.createBucket('community_media', {
          public: true,
          allowedMimeTypes: ['image/*', 'video/*', 'application/pdf'],
        });
        
        if (!createError) {
          const retry = await supabase.storage.from('community_media').upload(filePath, file);
          uploadError = retry.error;
        } else {
          return { url: null, error: new Error('مساحة التخزين غير موجودة.') };
        }
      }

      if (uploadError) {
        return { url: null, error: new Error(uploadError.message || 'فشل رفع الوسائط.') };
      }

      const { data } = supabase.storage.from('community_media').getPublicUrl(filePath);
      return { url: data.publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error instanceof Error ? error : new Error('حدث خطأ غير متوقع.') };
    }
  },

  // --- Posts ---
  async getPosts(userId?: string, page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: postsData, error: postsError, count } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url),
        post_media (*)
      `, { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (postsError || !postsData) {
      return { data: null, error: postsError, count: 0 };
    }

    let userReactions: Record<string, string> = {};
    if (userId && postsData.length > 0) {
      const postIds = postsData.map(p => p.id);
      const { data: reactionsData } = await supabase
        .from('reactions')
        .select('post_id, reaction_type')
        .eq('user_id', userId)
        .in('post_id', postIds);
        
      if (reactionsData) {
        userReactions = reactionsData.reduce((acc, reaction) => {
          if (reaction.post_id) acc[reaction.post_id] = reaction.reaction_type;
          return acc;
        }, {} as Record<string, string>);
      }
    }

    const postsWithReactions = postsData.map(post => ({
      ...post,
      user_reaction: userReactions[post.id] || null,
      // Fallback for old UI components expecting media_url directly on post
      media_url: post.post_media && post.post_media.length > 0 ? post.post_media[0].url : undefined,
      media_type: post.post_media && post.post_media.length > 0 ? post.post_media[0].media_type : undefined,
    }));

    return { data: postsWithReactions, error: null, count: count || 0 };
  },

  async getPostById(postId: string, userId?: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url),
        post_media (*)
      `)
      .eq('id', postId)
      .single();

    if (error || !data) return { data: null, error };

    let userReaction = null;
    if (userId) {
      const { data: reactionData } = await supabase
        .from('reactions')
        .select('reaction_type')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .single();
      if (reactionData) userReaction = reactionData.reaction_type;
    }

    return { data: { ...data, user_reaction: userReaction }, error: null };
  },

  async createPost(userId: string, content: string, mediaUrl?: string, mediaType?: 'image' | 'video', location?: string, feeling?: string, privacy: string = 'public') {
    // 1. Create the post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert([{ user_id: userId, content, location, feeling, privacy }])
      .select()
      .single();

    if (postError || !post) return { data: null, error: postError };

    // 2. Add media if provided
    if (mediaUrl && mediaType) {
      await supabase
        .from('post_media')
        .insert([{ post_id: post.id, url: mediaUrl, media_type: mediaType }]);
    }

    return { data: post, error: null };
  },

  async updatePost(userId: string, postId: string, content: string, location?: string, feeling?: string) {
    const { data, error } = await supabase
      .from('posts')
      .update({ content, location, feeling })
      .match({ id: postId, user_id: userId })
      .select()
      .single();
    return { data, error };
  },

  async deletePost(userId: string, postId: string) {
    // Soft delete
    const { error } = await supabase
      .from('posts')
      .update({ deleted_at: new Date().toISOString() })
      .match({ id: postId, user_id: userId });
    return { error };
  },

  // --- Reactions ---
  async reactToPost(userId: string, postId: string, reactionType: string = 'like') {
    const { error } = await supabase
      .from('reactions')
      .upsert([{ user_id: userId, post_id: postId, reaction_type: reactionType }], { onConflict: 'user_id, post_id' });
    return { error };
  },

  async removePostReaction(userId: string, postId: string) {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .match({ user_id: userId, post_id: postId });
    return { error };
  },

  // --- Comments ---
  async getComments(postId: string, userId?: string) {
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url)
      `)
      .eq('post_id', postId)
      .is('parent_id', null) // Get top-level comments only for main view
      .is('deleted_at', null)
      .order('created_at', { ascending: true });

    if (commentsError || !commentsData) {
      return { data: null, error: commentsError };
    }

    let userReactions: Record<string, string> = {};
    if (userId && commentsData.length > 0) {
      const commentIds = commentsData.map(c => c.id);
      const { data: reactionsData } = await supabase
        .from('reactions')
        .select('comment_id, reaction_type')
        .eq('user_id', userId)
        .in('comment_id', commentIds);
        
      if (reactionsData) {
        userReactions = reactionsData.reduce((acc, reaction) => {
          if (reaction.comment_id) acc[reaction.comment_id] = reaction.reaction_type;
          return acc;
        }, {} as Record<string, string>);
      }
    }

    const commentsWithReactions = commentsData.map(comment => ({
      ...comment,
      user_reaction: userReactions[comment.id] || null
    }));

    return { data: commentsWithReactions, error: null };
  },

  async addComment(userId: string, postId: string, content: string, parentId?: string, mediaUrl?: string) {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: userId, content, parent_id: parentId, media_url: mediaUrl }])
      .select()
      .single();
    return { data, error };
  },

  async deleteComment(userId: string, commentId: string) {
    const { error } = await supabase
      .from('comments')
      .update({ deleted_at: new Date().toISOString() })
      .match({ id: commentId, user_id: userId });
    return { error };
  },

  // --- Friends ---
  async getFriends(userId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        *,
        friend_profile:friend_id (id, full_name, avatar_url),
        user_profile:user_id (id, full_name, avatar_url)
      `)
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'accepted');
    return { data, error };
  },

  async getFriendRequests(userId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        *,
        profiles:user_id (id, full_name, avatar_url)
      `)
      .eq('friend_id', userId)
      .eq('status', 'pending');
    return { data, error };
  },

  async getFriendSuggestions(userId: string) {
    // 1. Get current friendships
    const { data: friendships } = await supabase
      .from('friendships')
      .select('user_id, friend_id')
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);
      
    const excludedIds = new Set([userId]);
    if (friendships) {
      friendships.forEach(f => {
        excludedIds.add(f.user_id);
        excludedIds.add(f.friend_id);
      });
    }

    // 2. Get profiles not in excluded list
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .not('id', 'in', `(${Array.from(excludedIds).join(',')})`)
      .limit(10);

    return { data, error };
  },

  async sendFriendRequest(userId: string, friendId: string) {
    const { error } = await supabase
      .from('friendships')
      .insert([{ user_id: userId, friend_id: friendId, status: 'pending' }]);
    return { error };
  },

  async acceptFriendRequest(requestId: string) {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', requestId);
    return { error };
  },

  async rejectFriendRequest(requestId: string) {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', requestId);
    return { error };
  },

  // --- Events ---
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        creator:creator_id (full_name, avatar_url)
      `)
      .order('start_time', { ascending: true });
    return { data, error };
  },

  async joinEvent(userId: string, eventId: string) {
    const { error } = await supabase
      .from('event_attendees')
      .insert([{ event_id: eventId, user_id: userId }]);
    return { error };
  },

  // --- Messages ---
  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(user_id, profiles(full_name, avatar_url))
      `)
      .eq('conversation_participants.user_id', userId)
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ conversation_id: conversationId, sender_id: senderId, content }])
      .select()
      .single();
    return { data, error };
  },

  // --- Groups ---
  async getGroups(userId?: string) {
    const { data: groupsData, error: groupsError } = await supabase
      .from('groups')
      .select(`
        *,
        creator:creator_id (full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (groupsError || !groupsData) {
      return { data: null, error: groupsError };
    }

    let userMemberships: Record<string, string> = {};
    if (userId && groupsData.length > 0) {
      const groupIds = groupsData.map(g => g.id);
      const { data: membershipData } = await supabase
        .from('group_members')
        .select('group_id, status, role')
        .eq('user_id', userId)
        .in('group_id', groupIds);
        
      if (membershipData) {
        userMemberships = membershipData.reduce((acc, membership) => {
          if (membership.group_id) acc[membership.group_id] = membership.status;
          return acc;
        }, {} as Record<string, string>);
      }
    }

    const groupsWithMembership = groupsData.map(group => ({
      ...group,
      user_membership_status: userMemberships[group.id] || null
    }));

    return { data: groupsWithMembership, error: null };
  },

  async getGroupById(groupId: string) {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        creator:creator_id (full_name, avatar_url)
      `)
      .eq('id', groupId)
      .single();
    return { data, error };
  },

  async createGroup(userId: string, name: string, description: string, privacy: string, coverUrl?: string) {
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert([{ 
        name, 
        description, 
        privacy, 
        cover_url: coverUrl,
        creator_id: userId 
      }])
      .select()
      .single();

    if (groupError || !group) return { data: null, error: groupError };

    // Automatically add creator as admin
    await supabase
      .from('group_members')
      .insert([{ 
        group_id: group.id, 
        user_id: userId, 
        role: 'admin',
        status: 'approved'
      }]);

    return { data: group, error: null };
  },

  async joinGroup(userId: string, groupId: string, isPrivate: boolean) {
    const status = isPrivate ? 'pending' : 'approved';
    const { error } = await supabase
      .from('group_members')
      .insert([{ 
        group_id: groupId, 
        user_id: userId, 
        status 
      }]);
    return { error };
  },

  // --- Notifications ---
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:actor_id (full_name, avatar_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async markNotificationAsRead(userId: string, notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .match({ id: notificationId, user_id: userId });
    return { error };
  },

  async markAllNotificationsAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    return { error };
  },
  
  async deleteNotification(userId: string, notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .match({ id: notificationId, user_id: userId });
    return { error };
  },

  // --- Profile ---
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  }
};
