import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useDebate } from '../contexts/DebateContext.jsx';
import { 
  User, Mail, Calendar, Award, Edit2, Camera,
  MessageSquare, Users, Star, ChevronRight, AlertCircle
} from 'lucide-react';
import LoadingScreen from '../components/common/LoadingScreen.jsx';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { userDebates, loading } = useDebate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [interests, setInterests] = useState(user?.interests || []);
  const [interestInput, setInterestInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Handle interest input
  const handleInterestKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addInterest();
    }
  };
  
  const addInterest = () => {
    const trimmedInterest = interestInput.trim();
    if (trimmedInterest && !interests.includes(trimmedInterest) && interests.length < 5) {
      setInterests([...interests, trimmedInterest]);
      setInterestInput('');
    }
  };
  
  const removeInterest = (interestToRemove) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };
  
  // Handle save profile
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const result = await updateProfile({
        name,
        bio,
        interests
      });
      
      if (result.success) {
        setIsEditing(false);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Update profile error:', err);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen message="Loading profile..." />;
  }
  
  // Format date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-neutral-200 text-neutral-700 hover:text-primary transition-colors">
                <Camera size={16} />
              </button>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-800">
                    {user?.name || 'User'}
                  </h1>
                  <p className="text-neutral-600">{user?.email}</p>
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-ghost border border-neutral-300 flex items-center"
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit Profile
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center text-sm text-neutral-600">
                  <Calendar size={16} className="mr-1" />
                  Joined {formatDate(user?.createdAt)}
                </div>
                <div className="flex items-center text-sm text-neutral-600">
                  <MessageSquare size={16} className="mr-1" />
                  {userDebates?.length || 0} debates
                </div>
                <div className="flex items-center text-sm text-neutral-600">
                  <Users size={16} className="mr-1" />
                  {user?.followers?.length || 0} followers
                </div>
                <div className="flex items-center text-sm text-neutral-600">
                  <Star size={16} className="mr-1" />
                  {user?.rating || 0} rating
                </div>
              </div>
            </div>
          </div>
          
          {/* Edit Profile Form */}
          {isEditing && (
            <div className="mt-8 pt-8 border-t border-neutral-200">
              {error && (
                <div className="mb-6 p-4 bg-error/10 rounded-lg flex items-start">
                  <AlertCircle size={20} className="text-error mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="label">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="input h-32"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="interests" className="label">
                    Interests <span className="text-neutral-500 text-sm">(up to 5)</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      id="interests"
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={handleInterestKeyDown}
                      onBlur={addInterest}
                      className="input"
                      placeholder="Add interests (press Enter or comma to add)"
                      disabled={interests.length >= 5}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <div
                        key={index}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="ml-2 text-primary hover:text-primary-dark"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="flex items-center">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600">Total Debates</p>
                <p className="text-3xl font-bold text-neutral-800">
                  {userDebates?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare size={24} className="text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600">Average Rating</p>
                <p className="text-3xl font-bold text-neutral-800">
                  {user?.rating || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Star size={24} className="text-warning" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600">Followers</p>
                <p className="text-3xl font-bold text-neutral-800">
                  {user?.followers?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Users size={24} className="text-accent" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          
          <div className="space-y-6">
            {userDebates && userDebates.length > 0 ? (
              userDebates.slice(0, 5).map((debate) => (
                <div key={debate.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg ${
                      debate.status === 'live' ? 'bg-error/10' : 
                      debate.status === 'upcoming' ? 'bg-info/10' : 
                      'bg-success/10'
                    } flex items-center justify-center`}>
                      <MessageSquare size={24} className={
                        debate.status === 'live' ? 'text-error' :
                        debate.status === 'upcoming' ? 'text-info' :
                        'text-success'
                      } />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-neutral-800">{debate.title}</h3>
                      <p className="text-sm text-neutral-500">
                        {formatDate(debate.dateTime)}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-neutral-400" />
                </div>
              ))
            ) : (
              <p className="text-center text-neutral-500">
                No recent activity
              </p>
            )}
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Achievements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center p-4 border border-neutral-200 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Award size={24} className="text-warning" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-neutral-800">Top Debater</h3>
                <p className="text-sm text-neutral-500">
                  Won 10+ debates
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-4 border border-neutral-200 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare size={24} className="text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-neutral-800">Active Voice</h3>
                <p className="text-sm text-neutral-500">
                  Participated in 20+ debates
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-4 border border-neutral-200 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Users size={24} className="text-accent" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-neutral-800">Community Leader</h3>
                <p className="text-sm text-neutral-500">
                  100+ followers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;