import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  ChevronLeft, 
  ArrowLeft,
  Hammer,
  ShieldCheck,
  Camera,
  X
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useServices } from "@/src/context/ServicesContext";

export default function ServiceRatingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { bookings, professionals } = useServices();
  const booking = bookings.find(b => b.id === id) || bookings[0];
  const pro = professionals.find(p => p.id === booking.professionalId) || professionals[0];

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return;
    navigate("/services/success?type=rating");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-40">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all border border-gray-100"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">تقييم الخدمة</h1>
      </header>

      <main className="p-6 space-y-10">
        {/* Professional Summary */}
        <section className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
            <img src={pro.image} className="w-full h-full object-cover" alt={pro.name} referrerPolicy="no-referrer" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-xl font-black text-[#050505]">{pro.name}</h3>
              {pro.isVerified && <ShieldCheck size={20} className="text-blue-500" />}
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{pro.specialty}</p>
          </div>
          <div className="bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
            <p className="text-[10px] font-black text-[#1877F2] uppercase tracking-widest">{booking.serviceName}</p>
          </div>
        </section>

        {/* Star Rating */}
        <section className="space-y-6 text-center">
          <h4 className="text-lg font-black text-[#050505]">كيف كانت تجربتك؟</h4>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="transition-all active:scale-90"
              >
                <Star 
                  size={48} 
                  className={`transition-all ${
                    (hover || rating) >= star 
                    ? "text-amber-400 fill-amber-400 scale-110" 
                    : "text-gray-200"
                  }`} 
                />
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-gray-400">اضغط على النجوم للتقييم</p>
        </section>

        {/* Review Text Area */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">اكتب مراجعتك</h4>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="شاركنا رأيك في جودة العمل، المواعيد، والتعامل..."
            className="w-full p-6 bg-white border border-gray-50 rounded-[32px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400 shadow-sm min-h-[150px] resize-none"
          />
        </section>

        {/* Photo Upload Placeholder */}
        <section className="space-y-4">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">إضافة صور للعمل</h4>
          <div className="flex gap-4">
            <button className="w-24 h-24 bg-white border-2 border-dashed border-gray-200 rounded-[28px] flex flex-col items-center justify-center text-gray-400 hover:border-[#1877F2] hover:text-[#1877F2] transition-all group">
              <Camera size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black mt-1">إضافة</span>
            </button>
          </div>
        </section>
      </main>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-8 z-40 rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handleSubmit}
            disabled={rating === 0}
            className={`w-full py-5 bg-[#1877F2] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all ${
              rating === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span>إرسال التقييم</span>
            <CheckCircle2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
