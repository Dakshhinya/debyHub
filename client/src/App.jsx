import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { DebateProvider } from './contexts/DebateContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import RoleBasedRoute from './components/auth/RoleBasedRoute.jsx';

// Import the debug component
// import DebugEditComponent from './pages/debates/DebugEditComponent.jsx'; // Adjust path as needed

// Layout Components
import MainLayout from './layouts/MainLayout.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';

// Main Pages
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

// Debate Pages
import DebatesList from './pages/debates/DebatesList.jsx';
import DebateRoom from './pages/debates/DebateRoom.jsx';
import CreateDebate from './pages/debates/CreateDebate.jsx';
// import EditDebate from './pages/debates/EditDebate.jsx';
import DebateDetails from './pages/debates/DebateDetails.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import ManageDebates from './pages/admin/ManageDebates.jsx';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <DebateProvider>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Main Routes with Layout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  {/* Moderator Routes */}
                  <Route element={<RoleBasedRoute roles={['moderator', 'admin']} />}>
                    {/* <Route path="/debates/:id/edit" element={<EditDebate />} /> */}
                    {/* <Route path="/debates/:id/edit-protected" element={<EditDebate />} /> */}
                    <Route path="/debates/create" element={<CreateDebate />} />
                  </Route>

                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/debates" element={<DebatesList />} />
                  <Route path="/debates/:id" element={<DebateDetails />} />
                  
                  {/* Debate Room */}
                  <Route path="/debates/:id/room" element={<DebateRoom />} />
                  
                  {/* Admin Routes */}
                  <Route element={<RoleBasedRoute roles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<ManageUsers />} />
                    <Route path="/admin/debates" element={<ManageDebates />} />
                  </Route>
                </Route>
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DebateProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;