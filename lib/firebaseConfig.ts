import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDyW72VgyAKMEI-YZKCt7O7CxtI3MVv_pw",
  authDomain: "projects-690c2.firebaseapp.com",
  projectId: "projects-690c2",
  storageBucket: "projects-690c2.appspot.com",
  messagingSenderId: "993819073917",
  appId: "1:993819073917:web:cac08480dc01317b958014",
  measurementId: "G-K09Y8FLGGS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };