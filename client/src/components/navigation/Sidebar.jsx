import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Award, 
  Users, 
  Settings, 
  HelpCircle,
  PlusCircle,
  Video,
  History,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Star,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    myDebates: true,
    upcoming: false
  });
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Navigation Links
  const navLinks = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />
    },
    {
      title: 'Explore Debates',
      path: '/debates',
      icon: <Video size={20} />
    },
    {
      title: 'Schedule',
      path: '/schedule',
      icon: <Calendar size={20} />
    },
    {
      title: 'Leaderboard',
      path: '/leaderboard',
      icon: <Award size={20} />
    }
  ];
  
  // Admin links
  const adminLinks = [
    {
      title: 'Admin Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />
    },
    {
      title: 'Manage Users',
      path: '/admin/users',
      icon: <Users size={20} />
    },
    {
      title: 'Manage Debates',
      path: '/admin/debates',
      icon: <Video size={20} />
    }
  ];
  
  // Recent debates mock data
  const recentDebates = [
    { id: 1, title: 'Climate Change Solutions', date: '2025-06-15' },
    { id: 2, title: 'AI Ethics and Governance', date: '2025-06-12' },
    { id: 3, title: 'Education Reform Debate', date: '2025-06-10' }
  ];
  
  return (
    <aside className={`h-full bg-white border-r border-neutral-200 overflow-y-auto ${
      isOpen !== undefined ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''
    } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <div className="px-4 py-6">
        {/* User Quick Info */}
        {user && (
          <div className="flex items-center mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium text-lg">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3">
              <p className="font-medium text-neutral-800 text-sm">{user.name || 'User'}</p>
              <p className="text-xs text-neutral-500">{user.role || 'Member'}</p>
            </div>
          </div>
        )}
        
        {/* Main Navigation */}
        <nav className="space-y-1 mb-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-primary text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.title}
            </Link>
          ))}
          
          {/* Create Debate - Only for moderators */}
          {(user?.role === 'moderator' || user?.role === 'admin') && (
            <Link
              to="/debates/create"
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-accent hover:bg-neutral-100 transition-colors"
            >
              <span className="mr-3"><PlusCircle size={20} /></span>
              Create Debate
            </Link>
          )}
        </nav>
        
        {/* My Debates Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('myDebates')}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-neutral-700"
          >
            <span>My Debates</span>
            {expandedSections.myDebates ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
          
          {expandedSections.myDebates && (
            <div className="mt-1 pl-2">
              {recentDebates.map(debate => (
                <Link
                  key={debate.id}
                  to={`/debates/${debate.id}`}
                  className="flex items-center px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  <History size={16} className="mr-2 text-neutral-400" />
                  <span className="truncate">{debate.title}</span>
                </Link>
              ))}
              
              <Link
                to="/debates/my-debates"
                className="flex items-center px-4 py-2 mt-1 text-xs text-primary font-medium hover:underline"
              >
                View all my debates
              </Link>
            </div>
          )}
        </div>
        
        {/* Upcoming Debates */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('upcoming')}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-neutral-700"
          >
            <span>Upcoming Debates</span>
            {expandedSections.upcoming ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
          
          {expandedSections.upcoming && (
            <div className="mt-1 pl-2">
              <Link
                to="/debates/123"
                className="flex items-center px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                <Clock size={16} className="mr-2 text-neutral-400" />
                <div className="flex flex-col">
                  <span className="truncate">Education Policy Debate</span>
                  <span className="text-xs text-neutral-500">Today, 7:00 PM</span>
                </div>
              </Link>
              
              <Link
                to="/debates/124"
                className="flex items-center px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                <Clock size={16} className="mr-2 text-neutral-400" />
                <div className="flex flex-col">
                  <span className="truncate">Economic Recovery Plan</span>
                  <span className="text-xs text-neutral-500">Tomorrow, 3:30 PM</span>
                </div>
              </Link>
            </div>
          )}
        </div>
        
        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="mb-6">
            <h4 className="px-3 py-2 text-xs font-semibold uppercase text-neutral-500">
              Administration
            </h4>
            <nav className="space-y-1">
              {adminLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-accent text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        )}
        
        {/* Footer Links */}
        <div className="pt-4 border-t border-neutral-200">
          <Link
            to="/settings"
            className="flex items-center px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg"
          >
            <Settings size={18} className="mr-3" />
            Settings
          </Link>
          <Link
            to="/help"
            className="flex items-center px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg"
          >
            <HelpCircle size={18} className="mr-3" />
            Help & Support
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;