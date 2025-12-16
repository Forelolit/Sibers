import { createBrowserRouter } from 'react-router';
import * as Pages from '@/pages/index';
import { paths } from '@/constants/constans';
import { Layout } from '@/app/layout';
import { PrivateRoute } from './PrivateRoute';

/**
 * Application router
 * Defines all routes for the app using react-router.
 * Layout wraps all pages, and PrivateRoute protects authenticated routes.
 */

export const Router = createBrowserRouter([
    {
        // Main layout for the application
        element: <Layout />,
        children: [
            {
                // Public home page
                path: paths.home,
                element: <Pages.HomePage />,
            },
            {
                // Catch-all 404 page
                path: paths.notFound,
                element: <Pages.NotFoundPage />,
            },
            {
                // Public login page
                path: paths.login,
                element: <Pages.LoginPage />,
            },
            {
                // Routes protected by authentication
                element: <PrivateRoute />,
                children: [
                    {
                        // Channel details page, requires auth
                        path: paths.channelsDetail,
                        element: <Pages.ChannelDetailPage />,
                    },
                    {
                        // Channel list page, requires auth
                        path: paths.channels,
                        element: <Pages.ChannelPage />,
                    },
                ],
            },
        ],
    },
]);
