import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  ShoppingBag, 
  ChevronLeft, 
  RotateCcw, 
  Star, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  ArrowLeft,
  Calendar,
  Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MarketplaceOrderHistoryPage() {
  const navigate = useNavigate();

  const orders = [
    {
      id: "ORD-12345",
      store: "سوق الإلكترونيات",
      items: ["ساعة ذكية Ultra", "سماعات Pro"],
      total: 3199,
      date: "10 مارس 2026",
      status: "في الطريق",
      image: "https://picsum.photos/seed/tech/100/100"
    },
    {
      id: "ORD-12300",
      store: "عالم الموضة",
      items: ["قميص قطني", "بنطلون جينز"],
      total: 850,
      date: "05 مارس 2026",
      status: "تم التوصيل",
      image: "https://picsum.photos/seed/fashion/100/100"
    },
    {
      id: "ORD-12250",
      store: "بيت الهدايا",
      items: ["طقم عطور", "ساعة يد"],
      total: 1200,
      date: "28 فبراير 2026",
      status: "تم التوصيل",
      image: "https://picsum.photos/seed/gift/100/100"
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
          <h1 className="text-xl font-black text-gray-900">سجل الطلبات</h1>
        </div>
        <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
          <MoreVertical size={24} />
        </button>
      </header>

      <main className="p-6 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-600 p-6 rounded-[32px] text-white shadow-xl shadow-indigo-100 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Package size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">إجمالي الطلبات</p>
            <p className="text-2xl font-black">24</p>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <ShoppingBag size={20} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">طلبات نشطة</p>
            <p className="text-2xl font-black text-gray-900">1</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">الطلبات السابقة</p>
            <button className="text-xs font-black text-indigo-600">تصفية</button>
          </div>

          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={order.id}
                className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 space-y-6 group"
              >
                {/* Header: Store & Status */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-gray-50">
                      <img src={order.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={order.store} referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">{order.store}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                        <Calendar size={12} className="text-indigo-500" />
                        <span>{order.date} • {order.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm ${
                    order.status === "تم التوصيل" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                  }`}>
                    {order.status}
                  </div>
                </div>

                {/* Products List (Mini) */}
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-600 border border-gray-100">
                      {item}
                    </span>
                  ))}
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الإجمالي</p>
                    <p className="text-xl font-black text-indigo-600">{order.total} ج.م</p>
                  </div>
                  <div className="flex gap-3">
                    {order.status === "تم التوصيل" ? (
                      <>
                        <button 
                          onClick={() => navigate(`/marketplace/rate/${order.id}`)}
                          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-amber-400 transition-all"
                        >
                          <Star size={20} />
                        </button>
                        <button className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
                          <RotateCcw size={18} />
                          <span>إعادة طلب</span>
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => navigate(`/marketplace/order-tracking/${order.id}`)}
                        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                      >
                        <span>تتبع الطلب</span>
                        <ArrowLeft size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State (Hidden) */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <ShoppingBag size={48} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">لا توجد طلبات سابقة</h3>
              <p className="text-sm text-gray-400">ابدأ التسوق الآن لتظهر طلباتك هنا</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
