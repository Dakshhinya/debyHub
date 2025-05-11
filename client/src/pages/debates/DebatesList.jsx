import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDebate } from '../../contexts/DebateContext.jsx';
import { 
  Calendar, Search, Filter, ChevronDown, X, Tag,
  Users, ThumbsUp, Award, Video, Clock, Edit2, Trash2, ThumbsDown
} from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen.jsx';

const DebatesList = () => {
  const { debates, loading, updateDebate, deleteDebate } = useDebate();
  
  // State for filters
  const [filteredDebates, setFilteredDebates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDebate, setCurrentDebate] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    dateTime: '',
    status: '',
    featuredImage: '',
    votingEnabled: false
  });
  
  // Category options
  const categories = [
    'Politics',
    'Technology',
    'Science',
    'Environment',
    'Education',
    'Health',
    'Economy',
    'Social Issues',
    'Philosophy',
    'Sports',
    'Entertainment'
  ];
  
  // Apply filters when debates change
  useEffect(() => {
    if (!debates) return;
    
    // Filter debates by search query, status and category
    const filtered = debates.filter(debate => {
      const matchesSearch = searchQuery === '' || 
        debate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        debate.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (debate.tags && debate.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesStatus = statusFilter === 'all' || debate.status === statusFilter;
      
      const matchesCategory = categoryFilter === '' || debate.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
    
    // Sort debates: live first, then upcoming (by date), then completed
    const sorted = [...filtered].sort((a, b) => {
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (a.status !== 'live' && b.status === 'live') return 1;
      
      if (a.status === 'upcoming' && b.status === 'upcoming') {
        return new Date(a.dateTime) - new Date(b.dateTime);
      }
      
      if (a.status === 'upcoming' && b.status === 'completed') return -1;
      if (a.status === 'completed' && b.status === 'upcoming') return 1;
      
      return new Date(b.dateTime) - new Date(a.dateTime);
    });
    
    setFilteredDebates(sorted);
  }, [debates, searchQuery, statusFilter, categoryFilter]);
  
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('');
  };
  
  // Format date-time for input fields
  const formatDateTimeForInput = (dateStr) => {
    try {
      const date = new Date(dateStr);
      // Check if date is valid before converting to ISO string
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error formatting date:', error);
      return ''; // Return empty string if date is invalid
    }
  };
  
  // Handle opening the edit modal
  const handleEditClick = (debate) => {
    setCurrentDebate(debate);
    setEditForm({
      title: debate.title,
      description: debate.description,
      category: debate.category || '',
      tags: debate.tags || [],
      dateTime: formatDateTimeForInput(debate.dateTime),
      status: debate.status,
      featuredImage: debate.featuredImage || '',
      votingEnabled: debate.votingEnabled || false
    });
    setIsEditModalOpen(true);
  };
  
  // Handle closing the edit modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setCurrentDebate(null);
  };
  
  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle tags input
  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setEditForm(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (!currentDebate) return;
    
    try {
      // Validate date before converting
      const dateTime = editForm.dateTime ? new Date(editForm.dateTime) : new Date();
      if (isNaN(dateTime.getTime())) {
        throw new Error('Invalid date format');
      }
      
      const updatedDebate = {
        ...currentDebate,
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        tags: editForm.tags,
        dateTime: dateTime.toISOString(),
        status: editForm.status,
        featuredImage: editForm.featuredImage,
        votingEnabled: editForm.votingEnabled
      };
      
      await updateDebate(currentDebate._id, updatedDebate);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to update debate:', error);
      // You could add error handling UI here
    }
  };
  
  // Handle delete debate

const handleDeleteDebate = (debateId) => {
  
  deleteDebate(debateId)
    .then(() => {
      console.log(`Debate with ID ${debateId} deleted successfully.`);
    })
    .catch((error) => {
      console.error('Error deleting debate:', error.message);
    });
};

  
  if (loading) {
    return <LoadingScreen message="Loading debates..." />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">Explore Debates</h1>
          <p className="text-neutral-600">
            Find and join debates on topics that interest you
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link to="/debates/create" className="btn btn-primary">
            Create Debate
          </Link>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
            <input
              type="text"
              placeholder="Search debates by title, description, or tags"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          {/* Toggle Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-ghost border border-neutral-300 flex items-center"
          >
            <Filter size={18} className="mr-2" />
            Filters
            <ChevronDown size={18} className={`ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Status Tabs (always visible) */}
          <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 text-sm font-medium ${
                statusFilter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('live')}
              className={`px-4 py-2 text-sm font-medium ${
                statusFilter === 'live' 
                  ? 'bg-error text-white' 
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-4 py-2 text-sm font-medium ${
                statusFilter === 'upcoming' 
                  ? 'bg-info text-white' 
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 text-sm font-medium ${
                statusFilter === 'completed' 
                  ? 'bg-success text-white' 
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label htmlFor="category-filter" className="label">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* More filters could go here */}
            </div>
            
            {/* Clear Filters */}
            {(searchQuery || statusFilter !== 'all' || categoryFilter) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline flex items-center text-sm"
                >
                  <X size={16} className="mr-1" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-neutral-600">
          {filteredDebates.length} {filteredDebates.length === 1 ? 'debate' : 'debates'} found
          {(searchQuery || statusFilter !== 'all' || categoryFilter) && ' matching your filters'}
        </p>
      </div>
      
      {/* Debates List */}
      {filteredDebates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDebates.map((debate) => (
            <div key={debate._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Debate Image */}
              <div className="relative h-48">
                <img
                  src={debate.featuredImage || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'}
                  alt={debate.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badge */}
                {debate.status === 'live' && (
                  <div className="absolute top-4 left-4 bg-error/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                    Live Now
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-white/90 text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">
                  {debate.category}
                </div>
                
                {/* Voting Badge if enabled */}
                {debate.votingEnabled && (
                  <div className="absolute bottom-4 left-4 bg-white/90 text-neutral-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <ThumbsUp size={12} className="mr-1 text-neutral-600" />
                    Voting Enabled
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(debate)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteDebate(debate._id)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-error hover:text-white transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {/* Debate Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-neutral-800 mb-2 line-clamp-2">
                  {debate.title}
                </h3>
                
                <p className="text-neutral-600 mb-4 line-clamp-2">
                  {debate.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {formatDate(debate.dateTime)}
                  </div>
                  
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    {formatTime(debate.dateTime)}
                  </div>
                </div>
                
                {/* Tags */}
                {debate.tags && debate.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {debate.tags.slice(0, 3).map((tag, index) => (
                      <div
                        key={index}
                        className="bg-neutral-100 px-2 py-1 rounded-full text-xs text-neutral-700 flex items-center"
                      >
                        <Tag size={12} className="mr-1 text-neutral-500" />
                        {tag}
                      </div>
                    ))}
                    {debate.tags.length > 3 && (
                      <div className="bg-neutral-100 px-2 py-1 rounded-full text-xs text-neutral-700">
                        +{debate.tags.length - 3} more
                      </div>
                    )}
                  </div>
                )}
                
                {/* Participants & Votes */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users size={16} className="mr-1 text-neutral-500" />
                    <span className="text-sm text-neutral-700">
                      {debate.participants.length} participants
                    </span>
                  </div>
                  
                  {debate.votingEnabled && (
                    <div className="flex items-center">
                      <ThumbsUp size={16} className="mr-1 text-success" />
                      <span className="text-sm text-success mr-2">
                        {debate.votes?.for || 0}
                      </span>
                      <ThumbsDown size={16} className="mr-1 text-error" />
                      <span className="text-sm text-error">
                        {debate.votes?.against || 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Video size={48} className="mx-auto text-neutral-400 mb-4" />
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">
            No debates found
          </h3>
          <p className="text-neutral-600 mb-6">
            {searchQuery || statusFilter !== 'all' || categoryFilter
              ? "We couldn't find any debates matching your filters. Try adjusting your search criteria."
              : "There are no debates available at the moment. Be the first to create one!"}
          </p>
          <Link to="/debates/create" className="btn btn-primary">
            Create a Debate
          </Link>
        </div>
      )}
      
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-neutral-800">Edit Debate</h2>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="label">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editForm.title}
                    onChange={handleFormChange}
                    className="input w-full"
                    required
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editForm.description}
                    onChange={handleFormChange}
                    className="input w-full h-32"
                    required
                  />
                </div>
                
                {/* Category & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="label">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={editForm.category}
                      onChange={handleFormChange}
                      className="input w-full"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="label">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={editForm.status}
                      onChange={handleFormChange}
                      className="input w-full"
                      required
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                {/* Date & Time */}
                <div>
                  <label htmlFor="dateTime" className="label">Date & Time</label>
                  <input
                    type="datetime-local"
                    id="dateTime"
                    name="dateTime"
                    value={editForm.dateTime}
                    onChange={handleFormChange}
                    className="input w-full"
                    required
                  />
                </div>
                
                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="label">Tags (comma separated)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={editForm.tags.join(', ')}
                    onChange={handleTagsChange}
                    className="input w-full"
                    placeholder="e.g. AI, Ethics, Future"
                  />
                </div>
                
                {/* Featured Image URL */}
                <div>
                  <label htmlFor="featuredImage" className="label">Featured Image URL</label>
                  <input
                    type="url"
                    id="featuredImage"
                    name="featuredImage"
                    value={editForm.featuredImage}
                    onChange={handleFormChange}
                    className="input w-full"
                    placeholder="https://example.com/image.jpg"
                  />
                  {editForm.featuredImage && (
                    <div className="mt-2">
                      <p className="text-sm text-neutral-500 mb-1">Preview:</p>
                      <img 
                        src={editForm.featuredImage} 
                        alt="Featured image preview" 
                        className="h-32 object-cover rounded-md border border-neutral-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Voting Enabled */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="votingEnabled"
                    name="votingEnabled"
                    checked={editForm.votingEnabled}
                    onChange={handleFormChange}
                    className="checkbox"
                  />
                  <label htmlFor="votingEnabled" className="ml-2 label cursor-pointer">
                    Enable voting for this debate
                  </label>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebatesList;