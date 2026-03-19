import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  Clock, 
  Briefcase, 
  Zap, 
  ShieldCheck, 
  ChevronLeft, 
  Heart, 
  Share2, 
  Building2, 
  Users, 
  CheckCircle2, 
  Info,
  Stethoscope,
  Sparkles,
  Target,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useJobs } from "@/src/context/JobsContext";
import { useAuth } from "@/src/context/AuthContext";
import { MatchResult } from "@/src/services/aiService";
import { cn } from "@/src/utils/cn";
import { toast } from "sonner";

export default function JobDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { jobs, companies, saveJob, savedJobs, getJobMatch } = useJobs();
  const { user } = useAuth();
  const job = jobs.find(j => j.id === id) || jobs[0];
  const company = companies.find(c => c.name === job.company) || companies[0];
  const isSaved = savedJobs.includes(job.id);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const handleSave = async () => {
    await saveJob(job.id);
  };

  const handleAnalyzeMatch = async () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await getJobMatch(job.id);
      setMatchResult(result);
      if (result) {
        toast.success("تم تحليل التوافق بنجاح");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحليل");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-32">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">تفاصيل الوظيفة</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSave}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
              isSaved ? "bg-red-50 text-red-500 border-red-100" : "bg-gray-50 text-gray-400 border-gray-100"
            )}
          >
            <Heart size={24} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#1877F2] transition-all border border-gray-100">
            <Share2 size={24} />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-xl mx-auto">
        {/* Job Header Card */}
        <section className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-4">
          {/* AI Match Button */}
          {!matchResult && (
            <button
              onClick={handleAnalyzeMatch}
              disabled={isAnalyzing}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 active:scale-95 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>تحليل التوافق بالذكاء الاصطناعي</span>
                </>
              )}
            </button>
          )}

          {/* AI Match Result */}
          <AnimatePresence>
            {matchResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-gradient-to-br from-violet-50 to-indigo-50 p-6 rounded-[32px] border border-violet-100 space-y-4 text-right"
                dir="rtl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-violet-600 shadow-sm">
                      <Target size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-violet-900">نسبة التوافق الذكي</h4>
                      <p className="text-[10px] font-bold text-violet-600/70">بناءً على مهاراتك وخبراتك</p>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-violet-600">{matchResult.score}%</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-violet-500"><Info size={14} /></div>
                    <p className="text-xs font-bold text-violet-800 leading-relaxed">{matchResult.matchReason}</p>
                  </div>

                  {matchResult.missingSkills.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-wider">مهارات قد تنقصك</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missingSkills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white/50 text-violet-700 rounded-full text-[10px] font-bold border border-violet-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white/60 p-4 rounded-2xl flex items-start gap-3 border border-white">
                    <div className="text-emerald-500 mt-0.5"><Lightbulb size={16} /></div>
                    <div className="space-y-1">
                      <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">نصيحة كفراوي الذكية</h5>
                      <p className="text-[10px] font-bold text-emerald-600/80 leading-relaxed">{matchResult.advice}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setMatchResult(null)}
                  className="w-full py-2 text-[10px] font-black text-violet-400 hover:text-violet-600 transition-colors"
                >
                  إعادة التحليل
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-24 h-24 bg-gray-50 rounded-[32px] p-4 shadow-xl border-4 border-white flex items-center justify-center">
            <img src={job.companyLogo} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#050505]">{job.title}</h2>
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm font-bold text-[#1877F2]">{job.company}</p>
              <ShieldCheck size={16} className="text-emerald-500" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-[#1877F2]" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-[#1877F2]" />
              <span>{job.postedAt}</span>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <span className="px-4 py-1.5 bg-blue-50 text-[#1877F2] rounded-full text-[10px] font-black">{job.type}</span>
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black">{job.salary || "غير محدد"}</span>
          </div>
        </section>

        {/* Tabs / Info Sections */}
        <section className="space-y-8">
          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#050505] px-2">الوصف الوظيفي</h3>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
              <p className="text-sm font-bold text-gray-500 leading-relaxed">{job.description}</p>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#050505] px-2">المتطلبات</h3>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-4">
              {job.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-6 h-6 bg-blue-50 text-[#1877F2] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all">
                    <CheckCircle2 size={14} />
                  </div>
                  <p className="text-sm font-bold text-gray-500">{req}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#050505] px-2">المميزات والفوائد</h3>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-4">
              {job.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all">
                    <Zap size={14} />
                  </div>
                  <p className="text-sm font-bold text-gray-500">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#050505] px-2">عن الشركة</h3>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center">
                  <img src={company.logo} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#050505]">{company.name}</h4>
                  <p className="text-xs font-bold text-gray-400">{company.employeeCount}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-500 leading-relaxed">{company.description}</p>
              <button 
                onClick={() => navigate(`/jobs/company/${company.id}`)}
                className="w-full py-4 bg-gray-50 text-[#1877F2] rounded-[24px] font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
              >
                <span>عرض ملف الشركة</span>
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Apply Button Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={() => navigate(`/jobs/apply/${job.id}`)}
            className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>تقديم الآن</span>
            <Zap size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
