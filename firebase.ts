import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRowOiMfsiq8NrxOoGcCaq5bUxKbAGajw",
  authDomain: "chatapp-3fbf6.firebaseapp.com",
  projectId: "chatapp-3fbf6",
  storageBucket: "chatapp-3fbf6.appspot.com",
  messagingSenderId: "850651664420",
  appId: "1:850651664420:web:b3840b647c709dd6b148b1",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messagesCollection = collection(db, "messages");

export {
  addDoc, auth, createUserWithEmailAndPassword, db, getDownloadURL, messagesCollection,
  onAuthStateChanged, onSnapshot, orderBy, query, ref, serverTimestamp, signInWithEmailAndPassword,
  signOut, storage, updateProfile, uploadBytes
};

