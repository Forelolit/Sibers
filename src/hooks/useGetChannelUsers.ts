import { userService } from '@/firebase/userService';
import { useQuery } from '@tanstack/react-query';

export const useGetChannelUsers = (memberIds: string[]) => {
    return useQuery({
        queryKey: ['channel-users', memberIds],
        queryFn: () => userService.getUsersByIds(memberIds),
        enabled: memberIds.length > 0,
    });
};
