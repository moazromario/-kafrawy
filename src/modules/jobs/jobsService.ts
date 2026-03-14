import { supabase } from '@/src/lib/supabase';

export const jobsService = {
  async getJobs(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('job_posts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  async getJobById(id: string) {
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

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
    return { data, error };
  },

  async getMyApplications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

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
  async getEmployerJobs() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('job_posts')
      .select('*')
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getJobApplications(jobId: string) {
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
};
