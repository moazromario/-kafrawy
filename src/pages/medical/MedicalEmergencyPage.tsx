import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Phone, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  ArrowLeft,
  Stethoscope,
  Hospital,
  Building2,
  AlertTriangle,
  Heart,
  Activity,
  Plus,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MedicalEmergencyPage() {
  const navigate = useNavigate();

  const emergencyNumbers = [
    { id: 1, name: "الإسعاف", number: "١٢٣", icon: Zap, color: "bg-red-50 text-red-500" },
    { id: 2, name: "الشرطة", number: "١٢٢", icon: ShieldCheck, color: "bg-blue-50 text-[#1E90FF]" },
    { id: 3, name: "المطافئ", number: "١٨٠", icon: Zap, color: "bg-amber-50 text-amber-600" },
  ];

  const nearbyHospitals = [
    { id: "h1", name: "مستشفى العبور التخصصي", distance: "١.٥ كم", time: "٥ دقائق", phone: "٠١٢٣٤٥٦٧٨٩" },
    { id: "h2", name: "مركز كفراوي الطبي", distance: "٢.٢ كم", time: "٨ دقائق", phone: "٠١٢٣٤٥٦٧٨٩" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">الطوارئ</h1>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* SOS Button */}
        <section className="flex flex-col items-center justify-center py-10 space-y-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-48 h-48 bg-red-500 text-white rounded-full flex flex-col items-center justify-center shadow-2xl shadow-red-200 relative group"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-red-500 rounded-full opacity-20"
            />
            <AlertTriangle size={64} className="mb-2" />
            <span className="text-2xl font-black tracking-widest">SOS</span>
          </motion.button>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-[#050505]">طلب مساعدة فورية</h2>
            <p className="text-sm font-bold text-gray-400">سيتم إرسال موقعك الحالي لجهات الطوارئ</p>
          </div>
        </section>

        {/* Emergency Numbers */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">أرقام الطوارئ</h3>
          <div className="grid grid-cols-3 gap-4">
            {emergencyNumbers.map((num) => (
              <button
                key={num.id}
                className={`p-6 rounded-[32px] ${num.color} shadow-sm border border-gray-50 flex flex-col items-center gap-3 active:scale-95 transition-all`}
              >
                <num.icon size={24} />
                <div className="text-center">
                  <span className="text-[10px] font-black block">{num.name}</span>
                  <span className="text-lg font-black">{num.number}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Nearby Hospitals */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">أقرب المستشفيات</h3>
          <div className="space-y-4">
            {nearbyHospitals.map((hosp) => (
              <div key={hosp.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-[#1E90FF] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-all">
                    <Hospital size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#050505]">{hosp.name}</h4>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#1E90FF]" />
                        <span>{hosp.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-[#1E90FF]" />
                        <span>{hosp.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100 active:scale-95 transition-all">
                  <Phone size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* First Aid Tips */}
        <section className="bg-blue-50 p-8 rounded-[48px] border border-blue-100 relative overflow-hidden group">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-blue-900">دليل الإسعافات</h3>
              <p className="text-sm font-bold text-blue-700/70">تعلم كيف تتصرف في حالات الطوارئ</p>
              <button className="mt-4 px-6 py-3 bg-[#1E90FF] text-white rounded-2xl font-black text-xs shadow-lg shadow-blue-200 active:scale-95 transition-all">
                عرض الدليل
              </button>
            </div>
            <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center text-[#1E90FF]">
              <Info size={48} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
