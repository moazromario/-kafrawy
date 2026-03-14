import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  MoreHorizontal, 
  Bell,
  Check,
  Trash2,
  Clock,
  Loader2
} from "lucide-react";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import { communityService } from "@/src/modules/community/communityService";
import { useAuth } from "@/src/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

type NotificationType = 'like' | 'comment' | 'friend_request' | 'group_invite' | 'page_invite' | 'mention';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await communityService.getNotifications(user.id);
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await communityService.markAllNotificationsAsRead(user.id);
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!user) return;
    try {
      await communityService.deleteNotification(user.id, id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user) return;
    try {
      await communityService.markNotificationAsRead(user.id, id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'like': return <Heart size={14} className="fill-red-500 text-red-500" />;
      case 'comment': return <MessageCircle size={14} className="fill-emerald-500 text-emerald-500" />;
      case 'friend_request': return <UserPlus size={14} className="text-blue-500" />;
      default: return <Bell size={14} className="text-gray-500" />;
    }
  };

  const getIconBg = (type: NotificationType) => {
    switch (type) {
      case 'like': return 'bg-red-100';
      case 'comment': return 'bg-emerald-100';
      case 'friend_request': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <CommunityNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CommunityNavbar />
      
      <main className="flex-1 max-w-2xl mx-auto w-full py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100">
              <Bell size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">الإشعارات</h1>
          </div>
          <button 
            onClick={markAllAsRead}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            <Check size={16} />
            تحديد الكل كمقروء
          </button>
        </div>

        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={notification.id}
                className={`group relative bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md ${!notification.is_read && "border-r-4 border-r-emerald-500"}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl border border-gray-100 overflow-hidden">
                    {notification.actor?.avatar_url ? (
                      <img src={notification.actor.avatar_url} alt={notification.actor.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      notification.actor?.full_name?.[0] || 'U'
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -left-1 p-1.5 rounded-full border-2 border-white shadow-sm ${getIconBg(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        <span className="font-bold hover:text-emerald-600 cursor-pointer transition-colors">{notification.actor?.full_name}</span>
                        {" "}
                        {notification.content}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-gray-400">
                        <Clock size={12} />
                        <span className="text-[11px] font-medium">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ar })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {notification.type === 'friend_request' && (
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm">
                        قبول الطلب
                      </button>
                      <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">
                        حذف
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                  {!notification.is_read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell size={40} />
              </div>
              <p className="font-bold">لا توجد إشعارات حالياً</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
