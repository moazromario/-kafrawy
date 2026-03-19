import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2,
  XCircle,
  MoreVertical,
  Calendar,
  MessageSquare,
  Briefcase,
  User,
  FileText,
  Mail,
  Phone,
  Users
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useJobs, Application } from "@/src/context/JobsContext";
import { cn } from "@/src/utils/cn";
import { toast } from "sonner";

const STATUS_CONFIG = {
  Pending: { label: "قيد الانتظار", color: "bg-amber-50 text-amber-600", icon: Clock },
  Reviewed: { label: "تمت المراجعة", color: "bg-blue-50 text-[#1877F2]", icon: Search },
  Interview: { label: "مقابلة عمل", color: "bg-purple-50 text-purple-600", icon: Calendar },
  Hired: { label: "تم القبول", color: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  Rejected: { label: "تم الرفض", color: "bg-red-50 text-red-500", icon: XCircle },
};

export default function JobApplicationsPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { jobs, applications, updateApplicationStatus } = useJobs();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "reviewed" | "interview" | "hired" | "rejected">("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const job = jobs.find(j => j.id === jobId);
  const jobApplications = applications.filter(app => app.jobId === jobId);

  const filteredApps = jobApplications.filter(app => {
    if (activeTab === "all") return true;
    return app.status.toLowerCase() === activeTab;
  });

  const handleUpdateStatus = async (appId: string, newStatus: Application["status"]) => {
    try {
      setIsUpdating(appId);
      await updateApplicationStatus(appId, newStatus);
      toast.success("تم تحديث حالة الطلب بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الحالة");
    } finally {
      setIsUpdating(null);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <p className="text-gray-500">الوظيفة غير موجودة</p>
      </div>
    );
  }

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
          <div>
            <h1 className="text-xl font-black text-[#050505]">المتقدمين للوظيفة</h1>
            <p className="text-xs font-bold text-gray-400">{job.title}</p>
          </div>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {[
            { id: "all", label: "الكل" },
            { id: "pending", label: "قيد الانتظار" },
            { id: "reviewed", label: "تمت المراجعة" },
            { id: "interview", label: "مقابلة" },
            { id: "hired", label: "مقبول" },
            { id: "rejected", label: "مرفوض" },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap",
                activeTab === tab.id ? "bg-[#1877F2] text-white shadow-sm" : "bg-gray-100 text-gray-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={40} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-black text-[#050505]">لا يوجد متقدمين</h3>
              <p className="text-sm text-gray-400">لم يتم العثور على طلبات تطابق الفلتر الحالي</p>
            </div>
          ) : (
            filteredApps.map((app, i) => {
              const status = STATUS_CONFIG[app.status];

              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 space-y-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                        <User size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[#050505]">{app.applicantName || "متقدم"}</h3>
                        <p className="text-[10px] font-bold text-gray-400">قدم منذ {app.appliedAt}</p>
                      </div>
                    </div>
                    <div className={cn("px-3 py-1.5 rounded-xl flex items-center gap-1.5", status.color)}>
                      <status.icon size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                    </div>
                  </div>

                  {app.coverLetter && (
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {app.coverLetter}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2">
                      <FileText size={16} />
                      عرض السيرة الذاتية
                    </button>
                    <button className="w-12 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl flex items-center justify-center transition-all">
                      <MessageSquare size={18} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value as Application["status"])}
                      disabled={isUpdating === app.id}
                      className="bg-gray-50 border border-gray-100 text-gray-700 text-xs rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 font-black outline-none"
                    >
                      <option value="Pending">قيد الانتظار</option>
                      <option value="Reviewed">تمت المراجعة</option>
                      <option value="Interview">مقابلة عمل</option>
                      <option value="Hired">قبول</option>
                      <option value="Rejected">رفض</option>
                    </select>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
