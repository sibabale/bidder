import { Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

interface RouteGuardProps {
    component: React.ComponentType<any>;
    isPrivate?: boolean;
}

const RouteGuard = ({ component: Component, isPrivate = false }: RouteGuardProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('bidder');
            setIsAuthenticated(!!token);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isPrivate && !isAuthenticated) {
        return <Navigate to="/signin" />;
    }

    if (!isPrivate && isAuthenticated) {
        return <Navigate to="/welcome" replace />;
    }

    return <Component />;
};

export default RouteGuard;
