import { 
  Users, 
  LayoutGrid, 
  Clock, 
  Bookmark, 
  Flag, 
  Calendar,
  ChevronDown,
  User
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";

export default function CommunitySidebar() {
  const { user, profile } = useAuth();

  const menuItems = [
    { 
      icon: User, 
      label: profile?.full_name || user?.email?.split('@')[0] || "الملف الشخصي", 
      path: `/community/profile/${user?.id}`, 
      color: "text-emerald-600" 
    },
    { icon: Users, label: "الأصدقاء", path: "/community/friends", color: "text-blue-500" },
    { icon: LayoutGrid, label: "المجموعات", path: "/community/groups", color: "text-purple-500" },
    { icon: Clock, label: "الأحدث", path: "/community", color: "text-indigo-500" },
    { icon: Flag, label: "الصفحات", path: "/community/pages", color: "text-orange-500" },
    { icon: Calendar, label: "المناسبات", path: "/community/events", color: "text-red-500" },
  ];

  return (
    <aside className="hidden lg:block w-[300px] sticky top-20 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar py-2">
      <div className="space-y-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-50 ${item.color} overflow-hidden`}>
              {index === 0 && profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <item.icon size={20} />
              )}
            </div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
