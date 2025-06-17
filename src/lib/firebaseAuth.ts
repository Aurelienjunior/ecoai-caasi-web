import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/firebase';

// Sign up a new user
export const signUp = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Log in existing user
export const logIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Log out current user
export const logOut = async () => {
  return await signOut(auth);
};
