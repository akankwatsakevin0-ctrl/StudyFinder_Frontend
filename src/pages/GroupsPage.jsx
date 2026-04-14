import React, { useState } from 'react';
import BrowseGroups from '../components/BrowseGroups';
import CreateGroup from '../components/CreateGroup';

const GroupsPage = () => {
  const [activeTab, setActiveTab] = useState('browse');

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'browse' ? 'bg-[#002147] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Browse Groups
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'create' ? 'bg-[#002147] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Create New Group
        </button>
      </div>

      {activeTab === 'browse' ? <BrowseGroups /> : <CreateGroup />}
    </div>
  );
};

export default GroupsPage;
