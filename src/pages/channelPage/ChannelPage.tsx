import {
    AddChannelDialog,
    ChannelArticle,
    Container,
    RegisterRequired,
    SearchInput,
    Separator,
    Spinner,
} from '@/components';
import { useGetChannels } from '@/hooks/useGetChannels';
import { useAuthStore } from '@/store/useAuthStore';
import clsx from 'clsx';
import { type FC } from 'react';

export const ChannelPage: FC = () => {
    const isAuth = useAuthStore((state) => state.isAuth);
    const { data: channels = [], isLoading } = useGetChannels();

    return (
        <section className="h-full mb-10">
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
                                        <ChannelArticle data={c} />
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
