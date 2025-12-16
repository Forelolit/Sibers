import { userService } from '@/firebase/userService';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to search users by a text query
 * Uses React Query for caching and managing loading state
 * @param search - Search string to filter users
 * @returns Object containing found users and loading state
 */
export const useSearchUsers = (search: string) => {
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['search-users', search],
        queryFn: () => userService.searchUsers(search),
        enabled: search.trim().length > 0, // Only fetch if search text is not empty
        staleTime: 60_000, // Cache results for 60 seconds
    });

    return { users, isLoading };
};
