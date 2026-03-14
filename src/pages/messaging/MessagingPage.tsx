import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messagingService } from '@/src/modules/messaging/messagingService';
import { useAuth } from '@/src/context/AuthContext';
import { ArrowRight, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MessagingPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;

    async function fetchMessages() {
      setLoading(true);
      const { data, error } = await messagingService.getMessages(conversationId!);
      if (data) setMessages(data);
      setLoading(false);
    }
    fetchMessages();

    const subscription = messagingService.subscribeToMessages(conversationId, (payload) => {
      setMessages(prev => [...prev, payload.new]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId) return;
    try {
      await messagingService.sendMessage(conversationId, newMessage);
      setNewMessage('');
    } catch (error) {
      toast.error('فشل إرسال الرسالة');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowRight /></button>
        <h1 className="font-bold">المحادثة</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`p-3 rounded-xl max-w-[80%] ${msg.sender_id === user?.id ? 'bg-blue-600 text-white ml-auto' : 'bg-white'}`}>
              {msg.content}
            </div>
          ))
        )}
      </div>
      <div className="p-4 bg-white border-t flex gap-2">
        <input 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-xl"
          placeholder="اكتب رسالة..."
        />
        <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-xl"><Send /></button>
      </div>
    </div>
  );
}
