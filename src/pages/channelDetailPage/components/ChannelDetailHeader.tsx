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
import { useEffect, useState, type FC } from 'react';
import { toast } from 'sonner';

interface ChannelDetailHeaderProps {
    channel: ChannelType | undefined | null;
    channelLoading: boolean;
    members: User[] | undefined;
    membersLoading: boolean;
}

/**
 * Renders the header for a channel detail page, displaying channel info and member list.
 * Supports kicking members if the current user is the channel owner.
 */

export const ChannelDetailHeader: FC<ChannelDetailHeaderProps> = ({
    channel,
    members,
    membersLoading,
    channelLoading,
}) => {
    const removeUser = userService.deleteUserFromChannelById;
    const currentUserId = useAuthStore((state) => state.user?.uid);
    const channelId = channel?.id ?? '';

    const [localMembers, setLocalMembers] = useState<User[]>([]);

    // Update local members state whenever members prop changes
    useEffect(() => {
        if (members) {
            setLocalMembers(members);
        }
    }, [members]);

    /**
     * Handles removing a user from the channel.
     * Updates the local member state optimistically and reverts if the operation fails.
     */
    const handleKick = async (userId: string) => {
        const prevMembers = localMembers;

        setLocalMembers((prev) => prev.filter((m) => m.uid !== userId));

        try {
            await removeUser(userId, channelId);
            const member = members?.find((m) => m.uid === userId);
            toast(`user ${member?.displayName} kicked`);
        } catch (error) {
            console.log(error);
            setLocalMembers(prevMembers);
        }
    };

    return (
        <div className="z-20 sticky top-0 flex justify-between items-center p-2 border-b bg-white rounded-b-xl">
            {/* header */}
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

            {/* Dropdown for channel members */}
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

                    {localMembers.map((m) => (
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
                                    <Button onClick={() => handleKick(m.uid)}>Kick</Button>
                                )}
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
