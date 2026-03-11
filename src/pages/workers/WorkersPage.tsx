import { motion } from "motion/react";
import { Wrench, Star, MapPin, Phone, ShieldCheck } from "lucide-react";

export default function WorkersPage() {
  const workers = [
    { id: 1, name: "م. محمود كهربا", job: "كهربائي", rating: 4.9, reviews: 45, location: "الحي الرابع", verified: true },
    { id: 2, name: "أ. حسن سباك", job: "سباك", rating: 4.8, reviews: 32, location: "الحي الخامس", verified: true },
    { id: 3, name: "م. علي نجار", job: "نجار", rating: 4.7, reviews: 28, location: "الحي الأول", verified: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الفنيين والحرفيين</h1>
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
          <Wrench size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {workers.map((worker, i) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/worker${worker.id}/200/200`} 
                  alt={worker.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-gray-900">{worker.name}</h3>
                  {worker.verified && <ShieldCheck size={14} className="text-emerald-500" />}
                </div>
                <p className="text-xs text-purple-600 font-medium">{worker.job}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={14} fill="currentColor" />
                <span className="text-xs font-bold">{worker.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} />
                <span>{worker.location}</span>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold hover:bg-emerald-100 transition-colors">
                <Phone size={12} />
                <span>طلب خدمة</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
