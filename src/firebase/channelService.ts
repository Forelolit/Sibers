import { db } from './firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import type { QueryFunction } from '@tanstack/react-query';
import type { ChannelType } from '@/types/channeInterface';
import { userService } from './userService';

const createChannel = async (channelData: ChannelType) => {
    try {
        const docRef = await addDoc(collection(db, 'channels'), channelData);
        console.log('Doc created with ID:', docRef.id);

        await userService.addChannelToUser(channelData.owner, docRef.id);

        return docRef.id;
    } catch (error) {
        console.error('error with channelData:', error);
        throw error;
    }
};

const getChannelsByIds: QueryFunction<ChannelType[]> = async ({ queryKey }) => {
    const [, channelIds] = queryKey as [string, string[]];

    if (!channelIds || channelIds.length === 0) {
        return [];
    }

    const q = query(collection(db, 'channels'), where('__name__', 'in', channelIds));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as ChannelType[];
};

export const channelService = {
    createChannel,
    getChannelsByIds,
};
