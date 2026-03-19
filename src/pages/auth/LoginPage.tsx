import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Mail, Lock, ArrowLeft, Loader2, Github, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/src/modules/auth/authService";
import { useAuth } from "@/src/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await authService.signIn(email, password);
      if (authError) {
        if (authError.message.includes("Email not confirmed")) {
          setError("يرجى تأكيد بريدك الإلكتروني أولاً. تفقد صندوق الوارد.");
        } else {
          throw authError;
        }
      } else {
        await refreshProfile();
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "خطأ في تسجيل الدخول. يرجى التأكد من البيانات.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني أولاً");
      return;
    }
    setResendingEmail(true);
    try {
      await authService.resendConfirmationEmail(email);
      setError("تم إرسال رابط التأكيد مرة أخرى. تفقد بريدك.");
    } catch (err: any) {
      setError("فشل إرسال الرابط. حاول مرة أخرى لاحقاً.");
    } finally {
      setResendingEmail(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      if (provider === 'google') await authService.signInWithGoogle();
      if (provider === 'github') await authService.signInWithGithub();
    } catch (err: any) {
      setError(`فشل تسجيل الدخول عبر ${provider}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 p-8 md:p-10"
      >
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 bg-[#1877F2] rounded-[24px] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-100 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            K
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#050505] mb-2">مرحباً بك مجدداً</h1>
          <p className="text-gray-400 font-bold text-sm">سجل دخولك للوصول إلى حسابك</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              {error}
            </div>
            {error.includes("تأكيد بريدك") && (
              <button 
                onClick={handleResendConfirmation}
                disabled={resendingEmail}
                className="text-[#1877F2] hover:underline text-right mt-1 flex items-center gap-1"
              >
                {resendingEmail ? <Loader2 size={12} className="animate-spin" /> : null}
                إعادة إرسال الرابط
              </button>
            )}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
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
              <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-[#1877F2] hover:underline">
                نسيت كلمة المرور؟
              </Link>
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
            className="w-full py-4 bg-[#1877F2] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>تسجيل الدخول</span>
                <ArrowLeft size={18} className="rotate-180" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative px-4 bg-white text-[10px] font-black text-gray-300 uppercase tracking-widest">أو عبر</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-3 py-4 bg-white border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-all group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-xs font-black text-gray-500">Google</span>
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              className="flex items-center justify-center gap-3 py-4 bg-white border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-all group"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black text-gray-500">Github</span>
            </button>
          </div>
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
