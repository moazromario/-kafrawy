import { motion } from "motion/react";
import { ChevronRight, UserPlus, X, MapPin, Users, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { communityService } from "@/src/modules/community/communityService";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";

export default function SuggestedFriendsPage() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await communityService.getFriendSuggestions(user!.id);
      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("فشل تحميل الاقتراحات");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (friendId: string) => {
    try {
      setSendingId(friendId);
      const { error } = await communityService.sendFriendRequest(user!.id, friendId);
      if (error) throw error;
      
      setSuggestions(prev => prev.filter(s => s.id !== friendId));
      toast.success("تم إرسال طلب الصداقة");
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("فشل إرسال الطلب");
    } finally {
      setSendingId(null);
    }
  };

  const handleRemoveSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

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
                <h1 className="text-2xl font-bold text-gray-900">أشخاص قد تعرفهم</h1>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                  <p className="text-gray-500">جاري تحميل الاقتراحات...</p>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {suggestions.map((sug) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={sug.id} 
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img 
                          src={sug.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(sug.full_name)}&background=random`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={sug.full_name}
                          referrerPolicy="no-referrer"
                        />
                        <button 
                          onClick={() => handleRemoveSuggestion(sug.id)}
                          className="absolute top-2 left-2 p-1.5 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col gap-3">
                        <div className="space-y-1">
                          <h3 className="font-bold text-gray-900 text-base truncate hover:text-emerald-600 cursor-pointer transition-colors">
                            {sug.full_name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users size={12} />
                            <span>صديق مشترك</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin size={12} />
                            <span>كفر الشيخ</span>
                          </div>
                        </div>

                        <div className="mt-auto space-y-2">
                          <button 
                            onClick={() => handleSendRequest(sug.id)}
                            disabled={sendingId === sug.id}
                            className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {sendingId === sug.id ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                            <span>إضافة صديق</span>
                          </button>
                          <button 
                            onClick={() => handleRemoveSuggestion(sug.id)}
                            className="w-full py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                          >
                            إزالة
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                    <Users size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">لا توجد اقتراحات حالياً</h3>
                  <p className="text-gray-500">سنقترح عليك أشخاصاً بناءً على اهتماماتك وأصدقائك.</p>
                </div>
              )}
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
