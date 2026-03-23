import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

const isPlaceholder = (url?: string) => !url || url.includes('your-project') || url.includes('TODO');

if (!supabaseUrl || !supabaseAnonKey || isPlaceholder(supabaseUrl)) {
  console.warn('Supabase URL or Anon Key is missing or invalid. Please check your environment variables.');
}

let supabaseClient: any = null;

if (supabaseUrl && supabaseAnonKey && !isPlaceholder(supabaseUrl)) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error('Failed to initialize Supabase client:', e);
  }
}

// Create a dummy client if initialization failed to prevent app crash
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !isPlaceholder(supabaseUrl));

export const supabase = supabaseClient || {
  isConfigured: false,
  storage: {
    from: () => ({
      upload: async () => ({ error: new Error('Supabase not configured') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  },
  auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
    signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: new Error('Supabase not configured') }),
        order: () => ({
          range: async () => ({ data: [], error: new Error('Supabase not configured') })
        })
      }),
      order: () => ({
        range: async () => ({ data: [], error: new Error('Supabase not configured') })
      })
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: new Error('Supabase not configured') })
      })
    }),
    upsert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: new Error('Supabase not configured') })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: new Error('Supabase not configured') })
        })
      })
    })
  }),
  rpc: async () => ({ data: null, error: new Error('Supabase not configured') })
} as any;
