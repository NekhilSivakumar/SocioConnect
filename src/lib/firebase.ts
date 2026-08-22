import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
  limit
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoLocalPreviewKey",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "socioconnect-a48a9.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "socioconnect-a48a9",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "socioconnect-a48a9.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "586352236551",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:586352236551:web:socioconnect"
};

// Initialize Firebase App safely (singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "AIzaSyDummyKeyForLocalPreview"
);

export interface FirestoreGroup {
  id?: string;
  name: string;
  avatar: string;
  category: 'sports' | 'mentor' | 'hostel' | 'hackathon' | 'general';
  categoryLabel: string;
  lastMessage: string;
  lastMessageTime: string;
  isGroup: boolean;
  membersCount: number;
  hostelBlock?: string;
  aboutText: string;
  createdAt?: any;
}

export interface FirestoreMessage {
  id?: string;
  sender: 'me' | 'them' | 'system';
  senderName?: string;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  createdAt?: any;
  matchData?: {
    sport: string;
    location: string;
    time: string;
    joined: number;
    needed: number;
    userJoined?: boolean;
  };
}
