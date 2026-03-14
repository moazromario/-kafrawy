import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Phone, 
  Banknote, 
  Upload, 
  CheckCircle2, 
  ShieldCheck,
  Info,
  Copy,
  X,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WalletTopupPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetNumber = "01028682259";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetNumber);
    // In a real app, show a toast
  };

  const handleSubmit = async () => {
    if (!amount || !phone || !file) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/wallet/status/pending");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-44">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
        >
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-black text-[#050505]">شحن المحفظة</h1>
      </header>

      <main className="p-4 space-y-8">
        {/* Instructions */}
        <section className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2]">
              <Phone size={28} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#050505]">فودافون كاش</h2>
              <p className="text-xs text-gray-400 font-bold">قم بالتحويل إلى هذا الرقم</p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-[28px] border border-dashed border-gray-200 flex items-center justify-between group">
            <span className="text-2xl font-black text-[#1877F2] tracking-wider">{targetNumber}</span>
            <button 
              onClick={handleCopy}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-[#1877F2] shadow-sm transition-all"
            >
              <Copy size={18} />
            </button>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl text-blue-700">
            <Info size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold leading-relaxed">
              تأكد من تحويل المبلغ المطلوب أولاً عبر تطبيق "أنا فودافون" أو الكود *9# ثم قم برفع صورة التحويل هنا.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase px-2 tracking-widest">بيانات التحويل</h2>
            
            <div className="relative group">
              <Banknote className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-all" size={20} />
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="المبلغ المحول"
                className="w-full pr-14 pl-6 py-5 bg-white border border-gray-100 rounded-[28px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all shadow-sm placeholder:text-gray-300"
              />
            </div>

            <div className="relative group">
              <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-all" size={20} />
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="رقم الهاتف المحول منه"
                className="w-full pr-14 pl-6 py-5 bg-white border border-gray-100 rounded-[28px] text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all shadow-sm placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase px-2 tracking-widest">صورة التحويل</h2>
            
            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-48 bg-white border-2 border-dashed border-gray-200 rounded-[40px] cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-[#1877F2] shadow-inner mb-4 transition-all">
                    <Upload size={28} />
                  </div>
                  <p className="text-sm font-black text-gray-500">رفع صورة الإيصال</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1">JPG, PNG (Max 5MB)</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            ) : (
              <div className="relative rounded-[40px] overflow-hidden border-2 border-[#1877F2] shadow-xl">
                <img src={preview} alt="Receipt Preview" className="w-full h-64 object-cover" />
                <button 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Security Info */}
        <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-[32px] text-blue-700 border border-blue-100">
          <ShieldCheck size={24} className="flex-shrink-0" />
          <p className="text-xs font-bold leading-relaxed">
            تتم مراجعة طلبات الشحن يدوياً من قبل فريق كفراوي لضمان الأمان. تستغرق العملية عادة من ١٥ إلى ٣٠ دقيقة.
          </p>
        </div>
      </main>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-100 shadow-[0_-15px_50px_rgba(0,0,0,0.08)] z-30">
        <button 
          onClick={handleSubmit}
          disabled={!amount || !phone || !file || isSubmitting}
          className="w-full py-5 bg-[#1877F2] text-white rounded-[28px] font-black text-xl shadow-2xl shadow-blue-100 flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>إرسال الطلب</span>
              <ChevronLeft size={24} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
