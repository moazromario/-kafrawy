import { motion } from "motion/react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-12">
      <Link to="/" className="mb-12 text-gray-400">
        <ArrowLeft size={24} />
      </Link>

      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بعودتك!</h1>
        <p className="text-gray-500 mb-8">سجل دخولك للمتابعة في كفراوي</p>

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="example@mail.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm text-emerald-600 font-medium">نسيت كلمة المرور؟</button>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors mt-4"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          ليس لديك حساب؟{" "}
          <Link to="/register" className="text-emerald-600 font-bold">إنشاء حساب جديد</Link>
        </p>
      </div>
    </div>
  );
}
