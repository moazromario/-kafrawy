import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Shield, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  MoreVertical,
  ArrowLeft,
  LayoutDashboard,
  ShoppingBag,
  Truck,
  MessageSquare,
  Wallet
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminService } from "./adminService";
import { cn } from "@/src/utils/cn";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [pendingTopups, setPendingTopups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, topupsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getPendingTopups()
      ]);
      setStats(statsRes);
      setUsers(usersRes.data || []);
      setPendingTopups(topupsRes.data || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTopup = async (topup: any) => {
    try {
      await adminService.approveTopup(topup.id, topup.user_id, topup.amount);
      setPendingTopups(prev => prev.filter(t => t.id !== topup.id));
      // Refresh stats
      const newStats = await adminService.getStats();
      setStats(newStats);
    } catch (error) {
      alert("فشل في قبول الطلب");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center text-white">
              <Shield size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter">كفراوي أدمن</span>
          </div>

          <nav className="space-y-2">
            <NavButton 
              active={activeTab === "overview"} 
              onClick={() => setActiveTab("overview")}
              icon={LayoutDashboard} 
              label="نظرة عامة" 
            />
            <NavButton 
              active={activeTab === "users"} 
              onClick={() => setActiveTab("users")}
              icon={Users} 
              label="المستخدمين" 
            />
            <NavButton 
              active={activeTab === "wallet"} 
              onClick={() => setActiveTab("wallet")}
              icon={Wallet} 
              label="طلبات الشحن" 
              badge={pendingTopups.length > 0 ? pendingTopups.length : undefined}
            />
            <NavButton 
              active={activeTab === "content"} 
              onClick={() => setActiveTab("content")}
              icon={MessageSquare} 
              label="المحتوى" 
            />
          </nav>
        </div>

        <div className="mt-auto p-8">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-bold">العودة للتطبيق</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black mb-2">
              {activeTab === "overview" && "لوحة التحكم"}
              {activeTab === "users" && "إدارة المستخدمين"}
              {activeTab === "wallet" && "طلبات شحن المحفظة"}
              {activeTab === "content" && "مراجعة المحتوى"}
            </h1>
            <p className="text-gray-500 font-medium">مرحباً بك مجدداً في نظام إدارة كفراوي</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="بحث سريع..." 
                className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 w-64 font-medium"
              />
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" />
            </div>
          </div>
        </header>

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
              <StatCard icon={Users} label="المستخدمين" value={stats?.users || 0} color="text-blue-600" bg="bg-blue-50" />
              <StatCard icon={MessageSquare} label="المنشورات" value={stats?.posts || 0} color="text-emerald-600" bg="bg-emerald-50" />
              <StatCard icon={ShoppingBag} label="المنتجات" value={stats?.products || 0} color="text-orange-600" bg="bg-orange-50" />
              <StatCard icon={Truck} label="الطلبات" value={stats?.orders || 0} color="text-purple-600" bg="bg-purple-50" />
            </div>

            <div className="grid grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black">آخر المستخدمين</h2>
                  <button className="text-[#1877F2] font-bold text-sm">عرض الكل</button>
                </div>
                <div className="space-y-6">
                  {users.slice(0, 5).map((user, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={user.avatar_url || `https://picsum.photos/seed/${user.id}/100/100`} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <div>
                          <p className="font-bold">{user.full_name}</p>
                          <p className="text-xs text-gray-400">{user.role}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-[#1877F2] rounded-3xl p-8 text-white shadow-lg shadow-[#1877F2]/20">
                  <h3 className="text-lg font-black mb-2">تنبيهات النظام</h3>
                  <p className="text-white/80 text-sm mb-6">هناك {pendingTopups.length} طلبات شحن تنتظر المراجعة.</p>
                  <button 
                    onClick={() => setActiveTab("wallet")}
                    className="w-full py-3 bg-white text-[#1877F2] rounded-xl font-black text-sm hover:bg-gray-50 transition-colors"
                  >
                    مراجعة الطلبات
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-bottom border-gray-100">
                <tr>
                  <th className="px-8 py-4 font-black text-sm text-gray-500">المستخدم</th>
                  <th className="px-8 py-4 font-black text-sm text-gray-500">المبلغ</th>
                  <th className="px-8 py-4 font-black text-sm text-gray-500">التاريخ</th>
                  <th className="px-8 py-4 font-black text-sm text-gray-500">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pendingTopups.map((topup, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <img src={topup.profiles?.avatar_url} className="w-10 h-10 rounded-full" alt="" />
                        <span className="font-bold">{topup.profiles?.full_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-[#1877F2]">EGP {topup.amount}</td>
                    <td className="px-8 py-6 text-gray-400 text-sm">{new Date(topup.created_at).toLocaleDateString('ar-EG')}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleApproveTopup(topup)}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                          <XCircle size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingTopups.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">لا توجد طلبات معلقة حالياً</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

const NavButton = ({ active, icon: Icon, label, onClick, badge }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
      active ? "bg-[#1877F2] text-white shadow-lg shadow-[#1877F2]/20" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
    )}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span className="font-bold">{label}</span>
    </div>
    {badge && (
      <span className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-black",
        active ? "bg-white text-[#1877F2]" : "bg-red-500 text-white"
      )}>
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ icon: Icon, label, value, color, bg }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", bg, color)}>
      <Icon size={24} />
    </div>
    <p className="text-gray-400 text-sm font-bold mb-1">{label}</p>
    <p className="text-2xl font-black">{value}</p>
  </div>
);
