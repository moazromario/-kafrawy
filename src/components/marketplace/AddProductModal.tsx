import React, { useState } from 'react';
import { marketplaceService } from '@/src/modules/marketplace/marketplaceService';
import { toast } from 'sonner';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export default function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await marketplaceService.createProduct({
        title,
        price: parseFloat(price),
        category_id: '1', // Placeholder category ID
        location,
      });
      if (error) throw error;
      toast.success('تم إضافة المنتج بنجاح');
      onProductAdded();
      onClose();
    } catch (err) {
      toast.error('حدث خطأ أثناء إضافة المنتج');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">بيع منتج جديد</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="اسم المنتج" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-xl" required />
          <input type="number" placeholder="السعر" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 border rounded-xl" required />
          <input type="text" placeholder="الموقع" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 border rounded-xl" required />
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 p-3 bg-gray-100 rounded-xl">إلغاء</button>
            <button type="submit" className="flex-1 p-3 bg-emerald-600 text-white rounded-xl" disabled={loading}>
              {loading ? 'جاري الإضافة...' : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
