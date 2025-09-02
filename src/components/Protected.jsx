import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // If the auth state is still loading, show a loading indicator.
  // This prevents rendering the page or redirecting prematurely.
  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif', color: '#475569' }}>Loading Application...</h2>
        </div>
    );
  }

  // If loading is complete and there is no user, redirect to the login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If loading is complete and there is a user, render the page they requested
  return children;
}