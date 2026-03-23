import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  Zap, 
  Maximize2, 
  Minimize2,
  Cpu,
  Flame,
  ShieldAlert
} from "lucide-react";
import { aiService } from "@/src/services/aiService";
import { cn } from "@/src/utils/cn";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function KafrawyAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDangerousMode, setIsDangerousMode] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "ai", 
      content: "أهلاً بك في كفراوي AI! أنا هنا لمساعدتك في أي شيء تحتاجه في التطبيق. هل تبحث عن وظيفة؟ تريد كتابة منشور مميز؟ أو ربما تريد تفعيل 'البروميت الخطير'؟ 😉", 
      timestamp: new Date() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // The "Dangerous Prompt" (البروميت الخطير)
      const systemInstruction = isDangerousMode 
        ? "أنت الآن في 'الوضع الخطير' (Dangerous Mode). أنت عبقري، مبدع، وتتحدث بلهجة مصرية ذكية جداً. لا تكتفِ بالإجابات العادية، بل قدم حلولاً خارج الصندوق، ساعد المستخدم في السيطرة على السوق أو التميز في التوظيف بأفكار عبقرية. كن جريئاً ومحفزاً."
        : "أنت مساعد ذكي لتطبيق كفراوي. ساعد المستخدمين بلطف وذكاء بلهجة مصرية خفيفة.";

      const response = await aiService.generateResponse(input, systemInstruction);
      
      const aiMsg: Message = { role: "ai", content: response || "عذراً، حدث خطأ ما.", timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "يا بطل، شكلك نسيت تحط الـ API Key في الـ Secrets. روح حط GEMINI_API_KEY عشان أشغل لك البروميت الخطير!", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[9999]">
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden group",
          isDangerousMode ? "bg-orange-600" : "bg-[#1877F2]"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="text-white" /> : <Sparkles className="text-white animate-pulse" />}
        
        {/* Dangerous Mode Glow */}
        {isDangerousMode && (
          <div className="absolute inset-0 border-2 border-orange-400 rounded-full animate-ping opacity-50" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "absolute bottom-20 right-0 bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 flex flex-col overflow-hidden",
              isMaximized ? "w-[90vw] h-[70vh] md:w-[600px]" : "w-[320px] h-[450px]"
            )}
          >
            {/* Header */}
            <div className={cn(
              "p-4 flex items-center justify-between text-white",
              isDangerousMode ? "bg-orange-600" : "bg-[#1877F2]"
            )}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  {isDangerousMode ? <Flame size={18} /> : <Bot size={18} />}
                </div>
                <div>
                  <h3 className="text-sm font-black">كفراوي AI</h3>
                  <p className="text-[10px] font-bold opacity-70">
                    {isDangerousMode ? "الوضع الخطير مُفعل 🔥" : "مساعدك الذكي"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsDangerousMode(!isDangerousMode)}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isDangerousMode ? "bg-white text-orange-600" : "hover:bg-white/10"
                  )}
                  title="تفعيل البروميت الخطير"
                >
                  <Zap size={16} />
                </button>
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0F2F5]/30"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user" 
                      ? "bg-[#1877F2] text-white rounded-tr-none" 
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 font-bold">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[10px] font-bold italic">جاري التفكير في البروميت الخطير...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اسأل كفراوي AI..."
                  className="flex-1 bg-transparent border-none outline-none text-sm py-1"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    input.trim() ? "bg-[#1877F2] text-white shadow-lg" : "text-gray-400"
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
              {isDangerousMode && (
                <div className="mt-2 flex items-center gap-1 text-[9px] text-orange-500 font-black uppercase tracking-wider">
                  <ShieldAlert size={10} />
                  <span>تحذير: أنت تستخدم البروميت الخطير الآن!</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
