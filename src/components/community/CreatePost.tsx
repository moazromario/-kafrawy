import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Image, Video, MapPin, Smile, Loader2, X, ShoppingBag, Wrench, HelpCircle, Megaphone, Tag } from "lucide-react";
import { useCommunity } from "@/src/context/CommunityContext";
import { useAuth } from "@/src/context/AuthContext";
import { communityService } from "@/src/modules/community/communityService";
import { cn } from "@/src/utils/cn";

export default function CreatePost() {
  const { addPost } = useCommunity();
  const { user, profile } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | undefined>(undefined);
  const [mediaType, setMediaType] = useState<'image' | 'video' | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [feeling, setFeeling] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string>('trending');

  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showFeelingInput, setShowFeelingInput] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'trending', label: 'عام', icon: Smile },
    { id: 'neighborhood', label: 'الحي', icon: MapPin },
    { id: 'market', label: 'السوق', icon: ShoppingBag },
    { id: 'services', label: 'الخدمات', icon: Wrench },
    { id: 'qa', label: 'الأسئلة', icon: HelpCircle },
    { id: 'ads', label: 'الإعلانات', icon: Megaphone },
  ];

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        <p className="text-gray-500 font-bold mb-4">سجل الدخول لتشارك جيرانك ما يدور في ذهنك</p>
        <Link 
          to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} 
          className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors"
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  const handlePost = async () => {
    if (!content.trim() && !mediaFile) return;
    setLoading(true);
    try {
      let finalMediaUrl: string | undefined = undefined;

      if (mediaFile && mediaType) {
        const { url, error } = await communityService.uploadMedia(mediaFile, mediaType);
        if (error) {
          throw error instanceof Error ? error : new Error('فشل رفع الوسائط. تأكد من إعداد التخزين في قاعدة البيانات.');
        }
        if (url) {
          finalMediaUrl = url;
        }
      }

      const newPost = await addPost(content, finalMediaUrl, category, location);
      
      if (user && newPost?.id) {
        communityService.trackEvent(user.id, newPost.id, 'create');
      }
      
      setContent("");
      setMediaFile(null);
      if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
      setMediaPreviewUrl(undefined);
      setMediaType(undefined);
      setLocation(undefined);
      setCategory('trending');
      setShowLocationInput(false);
      setShowCategorySelect(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء النشر');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaType(type);
      
      // Create a local preview URL
      const previewUrl = URL.createObjectURL(file);
      setMediaPreviewUrl(previewUrl);
    }
  };

  const clearMedia = () => {
    setMediaFile(null);
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    setMediaPreviewUrl(undefined);
    setMediaType(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      {/* Top Section: Profile & Input */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold overflow-hidden border border-emerald-50 shrink-0">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'
          )}
        </div>
        <div className="flex-1 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`بم تفكر يا ${profile?.full_name?.split(' ')[0] || 'مستخدم'}؟`}
            className="w-full min-h-[40px] max-h-[200px] px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-2xl text-right text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
          />
          
          {/* Media Preview */}
          {mediaPreviewUrl && (
            <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex justify-center items-center">
              <button 
                onClick={clearMedia}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
              >
                <X size={16} />
              </button>
              {mediaType === 'image' ? (
                <img src={mediaPreviewUrl} alt="Upload preview" className="max-w-full max-h-[300px] object-contain" />
              ) : (
                <video src={mediaPreviewUrl} controls className="max-w-full max-h-[300px] object-contain" />
              )}
            </div>
          )}

          {/* Location Input */}
          {showLocationInput && (
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
              <MapPin size={16} className="text-orange-500" />
              <input 
                type="text" 
                value={location || ''}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="أين أنت؟"
                className="flex-1 bg-transparent border-none text-sm focus:outline-none"
                autoFocus
              />
              <button onClick={() => { setShowLocationInput(false); setLocation(undefined); }} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Feeling Input */}
          {showFeelingInput && (
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
              <Smile size={16} className="text-yellow-500" />
              <input 
                type="text" 
                value={feeling || ''}
                onChange={(e) => setFeeling(e.target.value)}
                placeholder="بم تشعر؟ (مثال: سعيد، متحمس...)"
                className="flex-1 bg-transparent border-none text-sm focus:outline-none"
                autoFocus
              />
              <button onClick={() => { setShowFeelingInput(false); setFeeling(undefined); }} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Category Selection */}
          {showCategorySelect && (
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                    category === cat.id 
                      ? "bg-emerald-600 text-white shadow-sm" 
                      : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
                  )}
                >
                  <cat.icon size={12} />
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*,video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(e, file.type.startsWith('video/') ? 'video' : 'image');
          }
        }}
      />

      {/* Middle Section: Add Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 pt-3 border-t border-gray-50">
        <PostOption 
          icon={Image} 
          label="صورة" 
          color="text-emerald-500" 
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.accept = "image/*";
              fileInputRef.current.click();
            }
          }} 
        />
        <PostOption 
          icon={Video} 
          label="فيديو" 
          color="text-red-500" 
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.accept = "video/*";
              fileInputRef.current.click();
            }
          }} 
        />
        <PostOption 
          icon={MapPin} 
          label="موقع" 
          color="text-orange-500" 
          onClick={() => setShowLocationInput(true)} 
        />
        <PostOption 
          icon={Smile} 
          label="شعور" 
          color="text-yellow-500" 
          onClick={() => setShowFeelingInput(true)} 
        />
        <PostOption 
          icon={Tag} 
          label="تصنيف" 
          color="text-indigo-500" 
          onClick={() => setShowCategorySelect(!showCategorySelect)} 
        />
      </div>

      {/* Bottom Section: Post Button */}
      <button 
        onClick={handlePost}
        disabled={loading || (!content.trim() && !mediaFile)}
        className="w-full mt-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        نشر
      </button>
    </div>
  );
}

function PostOption({ icon: Icon, label, color, onClick }: { icon: any, label: string, color: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
    >
      <Icon size={18} className={color} />
      <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700">{label}</span>
    </button>
  );
}
