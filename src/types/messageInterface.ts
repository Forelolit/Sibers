import type { Timestamp } from 'firebase/firestore';

export interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: Timestamp;
}
