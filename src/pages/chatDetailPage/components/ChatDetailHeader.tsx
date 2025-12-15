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
import type { ChannelType } from '@/types/channeInterface';
import type { User } from '@/types/userInterface';
import { Users } from 'lucide-react';
import type { FC } from 'react';

interface ChatDetailHeaderProps {
    channel: ChannelType | undefined | null;
    membersLoading: boolean;
    members: User[] | undefined;
    slug: string | undefined;
}

export const ChatDetailHeader: FC<ChatDetailHeaderProps> = ({ channel, members, membersLoading, slug }) => {
    return (
        <div className="z-20 sticky top-0 flex justify-between items-center p-2 border-b bg-white">
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
                                        <AvatarFallback>{m.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
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
    );
};
