import { motion } from "motion/react";
import { UserPlus, UserMinus, MessageCircle, MoreHorizontal, Search, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";

export default function FriendsPage() {
  const requests = [
    { id: 1, name: "ريهام أحمد", mutual: 5, avatar: "R" },
    { id: 2, name: "كريم محمد", mutual: 2, avatar: "K" },
  ];

  const suggestions = [
    { id: 3, name: "ياسر علي", mutual: 12, avatar: "Y" },
    { id: 4, name: "هبة إبراهيم", mutual: 8, avatar: "H" },
    { id: 5, name: "عمر خالد", mutual: 3, avatar: "O" },
  ];

  const allFriends = [
    { id: 6, name: "أحمد علي", mutual: 15, online: true },
    { id: 7, name: "سارة محمود", mutual: 7, online: true },
    { id: 8, name: "محمود حسن", mutual: 22, online: false },
    { id: 9, name: "ليلى إبراهيم", mutual: 4, online: true },
    { id: 10, name: "ياسين كريم", mutual: 12, online: false },
    { id: 11, name: "رنا يوسف", mutual: 9, online: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <CommunityNavbar />
      <div className="max-w-[1600px] mx-auto px-4 flex gap-6">
        <CommunitySidebar />
        
        <main className="flex-1 py-6 space-y-8">
          {/* Requests Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">طلبات الصداقة</h2>
              <Link 
                to="/community/friends/requests" 
                className="text-sm text-emerald-600 font-bold hover:underline flex items-center gap-1"
              >
                عرض الكل
                <ChevronLeft size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {requests.map((req) => (
                <FriendCard key={req.id} user={req} type="request" />
              ))}
            </div>
          </section>

          {/* All Friends Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">كل الأصدقاء</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="بحث في الأصدقاء..."
                    className="pr-9 pl-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {allFriends.map((friend) => (
                <FriendCard key={friend.id} user={friend} type="friend" />
              ))}
            </div>
          </section>

          {/* Suggestions Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">أشخاص قد تعرفهم</h2>
              <Link 
                to="/community/friends/suggestions" 
                className="text-sm text-emerald-600 font-bold hover:underline flex items-center gap-1"
              >
                عرض الكل
                <ChevronLeft size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {suggestions.map((sug) => (
                <FriendCard key={sug.id} user={sug} type="suggestion" />
              ))}
            </div>
          </section>
        </main>

        <ContactsSidebar />
      </div>
    </div>
  );
}

function FriendCard({ user, type }: { user: any, type: 'request' | 'suggestion' | 'friend', key?: number | string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
      <div className="aspect-square bg-gray-100 relative">
        <img 
          src={`https://picsum.photos/seed/friend${user.id}/400/400`} 
          alt={user.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          referrerPolicy="no-referrer"
        />
        {type === 'friend' && user.online && (
          <div className="absolute bottom-3 left-3 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-lg" />
        )}
        {type === 'friend' && !user.online && (
          <div className="absolute bottom-3 left-3 w-4 h-4 bg-gray-300 border-2 border-white rounded-full shadow-lg" />
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-gray-900">{user.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">{user.mutual} صديق مشترك</p>
            {type === 'friend' && (
              <span className={`text-[10px] font-bold ${user.online ? 'text-emerald-600' : 'text-gray-400'}`}>
                {user.online ? 'نشط الآن' : 'غير متصل'}
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          {type === 'request' && (
            <>
              <button className="w-full py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">تأكيد</button>
              <button className="w-full py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-300 transition-colors">حذف</button>
            </>
          )}
          {type === 'suggestion' && (
            <>
              <button className="w-full py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                <UserPlus size={16} />
                إضافة صديق
              </button>
              <button className="w-full py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">إزالة</button>
            </>
          )}
          {type === 'friend' && (
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <MessageCircle size={16} />
                مراسلة
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
