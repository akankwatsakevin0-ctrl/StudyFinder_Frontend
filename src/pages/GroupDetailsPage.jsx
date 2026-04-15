import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, MapPin, Clock, ArrowLeft, BookOpen, Layers, MessageSquare, Plus, Settings, Calendar, ExternalLink, LogOut, Trash2, ChevronDown, AlertCircle } from 'lucide-react';
import { groupService, sessionService } from '../services/api';

const GroupDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  let currentUser = {};
  try {
    const storedUser = localStorage.getItem('user');
    currentUser = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : {};
  } catch (e) {
    console.error('Error parsing user:', e);
  }
  const isLeader = group && (Number(currentUser?._id) === Number(group.leaderId) || Number(currentUser?.id) === Number(group.leaderId));

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const [groupData, sessionData] = await Promise.all([
        groupService.getGroupDetails(id),
        sessionService.getGroupSessions(id)
      ]);
      setGroup(groupData);
      setSessions(sessionData);
    } catch (err) {
      console.error('Error fetching group data:', err);
      setError('Could not load group details. It might have been deleted.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you certain you want to leave this study group? You will lose access to all private discussions and sessions.')) return;
    
    try {
      await groupService.leaveGroup(id);
      navigate('/groups');
    } catch (err) {
      alert(err.response?.data?.message || 'Error leaving group');
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('⚠️ DANGER ZONE: This will permanently decommission the group and erase all discussion history. This action IS IRREVERSIBLE. Proceed?')) return;
    
    try {
      await groupService.deleteGroup(id);
      navigate('/groups');
    } catch (err) {
      alert(err.response?.data?.message || 'Error decommissioning group');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002147]"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading group details...</p>
    </div>
  );

  if (error || !group) return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <div className="bg-red-50 p-8 rounded-2xl border border-red-100 inline-block">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Oops!</h2>
        <p className="text-red-600 mb-6">{error || 'Group not found'}</p>
        <Link to="/groups" className="bg-[#002147] text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Browse Other Groups
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-10 overflow-hidden">
        <Link to="/groups" className="inline-flex items-center text-xs font-black text-blue-100/60 hover:text-[#D4AF37] transition-all group uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </Link>
        <div className="flex gap-4">
          <Link to={`/groups/${id}/discussions`} className="bg-[#D4AF37] text-[#002147] px-6 py-3 rounded-2xl text-xs font-black hover:bg-yellow-500 transition-all flex items-center gap-3 shadow-xl shadow-yellow-900/10 uppercase tracking-widest active:scale-95">
            <MessageSquare size={18} /> Discussions
          </Link>
          {isLeader && (
            <Link to={`/groups/${id}/manage`} className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-2xl text-xs font-black hover:bg-white/10 transition-all flex items-center gap-3 shadow-xl uppercase tracking-widest active:scale-95">
              <Settings size={18} className="text-[#D4AF37]" /> Manage
            </Link>
          )}
          
          <div className="relative" ref={settingsRef}>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-2xl text-xs font-black hover:bg-white/10 transition-all flex items-center gap-3 shadow-xl uppercase tracking-widest active:scale-95"
            >
              <Settings size={18} className="text-blue-100/40" /> Settings <ChevronDown size={14} className={`transition-transform duration-300 ${showSettings ? 'rotate-180' : ''}`} />
            </button>
            
            {showSettings && (
              <div className="absolute right-0 mt-3 w-64 bg-[#001529] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                <div className="p-2">
                  {!isLeader && (
                    <button 
                      onClick={handleLeaveGroup}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-blue-200/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                      <LogOut size={16} /> Leave Group
                    </button>
                  )}
                  {isLeader && (
                    <button 
                      onClick={handleDeleteGroup}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} /> Decommission Group
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <div className="card overflow-hidden !p-0 border-white/10 shadow-2xl">
            <div className="bg-[#002147] px-10 py-12 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#D4AF37] to-[#D4AF37]/50"></div>
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black px-4 py-1.5 rounded-full border border-[#D4AF37]/20 uppercase tracking-widest">
                  {group.courseCode}
                </span>
                <span className="text-blue-200/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  {group.meetingType} session
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-4">{group.groupName}</h1>
              <p className="text-blue-100/60 text-lg font-bold opacity-90 max-w-2xl">{group.courseName}</p>
            </div>

            <div className="p-10">
              <h3 className="text-xs font-black text-[#D4AF37] mb-6 flex items-center gap-3 uppercase tracking-widest">
                <Layers size={18} /> About this Group
              </h3>
              <p className="text-blue-100/70 leading-relaxed text-lg font-medium whitespace-pre-line bg-white/5 p-6 rounded-2xl border border-white/5">
                {group.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-10 border-t border-white/5">
                <DetailIcon icon={<MapPin className="text-[#D4AF37]" />} label="Meeting Point" value={group.meetingLocation} />
                <DetailIcon icon={<BookOpen className="text-[#D4AF37]" />} label="Academic Faculty" value={group.faculty} />
              </div>
            </div>
          </div>

          {/* Study Sessions Section */}
          <div className="card border-white/10 p-10">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
              <h3 className="text-xs font-black text-white flex items-center gap-3 uppercase tracking-widest">
                <Calendar className="text-[#D4AF37]" size={20} /> Academic Roadmap
              </h3>
              {isLeader && sessions.length > 0 && (
                <Link to={`/groups/${id}/sessions/create`} className="text-[#D4AF37] hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                  + Add Session
                </Link>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-white/10">
                <Clock className="text-white/10 mx-auto mb-6" size={48} />
                <p className="text-blue-100/40 font-bold mb-8 uppercase tracking-widest text-xs">No active sessions scheduled yet.</p>
                {isLeader && (
                  <Link to={`/groups/${id}/sessions/create`} className="bg-[#D4AF37]/10 text-[#D4AF37] px-8 py-3 rounded-2xl font-black text-xs hover:bg-[#D4AF37]/20 transition-all border border-[#D4AF37]/20 uppercase tracking-widest">
                     Initiate First Session
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {sessions.map(session => (
                  <div key={session.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-[#D4AF37]/30 transition-all group/session hover:bg-white/10 translate-y-0 hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest opacity-70">{new Date(session.sessionDate).toLocaleDateString()}</span>
                           <div className="h-1 w-1 rounded-full bg-[#D4AF37]/40"></div>
                           <span className="text-[10px] font-black text-blue-100/40 uppercase tracking-widest">{session.sessionTime}</span>
                        </div>
                        <h4 className="font-black text-white text-2xl tracking-tight group-hover/session:text-[#D4AF37] transition-colors">{session.topic}</h4>
                        <p className="text-sm text-blue-100/50 font-medium leading-relaxed max-w-xl">{session.description}</p>
                        <div className="flex flex-wrap gap-3 mt-4">
                          <span className="flex items-center gap-2 text-[10px] font-black text-blue-200/60 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-widest">
                            <MapPin size={12} className="text-[#D4AF37]/50" /> {session.location}
                          </span>
                        </div>
                      </div>
                      {session.location.startsWith('http') && (
                        <a
                          href={session.location} target="_blank" rel="noopener noreferrer"
                          className="bg-white/10 hover:bg-[#D4AF37] text-white hover:text-[#002147] px-6 py-4 rounded-2xl text-[10px] font-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest border border-white/10 hover:border-transparent min-w-[180px]"
                        >
                          Launch Meeting <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {isLeader && (
                  <Link
                    to={`/groups/${id}/sessions/create`}
                    className="block w-full text-center py-6 bg-white/2 hover:bg-white/5 border border-dashed border-white/10 rounded-3xl text-blue-100/30 font-black hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all uppercase tracking-widest text-[10px]"
                  >
                    + Schedule Next Research Session
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
          <div className="card border-white/10 !p-8 shadow-2xl">
            <h3 className="text-xs font-black text-white mb-8 flex items-center gap-3 border-b border-white/5 pb-6 uppercase tracking-widest">
              <Users size={20} className="text-[#D4AF37]" /> Group Overview
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] text-blue-100/40 font-black uppercase tracking-widest">Auth Status</span>
                <span className="bg-green-500/10 text-green-400 text-[10px] font-black px-3 py-1 rounded-lg border border-green-500/20 uppercase tracking-widest">Active Member</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] text-blue-100/40 font-black uppercase tracking-widest">Member Since</span>
                <span className="text-white font-black text-xs uppercase tracking-widest">Academic Term</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] text-blue-100/40 font-black uppercase tracking-widest">Frequency</span>
                <span className="text-white font-black text-xs uppercase tracking-widest">Weekly Sessions</span>
              </div>
            </div>
            <div className="mt-10 p-4 bg-[#D4AF37] rounded-2xl text-[#002147] font-black text-xs text-center uppercase tracking-widest shadow-lg shadow-yellow-900/20 opacity-90">
              Registration Complete
            </div>
          </div>

          <div className="bg-[#D4AF37]/10 rounded-3xl p-8 border border-[#D4AF37]/20 relative overflow-hidden group/tip">
            <div className="absolute -top-10 -right-10 opacity-5 group-hover/tip:opacity-10 transition-opacity rotate-12">
               <Plus size={150} className="text-[#D4AF37]" />
            </div>
            <h4 className="text-white font-black mb-3 text-xs flex items-center gap-2 uppercase tracking-widest">
              <Plus size={16} className="text-[#D4AF37]" /> Administrative Support
            </h4>
            <p className="text-blue-100/50 text-[10px] font-bold leading-relaxed uppercase tracking-tighter">
              If you have trouble finding physical resources, please contact the group leader or the department rep via the portal.
            </p>
          </div>
        </div>
      </div>
    </div>
);
};

const DetailIcon = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 group/icon transition-all hover:bg-white/10">
    <div className="bg-black/20 p-4 rounded-2xl border border-white/10 group-hover/icon:border-[#D4AF37]/50 transition-all">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-blue-100/30 uppercase tracking-widest mb-1.5">{label}</p>
      <p className="text-white font-black tracking-tight leading-tight">{value}</p>
    </div>
  </div>
);

export default GroupDetailsPage;
