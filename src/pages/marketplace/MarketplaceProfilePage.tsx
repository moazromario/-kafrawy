import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Wallet, 
  ChevronLeft, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Bell, 
  Heart, 
  ShoppingBag,
  Camera,
  Edit3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MarketplaceProfilePage() {
  const navigate = useNavigate();

  const menuItems = [
    { id: "orders", label: "طلباتي", icon: ShoppingBag, color: "bg-indigo-50 text-indigo-600", path: "/marketplace/order-history" },
    { id: "wishlist", label: "المفضلة", icon: Heart, color: "bg-rose-50 text-rose-600", path: "/marketplace/wishlist" },
    { id: "addresses", label: "العناوين", icon: MapPin, color: "bg-emerald-50 text-emerald-600", path: "/marketplace/addresses" },
    { id: "payments", label: "طرق الدفع", icon: CreditCard, color: "bg-blue-50 text-blue-600", path: "/marketplace/payments" },
    { id: "notifications", label: "الإشعارات", icon: Bell, color: "bg-amber-50 text-amber-600", path: "/marketplace/notifications" },
    { id: "security", label: "الأمان والخصوصية", icon: ShieldCheck, color: "bg-purple-50 text-purple-600", path: "/marketplace/security" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-10 sticky top-0 z-30 shadow-sm rounded-b-[48px] space-y-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-900">الملف الشخصي</h1>
          <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
            <Settings size={24} />
          </button>
        </div>

        {/* User Info Card */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl">
              <img src="https://picsum.photos/seed/user/200/200" alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-white active:scale-90 transition-all">
              <Camera size={20} />
            </button>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-gray-900">محمد الكفراوي</h2>
            <p className="text-sm font-bold text-gray-400">عضو منذ يناير 2026</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-indigo-50 px-6 py-3 rounded-2xl flex items-center gap-2 border border-indigo-100">
              <Wallet size={18} className="text-indigo-600" />
              <span className="text-sm font-black text-indigo-600">1,250 ج.م</span>
            </div>
            <div className="bg-emerald-50 px-6 py-3 rounded-2xl flex items-center gap-2 border border-emerald-100">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span className="text-sm font-black text-emerald-600">موثق</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Personal Details Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">البيانات الشخصية</h3>
            <button className="text-xs font-black text-indigo-600 flex items-center gap-1">
              <Edit3 size={14} />
              <span>تعديل</span>
            </button>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">البريد الإلكتروني</p>
                <p className="text-sm font-black text-gray-900">moaz@kafraoui.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                <Phone size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">رقم الهاتف</p>
                <p className="text-sm font-black text-gray-900">01012345678</p>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">الإعدادات والتحكم</h3>
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            {menuItems.map((item, i) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full p-6 flex items-center justify-between group active:bg-gray-50 transition-all ${
                  i !== menuItems.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                    <item.icon size={24} />
                  </div>
                  <span className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{item.label}</span>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-all">
                  <ChevronLeft size={20} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Logout Button */}
        <button className="w-full py-5 bg-rose-50 text-rose-600 rounded-[32px] font-black text-lg flex items-center justify-center gap-3 border border-rose-100 active:scale-95 transition-all">
          <LogOut size={24} />
          <span>تسجيل الخروج</span>
        </button>

        <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">الإصدار 2.4.0 • كفراوي سوق</p>
      </main>
    </div>
  );
}
