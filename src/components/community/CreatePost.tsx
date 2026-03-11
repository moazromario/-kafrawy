import { Image, Video, MapPin, Smile } from "lucide-react";

export default function CreatePost() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      {/* Top Section: Profile & Input */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold overflow-hidden border border-emerald-50">
          <img src="https://picsum.photos/seed/user1/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <button className="flex-1 h-10 px-4 bg-gray-100 hover:bg-gray-200 rounded-full text-right text-gray-500 text-sm transition-colors">
          بم تفكر يا محمد؟
        </button>
      </div>
      
      {/* Middle Section: Add Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 pt-3 border-t border-gray-50">
        <PostOption icon={Image} label="صورة" color="text-emerald-500" />
        <PostOption icon={Video} label="فيديو" color="text-red-500" />
        <PostOption icon={MapPin} label="موقع" color="text-orange-500" />
        <PostOption icon={Smile} label="شعور" color="text-yellow-500" />
      </div>

      {/* Bottom Section: Post Button */}
      <button className="w-full mt-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-[0.98]">
        نشر
      </button>
    </div>
  );
}

function PostOption({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <button className="flex items-center justify-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
      <Icon size={18} className={color} />
      <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700">{label}</span>
    </button>
  );
}
