import { motion } from "motion/react";
import { ShoppingBag, Search, Filter, MapPin, Heart, Plus, Tag, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categories = [
    { name: "الكل", icon: "🛍️" },
    { name: "إلكترونيات", icon: "📱" },
    { name: "أثاث", icon: "🛋️" },
    { name: "سيارات", icon: "🚗" },
    { name: "ملابس", icon: "👕" },
    { name: "عقارات", icon: "🏠" },
    { name: "أدوات منزلية", icon: "🍳" },
  ];

  const products = [
    { id: 1, name: "آيفون 13 برو ماكس - مساحة 256", price: "35,000", location: "الحي الثالث", category: "إلكترونيات", image: "https://picsum.photos/seed/iphone/400/400" },
    { id: 2, name: "طقم ركنة مودرن 5 قطع", price: "12,500", location: "الحي الثاني", category: "أثاث", image: "https://picsum.photos/seed/sofa/400/400" },
    { id: 3, name: "لابتوب ديل كور i7 جيل عاشر", price: "18,000", location: "الحي الأول", category: "إلكترونيات", image: "https://picsum.photos/seed/laptop/400/400" },
    { id: 4, name: "ساعة رولكس أصلية مستعملة", price: "150,000", location: "الحي الخامس", category: "إكسسوارات", image: "https://picsum.photos/seed/watch/400/400" },
    { id: 5, name: "دراجة جبلية ترينكس مقاس 26", price: "4,200", location: "الحي السابع", category: "رياضة", image: "https://picsum.photos/seed/bike/400/400" },
    { id: 6, name: "شقة للبيع 160م تشطيب سوبر لوكس", price: "2,100,000", location: "الحي التاسع", category: "عقارات", image: "https://picsum.photos/seed/house/400/400" },
    { id: 7, name: "بلايستيشن 5 مع ذراعين إضافي", price: "22,000", location: "الحي الثالث", category: "إلكترونيات", image: "https://picsum.photos/seed/ps5/400/400" },
    { id: 8, name: "طاولة سفرة خشب زان 6 كراسي", price: "8,500", location: "الحي الثاني", category: "أثاث", image: "https://picsum.photos/seed/table/400/400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900">سوق كفراوي</h1>
          <p className="text-sm text-gray-500 font-medium">بيع واشتري أي حاجة في منطقتك بكل سهولة</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
            <Plus size={20} />
            <span>بيع حاجة</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="عن ماذا تبحث اليوم؟ (مثلاً: موبايل، شقة، لابتوب...)"
            className="w-full pr-12 pl-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
          <Filter size={20} />
          <span>تصفية</span>
        </button>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat, i) => (
          <button 
            key={i}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-500"}`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Items Grid Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-900">أحدث الإعلانات</h2>
        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 cursor-pointer hover:text-emerald-600 transition-colors">
          <span>ترتيب حسب: الأحدث</span>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -8 }}
            onClick={() => navigate(`/marketplace/product/${product.id}`)}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer flex flex-col h-full"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-emerald-600 shadow-sm">
                {product.category}
              </div>
              <button className="absolute top-3 right-3 p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                <Heart size={18} />
              </button>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                  <MapPin size={14} className="text-emerald-500" />
                  <span className="text-xs font-medium">{product.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">السعر</span>
                  <p className="text-lg font-black text-emerald-600">{product.price} <span className="text-xs font-bold">ج.م</span></p>
                </div>
                <button className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-8">
        <button className="px-8 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-emerald-500 transition-all shadow-sm">
          عرض المزيد من المنتجات
        </button>
      </div>
    </div>
  );
}
