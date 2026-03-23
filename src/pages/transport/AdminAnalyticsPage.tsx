import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BarChart3, Users, Star, AlertTriangle, TrendingUp, Activity, CheckCircle } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/transport/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">لوحة تحكم الإدارة</h1>
        <p className="text-emerald-100">تحليلات وتوصيات تشغيلية (Smart Logic)</p>
      </div>

      <div className="p-4 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
              <Activity size={20} />
            </div>
            <p className="text-sm text-gray-500 font-medium">إجمالي الطلبات</p>
            <p className="text-2xl font-bold text-gray-900">{data?.total_rides || 0}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
              <Users size={20} />
            </div>
            <p className="text-sm text-gray-500 font-medium">كباتن نشطين</p>
            <p className="text-2xl font-bold text-gray-900">{data?.active_captains || 0}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 col-span-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">متوسط تقييم الكباتن</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">{data?.average_captain_rating || "0.0"}</p>
                  <Star size={20} className="text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <BarChart3 size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Operational Suggestions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-600" />
            <h2 className="font-bold text-gray-900">توصيات تشغيلية ذكية</h2>
          </div>
          <div className="p-4 space-y-4">
            {data?.suggestions && data.suggestions.length > 0 ? (
              data.suggestions.map((suggestion: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-amber-900 leading-relaxed">{suggestion}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <p className="text-gray-500 font-medium">العمليات تسير بشكل ممتاز، لا توجد توصيات حالياً.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
