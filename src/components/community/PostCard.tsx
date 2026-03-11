import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MoreHorizontal, 
  Globe, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Heart, 
  Laugh, 
  Meh,
  X
} from "lucide-react";
import { Badge, TrustLevel } from "./Badge";
import { cn } from "@/src/utils/cn";

interface PostCardProps {
  index: number;
  user: {
    name: string;
    avatar: string;
    trustLevel: TrustLevel;
  };
  content: string;
  image?: string;
  time: string;
  key?: number | string;
}

export default function PostCard({ index, user, content, image, time }: PostCardProps) {
  const navigate = useNavigate();
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);

  const handlePostClick = () => {
    navigate(`/community/post/${index}`);
  };

  const reactions = [
    { icon: ThumbsUp, label: "إعجاب", color: "text-blue-500", key: "like" },
    { icon: Heart, label: "حب", color: "text-red-500", key: "love" },
    { icon: Laugh, label: "ضحك", color: "text-yellow-500", key: "haha" },
    { icon: Meh, label: "دهشة", color: "text-yellow-600", key: "wow" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handlePostClick}>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
            {user.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">{user.name}</h3>
              <Badge level={user.trustLevel} />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
              <span>{time}</span>
              <span>•</span>
              <Globe size={10} />
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3 cursor-pointer" onClick={handlePostClick}>
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>

      {image && (
        <div className="relative aspect-video bg-gray-100 cursor-pointer" onClick={handlePostClick}>
          <img 
            src={image} 
            alt="Post content" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white border border-white">
              <ThumbsUp size={8} fill="currentColor" />
            </div>
            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white border border-white">
              <Heart size={8} fill="currentColor" />
            </div>
          </div>
          <span className="text-[10px] text-gray-500">25 إعجاب</span>
        </div>
        <div className="flex gap-3 text-[10px] text-gray-500">
          <span>12 تعليق</span>
          <span>3 مشاركة</span>
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="px-2 py-1 flex items-center justify-around relative">
        <div 
          className="flex-1"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button 
            className={cn(
              "w-full flex items-center justify-center gap-2 p-2 rounded-xl transition-colors",
              reaction ? "text-blue-600" : "text-gray-500 hover:bg-gray-50"
            )}
            onClick={() => setReaction(reaction ? null : "like")}
          >
            <ThumbsUp size={20} fill={reaction ? "currentColor" : "none"} />
            <span className="text-xs font-bold">إعجاب</span>
          </button>

          {/* Floating Reactions */}
          {showReactions && (
            <div className="absolute bottom-full left-4 bg-white rounded-full shadow-xl border border-gray-100 p-1 flex gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {reactions.map((r) => (
                <button
                  key={r.key}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-transform hover:scale-125"
                  onClick={() => {
                    setReaction(r.key);
                    setShowReactions(false);
                  }}
                >
                  <r.icon size={24} className={r.color} fill="currentColor" />
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="flex-1 flex items-center justify-center gap-2 p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
          <MessageCircle size={20} />
          <span className="text-xs font-bold">تعليق</span>
        </button>

        <button className="flex-1 flex items-center justify-center gap-2 p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
          <Share2 size={20} />
          <span className="text-xs font-bold">مشاركة</span>
        </button>
      </div>
    </div>
  );
}
