import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const createCourse = async (courseData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'courses'), courseData);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export { createCourse };