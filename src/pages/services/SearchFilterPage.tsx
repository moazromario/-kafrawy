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
  ArrowLeft,
  MapPin,
  Hammer,
  CheckCircle2,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchFilterPage() {
  const navigate = useNavigate();
  const [selectedSpecialty, setSelectedSpecialty] = useState("الكل");
  const [priceRange, setPriceRange] = useState(250);
  const [minRating, setMinRating] = useState(4);
  const [location, setLocation] = useState("مدينة العبور");

  const specialties = ["الكل", "نجارة", "سباكة", "كهرباء", "نقاشة", "تكييف", "نقل عفش"];

  const handleApply = () => {
    navigate(`/services/list?category=${selectedSpecialty}&price=${priceRange}&rating=${minRating}&location=${location}`);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-40">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">فلترة البحث</h1>
        </div>
        <button 
          onClick={() => {
            setSelectedSpecialty("الكل");
            setPriceRange(250);
            setMinRating(4);
            setLocation("مدينة العبور");
          }}
          className="text-xs font-black text-rose-500 bg-rose-50 px-4 py-2 rounded-xl active:scale-95 transition-all"
        >
          إعادة ضبط
        </button>
      </header>

      <main className="p-6 space-y-10">
        {/* Specialty Selection */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">التخصص</h4>
          <div className="flex flex-wrap gap-3">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-6 py-3 rounded-2xl border transition-all text-xs font-black shadow-sm ${
                  selectedSpecialty === spec 
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-xl shadow-blue-100" 
                  : "bg-white text-gray-700 border-gray-50 hover:border-blue-200"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </section>

        {/* Price Range */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">السعر لكل ساعة</h4>
            <span className="text-sm font-black text-[#1877F2]">حتى {priceRange} ج.م</span>
          </div>
          <div className="px-2">
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1877F2]"
            />
            <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-300">
              <span>٥٠ ج.م</span>
              <span>٥٠٠ ج.م</span>
            </div>
          </div>
        </section>

        {/* Min Rating */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">الحد الأدنى للتقييم</h4>
          <div className="flex gap-3">
            {[3, 4, 4.5, 4.8].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                className={`flex-1 p-5 rounded-[28px] border transition-all flex flex-col items-center gap-1 shadow-sm ${
                  minRating === r 
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-xl shadow-blue-100" 
                  : "bg-white text-gray-700 border-gray-50 hover:border-blue-200"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Star size={14} className={minRating === r ? "text-white fill-white" : "text-amber-400 fill-amber-400"} />
                  <span className="text-sm font-black">{r}</span>
                </div>
                <span className="text-[10px] font-bold opacity-60">فأكثر</span>
              </button>
            ))}
          </div>
        </section>

        {/* Location Selection */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">الموقع</h4>
          <div className="relative group">
            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" size={20} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ابحث عن منطقة..."
              className="w-full pr-12 pl-4 py-4 bg-white border border-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-sm"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {["الحي الأول", "الحي الخامس", "الحي التاسع", "العبور الجديدة"].map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={`px-4 py-2 rounded-xl border transition-all text-[10px] font-black ${
                  location === loc 
                  ? "bg-blue-50 text-[#1877F2] border-[#1877F2]" 
                  : "bg-white text-gray-500 border-gray-100"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handleApply}
            className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>تطبيق الفلتر</span>
            <CheckCircle2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
