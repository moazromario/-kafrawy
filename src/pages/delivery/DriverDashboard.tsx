import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Bike, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  Navigation, 
  Phone, 
  MessageCircle,
  TrendingUp,
  LayoutGrid,
  Settings,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);

  const stats = [
    { label: "الأرباح اليوم", value: "450 ج.م", icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
    { label: "الطلبات", value: "12", icon: Bike, color: "bg-blue-100 text-blue-600" },
    { label: "التقييم", value: "4.9", icon: Star, color: "bg-amber-100 text-amber-600" },
  ];

  const assignedOrders = [
    { id: "1024", store: "برجر كينج كفراوي", customer: "أحمد محمد", distance: "1.2 كم", fee: 25, status: "جاري التوصيل" },
    { id: "1025", store: "بيتزا هت العبور", customer: "سارة علي", distance: "3.5 كم", fee: 40, status: "في انتظار الاستلام" },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 sticky top-0 z-30 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 overflow-hidden border-2 border-[#1877F2] shadow-lg shadow-blue-100">
              <img src="https://picsum.photos/seed/driver/100/100" className="w-full h-full object-cover" alt="Driver" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#050505]">أهلاً، محمد! 👋</h1>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-[#1877F2] animate-pulse" : "bg-gray-300"}`} />
                <span>{isOnline ? "أنت متصل الآن" : "أنت غير متصل"}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate("/delivery/notifications")}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
            >
              <Bell size={24} />
            </button>
            <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700">
              <Settings size={24} />
            </button>
          </div>
        </div>

        {/* Online/Offline Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl border border-gray-100">
          <span className="text-sm font-black text-gray-700">حالة العمل</span>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-16 h-8 rounded-full relative transition-all duration-300 ${isOnline ? "bg-[#1877F2]" : "bg-gray-300"}`}
          >
            <motion.div 
              animate={{ x: isOnline ? 32 : 4 }}
              className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-2">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase">{stat.label}</p>
                <p className="text-sm font-black text-[#050505]">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Assigned Orders */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#050505]">الطلبات المسندة إليك</h2>
            <div className="w-8 h-8 bg-[#1877F2] text-white rounded-full flex items-center justify-center text-xs font-black">
              {assignedOrders.length}
            </div>
          </div>

          <div className="space-y-4">
            {assignedOrders.map((order) => (
              <motion.div
                whileHover={{ y: -4 }}
                key={order.id}
                className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2]">
                      <Bike size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-[#050505]">طلب #{order.id}</h3>
                      <p className="text-xs font-bold text-gray-400">{order.store}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === "جاري التوصيل" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">المسافة</p>
                      <p className="text-xs font-black text-gray-700">{order.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#1877F2]" />
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">ربحك</p>
                      <p className="text-xs font-black text-[#1877F2]">{order.fee} ج.م</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button className="flex-1 py-4 bg-[#1877F2] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all">
                      <Navigation size={18} />
                      <span>ملاحة للعميل</span>
                    </button>
                    <button className="w-14 h-14 bg-gray-50 text-gray-700 rounded-2xl flex items-center justify-center active:scale-95 transition-all">
                      <Phone size={24} />
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
                      <CheckCircle2 size={18} />
                      <span>تم الاستلام</span>
                    </button>
                    <button className="flex-1 py-4 bg-[#050505] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
                      <CheckCircle2 size={18} />
                      <span>تم التوصيل</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Earnings Chart Placeholder */}
        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#050505]">تحليل الأرباح</h2>
            <button className="text-xs font-bold text-[#1877F2]">هذا الأسبوع</button>
          </div>
          <div className="h-40 flex items-end justify-between gap-2 pt-4">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className={`w-full rounded-t-lg ${i === 3 ? "bg-[#1877F2]" : "bg-blue-100"}`}
                />
                <span className="text-[8px] font-bold text-gray-400">{["س", "ح", "ن", "ث", "ر", "خ", "ج"][i]}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 flex justify-around items-center z-30">
        <button className="flex flex-col items-center gap-1 text-[#1877F2]">
          <LayoutGrid size={24} />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <TrendingUp size={24} />
          <span className="text-[10px] font-bold">الأرباح</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Star size={24} />
          <span className="text-[10px] font-bold">التقييمات</span>
        </button>
      </div>
    </div>
  );
}
