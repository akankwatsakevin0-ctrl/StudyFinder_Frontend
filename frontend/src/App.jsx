import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route 
              path="/" 
              element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/groups" 
              element={isLoggedIn ? <GroupsPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/login" 
              element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />} 
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


