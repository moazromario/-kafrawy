import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  MessageSquare, 
  Search, 
  Plus, 
  Zap, 
  Clock, 
  CheckCircle2, 
  X, 
  ChevronLeft, 
  Stethoscope,
  MoreVertical,
  Phone,
  Video
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMedical } from "@/src/context/MedicalContext";

export default function MedicalChatsPage() {
  const navigate = useNavigate();
  const { chats } = useMedical();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter(chat => 
    chat.doctorName.includes(searchQuery) || chat.lastMessage.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
            >
              <ArrowRight size={24} />
            </button>
            <h1 className="text-xl font-black text-[#050505]">المحادثات</h1>
          </div>
          <button className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1E90FF] shadow-sm border border-blue-100">
            <Plus size={24} />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E90FF] transition-colors" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المحادثات..."
            className="w-full pr-12 pl-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all placeholder:text-gray-400 shadow-inner"
          />
        </div>
      </header>

      <main className="p-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredChats.map((chat, i) => (
            <motion.div
              key={chat.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/medical/chat/${chat.doctorId}`)}
              className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex gap-5 group cursor-pointer hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-500"
            >
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-[24px] overflow-hidden shadow-md border border-gray-50">
                  <img src={chat.doctorImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={chat.doctorName} referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#050505]">{chat.doctorName}</h3>
                  <span className="text-[10px] font-bold text-gray-400">{chat.lastMessageTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400 truncate max-w-[180px]">{chat.lastMessage}</p>
                  {chat.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-[#1E90FF] text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg shadow-blue-100">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <MessageSquare size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#050505]">لا توجد محادثات</h3>
              <p className="text-sm text-gray-400">ابدأ محادثة جديدة مع طبيبك للاستفسار عن أي شيء.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
