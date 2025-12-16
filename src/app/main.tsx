import '@/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { Router } from './router/Router';

/**
 * Entry point of the React application
 * Sets up global providers for React Query and routing.
 */

// Create a React Query client for caching and fetching server data
const queryClient = new QueryClient();

// Mount the application to the root element
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={Router} />
        </QueryClientProvider>
    </StrictMode>,
);
