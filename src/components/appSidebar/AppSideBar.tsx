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

export const AppSidebar: FC = () => {
    const isAuth = useAuthStore((state) => state.isAuth);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex justify-between items-center">
                    {isAuth && (
                        <>
                            <div className="flex gap-2 items-center">
                                <Avatar className="size-12">
                                    <AvatarImage src={user?.photoURL} />
                                    <AvatarFallback>{user?.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <p className="truncate max-w-20">{user?.displayName}</p>
                            </div>
                            <Button onClick={() => logout()}>Logout</Button>
                        </>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};
