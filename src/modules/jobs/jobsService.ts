import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';

export const jobsService = {
  async getJobs(limit = 20, offset = 0) {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await supabase
      .from('job_posts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  async getJobById(id: string) {
    if (!isSupabaseConfigured) return { data: null, error: null };
    const { data, error } = await supabase
      .from('job_posts')
      .select(`
        *,
        profiles:employer_id (full_name, avatar_url)
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  async applyForJob(jobId: string, resumeUrl: string, coverLetter: string) {
    if (!isSupabaseConfigured) return { data: null, error: null };
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    // 1. Check if already applied (Backend Logic 4)
    const { data: existingApp } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId)
      .eq('applicant_id', user.id);

    if (existingApp && existingApp.length > 0) {
      throw new Error('Already applied');
    }

    // 2. Apply (Backend Logic 4)
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        applicant_id: user.id,
        resume_url: resumeUrl,
        cover_letter: coverLetter,
      })
      .select()
      .single();

    // 3. Create Notification (Logic 6)
    if (!error) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: "تم استلام طلبك للوظيفة",
        content: `لقد تم إرسال طلبك بنجاح للوظيفة.`
      });
    }

    return { data, error };
  },

  async saveJob(jobId: string) {
    if (!isSupabaseConfigured) return { data: null, error: null };
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('saved_jobs')
      .upsert({
        job_id: jobId,
        user_id: user.id
      })
      .select()
      .single();
    return { data, error };
  },

  async getSavedJobs() {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: null };

    const { data, error } = await supabase
      .from('saved_jobs')
      .select(`
        *,
        job_posts (*)
      `)
      .eq('user_id', user.id);
    return { data, error };
  },

  async searchJobs(keyword: string, location?: string) {
    if (!isSupabaseConfigured) return { data: [], error: null };
    let query = supabase
      .from('job_posts')
      .select('*')
      .ilike('title', `%${keyword}%`);

    if (location) {
      query = query.eq('location', location);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  async payAndApply(jobId: string, resumeUrl: string, coverLetter: string) {
    if (!isSupabaseConfigured) return { data: null, error: null };
    const { data, error } = await supabase.rpc('apply_with_payment', {
      p_job_id: jobId,
      p_resume_url: resumeUrl,
      p_cover_letter: coverLetter,
      p_amount: 10.00
    });

    if (error) throw error;
    return { data, error: null };
  },

  async getMyApplications() {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: null };

    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        job_posts (*)
      `)
      .eq('applicant_id', user.id)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Employer functions
  async createJobPost(jobData: any) {
    if (!isSupabaseConfigured) return { data: null, error: null };
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('job_posts')
      .insert({
        ...jobData,
        employer_id: user.id,
      })
      .select()
      .single();
    return { data, error };
  },

  async getEmployerJobs() {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: null };

    const { data, error } = await supabase
      .from('job_posts')
      .select('*')
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getJobApplications(jobId: string) {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        profiles:applicant_id (full_name, avatar_url, email)
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateApplicationStatus(applicationId: string, status: string) {
    if (!isSupabaseConfigured) return { data: null, error: null };
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();
    return { data, error };
  },
};
