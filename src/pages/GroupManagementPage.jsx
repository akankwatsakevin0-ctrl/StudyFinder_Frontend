import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Settings, ArrowLeft, Save, UserMinus, Shield, Layout, MapPin, BookOpen, Clock } from 'lucide-react';
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
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (groupData.leaderId !== currentUser._id && groupData.leaderId !== currentUser.id) {
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002147]"></div>
      <p className="mt-4 text-gray-500">Loading management console...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Link to={`/groups/${id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#002147] mb-8 transition group">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Group Page
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Navigation */}
        <div className="w-full md:w-64 space-y-2">
            <h2 className="text-xl font-bold text-[#002147] mb-6 px-4">Manage Group</h2>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#002147] text-white rounded-xl font-bold transition shadow-sm">
                <Settings size={18} /> General Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition" onClick={() => navigate(`/groups/${id}/sessions/create`)}>
                <Clock size={18} /> Scheduling
            </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
            {/* Edit Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Layout className="text-[#D4AF37]" size={20} /> Edit Group Information
                    </h3>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2 underline decoration-[#D4AF37]/30">Group Name</label>
                            <input 
                                type="text" name="groupName" value={formData.groupName} onChange={handleChange} required
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Course Code</label>
                            <input 
                                type="text" name="courseCode" value={formData.courseCode} onChange={handleChange} required
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition uppercase" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Course Name</label>
                            <input 
                                type="text" name="courseName" value={formData.courseName} onChange={handleChange} required
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition" 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea 
                                name="description" value={formData.description} onChange={handleChange} rows="4" required
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition resize-none"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                                <MapPin size={14} /> Meeting Location / Link
                            </label>
                            <input 
                                type="text" name="meetingLocation" value={formData.meetingLocation} onChange={handleChange} required
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                                <BookOpen size={14} /> Faculty
                            </label>
                            <input 
                                type="text" name="faculty" value={formData.faculty} onChange={handleChange} required
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition" 
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" disabled={saving}
                            className="bg-[#002147] text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition flex items-center gap-2 shadow-md"
                        >
                            {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Member Management */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Users className="text-[#D4AF37]" size={20} /> Member Management
                    </h3>
                    <span className="text-xs font-bold text-[#002147] bg-blue-50 px-3 py-1 rounded-full">
                        {members.length} Total Members
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Member</th>
                                <th className="text-left px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Registration</th>
                                <th className="text-left px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="text-right px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {members.map(member => (
                                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-[#002147] flex items-center justify-center rounded-full text-white font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-medium text-gray-600 font-mono bg-white px-2 py-1 rounded border border-gray-100">
                                            {member.registrationNumber || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        {(member.id === formData.leaderId) ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37] bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                                                <Shield size={12} /> Leader
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">Member</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {member.id !== formData.leaderId && (
                                            <button 
                                                onClick={() => handleRemoveMember(member.id)}
                                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition"
                                                title="Remove Member"
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
        </div>
      </div>
    </div>
  );
};

export default GroupManagementPage;
