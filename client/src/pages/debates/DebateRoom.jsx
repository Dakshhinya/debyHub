import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useDebate } from '../../contexts/DebateContext.jsx';
import { 
  Mic, MicOff, Video, VideoOff, MessageSquare, ThumbsUp, 
  ThumbsDown, Users, X, ChevronUp, ChevronDown, Crown,
  UserMinus, Volume2, VolumeX, MoreVertical, 
  ExternalLink, AlertCircle, LogOut, Settings
} from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen.jsx';
import TwilioVideo from 'twilio-video';
import { io } from 'socket.io-client';

const DebateRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getDebateById } = useDebate();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [debate, setDebate] = useState(null);
  const [role, setRole] = useState('audience'); // 'moderator', 'participant', 'audience'
  const [position, setPosition] = useState(null); // 'for', 'against', 'neutral'
  
  // Video states
  const [token, setToken] = useState('');
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeParticipant, setActiveParticipant] = useState(null);
  
  // UI states
  const [chatOpen, setChatOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [reactions, setReactions] = useState([]);
  const [showControls, setShowControls] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Refs
  const localVideoRef = useRef(null);
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  
  // Get debate data
  useEffect(() => {
    const fetchDebate = async () => {
      try {
        // In a real app, this would fetch from the API
        const debateData = getDebateById(id);
        if (!debateData) {
          navigate('/debates');
          return;
        }
        
        setDebate(debateData);
        
        // Determine user's role in the debate
        if (debateData.moderator.id === user?.id) {
          setRole('moderator');
        } else {
          const userAsParticipant = debateData.participants.find(p => p.id === user?.id);
          if (userAsParticipant) {
            setRole('participant');
            setPosition(userAsParticipant.position);
          } else {
            setRole('audience');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching debate:', error);
        navigate('/debates');
      }
    };
    
    fetchDebate();
    
    // Set up socket connection
    socketRef.current = io();
    
    // Join debate room
    socketRef.current.emit('join-debate', {
      debateId: id,
      user: {
        id: user?.id,
        name: user?.name
      }
    });
    
    // Listen for messages
    socketRef.current.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
      // Scroll to bottom of chat
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    });
    
    // Listen for reactions
    socketRef.current.on('new-reaction', (reaction) => {
      setReactions(prev => [...prev, { ...reaction, timestamp: Date.now() }]);
      
      // Remove reaction after animation
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== reaction.id));
      }, 2000);
    });
    
    // Listen for moderator actions
    socketRef.current.on('moderator-action', (action) => {
      handleModeratorAction(action);
    });
    
    // Clean up on unmount
    return () => {
      // Leave debate room
      if (socketRef.current) {
        socketRef.current.emit('leave-debate', {
          debateId: id,
          user: {
            id: user?.id,
            name: user?.name
          }
        });
        socketRef.current.disconnect();
      }
      
      // Disconnect from video
      if (room) {
        room.disconnect();
      }
    };
  }, [id, user, getDebateById, navigate]);
  
  // Handle controls hiding/showing on mouse movement
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      // Clear any existing timeout
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      // Set new timeout to hide controls after 3 seconds
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle reactions disappearing after animation
  useEffect(() => {
    const timeouts = reactions.map(reaction => {
      return setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== reaction.id));
      }, 2000);
    });
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [reactions]);
  
  // Connect to Twilio video
  const connectToRoom = async () => {
    try {
      // In a real app, you would get this token from your server
      // For now, we'll mock this
      const mockToken = 'mock_token_' + Math.random().toString(36).substring(2, 10);
      setToken(mockToken);
      
      // Mock connecting to a room
      // In a real app, this would use the token to connect to Twilio
      const mockRoom = {
        localParticipant: {
          identity: user?.id,
          publishTrack: () => {},
          tracks: new Map(),
        },
        on: (event, handler) => {},
        disconnect: () => {},
      };
      
      setRoom(mockRoom);
      
      // Mock participants
      const mockParticipants = debate.participants.map(p => ({
        identity: p.id,
        videoTracks: new Map([['video', { track: { attach: () => {} } }]]),
        audioTracks: new Map([['audio', { track: { attach: () => {} } }]]),
        on: (event, handler) => {},
      }));
      
      setParticipants(mockParticipants);
      setActiveParticipant(mockParticipants[0]);
      
      // In a real app, you would render the local video
      // For now, we'll just mock this
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = new MediaStream();
      }
    } catch (error) {
      console.error('Error connecting to video room:', error);
    }
  };
  
  // Handle sending a message
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      sender: {
        id: user?.id,
        name: user?.name,
        role
      },
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    // Send message to server
    socketRef.current.emit('send-message', {
      debateId: id,
      message
    });
    
    // Add message to local state
    setMessages(prev => [...prev, message]);
    
    // Clear input
    setNewMessage('');
    
    // Scroll to bottom of chat
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };
  
  // Handle sending a reaction
  const sendReaction = (type) => {
    const reaction = {
      id: Date.now().toString(),
      user: {
        id: user?.id,
        name: user?.name
      },
      type,
      timestamp: new Date().toISOString()
    };
    
    // Send reaction to server
    socketRef.current.emit('send-reaction', {
      debateId: id,
      reaction
    });
    
    // Add reaction to local state
    setReactions(prev => [...prev, { ...reaction, timestamp: Date.now() }]);
  };
  
  // Handle toggling mic
  const toggleMic = () => {
    setIsMicMuted(!isMicMuted);
    
    // In a real app, this would enable/disable the microphone track
    // room.localParticipant.audioTracks.forEach(track => {
    //   isMicMuted ? track.track.enable() : track.track.disable();
    // });
  };
  
  // Handle toggling video
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    
    // In a real app, this would enable/disable the video track
    // room.localParticipant.videoTracks.forEach(track => {
    //   isVideoOff ? track.track.enable() : track.track.disable();
    // });
  };
  
  // Handle casting a vote
  const castVote = (position) => {
    // In a real app, this would send a vote to the server
    socketRef.current.emit('cast-vote', {
      debateId: id,
      vote: {
        user: {
          id: user?.id,
          name: user?.name
        },
        position
      }
    });
    
    // Show confirmation
    alert(`Vote cast for "${position}" side`);
  };
  
  // Handle moderator action
  const handleModeratorAction = (action) => {
    switch (action.type) {
      case 'kick':
        if (action.userId === user?.id) {
          // User has been kicked
          alert('You have been removed from the debate by the moderator.');
          navigate(`/debates/${id}`);
        }
        break;
      case 'mute':
        if (action.userId === user?.id) {
          // Mute the user
          setIsMicMuted(true);
        }
        break;
      case 'end_debate':
        // Debate has ended
        alert('The debate has ended.');
        navigate(`/debates/${id}`);
        break;
      default:
        break;
    }
  };
  
  // Execute moderator action
  const executeModeratorAction = (action, userId) => {
    // Send action to server
    socketRef.current.emit('moderator-action', {
      debateId: id,
      action: {
        type: action,
        userId,
        moderator: {
          id: user?.id,
          name: user?.name
        }
      }
    });
    
    // Close confirm modal
    setConfirmModalOpen(false);
  };
  
  // Open confirmation modal for moderator actions
  const openConfirmModal = (action, userId) => {
    setConfirmAction({ action, userId });
    setConfirmModalOpen(true);
  };
  
  // Handle leave debate
  const leaveDebate = () => {
    // In a real app, this would disconnect from the room and navigate back
    navigate(`/debates/${id}`);
  };
  
  if (loading) {
    return <LoadingScreen message="Joining debate room..." />;
  }
  
  return (
    <div className="h-[calc(100vh-56px)] flex flex-col bg-neutral-900 relative">
      {/* Main video area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Active speaker view */}
        <div className="absolute inset-0 flex items-center justify-center">
          {activeParticipant ? (
            <div className="relative w-full h-full">
              <div className="w-full h-full bg-neutral-800 rounded-lg overflow-hidden">
                {/* This would be a real video in a complete implementation */}
                <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center text-5xl">
                      {debate.participants.find(p => p.id === activeParticipant.identity)?.name.charAt(0) || 'P'}
                    </div>
                    <p>{debate.participants.find(p => p.id === activeParticipant.identity)?.name || 'Participant'}</p>
                    <p className="text-sm text-neutral-400">Speaking...</p>
                  </div>
                </div>
              </div>
              
              {/* Speaking indicator */}
              <div className="absolute top-4 left-4 bg-accent px-3 py-1.5 rounded-full text-white text-sm font-medium flex items-center">
                <Volume2 size={16} className="mr-1" />
                Speaking
              </div>
              
              {/* Position indicator */}
              {position && (
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-white text-sm font-medium flex items-center ${
                  position === 'for' ? 'bg-success' : position === 'against' ? 'bg-error' : 'bg-info'
                }`}>
                  {position === 'for' ? 'For' : position === 'against' ? 'Against' : 'Neutral'}
                </div>
              )}
            </div>
          ) : (
            <div className="text-white text-xl">
              No active speaker
            </div>
          )}
        </div>
        
        {/* Participants grid (smaller videos) */}
        <div className="absolute bottom-0 left-0 right-0 p-2 flex overflow-x-auto space-x-2 z-10">
          {participants.map((participant) => (
            <div 
              key={participant.identity}
              className={`w-32 h-24 bg-neutral-800 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 transition-all ${
                activeParticipant?.identity === participant.identity ? 'border-2 border-primary' : ''
              }`}
              onClick={() => setActiveParticipant(participant)}
            >
              {/* This would be a real video in a complete implementation */}
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary mx-auto flex items-center justify-center text-xl">
                    {debate.participants.find(p => p.id === participant.identity)?.name.charAt(0) || 'P'}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Local video (self view) */}
          <div className="w-32 h-24 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0 relative">
            <video 
              ref={localVideoRef}
              autoPlay
              muted
              className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
            />
            {isVideoOff && (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-600 mx-auto flex items-center justify-center text-xl">
                    {user?.name?.charAt(0) || 'Y'}
                  </div>
                </div>
              </div>
            )}
            <div className="absolute bottom-1 right-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
              You
            </div>
          </div>
        </div>
        
        {/* Floating reactions */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {reactions.map((reaction) => (
            <div
              key={reaction.id}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-float"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                animationDuration: `${Math.random() * 1 + 1.5}s`
              }}
            >
              <div className="text-4xl">
                {reaction.type === 'thumbsUp' ? '👍' : reaction.type === 'thumbsDown' ? '👎' : '❤️'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom controls bar */}
      <div 
        className={`bg-neutral-800 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {/* Left controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full text-white ${
                isMicMuted ? 'bg-error' : 'bg-neutral-700 hover:bg-neutral-600'
              }`}
              title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full text-white ${
                isVideoOff ? 'bg-error' : 'bg-neutral-700 hover:bg-neutral-600'
              }`}
              title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            
            <div className="h-8 border-r border-neutral-600 mx-2"></div>
            
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-3 rounded-full text-white ${
                chatOpen ? 'bg-primary' : 'bg-neutral-700 hover:bg-neutral-600'
              }`}
              title="Toggle chat"
            >
              <MessageSquare size={20} />
            </button>
            
            <button
              onClick={() => setUsersOpen(!usersOpen)}
              className={`p-3 rounded-full text-white ${
                usersOpen ? 'bg-primary' : 'bg-neutral-700 hover:bg-neutral-600'
              }`}
              title="Toggle participants list"
            >
              <Users size={20} />
            </button>
          </div>
          
          {/* Center controls - Reactions */}
          {debate.reactionsEnabled && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => sendReaction('thumbsUp')}
                className="p-3 rounded-full text-white bg-neutral-700 hover:bg-neutral-600"
                title="Thumbs up"
              >
                <ThumbsUp size={20} />
              </button>
              
              <button
                onClick={() => sendReaction('thumbsDown')}
                className="p-3 rounded-full text-white bg-neutral-700 hover:bg-neutral-600"
                title="Thumbs down"
              >
                <ThumbsDown size={20} />
              </button>
            </div>
          )}
          
          {/* Right controls */}
          <div className="flex items-center space-x-2">
            {/* Voting buttons (only for audience) */}
            {role === 'audience' && debate.votingEnabled && (
              <div className="flex items-center">
                <button
                  onClick={() => castVote('for')}
                  className="px-4 py-2 rounded-l-full text-white bg-success hover:bg-opacity-80"
                  title="Vote For"
                >
                  For
                </button>
                
                <button
                  onClick={() => castVote('neutral')}
                  className="px-4 py-2 text-white bg-info hover:bg-opacity-80"
                  title="Vote Neutral"
                >
                  Neutral
                </button>
                
                <button
                  onClick={() => castVote('against')}
                  className="px-4 py-2 rounded-r-full text-white bg-error hover:bg-opacity-80"
                  title="Vote Against"
                >
                  Against
                </button>
              </div>
            )}
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-full text-white ${
                showSettings ? 'bg-primary' : 'bg-neutral-700 hover:bg-neutral-600'
              }`}
              title="Settings"
            >
              <Settings size={20} />
            </button>
            
            <button
              onClick={() => setConfirmModalOpen(true)}
              className="p-3 rounded-full text-white bg-error hover:bg-error/80"
              title="Leave debate"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Chat panel */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-lg transition-transform duration-300 z-20 ${
          chatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="font-semibold">Chat</h3>
            <button
              onClick={() => setChatOpen(false)}
              className="p-1 rounded-full hover:bg-neutral-100"
            >
              <X size={18} />
            </button>
          </div>
          
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.length === 0 ? (
              <p className="text-neutral-500 text-center text-sm">
                No messages yet. Start the conversation!
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender.id === user?.id
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="font-medium text-sm">{message.sender.name}</span>
                      {message.sender.role === 'moderator' && (
                        <span className="bg-accent text-white text-xs px-1.5 py-0.5 rounded">
                          Mod
                        </span>
                      )}
                    </div>
                    <p className="text-sm break-words">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-neutral-200">
            <form onSubmit={sendMessage}>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-primary"
                />
                <button
                  type="submit"
                  className="ml-2 bg-primary text-white p-2 rounded-lg"
                  disabled={!newMessage.trim()}
                >
                  <MessageSquare size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Participants panel */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-80 bg-white shadow-lg transition-transform duration-300 z-20 ${
          usersOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="font-semibold">Participants</h3>
            <button
              onClick={() => setUsersOpen(false)}
              className="p-1 rounded-full hover:bg-neutral-100"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {/* Moderator */}
            <div className="p-4 border-b border-neutral-200">
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Moderator</h4>
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
            <div className="p-4 border-b border-neutral-200">
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Participants</h4>
              <div className="space-y-3">
                {debate.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-medium text-lg">
                        {participant.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{participant.name}</p>
                        <div className="flex items-center">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-1 ${
                              participant.speaking ? 'bg-accent animate-pulse' : 'bg-neutral-400'
                            }`}
                          ></span>
                          <p className="text-xs text-neutral-500">
                            {participant.position === 'for' ? 'For' : 
                             participant.position === 'against' ? 'Against' : 'Neutral'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Moderator controls */}
                    {role === 'moderator' && (
                      <div className="relative">
                        <button className="p-1 rounded-full hover:bg-neutral-100">
                          <MoreVertical size={18} />
                        </button>
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg py-1 z-30">
                          <button
                            onClick={() => openConfirmModal('mute', participant.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          >
                            <VolumeX size={16} className="mr-2 text-neutral-500" />
                            Mute
                          </button>
                          <button
                            onClick={() => openConfirmModal('kick', participant.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-neutral-100"
                          >
                            <UserMinus size={16} className="mr-2" />
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Audience */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-neutral-500">Audience</h4>
                <button className="p-1 rounded-full hover:bg-neutral-100">
                  <ChevronDown size={18} />
                </button>
              </div>
              <p className="text-sm text-neutral-600 mt-1">
                {debate.audience || 0} viewers
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings panel */}
      {showSettings && (
        <div className="absolute right-4 bottom-24 w-80 bg-white rounded-lg shadow-lg z-20">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="font-semibold">Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1 rounded-full hover:bg-neutral-100"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Video Quality</h4>
              <select className="w-full border border-neutral-300 rounded-lg px-3 py-2">
                <option value="high">High (720p)</option>
                <option value="medium">Medium (480p)</option>
                <option value="low">Low (360p)</option>
              </select>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Audio Input</h4>
              <select className="w-full border border-neutral-300 rounded-lg px-3 py-2">
                <option value="default">Default Microphone</option>
              </select>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Video Input</h4>
              <select className="w-full border border-neutral-300 rounded-lg px-3 py-2">
                <option value="default">Default Camera</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Noise Suppression</span>
              <label className="switch">
                <input type="checkbox" checked />
                <span className="slider round"></span>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Enable Reactions</span>
              <label className="switch">
                <input type="checkbox" checked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <h3 className="font-semibold">Confirm Action</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-start mb-4">
                <AlertCircle size={24} className="text-warning mr-3 flex-shrink-0" />
                <p>
                  {confirmAction ? (
                    confirmAction.action === 'kick' ? (
                      `Are you sure you want to remove this participant from the debate?`
                    ) : confirmAction.action === 'mute' ? (
                      `Are you sure you want to mute this participant?`
                    ) : (
                      `Are you sure you want to leave this debate? You may not be able to rejoin if it's in progress.`
                    )
                  ) : (
                    `Are you sure you want to leave this debate? You may not be able to rejoin if it's in progress.`
                  )}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                
                <button
                  onClick={() => {
                    if (confirmAction) {
                      executeModeratorAction(confirmAction.action, confirmAction.userId);
                    } else {
                      leaveDebate();
                    }
                    setConfirmModalOpen(false);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for floating animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(-50%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(-50%);
            opacity: 0;
          }
        }
        
        .animate-float {
          animation: float 2s ease-out forwards;
        }
        
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

export default DebateRoom;