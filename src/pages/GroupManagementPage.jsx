import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Settings, ArrowLeft, Save, UserMinus, Shield, Layout, MapPin, BookOpen, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { groupService } from '../services/api';
import toast from 'react-hot-toast';

const GroupManagementPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        groupName: '',
        courseName: '',
        courseCode: '',
        faculty: '',
        description: '',
        meetingLocation: '',
        meetingType: 'physical'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [groupData, memberData] = await Promise.all([
                    groupService.getGroupDetails(id),
                    groupService.getGroupMembers(id)
                ]);

                // Ensure user is leader (Double check frontend authorization)
                let currentUser = {};
                try {
                  const storedUser = localStorage.getItem('user');
                  currentUser = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : {};
                } catch (e) {
                  console.error('Error parsing user:', e);
                }
                if (Number(groupData.leaderId) !== Number(currentUser._id) && Number(groupData.leaderId) !== Number(currentUser.id)) {
                    toast.error('Access denied. You are not the leader of this group.');
                    navigate(`/groups/${id}`);
                    return;
                }

                setFormData(groupData);
                setMembers(memberData);
            } catch (err) {
                console.error('Error fetching group data:', err);
                toast.error('Failed to load group details.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await groupService.updateGroup(id, formData);
            toast.success('Group settings updated successfully.');
        } catch (err) {
            console.error('Update error:', err);
            toast.error('Failed to update group settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;

        try {
            await groupService.removeMember(id, userId);
            setMembers(prev => prev.filter(m => m.id !== userId));
            toast.success('Member removed successfully.');
        } catch (err) {
            console.error('Remove error:', err);
            toast.error('Failed to remove member.');
        }
    };

    const handleDeleteGroup = async () => {
        if (!window.confirm('WARNING: This action is permanent. All membership data, posts, and scheduled sessions for this group will be destroyed. Are you absolutely sure you want to decommission this group?')) return;

        try {
            setSaving(true);
            await groupService.deleteGroup(id);
            toast.success('Group decommissioned successfully.');
            navigate('/');
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Failed to decommission group.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002147]"></div>
            <p className="mt-4 text-gray-500">Loading management console...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Link to={`/groups/${id}`} className="inline-flex items-center text-xs font-black text-blue-100/60 hover:text-[#D4AF37] transition-all group uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5 mb-10">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Group Page
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Sidebar - Navigation */}
        <div className="w-full lg:w-72 space-y-4">
          <div className="card !p-6 border-white/10 shadow-2xl">
            <h2 className="text-[10px] font-black text-[#D4AF37] mb-8 px-2 uppercase tracking-[0.3em]">Management Console</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-5 py-4 bg-[#D4AF37] text-[#002147] rounded-2xl font-black transition-all shadow-xl shadow-yellow-900/20 uppercase tracking-widest text-[10px]">
                <Settings size={18} /> General Settings
              </button>
              <button 
                className="w-full flex items-center gap-3 px-5 py-4 text-blue-100/40 hover:text-white hover:bg-white/5 rounded-2xl font-black transition-all uppercase tracking-widest text-[10px]" 
                onClick={() => navigate(`/groups/${id}/sessions/create`)}
              >
                <Clock size={18} className="text-[#D4AF37]/50" /> Academic Scheduling
              </button>
            </div>
          </div>
          
          <div className="bg-[#D4AF37]/5 p-6 rounded-3xl border border-[#D4AF37]/10">
            <p className="text-[10px] text-blue-100/30 font-black uppercase tracking-widest mb-2">Notice</p>
            <p className="text-[10px] text-blue-100/50 font-bold leading-relaxed">As a leader, you have full authority to update metadata and manage participation.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-10">
          {/* Edit Form */}
          <div className="card !p-0 overflow-hidden shadow-2xl border-white/10">
            <div className="p-8 border-b border-white/5 bg-white/5">
              <h3 className="text-xs font-black text-white flex items-center gap-3 uppercase tracking-widest">
                <Layout className="text-[#D4AF37]" size={20} /> Identity & Metadata
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 ml-1">Universal Group Name</label>
                  <input
                    type="text" name="groupName" value={formData.groupName} onChange={handleChange} required
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 ml-1">Course Code</label>
                  <input
                    type="text" name="courseCode" value={formData.courseCode} onChange={handleChange} required
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition uppercase text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 ml-1">Course Title</label>
                  <input
                    type="text" name="courseName" value={formData.courseName} onChange={handleChange} required
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition text-white font-bold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 ml-1">Mission / Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange} rows="4" required
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition resize-none text-white font-medium leading-relaxed"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                    <MapPin size={12} /> Resource Link / Spot
                  </label>
                  <input
                    type="text" name="meetingLocation" value={formData.meetingLocation} onChange={handleChange} required
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                    <BookOpen size={12} /> Parent Faculty
                  </label>
                  <input
                    type="text" name="faculty" value={formData.faculty} onChange={handleChange} required
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition text-white font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-white/5">
                <button
                  type="submit" disabled={saving}
                  className="bg-[#D4AF37] text-[#002147] px-10 py-4 rounded-2xl font-black hover:bg-yellow-500 transition-all flex items-center gap-3 shadow-xl shadow-yellow-900/10 uppercase tracking-widest text-xs active:scale-95 transform hover:scale-[1.02]"
                >
                  {saving ? 'Synchronizing...' : <><Save size={18} /> Commit Changes</>}
                </button>
              </div>
            </form>
          </div>

          {/* Member Management */}
          <div className="card !p-0 overflow-hidden shadow-2xl border-white/10">
            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <h3 className="text-xs font-black text-white flex items-center gap-3 uppercase tracking-widest">
                <Users className="text-[#D4AF37]" size={20} /> Academic Registry
              </h3>
              <span className="text-[10px] font-black text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-1.5 rounded-full border border-[#D4AF37]/20 uppercase tracking-widest">
                {members.length} Confirmed Members
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/20 border-b border-white/5">
                  <tr>
                    <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Member Identity</th>
                    <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Credential</th>
                    <th className="text-left px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Authority</th>
                    <th className="text-right px-10 py-6 text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#002147]/20">
                  {members.map(member => (
                    <tr key={member.id} className="hover:bg-white/5 transition-colors group/row">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-[#002147] to-black border border-white/10 flex items-center justify-center rounded-2xl text-[#D4AF37] font-black text-lg shadow-lg">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-white tracking-tight">{member.name}</p>
                            <p className="text-[10px] text-blue-100/40 font-bold uppercase tracking-tight">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[10px] font-black text-blue-100/60 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-widest">
                          {member.registrationNumber || 'Verifying...'}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        {(Number(member.id) === Number(formData.leaderId)) ? (
                          <span className="inline-flex items-center gap-2 text-[8px] font-black text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg border border-[#D4AF37]/20 uppercase tracking-[0.2em]">
                            <Shield size={12} className="animate-pulse" /> Supreme Leader
                          </span>
                        ) : (
                          <span className="text-[8px] font-black text-blue-100/30 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-[0.2em]">Active Peer</span>
                        )}
                      </td>
                      <td className="px-10 py-6 text-right">
                        {Number(member.id) !== Number(formData.leaderId) && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all border border-red-500/20 active:scale-90"
                            title="De-register Member"
                          >
                            <UserMinus size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card !p-0 overflow-hidden shadow-2xl border-red-500/20 bg-red-500/5">
            <div className="p-8 border-b border-red-500/10 bg-red-500/5 flex items-center justify-between">
              <h3 className="text-xs font-black text-white flex items-center gap-3 uppercase tracking-widest">
                <AlertTriangle className="text-red-500" size={20} /> Danger Zone
              </h3>
            </div>
            <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h4 className="text-white font-black text-sm mb-2">Decommission Study Node</h4>
                <p className="text-[10px] text-blue-100/40 font-bold uppercase tracking-widest leading-relaxed max-w-xl">
                  Terminating this group will permanently erase all associated data, including academic discussions, membership logs, and future scheduled sessions.
                </p>
              </div>
              <button
                onClick={handleDeleteGroup}
                disabled={saving}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-red-600/10 text-red-500 border border-red-600/20 rounded-2xl font-black transition-all hover:bg-red-600 hover:text-white uppercase tracking-widest text-[10px] shadow-lg shadow-red-900/10 active:scale-95"
              >
                <Trash2 size={18} /> Permanent Decommission
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default GroupManagementPage;
