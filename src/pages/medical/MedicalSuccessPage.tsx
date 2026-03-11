import React from "react";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Home,
  Navigation,
  Star
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function MedicalSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "booking";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-12">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="relative"
      >
        <div className="w-40 h-40 bg-emerald-50 rounded-[48px] flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-100">
          <CheckCircle2 size={80} strokeWidth={2.5} />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white"
        >
          <CheckCircle2 size={24} />
        </motion.div>
      </motion.div>

      {/* Success Message */}
      <div className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-[#050505]"
        >
          {type === "booking" ? "تم الحجز بنجاح!" : "شكراً لتقييمك!"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-bold text-gray-400 leading-relaxed max-w-xs mx-auto"
        >
          {type === "booking" 
            ? "لقد تم تأكيد موعدك بنجاح. يمكنك تتبع الموعد والتواصل مع الطبيب من خلال قائمة مواعيدي." 
            : "رأيك يهمنا ويساعدنا في تحسين جودة الرعاية الطبية المقدمة وتطوير مهارات الأطباء."}
        </motion.p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs space-y-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate(type === "booking" ? "/medical/appointments" : "/medical")}
          className="w-full py-5 bg-[#1E90FF] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          {type === "booking" ? (
            <>
              <Calendar size={24} />
              <span>عرض مواعيدي</span>
            </>
          ) : (
            <>
              <Home size={24} />
              <span>العودة للرئيسية</span>
            </>
          )}
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/medical")}
          className="w-full py-5 bg-gray-50 text-gray-500 rounded-[32px] font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all border border-gray-100"
        >
          <Home size={24} />
          <span>الرئيسية</span>
        </motion.button>
      </div>

      {/* Confetti Placeholder */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              top: -20, 
              left: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
              rotate: 0
            }}
            animate={{ 
              top: "110%",
              rotate: 360,
              left: (Math.random() * 100 - 10) + "%"
            }}
            transition={{ 
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className={`absolute w-4 h-4 rounded-sm ${
              ["bg-[#1E90FF]", "bg-emerald-400", "bg-amber-400", "bg-purple-400"][Math.floor(Math.random() * 4)]
            }`}
          />
        ))}
      </div>
    </div>
  );
}
