import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Search, 
  Filter, 
  Clock, 
  ChevronLeft, 
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  Calendar,
  MessageSquare,
  Zap,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "@/src/context/JobsContext";
import { cn } from "@/src/utils/cn";

const STATUS_CONFIG = {
  Pending: { label: "قيد الانتظار", color: "bg-amber-50 text-amber-600", icon: Clock, progress: 25 },
  Reviewed: { label: "تمت المراجعة", color: "bg-blue-50 text-[#1877F2]", icon: Search, progress: 50 },
  Interview: { label: "مقابلة عمل", color: "bg-purple-50 text-purple-600", icon: Calendar, progress: 75 },
  Hired: { label: "تم القبول", color: "bg-emerald-50 text-emerald-600", icon: CheckCircle2, progress: 100 },
  Rejected: { label: "تم الرفض", color: "bg-red-50 text-red-500", icon: XCircle, progress: 100 },
};

export default function ApplicationsDashboardPage() {
  const navigate = useNavigate();
  const { jobs, applications } = useJobs();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "closed">("all");

  const filteredApps = applications.filter(app => {
    if (activeTab === "active") return app.status !== "Hired" && app.status !== "Rejected";
    if (activeTab === "closed") return app.status === "Hired" || app.status === "Rejected";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">إدارة طلباتي</h1>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl">
          {[
            { id: "all", label: "الكل" },
            { id: "active", label: "نشط" },
            { id: "closed", label: "مكتمل" },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 py-3 rounded-xl text-[10px] font-black transition-all",
                activeTab === tab.id ? "bg-white text-[#1877F2] shadow-sm" : "text-gray-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredApps.map((app, i) => {
            const job = jobs.find(j => j.id === app.jobId) || jobs[0];
            const status = STATUS_CONFIG[app.status];

            return (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 space-y-6 group cursor-pointer hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                      <img src={job.companyLogo} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#050505]">{job.title}</h3>
                      <p className="text-[10px] font-bold text-gray-400">{job.company}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-300 hover:text-gray-500 transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Status Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className={cn("px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-sm", status.color)}>
                      <status.icon size={12} />
                      <span>{status.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">تم التقديم في {app.appliedAt}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${status.progress}%` }}
                      className={cn("absolute inset-y-0 left-0 rounded-full", status.color.split(" ")[1].replace("text-", "bg-"))}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => navigate(`/jobs/details/${job.id}`)}
                    className="flex-1 py-4 bg-gray-50 text-[#1877F2] rounded-[24px] font-black text-xs flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
                  >
                    <span>تفاصيل الوظيفة</span>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="w-14 h-14 bg-blue-50 text-[#1877F2] rounded-2xl flex items-center justify-center shadow-sm border border-blue-100 active:scale-95 transition-all">
                    <MessageSquare size={20} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Briefcase size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#050505]">لا توجد طلبات</h3>
              <p className="text-sm text-gray-400">ابدأ بالتقديم على الوظائف المتاحة لتظهر طلباتك هنا.</p>
            </div>
            <button onClick={() => navigate("/jobs")} className="px-8 py-4 bg-[#1877F2] text-white rounded-[24px] font-black text-sm shadow-xl shadow-blue-100 active:scale-95 transition-all">
              تصفح الوظائف
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
