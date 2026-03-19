import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Initialization
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";

let supabase: any = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
  }
} else {
  console.warn("Supabase URL or Anon Key is missing in server environment.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database Initialization
  const db = new Database("kafrawy.db");
  
  // 1. Create users table first if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT,
      email TEXT UNIQUE,
      role TEXT DEFAULT 'user',
      trust_level TEXT DEFAULT 'new_member',
      reputation_points INTEGER DEFAULT 0,
      help_count INTEGER DEFAULT 0,
      avatar_url TEXT,
      cover_url TEXT,
      bio TEXT,
      location TEXT,
      work TEXT,
      education TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Migration: Ensure users table has all required columns (for existing databases)
  const tableInfo = db.prepare("PRAGMA table_info(users)").all();
  const columns = (tableInfo as any[]).map(c => c.name);
  
  if (!columns.includes('full_name')) {
    try { db.exec("ALTER TABLE users ADD COLUMN full_name TEXT;"); } catch (e) {}
  }
  if (!columns.includes('avatar_url')) {
    try { db.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT;"); } catch (e) {}
  }
  if (!columns.includes('cover_url')) {
    try { db.exec("ALTER TABLE users ADD COLUMN cover_url TEXT;"); } catch (e) {}
  }
  if (!columns.includes('bio')) {
    try { db.exec("ALTER TABLE users ADD COLUMN bio TEXT;"); } catch (e) {}
  }
  if (!columns.includes('location')) {
    try { db.exec("ALTER TABLE users ADD COLUMN location TEXT;"); } catch (e) {}
  }
  if (!columns.includes('work')) {
    try { db.exec("ALTER TABLE users ADD COLUMN work TEXT;"); } catch (e) {}
  }
  if (!columns.includes('education')) {
    try { db.exec("ALTER TABLE users ADD COLUMN education TEXT;"); } catch (e) {}
  }
  if (!columns.includes('phone')) {
    try { db.exec("ALTER TABLE users ADD COLUMN phone TEXT;"); } catch (e) {}
  }

  // 3. Create other tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      content TEXT,
      media_url TEXT,
      category TEXT DEFAULT 'general',
      city TEXT,
      group_id TEXT,
      page_id TEXT,
      likes_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      shares_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT,
      user_id TEXT,
      content TEXT,
      parent_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME,
      FOREIGN KEY(post_id) REFERENCES posts(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS likes (
      id TEXT PRIMARY KEY,
      post_id TEXT,
      user_id TEXT,
      reaction_type TEXT DEFAULT 'like',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, user_id),
      FOREIGN KEY(post_id) REFERENCES posts(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS shares (
      id TEXT PRIMARY KEY,
      post_id TEXT,
      user_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(post_id) REFERENCES posts(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      media_url TEXT,
      media_type TEXT, -- image, video
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      actor_id TEXT,
      type TEXT, -- like, comment, follow, system
      content TEXT,
      related_id TEXT, -- post_id, comment_id, etc.
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(actor_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      type TEXT DEFAULT 'direct', -- direct, group
      name TEXT,
      last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS conversation_participants (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      user_id TEXT,
      last_read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(conversation_id) REFERENCES conversations(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      sender_id TEXT,
      content TEXT,
      media_url TEXT,
      media_type TEXT,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(conversation_id) REFERENCES conversations(id),
      FOREIGN KEY(sender_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS neighborhood_alerts (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      content TEXT,
      type TEXT DEFAULT 'info',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS friends (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      friend_id TEXT,
      status TEXT DEFAULT 'pending', -- pending, accepted, blocked
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, friend_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(friend_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      creator_id TEXT,
      name TEXT,
      description TEXT,
      category TEXT,
      privacy TEXT DEFAULT 'public',
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(creator_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS group_members (
      id TEXT PRIMARY KEY,
      group_id TEXT,
      user_id TEXT,
      role TEXT DEFAULT 'member',
      status TEXT DEFAULT 'approved',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(group_id) REFERENCES groups(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      creator_id TEXT,
      name TEXT,
      description TEXT,
      category TEXT,
      cover_url TEXT,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(creator_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS page_followers (
      id TEXT PRIMARY KEY,
      page_id TEXT,
      user_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(page_id) REFERENCES pages(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      creator_id TEXT,
      title TEXT,
      description TEXT,
      location TEXT,
      start_time DATETIME,
      end_time DATETIME,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(creator_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS event_attendees (
      id TEXT PRIMARY KEY,
      event_id TEXT,
      user_id TEXT,
      status TEXT DEFAULT 'going',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(event_id) REFERENCES events(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      price REAL,
      image_url TEXT,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: Ensure comments table has deleted_at column
  try { db.exec("ALTER TABLE comments ADD COLUMN deleted_at DATETIME;"); } catch (e) {}

  app.use(express.json());

  // Helper to ensure user exists in SQLite (sync from Auth)
  const ensureUser = async (userId: string, fullName?: string, email?: string, avatarUrl?: string) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    if (!user) {
      // Try to fetch from Supabase if we have keys
      let finalName = fullName || "مستخدم كفراوي";
      let finalEmail = email || "";
      let finalAvatar = avatarUrl || "";

      if (supabase) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (profile) {
            finalName = profile.full_name || finalName;
            finalEmail = profile.email || finalEmail;
            finalAvatar = profile.avatar_url || finalAvatar;
          }
        } catch (e) {
          console.error("Error syncing user from Supabase:", e);
        }
      }

      db.prepare("INSERT INTO users (id, full_name, email, avatar_url) VALUES (?, ?, ?, ?)")
        .run(userId, finalName, finalEmail, finalAvatar);
    }
    return userId;
  };

  // --- Profile APIs ---
  app.get("/api/profile/:userId", (req, res) => {
    const { userId } = req.params;
    const profile = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  });

  app.post("/api/profile/update", async (req, res) => {
    const { userId, updates } = req.body;
    await ensureUser(userId);
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(", ");
    const values = Object.values(updates);
    db.prepare(`UPDATE users SET ${fields} WHERE id = ?`).run(...values, userId);
    res.json({ success: true });
  });

  // API Routes
  // --- Feed & Posts APIs ---
  app.get("/api/feed", (req, res) => {
    try {
      const { userId, category } = req.query;
      let query = `
        SELECT p.*, u.full_name, u.avatar_url 
        FROM posts p 
        JOIN users u ON p.user_id = u.id 
        WHERE p.deleted_at IS NULL
      `;
      const params: any[] = [];

      if (category && category !== 'for_you' && category !== 'trending') {
        query += " AND p.category = ?";
        params.push(category);
      }

      query += " ORDER BY p.created_at DESC LIMIT 20";
      
      const posts = db.prepare(query).all(...params);
      res.json(posts.map((p: any) => ({
        ...p,
        profiles: { full_name: p.full_name, avatar_url: p.avatar_url }
      })));
    } catch (error) {
      console.error("Error fetching feed:", error);
      res.status(500).json({ error: "Failed to fetch feed" });
    }
  });

  app.post("/api/posts/create", async (req, res) => {
    const { user_id, content, media_url, category, city, group_id, page_id } = req.body;
    await ensureUser(user_id);
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare(`
      INSERT INTO posts (id, user_id, content, media_url, category, city, group_id, page_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, user_id, content, media_url, category || 'general', city, group_id, page_id);
    
    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
    res.json(post);
  });

  app.post("/api/like", async (req, res) => {
    const { post_id, user_id, reaction_type } = req.body;
    await ensureUser(user_id);
    const id = Math.random().toString(36).substring(2, 15);
    try {
      db.prepare("INSERT INTO likes (id, post_id, user_id, reaction_type) VALUES (?, ?, ?, ?)").run(id, post_id, user_id, reaction_type || 'like');
      db.prepare("UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?").run(post_id);
    } catch (e) {
      // Already liked, toggle off
      db.prepare("DELETE FROM likes WHERE post_id = ? AND user_id = ?").run(post_id, user_id);
      db.prepare("UPDATE posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?").run(post_id);
      return res.json({ liked: false });
    }
    res.json({ liked: true });
  });

  app.post("/api/comment", async (req, res) => {
    const { post_id, user_id, content, parent_id } = req.body;
    await ensureUser(user_id);
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO comments (id, post_id, user_id, content, parent_id) VALUES (?, ?, ?, ?, ?)").run(id, post_id, user_id, content, parent_id || null);
    db.prepare("UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?").run(post_id);
    const comment = db.prepare("SELECT * FROM comments WHERE id = ?").get(id);
    res.json(comment);
  });

  app.post("/api/share", async (req, res) => {
    const { post_id, user_id } = req.body;
    await ensureUser(user_id);
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO shares (id, post_id, user_id) VALUES (?, ?, ?)").run(id, post_id, user_id);
    db.prepare("UPDATE posts SET shares_count = shares_count + 1 WHERE id = ?").run(post_id);
    res.json({ success: true });
  });

  app.post("/api/track-event", async (req, res) => {
    // Just a dummy endpoint to prevent 404s for tracking events
    res.json({ success: true });
  });

  // --- Stories APIs ---
  app.get("/api/stories", (req, res) => {
    const stories = db.prepare(`
      SELECT s.*, u.full_name, u.avatar_url 
      FROM stories s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.expires_at > datetime('now')
      ORDER BY s.created_at DESC
    `).all();
    res.json(stories.map((s: any) => ({
      ...s,
      profiles: { full_name: s.full_name, avatar_url: s.avatar_url }
    })));
  });

  app.post("/api/stories/create", async (req, res) => {
    const { user_id, media_url, media_type } = req.body;
    await ensureUser(user_id);
    const id = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    db.prepare("INSERT INTO stories (id, user_id, media_url, media_type, expires_at) VALUES (?, ?, ?, ?, ?)")
      .run(id, user_id, media_url, media_type, expiresAt.toISOString());
    
    const story = db.prepare("SELECT * FROM stories WHERE id = ?").get(id);
    res.json(story);
  });

  // --- Notifications APIs ---
  app.get("/api/notifications/:userId", (req, res) => {
    const { userId } = req.params;
    const notifications = db.prepare(`
      SELECT n.*, u.full_name as actor_name, u.avatar_url as actor_avatar
      FROM notifications n
      JOIN users u ON n.actor_id = u.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `).all(userId);
    res.json(notifications);
  });

  app.post("/api/notifications/mark-read", (req, res) => {
    const { userId, notificationId } = req.body;
    if (notificationId) {
      db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?").run(notificationId, userId);
    } else {
      db.prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?").run(userId);
    }
    res.json({ success: true });
  });

  // --- Messaging APIs ---
  app.get("/api/conversations/:userId", (req, res) => {
    const { userId } = req.params;
    const conversations = db.prepare(`
      SELECT c.*, 
             (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
             (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      WHERE cp.user_id = ?
      ORDER BY last_message_at DESC
    `).all(userId);
    
    // Enrich with other participants
    const enriched = conversations.map((conv: any) => {
      const participants = db.prepare(`
        SELECT u.id, u.full_name, u.avatar_url 
        FROM users u
        JOIN conversation_participants cp ON u.id = cp.user_id
        WHERE cp.conversation_id = ? AND u.id != ?
      `).all(conv.id, userId);
      return { ...conv, participants };
    });
    
    res.json(enriched);
  });

  app.get("/api/messages/:conversationId", (req, res) => {
    const { conversationId } = req.params;
    const messages = db.prepare(`
      SELECT m.*, u.full_name, u.avatar_url
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `).all(conversationId);
    res.json(messages.map((m: any) => ({
      ...m,
      profiles: { full_name: m.full_name, avatar_url: m.avatar_url }
    })));
  });

  app.post("/api/messages/send", async (req, res) => {
    const { conversation_id, sender_id, content, media_url, media_type } = req.body;
    await ensureUser(sender_id);
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO messages (id, conversation_id, sender_id, content, media_url, media_type) VALUES (?, ?, ?, ?, ?, ?)")
      .run(id, conversation_id, sender_id, content, media_url, media_type);
    
    db.prepare("UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(conversation_id);
    
    const message = db.prepare("SELECT * FROM messages WHERE id = ?").get(id);
    res.json(message);
  });

  app.post("/api/conversations/create", async (req, res) => {
    const { user_ids, type, name } = req.body;
    for (const uid of user_ids) {
      await ensureUser(uid);
    }
    
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO conversations (id, type, name) VALUES (?, ?, ?)")
      .run(id, type || 'direct', name);
    
    const stmt = db.prepare("INSERT INTO conversation_participants (id, conversation_id, user_id) VALUES (?, ?, ?)");
    user_ids.forEach((uid: string) => {
      stmt.run(Math.random().toString(36).substring(2, 15), id, uid);
    });
    
    const conversation = db.prepare("SELECT * FROM conversations WHERE id = ?").get(id);
    res.json(conversation);
  });

  app.get("/api/users/search", (req, res) => {
    const { q } = req.query;
    const users = db.prepare("SELECT id, full_name, avatar_url FROM users WHERE full_name LIKE ? LIMIT 10")
      .all(`%${q}%`);
    res.json(users);
  });

  // --- Friends APIs ---
  app.get("/api/friends/:userId", (req, res) => {
    const { userId } = req.params;
    const friends = db.prepare(`
      SELECT u.* 
      FROM users u
      JOIN (
        SELECT friend_id as id FROM friends WHERE user_id = ? AND status = 'accepted'
        UNION
        SELECT user_id as id FROM friends WHERE friend_id = ? AND status = 'accepted'
      ) f ON u.id = f.id
    `).all(userId, userId);
    res.json(friends.map(f => ({ profiles: f })));
  });

  app.get("/api/friends/requests/:userId", (req, res) => {
    const { userId } = req.params;
    const requests = db.prepare(`
      SELECT f.id as request_id, u.* 
      FROM users u
      JOIN friends f ON u.id = f.user_id
      WHERE f.friend_id = ? AND f.status = 'pending'
    `).all(userId);
    res.json(requests.map(r => ({ id: r.request_id, profiles: r })));
  });

  app.post("/api/friends/request", async (req, res) => {
    const { user_id, friend_id } = req.body;
    await ensureUser(user_id);
    await ensureUser(friend_id);
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO friends (id, user_id, friend_id, status) VALUES (?, ?, ?, 'pending')")
      .run(id, user_id, friend_id);
    res.json({ success: true });
  });

  app.post("/api/friends/accept", (req, res) => {
    const { request_id } = req.body;
    db.prepare("UPDATE friends SET status = 'accepted' WHERE id = ?").run(request_id);
    res.json({ success: true });
  });

  app.post("/api/friends/reject", (req, res) => {
    const { request_id } = req.body;
    db.prepare("DELETE FROM friends WHERE id = ?").run(request_id);
    res.json({ success: true });
  });

  // --- Alerts APIs ---
  app.get("/api/alerts", (req, res) => {
    const alerts = db.prepare(`
      SELECT a.*, u.full_name, u.avatar_url 
      FROM neighborhood_alerts a 
      JOIN users u ON a.user_id = u.id 
      ORDER BY a.created_at DESC LIMIT 10
    `).all();
    res.json(alerts);
  });

  app.post("/api/alerts/create", async (req, res) => {
    const { user_id, content, type } = req.body;
    await ensureUser(user_id);
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO neighborhood_alerts (id, user_id, content, type) VALUES (?, ?, ?, ?)")
      .run(id, user_id, content, type || 'info');
    const alert = db.prepare("SELECT * FROM neighborhood_alerts WHERE id = ?").get(id);
    res.json(alert);
  });

  // --- Groups APIs ---
  app.get("/api/groups", (req, res) => {
    const groups = db.prepare(`
      SELECT g.*, u.full_name, u.avatar_url 
      FROM groups g 
      JOIN users u ON g.creator_id = u.id 
      ORDER BY g.created_at DESC
    `).all();
    res.json(groups.map((g: any) => ({
      ...g,
      profiles: { full_name: g.full_name, avatar_url: g.avatar_url }
    })));
  });

  app.get("/api/groups/:id", (req, res) => {
    const { id } = req.params;
    const group = db.prepare(`
      SELECT g.*, u.full_name, u.avatar_url 
      FROM groups g 
      JOIN users u ON g.creator_id = u.id 
      WHERE g.id = ?
    `).get(id) as any;
    if (group) {
      group.profiles = { full_name: group.full_name, avatar_url: group.avatar_url };
    }
    res.json(group);
  });

  app.post("/api/groups/create", async (req, res) => {
    const { creator_id, name, description, category, privacy, image_url } = req.body;
    await ensureUser(creator_id);
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO groups (id, creator_id, name, description, category, privacy, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(id, creator_id, name, description, category, privacy || 'public', image_url);
    const group = db.prepare("SELECT * FROM groups WHERE id = ?").get(id);
    res.json(group);
  });

  app.post("/api/groups/join", async (req, res) => {
    const { user_id, group_id, is_private } = req.body;
    await ensureUser(user_id);
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO group_members (id, group_id, user_id, status) VALUES (?, ?, ?, ?)")
      .run(id, group_id, user_id, is_private ? 'pending' : 'approved');
    res.json({ success: true });
  });

  // --- Pages APIs ---
  app.get("/api/pages", (req, res) => {
    const pages = db.prepare(`
      SELECT p.*, u.full_name, u.avatar_url 
      FROM pages p 
      JOIN users u ON p.creator_id = u.id 
      ORDER BY p.created_at DESC
    `).all();
    res.json(pages.map((p: any) => ({
      ...p,
      profiles: { full_name: p.full_name, avatar_url: p.avatar_url }
    })));
  });

  app.get("/api/pages/:id", (req, res) => {
    const { id } = req.params;
    const page = db.prepare(`
      SELECT p.*, u.full_name, u.avatar_url 
      FROM pages p 
      JOIN users u ON p.creator_id = u.id 
      WHERE p.id = ?
    `).get(id) as any;
    if (page) {
      page.profiles = { full_name: page.full_name, avatar_url: page.avatar_url };
    }
    res.json(page);
  });

  app.post("/api/pages/create", async (req, res) => {
    const { creator_id, name, description, category, cover_url, avatar_url } = req.body;
    await ensureUser(creator_id);
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO pages (id, creator_id, name, description, category, cover_url, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(id, creator_id, name, description, category, cover_url, avatar_url);
    const page = db.prepare("SELECT * FROM pages WHERE id = ?").get(id);
    res.json(page);
  });

  app.post("/api/pages/follow", async (req, res) => {
    const { user_id, page_id } = req.body;
    await ensureUser(user_id);
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO page_followers (id, page_id, user_id) VALUES (?, ?, ?)").run(id, page_id, user_id);
    res.json({ success: true });
  });

  app.post("/api/pages/unfollow", (req, res) => {
    const { user_id, page_id } = req.body;
    db.prepare("DELETE FROM page_followers WHERE page_id = ? AND user_id = ?").run(page_id, user_id);
    res.json({ success: true });
  });

  // --- Events APIs ---
  app.get("/api/events", (req, res) => {
    const events = db.prepare("SELECT * FROM events ORDER BY start_time ASC").all();
    res.json(events);
  });

  app.post("/api/events/join", async (req, res) => {
    const { user_id, event_id } = req.body;
    await ensureUser(user_id);
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO event_attendees (id, event_id, user_id) VALUES (?, ?, ?)").run(id, event_id, user_id);
    res.json({ success: true });
  });

  // --- Additional Posts & Comments APIs ---
  app.get("/api/posts/search", (req, res) => {
    const { q } = req.query;
    const posts = db.prepare(`
      SELECT p.*, u.full_name, u.avatar_url 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.deleted_at IS NULL AND p.content LIKE ?
      ORDER BY p.created_at DESC LIMIT 20
    `).all(`%${q}%`);
    res.json(posts.map((p: any) => ({
      ...p,
      profiles: { full_name: p.full_name, avatar_url: p.avatar_url }
    })));
  });

  app.get("/api/posts/:id", (req, res) => {
    const { id } = req.params;
    const post = db.prepare(`
      SELECT p.*, u.full_name, u.avatar_url 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.id = ? AND p.deleted_at IS NULL
    `).get(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({
      ...post,
      profiles: { full_name: post.full_name, avatar_url: post.avatar_url }
    });
  });

  app.delete("/api/posts/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE posts SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/comments/:postId", (req, res) => {
    const { postId } = req.params;
    const comments = db.prepare(`
      SELECT c.*, u.full_name, u.avatar_url 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.post_id = ? AND c.deleted_at IS NULL
      ORDER BY c.created_at ASC
    `).all(postId);
    res.json(comments.map((c: any) => ({
      ...c,
      profiles: { full_name: c.full_name, avatar_url: c.avatar_url }
    })));
  });

  app.delete("/api/comments/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE comments SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.delete("/api/notifications/:id", (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    db.prepare("DELETE FROM notifications WHERE id = ? AND user_id = ?").run(id, userId);
    res.json({ success: true });
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Kafrawy API is running" });
  });

  // Example API for products
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kafrawy Super App running at http://localhost:${PORT}`);
  });
}

startServer();
