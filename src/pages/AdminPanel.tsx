import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Shield, Users, Clock, MessageCircle, Activity, TrendingUp, ArrowLeft,
  Search, Send, CheckCheck, UserCheck, Calendar, LogOut, UserPlus, Check, X, Hourglass,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { formatDuration, formatDateTime } from '@/lib/validation';
import type { Profile, SupportMessage, ActivityLog, UserSession } from '@/lib/types';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

type Tab = 'overview' | 'approvals' | 'users' | 'sessions' | 'activity' | 'chat';

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { profile, signOut, isAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<Profile[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<SupportMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [search, setSearch] = useState('');
  const [approving, setApproving] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0, verifiedUsers: 0, totalSessions: 0,
    avgSessionMin: 0, totalMessages: 0, todayRegistrations: 0, pendingApprovals: 0,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadUsers = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data as Profile[]);
  }, []);

  const loadSessions = useCallback(async () => {
    const { data } = await supabase.from('user_sessions').select('*').order('login_at', { ascending: false }).limit(200);
    if (data) setSessions(data as UserSession[]);
  }, []);

  const loadLogs = useCallback(async () => {
    const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(200);
    if (data) setLogs(data as ActivityLog[]);
  }, []);

  const loadMessages = useCallback(async () => {
    const { data } = await supabase.from('support_messages').select('*').order('created_at', { ascending: true });
    if (data) setMessages(data as SupportMessage[]);
  }, []);

  const loadChatMessages = useCallback(async (userId: string) => {
    const { data } = await supabase.from('support_messages').select('*').eq('user_id', userId).order('created_at', { ascending: true });
    if (data) setChatMessages(data as SupportMessage[]);
  }, []);

  const computeStats = useCallback(() => {
    const totalUsers = users.length;
    const verifiedUsers = users.filter((u) => u.email_verified).length;
    const completedSessions = sessions.filter((s) => s.duration_seconds != null);
    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const avgSession = completedSessions.length > 0 ? totalDuration / completedSessions.length : 0;
    const today = new Date().toDateString();
    const todayRegistrations = users.filter((u) => new Date(u.created_at).toDateString() === today).length;
    const pendingApprovals = users.filter((u) => u.approval_status === 'pending').length;
    setStats({
      totalUsers, verifiedUsers, totalSessions: sessions.length,
      avgSessionMin: Math.round(avgSession / 60), totalMessages: messages.length, todayRegistrations, pendingApprovals,
    });
  }, [users, sessions, messages]);

  useEffect(() => {
    loadUsers(); loadSessions(); loadLogs(); loadMessages();
  }, [loadUsers, loadSessions, loadLogs, loadMessages]);

  useEffect(() => { computeStats(); }, [computeStats]);

  useEffect(() => {
    const channel = supabase
      .channel('admin_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages' }, () => {
        loadMessages();
        if (selectedUser) loadChatMessages(selectedUser);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, () => loadUsers())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, () => loadLogs())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadMessages, loadChatMessages, loadUsers, loadLogs, selectedUser]);

  useEffect(() => { if (selectedUser) loadChatMessages(selectedUser); }, [selectedUser, loadChatMessages]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const handleApprove = async (userId: string, status: 'approved' | 'rejected') => {
    setApproving(userId);
    await supabase.rpc('approve_user', { p_user_id: userId, p_status: status });
    await loadUsers();
    setApproving(null);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedUser) return;
    const content = chatInput.trim();
    setChatInput('');
    await supabase.from('support_messages').insert({ user_id: selectedUser, content, sender: 'admin' });
    loadChatMessages(selectedUser);
    loadMessages();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] pt-20">
        <div className="text-center">
          <Shield className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Erişim Reddedildi</h2>
          <p className="text-white/40 mb-6">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <button onClick={() => onNavigate('home')} className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()),
  );
  const pendingUsers = users.filter((u) => u.approval_status === 'pending');
  const uniqueChatters = Array.from(new Set(messages.map((m) => m.user_id)));

  const tabs: { id: Tab; label: string; icon: typeof Users; badge?: number }[] = [
    { id: 'overview', label: 'Genel Bakış', icon: TrendingUp },
    { id: 'approvals', label: 'Onaylar', icon: UserPlus, badge: stats.pendingApprovals },
    { id: 'users', label: 'Kullanıcılar', icon: Users },
    { id: 'sessions', label: 'Oturumlar', icon: Clock },
    { id: 'activity', label: 'Aktivite', icon: Activity },
    { id: 'chat', label: 'Canlı Destek', icon: MessageCircle },
  ];

  const statCards = [
    { icon: Users, label: 'Toplam Kullanıcı', value: stats.totalUsers, color: 'from-blue-400 to-cyan-500' },
    { icon: UserCheck, label: 'Doğrulanmış', value: stats.verifiedUsers, color: 'from-emerald-400 to-teal-500' },
    { icon: Hourglass, label: 'Onay Bekleyen', value: stats.pendingApprovals, color: 'from-amber-400 to-orange-500' },
    { icon: Calendar, label: 'Bugün Kayıt', value: stats.todayRegistrations, color: 'from-orange-400 to-red-500' },
    { icon: Clock, label: 'Toplam Oturum', value: stats.totalSessions, color: 'from-violet-400 to-purple-500' },
    { icon: MessageCircle, label: 'Toplam Mesaj', value: stats.totalMessages, color: 'from-pink-400 to-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-sm font-medium text-white/40 hover:text-orange-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </button>
          <button onClick={signOut} className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300">
            <LogOut className="w-4 h-4" />
            Çıkış
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
            <p className="text-sm text-white/40">Hoş geldiniz, {profile?.full_name || profile?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 glass rounded-2xl p-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20' : 'text-white/50 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {t.badge != null && t.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t.id ? 'bg-white/20' : 'bg-orange-500/20 text-orange-400'}`}>
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {statCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className="glass rounded-2xl p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-extrabold text-white">{card.value}</div>
                    <div className="text-sm text-white/40 mt-1">{card.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Pending approvals alert */}
            {stats.pendingApprovals > 0 && (
              <div className="glass rounded-2xl p-5 mb-6 border border-orange-500/30 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Hourglass className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{stats.pendingApprovals} kayıt onayınızı bekliyor</h3>
                  <p className="text-sm text-white/40">Onaylamak veya reddetmek için Onaylar sekmesine geçin</p>
                </div>
                <button onClick={() => setTab('approvals')} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20">
                  İncele
                </button>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  Son Kayıt Olanlar
                </h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((u) => (
                    <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                        {(u.full_name || u.email)[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{u.full_name || u.email}</div>
                        <div className="text-xs text-white/30">{formatDateTime(u.created_at)}</div>
                      </div>
                      {u.approval_status === 'pending' ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">Bekliyor</span>
                      ) : u.approval_status === 'approved' ? (
                        <CheckCheck className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  ))}
                  {users.length === 0 && <p className="text-sm text-white/30 text-center py-4">Henüz kayıt yok</p>}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-400" />
                  Son Aktiviteler
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {logs.slice(0, 10).map((log) => {
                    const user = users.find((u) => u.id === log.user_id);
                    return (
                      <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-white/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white">{user?.full_name || user?.email || 'Bilinmeyen'}</div>
                          <div className="text-xs text-white/30">{log.action} {log.page ? `· ${log.page}` : ''}</div>
                        </div>
                        <div className="text-xs text-white/30">{new Date(log.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    );
                  })}
                  {logs.length === 0 && <p className="text-sm text-white/30 text-center py-4">Henüz aktivite yok</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approvals */}
        {tab === 'approvals' && (
          <div>
            {pendingUsers.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="inline-flex w-16 h-16 rounded-full bg-emerald-500/20 items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Onay Bekleyen Kayıt Yok</h3>
                <p className="text-white/40">Tüm kayıtlar işlenmiş durumda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((u) => (
                  <div key={u.id} className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {(u.full_name || u.email)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{u.full_name || 'İsimsiz'}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">Beklemede</span>
                      </div>
                      <p className="text-sm text-white/40 mt-0.5">{u.email}</p>
                      <p className="text-xs text-white/30 mt-1">Kayıt: {formatDateTime(u.created_at)}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleApprove(u.id, 'approved')}
                        disabled={approving === u.id}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all disabled:opacity-60"
                      >
                        <Check className="w-4 h-4" />
                        Onayla
                      </button>
                      <button
                        onClick={() => handleApprove(u.id, 'rejected')}
                        disabled={approving === u.id}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl transition-all disabled:opacity-60"
                      >
                        <X className="w-4 h-4" />
                        Reddet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Kullanıcı ara..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Kullanıcı</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/30 uppercase tracking-wider">E-posta</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Durum</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Onay</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Kayıt</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Son Görülme</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                            {(u.full_name || u.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{u.full_name || 'İsimsiz'}</div>
                            {u.role === 'admin' && <span className="text-xs text-orange-400 font-medium">Admin</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-white/60">{u.email}</td>
                      <td className="py-3 px-4">
                        {u.email_verified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                            <CheckCheck className="w-3 h-3" /> Doğrulandı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                            <Clock className="w-3 h-3" /> Beklemede
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {u.approval_status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                            <Check className="w-3 h-3" /> Onaylı
                          </span>
                        ) : u.approval_status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                            <Hourglass className="w-3 h-3" /> Beklemede
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                            <X className="w-3 h-3" /> Reddedildi
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-white/50">{formatDateTime(u.created_at)}</td>
                      <td className="py-3 px-4 text-sm text-white/50">{formatDateTime(u.last_seen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <p className="text-sm text-white/30 text-center py-8">Kullanıcı bulunamadı</p>}
            </div>
          </div>
        )}

        {/* Sessions */}
        {tab === 'sessions' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Kullanıcı Oturumları
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Kullanıcı</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Giriş</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Çıkış</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Süre</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => {
                    const user = users.find((u) => u.id === s.user_id);
                    return (
                      <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-white">{user?.full_name || user?.email || 'Bilinmeyen'}</td>
                        <td className="py-3 px-4 text-sm text-white/50">{formatDateTime(s.login_at)}</td>
                        <td className="py-3 px-4 text-sm text-white/50">{s.logout_at ? formatDateTime(s.logout_at) : 'Aktif'}</td>
                        <td className="py-3 px-4 text-sm text-white/50">{s.duration_seconds != null ? formatDuration(s.duration_seconds) : 'Devam ediyor'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {sessions.length === 0 && <p className="text-sm text-white/30 text-center py-8">Henüz oturum kaydı yok</p>}
            </div>
          </div>
        )}

        {/* Activity */}
        {tab === 'activity' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-400" />
              Kullanıcı Aktiviteleri
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {logs.map((log) => {
                const user = users.find((u) => u.id === log.user_id);
                return (
                  <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white/30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{user?.full_name || user?.email || 'Bilinmeyen'}</div>
                      <div className="text-xs text-white/30"><span className="font-medium">{log.action}</span>{log.page ? ` · ${log.page}` : ''}</div>
                    </div>
                    <div className="text-xs text-white/30 whitespace-nowrap">{formatDateTime(log.created_at)}</div>
                  </div>
                );
              })}
              {logs.length === 0 && <p className="text-sm text-white/30 text-center py-8">Henüz aktivite kaydı yok</p>}
            </div>
          </div>
        )}

        {/* Chat */}
        {tab === 'chat' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 glass rounded-2xl p-4 max-h-[600px] overflow-y-auto">
              <h3 className="font-bold text-white mb-4 px-2">Sohbetler</h3>
              <div className="space-y-2">
                {uniqueChatters.map((userId) => {
                  const user = users.find((u) => u.id === userId);
                  const userMsgs = messages.filter((m) => m.user_id === userId);
                  const lastMsg = userMsgs[userMsgs.length - 1];
                  const unread = userMsgs.filter((m) => m.sender === 'user' && !m.read).length;
                  return (
                    <button
                      key={userId}
                      onClick={() => {
                        setSelectedUser(userId);
                        supabase.from('support_messages').update({ read: true }).eq('user_id', userId).eq('sender', 'user').then(() => loadMessages());
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedUser === userId ? 'bg-orange-500/10 border border-orange-500/20' : 'hover:bg-white/5'}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(user?.full_name || user?.email || '?')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-medium text-white truncate">{user?.full_name || user?.email || 'Bilinmeyen'}</div>
                        <div className="text-xs text-white/30 truncate">{lastMsg?.content || 'Sohbet başlatıldı'}</div>
                      </div>
                      {unread > 0 && <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0">{unread}</span>}
                    </button>
                  );
                })}
                {uniqueChatters.length === 0 && <p className="text-sm text-white/30 text-center py-8">Henüz sohbet yok</p>}
              </div>
            </div>

            <div className="lg:col-span-2 glass rounded-2xl flex flex-col h-[600px]">
              {selectedUser ? (
                <>
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                      {(users.find((u) => u.id === selectedUser)?.full_name || users.find((u) => u.id === selectedUser)?.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{users.find((u) => u.id === selectedUser)?.full_name || users.find((u) => u.id === selectedUser)?.email}</h3>
                      <p className="text-xs text-white/30">{users.find((u) => u.id === selectedUser)?.email}</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${msg.sender === 'admin' ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-br-sm' : 'bg-white/5 text-white rounded-bl-sm'}`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className={`text-[10px] mt-1 ${msg.sender === 'admin' ? 'text-white/60' : 'text-white/30'}`}>{new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSendReply} className="px-6 py-4 border-t border-white/5 flex items-center gap-3">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Yanıt yazın..." className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30" maxLength={1000} />
                    <button type="submit" disabled={!chatInput.trim()} className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-white/20" />
                  </div>
                  <h4 className="font-semibold text-white mb-1">Sohbet Seçin</h4>
                  <p className="text-sm text-white/30 max-w-xs">Yanıtlamak için sol taraftan bir sohbet seçin</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
