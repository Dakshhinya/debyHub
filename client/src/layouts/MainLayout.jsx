import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar.jsx';
import Sidebar from '../components/navigation/Sidebar.jsx';
import Footer from '../components/navigation/Footer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import {  AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Close sidebar when changing routes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check if current route is a debate room
  const isDebateRoom = location.pathname.includes('/debates/') && location.pathname.includes('/room');
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Navbar 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
        isMinimal={isDebateRoom}
      />
      
      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar - Only shown if authenticated and not in debate room */}
        {isAuthenticated && !isDebateRoom && (
          <AnimatePresence>
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Sidebar 
                  isOpen={isSidebarOpen} 
                  className="w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30"
                />
              </div>
            )}
          </AnimatePresence>
        )}
        
        {/* Desktop Sidebar */}
        {isAuthenticated && !isDebateRoom && (
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar />
          </div>
        )}
        
        {/* Main Content */}
        <main className={`flex-1 ${isDebateRoom ? 'p-0' : 'p-4 md:p-6'}`}>
          <Outlet />
        </main>
      </div>
      
      {/* Footer - Not shown in debate room */}
      {!isDebateRoom && <Footer />}
    </div>
  );
};

export default MainLayout;