import { motion } from "motion/react";
import { Stethoscope, Star, MapPin, Phone } from "lucide-react";

export default function DoctorsPage() {
  const doctors = [
    { id: 1, name: "د. أحمد علي", specialty: "طب أطفال", rating: 4.8, reviews: 120, location: "الحي الأول" },
    { id: 2, name: "د. سارة محمود", specialty: "أسنان", rating: 4.9, reviews: 85, location: "الحي الثالث" },
    { id: 3, name: "د. محمد حسن", specialty: "باطنة", rating: 4.7, reviews: 210, location: "الحي الثاني" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">دليل الأطباء</h1>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <Stethoscope size={20} />
        </div>
      </div>

      <div className="space-y-4">
        {doctors.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4"
          >
            <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
              <img 
                src={`https://picsum.photos/seed/doctor${doc.id}/200/200`} 
                alt={doc.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900">{doc.name}</h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold">{doc.rating}</span>
                </div>
              </div>
              <p className="text-sm text-blue-600 font-medium mb-2">{doc.specialty}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span>{doc.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone size={12} />
                  <span>اتصال</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
