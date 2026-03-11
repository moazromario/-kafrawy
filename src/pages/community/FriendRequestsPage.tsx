import { motion } from "motion/react";
import { ChevronRight, MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";

export default function FriendRequestsPage() {
  const requests = [
    { id: 1, name: "ريهام أحمد", mutual: 5, time: "منذ يومين", avatar: "R" },
    { id: 2, name: "كريم محمد", mutual: 2, time: "منذ ٤ أيام", avatar: "K" },
    { id: 3, name: "سارة محمود", mutual: 12, time: "منذ أسبوع", avatar: "S" },
    { id: 4, name: "أحمد علي", mutual: 8, time: "منذ أسبوعين", avatar: "A" },
    { id: 5, name: "ليلى حسن", mutual: 3, time: "منذ شهر", avatar: "L" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <CommunityNavbar />
      <div className="max-w-[1600px] mx-auto px-4 flex gap-6">
        <CommunitySidebar />
        
        <main className="flex-1 py-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/community/friends" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronRight size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">طلبات الصداقة</h1>
              </div>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                {requests.length} طلبات جديدة
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {requests.map((req) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={req.id} 
                  className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="relative">
                    <img 
                      src={`https://picsum.photos/seed/req${req.id}/200/200`} 
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md"
                      alt={req.name}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-right space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-lg font-bold text-gray-900 hover:text-emerald-600 cursor-pointer transition-colors">
                        {req.name}
                      </h3>
                      <span className="text-xs text-gray-400">• {req.time}</span>
                    </div>
                    <p className="text-sm text-gray-500">{req.mutual} صديق مشترك</p>
                    
                    {/* Mutual Friends Avatars */}
                    <div className="flex items-center justify-center sm:justify-start -space-x-2 mt-3">
                      {[1, 2, 3].map((i) => (
                        <img 
                          key={i}
                          src={`https://picsum.photos/seed/mutual${req.id}${i}/100/100`} 
                          className="w-7 h-7 rounded-full border-2 border-white object-cover"
                          alt="Mutual friend"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full sm:w-48">
                    <button className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                      <UserCheck size={18} />
                      <span>تأكيد</span>
                    </button>
                    <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                      <UserX size={18} />
                      <span>حذف</span>
                    </button>
                  </div>

                  <button className="hidden sm:block p-2 text-gray-400 hover:bg-white rounded-full transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </motion.div>
              ))}
            </div>

            {requests.length === 0 && (
              <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <UserCheck size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">لا توجد طلبات صداقة حالياً</h3>
                <p className="text-gray-500">عندما يرسل لك شخص ما طلباً، سيظهر هنا.</p>
                <Link 
                  to="/community/friends" 
                  className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                >
                  استكشاف أشخاص قد تعرفهم
                </Link>
              </div>
            )}
          </div>
        </main>

        <ContactsSidebar />
      </div>
    </div>
  );
}
