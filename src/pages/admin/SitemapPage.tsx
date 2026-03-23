import React from "react";
import { motion } from "motion/react";
import { 
  LayoutGrid, 
  ShoppingBag, 
  Users, 
  Briefcase, 
  Stethoscope, 
  Wrench, 
  Truck, 
  Wallet, 
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Map as MapIcon,
  Layers,
  Smartphone,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/src/utils/cn";

const modules = [
  {
    title: "النظام الأساسي والحساب",
    icon: ShieldCheck,
    color: "text-blue-600",
    bg: "bg-blue-50",
    routes: [
      { path: "/login", label: "تسجيل الدخول", desc: "واجهة دخول المستخدمين" },
      { path: "/register", label: "إنشاء حساب", desc: "تسجيل مستخدم جديد" },
      { path: "/profile", label: "الملف الشخصي", desc: "عرض بيانات المستخدم ومنشوراته" },
      { path: "/profile/edit", label: "تعديل الملف", desc: "تحديث البيانات الشخصية" },
      { path: "/settings", label: "الإعدادات", desc: "التحكم في الخصوصية والتنبيهات" },
    ]
  },
  {
    title: "المجتمع والتواصل",
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    routes: [
      { path: "/community", label: "الخلاصة الاجتماعية", desc: "التفاعل مع منشورات الجيران" },
      { path: "/community/explore", label: "استكشاف", desc: "اكتشاف محتوى جديد ورائج" },
      { path: "/community/friends", label: "الأصدقاء", desc: "إدارة قائمة الأصدقاء" },
      { path: "/community/groups", label: "المجموعات", desc: "تصفح مجموعات الاهتمامات" },
      { path: "/community/messages", label: "الرسائل", desc: "المحادثات المباشرة" },
    ]
  },
  {
    title: "السوق التجاري",
    icon: ShoppingBag,
    color: "text-amber-600",
    bg: "bg-amber-50",
    routes: [
      { path: "/marketplace", label: "رئيسية المتجر", desc: "العروض والمنتجات المميزة" },
      { path: "/marketplace/products", label: "تصفح المنتجات", desc: "قائمة المنتجات مع الفلترة" },
      { path: "/marketplace/cart", label: "سلة التسوق", desc: "إدارة المشتريات" },
      { path: "/marketplace/order-history", label: "سجل الطلبات", desc: "متابعة المشتريات السابقة" },
      { path: "/marketplace/search", label: "البحث", desc: "البحث المتقدم عن منتج" },
    ]
  },
  {
    title: "التوظيف والعمل",
    icon: Briefcase,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    routes: [
      { path: "/jobs", label: "رئيسية الوظائف", desc: "أحدث الفرص والتدريبات" },
      { path: "/jobs/list", label: "البحث عن وظيفة", desc: "فلترة الوظائف المتاحة" },
      { path: "/jobs/dashboard", label: "لوحة المتقدم", desc: "متابعة طلبات التوظيف" },
      { path: "/jobs/cv-builder", label: "بناء CV", desc: "أداة إنشاء السيرة الذاتية" },
      { path: "/jobs/employer", label: "لوحة صاحب العمل", desc: "إدارة الوظائف والمتقدمين" },
    ]
  },
  {
    title: "الخدمات الطبية",
    icon: Stethoscope,
    color: "text-red-600",
    bg: "bg-red-50",
    routes: [
      { path: "/medical", label: "الرئيسية الطبية", desc: "دليل الخدمات الصحية" },
      { path: "/medical/search", label: "البحث عن طبيب", desc: "حجز المواعيد والعيادات" },
      { path: "/medical/appointments", label: "المواعيد", desc: "إدارة الحجوزات الطبية" },
      { path: "/medical/records", label: "السجلات", desc: "حفظ الروشتات والتحاليل" },
      { path: "/medical/emergency", label: "الطوارئ", desc: "أرقام وخدمات عاجلة" },
    ]
  },
  {
    title: "الفنيين والخدمات",
    icon: Wrench,
    color: "text-orange-600",
    bg: "bg-orange-50",
    routes: [
      { path: "/services", label: "رئيسية الخدمات", desc: "طلب فنيين للمنازل" },
      { path: "/services/list", label: "قائمة المحترفين", desc: "تصفح الفنيين المتاحين" },
      { path: "/services/history", label: "سجل الخدمات", desc: "الطلبات السابقة والتقييمات" },
      { path: "/services/dashboard", label: "لوحة الفني", desc: "إدارة طلبات العمل" },
    ]
  },
  {
    title: "التوصيل والطلبات",
    icon: Truck,
    color: "text-rose-600",
    bg: "bg-rose-50",
    routes: [
      { path: "/delivery", label: "رئيسية التوصيل", desc: "المطاعم والمحلات المحلية" },
      { path: "/delivery/stores", label: "قائمة المطاعم", desc: "تصفح قوائم الطعام" },
      { path: "/delivery/history", label: "سجل الطلبات", desc: "تاريخ طلبات التوصيل" },
      { path: "/delivery/driver", label: "لوحة السائق", desc: "إدارة عمليات التوصيل" },
    ]
  },
  {
    title: "المحفظة والمالية",
    icon: Wallet,
    color: "text-violet-600",
    bg: "bg-violet-50",
    routes: [
      { path: "/wallet", label: "المحفظة", desc: "الرصيد والعمليات المالية" },
      { path: "/wallet/topup", label: "شحن الرصيد", desc: "إضافة أموال للمحفظة" },
      { path: "/wallet/admin", label: "إدارة المالية", desc: "مراقبة العمليات الكلية" },
    ]
  }
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-12 pb-8 px-6 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <MapIcon size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#050505]">خريطة التطبيق (Sitemap)</h1>
              <p className="text-sm font-bold text-gray-400">هيكلية الفرونت اند والمسارات الكاملة</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-600">
              <Layers size={16} />
              <span>{modules.length} وحدات</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-600">
              <Smartphone size={16} />
              <span>{modules.reduce((acc, m) => acc + m.routes.length, 0)} شاشات</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col"
            >
              <div className={cn("p-6 flex items-center gap-4 border-b border-gray-50", module.bg)}>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm", module.color)}>
                  <module.icon size={24} />
                </div>
                <h2 className="text-lg font-black text-[#050505]">{module.title}</h2>
              </div>
              
              <div className="p-4 flex-1 space-y-2">
                {module.routes.map((route, rIdx) => (
                  <Link
                    key={rIdx}
                    to={route.path}
                    className="group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-800 group-hover:text-emerald-600 transition-colors">
                        {route.label}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">
                        {route.path}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50/50 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest">
                  Kafrawy Super App • v1.0
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-8 bg-emerald-900 rounded-[40px] text-white overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-right">
              <h3 className="text-xl font-black">جاهز للتوسع؟</h3>
              <p className="text-emerald-100/70 text-sm max-w-md font-bold leading-relaxed">
                تم تصميم هيكلية الفرونت اند لتكون قابلة للتوسع بسهولة. كل وحدة تعمل بشكل مستقل مع سياق (Context) خاص بها لضمان أفضل أداء.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold">نظام نشط</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold">متوافق مع الويب والجوال</span>
                </div>
              </div>
            </div>
            
            <Link 
              to="/"
              className="px-8 py-4 bg-white text-emerald-900 rounded-2xl font-black text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-black/20"
            >
              <span>العودة للرئيسية</span>
              <ExternalLink size={18} />
            </Link>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/50 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-800/50 rounded-full -ml-32 -mb-32 blur-3xl" />
        </div>
      </main>
    </div>
  );
}
