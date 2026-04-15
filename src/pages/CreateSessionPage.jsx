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
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Link to={`/groups/${groupId}/manage`} className="inline-flex items-center text-xs font-black text-blue-100/60 hover:text-[#D4AF37] transition-all group uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5 mb-10">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Return to Control Panel
      </Link>

      <div className="card overflow-hidden !p-0 border-white/10 shadow-2xl">
        <div className="bg-[#002147] px-10 py-12 relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#D4AF37] to-[#D4AF37]/50"></div>
          <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12">
            <Calendar size={250} className="text-white" />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Initialize Study Session</h1>
            <p className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-[10px]">Coordinate and Broadcast Hub Gathering</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 bg-white/2">
          <div className="space-y-8">
            <div className="group/field">
              <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                <PlusCircle size={14} /> Academic Subject / Topic
              </label>
              <input 
                type="text" name="topic" value={formData.topic} onChange={handleChange} required
                placeholder="e.g., Final Prep: Distributed Systems Architecture"
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-white placeholder-white/10 font-bold" 
              />
            </div>

            <div className="group/field">
              <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                <AlignLeft size={14} /> Comprehensive Summary
              </label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} rows="4" required
                placeholder="Detail the focal points and objectives of this research session..."
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none text-white font-medium placeholder-white/10 leading-relaxed"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group/field">
                <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                  <Calendar size={14} /> Scheduled Date
                </label>
                <input 
                  type="date" name="sessionDate" value={formData.sessionDate} onChange={handleChange} required
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition text-white font-bold" 
                />
              </div>
              <div className="group/field">
                <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                  <Clock size={14} /> Execution Time
                </label>
                <input 
                  type="time" name="sessionTime" value={formData.sessionTime} onChange={handleChange} required
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition text-white font-bold" 
                />
              </div>
            </div>

            <div className="group/field">
              <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                <MapPin size={14} /> Meeting Coordinate (Physical or Digital)
              </label>
              <input 
                type="text" name="location" value={formData.location} onChange={handleChange} required
                placeholder="e.g., Block B - Lab 404 or Enterprise Zoom URI"
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-white placeholder-white/10 font-bold" 
              />
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row gap-6">
            <button 
              type="button" onClick={() => navigate(-1)}
              className="flex-1 px-8 py-5 rounded-2xl font-black text-blue-100/30 hover:text-white hover:bg-white/5 transition-all border border-white/5 uppercase tracking-widest text-xs"
            >
              Cancel Operation
            </button>
            <button 
              type="submit" disabled={loading}
              className="flex-[2] bg-[#D4AF37] text-[#002147] px-10 py-5 rounded-2xl font-black hover:bg-yellow-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-yellow-900/20 uppercase tracking-widest text-xs active:scale-95 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#002147]"></div>
              ) : (
                <><CheckCircle size={20} /> Authorize Session</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    );
};

export default CreateSessionPage;
