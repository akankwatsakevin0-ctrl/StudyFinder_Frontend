import React from 'react';

const SignUp = () => {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border-t-4 border-[#D4AF37]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#002147]">Create Account</h2>
        <p className="text-gray-600">Join the UCU StudyGroup community</p>
      </div>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
            placeholder="John Doe" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
            placeholder="student@ucu.ac.ug" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Student ID (Optional)</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
            placeholder="M2XBXXXXX" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
            placeholder="••••••••" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
          <input 
            type="password" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
            placeholder="••••••••" 
          />
        </div>
        <button className="w-full bg-[#002147] text-white py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition mt-4">
          Create Account
        </button>
      </form>
      <div className="mt-8 text-center text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-[#002147] font-bold hover:underline">Sign In</a>
      </div>
    </div>
  );
};

export default SignUp;
