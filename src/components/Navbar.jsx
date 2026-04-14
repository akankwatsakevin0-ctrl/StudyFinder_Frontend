import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, LayoutDashboard, LogOut, UserPlus, LogIn, User } from 'lucide-react';

const Navbar = ({ isLoggedIn, user, onLogout }) => {
  const activeStyle = "flex items-center gap-2 text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 transition";
  const inactiveStyle = "flex items-center gap-2 hover:text-[#D4AF37] transition pb-1 border-b-2 border-transparent";

  return (
    <nav className="bg-[#002147] text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 cursor-pointer">
          <div className="bg-[#D4AF37] text-[#002147] font-bold w-10 h-10 rounded-full flex items-center justify-center">UCU</div>
          <span className="text-xl font-bold tracking-tight">StudyGroup Finder</span>
        </Link>
        
        <div className="flex space-x-8 items-center">
          <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
            <LayoutDashboard size={18}/> My Dashboard
          </NavLink>
          <NavLink to="/groups" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
            <Search size={18}/> Groups
          </NavLink>
          <div className="flex items-center space-x-4 border-l border-gray-700 pl-8">
            {isLoggedIn ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center gap-3 bg-[#001a38] px-4 py-2 rounded-full border border-gray-700">
                  <div className="bg-[#D4AF37] p-1.5 rounded-full text-[#002147]">
                    <User size={20} />
                  </div>
                  <span className="font-semibold text-sm tracking-wide">{user?.name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition text-xs font-bold uppercase tracking-widest"
                >
                  <LogOut size={14}/> Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 hover:text-[#D4AF37] transition font-semibold">
                  <LogIn size={18}/> Login
                </Link>
                <Link to="/signup" className="bg-[#D4AF37] text-[#002147] px-5 py-2 rounded font-bold hover:bg-yellow-500 transition flex items-center gap-2">
                  <UserPlus size={18}/> Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


