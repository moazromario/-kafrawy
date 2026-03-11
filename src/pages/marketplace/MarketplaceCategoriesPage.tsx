import React from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Smartphone, 
  Shirt, 
  Home, 
  Sparkles, 
  ShoppingBag, 
  ChevronLeft, 
  MoreVertical,
  ArrowLeft,
  Laptop,
  Watch,
  Headphones,
  Coffee,
  Gift,
  Baby,
  Dumbbell
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MarketplaceCategoriesPage() {
  const navigate = useNavigate();

  const categories = [
    { id: "c1", name: "إلكترونيات", icon: Smartphone, color: "bg-indigo-100 text-indigo-600", items: 1250 },
    { id: "c2", name: "ملابس", icon: Shirt, color: "bg-rose-100 text-rose-600", items: 3400 },
    { id: "c3", name: "مستلزمات منزلية", icon: Home, color: "bg-emerald-100 text-emerald-600", items: 850 },
    { id: "c4", name: "مستحضرات تجميل", icon: Sparkles, color: "bg-amber-100 text-amber-600", items: 520 },
    { id: "c5", name: "سوبر ماركت", icon: ShoppingBag, color: "bg-blue-100 text-blue-600", items: 5600 },
    { id: "c6", name: "أجهزة لابتوب", icon: Laptop, color: "bg-purple-100 text-purple-600", items: 320 },
    { id: "c7", name: "ساعات ذكية", icon: Watch, color: "bg-cyan-100 text-cyan-600", items: 150 },
    { id: "c8", name: "سماعات", icon: Headphones, color: "bg-orange-100 text-orange-600", items: 480 },
    { id: "c9", name: "أدوات المطبخ", icon: Coffee, color: "bg-stone-100 text-stone-600", items: 920 },
    { id: "c10", name: "هدايا", icon: Gift, color: "bg-pink-100 text-pink-600", items: 1100 },
    { id: "c11", name: "مستلزمات أطفال", icon: Baby, color: "bg-sky-100 text-sky-600", items: 750 },
    { id: "c12", name: "رياضة ولياقة", icon: Dumbbell, color: "bg-lime-100 text-lime-600", items: 430 },
  ];

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
          <h1 className="text-xl font-black text-gray-900">التصنيفات</h1>
        </div>
        <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
          <MoreVertical size={24} />
        </button>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-2 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={cat.id}
              onClick={() => navigate(`/marketplace/products?category=${cat.name}`)}
              className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-4 group cursor-pointer active:scale-95 transition-all"
            >
              <div className={`w-20 h-20 ${cat.color} rounded-[32px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                <cat.icon size={40} />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat.items} منتج</p>
              </div>
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-hover:text-indigo-600 transition-all">
                <ArrowLeft size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
