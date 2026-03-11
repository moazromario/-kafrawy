import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  History, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronLeft, 
  RotateCcw,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "@/src/context/JobsContext";
import { cn } from "@/src/utils/cn";

export default function JobHistoryPage() {
  const navigate = useNavigate();
  const { jobs, applications } = useJobs();
  const historyApps = applications.filter(app => app.status === "Hired" || app.status === "Rejected");

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
        <h1 className="text-xl font-black text-[#050505]">سجل الوظائف</h1>
      </header>

      <main className="p-6 space-y-6 max-w-xl mx-auto">
        {historyApps.map((app, i) => {
          const job = jobs.find(j => j.id === app.jobId) || jobs[0];
          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl p-2 border border-gray-100 flex items-center justify-center">
                    <img src={job.companyLogo} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#050505]">{job.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400">{job.company} • {app.appliedAt}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black",
                  app.status === "Hired" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                )}>
                  {app.status === "Hired" ? "تم القبول" : "تم الرفض"}
                </div>
              </div>
              <button className="w-full py-3 bg-gray-50 text-[#1877F2] rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
                <RotateCcw size={14} />
                <span>إعادة التقديم</span>
              </button>
            </motion.div>
          );
        })}

        {historyApps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <History size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#050505]">السجل فارغ</h3>
              <p className="text-sm text-gray-400">لم تقم بإكمال أي طلبات توظيف بعد.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
