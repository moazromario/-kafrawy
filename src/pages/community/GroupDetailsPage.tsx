import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Users, 
  Globe, 
  Lock, 
  Settings, 
  MoreHorizontal, 
  Search, 
  Plus, 
  Image as ImageIcon, 
  MessageSquare, 
  Share2, 
  Shield,
  Info,
  ChevronLeft,
  Loader2
} from "lucide-react";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";
import PostCard from "@/src/components/community/PostCard";
import CreatePost from "@/src/components/community/CreatePost";
import { communityService } from "@/src/modules/community/communityService";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";

export default function GroupDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGroupDetails();
      fetchGroupPosts();
    }
  }, [id, user]);

  const fetchGroupDetails = async () => {
    try {
      const { data, error } = await communityService.getGroupById(id!);
      if (error) throw error;
      setGroup(data);

      // Check membership
      if (user) {
        const { data: groups } = await communityService.getGroups(user.id);
        const currentGroup = groups?.find(g => g.id === id);
        if (currentGroup) {
          setIsMember(currentGroup.user_membership_status === 'approved');
          setIsAdmin(currentGroup.creator_id === user.id);
        }
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
      toast.error("فشل تحميل بيانات المجموعة");
    }
  };

  const fetchGroupPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await communityService.getPosts(user?.id, 1, 20, id);
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching group posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) return toast.error("يجب تسجيل الدخول للانضمام");
    try {
      const { error } = await communityService.joinGroup(user.id, id!, group.privacy === 'private');
      if (error) throw error;
      toast.success(group.privacy === 'private' ? "تم إرسال طلب الانضمام" : "تم الانضمام للمجموعة");
      fetchGroupDetails();
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("فشل الانضمام للمجموعة");
    }
  };

  if (!group && !loading) return <div className="p-20 text-center">المجموعة غير موجودة</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CommunityNavbar />
      
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex gap-6 px-4">
        <div className="hidden lg:block">
          <CommunitySidebar />
        </div>
        
        <main className="flex-1 py-6 space-y-6 overflow-hidden">
          {loading && !group ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <>
              {/* Group Header */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-48 md:h-64 relative">
                  <img 
                    src={group.cover_url || `https://picsum.photos/seed/${group.id}/1200/400`} 
                    className="w-full h-full object-cover" 
                    alt="Cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Link to="/community/groups" className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors">
                    <ChevronLeft size={20} className="rotate-180" />
                  </Link>
                </div>
                
                <div className="p-6 md:p-8 -mt-12 relative">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex gap-6 items-end">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-1 shadow-xl">
                        <div className="w-full h-full rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-4xl font-bold">
                          {group.name[0]}
                        </div>
                      </div>
                      <div className="pb-2 space-y-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{group.name}</h1>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            {group.privacy === 'public' ? <Globe size={14} /> : <Lock size={14} />}
                            <span>{group.privacy === 'public' ? 'مجموعة عامة' : 'مجموعة خاصة'}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{group.members_count || 0} عضو</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isMember ? (
                        <>
                          <button className="flex-1 md:flex-none px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                            <Users size={18} />
                            <span>عضو</span>
                          </button>
                          <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
                            <Plus size={18} />
                            <span>دعوة</span>
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={handleJoin}
                          className="flex-1 md:flex-none px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                        >
                          <Users size={18} />
                          <span>انضمام للمجموعة</span>
                        </button>
                      )}
                      {isAdmin && (
                        <button className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                          <Settings size={20} />
                        </button>
                      )}
                      <button className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-6 mt-8 border-t border-gray-100 pt-4">
                    {[
                      { id: 'posts', label: 'المنشورات', icon: MessageSquare },
                      { id: 'members', label: 'الأعضاء', icon: Users },
                      { id: 'media', label: 'الوسائط', icon: ImageIcon },
                      { id: 'about', label: 'حول', icon: Info },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-2 border-b-2 transition-all font-bold text-sm ${activeTab === tab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {activeTab === 'posts' && (
                    <>
                      {isMember && (
                        <CreatePost 
                          groupId={id} 
                          onPostCreated={fetchGroupPosts}
                          placeholder={`اكتب شيئاً في ${group.name}...`}
                        />
                      )}
                      
                      {loading ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                        </div>
                      ) : posts.length > 0 ? (
                        <div className="space-y-6">
                          {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <MessageSquare size={32} />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">لا توجد منشورات بعد</h3>
                          <p className="text-gray-500 text-sm mt-1">كن أول من ينشر في هذه المجموعة!</p>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'members' && (
                    <div className="bg-white rounded-3xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">الأعضاء</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Member cards would go here */}
                        <div className="p-4 border border-gray-50 rounded-2xl flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                            {group.creator?.full_name?.[0] || 'A'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{group.creator?.full_name || 'مسؤول المجموعة'}</p>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">مسؤول</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">حول المجموعة</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {group.description}
                    </p>
                    <div className="space-y-3 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Globe size={18} className="text-gray-400" />
                        <div>
                          <p className="font-bold">مجموعة عامة</p>
                          <p className="text-xs text-gray-400">يمكن لأي شخص رؤية من في المجموعة وما ينشرونه.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Shield size={18} className="text-gray-400" />
                        <div>
                          <p className="font-bold">تاريخ الإنشاء</p>
                          <p className="text-xs text-gray-400">{new Date(group.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">المسؤولون</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <img 
                        src={group.creator?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.creator?.full_name || 'Admin')}&background=random`} 
                        className="w-10 h-10 rounded-full object-cover" 
                        alt="Admin" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{group.creator?.full_name || 'مسؤول'}</p>
                        <p className="text-[10px] text-gray-500">منذ البداية</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <div className="hidden xl:block">
          <ContactsSidebar />
        </div>
      </div>
    </div>
  );
}
