import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  CreditCard, 
  Wallet, 
  Banknote, 
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("cash");

  const paymentMethods = [
    { 
      id: "cash", 
      label: "دفع نقدي (كاش)", 
      description: "الدفع عند الاستلام للمندوب", 
      icon: Banknote,
      color: "bg-emerald-100 text-emerald-600"
    },
    { 
      id: "wallet", 
      label: "محفظة كفراوي", 
      description: "الرصيد الحالي: 450.00 ج.م", 
      icon: Wallet,
      color: "bg-blue-100 text-blue-600"
    },
    { 
      id: "card", 
      label: "بطاقة ائتمان", 
      description: "فيزا، ماستركارد، ميزة", 
      icon: CreditCard,
      color: "bg-orange-100 text-orange-600"
    },
  ];

  const handleConfirm = () => {
    // In a real app, save to context/state
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-32">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
        >
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">طريقة الدفع</h1>
      </header>

      <main className="p-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">اختر طريقة الدفع المفضلة</h2>
          <p className="text-xs text-gray-500 px-2 font-bold">سيتم استخدام هذه الطريقة لإتمام طلبك الحالي</p>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group ${
                selectedMethod === method.id 
                ? "border-[#1877F2] bg-blue-50 shadow-xl shadow-blue-100/50" 
                : "border-white bg-white hover:border-gray-100 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  selectedMethod === method.id ? "bg-[#1877F2] text-white" : method.color
                }`}>
                  <method.icon size={32} />
                </div>
                <div className="text-right">
                  <h3 className="font-black text-[#050505] text-lg">{method.label}</h3>
                  <p className="text-xs text-gray-400 font-bold mt-1">{method.description}</p>
                </div>
              </div>

              {/* Custom Radio Button */}
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedMethod === method.id ? "border-[#1877F2] bg-[#1877F2] shadow-lg shadow-blue-200" : "border-gray-200"
              }`}>
                {selectedMethod === method.id && (
                  <CheckCircle2 size={18} className="text-white" />
                )}
              </div>
            </motion.button>
          ))}

          {/* Add New Card Option */}
          <button className="w-full p-6 rounded-[32px] border-2 border-dashed border-gray-200 flex items-center justify-center gap-3 text-gray-400 hover:border-blue-300 hover:text-[#1877F2] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-all">
              <Plus size={20} />
            </div>
            <span className="font-black text-sm">إضافة بطاقة جديدة</span>
          </button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-[28px] border border-blue-100">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1877F2] shadow-sm">
            <ShieldCheck size={28} />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black text-blue-900">دفع آمن 100%</h4>
            <p className="text-[10px] font-bold text-[#1877F2] leading-relaxed mt-0.5">
              جميع معاملاتك المالية مشفرة ومحمية بأعلى معايير الأمان العالمية.
            </p>
          </div>
        </div>
      </main>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-100 shadow-[0_-15px_50px_rgba(0,0,0,0.08)] z-30">
        <button 
          onClick={handleConfirm}
          className="w-full py-5 bg-[#1877F2] text-white rounded-[28px] font-black text-xl shadow-2xl shadow-blue-100 flex items-center justify-center gap-4 active:scale-95 transition-all"
        >
          <span>تأكيد الاختيار</span>
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
}
