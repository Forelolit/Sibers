import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Separator,
    Skeleton,
    Spinner,
} from '@/components/index';
import { userService } from '@/firebase/userService';
import { useAuthStore } from '@/store/useAuthStore';
import type { ChannelType } from '@/types/channeInterface';
import type { User } from '@/types/userInterface';
import { Users } from 'lucide-react';
import type { FC } from 'react';

interface ChatDetailHeaderProps {
    channel: ChannelType | undefined | null;
    channelLoading: boolean;
    members: User[] | undefined;
    membersLoading: boolean;
}

export const ChatDetailHeader: FC<ChatDetailHeaderProps> = ({ channel, members, membersLoading, channelLoading }) => {
    const removeUser = userService.deleteUserFromChannelById;
    const currentUserId = useAuthStore((state) => state.user?.uid);
    const channelId = channel?.id ? channel.id : '';

    return (
        <div className="z-20 sticky top-0 flex justify-between items-center p-2 border-b bg-white rounded-b-xl">
            <div className="flex gap-3 items-center">
                <Avatar className="size-12">
                    <AvatarImage src={channel?.channelImage} />
                    <AvatarFallback>
                        {!channel?.name && channelLoading ? (
                            <Skeleton className="h-12 w-12 rounded-full" />
                        ) : (
                            channel?.name.slice(0, 2).toUpperCase()
                        )}
                    </AvatarFallback>
                </Avatar>

                <Separator orientation="vertical" className="h-6!" />

                <h2>{!channel?.name && channelLoading ? <Skeleton className="h-4 w-[200px]" /> : channel?.name}</h2>
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
                            <div className="w-full flex gap-2 justify-between items-center">
                                <div className="flex gap-2 items-center max-w-[220px]">
                                    <Avatar>
                                        <AvatarImage src={m.photoURL ?? ''} />
                                        <AvatarFallback>{m.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="truncate max-w-full">{m.displayName}</span>
                                    {m.uid === currentUserId && (
                                        <>
                                            <Separator orientation="vertical" className="h-6!" />
                                            <span>You</span>
                                        </>
                                    )}
                                </div>

                                {currentUserId === channel?.owner && m.uid !== channel?.owner && (
                                    <Button onClick={() => removeUser(m.uid, channelId)}>Kick</Button>
                                )}
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
