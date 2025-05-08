import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Video, BarChart2, Settings } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-800 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600">Total Users</p>
              <p className="text-3xl font-bold text-neutral-800">5,234</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users size={24} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600">Active Debates</p>
              <p className="text-3xl font-bold text-neutral-800">42</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Video size={24} className="text-success" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600">Total Debates</p>
              <p className="text-3xl font-bold text-neutral-800">1,287</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center">
              <BarChart2 size={24} className="text-info" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600">System Health</p>
              <p className="text-3xl font-bold text-success">Good</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <Settings size={24} className="text-warning" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/users"
              className="p-4 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Users size={24} className="text-primary mb-2" />
              <h3 className="font-medium">Manage Users</h3>
              <p className="text-sm text-neutral-600">View and manage user accounts</p>
            </Link>
            
            <Link
              to="/admin/debates"
              className="p-4 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Video size={24} className="text-primary mb-2" />
              <h3 className="font-medium">Manage Debates</h3>
              <p className="text-sm text-neutral-600">Monitor and moderate debates</p>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Server Status</p>
                <p className="text-sm text-neutral-600">All systems operational</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-success"></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Video Service</p>
                <p className="text-sm text-neutral-600">Twilio integration active</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-success"></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-neutral-600">Connected and synced</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-success"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;