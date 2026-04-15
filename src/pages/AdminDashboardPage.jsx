import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';
import {
  Users, BookOpen, LayoutDashboard, TrendingUp,
  Calendar, ShieldCheck, RefreshCw, AlertCircle, ChevronRight
} from 'lucide-react';

// ── Stat Card ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, accent, sub }) => (
  <div className="card relative overflow-hidden group border-white/10 shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
      style={{ background: accent }}
    />
    <div className="flex items-start justify-between relative z-10">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-5xl font-black text-white tracking-tighter">
          {value !== null && value !== undefined ? value.toLocaleString() : '—'}
        </p>
        {sub && <p className="text-[10px] text-blue-100/30 mt-4 font-bold uppercase tracking-widest">{sub}</p>}
      </div>
      <div
        className="p-5 rounded-[20px] border border-white/5 bg-white/2 shadow-xl"
      >
        <Icon size={32} style={{ color: accent }} />
      </div>
    </div>
    <div
      className="absolute bottom-0 left-0 h-1 w-full opacity-50"
      style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
    />
  </div>
);

// ── Admin Dashboard ────────────────────────────────────────────────────────────
const AdminDashboardPage = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setError('');
    try {
      const [statsData, usersData, groupsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
        adminService.getAllGroups(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setGroups(groupsData);
    } catch (err) {
      console.error('Admin fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load admin data. Make sure you are signed in as an administrator.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 border-w border-white/5 border-t-[#D4AF37] rounded-full animate-spin shadow-2xl shadow-yellow-900/10" />
        <p className="text-blue-100/30 font-black uppercase tracking-[0.2em] text-xs">Synchronizing Registry…</p>
      </div>
    );
  }

  // ── ERROR ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="card border-red-500/20 max-w-lg w-full text-center">
          <AlertCircle className="mx-auto mb-6 text-red-500" size={48} />
          <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Command Authentication Failed</h3>
          <p className="text-blue-100/50 font-medium mb-8 leading-relaxed">{error}</p>
          <button
            onClick={handleRefresh}
            className="w-full bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-black hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
          >
            Reconnect to Server
          </button>
        </div>
      </div>
    );
  }

  // ── TABS ─────────────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'users', label: `Registry (${users.length})`, icon: Users },
    { id: 'groups', label: `Nodes (${groups.length})`, icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <div className="bg-[#D4AF37] p-1 rounded-3xl shadow-2xl">
            <div className="bg-[#002147] p-4 rounded-[22px]">
              <ShieldCheck className="text-[#D4AF37]" size={36} />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">Central Authority</h1>
            <p className="text-blue-100/30 uppercase tracking-[0.3em] font-black text-[10px]">Supervisor Profile: <span className="text-[#D4AF37]">{user?.name}</span> • UCU Mainframe</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 shadow-xl"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin text-[#D4AF37]' : ''} />
          {refreshing ? 'Reading...' : 'Refresh Logs'}
        </button>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <StatCard
          icon={Users}
          label="Registry Capacity"
          value={stats?.totalUsers}
          accent="#3b82f6"
          sub="Verified Academic Peers"
        />
        <StatCard
          icon={BookOpen}
          label="Active Node Clusters"
          value={stats?.totalGroups}
          accent="#D4AF37"
          sub="Independent Research Hubs"
        />
        <StatCard
          icon={Calendar}
          label="Event Logs"
          value={stats?.totalSessions}
          accent="#10b981"
          sub="Synchronized Gatherings"
        />
      </div>

      {/* ── Tab Navigation ─────────────────────────────────────────────────── */}
      <div className="flex gap-2 bg-white/2 p-2 rounded-2xl mb-10 w-full md:w-auto inline-flex border border-white/5">
        {tabs.map(({ id, label, icon: TabIcon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === id
                ? 'bg-[#D4AF37] text-[#002147] shadow-xl'
                : 'text-blue-100/30 hover:text-white hover:bg-white/5'
            }`}
          >
            <TabIcon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ───────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Most Active Courses */}
          <div className="card border-white/10 !p-10 shadow-2xl">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
              <TrendingUp size={24} className="text-[#D4AF37]" />
              <h2 className="font-black text-white text-xl tracking-tighter uppercase whitespace-nowrap">Node Performance</h2>
            </div>
            {stats?.mostActiveCourses?.length > 0 ? (
              <ol className="space-y-6">
                {stats.mostActiveCourses.map((course, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-6 group/item">
                    <div className="flex items-center gap-4 min-w-0">
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border transition-all ${
                          idx === 0
                            ? 'bg-[#D4AF37] text-[#002147] border-[#D4AF37] shadow-lg shadow-yellow-900/20 scale-110'
                            : 'bg-white/5 text-blue-100/60 border-white/5 group-hover/item:border-[#D4AF37]/30'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                         <span className="text-white font-black text-sm block truncate group-hover/item:text-[#D4AF37] transition-colors uppercase tracking-tight">
                           {course.courseName}
                         </span>
                         <span className="text-[10px] text-blue-100/30 font-bold uppercase tracking-widest">Global Priority</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="text-[10px] font-black text-[#D4AF37] whitespace-nowrap uppercase tracking-widest">
                         {course.groupCount} {course.groupCount === 1 ? 'cluster' : 'clusters'}
                       </span>
                       <div className="h-1.5 w-24 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#D4AF37]/50 to-[#D4AF37] transition-all duration-1000"
                            style={{ width: `${Math.min((course.groupCount / stats.mostActiveCourses[0].groupCount) * 100, 100)}%` }}
                          />
                       </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-center py-16 opacity-30">
                 <p className="font-black text-xs uppercase tracking-widest">Zero telemetry data detected.</p>
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="card border-white/10 !p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <Users size={24} className="text-[#3b82f6]" />
                <h2 className="font-black text-white text-xl tracking-tighter uppercase whitespace-nowrap">Incoming Peering</h2>
              </div>
              <button
                onClick={() => setActiveTab('users')}
                className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-all"
              >
                Expand <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-6">
              {users.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center gap-4 p-4 bg-white/2 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002147] to-black text-blue-100/60 flex items-center justify-center text-lg font-black border border-white/10 overflow-hidden relative">
                    {u.name?.charAt(0).toUpperCase()}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-[#D4AF37]/20" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-black text-white tracking-tight truncate">{u.name}</p>
                    <p className="text-[10px] text-blue-100/30 uppercase tracking-tighter truncate">{u.email}</p>
                  </div>
                  <span className={`shrink-0 text-[8px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border transition-all ${
                    u.role === 'admin'
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20'
                      : 'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Users Tab ──────────────────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="card !p-0 overflow-hidden shadow-2xl border-white/10">
          <div className="px-10 py-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <div>
              <h2 className="font-black text-white text-xl tracking-tighter uppercase">Authorized Peer Registry</h2>
              <p className="text-[10px] text-blue-100/30 font-black uppercase tracking-widest mt-1">{users.length} authenticated identities</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black/20 border-b border-white/5">
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Rank</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Full Identity</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Communication URI</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">RegID</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Academy</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Access Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#002147]/20">
                {users.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors group/row">
                    <td className="px-10 py-6 text-blue-100/20 font-black text-xs">{String(idx + 1).padStart(3, '0')}</td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002147] to-black text-blue-100/40 flex items-center justify-center text-xs font-black border border-white/10">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-black text-white tracking-tight group-hover/row:text-[#D4AF37] transition-colors">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-blue-100/50 font-medium">{u.email}</td>
                    <td className="px-10 py-6 text-blue-100/30 font-mono text-xs tracking-tighter">{u.registrationNumber || 'UNASSIGNED'}</td>
                    <td className="px-10 py-6 text-blue-100/50 font-bold uppercase text-[10px] tracking-tight">{u.programOfStudy || '—'}</td>
                    <td className="px-10 py-6">
                      <span className={`text-[8px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border transition-all ${
                        u.role === 'admin'
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 shadow-lg shadow-yellow-900/10'
                          : 'bg-white/5 text-blue-100/20 border-white/5'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Groups Tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'groups' && (
        <div className="card !p-0 overflow-hidden shadow-2xl border-white/10">
          <div className="px-10 py-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <div>
              <h2 className="font-black text-white text-xl tracking-tighter uppercase">Node Cluster Directory</h2>
              <p className="text-[10px] text-blue-100/30 font-black uppercase tracking-widest mt-1">{groups.length} active research units</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black/20 border-b border-white/5">
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">NodeID</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Group Alias</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Focus</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">System Code</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Medium</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Runtime Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#002147]/20">
                {groups.map((g, idx) => (
                  <tr key={g.id} className="hover:bg-white/5 transition-colors group/row">
                    <td className="px-10 py-6 text-blue-100/20 font-black text-xs">{String(idx + 1).padStart(3, '0')}</td>
                    <td className="px-10 py-6 font-black text-white tracking-tight group-hover/row:text-[#D4AF37] transition-colors">{g.groupName}</td>
                    <td className="px-10 py-6 text-blue-100/50 font-medium">{g.courseName}</td>
                    <td className="px-10 py-6">
                      <span className="font-mono text-xs bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[#D4AF37] font-black uppercase tracking-widest">{g.courseCode}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`text-[8px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border transition-all ${
                        g.meetingType === 'online'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : g.meetingType === 'hybrid'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      }`}>
                        {g.meetingType}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`text-[8px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border transition-all shadow-lg ${
                        g.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {g.isActive ? 'Active' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
