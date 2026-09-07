import { useState, useEffect, useRef, useCallback } from 'react';
import {
  LayoutDashboard, MessageCircle, User, Mail, ShieldCheck, Clock, Send, CheckCheck, ArrowLeft, Headphones, Hourglass,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { logActivity, trackSessionStart, trackSessionEnd } from '@/lib/activity';
import { formatDateTime } from '@/lib/validation';
import type { SupportMessage } from '@/lib/types';

interface UserPanelProps {
  onNavigate: (page: string) => void;
}

export function UserPanel({ onNavigate }: UserPanelProps) {
  const { user, profile, signOut } = useAuth();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as SupportMessage[]);
  }, [user]);

  useEffect(() => {
    logActivity('page_view', 'panel');
    loadMessages();
    trackSessionStart().then(setSessionId);

    return () => {
      if (sessionId) trackSessionEnd(sessionId);
    };
  }, [loadMessages]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('support_messages_user')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `user_id=eq.${user.id}` },
        () => loadMessages(),
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    setSending(true);
    const content = input.trim();
    setInput('');

    const { error } = await supabase.from('support_messages').insert({
      user_id: user.id,
      content,
      sender: 'user',
    });

    if (error) {
      setInput(content);
    } else {
      logActivity('chat_message', 'panel');
      loadMessages();
    }
    setSending(false);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-sm font-medium text-white/40 hover:text-orange-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.full_name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white truncate">{profile.full_name || 'Kullanıcı'}</h3>
                  <p className="text-sm text-white/40 truncate">{profile.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <User className="w-5 h-5 text-white/30" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/30">Ad Soyad</div>
                    <div className="text-sm font-medium text-white truncate">{profile.full_name || 'Belirtilmemiş'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Mail className="w-5 h-5 text-white/30" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/30">E-posta</div>
                    <div className="text-sm font-medium text-white truncate">{profile.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <ShieldCheck className={`w-5 h-5 ${profile.email_verified ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <div className="flex-1">
                    <div className="text-xs text-white/30">E-posta Durumu</div>
                    <div className={`text-sm font-medium ${profile.email_verified ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {profile.email_verified ? 'Doğrulandı' : 'Doğrulanmadı'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Clock className="w-5 h-5 text-white/30" />
                  <div className="flex-1">
                    <div className="text-xs text-white/30">Kayıt Tarihi</div>
                    <div className="text-sm font-medium text-white">{formatDateTime(profile.created_at)}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={signOut}
                className="w-full mt-6 py-3 text-sm font-medium text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-all"
              >
                Çıkış Yap
              </button>
            </div>
          </div>

          {/* Live Support Chat */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl flex flex-col h-[600px]">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Canlı Destek</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-white/40">Çevrimiçi</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <MessageCircle className="w-8 h-8 text-white/20" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Sohbeti Başlatın</h4>
                    <p className="text-sm text-white/40 max-w-xs">
                      Sorularınız için destek ekibimize mesaj gönderin. En kısa sürede yanıt alacaksınız.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-br-sm'
                            : 'bg-white/5 text-white rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'user' ? 'text-white/60' : 'text-white/30'}`}>
                          <span className="text-[10px]">
                            {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.sender === 'user' && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="px-6 py-4 border-t border-white/5 flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30"
                  maxLength={1000}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
