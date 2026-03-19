import { useEffect, useState } from "react";
import { communityService, Post } from "@/src/modules/community/communityService";
import { toast } from "sonner";

/**
 * Custom hook to fetch the smart feed for a specific user.
 * This hook uses the smart_feed algorithm (The Real Brain 🔥)
 * to provide a ranked list of posts based on user interests and interactions.
 */
export function useFeed(userId: string | undefined) {
  const [feed, setFeed] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: feedError } = await communityService.getSmartFeed(userId);
      
      if (feedError) {
        throw feedError;
      }
      
      setFeed(data || []);
    } catch (err: any) {
      console.error("Error loading smart feed:", err);
      setError(err.message || "Failed to load feed");
      toast.error("حدث خطأ أثناء تحميل التغذية الذكية");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadFeed();
    }
  }, [userId]);

  return { 
    feed, 
    loading, 
    error, 
    refreshFeed: loadFeed 
  };
}
