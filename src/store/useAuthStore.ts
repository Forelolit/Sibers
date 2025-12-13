import type { User } from '@/types/userInterface';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

interface AuthStore {
    isAuth: boolean;
    user: User | null;
    setUser: (user: AuthStore['user']) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            isAuth: false,
            user: null,

            setUser: (user) =>
                set({
                    user,
                    isAuth: Boolean(user),
                }),

            logout: () => {
                set({ user: null, isAuth: false });
                signOut(auth);
            },
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({
                isAuth: state.isAuth,
                user: state.user,
            }),
        },
    ),
);
