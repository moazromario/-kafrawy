import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Hospital, 
  Building2, 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  ChevronLeft, 
  ArrowLeft,
  Search,
  Filter,
  Navigation,
  Plus,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MedicalCentersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"hospitals" | "clinics">("hospitals");
  const [searchQuery, setSearchQuery] = useState("");

  const centers = [
    { id: "h1", name: "مستشفى العبور التخصصي", type: "hospital", rating: 4.8, reviews: 1200, location: "الحي الأول", image: "https://picsum.photos/seed/hosp1/400/300", specialty: "متعدد التخصصات" },
    { id: "h2", name: "مركز كفراوي الطبي", type: "hospital", rating: 4.6, reviews: 850, location: "الحي الخامس", image: "https://picsum.photos/seed/hosp2/400/300", specialty: "طوارئ ٢٤ ساعة" },
    { id: "c1", name: "عيادات النور التخصصية", type: "clinic", rating: 4.9, reviews: 450, location: "الحي التاسع", image: "https://picsum.photos/seed/clin1/400/300", specialty: "عيادات خارجية" },
    { id: "c2", name: "مركز الطفل السعيد", type: "clinic", rating: 4.7, reviews: 320, location: "الحي الثاني", image: "https://picsum.photos/seed/clin2/400/300", specialty: "أطفال وحديثي ولادة" },
  ];

  const filteredCenters = centers.filter(c => 
    (activeTab === "hospitals" ? c.type === "hospital" : c.type === "clinic") &&
    c.name.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
            >
              <ArrowRight size={24} />
            </button>
            <h1 className="text-xl font-black text-[#050505]">المراكز الطبية</h1>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab("hospitals")}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "hospitals" ? "bg-white text-[#1E90FF] shadow-sm" : "text-gray-400"
              }`}
            >
              مستشفيات
            </button>
            <button 
              onClick={() => setActiveTab("clinics")}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "clinics" ? "bg-white text-[#1E90FF] shadow-sm" : "text-gray-400"
              }`}
            >
              عيادات
            </button>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E90FF] transition-colors" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مستشفى أو عيادة..."
            className="w-full pr-12 pl-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all placeholder:text-gray-400 shadow-inner"
          />
        </div>
      </header>

      <main className="p-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredCenters.map((center, i) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[48px] shadow-sm border border-gray-50 overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-500"
            >
              <div className="relative h-48">
                <img src={center.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={center.name} referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-lg">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-black text-[#050505]">{center.rating}</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-[#1E90FF] text-white px-4 py-1.5 rounded-2xl text-[10px] font-black shadow-lg">
                  {center.specialty}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#050505]">{center.name}</h3>
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1E90FF]">
                    {center.type === "hospital" ? <Hospital size={20} /> : <Building2 size={20} />}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#1E90FF]" />
                    <span>{center.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-[#1E90FF]" />
                    <span>مفتوح الآن</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 py-4 bg-[#1E90FF] text-white rounded-[24px] font-black text-xs shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Navigation size={16} />
                    <span>الاتجاهات</span>
                  </button>
                  <button className="w-14 h-14 bg-gray-50 text-gray-500 rounded-[24px] flex items-center justify-center shadow-inner border border-gray-100 active:scale-95 transition-all">
                    <Phone size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>
    </div>
  );
}
