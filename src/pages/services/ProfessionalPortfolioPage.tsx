import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  Maximize2, 
  Share2, 
  Heart,
  Hammer,
  ShieldCheck
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function ProfessionalPortfolioPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { professionals } = useServices();
  const pro = professionals.find(p => p.id === id) || professionals[0];
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (img: string, index: number) => {
    setSelectedImage(img);
    setCurrentIndex(index);
  };

  const nextImage = () => {
    const next = (currentIndex + 1) % pro.portfolio.length;
    setCurrentIndex(next);
    setSelectedImage(pro.portfolio[next]);
  };

  const prevImage = () => {
    const prev = (currentIndex - 1 + pro.portfolio.length) % pro.portfolio.length;
    setCurrentIndex(prev);
    setSelectedImage(pro.portfolio[prev]);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#050505]">معرض الأعمال</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pro.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 border border-gray-100">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <main className="p-6">
        {/* Portfolio Grid */}
        <div className="grid grid-cols-2 gap-4">
          {pro.portfolio.map((img, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              key={i}
              onClick={() => openLightbox(img, i)}
              className="aspect-square rounded-[32px] overflow-hidden shadow-md border border-white cursor-pointer group relative"
            >
              <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30">
                  <Maximize2 size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Professional Summary Footer */}
        <section className="mt-12 bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[24px] overflow-hidden shadow-md border border-gray-50">
              <img src={pro.image} className="w-full h-full object-cover" alt={pro.name} referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-[#050505]">{pro.name}</h3>
                {pro.isVerified && <ShieldCheck size={16} className="text-blue-500" />}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pro.specialty}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed font-bold">{pro.bio}</p>
          <button 
            onClick={() => navigate(`/services/booking/${pro.id}`)}
            className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Hammer size={24} />
            <span>احجز خدمة الآن</span>
          </button>
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-12 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20"
            >
              <X size={24} />
            </button>
            
            <div className="relative w-full max-w-lg aspect-square">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={selectedImage}
                className="w-full h-full object-contain rounded-[48px]"
                alt=""
                referrerPolicy="no-referrer"
              />
              
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20"
              >
                <ChevronRight size={24} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20"
              >
                <ChevronLeft size={24} />
              </button>
            </div>

            <div className="absolute bottom-12 text-white text-center space-y-2">
              <p className="text-lg font-black">{pro.name}</p>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest">صورة {currentIndex + 1} من {pro.portfolio.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
