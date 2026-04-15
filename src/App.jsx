import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

import ProfilePage from './pages/ProfilePage';
import GroupDetailsPage from './pages/GroupDetailsPage';
import GroupManagementPage from './pages/GroupManagementPage';
import CreateSessionPage from './pages/CreateSessionPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUser(userData);
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

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
        <Toaster position="top-right" />
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
              path="/groups/:id" 
              element={isLoggedIn ? <GroupDetailsPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/groups/:id/manage" 
              element={isLoggedIn ? <GroupManagementPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/groups/:id/sessions/create" 
              element={isLoggedIn ? <CreateSessionPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/profile" 
              element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/login" 
              element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />} 
            />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" replace /> : <SignUpPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


