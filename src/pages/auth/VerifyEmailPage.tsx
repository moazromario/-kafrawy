import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Mail, ArrowLeft, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/src/modules/auth/authService";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    try {
      await authService.resendConfirmationEmail(email);
      setSuccess(true);
      setTimer(60);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Resend error:", error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 p-8 md:p-10 text-center"
      >
        <div className="w-20 h-20 bg-blue-50 text-[#1877F2] rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Mail size={40} strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-black text-[#050505] mb-4">تأكيد البريد الإلكتروني</h1>
        <p className="text-gray-400 font-bold text-sm mb-8 leading-relaxed">
          لقد أرسلنا رابط التأكيد إلى <span className="text-[#050505]">{email}</span>. يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={resending || timer > 0}
            className="w-full py-4 bg-gray-50 text-[#050505] rounded-2xl font-black text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {resending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : success ? (
              <>
                <CheckCircle2 size={20} className="text-emerald-500" />
                <span>تم الإرسال بنجاح</span>
              </>
            ) : (
              <>
                <RefreshCw size={18} className={timer > 0 ? "text-gray-300" : ""} />
                <span>{timer > 0 ? `إعادة الإرسال خلال ${timer} ثانية` : "إعادة إرسال الرابط"}</span>
              </>
            )}
          </button>

          <Link
            to="/login"
            className="w-full py-4 bg-white border-2 border-gray-50 text-gray-400 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            <span>العودة لتسجيل الدخول</span>
          </Link>
        </div>

        <div className="mt-10 pt-10 border-t border-gray-50">
          <p className="text-xs font-bold text-gray-400">
            لم تصلك الرسالة؟ تفقد ملف البريد المهمل (Spam) أو حاول مرة أخرى.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
