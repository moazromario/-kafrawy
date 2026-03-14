import { motion } from "motion/react";
import { UserPlus, UserMinus, MessageCircle, MoreHorizontal, Search, ChevronLeft, Loader2, UserCheck, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import CommunitySidebar from "@/src/components/community/CommunitySidebar";
import ContactsSidebar from "@/src/components/community/ContactsSidebar";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { communityService } from "@/src/modules/community/communityService";
import { messageService } from "@/src/modules/community/messageService";

export default function FriendsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Load friends
        const { data: friendsData } = await communityService.getFriends(user.id);
        if (friendsData) setFriends(friendsData);

        // Load requests (where user is friend_id and status is pending)
        const { data: requestsData } = await communityService.getFriendRequests(user.id);
        if (requestsData) setRequests(requestsData);

        // Load suggestions (users who are not friends and no pending requests)
        const { data: suggestionsData } = await communityService.getFriendSuggestions(user.id);
        if (suggestionsData) setSuggestions(suggestionsData);

      } catch (error) {
        console.error("Error loading friends data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    const { error } = await communityService.acceptFriendRequest(requestId);
    if (!error) {
      // Move from requests to friends
      const acceptedRequest = requests.find(r => r.id === requestId);
      if (acceptedRequest) {
        setRequests(prev => prev.filter(r => r.id !== requestId));
        // Refetch friends to get the proper profile data
        if (user) {
          const { data } = await communityService.getFriends(user.id);
          if (data) setFriends(data);
        }
      }
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const { error } = await communityService.rejectFriendRequest(requestId);
    if (!error) {
      setRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const handleSendRequest = async (friendId: string) => {
    if (!user) return;
    const { error } = await communityService.sendFriendRequest(user.id, friendId);
    if (!error) {
      // Remove from suggestions
      setSuggestions(prev => prev.filter(s => s.id !== friendId));
      alert("تم إرسال طلب الصداقة");
    }
  };

  const handleMessage = async (friendId: string) => {
    if (!user) return;
    try {
      const { data, error } = await messageService.createOrGetDirectConversation(user.id, friendId);
      if (data) {
        navigate('/community/messages');
      } else {
        throw error;
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert("حدث خطأ أثناء بدء المحادثة");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <CommunityNavbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 font-bold">يرجى تسجيل الدخول لعرض الأصدقاء</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CommunityNavbar />
      <div className="max-w-[1600px] mx-auto px-4 flex gap-6">
        <CommunitySidebar />
        
        <main className="flex-1 py-6 space-y-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <>
              {/* Requests Section */}
              {requests.length > 0 && (
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
                      <FriendCard 
                        key={req.id} 
                        user={{
                          id: req.id, // This is the friendship ID
                          userId: req.user_id, // The ID of the person who sent the request
                          name: req.profiles?.full_name || 'مستخدم',
                          avatar: req.profiles?.avatar_url,
                          mutual: 0 // Mock mutual friends for now
                        }} 
                        type="request" 
                        onAccept={() => handleAcceptRequest(req.id)}
                        onReject={() => handleRejectRequest(req.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Suggestions Section */}
              {suggestions.length > 0 && (
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
                      <FriendCard 
                        key={sug.id} 
                        user={{
                          id: sug.id,
                          name: sug.full_name || 'مستخدم',
                          avatar: sug.avatar_url,
                          mutual: 0
                        }} 
                        type="suggestion" 
                        onAdd={() => handleSendRequest(sug.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

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
                {friends.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                    لا يوجد أصدقاء بعد. ابحث عن أشخاص تعرفهم وأضفهم!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {friends.map((friend) => {
                      // Determine which profile is the friend (not the current user)
                      const friendProfile = friend.user_id === user.id ? friend.friend_profile : friend.user_profile;
                      
                      return (
                        <FriendCard 
                          key={friend.id} 
                          user={{
                            id: friendProfile?.id,
                            name: friendProfile?.full_name || 'مستخدم',
                            avatar: friendProfile?.avatar_url,
                            mutual: 0,
                            online: true // Mock online status
                          }} 
                          type="friend" 
                          onMessage={() => handleMessage(friendProfile?.id)}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </main>

        <ContactsSidebar />
      </div>
    </div>
  );
}

function FriendCard({ 
  user, 
  type, 
  onAccept, 
  onReject, 
  onAdd, 
  onMessage 
}: { 
  key?: React.Key,
  user: any, 
  type: 'request' | 'suggestion' | 'friend', 
  onAccept?: () => void,
  onReject?: () => void,
  onAdd?: () => void,
  onMessage?: () => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
      <div className="aspect-square bg-gray-100 relative">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600 text-4xl font-bold">
            {user.name.charAt(0)}
          </div>
        )}
        {type === 'friend' && user.online && (
          <div className="absolute bottom-3 left-3 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-lg" />
        )}
        {type === 'friend' && !user.online && (
          <div className="absolute bottom-3 left-3 w-4 h-4 bg-gray-300 border-2 border-white rounded-full shadow-lg" />
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
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
              <button onClick={onAccept} className="w-full py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <UserCheck size={16} />
                تأكيد
              </button>
              <button onClick={onReject} className="w-full py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2">
                <X size={16} />
                حذف
              </button>
            </>
          )}
          {type === 'suggestion' && (
            <>
              <button onClick={onAdd} className="w-full py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                <UserPlus size={16} />
                إضافة صديق
              </button>
              <button className="w-full py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">إزالة</button>
            </>
          )}
          {type === 'friend' && (
            <div className="flex gap-2">
              <button onClick={onMessage} className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
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
