import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  Calendar, 
  ChevronLeft, 
  Plus, 
  Zap, 
  Info, 
  Award, 
  Heart,
  Share2,
  CheckCircle2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMedical } from "@/src/context/MedicalContext";

export default function DoctorProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { doctors } = useMedical();
  const doc = doctors.find(d => d.id === id) || doctors[0];

  const [activeTab, setActiveTab] = useState<"about" | "reviews" | "availability">("about");
  const [isFavorite, setIsFavorite] = useState(false);

  const reviews = [
    { id: 1, user: "محمد علي", rating: 5, comment: "دكتور ممتاز جداً ومحترم وشرح الحالة بكل تفصيل. أنصح بالتعامل معه.", date: "منذ يومين" },
    { id: 2, user: "سارة أحمد", rating: 4, comment: "تجربة جيدة، العيادة نظيفة والمواعيد دقيقة.", date: "منذ أسبوع" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-40">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-gray-100 ${
              isFavorite ? "bg-red-50 text-red-500 border-red-100" : "bg-gray-50 text-gray-400"
            }`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Doctor Info Header */}
        <section className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-[40px] overflow-hidden shadow-xl border-4 border-white">
              <img src={doc.image} className="w-full h-full object-cover" alt={doc.name} referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-white shadow-lg">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#050505]">{doc.name}</h1>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{doc.specialty}</p>
          </div>
          <div className="flex items-center gap-6 pt-2">
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#050505]">{doc.rating}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">تقييم</span>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#050505]">{doc.experience}+</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">سنة خبرة</span>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#050505]">{doc.reviewsCount}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">مراجعة</span>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="flex bg-white p-2 rounded-3xl shadow-sm border border-gray-50">
          {[
            { id: "about", label: "عن الدكتور", icon: Info },
            { id: "availability", label: "المواعيد", icon: Clock },
            { id: "reviews", label: "التقييمات", icon: Star },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-black transition-all ${
                activeTab === tab.id 
                ? "bg-[#1E90FF] text-white shadow-lg shadow-blue-100" 
                : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </section>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {activeTab === "about" && (
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-4">
                  <h3 className="text-lg font-black text-[#050505]">نبذة عن الدكتور</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{doc.about}</p>
                </div>
                
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-6">
                  <h3 className="text-lg font-black text-[#050505]">معلومات العيادة</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1E90FF] flex-shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#050505]">{doc.clinicName}</h4>
                        <p className="text-xs font-bold text-gray-400">{doc.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1E90FF] flex-shrink-0">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#050505]">ساعات العمل</h4>
                        <p className="text-xs font-bold text-gray-400">يومياً من ١٠ ص حتى ١٠ م</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "availability" && (
              <div className="space-y-6">
                {doc.availability.map((day, i) => (
                  <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-[#050505]">{day.day}</h3>
                      <span className="text-[10px] font-black text-[#1E90FF] uppercase tracking-widest">متاح</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {day.slots.map((slot, j) => (
                        <button key={j} className="py-3 bg-gray-50 rounded-2xl text-xs font-black text-gray-500 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100">
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                          <Plus size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-[#050505]">{review.user}</h4>
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex gap-4">
          <button 
            onClick={() => navigate(`/medical/chat/${doc.id}`)}
            className="w-16 h-16 bg-blue-50 text-[#1E90FF] rounded-[28px] flex items-center justify-center shadow-sm active:scale-95 transition-all"
          >
            <MessageSquare size={28} />
          </button>
          <button 
            onClick={() => navigate(`/medical/booking/${doc.id}`)}
            className="flex-1 py-5 bg-[#1E90FF] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>حجز موعد</span>
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
