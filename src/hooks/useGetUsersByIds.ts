import { userService } from '@/firebase/userService';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch multiple users by their IDs
 * Uses React Query for caching and loading state management
 * @param userIds - Array of user IDs to fetch
 * @returns Object containing users array and loading state
 */
export const useGetUsersByIds = (userIds: string[]) => {
    const { data: users, isLoading } = useQuery({
        queryKey: ['users', userIds],
        queryFn: () => userService.getUsersByIds(userIds),
        enabled: userIds.length > 0, // Only fetch if there are user IDs
    });

    return { users, isLoading };
};
