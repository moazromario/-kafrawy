import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Plus, 
  Users, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  MoreVertical, 
  ChevronLeft, 
  Clock, 
  Eye, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "@/src/context/JobsContext";
import { cn } from "@/src/utils/cn";

const STATS = [
  { label: "وظائف نشطة", value: "٨", icon: Briefcase, color: "bg-blue-50 text-[#1877F2]" },
  { label: "إجمالي المتقدمين", value: "١٢٤", icon: Users, color: "bg-purple-50 text-purple-600" },
  { label: "تم تعيينهم", value: "١٢", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
];

export default function EmployerDashboardPage() {
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const postedJobs = jobs.slice(0, 3); // Mocking posted jobs

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
            >
              <ArrowRight size={24} />
            </button>
            <h1 className="text-xl font-black text-[#050505]">لوحة تحكم الشركات</h1>
          </div>
          <button 
            onClick={() => navigate('/jobs/post')}
            className="w-12 h-12 bg-[#1877F2] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-1">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mb-1", stat.color)}>
                <stat.icon size={18} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">{stat.label}</span>
              <span className="text-lg font-black text-[#050505]">{stat.value}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-xl mx-auto">
        {/* Active Jobs List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-[#050505]">الوظائف المنشورة</h2>
            <button className="text-xs font-black text-[#1877F2]">عرض الكل</button>
          </div>
          <div className="space-y-4">
            {postedJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 space-y-6 group cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center">
                      <img src={job.companyLogo} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#050505]">{job.title}</h3>
                      <p className="text-[10px] font-bold text-gray-400">تم النشر {job.postedAt}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-300 hover:text-gray-500 transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المتقدمين</span>
                    <span className="text-base font-black text-[#1877F2]">٢٤</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المشاهدات</span>
                    <span className="text-base font-black text-[#050505]">١٥٦</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/jobs/${job.id}/applications`)}
                    className="flex-1 py-4 bg-[#1877F2] text-white rounded-[24px] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
                  >
                    <Users size={16} />
                    <span>إدارة المتقدمين</span>
                  </button>
                  <button className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100">
                    <Edit3 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Applicants */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-[#050505]">أحدث المتقدمين</h2>
            <button className="text-xs font-black text-[#1877F2]">عرض الكل</button>
          </div>
          <div className="space-y-4">
            {[
              { name: "محمد علي", role: "مطور واجهات", time: "منذ ساعة", avatar: "https://picsum.photos/seed/user1/100/100" },
              { name: "سارة حسن", role: "مصممة UI/UX", time: "منذ ٣ ساعات", avatar: "https://picsum.photos/seed/user2/100/100" },
            ].map((applicant, i) => (
              <div key={i} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                    <img src={applicant.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#050505]">{applicant.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400">{applicant.role} • {applicant.time}</p>
                  </div>
                </div>
                <button className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-[#1877F2] transition-all">
                  <ChevronLeft size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
