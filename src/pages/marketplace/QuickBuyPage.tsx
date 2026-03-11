import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  ChevronLeft,
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  Clock
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMarketplace, Product } from "@/src/context/MarketplaceContext";

export default function QuickBuyPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isBuying, setIsBuying] = useState(false);

  // Mock product data
  const product: Product = {
    id: id || "p1",
    name: "ساعة ذكية Ultra",
    description: "ساعة ذكية متطورة",
    reviewsCount: 120,
    price: 2500,
    rating: 4.8,
    image: "https://picsum.photos/seed/watch/400/400",
    category: "إلكترونيات",
    stockStatus: "متوفر",
    hasOffer: true,
    discountPrice: 1999,
  };

  const handleBuyNow = () => {
    setIsBuying(true);
    setTimeout(() => {
      setIsBuying(false);
      navigate("/marketplace/order-tracking/ORD-QUICK");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-40">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-30 shadow-sm rounded-b-[40px] flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-gray-900">شراء سريع</h1>
      </header>

      <main className="p-6 space-y-8">
        {/* Product Card */}
        <section className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex gap-6 group">
          <div className="w-32 h-32 rounded-[32px] overflow-hidden shadow-md border border-gray-50 flex-shrink-0">
            <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-2">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{product.category}</p>
            <h3 className="text-xl font-black text-gray-900">{product.name}</h3>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-indigo-600">{product.discountPrice || product.price} ج.م</span>
              {product.hasOffer && (
                <span className="text-sm text-gray-400 line-through font-bold">{product.price} ج.م</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-gray-400">{product.rating}</span>
            </div>
          </div>
        </section>

        {/* Quick Config */}
        <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
          {/* Address Selection */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">عنوان التوصيل</h4>
            <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <MapPin size={20} />
                </div>
                <span className="text-sm font-black text-gray-900">المنزل (مدينة العبور)</span>
              </div>
              <ChevronLeft size={18} className="text-gray-300 group-hover:text-indigo-600 transition-all" />
            </div>
          </div>

          {/* Payment Selection */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">طريقة الدفع</h4>
            <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <CreditCard size={20} />
                </div>
                <span className="text-sm font-black text-gray-900">بطاقة ائتمان (**** 1234)</span>
              </div>
              <ChevronLeft size={18} className="text-gray-300 group-hover:text-indigo-600 transition-all" />
            </div>
          </div>
        </section>

        {/* Delivery Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 flex flex-col items-center gap-2 text-center">
            <Truck size={24} className="text-indigo-600" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">التوصيل</p>
            <p className="text-xs font-black text-gray-900">خلال 24 ساعة</p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 flex flex-col items-center gap-2 text-center">
            <ShieldCheck size={24} className="text-emerald-600" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">الضمان</p>
            <p className="text-xs font-black text-gray-900">أصلي 100%</p>
          </div>
        </div>
      </main>

      {/* Buy Now Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handleBuyNow}
            disabled={isBuying}
            className={`w-full py-5 bg-indigo-600 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 active:scale-95 transition-all ${
              isBuying ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isBuying ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>تأكيد الشراء الآن</span>
                <Zap size={24} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
