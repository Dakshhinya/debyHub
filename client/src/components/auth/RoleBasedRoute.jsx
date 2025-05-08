import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LoadingScreen from '../common/LoadingScreen.jsx';

const RoleBasedRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Check if user's role is in the allowed roles
  const hasRequiredRole = user && roles.includes(user.role);
  
  if (!hasRequiredRole) {
    // Redirect to dashboard if user doesn't have the required role
    return <Navigate to="/dashboard" replace />;
  }
  
  // If user has the required role, render child routes
  return <Outlet />;
};

export default RoleBasedRoute;