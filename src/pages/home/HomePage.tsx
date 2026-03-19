import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Bell, 
  MessageCircle, 
  User, 
  Settings,
  ShoppingBag, 
  Briefcase, 
  Users, 
  Wrench, 
  Home, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  Star,
  Zap,
  Tag,
  Clock,
  MapPin,
  Stethoscope,
  Truck,
  Wallet
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/src/utils/cn";
import { useJobs } from "@/src/context/JobsContext";
import { useApp } from "@/src/context/AppContext";
import { useAuth } from "@/src/context/AuthContext";
import { authService } from "@/src/modules/auth/authService";
import { supabase } from "@/src/lib/supabase";
import { useCommunity } from "@/src/context/CommunityContext";
import CommunityPostCard from "@/src/components/community/PostCard";
import CreatePost from "@/src/components/community/CreatePost";

// --- Mock Data ---

const STORIES = [
  { id: 1, user: "أحمد محمد", avatar: "https://picsum.photos/seed/user1/100/100", viewed: false },
  { id: 2, user: "سارة علي", avatar: "https://picsum.photos/seed/user2/100/100", viewed: false },
  { id: 3, user: "محمود حسن", avatar: "https://picsum.photos/seed/user3/100/100", viewed: true },
  { id: 4, user: "ليلى خالد", avatar: "https://picsum.photos/seed/user4/100/100", viewed: false },
  { id: 5, user: "عمر فاروق", avatar: "https://picsum.photos/seed/user5/100/100", viewed: true },
  { id: 6, user: "نورا يوسف", avatar: "https://picsum.photos/seed/user6/100/100", viewed: false },
];

const PROMO_BANNERS = [
  { id: 1, title: "خصم ٥٠٪ على الإلكترونيات", subtitle: "لفترة محدودة فقط!", color: "bg-blue-600", image: "https://picsum.photos/seed/promo1/600/300" },
  { id: 2, title: "وظائف جديدة في كفراوي", subtitle: "قدم الآن وابدأ مسيرتك", color: "bg-emerald-600", image: "https://picsum.photos/seed/promo2/600/300" },
  { id: 3, title: "خدمات صيانة منزلية فورية", subtitle: "أفضل الفنيين في خدمتك", color: "bg-orange-600", image: "https://picsum.photos/seed/promo3/600/300" },
];

const QUICK_ACTIONS = [
  { id: "delivery", name: "دليفري", icon: Truck, color: "bg-blue-50 text-[#1877F2]", path: "/delivery" },
  { id: "wallet", name: "المحفظة", icon: Wallet, color: "bg-blue-50 text-[#1877F2]", path: "/wallet" },
  { id: "market", name: "السوق", icon: ShoppingBag, color: "bg-blue-50 text-blue-600", path: "/marketplace" },
  { id: "jobs", name: "وظائف", icon: Briefcase, color: "bg-emerald-50 text-emerald-600", path: "/jobs" },
  { id: "medical", name: "طبي", icon: Stethoscope, color: "bg-red-50 text-red-600", path: "/medical" },
  { id: "services", name: "فنيين", icon: Wrench, color: "bg-orange-50 text-orange-600", path: "/services" },
  { id: "community", name: "مجتمع", icon: Users, color: "bg-purple-50 text-purple-600", path: "/community" },
];

const FEED_POSTS = [
  {
    id: 1,
    type: "community",
    user: { name: "محمد إبراهيم", avatar: "https://picsum.photos/seed/user7/100/100" },
    content: "هل جرب أحدكم خدمة الصيانة الجديدة في كفراوي؟ الفني وصل في الموعد وكان محترفاً جداً! 👍",
    image: "https://picsum.photos/seed/post1/600/400",
    likes: 124,
    comments: 18,
    time: "منذ ساعتين",
  },
  {
    id: 2,
    type: "marketplace",
    title: "سماعات بلوتوث لاسلكية",
    price: "٤٥٠ ج.م",
    oldPrice: "٦٠٠ ج.م",
    image: "https://picsum.photos/seed/prod1/400/400",
    rating: 4.8,
    reviews: 56,
    discount: "٢٥٪",
  },
  {
    id: 3,
    type: "job",
    title: "محاسب مالي",
    company: "شركة النيل للتجارة",
    location: "كفر الشيخ، وسط المدينة",
    salary: "٧٠٠٠ - ٩٠٠٠ ج.م",
    image: "https://picsum.photos/seed/job1/200/200",
    tags: ["دوام كامل", "خبرة سنتين"],
  },
  {
    id: 4,
    type: "service",
    name: "م. أحمد علي",
    specialty: "فني تكييف وتبريد",
    rating: 4.9,
    reviews: 128,
    avatar: "https://picsum.photos/seed/tech1/100/100",
    status: "متاح الآن",
  }
];

