import { motion } from "motion/react";
import { 
  Search, 
  TrendingUp, 
  Users, 
  Flag, 
  Calendar, 
  MapPin, 
  Hash,
  ChevronRight,
  ArrowRight,
  Star,
  Zap,
  Megaphone
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";
import { communityService } from "@/src/modules/community/communityService";
import { toast } from "sonner";

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingTags, setTrendingTags] = useState(['كفراوي', 'الحي_الثاني', 'سوق_الجمعة', 'خدمات_مصر', 'رمضان_كريم']);
  const [suggestedGroups, setSuggestedGroups] = useState<any[]>([]);
  const [suggestedPages, setSuggestedPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const [groupsRes, pagesRes] = await Promise.all([
        communityService.getGroups(),
        communityService.getPages()
      ]);
      setSuggestedGroups(groupsRes.data?.slice(0, 3) || []);
      setSuggestedPages(pagesRes.data?.slice(0, 3) || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CommunityNavbar />
      
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex gap-6 px-4">
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <CommunitySidebar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 py-6 space-y-8 max-w-[800px] mx-auto w-full">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-gray-900">استكشف كفراوي</h1>
          </div>

          {/* Trending Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <TrendingUp size={20} className="text-emerald-600" />
              <h2 className="text-xl font-black text-gray-900">الأكثر تداولاً</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <button 
                  key={tag}
                  className="px-4 py-2 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-2"
                >
                  <Hash size={14} />
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suggested Groups */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Users size={18} className="text-blue-500" />
                  مجموعات مقترحة
                </h2>
                <Link to="/community/groups" className="text-xs font-bold text-emerald-600 hover:underline">عرض الكل</Link>
              </div>
              <div className="space-y-3">
                {suggestedGroups.map((group) => (
                  <Link 
                    key={group.id} 
                    to={`/community/group/${group.id}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                      {group.cover_url ? (
                        <img src={group.cover_url} alt={group.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        group.name[0]
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">{group.name}</p>
                      <p className="text-[10px] text-gray-400">{group.members_count || 0} عضو</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Suggested Pages */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Flag size={18} className="text-orange-500" />
                  صفحات قد تهمك
                </h2>
                <Link to="/community/pages" className="text-xs font-bold text-emerald-600 hover:underline">عرض الكل</Link>
              </div>
              <div className="space-y-3">
                {suggestedPages.map((page) => (
                  <Link 
                    key={page.id} 
                    to={`/community/page/${page.id}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold overflow-hidden">
                      {page.avatar_url ? (
                        <img src={page.avatar_url} alt={page.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        page.name[0]
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">{page.name}</p>
                      <p className="text-[10px] text-gray-400">{page.followers_count || 0} متابع</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Discovery Categories */}
          <section className="space-y-4">
            <h2 className="text-lg font-black text-gray-900 px-2">اكتشف حسب الفئة</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'أخبار الحي', icon: Megaphone, color: 'bg-red-50 text-red-600' },
                { label: 'خدمات منزلية', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
                { label: 'فعاليات قادمة', icon: Calendar, color: 'bg-emerald-50 text-emerald-600' },
                { label: 'أماكن قريبة', icon: MapPin, color: 'bg-blue-50 text-blue-600' },
              ].map((cat) => (
                <button 
                  key={cat.label}
                  className="flex flex-col items-center gap-3 p-6 bg-white rounded-[32px] border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.color}`}>
                    <cat.icon size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{cat.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Featured Content */}
          <section className="bg-emerald-600 rounded-[40px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-300 fill-yellow-300" />
                <span className="text-xs font-black uppercase tracking-widest opacity-80">مميز هذا الأسبوع</span>
              </div>
              <h2 className="text-3xl font-black leading-tight">انضم إلى مبادرة "كفراوي نظيفة"</h2>
              <p className="text-emerald-50 opacity-90 text-sm max-w-md">
                شارك جيرانك في حملة تجميل الحي الثاني يوم الجمعة القادم. كن جزءاً من التغيير!
              </p>
              <button className="px-8 py-3 bg-white text-emerald-600 rounded-2xl font-black text-sm shadow-xl hover:bg-emerald-50 transition-all flex items-center gap-2">
                انضم الآن
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        </main>

        {/* Right Sidebar */}
        <div className="hidden xl:block">
          <ContactsSidebar />
        </div>
      </div>
    </div>
  );
}
