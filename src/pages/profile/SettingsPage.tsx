import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";
import { authService } from "@/src/modules/auth/authService";
import { toast } from "sonner";
import { cn } from "@/src/utils/cn";
import { 
  Settings, 
  Lock, 
  Bell, 
  Shield, 
  Eye, 
  LogOut, 
  ChevronLeft,
  User,
  Trash2,
  Moon,
  Globe,
  HelpCircle,
  Loader2,
  ArrowRight,
  X,
  AlertTriangle,
  Check
} from "lucide-react";

export default function SettingsPage() {
  const { user, profile, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ar');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      toast.success('تم تسجيل الخروج بنجاح');
      navigate("/login");
    } catch (error: any) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      // In a real app, we would call a delete account service
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('تم حذف الحساب بنجاح. نأسف لرحيلك.');
      await logout();
      navigate("/register");
    } catch (error) {
      toast.error('فشل حذف الحساب');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const settingsSections = [
    {
      title: "الحساب",
      items: [
        { id: 'profile', label: 'تعديل الملف الشخصي', icon: User, path: '/profile/edit' },
        { id: 'password', label: 'تغيير كلمة المرور', icon: Lock, path: '/reset-password' },
        { id: 'notifications', label: 'الإشعارات', icon: Bell, path: '#' },
      ]
    },
    {
      title: "الأمان والخصوصية",
      items: [
        { id: 'privacy', label: 'إعدادات الخصوصية', icon: Eye, path: '#' },
        { id: 'security', label: 'الأمان', icon: Shield, path: '#' },
      ]
    },
    {
      title: "التفضيلات",
      items: [
        { id: 'theme', label: 'المظهر (قريباً)', icon: Moon, path: '#' },
        { id: 'language', label: 'اللغة', icon: Globe, onClick: () => setShowLanguageModal(true) },
      ]
    },
    {
      title: "الدعم",
      items: [
        { id: 'help', label: 'مركز المساعدة', icon: HelpCircle, path: '#' },
        { id: 'delete', label: 'حذف الحساب', icon: Trash2, onClick: () => setShowDeleteModal(true), danger: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">الإعدادات</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-8 space-y-8">
        {/* User Info Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border-2 border-emerald-50">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-8 h-8 text-emerald-600" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900">{profile?.full_name || "مستخدم كفراوي"}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <Link 
            to="/profile/edit"
            className="p-2 bg-gray-50 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all"
          >
            تعديل
          </Link>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {section.items.map((item, itemIdx) => {
                const content = (
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${item.danger ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600'}`}>
                        <item.icon size={20} />
                      </div>
                      <span className={`text-sm font-bold ${item.danger ? 'text-red-500' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.id === 'language' && (
                        <span className="text-xs text-gray-400 font-bold">{selectedLanguage === 'ar' ? 'العربية' : 'English'}</span>
                      )}
                      <ChevronLeft size={18} className="text-gray-300" />
                    </div>
                  </div>
                );

                if (item.onClick) {
                  return (
                    <div key={item.id} onClick={item.onClick} className={itemIdx !== section.items.length - 1 ? 'border-b border-gray-50' : ''}>
                      {content}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    to={item.path || '#'}
                    className={itemIdx !== section.items.length - 1 ? 'border-b border-gray-50' : ''}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full py-4 bg-white text-red-500 rounded-2xl font-bold shadow-sm border border-red-100 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            <span>تسجيل الخروج</span>
          </button>
        </div>

        {/* App Version */}
        <div className="text-center pb-10">
          <p className="text-xs text-gray-400 font-bold">كفراوي - الإصدار 1.0.0</p>
          <p className="text-[10px] text-gray-300 mt-1">صنع بكل حب لخدمة أهالي كفراوي ❤️</p>
        </div>
      </div>

      {/* Language Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLanguageModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900">اختر اللغة</h3>
                  <button onClick={() => setShowLanguageModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'ar', label: 'العربية', native: 'Arabic' },
                    { id: 'en', label: 'English', native: 'الإنجليزية' },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setSelectedLanguage(lang.id);
                        setShowLanguageModal(false);
                        toast.success(`تم تغيير اللغة إلى ${lang.label}`);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                        selectedLanguage === lang.id 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                          : "bg-white border-gray-100 text-gray-700 hover:border-gray-200"
                      )}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-bold">{lang.label}</span>
                        <span className="text-[10px] opacity-60">{lang.native}</span>
                      </div>
                      {selectedLanguage === lang.id && <Check size={20} />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle size={40} className="text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">هل أنت متأكد؟</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    حذف الحساب سيؤدي إلى مسح جميع بياناتك ومنشوراتك بشكل نهائي. لا يمكن التراجع عن هذه الخطوة.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>نعم، احذف حسابي</span>}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    تراجع
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
