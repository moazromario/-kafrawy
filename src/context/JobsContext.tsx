import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string; // Full-time, Part-time, etc.
  salary?: string;
  postedAt: string;
  description: string;
  requirements: string[];
  benefits: string[];
  category: string;
  isFeatured?: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  status: "Pending" | "Reviewed" | "Interview" | "Hired" | "Rejected";
  appliedAt: string;
  coverLetter?: string;
  cvUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  employeeCount: string;
  location: string;
  openPositions: number;
}

interface JobsContextType {
  jobs: Job[];
  applications: Application[];
  companies: Company[];
  applyToJob: (jobId: string, coverLetter: string, cvFile: File | null) => void;
  updateApplicationStatus: (id: string, status: Application["status"]) => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const [jobs] = useState<Job[]>([
    {
      id: "1",
      title: "مطور واجهات أمامية (React)",
      company: "تكنو سوفت",
      companyLogo: "https://picsum.photos/seed/comp1/100/100",
      location: "الرياض، السعودية",
      type: "دوام كامل",
      salary: "١٢,٠٠٠ - ١٥,٠٠٠ ريال",
      postedAt: "منذ يومين",
      category: "IT",
      isFeatured: true,
      description: "نحن نبحث عن مطور واجهات أمامية محترف للانضمام إلى فريقنا المبدع...",
      requirements: ["خبرة ٣ سنوات في React", "إتقان Tailwind CSS", "معرفة بـ TypeScript"],
      benefits: ["تأمين طبي شامل", "ساعات عمل مرنة", "مكافآت سنوية"],
    },
    {
      id: "2",
      title: "مدير تسويق رقمي",
      company: "ميديا برو",
      companyLogo: "https://picsum.photos/seed/comp2/100/100",
      location: "دبي، الإمارات",
      type: "عن بعد",
      salary: "٨,٠٠٠ - ١٠,٠٠٠ درهم",
      postedAt: "منذ ٥ ساعات",
      category: "تسويق",
      isFeatured: true,
      description: "مطلوب خبير في التسويق الرقمي لإدارة الحملات الإعلانية على منصات التواصل...",
      requirements: ["خبرة في Google Ads", "مهارات تحليل البيانات", "إدارة فرق العمل"],
      benefits: ["بدل سكن", "تذاكر طيران سنوية"],
    },
    {
      id: "3",
      title: "محاسب مالي",
      company: "الخليج للاستثمار",
      companyLogo: "https://picsum.photos/seed/comp3/100/100",
      location: "جدة، السعودية",
      type: "دوام كامل",
      salary: "٩,٠٠٠ ريال",
      postedAt: "منذ ٣ أيام",
      category: "محاسبة",
      description: "القيام بكافة المهام المحاسبية وإعداد التقارير المالية الدورية...",
      requirements: ["بكالوريوس محاسبة", "خبرة في برامج ERP", "إجادة اللغة الإنجليزية"],
      benefits: ["بيئة عمل احترافية"],
    },
  ]);

  const [applications, setApplications] = useState<Application[]>([
    { id: "app1", jobId: "1", status: "Reviewed", appliedAt: "١٠ مارس ٢٠٢٦" },
    { id: "app2", jobId: "3", status: "Pending", appliedAt: "٠٨ مارس ٢٠٢٦" },
  ]);

  const [companies] = useState<Company[]>([
    {
      id: "c1",
      name: "تكنو سوفت",
      logo: "https://picsum.photos/seed/comp1/100/100",
      description: "شركة رائدة في مجال حلول البرمجيات والتحول الرقمي.",
      employeeCount: "٥٠-١٠٠ موظف",
      location: "الرياض، السعودية",
      openPositions: 5,
    },
  ]);

  const applyToJob = (jobId: string, coverLetter: string, cvFile: File | null) => {
    const newApp: Application = {
      id: `app${Date.now()}`,
      jobId,
      status: "Pending",
      appliedAt: new Date().toLocaleDateString("ar-SA"),
      coverLetter,
      cvUrl: cvFile ? URL.createObjectURL(cvFile) : undefined,
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  const updateApplicationStatus = (id: string, status: Application["status"]) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  return (
    <JobsContext.Provider value={{ jobs, applications, companies, applyToJob, updateApplicationStatus }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) throw new Error("useJobs must be used within a JobsProvider");
  return context;
};
