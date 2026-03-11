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
  Zap
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMedical } from "@/src/context/MedicalContext";

export default function DoctorBookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { doctors } = useMedical();
  const doc = doctors.find(d => d.id === id) || doctors[0];

  const [selectedType, setSelectedType] = useState<"clinic" | "video">("clinic");
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("");

  const handleConfirm = () => {
    if (!selectedSlot) return;
    navigate(`/medical/checkout?docId=${doc.id}&type=${selectedType}&day=${doc.availability[selectedDay].day}&slot=${selectedSlot}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-40">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">حجز موعد</h1>
      </header>

      <main className="p-6 space-y-10">
        {/* Doctor Summary */}
        <section className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex gap-5 group">
          <div className="w-20 h-20 rounded-[28px] overflow-hidden shadow-md border border-gray-50 flex-shrink-0">
            <img src={doc.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={doc.name} referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-[#050505]">{doc.name}</h3>
              <ShieldCheck size={16} className="text-blue-500" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{doc.specialty}</p>
          </div>
        </section>

        {/* Appointment Type */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">نوع الكشف</h4>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "clinic", label: "في العيادة", icon: Building2, price: doc.price },
              { id: "video", label: "مكالمة فيديو", icon: Video, price: doc.price - 50 },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as any)}
                className={`p-6 rounded-[32px] border transition-all flex flex-col items-center gap-3 group ${
                  selectedType === type.id 
                  ? "bg-[#1E90FF] text-white border-[#1E90FF] shadow-xl shadow-blue-100" 
                  : "bg-white text-gray-700 border-gray-50 hover:border-blue-200 shadow-sm"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                  selectedType === type.id ? "bg-white/20" : "bg-blue-50 text-[#1E90FF]"
                }`}>
                  <type.icon size={24} />
                </div>
                <div className="text-center">
                  <span className="font-black text-sm block">{type.label}</span>
                  <span className={`text-[10px] font-bold ${selectedType === type.id ? "text-white/70" : "text-gray-400"}`}>
                    {type.price} ج.م
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Date Selection */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">اختر اليوم</h4>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {doc.availability.map((day, i) => (
              <button
                key={i}
                onClick={() => { setSelectedDay(i); setSelectedSlot(""); }}
                className={`min-w-[100px] p-5 rounded-[28px] border transition-all flex flex-col items-center gap-1 ${
                  selectedDay === i 
                  ? "bg-[#1E90FF] text-white border-[#1E90FF] shadow-lg shadow-blue-100" 
                  : "bg-white text-gray-700 border-gray-50 hover:border-blue-200 shadow-sm"
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">مارس</span>
                <span className="text-xl font-black">{20 + i}</span>
                <span className="text-[10px] font-black">{day.day}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Time Selection */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">اختر الوقت</h4>
          <div className="grid grid-cols-3 gap-3">
            {doc.availability[selectedDay].slots.map((slot, i) => (
              <button
                key={i}
                onClick={() => setSelectedSlot(slot)}
                className={`py-4 rounded-2xl text-xs font-black transition-all border ${
                  selectedSlot === slot 
                  ? "bg-[#1E90FF] text-white border-[#1E90FF] shadow-md" 
                  : "bg-white text-gray-500 border-gray-50 hover:border-blue-200 shadow-sm"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </section>

        {/* Info Note */}
        <section className="bg-blue-50 p-6 rounded-[32px] flex items-start gap-4 border border-blue-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1E90FF] shadow-sm flex-shrink-0">
            <Zap size={20} />
          </div>
          <p className="text-[10px] font-bold text-blue-700 leading-relaxed">يرجى الحضور قبل الموعد بـ ١٥ دقيقة لإنهاء إجراءات التسجيل في الاستقبال.</p>
        </section>
      </main>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handleConfirm}
            disabled={!selectedSlot}
            className={`w-full py-5 bg-[#1E90FF] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all ${
              !selectedSlot ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span>تأكيد الموعد</span>
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
