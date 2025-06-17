import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAmBK9HfJW9YTWjWMg22TT03sXnn_1Feh4',
  authDomain: 'ecoai-caasi.firebaseapp.com',
  projectId: 'ecoai-caasi',
  storageBucket: 'ecoai-caasi.appspot.com',
  messagingSenderId: '494921483351',
  appId: '1:494921483351:web:e306f5cdb343c8c3740f12',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
