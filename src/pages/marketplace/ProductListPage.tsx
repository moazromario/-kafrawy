import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Star, 
  Heart, 
  Plus, 
  ShoppingBag,
  ChevronDown,
  Percent,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMarketplace, Product } from "@/src/context/MarketplaceContext";

export default function ProductListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { wishlist, toggleWishlist, addToCart } = useMarketplace();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("الأحدث");

  const category = searchParams.get("category") || "جميع المنتجات";

  const products: Product[] = [
    { id: "p1", name: "ساعة ذكية Ultra", description: "ساعة ذكية متطورة مع شاشة AMOLED ومقاومة للماء", price: 2500, rating: 4.8, reviewsCount: 120, image: "https://picsum.photos/seed/watch/400/400", category: "إلكترونيات", stockStatus: "متوفر", hasOffer: true, discountPrice: 1999 },
    { id: "p2", name: "سماعات لاسلكية Pro", description: "سماعات بلوتوث مع خاصية إلغاء الضوضاء النشطة", price: 1200, rating: 4.5, reviewsCount: 85, image: "https://picsum.photos/seed/buds/400/400", category: "إلكترونيات", stockStatus: "متوفر" },
    { id: "p3", name: "قميص قطني كاجوال", description: "قميص صيفي مريح مصنوع من القطن الطبيعي 100%", price: 450, rating: 4.2, reviewsCount: 45, image: "https://picsum.photos/seed/shirt/400/400", category: "ملابس", stockStatus: "كمية محدودة" },
    { id: "p4", name: "ماكينة قهوة Espresso", description: "ماكينة تحضير القهوة بضغط 15 بار لتجربة احترافية", price: 3800, rating: 4.9, reviewsCount: 210, image: "https://picsum.photos/seed/coffee/400/400", category: "منزلية", stockStatus: "متوفر", hasOffer: true, discountPrice: 3200 },
    { id: "p5", name: "طقم أواني طهي", description: "طقم 10 قطع غير لاصق وسهل التنظيف", price: 1500, rating: 4.6, reviewsCount: 60, image: "https://picsum.photos/seed/pots/400/400", category: "منزلية", stockStatus: "غير متوفر" },
    { id: "p6", name: "كريم مرطب للبشرة", description: "كريم غني بالفيتامينات لترطيب عميق طوال اليوم", price: 250, rating: 4.4, reviewsCount: 150, image: "https://picsum.photos/seed/cream/400/400", category: "تجميل", stockStatus: "متوفر" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-30 shadow-sm rounded-b-[40px] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
            >
              <ArrowRight size={24} />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900">{category}</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{products.length} منتج متاح</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 border border-gray-100"
            >
              {viewMode === "grid" ? <List size={22} /> : <LayoutGrid size={22} />}
            </button>
            <button className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Filter size={22} />
            </button>
          </div>
        </div>

        {/* Sort & Quick Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
            >
              <option>الأحدث</option>
              <option>السعر: من الأقل للأعلى</option>
              <option>السعر: من الأعلى للأقل</option>
              <option>الأكثر تقييماً</option>
            </select>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {["خصومات", "متوفر", "شحن مجاني"].map((f) => (
              <button key={f} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black whitespace-nowrap text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className={viewMode === "grid" ? "grid grid-cols-2 gap-5" : "space-y-5"}>
          {products.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={product.id}
              onClick={() => navigate(`/marketplace/product/${product.id}`)}
              className={`bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50 cursor-pointer group relative ${
                viewMode === "list" ? "flex gap-5 p-4" : ""
              }`}
            >
              {/* Image Section */}
              <div className={`relative ${viewMode === "grid" ? "aspect-square" : "w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0"}`}>
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} referrerPolicy="no-referrer" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={`absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                    wishlist.includes(product.id) ? "bg-rose-500 text-white" : "bg-white/80 backdrop-blur-md text-gray-400 hover:text-rose-500"
                  }`}
                >
                  <Heart size={16} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                </button>
                {product.hasOffer && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-[8px] font-black rounded-lg shadow-lg flex items-center gap-1">
                    <Percent size={10} />
                    <span>عرض خاص</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className={`flex-1 flex flex-col justify-between ${viewMode === "grid" ? "p-5" : "py-1"}`}>
                <div className="space-y-2">
                  <div>
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className={`font-black text-gray-900 group-hover:text-indigo-600 transition-colors ${viewMode === "grid" ? "line-clamp-1" : "text-lg"}`}>
                      {product.name}
                    </h3>
                    {viewMode === "list" && (
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-gray-400">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {product.stockStatus === "متوفر" ? (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={12} className={product.stockStatus === "غير متوفر" ? "text-rose-500" : "text-amber-500"} />
                      )}
                      <span className={`text-[9px] font-bold ${
                        product.stockStatus === "متوفر" ? "text-emerald-500" : 
                        product.stockStatus === "غير متوفر" ? "text-rose-500" : "text-amber-500"
                      }`}>
                        {product.stockStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div className="flex flex-col">
                    {product.hasOffer && (
                      <span className="text-[10px] text-gray-400 line-through font-bold">{product.price} ج.م</span>
                    )}
                    <span className="text-xl font-black text-indigo-600">
                      {product.discountPrice || product.price} <span className="text-[10px]">ج.م</span>
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.stockStatus !== "غير متوفر") {
                        addToCart(product);
                      }
                    }}
                    disabled={product.stockStatus === "غير متوفر"}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                      product.stockStatus === "غير متوفر" 
                      ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                      : "bg-gray-900 text-white group-hover:bg-indigo-600"
                    }`}
                  >
                    <Plus size={22} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Quick Cart Bar */}
      <AnimatePresence>
        {/* Similar to HomePage cart bar */}
      </AnimatePresence>
    </div>
  );
}
