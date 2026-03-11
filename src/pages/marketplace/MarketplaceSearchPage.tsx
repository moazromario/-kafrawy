import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Search, 
  Filter, 
  X, 
  Star, 
  Clock, 
  ShoppingBag, 
  ChevronLeft, 
  History, 
  TrendingUp, 
  ArrowLeft,
  LayoutGrid,
  List,
  CheckCircle2,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMarketplace, Product } from "@/src/context/MarketplaceContext";

export default function MarketplaceSearchPage() {
  const navigate = useNavigate();
  const { addToCart } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState({
    category: "الكل",
    priceRange: "الكل",
    rating: "الكل"
  });

  const recentSearches = ["ساعة ذكية", "سماعات بلوتوث", "قميص صيفي", "ماكينة قهوة"];
  const trendingSearches = ["آيفون 15", "بلايستيشن 5", "نظارات شمسية", "أحذية رياضية"];

  const products: Product[] = [
    { id: "p1", name: "ساعة ذكية Ultra", description: "ساعة ذكية متطورة", price: 2500, rating: 4.8, reviewsCount: 120, image: "https://picsum.photos/seed/watch/400/400", category: "إلكترونيات", stockStatus: "متوفر", hasOffer: true, discountPrice: 1999 },
    { id: "p2", name: "سماعات لاسلكية Pro", description: "سماعات بلوتوث", price: 1200, rating: 4.5, reviewsCount: 85, image: "https://picsum.photos/seed/buds/400/400", category: "إلكترونيات", stockStatus: "متوفر" },
    { id: "p3", name: "قميص قطني كاجوال", description: "قميص صيفي مريح", price: 450, rating: 4.2, reviewsCount: 45, image: "https://picsum.photos/seed/shirt/400/400", category: "ملابس", stockStatus: "كمية محدودة" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-30 shadow-sm rounded-b-[40px] space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <div className="relative flex-1 group">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج، ماركة، أو متجر..."
              className="w-full pr-14 pl-6 py-4 bg-gray-50 border-none rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
              showFilters ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" : "bg-gray-50 text-gray-500 border-gray-100"
            }`}
          >
            <Filter size={22} />
          </button>
        </div>
      </header>

      <main className="p-6">
        {!searchQuery ? (
          <div className="space-y-10">
            {/* Recent Searches */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <History className="text-gray-400" size={18} />
                  <h2 className="text-lg font-black text-gray-900">عمليات البحث الأخيرة</h2>
                </div>
                <button className="text-xs font-black text-rose-500">مسح الكل</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {recentSearches.map((s) => (
                  <button 
                    key={s}
                    onClick={() => setSearchQuery(s)}
                    className="px-6 py-3 bg-white rounded-2xl text-xs font-black text-gray-600 border border-gray-50 shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            {/* Trending Searches */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-indigo-600" size={18} />
                <h2 className="text-lg font-black text-gray-900">عمليات البحث الشائعة</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {trendingSearches.map((s, i) => (
                  <button 
                    key={s}
                    onClick={() => setSearchQuery(s)}
                    className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-50 flex items-center justify-between group active:scale-98 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">{i + 1}</span>
                      <span className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{s}</span>
                    </div>
                    <ArrowLeft size={18} className="text-gray-300 group-hover:text-indigo-600 transition-all" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-lg font-black text-gray-900">نتائج البحث عن "{searchQuery}"</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{products.length} منتج متاح</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-500 border border-gray-50 shadow-sm"
                >
                  {viewMode === "grid" ? <List size={18} /> : <LayoutGrid size={18} />}
                </button>
              </div>
            </div>

            {/* Results Grid/List */}
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
                  <div className={`relative ${viewMode === "grid" ? "aspect-square" : "w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0"}`}>
                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className={`flex-1 flex flex-col justify-between ${viewMode === "grid" ? "p-5" : "py-1"}`}>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className={`font-black text-gray-900 group-hover:text-indigo-600 transition-colors ${viewMode === "grid" ? "line-clamp-1" : "text-lg"}`}>
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-gray-400">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3">
                      <span className="text-lg font-black text-indigo-600">{product.discountPrice || product.price} ج.م</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-all shadow-lg"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[48px] shadow-2xl z-[70] p-8 space-y-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-gray-900">تصفية النتائج</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filter Sections */}
              <div className="space-y-10">
                {/* Category Filter */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">التصنيف</h4>
                  <div className="flex flex-wrap gap-3">
                    {["الكل", "إلكترونيات", "ملابس", "منزلية", "تجميل"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveFilters({ ...activeFilters, category: cat })}
                        className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border ${
                          activeFilters.category === cat 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                          : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">نطاق السعر</h4>
                  <div className="flex flex-wrap gap-3">
                    {["الكل", "أقل من 500", "500 - 2000", "2000 - 5000", "أكثر من 5000"].map((price) => (
                      <button
                        key={price}
                        onClick={() => setActiveFilters({ ...activeFilters, priceRange: price })}
                        className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border ${
                          activeFilters.priceRange === price 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                          : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        {price} ج.م
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">التقييم</h4>
                  <div className="flex flex-wrap gap-3">
                    {["الكل", "4.5+", "4.0+", "3.5+"].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setActiveFilters({ ...activeFilters, rating })}
                        className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border flex items-center gap-2 ${
                          activeFilters.rating === rating 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                          : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <Star size={14} className={activeFilters.rating === rating ? "fill-white" : "fill-amber-400 text-amber-400"} />
                        <span>{rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setActiveFilters({ category: "الكل", priceRange: "الكل", rating: "الكل" })}
                  className="flex-1 py-5 bg-gray-100 text-gray-700 rounded-[28px] font-black text-lg active:scale-95 transition-all"
                >
                  إعادة تعيين
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="flex-[2] py-5 bg-indigo-600 text-white rounded-[28px] font-black text-lg shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <CheckCircle2 size={24} />
                  <span>تطبيق الفلاتر</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
