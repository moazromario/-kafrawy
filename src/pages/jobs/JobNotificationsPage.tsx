import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Bell, 
  Briefcase, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Trash2, 
  MoreVertical, 
  Settings,
  Stethoscope,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/utils/cn";

const NOTIFICATIONS = [
  { id: 1, title: "وظيفة جديدة تناسب مهاراتك", body: "شركة تكنو سوفت تبحث عن مطور React في الرياض.", type: "job", time: "منذ ١٠ دقائق", read: false, icon: Briefcase, color: "bg-blue-50 text-[#1877F2]" },
  { id: 2, title: "تحديث على طلب التقديم", body: "تمت مراجعة طلبك لوظيفة محاسب مالي في الخليج للاستثمار.", type: "update", time: "منذ ساعة", read: true, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
  { id: 3, title: "عرض تدريبي جديد", body: "باقة تدريبية مكثفة في التسويق الرقمي تبدأ الأسبوع القادم.", type: "training", time: "منذ ٥ ساعات", read: false, icon: Zap, color: "bg-amber-50 text-amber-600" },
  { id: 4, title: "تذكير بموعد مقابلة", body: "لديك مقابلة عمل غداً الساعة ١٠ صباحاً مع شركة ميديا برو.", type: "reminder", time: "منذ يوم", read: true, icon: Clock, color: "bg-purple-50 text-purple-600" },
];

export default function JobNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
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
          <button onClick={() => navigate("/jobs/alerts-settings")} className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:text-[#1877F2] transition-all">
            <Settings size={24} />
          </button>
        </div>

        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">لديك {notifications.filter(n => !n.read).length} إشعارات جديدة</span>
          <button onClick={markAllRead} className="text-xs font-black text-[#1877F2]">تحديد الكل كمقروء</button>
        </div>
      </header>

      <main className="p-6 space-y-4 max-w-xl mx-auto">
        <AnimatePresence mode="popLayout">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex items-start gap-4 group cursor-pointer hover:shadow-md transition-all",
                !notif.read && "border-r-4 border-r-[#1877F2]"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-110 transition-all",
                notif.color
              )}>
                <notif.icon size={20} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className={cn("text-sm font-black text-[#050505]", !notif.read && "text-[#1877F2]")}>{notif.title}</h3>
                  <span className="text-[10px] font-bold text-gray-400">{notif.time}</span>
                </div>
                <p className="text-xs font-bold text-gray-400 leading-relaxed">{notif.body}</p>
                <div className="flex gap-3 pt-2">
                  <button className="text-[10px] font-black text-[#1877F2] hover:underline">عرض التفاصيل</button>
                  <button onClick={() => deleteNotification(notif.id)} className="text-[10px] font-black text-red-400 hover:text-red-500">حذف</button>
                </div>
              </div>
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
              <p className="text-sm text-gray-400">ستظهر هنا إشعارات الوظائف الجديدة وتحديثات طلباتك.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
