import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Send, 
  Mic, 
  Image as ImageIcon, 
  MoreVertical, 
  Phone, 
  Video, 
  Check, 
  CheckCheck, 
  Paperclip, 
  Smile, 
  Play, 
  Pause, 
  X,
  Stethoscope,
  ShieldCheck,
  MapPin,
  Plus
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMedical } from "@/src/context/MedicalContext";

export default function MedicalConversationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { chats, sendMessage } = useMedical();
  const chat = chats.find(c => c.doctorId === id) || chats[0];

  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(chat.id, { senderId: "user", text: inputText });
    setInputText("");
  };

  const handleImageUpload = () => {
    sendMessage(chat.id, { senderId: "user", imageUrl: "https://picsum.photos/seed/med1/400/300" });
    setShowAttachments(false);
  };

  const handleAudioSend = () => {
    sendMessage(chat.id, { senderId: "user", audioUrl: "dummy_audio_url" });
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-gray-50">
                <img src={chat.doctorImage} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-black text-[#050505]">{chat.doctorName}</h3>
                <ShieldCheck size={14} className="text-blue-500" />
              </div>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">متصل الآن</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1E90FF] shadow-sm border border-blue-100 active:scale-95 transition-all">
            <Phone size={20} />
          </button>
          <button className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1E90FF] shadow-sm border border-blue-100 active:scale-95 transition-all">
            <Video size={20} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main 
        ref={scrollRef}
        className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar"
      >
        <div className="flex justify-center">
          <div className="bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
            اليوم
          </div>
        </div>

        {chat.messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, scale: 0.9, x: msg.senderId === "user" ? 20 : -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className={`flex ${msg.senderId === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] space-y-1 ${msg.senderId === "user" ? "items-end" : "items-start"}`}>
              <div className={`p-4 rounded-[28px] shadow-sm relative overflow-hidden group ${
                msg.senderId === "user" 
                ? "bg-[#1E90FF] text-white rounded-br-lg" 
                : "bg-white text-[#050505] rounded-bl-lg border border-gray-50"
              }`}>
                {msg.text && <p className="text-sm font-bold leading-relaxed">{msg.text}</p>}
                
                {msg.imageUrl && (
                  <div className="rounded-2xl overflow-hidden shadow-md border-2 border-white/20">
                    <img src={msg.imageUrl} className="w-full h-auto" alt="" referrerPolicy="no-referrer" />
                  </div>
                )}

                {msg.audioUrl && (
                  <div className="flex items-center gap-3 py-2 px-1">
                    <button className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                      msg.senderId === "user" ? "bg-white/20" : "bg-blue-50 text-[#1E90FF]"
                    }`}>
                      <Play size={20} fill="currentColor" />
                    </button>
                    <div className="flex-1 h-1 bg-white/20 rounded-full relative">
                      <div className="absolute inset-y-0 left-0 w-1/3 bg-white rounded-full" />
                    </div>
                    <span className="text-[10px] font-black">٠:١٥</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 px-2">
                <span className="text-[10px] font-bold text-gray-400">{msg.timestamp}</span>
                {msg.senderId === "user" && <CheckCheck size={12} className="text-[#1E90FF]" />}
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      {/* Input Area */}
      <footer className="bg-white p-6 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)] border-t border-gray-100 relative z-40">
        <AnimatePresence>
          {showAttachments && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-full left-6 right-6 mb-4 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-50 grid grid-cols-3 gap-4"
            >
              {[
                { icon: ImageIcon, label: "صورة", color: "bg-blue-50 text-[#1E90FF]", onClick: handleImageUpload },
                { icon: Paperclip, label: "ملف", color: "bg-emerald-50 text-emerald-600" },
                { icon: MapPin, label: "موقع", color: "bg-amber-50 text-amber-600" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.onClick}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-all`}>
                    <item.icon size={24} />
                  </div>
                  <span className="text-[10px] font-black text-gray-500">{item.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAttachments(!showAttachments)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${
              showAttachments ? "bg-[#1E90FF] text-white border-[#1E90FF]" : "bg-gray-50 text-gray-400 border-gray-100"
            }`}
          >
            <Plus size={24} className={showAttachments ? "rotate-45 transition-transform" : "transition-transform"} />
          </button>
          
          <div className="flex-1 relative group">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="اكتب رسالتك هنا..."
              className="w-full pr-6 pl-12 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all placeholder:text-gray-400 shadow-inner"
            />
            <button className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E90FF] transition-colors">
              <Smile size={20} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {inputText.trim() ? (
              <motion.button
                key="send"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={handleSend}
                className="w-14 h-14 bg-[#1E90FF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 active:scale-95 transition-all"
              >
                <Send size={24} className="rotate-180" />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onMouseDown={() => setIsRecording(true)}
                onMouseUp={handleAudioSend}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                  isRecording ? "bg-red-500 text-white animate-pulse" : "bg-gray-50 text-gray-400 border border-gray-100"
                }`}
              >
                <Mic size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </div>
  );
}
