import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Mail, Lock, ArrowLeft, Loader2, Chrome, Github, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/src/modules/auth/authService";
import { useAuth } from "@/src/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    // Check for errors in the URL hash (common in Supabase redirects)
    const hash = window.location.hash;
    if (hash && hash.includes("error")) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const errorCode = params.get("error_code");
      const errorDescription = params.get("error_description");

      if (errorCode === "otp_expired") {
        setError("انتهت صلاحية رابط التأكيد. يرجى طلب رابط جديد.");
      } else if (errorDescription) {
        setError(decodeURIComponent(errorDescription).replace(/\+/g, " "));
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: authError } = await authService.signIn(email, password);
      if (authError) throw authError;
      
      await refreshProfile();
      
      // Get redirect path from state or default to home
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || "/";
      navigate(redirectTo);
    } catch (err: any) {
      if (err.message?.includes("Email not confirmed")) {
        setError("لم يتم تأكيد بريدك الإلكتروني بعد. يرجى التحقق من صندوق الوارد.");
      } else if (err.message?.includes("rate limit")) {
        setError("لقد قمت بطلبات كثيرة جداً. يرجى الانتظار دقيقة قبل المحاولة مرة أخرى.");
      } else {
        setError(err.message || "حدث خطأ أثناء تسجيل الدخول. تأكد من البيانات.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني أولاً");
      return;
    }
    if (resendTimer > 0) return;

    setResending(true);
    setError(null);
    try {
      const { error: resendError } = await authService.resendConfirmationEmail(email);
      if (resendError) throw resendError;
      setSuccess("تم إرسال رابط التأكيد مرة أخرى. تفقد بريدك الإلكتروني.");
      setResendTimer(60); // Wait 60 seconds before next attempt
    } catch (err: any) {
      if (err.message?.includes("rate limit")) {
        setError("عذراً، لقد تجاوزت الحد المسموح به من المحاولات. انتظر دقيقة ثم حاول مجدداً.");
        setResendTimer(60);
      } else {
        setError(err.message || "فشل إرسال رابط التأكيد");
      }
    } finally {
      setResending(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (err: any) {
      setError("فشل تسجيل الدخول بواسطة جوجل");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 p-8 md:p-10"
      >
        <div className="flex justify-between items-center mb-10">
          <Link to="/" className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-12 h-12 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100">
            K
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#050505] mb-2">مرحباً بك مجدداً</h1>
          <p className="text-gray-400 font-bold text-sm">سجل دخولك للوصول إلى عالم كفراوي</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              {error}
            </div>
            {error.includes("تأكيد") && (
              <button 
                onClick={handleResendConfirmation}
                disabled={resending || resendTimer > 0}
                className="text-[#1877F2] hover:underline mt-1 block disabled:text-gray-400 disabled:no-underline"
              >
                {resending ? "جاري الإرسال..." : resendTimer > 0 ? `يمكنك إعادة الإرسال بعد ${resendTimer} ثانية` : "إعادة إرسال رابط التأكيد؟"}
              </button>
            )}
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            {success}
          </motion.div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1877F2] transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#1877F2] outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mr-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">كلمة المرور</label>
              <button type="button" className="text-[10px] font-black text-[#1877F2] hover:underline">نسيت كلمة المرور؟</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1877F2] transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#1877F2] outline-none transition-all placeholder:text-gray-300"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1877F2] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>تسجيل الدخول</span>
                <ArrowLeft size={18} className="rotate-180" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
            <span className="bg-white px-4 text-gray-400">أو عبر</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 py-3.5 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
          >
            <Chrome size={20} className="text-red-500" />
            <span className="text-xs font-black text-gray-600">Google</span>
          </button>
          <button className="flex items-center justify-center gap-3 py-3.5 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-all active:scale-95">
            <Github size={20} className="text-gray-900" />
            <span className="text-xs font-black text-gray-600">Github</span>
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm font-bold text-gray-400">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="text-[#1877F2] font-black hover:underline">إنشاء حساب جديد</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
