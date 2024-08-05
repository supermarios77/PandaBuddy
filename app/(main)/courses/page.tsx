"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

type Course = {
  category: string;
  id: string;
  subject: string;
  level: string;
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData: Course[] = [];
      querySnapshot.forEach((doc) => {
        coursesData.push({ id: doc.id, ...doc.data() } as Course);
      });
      setCourses(coursesData);
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col items-center w-full py-12 md:py-24 lg:py-32">
      <div className="flex justify-between items-center w-full max-w-5xl px-4 md:px-6">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Your Courses
        </h1>
        <Link href="/courses/new-course">
          <Button variant="outline" size="icon" className="rounded-full">
            <PlusIcon className="h-6 w-6" />
            <span className="sr-only">Add Course</span>
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl mt-12">
        {courses.map((course) => (
          <Link href={`/courses/${course.id}`} key={course.id}>
            <Card className="bg-primary text-primary-foreground p-6 flex flex-col items-start">
              <h3 className="text-2xl font-bold">{course.category}</h3>
              <p className="text-lg font-medium">{course.level}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
