import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Tag, 
  ShoppingBag, 
  Coffee, 
  Pizza, 
  Store, 
  ChevronLeft, 
  CheckCircle2,
  Clock,
  Sparkles,
  Percent
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PromotionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    { id: "all", label: "الكل", icon: Sparkles },
    { id: "meals", label: "وجبات", icon: Pizza },
    { id: "drinks", label: "مشروبات", icon: Coffee },
    { id: "market", label: "سوبر ماركت", icon: Store },
  ];

  const offers = [
    {
      id: 1,
      category: "meals",
      title: "خصم 50% على البرجر",
      store: "برجر كينج كفراوي",
      code: "BURGER50",
      expiry: "ينتهي خلال 3 ساعات",
      image: "https://picsum.photos/seed/burger-offer/600/400",
      color: "from-orange-500 to-red-600",
      description: "استمتع بخصم نصف السعر على جميع ساندوتشات البرجر الحجم الكبير."
    },
    {
      id: 2,
      category: "market",
      title: "توصيل مجاني للمقاضي",
      store: "سوبر ماركت العبور",
      code: "FREESHIP",
      expiry: "عرض اليوم فقط",
      image: "https://picsum.photos/seed/market-offer/600/400",
      color: "from-emerald-500 to-teal-600",
      description: "اطلب احتياجات منزلك الآن واحصل على توصيل مجاني لأي طلب فوق 200 ج.م."
    },
    {
      id: 3,
      category: "drinks",
      title: "اشترِ 1 واحصل على 1 مجاناً",
      store: "ستاربكس كفراوي",
      code: "BOGO",
      expiry: "ينتهي غداً",
      image: "https://picsum.photos/seed/coffee-offer/600/400",
      color: "from-brown-500 to-amber-800",
      description: "عرض خاص على جميع أنواع القهوة الباردة والساخنة."
    },
    {
      id: 4,
      category: "meals",
      title: "وجبة العائلة بـ 199 ج.م",
      store: "كنتاكي العبور",
      code: "FAMILY",
      expiry: "عرض نهاية الأسبوع",
      image: "https://picsum.photos/seed/chicken-offer/600/400",
      color: "from-red-500 to-rose-700",
      description: "9 قطع دجاج + بطاطس عائلية + كول سلو + لتر بيبسي."
    }
  ];

  const filteredOffers = activeTab === "all" ? offers : offers.filter(o => o.category === activeTab);

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
          >
            <ArrowRight size={20} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">العروض والخصومات</h1>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${
                activeTab === cat.id 
                ? "bg-[#1877F2] text-white shadow-lg shadow-blue-100" 
                : "bg-white text-gray-500 border border-gray-100"
              }`}
            >
              <cat.icon size={18} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Featured Banner */}
        <div className="relative h-48 rounded-[32px] overflow-hidden shadow-xl">
          <img 
            src="https://picsum.photos/seed/promo-banner/800/400" 
            className="w-full h-full object-cover" 
            alt="Promo Banner"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full mb-2">
              <Percent size={14} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">عرض حصري</span>
            </div>
            <h2 className="text-2xl font-black leading-tight">وفر حتى 70% اليوم!</h2>
            <p className="text-xs font-bold text-gray-300">على أكثر من 50 مطعم ومتجر في الحي الثالث</p>
          </div>
        </div>

        {/* Offers List */}
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOffers.map((offer) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={offer.id}
                className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 group"
              >
                <div className="relative h-44">
                  <img 
                    src={offer.image} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={offer.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-2xl bg-gradient-to-r ${offer.color} text-white text-xs font-black shadow-lg`}>
                    {offer.expiry}
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black text-[#050505]">{offer.title}</h3>
                      <p className="text-xs font-bold text-[#1877F2]">{offer.store}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                      <Tag size={24} />
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 leading-relaxed font-bold">
                    {offer.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-3 flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">كود الخصم</span>
                      <span className="font-black text-[#050505]">{offer.code}</span>
                    </div>
                    <button className="h-12 px-6 bg-[#1877F2] text-white rounded-[24px] font-black text-xs shadow-lg shadow-blue-100 active:scale-95 transition-all">
                      تطبيق العرض
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredOffers.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <Tag size={40} />
            </div>
            <p className="text-gray-400 font-bold">لا توجد عروض في هذا القسم حالياً</p>
          </div>
        )}
      </main>
    </div>
  );
}
