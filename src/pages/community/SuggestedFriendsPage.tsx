import { motion } from "motion/react";
import { ChevronRight, UserPlus, X, Search, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";

export default function SuggestedFriendsPage() {
  const suggestions = [
    { id: 10, name: "هاني محمود", mutual: 15, location: "الحي الثاني", avatar: "H" },
    { id: 11, name: "منى زكي", mutual: 7, location: "الحي الثالث", avatar: "M" },
    { id: 12, name: "عصام الحضري", mutual: 22, location: "الحي الأول", avatar: "E" },
    { id: 13, name: "نادية الجندي", mutual: 4, location: "الحي الرابع", avatar: "N" },
    { id: 14, name: "عادل إمام", mutual: 31, location: "الحي الخامس", avatar: "A" },
    { id: 15, name: "يسرا", mutual: 12, location: "الحي الثاني", avatar: "Y" },
    { id: 16, name: "عمرو دياب", mutual: 45, location: "الحي الثالث", avatar: "A" },
    { id: 17, name: "تامر حسني", mutual: 18, location: "الحي الأول", avatar: "T" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <CommunityNavbar />
      <div className="max-w-[1600px] mx-auto px-4 flex gap-6">
        <CommunitySidebar />
        
        <main className="flex-1 py-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link to="/community/friends" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronRight size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">أشخاص قد تعرفهم</h1>
              </div>
              
              <div className="relative w-full md:w-72">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="بحث في الاقتراحات..."
                  className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suggestions.map((sug) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={sug.id} 
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/sug${sug.id}/400/400`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={sug.name}
                      referrerPolicy="no-referrer"
                    />
                    <button className="absolute top-2 left-2 p-1.5 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-base truncate hover:text-emerald-600 cursor-pointer transition-colors">
                        {sug.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users size={12} />
                        <span>{sug.mutual} صديق مشترك</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        <span>{sug.location}</span>
                      </div>
                    </div>

                    <div className="mt-auto space-y-2">
                      <button className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                        <UserPlus size={16} />
                        <span>إضافة صديق</span>
                      </button>
                      <button className="w-full py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">
                        إزالة
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-8 text-center border-t border-gray-50">
              <p className="text-gray-500 text-sm">يتم تحديث الاقتراحات بناءً على اهتماماتك وأصدقائك المشتركين في كفراوي.</p>
            </div>
          </div>
        </main>

        <ContactsSidebar />
      </div>
    </div>
  );
}
