-- Jobs Module Schema

-- 1. Job Posts Table
CREATE TABLE job_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo TEXT,
  description TEXT NOT NULL,
  requirements TEXT[],
  benefits TEXT[],
  salary_range TEXT,
  location TEXT,
  job_type TEXT DEFAULT 'full-time', -- 'full-time', 'part-time', 'contract', 'freelance'
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active', -- 'active', 'closed', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Job Applications Table
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'interviewing', 'offered', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

-- 3. RLS Policies
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Job Posts Policies
CREATE POLICY "Anyone can view active job posts" ON job_posts FOR SELECT USING (status = 'active');
CREATE POLICY "Employers can manage own job posts" ON job_posts FOR ALL USING (auth.uid() = employer_id);

-- Job Applications Policies
CREATE POLICY "Applicants can view own applications" ON job_applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Employers can view applications for own jobs" ON job_applications FOR SELECT 
USING (EXISTS (SELECT 1 FROM job_posts WHERE id = job_applications.job_id AND employer_id = auth.uid()));
CREATE POLICY "Applicants can create applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
