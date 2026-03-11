import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronLeft, 
  ArrowLeft,
  Hammer,
  ShieldCheck,
  Zap,
  MoreVertical,
  Navigation,
  Phone,
  MessageSquare,
  Star,
  RotateCcw,
  Search,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function ServiceHistoryPage() {
  const navigate = useNavigate();
  const { bookings, professionals } = useServices();
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");

  const currentBookings = bookings.filter(b => b.status !== "completed" && b.status !== "cancelled");
  const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

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
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
            >
              <ArrowRight size={24} />
            </button>
            <h1 className="text-xl font-black text-[#050505]">سجل الخدمات</h1>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab("current")}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "current" ? "bg-white text-[#1877F2] shadow-sm" : "text-gray-400"
              }`}
            >
              الحالية
            </button>
            <button 
              onClick={() => setActiveTab("past")}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "past" ? "bg-white text-[#1877F2] shadow-sm" : "text-gray-400"
              }`}
            >
              السابقة
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "current" ? (
            <motion.div
              key="current"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {currentBookings.length > 0 ? (
                currentBookings.map((booking) => {
                  const pro = professionals.find(p => p.id === booking.professionalId) || professionals[0];
                  return (
                    <div 
                      key={booking.id} 
                      onClick={() => navigate(`/services/tracking/${booking.id}`)}
                      className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 space-y-6 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">#{booking.id}</span>
                      </div>

                      <div className="flex gap-5">
                        <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center text-[#1877F2] flex-shrink-0 shadow-inner">
                          <Hammer size={32} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-black text-[#050505]">{booking.serviceName}</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pro.name}</p>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 pt-1">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{booking.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button className="flex-1 py-4 bg-[#1877F2] text-white rounded-[24px] font-black text-xs shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                          <Navigation size={16} />
                          <span>تتبع الحالة</span>
                        </button>
                        <button className="w-14 h-14 bg-gray-50 text-gray-500 rounded-[24px] flex items-center justify-center shadow-inner border border-gray-100 active:scale-95 transition-all">
                          <Phone size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                    <Zap size={64} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-[#050505]">لا توجد طلبات حالية</h3>
                    <p className="text-sm text-gray-400">ابدأ بحجز خدمتك الأولى الآن واستمتع بأفضل تجربة.</p>
                  </div>
                  <button 
                    onClick={() => navigate("/services")}
                    className="px-10 py-4 bg-[#1877F2] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 active:scale-95 transition-all"
                  >
                    استكشف الخدمات
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="past"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {pastBookings.map((booking) => {
                const pro = professionals.find(p => p.id === booking.professionalId) || professionals[0];
                return (
                  <div key={booking.id} className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 space-y-6 opacity-80 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-gray-50">
                          <img src={pro.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <h3 className="font-black text-[#050505]">{booking.serviceName}</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pro.name}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-emerald-600">{booking.totalPrice} ج.م</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span>مكتمل</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => navigate(`/services/booking/${pro.id}`)}
                        className="flex-1 py-4 bg-gray-50 text-[#1877F2] rounded-[24px] font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <RotateCcw size={16} />
                        <span>إعادة حجز</span>
                      </button>
                      <button 
                        onClick={() => navigate(`/services/rating/${booking.id}`)}
                        className="flex-1 py-4 bg-blue-50 text-[#1877F2] rounded-[24px] font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <Star size={16} />
                        <span>تقييم</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
