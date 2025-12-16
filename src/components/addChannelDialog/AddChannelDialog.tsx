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

/**
 * AddChannelDialog component
 * Renders a dialog form for creating a new channel.
 * Only authenticated users can create channels.
 * Uses React Hook Form for validation and React Query for cache updates.
 */

export const AddChannelDialog: FC = () => {
    // Auth state from global store
    const { isAuth, user, setUser } = useAuthStore();

    // Local state for dialog visibility
    const [open, setOpen] = useState(false);

    // React Query client for cache invalidation
    const queryClient = useQueryClient();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    /**
     * Handles form submission to create a new channel
     * @param data - form input values
     */
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        // Ensure user is authenticated
        if (!isAuth || !user) {
            toast('You need to login first', {
                icon: <Ban color="red" />,
            });
            return;
        }

        try {
            // Create channel via service
            const channel = await channelService.createChannel({
                owner: user.uid,
                memberIds: [user.uid],
                name: data.name,
                createdAt: serverTimestamp(),
            });

            // Update user's channel list in global store
            const updatedChannelIds = [...(user.channelIds || []), channel.id];
            setUser({
                ...user,
                channelIds: updatedChannelIds,
            });

            // Invalidate cached channels to refetch
            queryClient.invalidateQueries({ queryKey: ['channels'] });

            toast('Channel created successfully', {
                icon: <Check color="green" />,
            });

            // Close dialog and reset form
            setOpen(false);
            reset();
        } catch (error) {
            console.error('Error creating channel:', error);
            toast('Failed to create channel', {
                icon: <Ban color="red" />,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger button for opening the dialog */}
            <DialogTrigger className="cursor-pointer bg-neutral-800 text-neutral-100 py-2 px-4 rounded-[10px]">
                Create channel
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Channel form</DialogTitle>
                </DialogHeader>

                {/* Hidden description for accessibility */}
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
