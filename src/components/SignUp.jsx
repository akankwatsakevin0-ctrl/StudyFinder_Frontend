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
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border-t-4 border-[#D4AF37]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#002147]">Create Account</h2>
        <p className="text-gray-600">Join the UCU StudyGroup community</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
            placeholder="John Doe" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
            placeholder="student@ucu.ac.ug" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Registration Number</label>
          <input 
            type="text" 
            name="registrationNumber"
            required
            value={formData.registrationNumber}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
            placeholder="M2XBXXXXX" 
          />
        </div>
        <div className="flex items-center justify-between mt-2 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <label className="flex items-center text-sm font-bold text-gray-700 cursor-pointer w-full">
            <input 
              type="checkbox" 
              className="mr-3 w-4 h-4 cursor-pointer" 
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            /> 
            Register as Administrator
          </label>
        </div>

        {!isAdmin && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Program</label>
              <input 
                type="text" 
                name="programOfStudy"
                required={!isAdmin}
                value={formData.programOfStudy}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none text-sm" 
                placeholder="BSIT" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Year</label>
              <select 
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none text-sm"
              >
                {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
            placeholder="••••••••" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
            placeholder="••••••••" 
          />
        </div>
        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#002147] text-white py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <div className="mt-8 text-center text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-[#002147] font-bold hover:underline">Sign In</a>
      </div>
    </div>
  );
};

export default SignUp;

