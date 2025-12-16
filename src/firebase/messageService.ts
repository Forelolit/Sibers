import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { Message } from '@/types/messageInterface';

const MESSAGE_LIMIT = 50;

/**
 * Send a new message to a channel
 * @param channelId - ID of the channel
 * @param message - Text content of the message
 * @returns ID of the created message document
 */
const sendMessage = async (channelId: string, message: string) => {
    if (!auth.currentUser) {
        throw new Error('User not authenticated');
    }

    const docRef = await addDoc(collection(db, 'channels', channelId, 'messages'), {
        text: message,
        senderId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
};

/**
 * Fetches messages ordered by creation time descending, limited to MESSAGE_LIMIT
 * @param channelId - ID of the channel
 * @returns Array of Message objects
 */
export const getMessages = async (channelId: string): Promise<Message[]> => {
    if (!channelId) {
        return [];
    }

    const q = query(
        collection(db, 'channels', channelId, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(MESSAGE_LIMIT),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, 'id'>),
    }));
};

/**
 * Subscribe to real-time updates of messages in a channel
 * Calls onMessagesUpdate whenever messages change
 * Returns an unsubscribe function to stop listening
 */
const subscribeToMessages = (
    channelId: string,
    onMessagesUpdate: (messages: Message[]) => void,
    onError?: (error: Error) => void,
) => {
    const q = query(
        collection(db, 'channels', channelId, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(MESSAGE_LIMIT),
    );

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Message[];
            onMessagesUpdate(messages);
        },
        (error) => {
            console.error('Error subscribing to messages:', error);
            onError?.(error);
        },
    );

    return unsubscribe;
};

/**
 * Message service object
 * Provides functions to send, fetch, and subscribe to messages
 */
export const messageService = {
    sendMessage,
    getMessages,
    subscribeToMessages,
};
