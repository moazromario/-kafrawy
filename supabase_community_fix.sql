-- ===============================================================
-- COMMUNITY MODULE FIX & COMPLETION
-- ===============================================================

-- 1. POSTS TABLE UPDATES
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS page_id UUID; -- For posts on pages
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS city TEXT;

-- 2. COMMENTS TABLE UPDATES
ALTER TABLE comments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- 3. STORIES TABLE
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT,
  followers_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_followers (
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (page_id, user_id)
);

CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')) DEFAULT 'image',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Stories
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Stories are public" ON stories;
CREATE POLICY "Stories are public" ON stories FOR SELECT USING (expires_at > NOW());
DROP POLICY IF EXISTS "Users can insert own stories" ON stories;
CREATE POLICY "Users can insert own stories" ON stories FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. NEIGHBORHOOD ALERTS
CREATE TABLE IF NOT EXISTS neighborhood_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, warning, emergency
  location GEOGRAPHY(POINT),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Alerts
ALTER TABLE neighborhood_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Alerts are public" ON neighborhood_alerts;
CREATE POLICY "Alerts are public" ON neighborhood_alerts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert alerts" ON neighborhood_alerts;
CREATE POLICY "Users can insert alerts" ON neighborhood_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Shares
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Shares are public" ON shares;
CREATE POLICY "Shares are public" ON shares FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert shares" ON shares;
CREATE POLICY "Users can insert shares" ON shares FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- like, comment, follow, etc.
  target_id UUID, -- post_id, comment_id, etc.
  content TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- 6. EVENTS
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  location TEXT,
  lat_lng GEOGRAPHY(POINT),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_attendees (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'going', -- going, interested, invited
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- Enable RLS for Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Events are public" ON events;
CREATE POLICY "Events are public" ON events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own events" ON events;
CREATE POLICY "Users can manage own events" ON events FOR ALL USING (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Event attendees are public" ON event_attendees;
CREATE POLICY "Event attendees are public" ON event_attendees FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can join events" ON event_attendees;
CREATE POLICY "Users can join events" ON event_attendees FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. MESSAGING
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  last_message_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to conversations for last_message_id
ALTER TABLE conversations ADD CONSTRAINT fk_last_message FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE SET NULL;

-- Enable RLS for Messaging
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can view own participants" ON conversation_participants;
CREATE POLICY "Users can view own participants" ON conversation_participants FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = conversation_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = conversation_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can insert own messages" ON messages;
CREATE POLICY "Users can insert own messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 9. SMART FEED RPC
CREATE OR REPLACE FUNCTION smart_feed(uid UUID)
RETURNS SETOF posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM posts
  WHERE deleted_at IS NULL
    AND (
      -- Public posts
      group_id IS NULL OR 
      -- Or posts in groups user is member of
      EXISTS (
        SELECT 1 FROM group_members 
        WHERE group_members.group_id = posts.group_id 
        AND group_members.user_id = uid
      )
    )
  ORDER BY trending_score DESC, created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. STORAGE BUCKET (Ensure it exists and has policies)
-- This is usually done via SQL or Dashboard, but here's the SQL for reference
INSERT INTO storage.buckets (id, name, public) VALUES ('community_media', 'community_media', true) ON CONFLICT (id) DO NOTHING;

-- Add storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'community_media');

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'community_media' AND auth.role() = 'authenticated');

-- 9. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
