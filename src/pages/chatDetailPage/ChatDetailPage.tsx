import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Container,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    Separator,
    Skeleton,
} from '@/components';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowUpIcon } from 'lucide-react';
import { useState, type FC } from 'react';
import { useParams } from 'react-router';

const messages = [
    {
        mesId: 1,
        message: 'Hello world',
        user: {
            id: 'ce7b595c-f00a-4f64-8c2b-f594h35e8a9b',
            name: 'Test-user',
        },
    },
    {
        mesId: 2,
        message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        user: {
            id: 'vhNfBrMn8bXY7JJTvsstFTu5Dkk2',
            name: 'Aki',
        },
    },
    {
        mesId: 3,
        message:
            'Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world',
        user: {
            id: 'ce7b595c-f00a-4f64-8c2b-f594h35e8a9b',
            name: 'Test-user',
        },
    },
    {
        mesId: 4,
        message: 'Hello world',
        user: {
            id: 'ce7b595c-f00a-4f64-8c2b-f594h35e8a9b',
            name: 'Test-user',
        },
    },
    {
        mesId: 5,
        message: 'Hello world',
        user: {
            id: 'ce7b595c-f00a-4f64-8c2b-f594h35e8a9b',
            name: 'Test-user',
        },
    },
    {
        mesId: 6,
        message: 'Good 👍',
        user: {
            id: 'vhNfBrMn8bXY7JJTvsstFTu5Dkk2',
            name: 'Aki',
        },
    },
];

export const ChatDetailPage: FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const currentUser = useAuthStore((state) => state.user);
    const [inputMes, setInputMes] = useState('');

    const sendMesHandler = (mes: string) => {
        console.log(mes);
        setInputMes('');
    };

    const enterMesHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            sendMesHandler(inputMes);
        }
    };

    return (
        <section className="h-full overflow-y-auto">
            <Container>
                <div className="relative h-screen flex flex-col justify-between">
                    <div className="flex gap-3 items-center p-2 border-b bg-white">
                        <Avatar className="size-12">
                            <AvatarImage src="" />
                            <AvatarFallback>
                                {slug ? (
                                    slug.slice(0, 2).toUpperCase()
                                ) : (
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                )}
                            </AvatarFallback>
                        </Avatar>

                        <Separator orientation="vertical" className="h-6!" />

                        <h2>{slug ? slug : <Skeleton className="h-4 w-[200px]" />}</h2>
                    </div>

                    <div className="h-fit flex flex-col gap-5 border border-red-600">
                        {messages.map((mes) =>
                            currentUser?.uid === mes.user.id ? (
                                <div key={mes.mesId} className="flex flex-row-reverse gap-2 w-full">
                                    <Avatar className="size-10 self-end">
                                        <AvatarImage src="" />
                                        <AvatarFallback>{mes.user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col max-w-[50%]">
                                        <span className="text-xs text-neutral-500 self-baseline-last mb-1">You</span>

                                        <div className="bg-green-100 text-neutral-900 wrap-break-word break-normal px-4 py-2 rounded-2xl rounded-tr-none shadow-sm">
                                            {mes.message}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div key={mes.mesId} className="flex flex-row gap-2 w-full">
                                    <Avatar className="size-10 self-end">
                                        <AvatarImage src="" />
                                        <AvatarFallback>{mes.user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col max-w-[50%]">
                                        <span className="text-xs text-neutral-500 mb-1">{mes.user.name}</span>

                                        <div className="bg-gray-200 text-neutral-900 wrap-break-word break-normal px-4 py-2 rounded-2xl rounded-tl-none shadow-sm">
                                            {mes.message}
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}

                        <div className="sticky bottom-2 z-10 w-full bg-neutral-50 border border-neutral-300 p-4 rounded-[22px] mb-4">
                            <InputGroup>
                                <InputGroupInput
                                    placeholder="Chat..."
                                    value={inputMes}
                                    onChange={(e) => setInputMes(e.target.value)}
                                    onKeyDown={enterMesHandler}
                                />

                                <InputGroupAddon align="inline-end">
                                    <Separator orientation="vertical" className="h-4!" />

                                    <InputGroupButton
                                        variant="default"
                                        className="rounded-full"
                                        size="icon-xs"
                                        onClick={() => sendMesHandler(inputMes)}>
                                        <ArrowUpIcon />

                                        <span className="sr-only">Send</span>
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
