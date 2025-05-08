import React, { useState } from 'react';
import { 
  Search, Filter, Trash2, Edit2, MoreVertical,
  ChevronLeft, ChevronRight, Video, Calendar,
  Users, MessageSquare, Eye, EyeOff
} from 'lucide-react';

const ManageDebates = () => {
  const [selectedDebates, setSelectedDebates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Mock debate data
  const debates = [
    {
      id: 1,
      title: 'The Future of Renewable Energy',
      category: 'Environment',
      status: 'upcoming',
      moderator: 'Sarah Johnson',
      participants: 6,
      scheduledFor: '2025-06-15T18:00:00Z',
      visibility: 'public'
    },
    {
      id: 2,
      title: 'Artificial Intelligence Ethics',
      category: 'Technology',
      status: 'live',
      moderator: 'Michael Rodriguez',
      participants: 4,
      scheduledFor: '2025-06-18T20:00:00Z',
      visibility: 'public'
    },
    {
      id: 3,
      title: 'Education Reform Debate',
      category: 'Education',
      status: 'completed',
      moderator: 'Dana Morgan',
      participants: 8,
      scheduledFor: '2025-06-20T17:30:00Z',
      visibility: 'private'
    }
  ];
  
  const handleSelectDebate = (debateId) => {
    if (selectedDebates.includes(debateId)) {
      setSelectedDebates(selectedDebates.filter(id => id !== debateId));
    } else {
      setSelectedDebates([...selectedDebates, debateId]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedDebates.length === debates.length) {
      setSelectedDebates([]);
    } else {
      setSelectedDebates(debates.map(debate => debate.id));
    }
  };
  
  // Format date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Manage Debates</h1>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
            <input
              type="text"
              placeholder="Search debates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-ghost border border-neutral-300 flex items-center"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="label">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Categories</option>
                <option value="technology">Technology</option>
                <option value="environment">Environment</option>
                <option value="education">Education</option>
                <option value="politics">Politics</option>
                <option value="health">Health</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Debates Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedDebates.length === debates.length}
                    onChange={handleSelectAll}
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-500">Debate</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-500">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-500">Moderator</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-500">Scheduled For</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {debates.map((debate) => (
                <tr key={debate.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDebates.includes(debate.id)}
                      onChange={() => handleSelectDebate(debate.id)}
                      className="rounded border-neutral-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Video size={20} className="text-primary" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-neutral-800">{debate.title}</p>
                        <div className="flex items-center text-sm text-neutral-500">
                          <Users size={14} className="mr-1" />
                          {debate.participants} participants
                          <span className="mx-2">•</span>
                          {debate.visibility === 'public' ? (
                            <Eye size={14} className="mr-1" />
                          ) : (
                            <EyeOff size={14} className="mr-1" />
                          )}
                          {debate.visibility}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {debate.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      debate.status === 'live' ? 'bg-error/10 text-error' :
                      debate.status === 'upcoming' ? 'bg-info/10 text-info' :
                      'bg-success/10 text-success'
                    }`}>
                      {debate.status.charAt(0).toUpperCase() + debate.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium">
                        {debate.moderator.charAt(0)}
                      </div>
                      <span className="ml-2 text-sm text-neutral-700">{debate.moderator}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(debate.scheduledFor)}
                      </div>
                      <div className="flex items-center mt-1">
                        <MessageSquare size={14} className="mr-1" />
                        {formatTime(debate.scheduledFor)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="text-neutral-500 hover:text-primary">
                        <Edit2 size={18} />
                      </button>
                      <button className="text-neutral-500 hover:text-error">
                        <Trash2 size={18} />
                      </button>
                      <button className="text-neutral-500 hover:text-neutral-700">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{debates.length}</span> of{' '}
            <span className="font-medium">{debates.length}</span> debates
          </p>
          
          <div className="flex items-center space-x-2">
            <button
              className="btn btn-ghost p-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 py-2 rounded-lg bg-primary text-white">
              {currentPage}
            </span>
            <button
              className="btn btn-ghost p-2"
              disabled={true}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageDebates;