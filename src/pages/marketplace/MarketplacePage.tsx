import { motion } from "motion/react";
import { ShoppingBag, Search, Filter, MapPin, Heart, Plus, Tag, ChevronDown, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { marketplaceService } from "@/src/modules/marketplace/marketplaceService";
import AddProductModal from "@/src/components/marketplace/AddProductModal";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await marketplaceService.getProducts(
      selectedCategory !== "الكل" ? selectedCategory : undefined,
      searchQuery
    );
    if (data) setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await marketplaceService.getCategories();
      if (data) setCategories([{ id: "الكل", name: "الكل" }, ...data]);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900">سوق كفراوي</h1>
          <p className="text-sm text-gray-500 font-medium">بيع واشتري أي حاجة في منطقتك بكل سهولة</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>بيع حاجة</span>
          </button>
        </div>
      </div>
      
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProductAdded={fetchProducts}
      />

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
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat.id ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-500"}`}
          >
            <span>{cat.name === "الكل" ? "🛍️" : "🏷️"}</span>
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
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -8 }}
              onClick={() => navigate(`/marketplace/product/${product.id}`)}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer flex flex-col h-full"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex justify-center items-center">
                <img 
                  src={product.image_url || "https://picsum.photos/seed/product/400/400"} 
                  alt={product.title} 
                  className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-emerald-600 shadow-sm">
                  {product.categories?.name || "عام"}
                </div>
                <button className="absolute top-3 right-3 p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                  <Heart size={18} />
                </button>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                    <MapPin size={14} className="text-emerald-500" />
                    <span className="text-xs font-medium">{product.location || "غير محدد"}</span>
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
      )}

      {/* Load More */}
      <div className="flex justify-center pt-8">
        <button className="px-8 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 hover:border-emerald-500 transition-all shadow-sm">
          عرض المزيد من المنتجات
        </button>
      </div>
    </div>
  );
}
