import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Users, 
  ChevronLeft,
  Filter,
  Star,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeliverySearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("الكل");
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);

  const recentSearches = ["برجر", "بيتزا", "سوبر ماركت", "حلويات", "كريب"];
  const trendingSearches = ["عروض رمضان", "توصيل مجاني", "أفضل المطاعم", "كشري التحرير"];

  const tabs = ["الكل", "مطاعم", "منتجات", "مستخدمين", "مجموعات"];

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const results = [
    { id: 1, type: "restaurant", name: "برجر كينج", rating: 4.8, distance: "1.2 كم", image: "https://picsum.photos/seed/burger/100/100" },
    { id: 2, type: "product", name: "وجبة ووبر كبيرة", price: 155, store: "برجر كينج", image: "https://picsum.photos/seed/whopper/100/100" },
    { id: 3, type: "user", name: "أحمد محمد", location: "الحي الثالث", image: "https://picsum.photos/seed/user1/100/100" },
    { id: 4, type: "group", name: "عشاق الأكل في العبور", members: "12.5K", image: "https://picsum.photos/seed/group1/100/100" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <header className="bg-white px-4 pt-6 pb-4 sticky top-0 z-30 border-b border-gray-50 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700"
          >
            <ArrowRight size={20} />
          </button>
          <div className="relative flex-1 group">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" size={18} />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أي شيء..."
              className="w-full pr-10 pl-10 py-3 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1877F2] outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              showFilters || selectedTypes.length > 0 || priceRange || deliveryTime || minRating
              ? "bg-[#1877F2] text-white shadow-lg shadow-blue-100" 
              : "bg-gray-100 text-gray-700"
            }`}
          >
            <Filter size={20} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                activeTab === tab 
                ? "bg-[#1877F2] text-white shadow-lg shadow-blue-100" 
                : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 space-y-8">
        {!searchQuery ? (
          <>
            {/* Recent Searches */}
            <section>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">عمليات البحث الأخيرة</h2>
                <button className="text-xs font-black text-red-500">مسح الكل</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, i) => (
                  <button 
                    key={i}
                    onClick={() => setSearchQuery(search)}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-50 rounded-2xl text-xs font-black text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
                  >
                    <Clock size={14} className="text-gray-400" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Trending Searches */}
            <section>
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">الأكثر بحثاً الآن</h2>
              <div className="space-y-3">
                {trendingSearches.map((search, i) => (
                  <div 
                    key={i}
                    onClick={() => setSearchQuery(search)}
                    className="flex items-center justify-between p-5 bg-gray-50 rounded-[28px] cursor-pointer hover:bg-blue-50 group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1877F2] shadow-sm">
                        <TrendingUp size={18} />
                      </div>
                      <span className="text-sm font-black text-gray-700 group-hover:text-[#1877F2] transition-colors">{search}</span>
                    </div>
                    <ChevronLeft size={18} className="text-gray-300 group-hover:text-[#1877F2] transition-colors" />
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* Search Results */
          <section className="space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">نتائج البحث عن "{searchQuery}"</h2>
            <div className="space-y-4">
              {results.map((result) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={result.id}
                  className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-blue-200 transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-gray-50">
                    <img src={result.image} className="w-full h-full object-cover" alt={result.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-[#050505] truncate">{result.name}</h3>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[8px] font-black rounded uppercase tracking-wider">
                        {result.type === "restaurant" ? "مطعم" : result.type === "product" ? "منتج" : result.type === "user" ? "مستخدم" : "مجموعة"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {result.type === "restaurant" && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span>{result.rating}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full mx-1" />
                          <MapPin size={12} />
                          <span>{result.distance}</span>
                        </div>
                      )}
                      {result.type === "product" && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <span className="text-[#1877F2] font-black">{result.price} ج.م</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full mx-1" />
                          <span>{result.store}</span>
                        </div>
                      )}
                      {result.type === "user" && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <MapPin size={12} />
                          <span>{result.location}</span>
                        </div>
                      )}
                      {result.type === "group" && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <Users size={12} />
                          <span>{result.members} عضو</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#1877F2]">
                    <ChevronLeft size={20} />
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-lg rounded-t-[48px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-[#050505]">فلترة البحث</h2>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Cuisine Type */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">نوع المطبخ</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {["وجبات سريعة", "بيتزا", "حلويات", "مشويات", "مأكولات بحرية", "صحي"].map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`p-4 rounded-2xl flex items-center gap-3 border-2 transition-all ${
                          selectedTypes.includes(type)
                          ? "bg-blue-50 border-[#1877F2] text-[#1877F2]"
                          : "bg-white border-gray-100 text-gray-500"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedTypes.includes(type) ? "bg-[#1877F2] border-[#1877F2]" : "border-gray-200"
                        }`}>
                          {selectedTypes.includes(type) && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <span className="text-xs font-black">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">فئة السعر</h3>
                  <div className="flex gap-3">
                    {["$", "$$", "$$$"].map((price) => (
                      <button
                        key={price}
                        onClick={() => setPriceRange(price)}
                        className={`flex-1 py-4 rounded-2xl font-black text-sm border-2 transition-all ${
                          priceRange === price
                          ? "bg-blue-50 border-[#1877F2] text-[#1877F2]"
                          : "bg-white border-gray-100 text-gray-500"
                        }`}
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">وقت التوصيل</h3>
                  <div className="space-y-3">
                    {["أقل من 30 دقيقة", "أقل من 45 دقيقة", "أي وقت"].map((time) => (
                      <button
                        key={time}
                        onClick={() => setDeliveryTime(time)}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                          deliveryTime === time
                          ? "bg-blue-50 border-[#1877F2] text-[#1877F2]"
                          : "bg-white border-gray-100 text-gray-500"
                        }`}
                      >
                        <span className="text-xs font-black">{time}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          deliveryTime === time ? "border-[#1877F2]" : "border-gray-200"
                        }`}>
                          {deliveryTime === time && <div className="w-2.5 h-2.5 bg-[#1877F2] rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">التقييم</h3>
                  <div className="flex gap-3">
                    {[4.5, 4.0, 3.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 border-2 transition-all ${
                          minRating === rating
                          ? "bg-blue-50 border-[#1877F2] text-[#1877F2]"
                          : "bg-white border-gray-100 text-gray-500"
                        }`}
                      >
                        <Star size={14} className={minRating === rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                        <span className="text-xs font-black">{rating}+</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => {
                      setSelectedTypes([]);
                      setPriceRange(null);
                      setDeliveryTime(null);
                      setMinRating(null);
                    }}
                    className="flex-1 py-5 bg-gray-100 text-gray-700 rounded-[28px] font-black text-sm"
                  >
                    إعادة تعيين
                  </button>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="flex-[2] py-5 bg-[#1877F2] text-white rounded-[28px] font-black text-sm shadow-xl shadow-blue-100"
                  >
                    تطبيق الفلاتر
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
