import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Zap, 
  Star, 
  ChevronLeft, 
  ArrowLeft,
  Hammer,
  Droplets,
  PaintBucket,
  Wrench,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Copy
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ServicesPromotionsPage() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const promos = [
    { id: 1, title: "خصم ٢٥٪ على أول حجز", code: "KAFRAOUI25", color: "from-[#1877F2] to-[#0052D4]", icon: Zap, description: "استمتع بخصم حصري على أول خدمة تطلبها من خلال تطبيق كفراوي." },
    { id: 2, title: "عروض الصيانة الدورية", code: "MAINTAIN15", color: "from-amber-500 to-orange-600", icon: Wrench, description: "خصم ١٥٪ على كافة خدمات الصيانة الدورية للتكييف والسباكة." },
    { id: 3, title: "باقة النقل المتكاملة", code: "MOVE500", color: "from-purple-600 to-indigo-700", icon: Truck, description: "وفر ٥٠٠ ج.م عند حجز باقة نقل العفش المتكاملة شاملة الفك والتركيب." },
  ];

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
        <h1 className="text-xl font-black text-[#050505]">العروض والخصومات</h1>
      </header>

      <main className="p-6 space-y-10">
        {/* Featured Banner */}
        <section>
          <div className="bg-gradient-to-br from-[#1877F2] to-[#0052D4] p-10 rounded-[48px] text-white relative overflow-hidden shadow-2xl shadow-blue-100">
            <div className="relative z-10 space-y-4">
              <div className="bg-white/20 w-fit px-4 py-1.5 rounded-full backdrop-blur-md text-xs font-black uppercase tracking-widest">عرض الفلاش</div>
              <h2 className="text-3xl font-black leading-tight">خصم ٥٠٪ على خدمات السباكة!</h2>
              <p className="text-white/80 text-sm font-bold">يسري العرض لمدة ٢٤ ساعة فقط على كافة أعمال السباكة.</p>
              <div className="flex gap-3 pt-4">
                <button className="px-8 py-4 bg-white text-[#1877F2] rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">احجز الآن</button>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20">
                  <span className="text-xs font-black">PLUMB50</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
            <Zap size={120} className="absolute -bottom-10 -right-10 text-white/10 -rotate-12" />
          </div>
        </section>

        {/* Promo Cards */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-[#050505] px-2">كوبونات الخصم</h3>
          <div className="space-y-6">
            {promos.map((promo) => (
              <motion.div
                whileHover={{ y: -5 }}
                key={promo.id}
                className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-50 flex flex-col"
              >
                <div className={`h-32 bg-gradient-to-br ${promo.color} p-8 flex items-center justify-between`}>
                  <div className="w-16 h-16 bg-white/20 rounded-[24px] flex items-center justify-center text-white backdrop-blur-md border border-white/30">
                    <promo.icon size={32} />
                  </div>
                  <div className="text-right">
                    <h4 className="text-xl font-black text-white">{promo.title}</h4>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">كود الخصم متاح الآن</p>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <p className="text-sm text-gray-500 leading-relaxed font-bold">{promo.description}</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 p-4 rounded-2xl flex items-center justify-between group">
                      <span className="text-sm font-black text-[#050505] tracking-widest">{promo.code}</span>
                      <button 
                        onClick={() => handleCopy(promo.code)}
                        className="text-[#1877F2] hover:scale-110 transition-transform"
                      >
                        {copiedCode === promo.code ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                    <button className="px-8 py-4 bg-[#1877F2] text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-100 active:scale-95 transition-all">تطبيق</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories Offers */}
        <section className="space-y-6 pb-10">
          <h3 className="text-lg font-black text-[#050505] px-2">عروض حسب التصنيف</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "الكهرباء", discount: "٢٠٪", icon: Zap, color: "bg-yellow-50 text-yellow-600" },
              { name: "النجارة", discount: "١٥٪", icon: Hammer, color: "bg-amber-50 text-amber-600" },
              { name: "النقاشة", discount: "٣٠٪", icon: PaintBucket, color: "bg-purple-50 text-purple-600" },
              { name: "التكييف", discount: "١٠٪", icon: Wrench, color: "bg-cyan-50 text-cyan-600" },
            ].map((cat) => (
              <div key={cat.name} className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex flex-col items-center text-center space-y-3 group cursor-pointer hover:border-[#1877F2] transition-all">
                <div className={`w-14 h-14 ${cat.color} rounded-[20px] flex items-center justify-center shadow-sm`}>
                  <cat.icon size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#050505]">{cat.name}</h4>
                  <p className="text-xl font-black text-[#1877F2]">{cat.discount} خصم</p>
                </div>
                <button className="text-[10px] font-black text-gray-400 group-hover:text-[#1877F2] flex items-center gap-1">
                  <span>عرض الخدمات</span>
                  <ChevronLeft size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
