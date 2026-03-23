import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured') };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured') };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email: string) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured') };
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  async updatePassword(password: string) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured') };
    }
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });
    return { data, error };
  },

  async signInWithGoogle() {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured') };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { data, error };
  },

  async signInWithGithub() {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured') };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { data, error };
  },

  async resendConfirmationEmail(email: string) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured') };
    }
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    return { data, error };
  },

  async getCurrentUser() {
    if (!isSupabaseConfigured) {
      return null;
    }
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getProfile(userId: string) {
    try {
      const response = await fetch(`/api/profile/${userId}`);
      if (!response.ok) throw new Error('Profile not found');
      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      if (!isSupabaseConfigured) {
        return { data: null, error };
      }
      // Fallback to supabase if local fails (e.g. during migration)
      const { data, error: sbError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error: sbError };
    }
  },

  async updateProfile(userId: string, updates: any) {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates })
      });
      if (!response.ok) throw new Error('Failed to update profile');
      
      if (isSupabaseConfigured) {
        // Also update Supabase to keep it in sync
        await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId);
      }
        
      return { data: true, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },
};
