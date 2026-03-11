import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  ChevronLeft, 
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Clock,
  Hammer,
  Plus,
  Zap
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function ServicesCheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proId = searchParams.get("proId") || "p1";
  const service = searchParams.get("service") || "خدمة عامة";
  const date = searchParams.get("date") || "١٥ مارس";
  const time = searchParams.get("time") || "١٠:٠٠ ص";
  const price = parseInt(searchParams.get("price") || "0");

  const { professionals, addBooking } = useServices();
  const pro = professionals.find(p => p.id === proId) || professionals[0];

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handlePay = () => {
    const bookingData = {
      professionalId: proId,
      professionalName: pro.name,
      serviceName: service,
      date,
      time,
      totalPrice: price,
      address: "الحي الثاني، فيلا ٤٥",
    };
    addBooking(bookingData);
    navigate("/services/success?type=booking");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-40">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">الدفع</h1>
      </header>

      <main className="p-6 space-y-8">
        {/* Delivery Address */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">عنوان الخدمة</h4>
            <button 
              onClick={() => navigate("/services/add-address")}
              className="text-xs font-black text-[#1877F2] flex items-center gap-1"
            >
              <Plus size={14} />
              <span>تغيير</span>
            </button>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2]">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#050505]">المنزل</h4>
              <p className="text-[10px] font-bold text-gray-400">مدينة العبور، الحي الثاني، فيلا ٤٥</p>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">طريقة الدفع</h4>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: "card", name: "بطاقة ائتمان", icon: CreditCard, color: "bg-blue-50 text-[#1877F2]" },
              { id: "wallet", name: "محفظة كفراوي", icon: Wallet, color: "bg-purple-50 text-purple-600" },
              { id: "cash", name: "كاش عند الانتهاء", icon: Zap, color: "bg-amber-50 text-amber-600" },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-5 rounded-[28px] border transition-all flex items-center justify-between group ${
                  paymentMethod === method.id 
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-xl shadow-blue-100" 
                  : "bg-white text-gray-700 border-gray-50 hover:border-blue-200 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${
                    paymentMethod === method.id ? "bg-white/20" : method.color
                  }`}>
                    <method.icon size={20} />
                  </div>
                  <span className="font-black text-sm">{method.name}</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === method.id ? "border-white bg-white" : "border-gray-100"
                }`}>
                  {paymentMethod === method.id && <CheckCircle2 size={14} className="text-[#1877F2]" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 space-y-6">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">ملخص الحساب</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">{service}</span>
              <span className="text-sm font-black text-[#050505]">{price} ج.م</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">رسوم الخدمة</span>
              <span className="text-sm font-black text-[#050505]">٥٠ ج.م</span>
            </div>
            <div className="h-px bg-gray-50 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-[#050505]">الإجمالي</span>
              <span className="text-xl font-black text-[#1877F2]">{price + 50} ج.م</span>
            </div>
          </div>
        </section>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">دفع آمن ١٠٠٪</span>
        </div>
      </main>

      {/* Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handlePay}
            className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>تأكيد الدفع</span>
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
