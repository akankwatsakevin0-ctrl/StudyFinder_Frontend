import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userData = await authService.login(email, password);
      
      if (userData.role === 'admin') {
        setError('Administrators must log in via the Admin Portal.');
        authService.logout();
        setIsLoading(false);
        return;
      }
      
      onLogin(userData);
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.errors) {
        const errorMsgs = err.response.data.errors.map(e => e.msg).join('. ');
        setError(errorMsgs);
      } else {
        setError(err.response?.data?.message || err.response?.data?.msg || 'Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card mt-8 mb-12 relative overflow-hidden group">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white tracking-tighter mb-1">Welcome Back</h2>
        <p className="text-blue-100/60 font-bold text-xs uppercase tracking-widest">Sign in to your UCU study hub</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-center justify-center font-bold animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition text-white placeholder-white/20 font-bold text-sm" 
            placeholder="student@ucu.ac.ug" 
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-1.5 ml-1">Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition text-white placeholder-white/20 font-bold text-sm" 
            placeholder="••••••••" 
          />
        </div>
        <div className="flex items-center justify-between px-2">
          <label className="flex items-center text-xs font-bold text-blue-100/40 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" className="mr-2 rounded border-white/10 bg-white/5 accent-[#D4AF37]" /> Remember me
          </label>
          <a href="#" className="text-xs font-black text-[#D4AF37] hover:underline uppercase tracking-widest">Forgot password?</a>
        </div>
        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#D4AF37] text-[#002147] py-2.5 rounded-xl font-black text-sm hover:bg-yellow-500 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-900/20 uppercase tracking-widest ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
      <div className="mt-6 text-center space-y-3">
        <p className="text-xs text-blue-100/40 font-bold">
          Don't have an account? <Link to="/signup" className="text-white hover:text-[#D4AF37] transition-colors ml-1">Create an account</Link>
        </p>
        <div className="pt-4 border-t border-white/5">
          <p className="text-[10px] text-blue-100/30 font-black uppercase tracking-widest mb-2">Staff & Administration</p>
          <Link to="/admin/login" className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-white font-black hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all uppercase tracking-widest">
            Admin Portal Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


