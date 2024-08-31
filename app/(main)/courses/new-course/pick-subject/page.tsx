"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Book, Atom, Calculator, Globe, Palette, Music, Loader2 } from "lucide-react"
import confetti from 'canvas-confetti'

const subjectIcons = {
  "Literature": Book,
  "Physics": Atom,
  "Mathematics": Calculator,
  "Geography": Globe,
  "Art": Palette,
  "Music": Music,
}

export default function Component() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const level = searchParams.get("level") as string
  const category = searchParams.get("category") as string

  const [subjects, setSubjects] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: `List top 6 subjects taught for ${category} at ${level}`,
          }),
        })
        const data = await response.json()
        const cleanedSubjects = data.output
          .split("\n")
          .map((subject: string) => subject.replace(/[*-]/g, "").trim())
          .filter((subject: string | any[]) => subject.length > 0)
          .sort()
        setSubjects(cleanedSubjects)
      } catch (error) {
        console.error("Error fetching subjects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubjects()
  }, [level, category])

  const handleSubjectSelect = (selectedSubject: string) => {
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
      const courseId = `${category}_${level}_${selectedSubject}`.replace(/\s/g, "-")
      router.push(`/courses/${courseId}/`)
    }, 1000)
  }

  const gradients = [
    "from-pink-400 to-purple-600",
    "from-green-400 to-blue-600",
    "from-yellow-400 to-orange-600",
    "from-indigo-400 to-purple-600",
    "from-red-400 to-pink-600",
    "from-teal-400 to-blue-600",
  ]

  const filteredSubjects = subjects.filter(subject =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="w-full min-h-screen py-12 md:py-24 lg:py-32 transition-colors duration-300 bg-opacity-50">
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-50" />
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-gray-900 mb-4">
            Pick Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Subject</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 mb-8">
            Explore and select from our curated list of subjects
          </p>
        </motion.div>
        {isLoading ? (
          <div className="flex justify-center mt-12">
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredSubjects.map((subject, index) => {
                return (
                  <motion.div
                    key={subject}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center justify-center rounded-xl p-6 text-center text-white transition-all cursor-pointer bg-gradient-to-br ${gradients[index % gradients.length]} shadow-md hover:shadow-xl`}
                    onClick={() => handleSubjectSelect(subject)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${subject} subject`}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubjectSelect(subject)}
                  >
                    <h2 className="text-2xl font-bold mb-2">{subject}</h2>
                    <motion.div
                      className="absolute inset-0 bg-white rounded-xl z-[-1]"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}