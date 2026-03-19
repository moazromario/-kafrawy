import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { 
  LayoutGrid, 
  Plus, 
  Settings, 
  MoreHorizontal, 
  Users, 
  MessageSquare,
  Compass,
  Star,
  ChevronRight,
  Globe,
  Lock,
  X,
  ImageIcon,
  Shield,
  Eye,
  Loader2,
  Flag,
  CheckCircle2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";
import { communityService } from "@/src/modules/community/communityService";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";

export default function PagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPage, setNewPage] = useState({
    name: "",
    description: "",
    category: "community",
    cover_url: "",
    avatar_url: ""
  });
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPages();
  }, [user]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await communityService.getPages(user?.id);
      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast.error("فشل تحميل الصفحات");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("يجب تسجيل الدخول لإنشاء صفحة");
    if (!newPage.name || !newPage.description) return toast.error("يرجى ملء البيانات الأساسية");

    setCreating(true);
    try {
      const { data, error } = await communityService.createPage(
        user.id,
        newPage.name,
        newPage.description,
        newPage.category,
        newPage.cover_url || undefined,
        newPage.avatar_url || undefined
      );

      if (error) throw error;

      toast.success("تم إنشاء الصفحة بنجاح!");
      setShowCreateModal(false);
      setNewPage({ name: "", description: "", category: "community", cover_url: "", avatar_url: "" });
      fetchPages();
    } catch (error) {
      console.error("Error creating page:", error);
      toast.error("فشل إنشاء الصفحة");
    } finally {
      setCreating(false);
    }
  };

  const handleFollow = async (e: React.MouseEvent, pageId: string, isFollowing: boolean) => {
    e.stopPropagation();
    if (!user) return toast.error("يجب تسجيل الدخول للمتابعة");
    
    try {
      if (isFollowing) {
        await communityService.unfollowPage(user.id, pageId);
        toast.success("تم إلغاء المتابعة");
      } else {
        await communityService.followPage(user.id, pageId);
        toast.success("تمت المتابعة");
      }
      fetchPages();
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("فشل تحديث حالة المتابعة");
    }
  };

  const yourPages = pages.filter(p => p.creator_id === user?.id);
  const discoverPages = pages.filter(p => p.creator_id !== user?.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CommunityNavbar />
      
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex gap-6 px-4">
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <CommunitySidebar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 py-6 space-y-6 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100">
                <Flag size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">الصفحات</h1>
                <p className="text-sm text-gray-500">اكتشف وتابع الصفحات التي تهمك في كفراوي</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
            >
              <Plus size={18} />
              <span>إنشاء صفحة جديدة</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {['الكل', 'مجتمعية', 'تجارية', 'إخبارية', 'ترفيهية'].map((cat) => (
                <button key={cat} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-gray-100 transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div className="space-y-10">
              {/* Your Pages */}
              {yourPages.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                      <Star size={18} className="text-yellow-500 fill-yellow-500" />
                      صفحاتك
                    </h2>
                    <Link to="#" className="text-xs font-bold text-emerald-600 hover:underline">عرض الكل</Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {yourPages.map((page) => (
                      <PageCard key={page.id} page={page} onFollow={handleFollow} isOwner />
                    ))}
                  </div>
                </section>
              )}

              {/* Discover Pages */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                    <Compass size={18} className="text-emerald-600" />
                    اكتشف صفحات جديدة
                  </h2>
                </div>
                {discoverPages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {discoverPages.map((page) => (
                      <PageCard key={page.id} page={page} onFollow={handleFollow} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <Flag size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">لا توجد صفحات للاكتشاف</h3>
                    <p className="text-gray-500 text-sm mt-1">جرب البحث بكلمات أخرى أو أنشئ صفحتك الخاصة!</p>
                  </div>
                )}
              </section>
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <div className="hidden xl:block">
          <ContactsSidebar />
        </div>
      </div>

      {/* Create Page Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Flag size={20} />
                  </div>
                  <h2 className="text-xl font-bold">إنشاء صفحة جديدة</h2>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreatePage} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 px-1">اسم الصفحة</label>
                  <input 
                    type="text" 
                    required
                    value={newPage.name}
                    onChange={(e) => setNewPage({...newPage, name: e.target.value})}
                    placeholder="مثال: مطعم كفراوي، نادي الحي..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 px-1">الوصف</label>
                  <textarea 
                    required
                    value={newPage.description}
                    onChange={(e) => setNewPage({...newPage, description: e.target.value})}
                    placeholder="ماذا تقدم هذه الصفحة؟"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 px-1">التصنيف</label>
                    <select 
                      value={newPage.category}
                      onChange={(e) => setNewPage({...newPage, category: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    >
                      <option value="community">مجتمعية</option>
                      <option value="business">تجارية</option>
                      <option value="news">إخبارية</option>
                      <option value="entertainment">ترفيهية</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 px-1">رابط صورة الغلاف (اختياري)</label>
                    <input 
                      type="url" 
                      value={newPage.cover_url}
                      onChange={(e) => setNewPage({...newPage, cover_url: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={creating}
                    className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {creating ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                    إنشاء الصفحة الآن
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PageCardProps {
  page: any;
  onFollow: any;
  isOwner?: boolean;
}

const PageCard: React.FC<PageCardProps> = ({ page, onFollow, isOwner }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/community/page/${page.id}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer flex flex-col"
    >
      <div className="h-24 relative">
        <img 
          src={page.cover_url || `https://picsum.photos/seed/${page.id}/400/200`} 
          alt="Cover" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute -bottom-6 right-4 w-12 h-12 rounded-2xl bg-white p-1 shadow-lg">
          <div className="w-full h-full rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
            {page.avatar_url ? (
              <img src={page.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
            ) : (
              page.name[0]
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-8 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors truncate pr-1">
            {page.name}
          </h3>
          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold">
            {page.category === 'business' ? 'تجارية' : 'مجتمعية'}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
          {page.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
            <Users size={12} />
            <span>{page.followers_count || 0} متابع</span>
          </div>
          
          {isOwner ? (
            <button className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors flex items-center gap-1">
              <Settings size={12} />
              إدارة
            </button>
          ) : (
            <button 
              onClick={(e) => onFollow(e, page.id, page.is_following)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                page.is_following 
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                  : "bg-emerald-600 text-white shadow-md shadow-emerald-100 hover:bg-emerald-700"
              }`}
            >
              {page.is_following ? <CheckCircle2 size={12} /> : <Plus size={12} />}
              {page.is_following ? 'متابع' : 'متابعة'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
