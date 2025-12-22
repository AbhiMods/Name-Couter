import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', color: 'white' }}>Loading...</div>;
    }

    if (!user) {
        // Redirect to home with auth=login query param to trigger the modal
        return <Navigate to="/?auth=login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
