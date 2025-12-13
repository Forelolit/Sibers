export interface User {
    uid: string;
    displayName: string;
    photoURL?: string;
    channelIds: string[] | null;
}
