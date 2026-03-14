import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Plus, 
  Send, 
  History, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  ChevronLeft,
  MoreVertical,
  CreditCard,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { walletService } from "@/src/modules/wallet/walletService";
import { toast } from "sonner";

export default function WalletPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [balanceRes, txRes] = await Promise.all([
          walletService.getBalance(),
          walletService.getTransactions()
        ]);
        
        if (balanceRes.balance !== undefined) setBalance(balanceRes.balance);
        if (txRes.data) setTransactions(txRes.data);
      } catch (error) {
        toast.error('حدث خطأ أثناء تحميل بيانات المحفظة');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-28">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] transition-all"
          >
            <ArrowRight size={20} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">المحفظة</h1>
        </div>
        <button className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700">
          <MoreVertical size={20} />
        </button>
      </header>

      <main className="p-4 space-y-8">
        {/* Balance Card */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1877F2] to-blue-700 rounded-[40px] p-8 text-white shadow-2xl shadow-blue-200">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 opacity-80">
              <Wallet size={20} />
              <span className="text-xs font-black uppercase tracking-widest">رصيدك الحالي</span>
            </div>
            <div className="flex items-end gap-2">
              {loading ? (
                <Loader2 className="animate-spin" size={40} />
              ) : (
                <>
                  <span className="text-5xl font-black tracking-tight">{balance.toLocaleString()}</span>
                  <span className="text-lg font-bold mb-2">ج.م</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase px-2 tracking-widest">العمليات السريعة</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: "topup", name: "شحن", icon: Plus, color: "bg-blue-50 text-[#1877F2]", path: "/wallet/topup" },
              { id: "transfer", name: "تحويل", icon: Send, color: "bg-emerald-50 text-emerald-600", path: "/wallet/transfer" },
              { id: "history", name: "السجل", icon: History, color: "bg-purple-50 text-purple-600", path: "/wallet/history" },
            ].map((action) => (
              <button 
                key={action.id} 
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-[32px] shadow-sm border border-gray-100 hover:border-blue-200 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${action.color}`}>
                  <action.icon size={24} />
                </div>
                <span className="text-xs font-black text-gray-700">{action.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">آخر العمليات</h2>
            <button 
              onClick={() => navigate("/wallet/history")}
              className="text-xs font-black text-[#1877F2]"
            >
              عرض الكل
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-center text-gray-500 font-bold">لا توجد عمليات سابقة</p>
            ) : (
              transactions.map((tx) => (
                <motion.div 
                  key={tx.id}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      tx.amount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    }`}>
                      {tx.amount > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#050505]">{tx.description || 'عملية مالية'}</h4>
                      <p className="text-[10px] font-bold text-gray-400">{new Date(tx.created_at).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${
                      tx.amount > 0 ? "text-emerald-600" : "text-[#050505]"
                    }`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount} ج.م
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase px-2 tracking-widest">البطاقات المربوطة</h2>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-[#1877F2] transition-all">
                <CreditCard size={28} />
              </div>
              <div>
                <p className="font-black text-[#050505]">فيزا كارد</p>
                <p className="text-xs text-gray-400 font-bold mt-1">**** **** **** 4242</p>
              </div>
            </div>
            <ChevronLeft size={20} className="text-gray-300 group-hover:text-[#1877F2] transition-all" />
          </div>
        </section>
      </main>
    </div>
  );
}
