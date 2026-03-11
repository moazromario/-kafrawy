import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  Home, 
  Briefcase, 
  CheckCircle2, 
  ChevronLeft, 
  ArrowLeft,
  Navigation,
  Plus,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddServiceAddressPage() {
  const navigate = useNavigate();
  const [addressType, setAddressType] = useState("home");
  const [addressDetails, setAddressDetails] = useState("");

  const handleSave = () => {
    // In a real app, we'd save this to the user's profile
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-40">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">إضافة عنوان جديد</h1>
      </header>

      <main className="p-6 space-y-10">
        {/* Map Preview Placeholder */}
        <section className="relative h-64 bg-blue-50 rounded-[48px] overflow-hidden shadow-inner border border-white group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100/50 rounded-full animate-ping absolute -inset-0" />
              <div className="relative w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-[#1877F2] border border-blue-50">
                <MapPin size={32} />
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/50 flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Navigation size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الموقع الحالي</p>
                <p className="text-xs font-black text-[#050505] line-clamp-1">مدينة العبور، الحي الأول، فيلا ٤٥</p>
              </div>
            </div>
          </div>
        </section>

        {/* Address Type */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">نوع العنوان</h4>
          <div className="flex gap-4">
            {[
              { id: "home", name: "المنزل", icon: Home },
              { id: "work", name: "العمل", icon: Briefcase },
              { id: "other", name: "أخرى", icon: MapPin },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setAddressType(type.id)}
                className={`flex-1 p-5 rounded-[28px] border transition-all flex flex-col items-center gap-2 shadow-sm ${
                  addressType === type.id 
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-xl shadow-blue-100" 
                  : "bg-white text-gray-700 border-gray-50 hover:border-blue-200"
                }`}
              >
                <type.icon size={24} />
                <span className="text-xs font-black">{type.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Address Details Form */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">تفاصيل العنوان</h4>
            <div className="space-y-4">
              <div className="relative group">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="المنطقة / الحي"
                  className="w-full pr-12 pl-4 py-4 bg-white border border-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-sm"
                />
              </div>
              <div className="relative group">
                <Home className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="رقم الفيلا / العمارة"
                  className="w-full pr-12 pl-4 py-4 bg-white border border-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-sm"
                />
              </div>
              <textarea
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                placeholder="تفاصيل إضافية (رقم الشقة، علامة مميزة...)"
                className="w-full p-6 bg-white border border-gray-50 rounded-[32px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-sm min-h-[120px] resize-none"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handleSave}
            className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>حفظ العنوان</span>
            <CheckCircle2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
