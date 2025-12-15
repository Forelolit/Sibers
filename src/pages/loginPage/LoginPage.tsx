import type { FC } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Container, Button } from '@/components';
import { useAuthStore } from '@/store/useAuthStore';
import { auth, db } from '@/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from '@/types/userInterface';
import { useNavigate } from 'react-router';
import { paths } from '@/constants/constans';

export const LoginPage: FC = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const res = await signInWithPopup(auth, provider);
            const firebaseUser = res.user;

            const userRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            let userData: User;

            if (!userSnap.exists()) {
                userData = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    channelIds: [],
                    searchTokens: firebaseUser.displayName?.toLowerCase().split(' ') ?? [],
                };

                await setDoc(userRef, userData);
            } else {
                userData = userSnap.data() as User;
            }

            setUser(userData);

            navigate(paths.home);

            return firebaseUser;
        } catch (error) {
            console.error('signInWithGoogle', error);
        }
    };

    return (
        <section>
            <Container>
                <div className="h-[700px] flex justify-center items-center">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
                        <h1 className="mb-2 text-center text-2xl font-semibold text-gray-800">
                            Welcome to Realtime Chat
                        </h1>

                        <p className="mb-6 text-center text-sm text-gray-500">
                            Sign in to join channels and start messaging in real time
                        </p>

                        <Button onClick={signInWithGoogle} className="w-full">
                            Sign in with Google
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
};
