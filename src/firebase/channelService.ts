import { db } from './firebase';
import { addDoc, collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore';
import type { ChannelType, CreateChannelDto } from '@/types/channeInterface';
import { userService } from './userService';
import type { User } from '@/types/userInterface';

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

const getChannelsByIds = async (channelIds: string[]): Promise<ChannelType[]> => {
    if (!channelIds || channelIds.length === 0) {
        return [];
    }

    const q = query(collection(db, 'channels'), where('__name__', 'in', channelIds));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ChannelType, 'id'>),
    }));
};

export const getChannels = async (userId: string): Promise<ChannelType[]> => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        throw new Error('User not found');
    }

    const userData = userSnap.data() as User;
    const channelIds = userData.channelIds ?? [];

    if (channelIds.length === 0) return [];

    const q = query(collection(db, 'channels'), where(documentId(), 'in', channelIds));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as ChannelType[];
};

export const channelService = {
    createChannel,
    getChannelsByIds,
    getChannels,
};
