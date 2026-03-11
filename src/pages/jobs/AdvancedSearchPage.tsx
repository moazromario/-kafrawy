import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Search, 
  Filter, 
  X, 
  Check, 
  ChevronDown, 
  Briefcase, 
  MapPin, 
  Clock, 
  Zap, 
  Star, 
  LayoutGrid, 
  List as ListIcon,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "@/src/context/JobsContext";
import { cn } from "@/src/utils/cn";

const FILTER_OPTIONS = {
  type: ["دوام كامل", "دوام جزئي", "عن بعد", "تدريب"],
  experience: ["مبتدئ", "متوسط", "خبير"],
  salary: ["أقل من ٥٠٠٠", "٥٠٠٠ - ١٠٠٠٠", "أكثر من ١٠٠٠٠"],
};

export default function AdvancedSearchPage() {
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.includes(searchQuery) || job.company.includes(searchQuery);
    const matchesType = selectedFilters.length === 0 || selectedFilters.includes(job.type);
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">البحث المتقدم</h1>
        </div>

        <div className="relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن وظيفة، شركة، أو تخصص..." 
            className="w-full pr-12 pl-12 py-4 bg-gray-100 border-none rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-inner"
          />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all",
              showFilters ? "bg-[#1877F2] text-white" : "bg-white text-gray-400 shadow-sm"
            )}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="overflow-x-auto no-scrollbar flex gap-2 px-2">
          {selectedFilters.map((filter) => (
            <button 
              key={filter}
              onClick={() => toggleFilter(filter)}
              className="px-4 py-2 bg-blue-50 text-[#1877F2] rounded-full text-[10px] font-black flex items-center gap-2 whitespace-nowrap"
            >
              <span>{filter}</span>
              <X size={12} />
            </button>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-xl mx-auto">
        {/* Filter Modal / Overlay */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-[40px] shadow-xl border border-gray-50 overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-[#050505] uppercase tracking-widest">نوع العقد</h3>
                  <div className="flex flex-wrap gap-3">
                    {FILTER_OPTIONS.type.map((type) => (
                      <button 
                        key={type}
                        onClick={() => toggleFilter(type)}
                        className={cn(
                          "px-6 py-3 rounded-2xl text-xs font-black transition-all",
                          selectedFilters.includes(type) ? "bg-[#1877F2] text-white shadow-lg shadow-blue-100" : "bg-gray-50 text-gray-400"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-[#050505] uppercase tracking-widest">مستوى الخبرة</h3>
                  <div className="flex flex-wrap gap-3">
                    {FILTER_OPTIONS.experience.map((exp) => (
                      <button 
                        key={exp}
                        onClick={() => toggleFilter(exp)}
                        className={cn(
                          "px-6 py-3 rounded-2xl text-xs font-black transition-all",
                          selectedFilters.includes(exp) ? "bg-[#1877F2] text-white shadow-lg shadow-blue-100" : "bg-gray-50 text-gray-400"
                        )}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 active:scale-95 transition-all"
                >
                  تطبيق الفلاتر
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-[#050505]">النتائج ({filteredJobs.length})</h2>
            <div className="flex gap-2">
              <button className="p-2 text-[#1877F2]"><ListIcon size={20} /></button>
              <button className="p-2 text-gray-300"><LayoutGrid size={20} /></button>
            </div>
          </div>

          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/jobs/details/${job.id}`)}
              className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex items-center justify-between group cursor-pointer hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-500"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                  <img src={job.companyLogo} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#050505] group-hover:text-[#1877F2] transition-colors">{job.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 mb-1">{job.company} • {job.type}</p>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#1877F2]" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-[#1877F2]" />
                      <span>{job.postedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-black text-emerald-600">{job.salary || "غير محدد"}</span>
                <button className="px-4 py-2 bg-blue-50 text-[#1877F2] rounded-xl font-black text-[10px] opacity-0 group-hover:opacity-100 transition-all">
                  عرض
                </button>
              </div>
            </motion.div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                <Search size={64} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#050505]">لا توجد نتائج</h3>
                <p className="text-sm text-gray-400">حاول تغيير كلمات البحث أو الفلاتر المختارة.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
