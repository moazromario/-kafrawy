import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { communityService, Post } from '@/src/modules/community/communityService';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CommunityContextType {
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  loadMore: () => Promise<void>;
  addPost: (content: string, mediaUrl?: string, mediaType?: 'image' | 'video', location?: string, feeling?: string) => Promise<void>;
  likePost: (postId: string, reactionType?: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (pageToFetch = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    const { data, error, count } = await communityService.getPosts(user?.id, pageToFetch);
    if (error) {
      setError(error.message);
      toast.error('حدث خطأ أثناء تحميل المنشورات');
    } else {
      const newPosts = data || [];
      setPosts(prev => append ? [...prev, ...newPosts] : newPosts);
      setHasMore(newPosts.length === 10); // Assuming pageSize is 10
    }
    
    if (append) setLoadingMore(false);
    else setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(1, false);

    // Real-time subscription for new posts
    const subscription = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        fetchPosts(1, false); // Refresh to get new posts with profiles
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const refreshPosts = async () => {
    setPage(1);
    await fetchPosts(1, false);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPosts(nextPage, true);
  };

  const addPost = async (content: string, mediaUrl?: string, mediaType?: 'image' | 'video', location?: string, feeling?: string) => {
    if (!user) throw new Error('يجب تسجيل الدخول أولاً للقيام بهذا الإجراء');
    const { error } = await communityService.createPost(user.id, content, mediaUrl, mediaType, location, feeling);
    if (error) {
      toast.error('حدث خطأ أثناء نشر المنشور');
      throw error;
    }
    toast.success('تم نشر المنشور بنجاح');
    await refreshPosts();
  };

  const likePost = async (postId: string, reactionType: string = 'like') => {
    if (!user) throw new Error('يجب تسجيل الدخول أولاً للقيام بهذا الإجراء');
    
    // Find the post to check its current reaction
    const post = posts.find(p => p.id === postId);
    const hasExistingReaction = !!post?.user_reaction;

    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          likes_count: hasExistingReaction ? p.likes_count : p.likes_count + 1,
          user_reaction: reactionType
        };
      }
      return p;
    }));

    const { error } = await communityService.reactToPost(user.id, postId, reactionType);
    if (error) {
      toast.error('حدث خطأ أثناء التفاعل');
      // Rollback
      await refreshPosts();
    }
  };

  const unlikePost = async (postId: string) => {
    if (!user) throw new Error('يجب تسجيل الدخول أولاً للقيام بهذا الإجراء');
    
    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          likes_count: Math.max(0, p.likes_count - 1),
          user_reaction: null
        };
      }
      return p;
    }));

    const { error } = await communityService.removePostReaction(user.id, postId);
    if (error) {
      toast.error('حدث خطأ أثناء إلغاء التفاعل');
      // Rollback
      await refreshPosts();
    }
  };

  return (
    <CommunityContext.Provider value={{ posts, loading, loadingMore, hasMore, error, refreshPosts, loadMore, addPost, likePost, unlikePost }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}
