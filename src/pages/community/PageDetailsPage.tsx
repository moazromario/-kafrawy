import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  Users, 
  Calendar, 
  Info, 
  Flag, 
  Share2, 
  MoreHorizontal, 
  Plus, 
  CheckCircle2, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Loader2,
  ArrowRight,
  Globe,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import { communityService } from "@/src/modules/community/communityService";
import { useAuth } from "@/src/context/AuthContext";
import PostCard from "@/src/components/community/PostCard";
import CreatePost from "@/src/components/community/CreatePost";
import { toast } from "sonner";

export default function PageDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPageDetails();
      fetchPagePosts();
    }
  }, [id, user]);

  const fetchPageDetails = async () => {
    try {
      const { data, error } = await communityService.getPageById(id!);
      if (error) throw error;
      setPage(data);
      
      // Check if following
      if (user) {
        const { data: followData } = await communityService.getPages(user.id);
        const currentPage = followData?.find(p => p.id === id);
        setIsFollowing(!!currentPage?.is_following);
      }
    } catch (error) {
      console.error("Error fetching page details:", error);
      toast.error("فشل تحميل بيانات الصفحة");
    }
  };

  const fetchPagePosts = async () => {
    try {
      const { data, error } = await communityService.getPosts(undefined, 1, 20, undefined, id);
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching page posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) return toast.error("يجب تسجيل الدخول للمتابعة");
    try {
      if (isFollowing) {
        await communityService.unfollowPage(user.id, id!);
        setIsFollowing(false);
        toast.success("تم إلغاء المتابعة");
      } else {
        await communityService.followPage(user.id, id!);
        setIsFollowing(true);
        toast.success("تمت المتابعة");
      }
      fetchPageDetails();
    } catch (error) {
      toast.error("فشل تحديث حالة المتابعة");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Flag size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">الصفحة غير موجودة</h1>
        <p className="text-gray-500 mt-2">ربما تم حذف الصفحة أو الرابط غير صحيح</p>
        <button 
          onClick={() => navigate('/community/pages')}
          className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold"
        >
          العودة للصفحات
        </button>
      </div>
    );
  }

  const isOwner = user?.id === page.creator_id;

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityNavbar />
      
      <div className="max-w-5xl mx-auto pb-12">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-b-[40px] shadow-lg">
          <img 
            src={page.cover_url || `https://picsum.photos/seed/${page.id}/1200/400`} 
            alt="Cover" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 right-6 p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/30 transition-all"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Page Profile Header */}
        <div className="px-6 -mt-16 relative z-10">
          <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-2xl -mt-20">
                <div className="w-full h-full rounded-[22px] bg-emerald-600 flex items-center justify-center text-white text-4xl font-black overflow-hidden">
                  {page.avatar_url ? (
                    <img src={page.avatar_url} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    page.name[0]
                  )}
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-black text-gray-900">{page.name}</h1>
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {page.category === 'business' ? 'نشاط تجاري' : 'صفحة مجتمعية'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Users size={16} className="text-emerald-600" />
                    <span className="font-bold text-gray-900">{page.followers_count || 0}</span> متابع
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flag size={16} className="text-emerald-600" />
                    أنشئت في {new Date(page.created_at).getFullYear()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {isOwner ? (
                  <button className="flex-1 md:flex-none px-6 py-3 bg-gray-100 text-gray-900 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all">
                    تعديل الصفحة
                  </button>
                ) : (
                  <button 
                    onClick={handleFollow}
                    className={`flex-1 md:flex-none px-8 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      isFollowing 
                        ? "bg-gray-100 text-gray-600 shadow-none" 
                        : "bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700"
                    }`}
                  >
                    {isFollowing ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                    {isFollowing ? 'متابع' : 'متابعة الصفحة'}
                  </button>
                )}
                <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all">
                  <Share2 size={20} />
                </button>
                <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 mt-8 border-t border-gray-50 pt-4 overflow-x-auto no-scrollbar">
              {[
                { id: 'posts', label: 'المنشورات', icon: FileText },
                { id: 'about', label: 'حول', icon: Info },
                { id: 'media', label: 'الوسائط', icon: ImageIcon },
                { id: 'reviews', label: 'التقييمات', icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold transition-all relative whitespace-nowrap ${
                    activeTab === tab.id ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mt-6 px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Info Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-6">
              <h3 className="font-black text-gray-900 flex items-center gap-2">
                <Info size={18} className="text-emerald-600" />
                معلومات الصفحة
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {page.description}
              </p>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Globe size={16} />
                  </div>
                  <span className="text-gray-600 font-medium">www.kafrawi.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Mail size={16} />
                  </div>
                  <span className="text-gray-600 font-medium">contact@page.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Phone size={16} />
                  </div>
                  <span className="text-gray-600 font-medium">+20 123 456 789</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Clock size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-bold">مفتوح الآن</span>
                    <span className="text-[10px] text-gray-400">يغلق الساعة 10:00 م</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-gray-50 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                عرض التفاصيل الكاملة
                <ExternalLink size={14} />
              </button>
            </div>

            {/* Page Admins */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                فريق الإدارة
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                  {page.creator?.avatar_url ? (
                    <img src={page.creator.avatar_url} alt="Admin" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    page.creator?.full_name?.[0] || 'A'
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{page.creator?.full_name || 'مسؤول الصفحة'}</p>
                  <p className="text-[10px] text-gray-400">مؤسس الصفحة</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Posts Feed */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'posts' && (
              <>
                {isOwner && (
                  <CreatePost 
                    groupId={undefined} 
                    pageId={id} 
                    onPostCreated={fetchPagePosts} 
                  />
                )}
                
                <div className="space-y-4">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <FileText size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">لا توجد منشورات بعد</h3>
                      <p className="text-gray-500 text-sm mt-1">كن أول من ينشر في هذه الصفحة!</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'about' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8"
              >
                <section className="space-y-4">
                  <h3 className="text-xl font-black text-gray-900">حول {page.name}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {page.description}
                  </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-50">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">التصنيف</h4>
                    <p className="text-gray-900 font-bold">{page.category === 'business' ? 'نشاط تجاري' : 'صفحة مجتمعية'}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">تاريخ التأسيس</h4>
                    <p className="text-gray-900 font-bold">{new Date(page.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">الموقع</h4>
                    <p className="text-gray-900 font-bold">كفراوي، الحي الثاني</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">الجمهور</h4>
                    <p className="text-gray-900 font-bold">عام</p>
                  </div>
                </section>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
