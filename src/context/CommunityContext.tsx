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
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  refreshPosts: () => Promise<void>;
  loadMore: () => Promise<void>;
  addPost: (content: string, mediaUrl?: string, category?: string, city?: string) => Promise<void>;
  likePost: (postId: string, reactionType?: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
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
  const [activeCategory, setActiveCategory] = useState('for_you');

  const fetchPosts = async (pageToFetch = 1, append = false, category = activeCategory) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      let result;
      if (category === 'for_you') {
        if (user?.id) {
          result = await communityService.getSmartFeed(user.id);
          setHasMore(false); 
        } else {
          result = await communityService.getPosts(undefined, pageToFetch, 10, undefined, undefined, 'trending');
          setHasMore(result.data ? result.data.length === 10 : false);
        }
      } else {
        result = await communityService.getPosts(user?.id, pageToFetch, 10, undefined, undefined, category);
        setHasMore(result.data ? result.data.length === 10 : false);
      }

      const { data, error } = result;
      if (error) {
        setError(error.message);
        toast.error('حدث خطأ أثناء تحميل المنشورات');
      } else {
        const newPosts = data || [];
        setPosts(prev => append ? [...prev, ...newPosts] : newPosts);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('حدث خطأ أثناء تحميل المنشورات');
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(1, false, activeCategory);
  }, [user?.id, activeCategory]);

  useEffect(() => {
    // Real-time subscription for new posts (Supabase)
    // Note: This might not trigger if only SQLite is updated, but we'll keep it for now
    const subscription = supabase
      .channel('feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, async (payload) => {
        // Fetch the full post with profile to ensure it looks good in the UI
        const { data: newPost } = await communityService.getPostById(payload.new.id, user?.id);
        if (newPost) {
          setPosts(prev => {
            if (prev.some(p => p.id === newPost.id)) return prev;
            return [newPost as Post, ...prev];
          });
        }
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

  const addPost = async (content: string, mediaUrl?: string, category?: string, city?: string) => {
    if (!user) throw new Error('يجب تسجيل الدخول أولاً للقيام بهذا الإجراء');
    const { data, error } = await communityService.createPost(user.id, content, mediaUrl, category, city);
    if (error) {
      toast.error('حدث خطأ أثناء نشر المنشور');
      throw error;
    }
    toast.success('تم نشر المنشور بنجاح');
    await refreshPosts();
    return data;
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

    const { error, liked } = await communityService.toggleLike(user.id, postId, reactionType);
    if (error) {
      toast.error('حدث خطأ أثناء التفاعل');
      // Rollback
      await refreshPosts();
    } else {
      communityService.trackEvent(user.id, postId, liked ? 'like' : 'unlike');
    }
  };

  const unlikePost = async (postId: string) => {
    // We can now just use likePost with the toggle logic or keep it separate
    // For consistency with the existing UI, let's keep it but call toggleLike
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

    const { error, liked } = await communityService.toggleLike(user.id, postId);
    if (error) {
      toast.error('حدث خطأ أثناء إلغاء التفاعل');
      // Rollback
      await refreshPosts();
    } else {
      communityService.trackEvent(user.id, postId, liked ? 'like' : 'unlike');
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) throw new Error('يجب تسجيل الدخول أولاً للقيام بهذا الإجراء');
    
    const { error } = await communityService.deletePost(postId);
    if (error) {
      toast.error('حدث خطأ أثناء حذف المنشور');
      throw error;
    }
    
    communityService.trackEvent(user.id, postId, 'delete');
    setPosts(prev => prev.filter(p => p.id !== postId));
    toast.success('تم حذف المنشور بنجاح');
  };

  const deleteComment = async (commentId: string) => {
    if (!user) throw new Error('يجب تسجيل الدخول أولاً للقيام بهذا الإجراء');
    
    const { error } = await communityService.deleteComment(commentId);
    if (error) {
      toast.error('حدث خطأ أثناء حذف التعليق');
      throw error;
    }
    
    communityService.trackEvent(user.id, commentId, 'delete_comment');
    toast.success('تم حذف التعليق بنجاح');
  };

  return (
    <CommunityContext.Provider value={{ 
      posts, 
      loading, 
      loadingMore, 
      hasMore, 
      error, 
      activeCategory,
      setActiveCategory,
      refreshPosts, 
      loadMore, 
      addPost, 
      likePost, 
      unlikePost,
      deletePost,
      deleteComment
    }}>
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
