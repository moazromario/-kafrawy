import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";
import { authService } from "@/src/modules/auth/authService";
import { communityService } from "@/src/modules/community/communityService";
import { toast } from "sonner";
import { 
  UserPlus, 
  MessageCircle, 
  UserCheck, 
  MoreHorizontal, 
  Camera, 
  Grid, 
  Image as ImageIcon, 
  Video, 
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Settings,
  Menu,
  Zap,
  Play,
  Clock,
  Search,
  Shield,
  Loader2
} from "lucide-react";
import CreatePost from "@/src/components/community/CreatePost";
import PostCard from "@/src/components/community/PostCard";
import { TrustLevel } from "@/src/components/community/Badge";
import { cn } from "@/src/utils/cn";

type ProfileTab = 'posts' | 'photos' | 'videos' | 'friends';

export default function ProfilePage() {
  const { user: authUser, profile: authProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate("/login");
    }
  }, [authUser, authLoading, navigate]);

  useEffect(() => {
    if (authUser) {
      fetchProfileData(1, false);
      fetchFriends();
    }
  }, [authUser]);

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
  }, [loadingMore, hasMore]);

  const fetchProfileData = async (pageToFetch = 1, append = false) => {
    if (!authUser) return;
    if (append) setLoadingMore(true);
    else setLoading(true);
    
    try {
      const { data, error } = await communityService.getPosts(authUser.id, pageToFetch);
      
      if (error) {
        console.error("Error fetching posts:", error);
        toast.error('حدث خطأ أثناء تحميل المنشورات');
      } else if (data) {
        const userPosts = data.filter(p => p.user_id === authUser.id);
        setPosts(prev => append ? [...prev, ...userPosts] : userPosts);
        setHasMore(data.length === 10);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error('حدث خطأ غير متوقع');
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  };

  const fetchFriends = async () => {
    if (!authUser) return;
    try {
      const { data } = await communityService.getFriends(authUser.id);
      if (data) setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchProfileData(nextPage, true);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }
  
  if (!authUser) return null;

  const user = {
    name: authProfile?.full_name || authUser.email?.split('@')[0] || "مستخدم كفراوي",
    avatar: authProfile?.avatar_url || "https://picsum.photos/seed/user1/400/400",
    cover: "https://picsum.photos/seed/cover/1200/400",
    bio: authProfile?.bio || "مهتم بكل ما يخص حي كفراوي والخدمات المجتمعية. 🏠✨",
    location: authProfile?.location || "الحي الثالث، كفراوي",
    work: authProfile?.work || "مهندس برمجيات",
    education: authProfile?.education || "جامعة القاهرة",
    friendsCount: friends.length,
    mutualFriends: 0
  };

  const tabs = [
    { id: 'posts', label: 'المنشورات', icon: Grid },
    { id: 'photos', label: 'الصور', icon: ImageIcon },
    { id: 'videos', label: 'الفيديوهات', icon: Video },
    { id: 'friends', label: 'الأصدقاء', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1100px] mx-auto">
          {/* Cover Image */}
          <div className="relative h-[200px] md:h-[350px] bg-gray-200 rounded-b-2xl overflow-hidden group">
            <img 
              src={user.cover} 
              alt="Cover" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button className="absolute bottom-4 left-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-all flex items-center gap-2 text-sm font-bold">
              <Camera size={18} />
              <span className="hidden md:inline">تعديل صورة الغلاف</span>
            </button>
          </div>

          {/* Profile Info Area */}
          <div className="px-4 pb-4">
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-4 -mt-12 md:-mt-16 mb-4">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-emerald-100 border-4 border-white shadow-lg flex items-center justify-center text-emerald-600 text-5xl font-bold overflow-hidden">
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button className="absolute bottom-2 left-2 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full shadow-md transition-all border-2 border-white">
                  <Camera size={18} />
                </button>
              </div>

              {/* Name & Stats */}
              <div className="flex-1 text-center md:text-right pb-2 md:pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500 font-bold text-sm mt-1">{user.friendsCount} صديق • {user.mutualFriends} صديق مشترك</p>
                
                {/* Mutual Friends Avatars */}
                <div className="flex items-center justify-center md:justify-start -space-x-2 mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/friend${i}/100/100`} 
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      alt="Friend"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full md:w-auto pb-2">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all">
                  <UserPlus size={18} />
                  <span>إضافة صديق</span>
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-gray-100 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">
                  <MessageCircle size={18} />
                  <span>مراسلة</span>
                </button>
                <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={cn(
                    "flex items-center justify-center p-2 rounded-xl transition-all",
                    isFollowing ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {isFollowing ? <UserCheck size={20} /> : <UserPlus size={20} />}
                </button>
                <button className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all">
                  <MoreHorizontal size={20} />
                </button>
                <Link to="/admin" className="p-2 bg-[#1877F2]/10 text-[#1877F2] rounded-xl hover:bg-[#1877F2]/20 transition-all flex items-center gap-2 px-4">
                  <Shield size={18} />
                  <span className="text-sm font-bold">لوحة الأدمن</span>
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-center md:justify-start gap-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ProfileTab)}
                    className={cn(
                      "flex items-center gap-2 pb-4 text-sm font-bold transition-all border-b-4 whitespace-nowrap",
                      activeTab === tab.id 
                        ? "border-emerald-600 text-emerald-600" 
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1100px] mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Intro */}
          <div className="lg:w-[400px] space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">المعلومات الشخصية</h2>
              <p className="text-sm text-gray-700 text-center py-2">{user.bio}</p>
              
              <div className="space-y-3">
                <InfoItem icon={Briefcase} text={`يعمل كـ ${user.work}`} />
                <InfoItem icon={GraduationCap} text={`درس في ${user.education}`} />
                <InfoItem icon={MapPin} text={`يسكن في ${user.location}`} />
                <InfoItem icon={Heart} text="أعزب" />
              </div>

              <button className="w-full py-2 bg-gray-100 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all">
                تعديل التفاصيل العامة
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">الصور</h2>
                <button className="text-sm text-emerald-600 font-bold hover:underline">عرض الكل</button>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/photo${i}/200/200`} 
                    className="aspect-square rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    alt="User photo"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">الأصدقاء</h2>
                <button className="text-sm text-emerald-600 font-bold hover:underline">عرض الكل</button>
              </div>
              <p className="text-xs text-gray-500 mb-4">{user.friendsCount} صديق</p>
              <div className="grid grid-cols-3 gap-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="space-y-1 cursor-pointer group">
                    <img 
                      src={`https://picsum.photos/seed/friend-grid${i}/200/200`} 
                      className="aspect-square rounded-lg object-cover group-hover:opacity-90 transition-opacity"
                      alt="Friend"
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-[10px] font-bold text-gray-900 truncate">صديق {i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Feed/Content */}
          <div className="flex-1 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'posts' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Create Post */}
                  <CreatePost />

                  {/* Post Filters Bar */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">المنشورات</h2>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold transition-all">
                        <Settings size={16} />
                        <span>إدارة المنشورات</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold transition-all">
                        <Menu size={16} />
                        <span>عرض القائمة</span>
                      </button>
                    </div>
                  </div>

                  {/* Feed Content */}
                  <div className="space-y-4">
                    {posts.length > 0 ? (
                      <>
                        {posts.map((post) => (
                          <PostCard key={post.id} post={post} />
                        ))}
                        <div ref={observerTarget} className="h-4" />
                        {loadingMore && (
                          <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Grid className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد منشورات بعد</h3>
                        <p className="text-gray-500 text-sm">شارك أفكارك وصورك مع مجتمع كفراوي.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'photos' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h2 className="text-xl font-bold text-gray-900">الصور</h2>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold whitespace-nowrap">صورك</button>
                      <button className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-xl text-sm font-bold whitespace-nowrap">صور تمت الإشارة إليك فيها</button>
                      <button className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-xl text-sm font-bold whitespace-nowrap">الألبومات</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[...Array(16)].map((_, i) => (
                      <div 
                        key={i} 
                        className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <img 
                          src={`https://picsum.photos/seed/all-photo${i}/600/600`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt="Gallery"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex gap-2">
                            <button className="p-2 bg-white/90 rounded-full text-gray-900 hover:bg-white shadow-lg">
                              <Heart size={16} />
                            </button>
                            <button className="p-2 bg-white/90 rounded-full text-gray-900 hover:bg-white shadow-lg">
                              <MessageCircle size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">الألبومات</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {[
                        { title: "يوميات كفراوي", count: 24, seed: "album1" },
                        { title: "الرحلات", count: 12, seed: "album2" },
                        { title: "صور العائلة", count: 45, seed: "album3" },
                        { title: "المناسبات", count: 8, seed: "album4" },
                      ].map((album, i) => (
                        <div key={i} className="space-y-2 cursor-pointer group">
                          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border-4 border-white shadow-sm group-hover:shadow-md transition-all">
                            <img 
                              src={`https://picsum.photos/seed/${album.seed}/400/400`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              alt={album.title}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">{album.title}</h4>
                            <p className="text-xs text-gray-500">{album.count} صورة</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'videos' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h2 className="text-xl font-bold text-gray-900">الفيديوهات</h2>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold whitespace-nowrap">فيديوهاتك</button>
                      <button className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-xl text-sm font-bold whitespace-nowrap">Reels</button>
                      <button className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-xl text-sm font-bold whitespace-nowrap">البث المباشر</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { title: "جولة في الحي الثالث", views: "1.2K", duration: "03:45", seed: "v1" },
                      { title: "افتتاح الحديقة الجديدة", views: "850", duration: "01:20", seed: "v2" },
                      { title: "نصائح لسكان كفراوي", views: "2.4K", duration: "05:10", seed: "v3" },
                      { title: "فعاليات يوم اليتيم", views: "3.1K", duration: "10:30", seed: "v4" },
                    ].map((video, i) => (
                      <div key={i} className="group cursor-pointer space-y-3">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-all">
                          <img 
                            src={`https://picsum.photos/seed/${video.seed}/800/450`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt={video.title}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-emerald-600 shadow-xl transform group-hover:scale-110 transition-transform">
                              <Play size={24} fill="currentColor" className="ml-1" />
                            </div>
                          </div>
                          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-bold flex items-center gap-1">
                            <Clock size={10} />
                            <span>{video.duration}</span>
                          </div>
                        </div>
                        <div className="px-1">
                          <h3 className="font-bold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors line-clamp-1">{video.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>{video.views} مشاهدة</span>
                            <span>•</span>
                            <span>منذ ٣ أيام</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'friends' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">الأصدقاء</h2>
                      <p className="text-xs text-gray-500 mt-1">{user.friendsCount} صديق</p>
                    </div>
                    
                    <div className="flex flex-1 max-w-md gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          placeholder="بحث عن صديق..."
                          className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                      <Link 
                        to="/community/friends/requests"
                        className="text-emerald-600 font-bold text-sm hover:underline whitespace-nowrap"
                      >
                        طلبات الصداقة
                      </Link>
                    </div>
                  </div>

                  <div className="flex gap-4 border-b border-gray-100 mb-6 overflow-x-auto no-scrollbar">
                    <button className="pb-3 text-sm font-bold text-emerald-600 border-b-2 border-emerald-600 whitespace-nowrap">الكل</button>
                    <button className="pb-3 text-sm font-bold text-gray-500 hover:text-gray-700 whitespace-nowrap">المضافون حديثاً</button>
                    <button className="pb-3 text-sm font-bold text-gray-500 hover:text-gray-700 whitespace-nowrap">أصدقاء مشتركين</button>
                    <button className="pb-3 text-sm font-bold text-gray-500 hover:text-gray-700 whitespace-nowrap">من كفراوي</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {friends.length > 0 ? (
                      friends.map((friend) => (
                        <div key={friend.id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-all group">
                          <div className="relative">
                            <img 
                              src={friend.profiles?.avatar_url || `https://picsum.photos/seed/${friend.id}/150/150`} 
                              className="w-20 h-20 rounded-2xl object-cover shadow-sm"
                              alt="Friend"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-emerald-600 transition-colors">{friend.profiles?.full_name || "مستخدم"}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">صديق</p>
                            
                            <div className="flex gap-2 mt-3">
                              <Link to="/community/messages" className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1">
                                <MessageCircle size={14} />
                                <span>مراسلة</span>
                              </Link>
                              <button className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-white rounded-2xl p-8 text-center border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">لا يوجد أصدقاء بعد</h3>
                        <p className="text-gray-500 text-sm">ابحث عن أصدقاء وتواصل معهم في مجتمع كفراوي.</p>
                      </div>
                    )}
                  </div>

                  <button className="w-full mt-8 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all">
                    عرض المزيد من الأصدقاء
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-600">
      <Icon size={18} className="text-gray-400" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
