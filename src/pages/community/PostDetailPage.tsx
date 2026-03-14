import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Loader2
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

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { likePost, unlikePost } = useCommunity();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPostDetails();

    // Subscribe to comments
    const subscription = supabase
      .channel(`public:comments:post_id=eq.${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${id}` }, () => {
        fetchComments();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id, user?.id]);

  const fetchPostDetails = async () => {
    setLoading(true);
    try {
      // Fetch post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .eq('id', id)
        .single();
      
      if (postError) throw postError;

      let userReaction = null;
      if (user && postData) {
        const { data: likeData } = await supabase
          .from('post_likes')
          .select('reaction_type')
          .eq('user_id', user.id)
          .eq('post_id', postData.id)
          .maybeSingle();
        
        if (likeData) {
          userReaction = likeData.reaction_type;
        }
      }

      setPost({ ...postData, user_reaction: userReaction });
      setReaction(userReaction);

      // Fetch comments
      await fetchComments();
    } catch (err) {
      console.error("Error fetching post details:", err);
    } finally {
      setLoading(false);
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
      await communityService.addComment(user.id, id, commentText);
      setCommentText("");
      // Optimistically update comments count on post
      if (post) {
        setPost({ ...post, comments_count: post.comments_count + 1 });
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("حدث خطأ أثناء إضافة التعليق");
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
    if (!post) return;
    try {
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
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold overflow-hidden">
                  {post.profiles?.avatar_url ? (
                    <img src={post.profiles.avatar_url} alt={post.profiles.full_name} className="w-full h-full object-cover" />
                  ) : (
                    post.profiles?.full_name?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-900">{post.profiles?.full_name || 'مستخدم'}</h3>
                    <Badge level="trusted" />
                    {post.feeling && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        يشعر بـ <span className="font-bold">{post.feeling}</span> <Smile size={12} className="text-yellow-500" />
                      </span>
                    )}
                    {post.location && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        في <span className="font-bold">{post.location}</span> <MapPin size={12} className="text-orange-500" />
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
              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Content */}
            {post.content && (
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>
            )}

            {post.media_url && (
              <div className="relative aspect-video bg-gray-100">
                {post.media_type === 'video' ? (
                  <video 
                    src={post.media_url} 
                    controls 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={post.media_url} 
                    alt="Post content" 
                    className="w-full h-full object-cover"
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
                className="flex-1 flex items-center justify-center gap-2 p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Share2 size={20} />
                <span className="text-xs font-bold">مشاركة</span>
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
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm flex-shrink-0 overflow-hidden">
                          {c.profiles?.avatar_url ? (
                            <img src={c.profiles.avatar_url} alt={c.profiles.full_name} className="w-full h-full object-cover" />
                          ) : (
                            c.profiles?.full_name?.charAt(0) || 'U'
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 p-4 rounded-2xl rounded-tr-none border border-gray-100">
                            <h5 className="text-sm font-bold text-gray-900 mb-1">{c.profiles?.full_name || 'مستخدم'}</h5>
                            <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
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
