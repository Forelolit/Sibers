import type { User } from '@/types/userInterface';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

/**
 * Shape of the authentication store.
 *
 * isAuth - Indicates whether the user is authenticated.
 * user - Current authenticated user data or null if not authenticated.
 * setUser - Sets the current user and updates authentication state.
 * logout - Logs out the user and clears authentication state.
 */

interface AuthStore {
    isAuth: boolean;
    user: User | null;
    setUser: (user: AuthStore['user']) => void;
    logout: () => void;
}

/**
 * Global authentication store powered by Zustand.
 *
 * Persists authentication state in local storage to keep the user logged in
 * across page reloads. Integrates with Firebase Authentication for logout.
 */

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

            /**
             * Logs out the current user.
             *
             * Clears local authentication state and signs out from Firebase.
             */
            logout: () => {
                set({ user: null, isAuth: false });
                signOut(auth);
            },
        }),
        {
            /**
             * Storage key used for persisting authentication state.
             */
            name: 'user-storage',

            /**
             * Selects which parts of the state should be persisted.
             *
             * Prevents storing unnecessary data in local storage.
             */
            partialize: (state) => ({
                isAuth: state.isAuth,
                user: state.user,
            }),
        },
    ),
);
