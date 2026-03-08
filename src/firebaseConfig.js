import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHIM8LOcUpqDA9yJVl7eBnvM0EirJFaLo",
  authDomain: "buscadorninos.firebaseapp.com",
  projectId: "buscadorninos",
  storageBucket: "buscadorninos.firebasestorage.app",
  messagingSenderId: "4847037438",
  appId: "1:4847037438:web:c80052ba4cb506ded3eeaf"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });