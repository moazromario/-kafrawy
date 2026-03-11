import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Stethoscope, 
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
  Baby
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MedicalServicesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const services = [
    { id: 1, name: "كشف منزلي", icon: Activity, color: "bg-blue-50 text-[#1E90FF]", price: "من ٥٠٠ ج.م" },
    { id: 2, name: "تحاليل طبية", icon: Microscope, color: "bg-emerald-50 text-emerald-600", price: "من ١٠٠ ج.م" },
    { id: 3, name: "أشعة وسونار", icon: Zap, color: "bg-purple-50 text-purple-600", price: "من ٢٠٠ ج.م" },
    { id: 4, name: "تمريض منزلي", icon: Syringe, color: "bg-amber-50 text-amber-600", price: "من ٣٠٠ ج.م" },
    { id: 5, name: "علاج طبيعي", icon: Heart, color: "bg-red-50 text-red-500", price: "من ٢٥٠ ج.م" },
    { id: 6, name: "صيدلية أونلاين", icon: Thermometer, color: "bg-indigo-50 text-indigo-600", price: "خصومات تصل لـ ٢٠٪" },
  ];

  const filteredServices = services.filter(s => s.name.includes(searchQuery));

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
          <h1 className="text-xl font-black text-[#050505]">الخدمات الطبية</h1>
        </div>

        <div className="relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E90FF] transition-colors" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن خدمة طبية..."
            className="w-full pr-12 pl-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all placeholder:text-gray-400 shadow-inner"
          />
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, i) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-4 group cursor-pointer hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-500"
              >
                <div className={`w-20 h-20 ${service.color} rounded-[32px] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                  <service.icon size={36} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-[#050505]">{service.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{service.price}</p>
                </div>
                <button className="w-10 h-10 bg-gray-50 text-[#1E90FF] rounded-xl flex items-center justify-center shadow-inner border border-gray-100 active:scale-95 transition-all">
                  <Plus size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Featured Service Banner */}
        <section className="mt-10 bg-[#1E90FF] p-8 rounded-[48px] text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">خدمة مميزة</span>
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black">
                الأكثر طلباً
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">كشف منزلي فوري</h3>
              <p className="text-sm font-bold text-white/70 leading-relaxed">أفضل الأطباء يصلون إليك في غضون ٦٠ دقيقة بجميع التخصصات.</p>
            </div>
            <button className="w-full py-4 bg-white text-[#1E90FF] rounded-[24px] font-black text-sm shadow-xl active:scale-95 transition-all">
              اطلب الآن
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
