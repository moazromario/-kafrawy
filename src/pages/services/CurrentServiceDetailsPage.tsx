import React from "react";
import { motion } from "motion/react";
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
  Navigation
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function CurrentServiceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { bookings, professionals } = useServices();
  const booking = bookings.find(b => b.id === id) || bookings[0];
  const pro = professionals.find(p => p.id === booking.professionalId) || professionals[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-50 text-blue-600 border-blue-100";
      case "on_the_way": return "bg-amber-50 text-amber-600 border-amber-100";
      case "in_progress": return "bg-purple-50 text-purple-600 border-purple-100";
      case "completed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return "تم التأكيد";
      case "on_the_way": return "في الطريق";
      case "in_progress": return "جاري العمل";
      case "completed": return "مكتمل";
      default: return status;
    }
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
        <h1 className="text-xl font-black text-[#050505]">تفاصيل الحجز</h1>
      </header>

      <main className="p-6 space-y-8">
        {/* Status Banner */}
        <section className={`p-8 rounded-[48px] shadow-sm border flex items-center justify-between ${getStatusColor(booking.status)}`}>
          <div className="space-y-1">
            <h2 className="text-xl font-black">{getStatusLabel(booking.status)}</h2>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">رقم الحجز: {booking.id}</p>
          </div>
          <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-[24px] flex items-center justify-center border border-white/20">
            <CheckCircle2 size={32} />
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

        {/* Booking Details */}
        <section className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 space-y-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">تفاصيل الخدمة</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2]">
                <Hammer size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#050505]">{booking.serviceName}</h4>
                <p className="text-[10px] font-bold text-gray-400">السعر: {booking.totalPrice} ج.م</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2]">
                <Calendar size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#050505]">{booking.date}</h4>
                <p className="text-[10px] font-bold text-gray-400">{booking.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2]">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#050505]">موقع الخدمة</h4>
                <p className="text-[10px] font-bold text-gray-400">{booking.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2]">
                <Wallet size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#050505]">طريقة الدفع</h4>
                <p className="text-[10px] font-bold text-gray-400">نقداً عند الانتهاء</p>
              </div>
            </div>
          </div>
        </section>

        {/* Info Box */}
        <section className="bg-blue-50 p-6 rounded-[32px] flex items-start gap-4 border border-blue-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1877F2] shadow-sm flex-shrink-0">
            <Info size={20} />
          </div>
          <p className="text-[10px] font-bold text-blue-700 leading-relaxed">سيصلك إشعار فور تحرك الفني باتجاه موقعك. يرجى التواجد في الموعد المحدد لضمان جودة الخدمة.</p>
        </section>
      </main>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex gap-4">
          <button 
            onClick={() => navigate(`/services/tracking/${booking.id}`)}
            className="flex-1 py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Navigation size={24} />
            <span>تتبع الفني</span>
          </button>
        </div>
      </div>
    </div>
  );
}
