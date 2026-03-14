import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  ShoppingBag,
  Camera,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrderRatingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommend, setRecommend] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("يرجى اختيار تقييم بالنجوم أولاً");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/delivery/history");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
        >
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">تقييم الطلب</h1>
      </header>

      <main className="p-6 space-y-8">
        {/* Order Info Card */}
        <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2] shadow-inner">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h2 className="font-black text-[#050505]">برجر كينج كفراوي</h2>
            <p className="text-xs text-gray-400 font-bold mt-1">طلب رقم #{id || "1024"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Stars Rating */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 text-center space-y-6">
            <h3 className="text-lg font-black text-[#050505]">كيف كانت تجربتك؟</h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-all active:scale-90"
                >
                  <Star 
                    size={42} 
                    className={`${
                      (hoverRating || rating) >= star 
                      ? "fill-amber-400 text-amber-400" 
                      : "text-gray-200"
                    } transition-colors`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-gray-400">
              {rating === 5 ? "ممتاز جداً! 😍" : 
               rating === 4 ? "جيد جداً 👍" : 
               rating === 3 ? "جيد 🙂" : 
               rating === 2 ? "مقبول 😐" : 
               rating === 1 ? "سيء جداً 😞" : 
               "اضغط على النجوم للتقييم"}
            </p>
          </div>

          {/* Recommendation Toggle */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest">هل تنصح بهذا المطعم؟</h3>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRecommend(true)}
                className={`flex-1 py-4 rounded-2xl border-2 flex items-center justify-center gap-3 font-black transition-all ${
                  recommend === true 
                  ? "bg-blue-50 border-[#1877F2] text-[#1877F2]" 
                  : "bg-white border-gray-100 text-gray-400"
                }`}
              >
                <ThumbsUp size={20} />
                <span>نعم، أنصح به</span>
              </button>
              <button
                type="button"
                onClick={() => setRecommend(false)}
                className={`flex-1 py-4 rounded-2xl border-2 flex items-center justify-center gap-3 font-black transition-all ${
                  recommend === false 
                  ? "bg-red-50 border-red-600 text-red-700" 
                  : "bg-white border-gray-100 text-gray-400"
                }`}
              >
                <ThumbsDown size={20} />
                <span>لا أنصح به</span>
              </button>
            </div>
          </div>

          {/* Review Text Area */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">أخبرنا بالمزيد عن تجربتك</label>
            <div className="relative">
              <MessageSquare className="absolute right-6 top-6 text-gray-400" size={20} />
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="اكتب مراجعتك هنا... (اختياري)"
                rows={4}
                className="w-full pr-14 pl-6 py-6 bg-white border border-gray-100 rounded-[40px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-300 resize-none shadow-sm"
              />
            </div>
          </div>

          {/* Photo Upload Placeholder */}
          <button type="button" className="w-full py-6 bg-white border-2 border-dashed border-gray-200 rounded-[40px] flex flex-col items-center gap-2 text-gray-400 hover:border-blue-300 hover:text-[#1877F2] transition-all group">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-all">
              <Camera size={24} />
            </div>
            <span className="font-black text-xs">إضافة صور للطعام</span>
          </button>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-xl shadow-2xl shadow-blue-100 flex items-center justify-center gap-4 active:scale-95 transition-all ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={24} />
                <span>إرسال التقييم</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
