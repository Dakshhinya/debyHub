import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useDebate } from '../../contexts/DebateContext.jsx';
import { 
  Calendar, Clock, Tag, Users, MessageSquare, ThumbsUp, 
  ThumbsDown, Share2, ChevronDown, ChevronUp, Video, 
  Award, Star, AlertCircle
} from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen.jsx';

const DebateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getDebateById, joinDebate } = useDebate();
  
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'moderator', 'participant', 'audience', null
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'join', 'share', 'feedback'
  const [joinPosition, setJoinPosition] = useState(''); // 'for', 'against', 'neutral'
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [showParticipants, setShowParticipants] = useState(true);
  const [shareLink, setShareLink] = useState('');
  
  useEffect(() => {
    const fetchDebate = async () => {
      try {
        // In a real app, this would be an API call
        const debateData = getDebateById(id);
        
        if (!debateData) {
          navigate('/debates');
          return;
        }
        
        setDebate(debateData);
        
        // Determine user's role
        if (debateData.moderator.id === user?.id) {
          setUserRole('moderator');
        } else if (debateData.participants.some(p => p.id === user?.id)) {
          setUserRole('participant');
        } else if (debateData.audience?.includes(user?.id)) {
          setUserRole('audience');
        }
        
        // Generate share link
        setShareLink(`${window.location.origin}/debates/${id}`);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching debate:', error);
        navigate('/debates');
      }
    };
    
    fetchDebate();
  }, [id, user, getDebateById, navigate]);
  
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
  
  // Handle join debate
  const handleJoinDebate = async () => {
    if (!joinPosition) {
      return;
    }
    
    try {
      const result = await joinDebate(id, 'participant', joinPosition);
      
      if (result.success) {
        setUserRole('participant');
        setShowModal(false);
        
        // Refresh debate data
        const updatedDebate = getDebateById(id);
        setDebate(updatedDebate);
      }
    } catch (error) {
      console.error('Error joining debate:', error);
    }
  };
  
  // Handle join audience
  const handleJoinAudience = async () => {
    try {
      const result = await joinDebate(id, 'audience');
      
      if (result.success) {
        setUserRole('audience');
        
        // Refresh debate data
        const updatedDebate = getDebateById(id);
        setDebate(updatedDebate);
      }
    } catch (error) {
      console.error('Error joining audience:', error);
    }
  };
  
  // Handle submit feedback
  const handleSubmitFeedback = () => {
    // In a real app, this would send feedback to the API
    alert(`Thank you for your feedback! (Rating: ${feedbackRating}/5)`);
    setShowModal(false);
    setFeedbackRating(0);
    setFeedbackComment('');
  };
  
  // Handle copy share link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };
  
  // Open join modal
  const openJoinModal = () => {
    setModalType('join');
    setShowModal(true);
  };
  
  // Open share modal
  const openShareModal = () => {
    setModalType('share');
    setShowModal(true);
  };
  
  // Open feedback modal
  const openFeedbackModal = () => {
    setModalType('feedback');
    setShowModal(true);
  };
  
  if (loading) {
    return <LoadingScreen message="Loading debate details..." />;
  }
  
  // Check if debate is live or upcoming
  const isLive = debate.status === 'live';
  const isUpcoming = debate.status === 'upcoming';
  const isCompleted = debate.status === 'completed';
  
  // Check if user can enter debate room
  const canEnterRoom = userRole && (isLive || (isUpcoming && (userRole === 'moderator' || userRole === 'participant')));
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Status Badge */}
        <div className="mb-4">
          {isLive && (
            <div className="inline-flex items-center bg-error/10 text-error px-3 py-1 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-error rounded-full mr-2 animate-pulse"></span>
              Live Now
            </div>
          )}
          {isUpcoming && (
            <div className="inline-flex items-center bg-info/10 text-info px-3 py-1 rounded-full text-sm font-medium">
              <Calendar size={16} className="mr-1" />
              Upcoming
            </div>
          )}
          {isCompleted && (
            <div className="inline-flex items-center bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
              <Award size={16} className="mr-1" />
              Completed
            </div>
          )}
        </div>
        
        {/* Debate Title */}
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">{debate.title}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Debate Info */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            <div className="rounded-xl overflow-hidden mb-6">
              <img 
                src={debate.image || 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg'} 
                alt={debate.title} 
                className="w-full h-auto" 
              />
            </div>
            
            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-neutral-700 whitespace-pre-line">{debate.description}</p>
              
              {/* Tags */}
              {debate.tags && debate.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {debate.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-neutral-100 px-3 py-1 rounded-full text-sm text-neutral-700 flex items-center"
                    >
                      <Tag size={14} className="mr-1 text-neutral-500" />
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Details */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar size={20} className="text-neutral-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-500">Date</p>
                    <p className="font-medium">{formatDate(debate.dateTime)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock size={20} className="text-neutral-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-500">Time</p>
                    <p className="font-medium">{formatTime(debate.dateTime)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock size={20} className="text-neutral-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-500">Duration</p>
                    <p className="font-medium">{debate.duration} minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Tag size={20} className="text-neutral-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-500">Category</p>
                    <p className="font-medium">{debate.category}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageSquare size={20} className="text-neutral-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-500">Format</p>
                    <p className="font-medium capitalize">{debate.format || 'Moderated'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users size={20} className="text-neutral-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-500">Audience</p>
                    <p className="font-medium">{debate.audience || 0} viewers</p>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-medium mb-3">Features</h3>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${debate.votingEnabled ? 'bg-success' : 'bg-neutral-300'}`}></div>
                    <span className="text-sm">Voting</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${debate.chatEnabled ? 'bg-success' : 'bg-neutral-300'}`}></div>
                    <span className="text-sm">Chat</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${debate.reactionsEnabled ? 'bg-success' : 'bg-neutral-300'}`}></div>
                    <span className="text-sm">Reactions</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Results (if completed) */}
            {isCompleted && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Results</h2>
                
                {debate.winner && (
                  <div className="mb-6 flex items-center">
                    <Award size={24} className="text-warning mr-3" />
                    <div>
                      <p className="text-sm text-neutral-500">Winner</p>
                      <p className="font-medium capitalize">
                        {debate.winner === 'for' ? 'For' : 
                         debate.winner === 'against' ? 'Against' : 
                         debate.winner === 'tie' ? 'Tie' : 'Not Decided'}
                      </p>
                    </div>
                  </div>
                )}
                
                {debate.votingEnabled && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Voting Results</h3>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="bg-success/10 rounded-lg p-4">
                          <p className="text-2xl font-bold text-success">{debate.votes?.for || 0}</p>
                          <p className="text-sm text-neutral-700">For</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-info/10 rounded-lg p-4">
                          <p className="text-2xl font-bold text-info">{debate.votes?.neutral || 0}</p>
                          <p className="text-sm text-neutral-700">Neutral</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-error/10 rounded-lg p-4">
                          <p className="text-2xl font-bold text-error">{debate.votes?.against || 0}</p>
                          <p className="text-sm text-neutral-700">Against</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-4 w-full bg-neutral-200 rounded-full overflow-hidden mb-2">
                      <div className="flex h-full">
                        <div 
                          className="bg-success" 
                          style={{ 
                            width: `${debate.votes?.for ? (debate.votes.for / (debate.votes.for + debate.votes.against + debate.votes.neutral) * 100) : 0}%` 
                          }}
                        ></div>
                        <div 
                          className="bg-info" 
                          style={{ 
                            width: `${debate.votes?.neutral ? (debate.votes.neutral / (debate.votes.for + debate.votes.against + debate.votes.neutral) * 100) : 0}%` 
                          }}
                        ></div>
                        <div 
                          className="bg-error" 
                          style={{ 
                            width: `${debate.votes?.against ? (debate.votes.against / (debate.votes.for + debate.votes.against + debate.votes.neutral) * 100) : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>For</span>
                      <span>Neutral</span>
                      <span>Against</span>
                    </div>
                  </div>
                )}
                
                {/* Recording */}
                {debate.recording && (
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <h3 className="text-lg font-medium mb-3">Recording</h3>
                    <a
                      href={debate.recording}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost border border-neutral-300 flex items-center"
                    >
                      <Video size={16} className="mr-2" />
                      Watch Recording
                    </a>
                  </div>
                )}
              </div>
            )}
            
            {/* Feedback */}
            {isCompleted && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Feedback</h2>
                
                {debate.feedback && debate.feedback.length > 0 ? (
                  <div className="space-y-4">
                    {debate.feedback.slice(0, 3).map((feedback, index) => (
                      <div key={index} className="border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-neutral-200 mr-2"></div>
                            <span className="font-medium">Anonymous User</span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < feedback.rating ? 'text-warning fill-current' : 'text-neutral-300'}
                              />
                            ))}
                          </div>
                        </div>
                        {feedback.comment && <p className="text-neutral-700 text-sm">{feedback.comment}</p>}
                      </div>
                    ))}
                    
                    {debate.feedback.length > 3 && (
                      <button
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        View all {debate.feedback.length} reviews
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-neutral-500">No feedback yet.</p>
                )}
                
                <button
                  onClick={openFeedbackModal}
                  className="btn btn-primary mt-4"
                >
                  Leave Feedback
                </button>
              </div>
            )}
          </div>
          
          {/* Right Column: Actions and Participants */}
          <div>
            {/* Action Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 sticky top-20">
              {/* Join Buttons */}
              <div className="space-y-3 mb-6">
                {canEnterRoom && (
                  <Link
                    to={`/debates/${id}/room`}
                    className="btn btn-primary w-full flex items-center justify-center"
                  >
                    <Video size={20} className="mr-2" />
                    {isLive ? 'Join Live Debate' : 'Enter Debate Room'}
                  </Link>
                )}
                
                {!userRole && isUpcoming && (
                  <>
                    <button
                      onClick={openJoinModal}
                      className="btn btn-primary w-full"
                    >
                      Join as Participant
                    </button>
                    
                    <button
                      onClick={handleJoinAudience}
                      className="btn btn-ghost border border-neutral-300 w-full"
                    >
                      Join as Audience
                    </button>
                  </>
                )}
                
                {userRole === 'moderator' && isUpcoming && !isLive && (
                  <button
                    className="btn btn-accent w-full"
                  >
                    Start Debate
                  </button>
                )}
              </div>
              
              {/* Share Button */}
              <button
                onClick={openShareModal}
                className="btn btn-ghost border border-neutral-300 w-full flex items-center justify-center mb-6"
              >
                <Share2 size={18} className="mr-2" />
                Share Debate
              </button>
              
              {/* Your Role */}
              {userRole && (
                <div className="bg-neutral-100 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium mb-2">Your Role</h3>
                  
                  <div className="flex items-center">
                    {userRole === 'moderator' && (
                      <>
                        <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center">
                          <Users size={20} />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Moderator</p>
                          <p className="text-sm text-neutral-500">You control the debate</p>
                        </div>
                      </>
                    )}
                    
                    {userRole === 'participant' && (
                      <>
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                          <MessageSquare size={20} />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Participant</p>
                          <p className="text-sm text-neutral-500">
                            Position: {
                              debate.participants.find(p => p.id === user?.id)?.position === 'for' ? 'For' :
                              debate.participants.find(p => p.id === user?.id)?.position === 'against' ? 'Against' :
                              'Neutral'
                            }
                          </p>
                        </div>
                      </>
                    )}
                    
                    {userRole === 'audience' && (
                      <>
                        <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                          <Users size={20} />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Audience</p>
                          <p className="text-sm text-neutral-500">You can watch and interact</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Participants */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div 
                className="p-4 border-b border-neutral-200 flex items-center justify-between cursor-pointer"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                <h2 className="text-xl font-semibold">Participants</h2>
                <button>
                  {showParticipants ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              {showParticipants && (
                <div className="p-4">
                  {/* Moderator */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Moderator</h3>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium text-lg">
                        {debate.moderator.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{debate.moderator.name}</p>
                        <p className="text-xs text-neutral-500">Moderator</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Participants */}
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Debaters</h3>
                    <div className="space-y-3">
                      {debate.participants.map((participant, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-medium text-lg">
                            {participant.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{participant.name}</p>
                            <div className="flex items-center">
                              <span
                                className={`inline-block w-2 h-2 rounded-full mr-1 ${
                                  participant.position === 'for' ? 'bg-success' : 
                                  participant.position === 'against' ? 'bg-error' : 
                                  'bg-info'
                                }`}
                              ></span>
                              <p className="text-xs text-neutral-500">
                                {participant.position === 'for' ? 'For' : 
                                 participant.position === 'against' ? 'Against' : 'Neutral'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {debate.participants.length === 0 && (
                        <p className="text-neutral-500 text-sm">No participants yet</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            {/* Join Modal */}
            {modalType === 'join' && (
              <>
                <div className="p-6 border-b border-neutral-200">
                  <h3 className="text-xl font-semibold">Join as Participant</h3>
                  <p className="text-neutral-600 mt-2">
                    Select your position in this debate
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        joinPosition === 'for' ? 'border-primary bg-primary/5' : 'border-neutral-200'
                      }`}
                      onClick={() => setJoinPosition('for')}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          id="for"
                          checked={joinPosition === 'for'}
                          onChange={() => setJoinPosition('for')}
                          className="mt-1 mr-2"
                        />
                        <div>
                          <label htmlFor="for" className="font-medium cursor-pointer">For</label>
                          <p className="text-sm text-neutral-500 mt-1">
                            You will argue in support of the topic
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        joinPosition === 'against' ? 'border-primary bg-primary/5' : 'border-neutral-200'
                      }`}
                      onClick={() => setJoinPosition('against')}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          id="against"
                          checked={joinPosition === 'against'}
                          onChange={() => setJoinPosition('against')}
                          className="mt-1 mr-2"
                        />
                        <div>
                          <label htmlFor="against" className="font-medium cursor-pointer">Against</label>
                          <p className="text-sm text-neutral-500 mt-1">
                            You will argue in opposition to the topic
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        joinPosition === 'neutral' ? 'border-primary bg-primary/5' : 'border-neutral-200'
                      }`}
                      onClick={() => setJoinPosition('neutral')}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          id="neutral"
                          checked={joinPosition === 'neutral'}
                          onChange={() => setJoinPosition('neutral')}
                          className="mt-1 mr-2"
                        />
                        <div>
                          <label htmlFor="neutral" className="font-medium cursor-pointer">Neutral</label>
                          <p className="text-sm text-neutral-500 mt-1">
                            You will present a balanced perspective
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleJoinDebate}
                      className="btn btn-primary"
                      disabled={!joinPosition}
                    >
                      Join Debate
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {/* Share Modal */}
            {modalType === 'share' && (
              <>
                <div className="p-6 border-b border-neutral-200">
                  <h3 className="text-xl font-semibold">Share Debate</h3>
                  <p className="text-neutral-600 mt-2">
                    Invite others to join this debate
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <label className="label">Debate Link</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="input rounded-r-none flex-1"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="btn bg-primary text-white rounded-l-none"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4 mb-4">
                    <button className="p-3 rounded-full bg-[#1DA1F2] text-white">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23 3.01s-2.018 1.192-3.14 1.53a4.48 4.48 0 00-7.86 3v1a10.66 10.66 0 01-9-4.53s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5 0-.278-.028-.556-.08-.83C21.94 5.674 23 3.01 23 3.01z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    
                    <button className="p-3 rounded-full bg-[#3b5998] text-white">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    
                    <button className="p-3 rounded-full bg-[#0e76a8] text-white">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2V9z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="4"
                          cy="4"
                          r="2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    
                    <button className="p-3 rounded-full bg-[#25D366] text-white">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="btn btn-primary"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {/* Feedback Modal */}
            {modalType === 'feedback' && (
              <>
                <div className="p-6 border-b border-neutral-200">
                  <h3 className="text-xl font-semibold">Leave Feedback</h3>
                  <p className="text-neutral-600 mt-2">
                    Your feedback helps improve future debates
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <label className="label">
                      Rate this debate <span className="text-error">*</span>
                    </label>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          className={`p-1 rounded-full ${
                            feedbackRating >= rating ? 'text-warning' : 'text-neutral-300'
                          }`}
                          onClick={() => setFeedbackRating(rating)}
                        >
                          <Star size={32} className={feedbackRating >= rating ? 'fill-current' : ''} />
                        </button>
                      ))}
                    </div>
                    
                    {feedbackRating === 0 && (
                      <p className="text-error text-sm">Please select a rating</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="feedback" className="label">
                      Comments (optional)
                    </label>
                    <textarea
                      id="feedback"
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="input h-32"
                      placeholder="Share your thoughts about this debate..."
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitFeedback}
                      className="btn btn-primary"
                      disabled={feedbackRating === 0}
                    >
                      Submit Feedback
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebateDetails;