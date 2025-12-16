import { AppSidebar, SidebarProvider } from '@/components';
import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

/**
 * Main application layout
 * Wraps the app with SidebarProvider to manage sidebar state,
 * renders AppSidebar and page content, and includes global notifications.
 */
export const Layout = () => {
    return (
        <>
            {/* Provides context for sidebar state and toggling */}
            <SidebarProvider>
                {/* Main sidebar navigation */}
                <AppSidebar />

                {/* Main content area where nested routes will render */}
                <main className="w-full bg-linear-to-br from-gray-50 to-gray-100">
                    <Outlet />
                </main>

                {/* Global toast notifications */}
                <Toaster position="top-right" />
            </SidebarProvider>
        </>
    );
};
