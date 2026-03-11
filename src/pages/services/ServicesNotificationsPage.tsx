import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Hammer, 
  Zap, 
  ShieldCheck, 
  ChevronLeft, 
  ArrowLeft,
  Trash2,
  MoreVertical,
  Calendar,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ServicesNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: 1, title: "تم تأكيد حجزك", body: "تم تأكيد حجز خدمة 'تركيب باب خشب' مع أحمد النجار.", time: "منذ ٥ دقائق", type: "booking", isRead: false },
    { id: 2, title: "الفني في الطريق", body: "محمود السباك في طريقه إليك الآن. الوقت المتوقع للوصول ١٥ دقيقة.", time: "منذ ساعة", type: "tracking", isRead: false },
    { id: 3, title: "عرض خاص لك!", body: "خصم ٢٠٪ على خدمات الكهرباء هذا الأسبوع. استخدم الكود: ELEC20", time: "منذ ٣ ساعات", type: "promo", isRead: true },
    { id: 4, title: "قيم تجربتك", body: "كيف كانت خدمتك مع سيد الكهربائي؟ شاركنا رأيك الآن.", time: "منذ يوم", type: "rating", isRead: true },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "booking": return { icon: Calendar, color: "bg-blue-100 text-[#1877F2]" };
      case "tracking": return { icon: Zap, color: "bg-amber-100 text-amber-600" };
      case "promo": return { icon: Star, color: "bg-purple-100 text-purple-600" };
      case "rating": return { icon: MessageSquare, color: "bg-emerald-100 text-emerald-600" };
      default: return { icon: Bell, color: "bg-gray-100 text-gray-600" };
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
            >
              <ArrowRight size={24} />
            </button>
            <h1 className="text-xl font-black text-[#050505]">الإشعارات</h1>
          </div>
          <button 
            onClick={markAllAsRead}
            className="text-xs font-black text-[#1877F2] bg-blue-50 px-4 py-2 rounded-xl active:scale-95 transition-all"
          >
            تحديد الكل كمقروء
          </button>
        </div>
      </header>

      <main className="p-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.map((notif) => {
              const { icon: Icon, color } = getIcon(notif.type);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: 50 }}
                  key={notif.id}
                  className={`bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 flex gap-5 group relative transition-all ${
                    !notif.isRead ? "border-r-4 border-r-[#1877F2]" : ""
                  }`}
                >
                  <div className={`w-14 h-14 ${color} rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-black transition-colors ${
                        !notif.isRead ? "text-[#050505]" : "text-gray-500"
                      }`}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-bold">{notif.body}</p>
                    
                    <div className="pt-3 flex gap-3">
                      <button className="text-[10px] font-black text-[#1877F2] bg-blue-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all">عرض التفاصيل</button>
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  {!notif.isRead && (
                    <div className="absolute top-5 left-5 w-2.5 h-2.5 bg-[#1877F2] rounded-full shadow-lg shadow-blue-100" />
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                <Bell size={64} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#050505]">لا توجد إشعارات</h3>
                <p className="text-sm text-gray-400">سنقوم بتنبيهك عند وجود أي تحديثات جديدة.</p>
              </div>
              <button 
                onClick={() => navigate("/services")}
                className="px-10 py-4 bg-[#1877F2] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 active:scale-95 transition-all"
              >
                استكشف الخدمات
              </button>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function MessageSquare({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
