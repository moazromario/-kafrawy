import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, Navigation, Loader2, CheckCircle, 
  Car, Bike, Package, Star, Phone, MessageCircle, 
  Share2, ShieldAlert, Clock, ArrowRight, Search,
  Map as MapIcon, AlertTriangle, ThumbsUp
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type RideState = 'idle' | 'selecting' | 'confirming' | 'searching' | 'assigned' | 'in_progress' | 'completed' | 'rating';
type VehicleType = 'tuktuk' | 'car' | 'delivery';

export default function TransportPage() {
  const { user } = useAuth();
  const [rideState, setRideState] = useState<RideState>('idle');
  const [pickup, setPickup] = useState("موقعي الحالي (الحي الثالث)");
  const [dropoff, setDropoff] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>('tuktuk');
  const [estimatedPrice, setEstimatedPrice] = useState(15);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1);
  const [eta, setEta] = useState(3);
  const [rideDuration, setRideDuration] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const frequentPlaces = [
    { name: "سنتر الكفراوي", icon: MapPin },
    { name: "مستشفى العبور", icon: MapPin },
    { name: "نادي العبور", icon: MapPin },
  ];

  const vehicles = [
    { id: 'tuktuk', name: 'توكتوك', icon: Bike, basePrice: 15 },
    { id: 'car', name: 'سيارة', icon: Car, basePrice: 30 },
    { id: 'delivery', name: 'دليفري', icon: Package, basePrice: 20 },
  ];

  useEffect(() => {
    // Fetch smart estimate when confirming
    if (rideState === 'confirming') {
      const fetchEstimate = async () => {
        try {
          const res = await fetch("/api/rides/estimate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              pickup_lat: 30.1, 
              pickup_lng: 31.2, 
              type: vehicleType 
            })
          });
          if (res.ok) {
            const data = await res.json();
            setEstimatedPrice(data.price);
            setSurgeMultiplier(data.surge_multiplier);
            setEta(data.eta_minutes);
          }
        } catch (e) {
          console.error("Failed to fetch estimate");
        }
      };
      fetchEstimate();
    }
  }, [rideState, vehicleType]);

  useEffect(() => {
    if (rideState === 'in_progress') {
      timerRef.current = setInterval(() => {
        setRideDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [rideState]);

  const handleDestinationSelect = (place: string) => {
    setDropoff(place);
    setRideState('confirming');
  };

  const handleRequestRide = async () => {
    setRideState('searching');
    
    // Simulate finding a driver
    setTimeout(() => {
      setRideState('assigned');
      // Simulate driver arriving
      setTimeout(() => {
        setRideState('in_progress');
        // Simulate ride completion
        setTimeout(() => {
          setRideState('completed');
        }, 10000); // 10 seconds ride for demo
      }, 5000);
    }, 3000);
  };

  const handleCancelRide = async () => {
    try {
      const res = await fetch("/api/rides/demo-ride-123/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id || "guest" })
      });
      const data = await res.json();
      if (data.banned) {
        toast.error("تم حظر حسابك مؤقتاً بسبب كثرة الإلغاءات.");
      } else {
        toast.success("تم إلغاء الطلب.");
      }
      setRideState('confirming');
    } catch (e) {
      toast.error("حدث خطأ في إلغاء الطلب");
    }
  };

  const handleSOS = async () => {
    try {
      await fetch("/api/rides/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ride_id: "demo-ride-123", user_id: user?.id || "guest", location: "الحي الثالث" }),
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
        body: JSON.stringify({ ride_id: "demo-ride-123", caller_id: user?.id, receiver_id: "driver-123" }),
      });
      const data = await res.json();
      toast.success(`جاري الاتصال عبر رقم آمن: ${data.masked_number}`, { duration: 4000 });
    } catch (e) {
      toast.error("حدث خطأ في الاتصال");
    }
  };

  const handleRatingSubmit = async () => {
    try {
      await fetch("/api/rides/demo-ride-123/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback: comment }),
      });
      toast.success("تم حفظ التقييم، شكراً لك!");
      setRideState('idle');
      setPickup("موقعي الحالي (الحي الثالث)");
      setDropoff("");
      setRating(0);
      setComment("");
    } catch (e) {
      toast.error("فشل إرسال التقييم");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const mockDriver = {
    name: "أحمد محمود",
    photo: "https://picsum.photos/seed/driver1/100/100",
    rating: 4.8,
    vehicleNo: "أ ب ج 123",
    vehicleModel: "توكتوك 2023",
    eta: "3 دقائق"
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden flex flex-col">
      {/* Map Background (Simulated) */}
      <div className="absolute inset-0 z-0 bg-[#e5e3df]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        {/* Animated Map Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md">
          {rideState !== 'idle' && rideState !== 'selecting' && (
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="absolute top-1/3 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-600 rounded-full border-2 border-white shadow-lg z-10"
             >
               <div className="absolute -inset-4 bg-emerald-500/20 rounded-full animate-ping"></div>
             </motion.div>
          )}
          {(rideState === 'assigned' || rideState === 'in_progress') && (
            <motion.div 
              initial={{ x: -100, y: 100 }}
              animate={rideState === 'in_progress' ? { x: 0, y: -50 } : { x: -20, y: 20 }}
              transition={{ duration: rideState === 'in_progress' ? 10 : 2, ease: "linear" }}
              className="absolute top-1/3 left-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center z-20"
            >
              <Car size={16} className="text-emerald-600" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Top Bar */}
      <div className="relative z-10 pt-4 px-4 flex items-center justify-between">
        <Link to="/" className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50">
          <ArrowRight size={20} />
        </Link>
        <div className="bg-white px-4 py-2 rounded-full shadow-md font-bold text-emerald-800">
          كفراوي جو
        </div>
        <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700">
          <ShieldAlert size={20} className="text-red-500" />
        </div>
      </div>

      {/* Bottom Sheet UI */}
      <div className="relative z-10 mt-auto w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          
          {/* State: Idle / Selecting Destination */}
          {(rideState === 'idle' || rideState === 'selecting') && (
            <motion.div 
              key="idle"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">إلى أين؟</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <MapPin size={16} />
                  </div>
                  <input 
                    type="text" 
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900"
                    placeholder="موقع الانطلاق"
                  />
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-emerald-200 ring-1 ring-emerald-500/20">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    <Search size={16} />
                  </div>
                  <input 
                    type="text" 
                    value={dropoff}
                    onChange={(e) => {
                      setDropoff(e.target.value);
                      if (e.target.value.length > 2) setRideState('selecting');
                    }}
                    onFocus={() => setRideState('selecting')}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-900"
                    placeholder="ابحث عن الوجهة..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">أماكن مقترحة</h3>
                {frequentPlaces.map((place, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleDestinationSelect(place.name)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-right"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <place.icon size={18} />
                    </div>
                    <div className="flex-1 border-b border-gray-100 pb-3">
                      <p className="font-bold text-gray-900 text-sm">{place.name}</p>
                      <p className="text-xs text-gray-500">العبور، كفراوي</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* State: Confirming Ride */}
          {rideState === 'confirming' && (
            <motion.div 
              key="confirming"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">اختر المركبة</h2>
                <button onClick={() => setRideState('idle')} className="text-sm text-emerald-600 font-bold">تعديل الوجهة</button>
              </div>

              <div className="space-y-3 mb-6">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVehicleType(v.id as VehicleType)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      vehicleType === v.id 
                        ? 'border-emerald-600 bg-emerald-50' 
                        : 'border-gray-100 bg-white hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        vehicleType === v.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <v.icon size={24} />
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{v.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {eta} د للوصول
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg text-emerald-700">{v.basePrice * surgeMultiplier} ج.م</p>
                    </div>
                  </button>
                ))}
              </div>

              {surgeMultiplier > 1 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">أوقات الذروة (Surge Pricing)</p>
                    <p className="text-xs text-amber-700">الأسعار مرتفعة حالياً بسبب زيادة الطلب في منطقتك.</p>
                  </div>
                </div>
              )}

              <button 
                onClick={handleRequestRide}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/30"
              >
                تأكيد الطلب ({estimatedPrice} ج.م)
              </button>
            </motion.div>
          )}

          {/* State: Searching */}
          {rideState === 'searching' && (
            <motion.div 
              key="searching"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-8 text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
                  <Search size={32} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">جاري البحث عن كابتن...</h2>
              <p className="text-gray-500 text-sm mb-8">يرجى الانتظار، نقوم بالبحث عن أقرب مركبة لك</p>
              
              <button 
                onClick={handleCancelRide}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                إلغاء الطلب
              </button>
            </motion.div>
          )}

          {/* State: Driver Assigned */}
          {rideState === 'assigned' && (
            <motion.div 
              key="assigned"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">الكابتن في الطريق إليك</h2>
                <p className="text-emerald-600 font-bold mt-1">يصل خلال {mockDriver.eta}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={mockDriver.photo} alt={mockDriver.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div>
                      <p className="font-bold text-gray-900">{mockDriver.name}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span>{mockDriver.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm mb-1">
                      <p className="font-bold text-gray-900 text-sm">{mockDriver.vehicleNo}</p>
                    </div>
                    <p className="text-xs text-gray-500">{mockDriver.vehicleModel}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleCall} className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-200 transition-all">
                    <Phone size={18} /> اتصال
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-200 transition-all">
                    <MessageCircle size={18} /> رسالة
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                  <Share2 size={18} /> مشاركة الرحلة
                </button>
                <button onClick={handleSOS} className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all">
                  <ShieldAlert size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* State: In Progress */}
          {rideState === 'in_progress' && (
            <motion.div 
              key="in_progress"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    الرحلة جارية
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">متجه إلى {dropoff}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 mb-1">وقت الرحلة</p>
                  <p className="font-mono font-bold text-xl text-gray-900">{formatTime(rideDuration)}</p>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 mb-6 flex items-center justify-between border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <MapIcon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-bold">التكلفة الحالية</p>
                    <p className="font-bold text-lg text-gray-900">~ {estimatedPrice} ج.م</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white text-emerald-600 rounded-xl text-sm font-bold shadow-sm">
                  تفاصيل
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={handleSOS} className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-100">
                  <AlertTriangle size={20} /> طوارئ (SOS)
                </button>
              </div>
            </motion.div>
          )}

          {/* State: Completed & Rating */}
          {(rideState === 'completed' || rideState === 'rating') && (
            <motion.div 
              key="completed"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">وصلت بالسلامة!</h2>
              <p className="text-gray-500 mb-6">تكلفة الرحلة: <span className="font-bold text-gray-900">{estimatedPrice} ج.م</span></p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <p className="font-bold text-gray-900 mb-4">كيف كانت رحلتك مع {mockDriver.name}؟</p>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star 
                        size={32} 
                        className={rating >= star ? "text-yellow-400 fill-current" : "text-gray-300"} 
                      />
                    </button>
                  ))}
                </div>
                
                {rating > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="أضف تعليقاً (اختياري)..."
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-20 mb-4"
                    ></textarea>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleRatingSubmit}
                  disabled={rating === 0}
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إرسال التقييم
                </button>
              </div>
              <button className="mt-4 text-sm text-gray-500 font-bold hover:text-gray-700">
                الإبلاغ عن مشكلة
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
