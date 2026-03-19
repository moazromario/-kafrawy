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

-- 3. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_job_posts_employer_id ON job_posts(employer_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_status ON job_posts(status);
CREATE INDEX IF NOT EXISTS idx_job_posts_category ON job_posts(category);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON job_applications(applicant_id);

-- 4. RLS Policies
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
CREATE POLICY "Employers can update application status" ON job_applications FOR UPDATE USING (EXISTS (SELECT 1 FROM job_posts WHERE id = job_applications.job_id AND employer_id = auth.uid()));

-- 5. RPC for Atomic Pay and Apply
CREATE OR REPLACE FUNCTION apply_with_payment(
  p_job_id UUID,
  p_resume_url TEXT,
  p_cover_letter TEXT,
  p_amount DECIMAL(12,2)
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_balance DECIMAL(12,2);
  v_application_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- 1. Check balance
  SELECT balance INTO v_balance FROM wallets WHERE user_id = v_user_id;
  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;

  -- 2. Deduct balance
  UPDATE wallets SET balance = balance - p_amount WHERE user_id = v_user_id;

  -- 3. Create transaction
  INSERT INTO transactions (user_id, amount, type, description, reference_id)
  VALUES (v_user_id, -p_amount, 'payment', 'تقديم وظيفة مدفوع', p_job_id);

  -- 4. Create application
  INSERT INTO job_applications (job_id, applicant_id, resume_url, cover_letter)
  VALUES (p_job_id, v_user_id, p_resume_url, p_cover_letter)
  RETURNING id INTO v_application_id;

  -- 5. Create notification
  INSERT INTO notifications (user_id, title, content)
  VALUES (v_user_id, 'تم استلام طلبك المدفوع', 'لقد تم إرسال طلبك بنجاح للوظيفة مع ميزة التقديم السريع.');

  RETURN json_build_object('id', v_application_id, 'status', 'success');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
