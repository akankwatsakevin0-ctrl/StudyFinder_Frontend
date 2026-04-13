import React from 'react';
import GroupCard from '../components/GroupCard';

const BrowseGroups = () => {
  const ucuGroups = [
    { 
      id: 1, 
      name: "Web & Mobile App Dev", 
      courseCode: "CSC1202", 
      members: "0/15", 
      location: "FET Lab B",
      time: "Mondays 2-4 PM",
      description: "Project-based exam group for Easter 2026. Working on React and Node.js." 
    },
    { 
      id: 2, 
      name: "Data Structures", 
      courseCode: "CSC1107", 
      members: "0/10", 
      location: "Main Library",
      time: "Wednesdays 10 AM",
      description: "Reviewing algorithms and complexity analysis for upcoming assessments." 
    },
    { 
      id: 3, 
      name: "System Administration", 
      courseCode: "BIT1205", 
      members: "0/20", 
      location: "Online",
      time: "Fridays 5 PM",
      description: "Discussing server configurations and network security protocols." 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border-b-4 border-[#D4AF37]">
        <h1 className="text-3xl font-bold text-[#002147] mb-2">Find Your Study Group</h1>
        <p className="text-gray-600 mb-6">Discovery platform for UCU Computing students.</p>
        <div className="flex flex-wrap gap-4">
          <input 
            type="text" 
            placeholder="Search course code..." 
            className="flex-1 min-w-[250px] p-3 border rounded-lg focus:ring-2 focus:ring-[#002147] outline-none" 
          />
          <button className="bg-[#002147] text-white px-8 py-3 rounded-lg font-bold">
            Search
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {ucuGroups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

export default BrowseGroups;