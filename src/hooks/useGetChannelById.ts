import { channelService } from '@/firebase/channelService';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch a single channel by its ID (slug)
 * Uses React Query for caching and fetching
 * @param slug - ID of the channel
 * @returns React Query result object containing channel data
 */
export const useGetChannelById = (slug?: string) => {
    return useQuery({
        queryKey: ['channel', slug],
        queryFn: async () => {
            if (!slug) {
                return null;
            }

            const channels = await channelService.getChannelsByIds([slug]);
            return channels[0] ?? null; // Return first match or null
        },
        enabled: Boolean(slug), // Only fetch if slug is provided
    });
};
