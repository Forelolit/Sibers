import { Home, MessageSquareDot } from 'lucide-react';

export const paths = {
    home: '/',
    channels: '/channels',
    channelsDetail: '/channels/:slug',
    notFound: '*',
    login: '/auth/login',
};

export const sidebarItems = [
    {
        title: 'Home',
        url: paths.home,
        icon: Home,
        isPrivate: false,
    },
    {
        title: 'Channels',
        url: paths.channels,
        icon: MessageSquareDot,
        isPrivate: true,
    },
];
