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
  Trash2
} from "lucide-react";
import CommunityNavbar from "@/src/components/community/CommunityNavbar";
import React, { useState, useRef } from "react";

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [showDetails, setShowDetails] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const chats = [
    { id: 1, name: "أحمد علي", lastMsg: "تمام يا بطل، نتقابل بكرة", time: "5 د", online: true, avatar: "A", unread: false },
    { id: 2, name: "سارة محمود", lastMsg: "شكراً جداً على المساعدة", time: "1 س", online: true, avatar: "S", unread: true },
    { id: 3, name: "محمود حسن", lastMsg: "المنتج لسه متاح؟", time: "3 س", online: false, avatar: "M", unread: false },
    { id: 4, name: "ليلى إبراهيم", lastMsg: "أوكي، هكلمك لما أوصل", time: "يوم", online: true, avatar: "L", unread: false },
    { id: 5, name: "كريم محمد", lastMsg: "وصلت فين؟", time: "يومين", online: false, avatar: "K", unread: true },
  ];

  const activeFriends = [
    { id: 1, name: "أحمد", online: true, avatar: "A" },
    { id: 2, name: "سارة", online: true, avatar: "S" },
    { id: 4, name: "ليلى", online: true, avatar: "L" },
    { id: 6, name: "ياسين", online: true, avatar: "Y" },
    { id: 7, name: "نور", online: true, avatar: "N" },
  ];

  const [messages, setMessages] = useState<any[]>([
    { id: 1, text: "أهلاً يا محمد، كنت بسأل عن اللابتوب اللي كنت عارضه", sender: "other", time: "10:00 ص" },
    { id: 2, text: "أهلاً يا أحمد، لسه متاح فعلاً، تحب تيجي تشوفه؟", sender: "me", time: "10:05 ص" },
    { id: 3, text: "يا ريت والله، أنا موجود في الحي الثالث دلوقتي", sender: "other", time: "10:06 ص" },
    { id: 4, text: "تمام يا بطل، نتقابل بكرة الساعة ٥ عند المسجد الكبير؟", sender: "me", time: "10:10 ص" },
    { id: 5, text: "تمام يا بطل، نتقابل بكرة", sender: "other", time: "10:11 ص" },
  ]);

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
      const newMessage = {
        id: Date.now(),
        audio: true,
        duration: formatTime(recordingTime),
        sender: "me",
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim() && !selectedImage) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      image: selectedImage,
      sender: "me",
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setSelectedImage(null);
  };

  const currentChat = chats.find(c => c.id === activeChat);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <CommunityNavbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List Sidebar */}
        <aside className={`w-full md:w-[360px] lg:w-[400px] bg-white border-l border-gray-100 flex flex-col transition-all ${activeChat && "hidden md:flex"}`}>
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

          {/* Active Friends Stories */}
          <div className="px-4 pb-4 overflow-x-auto no-scrollbar flex gap-4">
            <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                <Plus size={24} />
              </div>
              <span className="text-[10px] text-gray-500">قصتك</span>
            </div>
            {activeFriends.map(friend => (
              <div key={friend.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
                <div className="relative p-0.5 rounded-full border-2 border-emerald-500">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg border-2 border-white">
                    {friend.avatar}
                  </div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <span className="text-[10px] text-gray-700 font-medium">{friend.name}</span>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`flex items-center gap-3 p-3 mx-2 rounded-2xl cursor-pointer transition-all relative group ${activeChat === chat.id ? "bg-emerald-50" : "hover:bg-gray-50"}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl border border-gray-100">
                    {chat.avatar}
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
                
                {/* Hover Action Menu */}
                <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white shadow-md rounded-full text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100 hidden lg:block">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <main className={`flex-1 bg-white flex flex-col relative ${!activeChat && "hidden md:flex"}`}>
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
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                      {currentChat?.avatar}
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
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-2xl">
                    {currentChat?.avatar}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{currentChat?.name}</h2>
                  <p className="text-xs text-gray-500">أنت صديق لـ {currentChat?.name} على كفراوي</p>
                  <button className="px-4 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">عرض الملف الشخصي</button>
                </div>

                <div className="flex justify-center my-4">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">اليوم</span>
                </div>
                
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[85%] ${msg.sender === 'me' ? 'mr-auto' : 'ml-auto'}`}
                  >
                    {msg.sender === 'other' && (
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[10px] flex-shrink-0 mb-1">
                        {currentChat?.avatar}
                      </div>
                    )}
                    <div className="flex flex-col space-y-1">
                      {msg.image && (
                        <div className={`rounded-2xl overflow-hidden mb-1 max-w-sm shadow-sm ${msg.sender === 'me' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                          <img src={msg.image} alt="Sent" className="w-full h-auto object-cover max-h-60" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      {msg.audio && (
                        <div className={`px-4 py-3 rounded-2xl flex items-center gap-3 min-w-[200px] ${
                          msg.sender === 'me' 
                          ? 'bg-emerald-600 text-white rounded-br-none shadow-sm' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                          <button className={`p-1.5 rounded-full ${msg.sender === 'me' ? 'bg-white/20' : 'bg-emerald-100 text-emerald-600'}`}>
                            <Play size={16} fill="currentColor" />
                          </button>
                          <div className="flex-1 h-1 bg-current opacity-20 rounded-full relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-current rounded-full" />
                          </div>
                          <span className="text-[10px] font-bold">{msg.duration}</span>
                        </div>
                      )}
                      {msg.text && (
                        <div className={`px-4 py-2 rounded-2xl text-sm ${
                          msg.sender === 'me' 
                          ? 'bg-emerald-600 text-white rounded-br-none shadow-sm' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      )}
                      <span className={`text-[9px] text-gray-400 font-medium ${msg.sender === 'me' ? 'text-left' : 'text-right'}`}>{msg.time}</span>
                    </div>
                    {msg.sender === 'me' && msg.id === 4 && (
                      <div className="w-3 h-3 rounded-full bg-emerald-100 overflow-hidden self-end mb-4 border border-white">
                        <div className="w-full h-full flex items-center justify-center text-[6px] font-bold text-emerald-600">{currentChat?.avatar}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Image Preview */}
              {selectedImage && (
                <div className="px-4 py-2 bg-white border-t border-gray-50 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => setSelectedImage(null)}
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
                      className="p-2 text-emerald-600 hover:scale-110 transition-transform"
                    >
                      {(inputText.trim() || selectedImage) ? (
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
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-3xl">
                    {currentChat?.avatar}
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
                      {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img src={`https://picsum.photos/seed/media${i}/200/200`} className="w-full h-full object-cover" alt="Media" referrerPolicy="no-referrer" />
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
