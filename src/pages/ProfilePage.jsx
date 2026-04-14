import React from 'react';
import { User, Mail, Hash, BookOpen, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  // In a real app, this would come from a global state or a hook
  // For now, we'll try to get it from localStorage which is where api.js saves it
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No User Found</h2>
        <Link to="/login" className="text-blue-600 hover:underline">Please log in to view your profile.</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#002147] transition mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-[#002147] px-8 py-10 relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <User size={120} className="text-white" />
          </div>
          <div className="flex items-center space-x-6 relative z-10">
            <div className="bg-[#D4AF37] p-4 rounded-2xl shadow-lg border-2 border-white/20">
              <User size={48} className="text-[#002147]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">{user.name}</h1>
              <p className="text-blue-100 font-medium">Student Profile</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ProfileItem 
                icon={<Mail className="text-[#D4AF37]" size={20} />} 
                label="Email Address" 
                value={user.email} 
              />
              <ProfileItem 
                icon={<Hash className="text-[#D4AF37]" size={20} />} 
                label="Registration Number" 
                value={user.registrationNumber || 'Not Provided'} 
              />
            </div>
            <div className="space-y-6">
              <ProfileItem 
                icon={<BookOpen className="text-[#D4AF37]" size={20} />} 
                label="Program of Study" 
                value={user.programOfStudy || 'Not Provided'} 
              />
              <ProfileItem 
                icon={<Calendar className="text-[#D4AF37]" size={20} />} 
                label="Year of Study" 
                value={user.yearOfStudy ? `Year ${user.yearOfStudy}` : 'Not Provided'} 
              />
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider mb-2">Account Status</h3>
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                <span className="text-green-700 font-semibold">Active Student Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
