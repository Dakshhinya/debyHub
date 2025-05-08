import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useDebate } from '../contexts/DebateContext.jsx';
import { 
  Calendar, Video, Users, ChevronRight, Award, Star,
  MessageSquare, Clock, ThumbsUp, ThumbsDown
} from 'lucide-react';
import LoadingScreen from '../components/common/LoadingScreen.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const { debates, userDebates, loading } = useDebate();
  
  const [upcomingDebates, setUpcomingDebates] = useState([]);
  const [moderatingDebates, setModeratingDebates] = useState([]);
  const [participatingDebates, setParticipatingDebates] = useState([]);
  const [recommendedDebates, setRecommendedDebates] = useState([]);
  
  useEffect(() => {
    if (!debates || !userDebates) return;
    
    // Filter debates where user is moderator
    const moderatingList = userDebates.filter(debate => 
      debate.moderator.id === user?.id && 
      (debate.status === 'upcoming' || debate.status === 'live')
    ).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
    // Filter debates where user is participant
    const participatingList = userDebates.filter(debate => 
      debate.participants.some(p => p.id === user?.id) && 
      (debate.status === 'upcoming' || debate.status === 'live')
    ).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
    // Combine for upcoming debates
    const upcoming = [...moderatingList, ...participatingList].sort((a, b) => 
      new Date(a.dateTime) - new Date(b.dateTime)
    ).slice(0, 5);
    
    // Get recommended debates
    const recommended = debates
      .filter(debate => 
        debate.status === 'upcoming' &&
        !moderatingList.some(d => d.id === debate.id) &&
        !participatingList.some(d => d.id === debate.id)
      )
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 4);
    
    setUpcomingDebates(upcoming);
    setModeratingDebates(moderatingList);
    setParticipatingDebates(participatingList);
    setRecommendedDebates(recommended);
  }, [debates, userDebates, user]);
  
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
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
  
  // Calculate time until debate
  const getTimeUntil = (dateStr) => {
    const now = new Date();
    const debateTime = new Date(dateStr);
    const diffMs = debateTime - now;
    
    if (diffMs < 0) {
      return 'Happening now';
    }
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `In ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      return `In ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };
  
  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-white/90 max-w-2xl">
          Your hub for debates. Join discussions, voice your opinions, and explore diverse perspectives.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-white/80">Upcoming Debates</p>
                <p className="text-2xl font-bold">{upcomingDebates.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-white/80">Moderated Debates</p>
                <p className="text-2xl font-bold">{moderatingDebates.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-white/80">Participated Debates</p>
                <p className="text-2xl font-bold">{participatingDebates.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Debates */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-800">Your Upcoming Debates</h2>
              <Link to="/debates" className="text-primary text-sm font-medium flex items-center">
                View All
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {upcomingDebates.length > 0 ? (
              <div className="space-y-4">
                {upcomingDebates.map((debate) => (
                  <Link
                    key={debate.id}
                    to={`/debates/${debate.id}`}
                    className="block bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative">
                          {debate.status === 'live' && (
                            <span className="absolute -top-1 -left-1 w-3 h-3 bg-error rounded-full animate-pulse"></span>
                          )}
                          <div className={`w-16 h-16 rounded-lg ${
                            debate.status === 'live' ? 'bg-error/10' : 'bg-primary/10'
                          } flex items-center justify-center`}>
                            <Calendar size={24} className={`${
                              debate.status === 'live' ? 'text-error' : 'text-primary'
                            }`} />
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <h3 className="font-medium text-neutral-800">{debate.title}</h3>
                          <div className="flex items-center mt-1">
                            <div className="text-xs bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">
                              {debate.category}
                            </div>
                            <span className="mx-2 text-neutral-400">•</span>
                            <p className="text-sm text-neutral-500">
                              {formatDate(debate.dateTime)} at {formatTime(debate.dateTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                          debate.status === 'live' 
                            ? 'bg-error/10 text-error' 
                            : 'bg-info/10 text-info'
                        }`}>
                          {debate.status === 'live' ? 'Live Now' : getTimeUntil(debate.dateTime)}
                        </div>
                        
                        <div className="text-xs text-neutral-500 mt-1">
                          {debate.moderator.id === user?.id 
                            ? 'You are moderating' 
                            : 'You are participating'}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto text-neutral-300 mb-3" />
                <p className="text-neutral-600">You don't have any upcoming debates</p>
                <Link to="/debates" className="btn btn-primary mt-4">
                  Browse Debates
                </Link>
              </div>
            )}
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-6">Recent Activity</h2>
            
            <div className="space-y-6">
              <div className="border-l-2 border-primary pl-4 pb-6 relative">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-0"></div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Award size={20} className="text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Completed "Climate Change Solutions" debate</p>
                    <p className="text-sm text-neutral-500 mt-1">Winner: For Position</p>
                    <p className="text-xs text-neutral-400 mt-1">Yesterday at 7:30 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="border-l-2 border-success pl-4 pb-6 relative">
                <div className="absolute w-3 h-3 bg-success rounded-full -left-[7px] top-0"></div>
                <div className="flex items-start">
                  <div className="bg-success/10 p-2 rounded-full">
                    <Star size={20} className="text-success" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Received a 5-star rating as moderator</p>
                    <p className="text-sm text-neutral-500 mt-1">For "AI Ethics and Governance" debate</p>
                    <p className="text-xs text-neutral-400 mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
              
              <div className="border-l-2 border-info pl-4 pb-6 relative">
                <div className="absolute w-3 h-3 bg-info rounded-full -left-[7px] top-0"></div>
                <div className="flex items-start">
                  <div className="bg-info/10 p-2 rounded-full">
                    <Calendar size={20} className="text-info" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Created a new debate</p>
                    <p className="text-sm text-neutral-500 mt-1">"Education Reform Debate"</p>
                    <p className="text-xs text-neutral-400 mt-1">5 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Live Now */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-error text-white p-4">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></span>
                <h2 className="text-lg font-semibold">Live Now</h2>
              </div>
            </div>
            
            <div className="p-4">
              {upcomingDebates.filter(debate => debate.status === 'live').length > 0 ? (
                <div className="space-y-4">
                  {upcomingDebates
                    .filter(debate => debate.status === 'live')
                    .map((debate) => (
                      <Link
                        key={debate.id}
                        to={`/debates/${debate.id}/room`}
                        className="flex items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                          <Video size={24} className="text-error" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-neutral-800 line-clamp-1">{debate.title}</h3>
                          <p className="text-sm text-neutral-500">
                            {debate.participants.length} participants
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              ) : (
                <p className="text-neutral-500 text-center py-4">
                  No debates are currently live
                </p>
              )}
            </div>
          </div>
          
          {/* Recommended Debates */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-800">Recommended For You</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Based on your interests and activity
              </p>
            </div>
            
            <div className="p-4">
              {recommendedDebates.length > 0 ? (
                <div className="space-y-4">
                  {recommendedDebates.map((debate) => (
                    <Link
                      key={debate.id}
                      to={`/debates/${debate.id}`}
                      className="block"
                    >
                      <div className="flex items-start">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={debate.image || 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg'}
                            alt={debate.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-neutral-800 line-clamp-1">{debate.title}</h3>
                          <div className="flex items-center text-xs text-neutral-500 mt-1">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(debate.dateTime)}
                            <span className="mx-1">•</span>
                            <Clock size={12} className="mr-1" />
                            {formatTime(debate.dateTime)}
                          </div>
                          <div className="flex items-center text-xs mt-1">
                            <span className="bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-700">
                              {debate.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  <Link 
                    to="/debates" 
                    className="block text-center text-primary text-sm font-medium mt-2 hover:underline"
                  >
                    View more debates
                  </Link>
                </div>
              ) : (
                <p className="text-neutral-500 text-center py-4">
                  No recommendations available
                </p>
              )}
            </div>
          </div>
          
          {/* Leaderboard Snippet */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">Top Debaters</h2>
              <Link 
                to="/leaderboard" 
                className="text-primary text-sm font-medium hover:underline"
              >
                Full Leaderboard
              </Link>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-warning/20 text-warning flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary ml-2 text-white flex items-center justify-center font-medium">
                      S
                    </div>
                    <span className="ml-2 font-medium">Sarah Johnson</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={16} className="text-warning fill-current" />
                    <span className="ml-1 font-medium">4.9</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold">
                      2
                    </div>
                    <div className="w-8 h-8 rounded-full bg-secondary ml-2 text-white flex items-center justify-center font-medium">
                      M
                    </div>
                    <span className="ml-2 font-medium">Michael Rodriguez</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={16} className="text-warning fill-current" />
                    <span className="ml-1 font-medium">4.8</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent ml-2 text-white flex items-center justify-center font-medium">
                      A
                    </div>
                    <span className="ml-2 font-medium">Alex Chen</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={16} className="text-warning fill-current" />
                    <span className="ml-1 font-medium">4.7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;