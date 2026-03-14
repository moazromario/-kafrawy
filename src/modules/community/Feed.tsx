import React, { useState } from "react";
import { motion } from "motion/react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Send } from "lucide-react";
import { useCommunity } from "@/src/context/CommunityContext";
import { useAuth } from "@/src/context/AuthContext";

export default function Feed() {
  const { posts, loading, addPost, likePost, unlikePost } = useCommunity();
  const { user, profile } = useAuth();
  const [newPostContent, setNewPostContent] = useState("");
  const [posting, setPosting] = useState(false);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user) return;

    setPosting(true);
    try {
      await addPost(newPostContent);
      setNewPostContent("");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء النشر');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      alert('يجب تسجيل الدخول للإعجاب بالمنشورات');
      return;
    }

    try {
      // For simplicity in this component, we'll just toggle like
      // In a real app, we'd check if the user already liked it
      await likePost(postId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      {user && (
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                <img src={profile?.avatar_url || "https://picsum.photos/seed/me/100/100"} alt="Me" />
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="ماذا يدور في ذهنك؟"
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#1877F2] outline-none resize-none h-24"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <button type="button" className="flex items-center gap-2 text-gray-500 hover:text-[#1877F2] transition-colors">
                <ImageIcon size={20} />
                <span className="text-xs font-bold">صورة/فيديو</span>
              </button>
              <button
                type="submit"
                disabled={!newPostContent.trim() || posting}
                className="px-6 py-2.5 bg-[#1877F2] text-white rounded-xl font-black text-xs shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center gap-2"
              >
                <span>{posting ? 'جاري النشر...' : 'نشر'}</span>
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#1877F2] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm bg-gray-100">
                    <img src={post.profiles?.avatar_url || `https://picsum.photos/seed/${post.id}/100/100`} alt="" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#050505]">{post.profiles?.full_name || "مستخدم كفراوي"}</h4>
                    <p className="text-[10px] font-bold text-gray-400">{new Date(post.created_at).toLocaleDateString('ar-EG')}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="px-4 pb-3">
                <p className="text-sm font-bold text-gray-700 leading-relaxed">{post.content}</p>
              </div>

              {post.media_url && (
                <div className="relative h-64 bg-gray-100">
                  <img src={post.media_url} className="w-full h-full object-cover" alt="" />
                </div>
              )}

              <div className="p-4 flex items-center justify-between border-t border-gray-50">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-all group"
                  >
                    <div className="p-2 rounded-lg group-hover:bg-red-50 transition-all">
                      <Heart size={20} className={post.likes_count > 0 ? "fill-red-500 text-red-500" : ""} />
                    </div>
                    <span className="text-xs font-black">{post.likes_count}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-all group">
                    <div className="p-2 rounded-lg group-hover:bg-blue-50 transition-all">
                      <MessageCircle size={20} />
                    </div>
                    <span className="text-xs font-black">{post.comments_count}</span>
                  </button>
                </div>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-500 transition-all group">
                  <div className="p-2 rounded-lg group-hover:bg-emerald-50 transition-all">
                    <Share2 size={20} />
                  </div>
                  <span className="text-xs font-black">مشاركة</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
