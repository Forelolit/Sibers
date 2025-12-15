import { type FC } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/index';
import { userService } from '@/firebase/userService';
import { toast } from 'sonner';
import type { ChannelType } from '@/types/channeInterface';

interface ChannelForInviteDialogProps {
    userId: string;
    channels: ChannelType[];
}

export const ChannelForInviteDialog: FC<ChannelForInviteDialogProps> = ({ userId, channels }) => {
    const handleAddUser = async (userId: string, channelId: string) => {
        try {
            await userService.addUserToChannel(userId, channelId);
            toast.success('User added to channel');

            //FIXME сделать проверку на наличие юзера в канале
        } catch (error) {
            toast.error(error.message);
        }
    };
    {
        console.log(channels);
    }

    return (
        <Dialog>
            <DialogTrigger className="cursor-pointer bg-neutral-800 text-neutral-100 py-2 px-4 rounded-[10px]">
                Invite
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Channels</DialogTitle>
                </DialogHeader>

                <DialogDescription>Select a channel to invite a member</DialogDescription>

                {channels ? (
                    channels?.map((channel) => (
                        <div key={channel.id} className="flex justify-between items-center border rounded p-1">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={channel.channelImage} />
                                    <AvatarFallback>{channel.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span>{channel.name}</span>
                            </div>
                            <Button onClick={() => handleAddUser(userId, channel.id)}>Select</Button>
                        </div>
                    ))
                ) : (
                    <div>No invitation chats</div>
                )}
            </DialogContent>
        </Dialog>
    );
};
