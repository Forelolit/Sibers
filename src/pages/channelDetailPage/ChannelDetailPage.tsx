import {
    Container,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    Separator,
    Spinner,
} from '@/components/index';
import { messageService } from '@/firebase/messageService';
import { useGetChannelById } from '@/hooks/useGetChannelById';
import { useGetChannelUsers } from '@/hooks/useGetChannelUsers';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowUpIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { Navigate, useParams } from 'react-router';
import { toast } from 'sonner';
import {
    ChannelDetailHeader,
    ChannelDetailCurrentUserMessage,
    ChannelDetailOtherUserMessage,
} from './components/index';
import { paths } from '@/constants/constans';

export const ChannelDetailPage: FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputMes, setInputMes] = useState('');
    const [sending, setSending] = useState(false);
    const { slug } = useParams<{ slug: string }>();

    const currentUser = useAuthStore((state) => state.user);
    const { data: channel, isLoading: channelLoading } = useGetChannelById(slug);
    const memberIds = channel?.memberIds;
    const { data: members, isLoading: membersLoading } = useGetChannelUsers(memberIds ?? []);
    const { messages } = useRealtimeMessages(slug || null);

    const membersMap = useMemo(() => {
        return new Map(members?.map((user) => [user.uid, user]));
    }, [members]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [membersLoading, messages]);

    useEffect(() => {
        if (!sending) {
            inputRef.current?.focus();
        }
    }, [sending]);

    if (!currentUser) {
        return <Navigate to={paths.login} replace />;
    }

    if (channelLoading) {
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (!channel) {
        return <Navigate to={paths.channels} replace />;
    }

    const isMember = channel.memberIds.includes(currentUser.uid);
    if (!isMember) {
        return <Navigate to={paths.channels} replace />;
    }

    const sendMesHandler = async (mes: string) => {
        if (!mes.trim() || !slug) return;

        setSending(true);

        try {
            await messageService.sendMessage(slug, mes.trim());
            setInputMes('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const enterMesHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMesHandler(inputMes);
        }
    };

    return (
        <section>
            <Container>
                <div className="relative min-h-screen flex flex-col gap-5">
                    <ChannelDetailHeader
                        channel={channel}
                        members={members}
                        channelLoading={channelLoading}
                        membersLoading={membersLoading}
                    />
                    <div className="flex-1 p-4">
                        {channelLoading || membersLoading ? (
                            <p className="text-gray-500 text-center">Loading messages...</p>
                        ) : messages.length === 0 ? (
                            <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
                        ) : (
                            <div className="flex flex-col gap-5 overflow-y-auto">
                                {messages
                                    .slice()
                                    .reverse()
                                    .map((mes) => {
                                        const isCurrentUser = currentUser?.uid === mes.senderId;
                                        const sender = membersMap?.get(mes.senderId) ?? null;

                                        if (isCurrentUser) {
                                            return (
                                                <ChannelDetailCurrentUserMessage
                                                    key={mes.id}
                                                    currentUser={currentUser}
                                                    mes={mes}
                                                />
                                            );
                                        }

                                        return <ChannelDetailOtherUserMessage key={mes.id} mes={mes} sender={sender} />;
                                    })}
                            </div>
                        )}
                    </div>

                    <div className="sticky bottom-0 bg-neutral-50 border-t border-neutral-300 p-4 rounded-t-xl">
                        <InputGroup>
                            <InputGroupInput
                                placeholder="Chat..."
                                value={inputMes}
                                onChange={(e) => setInputMes(e.target.value)}
                                onKeyDown={enterMesHandler}
                                disabled={sending}
                                ref={inputRef}
                            />

                            <InputGroupAddon align="inline-end">
                                <Separator orientation="vertical" className="h-4!" />

                                <InputGroupButton
                                    variant="default"
                                    className="rounded-full"
                                    size="icon-xs"
                                    onClick={() => sendMesHandler(inputMes)}
                                    disabled={sending || !inputMes.trim()}>
                                    <ArrowUpIcon />
                                    <span className="sr-only">Send</span>
                                </InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <div ref={messagesEndRef} />
                </div>
            </Container>
        </section>
    );
};
