import { channelService } from '@/firebase/channelService';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch multiple channels by their IDs for the current user
 * Uses React Query to handle caching and fetching
 * @returns React Query result object containing channels data
 */
export const useGetChannelsByIds = () => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['channels', user?.channelIds],
        queryFn: () => channelService.getChannelsByIds(user?.channelIds ?? []),
        enabled: !!user?.channelIds, // Only fetch if user has channel IDs
    });
};