// --- Components ---

const Header = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
          K
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-black text-[#050505] leading-tight">كفراوي</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Super App</p>
        </div>
      </div>

      <div className="flex-1 mx-4 max-w-md relative group">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1877F2] transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="ابحث عن أي شيء..." 
          className="w-full pr-10 pl-4 py-2.5 bg-gray-100 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#1877F2] outline-none transition-all placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <button className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                ٣
              </span>
            </button>
            <Link to="/settings" className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
              <Settings size={22} />
            </Link>
            <Link to="/profile" className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm hover:border-[#1877F2] transition-all">
              <img src={profile?.avatar_url || "https://picsum.photos/seed/me/100/100"} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
              دخول
            </Link>
            <Link to="/register" className="px-4 py-2 bg-[#1877F2] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
              تسجيل
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

const Stories = () => (
  <section className="py-6 overflow-x-auto no-scrollbar flex gap-4 px-4">
    <div className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
      <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-[#1877F2] border-2 border-dashed border-gray-200 group-hover:border-[#1877F2] transition-all">
        <Plus size={24} />
      </div>
      <span className="text-[10px] font-black text-gray-500">قصتك</span>
    </div>
    {STORIES.map((story) => (
      <motion.div 
        key={story.id} 
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
      >
        <div className={cn(
          "w-16 h-16 rounded-3xl p-1 transition-all",
          story.viewed ? "bg-gray-200" : "bg-gradient-to-tr from-blue-600 to-cyan-400"
        )}>
          <div className="w-full h-full rounded-[22px] overflow-hidden border-2 border-white">
            <img src={story.avatar} className="w-full h-full object-cover" alt={story.user} referrerPolicy="no-referrer" />
          </div>
        </div>
        <span className="text-[10px] font-black text-[#050505] truncate w-16 text-center">{story.user}</span>
      </motion.div>
    ))}
  </section>
);

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <section className="px-4 py-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-6 min-w-max px-2">
        {QUICK_ACTIONS.map((action) => (
          <button 
            key={action.id} 
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all group-hover:scale-110 group-hover:shadow-md",
              action.color
            )}>
              <action.icon size={24} />
            </div>
            <span className="text-[10px] font-black text-gray-600">{action.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

const PromoCarousel = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="px-4 py-6">
      <div className="relative h-44 rounded-[32px] overflow-hidden shadow-xl shadow-blue-100/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={cn("absolute inset-0 flex items-center p-8", PROMO_BANNERS[active].color)}
          >
            <div className="relative z-10 flex-1 space-y-2">
              <h3 className="text-2xl font-black text-white leading-tight">{PROMO_BANNERS[active].title}</h3>
              <p className="text-sm font-bold text-white/80">{PROMO_BANNERS[active].subtitle}</p>
              <button className="mt-4 px-6 py-2.5 bg-white text-[#050505] rounded-xl font-black text-xs shadow-lg active:scale-95 transition-all">
                اكتشف الآن
              </button>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 skew-x-12 translate-x-1/4 bg-white/20" />
            <img 
              src={PROMO_BANNERS[active].image} 
              className="absolute right-0 top-0 h-full w-1/2 object-cover mix-blend-overlay" 
              alt="" 
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {PROMO_BANNERS.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                active === i ? "w-6 bg-white" : "w-1.5 bg-white/50"
              )} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedJobsSection = () => {
  const { jobs } = useJobs();
  const navigate = useNavigate();
  const featured = jobs.filter(j => j.isFeatured);

  if (featured.length === 0) return null;

  return (
    <section className="py-6 space-y-4">
      <div className="flex items-center justify-between px-6">
        <h2 className="text-xl font-black text-[#050505]">وظائف مميزة لك</h2>
        <button onClick={() => navigate("/jobs")} className="text-xs font-black text-[#1877F2] flex items-center gap-1">
          عرض الكل <ChevronRight size={14} />
        </button>
      </div>
      <div className="overflow-x-auto no-scrollbar flex gap-4 px-6 pb-4">
        {featured.map((job) => (
          <motion.div
            key={job.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/jobs/details/${job.id}`)}
            className="min-w-[260px] bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-4 group cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center">
                <img src={job.companyLogo} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
              </div>
              <span className="px-3 py-1 bg-blue-50 text-[#1877F2] rounded-full text-[10px] font-black">جديد</span>
            </div>
            <div>
              <h3 className="text-sm font-black text-[#050505] group-hover:text-[#1877F2] transition-colors line-clamp-1">{job.title}</h3>
              <p className="text-[10px] font-bold text-gray-400">{job.company}</p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-black text-emerald-600">{job.salary}</span>
              <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                <MapPin size={12} />
                <span>{job.location.split("،")[0]}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const MockPostCard = ({ post }: any) => (
  <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden mb-6">
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
          <img src={post.user.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h4 className="text-sm font-black text-[#050505]">{post.user.name}</h4>
          <p className="text-[10px] font-bold text-gray-400">{post.time}</p>
        </div>
      </div>
      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-all">
        <MoreHorizontal size={20} />
      </button>
    </div>
    <div className="px-4 pb-3">
      <p className="text-sm font-bold text-gray-700 leading-relaxed">{post.content}</p>
    </div>
    {post.image && (
      <div className="relative h-64 bg-gray-100">
        <img src={post.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
      </div>
    )}
    <div className="p-4 flex items-center justify-between border-t border-gray-50">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-all group">
          <div className="p-2 rounded-lg group-hover:bg-red-50 transition-all">
            <Heart size={20} />
          </div>
          <span className="text-xs font-black">{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-all group">
          <div className="p-2 rounded-lg group-hover:bg-blue-50 transition-all">
            <MessageCircle size={20} />
          </div>
          <span className="text-xs font-black">{post.comments}</span>
        </button>
      </div>
      <button className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-500 transition-all group">
        <div className="p-2 rounded-lg group-hover:bg-emerald-50 transition-all">
          <Share2 size={20} />
        </div>
        <span className="text-xs font-black">مشاركة</span>
      </button>
    </div>
  </div>
);

const ProductCard = ({ product }: any) => (
  <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden mb-6 p-4 group cursor-pointer">
    <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-50 mb-4">
      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" referrerPolicy="no-referrer" />
      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
        {product.discount} خصم
      </div>
      <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-[#050505] shadow-lg hover:bg-[#1877F2] hover:text-white transition-all">
        <Plus size={20} />
      </button>
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">إلكترونيات</span>
        <div className="flex items-center gap-1 text-amber-400">
          <Star size={12} fill="currentColor" />
          <span className="text-[10px] font-black text-[#050505]">{product.rating}</span>
        </div>
      </div>
      <h4 className="text-sm font-black text-[#050505] truncate">{product.title}</h4>
      <div className="flex items-center gap-2">
        <span className="text-lg font-black text-[#1877F2]">{product.price}</span>
        <span className="text-xs font-bold text-gray-400 line-through">{product.oldPrice}</span>
      </div>
    </div>
  </div>
);

const JobCard = ({ job }: any) => (
  <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 p-6 mb-6 group cursor-pointer hover:shadow-md transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <img src={job.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h4 className="text-base font-black text-[#050505] group-hover:text-[#1877F2] transition-colors">{job.title}</h4>
          <p className="text-xs font-bold text-gray-400">{job.company}</p>
        </div>
      </div>
      <button className="p-2 text-gray-300 hover:text-red-500 transition-all">
        <Heart size={20} />
      </button>
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      {job.tags.map((tag: string, i: number) => (
        <span key={i} className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded-lg">
          {tag}
        </span>
      ))}
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="flex items-center gap-1.5 text-gray-400">
        <MapPin size={14} />
        <span className="text-[10px] font-bold">{job.location}</span>
      </div>
      <span className="text-sm font-black text-emerald-600">{job.salary}</span>
    </div>
  </div>
);

const ServiceCard = ({ service }: any) => (
  <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 p-6 mb-6 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
          <img src={service.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
      </div>
      <div>
        <h4 className="text-sm font-black text-[#050505]">{service.name}</h4>
        <p className="text-[10px] font-bold text-gray-400">{service.specialty}</p>
        <div className="flex items-center gap-1 text-amber-400 mt-1">
          <Star size={10} fill="currentColor" />
          <span className="text-[10px] font-black text-[#050505]">{service.rating}</span>
          <span className="text-[10px] font-bold text-gray-400">({service.reviews})</span>
        </div>
      </div>
    </div>
    <button className="px-5 py-2.5 bg-blue-50 text-[#1877F2] rounded-xl font-black text-xs hover:bg-[#1877F2] hover:text-white transition-all">
      طلب خدمة
    </button>
  </div>
);

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "الرئيسية", path: "/" },
    { icon: Users, label: "المجتمع", path: "/community" },
    { icon: ShoppingBag, label: "السوق", path: "/marketplace" },
    { icon: Briefcase, label: "الوظائف", path: "/jobs" },
    { icon: User, label: "حسابي", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex items-center justify-between z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {navItems.map((item, i) => {
        const isActive = location.pathname === item.path;
        return (
          <button 
            key={i} 
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive ? "text-[#1877F2] scale-110" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-black">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const KafrawiGoSection = () => {
  const navigate = useNavigate();
  return (
    <section className="px-4 py-6">
      <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 overflow-hidden relative group cursor-pointer" onClick={() => navigate("/delivery")}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1877F2] to-cyan-400" />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2] shadow-inner">
              <Truck size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#050505]">كفراوي جو</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">أسرع دليفري في العبور</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#1877F2] bg-blue-50 px-3 py-1.5 rounded-full">
            <span className="text-[10px] font-black">اطلب الآن</span>
            <ChevronLeft size={14} />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "مطاعم", icon: "🍔", color: "bg-orange-50" },
            { name: "سوبر ماركت", icon: "🛒", color: "bg-emerald-50" },
            { name: "صيدلية", icon: "💊", color: "bg-red-50" }
          ].map((item, i) => (
            <div key={i} className={cn("p-4 rounded-3xl flex flex-col items-center gap-2 transition-all hover:scale-105", item.color)}>
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-black text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const { posts } = useCommunity();

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-28">
      <Header />
      
      <main className="max-w-xl mx-auto">
        <Stories />
        <QuickActions />
        <KafrawiGoSection />
        <PromoCarousel />
        
        {/* New Jobs Section */}
        <FeaturedJobsSection />

        {/* Create Post Section */}
        <section className="px-4 mb-6">
          <CreatePost />
        </section>

        {/* Dynamic Feed */}
        <section className="px-4 space-y-2">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-black text-[#050505]">اكتشف كفراوي</h2>
            <Link to="/community" className="flex items-center gap-1 text-[#1877F2] cursor-pointer hover:underline">
              <span className="text-xs font-black">عرض الكل</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="space-y-6">
            {posts && posts.length > 0 && posts.slice(0, 5).map((post) => (
              <CommunityPostCard key={post.id} post={post} />
            ))}
            {FEED_POSTS.map((post) => {
              if (post.type === 'community') return <MockPostCard key={post.id} post={post} />;
              if (post.type === 'marketplace') return <ProductCard key={post.id} product={post} />;
              if (post.type === 'job') return <JobCard key={post.id} job={post} />;
              if (post.type === 'service') return <ServiceCard key={post.id} service={post} />;
              return null;
            })}
          </div>
        </section>

        {/* Recommendations / Trending */}
        <section className="px-4 py-6">
          <div className="bg-gradient-to-br from-[#1877F2] to-blue-700 p-8 rounded-[48px] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">توصيات مخصصة</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">بناءً على اهتماماتك</h3>
                <p className="text-sm font-bold text-white/70 leading-relaxed">لقد وجدنا ٥ وظائف جديدة و٣ عروض في السوق قد تعجبك!</p>
              </div>
              <button onClick={() => navigate("/jobs")} className="w-full py-4 bg-white text-[#1877F2] rounded-[24px] font-black text-sm shadow-xl active:scale-95 transition-all">
                عرض التوصيات
              </button>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
