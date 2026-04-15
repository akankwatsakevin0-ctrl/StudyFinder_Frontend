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
      const response = await authService.login(email, password);
      // Depending on backend, token and user are in response
      if (response && response.user && response.user.role === 'admin') {
        onLogin(response.user); // Pass the user object to App state
        navigate('/admin');
      } else {
        setError('Access Denied. Administrator privileges required.');
        authService.logout();
      }
    } catch (err) {
      console.error('Admin login error:', err);
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg mt-10 border-t-4 border-[#D4AF37]">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="bg-[#002147] p-3 rounded-full mb-4 shadow-sm">
             <Shield className="text-[#D4AF37]" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-[#002147]">Admin Portal</h2>
          <p className="text-gray-600 font-medium mt-1">Secure sign in for administrators</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center justify-center font-medium shadow-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition" 
              placeholder="admin@ucu.ac.ug" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#002147] text-white py-3 border border-transparent rounded-lg font-bold text-lg hover:bg-gray-900 transition shadow-md flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Authenticating...' : 'Secure Sign In'}
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500 font-medium">
          Not an administrator? <Link to="/login" className="text-[#002147] font-bold hover:text-[#D4AF37] transition">Student Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
