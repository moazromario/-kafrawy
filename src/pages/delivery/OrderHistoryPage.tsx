import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  ShoppingBag, 
  Clock, 
  ChevronLeft, 
  RotateCcw, 
  Star, 
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderHistoryPage() {
  const navigate = useNavigate();

  const orders = [
    { id: "1024", store: "برجر كينج كفراوي", date: "10 مارس 2026", time: "12:30 م", total: 245, status: "تم التوصيل", items: 3, image: "https://picsum.photos/seed/burger/100/100" },
    { id: "1020", store: "بيتزا هت العبور", date: "8 مارس 2026", time: "08:15 م", total: 320, status: "تم التوصيل", items: 2, image: "https://picsum.photos/seed/pizza/100/100" },
    { id: "1015", store: "كريب أند وافل", date: "5 مارس 2026", time: "04:45 م", total: 115, status: "ملغي", items: 1, image: "https://picsum.photos/seed/crepe/100/100" },
  ];

  const handleReorder = (orderId: string) => {
    // In a real app, add items to cart and navigate to checkout
    alert(`تمت إضافة أصناف الطلب #${orderId} إلى السلة بنجاح!`);
    navigate("/delivery/cart");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/delivery")}
            className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
          >
            <ArrowRight size={20} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">سجل الطلبات</h1>
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2]">
          <ShoppingBag size={20} />
        </div>
      </header>

      <main className="p-4 space-y-6">
        {orders.map((order, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={order.id}
            className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 space-y-6 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-sm border border-gray-50">
                  <img src={order.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={order.store} referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-black text-[#050505] text-lg">{order.store}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                    <Clock size={12} className="text-[#1877F2]" />
                    <span>{order.date} • {order.time}</span>
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider ${
                order.status === "تم التوصيل" 
                ? "bg-blue-50 text-[#1877F2]" 
                : "bg-red-50 text-red-600"
              }`}>
                {order.status === "تم التوصيل" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                <span>{order.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-5 border-y border-gray-50">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">الطلبات</p>
                  <p className="text-sm font-black text-gray-700">{order.items} أصناف</p>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">الإجمالي</p>
                  <p className="text-sm font-black text-[#1877F2]">{order.total} ج.م</p>
                </div>
              </div>
              <button className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#1877F2] transition-all">
                <ChevronLeft size={20} />
              </button>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => handleReorder(order.id)}
                className="flex-1 py-4 bg-[#1877F2] text-white rounded-[24px] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
              >
                <RotateCcw size={18} />
                <span>إعادة الطلب</span>
              </button>
              {order.status === "تم التوصيل" && (
                <button 
                  onClick={() => navigate(`/delivery/rate/${order.id}`)}
                  className="flex-1 py-4 bg-gray-50 text-gray-700 rounded-[24px] font-black text-sm flex items-center justify-center gap-2 hover:bg-amber-50 hover:text-amber-600 transition-all active:scale-95"
                >
                  <Star size={18} className="text-amber-400" />
                  <span>تقييم الطلب</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
}
