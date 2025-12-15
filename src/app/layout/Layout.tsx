import { AppSidebar, SidebarProvider } from '@/components';
import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

export const Layout = () => {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full bg-linear-to-br from-gray-50 to-gray-100">
                    <Outlet />
                </main>
                <Toaster position="top-right" />
            </SidebarProvider>
        </>
    );
};
