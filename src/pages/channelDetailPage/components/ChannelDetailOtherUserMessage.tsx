import { Avatar, AvatarFallback, AvatarImage } from '@/components';
import type { Message } from '@/types/messageInterface';
import type { User } from '@/types/userInterface';
import type { FC } from 'react';

interface ChannelDetailOtherUserMessageProps {
    mes: Message;
    sender: User | null;
}

/**
 * Displays a single message from another user in a channel.
 * Shows sender's avatar, name, message text, and timestamp.
 */

export const ChannelDetailOtherUserMessage: FC<ChannelDetailOtherUserMessageProps> = ({ mes, sender }) => {
    const senderFallback = !sender ? 'Deleted user' : sender.displayName;

    return (
        <div key={mes.id} className="flex flex-row gap-2 w-full">
            <Avatar className="size-10 self-end">
                <AvatarImage src={sender?.photoURL ?? ''} />
                <AvatarFallback>{senderFallback?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col max-w-[50%]">
                <span className="text-xs text-neutral-500 mb-1">{senderFallback}</span>

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
    );
};
