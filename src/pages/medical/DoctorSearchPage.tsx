import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  ArrowRight, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  Plus, 
  Zap, 
  ShieldCheck,
  Stethoscope,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMedical } from "@/src/context/MedicalContext";

export default function DoctorSearchPage() {
  const navigate = useNavigate();
  const { doctors } = useMedical();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("الكل");
  const [showFilters, setShowFilters] = useState(false);

  const specialties = ["الكل", "جراحة القلب", "طب الأطفال", "طب العيون", "جلدية", "أسنان"];

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = doc.name.includes(searchQuery) || doc.specialty.includes(searchQuery);
      const matchesSpecialty = selectedSpecialty === "الكل" || doc.specialty.includes(selectedSpecialty);
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchQuery, selectedSpecialty]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">البحث عن أطباء</h1>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E90FF] transition-colors" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن طبيب أو تخصص..."
              className="w-full pr-12 pl-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all placeholder:text-gray-400 shadow-inner"
            />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className="w-14 h-14 bg-[#1E90FF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            <Filter size={24} />
          </button>
        </div>

        {/* Specialty Tabs */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-6 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                selectedSpecialty === spec 
                ? "bg-[#1E90FF] text-white shadow-lg shadow-blue-100" 
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">النتائج ({filteredDoctors.length})</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/medical/profile/${doc.id}`)}
                className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex gap-5 group cursor-pointer hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-500"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-md border border-gray-50">
                    <img src={doc.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={doc.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-2 border-white shadow-sm">
                    <ShieldCheck size={12} />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-[#050505]">{doc.name}</h3>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-black text-[#050505]">{doc.rating}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{doc.specialty}</p>
                  
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 pt-1">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-[#1E90FF]" />
                      <span>{doc.experience} سنة خبرة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#1E90FF]" />
                      <span>{doc.location.split('،')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400">سعر الكشف</span>
                      <span className="text-sm font-black text-[#1E90FF]">{doc.price} ج.م</span>
                    </div>
                    <button className="px-6 py-2.5 bg-blue-50 text-[#1E90FF] rounded-xl font-black text-[10px] shadow-sm active:scale-95 transition-all">
                      حجز موعد
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredDoctors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Search size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#050505]">لا توجد نتائج</h3>
              <p className="text-sm text-gray-400">لم نجد أي أطباء يطابقون بحثك. حاول تغيير كلمات البحث أو التصنيف.</p>
            </div>
          </div>
        )}
      </main>

      {/* Filter Modal Placeholder */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full bg-white rounded-t-[48px] p-10 space-y-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-[#050505]">تصفية النتائج</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">الترتيب حسب</h4>
                  <div className="flex flex-wrap gap-3">
                    {["الأعلى تقييماً", "الأقل سعراً", "الأكثر خبرة"].map(f => (
                      <button key={f} className="px-6 py-3 bg-gray-50 rounded-2xl text-xs font-black text-gray-500 hover:bg-blue-50 hover:text-[#1E90FF] transition-all">
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">نوع الكشف</h4>
                  <div className="flex gap-3">
                    {["في العيادة", "مكالمة فيديو"].map(f => (
                      <button key={f} className="flex-1 py-4 bg-gray-50 rounded-2xl text-xs font-black text-gray-500 hover:bg-blue-50 hover:text-[#1E90FF] transition-all">
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowFilters(false)}
                className="w-full py-5 bg-[#1E90FF] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 active:scale-95 transition-all"
              >
                تطبيق الفلاتر
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
