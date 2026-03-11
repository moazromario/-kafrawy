import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Search, 
  Filter, 
  Clock, 
  ChevronLeft, 
  ArrowLeft,
  Stethoscope,
  Hospital,
  Building2,
  FileText,
  Microscope,
  Activity,
  Plus,
  Zap,
  Download,
  Share2,
  Eye,
  Trash2,
  Calendar,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMedical } from "@/src/context/MedicalContext";

export default function MedicalRecordsPage() {
  const navigate = useNavigate();
  const { records } = useMedical();
  const [activeTab, setActiveTab] = useState<"all" | "prescriptions" | "labs" | "reports">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.title.includes(searchQuery) || r.doctorName.includes(searchQuery);
    const matchesTab = activeTab === "all" || 
      (activeTab === "prescriptions" && r.type === "prescription") ||
      (activeTab === "labs" && r.type === "lab") ||
      (activeTab === "reports" && r.type === "report");
    return matchesSearch && matchesTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "prescription": return <FileText size={20} />;
      case "lab": return <Microscope size={20} />;
      case "report": return <Activity size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "prescription": return "bg-blue-50 text-[#1E90FF]";
      case "lab": return "bg-emerald-50 text-emerald-600";
      case "report": return "bg-purple-50 text-purple-600";
      default: return "bg-gray-50 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
            >
              <ArrowRight size={24} />
            </button>
            <h1 className="text-xl font-black text-[#050505]">ملفاتي الطبية</h1>
          </div>
          <button className="w-12 h-12 bg-[#1E90FF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 active:scale-95 transition-all">
            <Plus size={24} />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E90FF] transition-colors" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في ملفاتك الطبية..."
            className="w-full pr-12 pl-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all placeholder:text-gray-400 shadow-inner"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: "all", label: "الكل" },
            { id: "prescriptions", label: "روشتات" },
            { id: "labs", label: "تحاليل" },
            { id: "reports", label: "تقارير" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all ${
                activeTab === tab.id 
                ? "bg-[#1E90FF] text-white shadow-lg shadow-blue-100" 
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Profile Summary Card */}
        <section className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 flex items-center gap-6 group">
          <div className="w-20 h-20 rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
            <img src="https://picsum.photos/seed/user1/200/200" className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-[#050505]">أحمد محمد</h3>
              <ShieldCheck size={16} className="text-blue-500" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">فصيلة الدم: O+</p>
            <div className="flex items-center gap-4 pt-1">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400">العمر</span>
                <span className="text-xs font-black text-[#050505]">٢٨ سنة</span>
              </div>
              <div className="w-px h-6 bg-gray-100" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400">الوزن</span>
                <span className="text-xs font-black text-[#050505]">٧٥ كجم</span>
              </div>
            </div>
          </div>
        </section>

        {/* Records List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredRecords.map((record, i) => (
              <motion.div
                key={record.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex items-center justify-between group hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-500"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 ${getColor(record.type)} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    {getIcon(record.type)}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-[#050505]">{record.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{record.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Stethoscope size={12} />
                        <span>{record.doctorName}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-[#1E90FF] transition-all">
                    <Download size={18} />
                  </button>
                  <button className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-[#1E90FF] transition-all">
                    <Share2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredRecords.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <FileText size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#050505]">لا توجد ملفات</h3>
              <p className="text-sm text-gray-400">لم تقم بإضافة أي ملفات طبية بعد. يمكنك رفع الروشتات والتحاليل هنا للوصول إليها في أي وقت.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
