import React from 'react';
import { Users, MapPin, Calendar, Clock } from 'lucide-react';

const StudyGroupCard = ({ group }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {group.subject}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{group.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-2" />
          {group.members}/{group.maxMembers} members
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-2" />
          {group.location}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          {group.schedule}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          {group.duration}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {group.memberAvatars?.slice(0, 3).map((avatar, index) => (
            <img
              key={index}
              className="h-8 w-8 rounded-full border-2 border-white"
              src={avatar}
              alt="Member"
            />
          ))}
          {group.members > 3 && (
            <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
              <span className="text-xs text-gray-600">+{group.members - 3}</span>
            </div>
          )}
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
          Join Group
        </button>
      </div>
    </div>
  );
};

export default StudyGroupCard;