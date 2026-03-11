import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  CreditCard, 
  Wallet, 
  ChevronLeft, 
  CheckCircle2,
  ShieldCheck,
  Clock,
  Info,
  Plus,
  MessageSquare,
  Banknote,
  Tag
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDelivery } from "@/src/context/DeliveryContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { totalPrice, currentAddress, clearCart, cart } = useDelivery();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  const deliveryFee = 15;
  const serviceFee = 5;
  const total = totalPrice + deliveryFee + serviceFee;

  const handlePlaceOrder = () => {
    // In a real app, send to backend
    navigate("/delivery/success");
    clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-44">
      {/* Header */}
      <header className="bg-white px-4 pt-6 pb-4 sticky top-0 z-30 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700"
        >
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-900">الدفع وإتمام الطلب</h1>
      </header>

      <main className="p-4 space-y-8">
        {/* Delivery Address */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-gray-400 uppercase">عنوان التوصيل</h2>
            <button className="text-xs font-black text-emerald-600 flex items-center gap-1">
              <Plus size={14} />
              <span>إضافة جديد</span>
            </button>
          </div>
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <MapPin size={28} />
              </div>
              <div>
                <p className="font-black text-gray-900">{currentAddress}</p>
                <p className="text-xs text-gray-500 font-bold mt-1">الشقة 4، الدور الثاني، عمارة 12</p>
              </div>
            </div>
            <ChevronLeft size={20} className="text-gray-300 group-hover:text-emerald-600 transition-all" />
          </div>
        </section>

        {/* Payment Method */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-gray-400 uppercase">طريقة الدفع</h2>
            <button 
              onClick={() => navigate("/delivery/payment")}
              className="text-xs font-black text-emerald-600"
            >
              تغيير
            </button>
          </div>
          <div 
            onClick={() => navigate("/delivery/payment")}
            className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                {paymentMethod === "cash" ? <Banknote size={28} /> : paymentMethod === "wallet" ? <Wallet size={28} /> : <CreditCard size={28} />}
              </div>
              <div>
                <p className="font-black text-gray-900">
                  {paymentMethod === "cash" ? "دفع نقدي (كاش)" : paymentMethod === "wallet" ? "محفظة كفراوي" : "بطاقة ائتمان"}
                </p>
                <p className="text-xs text-gray-500 font-bold mt-1">
                  {paymentMethod === "cash" ? "الدفع عند الاستلام" : paymentMethod === "wallet" ? "الرصيد: 450 ج.م" : "فيزا ينتهي بـ 4242"}
                </p>
              </div>
            </div>
            <ChevronLeft size={20} className="text-gray-300 group-hover:text-emerald-600 transition-all" />
          </div>
        </section>

        {/* Order Items Summary */}
        <section className="space-y-4">
          <h2 className="text-sm font-black text-gray-400 uppercase px-2">ملخص الطلب</h2>
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xs font-black text-emerald-600 border border-gray-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      {item.quantity}x
                    </div>
                    <div>
                      <span className="font-black text-gray-900 block">{item.name}</span>
                      <span className="text-[10px] font-bold text-gray-400">سعر الوحدة: {item.price} ج.م</span>
                    </div>
                  </div>
                  <span className="font-black text-gray-900">{item.price * item.quantity} ج.م</span>
                </div>
              ))}
            </div>
            
            {/* Promo Code */}
            <div className="pt-6 border-t border-gray-50">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="كود الخصم"
                    className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
                <button className="px-6 bg-gray-900 text-white rounded-2xl font-black text-xs hover:bg-emerald-600 transition-all">
                  تطبيق
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-gray-400">المجموع الفرعي</span>
                <span className="font-black text-gray-700">{totalPrice} ج.م</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-gray-400">رسوم التوصيل</span>
                <span className="font-black text-gray-700">{deliveryFee} ج.م</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-gray-400">رسوم الخدمة</span>
                <span className="font-black text-gray-700">{serviceFee} ج.م</span>
              </div>
              
              <div className="pt-4 flex justify-between items-end">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full">
                    <Clock size={14} />
                    <span className="text-[10px] font-black">35 - 45 دقيقة</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">الإجمالي النهائي</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-emerald-600 tracking-tight">{total} <span className="text-sm">ج.م</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Driver Notes */}
        <section className="space-y-4">
          <h2 className="text-sm font-black text-gray-400 uppercase px-2">ملاحظات للمندوب</h2>
          <div className="relative">
            <MessageSquare className="absolute right-4 top-4 text-gray-400" size={20} />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلاً: اترك الطلب عند الباب، أو اتصل عند الوصول..."
              className="w-full pr-12 pl-4 py-4 bg-white border border-gray-100 rounded-[28px] text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px] shadow-sm placeholder:text-gray-300"
            />
          </div>
        </section>

        {/* Security Info */}
        <div className="flex items-start gap-4 p-5 bg-emerald-50 rounded-[28px] text-emerald-700 border border-emerald-100">
          <ShieldCheck size={24} className="flex-shrink-0" />
          <p className="text-xs font-bold leading-relaxed">
            بياناتك محمية بالكامل. نحن نستخدم أحدث تقنيات التشفير لضمان أمان عمليات الدفع والخصوصية الخاصة بك في كفراوي.
          </p>
        </div>
      </main>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-100 shadow-[0_-15px_50px_rgba(0,0,0,0.08)] z-30">
        <button 
          onClick={handlePlaceOrder}
          className="w-full py-5 bg-emerald-600 text-white rounded-[28px] font-black text-xl shadow-2xl shadow-emerald-100 flex items-center justify-center gap-4 active:scale-95 transition-all"
        >
          <span>تأكيد وطلب الآن</span>
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
}
