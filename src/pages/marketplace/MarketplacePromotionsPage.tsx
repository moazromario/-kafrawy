import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Percent, 
  Zap, 
  Clock, 
  ChevronLeft, 
  ArrowLeft,
  Star,
  ShoppingBag,
  Flame,
  Tag
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MarketplacePromotionsPage() {
  const navigate = useNavigate();

  const flashSales = [
    { id: "p1", name: "ساعة ذكية Ultra", price: 2500, discountPrice: 1999, image: "https://picsum.photos/seed/watch/400/400", timeLeft: "02:45:12" },
    { id: "p4", name: "ماكينة قهوة Espresso", price: 3800, discountPrice: 3200, image: "https://picsum.photos/seed/coffee/400/400", timeLeft: "01:20:05" },
  ];

  const categories = [
    { id: 1, name: "خصومات كبرى", icon: Percent, color: "bg-rose-100 text-rose-600" },
    { id: 2, name: "Flash Sale", icon: Zap, color: "bg-amber-100 text-amber-600" },
    { id: 3, name: "عروض حصرية", icon: Tag, color: "bg-indigo-100 text-indigo-600" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-30 shadow-sm rounded-b-[40px] flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-gray-900">العروض والتخفيضات</h1>
      </header>

      <main className="p-6 space-y-10">
        {/* Flash Sale Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-500 fill-amber-500" size={20} />
              <h2 className="text-xl font-black text-gray-900">Flash Sale</h2>
            </div>
            <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
              <Clock size={14} className="text-rose-500" />
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">ينتهي خلال 02:45:12</span>
            </div>
          </div>
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
            {flashSales.map((product) => (
              <motion.div
                whileTap={{ scale: 0.95 }}
                key={product.id}
                onClick={() => navigate(`/marketplace/product/${product.id}`)}
                className="flex-shrink-0 w-72 bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-50 group"
              >
                <div className="relative aspect-square">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-rose-500 text-white text-[10px] font-black rounded-xl shadow-lg">
                    وفر {product.price - product.discountPrice} ج.م
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 line-through font-bold">{product.price} ج.م</span>
                      <span className="text-xl font-black text-indigo-600">{product.discountPrice} ج.م</span>
                    </div>
                    <button className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-6">أقسام العروض</h2>
          <div className="grid grid-cols-1 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex items-center justify-between group active:scale-98 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                    <cat.icon size={28} />
                  </div>
                  <div className="text-right">
                    <h3 className="font-black text-gray-900">{cat.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">تصفح أقوى العروض الحالية</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-all">
                  <ChevronLeft size={20} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Big Banner */}
        <section>
          <div className="bg-indigo-600 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="text-amber-400 fill-amber-400" size={24} />
                <span className="text-xs font-black uppercase tracking-widest">عرض حصري</span>
              </div>
              <h2 className="text-3xl font-black leading-tight">خصم 50% على أول طلب لك في السوق!</h2>
              <p className="text-white/80 text-sm font-bold">استخدم كود: <span className="text-white font-black">MARKET50</span></p>
              <button className="mt-6 px-8 py-4 bg-white text-gray-900 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">
                تطبيق العرض الآن
              </button>
            </div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>
        </section>
      </main>
    </div>
  );
}
