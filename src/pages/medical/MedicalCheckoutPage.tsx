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
  Stethoscope,
  Plus,
  Zap,
  Building2,
  Video
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMedical } from "@/src/context/MedicalContext";

export default function MedicalCheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const docId = searchParams.get("docId") || "d1";
  const type = searchParams.get("type") || "clinic";
  const day = searchParams.get("day") || "الأحد";
  const slot = searchParams.get("slot") || "١٠:٠٠ ص";

  const { doctors, addAppointment } = useMedical();
  const doc = doctors.find(d => d.id === docId) || doctors[0];

  const price = type === "clinic" ? doc.price : doc.price - 50;
  const [paymentMethod, setPaymentMethod] = useState("wallet");

  const handlePay = () => {
    const newAppointment = {
      doctorId: docId,
      doctorName: doc.name,
      specialty: doc.specialty,
      date: day,
      time: slot,
      status: "upcoming" as const,
      type: type as "clinic" | "video",
      price: price,
    };
    addAppointment(newAppointment);
    navigate("/medical/success?type=booking");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-40">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">تأكيد الحجز والدفع</h1>
      </header>

      <main className="p-6 space-y-8">
        {/* Appointment Summary */}
        <section className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[24px] overflow-hidden shadow-md border border-gray-50">
              <img src={doc.image} className="w-full h-full object-cover" alt={doc.name} referrerPolicy="no-referrer" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#050505]">{doc.name}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{doc.specialty}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1E90FF]">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400">التاريخ</p>
                <p className="text-xs font-black text-[#050505]">{day}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1E90FF]">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400">الوقت</p>
                <p className="text-xs font-black text-[#050505]">{slot}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1E90FF]">
              {type === "clinic" ? <Building2 size={18} /> : <Video size={18} />}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400">نوع الكشف</p>
              <p className="text-xs font-black text-[#050505]">{type === "clinic" ? "في العيادة" : "مكالمة فيديو"}</p>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">طريقة الدفع</h4>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: "wallet", name: "محفظة كفراوي", icon: Wallet, color: "bg-blue-50 text-[#1E90FF]" },
              { id: "card", name: "بطاقة ائتمان", icon: CreditCard, color: "bg-purple-50 text-purple-600" },
              { id: "cash", name: "كاش في العيادة", icon: Zap, color: "bg-amber-50 text-amber-600" },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-5 rounded-[28px] border transition-all flex items-center justify-between group ${
                  paymentMethod === method.id 
                  ? "bg-[#1E90FF] text-white border-[#1E90FF] shadow-xl shadow-blue-100" 
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
                  {paymentMethod === method.id && <CheckCircle2 size={14} className="text-[#1E90FF]" />}
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
              <span className="text-sm font-bold text-gray-500">سعر الكشف</span>
              <span className="text-sm font-black text-[#050505]">{price} ج.م</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">رسوم الخدمة</span>
              <span className="text-sm font-black text-[#050505]">٢٠ ج.م</span>
            </div>
            <div className="h-px bg-gray-50 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-[#050505]">الإجمالي</span>
              <span className="text-xl font-black text-[#1E90FF]">{price + 20} ج.م</span>
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
            className="w-full py-5 bg-[#1E90FF] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>تأكيد الدفع والحجز</span>
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
