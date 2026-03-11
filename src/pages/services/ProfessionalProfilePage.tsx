import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  LayoutGrid, 
  MessageSquare, 
  Info, 
  Share2, 
  Heart, 
  Hammer, 
  ChevronLeft,
  ArrowLeft,
  Phone,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function ProfessionalProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { professionals } = useServices();
  const pro = professionals.find(p => p.id === id) || professionals[0];
  const [activeTab, setActiveTab] = useState("services");

  const services = [
    { id: "s1", name: "تأسيس سباكة كامل", price: 2500, duration: "٣-٥ أيام" },
    { id: "s2", name: "صيانة أعطال طارئة", price: 150, duration: "١-٢ ساعة" },
    { id: "s3", name: "تركيب خلاطات ومغاسل", price: 300, duration: "٢-٤ ساعات" },
  ];

  const reviews = [
    { id: 1, user: "محمد علي", rating: 5, comment: "فني شاطر جداً ومواعيده دقيقة. أنصح بالتعامل معه.", date: "منذ يومين" },
    { id: 2, user: "سارة أحمد", rating: 4, comment: "تجربة جيدة، السعر معقول والعمل نظيف.", date: "منذ أسبوع" },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-32">
      {/* Cover & Header */}
      <div className="relative h-72">
        <img src={pro.portfolio[0]} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Controls */}
        <div className="absolute top-12 left-6 right-6 flex items-center justify-between z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all"
          >
            <ArrowRight size={24} />
          </button>
          <div className="flex gap-3">
            <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all">
              <Share2 size={24} />
            </button>
            <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all">
              <Heart size={24} />
            </button>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-8 left-8 right-8 flex items-end gap-6">
          <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
            <img src={pro.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 text-white pb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black">{pro.name}</h1>
              {pro.isVerified && <ShieldCheck size={20} className="text-blue-400" />}
            </div>
            <div className="flex items-center gap-4 text-xs font-bold opacity-80">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span>{pro.rating} ({pro.reviewsCount} تقييم)</span>
              </div>
              <div className="flex items-center gap-1">
                <Hammer size={14} />
                <span>{pro.worksCount} عمل مكتمل</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>١٠ سنوات خبرة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-8 sticky top-0 bg-white z-20 border-b border-gray-50 rounded-b-[40px] shadow-sm">
        <div className="flex gap-8">
          {[
            { id: "services", label: "الخدمات", icon: Hammer },
            { id: "portfolio", label: "الأعمال", icon: LayoutGrid },
            { id: "reviews", label: "المراجعات", icon: MessageSquare },
            { id: "info", label: "معلومات", icon: Info },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 flex items-center gap-2 transition-all relative ${
                activeTab === tab.id ? "text-[#1877F2] font-black" : "text-gray-400 font-bold"
              }`}
            >
              <tab.icon size={18} />
              <span className="text-sm">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877F2] rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {services.map((service) => (
                <div key={service.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex items-center justify-between group">
                  <div className="space-y-1">
                    <h3 className="font-black text-[#050505] group-hover:text-[#1877F2] transition-colors">{service.name}</h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400" />
                        <span>خدمة متميزة</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left space-y-2">
                    <p className="text-lg font-black text-[#1877F2]">{service.price} ج.م</p>
                    <button 
                      onClick={() => navigate(`/services/booking/${pro.id}?service=${service.name}&price=${service.price}`)}
                      className="px-6 py-2 bg-gray-50 text-[#1877F2] rounded-xl font-black text-[10px] group-hover:bg-[#1877F2] group-hover:text-white transition-all shadow-sm"
                    >
                      حجز
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "portfolio" && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 gap-4"
            >
              {pro.portfolio.map((img, i) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={i}
                  className="aspect-square rounded-[32px] overflow-hidden shadow-md border border-white cursor-pointer"
                  onClick={() => navigate(`/services/portfolio/${pro.id}`)}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 p-8 rounded-[40px] flex flex-col items-center text-center space-y-3">
                <h3 className="text-4xl font-black text-[#1877F2]">{pro.rating}</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={20} className={s <= Math.floor(pro.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                  ))}
                </div>
                <p className="text-xs font-bold text-gray-400">بناءً على {pro.reviewsCount} مراجعة</p>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400">
                          {review.user[0]}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-[#050505]">{review.user}</h4>
                          <p className="text-[10px] font-bold text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-100"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-black text-[#050505]">عن الفني</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{pro.bio}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-[#050505]">تفاصيل التواصل</h3>
                <div className="bg-white rounded-[32px] overflow-hidden border border-gray-50 shadow-sm">
                  <div className="flex items-center gap-4 p-5 border-b border-gray-50">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1877F2]">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الموقع</p>
                      <p className="text-sm font-black text-[#050505]">{pro.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 border-b border-gray-50">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1877F2]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ساعات العمل</p>
                      <p className="text-sm font-black text-[#050505]">٠٩:٠٠ ص - ٠٩:٠٠ م</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1877F2]">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">التوثيق</p>
                      <p className="text-sm font-black text-[#050505]">فني موثق ومعتمد</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex gap-4">
          <button className="w-16 h-16 bg-gray-50 text-[#1877F2] rounded-[24px] flex items-center justify-center shadow-inner border border-gray-100 active:scale-95 transition-all">
            <Phone size={28} />
          </button>
          <button 
            onClick={() => navigate(`/services/booking/${pro.id}`)}
            className="flex-1 py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Calendar size={24} />
            <span>حجز خدمة الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
}
