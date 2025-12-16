import { userService } from '@/firebase/userService';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook for fetching current channel members
 * Uses React Query for caching and fetching
 * @param memberIds - Array of member IDs to fetch
 * @returns React Query result object containing members data
 */
export const useGetChannelUsers = (memberIds: string[]) => {
    return useQuery({
        queryKey: ['channel-users', memberIds],
        queryFn: () => userService.getUsersByIds(memberIds),
        enabled: memberIds.length > 0, // Only fetch if there are member IDs
    });
};
