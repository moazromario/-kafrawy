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
      path: "/profile", 
      color: "text-emerald-600" 
    },
    { icon: Users, label: "الأصدقاء", path: "/community/friends", color: "text-blue-500" },
    { icon: LayoutGrid, label: "المجموعات", path: "/community/groups", color: "text-purple-500" },
    { icon: Clock, label: "الأحدث", path: "/community", color: "text-indigo-500" },
    { icon: Bookmark, label: "العناصر المحفوظة", path: "/saved", color: "text-pink-500" },
    { icon: Flag, label: "الصفحات", path: "/pages", color: "text-orange-500" },
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
            <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-50 ${item.color}`}>
              <item.icon size={20} />
            </div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{item.label}</span>
          </Link>
        ))}
        
        <button className="flex items-center gap-3 p-2 w-full rounded-xl hover:bg-gray-100 transition-colors group">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 text-gray-600">
            <ChevronDown size={20} />
          </div>
          <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">عرض المزيد</span>
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="px-2 text-sm font-bold text-gray-500 mb-4">اختصاراتك</h3>
        <div className="space-y-1">
          {["جروب سكان كفراوي", "سوق كفراوي المستعمل", "نادي شباب كفراوي"].map((group) => (
            <Link
              key={group}
              to="#"
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                {group[0]}
              </div>
              <span className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900">{group}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
