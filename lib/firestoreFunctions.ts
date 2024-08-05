import { db } from './firebaseConfig';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';

const createCourse = async (courseId: string, courseData: any) => {
  try {
    const docRef = doc(db, "courses", courseId);
    await setDoc(docRef, courseData);
    console.log("Course successfully written!", courseData);
  } catch (e) {
    console.error("Error adding course document: ", e);
  }
};

const createLesson = async (courseId: string, lessonData: any) => {
  try {
    const lessonsCollectionRef = collection(db, `courses/${courseId}/lessons`);
    const docRef = await addDoc(lessonsCollectionRef, lessonData);
    console.log('Lesson written with ID: ', docRef.id, lessonData);
  } catch (e) {
    console.error('Error adding lesson document: ', e);
  }
};

const fetchCourseData = async (courseId: string) => {
  try {
    const docRef = doc(db, "courses", courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Course data fetched: ", docSnap.data());
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

const fetchLessonData = async (courseId: string, selectedTopic: string) => {
  try {
    const lessonsCollectionRef = collection(db, `courses/${courseId}/lessons`);
    const q = query(lessonsCollectionRef, where("selectedTopic", "==", selectedTopic));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No lessons found for this topic!");
      return null;
    }

    const lessons: any = [];
    querySnapshot.forEach(doc => {
      lessons.push({ id: doc.id, ...doc.data() });
    });

    console.log("Lesson data fetched: ", lessons[0]);
    return lessons[0];
  } catch (e) {
    console.error("Error fetching lessons: ", e);
    return null;
  }
};

export { createCourse, createLesson, fetchCourseData, fetchLessonData };