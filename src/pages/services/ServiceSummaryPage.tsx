import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ChevronLeft, 
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Clock,
  Hammer,
  Wallet,
  Info
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function ServiceSummaryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proId = searchParams.get("proId") || "p1";
  const service = searchParams.get("service") || "خدمة عامة";
  const date = searchParams.get("date") || "١٥ مارس";
  const time = searchParams.get("time") || "١٠:٠٠ ص";
  const price = parseInt(searchParams.get("price") || "0");

  const { professionals } = useServices();
  const pro = professionals.find(p => p.id === proId) || professionals[0];

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
        <h1 className="text-xl font-black text-[#050505]">ملخص الخدمة</h1>
      </header>

      <main className="p-6 space-y-8">
        {/* Professional Summary Card */}
        <section className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 space-y-6">
          <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-gray-50">
              <img src={pro.image} className="w-full h-full object-cover" alt={pro.name} referrerPolicy="no-referrer" />
            </div>
            <div>
              <h3 className="font-black text-[#050505]">{pro.name}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pro.specialty}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1877F2]">
                  <Hammer size={20} />
                </div>
                <span className="text-sm font-black text-gray-700">{service}</span>
              </div>
              <span className="text-sm font-black text-[#1877F2]">{price} ج.م</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1877F2]">
                  <Calendar size={20} />
                </div>
                <span className="text-sm font-black text-gray-700">{date}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1877F2]">
                  <Clock size={20} />
                </div>
                <span className="text-sm font-black text-gray-700">{time}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Address & Payment Summary */}
        <section className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2]">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#050505]">عنوان الخدمة</h4>
              <p className="text-[10px] font-bold text-gray-400">الحي الثاني، فيلا ٤٥</p>
            </div>
          </div>
          <div className="h-px bg-gray-50" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2]">
              <Wallet size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#050505]">طريقة الدفع</h4>
              <p className="text-[10px] font-bold text-gray-400">نقداً عند الانتهاء</p>
            </div>
          </div>
        </section>

        {/* Info Box */}
        <section className="bg-amber-50 p-6 rounded-[32px] flex items-start gap-4 border border-amber-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm flex-shrink-0">
            <Info size={20} />
          </div>
          <p className="text-[10px] font-bold text-amber-700 leading-relaxed">يرجى التأكد من صحة البيانات المدخلة قبل إتمام عملية الدفع. يمكنك إلغاء الحجز مجاناً قبل الموعد بـ ٢٤ ساعة.</p>
        </section>
      </main>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={() => navigate(`/services/checkout?proId=${proId}&service=${service}&date=${date}&time=${time}&price=${price}`)}
            className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>متابعة للدفع</span>
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
