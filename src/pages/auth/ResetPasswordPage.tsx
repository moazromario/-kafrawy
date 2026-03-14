import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "@/src/modules/auth/authService";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await authService.resetPassword(email);
      if (authError) throw authError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء محاولة استعادة كلمة المرور.");
    } finally {
      setLoading(false);
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
          <Link to="/login" className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-12 h-12 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100">
            K
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#050505] mb-2">استعادة الحساب</h1>
          <p className="text-gray-400 font-bold text-sm">أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة</p>
        </div>

        {success ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">تم إرسال الرابط!</h2>
            <p className="text-gray-500 font-bold mb-8">تفقد بريدك الإلكتروني (بما في ذلك البريد المزعج) واتبع التعليمات.</p>
            <Link to="/login" className="text-[#1877F2] font-black hover:underline">العودة لتسجيل الدخول</Link>
          </motion.div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleReset}>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#1877F2] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>إرسال رابط الاستعادة</span>
                    <ArrowLeft size={18} className="rotate-180" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
