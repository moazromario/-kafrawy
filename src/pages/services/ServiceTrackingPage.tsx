import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronLeft, 
  ArrowLeft,
  Hammer,
  Calendar,
  Wallet,
  Info,
  Navigation,
  Zap
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function ServiceTrackingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { bookings, professionals } = useServices();
  const booking = bookings.find(b => b.id === id) || bookings[0];
  const pro = professionals.find(p => p.id === booking.professionalId) || professionals[0];

  const steps = [
    { id: "confirmed", label: "تم تأكيد الحجز", icon: Calendar, color: "bg-blue-500" },
    { id: "on_the_way", label: "في الطريق إليك", icon: Navigation, color: "bg-amber-500" },
    { id: "in_progress", label: "جاري العمل", icon: Hammer, color: "bg-purple-500" },
    { id: "completed", label: "تم الانتهاء", icon: CheckCircle2, color: "bg-emerald-500" },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === booking.status);

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
        <h1 className="text-xl font-black text-[#050505]">تتبع الخدمة</h1>
      </header>

      <main className="p-6 space-y-10">
        {/* Map Preview Placeholder */}
        <section className="relative h-64 bg-blue-50 rounded-[48px] overflow-hidden shadow-inner border border-white group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-100/50 rounded-full animate-ping absolute -inset-0" />
              <div className="relative w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-[#1877F2] border border-blue-50">
                <Navigation size={32} className="rotate-45" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/50 flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الوقت المتوقع</p>
                <p className="text-xs font-black text-[#050505]">١٥ دقيقة للوصول</p>
              </div>
            </div>
          </div>
        </section>

        {/* Status Steps */}
        <section className="space-y-6 px-2">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">حالة الطلب</h3>
          <div className="relative space-y-8">
            <div className="absolute top-0 right-6 bottom-0 w-1 bg-gray-100 rounded-full" />
            <div 
              className="absolute top-0 right-6 w-1 bg-[#1877F2] rounded-full transition-all duration-1000" 
              style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-6 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                  i <= currentStepIndex ? "bg-[#1877F2] text-white scale-110" : "bg-white text-gray-300 border border-gray-100"
                }`}>
                  <step.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-black ${i <= currentStepIndex ? "text-[#050505]" : "text-gray-300"}`}>
                    {step.label}
                  </h4>
                  {i === currentStepIndex && (
                    <p className="text-[10px] font-bold text-[#1877F2] uppercase tracking-widest">جاري الآن...</p>
                  )}
                </div>
                {i < currentStepIndex && (
                  <CheckCircle2 size={20} className="text-emerald-500" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Professional Card */}
        <section className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex gap-5 group">
          <div className="w-20 h-20 rounded-[28px] overflow-hidden shadow-md border border-gray-50 flex-shrink-0">
            <img src={pro.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={pro.name} referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-[#050505]">{pro.name}</h3>
              {pro.isVerified && <ShieldCheck size={16} className="text-blue-500" />}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{pro.specialty}</p>
            <div className="flex gap-2 pt-2">
              <button className="w-10 h-10 bg-blue-50 text-[#1877F2] rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-all">
                <Phone size={18} />
              </button>
              <button className="w-10 h-10 bg-blue-50 text-[#1877F2] rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-all">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Live Updates Info */}
        <section className="bg-emerald-50 p-6 rounded-[32px] flex items-start gap-4 border border-emerald-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm flex-shrink-0">
            <Zap size={20} />
          </div>
          <p className="text-[10px] font-bold text-emerald-700 leading-relaxed">يتم تحديث الموقع والحالة بشكل فوري. يمكنك التواصل مع الفني مباشرة في حال وجود أي استفسار.</p>
        </section>
      </main>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex gap-4">
          <button 
            onClick={() => navigate(`/services/details/${booking.id}`)}
            className="flex-1 py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Info size={24} />
            <span>تفاصيل الحجز</span>
          </button>
        </div>
      </div>
    </div>
  );
}
