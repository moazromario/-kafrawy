import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  MapPin, 
  Stethoscope, 
  Hospital, 
  Building2, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  Star, 
  Bell, 
  MessageSquare, 
  Heart,
  Plus,
  Zap,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMedical } from "@/src/context/MedicalContext";

export default function MedicalHomePage() {
  const navigate = useNavigate();
  const { doctors, appointments } = useMedical();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "doctors", name: "أطباء", icon: Stethoscope, color: "bg-blue-50 text-[#1E90FF]", path: "/medical/search" },
    { id: "hospitals", name: "مستشفيات", icon: Hospital, color: "bg-emerald-50 text-emerald-600", path: "/medical/hospitals" },
    { id: "clinics", name: "عيادات", icon: Building2, color: "bg-purple-50 text-purple-600", path: "/medical/clinics" },
    { id: "services", name: "خدمات", icon: Zap, color: "bg-amber-50 text-amber-600", path: "/medical/services" },
  ];

  const upcomingAppointment = appointments.find(a => a.status === "upcoming");

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#1E90FF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <Plus size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#050505]">كفراوي طبي</h1>
              <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                <MapPin size={12} className="text-[#1E90FF]" />
                <span>مدينة العبور، الحي الأول</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate("/medical/notifications")}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
            >
              <Bell size={20} />
            </button>
            <button 
              onClick={() => navigate("/medical/chats")}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
            >
              <MessageSquare size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E90FF] transition-colors" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => navigate("/medical/search")}
            placeholder="ابحث عن طبيب، تخصص، أو مستشفى..."
            className="w-full pr-12 pl-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all placeholder:text-gray-400 shadow-inner"
          />
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Upcoming Appointment Highlight */}
        {upcomingAppointment && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1E90FF] p-6 rounded-[32px] text-white shadow-xl shadow-blue-100 relative overflow-hidden group cursor-pointer"
            onClick={() => navigate("/medical/appointments")}
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar size={16} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">موعدك القادم</span>
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black">
                  بعد يومين
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/30">
                  <img src={doctors.find(d => d.id === upcomingAppointment.doctorId)?.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="text-lg font-black">{upcomingAppointment.doctorName}</h3>
                  <p className="text-xs font-bold text-white/70">{upcomingAppointment.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-white/70" />
                  <span className="text-xs font-black">{upcomingAppointment.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-white/70" />
                  <span className="text-xs font-black">العيادة</span>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Categories */}
        <section className="grid grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(cat.path)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={`w-16 h-16 ${cat.color} rounded-[24px] flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300 group-active:scale-95`}>
                <cat.icon size={28} />
              </div>
              <span className="text-xs font-black text-[#050505]">{cat.name}</span>
            </button>
          ))}
        </section>

        {/* Featured Doctors */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-[#050505]">أطباء متميزون</h2>
            <button 
              onClick={() => navigate("/medical/search")}
              className="text-sm font-bold text-[#1E90FF] flex items-center gap-1"
            >
              عرض الكل <ArrowRight size={16} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {doctors.map((doc) => (
              <motion.div
                key={doc.id}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/medical/profile/${doc.id}`)}
                className="min-w-[200px] bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 space-y-4 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-full aspect-square rounded-[24px] overflow-hidden shadow-md">
                    <img src={doc.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={doc.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black text-[#050505]">{doc.rating}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#050505] truncate">{doc.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{doc.specialty}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-xs font-black text-[#1E90FF]">{doc.price} ج.م</span>
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#1E90FF]">
                    <Plus size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Health Offers */}
        <section className="bg-emerald-50 p-8 rounded-[48px] border border-emerald-100 relative overflow-hidden group">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black w-fit">
                عرض محدود
              </div>
              <h3 className="text-xl font-black text-emerald-900">كشف مجاني</h3>
              <p className="text-sm font-bold text-emerald-700/70">على أول كشف أونلاين اليوم</p>
              <button className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-200 active:scale-95 transition-all">
                احجز الآن
              </button>
            </div>
            <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center text-emerald-600">
              <Zap size={48} />
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-8 py-4 flex justify-between items-center z-40 rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        {[
          { icon: Stethoscope, label: "الرئيسية", path: "/medical", active: true },
          { icon: Calendar, label: "مواعيدي", path: "/medical/appointments" },
          { icon: Heart, label: "صحتي", path: "/medical/records" },
          { icon: Bell, label: "حسابي", path: "/medical/settings" },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-all ${
              item.active ? "text-[#1E90FF] scale-110" : "text-gray-400 hover:text-gray-600"
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
