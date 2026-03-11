import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Search, 
  Star, 
  ShoppingBag, 
  ChevronLeft, 
  MoreVertical,
  ArrowLeft,
  Store,
  Package,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MarketplaceStoresPage() {
  const navigate = useNavigate();

  const stores = [
    {
      id: "ms1",
      name: "سوق الإلكترونيات",
      category: "إلكترونيات",
      rating: 4.8,
      productsCount: 1250,
      image: "https://picsum.photos/seed/tech/100/100",
      coverImage: "https://picsum.photos/seed/tech-cover/800/400",
      description: "أحدث الأجهزة الإلكترونية والهواتف الذكية بأسعار تنافسية."
    },
    {
      id: "ms2",
      name: "عالم الموضة",
      category: "ملابس",
      rating: 4.5,
      productsCount: 3400,
      image: "https://picsum.photos/seed/fashion/100/100",
      coverImage: "https://picsum.photos/seed/fashion-cover/800/400",
      description: "تشكيلة واسعة من الملابس العصرية لجميع أفراد العائلة."
    },
    {
      id: "ms3",
      name: "بيت الهدايا",
      category: "هدايا",
      rating: 4.2,
      productsCount: 850,
      image: "https://picsum.photos/seed/gift/100/100",
      coverImage: "https://picsum.photos/seed/gift-cover/800/400",
      description: "هدايا مميزة لكل المناسبات السعيدة."
    },
    {
      id: "ms4",
      name: "مستحضرات كفراوي",
      category: "تجميل",
      rating: 4.9,
      productsCount: 520,
      image: "https://picsum.photos/seed/beauty/100/100",
      coverImage: "https://picsum.photos/seed/beauty-cover/800/400",
      description: "أفضل منتجات العناية بالبشرة والجمال الأصلية."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-30 shadow-sm rounded-b-[40px] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
            >
              <ArrowRight size={24} />
            </button>
            <h1 className="text-xl font-black text-gray-900">المتاجر</h1>
          </div>
          <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
            <MoreVertical size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="ابحث عن متجر أو ماركة..."
            className="w-full pr-14 pl-6 py-4 bg-gray-50 border-none rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 shadow-inner"
          />
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Featured Store Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-indigo-600" size={20} />
            <h2 className="text-xl font-black text-gray-900">متاجر مميزة</h2>
          </div>
          <div className="space-y-6">
            {stores.map((store, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={store.id}
                onClick={() => navigate(`/marketplace/store/${store.id}`)}
                className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-50 cursor-pointer group relative"
              >
                {/* Cover Image */}
                <div className="relative h-48">
                  <img src={store.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={store.name} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-sm">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-black text-gray-900">{store.rating}</span>
                  </div>
                  <div className="absolute bottom-4 right-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                      <img src={store.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-white">
                      <h3 className="text-xl font-black leading-tight">{store.name}</h3>
                      <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{store.category}</p>
                    </div>
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-gray-400 font-bold leading-relaxed line-clamp-2">{store.description}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-indigo-600 mb-0.5">
                          <Package size={14} />
                          <span className="text-sm font-black">{store.productsCount}</span>
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">منتج</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
                          <ShieldCheck size={14} />
                          <span className="text-sm font-black">موثوق</span>
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">متجر معتمد</span>
                      </div>
                    </div>
                    <button className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-all shadow-lg">
                      <ArrowLeft size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
