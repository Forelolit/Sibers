import { paths } from '@/constants/constans';
import { useAuthStore } from '@/store/useAuthStore';
import { Navigate, Outlet, useLocation } from 'react-router';

/**
 * PrivateRoute component
 * Protects routes that require authentication.
 * If the user is not authenticated, they are redirected to the login page.
 * Otherwise, renders the nested route via <Outlet />.
 */

export const PrivateRoute = () => {
    // Get current location to redirect back after login
    const location = useLocation();

    // Check if user is authenticated from global state
    const isAuth = useAuthStore((state) => state.isAuth);

    // Redirect to login if user is not authenticated
    if (!isAuth) {
        return <Navigate to={paths.login} state={{ from: location }} replace />;
    }

    // Render nested routes for authenticated users
    return <Outlet />;
};
