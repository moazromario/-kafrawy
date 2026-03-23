import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { jobsService } from "../modules/jobs/jobsService";
import { useAuth } from "./AuthContext";
import { aiService, MatchResult } from "../services/aiService";

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
  applicantName?: string;
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
  savedJobs: string[]; // Array of job IDs
  applyToJob: (jobId: string, coverLetter: string, cvFile: File | null) => Promise<void>;
  updateApplicationStatus: (id: string, status: Application["status"]) => Promise<void>;
  saveJob: (jobId: string) => Promise<void>;
  searchJobs: (keyword: string, location?: string) => Promise<void>;
  payAndApply: (jobId: string, coverLetter: string, cvFile: File | null) => Promise<void>;
  getJobMatch: (jobId: string) => Promise<MatchResult | null>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
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
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        setIsLoading(true);
        const { data: dbJobs, error: jobsError } = await jobsService.getJobs();
        
        if (jobsError) {
          console.warn("Note: Using mock jobs data because:", jobsError.message);
        }

        if (dbJobs && dbJobs.length > 0) {
          const mappedJobs: Job[] = dbJobs.map((job: any) => ({
            id: job.id,
            title: job.title,
            company: job.company_name,
            companyLogo: job.company_logo || `https://picsum.photos/seed/${job.id}/100/100`,
            location: job.location || "غير محدد",
            type: job.job_type === 'full-time' ? 'دوام كامل' : job.job_type === 'part-time' ? 'دوام جزئي' : job.job_type === 'contract' ? 'عقد' : 'عن بعد',
            salary: job.salary_range || undefined,
            postedAt: new Date(job.created_at).toLocaleDateString('ar-EG'),
            description: job.description,
            requirements: job.requirements || [],
            benefits: job.benefits || [],
            category: job.category || "عام",
            isFeatured: job.is_featured,
          }));
          setJobs(mappedJobs);
        } else {
          // Fallback to mock data
          setJobs([
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
        }

        if (user) {
          const { data: dbApps, error: appsError } = await jobsService.getMyApplications();
          if (appsError) {
            console.warn("Could not fetch applications:", appsError.message);
          } else if (dbApps && dbApps.length > 0) {
            const mappedApps: Application[] = dbApps.map((app: any) => ({
              id: app.id,
              jobId: app.job_id,
              status: app.status === 'pending' ? 'Pending' : 
                      app.status === 'reviewed' ? 'Reviewed' : 
                      app.status === 'interviewing' ? 'Interview' : 
                      app.status === 'offered' ? 'Hired' : 'Rejected',
              appliedAt: new Date(app.created_at).toLocaleDateString('ar-EG'),
              coverLetter: app.cover_letter,
              cvUrl: app.resume_url,
            }));
            setApplications(mappedApps);
          }

          const { data: dbSaved, error: savedError } = await jobsService.getSavedJobs();
          if (savedError) {
            console.warn("Could not fetch saved jobs:", savedError.message);
          } else if (dbSaved) {
            setSavedJobs(dbSaved.map((s: any) => s.job_id));
          }
        }
      } catch (error) {
        console.error("Critical error in JobsContext:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobsData();
  }, [user]);

  const applyToJob = async (jobId: string, coverLetter: string, cvFile: File | null) => {
    if (!user) return;
    
    try {
      // In a real app, we would upload the CV file to storage first and get the URL
      const cvUrl = cvFile ? URL.createObjectURL(cvFile) : "";
      
      const { data: dbApp } = await jobsService.applyForJob(jobId, cvUrl, coverLetter);
      
      if (dbApp) {
        const newApp: Application = {
          id: dbApp.id,
          jobId,
          status: "Pending",
          appliedAt: new Date().toLocaleDateString("ar-EG"),
          coverLetter,
          cvUrl,
        };
        setApplications((prev) => [newApp, ...prev]);
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      // Fallback for UI if DB fails
      const newApp: Application = {
        id: `app${Date.now()}`,
        jobId,
        status: "Pending",
        appliedAt: new Date().toLocaleDateString("ar-EG"),
        coverLetter,
        cvUrl: cvFile ? URL.createObjectURL(cvFile) : undefined,
      };
      setApplications((prev) => [newApp, ...prev]);
    }
  };

  const updateApplicationStatus = async (id: string, status: Application["status"]) => {
    try {
      const dbStatus = status === 'Pending' ? 'pending' : 
                       status === 'Reviewed' ? 'reviewed' : 
                       status === 'Interview' ? 'interviewing' : 
                       status === 'Hired' ? 'offered' : 'rejected';
                       
      await jobsService.updateApplicationStatus(id, dbStatus);
      
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
    } catch (error) {
      console.error("Error updating application status:", error);
      // Fallback for UI
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
    }
  };

  const saveJob = async (jobId: string) => {
    if (!user) return;
    try {
      await jobsService.saveJob(jobId);
      setSavedJobs(prev => prev.includes(jobId) ? prev : [...prev, jobId]);
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const searchJobs = async (keyword: string, location?: string) => {
    try {
      const { data } = await jobsService.searchJobs(keyword, location);
      if (data) {
        const mappedJobs: Job[] = data.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company_name,
          companyLogo: job.company_logo || `https://picsum.photos/seed/${job.id}/100/100`,
          location: job.location || "غير محدد",
          type: job.job_type === 'full-time' ? 'دوام كامل' : job.job_type === 'part-time' ? 'دوام جزئي' : job.job_type === 'contract' ? 'عقد' : 'عن بعد',
          salary: job.salary_range || undefined,
          postedAt: new Date(job.created_at).toLocaleDateString('ar-EG'),
          description: job.description,
          requirements: job.requirements || [],
          benefits: job.benefits || [],
          category: job.category || "عام",
          isFeatured: job.is_featured,
        }));
        setJobs(mappedJobs);
      }
    } catch (error) {
      console.error("Error searching jobs:", error);
    }
  };

  const payAndApply = async (jobId: string, coverLetter: string, cvFile: File | null) => {
    if (!user) return;
    try {
      const cvUrl = cvFile ? URL.createObjectURL(cvFile) : "";
      const { data: dbApp } = await jobsService.payAndApply(jobId, cvUrl, coverLetter);
      if (dbApp) {
        const newApp: Application = {
          id: dbApp.id,
          jobId,
          status: "Pending",
          appliedAt: new Date().toLocaleDateString("ar-EG"),
          coverLetter,
          cvUrl,
        };
        setApplications((prev) => [newApp, ...prev]);
      }
    } catch (error) {
      console.error("Error paying and applying:", error);
      throw error;
    }
  };

  const { profile } = useAuth();

  const getJobMatch = async (jobId: string): Promise<MatchResult | null> => {
    if (!user || !profile) return null;
    const job = jobs.find(j => j.id === jobId);
    if (!job) return null;

    try {
      return await aiService.analyzeJobMatch(profile, job);
    } catch (error) {
      console.error("Error getting job match:", error);
      return null;
    }
  };

  return (
    <JobsContext.Provider value={{ 
      jobs, 
      applications, 
      companies, 
      savedJobs,
      applyToJob, 
      updateApplicationStatus,
      saveJob,
      searchJobs,
      payAndApply,
      getJobMatch
    }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) throw new Error("useJobs must be used within a JobsProvider");
  return context;
};
