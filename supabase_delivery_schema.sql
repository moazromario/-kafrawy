-- Delivery Module Schema

-- 1. Drivers Table (Extends Profile)
CREATE TABLE drivers (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  vehicle_type TEXT NOT NULL, -- 'bike', 'car', 'truck'
  vehicle_number TEXT,
  is_active BOOLEAN DEFAULT false,
  current_location GEOGRAPHY(POINT),
  rating FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Delivery Orders Table
CREATE TABLE delivery_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  pickup_location GEOGRAPHY(POINT),
  delivery_location GEOGRAPHY(POINT),
  status TEXT DEFAULT 'pending', -- 'pending', 'assigned', 'picked_up', 'delivered', 'cancelled'
  total_price DECIMAL(10,2),
  estimated_time INTEGER, -- in minutes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS Policies
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_orders ENABLE ROW LEVEL SECURITY;

-- Drivers Policies
CREATE POLICY "Anyone can view active drivers" ON drivers FOR SELECT USING (is_active = true);
CREATE POLICY "Drivers can manage own profile" ON drivers FOR ALL USING (auth.uid() = user_id);

-- Delivery Orders Policies
CREATE POLICY "Customers can view own delivery orders" ON delivery_orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Drivers can view assigned delivery orders" ON delivery_orders FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can view pending delivery orders" ON delivery_orders FOR SELECT USING (status = 'pending');
CREATE POLICY "Customers can create delivery orders" ON delivery_orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
