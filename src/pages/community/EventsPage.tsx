import { motion } from "motion/react";
import { Calendar, MapPin, Users, Clock, Plus, Share2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { communityService } from "@/src/modules/community/communityService";
import { useAuth } from "@/src/context/AuthContext";

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await communityService.getEvents();
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user) return alert("يجب تسجيل الدخول للانضمام");
    try {
      const { error } = await communityService.joinEvent(user.id, eventId);
      if (error) throw error;
      alert("تم الانضمام للحدث!");
      fetchEvents();
    } catch (error) {
      console.error("Error joining event:", error);
      alert("حدث خطأ أثناء الانضمام");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الأحداث المحلية</h1>
        <button className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg">
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="relative h-40">
              <img 
                src={event.cover_url || `https://picsum.photos/seed/${event.id}/800/400`} 
                alt={event.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-emerald-600">
                {event.category || 'حدث'}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-3">{event.title}</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={14} className="text-emerald-500" />
                  <span>{new Date(event.start_time).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={14} className="text-emerald-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users size={14} className="text-emerald-500" />
                  <span>{event.attendees_count || 0} مهتم</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={14} className="text-emerald-500" />
                  <span>{new Date(event.start_time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleJoinEvent(event.id)}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-colors"
                >
                  أنا مهتم
                </button>
                <button className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
