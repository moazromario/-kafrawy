import { Search, MoreHorizontal, Video, UserPlus } from "lucide-react";

export default function ContactsSidebar() {
  const contacts = [
    { id: 1, name: "أحمد علي", online: true },
    { id: 2, name: "سارة محمود", online: true },
    { id: 3, name: "محمود حسن", online: false },
    { id: 4, name: "ليلى إبراهيم", online: true },
    { id: 5, name: "ياسين كريم", online: false },
  ];

  return (
    <aside className="hidden xl:block w-[300px] sticky top-20 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar py-2">
      <div className="flex items-center justify-between px-2 mb-4">
        <h3 className="text-sm font-bold text-gray-500">جهات الاتصال</h3>
        <div className="flex items-center gap-3 text-gray-500">
          <Video size={16} className="cursor-pointer hover:text-gray-700" />
          <Search size={16} className="cursor-pointer hover:text-gray-700" />
          <MoreHorizontal size={16} className="cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      <div className="space-y-1">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                {contact.name[0]}
              </div>
              {contact.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{contact.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-sm font-bold text-gray-500">طلبات الصداقة</h3>
          <Link to="/community/friends" className="text-xs text-emerald-600 font-bold hover:underline">عرض الكل</Link>
        </div>
        <div className="space-y-4 px-2">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  R
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">ريهام أحمد</p>
                  <p className="text-[10px] text-gray-500">صديق مشترك واحد</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">تأكيد</button>
                <button className="flex-1 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

import { Link } from "react-router-dom";
