import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { 
  LayoutGrid, 
  Search, 
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
  Image as ImageIcon,
  Shield,
  Eye,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";
import { communityService } from "@/src/modules/community/communityService";
import { useAuth } from "@/src/context/AuthContext";

export default function GroupsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    privacy: "public"
  });
  
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const { data, error } = await communityService.getGroups(user?.id);
      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const myGroups = groups.filter(g => g.user_membership_status === 'approved' || g.user_membership_status === 'pending');
  const discoverGroups = groups.filter(g => !g.user_membership_status);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("يجب تسجيل الدخول لإنشاء مجموعة");
    
    setIsSubmitting(true);
    try {
      const { data, error } = await communityService.createGroup(
        user.id,
        newGroup.name,
        newGroup.description,
        newGroup.privacy
      );
      
      if (error) throw error;
      
      setShowCreateModal(false);
      setNewGroup({ name: "", description: "", privacy: "public" });
      fetchGroups(); // Refresh list
    } catch (error) {
      console.error("Error creating group:", error);
      alert("حدث خطأ أثناء إنشاء المجموعة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinGroup = async (groupId: string, privacy: string) => {
    if (!user) return alert("يجب تسجيل الدخول للانضمام");
    try {
      const { error } = await communityService.joinGroup(user.id, groupId, privacy === 'private');
      if (error) throw error;
      fetchGroups(); // Refresh to update status
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const categories = ["الكل", "رياضة", "ثقافة", "عقارات", "طبخ", "عمل", "تعليم"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <CommunityNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CommunityNavbar />
      
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex gap-6 px-4">
        <div className="hidden lg:block">
          <CommunitySidebar />
        </div>
        
        <main className="flex-1 py-6 space-y-8 overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">المجموعات</h1>
              <p className="text-sm text-gray-500">تواصل مع أشخاص يشاركونك نفس الاهتمامات</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings size={20} />
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
              >
                <Plus size={18} />
                <span>إنشاء مجموعة جديدة</span>
              </button>
            </div>
          </div>

          {/* Create Group Modal */}
          <AnimatePresence>
            {showCreateModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-extrabold text-gray-900">إنشاء مجموعة جديدة</h2>
                    <button 
                      onClick={() => setShowCreateModal(false)}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateGroup} className="p-6 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">اسم المجموعة</label>
                      <input
                        required
                        type="text"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                        placeholder="مثلاً: جيران الحي الثالث"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">وصف المجموعة</label>
                      <textarea
                        required
                        rows={3}
                        value={newGroup.description}
                        onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                        placeholder="ما هو هدف هذه المجموعة؟"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-bold text-gray-700">الخصوصية</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setNewGroup({...newGroup, privacy: "public"})}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${newGroup.privacy === "public" ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-emerald-200"}`}
                        >
                          <Globe size={24} />
                          <div>
                            <p className="text-sm font-bold">عامة</p>
                            <p className="text-[10px] opacity-70">يمكن لأي شخص رؤية المنشورات</p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewGroup({...newGroup, privacy: "private"})}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${newGroup.privacy === "private" ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-emerald-200"}`}
                        >
                          <Lock size={24} />
                          <div>
                            <p className="text-sm font-bold">خاصة</p>
                            <p className="text-[10px] opacity-70">فقط الأعضاء يمكنهم رؤية المنشورات</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                      >
                        إنشاء المجموعة
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث عن مجموعات..."
                className="w-full pr-10 pl-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {categories.map((cat, i) => (
                <button 
                  key={i}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-500"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Your Groups Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={20} />
                <h2 className="text-xl font-extrabold text-gray-900">مجموعاتك</h2>
              </div>
              <button className="text-sm font-bold text-emerald-600 hover:underline">عرض الكل</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {myGroups.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  لا توجد مجموعات حالياً. انضم إلى مجموعة أو أنشئ واحدة جديدة!
                </div>
              ) : (
                myGroups.map((group) => (
                  <motion.div 
                    whileHover={{ y: -4 }}
                    key={group.id} 
                    onClick={() => navigate(`/community/group/${group.id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
                  >
                    <div className="h-24 relative">
                      <img src={group.cover_url || `https://picsum.photos/seed/${group.id}/400/200`} className="w-full h-full object-cover" alt={group.name} referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white">
                        {group.privacy === "public" ? <Globe size={12} /> : <Lock size={12} />}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{group.privacy === "public" ? "عامة" : "خاصة"}</span>
                      </div>
                    </div>
                    <div className="p-4 flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl flex-shrink-0">
                        {group.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">{group.name}</h3>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Users size={12} />
                            <span>{group.members_count || 0}</span>
                          </div>
                          {group.user_membership_status === 'pending' && (
                            <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">قيد الانتظار</span>
                          )}
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full">
                        <ChevronRight size={20} className="rotate-180" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Discovery Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="text-emerald-600" size={20} />
                <h2 className="text-xl font-extrabold text-gray-900">اكتشاف مجموعات جديدة</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {discoverGroups.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  لا توجد مجموعات جديدة لاكتشافها حالياً.
                </div>
              ) : (
                discoverGroups.map((group) => (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    key={group.id} 
                    onClick={() => navigate(`/community/group/${group.id}`)}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col cursor-pointer"
                  >
                    <div className="h-32 relative">
                      <img src={group.cover_url || `https://picsum.photos/seed/${group.id}/400/200`} alt="Group" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-emerald-600 shadow-sm">
                        {group.category || "عام"}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{group.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users size={14} />
                          <span>{group.members_count || 0} عضو</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{group.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleJoinGroup(group.id, group.privacy)}
                          className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
                        >
                          انضمام
                        </button>
                        <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all">
                          معاينة
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </main>

        <div className="hidden xl:block">
          <ContactsSidebar />
        </div>
      </div>
    </div>
  );
}
