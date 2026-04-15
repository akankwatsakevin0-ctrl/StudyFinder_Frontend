import React, { useState } from 'react';
import { groupService } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    groupName: '',
    courseCode: '',
    courseName: '',
    faculty: '',
    description: '',
    meetingLocation: '',
    meetingType: 'physical'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newGroup = await groupService.createGroup(formData);
      toast.success('Group created successfully! You are now the leader.');
      // Auto-navigate to the newly created group page or dashboard
      if (newGroup && newGroup.id) {
        navigate(`/groups/${newGroup.id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Error creating group:', err);
      toast.error(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border-t-4 border-[#002147]">
      <h2 className="text-3xl font-black text-[#002147] border-b-2 border-[#D4AF37] pb-4 mb-8">Start a New Peer Group</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Group Title</label>
            <input name="groupName" value={formData.groupName} onChange={handleChange} required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g., Data Structures Titans" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Faculty / Department</label>
            <select name="faculty" value={formData.faculty} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none appearance-none">
              <option value="" disabled>Select Faculty</option>
              <option value="Computing and Informatics">Computing and Informatics</option>
              <option value="Law">Law</option>
              <option value="Business">Business</option>
              <option value="Theology">Theology</option>
              <option value="Education">Education</option>
              <option value="Social Sciences">Social Sciences</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Course Code</label>
            <input name="courseCode" value={formData.courseCode} onChange={handleChange} required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g., CSC1202" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Course Name</label>
            <input name="courseName" value={formData.courseName} onChange={handleChange} required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder="e.g., Advanced Programming" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Meeting Format</label>
            <select name="meetingType" value={formData.meetingType} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none appearance-none">
              <option value="physical">Physical Collaboration</option>
              <option value="online">Online / Virtual</option>
              <option value="hybrid">Hybrid Approach</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Location Details</label>
            <input name="meetingLocation" value={formData.meetingLocation} onChange={handleChange} required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" placeholder={formData.meetingType === 'online' ? "e.g., Google Meet link / Zoom" : "e.g., UCU Main Library, Room 4"} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Group Objectives & Focus Area</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none h-28 resize-none" placeholder="Describe what attendees will learn, the syllabus coverage, and group goals..."></textarea>
        </div>

        <button disabled={loading} type="submit" className={`w-full bg-[#002147] text-white py-4 rounded-xl font-black text-lg hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading ? 'Initializing Group...' : 'Create Study Group'}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
