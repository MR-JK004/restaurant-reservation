import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function AdminGuard({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (user?.email !== 'admin@gmail.com') {
        return <Navigate to='/login' />;
    }

    return children;
}
