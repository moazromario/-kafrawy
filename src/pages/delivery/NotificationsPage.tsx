import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Bell, 
  ShoppingBag, 
  Tag, 
  Clock, 
  Calendar,
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: "status",
      title: "طلبك في الطريق!",
      message: "المندوب محمد الكفراوي استلم طلبك وهو الآن في طريقه إليك.",
      time: "منذ دقيقتين",
      icon: Clock,
      color: "bg-blue-100 text-blue-600",
      isRead: false
    },
    {
      id: 2,
      type: "offer",
      title: "عرض خاص: خصم 30% 🍕",
      message: "استخدم كود PIZZA30 واحصل على خصم فوري على جميع أنواع البيتزا اليوم.",
      time: "منذ ساعة",
      icon: Tag,
      color: "bg-orange-100 text-orange-600",
      isRead: false
    },
    {
      id: 3,
      type: "order",
      title: "تم تأكيد طلبك #1024",
      message: "مطعم برجر كينج بدأ في تحضير وجبتك المفضلة.",
      time: "منذ 3 ساعات",
      icon: ShoppingBag,
      color: "bg-emerald-100 text-emerald-600",
      isRead: true
    },
    {
      id: 4,
      type: "status",
      title: "تم توصيل الطلب بنجاح",
      message: "شكراً لثقتك في كفراوي جو. نتمنى أن تستمتع بوجبتك!",
      time: "أمس",
      icon: CheckCircle2,
      color: "bg-gray-100 text-gray-600",
      isRead: true
    },
    {
      id: 5,
      type: "alert",
      title: "تحديث في سياسة الخدمة",
      message: "لقد قمنا بتحديث شروط الخدمة لضمان تجربة أفضل لجميع المستخدمين.",
      time: "منذ يومين",
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
      isRead: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
          >
            <ArrowRight size={20} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">الإشعارات</h1>
        </div>
        <button className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
          <Trash2 size={20} />
        </button>
      </header>

      <main className="p-4 space-y-4">
        {/* Upcoming Reminders Link */}
        <button 
          onClick={() => navigate("/delivery/reminders")}
          className="w-full p-6 bg-[#1877F2] rounded-[32px] text-white flex items-center justify-between shadow-xl shadow-blue-100 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Calendar className="text-white" size={24} />
            </div>
            <div className="text-right">
              <h3 className="font-black text-sm">تذكيرات الطلبات القادمة</h3>
              <p className="text-[10px] font-bold opacity-80">لديك 3 طلبات مجدولة قريباً</p>
            </div>
          </div>
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center justify-between px-2 mb-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الأحدث</p>
          <button className="text-xs font-black text-[#1877F2]">تحديد الكل كمقروء</button>
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={notif.id}
              className={`bg-white p-5 rounded-[28px] shadow-sm border transition-all flex gap-4 relative group cursor-pointer ${
                notif.isRead ? "border-gray-50" : "border-blue-100 bg-blue-50/20"
              }`}
            >
              {!notif.isRead && (
                <div className="absolute top-5 left-5 w-2 h-2 bg-[#1877F2] rounded-full" />
              )}
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                <notif.icon size={28} />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-black text-sm ${notif.isRead ? "text-gray-700" : "text-[#050505]"}`}>
                    {notif.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  {notif.message}
                </p>
                <p className="text-[10px] font-bold text-gray-400 pt-1">
                  {notif.time}
                </p>
              </div>

              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft size={16} className="text-gray-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State Illustration Placeholder */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Bell size={48} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">لا توجد إشعارات</h3>
              <p className="text-sm text-gray-400">سنقوم بتنبيهك عند وجود تحديثات جديدة</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
