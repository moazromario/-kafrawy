import React from "react";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  Bike, 
  Clock, 
  MapPin, 
  ChevronLeft,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />

      {/* Success Animation Container */}
      <div className="relative mb-12">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-56 h-56 bg-[#1877F2] rounded-[60px] flex items-center justify-center text-white shadow-2xl shadow-blue-200 relative z-10"
        >
          <CheckCircle2 size={100} strokeWidth={2} />
        </motion.div>
        
        {/* Floating Sparkles */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -right-6 text-amber-400"
        >
          <Sparkles size={48} />
        </motion.div>

        {/* Pulse Effect */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-blue-100 rounded-[60px] -z-10"
        />
      </div>

      <div className="space-y-4 mb-12 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-[#050505] tracking-tight"
        >
          تم استلام طلبك!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 text-sm max-w-[300px] mx-auto leading-relaxed font-bold"
        >
          شكراً لاختيارك كفراوي جو. طلبك الآن في أيدي أمينة وسيصلك خلال <span className="text-[#1877F2]">35 دقيقة</span> تقريباً.
        </motion.p>
      </div>

      {/* Order Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm bg-[#F0F2F5] rounded-[40px] p-8 space-y-6 border border-gray-100 mb-12"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1877F2] shadow-sm">
              <ShoppingBag size={24} />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">رقم الطلب</p>
              <p className="text-sm font-black text-[#050505]">#KF-9924</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الحالة</p>
            <p className="text-xs font-black text-[#1877F2]">قيد التحضير</p>
          </div>
        </div>
        
        <div className="h-px bg-gray-200/50" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm">
            <Clock size={16} className="text-[#1877F2]" />
            <span className="text-[11px] font-black text-gray-700">12:45 م</span>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm">
            <Bike size={16} className="text-[#1877F2]" />
            <span className="text-[11px] font-black text-gray-700">توصيل سريع</span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm space-y-4"
      >
        <button 
          onClick={() => navigate("/delivery/tracking/KF-9924")}
          className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-xl shadow-2xl shadow-blue-100 flex items-center justify-center gap-4 active:scale-95 transition-all group"
        >
          <span>تتبع الطلب</span>
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={() => navigate("/delivery")}
          className="w-full py-5 bg-white border-2 border-gray-100 text-gray-700 rounded-[32px] font-black text-lg hover:bg-gray-50 active:scale-95 transition-all"
        >
          العودة للرئيسية
        </button>
      </motion.div>
    </div>
  );
}
