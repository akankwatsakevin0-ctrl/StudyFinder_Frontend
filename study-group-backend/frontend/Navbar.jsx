import React from 'react';
import { Search, PlusCircle, LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = ({ setView }) => (
  <nav className="bg-ucuBlue text-white shadow-md sticky top-0 z-50">
    <div className="container mx-auto px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('browse')}>
        <div className="bg-ucuGold text-ucuBlue font-bold w-10 h-10 rounded-full flex items-center justify-center">UCU</div>
        <span className="text-xl font-bold tracking-tight">StudyGroup Finder</span>
      </div>
      
      <div className="flex space-x-8">
        <button onClick={() => setView('browse')} className="flex items-center gap-2 hover:text-ucuGold transition"><Search size={18}/> Browse</button>
        <button onClick={() => setView('create')} className="flex items-center gap-2 hover:text-ucuGold transition"><PlusCircle size={18}/> Create</button>
        <button onClick={() => setView('dashboard')} className="flex items-center gap-2 hover:text-ucuGold transition"><LayoutDashboard size={18}/> My Dashboard</button>
      </div>

      <button className="bg-ucuGold text-ucuBlue px-5 py-2 rounded font-bold hover:bg-yellow-500 transition flex items-center gap-2">
        <LogOut size={18}/> Logout
      </button>
    </div>
  </nav>
);

export default Navbar;