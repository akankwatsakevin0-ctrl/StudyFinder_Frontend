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
  const currentUser = JSON.parse(localStorage.getItem('user'));

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
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 p-10 text-center border-b-8 border-[#002147] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
          <BookOpen size={150} className="text-[#002147]" />
        </div>
        <div className="flex flex-col items-center relative z-10">
          <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest mb-3 bg-yellow-50 px-4 py-1.5 rounded-full border border-yellow-100">
            {ledGroups.length > 0 ? 'Group Leader & Student' : 'Active Student'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#002147] mb-4 tracking-tight">Study Group Finder</h1>
          <p className="text-gray-500 text-lg max-w-2xl font-medium leading-relaxed">
            Empowering your collaborative learning journey at <span className="text-[#002147] font-bold">Uganda Christian University</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Sections */}
        <div className="lg:col-span-2 space-y-8">

          {/* Groups You Lead Section */}
          {ledGroups.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-transparent flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#002147] flex items-center gap-2">
                  <Star size={22} className="text-[#D4AF37] fill-[#D4AF37]" /> Groups You Lead
                </h3>
                <Link to="/groups" className="p-1.5 bg-[#002147] text-white rounded-lg hover:bg-opacity-90 transition">
                  <Plus size={18} />
                </Link>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ledGroups.map(group => (
                  <div key={group.id} className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#002147] hover:shadow-lg transition-all group relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Link to={`/groups/${group.id}/manage`} className="p-1.5 bg-gray-50 text-gray-400 hover:text-[#002147] rounded-lg border border-gray-100 transition shadow-sm" title="Settings">
                        <Settings size={14} />
                      </Link>
                      <Link to={`/groups/${group.id}/sessions/create`} className="p-1.5 bg-gray-50 text-gray-400 hover:text-[#D4AF37] rounded-lg border border-gray-100 transition shadow-sm" title="Schedule Session">
                        <Calendar size={14} />
                      </Link>
                    </div>
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-1 block">{group.courseCode}</span>
                    <h4 className="font-bold text-[#002147] text-lg mb-4 pr-16">{group.groupName}</h4>
                    <Link to={`/groups/${group.id}`} className="inline-flex items-center gap-2 text-xs font-bold text-[#002147] hover:underline">
                      View Group Page <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Groups You've Joined */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-transparent">
              <h3 className="text-xl font-bold text-[#002147] flex items-center gap-2">
                <Users size={22} className="text-[#D4AF37]" /> Groups You've Joined
              </h3>
            </div>

            {joinedGroups.length === 0 ? (
              <div className="p-16 text-center">
                <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                  <Users size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium mb-6">You haven't joined any peer groups yet.</p>
                <Link to="/groups" className="bg-[#002147] text-white px-10 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-opacity-90 transition shadow-lg shadow-blue-50">
                  <ArrowRight size={18} /> Explore Hub
                </Link>
              </div>
            ) : (
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {joinedGroups.map(group => (
                  <Link
                    key={group.id}
                    to={`/groups/${group.id}`}
                    className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#D4AF37] hover:shadow-lg transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold bg-blue-50 text-[#002147] px-2 py-0.5 rounded border border-blue-100 tracking-wider">
                        {group.courseCode}
                      </span>
                      <ArrowRight size={14} className="text-gray-100 group-hover:text-[#D4AF37] transition-all" />
                    </div>
                    <h4 className="font-bold text-gray-800 line-clamp-1">{group.groupName}</h4>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                        <Pin size={10} /> {group.meetingLocation}
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
          <section className="bg-[#002147] rounded-3xl p-8 text-white shadow-xl shadow-blue-200/20">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white border-b border-white/10 pb-4">
              <Calendar size={18} className="text-[#D4AF37]" /> Learning Timeline
            </h3>

            {sessions.length === 0 ? (
              <div className="py-10 text-center opacity-50">
                <Clock size={40} className="mx-auto mb-4" />
                <p className="text-sm font-medium">No upcoming sessions yet.</p>
              </div>
            ) : (
              <div className="space-y-8 relative">
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/10 ml-0.5"></div>
                {sessions.slice(0, 4).map(session => (
                  <div key={session.id} className="relative pl-10 group">
                    <div className="absolute left-0 top-1 h-8 w-8 bg-white/10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-all">
                      <Activity size={12} className="text-[#D4AF37]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#D4AF37] uppercase">{new Date(session.sessionDate).toLocaleDateString()}</p>
                      <h4 className="text-sm font-bold truncate leading-tight group-hover:text-[#D4AF37] transition-colors">{session.topic}</h4>
                      <p className="text-[10px] text-white/60 flex items-center gap-1.5 pt-1">
                        <Clock size={10} /> {session.sessionTime} • {session.Group?.courseCode}
                      </p>
                    </div>
                  </div>
                ))}
                {sessions.length > 4 && (
                  <div className="text-center pt-4">
                    <p className="text-xs text-white/40 font-bold">+ {sessions.length - 4} more sessions</p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#002147] mb-6 flex items-center gap-2 border-b border-gray-50 pb-4 text-sm">
              <ShieldCheck size={18} className="text-[#D4AF37]" /> Identity Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Role</span>
                <span className="text-[10px] font-black text-[#002147] bg-white px-2 py-1 rounded border border-gray-100">
                  {ledGroups.length > 0 ? 'GROUP LEADER' : 'UCU STUDENT'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Academic Year</span>
                <span className="text-xs font-bold text-[#002147]">YEAR {currentUser?.yearOfStudy || '—'}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Verified Profile</span>
                <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
                  <ShieldCheck size={12} className="text-green-600" />
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
