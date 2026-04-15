import React, { useState } from 'react';
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
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border-t-4 border-[#002147]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#002147]">Welcome Back</h2>
        <p className="text-gray-600 font-medium">Sign in to join your study groups</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center justify-center font-medium">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition" 
            placeholder="student@ucu.ac.ug" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition" 
            placeholder="••••••••" 
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="text-sm font-semibold text-[#002147] hover:underline">Forgot password?</a>
        </div>
        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#002147] text-white py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="mt-8 text-center text-sm text-gray-600">
        Don't have an account? <a href="/signup" className="text-[#D4AF37] font-bold hover:underline">Create an account</a>
      </div>
    </div>
  );
};

export default Login;


