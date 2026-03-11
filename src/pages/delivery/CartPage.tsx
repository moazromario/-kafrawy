import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ChevronLeft, 
  MapPin, 
  Clock, 
  CreditCard,
  Ticket
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDelivery } from "@/src/context/DeliveryContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, totalPrice, currentAddress } = useDelivery();

  const deliveryFee = 15;
  const serviceFee = 5;
  const total = totalPrice + deliveryFee + serviceFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-48 h-48 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
          <ShoppingBag size={80} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">سلتك فارغة</h2>
          <p className="text-gray-500 text-sm max-w-[250px] mx-auto">يبدو أنك لم تختر أي وجبات لذيذة بعد. ابدأ بالتسوق الآن!</p>
        </div>
        <button 
          onClick={() => navigate("/delivery")}
          className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 active:scale-95 transition-all"
        >
          تصفح المطاعم
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* Header */}
      <header className="bg-white px-4 pt-6 pb-4 sticky top-0 z-30 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700"
        >
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">سلة الطلبات</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Delivery Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">عنوان التوصيل</p>
                <p className="text-sm font-black text-gray-900">{currentAddress}</p>
              </div>
            </div>
            <button className="text-xs font-bold text-emerald-600">تغيير</button>
          </div>
          <div className="h-px bg-gray-50" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">وقت التوصيل المتوقع</p>
              <p className="text-sm font-black text-gray-900">25 - 35 دقيقة</p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-gray-900 px-2">ملخص الطلب</h2>
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                key={item.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-4"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-gray-900 text-sm">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-black text-emerald-600">{item.price * item.quantity} ج.م</p>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-500"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-black text-gray-900 w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-emerald-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Promo Code */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
            <Ticket size={20} />
          </div>
          <input 
            type="text" 
            placeholder="عندك كود خصم؟" 
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-gray-300"
          />
          <button className="text-sm font-black text-emerald-600 px-4">تطبيق</button>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="font-bold text-gray-500">المجموع الفرعي</span>
            <span className="font-black text-gray-900">{totalPrice} ج.م</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-gray-500">رسوم التوصيل</span>
            <span className="font-black text-gray-900">{deliveryFee} ج.م</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-gray-500">رسوم الخدمة</span>
            <span className="font-black text-gray-900">{serviceFee} ج.م</span>
          </div>
          <div className="h-px bg-gray-50" />
          <div className="flex justify-between text-lg">
            <span className="font-black text-gray-900">الإجمالي</span>
            <span className="font-black text-emerald-600">{total} ج.م</span>
          </div>
        </div>
      </main>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-30">
        <button 
          onClick={() => navigate("/delivery/checkout")}
          className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-100 flex items-center justify-between px-8 active:scale-95 transition-all"
        >
          <span>إتمام الطلب</span>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-80">{total} ج.م</span>
            <ChevronLeft size={20} />
          </div>
        </button>
      </div>
    </div>
  );
}
