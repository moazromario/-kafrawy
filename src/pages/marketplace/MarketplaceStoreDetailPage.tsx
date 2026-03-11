import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Star, 
  ShoppingBag, 
  Search, 
  Filter, 
  Info, 
  MessageSquare, 
  Heart, 
  Plus, 
  CheckCircle2, 
  ShieldCheck,
  Package,
  ArrowLeft,
  Share2,
  MapPin,
  Clock,
  Phone
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMarketplace, Product } from "@/src/context/MarketplaceContext";

export default function MarketplaceStoreDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { wishlist, toggleWishlist, addToCart } = useMarketplace();
  const [activeTab, setActiveTab] = useState("products");

  const store = {
    id: id || "ms1",
    name: "سوق الإلكترونيات",
    category: "إلكترونيات",
    rating: 4.8,
    reviewsCount: 450,
    productsCount: 1250,
    image: "https://picsum.photos/seed/tech/100/100",
    coverImage: "https://picsum.photos/seed/tech-cover/800/400",
    description: "أحدث الأجهزة الإلكترونية والهواتف الذكية بأسعار تنافسية. نحن وكلاء معتمدون لأكبر الماركات العالمية ونضمن لك الجودة والأصالة.",
    location: "الحي الثالث، مدينة العبور",
    workingHours: "10:00 ص - 11:00 م",
    phone: "01012345678"
  };

  const products: Product[] = [
    { id: "p1", name: "ساعة ذكية Ultra", description: "ساعة ذكية متطورة", price: 2500, rating: 4.8, reviewsCount: 120, image: "https://picsum.photos/seed/watch/400/400", category: "إلكترونيات", stockStatus: "متوفر", hasOffer: true, discountPrice: 1999 },
    { id: "p2", name: "سماعات لاسلكية Pro", description: "سماعات بلوتوث", price: 1200, rating: 4.5, reviewsCount: 85, image: "https://picsum.photos/seed/buds/400/400", category: "إلكترونيات", stockStatus: "متوفر" },
    { id: "p4", name: "ماكينة قهوة Espresso", description: "ماكينة تحضير القهوة", price: 3800, rating: 4.9, reviewsCount: 210, image: "https://picsum.photos/seed/coffee/400/400", category: "منزلية", stockStatus: "متوفر", hasOffer: true, discountPrice: 3200 },
  ];

  const reviews = [
    { id: 1, user: "محمد علي", rating: 5, comment: "متجر رائع ومنتجات أصلية 100%. التوصيل كان سريع جداً.", date: "منذ يومين" },
    { id: 2, user: "سارة أحمد", rating: 4, comment: "تجربة جيدة، الأسعار معقولة والتعامل راقي.", date: "منذ أسبوع" },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Cover & Header */}
      <div className="relative h-72">
        <img src={store.coverImage} className="w-full h-full object-cover" alt={store.name} referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Controls */}
        <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all"
          >
            <ArrowRight size={24} />
          </button>
          <div className="flex gap-3">
            <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all">
              <Share2 size={24} />
            </button>
            <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all">
              <Heart size={24} />
            </button>
          </div>
        </div>

        {/* Store Info Overlay */}
        <div className="absolute bottom-8 left-8 right-8 flex items-end gap-6">
          <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
            <img src={store.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 text-white pb-2">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black">{store.name}</h1>
              <ShieldCheck size={20} className="text-emerald-400" />
            </div>
            <div className="flex items-center gap-4 text-xs font-bold opacity-80">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span>{store.rating} ({store.reviewsCount} تقييم)</span>
              </div>
              <div className="flex items-center gap-1">
                <Package size={14} />
                <span>{store.productsCount} منتج</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-8 sticky top-0 bg-white z-20 border-b border-gray-50">
        <div className="flex gap-8">
          {[
            { id: "products", label: "المنتجات", icon: ShoppingBag },
            { id: "reviews", label: "المراجعات", icon: MessageSquare },
            { id: "info", label: "معلومات", icon: Info },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 flex items-center gap-2 transition-all relative ${
                activeTab === tab.id ? "text-indigo-600 font-black" : "text-gray-400 font-bold"
              }`}
            >
              <tab.icon size={18} />
              <span className="text-sm">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Search & Filter */}
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="ابحث داخل المتجر..."
                    className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 shadow-inner"
                  />
                </div>
                <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 border border-gray-100">
                  <Filter size={20} />
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 gap-5">
                {products.map((product) => (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={product.id}
                    onClick={() => navigate(`/marketplace/product/${product.id}`)}
                    className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50 cursor-pointer group relative"
                  >
                    <div className="relative aspect-square">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} referrerPolicy="no-referrer" />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                          wishlist.includes(product.id) ? "bg-rose-500 text-white" : "bg-white/80 backdrop-blur-md text-gray-400"
                        }`}
                      >
                        <Heart size={16} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-black text-gray-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-indigo-600">{product.discountPrice || product.price} ج.م</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-indigo-50 p-8 rounded-[40px] flex flex-col items-center text-center space-y-3">
                <h3 className="text-4xl font-black text-indigo-600">{store.rating}</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={20} className={s <= Math.floor(store.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                  ))}
                </div>
                <p className="text-xs font-bold text-gray-400">بناءً على {store.reviewsCount} مراجعة</p>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400">
                          {review.user[0]}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-gray-900">{review.user}</h4>
                          <p className="text-[10px] font-bold text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-100"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900">عن المتجر</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{store.description}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900">تفاصيل التواصل</h3>
                <div className="bg-gray-50 rounded-[32px] overflow-hidden border border-gray-100">
                  <div className="flex items-center gap-4 p-5 border-b border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الموقع</p>
                      <p className="text-sm font-black text-gray-900">{store.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 border-b border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ساعات العمل</p>
                      <p className="text-sm font-black text-gray-900">{store.workingHours}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">رقم الهاتف</p>
                      <p className="text-sm font-black text-gray-900">{store.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full py-5 bg-gray-900 text-white rounded-[32px] font-black text-lg shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                <MessageSquare size={24} />
                <span>تواصل مع المتجر</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
