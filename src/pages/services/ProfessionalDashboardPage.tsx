import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  LayoutGrid, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronLeft, 
  ArrowLeft,
  Hammer,
  Wallet,
  TrendingUp,
  MessageSquare,
  Bell,
  User,
  MoreVertical,
  Navigation,
  Phone,
  ShieldCheck,
  Star,
  Zap,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function ProfessionalDashboardPage() {
  const navigate = useNavigate();
  const { bookings, professionals } = useServices();
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  // Mock professional data (the logged-in professional)
  const pro = professionals[0];
  const earnings = 4500;
  const completedJobs = 120;
  const rating = 4.9;

  const activeBookings = bookings.filter(b => b.status !== "completed" && b.status !== "cancelled");
  const completedBookings = bookings.filter(b => b.status === "completed");

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
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-gray-50">
              <img src={pro.image} className="w-full h-full object-cover" alt={pro.name} referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#050505]">{pro.name}</h1>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#1877F2] uppercase tracking-widest">
                <ShieldCheck size={12} />
                <span>فني موثق</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 border border-gray-100">
              <Bell size={24} />
            </button>
            <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 border border-gray-100">
              <MoreVertical size={24} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 p-4 rounded-[28px] border border-blue-100 text-center space-y-1">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">الأرباح</p>
            <p className="text-sm font-black text-[#1877F2]">{earnings} ج.م</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-[28px] border border-amber-100 text-center space-y-1">
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">التقييم</p>
            <div className="flex items-center justify-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <p className="text-sm font-black text-amber-600">{rating}</p>
            </div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-[28px] border border-emerald-100 text-center space-y-1">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">الأعمال</p>
            <p className="text-sm font-black text-emerald-600">{completedJobs}</p>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Active Jobs Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-[#050505]">الطلبات الحالية</h2>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab("active")}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  activeTab === "active" ? "bg-white text-[#1877F2] shadow-sm" : "text-gray-400"
                }`}
              >
                نشط
              </button>
              <button 
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  activeTab === "completed" ? "bg-white text-[#1877F2] shadow-sm" : "text-gray-400"
                }`}
              >
                مكتمل
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "active" ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {activeBookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 space-y-6 group">
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
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                          <MapPin size={12} className="text-[#1877F2]" />
                          <span>{booking.address}</span>
                        </div>
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
                        <span>تحديث الحالة</span>
                      </button>
                      <button className="w-14 h-14 bg-gray-50 text-gray-500 rounded-[24px] flex items-center justify-center shadow-inner border border-gray-100 active:scale-95 transition-all">
                        <Phone size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {completedBookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 space-y-4 opacity-80">
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-[#050505]">{booking.serviceName}</h3>
                      <span className="text-sm font-black text-emerald-600">+{booking.totalPrice} ج.م</span>
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
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Earnings Overview */}
        <section className="space-y-6">
          <h2 className="text-lg font-black text-[#050505] px-2">نظرة عامة على الأرباح</h2>
          <div className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex items-end justify-between h-40 gap-3">
              {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className={`w-full rounded-t-2xl transition-all ${
                      i === 3 ? "bg-[#1877F2] shadow-lg shadow-blue-100" : "bg-gray-100"
                    }`}
                  />
                  <span className="text-[10px] font-black text-gray-300">ي{i+1}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1877F2]">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">نمو الأرباح</p>
                  <p className="text-sm font-black text-[#050505]">+١٥٪ هذا الأسبوع</p>
                </div>
              </div>
              <button className="text-xs font-black text-[#1877F2] bg-blue-50 px-4 py-2 rounded-xl">التفاصيل</button>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation (Floating) */}
      <nav className="fixed bottom-8 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/50 h-20 rounded-[32px] shadow-2xl z-40 flex items-center justify-around px-4">
        {[
          { icon: LayoutGrid, label: "لوحة التحكم", path: "/services/dashboard", active: true },
          { icon: Calendar, label: "الطلبات", path: "/services/dashboard/orders" },
          { icon: Wallet, label: "المحفظة", path: "/services/dashboard/wallet" },
          { icon: User, label: "الملف الشخصي", path: "/services/profile" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-all ${
              item.active ? "text-[#1877F2]" : "text-gray-400"
            }`}
          >
            <item.icon size={24} strokeWidth={item.active ? 2.5 : 2} />
            <span className="text-[10px] font-black">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
