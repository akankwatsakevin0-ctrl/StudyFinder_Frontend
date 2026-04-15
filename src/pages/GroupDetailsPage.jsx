import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, MapPin, Clock, ArrowLeft, BookOpen, Layers, MessageSquare, Plus, Settings, Calendar, ExternalLink } from 'lucide-react';
import { groupService, sessionService } from '../services/api';

const GroupDetailsPage = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <Link to="/groups" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#002147] transition group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Groups
        </Link>
        {isLeader && (
          <Link to={`/groups/${id}/manage`} className="bg-[#002147] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-opacity-90 transition flex items-center gap-2 shadow-md">
            <Settings size={16} /> Manage Group
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#002147] px-8 py-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#D4AF37] text-[#002147] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {group.courseCode}
                </span>
                <span className="text-blue-200 text-xs font-medium ml-2">{group.meetingType} session</span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">{group.groupName}</h1>
              <p className="text-blue-100 text-lg mt-2 font-medium opacity-90">{group.courseName}</p>
            </div>

            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="text-[#D4AF37]" size={20} /> About this Group
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {group.description}
              </p>

              <div className="grid grid-cols-2 gap-6 mt-10 pt-8 border-t border-gray-50">
                <DetailIcon icon={<MapPin className="text-[#D4AF37]" />} label="Location" value={group.meetingLocation} />
                <DetailIcon icon={<BookOpen className="text-[#D4AF37]" />} label="Faculty" value={group.faculty} />
              </div>
            </div>
          </div>

          {/* Study Sessions Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="text-[#D4AF37]" size={22} /> Study Sessions
            </h3>

            {sessions.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Clock className="text-gray-300 mx-auto mb-3" size={32} />
                <p className="text-gray-500 font-medium">No study sessions scheduled yet.</p>
                {isLeader && (
                  <Link to={`/groups/${id}/sessions/create`} className="mt-4 inline-block text-sm font-bold text-[#002147] hover:underline">
                    Create the first session
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map(session => (
                  <div key={session.id} className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#D4AF37]/30 transition group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-gray-800 text-lg">{session.topic}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1">{session.description}</p>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white px-2.5 py-1 rounded border border-gray-100">
                            <Calendar size={12} className="text-[#D4AF37]" /> {new Date(session.sessionDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white px-2.5 py-1 rounded border border-gray-100">
                            <Clock size={12} className="text-[#D4AF37]" /> {session.sessionTime}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white px-2.5 py-1 rounded border border-gray-100">
                            <MapPin size={12} className="text-[#D4AF37]" /> {session.location}
                          </span>
                        </div>
                      </div>
                      {session.location.startsWith('http') && (
                        <a
                          href={session.location} target="_blank" rel="noopener noreferrer"
                          className="bg-[#002147] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 transition flex items-center justify-center gap-2"
                        >
                          Join Meeting <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {isLeader && (
                  <Link
                    to={`/groups/${id}/sessions/create`}
                    className="block w-full text-center py-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-100 hover:border-[#D4AF37]/50 transition"
                  >
                    + Schedule New Session
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Group Discussion Placeholder */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center py-16">
            <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <MessageSquare className="text-gray-400" size={30} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Group Discussion</h3>
            <p className="text-gray-500 max-w-sm mx-auto">This feature is coming soon! Soon you'll be able to chat and share resources with your fellow members.</p>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <Users size={20} className="text-[#D4AF37]" /> Group Overview
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Status</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded border border-green-200 uppercase">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Members Joined</span>
                <span className="text-[#002147] font-bold">You are a member</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Meeting Time</span>
                <span className="text-gray-700 font-bold text-sm">Every Friday, 2 PM</span>
              </div>
            </div>
            <button className="w-full mt-8 bg-gray-50 text-gray-400 py-3 rounded-xl font-bold border border-dashed border-gray-200 cursor-not-allowed">
              Already Joined
            </button>
          </div>

          <div className="bg-[#D4AF37]/10 rounded-2xl p-6 border border-[#D4AF37]/20">
            <h4 className="text-[#002147] font-bold mb-2 text-sm flex items-center gap-2">
              <Plus size={16} /> Need help?
            </h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              If you have trouble finding the physical meeting spot, please contact the group leader or your department rep.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailIcon = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">{icon}</div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-gray-900 font-bold">{value}</p>
    </div>
  </div>
);

export default GroupDetailsPage;
