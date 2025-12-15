import {
    Container,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    Separator,
} from '@/components/index';
import { messageService } from '@/firebase/messageService';
import { useGetChannelById } from '@/hooks/useGetChannelById';
import { useGetChannelUsers } from '@/hooks/useGetChannelUsers';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowUpIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { ChatDetailHeader } from './components/ChatDetailHeader';
import { ChatDetailCurrentUserMessage } from './components/ChatDetailCurrentUserMessage';
import { ChatDetailOtherUserMessage } from './components/ChatDetailOtherUserMessage';

export const ChatDetailPage: FC = () => {
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

    const sendMesHandler = async (mes: string) => {
        if (!mes.trim() || !slug) return;

        setSending(true);

        try {
            await messageService.sendMessage(slug, mes.trim());
            setInputMes('');
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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!sending) {
            inputRef.current?.focus();
        }
    }, [sending]);

    return (
        <section className="h-full overflow-y-auto">
            <Container>
                <div className="relative h-screen flex flex-col justify-between">
                    <ChatDetailHeader channel={channel} members={members} membersLoading={membersLoading} slug={slug} />

                    <div className="h-fit flex flex-col gap-5">
                        <div className="flex-1 overflow-y-auto p-4">
                            {channelLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">Loading messages...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {messages
                                        .slice()
                                        .reverse()
                                        .map((mes) => {
                                            const isCurrentUser = currentUser?.uid === mes.senderId;
                                            const sender = membersMap?.get(mes.senderId) ?? null;

                                            if (isCurrentUser) {
                                                return (
                                                    <ChatDetailCurrentUserMessage
                                                        key={mes.id}
                                                        currentUser={currentUser}
                                                        mes={mes}
                                                    />
                                                );
                                            }

                                            return (
                                                <ChatDetailOtherUserMessage key={mes.id} mes={mes} sender={sender} />
                                            );
                                        })}

                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 w-full bg-neutral-50 border-t border-neutral-300 p-4">
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
                    </div>
                </div>
            </Container>
        </section>
    );
};
