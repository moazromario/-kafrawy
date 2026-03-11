import { useState } from "react";
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
  Smile
} from "lucide-react";
import { Badge, TrustLevel } from "@/src/components/community/Badge";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";
import { cn } from "@/src/utils/cn";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  // Mock data for the post
  const post = {
    id: id,
    user: { 
      name: "أحمد علي", 
      avatar: "A", 
      trustLevel: "trusted" as TrustLevel 
    },
    content: "يا جماعة حد يعرف مواعيد عيادة دكتور أحمد النهاردة؟ كنت محتاج أحجز ضروري.",
    time: "منذ 15 دقيقة",
    image: "https://picsum.photos/seed/post1/800/400",
    likes: 25,
    commentsCount: 12,
    shares: 3
  };

  const comments = [
    { id: 1, user: "سارة محمود", avatar: "S", content: "العيادة بتفتح من الساعة 6 مساءً لـ 10 مساءً.", time: "منذ 5 دقائق", likes: 2 },
    { id: 2, user: "محمود حسن", avatar: "M", content: "ممكن تتصل بيهم تحجز بالتليفون أسهل.", time: "منذ دقيقتين", likes: 0 },
  ];

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
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                  {post.user.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{post.user.name}</h3>
                    <Badge level={post.user.trustLevel} />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                    <span>{post.time}</span>
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
            <div className="px-4 pb-3">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {post.image && (
              <div className="relative aspect-video bg-gray-100">
                <img 
                  src={post.image} 
                  alt="Post content" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Stats */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white border border-white">
                    <ThumbsUp size={8} fill="currentColor" />
                  </div>
                  <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white border border-white">
                    <Heart size={8} fill="currentColor" />
                  </div>
                </div>
                <span className="text-[10px] text-gray-500">{post.likes} إعجاب</span>
              </div>
              <div className="flex gap-3 text-[10px] text-gray-500">
                <span>{post.commentsCount} تعليق</span>
                <span>{post.shares} مشاركة</span>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="px-2 py-1 flex items-center justify-around border-b border-gray-50">
              <button className="flex-1 flex items-center justify-center gap-2 p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
                <ThumbsUp size={20} />
                <span className="text-xs font-bold">إعجاب</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
                <MessageCircle size={20} />
                <span className="text-xs font-bold">تعليق</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
                <Share2 size={20} />
                <span className="text-xs font-bold">مشاركة</span>
              </button>
            </div>

            {/* Comments List */}
            <div className="p-4">
              <h4 className="text-sm font-bold text-gray-900 mb-6">التعليقات</h4>
              
              <div className="space-y-6">
                {comments.map((c) => (
                  <div key={c.id} className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm flex-shrink-0">
                        {c.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 p-4 rounded-2xl rounded-tr-none border border-gray-100">
                          <h5 className="text-sm font-bold text-gray-900 mb-1">{c.user}</h5>
                          <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                        </div>
                        <div className="flex items-center gap-6 mt-2 px-2">
                          <button className="text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors">رد</button>
                          <button className="text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors">إعجاب</button>
                          <span className="text-[10px] text-gray-400 mr-auto">{c.time}</span>
                          {c.likes > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 bg-white shadow-sm border border-gray-100 px-2 py-0.5 rounded-full">
                              <ThumbsUp size={12} className="text-blue-500" fill="currentColor" />
                              <span>{c.likes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-100 pt-3" />
                  </div>
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-gray-50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs flex-shrink-0">
                M
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="اكتب تعليقاً..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
                  <button className="hover:text-emerald-600"><Smile size={16} /></button>
                  <button className="hover:text-emerald-600"><Image size={16} /></button>
                </div>
              </div>
              <button 
                disabled={!comment.trim()}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  comment.trim() ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-300"
                )}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </main>

        <ContactsSidebar />
      </div>
    </div>
  );
}
