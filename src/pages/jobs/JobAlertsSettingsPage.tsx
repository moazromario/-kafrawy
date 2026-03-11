import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Bell, 
  Settings, 
  CheckCircle2, 
  Zap, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  ChevronLeft, 
  Info,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/utils/cn";

export default function JobAlertsSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    newJobs: true,
    applicationUpdates: true,
    trainingOffers: false,
    marketing: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">إعدادات الإشعارات</h1>
      </header>

      <main className="p-6 space-y-8 max-w-xl mx-auto">
        {/* Notification Toggles */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-[#050505] px-2">تخصيص الإشعارات</h3>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
            {[
              { id: "newJobs", label: "وظائف جديدة", desc: "إشعار عند توفر وظيفة تناسب مهاراتك.", icon: Briefcase, color: "bg-blue-50 text-[#1877F2]" },
              { id: "applicationUpdates", label: "تحديثات الطلبات", desc: "إشعار عند مراجعة طلبك أو تغيير حالته.", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
              { id: "trainingOffers", label: "العروض والتدريبات", desc: "إشعار بفرص التدريب والكورسات الجديدة.", icon: Zap, color: "bg-amber-50 text-amber-600" },
              { id: "marketing", label: "عروض ترويجية", desc: "إشعار بأحدث عروض الشركات والشركاء.", icon: ShieldCheck, color: "bg-purple-50 text-purple-600" },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-all", item.color)}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#050505]">{item.label}</h4>
                    <p className="text-[10px] font-bold text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting(item.id as any)}
                  className={cn(
                    "w-14 h-8 rounded-full p-1 transition-all duration-500",
                    settings[item.id as keyof typeof settings] ? "bg-[#1877F2]" : "bg-gray-200"
                  )}
                >
                  <motion.div 
                    animate={{ x: settings[item.id as keyof typeof settings] ? 24 : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Customization */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-[#050505] px-2">تخصيص المجال والمدينة</h3>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">المجال المهني</label>
              <div className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-all">
                <span>تكنولوجيا المعلومات (IT)</span>
                <ChevronLeft size={16} className="text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">المدينة المفضلة</label>
              <div className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-all">
                <span>الرياض، السعودية</span>
                <ChevronLeft size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </section>

        {/* Info Card */}
        <section className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex items-start gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1877F2] flex-shrink-0 shadow-sm">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-[#1877F2]">تنبيه</h4>
            <p className="text-[10px] font-bold text-blue-700/70 leading-relaxed">سيتم إرسال الإشعارات إليك بناءً على هذه الإعدادات. يمكنك تغييرها في أي وقت.</p>
          </div>
        </section>

        <button className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all">
          حفظ الإعدادات
        </button>
      </main>
    </div>
  );
}
