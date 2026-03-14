import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  FileText, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Calendar, 
  Stethoscope,
  Activity,
  Microscope,
  X,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MedicalAddRecordPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<"prescription" | "lab" | "report">("prescription");
  const [title, setTitle] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!title || !doctorName || !date) return;
    // In a real app, we would save the record to the context/backend
    navigate("/medical/success?type=record");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-40">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">إضافة ملف طبي</h1>
      </header>

      <main className="p-6 space-y-8">
        {/* Record Type Selection */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">نوع الملف</h4>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "prescription", label: "روشتة", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
              { id: "lab", label: "تحليل", icon: Microscope, color: "text-emerald-500", bg: "bg-emerald-50" },
              { id: "report", label: "تقرير", icon: Activity, color: "text-purple-500", bg: "bg-purple-50" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setType(item.id as any)}
                className={`flex flex-col items-center gap-3 p-4 rounded-[32px] transition-all border-2 ${
                  type === item.id 
                  ? "bg-white border-[#1E90FF] shadow-lg shadow-blue-50" 
                  : "bg-white border-transparent shadow-sm"
                }`}
              >
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center`}>
                  <item.icon size={24} />
                </div>
                <span className={`text-[10px] font-black ${type === item.id ? "text-[#1E90FF]" : "text-gray-400"}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Form Fields */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">عنوان الملف</h4>
            <div className="relative group">
              <FileText className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E90FF] transition-colors" size={20} />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: روشتة كشف العيون"
                className="w-full pr-14 pl-6 py-5 bg-white border border-gray-50 rounded-[32px] text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all placeholder:text-gray-400 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">اسم الطبيب / المركز</h4>
            <div className="relative group">
              <Stethoscope className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E90FF] transition-colors" size={20} />
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="اسم الطبيب أو اسم المعمل"
                className="w-full pr-14 pl-6 py-5 bg-white border border-gray-50 rounded-[32px] text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all placeholder:text-gray-400 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">تاريخ الفحص</h4>
            <div className="relative group">
              <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E90FF] transition-colors" size={20} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pr-14 pl-6 py-5 bg-white border border-gray-50 rounded-[32px] text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all text-gray-700 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">ملاحظات إضافية</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب أي ملاحظات تود تذكرها لاحقاً..."
              className="w-full p-6 bg-white border border-gray-50 rounded-[32px] text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all placeholder:text-gray-400 shadow-sm min-h-[120px] resize-none"
            />
          </div>
        </section>

        {/* File Upload */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">رفع الملفات</h4>
          <div className="grid grid-cols-2 gap-4">
            <button className="h-32 bg-white border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center text-gray-400 hover:border-[#1E90FF] hover:text-[#1E90FF] transition-all group">
              <Camera size={28} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black mt-2">تصوير بالكاميرا</span>
            </button>
            <button className="h-32 bg-white border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center text-gray-400 hover:border-[#1E90FF] hover:text-[#1E90FF] transition-all group">
              <Upload size={28} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black mt-2">رفع من الجهاز</span>
            </button>
          </div>
        </section>
      </main>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handleSubmit}
            disabled={!title || !doctorName || !date}
            className={`w-full py-5 bg-[#1E90FF] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all ${
              (!title || !doctorName || !date) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span>حفظ الملف</span>
            <CheckCircle2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
