import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useDebate } from '../../contexts/DebateContext.jsx';
import { Calendar, Clock, Tag, Users, AlertCircle, Info, Image as ImageIcon } from 'lucide-react';

const CreateDebate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createDebate } = useDebate();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [format, setFormat] = useState('moderated');
  const [visibility, setVisibility] = useState('public');
  const [votingEnabled, setVotingEnabled] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [reactionsEnabled, setReactionsEnabled] = useState(true);
  const [featuredImage, setFeaturedImage] = useState('');
  
  // UI state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Category options
  const categoryOptions = [
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
    'Entertainment',
    'Other'
  ];
  
  // Sample featured images
  const sampleImages = [
    'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
    'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
    'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg'
  ];
  
  // Handle tag input
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };
  
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!date) newErrors.date = 'Date is required';
    if (!time) newErrors.time = 'Time is required';
    
    // Validate date is in the future
    if (date && time) {
      const scheduledDateTime = new Date(`${date}T${time}`);
      if (scheduledDateTime <= new Date()) {
        newErrors.date = 'Debate must be scheduled in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Combine date and time into a single datetime
      const scheduledFor = new Date(`${date}T${time}`).toISOString();
      
      // Create debate
      const debateData = {
        title,
        description,
        category,
        tags,
        scheduledFor,
        duration: parseInt(duration),
        moderator: {
          id: user.id,
          name: user.name
        },
        format,
        visibility,
        votingEnabled,
        chatEnabled,
        reactionsEnabled,
        featuredImage: featuredImage || sampleImages[0]
      };
      
      const newDebate = await createDebate(debateData);
      
      // Navigate to debate details
      navigate(`/debates/${newDebate.id}`);
    } catch (error) {
      console.error('Error creating debate:', error);
      setErrors({ submit: 'Failed to create debate. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-800 mb-8">Create a New Debate</h1>
        
        {errors.submit && (
          <div className="mb-6 p-4 bg-error/10 rounded-lg flex items-start">
            <AlertCircle size={20} className="text-error mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-error">{errors.submit}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="label">
                  Debate Title <span className="text-error">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`input ${errors.title ? 'border-error' : ''}`}
                  placeholder="What is this debate about?"
                  maxLength={100}
                />
                {errors.title && <p className="text-error text-sm mt-1">{errors.title}</p>}
                <p className="text-neutral-500 text-sm mt-1">
                  {title.length}/100 characters
                </p>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="label">
                  Description <span className="text-error">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`input h-32 ${errors.description ? 'border-error' : ''}`}
                  placeholder="Provide a detailed description of the debate topic..."
                  maxLength={500}
                ></textarea>
                {errors.description && <p className="text-error text-sm mt-1">{errors.description}</p>}
                <p className="text-neutral-500 text-sm mt-1">
                  {description.length}/500 characters
                </p>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="label">
                  Category <span className="text-error">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`input ${errors.category ? 'border-error' : ''}`}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-error text-sm mt-1">{errors.category}</p>}
              </div>
              
              {/* Tags */}
              <div>
                <label htmlFor="tags" className="label">
                  Tags <span className="text-neutral-500 text-sm">(up to 5)</span>
                </label>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Tag size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                    <input
                      id="tags"
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      onBlur={addTag}
                      className="input pl-10"
                      placeholder="Add tags (press Enter or comma to add)"
                      disabled={tags.length >= 5}
                    />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary hover:text-primary-dark"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-neutral-500 text-sm mt-1">
                  Tags help people find your debate
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Scheduling</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="label">
                  Date <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`input pl-10 ${errors.date ? 'border-error' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.date && <p className="text-error text-sm mt-1">{errors.date}</p>}
              </div>
              
              {/* Time */}
              <div>
                <label htmlFor="time" className="label">
                  Time <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                  <input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`input pl-10 ${errors.time ? 'border-error' : ''}`}
                  />
                </div>
                {errors.time && <p className="text-error text-sm mt-1">{errors.time}</p>}
              </div>
              
              {/* Duration */}
              <div>
                <label htmlFor="duration" className="label">
                  Duration (minutes)
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="input"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                </select>
              </div>
              
              {/* Format */}
              <div>
                <label htmlFor="format" className="label">
                  Debate Format
                </label>
                <select
                  id="format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="input"
                >
                  <option value="moderated">Moderated</option>
                  <option value="structured">Structured</option>
                  <option value="open">Open</option>
                </select>
                <p className="text-neutral-500 text-sm mt-1">
                  {format === 'moderated' && 'You control who speaks and when'}
                  {format === 'structured' && 'Fixed speaking times for each side'}
                  {format === 'open' && 'Free-form debate with minimal moderation'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <h2 className="text-xl font-semibold">Advanced Settings</h2>
              <button type="button" className="text-neutral-500">
                {showAdvanced ? '−' : '+'}
              </button>
            </div>
            
            {showAdvanced && (
              <div className="mt-6 space-y-6">
                {/* Visibility */}
                <div>
                  <label className="label">Visibility</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        visibility === 'public' ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                      onClick={() => setVisibility('public')}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="visibility"
                          id="public"
                          checked={visibility === 'public'}
                          onChange={() => setVisibility('public')}
                          className="mt-1 mr-2"
                        />
                        <div>
                          <label htmlFor="public" className="font-medium cursor-pointer">Public</label>
                          <p className="text-sm text-neutral-500 mt-1">
                            Anyone can discover and join this debate
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        visibility === 'unlisted' ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                      onClick={() => setVisibility('unlisted')}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="visibility"
                          id="unlisted"
                          checked={visibility === 'unlisted'}
                          onChange={() => setVisibility('unlisted')}
                          className="mt-1 mr-2"
                        />
                        <div>
                          <label htmlFor="unlisted" className="font-medium cursor-pointer">Unlisted</label>
                          <p className="text-sm text-neutral-500 mt-1">
                            Only accessible by direct link
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        visibility === 'private' ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                      onClick={() => setVisibility('private')}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="visibility"
                          id="private"
                          checked={visibility === 'private'}
                          onChange={() => setVisibility('private')}
                          className="mt-1 mr-2"
                        />
                        <div>
                          <label htmlFor="private" className="font-medium cursor-pointer">Private</label>
                          <p className="text-sm text-neutral-500 mt-1">
                            Only invited participants can join
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Interactive Features */}
                <div>
                  <label className="label">Interactive Features</label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <div>
                        <p className="font-medium">Audience Voting</p>
                        <p className="text-sm text-neutral-500">
                          Allow audience to vote on debate positions
                        </p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={votingEnabled}
                          onChange={() => setVotingEnabled(!votingEnabled)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <div>
                        <p className="font-medium">Chat</p>
                        <p className="text-sm text-neutral-500">
                          Enable chat for audience and participants
                        </p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={chatEnabled}
                          onChange={() => setChatEnabled(!chatEnabled)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <div>
                        <p className="font-medium">Reactions</p>
                        <p className="text-sm text-neutral-500">
                          Allow audience to send live reactions
                        </p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={reactionsEnabled}
                          onChange={() => setReactionsEnabled(!reactionsEnabled)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Featured Image */}
                <div>
                  <label className="label">Featured Image</label>
                  <div className="mt-2 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {sampleImages.map((image, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                            featuredImage === image ? 'border-primary' : 'border-transparent'
                          }`}
                          onClick={() => setFeaturedImage(image)}
                        >
                          <img
                            src={image}
                            alt={`Sample ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={featuredImage}
                          onChange={(e) => setFeaturedImage(e.target.value)}
                          className="input"
                          placeholder="Or enter image URL..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-neutral-100 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <Info size={20} className="text-primary mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-neutral-700 font-medium">Important Notes</p>
                <ul className="text-sm text-neutral-600 mt-1 list-disc list-inside space-y-1">
                  <li>You'll be the moderator for this debate</li>
                  <li>You can invite participants after creating the debate</li>
                  <li>The debate room will open 15 minutes before the scheduled time</li>
                  <li>Make sure to test your audio and video before going live</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/debates')}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Creating...
                </span>
              ) : (
                'Create Debate'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        /* Switch styles */
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 24px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        
        input:checked + .slider {
          background-color: #6C63FF;
        }
        
        input:focus + .slider {
          box-shadow: 0 0 1px #6C63FF;
        }
        
        input:checked + .slider:before {
          transform: translateX(16px);
        }
        
        .slider.round {
          border-radius: 24px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default CreateDebate;