import { db } from './firebaseConfig';
import { collection, addDoc, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';

// Function to create a new course document
const createCourse = async (courseId: any, courseData: any) => {
  try {
    const docRef = doc(db, "courses", courseId);
    await setDoc(docRef, courseData);
    console.log("Course successfully written!");
  } catch (e) {
    console.error("Error adding course document: ", e);
  }
};

// Function to create a new lesson in a specific course
const createLessons = async (courseId: any, lessonData: any) => {
  try {
    const lessonsCollectionRef = collection(db, "courses", courseId, "lessons");
    const docRef = await addDoc(lessonsCollectionRef, lessonData);
    console.log('Lesson written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding lesson document: ', e);
  }
};


const fetchCourseData = async (courseId: any) => {
  try {
    const docRef = doc(db, "courses", courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such course document found!");
      return null;
    }
  } catch (e) {
    console.error("Error fetching course document: ", e);
    return null;
  }
};

const fetchLessonData = async (lessonId: any, courseId: any) => {
  try {
    const docRef = doc(db, "courses", courseId, "lessons", lessonId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such lesson document found!");
      return null;
    }
  } catch (e) {
    console.error("Error fetching lesson document: ", e);
    return null;
  }
};

const fetchLessonsForCourse = async (courseId: any) => {
  try {
    const lessonsCollectionRef = collection(db, "courses", courseId, "lessons");
    const querySnapshot = await getDocs(lessonsCollectionRef);

    if (querySnapshot.empty) {
      console.log("No lessons found for this course!");
      return null;
    }

    const lessons: any = [];
    querySnapshot.forEach(doc => {
      lessons.push(doc.data());
    });

    return lessons;
  } catch (e) {
    console.error("Error fetching lessons: ", e);
    return null;
  }
};

export { createCourse, createLessons, fetchCourseData, fetchLessonData, fetchLessonsForCourse };