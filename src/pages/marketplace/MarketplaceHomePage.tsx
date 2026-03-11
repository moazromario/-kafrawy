import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Bell, 
  User, 
  ShoppingBag, 
  Smartphone, 
  Shirt, 
  Home, 
  Sparkles, 
  Apple,
  ChevronLeft,
  Star,
  Heart,
  Plus,
  ArrowLeft,
  Percent,
  TrendingUp,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from "@/src/context/MarketplaceContext";

export default function MarketplaceHomePage() {
  const navigate = useNavigate();
  const { cart, wishlist, toggleWishlist } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: 1, name: "إلكترونيات", icon: Smartphone, color: "bg-blue-50 text-blue-600" },
    { id: 2, name: "ملابس", icon: Shirt, color: "bg-pink-50 text-pink-600" },
    { id: 3, name: "منزلية", icon: Home, color: "bg-orange-50 text-orange-600" },
    { id: 4, name: "تجميل", icon: Sparkles, color: "bg-purple-50 text-purple-600" },
    { id: 5, name: "سوبر ماركت", icon: Apple, color: "bg-emerald-50 text-emerald-600" },
  ];

  const featuredOffers = [
    { id: 1, title: "عروض الجمعة البيضاء", subtitle: "خصومات تصل إلى 70%", image: "https://picsum.photos/seed/tech/800/400", color: "bg-indigo-600" },
    { id: 2, title: "أحدث صيحات الموضة", subtitle: "تشكيلة ربيع 2026", image: "https://picsum.photos/seed/fashion/800/400", color: "bg-rose-500" },
  ];

  const popularProducts = [
    { id: "p1", name: "ساعة ذكية Ultra", price: 2500, rating: 4.8, image: "https://picsum.photos/seed/watch/400/400", category: "إلكترونيات", hasOffer: true, discountPrice: 1999 },
    { id: "p2", name: "سماعات لاسلكية Pro", price: 1200, rating: 4.5, image: "https://picsum.photos/seed/buds/400/400", category: "إلكترونيات" },
    { id: "p3", name: "قميص قطني كاجوال", price: 450, rating: 4.2, image: "https://picsum.photos/seed/shirt/400/400", category: "ملابس" },
    { id: "p4", name: "ماكينة قهوة Espresso", price: 3800, rating: 4.9, image: "https://picsum.photos/seed/coffee/400/400", category: "منزلية", hasOffer: true, discountPrice: 3200 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-24">
      {/* Navbar */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6 rounded-b-[40px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">كفراوي <span className="text-indigo-600">سوق</span></h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">كل ما تحتاجه في مكان واحد</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/marketplace/notifications")}
              className="relative w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
            >
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <button 
              onClick={() => navigate("/marketplace/profile")}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all overflow-hidden border border-gray-100"
            >
              <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="ابحث عن منتج، ماركة، أو متجر..."
            className="w-full pr-14 pl-6 py-4.5 bg-gray-50 border-none rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 shadow-inner"
            onClick={() => navigate("/marketplace/search")}
          />
        </div>
      </header>

      <main className="p-6 space-y-10">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900">الفئات</h2>
            <button 
              onClick={() => navigate("/marketplace/categories")}
              className="text-xs font-black text-indigo-600 flex items-center gap-1"
            >
              <span>عرض الكل</span>
              <ChevronLeft size={14} />
            </button>
          </div>
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <motion.button
                whileTap={{ scale: 0.92 }}
                key={cat.id}
                onClick={() => navigate(`/marketplace/products?category=${cat.name}`)}
                className="flex flex-col items-center gap-3 flex-shrink-0"
              >
                <div className={`w-20 h-20 ${cat.color} rounded-[28px] flex items-center justify-center shadow-sm border border-white/50`}>
                  <cat.icon size={32} />
                </div>
                <span className="text-xs font-black text-gray-700">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Featured Offers Carousel */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-500 fill-amber-500" size={20} />
              <h2 className="text-xl font-black text-gray-900">عروض حصرية</h2>
            </div>
            <button 
              onClick={() => navigate("/marketplace/promotions")}
              className="text-xs font-black text-indigo-600"
            >
              عرض الكل
            </button>
          </div>
          <div className="flex gap-5 overflow-x-auto no-scrollbar snap-x">
            {featuredOffers.map((offer) => (
              <div 
                key={offer.id}
                onClick={() => navigate("/marketplace/promotions")}
                className={`flex-shrink-0 w-[88%] aspect-[2/1] ${offer.color} rounded-[40px] relative overflow-hidden snap-center shadow-2xl shadow-indigo-100 cursor-pointer active:scale-98 transition-all`}
              >
                <img src={offer.image} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" alt={offer.title} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg">
                      <Percent size={14} className="text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">عرض اليوم</span>
                  </div>
                  <h3 className="text-2xl font-black mb-2 leading-tight">{offer.title}</h3>
                  <p className="text-white/80 text-sm font-bold">{offer.subtitle}</p>
                  <button className="mt-6 self-start px-6 py-3 bg-white text-gray-900 rounded-2xl text-xs font-black shadow-xl active:scale-95 transition-all">
                    تسوق الآن
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Products Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={20} />
              <h2 className="text-xl font-black text-gray-900">الأكثر مبيعاً</h2>
            </div>
            <button 
              onClick={() => navigate("/marketplace/products")}
              className="text-xs font-black text-indigo-600"
            >
              عرض الكل
            </button>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {popularProducts.map((product) => (
              <motion.div
                whileHover={{ y: -8 }}
                key={product.id}
                onClick={() => navigate(`/marketplace/product/${product.id}`)}
                className="bg-white rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-50 cursor-pointer group relative"
              >
                <div className="relative aspect-square">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} referrerPolicy="no-referrer" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-4 left-4 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                      wishlist.includes(product.id) ? "bg-rose-500 text-white" : "bg-white/80 backdrop-blur-md text-gray-400 hover:text-rose-500"
                    }`}
                  >
                    <Heart size={18} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                  {product.hasOffer && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-black rounded-xl shadow-lg">
                      وفر {product.price - (product.discountPrice || 0)} ج.م
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-gray-400">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                      {product.hasOffer && (
                        <span className="text-[10px] text-gray-400 line-through font-bold">{product.price} ج.م</span>
                      )}
                      <span className="text-lg font-black text-indigo-600">{product.discountPrice || product.price} <span className="text-[10px]">ج.م</span></span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // addToCart logic here
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
        </section>
      </main>

      {/* Floating Cart Bar */}
      {cart.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 left-6 right-6 bg-gray-900 rounded-[32px] p-5 shadow-2xl z-40 flex items-center justify-between text-white cursor-pointer"
          onClick={() => navigate("/marketplace/cart")}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">سلة التسوق</p>
              <p className="text-xl font-black">{cart.reduce((sum, i) => sum + (i.discountPrice || i.price) * i.quantity, 0)} ج.م</p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-black">
            <span>إتمام الشراء</span>
            <ArrowLeft size={24} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
