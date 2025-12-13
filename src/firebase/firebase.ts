// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCeS3Nx6YZpNZeifbuievJP6a8AAewl0Mg',
    authDomain: 'real-time-chat-94b4a.firebaseapp.com',
    projectId: 'real-time-chat-94b4a',
    storageBucket: 'real-time-chat-94b4a.firebasestorage.app',
    messagingSenderId: '1038760245478',
    appId: '1:1038760245478:web:2122d65ccf8b0c44eb2327',
    measurementId: 'G-8HWWQGMWXS',
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
