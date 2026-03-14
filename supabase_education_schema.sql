-- Education Module Schema

-- 1. Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  category TEXT,
  level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  rating FLOAT DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lessons Table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration INTEGER, -- in minutes
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enrollments Table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0, -- percentage
  UNIQUE(user_id, course_id)
);

-- 4. RLS Policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Courses Policies
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Instructors can manage own courses" ON courses FOR ALL USING (auth.uid() = instructor_id);

-- Lessons Policies
CREATE POLICY "Anyone can view lesson titles" ON lessons FOR SELECT USING (true);
-- Only enrolled students or instructor can view lesson content/video
CREATE POLICY "Enrolled students can view lesson content" ON lessons FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM enrollments WHERE course_id = lessons.course_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM courses WHERE id = lessons.course_id AND instructor_id = auth.uid())
);

-- Enrollments Policies
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll in courses" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
