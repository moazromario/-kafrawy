import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Banknote, 
  Truck, 
  CheckCircle2, 
  ChevronLeft,
  Plus,
  ShoppingBag,
  Clock,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from "@/src/context/MarketplaceContext";

export default function MarketplaceCheckoutPage() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useMarketplace();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const deliveryFee = 50;
  const total = totalPrice + deliveryFee;

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      clearCart();
      navigate("/marketplace/order-tracking/ORD-12345");
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
        <h1 className="text-xl font-black text-gray-900">إتمام الدفع</h1>
      </header>

      <main className="p-6 space-y-8">
        {/* Delivery Address */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">عنوان التوصيل</h3>
            <button className="text-xs font-black text-indigo-600 flex items-center gap-1">
              <Plus size={14} />
              <span>إضافة جديد</span>
            </button>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-indigo-100 flex items-center gap-5 relative group cursor-pointer">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
              <MapPin size={28} />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-gray-900">المنزل</h4>
              <p className="text-xs text-gray-400 font-bold mt-1">الحي الثالث، المجاورة الخامسة، مدينة العبور</p>
            </div>
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <CheckCircle2 size={16} />
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">طريقة الدفع</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: "card", label: "بطاقة ائتمان", icon: CreditCard, color: "text-blue-600 bg-blue-50" },
              { id: "wallet", label: "محفظة إلكترونية", icon: Wallet, color: "text-purple-600 bg-purple-50" },
              { id: "cash", label: "كاش عند الاستلام", icon: Banknote, color: "text-emerald-600 bg-emerald-50" },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-center justify-between p-6 rounded-[32px] transition-all border-2 ${
                  paymentMethod === method.id 
                  ? "bg-white border-indigo-600 shadow-xl shadow-indigo-100" 
                  : "bg-white border-gray-50 text-gray-400 hover:border-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${method.color}`}>
                    <method.icon size={24} />
                  </div>
                  <span className={`font-black ${paymentMethod === method.id ? "text-gray-900" : "text-gray-400"}`}>
                    {method.label}
                  </span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  paymentMethod === method.id ? "border-indigo-600 bg-indigo-600" : "border-gray-100"
                }`}>
                  {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">ملخص الطلب</h3>
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-6 space-y-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-50">
                      <img src={item.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-gray-900">{item.name}</h5>
                      <p className="text-[10px] font-bold text-gray-400">الكمية: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-900">{(item.discountPrice || item.price) * item.quantity} ج.م</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-6 space-y-3 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                <span>المجموع</span>
                <span className="text-gray-900">{totalPrice} ج.م</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                <span>رسوم التوصيل</span>
                <span className="text-emerald-500">{deliveryFee} ج.م</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-black text-gray-900">الإجمالي</span>
                <span className="text-xl font-black text-indigo-600">{total} ج.م</span>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[32px] border border-gray-50 shadow-sm flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Clock size={20} />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">وقت التوصيل</p>
            <p className="text-xs font-black text-gray-900">اليوم، 06:00 م</p>
          </div>
          <div className="bg-white p-5 rounded-[32px] border border-gray-50 shadow-sm flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <ShieldCheck size={20} />
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">حماية المشتري</p>
            <p className="text-xs font-black text-gray-900">مضمون 100%</p>
          </div>
        </div>
      </main>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className={`w-full py-5 bg-indigo-600 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 active:scale-95 transition-all ${
              isPlacingOrder ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isPlacingOrder ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>تأكيد الطلب والدفع</span>
                <CheckCircle2 size={24} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
