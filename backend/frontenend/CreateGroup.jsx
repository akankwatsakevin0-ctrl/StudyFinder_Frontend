import React from 'react';

const CreateGroup = () => (
  <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
    <h2 className="text-2xl font-bold text-ucuBlue border-b-2 border-ucuGold pb-2 mb-6">Start a New Group</h2>
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700">Group Title</label>
        <input type="text" className="w-full p-3 border rounded mt-1" placeholder="e.g., CSC1202 Project Team" />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700">Course Code</label>
        <input type="text" className="w-full p-3 border rounded mt-1" placeholder="CSC1202" />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700">Meeting Type/Location</label>
        <input type="text" className="w-full p-3 border rounded mt-1" placeholder="Main Library or Online [cite: 63]" />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700">Focus Area</label>
        <textarea className="w-full p-3 border rounded mt-1 h-24" placeholder="What are the goals of this group? [cite: 62]"></textarea>
      </div>
      <button className="w-full bg-ucuBlue text-white py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition">
        Create Group
      </button>
    </form>
  </div>
);

export default CreateGroup; 