import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Bell, 
  User, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Star, 
  Zap, 
  Filter, 
  ArrowRight,
  Plus,
  Heart,
  LayoutGrid,
  Home,
  List as ListIcon,
  Building2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useJobs } from "@/src/context/JobsContext";
import { cn } from "@/src/utils/cn";

const CATEGORIES = [
  { id: "all", name: "الكل", icon: LayoutGrid },
  { id: "it", name: "IT", icon: Zap },
  { id: "marketing", name: "تسويق", icon: TrendingUp },
  { id: "accounting", name: "محاسبة", icon: Briefcase },
  { id: "services", name: "خدمات عامة", icon: Star },
];

export default function JobsHomePage() {
  const navigate = useNavigate();
  const { jobs, searchJobs, savedJobs, saveJob } = useJobs();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchJobs(searchQuery);
  };

  const filteredJobs = activeCategory === "all" 
    ? jobs 
    : jobs.filter(j => j.category.toLowerCase() === activeCategory.toLowerCase());

  const featuredJobs = filteredJobs.filter(j => j.isFeatured);
  const recentJobs = filteredJobs.filter(j => !j.isFeatured);

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
            K
          </button>
          <div>
            <h1 className="text-lg font-black text-[#050505] leading-tight">وظائف كفراوي</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">فرصتك القادمة هنا</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/jobs/notifications")} className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
              ٢
            </span>
          </button>
          <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm hover:border-[#1877F2] transition-all">
            <img src="https://picsum.photos/seed/me/100/100" className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-6 space-y-8">
        {/* Search Bar */}
        <section className="relative group">
          <form onSubmit={handleSearch}>
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن وظيفة، شركة، أو تخصص..." 
              className="w-full pr-12 pl-12 py-4 bg-white border-none rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-sm"
            />
          </form>
          <button onClick={() => navigate("/jobs/search")} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-[#1877F2] transition-all">
            <Filter size={20} />
          </button>
        </section>

        {/* Categories */}
        <section className="overflow-x-auto no-scrollbar flex gap-3 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-6 py-3 rounded-2xl flex items-center gap-2 whitespace-nowrap transition-all text-xs font-black",
                activeCategory === cat.id 
                ? "bg-[#1877F2] text-white shadow-lg shadow-blue-100" 
                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-50"
              )}
            >
              <cat.icon size={16} />
              <span>{cat.name}</span>
            </button>
          ))}
        </section>

        {/* Featured Jobs Carousel */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-[#050505]">وظائف مميزة</h2>
            <Link to="/jobs/list" className="text-xs font-black text-[#1877F2] flex items-center gap-1">
              عرض الكل <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto no-scrollbar flex gap-4 pb-4">
            {featuredJobs.map((job) => (
              <motion.div
                key={job.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/jobs/details/${job.id}`)}
                className="min-w-[280px] bg-[#1877F2] p-6 rounded-[32px] text-white shadow-xl shadow-blue-100 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl p-2 backdrop-blur-md">
                      <img src={job.companyLogo} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">مميز</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black leading-tight">{job.title}</h3>
                    <p className="text-xs font-bold text-white/70">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-white/80">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{job.postedAt}</span>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-sm font-black">{job.salary}</span>
                    <button className="px-4 py-2 bg-white text-[#1877F2] rounded-xl font-black text-[10px] shadow-lg active:scale-95 transition-all">
                      قدم الآن
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate("/jobs/dashboard")} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 text-[#1877F2] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all">
              <Briefcase size={24} />
            </div>
            <div className="text-right">
              <h4 className="text-sm font-black text-[#050505]">طلباتي</h4>
              <p className="text-[10px] font-bold text-gray-400">متابعة حالة التقديم</p>
            </div>
          </button>
          <button onClick={() => navigate("/jobs/employer")} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all">
              <Building2 size={24} />
            </div>
            <div className="text-right">
              <h4 className="text-sm font-black text-[#050505]">للشركات</h4>
              <p className="text-[10px] font-bold text-gray-400">لوحة تحكم التوظيف</p>
            </div>
          </button>
        </section>

        {/* Recent Jobs */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-[#050505]">أحدث الوظائف</h2>
            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:text-[#1877F2] transition-all"><ListIcon size={20} /></button>
              <button className="p-2 text-gray-400 hover:text-[#1877F2] transition-all"><LayoutGrid size={20} /></button>
            </div>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <motion.div
                key={job.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/jobs/details/${job.id}`)}
                className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-all">
                    <img src={job.companyLogo} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#050505] group-hover:text-[#1877F2] transition-colors">{job.title}</h4>
                    <p className="text-[10px] font-bold text-gray-400 mb-1">{job.company} • {job.type}</p>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{job.postedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      saveJob(job.id);
                    }}
                    className={cn(
                      "p-2 transition-all",
                      savedJobs.includes(job.id) ? "text-red-500" : "text-gray-300 hover:text-red-500"
                    )}
                  >
                    <Heart size={18} fill={savedJobs.includes(job.id) ? "currentColor" : "none"} />
                  </button>
                  <span className="text-xs font-black text-emerald-600">{job.salary || "غير محدد"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav Placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-8 py-4 flex items-center justify-between z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {[
          { icon: Home, label: "الرئيسية", path: "/" },
          { icon: Briefcase, label: "الوظائف", active: true },
          { icon: TrendingUp, label: "المجتمع", path: "/community" },
          { icon: User, label: "حسابي", path: "/profile" },
        ].map((item, i) => (
          <button key={i} onClick={() => item.path && navigate(item.path)} className={cn(
            "flex flex-col items-center gap-1 transition-all",
            item.active ? "text-[#1877F2] scale-110" : "text-gray-400 hover:text-gray-600"
          )}>
            <item.icon size={22} strokeWidth={item.active ? 2.5 : 2} />
            <span className="text-[10px] font-black">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
