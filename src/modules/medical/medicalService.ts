import { supabase } from "@/src/lib/supabase";

export interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialization: string;
  experience: number;
  fees: number;
  rating: number;
  city: string;
  image?: string;
  created_at?: string;
}

export interface DoctorSlot {
  id: string;
  doctor_id: string;
  day: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Booking {
  id: string;
  doctor_id: string;
  user_id: string;
  slot_id: string;
  status: string;
  type: string;
  price: number;
  created_at?: string;
}

export interface DoctorReview {
  id: string;
  doctor_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at?: string;
}

export const medicalService = {
  // Doctors
  async getDoctors() {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data as Doctor[];
  },

  async getDoctorById(id: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Doctor;
  },

  // Specializations
  async getSpecializations() {
    const { data, error } = await supabase
      .from('specializations')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  // Slots
  async getDoctorSlots(doctorId: string) {
    const { data, error } = await supabase
      .from('doctor_slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('is_available', true);
    
    if (error) throw error;
    return data as DoctorSlot[];
  },

  // Bookings
  async createBooking(booking: Omit<Booking, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();
    
    if (error) throw error;

    // Mark slot as unavailable
    await supabase
      .from('doctor_slots')
      .update({ is_available: false })
      .eq('id', booking.slot_id);

    return data as Booking;
  },

  async getUserBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        doctors (
          name,
          specialization,
          image
        ),
        doctor_slots (
          day,
          start_time,
          end_time
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Reviews
  async getDoctorReviews(doctorId: string) {
    const { data, error } = await supabase
      .from('doctor_reviews')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async addReview(review: Omit<DoctorReview, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('doctor_reviews')
      .insert([review])
      .select()
      .single();
    
    if (error) throw error;
    return data as DoctorReview;
  }
};
