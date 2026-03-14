import { 
  Home, 
  Users, 
  LayoutGrid, 
  Bell, 
  MessageCircle, 
  Search, 
  Menu,
  LogOut
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "@/src/context/AppContext";
import { useAuth } from "@/src/context/AuthContext";
import { authService } from "@/src/modules/auth/authService";

export default function CommunityNavbar() {
  const navigate = useNavigate();
  const { notificationsCount } = useApp();
  const { user, profile, refreshProfile } = useAuth();

  const handleLogout = async () => {
    await authService.signOut();
    await refreshProfile();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-2 flex-1">
          <Link to="/" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            K
          </Link>
          <div className="relative hidden md:block max-w-[240px] w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث في كفراوي..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Center: Main Nav */}
        <div className="flex items-center justify-center flex-1 h-full">
          <div className="flex items-center h-full max-w-[600px] w-full justify-around">
            <NavIcon to="/community" icon={Home} label="الرئيسية" />
            <NavIcon to="/community/friends" icon={Users} label="الأصدقاء" />
            <NavIcon to="/community/groups" icon={LayoutGrid} label="المجموعات" />
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center justify-end gap-2 flex-1">
          {user && (
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-emerald-600 font-bold text-xs overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-sm font-bold text-gray-900">{profile?.full_name || user.email?.split('@')[0]}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <IconButton icon={Menu} className="lg:hidden" />
            <IconButton icon={MessageCircle} to="/community/messages" />
            <IconButton icon={Bell} to="/community/notifications" badge={notificationsCount} />
            {user ? (
              <>
                <Link to="/profile" className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                  <img src={profile?.avatar_url || "https://picsum.photos/seed/user1/100/100"} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition-colors">
                دخول
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavIcon({ to, icon: Icon, label }: { to: string, icon: any, label: string }) {
  return (
    <NavLink 
      to={to} 
      end
      className={({ isActive }) => `
        flex items-center justify-center w-full h-full border-b-4 transition-all
        ${isActive ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:bg-gray-50"}
      `}
      title={label}
    >
      {({ isActive }) => (
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      )}
    </NavLink>
  );
}

function IconButton({ icon: Icon, to, badge, className }: { icon: any, to?: string, badge?: number, className?: string }) {
  const content = (
    <div className={`relative p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors ${className}`}>
      <Icon size={20} />
      {badge ? (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
          {badge}
        </span>
      ) : null}
    </div>
  );

  if (to) return <Link to={to}>{content}</Link>;
  return <button>{content}</button>;
}
