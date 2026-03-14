import { supabase } from '@/src/lib/supabase';

export const educationService = {
  async getCourses(category?: string) {
    let query = supabase
      .from('courses')
      .select(`
        *,
        profiles:instructor_id (full_name, avatar_url)
      `);
    
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  async getCourseDetails(courseId: string) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        profiles:instructor_id (full_name, avatar_url),
        lessons (*)
      `)
      .eq('id', courseId)
      .single();
    
    if (data && data.lessons) {
      data.lessons.sort((a: any, b: any) => a.order_index - b.order_index);
    }

    return { data, error };
  },

  async enrollInCourse(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
      })
      .select()
      .single();
    
    if (!error) {
      // Increment student count
      await supabase.rpc('increment_student_count', { course_id: courseId });
    }

    return { data, error };
  },

  async getMyEnrollments() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false });
    return { data, error };
  },

  async updateProgress(courseId: string, progress: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('enrollments')
      .update({ progress })
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .select()
      .single();
    return { data, error };
  },
};
