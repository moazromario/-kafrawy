import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Zap, 
  Star, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  PlayCircle, 
  BookOpen, 
  Award, 
  Users,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/utils/cn";

const TRAINING_OFFERS = [
  { id: 1, title: "دورة التسويق الرقمي المكثفة", provider: "أكاديمية كفراوي", duration: "٤ أسابيع", price: "مجاني", image: "https://picsum.photos/seed/train1/600/300", type: "دورة" },
  { id: 2, title: "تدريب صيفي في تطوير الويب", provider: "تكنو سوفت", duration: "٣ أشهر", price: "مدفوع", image: "https://picsum.photos/seed/train2/600/300", type: "تدريب" },
  { id: 3, title: "أساسيات المحاسبة المالية", provider: "الخليج للاستثمار", duration: "أسبوعين", price: "٥٠٠ ج.م", image: "https://picsum.photos/seed/train3/600/300", type: "دورة" },
];

export default function TrainingOffersPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">العروض والتدريبات</h1>
      </header>

      <main className="p-6 space-y-8 max-w-xl mx-auto">
        {/* Featured Banner */}
        <section className="relative h-48 rounded-[40px] overflow-hidden shadow-xl shadow-blue-100 group cursor-pointer">
          <img src="https://picsum.photos/seed/banner/800/400" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
            <h2 className="text-xl font-black text-white">ابدأ مسيرتك المهنية اليوم!</h2>
            <p className="text-xs font-bold text-white/70">سجل في برامج التدريب الصيفي المتاحة الآن.</p>
          </div>
        </section>

        {/* Training List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-[#050505]">البرامج المتاحة</h3>
            <span className="text-xs font-black text-[#1877F2]">عرض الكل</span>
          </div>
          <div className="space-y-6">
            {TRAINING_OFFERS.map((offer) => (
              <div key={offer.id} className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                <div className="relative h-40">
                  <img src={offer.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black text-[#1877F2] shadow-sm">
                    {offer.type}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-base font-black text-[#050505] group-hover:text-[#1877F2] transition-colors">{offer.title}</h4>
                    <p className="text-xs font-bold text-gray-400">{offer.provider}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-[#1877F2]" />
                        <span>{offer.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={14} className="text-[#1877F2]" />
                        <span>شهادة معتمدة</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-emerald-600">{offer.price}</span>
                  </div>
                  <button className="w-full py-4 bg-blue-50 text-[#1877F2] rounded-[24px] font-black text-xs flex items-center justify-center gap-2 hover:bg-[#1877F2] hover:text-white transition-all shadow-sm">
                    <span>سجل الآن</span>
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
