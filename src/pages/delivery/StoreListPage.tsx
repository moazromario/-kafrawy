import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Bike, 
  ChevronDown,
  MapPin
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function StoreListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "الكل";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["الكل", "وجبات", "مشروبات", "سوبر ماركت", "حلويات", "مشويات", "بيتزا", "برجر"];

  const stores = [
    { id: "s1", name: "برجر كينج كفراوي", rating: 4.8, reviews: 1200, time: "20-30 دقيقة", fee: 15, image: "https://picsum.photos/seed/burger/400/300", category: "وجبات" },
    { id: "s2", name: "بيتزا هت العبور", rating: 4.5, reviews: 850, time: "30-45 دقيقة", fee: 10, image: "https://picsum.photos/seed/pizza/400/300", category: "بيتزا" },
    { id: "s3", name: "كريب أند وافل", rating: 4.2, reviews: 450, time: "15-25 دقيقة", fee: 5, image: "https://picsum.photos/seed/crepe/400/300", category: "حلويات" },
    { id: "s4", name: "كشري التحرير", rating: 4.9, reviews: 3200, time: "10-20 دقيقة", fee: 8, image: "https://picsum.photos/seed/koshary/400/300", category: "وجبات" },
    { id: "s5", name: "سوبر ماركت أولاد رجب", rating: 4.4, reviews: 2100, time: "45-60 دقيقة", fee: 20, image: "https://picsum.photos/seed/market/400/300", category: "سوبر ماركت" },
    { id: "s6", name: "ستاربكس كفراوي", rating: 4.7, reviews: 1500, time: "15-20 دقيقة", fee: 12, image: "https://picsum.photos/seed/coffee/400/300", category: "مشروبات" },
  ];

  const filteredStores = stores.filter(store => {
    const matchesCategory = selectedCategory === "الكل" || store.category === selectedCategory;
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 pt-6 pb-4 sticky top-0 z-30 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/delivery")}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700"
          >
            <ArrowRight size={20} />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900">المطاعم والمتاجر</h1>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مطعم أو متجر..."
              className="w-full pr-10 pl-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <button className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700">
            <Filter size={20} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase">{filteredStores.length} متجر متاح</p>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 cursor-pointer">
            <span>الأكثر تقييماً</span>
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="space-y-6">
          {filteredStores.map((store) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              key={store.id}
              onClick={() => navigate(`/delivery/store/${store.id}`)}
              className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 border border-gray-100 cursor-pointer group transition-all duration-500"
            >
              {/* Image Section */}
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={store.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={store.name} 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Floating Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl flex items-center gap-1.5 shadow-lg">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-black text-gray-900">{store.rating}</span>
                  </div>
                  <div className="px-3 py-1.5 bg-emerald-600/90 backdrop-blur-md rounded-2xl flex items-center gap-1.5 shadow-lg text-white">
                    <Clock size={14} />
                    <span className="text-[10px] font-black">{store.time}</span>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-[10px] font-black text-white uppercase tracking-wider">
                    {store.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                      {store.name}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 mt-1">أفضل المأكولات في مدينة العبور</p>
                  </div>
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?u=${store.id}${i}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-emerald-50 flex items-center justify-center text-[8px] font-black text-emerald-600 shadow-sm">
                      +12
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                        <Bike size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">التوصيل</p>
                        <p className="text-sm font-black text-gray-900">{store.fee} ج.م</p>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">المسافة</p>
                        <p className="text-sm font-black text-gray-900">1.2 كم</p>
                      </div>
                    </div>
                  </div>

                  <button className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-xs font-black flex items-center gap-2 group-hover:bg-emerald-600 transition-all duration-300 shadow-lg shadow-gray-200 group-hover:shadow-emerald-200">
                    <span>دخول</span>
                    <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
