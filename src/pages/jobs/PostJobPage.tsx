import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Briefcase, MapPin, DollarSign, FileText, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jobsService } from "@/src/modules/jobs/jobsService";
import { useAuth } from "@/src/context/AuthContext";

export default function PostJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    location: "",
    job_type: "full-time",
    salary_range: "",
    description: "",
    requirements: "",
    benefits: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("يجب تسجيل الدخول كصاحب عمل لنشر وظيفة");
      return;
    }

    setIsSubmitting(true);
    try {
      await jobsService.createJobPost({
        title: formData.title,
        company_name: formData.company_name,
        location: formData.location,
        job_type: formData.job_type,
        salary_range: formData.salary_range,
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(r => r.trim() !== ''),
        benefits: formData.benefits.split('\n').filter(b => b.trim() !== ''),
        status: 'active',
        category: 'عام',
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error posting job:", error);
      alert("حدث خطأ أثناء نشر الوظيفة");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-2xl font-black text-[#050505] mb-2">تم نشر الوظيفة بنجاح!</h1>
        <p className="text-gray-500 font-bold mb-8">يمكنك الآن استقبال طلبات التوظيف ومراجعتها.</p>
        <button
          onClick={() => navigate("/jobs/employer")}
          className="w-full bg-[#1877F2] text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200"
        >
          العودة للوحة التحكم
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <ArrowRight size={20} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">نشر وظيفة جديدة</h1>
        </div>
      </header>

      <main className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm space-y-4">
            <h2 className="text-lg font-black text-[#050505] mb-4">المعلومات الأساسية</h2>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">المسمى الوظيفي</label>
              <div className="relative">
                <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="مثال: مطور واجهات أمامية"
                  className="w-full pr-12 pl-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">اسم الشركة</label>
              <input
                type="text"
                name="company_name"
                required
                value={formData.company_name}
                onChange={handleChange}
                placeholder="اسم شركتك"
                className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الموقع</label>
              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="مثال: الرياض، السعودية"
                  className="w-full pr-12 pl-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نوع الوظيفة</label>
                <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none"
                >
                  <option value="full-time">دوام كامل</option>
                  <option value="part-time">دوام جزئي</option>
                  <option value="contract">عقد</option>
                  <option value="freelance">عمل حر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الراتب المتوقع</label>
                <div className="relative">
                  <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="salary_range"
                    value={formData.salary_range}
                    onChange={handleChange}
                    placeholder="مثال: 5000 - 8000"
                    className="w-full pr-12 pl-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm space-y-4">
            <h2 className="text-lg font-black text-[#050505] mb-4">تفاصيل الوظيفة</h2>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الوصف الوظيفي</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="اكتب وصفاً مفصلاً للوظيفة والمهام المطلوبة..."
                className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">المتطلبات (كل متطلب في سطر)</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                placeholder="- خبرة 3 سنوات&#10;- إجادة اللغة الإنجليزية"
                className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">المميزات (كل ميزة في سطر)</label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={4}
                placeholder="- تأمين طبي&#10;- بيئة عمل مرنة"
                className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1877F2] text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? "جاري النشر..." : "نشر الوظيفة"}
            <FileText size={20} />
          </button>
        </form>
      </main>
    </div>
  );
}
