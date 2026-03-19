import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  MoreHorizontal, 
  Globe, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Heart, 
  Laugh, 
  Meh,
  MapPin,
  Smile,
  Trash2,
  Flag
} from "lucide-react";
import { Badge, TrustLevel } from "./Badge";
import { cn } from "@/src/utils/cn";
import { toast } from "sonner";

import { Post, communityService } from "@/src/modules/community/communityService";
import { useCommunity } from "@/src/context/CommunityContext";
import { useAuth } from "@/src/context/AuthContext";

interface PostCardProps {
  post: Post;
  key?: string | number;
}

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { likePost, unlikePost, deletePost } = useCommunity();
  const [showReactions, setShowReactions] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [reaction, setReaction] = useState<string | null>(post.user_reaction || null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const viewStartTimeRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !post.id) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start tracking view time
            viewStartTimeRef.current = Date.now();
          } else if (viewStartTimeRef.current) {
            // Post left view, calculate watch time and track
            const watchTime = (Date.now() - viewStartTimeRef.current) / 1000;
            if (watchTime > 0.5) { // Only track if viewed for more than 0.5s
              communityService.trackView(user.id, post.id, watchTime);
            }
            viewStartTimeRef.current = null;
          }
        });
      },
      { threshold: 0.5 } // 50% of the card must be visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (viewStartTimeRef.current && user) {
        const watchTime = (Date.now() - viewStartTimeRef.current) / 1000;
        if (watchTime > 0.5) {
          communityService.trackView(user.id, post.id, watchTime);
        }
      }
      observer.disconnect();
    };
  }, [user?.id, post.id]);

  useEffect(() => {
    setReaction(post.user_reaction || null);
  }, [post.user_reaction]);

  const handlePostClick = () => {
    navigate(`/community/post/${post.id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;
    
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      toast.success('تم حذف المنشور بنجاح');
    } catch (err) {
      console.error(err);
      toast.error('فشل حذف المنشور');
    } finally {
      setIsDeleting(false);
      setShowMoreMenu(false);
    }
  };

  const handleReaction = async (reactionKey: string) => {
    if (!user) {
      alert('يجب تسجيل الدخول للتفاعل مع المنشورات');
      return;
    }

    try {
      if (reaction === reactionKey) {
        await unlikePost(post.id);
        setReaction(null);
      } else {
        await likePost(post.id, reactionKey);
        setReaction(reactionKey);
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
      if (user) {
        await communityService.sharePost(user.id, post.id);
      }
      if (navigator.share) {
        await navigator.share({
          title: 'منشور من مجتمع كفراوي',
          text: post.content,
          url: `${window.location.origin}/community/post/${post.id}`,
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/community/post/${post.id}`);
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

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4"
    >
      {/* Post Header */}
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
              {post.category && post.category !== 'trending' && (
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                  {post.category === 'neighborhood' ? 'الحي' : 
                   post.category === 'market' ? 'السوق' : 
                   post.category === 'services' ? 'الخدمات' : 
                   post.category === 'qa' ? 'الأسئلة' : 
                   post.category === 'ads' ? 'الإعلانات' : post.category}
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
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>

          {showMoreMenu && (
            <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
              {user?.id === post.user_id ? (
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>{isDeleting ? 'جاري الحذف...' : 'حذف المنشور'}</span>
                </button>
              ) : (
                <button 
                  onClick={() => {
                    toast.info('تم إرسال البلاغ، شكراً لمساعدتنا في الحفاظ على المجتمع');
                    setShowMoreMenu(false);
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

      {/* Post Content */}
      {post.content && (
        <div className="px-4 pb-3 cursor-pointer" onClick={handlePostClick}>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>
      )}

      {post.media_url && (
        <div className="relative bg-gray-100 cursor-pointer flex justify-center items-center overflow-hidden max-h-[70vh]" onClick={handlePostClick}>
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
          <span className="cursor-pointer hover:underline" onClick={handlePostClick}>{post.comments_count} تعليق</span>
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="px-2 py-1 flex items-center justify-around relative">
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

        <button 
          onClick={handlePostClick}
          className="flex-1 flex items-center justify-center gap-2 p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
        >
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
    </div>
  );
}
