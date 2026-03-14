import { useState, useEffect } from 'react';
import { BookOpen, Clock, Loader2 } from 'lucide-react';
import { religiousService, ReligiousContent } from '@/src/modules/religious/religiousService';

export default function ReligiousModule() {
  const [content, setContent] = useState<ReligiousContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    religiousService.getDailyContent().then(({ data }) => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 bg-white rounded-2xl flex justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-5 text-white shadow-lg border border-emerald-800">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={20} className="text-yellow-300" />
        <h2 className="font-bold text-lg">منارة كفراوي</h2>
      </div>
      
      {content ? (
        <div className="mb-6">
          <p className="text-sm italic leading-relaxed text-emerald-50">"{content.content}"</p>
          <p className="text-[10px] text-emerald-300 mt-2 font-medium">— {content.source}</p>
        </div>
      ) : (
        <p className="text-xs text-emerald-200 mb-6">لا يوجد محتوى متاح اليوم.</p>
      )}

      <div className="flex items-center gap-2 text-emerald-100 mb-3">
        <Clock size={16} />
        <span className="text-xs font-bold">مواقيت الصلاة</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { name: 'الفجر', time: '4:30' },
          { name: 'الظهر', time: '12:00' },
          { name: 'العصر', time: '3:30' }
        ].map((prayer) => (
          <div key={prayer.name} className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
            <p className="text-[9px] text-emerald-200">{prayer.name}</p>
            <p className="text-xs font-bold">{prayer.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
