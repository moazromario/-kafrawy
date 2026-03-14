import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  Navigation, 
  Plus, 
  Minus, 
  Locate, 
  Star, 
  Clock, 
  Bike,
  ShoppingBag,
  ChevronLeft
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function DeliveryMapPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [zoom, setZoom] = useState(15);
  const [showStoreCard, setShowStoreCard] = useState(true);

  const store = {
    name: "برجر كينج كفراوي",
    rating: 4.8,
    time: "20-30 دقيقة",
    fee: 15,
    image: "https://picsum.photos/seed/burger/100/100",
    location: "الحي الثالث، مدينة العبور"
  };

  return (
    <div className="h-screen w-full bg-blue-50 relative overflow-hidden flex flex-col">
      {/* Immersive Map Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center transition-all duration-500"
          style={{ 
            backgroundImage: `url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i${zoom}!2i19293!3i12345!2m3!1e0!2sm!3i420120488!3m8!2sar!3seg!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425')`,
            transform: `scale(${1 + (zoom - 15) * 0.1})`
          }}
        />
        {/* Map Overlay for better UI contrast */}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Top Header Overlay */}
      <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-700 active:scale-90 transition-all"
        >
          <ArrowRight size={24} />
        </button>
        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
          <div className="w-2 h-2 bg-[#1877F2] rounded-full animate-pulse" />
          <span className="text-sm font-black text-[#050505]">موقع المتجر</span>
        </div>
        <div className="w-12 h-12" /> {/* Spacer */}
      </div>

      {/* Map Pins */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Store Pin */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
          onClick={() => setShowStoreCard(true)}
        >
          <div className="relative group">
            <div className="w-16 h-16 bg-[#1877F2] rounded-3xl flex items-center justify-center text-white shadow-2xl border-4 border-white rotate-12 group-hover:rotate-0 transition-transform">
              <ShoppingBag size={32} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1877F2] rotate-45" />
            
            {/* Store Label */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-black text-[#050505]">{store.name}</span>
            </div>
          </div>
        </motion.div>

        {/* User Pin */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-1/3 right-1/4 pointer-events-auto"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-2xl border-4 border-white -rotate-6">
              <MapPin size={24} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500 rotate-45" />
            
            {/* User Pulse */}
            <motion.div 
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-orange-400 rounded-2xl -z-10"
            />
          </div>
        </motion.div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        <button 
          onClick={() => setZoom(prev => Math.min(prev + 1, 20))}
          className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-700 active:scale-90 transition-all"
        >
          <Plus size={24} />
        </button>
        <button 
          onClick={() => setZoom(prev => Math.max(prev - 1, 10))}
          className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-700 active:scale-90 transition-all"
        >
          <Minus size={24} />
        </button>
        <button 
          className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#1877F2] active:scale-90 transition-all mt-4"
        >
          <Locate size={24} />
        </button>
      </div>

      {/* Bottom Store Card */}
      <AnimatePresence>
        {showStoreCard && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] p-8 z-20"
          >
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-md border border-gray-50">
                    <img src={store.image} className="w-full h-full object-cover" alt={store.name} referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#050505] text-xl">{store.name}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span>{store.rating} • {store.location}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowStoreCard(false)}
                  className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400"
                >
                  <ChevronLeft size={20} className="rotate-90" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-3xl flex items-center gap-3 border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1877F2] shadow-sm">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الوقت</p>
                    <p className="text-sm font-black text-[#050505]">{store.time}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl flex items-center gap-3 border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1877F2] shadow-sm">
                    <Bike size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">التوصيل</p>
                    <p className="text-sm font-black text-[#050505]">{store.fee} ج.م</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => navigate(`/delivery/store/${id || '1'}`)}
                  className="flex-1 py-5 bg-gray-100 text-gray-700 rounded-[32px] font-black text-lg active:scale-95 transition-all"
                >
                  عرض المنيو
                </button>
                <button className="flex-[2] py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Navigation size={24} />
                  <span>بدء الملاحة</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
