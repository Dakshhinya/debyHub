import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, Settings, Search, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import Logo from '../common/Logo.jsx';

const Navbar = ({ toggleSidebar, isSidebarOpen, isMinimal = false }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header 
      className={`sticky top-0 z-10 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'
      } ${isMinimal ? 'py-2' : 'py-3'}`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left Section: Logo and Menu Toggle */}
        <div className="flex items-center">
          {isAuthenticated && (
            <button 
              onClick={toggleSidebar}
              className="mr-3 lg:hidden p-1 rounded-full hover:bg-neutral-200 transition-colors"
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              {isSidebarOpen ? (
                <X size={24} className="text-neutral-700" />
              ) : (
                <Menu size={24} className="text-neutral-700" />
              )}
            </button>
          )}
          
          <Link to="/" className="flex items-center">
            <Logo className={isMinimal ? "h-8 w-8" : "h-10 w-10"} />
            {!isMinimal && (
              <span className="ml-2 text-lg md:text-xl font-bold text-primary">
                DebateHub
              </span>
            )}
          </Link>
        </div>
        
        {/* Center: Search (hide on small screens) */}
        {!isMinimal && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for debates..."
                className="input pl-10 pr-4 py-2 text-sm focus:ring-primary"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            </div>
          </div>
        )}
        
        {/* Right Section: Navigation */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {!isMinimal && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-neutral-200 transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-neutral-700" />
              ) : (
                <Moon size={20} className="text-neutral-700" />
              )}
            </button>
          )}
          
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <button
                className="p-2 rounded-full hover:bg-neutral-200 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-neutral-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>
              
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1 p-1 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {!isMinimal && (
                    <span className="hidden md:block text-sm font-medium truncate max-w-[100px]">
                      {user?.name || 'User'}
                    </span>
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                    <div className="px-4 py-2 border-b border-neutral-200">
                      <p className="text-sm font-medium text-neutral-800">{user?.name || 'User'}</p>
                      <p className="text-xs text-neutral-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-error hover:bg-neutral-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost hidden md:inline-flex">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;