import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  MapPin, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Phone, 
  ChevronLeft,
  Navigation,
  ShieldCheck,
  ShoppingBag,
  MoreVertical
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function MarketplaceOrderTrackingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(2); // Shipped

  const steps = [
    { id: 0, label: "تم تأكيد الطلب", icon: CheckCircle2, time: "10:30 ص" },
    { id: 1, label: "قيد التجهيز", icon: Package, time: "11:15 ص" },
    { id: 2, label: "تم الشحن", icon: Truck, time: "12:00 م" },
    { id: 3, label: "في الطريق إليك", icon: Navigation, time: "قريباً" },
    { id: 4, label: "تم التوصيل", icon: ShoppingBag, time: "متوقع 12:45 م" },
  ];

  return (
    <div className="h-screen w-full bg-indigo-50 relative overflow-hidden flex flex-col">
      {/* Immersive Map Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-40 mix-blend-multiply"
          style={{ backgroundImage: `url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i15!2i19293!3i12345!2m3!1e0!2sm!3i420120488!3m8!2sar!3seg!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425')` }}
        />
        {/* Map Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-transparent to-indigo-50/80" />
      </div>

      {/* Header Overlay */}
      <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-10">
        <button 
          onClick={() => navigate("/marketplace")}
          className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-700 active:scale-90 transition-all border border-white/50"
        >
          <ArrowRight size={24} />
        </button>
        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-black text-gray-900">تتبع الطلب {id}</span>
        </div>
        <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-700 active:scale-90 transition-all border border-white/50">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Map Pins (Visual only) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* User Pin */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1/4 left-1/3"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl border-4 border-white">
              <MapPin size={24} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-600 rotate-45" />
          </div>
        </motion.div>

        {/* Truck Pin */}
        <motion.div 
          animate={{ 
            x: [0, 100, 50, 0], 
            y: [0, 50, 100, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2"
        >
          <div className="relative">
            <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl border-4 border-white">
              <Truck size={32} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-600 rotate-45" />
            
            {/* Truck Pulse */}
            <motion.div 
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-emerald-400 rounded-3xl -z-10"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Sheet */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] p-8 z-20 max-h-[85vh] overflow-y-auto no-scrollbar"
      >
        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />
        
        <div className="space-y-10">
          {/* ETA Card */}
          <div className="bg-indigo-600 rounded-[40px] p-8 text-white flex items-center justify-between shadow-2xl shadow-indigo-100">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">الوقت المتوقع للوصول</p>
              <h3 className="text-3xl font-black">12:45 م</h3>
              <p className="text-xs font-bold opacity-80">المندوب على بعد 2.5 كم منك</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30">
              <Clock size={32} />
            </div>
          </div>

          {/* Status Steps */}
          <div className="space-y-6 px-4">
            <h3 className="text-lg font-black text-gray-900">حالة الطلب</h3>
            <div className="relative space-y-8">
              {/* Vertical Line */}
              <div className="absolute top-0 bottom-0 right-6 w-1 bg-gray-50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  className="w-full bg-indigo-600"
                />
              </div>

              {steps.map((step) => (
                <div key={step.id} className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                      step.id <= currentStep ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-300 border border-gray-100"
                    }`}>
                      <step.icon size={24} />
                    </div>
                    <div>
                      <h4 className={`font-black text-sm ${step.id <= currentStep ? "text-gray-900" : "text-gray-300"}`}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400">{step.time}</p>
                    </div>
                  </div>
                  {step.id === currentStep && (
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Courier Info */}
          <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <img src="https://picsum.photos/seed/courier/100/100" className="w-full h-full object-cover" alt="Courier" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h4 className="font-black text-gray-900">أحمد الكفراوي</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <span>مندوب معتمد • 4.9 تقييم</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-gray-100 active:scale-90 transition-all">
                <MessageSquare size={22} />
              </button>
              <button className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100 active:scale-90 transition-all">
                <Phone size={22} />
              </button>
            </div>
          </div>

          {/* Support Button */}
          <button className="w-full py-5 bg-gray-900 text-white rounded-[32px] font-black text-lg shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
            <MessageSquare size={24} />
            <span>تواصل مع الدعم الفني</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
