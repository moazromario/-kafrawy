import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url?: string;
  category?: string;
  city?: string;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
  user_reaction?: boolean;
  post_media?: { url: string; media_type: string }[];
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  media_url?: string;
  created_at: string;
  deleted_at?: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

export const communityService = {
  // --- Media Upload ---
  async uploadMedia(file: File, type: 'image' | 'video' = 'image') {
    if (!isSupabaseConfigured) {
      return { url: null, error: new Error('Supabase is not configured') };
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `community/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('community_media')
      .upload(filePath, file);

    if (uploadError) return { url: null, error: uploadError };

    const { data } = supabase.storage
      .from('community_media')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  },

  // --- Search ---
  async search(query: string) {
    try {
      const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  // --- Posts ---
  // --- Smart Feed (The Real Brain 🔥) ---
  async getSmartFeed(userId: string) {
    try {
      const response = await fetch(`/api/feed?userId=${userId}&category=for_you`);
      if (!response.ok) throw new Error('Failed to fetch smart feed');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async getPostById(postId: string, userId?: string) {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) throw new Error('Post not found');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async getPosts(userId?: string, page = 1, pageSize = 10, groupId?: string, pageId?: string, category?: string) {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (groupId) params.append('groupId', groupId);
      if (pageId) params.append('pageId', pageId);
      if (category) params.append('category', category);
      
      const response = await fetch(`/api/feed?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch feed');
      const data = await response.json();
      return { data, error: null, count: data.length };
    } catch (error: any) {
      return { data: null, error, count: 0 };
    }
  },

  async createPost(userId: string, content: string, mediaUrl?: string, category?: string, city?: string) {
    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, content, media_url: mediaUrl, category, city })
      });
      if (!response.ok) throw new Error('Failed to create post');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async deletePost(postId: string) {
    try {
      const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete post');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },

  // --- Reactions ---
  async toggleLike(userId: string, postId: string, reactionType: string = 'like') {
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, post_id: postId, reaction_type: reactionType })
      });
      if (!response.ok) throw new Error('Failed to toggle like');
      const data = await response.json();
      return { data, error: null, liked: data.liked };
    } catch (error: any) {
      return { data: null, error, liked: false };
    }
  },

  // --- Comments ---
  async getComments(postId: string) {
    try {
      const response = await fetch(`/api/comments/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async addComment(userId: string, postId: string, content: string, parentId?: string, mediaUrl?: string) {
    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, post_id: postId, content, parent_id: parentId })
      });
      if (!response.ok) throw new Error('Failed to add comment');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async deleteComment(commentId: string) {
    try {
      const response = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete comment');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },

  // --- Shares & Events ---
  async sharePost(userId: string, postId: string) {
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, post_id: postId })
      });
      if (!response.ok) throw new Error('Failed to share post');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async trackView(userId: string, postId: string, watchTime: number = 0) {
    return this.trackEvent(userId, postId, 'view', watchTime);
  },

  async trackEvent(userId: string, postId: string, eventType: string, watchTime: number = 0) {
    try {
      const response = await fetch('/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, post_id: postId, event_type: eventType, watch_time: watchTime })
      });
      if (!response.ok) throw new Error('Failed to track event');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },
  async getGroups(userId?: string) {
    try {
      const response = await fetch('/api/groups');
      if (!response.ok) throw new Error('Failed to fetch groups');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async getGroupById(groupId: string) {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) throw new Error('Failed to fetch group');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async createGroup(userId: string, name: string, description: string, privacy: string = 'public', category: string = 'community', image?: string) {
    try {
      const response = await fetch('/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creator_id: userId, name, description, category, privacy, image_url: image })
      });
      if (!response.ok) throw new Error('Failed to create group');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async joinGroup(userId: string, groupId: string, isPrivate = false) {
    try {
      const response = await fetch('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, group_id: groupId, is_private: isPrivate })
      });
      if (!response.ok) throw new Error('Failed to join group');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },

  // --- Pages ---
  async getPages(userId?: string) {
    try {
      const response = await fetch('/api/pages');
      if (!response.ok) throw new Error('Failed to fetch pages');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async getPageById(pageId: string) {
    try {
      const response = await fetch(`/api/pages/${pageId}`);
      if (!response.ok) throw new Error('Failed to fetch page');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async createPage(userId: string, name: string, description: string, category: string, coverUrl?: string, avatarUrl?: string) {
    try {
      const response = await fetch('/api/pages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creator_id: userId, name, description, category, cover_url: coverUrl, avatar_url: avatarUrl })
      });
      if (!response.ok) throw new Error('Failed to create page');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async followPage(userId: string, pageId: string) {
    try {
      const response = await fetch('/api/pages/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, page_id: pageId })
      });
      if (!response.ok) throw new Error('Failed to follow page');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },

  async unfollowPage(userId: string, pageId: string) {
    try {
      const response = await fetch('/api/pages/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, page_id: pageId })
      });
      if (!response.ok) throw new Error('Failed to unfollow page');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },

  // --- Stories ---
  async getStories() {
    try {
      const response = await fetch('/api/stories');
      if (!response.ok) throw new Error('Failed to fetch stories');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async createStory(userId: string, mediaUrl: string, mediaType: 'image' | 'video') {
    try {
      const response = await fetch('/api/stories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, media_url: mediaUrl, media_type: mediaType })
      });
      if (!response.ok) throw new Error('Failed to create story');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  // --- Alerts ---
  async getAlerts() {
    try {
      const response = await fetch('/api/alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async createAlert(userId: string, content: string, type: string = 'info') {
    try {
      const response = await fetch('/api/alerts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, content, type })
      });
      if (!response.ok) throw new Error('Failed to create alert');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  // --- Friends ---
  async getFriends(userId: string) {
    try {
      const response = await fetch(`/api/friends/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch friends');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async getFriendRequests(userId: string) {
    try {
      const response = await fetch(`/api/friends/requests/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch friend requests');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async getFriendSuggestions(userId: string) {
    try {
      const response = await fetch(`/api/users/search?q=`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      return { data: data.filter((u: any) => u.id !== userId), error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async sendFriendRequest(userId: string, friendId: string) {
    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, friend_id: friendId })
      });
      if (!response.ok) throw new Error('Failed to send request');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async acceptFriendRequest(requestId?: string, userId?: string, friendId?: string) {
    try {
      const response = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId })
      });
      if (!response.ok) throw new Error('Failed to accept request');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },

  async rejectFriendRequest(requestId: string) {
    try {
      const response = await fetch('/api/friends/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId })
      });
      if (!response.ok) throw new Error('Failed to reject request');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },

  // --- Notifications ---
  async getNotifications(userId: string) {
    try {
      const response = await fetch(`/api/notifications/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async markNotificationAsRead(userId: string, notificationId: string) {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, notificationId })
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },

  async markAllNotificationsAsRead(userId: string) {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to mark all notifications as read');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },

  async deleteNotification(userId: string, notificationId: string) {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },

  // --- Events ---
  async getEvents() {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },

  async joinEvent(userId: string, eventId: string) {
    try {
      const response = await fetch('/api/events/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, event_id: eventId })
      });
      if (!response.ok) throw new Error('Failed to join event');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }
};
