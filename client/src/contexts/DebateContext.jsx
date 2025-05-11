import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DebateContext = createContext();

export const DebateProvider = ({ children }) => {
  const [debates, setDebates] = useState([]);
  const [userDebates, setUserDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDebate, setCurrentDebate] = useState(null);

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');

        const res = await axios.get('http://localhost:5000/api/debates', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const createDebate = async (debateData) => {
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
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const savedDebate = response.data;
    setDebates(prev => [savedDebate, ...prev]);
    setUserDebates(prev => [savedDebate, ...prev]);

    return savedDebate;
  };

  const updateDebate = async (id, updates) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/debates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!token) {
        console.error('No auth token found. User may not be logged in.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update debate');
      }

      const updatedDebate = await response.json();

      // Update local state
      setDebates(prev =>
        prev.map(debate =>
          debate.id === id ? updatedDebate : debate
        )
      );

      setUserDebates(prev =>
        prev.map(debate =>
          debate.id === id ? updatedDebate : debate
        )
      );

      if (currentDebate?._id === id) {
        setCurrentDebate(updatedDebate); // or {...prev, ...updatedDebate} if needed
      }
    } catch (error) {
      console.error('Error updating debate:', error.message);
      // Optionally show error to user
    }
  };

  const deleteDebate = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/debates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete debate');
      }

      
      setDebates(prev => prev.filter(debate => debate.id !== id));
      setUserDebates(prev => prev.filter(debate => debate.id !== id));

     
      if (currentDebate?._id === id) {
        setCurrentDebate(null);
      }
    } catch (error) {
      console.error('Error deleting debate:', error.message);
      // Optionally show error to user
    }
  };

  const joinDebate = (debateId, role) => {
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
    deleteDebate,  
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
