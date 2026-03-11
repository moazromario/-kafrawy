import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Bell, 
  ShoppingBag, 
  Tag, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  Trash2,
  Package,
  Zap,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MarketplaceNotificationsPage() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: "order",
      title: "طلبك في الطريق!",
      message: "طلبك رقم ORD-12345 تم شحنه وهو الآن في طريقه إليك.",
      time: "منذ دقيقتين",
      icon: Package,
      color: "bg-blue-100 text-blue-600",
      isRead: false
    },
    {
      id: 2,
      type: "offer",
      title: "عرض الفلاش: خصم 50% ⚡",
      message: "استخدم كود FLASH50 واحصل على خصم فوري على جميع الإلكترونيات اليوم.",
      time: "منذ ساعة",
      icon: Zap,
      color: "bg-amber-100 text-amber-600",
      isRead: false
    },
    {
      id: 3,
      type: "product",
      title: "منتج جديد في متجرك المفضل",
      message: "سوق الإلكترونيات أضاف للتو 'ساعة ذكية Ultra' الجديدة.",
      time: "منذ 3 ساعات",
      icon: ShoppingBag,
      color: "bg-indigo-100 text-indigo-600",
      isRead: true
    },
    {
      id: 4,
      type: "status",
      title: "تم تأكيد طلبك بنجاح",
      message: "شكراً لثقتك في كفراوي سوق. طلبك قيد التجهيز الآن.",
      time: "أمس",
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600",
      isRead: true
    },
    {
      id: 5,
      type: "review",
      title: "شاركنا رأيك في المنتج",
      message: "كيف كانت تجربتك مع 'سماعات Pro'؟ تقييمك يساعد الآخرين.",
      time: "منذ يومين",
      icon: Star,
      color: "bg-purple-100 text-purple-600",
      isRead: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-30 shadow-sm rounded-b-[40px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-900">إشعارات السوق</h1>
        </div>
        <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all">
          <Trash2 size={24} />
        </button>
      </header>

      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between px-2">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">الأحدث</p>
          <button className="text-xs font-black text-indigo-600">تحديد الكل كمقروء</button>
        </div>

        <div className="space-y-4">
          {notifications.map((notif, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={notif.id}
              className={`bg-white p-6 rounded-[32px] shadow-sm border transition-all flex gap-5 relative group cursor-pointer ${
                notif.isRead ? "border-gray-50" : "border-indigo-100 bg-indigo-50/20"
              }`}
            >
              {!notif.isRead && (
                <div className="absolute top-6 left-6 w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-lg" />
              )}
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${notif.color}`}>
                <notif.icon size={32} />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className={`font-black text-sm ${notif.isRead ? "text-gray-700" : "text-gray-900"}`}>
                    {notif.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {notif.message}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Clock size={12} className="text-gray-300" />
                  <p className="text-[10px] font-bold text-gray-400">
                    {notif.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft size={20} className="text-gray-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Bell size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900">لا توجد إشعارات</h3>
              <p className="text-sm text-gray-400">سنقوم بتنبيهك عند وجود عروض أو تحديثات جديدة</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
