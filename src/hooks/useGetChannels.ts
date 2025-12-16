import { useQuery } from '@tanstack/react-query';
import { channelService } from '@/firebase/channelService';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Custom hook to fetch all channels for the current authenticated user
 * Uses React Query for caching and auto-refetching
 * @returns React Query result object containing the user's channels
 */
export const useGetChannels = () => {
    const userId = useAuthStore((state) => state.user?.uid);

    return useQuery({
        queryKey: ['channels', userId],
        queryFn: () => channelService.getChannels(userId!),
        enabled: !!userId, // Only fetch if userId is available
        refetchInterval: 5000, // Poll every 5 seconds to get updates
    });
};
