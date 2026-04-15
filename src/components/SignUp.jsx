import React, { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    password: '',
    confirmPassword: '',
    programOfStudy: '',
    yearOfStudy: '1'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        registrationNumber: formData.registrationNumber,
        password: formData.password,
        role: isAdmin ? 'admin' : 'student'
      };
      if (!isAdmin) {
        payload.programOfStudy = formData.programOfStudy;
        payload.yearOfStudy = parseInt(formData.yearOfStudy);
      }
      
      const userData = await authService.register(payload);
      
      if (onLogin) {
        onLogin(userData);
      }
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMsgs = err.response.data.errors.map(e => e.msg).join('. ');
        setError(errorMsgs);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto card mt-12 mb-20 relative overflow-hidden group">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Create Account</h2>
        <p className="text-blue-100/60 font-bold text-sm uppercase tracking-widest">Join the UCU Study Hub Community</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-center justify-center font-bold animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition text-white placeholder-white/10 font-bold" 
              placeholder="John Doe" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition text-white placeholder-white/10 font-bold" 
              placeholder="student@ucu.ac.ug" 
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 ml-1">Registration Number</label>
          <input 
            type="text" 
            name="registrationNumber"
            required
            value={formData.registrationNumber}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition text-white placeholder-white/10 font-bold" 
            placeholder="M2XBXXXXX" 
          />
        </div>

        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between group/toggle cursor-pointer hover:bg-white/10 transition-all">
          <label className="flex items-center text-sm font-bold text-blue-100 cursor-pointer w-full">
            <input 
              type="checkbox" 
              className="mr-4 w-5 h-5 cursor-pointer accent-[#D4AF37] rounded border-white/10 bg-black/20" 
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            /> 
            Register as Administrator
          </label>
          {isAdmin && <Shield size={18} className="text-[#D4AF37] animate-pulse" />}
        </div>

        {!isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in duration-300">
            <div>
              <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 ml-1">Program</label>
              <input 
                type="text" 
                name="programOfStudy"
                required={!isAdmin}
                value={formData.programOfStudy}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition text-white placeholder-white/10 font-bold" 
                placeholder="BSIT, LAW, etc." 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 ml-1">Year of Study</label>
              <select 
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition text-white font-bold appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map(y => <option key={y} value={y} className="bg-[#002147]">Year {y}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition text-white placeholder-white/10 font-bold" 
              placeholder="••••••••" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition text-white placeholder-white/10 font-bold" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#D4AF37] text-[#002147] py-4 rounded-xl font-black text-lg hover:bg-yellow-500 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-yellow-900/20 uppercase tracking-widest mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <div className="mt-10 text-center">
        <p className="text-xs text-blue-100/40 font-bold">
          Already have an account? <a href="/login" className="text-white hover:text-[#D4AF37] font-black transition-colors ml-1 uppercase tracking-widest">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

