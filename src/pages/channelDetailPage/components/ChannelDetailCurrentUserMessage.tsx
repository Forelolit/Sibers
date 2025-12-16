import { Avatar, AvatarFallback, AvatarImage } from '@/components';
import type { Message } from '@/types/messageInterface';
import type { User } from '@/types/userInterface';
import type { FC } from 'react';

interface ChannelDetailCurrentUserMessageProps {
    currentUser: User;
    mes: Message;
}

export const ChannelDetailCurrentUserMessage: FC<ChannelDetailCurrentUserMessageProps> = ({ currentUser, mes }) => {
    return (
        <div key={mes.id} className="flex flex-row-reverse gap-2 w-full">
            <Avatar className="size-10 self-end">
                <AvatarImage src={currentUser.photoURL ?? ''} />
                <AvatarFallback>{currentUser.displayName?.slice(0, 2).toUpperCase() || 'ME'}</AvatarFallback>
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
    );
};
