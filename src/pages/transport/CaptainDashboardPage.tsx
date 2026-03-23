import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Power, MapPin, Navigation, DollarSign, 
  TrendingUp, Award, Clock, Camera, FileText, 
  CheckCircle, Bell, ArrowRight, ShieldCheck,
  Wallet, Star, ChevronRight, Car, MessageCircle, Phone, AlertTriangle
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type CaptainState = 'unregistered' | 'registering' | 'pending_approval' | 'offline' | 'online' | 'receiving_request' | 'en_route_pickup' | 'in_progress';
type Tab = 'home' | 'earnings' | 'profile';

export default function CaptainDashboardPage() {
  const { user } = useAuth();
  const [captainState, setCaptainState] = useState<CaptainState>('unregistered');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  
  // Registration State
  const [regStep, setRegStep] = useState(1);
  const [otp, setOtp] = useState("");

  // Dashboard State
  const [stats, setStats] = useState({ dailyRides: 12, dailyEarnings: 350, weeklyEarnings: 2100, rating: 4.9 });
  
  // Request State
  const [countdown, setCountdown] = useState(10);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate receiving a request when online
  useEffect(() => {
    if (captainState === 'online') {
      const timeout = setTimeout(() => {
        setActiveRequest({
          id: "REQ-9823",
          pickup: "سنتر الكفراوي",
          dropoff: "الحي الثالث، المجاورة الثانية",
          price: 25,
          distance: "2.5 كم",
          eta: "5 دقائق"
        });
        setCaptainState('receiving_request');
        setCountdown(10);
      }, 5000); // Receive request after 5 seconds of being online
      return () => clearTimeout(timeout);
    }
  }, [captainState]);

  // 10-second countdown for incoming request
  useEffect(() => {
    if (captainState === 'receiving_request') {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setCaptainState('online'); // Missed request, go back online
            toast.error("تم تفويت الطلب");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [captainState]);

  const handleRegisterSubmit = () => {
    setCaptainState('pending_approval');
    toast.success("تم إرسال طلبك للإدارة بنجاح");
    // Simulate admin approval after 3 seconds for demo purposes
    setTimeout(() => {
      setCaptainState('offline');
      toast.success("تمت الموافقة على حسابك! يمكنك الآن بدء العمل.");
    }, 3000);
  };

  const handleAcceptRequest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCaptainState('en_route_pickup');
    toast.success("تم قبول الطلب، توجه إلى نقطة الالتقاط");
  };

  const handleRejectRequest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCaptainState('online');
    setActiveRequest(null);
  };

  const handleArrivedAtPickup = () => {
    setCaptainState('in_progress');
    toast.success("تم بدء الرحلة");
  };

  const handleEndRide = () => {
    setStats(prev => ({
      ...prev,
      dailyRides: prev.dailyRides + 1,
      dailyEarnings: prev.dailyEarnings + (activeRequest?.price || 0)
    }));
    setCaptainState('online');
    setActiveRequest(null);
    toast.success("تم إنهاء الرحلة بنجاح وإضافة الأرباح");
  };

  const handleSOS = async () => {
    try {
      await fetch("/api/rides/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ride_id: activeRequest?.id || "demo-ride-123", user_id: user?.id || "captain", location: "موقع الكابتن الحالي" }),
      });
      toast.error("تم إرسال إشارة طوارئ (SOS) للإدارة بنجاح. ابق في مكان آمن.", { duration: 5000 });
    } catch (e) {
      toast.error("حدث خطأ في إرسال إشارة الطوارئ");
    }
  };

  const handleCall = async () => {
    try {
      const res = await fetch("/api/rides/proxy-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ride_id: activeRequest?.id || "demo-ride-123", caller_id: user?.id, receiver_id: "customer-123" }),
      });
      const data = await res.json();
      toast.success(`جاري الاتصال بالعميل عبر رقم آمن: ${data.masked_number}`, { duration: 4000 });
    } catch (e) {
      toast.error("حدث خطأ في الاتصال");
    }
  };

  const renderRegistration = () => (
    <div className="p-6 max-w-md mx-auto bg-white min-h-screen">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">انضم لكباتن كفراوي</h1>
        <p className="text-gray-500 mt-2">سجل الآن وابدأ في تحقيق أرباحك</p>
      </div>

      {regStep === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer">
            <Camera className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="font-bold text-gray-700">صورة شخصية واضحة</p>
            <p className="text-xs text-gray-500">يجب أن تظهر ملامح الوجه بوضوح</p>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer">
            <FileText className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="font-bold text-gray-700">صورة رخصة القيادة</p>
            <p className="text-xs text-gray-500">سارية المفعول</p>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer">
            <Car className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="font-bold text-gray-700">استمارة المركبة</p>
            <p className="text-xs text-gray-500">توكتوك، سيارة، أو دراجة نارية</p>
          </div>
          <button 
            onClick={() => setRegStep(2)}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 mt-6"
          >
            التالي
          </button>
        </motion.div>
      )}

      {regStep === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
          <h3 className="font-bold text-lg">التحقق من رقم الهاتف</h3>
          <p className="text-gray-500 text-sm">أدخل الرمز المكون من 4 أرقام المرسل إلى هاتفك</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <input key={i} type="text" maxLength={1} className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" />
            ))}
          </div>
          <button 
            onClick={handleRegisterSubmit}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700"
          >
            تأكيد وإرسال الطلب
          </button>
        </motion.div>
      )}
    </div>
  );

  const renderPendingApproval = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6"
      >
        <Clock size={48} />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">جاري مراجعة طلبك</h2>
      <p className="text-gray-500 max-w-xs">
        يقوم فريق الإدارة بمراجعة مستنداتك حالياً. سنقوم بإشعارك فور الموافقة لتتمكن من بدء العمل.
      </p>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-600 text-white pt-12 pb-6 px-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">مرحباً، كابتن أحمد</h1>
            <p className="text-emerald-100 text-sm flex items-center gap-1 mt-1">
              <Star size={14} className="fill-current text-yellow-400" /> {stats.rating} تقييم ممتاز
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bell size={24} />
          </div>
        </div>

        {/* Online Toggle */}
        <div className="bg-white rounded-2xl p-2 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3 px-3">
            <div className={`w-3 h-3 rounded-full ${captainState === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="font-bold text-gray-800">{captainState === 'online' ? 'متاح للطلبات' : 'غير متاح'}</span>
          </div>
          <button 
            onClick={() => setCaptainState(captainState === 'online' ? 'offline' : 'online')}
            className={`w-14 h-8 rounded-full relative transition-colors ${captainState === 'online' ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <motion.div 
              animate={{ x: captainState === 'online' ? -24 : 0 }}
              className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <p className="text-gray-500 text-sm font-bold">طلبات اليوم</p>
          <p className="text-2xl font-black text-gray-900">{stats.dailyRides}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            <DollarSign size={20} />
          </div>
          <p className="text-gray-500 text-sm font-bold">أرباح اليوم</p>
          <p className="text-2xl font-black text-gray-900">{stats.dailyEarnings} <span className="text-sm">ج.م</span></p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6">
        <h3 className="font-bold text-gray-900 mb-4">نشاطك الأخير</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border-b border-gray-50 flex items-center justify-between last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500">
                  <CheckCircle size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">رحلة مكتملة</p>
                  <p className="text-xs text-gray-500">منذ {i * 2} ساعة</p>
                </div>
              </div>
              <p className="font-bold text-emerald-600">+25 ج.م</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-emerald-600 text-white pt-12 pb-8 px-6 rounded-b-3xl shadow-lg text-center">
        <p className="text-emerald-100 text-sm font-bold mb-2">الرصيد المتاح للسحب</p>
        <h1 className="text-5xl font-black mb-6">{stats.weeklyEarnings} <span className="text-xl">ج.م</span></h1>
        <button className="bg-white text-emerald-600 font-bold py-3 px-8 rounded-xl shadow-md hover:bg-gray-50 transition-colors">
          سحب الأرباح الآن
        </button>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">ملخص الأسبوع</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">العمولة: 10%</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">إجمالي الرحلات</span>
              <span className="font-bold text-gray-900">45 رحلة</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">إجمالي الدخل</span>
              <span className="font-bold text-gray-900">2330 ج.م</span>
            </div>
            <div className="flex justify-between text-sm text-red-500">
              <span>عمولة التطبيق</span>
              <span className="font-bold">-230 ج.م</span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between">
              <span className="font-bold text-gray-900">الصافي</span>
              <span className="font-bold text-emerald-600 text-lg">2100 ج.م</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-100 to-yellow-50 rounded-2xl p-5 border border-amber-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-200 text-amber-700 rounded-full flex items-center justify-center shrink-0">
            <Award size={24} />
          </div>
          <div>
            <h4 className="font-bold text-amber-900">مكافأة التميز!</h4>
            <p className="text-xs text-amber-700 mt-1">أكمل 10 رحلات إضافية اليوم واحصل على مكافأة 50 ج.م (بدون عمولة).</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveRide = () => (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden flex flex-col">
      {/* Simulated Map */}
      <div className="absolute inset-0 z-0 bg-[#e5e3df]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Route Line Simulation */}
        <svg className="absolute inset-0 w-full h-full z-10" style={{ pointerEvents: 'none' }}>
          <path d="M 100 200 Q 200 150 300 300 T 200 500" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="8 8" className="animate-pulse" />
        </svg>

        {/* Vehicle Marker */}
        <motion.div 
          animate={{ x: captainState === 'in_progress' ? 100 : 0, y: captainState === 'in_progress' ? 200 : 0 }}
          transition={{ duration: 10, ease: "linear" }}
          className="absolute top-1/2 left-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-20 border-2 border-emerald-500"
        >
          <Car size={20} className="text-emerald-600" />
        </motion.div>
      </div>

      {/* Top Bar */}
      <div className="relative z-10 pt-4 px-4">
        <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-gray-900">
              {captainState === 'en_route_pickup' ? 'متجه للعميل' : 'في الطريق للوجهة'}
            </span>
          </div>
          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-bold text-sm">
            {activeRequest?.eta}
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="relative z-10 mt-auto w-full max-w-md mx-auto">
        <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                <User size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900">عميل كفراوي</p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star size={12} className="text-yellow-500 fill-current" /> 4.9
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-100">
                <MessageCircle size={18} />
              </button>
              <button onClick={handleCall} className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-100">
                <Phone size={18} />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="mt-1"><MapPin size={16} className={captainState === 'en_route_pickup' ? "text-emerald-500" : "text-gray-400"} /></div>
              <div>
                <p className="text-xs text-gray-500">نقطة الالتقاط</p>
                <p className={`font-bold text-sm ${captainState === 'en_route_pickup' ? "text-gray-900" : "text-gray-500 line-through"}`}>{activeRequest?.pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1"><Navigation size={16} className={captainState === 'in_progress' ? "text-emerald-500" : "text-gray-400"} /></div>
              <div>
                <p className="text-xs text-gray-500">نقطة الوصول</p>
                <p className="font-bold text-sm text-gray-900">{activeRequest?.dropoff}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 px-2">
            <span className="text-gray-500 font-bold">الأجرة المتوقعة</span>
            <span className="text-2xl font-black text-emerald-600">{activeRequest?.price} ج.م</span>
          </div>

          <div className="flex gap-3 mb-4">
            <button onClick={handleSOS} className="flex-1 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-100">
              <AlertTriangle size={20} /> طوارئ (SOS)
            </button>
          </div>

          {captainState === 'en_route_pickup' ? (
            <button 
              onClick={handleArrivedAtPickup}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/30"
            >
              وصلت لنقطة الالتقاط
            </button>
          ) : (
            <button 
              onClick={handleEndRide}
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/30"
            >
              إنهاء الرحلة وتحصيل الأجرة
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Main Render Logic
  if (captainState === 'unregistered' || captainState === 'registering') {
    return renderRegistration();
  }

  if (captainState === 'pending_approval') {
    return renderPendingApproval();
  }

  if (captainState === 'en_route_pickup' || captainState === 'in_progress') {
    return renderActiveRide();
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Incoming Request Modal Overlay */}
      <AnimatePresence>
        {captainState === 'receiving_request' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="bg-emerald-600 p-6 text-center text-white relative overflow-hidden">
                {/* Circular Progress Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="10" 
                            strokeDasharray="283" strokeDashoffset={283 - (283 * countdown) / 10} 
                            className="transition-all duration-1000 linear" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl font-black">
                    {countdown}
                  </div>
                  <h2 className="text-xl font-bold">طلب جديد!</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">من</p>
                    <p className="font-bold text-gray-900">{activeRequest?.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Navigation className="text-emerald-500 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">إلى</p>
                    <p className="font-bold text-gray-900">{activeRequest?.dropoff}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">المسافة</p>
                    <p className="font-bold text-gray-900">{activeRequest?.distance}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">السعر</p>
                    <p className="font-black text-emerald-600 text-xl">{activeRequest?.price} ج.م</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleRejectRequest}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    رفض
                  </button>
                  <button 
                    onClick={handleAcceptRequest}
                    className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30"
                  >
                    قبول الطلب
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Tabs Content */}
      {activeTab === 'home' && renderDashboard()}
      {activeTab === 'earnings' && renderEarnings()}
      {activeTab === 'profile' && (
        <div className="p-6 text-center pt-20">
          <h2 className="text-xl font-bold text-gray-900">الملف الشخصي</h2>
          <p className="text-gray-500">قريباً...</p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-3 pb-safe z-40">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <Car size={24} />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button 
          onClick={() => setActiveTab('earnings')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'earnings' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <Wallet size={24} />
          <span className="text-[10px] font-bold">الأرباح</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'profile' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <FileText size={24} />
          <span className="text-[10px] font-bold">حسابي</span>
        </button>
      </div>
    </div>
  );
}

// Dummy User icon component since it wasn't imported from lucide-react in the main block
function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
