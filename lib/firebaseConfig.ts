// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
<<<<<<< HEAD
=======
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
>>>>>>> f85170efa4a39146ff29629d997c2a300a13cf0f
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
<<<<<<< HEAD
  authDomain: "projects-690c2.firebaseapp.com",
  projectId: "projects-690c2",
  storageBucket: "projects-690c2.appspot.com",
  messagingSenderId: "993819073917",
  appId: "1:993819073917:web:cac08480dc01317b958014",
  measurementId: "G-K09Y8FLGGS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
=======
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
>>>>>>> f85170efa4a39146ff29629d997c2a300a13cf0f
