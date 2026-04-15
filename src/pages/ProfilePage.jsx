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
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center text-xs font-black text-blue-100/60 hover:text-[#D4AF37] transition-all group uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5 mb-10">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Hub
      </Link>

      <div className="card overflow-hidden !p-0 border-white/10 shadow-2xl">
        {/* Header Section */}
        <div className="bg-[#002147] px-10 py-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#D4AF37] to-[#D4AF37]/50"></div>
          <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12">
            <User size={250} className="text-white" />
          </div>
          <div className="flex items-center space-x-8 relative z-10">
            <div className="bg-[#D4AF37] p-1 rounded-3xl shadow-2xl">
               <div className="bg-[#002147] p-6 rounded-[22px]">
                <User size={64} className="text-[#D4AF37]" />
               </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter mb-1">{user.name}</h1>
              <p className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-[10px]">Active UCU Student Account</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-10 py-12 bg-white/2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <ProfileItem 
                icon={<Mail className="text-[#D4AF37]" size={20} />} 
                label="Academic Email" 
                value={user.email} 
              />
              <ProfileItem 
                icon={<Hash className="text-[#D4AF37]" size={20} />} 
                label="Access ID / Reg No" 
                value={user.registrationNumber || 'Pending Verification'} 
              />
            </div>
            <div className="space-y-8">
              <ProfileItem 
                icon={<BookOpen className="text-[#D4AF37]" size={20} />} 
                label="Department / Program" 
                value={user.programOfStudy || 'Not Specified'} 
              />
              <ProfileItem 
                icon={<Calendar className="text-[#D4AF37]" size={20} />} 
                label="Current Stage / Year" 
                value={user.yearOfStudy ? `Year ${user.yearOfStudy}` : 'Year 1'} 
              />
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-white/5">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black text-blue-100/30 uppercase tracking-widest mb-3">Verification Badge</h3>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-3 shadow-[0_0_15px_rgba(34,197,94,0.4)]"></div>
                  <span className="text-white font-black uppercase tracking-widest text-xs">Identity Verified by UCU Registry</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                 <Hash size={20} className="text-blue-100/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-5 p-6 rounded-[24px] bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 hover:bg-white/10 transition-all group/item shadow-inner">
    <div className="bg-black/20 p-4 rounded-2xl border border-white/10 group-hover/item:border-[#D4AF37]/50 transition-all shadow-lg">{icon}</div>
    <div className="flex-grow pt-1">
      <p className="text-[10px] font-black text-blue-100/30 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-lg font-black text-white tracking-tight leading-none">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
