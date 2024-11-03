import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAJvvhN_1HEB2E-ahobOKp9PeqHWaPO4WE",
    authDomain: "creative-coding-site.firebaseapp.com",
    projectId: "creative-coding-site",
    storageBucket: "creative-coding-site.appspot.com",
    messagingSenderId: "1065803835010",
    appId: "1:1065803835010:web:a59e01e8846767766b769b",
    measurementId: "G-4TBZDMD106"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);