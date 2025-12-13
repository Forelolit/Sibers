import type { FC } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Container, Button } from '@/components';
import { useAuthStore } from '@/store/useAuthStore';
import { auth, db } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const LoginPage: FC = () => {
    const setUser = useAuthStore((state) => state.setUser);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const res = await signInWithPopup(auth, provider);
            const firebaseUser = res.user;

            await setDoc(doc(db, 'users', firebaseUser.uid), {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                channelIds: [],
            });

            setUser({
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
            });

            return firebaseUser;
        } catch (error) {
            console.error('signInWithGoogle', error);
        }
    };

    return (
        <section>
            <Container>
                <div className="flex flex-col justify-center items-center gap-4 h-[700px]">
                    <h1 className="text-gray-700 text-3xl font-bold">Login</h1>
                    <Button onClick={signInWithGoogle}>Sign in with Google</Button>
                </div>
            </Container>
        </section>
    );
};
