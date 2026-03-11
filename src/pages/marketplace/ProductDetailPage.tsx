import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Heart, 
  Share2, 
  Star, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  ChevronLeft,
  X,
  Maximize2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMarketplace, Product } from "@/src/context/MarketplaceContext";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { wishlist, toggleWishlist, addToCart } = useMarketplace();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("أسود");
  const [selectedSize, setSelectedSize] = useState("L");
  const [activeImage, setActiveImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Mock product data
  const product: Product = {
    id: id || "p1",
    name: "ساعة ذكية Ultra",
    description: "ساعة ذكية متطورة مع شاشة AMOLED ومقاومة للماء. تتميز ببطارية تدوم طويلاً وتدعم أكثر من 100 وضع رياضي. تصميم أنيق وقوي يناسب جميع المناسبات.",
    price: 2500,
    rating: 4.8,
    reviewsCount: 120,
    image: "https://picsum.photos/seed/watch/800/800",
    category: "إلكترونيات",
    stockStatus: "متوفر",
    hasOffer: true,
    discountPrice: 1999,
    specs: {
      "الشاشة": "1.96 إنش AMOLED",
      "البطارية": "تصل إلى 14 يوم",
      "المقاومة": "5ATM (مقاومة للماء)",
      "المستشعرات": "نبضات القلب، الأكسجين، النوم"
    },
    colors: ["أسود", "فضي", "برتقالي"],
    sizes: ["S", "M", "L", "XL"]
  };

  const images = [
    product.image,
    "https://picsum.photos/seed/watch2/800/800",
    "https://picsum.photos/seed/watch3/800/800",
    "https://picsum.photos/seed/watch4/800/800",
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate("/marketplace/cart");
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header Controls */}
      <div className="fixed top-0 left-0 right-0 z-40 px-6 pt-8 pb-4 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-700 shadow-xl border border-white/50 pointer-events-auto active:scale-90 transition-all"
        >
          <ArrowRight size={24} />
        </button>
        <div className="flex gap-3 pointer-events-auto">
          <button 
            onClick={() => toggleWishlist(product.id)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-white/50 backdrop-blur-md transition-all active:scale-90 ${
              wishlist.includes(product.id) ? "bg-rose-500 text-white" : "bg-white/80 text-gray-400"
            }`}
          >
            <Heart size={24} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
          </button>
          <button className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-700 shadow-xl border border-white/50 active:scale-90 transition-all">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <motion.div 
          key={activeImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full"
          onClick={() => setShowLightbox(true)}
        >
          <img src={images[activeImage]} className="w-full h-full object-cover" alt={product.name} referrerPolicy="no-referrer" />
        </motion.div>
        
        {/* Thumbnails */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 px-6">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all shadow-xl ${
                activeImage === i ? "border-indigo-600 scale-110" : "border-white/50 opacity-60"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>

        <button 
          onClick={() => setShowLightbox(true)}
          className="absolute top-24 right-6 w-10 h-10 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white"
        >
          <Maximize2 size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-8 pt-10 space-y-10">
        {/* Title & Price */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-xl uppercase tracking-widest">{product.category}</span>
            <div className="flex items-center gap-1.5">
              <Star size={18} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-black text-gray-900">{product.rating}</span>
              <span className="text-xs font-bold text-gray-400">({product.reviewsCount} مراجعة)</span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-indigo-600">{product.discountPrice || product.price} <span className="text-sm">ج.م</span></span>
            {product.hasOffer && (
              <span className="text-lg text-gray-400 line-through font-bold mb-1">{product.price} ج.م</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-gray-900">الوصف</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-8">
          {/* Color Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">اللون</h3>
            <div className="flex gap-4">
              {product.colors?.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border-2 ${
                    selectedColor === color 
                    ? "bg-indigo-50 border-indigo-600 text-indigo-600" 
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">الحجم</h3>
            <div className="flex gap-4">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 rounded-2xl text-xs font-black transition-all border-2 flex items-center justify-center ${
                    selectedSize === size 
                    ? "bg-indigo-50 border-indigo-600 text-indigo-600" 
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Specs Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-gray-900">المواصفات</h3>
          <div className="bg-gray-50 rounded-[32px] overflow-hidden border border-gray-100">
            {Object.entries(product.specs || {}).map(([key, value], i) => (
              <div key={key} className={`flex items-center justify-between p-5 ${i !== 0 ? "border-t border-gray-100" : ""}`}>
                <span className="text-xs font-bold text-gray-400">{key}</span>
                <span className="text-sm font-black text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, label: "ضمان سنة", color: "text-blue-600 bg-blue-50" },
            { icon: Truck, label: "شحن سريع", color: "text-emerald-600 bg-emerald-50" },
            { icon: CheckCircle2, label: "أصلي 100%", color: "text-purple-600 bg-purple-50" },
          ].map((b, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-[28px] bg-white border border-gray-100 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${b.color}`}>
                <b.icon size={24} />
              </div>
              <span className="text-[10px] font-black text-gray-700 text-center">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-6 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex items-center gap-5">
          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-[24px] border border-gray-100">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-700 shadow-sm active:scale-90 transition-all"
            >
              <Minus size={20} />
            </button>
            <span className="text-xl font-black text-gray-900 w-6 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 active:scale-90 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
          <button 
            onClick={handleAddToCart}
            className="flex-1 py-5 bg-gray-900 text-white rounded-[28px] font-black text-lg shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <ShoppingBag size={24} />
            <span>أضف للسلة</span>
          </button>
          <button className="w-16 h-16 bg-indigo-600 text-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-indigo-100 active:scale-95 transition-all">
            <Zap size={28} />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="p-8 flex justify-between items-center">
              <span className="text-white font-black text-lg">{activeImage + 1} / {images.length}</span>
              <button 
                onClick={() => setShowLightbox(false)}
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <motion.img 
                key={activeImage}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={images[activeImage]} 
                className="max-w-full max-h-full object-contain" 
                alt="" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8 flex justify-center gap-4 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === i ? "border-indigo-500 scale-110" : "border-white/20 opacity-40"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
