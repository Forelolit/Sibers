import { createBrowserRouter } from 'react-router';
import * as Pages from '@/pages/index';
import { paths } from '@/constants/constans';
import { Layout } from '@/app/layout';
import { PrivateRoute } from './PrivateRoute';

export const Router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: paths.home,
                element: <Pages.HomePage />,
            },
            {
                path: paths.notFound,
                element: <Pages.NotFoundPage />,
            },

            {
                path: paths.channelsDetail,
                element: <Pages.ChatDetailPage />,
            },
            {
                path: paths.login,
                element: <Pages.LoginPage />,
            },
            {
                element: <PrivateRoute />,
                children: [
                    {
                        path: paths.channelsDetail,
                        element: <Pages.ChatDetailPage />,
                    },
                    {
                        path: paths.channels,
                        element: <Pages.ChatPage />,
                    },
                ],
            },
        ],
    },
]);
