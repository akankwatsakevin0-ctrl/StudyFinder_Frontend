import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import GroupCard from './GroupCard';
import { groupService } from '../services/api';

const BrowseGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await groupService.getAllGroups();
      setGroups(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load study groups. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (groupId) => {
    try {
      await groupService.joinGroup(groupId);
      toast.success('Successfully joined the group!');
      navigate(`/groups/${groupId}`);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to join group. Please try again.';
      toast.error(message);
    }
  };

  const filteredGroups = groups.filter(group => 
    group.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-[#D4AF37]">
        <h1 className="text-3xl font-bold text-[#002147] mb-2">Find Your Study Group</h1>
        <p className="text-gray-600 mb-6">Discovery platform for UCU Computing students.</p>
        <div className="flex flex-wrap gap-4">
          <input 
            type="text" 
            placeholder="Search course code or group name..." 
            className="flex-1 min-w-[250px] p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            className="bg-[#002147] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#003366] transition-colors"
            onClick={fetchGroups}
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002147] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading groups...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm">
          <p className="text-gray-600">No study groups found matching your search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <GroupCard 
              key={group.id} 
              onJoin={handleJoin}
              group={{
                ...group,
                name: group.groupName,
                location: group.meetingLocation,
                members: 'Joined' // Simplified status for now
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseGroups;
