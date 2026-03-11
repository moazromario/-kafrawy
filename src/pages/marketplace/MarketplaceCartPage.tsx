import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowLeft,
  Percent,
  Truck,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from "@/src/context/MarketplaceContext";

export default function MarketplaceCartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, totalPrice } = useMarketplace();

  const deliveryFee = 50;
  const total = totalPrice + deliveryFee;

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-40">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-30 shadow-sm rounded-b-[40px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-900">سلة التسوق</h1>
        </div>
        <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black">
          {cart.length} منتجات
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Cart Items */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 flex gap-5 group relative"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-md border border-gray-50">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} referrerPolicy="no-referrer" />
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {item.selectedColor && (
                        <span className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 border border-gray-100">اللون: {item.selectedColor}</span>
                      )}
                      {item.selectedSize && (
                        <span className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 border border-gray-100">الحجم: {item.selectedSize}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-indigo-600">{(item.discountPrice || item.price) * item.quantity} ج.م</span>
                    <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 shadow-sm active:scale-90 transition-all"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-black text-gray-900 w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg active:scale-90 transition-all"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                <ShoppingBag size={64} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900">سلة التسوق فارغة</h3>
                <p className="text-sm text-gray-400">ابدأ بإضافة بعض المنتجات الرائعة لسلتك</p>
              </div>
              <button 
                onClick={() => navigate("/marketplace")}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100"
              >
                تصفح المنتجات
              </button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <>
            {/* Promo Code */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 space-y-4">
              <div className="flex items-center gap-3 text-indigo-600">
                <Percent size={20} />
                <h3 className="font-black text-sm">كود الخصم</h3>
              </div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="أدخل كود الخصم هنا..."
                  className="flex-1 px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300"
                />
                <button className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm active:scale-95 transition-all">
                  تطبيق
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-6">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-50 pb-4">ملخص السعر</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                  <span>المجموع الفرعي</span>
                  <span className="text-gray-900">{totalPrice} ج.م</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                  <span>رسوم التوصيل</span>
                  <span className="text-emerald-500">{deliveryFee} ج.م</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                  <span>الخصم</span>
                  <span className="text-rose-500">0 ج.م</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900">الإجمالي</span>
                  <span className="text-2xl font-black text-indigo-600">{total} ج.م</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-50">
                <Truck size={18} className="text-emerald-500" />
                <span className="text-[10px] font-black text-gray-700">توصيل آمن</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-50">
                <ShieldCheck size={18} className="text-indigo-500" />
                <span className="text-[10px] font-black text-gray-700">ضمان استرجاع</span>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Bottom Action Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
          <div className="max-w-lg mx-auto">
            <button 
              onClick={() => navigate("/marketplace/checkout")}
              className="w-full py-5 bg-indigo-600 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 active:scale-95 transition-all"
            >
              <span>إتمام عملية الشراء</span>
              <ArrowLeft size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
