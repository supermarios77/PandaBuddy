// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "projects-690c2.firebaseapp.com",
  projectId: "projects-690c2",
  storageBucket: "projects-690c2.appspot.com",
  messagingSenderId: "993819073917",
  appId: "1:993819073917:web:cac08480dc01317b958014",
  measurementId: "G-K09Y8FLGGS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);