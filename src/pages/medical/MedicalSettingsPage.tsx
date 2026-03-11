import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  User, 
  Shield, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ArrowLeft,
  LogOut,
  HelpCircle,
  Settings,
  CreditCard,
  Wallet,
  Globe,
  Moon,
  Info,
  CheckCircle2,
  X,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MedicalSettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"account" | "privacy" | "notifications">("account");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  const menuItems = [
    { id: "account", label: "إعدادات الحساب", icon: User, color: "bg-blue-50 text-[#1E90FF]" },
    { id: "privacy", label: "الخصوصية والأمان", icon: Shield, color: "bg-emerald-50 text-emerald-600" },
    { id: "notifications", label: "الإشعارات", icon: Bell, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">الإعدادات</h1>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${
                activeTab === item.id ? "bg-white text-[#1E90FF] shadow-sm" : "text-gray-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <div className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
                    <img src="https://picsum.photos/seed/user1/200/200" className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1E90FF] text-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center">
                    <Settings size={16} />
                  </button>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#050505]">أحمد محمد</h3>
                  <p className="text-xs font-bold text-gray-400">ahmed@example.com</p>
                </div>
              </div>

              <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
                {[
                  { icon: User, label: "تعديل الملف الشخصي", path: "/medical/profile-edit" },
                  { icon: Wallet, label: "المحفظة وطرق الدفع", path: "/medical/wallet" },
                  { icon: Globe, label: "اللغة", value: "العربية" },
                  { icon: Moon, label: "الوضع الليلي", toggle: true },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => item.path && navigate(item.path)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-all border-b border-gray-50 last:border-none group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-[#1E90FF] transition-all">
                        <item.icon size={20} />
                      </div>
                      <span className="text-sm font-black text-[#050505]">{item.label}</span>
                    </div>
                    {item.value && <span className="text-xs font-bold text-[#1E90FF]">{item.value}</span>}
                    {item.toggle && (
                      <div className="w-12 h-6 bg-gray-100 rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    )}
                    {!item.value && !item.toggle && <ChevronLeft size={20} className="text-gray-300 group-hover:text-[#1E90FF] transition-all" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "privacy" && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-6">
                <h3 className="text-lg font-black text-[#050505]">إعدادات الخصوصية</h3>
                <div className="space-y-6">
                  {[
                    { label: "إخفاء ملفي الطبي", desc: "لا يمكن للأطباء رؤية ملفك إلا بموافقتك", active: true },
                    { label: "مشاركة الموقع", desc: "تحديد العيادات الأقرب إليك تلقائياً", active: false },
                    { label: "تشفير المحادثات", desc: "حماية خصوصية رسائلك مع الأطباء", active: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-[#050505]">{item.label}</h4>
                        <p className="text-[10px] font-bold text-gray-400">{item.desc}</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-all ${item.active ? "bg-[#1E90FF]" : "bg-gray-100"}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.active ? "translate-x-6" : ""}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full p-6 bg-white rounded-[32px] shadow-sm border border-gray-50 flex items-center justify-between group hover:bg-red-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                    <Lock size={20} />
                  </div>
                  <span className="text-sm font-black text-red-500">تغيير كلمة المرور</span>
                </div>
                <ChevronLeft size={20} className="text-red-300" />
              </button>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-6">
                <h3 className="text-lg font-black text-[#050505]">تنبيهات المواعيد</h3>
                <div className="space-y-6">
                  {[
                    { label: "تذكير قبل الموعد بـ ٢٤ ساعة", active: true },
                    { label: "تذكير قبل الموعد بـ ساعة", active: true },
                    { label: "إشعارات الرسائل الجديدة", active: true },
                    { label: "عروض وتخفيضات طبية", active: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <h4 className="text-sm font-black text-[#050505]">{item.label}</h4>
                      <div className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-all ${item.active ? "bg-[#1E90FF]" : "bg-gray-100"}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.active ? "translate-x-6" : ""}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout Button */}
        <button className="w-full py-5 bg-red-50 text-red-500 rounded-[32px] font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all border border-red-100">
          <LogOut size={24} />
          <span>تسجيل الخروج</span>
        </button>
      </main>
    </div>
  );
}
