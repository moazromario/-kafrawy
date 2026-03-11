import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  CheckCircle2, 
  X, 
  Plus, 
  ChevronLeft,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMarketplace, Product } from "@/src/context/MarketplaceContext";

export default function ProductComparisonPage() {
  const navigate = useNavigate();
  const { addToCart } = useMarketplace();

  const products: Product[] = [
    { 
      id: "p1", 
      name: "ساعة ذكية Ultra", 
      description: "ساعة ذكية متطورة",
      reviewsCount: 120,
      price: 2500, 
      rating: 4.8, 
      image: "https://picsum.photos/seed/watch/400/400", 
      category: "إلكترونيات", 
      stockStatus: "متوفر",
      specs: {
        "الشاشة": "1.96 إنش AMOLED",
        "البطارية": "14 يوم",
        "المقاومة": "5ATM",
        "المستشعرات": "نبضات القلب، الأكسجين"
      }
    },
    { 
      id: "p10", 
      name: "ساعة ذكية Series 9", 
      description: "ساعة ذكية أنيقة",
      reviewsCount: 85,
      price: 2200, 
      rating: 4.6, 
      image: "https://picsum.photos/seed/watch2/400/400", 
      category: "إلكترونيات", 
      stockStatus: "متوفر",
      specs: {
        "الشاشة": "1.85 إنش OLED",
        "البطارية": "10 أيام",
        "المقاومة": "3ATM",
        "المستشعرات": "نبضات القلب، النوم"
      }
    }
  ];

  const specKeys = Object.keys(products[0].specs || {});

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-30 shadow-sm rounded-b-[40px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-900">مقارنة المنتجات</h1>
        </div>
        <button className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
          <Plus size={24} />
        </button>
      </header>

      <main className="p-6 space-y-10">
        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 gap-5">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 space-y-6 relative group">
              <button className="absolute top-4 left-4 w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all">
                <X size={16} />
              </button>
              <div className="aspect-square rounded-[32px] overflow-hidden shadow-md border border-gray-50">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="font-black text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-lg font-black text-indigo-600">{product.price} ج.م</p>
                <div className="flex items-center justify-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-gray-400">{product.rating}</span>
                </div>
              </div>
              <button 
                onClick={() => addToCart(product)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <ShoppingBag size={18} />
                <span>أضف للسلة</span>
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <section className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 px-2">المواصفات التقنية</h2>
          <div className="bg-white rounded-[48px] shadow-sm border border-gray-50 overflow-hidden">
            {specKeys.map((key, i) => (
              <div key={key} className={`flex flex-col ${i !== 0 ? "border-t border-gray-50" : ""}`}>
                <div className="bg-gray-50/50 p-4 text-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{key}</span>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-6 text-center border-l border-gray-50">
                    <span className="text-sm font-black text-gray-900">{products[0].specs?.[key]}</span>
                  </div>
                  <div className="p-6 text-center">
                    <span className="text-sm font-black text-gray-900">{products[1].specs?.[key]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Winner Badge (Visual only) */}
        <div className="bg-emerald-600 rounded-[40px] p-8 text-white flex items-center justify-between shadow-2xl shadow-emerald-100">
          <div className="space-y-1">
            <h3 className="text-xl font-black">الأفضل قيمة</h3>
            <p className="text-xs font-bold opacity-80">ساعة ذكية Ultra توفر مواصفات أعلى بسعر مناسب</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30">
            <Zap size={32} />
          </div>
        </div>
      </main>
    </div>
  );
}
