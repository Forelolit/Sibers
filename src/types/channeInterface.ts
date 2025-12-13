import type { FieldValue, Timestamp } from 'firebase/firestore';

export interface ChannelType {
    id: string;
    owner: string;
    memberIds: string[];
    name: string;
    channelImage?: string;
    lastMessage?: {
        text: string;
        senderId: string;
        createdAt: Timestamp;
    };
    createdAt: FieldValue;
}
