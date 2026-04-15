import React from 'react';
import { Users, MapPin, Calendar, Clock } from 'lucide-react';

const StudyGroupCard = ({ group }) => {
  return (
    <div className="card h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white tracking-tight">{group.title}</h3>
        <span className="px-3 py-1 text-[10px] font-black bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full uppercase tracking-widest">
          {group.subject}
        </span>
      </div>

      <p className="text-blue-100/70 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">{group.description}</p>

      <div className="space-y-3 mb-8 flex-grow">
        <div className="flex items-center text-xs font-bold text-blue-200/60 transition-colors hover:text-white">
          <Users className="h-4 w-4 mr-3 text-[#D4AF37]" />
          <span className="tracking-wide">{group.members}/{group.maxMembers} members</span>
        </div>
        <div className="flex items-center text-xs font-bold text-blue-200/60 transition-colors hover:text-white">
          <MapPin className="h-4 w-4 mr-3 text-[#D4AF37]" />
          <span className="tracking-wide">{group.location}</span>
        </div>
        <div className="flex items-center text-xs font-bold text-blue-200/60 transition-colors hover:text-white">
          <Calendar className="h-4 w-4 mr-3 text-[#D4AF37]" />
          <span className="tracking-wide">{group.schedule}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-auto">
        <div className="flex -space-x-2">
          {group.memberAvatars?.slice(0, 3).map((avatar, index) => (
            <img
              key={index}
              className="h-8 w-8 rounded-full border-2 border-[#002147] shadow-lg"
              src={avatar}
              alt="Member"
            />
          ))}
          {group.members > 3 && (
            <div className="h-8 w-8 rounded-full bg-white/5 border-2 border-[#002147] flex items-center justify-center backdrop-blur-sm">
              <span className="text-[10px] font-bold text-white">+{group.members - 3}</span>
            </div>
          )}
        </div>
        <button className="px-5 py-2.5 bg-[#D4AF37] text-[#002147] text-xs font-black rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-900/20 uppercase tracking-widest">
          Join Group
        </button>
      </div>
    </div>
  );
};

export default StudyGroupCard;