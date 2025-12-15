import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Container,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    Separator,
    Skeleton,
    Spinner,
} from '@/components';
import { messageService } from '@/firebase/messageService';
import { useGetChannelById } from '@/hooks/useGetChannelById';
import { useGetChannelUsers } from '@/hooks/useGetChannelUsers';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowUpIcon, Users } from 'lucide-react';
import { useEffect, useRef, useState, type FC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

export const ChatDetailPage: FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const currentUser = useAuthStore((state) => state.user);
    const [inputMes, setInputMes] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { data: channel, isLoading: channelLoading } = useGetChannelById(slug);
    const memberIds = channel?.memberIds;
    const { data: members, isLoading: membersLoading } = useGetChannelUsers(memberIds ?? []);

    const { messages } = useRealtimeMessages(slug || null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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

    return (
        <section className="h-full overflow-y-auto">
            <Container>
                <div className="relative h-screen flex flex-col justify-between">
                    <div className="flex justify-between items-center p-2 border-b bg-white">
                        <div className="flex gap-3 items-center">
                            <Avatar className="size-12">
                                <AvatarImage src={channel?.channelImage} />
                                <AvatarFallback>
                                    {channel?.name ? (
                                        channel.name.slice(0, 2).toUpperCase()
                                    ) : slug ? (
                                        slug.slice(0, 2).toUpperCase()
                                    ) : (
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                    )}
                                </AvatarFallback>
                            </Avatar>

                            <Separator orientation="vertical" className="h-6!" />

                            <h2>{channel?.name || slug || <Skeleton className="h-4 w-[200px]" />}</h2>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="border border-neutral-800 p-1 rounded cursor-pointer">
                                <Users />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Channel members</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {membersLoading && (
                                    <DropdownMenuItem className="flex justify-center">
                                        <Spinner />
                                    </DropdownMenuItem>
                                )}
                                {members?.map((m) => (
                                    <DropdownMenuItem key={m.uid}>
                                        <div className="w-full flex gap-2 justify-between">
                                            <div className="flex gap-2 items-center">
                                                <Avatar>
                                                    <AvatarImage src={m.photoURL ?? ''} />
                                                    <AvatarFallback>
                                                        {m.displayName?.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="truncate max-w-[200px]">{m.displayName}</span>
                                            </div>
                                            <Button>Kick</Button>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

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
                                        .map((mes) =>
                                            currentUser?.uid === mes.senderId ? (
                                                <div key={mes.id} className="flex flex-row-reverse gap-2 w-full">
                                                    <Avatar className="size-10 self-end">
                                                        <AvatarImage src={currentUser.photoURL ?? ''} />
                                                        <AvatarFallback>
                                                            {currentUser.displayName?.slice(0, 2).toUpperCase() || 'ME'}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex flex-col max-w-[50%]">
                                                        <div className="flex gap-2 items-center justify-end mb-1">
                                                            <span className="text-xs text-neutral-500">You</span>

                                                            <span className="text-[10px] text-neutral-400 self-end mt-1">
                                                                {mes.createdAt?.toDate?.()?.toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                }) || 'Sending...'}
                                                            </span>
                                                        </div>

                                                        <div className="bg-green-100 text-neutral-900 wrap-break-word break-normal px-4 py-2 rounded-2xl rounded-tr-none shadow-sm">
                                                            {mes.text}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div key={mes.id} className="flex flex-row gap-2 w-full">
                                                    <Avatar className="size-10 self-end">
                                                        <AvatarImage src="" />
                                                        <AvatarFallback>
                                                            {mes.senderId.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex flex-col max-w-[50%]">
                                                        <span className="text-xs text-neutral-500 mb-1">
                                                            {mes.senderId}
                                                        </span>

                                                        <div className="bg-gray-200 text-neutral-900 wrap-break-word break-normal px-4 py-2 rounded-2xl rounded-tl-none shadow-sm">
                                                            {mes.text}
                                                        </div>

                                                        <span className="text-[10px] text-neutral-400 mt-1">
                                                            {mes.createdAt?.toDate?.()?.toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            }) || 'Sending...'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
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
