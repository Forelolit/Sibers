import { db } from './firebase';
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from 'firebase/firestore';

const addChannelToUser = async (userId: string, channelId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(
                userRef,
                {
                    uid: userId,
                    channelIds: [channelId],
                },
                { merge: true },
            );
        } else {
            await updateDoc(userRef, {
                channelIds: arrayUnion(channelId),
            });
        }

        console.log('Channel added to user:', channelId);
    } catch (error) {
        console.error('Error adding channel to user:', error);
        throw error;
    }
};

export const userService = {
    addChannelToUser,
};
