import { Home, MessageSquareDot } from 'lucide-react';

/**
 * Application routes paths
 * Centralized object for route paths used across the app.
 */
export const paths = {
    home: '/',
    channels: '/channels',
    channelsDetail: '/channels/:slug',
    notFound: '*',
    login: '/auth/login',
};

/**
 * Sidebar menu items
 * Each item includes a title, URL, icon, and a flag indicating if it's private.
 */
export const sidebarItems = [
    {
        title: 'Home',
        url: paths.home,
        icon: Home,
        isPrivate: false, // Publicly accessible
    },
    {
        title: 'Channels',
        url: paths.channels,
        icon: MessageSquareDot,
        isPrivate: true, // Requires authentication
    },
];
