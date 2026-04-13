import React from 'react';
import { Users, MapPin, Clock } from 'lucide-react';

const GroupCard = ({ group }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col">
    <div className="bg-[#002147] h-2"></div>
    
    <div className="p-6 flex-grow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-[#002147] bg-blue-50 px-2 py-1 rounded border border-blue-100">
          {group.courseCode}
        </span>
        <div className="flex items-center text-gray-500 text-sm gap-1">
          <Users size={14}/> <span>{group.members}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">{group.name}</h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{group.description}</p>
      
      <div className="space-y-2 mb-2">
        <div className="flex items-center text-gray-500 text-xs gap-2">
          <MapPin size={14} className="text-[#D4AF37]" /> <span>{group.location}</span>
        </div>
        <div className="flex items-center text-gray-500 text-xs gap-2">
          <Clock size={14} className="text-[#D4AF37]" /> <span>{group.time}</span>
        </div>
      </div>
    </div>

    <div className="px-6 pb-6 mt-auto">
      <button className="w-full bg-[#002147] text-white py-2 rounded-lg font-bold hover:bg-opacity-90 transition">
        Join Group
      </button>
    </div>
  </div>
);

export default GroupCard;
