import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  ChevronLeft, 
  MoreVertical,
  ArrowLeft,
  RotateCcw,
  Plus,
  Bell,
  Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MarketplaceFutureOrdersPage() {
  const navigate = useNavigate();

  const futureOrders = [
    {
      id: "FO-101",
      store: "سوبر ماركت كفراوي",
      items: ["كرتونة مياه", "منظفات منزلية"],
      total: 450,
      nextDate: "15 مارس 2026",
      frequency: "كل أسبوعين",
      image: "https://picsum.photos/seed/grocery/100/100"
    },
    {
      id: "FO-102",
      store: "مستحضرات كفراوي",
      items: ["طقم عناية بالبشرة"],
      total: 1200,
      nextDate: "01 أبريل 2026",
      frequency: "كل شهر",
      image: "https://picsum.photos/seed/beauty/100/100"
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
          <h1 className="text-xl font-black text-gray-900">الطلبات المستقبلية</h1>
        </div>
        <button className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 active:scale-90 transition-all">
          <Plus size={24} />
        </button>
      </header>

      <main className="p-6 space-y-8">
        {/* Info Banner */}
        <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
            <Bell size={28} className="animate-bounce" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900">جدولة طلباتك</h3>
            <p className="text-[10px] font-bold text-gray-500 leading-relaxed">وفر وقتك وجدول طلباتك المتكررة لتصلك تلقائياً في الموعد المحدد.</p>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">الطلبات المجدولة</h2>
            <button className="text-xs font-black text-indigo-600">تعديل الكل</button>
          </div>

          <div className="space-y-4">
            {futureOrders.map((order, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={order.id}
                className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 space-y-6 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-gray-50">
                      <img src={order.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={order.store} referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">{order.store}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                        <RotateCcw size={12} className="text-indigo-500" />
                        <span>يتكرر {order.frequency}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-600 border border-gray-100">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-indigo-600 mb-0.5">
                      <Calendar size={14} />
                      <span className="text-sm font-black">{order.nextDate}</span>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">الموعد القادم</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
                      <Clock size={18} />
                      <span>تعديل الموعد</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State (Hidden) */}
        {futureOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Calendar size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900">لا توجد طلبات مجدولة</h3>
              <p className="text-sm text-gray-400">ابدأ بجدولة طلباتك المتكررة لتوفير الوقت</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
