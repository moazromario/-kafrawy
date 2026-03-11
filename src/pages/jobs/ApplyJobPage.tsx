import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  FileText, 
  Upload, 
  CheckCircle2, 
  X, 
  Send, 
  Paperclip, 
  Info, 
  AlertCircle,
  Stethoscope,
  Briefcase
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useJobs } from "@/src/context/JobsContext";
import { cn } from "@/src/utils/cn";

export default function ApplyJobPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { jobs, applyToJob } = useJobs();
  const job = jobs.find(j => j.id === id) || jobs[0];

  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!cvFile) return;
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      applyToJob(job.id, coverLetter, cvFile);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-100"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#050505]">تم إرسال طلبك بنجاح!</h2>
          <p className="text-sm font-bold text-gray-400 max-w-xs mx-auto">لقد تم إرسال طلب التقديم لشركة {job.company}. يمكنك متابعة حالة الطلب من لوحة التحكم.</p>
        </div>
        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={() => navigate("/jobs/dashboard")}
            className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 active:scale-95 transition-all"
          >
            متابعة الطلبات
          </button>
          <button 
            onClick={() => navigate("/jobs")}
            className="w-full py-5 bg-gray-50 text-gray-400 rounded-[32px] font-black text-lg active:scale-95 transition-all"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-32">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#050505]">تقديم طلب وظيفة</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{job.title} • {job.company}</p>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-xl mx-auto">
        {/* CV Upload */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-[#050505] px-2">رفع السيرة الذاتية</h3>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-6">
            <div className={cn(
              "w-full h-48 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all group cursor-pointer",
              cvFile ? "border-emerald-500 bg-emerald-50/30" : "border-gray-200 hover:border-[#1877F2] hover:bg-blue-50/30"
            )}>
              <input 
                type="file" 
                className="hidden" 
                id="cv-upload" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="cv-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all",
                  cvFile ? "bg-emerald-500 text-white" : "bg-gray-50 text-gray-400 group-hover:scale-110 group-hover:bg-[#1877F2] group-hover:text-white"
                )}>
                  {cvFile ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-[#050505]">{cvFile ? cvFile.name : "اضغط لرفع الملف"}</p>
                  <p className="text-[10px] font-bold text-gray-400">PDF, DOC, DOCX (بحد أقصى ٥ ميجابايت)</p>
                </div>
              </label>
            </div>
            {cvFile && (
              <button 
                onClick={() => setCvFile(null)}
                className="w-full py-4 bg-red-50 text-red-500 rounded-[24px] font-black text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
              >
                <X size={16} />
                <span>إزالة الملف</span>
              </button>
            )}
          </div>
        </section>

        {/* Cover Letter */}
        <section className="space-y-4">
          <h3 className="text-lg font-black text-[#050505] px-2">رسالة تعريفية (اختياري)</h3>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="لماذا تعتقد أنك الشخص المناسب لهذه الوظيفة؟"
              className="w-full p-6 bg-gray-50 border-none rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-inner min-h-[200px] resize-none"
            />
          </div>
        </section>

        {/* Tips */}
        <section className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex items-start gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1877F2] flex-shrink-0 shadow-sm">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-[#1877F2]">نصيحة كفراوي</h4>
            <p className="text-[10px] font-bold text-blue-700/70 leading-relaxed">تأكد من تحديث مهاراتك وخبراتك في السيرة الذاتية لتتناسب مع متطلبات هذه الوظيفة لزيادة فرص قبولك.</p>
          </div>
        </section>
      </main>

      {/* Submit Button Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handleSubmit}
            disabled={!cvFile || isSubmitting}
            className={cn(
              "w-full py-5 text-white rounded-[32px] font-black text-lg shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all",
              (!cvFile || isSubmitting) ? "bg-gray-300 shadow-none cursor-not-allowed" : "bg-[#1877F2] shadow-blue-100"
            )}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>تأكيد وإرسال الطلب</span>
                <Send size={24} className="rotate-180" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
