import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Check, 
  X, 
  Eye, 
  User, 
  Phone, 
  Banknote, 
  Clock,
  ExternalLink,
  Search,
  Filter,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PENDING_REQUESTS = [
  { id: 1, user: "معاذ محمد", amount: 200, phone: "01028682259", time: "منذ ٥ دقائق", image: "https://picsum.photos/seed/receipt1/400/600" },
  { id: 2, user: "أحمد علي", amount: 500, phone: "01234567890", time: "منذ ١٢ دقيقة", image: "https://picsum.photos/seed/receipt2/400/600" },
  { id: 3, user: "سارة حسن", amount: 100, phone: "01122334455", time: "منذ ٢٥ دقيقة", image: "https://picsum.photos/seed/receipt3/400/600" },
];

export default function WalletAdminPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(PENDING_REQUESTS);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleApprove = (id: number) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    // In a real app, call API
  };

  const handleReject = (id: number) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    // In a real app, call API
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
            >
              <ArrowRight size={20} />
            </button>
            <h1 className="text-2xl font-black text-[#050505]">مراجعة الشحن</h1>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2] font-black text-xs">
            {requests.length}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-all" size={18} />
            <input 
              type="text"
              placeholder="البحث عن مستخدم أو رقم..."
              className="w-full pr-12 pl-4 py-3.5 bg-gray-100 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all"
            />
          </div>
          <button className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {requests.map((request) => (
            <motion.div 
              key={request.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: 100 }}
              className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2] shadow-inner">
                    <User size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#050505]">{request.user}</h3>
                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold">{request.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#1877F2]">{request.amount} <span className="text-sm">ج.م</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">رقم الهاتف</p>
                  <div className="flex items-center gap-2 text-[#050505] font-black text-xs">
                    <Phone size={14} className="text-gray-400" />
                    <span>{request.phone}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedImage(request.image)}
                  className="p-4 bg-gray-50 rounded-2xl space-y-1 text-right group hover:bg-blue-50 transition-all"
                >
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">صورة الإيصال</p>
                  <div className="flex items-center justify-end gap-2 text-[#1877F2] font-black text-xs">
                    <span>عرض الصورة</span>
                    <Eye size={14} />
                  </div>
                </button>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => handleReject(request.id)}
                  className="flex-1 py-4 bg-red-50 text-red-600 rounded-[24px] font-black text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                >
                  <X size={18} />
                  <span>رفض</span>
                </button>
                <button 
                  onClick={() => handleApprove(request.id)}
                  className="flex-[2] py-4 bg-emerald-500 text-white rounded-[24px] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all"
                >
                  <Check size={18} />
                  <span>قبول العملية</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {requests.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <Check size={48} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-400">لا توجد طلبات معلقة</h3>
              <p className="text-xs font-bold text-gray-300">لقد قمت بمراجعة جميع طلبات الشحن بنجاح</p>
            </div>
          </div>
        )}
      </main>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg aspect-[3/4] bg-white rounded-[48px] overflow-hidden shadow-2xl"
            >
              <img src={selectedImage} className="w-full h-full object-contain bg-gray-900" alt="Receipt" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/40 transition-all"
              >
                <X size={24} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold opacity-70">إيصال تحويل</p>
                    <p className="text-lg font-black">تحقق من صحة البيانات</p>
                  </div>
                  <button className="w-12 h-12 bg-white text-[#050505] rounded-2xl flex items-center justify-center shadow-lg">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
