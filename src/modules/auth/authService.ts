import { supabase } from '@/src/lib/supabase';

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });
    return { data, error };
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { data, error };
  },

  async signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { data, error };
  },

  async resendConfirmationEmail(email: string) {
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
      
      // Also update Supabase to keep it in sync
      await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
        
      return { data: true, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },
};
