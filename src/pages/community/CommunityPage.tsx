import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  MapPin, 
  ShoppingBag, 
  Wrench, 
  HelpCircle, 
  Megaphone,
  Plus,
  Zap,
  AlertCircle,
  Loader2,
  Camera,
  X
} from "lucide-react";
import { cn } from "@/src/utils/cn";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";
import CreatePost from "@/src/components/community/CreatePost";
import PostCard from "@/src/components/community/PostCard";
import { TrustLevel } from "@/src/components/community/Badge";
import { useCommunity } from "@/src/context/CommunityContext";
import { useAuth } from "@/src/context/AuthContext";
import { communityService } from "@/src/modules/community/communityService";
import { toast } from "sonner";
import { supabase } from "@/src/lib/supabase";

type TabType = 'for_you' | 'trending' | 'neighborhood' | 'market' | 'services' | 'qa' | 'ads';

export default function CommunityPage() {
  const { user } = useAuth();
  const { 
    posts, 
    loading: postsLoading, 
    loadingMore, 
    hasMore, 
    loadMore,
    activeCategory,
    setActiveCategory
  } = useCommunity();
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showAlertInput, setShowAlertInput] = useState(false);
  const [newAlertContent, setNewAlertContent] = useState("");
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const observerTarget = useRef(null);

  useEffect(() => {
    fetchStories();
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await communityService.getAlerts();
      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const handleAddAlert = async () => {
    if (!user || !newAlertContent.trim()) return;
    
    setIsSubmittingAlert(true);
    try {
      const { error } = await communityService.createAlert(user.id, newAlertContent);
      if (error) throw error;
      setNewAlertContent("");
      setShowAlertInput(false);
      toast.success("تم إضافة التنبيه بنجاح");
      await fetchAlerts();
    } catch (error) {
      console.error("Error creating alert:", error);
      toast.error("فشل إضافة التنبيه");
    } finally {
      setIsSubmittingAlert(false);
    }
  };

  const fetchStories = async () => {
    try {
      const { data, error } = await communityService.getStories();
      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setStoriesLoading(false);
    }
  };

  const handleStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingStory(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `stories/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('community_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('community_media')
        .getPublicUrl(filePath);

      const { error: storyError } = await communityService.createStory(
        user.id,
        publicUrl,
        file.type.startsWith('video') ? 'video' : 'image'
      );

      if (storyError) throw storyError;

      toast.success("تمت إضافة القصة بنجاح!");
      fetchStories();
    } catch (error) {
      console.error("Error uploading story:", error);
      toast.error("فشل رفع القصة");
    } finally {
      setUploadingStory(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadingMore, hasMore, loadMore]);

  const tabs = [
    { id: 'for_you', label: 'لك', icon: Zap },
    { id: 'trending', label: 'الترند', icon: TrendingUp },
    { id: 'neighborhood', label: 'الحي', icon: MapPin },
    { id: 'market', label: 'السوق', icon: ShoppingBag },
    { id: 'services', label: 'الخدمات', icon: Wrench },
    { id: 'qa', label: 'الأسئلة', icon: HelpCircle },
    { id: 'ads', label: 'الإعلانات', icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <CommunityNavbar />
      
      <div className="max-w-[1600px] mx-auto px-4 flex gap-6">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <CommunitySidebar />
        </div>

        {/* Main Feed */}
        <main className="flex-1 max-w-[680px] py-6 space-y-6 mx-auto w-full">
          {/* Stories Section */}
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {/* Your Story Card */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 w-32 h-52 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden relative group cursor-pointer flex flex-col"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,video/*"
                onChange={handleStoryUpload}
              />
              <div className="h-[70%] overflow-hidden bg-gray-100 flex items-center justify-center">
                {uploadingStory ? (
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                ) : (
                  <img 
                    src={user?.user_metadata?.avatar_url || "https://picsum.photos/seed/me/200/400"} 
                    alt="Your Story" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                )}
              </div>
              <div className="flex-1 relative flex flex-col items-center justify-end pb-3 bg-white">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-600 border-4 border-white flex items-center justify-center text-white shadow-sm">
                  <Plus size={20} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold text-gray-900">إنشاء قصة</span>
              </div>
            </div>

            {/* Friend Stories */}
            {storiesLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="flex-shrink-0 w-32 h-52 rounded-2xl bg-gray-200 animate-pulse" />
              ))
            ) : (
              stories.map((story) => (
                <div 
                  key={story.id} 
                  onClick={() => setSelectedStory(story)}
                  className="flex-shrink-0 w-32 h-52 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden relative group cursor-pointer"
                >
                  {story.media_type === 'video' ? (
                    <video 
                      src={story.media_url} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={story.media_url} 
                      alt={story.profiles?.full_name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      referrerPolicy="no-referrer" 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                  
                  {/* User Avatar with Ring */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full p-0.5 border-2 border-emerald-500">
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                      <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs overflow-hidden">
                        <img 
                          src={story.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${story.profiles?.full_name}`} 
                          alt={story.profiles?.full_name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <span className="absolute bottom-3 right-3 text-[11px] font-bold text-white drop-shadow-md truncate max-w-[80%]">
                    {story.profiles?.full_name}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Story Viewer Modal */}
          <AnimatePresence>
            {selectedStory && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4"
              >
                <button 
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-6 right-6 text-white hover:bg-white/10 p-2 rounded-full transition-colors z-10"
                >
                  <Plus size={32} className="rotate-45" />
                </button>

                <div className="relative w-full max-w-[450px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl">
                  {selectedStory.media_type === 'video' ? (
                    <video 
                      src={selectedStory.media_url} 
                      autoPlay 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={selectedStory.media_url} 
                      alt={selectedStory.profiles?.full_name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  
                  {/* Progress Bar */}
                  <div className="absolute top-4 left-4 right-4 flex gap-1">
                    <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        onAnimationComplete={() => setSelectedStory(null)}
                        className="h-full bg-white"
                      />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="absolute top-8 left-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src={selectedStory.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${selectedStory.profiles?.full_name}`} 
                        alt={selectedStory.profiles?.full_name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{selectedStory.profiles?.full_name}</h3>
                      <p className="text-white/70 text-[10px]">منذ {new Date(selectedStory.created_at).getHours()} ساعة</p>
                    </div>
                  </div>

                  {/* Bottom Interaction */}
                  <div className="absolute bottom-6 left-4 right-4 flex items-center gap-4">
                    <input 
                      type="text" 
                      placeholder={`رد على ${selectedStory.user}...`}
                      className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-white text-sm placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
                    />
                    <div className="flex gap-4">
                      <button className="text-white hover:scale-110 transition-transform">❤️</button>
                      <button className="text-white hover:scale-110 transition-transform">🔥</button>
                      <button className="text-white hover:scale-110 transition-transform">😮</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Post */}
          <CreatePost />

          {/* What's Happening Now - Real-time Alerts (Part of Feed) */}
          <section className="bg-emerald-600 rounded-2xl p-4 text-white shadow-lg shadow-emerald-100 overflow-hidden relative">
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-yellow-300 fill-yellow-300" />
                <h2 className="font-bold text-sm">ماذا يحدث الآن في كفراوي</h2>
              </div>
              <button 
                onClick={() => setShowAlertInput(!showAlertInput)}
                className="text-[10px] bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                {showAlertInput ? "إلغاء" : "إضافة بلاغ"}
              </button>
            </div>

            <AnimatePresence>
              {showAlertInput && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-3 relative z-10 overflow-hidden"
                >
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newAlertContent}
                      onChange={(e) => setNewAlertContent(e.target.value)}
                      placeholder="ماذا يحدث؟ (مثلاً: ازدحام عند المدخل)"
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-white/40"
                    />
                    <button 
                      onClick={handleAddAlert}
                      disabled={isSubmittingAlert || !newAlertContent.trim()}
                      className="bg-white text-emerald-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors disabled:opacity-50"
                    >
                      {isSubmittingAlert ? <Loader2 size={14} className="animate-spin" /> : "نشر"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2 relative z-10">
              {alerts.length === 0 ? (
                <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                  <AlertCircle size={14} className="text-white/70" />
                  <p className="text-xs font-medium opacity-70">لا توجد تنبيهات حالياً</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <motion.div 
                    key={alert.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-3 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10"
                  >
                    <AlertCircle size={14} className={alert.type === 'warning' ? 'text-orange-300' : 'text-yellow-300'} />
                    <p className="text-xs font-medium">{alert.content}</p>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Post Feed with Tabs */}
          <div className="space-y-4">
            <div className="sticky top-14 z-30 bg-gray-100/80 backdrop-blur-md py-2 -mx-4 px-4 border-b border-gray-200 overflow-x-auto no-scrollbar">
              <div className="flex gap-2 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                      activeCategory === tab.id 
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" 
                        : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
                    )}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {postsLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                    <p className="text-gray-400 font-bold">لا توجد منشورات حالياً</p>
                  </div>
                ) : (
                  <>
                    {posts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post}
                      />
                    ))}
                    <div ref={observerTarget} className="h-4" />
                    {loadingMore && (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Right Sidebar - Hidden on mobile */}
        <div className="hidden xl:block">
          <ContactsSidebar />
        </div>
      </div>
    </div>
  );
}
