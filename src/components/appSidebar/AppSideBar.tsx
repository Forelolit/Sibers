import type { FC } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/index';
import { sidebarItems } from '@/constants/constans';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from 'react-router';

/**
 * AppSidebar component
 * Renders the application's sidebar navigation.
 * Shows public and private menu items depending on authentication state.
 * Displays user info and logout button if authenticated.
 */

export const AppSidebar: FC = () => {
    // Get auth state, current user and logout function from global store
    const { isAuth, user, logout } = useAuthStore();

    // Filter sidebar entities: show all public entity and private entity only for authenticated users
    const visibleSidebarItems = sidebarItems.filter((item) => !item.isPrivate || isAuth);

    return (
        <Sidebar>
            {/* Sidebar main content */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {visibleSidebarItems.map(({ title, url, icon: Icon }) => (
                                <SidebarMenuItem key={title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={url}>
                                            <Icon />
                                            <span>{title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer with user info and logout button, visible only if authenticated */}
            {isAuth && user && (
                <SidebarFooter>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="size-12">
                                <AvatarImage src={user.photoURL ?? ''} />
                                <AvatarFallback>{user.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>

                            <p className="truncate max-w-20">{user.displayName}</p>
                        </div>

                        <Button onClick={logout}>Logout</Button>
                    </div>
                </SidebarFooter>
            )}
        </Sidebar>
    );
};
