import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Bell, 
  User, 
  Hammer, 
  Droplets, 
  Zap, 
  PaintBucket, 
  Wrench, 
  Truck, 
  Star, 
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  LayoutGrid,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

const categories = [
  { id: "c1", name: "كهرباء", icon: Zap, color: "bg-yellow-100 text-yellow-600" },
  { id: "c2", name: "سباكة", icon: Droplets, color: "bg-blue-100 text-blue-600" },
  { id: "c3", name: "دهان", icon: PaintBucket, color: "bg-purple-100 text-purple-600" },
  { id: "c4", name: "صيانة عامة", icon: Wrench, color: "bg-cyan-100 text-cyan-600" },
  { id: "c5", name: "نقل أثاث", icon: Truck, color: "bg-rose-100 text-rose-600" },
  { id: "c6", name: "نجارة", icon: Hammer, color: "bg-amber-100 text-amber-600" },
];

export default function ServicesHomePage() {
  const navigate = useNavigate();
  const { professionals } = useServices();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <Hammer size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#050505]">كفراوي فنيين</h1>
              <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                <MapPin size={12} className="text-[#1877F2]" />
                <span>مدينة العبور، الحي الأول</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate("/services/notifications")}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
            >
              <Bell size={24} />
            </button>
            <button 
              onClick={() => navigate("/services/profile")}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
            >
              <User size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن سباك، نجار، كهربائي..."
              className="w-full pr-12 pl-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-inner"
            />
          </div>
          <button 
            onClick={() => navigate("/services/filter")}
            className="w-14 h-14 bg-[#1877F2] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            <Filter size={24} />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-10">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-[#050505]">التصنيفات</h2>
            <button 
              onClick={() => navigate("/services/categories")}
              className="text-sm font-bold text-[#1877F2] flex items-center gap-1"
            >
              <span>الكل</span>
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((cat) => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={cat.id}
                onClick={() => navigate(`/services/list?category=${cat.name}`)}
                className="flex flex-col items-center gap-3"
              >
                <div className={`w-16 h-16 ${cat.color} rounded-[24px] flex items-center justify-center shadow-sm border border-white/50`}>
                  <cat.icon size={28} />
                </div>
                <span className="text-xs font-black text-gray-700">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Promotions Banner */}
        <section>
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate("/services/promotions")}
            className="bg-gradient-to-br from-[#1877F2] to-[#0052D4] p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-blue-100 cursor-pointer"
          >
            <div className="relative z-10 space-y-3">
              <div className="bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md text-[10px] font-black uppercase tracking-widest">عرض محدود</div>
              <h3 className="text-2xl font-black leading-tight">خصم ٢٥٪ على أول حجز خدمة لك!</h3>
              <p className="text-white/80 text-xs font-bold">استخدم كود: <span className="text-white font-black">KAFRAOUI25</span></p>
              <button className="mt-4 px-6 py-3 bg-white text-[#1877F2] rounded-xl font-black text-xs shadow-xl active:scale-95 transition-all">احجز الآن</button>
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
          </motion.div>
        </section>

        {/* Featured Professionals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-[#050505]">فنيون متميزون</h2>
            <button 
              onClick={() => navigate("/services/list")}
              className="text-sm font-bold text-[#1877F2] flex items-center gap-1"
            >
              <span>عرض الكل</span>
              <ChevronLeft size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {professionals.map((pro) => (
              <motion.div
                whileHover={{ y: -5 }}
                key={pro.id}
                onClick={() => navigate(`/services/profile/${pro.id}`)}
                className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 flex gap-5 group cursor-pointer"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img 
                    src={pro.image} 
                    className="w-full h-full object-cover rounded-[24px] shadow-md group-hover:scale-105 transition-transform duration-500" 
                    alt={pro.name} 
                    referrerPolicy="no-referrer"
                  />
                  {pro.isVerified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <ShieldCheck size={18} className="text-[#1877F2]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-[#050505] group-hover:text-[#1877F2] transition-colors">{pro.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pro.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black text-amber-600">{pro.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                    <div className="flex items-center gap-1">
                      <LayoutGrid size={12} />
                      <span>{pro.worksCount} عمل</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{pro.pricePerHour} ج.م / ساعة</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <button className="w-full py-2.5 bg-gray-50 text-[#1877F2] rounded-xl font-black text-[10px] group-hover:bg-[#1877F2] group-hover:text-white transition-all">عرض الملف الشخصي</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Upcoming Reminders Preview */}
        <section>
          <div 
            onClick={() => navigate("/services/reminders")}
            className="bg-white p-6 rounded-[32px] border-2 border-dashed border-gray-200 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2]">
                <Calendar size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#050505]">تذكيرات الخدمات القادمة</h4>
                <p className="text-[10px] font-bold text-gray-400">لديك حجز واحد الأسبوع القادم</p>
              </div>
            </div>
            <ChevronLeft size={20} className="text-gray-300 group-hover:text-[#1877F2] transition-all" />
          </div>
        </section>
      </main>

      {/* Bottom Navigation (Floating) */}
      <nav className="fixed bottom-8 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/50 h-20 rounded-[32px] shadow-2xl z-40 flex items-center justify-around px-4">
        {[
          { icon: Hammer, label: "الرئيسية", path: "/services", active: true },
          { icon: LayoutGrid, label: "الخدمات", path: "/services/list" },
          { icon: Calendar, label: "حجوزاتي", path: "/services/history" },
          { icon: User, label: "حسابي", path: "/services/profile" },
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
