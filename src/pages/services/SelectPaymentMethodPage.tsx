import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  ChevronLeft, 
  ArrowLeft,
  Plus,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SelectPaymentMethodPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("card1");

  const methods = [
    { id: "card1", name: "بطاقة فيزا", number: "**** 1234", icon: CreditCard, color: "bg-blue-50 text-[#1877F2]" },
    { id: "card2", name: "ماستر كارد", number: "**** 5678", icon: CreditCard, color: "bg-purple-50 text-purple-600" },
    { id: "wallet", name: "محفظة كفراوي", number: "١٥٠٠ ج.م", icon: Wallet, color: "bg-emerald-50 text-emerald-600" },
    { id: "cash", name: "نقداً عند الانتهاء", number: "الدفع للمندوب", icon: Zap, color: "bg-amber-50 text-amber-600" },
  ];

  const handleSave = () => {
    // In a real app, we'd save this to the user's profile
    navigate(-1);
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
        <h1 className="text-xl font-black text-[#050505]">طريقة الدفع</h1>
      </header>

      <main className="p-6 space-y-10">
        {/* Payment Methods List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">طرق الدفع المحفوظة</h4>
            <button className="text-xs font-black text-[#1877F2] flex items-center gap-1">
              <Plus size={14} />
              <span>إضافة بطاقة</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-6 rounded-[32px] border transition-all flex items-center justify-between group ${
                  selectedMethod === method.id 
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-xl shadow-blue-100" 
                  : "bg-white text-gray-700 border-gray-50 hover:border-blue-200 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shadow-inner ${
                    selectedMethod === method.id ? "bg-white/20" : method.color
                  }`}>
                    <method.icon size={28} />
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-black">{method.name}</h4>
                    <p className={`text-[10px] font-bold ${selectedMethod === method.id ? "text-white/70" : "text-gray-400"}`}>
                      {method.number}
                    </p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.id ? "border-white bg-white" : "border-gray-100"
                }`}>
                  {selectedMethod === method.id && <CheckCircle2 size={18} className="text-[#1877F2]" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Security Info */}
        <section className="bg-blue-50 p-8 rounded-[40px] flex items-center gap-6 border border-blue-100">
          <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center text-[#1877F2] shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-[#050505]">دفع آمن وموثوق</h4>
            <p className="text-[10px] font-bold text-gray-400 leading-relaxed">بياناتك محمية ومشفرة بالكامل لضمان أقصى درجات الأمان.</p>
          </div>
        </section>
      </main>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handleSave}
            className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>تأكيد الاختيار</span>
            <CheckCircle2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
