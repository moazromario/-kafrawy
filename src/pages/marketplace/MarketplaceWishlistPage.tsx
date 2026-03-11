import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Heart, 
  ShoppingBag, 
  Star, 
  Plus, 
  X, 
  ChevronLeft,
  ArrowLeft,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMarketplace, Product } from "@/src/context/MarketplaceContext";

export default function MarketplaceWishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart } = useMarketplace();

  // Mock products for wishlist (in a real app, we'd filter all products by wishlist IDs)
  const wishlistProducts: Product[] = ([
    { id: "p1", name: "ساعة ذكية Ultra", description: "ساعة ذكية متطورة", price: 2500, rating: 4.8, reviewsCount: 120, image: "https://picsum.photos/seed/watch/400/400", category: "إلكترونيات", stockStatus: "متوفر", hasOffer: true, discountPrice: 1999 },
    { id: "p2", name: "سماعات لاسلكية Pro", description: "سماعات بلوتوث", price: 1200, rating: 4.5, reviewsCount: 85, image: "https://picsum.photos/seed/buds/400/400", category: "إلكترونيات", stockStatus: "متوفر" },
  ] as Product[]).filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-30 shadow-sm rounded-b-[40px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-900">المفضلة</h1>
        </div>
        <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all">
          <Trash2 size={24} />
        </button>
      </header>

      <main className="p-6">
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-5">
            {wishlistProducts.map((product, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={product.id}
                onClick={() => navigate(`/marketplace/product/${product.id}`)}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50 cursor-pointer group relative"
              >
                <div className="relative aspect-square">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} referrerPolicy="no-referrer" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 left-3 w-9 h-9 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg transition-all"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-black text-gray-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-indigo-600">{product.discountPrice || product.price} ج.م</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-9 h-9 bg-gray-900 text-white rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-all"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Heart size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900">المفضلة فارغة</h3>
              <p className="text-sm text-gray-400">ابدأ بإضافة المنتجات التي تعجبك لتجدها هنا لاحقاً</p>
            </div>
            <button 
              onClick={() => navigate("/marketplace")}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 active:scale-95 transition-all"
            >
              اكتشف المنتجات
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
