"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebaseConfig'; // Adjust path if necessary
import { collection, getDocs } from 'firebase/firestore';
import { PlusIcon } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  year: string;
  color: string;
}

export default function Study() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, 'courses');
        const coursesSnapshot = await getDocs(coursesCollection);
        const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(coursesList);
      } catch (err) {
        setError('Failed to fetch courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    router.push('/courses/create');
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-12 md:pt-16 lg:pt-20">
      <div className="container max-w-5xl px-4 md:px-6 flex justify-between items-center mb-8 md:mb-10 lg:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Your Courses</h1>
        <Button variant="outline" size="icon" onClick={handleAddCourse}>
          <PlusIcon className="h-5 w-5" />
          <span className="sr-only">Add Course</span>
        </Button>
      </div>
      <div className="container max-w-5xl px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.id}
              className={`bg-${course.color}-500 rounded-lg p-6 flex flex-col items-start justify-between cursor-pointer hover:bg-opacity-80`}
              onClick={() => handleCourseClick(course.id)}
            >
              <h2 className="text-xl md:text-2xl font-bold text-white">{course.name}</h2>
              <span className="text-sm md:text-base font-medium text-white">{course.year}</span>
            </div>
          ))
        ) : (
          <div className="text-center p-6 bg-white dark:bg-black rounded-lg shadow-md">
            <p className="text-xl font-semibold">You haven't started a course yet!</p>
            <p className="mt-4">But that's okay, Pandy will help you!</p>
            <Button variant="outline" size="lg" onClick={handleAddCourse} className="mt-4">
              Start A Course
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}