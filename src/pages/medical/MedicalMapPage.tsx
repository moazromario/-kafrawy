import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  Search, 
  Filter, 
  Navigation, 
  Phone, 
  Star, 
  Clock, 
  Plus, 
  Zap, 
  Hospital, 
  Building2, 
  ChevronLeft, 
  ArrowLeft,
  Stethoscope,
  ShieldCheck,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMedical } from "@/src/context/MedicalContext";

export default function MedicalMapPage() {
  const navigate = useNavigate();
  const { doctors } = useMedical();
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#F5F7FA] relative overflow-hidden">
      {/* Map Background Placeholder */}
      <div className="absolute inset-0 bg-gray-200">
        <div className="w-full h-full bg-[url('https://picsum.photos/seed/map/1920/1080')] bg-cover bg-center opacity-50 grayscale" />
        {/* Map Markers */}
        {doctors.map((doc, i) => (
          <motion.button
            key={doc.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedDoc(doc)}
            className={`absolute w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transition-all ${
              selectedDoc?.id === doc.id ? "bg-[#1E90FF] text-white scale-125 z-20" : "bg-white text-[#1E90FF] z-10"
            }`}
            style={{ 
              top: `${30 + i * 15}%`, 
              left: `${20 + i * 25}%` 
            }}
          >
            <MapPin size={24} />
          </motion.button>
        ))}
      </div>

      {/* Header Overlay */}
      <header className="absolute top-12 left-6 right-6 z-30 space-y-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-700 shadow-xl border border-gray-100 active:scale-95 transition-all"
          >
            <ArrowRight size={24} />
          </button>
          <div className="flex-1 relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E90FF] transition-colors" size={20} />
            <input
              type="text"
              placeholder="ابحث عن عيادة أو مستشفى..."
              className="w-full pr-12 pl-4 py-4 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all placeholder:text-gray-400 shadow-xl"
            />
          </div>
        </div>
      </header>

      {/* Selected Doctor Card Overlay */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-10 left-6 right-6 z-30"
          >
            <div className="bg-white p-6 rounded-[48px] shadow-2xl border border-gray-50 space-y-6 relative group">
              <button 
                onClick={() => setSelectedDoc(null)}
                className="absolute top-4 left-4 w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-[28px] overflow-hidden shadow-md border border-gray-50 flex-shrink-0">
                  <img src={selectedDoc.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#050505]">{selectedDoc.name}</h3>
                    <ShieldCheck size={16} className="text-blue-500" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedDoc.specialty}</p>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-black text-[#050505]">{selectedDoc.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 px-2">
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="text-[#1E90FF]" />
                  <span>{selectedDoc.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-[#1E90FF]" />
                  <span>مفتوح الآن</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-4 bg-[#1E90FF] text-white rounded-[24px] font-black text-xs shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <Navigation size={16} />
                  <span>الاتجاهات</span>
                </button>
                <button 
                  onClick={() => navigate(`/medical/profile/${selectedDoc.id}`)}
                  className="flex-1 py-4 bg-blue-50 text-[#1E90FF] rounded-[24px] font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Plus size={16} />
                  <span>حجز موعد</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="absolute right-6 bottom-40 z-20 flex flex-col gap-4">
        <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#1E90FF] shadow-2xl border border-gray-100 active:scale-95 transition-all">
          <Navigation size={24} />
        </button>
        <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-2xl border border-gray-100 active:scale-95 transition-all">
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
