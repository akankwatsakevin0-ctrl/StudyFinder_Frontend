import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';
import {
  Users, BookOpen, LayoutDashboard, TrendingUp,
  Calendar, ShieldCheck, RefreshCw, AlertCircle, ChevronRight
} from 'lucide-react';

// ── Stat Card ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, accent, sub }) => (
  <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden group hover:shadow-md transition-all duration-300">
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
      style={{ background: accent }}
    />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-4xl font-black text-[#002147] mt-1">
          {value !== null && value !== undefined ? value.toLocaleString() : '—'}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-2">{sub}</p>}
      </div>
      <div
        className="p-3 rounded-xl"
        style={{ background: `${accent}22` }}
      >
        <Icon size={26} style={{ color: accent }} />
      </div>
    </div>
    <div
      className="absolute bottom-0 left-0 h-1 w-full"
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-[#002147] border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading admin dashboard…</p>
      </div>
    );
  }

  // ── ERROR ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={40} />
          <h3 className="text-lg font-bold text-red-700 mb-1">Access Error</h3>
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-5 bg-[#002147] text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── TABS ─────────────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: `Users (${users.length})`, icon: Users },
    { id: 'groups', label: `Groups (${groups.length})`, icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#002147] p-2.5 rounded-xl">
            <ShieldCheck className="text-[#D4AF37]" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#002147]">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, <span className="font-semibold text-[#D4AF37]">{user?.name}</span></p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-md transition disabled:opacity-60"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={Users}
          label="Total Registered Users"
          value={stats?.totalUsers}
          accent="#002147"
          sub="All roles including admins"
        />
        <StatCard
          icon={BookOpen}
          label="Total Study Groups"
          value={stats?.totalGroups}
          accent="#D4AF37"
          sub="Active and inactive groups"
        />
        <StatCard
          icon={Calendar}
          label="Study Sessions"
          value={stats?.totalSessions}
          accent="#10b981"
          sub="All scheduled sessions"
        />
      </div>

      {/* ── Tab Navigation ─────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-full sm:w-auto inline-flex">
        {tabs.map(({ id, label, icon: TabIcon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === id
                ? 'bg-white text-[#002147] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <TabIcon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ───────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Active Courses */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={20} className="text-[#D4AF37]" />
              <h2 className="font-bold text-[#002147] text-lg">Most Active Courses</h2>
            </div>
            {stats?.mostActiveCourses?.length > 0 ? (
              <ol className="space-y-3">
                {stats.mostActiveCourses.map((course, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          idx === 0
                            ? 'bg-[#D4AF37] text-[#002147]'
                            : idx === 1
                            ? 'bg-[#C0C0C0] text-gray-800'
                            : idx === 2
                            ? 'bg-[#CD7F32] text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-gray-800 font-medium text-sm truncate max-w-[200px]">
                        {course.courseName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 rounded-full bg-[#002147] opacity-20"
                        style={{ width: `${Math.min((course.groupCount / stats.mostActiveCourses[0].groupCount) * 80, 80)}px` }}
                      />
                      <span className="text-xs font-bold text-[#002147] whitespace-nowrap">
                        {course.groupCount} {course.groupCount === 1 ? 'group' : 'groups'}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">No group data yet.</p>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-[#002147]" />
                <h2 className="font-bold text-[#002147] text-lg">Recent Users</h2>
              </div>
              <button
                onClick={() => setActiveTab('users')}
                className="text-xs text-[#D4AF37] font-bold flex items-center gap-1 hover:underline"
              >
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {users.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#002147] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <span className={`ml-auto shrink-0 text-xs px-2 py-0.5 rounded-full font-bold ${
                    u.role === 'admin'
                      ? 'bg-[#002147] text-[#D4AF37]'
                      : 'bg-green-100 text-green-700'
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#002147]">All Registered Users</h2>
            <p className="text-xs text-gray-400 mt-0.5">{users.length} total users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">#</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Reg. No.</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Program</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Year</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#002147] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{u.registrationNumber || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{u.programOfStudy || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{u.yearOfStudy || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        u.role === 'admin'
                          ? 'bg-[#002147] text-[#D4AF37]'
                          : 'bg-green-100 text-green-700'
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#002147]">All Study Groups</h2>
            <p className="text-xs text-gray-400 mt-0.5">{groups.length} total groups</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">#</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Group Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Course</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Code</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Faculty</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {groups.map((g, idx) => (
                  <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{g.groupName}</td>
                    <td className="px-6 py-4 text-gray-600">{g.courseName}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{g.courseCode}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{g.faculty}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        g.meetingType === 'online'
                          ? 'bg-blue-100 text-blue-700'
                          : g.meetingType === 'hybrid'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {g.meetingType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        g.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {g.isActive ? 'Active' : 'Inactive'}
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
