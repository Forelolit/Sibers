import { type FC, useState } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Input } from '@/components/index';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { DialogDescription } from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { Ban, Check } from 'lucide-react';
import { serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { channelService } from '@/firebase/channelService';
import { useQueryClient } from '@tanstack/react-query';

interface Inputs {
    name: string;
    channelImage: string;
}

export const AddChannelDialog: FC = () => {
    const isAuth = useAuthStore((state) => state.isAuth);
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!isAuth || !user) {
            toast('You need to login first', {
                icon: <Ban color="red" />,
                position: 'top-right',
            });
            return;
        }

        try {
            const channelId = await channelService.createChannel({
                id: crypto.randomUUID(),
                owner: user.uid,
                memberIds: [user.uid],
                name: data.name,
                createdAt: serverTimestamp(),
            });

            const updatedChannelIds = [...(user.channelIds || []), channelId];
            setUser({
                ...user,
                channelIds: updatedChannelIds,
            });

            queryClient.invalidateQueries({ queryKey: ['channels'] });

            toast('Channel created successfully', {
                icon: <Check color="green" />,
                position: 'top-right',
            });

            setOpen(false);
            reset();
        } catch (error) {
            console.error('Error creating channel:', error);
            toast('Failed to create channel', {
                icon: <Ban color="red" />,
                position: 'top-right',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="cursor-pointer bg-neutral-800 text-neutral-100 py-2 px-4 rounded-[10px]">
                Create channel
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Channel form</DialogTitle>
                </DialogHeader>

                <DialogDescription className="sr-only">Description: Channel creation form</DialogDescription>

                <form className="grid gap-2" onSubmit={handleSubmit(onSubmit)}>
                    <label>Channel name</label>

                    <Input
                        autoComplete="name"
                        placeholder="Write channel name"
                        {...register('name', {
                            required: 'Channel name required',
                            maxLength: {
                                value: 20,
                                message: 'Max length: 20',
                            },
                            minLength: {
                                value: 3,
                                message: 'Min length: 3',
                            },
                        })}
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}

                    <Button type="submit">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
