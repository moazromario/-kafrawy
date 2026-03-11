import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ChevronLeft, 
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Heart,
  Microscope,
  Activity,
  Dna,
  Syringe,
  Thermometer,
  Eye,
  Baby,
  Gift,
  Tag,
  Percent
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MedicalOffersPage() {
  const navigate = useNavigate();

  const offers = [
    { id: 1, title: "خصم ٣٠٪ على التحاليل", body: "استمتع بخصم ٣٠٪ على جميع باقات التحاليل الشاملة هذا الأسبوع.", code: "LAB30", color: "bg-blue-50 text-[#1E90FF]", icon: Microscope, image: "https://picsum.photos/seed/off1/400/300" },
    { id: 2, title: "كشف مجاني للعيون", body: "احجز كشف عيون واحصل على فحص قاع العين مجاناً.", code: "EYEFREE", color: "bg-emerald-50 text-emerald-600", icon: Eye, image: "https://picsum.photos/seed/off2/400/300" },
    { id: 3, title: "باقة متابعة الحمل", body: "خصم ٢٠٪ على باقة متابعة الحمل الشاملة مع أفضل الاستشاريين.", code: "MOM20", color: "bg-purple-50 text-purple-600", icon: Baby, image: "https://picsum.photos/seed/off3/400/300" },
  ];

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
          <h1 className="text-xl font-black text-[#050505]">العروض والتخفيضات</h1>
        </div>
      </header>

      <main className="p-6 space-y-8">
        <AnimatePresence mode="popLayout">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[48px] shadow-sm border border-gray-50 overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-500"
            >
              <div className="relative h-48">
                <img src={offer.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={offer.title} referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-lg">
                  <Percent size={14} className="text-[#1E90FF]" />
                  <span className="text-xs font-black text-[#050505]">عرض حصري</span>
                </div>
                <div className={`absolute bottom-4 right-4 ${offer.color} px-4 py-1.5 rounded-2xl text-[10px] font-black shadow-lg flex items-center gap-2`}>
                  <offer.icon size={14} />
                  <span>{offer.title.split(' ')[0]}</span>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#050505]">{offer.title}</h3>
                  <p className="text-sm font-bold text-gray-400 leading-relaxed">{offer.body}</p>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">كود الخصم</span>
                    <span className="text-lg font-black text-[#1E90FF] tracking-widest">{offer.code}</span>
                  </div>
                  <button className="px-6 py-3 bg-[#1E90FF] text-white rounded-xl font-black text-xs shadow-lg shadow-blue-100 active:scale-95 transition-all">
                    نسخ الكود
                  </button>
                </div>

                <button className="w-full py-4 bg-gray-50 text-[#1E90FF] rounded-[24px] font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
                  استخدم العرض الآن
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>
    </div>
  );
}
