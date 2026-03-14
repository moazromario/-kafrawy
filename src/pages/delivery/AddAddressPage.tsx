import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  Navigation, 
  Home, 
  Briefcase, 
  Plus,
  CheckCircle2,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddAddressPage() {
  const navigate = useNavigate();
  const [addressType, setAddressType] = useState("home");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      navigate("/delivery");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
        >
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">إضافة عنوان جديد</h1>
      </header>

      <main className="p-6 space-y-8">
        {/* Map Placeholder */}
        <div className="relative h-48 bg-blue-50 rounded-[40px] overflow-hidden border-2 border-blue-100 shadow-inner flex items-center justify-center group">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i15!2i19293!3i12345!2m3!1e0!2sm!3i420120488!3m8!2sar!3seg!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425')] bg-cover bg-center" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1877F2] shadow-xl animate-bounce">
              <MapPin size={24} />
            </div>
            <button className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black text-[#1877F2] shadow-sm border border-blue-100">
              تحديد الموقع على الخريطة
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Address Type Toggle */}
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">نوع العنوان</label>
            <div className="flex gap-3">
              {[
                { id: "home", label: "المنزل", icon: Home },
                { id: "work", label: "العمل", icon: Briefcase },
                { id: "other", label: "أخرى", icon: Plus },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setAddressType(type.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[24px] font-black text-sm transition-all border-2 ${
                    addressType === type.id 
                    ? "bg-[#1877F2] text-white border-[#1877F2] shadow-lg shadow-blue-100" 
                    : "bg-white text-gray-500 border-gray-100 hover:border-blue-200"
                  }`}
                >
                  <type.icon size={18} />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-[#050505] px-2">المنطقة / الحي</label>
              <div className="relative">
                <Navigation className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="مثال: الحي الثالث، المجاورة الخامسة"
                  required
                  className="w-full pr-12 pl-4 py-4 bg-white border border-gray-100 rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#050505] px-2">اسم الشارع</label>
                <input 
                  type="text" 
                  placeholder="اسم الشارع"
                  required
                  className="w-full px-4 py-4 bg-white border border-gray-100 rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#050505] px-2">رقم المبنى / الشقة</label>
                <input 
                  type="text" 
                  placeholder="رقم المبنى"
                  required
                  className="w-full px-4 py-4 bg-white border border-gray-100 rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-[#050505] px-2 flex items-center gap-2">
                <span>ملاحظات إضافية</span>
                <span className="text-[10px] text-gray-400 font-normal">(اختياري)</span>
              </label>
              <div className="relative">
                <Info className="absolute right-4 top-4 text-gray-400" size={18} />
                <textarea 
                  placeholder="مثال: بجانب صيدلية كذا، أو علامة مميزة..."
                  rows={3}
                  className="w-full pr-12 pl-4 py-4 bg-white border border-gray-100 rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-300 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button 
            type="submit"
            disabled={isSaving}
            className={`w-full py-5 bg-[#1877F2] text-white rounded-[28px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95 transition-all ${isSaving ? "opacity-80 cursor-not-allowed" : ""}`}
          >
            {isSaving ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={24} />
                <span>حفظ العنوان</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
