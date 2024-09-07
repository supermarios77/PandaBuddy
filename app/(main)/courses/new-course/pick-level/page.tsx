"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, School, BookOpen, Backpack, Briefcase, Lightbulb, ArrowLeft, User, Search } from "lucide-react"
import { useTheme } from "next-themes"
import confetti from 'canvas-confetti'
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebaseConfig"

const educationLevels = [
  { name: "Elementary", icon: School, gradient: "from-green-400 to-green-600", grades: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"] },
  { name: "Middle School", icon: BookOpen, gradient: "from-blue-400 to-blue-600", grades: ["Grade 6", "Grade 7", "Grade 8"] },
  { name: "High School", icon: Backpack, gradient: "from-purple-400 to-purple-600", grades: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"] },
  { name: "College", icon: GraduationCap, gradient: "from-red-400 to-red-600", grades: ["Freshman", "Sophomore", "Junior", "Senior"] },
  { name: "Graduate", icon: Briefcase, gradient: "from-yellow-400 to-yellow-600", grades: ["Master's", "Doctoral"] },
  { name: "Professional", icon: Lightbulb, gradient: "from-pink-400 to-pink-600", grades: ["Entry Level", "Mid-Career", "Senior"] },
]

export default function PickLevel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category') as string
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const { user } = useUser()
  const [userAge, setUserAge] = useState<number | null>(null)
  const [useCurrentAge, setUseCurrentAge] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user) {
      fetchUserAge()
    }
  }, [user])

  const fetchUserAge = async () => {
    if (user?.id) {
      const docRef = doc(db, "userProfiles", user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setUserAge(data.age)
      }
    }
  }

  const handleLevelClick = (level: string) => {
    setSelectedLevel(level)
    setSelectedGrade(null)
  }

  const handleGradeClick = (grade: string) => {
    setSelectedGrade(grade)
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
    setTimeout(() => {
      router.push(`/courses/new-course/pick-subject?category=${category}&level=${selectedLevel}&grade=${grade}`)
    }, 1000)
  }

  const handleUseCurrentAge = () => {
    setUseCurrentAge(true)
    const level = getLevelFromAge(userAge)
    if (level) {
      setSelectedLevel(level.name)
      setSelectedGrade(level.grades[0])
      setTimeout(() => {
        router.push(`/courses/new-course/pick-subject?category=${category}&level=${level.name}&grade=${level.grades[0]}`)
      }, 1000)
    }
  }

  const getLevelFromAge = (age: number | null) => {
    if (!age) return null
    if (age <= 10) return educationLevels[0]
    if (age <= 13) return educationLevels[1]
    if (age <= 18) return educationLevels[2]
    if (age <= 22) return educationLevels[3]
    if (age <= 30) return educationLevels[4]
    return educationLevels[5]
  }

  const filteredLevels = educationLevels.filter(level =>
    level.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!mounted) return null

  return (
    <section className="w-full min-h-screen py-12 md:py-24 lg:py-32 bg-background text-foreground transition-colors duration-300">
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-50" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-4">
            Pick Your Level for {category}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Select your educational level and grade
          </p>

          {!selectedLevel && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search levels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
          {!selectedLevel && (
            <Button
              onClick={handleUseCurrentAge}
              className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100 mt-5"
            >
              <User className="mr-2 h-4 w-4" /> Use Current Age ({userAge})
            </Button>
          )}
        </motion.div>
        <AnimatePresence mode="wait">
          {!selectedLevel ? (
            <motion.div
              key="levels"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {filteredLevels.map((level, index) => (
                <motion.div
                  key={level.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
                  className={`group flex flex-col items-center justify-center rounded-xl p-6 text-center text-white transition-all cursor-pointer bg-gradient-to-br ${level.gradient} shadow-md hover:shadow-xl`}
                  onClick={() => handleLevelClick(level.name)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${level.name} level`}
                  onKeyPress={(e) => e.key === 'Enter' && handleLevelClick(level.name)}
                >
                  <level.icon className="w-16 h-16 mb-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                  <h2 className="text-2xl font-bold mb-2">{level.name}</h2>
                  <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to select grades
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="grades"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <Button
                variant="outline"
                onClick={() => setSelectedLevel(null)}
                className="mb-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Levels
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {educationLevels.find(level => level.name === selectedLevel)?.grades.map((grade, index) => (
                  <motion.div
                    key={grade}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
                    className={`group flex flex-col items-center justify-center rounded-xl p-6 text-center text-white transition-all cursor-pointer bg-gradient-to-br ${educationLevels.find(level => level.name === selectedLevel)?.gradient} shadow-md hover:shadow-xl`}
                    onClick={() => handleGradeClick(grade)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${grade}`}
                    onKeyPress={(e) => e.key === 'Enter' && handleGradeClick(grade)}
                  >
                    <h2 className="text-2xl font-bold mb-2">{grade}</h2>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to select
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {filteredLevels.length === 0 && !selectedLevel && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground mt-8"
          >
            No levels found. Try a different search term.
          </motion.p>
        )}
      </div>
    </section>
  )
}