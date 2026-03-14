import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Clock, 
  Calendar, 
  ShoppingBag, 
  Bell, 
  ChevronLeft,
  MoreVertical,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpcomingRemindersPage() {
  const navigate = useNavigate();

  const upcomingOrders = [
    {
      id: "UP-101",
      store: "برجر كينج كفراوي",
      items: ["2x بيج ماك", "1x بطاطس عائلية"],
      scheduledTime: "اليوم، 08:30 م",
      reminderTime: "قبل 15 دقيقة",
      status: "مجدول",
      image: "https://picsum.photos/seed/burger/100/100"
    },
    {
      id: "UP-105",
      store: "بيتزا هت العبور",
      items: ["1x بيتزا مارجريتا كبيرة", "1x بيبسي 1 لتر"],
      scheduledTime: "غداً، 02:00 م",
      reminderTime: "قبل 30 دقيقة",
      status: "مؤكد",
      image: "https://picsum.photos/seed/pizza/100/100"
    },
    {
      id: "UP-110",
      store: "كريب أند وافل",
      items: ["3x كريب نوتيلا"],
      scheduledTime: "12 مارس، 06:00 م",
      reminderTime: "قبل 10 دقائق",
      status: "قيد المراجعة",
      image: "https://picsum.photos/seed/crepe/100/100"
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
          <h1 className="text-xl font-black text-[#050505]">تذكيرات الطلبات</h1>
        </div>
        <button className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#1877F2] transition-all">
          <Bell size={20} />
        </button>
      </header>

      <main className="p-4 space-y-6">
        {/* Info Banner */}
        <div className="bg-[#1877F2] rounded-[32px] p-6 text-white flex items-center gap-4 shadow-xl shadow-blue-100">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Calendar size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-sm">طلباتك المجدولة</h3>
            <p className="text-[10px] font-bold opacity-80">سنقوم بتذكيرك قبل موعد استلام الطلب</p>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">القادمة قريباً</p>
            <button className="text-xs font-black text-[#1877F2]">إضافة جديد</button>
          </div>

          <div className="space-y-4">
            {upcomingOrders.map((order, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={order.id}
                className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 space-y-6 group"
              >
                {/* Store & Status */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-gray-50">
                      <img src={order.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={order.store} referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="font-black text-[#050505] text-lg">{order.store}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                        <ShoppingBag size={12} className="text-[#1877F2]" />
                        <span>{order.items.length} أصناف • {order.id}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Products List (Mini) */}
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-600 border border-gray-100">
                      {item}
                    </span>
                  ))}
                </div>

                {/* Reminder & Time Info */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100/50 space-y-1">
                    <div className="flex items-center gap-2 text-[#1877F2]">
                      <Clock size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">موعد الطلب</span>
                    </div>
                    <p className="text-xs font-black text-[#050505]">{order.scheduledTime}</p>
                  </div>
                  <div className="bg-amber-50/50 p-4 rounded-3xl border border-amber-100/50 space-y-1">
                    <div className="flex items-center gap-2 text-amber-600">
                      <Bell size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">التذكير</span>
                    </div>
                    <p className="text-xs font-black text-[#050505]">{order.reminderTime}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <AlertCircle size={18} />
                    <span>تعديل الموعد</span>
                  </button>
                  <button className="flex-1 py-4 bg-[#1877F2] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all">
                    <CheckCircle2 size={18} />
                    <span>تأكيد الآن</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State (Hidden for now) */}
        {upcomingOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Calendar size={48} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">لا توجد طلبات مجدولة</h3>
              <p className="text-sm text-gray-400">يمكنك جدولة طلباتك المفضلة لتصلك في وقت محدد</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
