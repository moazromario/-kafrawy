-- ============================================================================
-- ADVANCED FACEBOOK-LIKE COMMUNITY SCHEMA
-- ============================================================================

-- ==========================================
-- 0. PERMISSIONS & STORAGE
-- ==========================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('community_media', 'community_media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'community_media');

DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'community_media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own media" ON storage.objects;
CREATE POLICY "Users can update their own media" ON storage.objects FOR UPDATE USING (bucket_id = 'community_media' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Users can delete their own media" ON storage.objects;
CREATE POLICY "Users can delete their own media" ON storage.objects FOR DELETE USING (bucket_id = 'community_media' AND auth.uid() = owner);

-- ==========================================
-- 1. PROFILES & CONNECTIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  cover_url TEXT,
  bio TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'custom', 'prefer_not_to_say')),
  birth_date DATE,
  relationship_status TEXT CHECK (relationship_status IN ('single', 'in_a_relationship', 'engaged', 'married', 'complicated', 'separated', 'divorced', 'widowed')),
  workplace TEXT,
  education TEXT,
  current_city TEXT,
  hometown TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS follows (
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- ==========================================
-- 2. PAGES & GROUPS
-- ==========================================

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  followers_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_followers (
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (page_id, user_id)
);

CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  privacy TEXT CHECK (privacy IN ('public', 'private', 'secret')) DEFAULT 'public',
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  members_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('member', 'moderator', 'admin')) DEFAULT 'member',
  status TEXT CHECK (status IN ('pending', 'approved', 'banned')) DEFAULT 'approved',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- ==========================================
-- 3. POSTS & MEDIA
-- ==========================================

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE, -- If posted by a page
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE, -- If posted in a group
  content TEXT,
  privacy TEXT CHECK (privacy IN ('public', 'friends', 'only_me', 'custom')) DEFAULT 'public',
  feeling TEXT, -- e.g., 'happy', 'sad', 'excited'
  activity TEXT, -- e.g., 'watching a movie', 'traveling to Paris'
  location TEXT,
  background_color TEXT, -- For text-only posts with colored backgrounds
  is_pinned BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

CREATE TABLE IF NOT EXISTS post_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'document')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tagged_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, tagged_user_id)
);

-- ==========================================
-- 4. COMMENTS & REACTIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For nested replies
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE, -- If commented as a page
  content TEXT NOT NULL,
  media_url TEXT,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Add columns safely if table already existed without them
ALTER TABLE posts ADD COLUMN IF NOT EXISTS page_id UUID REFERENCES pages(id) ON DELETE CASCADE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS privacy TEXT CHECK (privacy IN ('public', 'friends', 'only_me', 'custom')) DEFAULT 'public';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS feeling TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS activity TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS background_color TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS page_id UUID REFERENCES pages(id) ON DELETE CASCADE;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS replies_count INTEGER DEFAULT 0;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'love', 'haha', 'wow', 'sad', 'angry')) DEFAULT 'like',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure a user can only react once per post OR comment
  CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);
CREATE UNIQUE INDEX idx_unique_post_reaction ON reactions (user_id, post_id) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX idx_unique_comment_reaction ON reactions (user_id, comment_id) WHERE comment_id IS NOT NULL;

