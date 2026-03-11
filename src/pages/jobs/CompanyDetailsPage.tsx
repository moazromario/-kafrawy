import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  Users, 
  Building2, 
  Globe, 
  CheckCircle2, 
  ChevronLeft, 
  Briefcase, 
  Clock, 
  Zap, 
  Star, 
  Heart, 
  Share2,
  Stethoscope
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useJobs } from "@/src/context/JobsContext";
import { cn } from "@/src/utils/cn";

export default function CompanyDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { companies, jobs } = useJobs();
  const company = companies.find(c => c.id === id) || companies[0];
  const companyJobs = jobs.filter(j => j.company === company.name);

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">ملف الشركة</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all border border-gray-100">
            <Heart size={24} />
          </button>
          <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#1877F2] transition-all border border-gray-100">
            <Share2 size={24} />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-xl mx-auto">
        {/* Company Header Card */}
        <section className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 bg-gray-50 rounded-[32px] p-4 shadow-xl border-4 border-white flex items-center justify-center">
            <img src={company.logo} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-black text-[#050505]">{company.name}</h2>
              <CheckCircle2 size={20} className="text-[#1877F2]" />
            </div>
            <p className="text-sm font-bold text-gray-400">{company.location}</p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <div className="flex flex-col items-center gap-1">
              <Users size={18} className="text-[#1877F2]" />
              <span>{company.employeeCount}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Briefcase size={18} className="text-[#1877F2]" />
              <span>{company.openPositions} وظائف</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Globe size={18} className="text-[#1877F2]" />
              <span>موقعنا</span>
            </div>
          </div>
          <button className="w-full py-4 bg-[#1877F2] text-white rounded-[24px] font-black text-sm shadow-xl shadow-blue-100 active:scale-95 transition-all">
            متابعة الشركة
          </button>
        </section>

        {/* About Company */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-[#050505] px-2">عن الشركة</h3>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
            <p className="text-sm font-bold text-gray-500 leading-relaxed">{company.description}</p>
          </div>
        </section>

        {/* Open Positions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-[#050505]">الوظائف المتاحة</h3>
            <span className="text-xs font-black text-[#1877F2]">{companyJobs.length} وظيفة</span>
          </div>
          <div className="space-y-4">
            {companyJobs.map((job) => (
              <motion.div
                key={job.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/jobs/details/${job.id}`)}
                className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <img src={job.companyLogo} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#050505] group-hover:text-[#1877F2] transition-colors">{job.title}</h4>
                    <p className="text-[10px] font-bold text-gray-400 mb-1">{job.type} • {job.postedAt}</p>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#1877F2]" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-[#1877F2] transition-all">
                  <ChevronLeft size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
