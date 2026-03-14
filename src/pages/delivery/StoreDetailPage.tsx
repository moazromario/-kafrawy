import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Star, 
  Clock, 
  Bike, 
  Search, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Info, 
  ChevronDown,
  X,
  CheckCircle2,
  Utensils,
  MapPin,
  MessageSquare
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDelivery, MenuItem } from "@/src/context/DeliveryContext";

export default function StoreDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, cart, totalPrice } = useDelivery();
  
  const [activeTab, setActiveTab] = useState("Menu");
  const [selectedCategory, setSelectedCategory] = useState("الأكثر طلباً");
  const [showItemModal, setShowItemModal] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("وسط");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const store = {
    id: id,
    name: "برجر كينج كفراوي",
    rating: 4.8,
    reviewsCount: 1200,
    time: "20-30 دقيقة",
    fee: 15,
    image: "https://picsum.photos/seed/burger/800/400",
    category: "وجبات سريعة",
    description: "أفضل أنواع البرجر المشوي على اللهب في مدينة العبور. جرب وجباتنا المميزة الآن!",
    location: "الحي الثالث، مدينة العبور، أمام كارفور",
    workingHours: "10:00 ص - 02:00 ص",
    menu: [
      { id: "m1", name: "وجبة تشيز برجر", description: "قطعة برجر مشوي مع جبنة شيدر، خس، طماطم، صوص خاص، بطاطس وبيبسي", price: 125, image: "https://picsum.photos/seed/burger1/400/300", category: "الأكثر طلباً" },
      { id: "m2", name: "وجبة دجاج رويال", description: "قطعة دجاج مقرمشة مع خس، مايونيز، بطاطس وبيبسي", price: 110, image: "https://picsum.photos/seed/chicken/400/300", category: "الأكثر طلباً" },
      { id: "m3", name: "وجبة ووبر", description: "قطعة برجر كبيرة مشوية على اللهب مع بصل، مخلل، خس، طماطم، بطاطس وبيبسي", price: 155, image: "https://picsum.photos/seed/whopper/400/300", category: "الأكثر طلباً" },
      { id: "m4", name: "بطاطس مقلية كبيرة", description: "بطاطس ذهبية مقرمشة مع ملح", price: 45, image: "https://picsum.photos/seed/fries/400/300", category: "سناكس" },
      { id: "m5", name: "حلقات بصل", description: "8 قطع حلقات بصل مقرمشة", price: 55, image: "https://picsum.photos/seed/onion/400/300", category: "سناكس" },
    ],
    reviews: [
      { id: 1, user: "أحمد محمد", rating: 5, comment: "الأكل وصل سخن وطعمه تحفة!", date: "منذ ساعتين" },
      { id: 2, user: "سارة علي", rating: 4, comment: "التوصيل اتأخر شوية بس الوجبة كانت ممتازة", date: "منذ يوم" },
    ]
  };

  const menuCategories = ["الأكثر طلباً", "وجبات", "سناكس", "مشروبات", "حلويات"];
  const tabs = [
    { id: "Menu", label: "المنيو", icon: Utensils },
    { id: "Reviews", label: "التقييمات", icon: Star },
    { id: "Info", label: "معلومات", icon: Info },
  ];

  const handleAddToCart = () => {
    if (showItemModal) {
      const itemWithExtras = {
        ...showItemModal,
        name: `${showItemModal.name} (${selectedSize}) ${selectedExtras.length > 0 ? `+ ${selectedExtras.join(", ")}` : ""}`,
        price: showItemModal.price + (selectedSize === "كبير" ? 20 : 0) + (selectedExtras.length * 15)
      };
      for (let i = 0; i < quantity; i++) {
        addToCart(itemWithExtras);
      }
      setShowItemModal(null);
      setQuantity(1);
      setSelectedExtras([]);
      setSelectedSize("وسط");
    }
  };

  const toggleExtra = (extra: string) => {
    setSelectedExtras(prev => 
      prev.includes(extra) ? prev.filter(e => e !== extra) : [...prev, extra]
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-32">
      {/* Hero Header */}
      <div className="relative h-72">
        <img src={store.image} className="w-full h-full object-cover" alt={store.name} referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all"
          >
            <ArrowRight size={24} />
          </button>
          <div className="flex gap-3">
            <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all">
              <Heart size={24} />
            </button>
            <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all">
              <Share2 size={24} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 right-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-[#1877F2] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20">{store.category}</span>
            <div className="flex items-center gap-1.5 text-xs font-black text-white">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span>{store.rating} ({store.reviewsCount} تقييم)</span>
            </div>
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">{store.name}</h1>
          <div className="flex items-center gap-6 text-sm font-bold text-white/80">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <Clock size={16} className="text-blue-400" />
              <span>{store.time}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <Bike size={16} className="text-blue-400" />
              <span>توصيل {store.fee} ج.م</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <div className="flex px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 flex flex-col items-center gap-1.5 relative transition-all ${
                activeTab === tab.id ? "text-[#1877F2]" : "text-gray-400"
              }`}
            >
              <tab.icon size={20} />
              <span className="text-xs font-black">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-4 right-4 h-1 bg-[#1877F2] rounded-t-full" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="p-4">
        {activeTab === "Menu" && (
          <div className="space-y-8">
            {/* Menu Categories Scroll */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
              {menuCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                    ? "bg-[#1877F2] text-white shadow-xl shadow-blue-100" 
                    : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-[#050505] mb-4">{selectedCategory}</h2>
              {store.menu.filter(item => item.category === selectedCategory).map((item) => (
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  key={item.id}
                  onClick={() => setShowItemModal(item)}
                  className="bg-white rounded-[40px] p-5 shadow-sm border border-gray-100 flex gap-5 cursor-pointer group hover:border-blue-200 transition-all"
                >
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-black text-[#050505] group-hover:text-[#1877F2] transition-colors">{item.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mt-1">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xl font-black text-[#1877F2]">{item.price} <span className="text-xs font-bold">ج.م</span></p>
                      <button className="w-10 h-10 bg-[#050505] text-white rounded-2xl flex items-center justify-center group-hover:bg-[#1877F2] transition-all shadow-lg shadow-gray-100 group-hover:shadow-blue-100">
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="w-28 h-28 rounded-[32px] overflow-hidden flex-shrink-0 shadow-md">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} referrerPolicy="no-referrer" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Reviews" && (
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 text-center space-y-4">
              <div className="text-5xl font-black text-[#050505]">{store.rating}</div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={24} className={i <= Math.floor(store.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                ))}
              </div>
              <p className="text-sm font-bold text-gray-400">بناءً على {store.reviewsCount} تقييم حقيقي</p>
            </div>

            <div className="space-y-4">
              {store.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2] font-black">
                        {review.user[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-[#050505]">{review.user}</h4>
                        <p className="text-[10px] font-bold text-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={12} className={i <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Info" && (
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-[#050505]">عن المطعم</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{store.description}</p>
              </div>

              <div className="space-y-6">
                <div 
                  onClick={() => navigate(`/delivery/map/${id}`)}
                  className="flex items-start gap-4 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2] flex-shrink-0 group-hover:bg-[#1877F2] group-hover:text-white transition-all">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">الموقع</p>
                    <p className="text-sm font-black text-[#050505] mt-1 group-hover:text-[#1877F2] transition-colors">{store.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ساعات العمل</p>
                    <p className="text-sm font-black text-[#050505] mt-1">{store.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cart Summary Bar */}
      {cart.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 left-4 right-4 bg-[#1877F2] rounded-[32px] p-5 shadow-2xl shadow-blue-200 z-40 flex items-center justify-between text-white cursor-pointer"
          onClick={() => navigate("/delivery/cart")}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-black text-lg backdrop-blur-md border border-white/20">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">سلة الطلبات</p>
              <p className="text-xl font-black">{totalPrice} ج.م</p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-black">
            <span>عرض السلة</span>
            <ShoppingBag size={24} />
          </div>
        </motion.div>
      )}

      {/* Item Detail Modal */}
      <AnimatePresence>
        {showItemModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-lg rounded-t-[48px] sm:rounded-[48px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="relative h-72">
                <img src={showItemModal.image} className="w-full h-full object-cover" alt={showItemModal.name} referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setShowItemModal(null)}
                  className="absolute top-6 right-6 w-12 h-12 bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-[#050505] mb-3">{showItemModal.name}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{showItemModal.description}</p>
                </div>

                {/* Size Selection */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">اختر الحجم</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {["صغير", "وسط", "كبير"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-4 rounded-2xl text-xs font-black transition-all border-2 ${
                          selectedSize === size 
                          ? "bg-blue-50 border-[#1877F2] text-[#1877F2]" 
                          : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                        }`}
                      >
                        {size}
                        {size === "كبير" && <span className="block text-[8px] mt-1">+20 ج.م</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extras Selection */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">إضافات اختيارية</h3>
                  <div className="space-y-3">
                    {["جبنة إضافية", "صوص حار", "بصل مقرمش"].map((extra) => (
                      <button
                        key={extra}
                        onClick={() => toggleExtra(extra)}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                          selectedExtras.includes(extra)
                          ? "bg-blue-50 border-[#1877F2]"
                          : "bg-white border-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            selectedExtras.includes(extra) ? "bg-[#1877F2] border-[#1877F2]" : "border-gray-200"
                          }`}>
                            {selectedExtras.includes(extra) && <CheckCircle2 size={14} className="text-white" />}
                          </div>
                          <span className={`text-sm font-bold ${selectedExtras.includes(extra) ? "text-blue-700" : "text-gray-700"}`}>{extra}</span>
                        </div>
                        <span className="text-xs font-black text-[#1877F2]">+15 ج.م</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">تعليمات خاصة</h3>
                  <div className="relative">
                    <MessageSquare className="absolute right-4 top-4 text-gray-400" size={20} />
                    <textarea 
                      placeholder="مثلاً: بدون بصل، صوص زيادة..."
                      className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#1877F2] outline-none transition-all placeholder:text-gray-300 min-h-[100px] resize-none"
                    />
                  </div>
                </div>

                {/* Quantity and Add Button */}
                <div className="pt-6 border-t border-gray-50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-700 active:scale-90 transition-transform"
                      >
                        <Minus size={24} />
                      </button>
                      <span className="text-2xl font-black text-[#050505] w-8 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-14 h-14 bg-[#1877F2] text-white rounded-2xl flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-blue-100"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">الإجمالي</p>
                      <p className="text-3xl font-black text-[#1877F2]">
                        {(showItemModal.price + (selectedSize === "كبير" ? 20 : 0) + (selectedExtras.length * 15)) * quantity} ج.م
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    className="w-full py-6 bg-[#1877F2] text-white rounded-[28px] font-black text-xl shadow-2xl shadow-blue-100 flex items-center justify-center gap-4 active:scale-95 transition-all"
                  >
                    <ShoppingBag size={24} />
                    <span>إضافة للسلة</span>
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
