import { Home, MessageSquareDot, Settings } from 'lucide-react';

export const paths = {
    home: '/',
    channels: '/channels',
    channelsDetail: '/channels/:slug',
    notFound: '*',
    register: '/auth/registration',
    login: '/auth/login',
};

export const sidebarItems = [
    {
        title: 'Home',
        url: paths.home,
        icon: Home,
    },
    {
        title: 'Channels',
        url: paths.channels,
        icon: MessageSquareDot,
    },
    {
        title: 'Settings',
        url: '#',
        icon: Settings,
    },
];
