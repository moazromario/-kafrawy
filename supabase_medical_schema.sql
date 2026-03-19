-- 1️⃣ جدول الأطباء
create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  name text not null,
  specialization text,
  experience int,
  fees numeric,
  rating float default 0,
  city text,
  image text,
  created_at timestamp default now()
);

-- 2️⃣ جدول التخصصات
create table if not exists specializations (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

-- 3️⃣ جدول المواعيد (Availability)
create table if not exists doctor_slots (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete cascade,
  day text not null,
  start_time time not null,
  end_time time not null,
  is_available boolean default true
);

-- 4️⃣ جدول الحجوزات
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete cascade,
  user_id uuid references auth.users(id),
  slot_id uuid references doctor_slots(id) on delete cascade,
  status text default 'pending',
  type text default 'clinic',
  price numeric,
  created_at timestamp default now()
);

-- 5️⃣ التقييمات
create table if not exists doctor_reviews (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete cascade,
  user_id uuid references auth.users(id),
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp default now()
);

-- RLS Policies
alter table doctors enable row level security;
alter table specializations enable row level security;
alter table doctor_slots enable row level security;
alter table bookings enable row level security;
alter table doctor_reviews enable row level security;

-- Doctors: anyone can read, only authenticated users can create
create policy "Anyone can view doctors" on doctors for select using (true);
create policy "Users can insert their own doctor profile" on doctors for insert with check (auth.uid() = user_id);
create policy "Users can update their own doctor profile" on doctors for update using (auth.uid() = user_id);

-- Specializations: anyone can read
create policy "Anyone can view specializations" on specializations for select using (true);

-- Doctor Slots: anyone can read, doctors can manage their own
create policy "Anyone can view doctor slots" on doctor_slots for select using (true);
create policy "Doctors can manage their slots" on doctor_slots for all using (
  exists (select 1 from doctors where id = doctor_slots.doctor_id and user_id = auth.uid())
);

-- Bookings: users can view and manage their own bookings, doctors can view and manage bookings for their slots
create policy "Users can view their own bookings" on bookings for select using (
  auth.uid() = user_id or 
  exists (select 1 from doctors where id = bookings.doctor_id and user_id = auth.uid())
);
create policy "Users can create bookings" on bookings for insert with check (auth.uid() = user_id);
create policy "Users can update their own bookings" on bookings for update using (auth.uid() = user_id);
create policy "Doctors can update their bookings" on bookings for update using (
  exists (select 1 from doctors where id = bookings.doctor_id and user_id = auth.uid())
);

-- Reviews: anyone can read, authenticated users can create
create policy "Anyone can view reviews" on doctor_reviews for select using (true);
create policy "Users can create reviews" on doctor_reviews for insert with check (auth.uid() = user_id);
