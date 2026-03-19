import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, ArrowLeft, Loader2, ShieldCheck, Eye, EyeOff, Phone, MapPin, Check, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/src/modules/auth/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordRequirements = [
    { label: "6 أحرف على الأقل", met: password.length >= 6 },
    { label: "يحتوي على رقم", met: /\d/.test(password) },
    { label: "يحتوي على حرف كبير", met: /[A-Z]/.test(password) },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("يرجى استيفاء متطلبات كلمة المرور");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await authService.signUp(email, password, fullName);
      if (authError) throw authError;
      
      // Redirect to verification page with email in state
      navigate("/verify-email", { state: { email } });
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب. قد يكون البريد مستخدماً بالفعل.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 p-8 md:p-10"
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
          <h1 className="text-3xl font-black text-[#050505] mb-2">انضم إلينا</h1>
          <p className="text-gray-400 font-bold text-sm">ابدأ رحلتك في أكبر مجتمع متكامل</p>
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

        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">الاسم الكامل</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1877F2] transition-colors" size={18} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="الاسم بالكامل"
                  required
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#1877F2] outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">رقم الهاتف</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1877F2] transition-colors" size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#1877F2] outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>

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
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">الموقع / الحي</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1877F2] transition-colors" size={18} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="مثال: الحي الأول، مدينة العبور"
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#1877F2] outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">كلمة المرور</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1877F2] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>إنشاء الحساب</span>
                <ArrowLeft size={18} className="rotate-180" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm font-bold text-gray-400">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-[#1877F2] font-black hover:underline">تسجيل الدخول</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

