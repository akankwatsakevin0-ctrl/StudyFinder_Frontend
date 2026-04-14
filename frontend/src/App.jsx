import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BrowseGroups from './components/BrowseGroups';
import CreateGroup from './components/CreateGroup';

function App() {
  const [view, setView] = useState('browse');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setView={setView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'browse' && <BrowseGroups />}
        {view === 'create' && <CreateGroup />}
        {view === 'dashboard' && (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <h1 className="text-3xl font-bold text-[#002147] mb-4">My Dashboard</h1>
            <p className="text-gray-600">This area is reserved for your saved groups and dashboard tools.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
