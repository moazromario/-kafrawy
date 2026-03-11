import { motion } from "motion/react";
import { Truck, Package, MapPin, Clock } from "lucide-react";

export default function DeliveryPage() {
  const orders = [
    { id: "1024", status: "في الطريق", time: "15 دقيقة", from: "مطعم كفراوي", to: "الحي الثالث" },
    { id: "1025", status: "تم الاستلام", time: "منذ ساعة", from: "سوبر ماركت الخير", to: "الحي الأول" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">خدمات التوصيل</h1>
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
          <Truck size={20} />
        </div>
      </div>

      <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg font-bold mb-1">اطلب مندوب توصيل</h2>
          <p className="text-emerald-50/80 text-xs mb-4">توصيل أي شيء من أي مكان في كفراوي</p>
          <button className="px-6 py-2 bg-white text-emerald-600 rounded-full text-sm font-bold shadow-sm">
            اطلب الآن
          </button>
        </div>
        <Truck className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 -rotate-12" />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900">طلباتك الحالية</h3>
        {orders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-emerald-600" />
                <span className="text-sm font-bold text-gray-900">طلب #{order.id}</span>
              </div>
              <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full">
                {order.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={12} />
                <span>من: {order.from}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                <span>الوقت المتوقع: {order.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
