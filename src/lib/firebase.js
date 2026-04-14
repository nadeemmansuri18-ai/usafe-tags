import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3ttvE8tqngH2lRgmyoms69I3Rr8wCTvY",
  authDomain: "usafe-tags.firebaseapp.com",
  projectId: "usafe-tags",
  storageBucket: "usafe-tags.firebasestorage.app",
  messagingSenderId: "388526719669",
  appId: "1:388526719669:web:fd5ff816501252eb9f74fc"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);