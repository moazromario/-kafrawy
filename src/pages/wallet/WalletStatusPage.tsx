import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Home, 
  History,
  ChevronLeft,
  Calendar,
  Phone,
  Banknote
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function WalletStatusPage() {
  const navigate = useNavigate();
  const { status } = useParams();

  const isPending = status === "pending";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate("/wallet")}
          className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
        >
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">حالة الطلب</h1>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center space-y-8">
        {/* Status Icon */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-32 h-32 rounded-[48px] flex items-center justify-center shadow-2xl ${
            isPending ? "bg-amber-50 text-amber-500 shadow-amber-100" :
            isApproved ? "bg-emerald-50 text-emerald-500 shadow-emerald-100" :
            "bg-red-50 text-red-500 shadow-red-100"
          }`}
        >
          {isPending ? <Clock size={64} /> :
           isApproved ? <CheckCircle2 size={64} /> :
           <XCircle size={64} />}
        </motion.div>

        <div className="text-center space-y-2">
          <h2 className={`text-3xl font-black ${
            isPending ? "text-amber-600" :
            isApproved ? "text-emerald-600" :
            "text-red-600"
          }`}>
            {isPending ? "طلبك قيد المراجعة" :
             isApproved ? "تم قبول الطلب بنجاح" :
             "تم رفض الطلب"}
          </h2>
          <p className="text-sm font-bold text-gray-400 max-w-[280px] mx-auto leading-relaxed">
            {isPending ? "فريق كفراوي يراجع بيانات التحويل الآن. سيتم إضافة الرصيد فور التأكد." :
             isApproved ? "تم إضافة ٢٠٠ ج.م إلى محفظتك بنجاح. يمكنك الآن استخدامه في جميع خدمات كفراوي." :
             "نعتذر، لم نتمكن من التأكد من صحة بيانات التحويل. يرجى التواصل مع الدعم الفني."}
          </p>
        </div>

        {/* Request Details */}
        <div className="w-full bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <Banknote size={20} />
              </div>
              <span className="text-xs font-black text-gray-400">المبلغ</span>
            </div>
            <span className="text-lg font-black text-[#050505]">٢٠٠ ج.م</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <Phone size={20} />
              </div>
              <span className="text-xs font-black text-gray-400">رقم الهاتف</span>
            </div>
            <span className="text-sm font-black text-[#050505]">01028682259</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <Calendar size={20} />
              </div>
              <span className="text-xs font-black text-gray-400">التاريخ</span>
            </div>
            <span className="text-sm font-black text-[#050505]">١٣ مارس، ٢٠٢٦</span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate("/")}
            className="py-5 bg-white border border-gray-100 text-gray-700 rounded-[28px] font-black text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            <Home size={18} />
            <span>الرئيسية</span>
          </button>
          <button 
            onClick={() => navigate("/wallet")}
            className="py-5 bg-[#1877F2] text-white rounded-[28px] font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-100 active:scale-95 transition-all"
          >
            <History size={18} />
            <span>المحفظة</span>
          </button>
        </div>
      </main>
    </div>
  );
}
