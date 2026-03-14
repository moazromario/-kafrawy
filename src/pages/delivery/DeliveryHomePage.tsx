import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  Star, 
  Clock, 
  Bike, 
  ShoppingBag, 
  Pizza, 
  Coffee, 
  Utensils, 
  Apple, 
  IceCream,
  ArrowLeft,
  Flame,
  Percent,
  Bell,
  User,
  Navigation,
  Calendar,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDelivery } from "@/src/context/DeliveryContext";

export default function DeliveryHomePage() {
  const navigate = useNavigate();
  const { currentAddress } = useDelivery();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: 1, name: "وجبات سريعة", icon: Pizza, color: "bg-orange-100 text-orange-600" },
    { id: 2, name: "حلويات", icon: IceCream, color: "bg-pink-100 text-pink-600" },
    { id: 3, name: "مشروبات", icon: Coffee, color: "bg-blue-100 text-blue-600" },
    { id: 4, name: "سوبر ماركت", icon: Apple, color: "bg-emerald-100 text-emerald-600" },
    { id: 5, name: "مشويات", icon: Utensils, color: "bg-red-100 text-red-600" },
  ];

  const featuredOffers = [
    { id: 1, title: "خصم 50% على أول طلب", subtitle: "استخدم كود: KAFRAWI50", image: "https://picsum.photos/seed/food1/800/400", color: "bg-emerald-600" },
    { id: 2, title: "توصيل مجاني للحي الثالث", subtitle: "لفترة محدودة فقط", image: "https://picsum.photos/seed/food2/800/400", color: "bg-orange-500" },
  ];

  const popularStores = [
    { id: "s1", name: "برجر كينج كفراوي", rating: 4.8, time: "20-30 دقيقة", fee: 15, image: "https://picsum.photos/seed/burger/400/300", category: "وجبات سريعة" },
    { id: "s2", name: "بيتزا هت العبور", rating: 4.5, time: "30-45 دقيقة", fee: 10, image: "https://picsum.photos/seed/pizza/400/300", category: "بيتزا" },
    { id: "s3", name: "كريب أند وافل", rating: 4.2, time: "15-25 دقيقة", fee: 5, image: "https://picsum.photos/seed/crepe/400/300", category: "حلويات" },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Navbar */}
      <header className="bg-white px-4 pt-6 pb-4 sticky top-0 z-30 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <ShoppingBag size={24} />
            </div>
            <h1 className="text-xl font-black text-[#050505] tracking-tight">كفراوي <span className="text-[#1877F2]">جو</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/delivery/notifications")}
              className="relative w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button 
              onClick={() => navigate("/profile")}
              className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-[#1877F2] transition-all overflow-hidden border border-gray-100"
            >
              <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          </div>
        </div>

        {/* Location Picker */}
        <div 
          onClick={() => navigate("/delivery/address")}
          className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-[24px] cursor-pointer hover:bg-blue-50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#1877F2] shadow-sm">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#1877F2]/60 uppercase tracking-wider">التوصيل إلى</p>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-[#050505] truncate max-w-[180px]">{currentAddress}</span>
                <ChevronDown size={14} className="text-[#1877F2]" />
              </div>
            </div>
          </div>
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-[#1877F2] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Navigation size={16} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" size={20} />
          <input
            type="text"
            placeholder="ابحث عن مطعم، متجر، أو وجبة..."
            className="w-full pr-12 pl-4 py-4 bg-gray-100 border-none rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400"
            onClick={() => navigate("/delivery/search")}
          />
        </div>
      </header>

      <main className="p-4 space-y-8">
        {/* Upcoming Reminders Quick View */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate("/delivery/reminders")}
          className="bg-white rounded-[32px] p-5 shadow-sm border border-blue-100 flex items-center justify-between cursor-pointer hover:bg-blue-50/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-[20px] flex items-center justify-center text-[#1877F2] shadow-inner group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#050505]">طلبات مجدولة قريباً</h3>
              <p className="text-[10px] font-bold text-gray-400 mt-0.5">لديك طلب من <span className="text-[#1877F2]">برجر كينج</span> اليوم الساعة 08:30 م</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#1877F2] transition-all">
            <ChevronLeft size={16} />
          </div>
        </motion.section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#050505]">الأقسام</h2>
            <button className="text-xs font-bold text-[#1877F2]">عرض الكل</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={cat.id}
                onClick={() => navigate(`/delivery/stores?category=${cat.name}`)}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className={`w-16 h-16 ${cat.color} rounded-[24px] flex items-center justify-center shadow-sm`}>
                  <cat.icon size={28} />
                </div>
                <span className="text-xs font-bold text-gray-700">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Featured Offers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#050505]">عروض مميزة</h2>
            <button 
              onClick={() => navigate("/delivery/promotions")}
              className="text-xs font-bold text-[#1877F2]"
            >
              عرض الكل
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x">
            {featuredOffers.map((offer) => (
              <div 
                key={offer.id}
                onClick={() => navigate("/delivery/promotions")}
                className={`flex-shrink-0 w-[85%] aspect-[2/1] ${offer.color} rounded-[40px] relative overflow-hidden snap-center shadow-lg cursor-pointer active:scale-95 transition-all`}
              >
                <img src={offer.image} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" alt={offer.title} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent size={16} className="bg-white/20 p-0.5 rounded" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">عرض خاص</span>
                  </div>
                  <h3 className="text-xl font-black mb-1 leading-tight">{offer.title}</h3>
                  <p className="text-white/80 text-xs font-bold">{offer.subtitle}</p>
                  <button className="mt-4 self-start px-4 py-2 bg-white text-gray-900 rounded-2xl text-[10px] font-black uppercase shadow-sm">
                    اطلب الآن
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Stores */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="text-orange-500 fill-orange-500" size={20} />
              <h2 className="text-lg font-extrabold text-[#050505]">الأكثر طلباً</h2>
            </div>
            <button 
              onClick={() => navigate("/delivery/stores")}
              className="text-xs font-bold text-[#1877F2]"
            >
              عرض الكل
            </button>
          </div>
          <div className="space-y-4">
            {popularStores.map((store) => (
              <motion.div
                whileHover={{ y: -4 }}
                key={store.id}
                onClick={() => navigate(`/delivery/store/${store.id}`)}
                className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
              >
                <div className="relative h-40">
                  <img src={store.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={store.name} referrerPolicy="no-referrer" />
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl flex items-center gap-1 shadow-sm">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-[#050505]">{store.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-[#1877F2] text-white rounded-2xl text-[10px] font-bold shadow-sm">
                    توصيل {store.fee} ج.م
                  </div>
                </div>
                <div className="p-5 flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-[#050505] group-hover:text-[#1877F2] transition-colors">{store.name}</h3>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">{store.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1.5 rounded-xl">
                    <Clock size={12} />
                    <span>{store.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav Placeholder (if needed, but usually App has it) */}
    </div>
  );
}
