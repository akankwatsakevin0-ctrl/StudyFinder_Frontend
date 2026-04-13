import React from 'react';
import { Search, Plus, Users } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">Study Group Finder</h1>
          </div>
          <nav className="flex space-x-4">
            <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              <Search className="h-4 w-4 mr-2" />
              Find Groups
            </button>
            <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;