import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, AlignLeft, ArrowLeft, PlusCircle, CheckCircle } from 'lucide-react';
import { sessionService } from '../services/api';
import toast from 'react-hot-toast';

const CreateSessionPage = () => {
    const { id: groupId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        topic: '',
        description: '',
        sessionDate: '',
        sessionTime: '',
        location: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await sessionService.createSession({
                ...formData,
                groupId
            });
            toast.success('Study session scheduled successfully!');
            navigate(`/groups/${groupId}`);
        } catch (err) {
            console.error('Session creation error:', err);
            toast.error(err.response?.data?.message || 'Failed to create session.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Link to={`/groups/${groupId}/manage`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#002147] mb-8 transition group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Management
            </Link>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                <div className="bg-[#002147] px-10 py-12 text-center relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Calendar size={120} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">Schedule Study Session</h1>
                    <p className="text-blue-100 font-medium">Coordinate a gathering for your group members</p>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <PlusCircle size={16} className="text-[#D4AF37]" /> Session Topic
                            </label>
                            <input 
                                type="text" name="topic" value={formData.topic} onChange={handleChange} required
                                placeholder="e.g., Exam Revision: Database Systems"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#002147] outline-none transition font-medium" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <AlignLeft size={16} className="text-[#D4AF37]" /> Brief Description
                            </label>
                            <textarea 
                                name="description" value={formData.description} onChange={handleChange} rows="3" required
                                placeholder="What will the group focus on during this session?"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#002147] outline-none transition resize-none"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar size={16} className="text-[#D4AF37]" /> Date
                                </label>
                                <input 
                                    type="date" name="sessionDate" value={formData.sessionDate} onChange={handleChange} required
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#002147] outline-none transition" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Clock size={16} className="text-[#D4AF37]" /> Time
                                </label>
                                <input 
                                    type="time" name="sessionTime" value={formData.sessionTime} onChange={handleChange} required
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#002147] outline-none transition" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin size={16} className="text-[#D4AF37]" /> Meeting Location or Link
                            </label>
                            <input 
                                type="text" name="location" value={formData.location} onChange={handleChange} required
                                placeholder="e.g., Computer Lab 2 or Zoom Link"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#002147] outline-none transition" 
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex gap-4">
                        <button 
                            type="button" onClick={() => navigate(-1)}
                            className="flex-1 px-8 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition border border-gray-100"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" disabled={loading}
                            className="flex-[2] bg-[#002147] text-white px-8 py-4 rounded-xl font-bold hover:bg-opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <><CheckCircle size={20} /> Schedule Session</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSessionPage;
