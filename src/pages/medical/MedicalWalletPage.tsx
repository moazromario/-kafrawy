import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Wallet, 
  Plus, 
  CreditCard, 
  ChevronLeft, 
  ArrowLeft,
  Zap,
  Clock,
  CheckCircle2,
  Stethoscope,
  Hospital,
  Building2,
  Filter,
  Search,
  History,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMedical } from "@/src/context/MedicalContext";

export default function MedicalWalletPage() {
  const navigate = useNavigate();
  const { walletBalance } = useMedical();

  const transactions = [
    { id: 1, title: "كشف د. أحمد سمير", date: "١٠ مارس ٢٠٢٦", amount: -420, type: "payment", icon: Stethoscope, color: "bg-red-50 text-red-500" },
    { id: 2, title: "شحن محفظة", date: "٠٥ مارس ٢٠٢٦", amount: 1000, type: "topup", icon: Wallet, color: "bg-emerald-50 text-emerald-600" },
    { id: 3, title: "استرداد مبلغ كشف", date: "٠١ مارس ٢٠٢٦", amount: 250, type: "refund", icon: Zap, color: "bg-blue-50 text-[#1E90FF]" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30 space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-[#1E90FF] transition-all border border-gray-100"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-xl font-black text-[#050505]">المحفظة والدفع</h1>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Wallet Balance Card */}
        <section className="bg-[#1E90FF] p-10 rounded-[48px] text-white shadow-2xl shadow-blue-100 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">الرصيد الحالي</span>
              </div>
              <button className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all">
                <Plus size={24} />
              </button>
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black">{walletBalance} ج.م</h2>
              <p className="text-xs font-bold text-white/70 tracking-widest uppercase">متاح للاستخدام في جميع الخدمات</p>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-white text-[#1E90FF] rounded-[24px] font-black text-sm shadow-xl active:scale-95 transition-all">
                شحن المحفظة
              </button>
              <button className="flex-1 py-4 bg-white/20 text-white rounded-[24px] font-black text-sm active:scale-95 transition-all border border-white/30">
                سحب الرصيد
              </button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4">
          <button className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 bg-blue-50 text-[#1E90FF] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-all">
              <CreditCard size={24} />
            </div>
            <span className="text-xs font-black text-[#050505]">بطاقات الدفع</span>
          </button>
          <button className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-all">
              <History size={24} />
            </div>
            <span className="text-xs font-black text-[#050505]">كشف حساب</span>
          </button>
        </section>

        {/* Recent Transactions */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-[#050505]">آخر العمليات</h3>
            <button className="text-xs font-black text-[#1E90FF]">عرض الكل</button>
          </div>
          <div className="space-y-4">
            {transactions.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${t.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-all`}>
                    <t.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#050505]">{t.title}</h4>
                    <p className="text-[10px] font-bold text-gray-400">{t.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-black ${t.amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {t.amount > 0 ? "+" : ""}{t.amount} ج.م
                  </span>
                  <div className="flex items-center gap-1">
                    {t.amount > 0 ? <TrendingUp size={10} className="text-emerald-600" /> : <TrendingDown size={10} className="text-red-500" />}
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">مكتمل</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
