import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Bell, 
  Calendar, 
  MessageSquare, 
  Zap, 
  Clock, 
  CheckCircle2, 
  X, 
  ChevronLeft, 
  Plus, 
  Stethoscope,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MedicalNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: 1, title: "تم تأكيد موعدك", body: "تم تأكيد حجزك مع د. أحمد سمير يوم ٢٠ مارس الساعة ١٠:٠٠ ص.", time: "منذ ٥ دقائق", type: "booking", isRead: false },
    { id: 2, title: "رسالة جديدة من الطبيب", body: "د. سارة محمود أرسلت لك رسالة جديدة بخصوص نتائج التحاليل.", time: "منذ ساعة", type: "chat", isRead: false },
    { id: 3, title: "عرض خاص لك!", body: "خصم ٣٠٪ على خدمات التحاليل والأشعة هذا الأسبوع.", time: "منذ ٣ ساعات", type: "promo", isRead: true },
    { id: 4, title: "تذكير بالدواء", body: "حان موعد تناول دواء 'بانادول' حسب وصفة د. أحمد.", time: "منذ يوم", type: "reminder", isRead: true },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "booking": return <Calendar size={20} />;
      case "chat": return <MessageSquare size={20} />;
      case "promo": return <Zap size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "booking": return "bg-blue-50 text-[#1E90FF]";
      case "chat": return "bg-purple-50 text-purple-600";
      case "promo": return "bg-amber-50 text-amber-600";
      default: return "bg-gray-50 text-gray-400";
    }
  };

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
            <h1 className="text-xl font-black text-[#050505]">الإشعارات</h1>
          </div>
          <button 
            onClick={markAllAsRead}
            className="text-xs font-black text-[#1E90FF] hover:underline"
          >
            تحديد الكل كمقروء
          </button>
        </div>
      </header>

      <main className="p-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex gap-5 relative group transition-all ${
                !notif.isRead ? "border-r-4 border-r-[#1E90FF]" : ""
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${getColor(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#050505]">{notif.title}</h3>
                  <span className="text-[10px] font-bold text-gray-400">{notif.time}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{notif.body}</p>
              </div>
              <button 
                onClick={() => deleteNotification(notif.id)}
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Bell size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#050505]">لا توجد إشعارات</h3>
              <p className="text-sm text-gray-400">كل شيء هادئ هنا. سنخطرك فور وجود أي تحديثات جديدة.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
