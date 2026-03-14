import { motion, AnimatePresence } from "motion/react";
import { 
  MessageCircle, 
  Search, 
  Settings, 
  MoreHorizontal, 
  Send, 
  Image, 
  Mic, 
  Smile, 
  Plus,
  Phone,
  Video,
  Info,
  ChevronRight,
  ThumbsUp,
  Camera,
  FileText,
  UserCheck,
  Bell,
  X,
  Play,
  Trash2,
  Loader2
} from "lucide-react";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { messageService, Conversation, Message } from "@/src/modules/community/messageService";
import { communityService } from "@/src/modules/community/communityService";

export default function MessagesPage() {
  const { user, profile } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load conversations
  useEffect(() => {
    if (!user) return;
    const loadConversations = async () => {
      const { data, error } = await messageService.getConversations(user.id);
      if (data) {
        // Format conversations for UI
        const formatted = data.map(conv => {
          // Find the other participant
          const otherParticipant = conv.participants?.find((p: any) => p.user_id !== user.id)?.profiles;
          
          return {
            id: conv.id,
            name: conv.type === 'group' ? conv.name : (otherParticipant?.full_name || 'مستخدم'),
            avatar: conv.type === 'group' ? 'G' : (otherParticipant?.avatar_url || otherParticipant?.full_name?.charAt(0) || 'U'),
            lastMsg: conv.last_message?.content || (conv.last_message?.media_url ? 'أرسل وسائط' : 'لا توجد رسائل'),
            time: conv.last_message ? new Date(conv.last_message.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '',
            unread: conv.unread_count > 0,
            online: true, // Mock online status for now
            otherUser: otherParticipant
          };
        });
        setConversations(formatted);
      }
      setLoading(false);
    };
    loadConversations();
  }, [user]);

  // Load messages when active chat changes
  useEffect(() => {
    if (!activeChat || !user) return;
    
    const loadMessages = async () => {
      const { data, error } = await messageService.getMessages(activeChat);
      if (data) {
        setMessages(data);
        // Mark as read
        await messageService.markAsRead(activeChat, user.id);
        // Update unread status in list
        setConversations(prev => prev.map(c => c.id === activeChat ? { ...c, unread: false } : c));
      }
      scrollToBottom();
    };
    
    loadMessages();

    // Subscribe to new messages
    const subscription = messageService.subscribeToMessages(activeChat, (newMsg) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.find(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      scrollToBottom();
      // Mark as read immediately if chat is open
      messageService.markAsRead(activeChat, user.id);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [activeChat, user]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = (send = true) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    
    if (send && recordingTime > 0) {
      // Audio recording logic would go here (using MediaRecorder API)
      alert("تسجيل الصوت قيد التطوير");
    }
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || !activeChat || !user) return;
    setSending(true);

    try {
      let mediaUrl = undefined;
      let mediaType = undefined;

      if (selectedImage) {
        const { url, error } = await communityService.uploadMedia(selectedImage, 'image');
        if (error) throw error;
        if (url) {
          mediaUrl = url;
          mediaType = 'image';
        }
      }

      const { data, error } = await messageService.sendMessage(
        activeChat,
        user.id,
        inputText.trim(),
        mediaUrl,
        mediaType
      );

      if (error) throw error;

      // Optimistic update
      if (data) {
        setMessages(prev => [...prev, data]);
        scrollToBottom();
      }

      setInputText("");
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("فشل إرسال الرسالة");
    } finally {
      setSending(false);
    }
  };

  const currentChat = conversations.find(c => c.id === activeChat);

  if (!user) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center">
        <CommunityNavbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 font-bold">يرجى تسجيل الدخول لعرض الرسائل</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <CommunityNavbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List Sidebar */}
        <aside className={`w-full md:w-[360px] lg:w-[400px] bg-white border-l border-gray-100 flex flex-col transition-all ${activeChat ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold text-gray-900">الدردشات</h1>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-100 rounded-full text-gray-900 hover:bg-gray-200 transition-colors"><Settings size={20} /></button>
                <button className="p-2 bg-gray-100 rounded-full text-gray-900 hover:bg-gray-200 transition-colors"><Camera size={20} /></button>
                <button className="p-2 bg-gray-100 rounded-full text-gray-900 hover:bg-gray-200 transition-colors"><Plus size={20} /></button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="بحث في الدردشات..."
                className="w-full pr-10 pl-4 py-2.5 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-emerald-500" /></div>
            ) : conversations.length === 0 ? (
              <div className="text-center p-8 text-gray-500 text-sm">لا توجد محادثات حالياً</div>
            ) : (
              conversations.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`flex items-center gap-3 p-3 mx-2 rounded-2xl cursor-pointer transition-all relative group ${activeChat === chat.id ? "bg-emerald-50" : "hover:bg-gray-50"}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl border border-gray-100 overflow-hidden">
                      {chat.avatar && chat.avatar.startsWith('http') ? (
                        <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        chat.avatar
                      )}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0.5 left-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className={`text-sm truncate ${chat.unread ? "font-extrabold text-gray-900" : "font-bold text-gray-700"}`}>
                        {chat.name}
                      </h3>
                      <span className={`text-[10px] ${chat.unread ? "text-emerald-600 font-bold" : "text-gray-400"}`}>
                        {chat.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs truncate flex-1 ${chat.unread ? "text-gray-900 font-bold" : "text-gray-500"}`}>
                        {chat.lastMsg}
                      </p>
                      {chat.unread && (
                        <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full flex-shrink-0 shadow-sm shadow-emerald-200" />
                      )}
                    </div>
                  </div>
                  
                  <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white shadow-md rounded-full text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100 hidden lg:block">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Chat Window */}
        <main className={`flex-1 bg-white flex flex-col relative ${!activeChat ? "hidden md:flex" : "flex"}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveChat(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold overflow-hidden">
                      {currentChat?.avatar && currentChat.avatar.startsWith('http') ? (
                        <img src={currentChat.avatar} alt={currentChat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        currentChat?.avatar
                      )}
                    </div>
                    {currentChat?.online && (
                      <div className="absolute bottom-0 left-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{currentChat?.name}</h3>
                    <p className="text-[10px] text-emerald-500 font-bold">نشط الآن</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <button className="p-2 hover:bg-emerald-50 rounded-full transition-colors"><Phone size={20} /></button>
                  <button className="p-2 hover:bg-emerald-50 rounded-full transition-colors"><Video size={20} /></button>
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className={`p-2 hover:bg-emerald-50 rounded-full transition-colors ${showDetails ? "bg-emerald-50" : ""}`}
                  >
                    <Info size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white flex flex-col">
                <div className="flex flex-col items-center py-8 space-y-2">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-2xl overflow-hidden">
                    {currentChat?.avatar && currentChat.avatar.startsWith('http') ? (
                      <img src={currentChat.avatar} alt={currentChat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      currentChat?.avatar
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{currentChat?.name}</h2>
                  <p className="text-xs text-gray-500">أنت صديق لـ {currentChat?.name} على كفراوي</p>
                  <button className="px-4 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">عرض الملف الشخصي</button>
                </div>

                <div className="flex justify-center my-4">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">بداية المحادثة</span>
                </div>
                
                {messages.map((msg) => {
                  const isMe = msg.sender_id === user.id;
                  const timeStr = new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[85%] ${isMe ? 'mr-auto' : 'ml-auto'}`}
                    >
                      {!isMe && (
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[10px] flex-shrink-0 mb-1 overflow-hidden">
                          {currentChat?.avatar && currentChat.avatar.startsWith('http') ? (
                            <img src={currentChat.avatar} alt={currentChat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            currentChat?.avatar
                          )}
                        </div>
                      )}
                      <div className="flex flex-col space-y-1">
                        {msg.media_url && msg.media_type === 'image' && (
                          <div className={`rounded-2xl overflow-hidden mb-1 max-w-sm shadow-sm ${isMe ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                            <img src={msg.media_url} alt="Sent" className="w-full h-auto object-cover max-h-60" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        {msg.content && (
                          <div className={`px-4 py-2 rounded-2xl text-sm ${
                            isMe 
                            ? 'bg-emerald-600 text-white rounded-br-none shadow-sm' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        )}
                        <span className={`text-[9px] text-gray-400 font-medium ${isMe ? 'text-left' : 'text-right'}`}>{timeStr}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="px-4 py-2 bg-white border-t border-gray-50 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">صورة جاهزة للإرسال</p>
                    <p className="text-[10px] text-gray-500">يمكنك إضافة تعليق قبل الإرسال</p>
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <div className="p-4 bg-white flex items-center gap-2 border-t border-gray-50">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                />
                
                {!isRecording ? (
                  <>
                    <div className="flex gap-1">
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors hidden sm:block"><Plus size={20} /></button>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors hidden sm:block"><Camera size={20} /></button>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                      >
                        <Image size={20} />
                      </button>
                      <button 
                        onClick={startRecording}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                      >
                        <Mic size={20} />
                      </button>
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="اكتب رسالة..."
                        className="w-full pr-4 pl-10 py-2.5 bg-gray-100 border-none rounded-full text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                      <button className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-600 hover:scale-110 transition-transform"><Smile size={20} /></button>
                    </div>
                    <button 
                      onClick={handleSendMessage}
                      disabled={sending || (!inputText.trim() && !selectedImage)}
                      className="p-2 text-emerald-600 hover:scale-110 transition-transform disabled:opacity-50"
                    >
                      {sending ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : (inputText.trim() || selectedImage) ? (
                        <div className="bg-emerald-600 p-2 rounded-full text-white shadow-md">
                          <Send size={20} />
                        </div>
                      ) : (
                        <ThumbsUp size={24} fill="currentColor" />
                      )}
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2">
                    <div className="flex items-center gap-2 text-red-500 animate-pulse">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm font-bold font-mono">{formatTime(recordingTime)}</span>
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 60, ease: "linear" }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => stopRecording(false)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button 
                        onClick={() => stopRecording(true)}
                        className="p-2 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 transition-colors"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <MessageCircle size={48} />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">رسائلك</h2>
                <p className="text-sm">أرسل صوراً ورسائل خاصة إلى صديق أو مجموعة.</p>
              </div>
              <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">إرسال رسالة</button>
            </div>
          )}

          {/* Chat Details Sidebar */}
          <AnimatePresence>
            {showDetails && (
              <motion.aside
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute left-0 top-0 bottom-0 w-[300px] bg-white border-r border-gray-100 z-20 shadow-2xl flex flex-col"
              >
                <div className="p-6 flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-3xl overflow-hidden">
                    {currentChat?.avatar && currentChat.avatar.startsWith('http') ? (
                      <img src={currentChat.avatar} alt={currentChat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      currentChat?.avatar
                    )}
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-900">{currentChat?.name}</h2>
                    <p className="text-xs text-gray-500">نشط الآن</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center gap-1">
                      <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><UserCheck size={20} /></button>
                      <span className="text-[10px] font-bold">الملف</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><Bell size={20} /></button>
                      <span className="text-[10px] font-bold">كتم</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><Search size={20} /></button>
                      <span className="text-[10px] font-bold">بحث</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  <div>
                    <button className="w-full flex items-center justify-between py-2 font-bold text-sm text-gray-700">
                      <span>تخصيص الدردشة</span>
                      <ChevronRight size={18} className="rotate-90" />
                    </button>
                  </div>
                  <div>
                    <button className="w-full flex items-center justify-between py-2 font-bold text-sm text-gray-700">
                      <span>الوسائط والملفات</span>
                      <ChevronRight size={18} className="rotate-90" />
                    </button>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {messages.filter(m => m.media_url && m.media_type === 'image').slice(0, 6).map((m, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img src={m.media_url} className="w-full h-full object-cover" alt="Media" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <button className="w-full flex items-center justify-between py-2 font-bold text-sm text-gray-700">
                      <span>الخصوصية والدعم</span>
                      <ChevronRight size={18} className="rotate-90" />
                    </button>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
