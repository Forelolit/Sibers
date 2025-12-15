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

export const AppSidebar: FC = () => {
    const isAuth = useAuthStore((state) => state.isAuth);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const visibleSidebarItems = sidebarItems.filter((item) => !item.isPrivate || isAuth);

    return (
        <Sidebar>
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
