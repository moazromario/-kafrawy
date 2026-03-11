import { motion } from "motion/react";
import { User, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-12">
      <Link to="/login" className="mb-8 text-gray-400">
        <ArrowLeft size={24} />
      </Link>

      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء حساب</h1>
        <p className="text-gray-500 mb-8">انضم إلى مجتمع كفراوي اليوم</p>

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="أدخل اسمك"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">رقم الهاتف</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                placeholder="01xxxxxxxxx"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

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

          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors mt-6"
          >
            إنشاء الحساب
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-emerald-600 font-bold">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
