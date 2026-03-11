import { useState } from "react";
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
  AlertCircle
} from "lucide-react";
import { cn } from "@/src/utils/cn";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";
import CreatePost from "@/src/components/community/CreatePost";
import PostCard from "@/src/components/community/PostCard";
import { TrustLevel } from "@/src/components/community/Badge";

type TabType = 'trending' | 'neighborhood' | 'market' | 'services' | 'qa' | 'ads';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('trending');
  const [selectedStory, setSelectedStory] = useState<any>(null);

  const tabs = [
    { id: 'trending', label: 'الترند', icon: TrendingUp },
    { id: 'neighborhood', label: 'الحي', icon: MapPin },
    { id: 'market', label: 'السوق', icon: ShoppingBag },
    { id: 'services', label: 'الخدمات', icon: Wrench },
    { id: 'qa', label: 'الأسئلة', icon: HelpCircle },
    { id: 'ads', label: 'الإعلانات', icon: Megaphone },
  ];

  const stories = [
    { id: 1, user: "أحمد", avatar: "A", active: true },
    { id: 2, user: "سارة", avatar: "S", active: true },
    { id: 3, user: "محمود", avatar: "M", active: false },
    { id: 4, user: "ليلى", avatar: "L", active: true },
    { id: 5, user: "ياسين", avatar: "Y", active: false },
  ];

  const posts = [
    {
      id: 1,
      user: { name: "أحمد علي", avatar: "A", trustLevel: "trusted" as TrustLevel },
      content: "يا جماعة حد يعرف مواعيد عيادة دكتور أحمد النهاردة؟",
      time: "منذ 15 دقيقة",
      image: "https://picsum.photos/seed/post1/800/400"
    },
    {
      id: 2,
      user: { name: "سارة محمود", avatar: "S", trustLevel: "expert" as TrustLevel },
      content: "السوق النهاردة في الحي التالت زحمة جداً، الأفضل تدخلوا من شارع الصيدلية.",
      time: "منذ ساعة",
    },
    {
      id: 3,
      user: { name: "محمود حسن", avatar: "M", trustLevel: "verified_merchant" as TrustLevel },
      content: "عرض خاص لأهل كفراوي: لابتوب ديل مستعمل بحالة الزيرو، السعر مفاجأة!",
      time: "منذ ساعتين",
      image: "https://picsum.photos/seed/post3/800/400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <CommunityNavbar />
      
      <div className="max-w-[1600px] mx-auto px-4 flex gap-6">
        {/* Left Sidebar */}
        <CommunitySidebar />

        {/* Main Feed */}
        <main className="flex-1 max-w-[680px] py-6 space-y-6 mx-auto">
          {/* Stories Section */}
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {/* Your Story Card (Facebook Style) */}
            <div className="flex-shrink-0 w-32 h-52 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden relative group cursor-pointer flex flex-col">
              <div className="h-[70%] overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/me/200/400" 
                  alt="Your Story" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="flex-1 relative flex flex-col items-center justify-end pb-3 bg-white">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-600 border-4 border-white flex items-center justify-center text-white shadow-sm">
                  <Plus size={20} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-bold text-gray-900">إنشاء قصة</span>
              </div>
            </div>

            {/* Friend Stories */}
            {stories.map((story) => (
              <div 
                key={story.id} 
                onClick={() => setSelectedStory(story)}
                className="flex-shrink-0 w-32 h-52 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden relative group cursor-pointer"
              >
                <img 
                  src={`https://picsum.photos/seed/story${story.id}/200/400`} 
                  alt={story.user} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                
                {/* User Avatar with Ring */}
                <div className={cn(
                  "absolute top-3 left-3 w-10 h-10 rounded-full p-0.5 border-2",
                  story.active ? "border-emerald-500" : "border-gray-300"
                )}>
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs overflow-hidden">
                      <img 
                        src={`https://picsum.photos/seed/user${story.id}/100/100`} 
                        alt={story.user} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
                
                <span className="absolute bottom-3 right-3 text-[11px] font-bold text-white drop-shadow-md">
                  {story.user}
                </span>
              </div>
            ))}
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
                  <img 
                    src={`https://picsum.photos/seed/story${selectedStory.id}/1080/1920`} 
                    alt={selectedStory.user}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
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
                        src={`https://picsum.photos/seed/user${selectedStory.id}/100/100`} 
                        alt={selectedStory.user}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{selectedStory.user}</h3>
                      <p className="text-white/70 text-[10px]">منذ ساعتين</p>
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
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">مباشر</span>
            </div>
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <AlertCircle size={14} className="text-orange-300" />
                <p className="text-xs font-medium">ازدحام مروري عند مدخل الحي الثاني بسبب أعمال صيانة</p>
              </div>
            </div>
          </section>

          {/* Post Feed with Tabs */}
          <div className="space-y-4">
            <div className="sticky top-14 z-30 bg-gray-100/80 backdrop-blur-md py-2 -mx-4 px-4 border-b border-gray-200 overflow-x-auto no-scrollbar">
              <div className="flex gap-2 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                      activeTab === tab.id 
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
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    index={post.id} 
                    user={post.user}
                    content={post.content}
                    time={post.time}
                    image={post.image}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Right Sidebar */}
        <ContactsSidebar />
      </div>
    </div>
  );
}
