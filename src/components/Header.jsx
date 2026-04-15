import React from 'react';
import { Search, Plus, Users } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#002147]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center group cursor-pointer">
            <div className="bg-white/5 p-2 rounded-xl border border-white/10 group-hover:border-[#D4AF37]/50 transition-all shadow-inner">
              <Users className="h-8 w-8 text-[#D4AF37]" />
            </div>
            <h1 className="ml-4 text-2xl font-black text-white tracking-tight group-hover:text-[#D4AF37] transition-colors">Study Group Finder</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <button className="flex items-center px-4 py-2.5 rounded-xl text-sm font-bold text-blue-100 hover:text-white hover:bg-white/5 transition-all">
              <Search className="h-5 w-5 mr-2 text-[#D4AF37]" />
              Find Groups
            </button>
            <button className="flex items-center px-5 py-2.5 rounded-xl text-sm font-black bg-[#D4AF37] text-[#002147] hover:bg-yellow-500 transform hover:scale-105 transition-all shadow-lg shadow-yellow-900/20 active:scale-95">
              <Plus className="h-5 w-5 mr-2" />
              Create Group
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;