import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  LayoutGrid, 
  List, 
  ShieldCheck, 
  ChevronLeft,
  MapPin,
  Hammer
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function ProfessionalsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "الكل";
  const { professionals } = useServices();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPros = professionals.filter(pro => 
    (category === "الكل" || pro.specialty === category) &&
    (pro.name.includes(searchQuery) || pro.specialty.includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
            >
              <ArrowRight size={24} />
            </button>
            <h1 className="text-xl font-black text-[#050505]">{category}</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode("grid")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                viewMode === "grid" ? "bg-[#1877F2] text-white shadow-lg shadow-blue-100" : "bg-gray-50 text-gray-400"
              }`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                viewMode === "list" ? "bg-[#1877F2] text-white shadow-lg shadow-blue-100" : "bg-gray-50 text-gray-400"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن فني..."
              className="w-full pr-12 pl-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-inner"
            />
          </div>
          <button 
            onClick={() => navigate("/services/filter")}
            className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 border border-gray-100 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
          >
            <Filter size={24} />
          </button>
        </div>
      </header>

      <main className="p-6">
        {filteredPros.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-2 gap-5" : "space-y-5"}>
            {filteredPros.map((pro) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={pro.id}
                onClick={() => navigate(`/services/profile/${pro.id}`)}
                className={`bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50 cursor-pointer group relative ${
                  viewMode === "list" ? "flex gap-5 p-5" : "p-5 flex flex-col items-center text-center"
                }`}
              >
                <div className={`relative flex-shrink-0 ${viewMode === "grid" ? "w-24 h-24 mb-4" : "w-28 h-28"}`}>
                  <img 
                    src={pro.image} 
                    className="w-full h-full object-cover rounded-[24px] shadow-md group-hover:scale-105 transition-transform duration-500" 
                    alt={pro.name} 
                    referrerPolicy="no-referrer"
                  />
                  {pro.isVerified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <ShieldCheck size={18} className="text-[#1877F2]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className={`flex justify-between items-start ${viewMode === "grid" ? "flex-col items-center" : ""}`}>
                    <div>
                      <h3 className="font-black text-[#050505] group-hover:text-[#1877F2] transition-colors">{pro.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pro.specialty}</p>
                    </div>
                    <div className={`flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg ${viewMode === "grid" ? "mt-2" : ""}`}>
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black text-amber-600">{pro.rating}</span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-4 text-[10px] font-bold text-gray-400 ${viewMode === "grid" ? "justify-center" : ""}`}>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{pro.pricePerHour} ج.م / ساعة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Hammer size={12} />
                      <span>{pro.worksCount} عمل</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span className="line-clamp-1">{pro.location.split("،")[0]}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button className="w-full py-3 bg-gray-50 text-[#1877F2] rounded-xl font-black text-[10px] group-hover:bg-[#1877F2] group-hover:text-white transition-all">عرض الملف الشخصي</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Search size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#050505]">لا توجد نتائج</h3>
              <p className="text-sm text-gray-400">لم نجد أي فنيين يطابقون بحثك في هذا التصنيف.</p>
            </div>
            <button 
              onClick={() => navigate("/services")}
              className="px-10 py-4 bg-[#1877F2] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 active:scale-95 transition-all"
            >
              العودة للرئيسية
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
