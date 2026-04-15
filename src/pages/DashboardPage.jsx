import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, ArrowRight, Activity, ShieldCheck, Loader2, Star, Calendar, Clock, MapPin as Pin, MessageSquare, Plus } from 'lucide-react';
import { groupService, sessionService } from '../services/api';

const DashboardPage = () => {
  const [ledGroups, setLedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let currentUser = {};
  try {
    const storedUser = localStorage.getItem('user');
    currentUser = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : {};
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allGroups, mySessions] = await Promise.all([
          groupService.getMyGroups(),
          sessionService.getMySessions()
        ]);

        const currentUserId = currentUser?.id || currentUser?._id;
        const led = allGroups.filter(g => Number(g.leaderId) === Number(currentUserId));
        const joined = allGroups.filter(g => Number(g.leaderId) !== Number(currentUserId));

        setLedGroups(led);
        setJoinedGroups(joined);
        setSessions(mySessions);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load your dashboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
      <Loader2 className="animate-spin text-[#002147] mb-4" size={48} />
      <p className="text-gray-500 font-bold tracking-wide uppercase text-xs">Synchronizing your dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Dynamic Header Card */}
      <div className="bg-[#002147]/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 scale-150 rotate-12">
          <BookOpen size={150} className="text-[#D4AF37]" />
        </div>
        <div className="flex flex-col items-center relative z-10">
          <span className="text-[#D4AF37] font-black text-[10px] uppercase tracking-widest mb-4 bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/20">
            {ledGroups.length > 0 ? 'Group Leader & Student' : 'Active Student'}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">Study Group Finder</h1>
          <p className="text-blue-100/70 text-lg max-w-2xl font-bold leading-relaxed">
            Empowering your collaborative learning journey at <span className="text-[#D4AF37] font-black">Uganda Christian University</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Sections */}
        <div className="lg:col-span-2 space-y-8">

          {/* Groups You Lead Section */}
          {ledGroups.length > 0 && (
            <section className="bg-[#002147]/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/5 overflow-hidden">
              <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h3 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
                  <Star size={22} className="text-[#D4AF37] fill-[#D4AF37]" /> Groups You Lead
                </h3>
                <Link to="/groups" className="p-2 bg-[#D4AF37] text-[#002147] rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:scale-105 active:scale-95">
                  <Plus size={20} />
                </Link>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ledGroups.map(group => (
                  <div key={group.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#D4AF37] hover:bg-white/10 transition-all group relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Link to={`/groups/${group.id}/manage`} className="p-2 bg-black/20 text-blue-200 hover:text-[#D4AF37] rounded-xl border border-white/10 transition shadow-sm" title="Settings">
                        <Settings size={14} />
                      </Link>
                      <Link to={`/groups/${group.id}/sessions/create`} className="p-2 bg-black/20 text-blue-200 hover:text-[#D4AF37] rounded-xl border border-white/10 transition shadow-sm" title="Schedule Session">
                        <Calendar size={14} />
                      </Link>
                    </div>
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-1 block">{group.courseCode}</span>
                    <h4 className="font-bold text-white text-lg mb-4 pr-16 leading-tight">{group.groupName}</h4>
                    <Link to={`/groups/${group.id}`} className="inline-flex items-center gap-2 text-xs font-black text-[#D4AF37] hover:underline uppercase tracking-widest">
                      Enter Group <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Groups You've Joined */}
          <section className="bg-[#002147]/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/5">
              <h3 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
                <Users size={22} className="text-[#D4AF37]" /> Joined Groups
              </h3>
            </div>

            {joinedGroups.length === 0 ? (
              <div className="p-16 text-center">
                <div className="bg-white/5 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 rotate-3">
                  <Users size={32} className="text-white/20" />
                </div>
                <p className="text-blue-100/60 font-bold mb-8">You haven't joined any peer groups yet.</p>
                <Link to="/groups" className="bg-[#D4AF37] text-[#002147] px-10 py-4 rounded-2xl font-black inline-flex items-center gap-2 hover:bg-yellow-500 transition shadow-xl shadow-yellow-900/10 active:scale-95 uppercase tracking-widest text-xs">
                   Explore Hub <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {joinedGroups.map(group => (
                  <Link
                    key={group.id}
                    to={`/groups/${group.id}`}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#D4AF37] hover:bg-white/10 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-black bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded border border-[#D4AF37]/20 tracking-widest uppercase">
                        {group.courseCode}
                      </span>
                      <ArrowRight size={16} className="text-white/20 group-hover:text-[#D4AF37] transition-all transform group-hover:translate-x-1" />
                    </div>
                    <h4 className="font-bold text-white text-lg leading-tight line-clamp-1">{group.groupName}</h4>
                    <div className="flex items-center gap-4 mt-4 opacity-50">
                      <div className="flex items-center gap-1.5 text-[10px] text-blue-100 font-black uppercase tracking-widest">
                        <Pin size={10} className="text-[#D4AF37]" /> {group.meetingLocation}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Widgets - Timeline & Stats */}
        <div className="space-y-6">
          <section className="bg-[#002147]/80 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl border border-white/10">
            <h3 className="font-black text-lg mb-8 flex items-center gap-2 text-white border-b border-white/10 pb-6 tracking-tight uppercase text-xs">
              <Calendar size={18} className="text-[#D4AF37]" /> Learning Timeline
            </h3>

            {sessions.length === 0 ? (
              <div className="py-10 text-center opacity-30">
                <Clock size={40} className="mx-auto mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">No active sessions</p>
              </div>
            ) : (
              <div className="space-y-8 relative">
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/10 ml-0.5"></div>
                {sessions.slice(0, 4).map(session => (
                  <div key={session.id} className="relative pl-12 group">
                    <div className="absolute left-0 top-1 h-8 w-8 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-all shadow-lg">
                      <Activity size={12} className="text-[#D4AF37]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#D4AF37]/70 uppercase tracking-widest">{new Date(session.sessionDate).toLocaleDateString()}</p>
                      <h4 className="text-sm font-bold truncate leading-tight group-hover:text-[#D4AF37] transition-colors">{session.topic}</h4>
                      <p className="text-[10px] text-blue-100/50 flex items-center gap-1.5 pt-1 uppercase font-black tracking-tighter">
                        <Clock size={10} className="text-[#D4AF37]" /> {session.sessionTime} • {session.Group?.courseCode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="p-8 bg-[#002147]/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/5">
            <h3 className="font-black text-white mb-8 flex items-center gap-3 border-b border-white/5 pb-6 text-xs uppercase tracking-widest">
              <ShieldCheck size={18} className="text-[#D4AF37]" /> Identity Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-[10px] text-blue-100/50 font-black uppercase tracking-widest">Role</span>
                <span className="text-[10px] font-black text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg border border-[#D4AF37]/20 shadow-inner">
                  {ledGroups.length > 0 ? 'GROUP LEADER' : 'UCU STUDENT'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-[10px] text-blue-100/50 font-black uppercase tracking-widest">Year</span>
                <span className="text-xs font-black text-white">YEAR {currentUser?.yearOfStudy || '—'}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-blue-100/50 font-black uppercase tracking-widest">Verified</span>
                <div className="h-6 w-6 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                  <ShieldCheck size={14} className="text-green-400" />
                </div>
              </div>
            </div>
          </section>

          {/* Quick Help Widget */}
          <div className="bg-gray-900 rounded-2xl p-6 text-white text-center shadow-lg">
            <MessageSquare size={24} className="mx-auto mb-3 text-[#D4AF37]" />
            <h4 className="text-sm font-bold mb-2">Academic Support</h4>
            <p className="text-[10px] text-gray-400 mb-4 px-4 leading-relaxed">Need help facilitating your study sessions? Get in touch with our lab assistants.</p>
            <button className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest hover:underline">Get Assistance</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);

export default DashboardPage;
