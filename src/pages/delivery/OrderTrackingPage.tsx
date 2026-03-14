import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Bike, 
  CheckCircle2, 
  Navigation,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  ShoppingBag,
  CreditCard
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState(false);

  const steps = [
    { id: 1, title: "تم تأكيد الطلب", time: "12:30 م", completed: true, current: false },
    { id: 2, title: "جاري تحضير الطعام", time: "12:35 م", completed: true, current: false },
    { id: 3, title: "المندوب في الطريق", time: "12:45 م", completed: false, current: true },
    { id: 4, title: "تم التوصيل", time: "--:--", completed: false, current: false },
  ];

  const orderItems = [
    { name: "بيج ماك كومبو", price: 120, quantity: 2 },
    { name: "تشيكن ماك نوجت (6 قطع)", price: 65, quantity: 1 },
    { name: "بطاطس مقلية كبيرة", price: 35, quantity: 1 },
  ];

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 15;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col h-screen overflow-hidden">
      {/* Map Preview Section */}
      <div className="flex-1 relative bg-blue-50 overflow-hidden">
        {/* Mock Map Background - Using a more realistic image pattern */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i15!2i19293!3i12345!2m3!1e0!2sm!3i420120488!3m8!2sar!3seg!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425')] bg-cover bg-center" />
        
        {/* Map Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/20" />

        {/* Header Overlay */}
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-700 active:scale-90 transition-all"
          >
            <ArrowRight size={24} />
          </button>
          <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
            <div className="w-2 h-2 bg-[#1877F2] rounded-full animate-pulse" />
            <span className="text-sm font-black text-[#050505]">تتبع مباشر للطلب</span>
          </div>
          <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-700">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Map Markers */}
        <motion.div 
          animate={{ 
            x: [0, 40, 0], 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="relative">
            <div className="w-16 h-16 bg-[#1877F2] rounded-3xl flex items-center justify-center text-white shadow-2xl border-4 border-white rotate-12">
              <Bike size={32} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1877F2] rotate-45" />
            {/* Pulse effect around driver */}
            <motion.div 
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-blue-400 rounded-3xl -z-10"
            />
          </div>
        </motion.div>

        <div className="absolute bottom-1/3 right-1/4 z-10">
          <div className="relative">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-2xl border-4 border-white -rotate-6">
              <MapPin size={24} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500 rotate-45" />
          </div>
        </div>
      </div>

      {/* Tracking Info Sheet */}
      <motion.div 
        layout
        className="bg-white rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.12)] p-8 z-20 max-h-[85vh] overflow-y-auto no-scrollbar"
      >
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />

        <div className="space-y-8">
          {/* Driver Info & Contact */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gray-100 overflow-hidden shadow-inner border border-gray-50">
                <img src="https://picsum.photos/seed/driver/200/200" className="w-full h-full object-cover" alt="Driver" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-black text-[#050505] text-lg">محمد الكفراوي</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Bike size={14} className="text-[#1877F2]" />
                  <span>مندوب توصيل • 4.9 ★</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="w-14 h-14 bg-blue-50 text-[#1877F2] rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-all">
                <MessageCircle size={28} />
              </button>
              <button className="w-14 h-14 bg-[#1877F2] text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 active:scale-90 transition-all">
                <Phone size={28} />
              </button>
            </div>
          </div>

          {/* Status Summary */}
          <div className="bg-gray-50 rounded-[32px] p-6 flex items-center justify-between border border-gray-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#1877F2]">
                <Clock size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">الوقت المتوقع</span>
              </div>
              <p className="text-2xl font-black text-[#050505]">12:55 م</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="space-y-1 text-right">
              <div className="flex items-center gap-2 text-orange-500 justify-end">
                <MapPin size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">المسافة</span>
              </div>
              <p className="text-2xl font-black text-[#050505]">1.2 كم</p>
            </div>
          </div>

          {/* Toggle Details Button */}
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
          >
            {showDetails ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            <span>{showDetails ? "إخفاء تفاصيل الطلب" : "عرض تفاصيل الطلب"}</span>
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-8 overflow-hidden"
              >
                {/* Delivery Address */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">عنوان التوصيل</h4>
                  <div className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1877F2] flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-black text-[#050505]">الحي الثالث، المجاورة الخامسة</p>
                      <p className="text-xs text-gray-400 font-bold mt-1">عمارة 12، الدور الثاني، شقة 4</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">قائمة المشتريات</h4>
                  <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-4">
                    {orderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[10px] font-black text-[#1877F2]">
                            {item.quantity}x
                          </div>
                          <span className="text-sm font-bold text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-[#050505]">{item.price * item.quantity} ج.م</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-50 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-400">
                        <span>المجموع الفرعي</span>
                        <span>{subtotal} ج.م</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-gray-400">
                        <span>رسوم التوصيل</span>
                        <span>{deliveryFee} ج.م</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-black text-[#050505]">الإجمالي</span>
                        <span className="text-lg font-black text-[#1877F2]">{total} ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-gray-400" />
                    <span className="text-sm font-black text-gray-700">طريقة الدفع</span>
                  </div>
                  <span className="text-sm font-black text-[#050505]">نقدي (كاش)</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tracking Steps */}
          {!showDetails && (
            <div className="relative space-y-8 pt-4">
              {/* Vertical Line */}
              <div className="absolute right-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
              
              {steps.map((step) => (
                <div key={step.id} className="relative flex items-center justify-between pr-8">
                  <div className={`absolute right-0 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${step.completed ? "bg-[#1877F2]" : step.current ? "bg-blue-400 animate-pulse" : "bg-gray-200"}`}>
                    {step.completed && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-black ${step.completed || step.current ? "text-[#050505]" : "text-gray-400"}`}>
                      {step.title}
                    </span>
                    {step.current && <span className="text-[10px] font-bold text-[#1877F2]">المندوب يقترب من موقعك</span>}
                  </div>
                  <span className="text-xs font-bold text-gray-400">{step.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* Support Button */}
          <button className="w-full py-5 bg-[#050505] text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
            <Navigation size={20} />
            <span>طلب المساعدة</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
