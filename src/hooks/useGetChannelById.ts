import { channelService } from '@/firebase/channelService';
import { useQuery } from '@tanstack/react-query';

export const useGetChannelById = (slug?: string) => {
    return useQuery({
        queryKey: ['channel', slug],
        queryFn: async () => {
            if (!slug) {
                return null;
            }

            const channels = await channelService.getChannelsByIds([slug]);
            return channels[0] ?? null;
        },
        enabled: Boolean(slug),
    });
};
