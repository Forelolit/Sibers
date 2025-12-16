import { db } from './firebase';
import { addDoc, collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore';
import type { ChannelType, CreateChannelDto } from '@/types/channeInterface';
import { userService } from './userService';
import type { User } from '@/types/userInterface';

const BATCH_SIZE = 10;

const createChannel = async (channelData: CreateChannelDto): Promise<ChannelType> => {
    try {
        const docRef = await addDoc(collection(db, 'channels'), channelData);
        console.log('Doc created with ID:', docRef.id);

        const fullChannel: ChannelType = {
            ...channelData,
            id: docRef.id,
        };

        await userService.addChannelToUser(channelData.owner, docRef.id);

        return fullChannel;
    } catch (error) {
        console.error('Error creating channel:', error);
        throw error;
    }
};

export const getChannelsByIds = async (channelIds: string[]): Promise<ChannelType[]> => {
    if (channelIds.length === 0) return [];

    const batches: Promise<ChannelType[]>[] = [];

    for (let i = 0; i < channelIds.length; i += BATCH_SIZE) {
        const batchIds = channelIds.slice(i, i + BATCH_SIZE);
        const q = query(collection(db, 'channels'), where(documentId(), 'in', batchIds));

        const batchPromise = getDocs(q).then((snapshot) =>
            snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<ChannelType, 'id'>),
            })),
        );

        batches.push(batchPromise);
    }

    const results = await Promise.all(batches);
    return results.flat();
};

export const getChannels = async (userId: string): Promise<ChannelType[]> => {
    const userSnap = await getDoc(doc(db, 'users', userId));

    if (!userSnap.exists()) {
        throw new Error('User not found');
    }

    const { channelIds = [] } = userSnap.data() as User;

    return getChannelsByIds(channelIds ?? []);
};

export const channelService = {
    createChannel,
    getChannelsByIds,
    getChannels,
};
