import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Bell, 
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
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function UpcomingServicesRemindersPage() {
  const navigate = useNavigate();
  const { bookings, professionals } = useServices();
  const upcomingBookings = bookings.filter(b => b.status === "confirmed");

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">تنبيهات الحجوزات</h1>
        </div>
        <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 border border-gray-100">
          <Bell size={24} />
        </button>
      </header>

      <main className="p-6 space-y-8">
        {/* Info Banner */}
        <section className="bg-amber-50 p-8 rounded-[48px] flex items-center gap-6 border border-amber-100 shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center text-amber-500 shadow-sm flex-shrink-0">
            <AlertCircle size={32} />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-black text-[#050505]">تذكير هام</h4>
            <p className="text-[10px] font-bold text-amber-700 leading-relaxed">يرجى التواجد في موقع الخدمة قبل الموعد بـ ١٠ دقائق لضمان سير العمل بسلاسة.</p>
          </div>
          <Zap size={64} className="absolute -bottom-4 -right-4 text-amber-200/30 -rotate-12" />
        </section>

        {/* Reminders List */}
        <section className="space-y-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">الحجوزات القادمة</h3>
          <div className="space-y-6">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => {
                const pro = professionals.find(p => p.id === booking.professionalId) || professionals[0];
                return (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={booking.id}
                    className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 space-y-8 group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[24px] overflow-hidden shadow-md border border-gray-50">
                          <img src={pro.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-[#050505]">{pro.name}</h4>
                            {pro.isVerified && <ShieldCheck size={16} className="text-blue-500" />}
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pro.specialty}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 text-center">
                        <p className="text-[10px] font-black text-[#1877F2] uppercase tracking-widest">الموعد</p>
                        <p className="text-xs font-black text-[#050505]">{booking.time}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#1877F2]">
                          <Hammer size={20} />
                        </div>
                        <span className="text-sm font-black text-gray-700">{booking.serviceName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#1877F2]">
                          <Calendar size={20} />
                        </div>
                        <span className="text-sm font-black text-gray-700">{booking.date}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => navigate(`/services/tracking/${booking.id}`)}
                        className="flex-1 py-4 bg-[#1877F2] text-white rounded-[24px] font-black text-xs shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <Navigation size={16} />
                        <span>تتبع الحالة</span>
                      </button>
                      <button className="w-14 h-14 bg-gray-50 text-gray-500 rounded-[24px] flex items-center justify-center shadow-inner border border-gray-100 active:scale-95 transition-all">
                        <Phone size={20} />
                      </button>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-12 -mt-12 blur-2xl" />
                  </motion.div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                  <Calendar size={64} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#050505]">لا توجد حجوزات قادمة</h3>
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
          </div>
        </section>
      </main>
    </div>
  );
}
