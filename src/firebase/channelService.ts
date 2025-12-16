import { db } from './firebase';
import { addDoc, collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore';
import type { ChannelType, CreateChannelDto } from '@/types/channeInterface';
import { userService } from './userService';
import type { User } from '@/types/userInterface';

const BATCH_SIZE = 10;

/**
 * Creates a new channel in Firestore
 * Adds the channel to the owner's list of channels
 * @param channelData - Data for creating a new channel
 * @returns The created channel with its generated ID
 */
const createChannel = async (channelData: CreateChannelDto): Promise<ChannelType> => {
    try {
        const docRef = await addDoc(collection(db, 'channels'), channelData);
        console.log('Doc created with ID:', docRef.id);

        const fullChannel: ChannelType = {
            ...channelData,
            id: docRef.id,
        };

        // Add channel ID to owner's user document
        await userService.addChannelToUser(channelData.owner, docRef.id);

        return fullChannel;
    } catch (error) {
        console.error('Error creating channel:', error);
        throw error;
    }
};

/**
 * Fetch channels by a list of IDs in batches
 * Handles Firestore limitation for 'in' queries (max 10 items)
 * @param channelIds - Array of channel IDs to fetch
 * @returns Array of ChannelType objects
 */
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

/**
 * Fetch all channels for a given user
 * @param userId - ID of the user
 * @returns Array of ChannelType objects the user belongs to
 */
export const getChannels = async (userId: string): Promise<ChannelType[]> => {
    const userSnap = await getDoc(doc(db, 'users', userId));

    if (!userSnap.exists()) {
        throw new Error('User not found');
    }

    const { channelIds = [] } = userSnap.data() as User;

    return getChannelsByIds(channelIds ?? []);
};

/**
 * Service object to manage channel-related operations
 */
export const channelService = {
    createChannel,
    getChannelsByIds,
    getChannels,
};
