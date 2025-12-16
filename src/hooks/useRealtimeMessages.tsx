import { useEffect, useState } from 'react';
import { messageService } from '@/firebase/messageService';
import type { Message } from '@/types/messageInterface';

interface UseRealtimeMessagesResult {
    messages: Message[];
    loading: boolean;
    error: Error | null;
}

/**
 * Custom hook to subscribe to real-time messages of a channel
 * Automatically updates messages state whenever new messages arrive
 * @param channelId - ID of the channel to subscribe to
 * @returns Object containing messages, loading state, and error
 */

export const useRealtimeMessages = (channelId: string | null): UseRealtimeMessagesResult => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!channelId) {
            setMessages([]);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        const unsubscribe = messageService.subscribeToMessages(
            channelId,
            (newMessages: Message[]) => {
                setMessages(newMessages);
                setLoading(false);
            },
            (err: Error) => {
                setError(err);
                setLoading(false);
            },
        );

        return () => {
            unsubscribe(); // Cleanup subscription on unmount or channel change
        };
    }, [channelId]);

    return { messages, loading, error };
};
