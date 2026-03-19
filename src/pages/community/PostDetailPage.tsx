import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowRight, 
  MoreHorizontal, 
  Globe, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Heart, 
  Laugh, 
  Meh,
  Send,
  Image,
  Smile,
  MapPin,
  Loader2,
  Trash2,
  Flag,
  MoreVertical
} from "lucide-react";
import { Badge, TrustLevel } from "@/src/components/community/Badge";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";
import { cn } from "@/src/utils/cn";
import { useCommunity } from "@/src/context/CommunityContext";
import { useAuth } from "@/src/context/AuthContext";
import { communityService, Post, Comment } from "@/src/modules/community/communityService";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { likePost, unlikePost, deletePost, deleteComment } = useCommunity();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const viewStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (user && id) {
      viewStartTimeRef.current = Date.now();
      
      return () => {
        if (viewStartTimeRef.current) {
          const watchTime = (Date.now() - viewStartTimeRef.current) / 1000;
          if (watchTime > 0.5) {
            communityService.trackView(user.id, id, watchTime);
          }
        }
      };
    }
  }, [user?.id, id]);

  useEffect(() => {
    if (!id) return;
    fetchPostDetails();
  }, [id, user?.id]);

  const fetchPostDetails = async () => {
    setLoading(true);
    try {
      const { data: postData, error: postError } = await communityService.getPostById(id, user?.id);
      
      if (postError || !postData) throw postError || new Error('Post not found');

      setPost(postData);
      setReaction(postData.user_reaction);

      // Fetch comments
      await fetchComments();
    } catch (err) {
      console.error("Error fetching post details:", err);
      toast.error("فشل تحميل تفاصيل المنشور");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;
    
    setIsDeletingPost(true);
    try {
      await deletePost(post.id);
      toast.success('تم حذف المنشور بنجاح');
      navigate('/community');
    } catch (err) {
      console.error(err);
      toast.error('فشل حذف المنشور');
    } finally {
      setIsDeletingPost(false);
      setShowPostMenu(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;
    
    setDeletingCommentId(commentId);
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success('تم حذف التعليق');
    } catch (err) {
      console.error(err);
      toast.error('فشل حذف التعليق');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    const { data, error } = await communityService.getComments(id);
    if (!error && data) {
      setComments(data);
    }
  };

  const handleAddComment = async () => {
    if (!user || !id || !commentText.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await communityService.addComment(user.id, id, commentText);
      if (error) throw error;
      
      communityService.trackEvent(user.id, id, 'comment');
      setCommentText("");
      // Optimistically update comments count on post
      if (post) {
        setPost({ ...post, comments_count: post.comments_count + 1 });
      }
      // Fetch comments again to show the new comment
      await fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("حدث خطأ أثناء إضافة التعليق");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (reactionKey: string) => {
    if (!user || !post) {
      alert('يجب تسجيل الدخول للتفاعل مع المنشورات');
      return;
    }

    try {
      if (reaction === reactionKey) {
        await unlikePost(post.id);
        setReaction(null);
        setPost({ ...post, likes_count: Math.max(0, post.likes_count - 1), user_reaction: null });
      } else {
        const hasExistingReaction = !!reaction;
        await likePost(post.id, reactionKey);
        setReaction(reactionKey);
        setPost({ 
          ...post, 
          likes_count: hasExistingReaction ? post.likes_count : post.likes_count + 1,
          user_reaction: reactionKey
        });
      }
      setShowReactions(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء التفاعل');
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      if (user && id) {
        await communityService.sharePost(user.id, id);
      }
      if (navigator.share) {
        await navigator.share({
          title: 'منشور من مجتمع كفراوي',
          text: post.content,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ رابط المنشور');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const reactions = [
    { icon: ThumbsUp, label: "إعجاب", color: "text-blue-500", key: "like" },
    { icon: Heart, label: "حب", color: "text-red-500", key: "love" },
    { icon: Laugh, label: "ضحك", color: "text-yellow-500", key: "haha" },
    { icon: Meh, label: "دهشة", color: "text-yellow-600", key: "wow" },
  ];

  const currentReaction = reactions.find(r => r.key === reaction) || reactions[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">المنشور غير موجود</h2>
        <button onClick={() => navigate(-1)} className="text-emerald-600 hover:underline">العودة</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CommunityNavbar />
      
      <div className="max-w-[1600px] mx-auto px-4 flex gap-6">
        <CommunitySidebar />

        <main className="flex-1 max-w-[680px] py-6 space-y-4 mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors mb-2"
          >
            <ArrowRight size={20} />
            <span className="text-sm font-bold">العودة</span>
          </button>

          {/* Post Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link 
                  to={`/profile/${post.user_id}`}
                  className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold overflow-hidden hover:opacity-80 transition-opacity"
                >
                  {post.profiles?.avatar_url ? (
                    <img src={post.profiles.avatar_url} alt={post.profiles.full_name} className="w-full h-full object-cover" />
                  ) : (
                    post.profiles?.full_name?.charAt(0) || 'U'
                  )}
                </Link>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link to={`/profile/${post.user_id}`}>
                      <h3 className="text-sm font-bold text-gray-900 hover:text-emerald-600 transition-colors">
                        {post.profiles?.full_name || 'مستخدم'}
                      </h3>
                    </Link>
                    <Badge level="trusted" />
                    {post.city && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        في <span className="font-bold">{post.city}</span> <MapPin size={12} className="text-orange-500" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                    <span>{new Date(post.created_at).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <Globe size={10} />
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowPostMenu(!showPostMenu)}
                  className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <MoreHorizontal size={20} />
                </button>

                {showPostMenu && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                    {user?.id === post.user_id ? (
                      <button 
                        onClick={handleDeletePost}
                        disabled={isDeletingPost}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                        <span>{isDeletingPost ? 'جاري الحذف...' : 'حذف المنشور'}</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          toast.info('تم إرسال البلاغ، شكراً لمساعدتنا في الحفاظ على المجتمع');
                          setShowPostMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Flag size={16} />
                        <span>إبلاغ عن المنشور</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            {post.content && (
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>
            )}

            {post.media_url && (
              <div className="relative bg-gray-100 flex justify-center items-center overflow-hidden max-h-[70vh]">
                {post.media_url.endsWith('.mp4') || post.media_url.includes('video') ? (
                  <video 
                    src={post.media_url} 
                    controls 
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <img 
                    src={post.media_url} 
                    alt="Post content" 
                    className="max-w-full max-h-[70vh] object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            )}

            {/* Stats */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white border border-white">
                    <ThumbsUp size={8} fill="currentColor" />
                  </div>
                </div>
                <span className="text-[10px] text-gray-500">{post.likes_count} إعجاب</span>
              </div>
              <div className="flex gap-3 text-[10px] text-gray-500">
                <span>{post.comments_count} تعليق</span>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="px-2 py-1 flex items-center justify-around border-b border-gray-50 relative">
              <div 
                className="flex-1"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                <button 
                  className={cn(
                    "w-full flex items-center justify-center gap-2 p-2 rounded-xl transition-colors",
                    reaction ? currentReaction.color : "text-gray-500 hover:bg-gray-50"
                  )}
                  onClick={() => handleReaction(reaction ? reaction : 'like')}
                >
                  <currentReaction.icon size={20} fill={reaction ? "currentColor" : "none"} />
                  <span className="text-xs font-bold">{reaction ? currentReaction.label : "إعجاب"}</span>
                </button>

                {/* Floating Reactions */}
                {showReactions && (
                  <div className="absolute bottom-full left-4 bg-white rounded-full shadow-xl border border-gray-100 p-1 flex gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200 z-10">
                    {reactions.map((r) => (
                      <button
                        key={r.key}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-transform hover:scale-125"
                        onClick={() => handleReaction(r.key)}
                      >
                        <r.icon size={24} className={r.color} fill="currentColor" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="flex-1 flex items-center justify-center gap-2 p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
                <MessageCircle size={20} />
                <span className="text-xs font-bold">تعليق</span>
              </button>
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className="flex-1 flex items-center justify-center gap-2 p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50"
              >
                <Share2 size={20} />
                <span className="text-xs font-bold">{isSharing ? 'جاري المشاركة...' : 'مشاركة'}</span>
              </button>
            </div>

            {/* Comments List */}
            <div className="p-4">
              <h4 className="text-sm font-bold text-gray-900 mb-6">التعليقات</h4>
              
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">لا توجد تعليقات بعد. كن أول من يعلق!</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="space-y-3">
                      <div className="flex gap-3">
                        <Link 
                          to={`/profile/${c.user_id}`}
                          className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity"
                        >
                          {c.profiles?.avatar_url ? (
                            <img src={c.profiles.avatar_url} alt={c.profiles.full_name} className="w-full h-full object-cover" />
                          ) : (
                            c.profiles?.full_name?.charAt(0) || 'U'
                          )}
                        </Link>
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <div className="bg-gray-50 p-4 rounded-2xl rounded-tr-none border border-gray-100 flex-1">
                              <Link to={`/profile/${c.user_id}`}>
                                <h5 className="text-sm font-bold text-gray-900 mb-1 hover:text-emerald-600 transition-colors">
                                  {c.profiles?.full_name || 'مستخدم'}
                                </h5>
                              </Link>
                              <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                            </div>
                            
                            {user?.id === c.user_id && (
                              <button 
                                onClick={() => handleDeleteComment(c.id)}
                                disabled={deletingCommentId === c.id}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-6 mt-2 px-2">
                            <button className="text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors">رد</button>
                            <button className="text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors">إعجاب</button>
                            <span className="text-[10px] text-gray-400 mr-auto">
                              {new Date(c.created_at).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-gray-50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs flex-shrink-0 overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  placeholder={user ? "اكتب تعليقاً..." : "سجل الدخول للتعليق"}
                  disabled={!user || submitting}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-xs outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                />
              </div>
              <button 
                onClick={handleAddComment}
                disabled={!commentText.trim() || !user || submitting}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  commentText.trim() && user && !submitting ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-300"
                )}
              >
                {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </div>
        </main>

        <ContactsSidebar />
      </div>
    </div>
  );
}
