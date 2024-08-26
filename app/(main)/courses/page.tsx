'use client'

import { useEffect, useState } from "react"
import { db } from "@/lib/firebaseConfig"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { PlusIcon, Trash2, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Course = {
  title: string
  category: string
  id: string
  subject: string
  level: string
}

export default function Component() {
  const [courses, setCourses] = useState<Course[]>([])
  const { user } = useUser()
  const userId = user?.id
  const { toast } = useToast()

  useEffect(() => {
    const fetchCourses = async () => {
      if (userId) {
        const querySnapshot = await getDocs(collection(db, "courses", userId, "userCourses"))
        const coursesData: Course[] = []
        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() } as Course)
        })
        setCourses(coursesData)
      }
    }

    fetchCourses()
  }, [userId])

  const deleteCourse = async (courseId: string) => {
    try {
      await deleteDoc(doc(db, "courses", userId!, "userCourses", courseId))
      setCourses(courses.filter((course) => course.id !== courseId))
      toast({
        title: "Course deleted",
        description: "The course has been successfully removed.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "Error",
        description: "Failed to delete the course. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full min-h-screen py-12 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex justify-between items-center w-full max-w-6xl mb-12">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-purple-800 dark:text-purple-300"
        >
          Your Courses
        </motion.h1>
        <Link href="/courses/new-course">
          <Button
            variant="default"
            size="lg"
            className="rounded-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Course
          </Button>
        </Link>
      </div>
      {courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl text-gray-600 dark:text-gray-300 text-center p-12 bg-card rounded-2xl shadow-xl"
        >
          <BookOpen className="w-24 h-24 mx-auto mb-6 text-purple-500" />
          <p className="font-semibold">No courses found. Add a new course to get started!</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-6xl"
        >
          <AnimatePresence>
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-card text-gray-800 dark:text-gray-200 p-6 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                  <Link href={`/courses/${course.id}`} className="flex-grow">
                    <h3 className="text-2xl font-bold mb-2 text-purple-700 dark:text-purple-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
                      {course.title
                        .split("\n")
                        .map((topic: string) => topic.replace(/[*-1234567890]/g, " ").trim())
                        .filter((topic: string | any[]) => topic.length > 0)
                        .sort()
                        .join(", ")}
                    </h3>
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                      {course.level} / {course.category}
                    </p>
                  </Link>
                  <div className="mt-4 flex justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete this course?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the course and all its contents.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteCourse(course.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  )
}