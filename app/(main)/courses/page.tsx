'use client'

import { useEffect, useState, useRef } from "react"
import { db } from "@/lib/firebaseConfig"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { PlusIcon, Trash2, BookOpen, Calculator, FlaskRound, History, Globe, Palette, Music, Code, Dumbbell, Microscope, Languages, PenTool } from "lucide-react"
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
import confetti from 'canvas-confetti'

type Course = {
  title: string
  category: string
  id: string
  subject: string
  level: string
}

const categoryIcons: { [key: string]: React.ElementType } = {
  "Mathematics": Calculator,
  "Science": FlaskRound,
  "History": History,
  "Geography": Globe,
  "Art": Palette,
  "Music": Music,
  "Computer Science": Code,
  "Physical Education": Dumbbell,
  "Biology": Microscope,
  "Languages": Languages,
  "Writing": PenTool,
}

const categoryGradients: { [key: string]: string } = {
  "Mathematics": "from-blue-400 to-blue-600",
  "Science": "from-green-400 to-green-600",
  "History": "from-yellow-400 to-yellow-600",
  "Geography": "from-red-400 to-red-600",
  "Art": "from-pink-400 to-pink-600",
  "Music": "from-indigo-400 to-indigo-600",
  "Computer Science": "from-cyan-400 to-cyan-600",
  "Physical Education": "from-orange-400 to-orange-600",
  "Biology": "from-teal-400 to-teal-600",
  "Languages": "from-rose-400 to-rose-600",
  "Writing": "from-lime-400 to-lime-600",
}

export default function Component() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useUser()
  const userId = user?.id
  const { toast } = useToast()
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)

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

  const handleAddCourse = () => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      })
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="w-full min-h-screen py-12 md:py-24 lg:py-32 transition-colors duration-300">
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-50" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white mb-4">
            Your Courses
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Explore and manage your learning journey
          </p>
          <div className="flex justify-center items-center space-x-4">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-card text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search courses"
            />
            <Link href="/courses/new-course">
              <Button
                variant="default"
                size="lg"
                className="rounded-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleAddCourse}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Course
              </Button>
            </Link>
          </div>
        </motion.div>
        {filteredCourses.length === 0 ? (
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filteredCourses.map((course, index) => {
                const CategoryIcon = categoryIcons[course.category] || BookOpen
                const gradient = categoryGradients[course.category] || "from-gray-400 to-gray-600"
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
                  >
                    <Card className={`bg-gradient-to-br ${gradient} text-white p-6 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group`}>
                      <Link href={`/courses/${course.id}`} className="flex-grow">
                        <CategoryIcon className="w-16 h-16 mb-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-pink-200 transition-colors duration-300">
                          {course.title.replace(/[*-1234567890]/g, " ")}
                        </h3>
                        <p className="text-lg font-medium opacity-80">
                          {course.level} / {course.category}
                        </p>
                      </Link>
                      <div className="mt-4 flex justify-end">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white hover:text-red-200">
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
                        className="absolute bottom-0 left-0 w-full h-1 bg-white"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}