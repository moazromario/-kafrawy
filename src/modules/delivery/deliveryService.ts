import { supabase } from '@/src/lib/supabase';

export const deliveryService = {
  async createDeliveryOrder(pickupAddress: string, deliveryAddress: string, price: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('delivery_orders')
      .insert({
        customer_id: user.id,
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        total_price: price,
      })
      .select()
      .single();
    return { data, error };
  },

  async getMyDeliveryOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('delivery_orders')
      .select(`
        *,
        drivers:driver_id (profiles:user_id (full_name, avatar_url))
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getPendingOrders() {
    const { data, error } = await supabase
      .from('delivery_orders')
      .select(`
        *,
        customers:customer_id (profiles:user_id (full_name, avatar_url))
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async acceptOrder(orderId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('delivery_orders')
      .update({
        driver_id: user.id,
        status: 'assigned',
      })
      .eq('id', orderId)
      .eq('status', 'pending')
      .select()
      .single();
    return { data, error };
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('delivery_orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    return { data, error };
  },

  // Real-time tracking
  subscribeToOrder(orderId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'delivery_orders',
        filter: `id=eq.${orderId}`
      }, callback)
      .subscribe();
  },

  async updateDriverLocation(lat: number, lng: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('drivers')
      .update({
        current_location: `POINT(${lng} ${lat})`,
      })
      .eq('user_id', user.id);
    return { error };
  },
};
