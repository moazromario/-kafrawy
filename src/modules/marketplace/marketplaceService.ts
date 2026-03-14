import { supabase } from '@/src/lib/supabase';

export const marketplaceService = {
  async getProducts(categoryId?: string, searchQuery?: string, limit = 20) {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories:category_id (name),
        profiles:seller_id (full_name)
      `);
    
    if (categoryId && categoryId !== 'الكل') {
      query = query.eq('category_id', categoryId);
    }
    
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);
    return { data, error };
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (name),
        profiles:seller_id (full_name, avatar_url)
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getCategories() {
    const { data, error } = await supabase.from('categories').select('*');
    return { data, error };
  },

  async addToCart(productId: string, quantity = 1) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: user.id,
        product_id: productId,
        quantity,
      }, { onConflict: 'user_id,product_id' })
      .select()
      .single();
    return { data, error };
  },

  async getCart() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('user_id', user.id);
    return { data, error };
  },

  async createProduct(product: { title: string, price: number, category_id: string, location: string, image_url?: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...product,
        seller_id: user.id,
      })
      .select()
      .single();
    return { data, error };
  },

  async checkout(shippingAddress: string, paymentMethod: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // 1. Get cart items
    const { data: cartItems } = await this.getCart();
    if (!cartItems || cartItems.length === 0) throw new Error('Cart is empty');

    const totalAmount = cartItems.reduce((sum, item: any) => sum + (item.products.price * item.quantity), 0);

    // 2. Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.products.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // 4. Clear cart
    await supabase.from('cart_items').delete().eq('user_id', user.id);

    return { order, error: null };
  },
};
