import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Star, 
  Camera, 
  CheckCircle2, 
  ChevronLeft, 
  ArrowLeft,
  X,
  MessageSquare,
  ShieldCheck,
  ShoppingBag
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const product = {
    id: id || "p1",
    name: "ساعة ذكية Ultra",
    image: "https://picsum.photos/seed/watch/400/400",
    store: "سوق الإلكترونيات"
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(-1);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-6 sticky top-0 z-30 shadow-sm rounded-b-[40px] flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-gray-900">تقييم المنتج</h1>
      </header>

      <main className="p-6 space-y-10">
        {/* Product Info */}
        <section className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex gap-6 group">
          <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-md border border-gray-50 flex-shrink-0">
            <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-1">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{product.store}</p>
            <h3 className="text-lg font-black text-gray-900">{product.name}</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>منتج أصلي 100%</span>
            </div>
          </div>
        </section>

        {/* Rating Form */}
        <section className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-50 space-y-10">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-black text-gray-900">كيف كانت تجربتك؟</h3>
            <p className="text-sm font-bold text-gray-400">تقييمك يساعد الآخرين في اتخاذ القرار الصحيح</p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                  s <= rating ? "bg-amber-400 text-white shadow-amber-100 scale-110" : "bg-gray-50 text-gray-200 border border-gray-100"
                }`}
              >
                <Star size={32} fill={s <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>

          {/* Comment */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <MessageSquare size={18} className="text-indigo-600" />
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">أضف تعليقك</h4>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب رأيك في جودة المنتج، التوصيل، والتعامل..."
              className="w-full p-6 bg-gray-50 border-none rounded-[32px] text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 shadow-inner min-h-[150px] resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Camera size={18} className="text-indigo-600" />
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">أضف صور للمنتج</h4>
            </div>
            <div className="flex gap-4">
              <button className="w-24 h-24 bg-gray-50 rounded-[28px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition-all active:scale-95">
                <Plus size={24} />
                <span className="text-[10px] font-black mt-1">إضافة</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className={`w-full py-5 bg-indigo-600 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 active:scale-95 transition-all ${
              rating === 0 || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>إرسال التقييم</span>
                <CheckCircle2 size={24} />
              </>
            )}
          </button>
        </section>
      </main>
    </div>
  );
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
