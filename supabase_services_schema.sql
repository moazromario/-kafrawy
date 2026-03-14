-- Services Module Schema

-- 1. Workers Table (Extends Profile)
CREATE TABLE workers (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  specialty TEXT NOT NULL,
  experience_years INTEGER,
  hourly_rate DECIMAL(10,2),
  bio TEXT,
  is_available BOOLEAN DEFAULT true,
  rating FLOAT DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Service Requests Table
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'completed', 'cancelled'
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  price DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Service Reviews Table
CREATE TABLE service_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS Policies
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;

-- Workers Policies
CREATE POLICY "Anyone can view workers" ON workers FOR SELECT USING (true);
CREATE POLICY "Workers can manage own profile" ON workers FOR ALL USING (auth.uid() = user_id);

-- Service Requests Policies
CREATE POLICY "Clients can view own requests" ON service_requests FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Workers can view requests assigned to them" ON service_requests FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Clients can create requests" ON service_requests FOR INSERT WITH CHECK (auth.uid() = client_id);

-- 5. Trigger to update worker rating
CREATE OR REPLACE FUNCTION update_worker_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE workers
  SET rating = (SELECT AVG(rating) FROM service_reviews WHERE worker_id = NEW.worker_id),
      reviews_count = (SELECT COUNT(*) FROM service_reviews WHERE worker_id = NEW.worker_id)
  WHERE user_id = NEW.worker_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_service_review_added
  AFTER INSERT ON service_reviews
  FOR EACH ROW EXECUTE FUNCTION update_worker_rating();
