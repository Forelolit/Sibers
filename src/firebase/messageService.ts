import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { Message } from '@/types/messageInterface';

const MESSAGE_LIMIT = 50;

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

export const messageService = {
    sendMessage,
    getMessages,
    subscribeToMessages,
};
