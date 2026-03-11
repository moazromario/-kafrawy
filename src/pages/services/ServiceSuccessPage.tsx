import React from "react";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  LayoutGrid, 
  Home, 
  ChevronLeft, 
  ArrowLeft,
  Star,
  Zap,
  Hammer
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ServiceSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "booking";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-12">
      {/* Success Animation */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="w-48 h-48 bg-blue-50 rounded-[64px] flex items-center justify-center text-[#1877F2] shadow-2xl shadow-blue-100 border-4 border-white"
        >
          <CheckCircle2 size={96} strokeWidth={1.5} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-4 -right-4 w-20 h-20 bg-emerald-500 rounded-[28px] flex items-center justify-center text-white shadow-xl border-4 border-white"
        >
          <Zap size={32} />
        </motion.div>
      </div>

      {/* Text Content */}
      <div className="space-y-4 max-w-sm">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-black text-[#050505]"
        >
          {type === "booking" ? "تم الحجز بنجاح!" : "شكراً لتقييمك!"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm font-bold text-gray-400 leading-relaxed"
        >
          {type === "booking" 
            ? "لقد تم تأكيد حجزك بنجاح. يمكنك تتبع حالة الخدمة من خلال قائمة حجوزاتي." 
            : "رأيك يهمنا ويساعدنا في تحسين جودة الخدمات المقدمة وتطوير مهارات الفنيين."}
        </motion.p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-4">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => navigate(type === "booking" ? "/services/history" : "/services")}
          className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          {type === "booking" ? (
            <>
              <Calendar size={24} />
              <span>عرض حجوزاتي</span>
            </>
          ) : (
            <>
              <Home size={24} />
              <span>العودة للرئيسية</span>
            </>
          )}
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={() => navigate("/services")}
          className="w-full py-5 bg-gray-50 text-gray-500 rounded-[32px] font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <LayoutGrid size={24} />
          <span>تصفح خدمات أخرى</span>
        </motion.button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-12 h-12 bg-blue-50 rounded-2xl rotate-12 opacity-50" />
      <div className="absolute bottom-40 right-10 w-16 h-16 bg-amber-50 rounded-3xl -rotate-12 opacity-50" />
      <div className="absolute top-1/2 left-5 w-8 h-8 bg-emerald-50 rounded-xl rotate-45 opacity-50" />
    </div>
  );
}
