import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  Navigation, 
  Search, 
  Star, 
  ShieldCheck, 
  ChevronLeft, 
  ArrowLeft,
  Hammer,
  Phone,
  MessageSquare,
  X,
  Maximize2,
  ZoomIn,
  ZoomOut,
  LocateFixed
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function ServicesMapPage() {
  const navigate = useNavigate();
  const { professionals } = useServices();
  const [selectedPro, setSelectedPro] = useState<typeof professionals[0] | null>(null);

  return (
    <div className="min-h-screen bg-[#F0F2F5] relative overflow-hidden">
      {/* Map Background (Placeholder) */}
      <div className="absolute inset-0 bg-blue-50">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#1877F2 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        
        {/* User Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-100/50 rounded-full animate-ping absolute -inset-0" />
            <div className="relative w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-[#1877F2] border-4 border-white">
              <div className="w-10 h-10 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white">
                <Navigation size={24} className="rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Pins */}
        {professionals.map((pro, i) => (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2 }}
            key={pro.id}
            onClick={() => setSelectedPro(pro)}
            className={`absolute transition-all ${
              i === 0 ? "top-1/3 left-1/4" : 
              i === 1 ? "bottom-1/3 right-1/4" : 
              "top-1/4 right-1/3"
            }`}
          >
            <div className={`relative group ${selectedPro?.id === pro.id ? "z-20 scale-125" : "z-10"}`}>
              <div className={`w-14 h-14 rounded-2xl overflow-hidden border-4 shadow-xl transition-all ${
                selectedPro?.id === pro.id ? "border-[#1877F2]" : "border-white"
              }`}>
                <img src={pro.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Hammer size={12} className="text-[#1877F2]" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Header Overlays */}
      <div className="absolute top-12 left-6 right-6 flex items-center justify-between z-30">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-700 border border-white/50 shadow-xl active:scale-90 transition-all"
        >
          <ArrowRight size={24} />
        </button>
        
        <div className="flex-1 mx-4 relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" size={20} />
          <input
            type="text"
            placeholder="ابحث عن فني في منطقتك..."
            className="w-full pr-12 pl-4 py-4 bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-xl"
          />
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
        <button className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#1877F2] border border-white/50 shadow-xl active:scale-90 transition-all">
          <ZoomIn size={24} />
        </button>
        <button className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#1877F2] border border-white/50 shadow-xl active:scale-90 transition-all">
          <ZoomOut size={24} />
        </button>
        <button className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#1877F2] border border-white/50 shadow-xl active:scale-90 transition-all">
          <LocateFixed size={24} />
        </button>
      </div>

      {/* Professional Detail Card (Overlay) */}
      <AnimatePresence>
        {selectedPro && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-12 left-6 right-6 z-40"
          >
            <div className="bg-white p-6 rounded-[48px] shadow-2xl border border-gray-50 space-y-6 relative overflow-hidden">
              <button 
                onClick={() => setSelectedPro(null)}
                className="absolute top-6 left-6 w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex gap-6">
                <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-xl border-4 border-white flex-shrink-0">
                  <img src={selectedPro.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-[#050505]">{selectedPro.name}</h3>
                    {selectedPro.isVerified && <ShieldCheck size={20} className="text-blue-500" />}
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{selectedPro.specialty}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-amber-600">{selectedPro.rating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">({selectedPro.reviewsCount} تقييم)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => navigate(`/services/profile/${selectedPro.id}`)}
                  className="flex-1 py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-sm shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <Hammer size={20} />
                  <span>عرض الملف الشخصي</span>
                </button>
                <button className="w-16 h-16 bg-gray-50 text-[#1877F2] rounded-[24px] flex items-center justify-center shadow-inner border border-gray-100 active:scale-95 transition-all">
                  <Phone size={28} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
