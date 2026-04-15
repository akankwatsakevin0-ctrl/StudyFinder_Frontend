import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Shield } from 'lucide-react';

const AdminLoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userData = await authService.login(email, password);
      
      if (userData && (userData.role === 'admin' || userData.role === 'user')) { // allowing for both just in case
        onLogin(userData);
        navigate('/admin');
      } else {
        setError('Access Denied. Administrator privileges required.');
        authService.logout();
      }
    } catch (err) {
      console.error('Admin login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid admin email or password.');
      } else {
        setError(err.response?.data?.message || err.response?.data?.msg || 'An error occurred during sign in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full card relative overflow-hidden group">
        {/* Security bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37] opacity-60"></div>
        
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="bg-[#D4AF37]/10 p-5 rounded-2xl mb-6 border border-[#D4AF37]/20 shadow-xl shadow-yellow-900/10">
             <Shield className="text-[#D4AF37]" size={48} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Admin Portal</h2>
          <p className="text-blue-100/50 font-black mt-2 uppercase tracking-widest text-[10px]">Secure Gateway • UCU Systems</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl flex items-center justify-center font-bold animate-in zoom-in duration-300">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 ml-1">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition text-white placeholder-white/10 font-bold" 
              placeholder="admin@ucu.ac.ug" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 ml-1">Master Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition text-white placeholder-white/10 font-bold" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#002147] text-white py-4 border border-white/20 rounded-xl font-black text-lg hover:bg-black transition-all transform hover:scale-[1.02] shadow-2xl flex justify-center items-center group-hover:border-[#D4AF37]/50 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Decrypting Access...' : 'Secure Sign In'}
          </button>
        </form>
        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-blue-100/30 font-black uppercase tracking-widest mb-4">Unrestricted Access?</p>
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black text-white hover:text-[#D4AF37] transition-colors uppercase tracking-widest">
            Switch to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