-- ==========================================
-- 5. SAVED ITEMS & NOTIFICATIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS saved_posts (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  collection_name TEXT DEFAULT 'Saved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('like', 'reaction', 'comment', 'reply', 'share', 'tag', 'friend_request', 'friend_accept', 'group_invite')),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 6. HELPER FUNCTIONS FOR RLS
-- ==========================================

CREATE OR REPLACE FUNCTION is_friend(user1 UUID, user2 UUID) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM friendships
    WHERE status = 'accepted'
    AND ((user_id = user1 AND friend_id = user2) OR (user_id = user2 AND friend_id = user1))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_group_member(user_uuid UUID, group_uuid UUID) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM group_members
    WHERE user_id = user_uuid AND group_id = group_uuid AND status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, owner update
DROP POLICY IF EXISTS "Profiles are public" ON profiles;
CREATE POLICY "Profiles are public" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Posts: Complex privacy logic
DROP POLICY IF EXISTS "View Posts" ON posts;
CREATE POLICY "View Posts" ON posts FOR SELECT USING (
  deleted_at IS NULL AND (
    auth.uid() = user_id OR -- Owner
    privacy = 'public' OR -- Public
    (privacy = 'friends' AND is_friend(auth.uid(), user_id)) OR -- Friends
    (group_id IS NOT NULL AND is_group_member(auth.uid(), group_id)) -- Group member
  )
);
DROP POLICY IF EXISTS "users insert posts" ON posts;
CREATE POLICY "users insert posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Update Posts" ON posts;
CREATE POLICY "Update Posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Delete Posts" ON posts;
CREATE POLICY "Delete Posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Post Media: Inherits post visibility
DROP POLICY IF EXISTS "View Post Media" ON post_media;
CREATE POLICY "View Post Media" ON post_media FOR SELECT USING (
  EXISTS (SELECT 1 FROM posts WHERE id = post_media.post_id)
);
DROP POLICY IF EXISTS "Manage Post Media" ON post_media;
CREATE POLICY "Manage Post Media" ON post_media FOR ALL USING (
  EXISTS (SELECT 1 FROM posts WHERE id = post_media.post_id AND user_id = auth.uid())
);

-- Comments: Inherits post visibility
DROP POLICY IF EXISTS "View Comments" ON comments;
CREATE POLICY "View Comments" ON comments FOR SELECT USING (
  deleted_at IS NULL AND EXISTS (SELECT 1 FROM posts WHERE id = comments.post_id)
);
DROP POLICY IF EXISTS "Create Comments" ON comments;
CREATE POLICY "Create Comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Update Comments" ON comments;
CREATE POLICY "Update Comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Delete Comments" ON comments;
CREATE POLICY "Delete Comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Reactions: Public read, owner manage
DROP POLICY IF EXISTS "View Reactions" ON reactions;
CREATE POLICY "View Reactions" ON reactions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Manage Reactions" ON reactions;
CREATE POLICY "Manage Reactions" ON reactions FOR ALL USING (auth.uid() = user_id);

-- Notifications: Owner only
DROP POLICY IF EXISTS "Manage Notifications" ON notifications;
CREATE POLICY "Manage Notifications" ON notifications FOR ALL USING (auth.uid() = recipient_id);

-- ==========================================
-- 8. TRIGGERS & AUTOMATION
-- ==========================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Post Reactions Counter
CREATE OR REPLACE FUNCTION update_post_reactions_count() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.post_id IS NOT NULL) THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE' AND OLD.post_id IS NOT NULL) THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_post_reactions_count ON reactions;
CREATE TRIGGER tr_update_post_reactions_count AFTER INSERT OR DELETE ON reactions FOR EACH ROW EXECUTE FUNCTION update_post_reactions_count();

-- Comment Reactions Counter
CREATE OR REPLACE FUNCTION update_comment_reactions_count() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.comment_id IS NOT NULL) THEN
    UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
  ELSIF (TG_OP = 'DELETE' AND OLD.comment_id IS NOT NULL) THEN
    UPDATE comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_comment_reactions_count ON reactions;
CREATE TRIGGER tr_update_comment_reactions_count AFTER INSERT OR DELETE ON reactions FOR EACH ROW EXECUTE FUNCTION update_comment_reactions_count();

-- Post Comments Counter
CREATE OR REPLACE FUNCTION update_post_comments_count() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF NEW.parent_id IS NULL THEN
      UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSE
      UPDATE comments SET replies_count = replies_count + 1 WHERE id = NEW.parent_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.parent_id IS NULL THEN
      UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    ELSE
      UPDATE comments SET replies_count = replies_count - 1 WHERE id = OLD.parent_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_post_comments_count ON comments;
CREATE TRIGGER tr_update_post_comments_count AFTER INSERT OR DELETE ON comments FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- Profile Creation on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 9. MESSAGES & CONVERSATIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
  name TEXT, -- For group chats
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'audio', 'document')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- Messages RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM conversation_participants WHERE conversation_id = id AND user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
CREATE POLICY "Users can view conversation participants" ON conversation_participants
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can view messages" ON messages;
CREATE POLICY "Users can view messages" ON messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
  );

-- Trigger to update conversation updated_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp() RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET updated_at = NOW() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_conversation_timestamp ON messages;
CREATE TRIGGER tr_update_conversation_timestamp
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();

-- Function to find existing direct conversation between two users
CREATE OR REPLACE FUNCTION get_direct_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID AS $$
DECLARE
  conv_id UUID;
BEGIN
  SELECT c.id INTO conv_id
  FROM conversations c
  JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
  JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
  WHERE c.type = 'direct'
    AND cp1.user_id = user1_id
    AND cp2.user_id = user2_id
  LIMIT 1;
  
  RETURN conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for messages
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_participants;

-- ==========================================
-- 10. PERFORMANCE INDEXES
-- ==========================================
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_reactions_post ON reactions(post_id);
CREATE INDEX idx_comments_post ON comments(post_id);

-- ==========================================
-- RELOAD SCHEMA CACHE
-- ==========================================
NOTIFY pgrst, 'reload schema';
