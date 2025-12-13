import {
    AddChannelDialog,
    ChatArticle,
    Container,
    RegisterRequired,
    SearchInput,
    Separator,
    Spinner,
} from '@/components';
import { channelService } from '@/firebase/channelService';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { type FC } from 'react';

export const ChatPage: FC = () => {
    const isAuth = useAuthStore((state) => state.isAuth);
    const user = useAuthStore((state) => state.user);

    const { data: channels, isLoading } = useQuery({
        queryKey: ['channels', user?.channelIds],
        queryFn: channelService.getChannelsByIds,
        enabled: !!user?.channelIds,
    });

    return (
        <section className="h-full">
            <Container>
                <div
                    className={clsx(
                        'flex items-center',
                        !isAuth && 'justify-center h-[700px]',
                        isAuth && 'h-full flex-col gap-6',
                    )}>
                    {isAuth && (
                        <>
                            <SearchInput />

                            <AddChannelDialog />
                            
                            <Separator />

                            {isLoading && (
                                <div className="h-[300px] flex justify-center items-center">
                                    <Spinner className="size-10" />
                                </div>
                            )}

                            <ul className="flex flex-col gap-4 w-full">
                                {channels?.map((c) => (
                                    <li key={c.id}>
                                        <ChatArticle data={c} />
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {!isAuth && (
                        <div className="block">
                            <h2 className="text-2xl text-gray-500">Channels</h2>
                            <RegisterRequired />
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
};
