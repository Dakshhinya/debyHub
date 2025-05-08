import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


const DebateContext = createContext();

export const DebateProvider = ({ children }) => {
  const [debates, setDebates] = useState([]);
  const [userDebates, setUserDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDebate, setCurrentDebate] = useState(null);
  
  // Mock data for debates
  const mockDebates = [
    {
      id: '1',
      title: 'The Future of Renewable Energy',
      description: 'Is renewable energy the solution to our climate crisis?',
      dateTime: '2025-06-15T18:00:00Z',
      duration: 90, // minutes
      status: 'upcoming',
      category: 'Environment',
      tags: ['climate', 'energy', 'sustainability'],
      moderator: {
        id: 'usr_mod1',
        name: 'Sarah Johnson',
      },
      participants: [
        { id: 'usr_p1', name: 'Alex Chen', position: 'for' },
        { id: 'usr_p2', name: 'Jordan Smith', position: 'against' },
        { id: 'usr_p3', name: 'Taylor Wong', position: 'for' },
        { id: 'usr_p4', name: 'Morgan Lee', position: 'against' },
      ],
      audience: 248,
      image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      id: '2',
      title: 'Artificial Intelligence Ethics',
      description: 'Will AI development help or harm humanity in the long run?',
      dateTime: '2025-06-18T20:00:00Z',
      duration: 60, // minutes
      status: 'upcoming',
      category: 'Technology',
      tags: ['AI', 'ethics', 'future'],
      moderator: {
        id: 'usr_mod2',
        name: 'Michael Rodriguez',
      },
      participants: [
        { id: 'usr_p5', name: 'Jamie Wilson', position: 'for' },
        { id: 'usr_p6', name: 'Casey Park', position: 'against' },
      ],
      audience: 172,
      image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      id: '3',
      title: 'Education Reform Debate',
      description: 'How should we reshape education for the modern world?',
      dateTime: '2025-06-20T17:30:00Z',
      duration: 120, // minutes
      status: 'upcoming',
      category: 'Education',
      tags: ['education', 'reform', 'policy'],
      moderator: {
        id: 'usr_mod3',
        name: 'Dana Morgan',
      },
      participants: [
        { id: 'usr_p7', name: 'Riley Johnson', position: 'for' },
        { id: 'usr_p8', name: 'Quinn Thompson', position: 'against' },
        { id: 'usr_p9', name: 'Avery Martinez', position: 'for' },
        { id: 'usr_p10', name: 'Jordan Lee', position: 'against' },
      ],
      audience: 315,
      image: 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      id: '4',
      title: 'Healthcare Access and Reform',
      description: 'Debating different approaches to healthcare systems worldwide.',
      dateTime: '2025-06-25T19:00:00Z',
      duration: 90, // minutes
      status: 'upcoming',
      category: 'Health',
      tags: ['healthcare', 'policy', 'access'],
      moderator: {
        id: 'usr_mod4',
        name: 'Robin Patel',
      },
      participants: [
        { id: 'usr_p11', name: 'Alex Kim', position: 'for' },
        { id: 'usr_p12', name: 'Sam Rivera', position: 'against' },
      ],
      audience: 198,
      image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      id: '5',
      title: 'Digital Privacy in the Modern Age',
      description: 'Should personal privacy be sacrificed for security and convenience?',
      dateTime: '2025-05-30T18:00:00Z',
      duration: 75, // minutes
      status: 'completed',
      category: 'Technology',
      tags: ['privacy', 'security', 'digital'],
      moderator: {
        id: 'usr_mod5',
        name: 'Jesse Chen',
      },
      participants: [
        { id: 'usr_p13', name: 'Morgan Wu', position: 'for' },
        { id: 'usr_p14', name: 'Taylor Garcia', position: 'against' },
      ],
      audience: 287,
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      recording: 'https://example.com/recordings/debate-5',
      winner: 'against',
    },
  ];
  
  useEffect(() => {
    // Simulate API fetch
    // const fetchDebates = async () => {
    //   try {
    //     setLoading(true);
        
    //     // Simulate network delay
    //     await new Promise(resolve => setTimeout(resolve, 500));
        
    //     setDebates(mockDebates);
        
    //     // Set a subset as user's debates (would normally be filtered by API)
    //     setUserDebates(mockDebates.slice(0, 3));
        
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Error fetching debates:', error);
    //     setLoading(false);
    //   }
    // };
    const fetchDebates = async () => {
      try {
        setLoading(true);
    
        const token = localStorage.getItem('token');
    
        const res = await axios.get('http://localhost:5000/api/debates', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        const allDebates = res.data.debates || res.data; // adjust based on your API response
    
        setDebates(allDebates);
    
        // Optional: Set a subset as user's debates based on logged-in user ID
        const user = JSON.parse(localStorage.getItem('user'));
        const filtered = allDebates.filter(debate => debate.moderator?.id === user?.id);
        setUserDebates(filtered);
    
      } catch (error) {
        console.error('Error fetching debates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDebates();
  }, []);
  
  const getDebateById = (id) => {
    return debates.find(debate => debate.id === id);
  };
  
  const createDebate = async(debateData) => {
    const newDebate = {
      id: `debate_${Date.now()}`,
      ...debateData,
      status: 'upcoming',
      audience: 0,
      dateCreated: new Date().toISOString(),
    };
    const response = await axios.post('http://localhost:5000/api/debates', newDebate, {
      headers: {
        'Content-Type': 'application/json',
        // Include the authentication token (if needed)
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    // The response will contain the created debate from the backend
    const savedDebate = response.data;
    setDebates(prev => [savedDebate, ...prev]);
    setUserDebates(prev => [savedDebate, ...prev]);
    
    return savedDebate;
  };
  
  const updateDebate = (id, updates) => {
    setDebates(prev => 
      prev.map(debate => 
        debate.id === id ? { ...debate, ...updates } : debate
      )
    );
    
    setUserDebates(prev => 
      prev.map(debate => 
        debate.id === id ? { ...debate, ...updates } : debate
      )
    );
    
    if (currentDebate?.id === id) {
      setCurrentDebate(prev => ({ ...prev, ...updates }));
    }
  };
  
  const joinDebate = (debateId, role) => {
    // In a real application, this would make an API call to join the debate
    // For now, we'll just update the local state
    setCurrentDebate(getDebateById(debateId));
    return { success: true, message: `Joined debate as ${role}` };
  };
  
  const leaveDebate = () => {
    setCurrentDebate(null);
    return { success: true, message: 'Left debate' };
  };
  
  const value = {
    debates,
    userDebates,
    loading,
    currentDebate,
    getDebateById,
    createDebate,
    updateDebate,
    joinDebate,
    leaveDebate,
  };
  
  return (
    <DebateContext.Provider value={value}>
      {children}
    </DebateContext.Provider>
  );
};

export const useDebate = () => {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error('useDebate must be used within a DebateProvider');
  }
  return context;
};