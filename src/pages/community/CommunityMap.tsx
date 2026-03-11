import { motion } from "motion/react";
import { MapPin, Search, Filter, Navigation, Info } from "lucide-react";
import { useState } from "react";

export default function CommunityMap() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'الكل' },
    { id: 'services', label: 'خدمات' },
    { id: 'posts', label: 'منشورات' },
    { id: 'events', label: 'فعاليات' },
    { id: 'ads', label: 'إعلانات' },
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col -mx-4 -mt-6">
      {/* Map Header */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-b border-gray-200 z-20">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === f.id 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Simulation */}
      <div className="flex-1 relative bg-gray-200 overflow-hidden">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        {/* Map Pins */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="absolute"
            style={{ 
              top: `${20 + i * 12}%`, 
              left: `${15 + i * 15}%` 
            }}
          >
            <div className="group relative">
              <div className="w-10 h-10 bg-emerald-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                <MapPin size={20} />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-white rounded-xl shadow-xl p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100">
                <p className="text-[10px] font-bold text-gray-900">خدمة مميزة {i}</p>
                <p className="text-[8px] text-gray-500">الحي الثاني • 500م</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Map Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <button className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-emerald-600 hover:bg-gray-50">
            <Navigation size={24} />
          </button>
          <button className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:bg-gray-50">
            <Info size={24} />
          </button>
        </div>

        {/* Search Bar Overlay */}
        <div className="absolute top-6 left-6 right-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ابحث في الخريطة..."
              className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-md border border-white rounded-2xl shadow-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
