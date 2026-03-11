import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  User, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Zap, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Camera, 
  CheckCircle2, 
  Info,
  Stethoscope,
  FileText,
  X,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/src/utils/cn";

export default function CVBuilderPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "٠١٢٣٤٥٦٧٨٩",
    about: "مطور واجهات أمامية شغوف ببناء تجارب مستخدم مذهلة...",
    experience: [{ id: 1, title: "مطور جونيور", company: "حلول البرمجيات", period: "٢٠٢٢ - ٢٠٢٤" }],
    skills: ["React", "Tailwind CSS", "TypeScript"],
    education: [{ id: 1, degree: "بكالوريوس هندسة حاسب", school: "جامعة القاهرة", year: "٢٠٢٢" }],
    languages: ["العربية", "الإنجليزية"],
  });

  const steps = [
    { id: 1, label: "المعلومات", icon: User },
    { id: 2, label: "الخبرات", icon: Briefcase },
    { id: 3, label: "المهارات", icon: Zap },
    { id: 4, label: "المؤهلات", icon: GraduationCap },
  ];

  const handleNext = () => {
    if (activeStep < 4) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (id: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-32">
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
            <h1 className="text-xl font-black text-[#050505]">بناء السيرة الذاتية</h1>
          </div>
          <button className="w-12 h-12 bg-blue-50 text-[#1877F2] rounded-2xl flex items-center justify-center shadow-sm border border-blue-100 active:scale-95 transition-all">
            <Eye size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between px-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                activeStep === step.id 
                ? "bg-[#1877F2] text-white shadow-lg shadow-blue-100" 
                : activeStep > step.id 
                ? "bg-emerald-50 text-emerald-600" 
                : "bg-gray-50 text-gray-400"
              )}>
                {activeStep > step.id ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                activeStep === step.id ? "text-[#1877F2]" : "text-gray-400"
              )}>{step.label}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {activeStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
                    <img src="https://picsum.photos/seed/user1/200/200" className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1877F2] text-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center">
                    <Camera size={16} />
                  </button>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#050505]">أحمد محمد</h3>
                  <p className="text-xs font-bold text-gray-400">تعديل الصورة الشخصية</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">الاسم بالكامل</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">نبذة عني</label>
                  <textarea 
                    name="about"
                    value={formData.about} 
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all min-h-[120px] resize-none" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black text-[#050505]">الخبرات العملية</h3>
                <button className="w-10 h-10 bg-blue-50 text-[#1877F2] rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-all">
                  <Plus size={20} />
                </button>
              </div>
              {formData.experience.map((exp) => (
                <div key={exp.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-4 relative group">
                  <button className="absolute top-4 left-4 p-2 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">المسمى الوظيفي</label>
                    <input 
                      type="text" 
                      value={exp.title} 
                      onChange={(e) => handleExperienceChange(exp.id, "title", e.target.value)}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">الشركة</label>
                    <input 
                      type="text" 
                      value={exp.company} 
                      onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all" 
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-6">
                <h3 className="text-lg font-black text-[#050505]">المهارات</h3>
                <div className="flex flex-wrap gap-3">
                  {formData.skills.map((skill, i) => (
                    <div key={i} className="px-5 py-3 bg-blue-50 text-[#1877F2] rounded-2xl text-xs font-black flex items-center gap-2 group">
                      <span>{skill}</span>
                      <X size={14} className="cursor-pointer hover:text-red-500 transition-all" />
                    </div>
                  ))}
                  <button className="px-5 py-3 bg-gray-50 text-gray-400 rounded-2xl text-xs font-black flex items-center gap-2 border border-dashed border-gray-200 hover:border-[#1877F2] hover:text-[#1877F2] transition-all">
                    <Plus size={14} />
                    <span>إضافة مهارة</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-10 rounded-[48px] shadow-xl border border-gray-50 flex flex-col items-center text-center space-y-8">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#050505]">أحسنت!</h3>
                  <p className="text-sm font-bold text-gray-400 leading-relaxed">لقد أكملت جميع الخطوات الأساسية. يمكنك الآن حفظ سيرتك الذاتية أو معاينتها بشكل كامل.</p>
                </div>
                <button className="w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Save size={24} />
                  <span>حفظ السيرة الذاتية</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Buttons Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex gap-4">
          {activeStep > 1 && (
            <button 
              onClick={handlePrev}
              className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-[32px] font-black text-lg active:scale-95 transition-all"
            >
              السابق
            </button>
          )}
          <button 
            onClick={activeStep === 4 ? () => navigate("/jobs") : handleNext}
            className="flex-[2] py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>{activeStep === 4 ? "تم" : "التالي"}</span>
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
