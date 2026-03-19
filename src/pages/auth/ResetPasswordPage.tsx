import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, ArrowLeft, Loader2, ShieldCheck, Eye, EyeOff, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/src/modules/auth/authService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordRequirements = [
    { label: "6 أحرف على الأقل", met: password.length >= 6 },
    { label: "يحتوي على رقم", met: /\d/.test(password) },
    { label: "يحتوي على حرف كبير", met: /[A-Z]/.test(password) },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("يرجى استيفاء متطلبات كلمة المرور");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await authService.updatePassword(password);
      if (resetError) throw resetError;
      
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث كلمة المرور. قد يكون الرابط قد انتهى.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 text-center"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShieldCheck size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">تم التحديث بنجاح!</h2>
          <p className="text-gray-500 font-bold mb-8 leading-relaxed">تم تغيير كلمة المرور الخاصة بك بنجاح. سيتم تحويلك لصفحة الدخول خلال لحظات...</p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
              className="h-full bg-emerald-500"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 p-8 md:p-10"
      >
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 bg-[#1877F2] rounded-[24px] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-100">
            K
          </div>
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-[#050505] mb-2">كلمة مرور جديدة</h1>
          <p className="text-gray-400 font-bold text-sm">يرجى إدخال كلمة المرور الجديدة لحسابك</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            {error}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleReset}>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">كلمة المرور الجديدة</label>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 px-2">
              {passwordRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {req.met ? (
                    <Check size={12} className="text-emerald-500" />
                  ) : (
                    <X size={12} className="text-gray-300" />
                  )}
                  <span className={`text-[10px] font-bold ${req.met ? "text-emerald-600" : "text-gray-400"}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">تأكيد كلمة المرور</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1877F2] transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#1877F2] outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1877F2] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>تحديث كلمة المرور</span>
                <ArrowLeft size={18} className="rotate-180" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
