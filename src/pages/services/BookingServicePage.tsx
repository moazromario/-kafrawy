import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  ChevronLeft, 
  ArrowLeft,
  Hammer,
  ShieldCheck,
  MapPin
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function BookingServicePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const initialPrice = searchParams.get("price") || "0";
  
  const { professionals } = useServices();
  const pro = professionals.find(p => p.id === id) || professionals[0];

  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");

  const services = [
    { id: "s1", name: "تأسيس سباكة كامل", price: 2500 },
    { id: "s2", name: "صيانة أعطال طارئة", price: 150 },
    { id: "s3", name: "تركيب خلاطات ومغاسل", price: 300 },
  ];

  const dates = [
    { day: "السبت", date: "١٥ مارس" },
    { day: "الأحد", date: "١٦ مارس" },
    { day: "الاثنين", date: "١٧ مارس" },
    { day: "الثلاثاء", date: "١٨ مارس" },
  ];

  const times = ["٠٩:٠٠ ص", "١٠:٠٠ ص", "١١:٠٠ ص", "١٢:٠٠ م", "٠١:٠٠ م", "٠٢:٠٠ م"];

  const handleConfirm = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    navigate(`/services/checkout?proId=${pro.id}&service=${selectedService}&date=${selectedDate}&time=${selectedTime}&price=${initialPrice}`);
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
        <h1 className="text-xl font-black text-[#050505]">حجز خدمة</h1>
      </header>

      <main className="p-6 space-y-10">
        {/* Professional Summary */}
        <section className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex gap-6 group">
          <div className="w-20 h-20 rounded-[28px] overflow-hidden shadow-md border border-gray-50 flex-shrink-0">
            <img src={pro.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={pro.name} referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-[#050505]">{pro.name}</h3>
              {pro.isVerified && <ShieldCheck size={16} className="text-blue-500" />}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{pro.specialty}</p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <MapPin size={12} className="text-[#1877F2]" />
              <span>{pro.location}</span>
            </div>
          </div>
        </section>

        {/* Service Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Hammer size={18} className="text-[#1877F2]" />
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">اختر الخدمة</h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.name)}
                className={`p-5 rounded-[28px] border transition-all flex items-center justify-between group ${
                  selectedService === service.name 
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-xl shadow-blue-100" 
                  : "bg-white text-gray-700 border-gray-50 hover:border-blue-200 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${
                    selectedService === service.name ? "bg-white/20" : "bg-gray-50 text-[#1877F2]"
                  }`}>
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="font-black text-sm">{service.name}</span>
                </div>
                <span className={`text-sm font-black ${selectedService === service.name ? "text-white" : "text-[#1877F2]"}`}>
                  {service.price} ج.م
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Date Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Calendar size={18} className="text-[#1877F2]" />
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">اختر التاريخ</h4>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {dates.map((d) => (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`flex-shrink-0 w-24 p-5 rounded-[28px] border transition-all flex flex-col items-center gap-1 shadow-sm ${
                  selectedDate === d.date 
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-xl shadow-blue-100" 
                  : "bg-white text-gray-700 border-gray-50 hover:border-blue-200"
                }`}
              >
                <span className="text-[10px] font-bold opacity-60">{d.day}</span>
                <span className="text-sm font-black">{d.date}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Time Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Clock size={18} className="text-[#1877F2]" />
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">اختر الوقت</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`p-4 rounded-[24px] border transition-all text-xs font-black shadow-sm ${
                  selectedTime === t 
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-xl shadow-blue-100" 
                  : "bg-white text-gray-700 border-gray-50 hover:border-blue-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <MessageSquare size={18} className="text-[#1877F2]" />
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">ملاحظات إضافية</h4>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="اكتب أي تفاصيل إضافية عن الخدمة المطلوبة..."
            className="w-full p-6 bg-white border border-gray-50 rounded-[32px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-sm min-h-[120px] resize-none"
          />
        </section>
      </main>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto space-y-4">
          {selectedService && (
            <div className="flex items-center justify-between px-4">
              <span className="text-sm font-black text-gray-400">السعر الإجمالي</span>
              <span className="text-xl font-black text-[#1877F2]">
                {services.find(s => s.name === selectedService)?.price || initialPrice} ج.م
              </span>
            </div>
          )}
          <button 
            onClick={handleConfirm}
            disabled={!selectedService || !selectedDate || !selectedTime}
            className={`w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all ${
              (!selectedService || !selectedDate || !selectedTime) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span>تأكيد الحجز</span>
            <CheckCircle2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
