import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  ChevronLeft, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Info,
  Zap,
  MoreVertical,
  Navigation,
  Phone,
  MessageSquare,
  Star,
  RotateCcw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMedical } from "@/src/context/MedicalContext";

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const { appointments, doctors } = useMedical();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingAppointments = appointments.filter(a => a.status === "upcoming");
  const pastAppointments = appointments.filter(a => a.status === "past");

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
            >
              <ArrowRight size={24} />
            </button>
            <h1 className="text-xl font-black text-[#050505]">مواعيدي</h1>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "upcoming" ? "bg-white text-[#1E90FF] shadow-sm" : "text-gray-400"
              }`}
            >
              القادمة
            </button>
            <button 
              onClick={() => setActiveTab("past")}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "past" ? "bg-white text-[#1E90FF] shadow-sm" : "text-gray-400"
              }`}
            >
              السابقة
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "upcoming" ? (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((app) => {
                  const doc = doctors.find(d => d.id === app.doctorId) || doctors[0];
                  return (
                    <div key={app.id} className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 space-y-6 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-[24px] overflow-hidden shadow-md border border-gray-50">
                            <img src={doc.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-[#050505]">{app.doctorName}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{app.specialty}</p>
                          </div>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                          app.type === "clinic" ? "bg-blue-50 text-[#1E90FF]" : "bg-purple-50 text-purple-600"
                        }`}>
                          {app.type === "clinic" ? <Building2 size={24} /> : <Video size={24} />}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-[28px] border border-gray-100">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-[#1E90FF]" />
                          <span className="text-xs font-black text-[#050505]">{app.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock size={18} className="text-[#1E90FF]" />
                          <span className="text-xs font-black text-[#050505]">{app.time}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-[#1E90FF] text-white rounded-[24px] font-black text-xs shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                          <Navigation size={16} />
                          <span>تتبع الموقع</span>
                        </button>
                        <button 
                          onClick={() => navigate(`/medical/chat/${doc.id}`)}
                          className="w-14 h-14 bg-blue-50 text-[#1E90FF] rounded-[24px] flex items-center justify-center shadow-inner border border-blue-100 active:scale-95 transition-all"
                        >
                          <MessageSquare size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                    <Calendar size={64} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-[#050505]">لا توجد مواعيد قادمة</h3>
                    <p className="text-sm text-gray-400">ابدأ بحجز موعدك الأول الآن واستمتع بأفضل رعاية طبية.</p>
                  </div>
                  <button 
                    onClick={() => navigate("/medical/search")}
                    className="px-10 py-4 bg-[#1E90FF] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 active:scale-95 transition-all"
                  >
                    ابحث عن طبيب
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
              {pastAppointments.map((app) => {
                const doc = doctors.find(d => d.id === app.doctorId) || doctors[0];
                return (
                  <div key={app.id} className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 space-y-6 opacity-80 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-gray-50">
                          <img src={doc.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <h3 className="font-black text-[#050505]">{app.doctorName}</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{app.specialty}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-emerald-600">{app.price} ج.م</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{app.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span>مكتمل</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => navigate(`/medical/booking/${doc.id}`)}
                        className="flex-1 py-4 bg-gray-50 text-[#1E90FF] rounded-[24px] font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <RotateCcw size={16} />
                        <span>إعادة حجز</span>
                      </button>
                      <button 
                        onClick={() => navigate(`/medical/rate/${app.id}`)}
                        className="flex-1 py-4 bg-blue-50 text-[#1E90FF] rounded-[24px] font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
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
