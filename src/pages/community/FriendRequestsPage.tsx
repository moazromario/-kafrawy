import { motion } from "motion/react";
import { ChevronRight, MoreHorizontal, UserCheck, UserX, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { communityService } from "@/src/modules/community/communityService";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";

export default function FriendRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await communityService.getFriendRequests(user!.id);
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      toast.error("فشل تحميل طلبات الصداقة");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      const { error } = await communityService.acceptFriendRequest(requestId);
      if (error) throw error;
      
      setRequests(prev => prev.filter(req => req.id !== requestId));
      toast.success("تم قبول طلب الصداقة بنجاح");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("فشل قبول الطلب");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      const { error } = await communityService.rejectFriendRequest(requestId);
      if (error) throw error;
      
      setRequests(prev => prev.filter(req => req.id !== requestId));
      toast.success("تم حذف طلب الصداقة");
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast.error("فشل حذف الطلب");
    } finally {
      setProcessingId(null);
    }
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
                <h1 className="text-2xl font-bold text-gray-900">طلبات الصداقة</h1>
              </div>
              {!loading && requests.length > 0 && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                  {requests.length} طلبات جديدة
                </span>
              )}
            </div>

            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                  <p className="text-gray-500">جاري تحميل الطلبات...</p>
                </div>
              ) : requests.length > 0 ? (
                requests.map((req) => (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={req.id} 
                    className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="relative">
                      <img 
                        src={req.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.profiles?.full_name || "")}&background=random`} 
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md"
                        alt={req.profiles?.full_name}
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-right space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h3 className="text-lg font-bold text-gray-900 hover:text-emerald-600 cursor-pointer transition-colors">
                          {req.profiles?.full_name}
                        </h3>
                        <span className="text-xs text-gray-400">• {new Date(req.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</span>
                      </div>
                      <p className="text-sm text-gray-500">يريد أن يكون صديقك</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full sm:w-48">
                      <button 
                        onClick={() => handleAccept(req.id)}
                        disabled={processingId === req.id}
                        className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {processingId === req.id ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
                        <span>تأكيد</span>
                      </button>
                      <button 
                        onClick={() => handleReject(req.id)}
                        disabled={processingId === req.id}
                        className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {processingId === req.id ? <Loader2 size={18} className="animate-spin" /> : <UserX size={18} />}
                        <span>حذف</span>
                      </button>
                    </div>

                    <button className="hidden sm:block p-2 text-gray-400 hover:bg-white rounded-full transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </motion.div>
                ))
              ) : (
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
          </div>
        </main>

        <ContactsSidebar />
      </div>
    </div>
  );
}
