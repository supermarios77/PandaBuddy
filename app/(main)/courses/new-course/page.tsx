"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Book, FlaskRound, Globe, History, Palette, PenTool, Music, Code, Dumbbell, Microscope, Calculator, Languages } from "lucide-react"
import confetti from 'canvas-confetti'
import { useUser } from "@clerk/nextjs"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebaseConfig"

import { Badge } from "@/components/ui/badge"

const categories = [
  { name: "Mathematics", icon: Calculator, gradient: "from-blue-400 to-blue-600", description: "Explore numbers, patterns, and shapes" },
  { name: "Science", icon: FlaskRound, gradient: "from-green-400 to-green-600", description: "Discover the wonders of the natural world" },
  { name: "History", icon: History, gradient: "from-yellow-400 to-yellow-600", description: "Uncover the stories of our past" },
  { name: "Geography", icon: Globe, gradient: "from-red-400 to-red-600", description: "Learn about our planet and its features" },
  { name: "Literature", icon: Book, gradient: "from-purple-400 to-purple-600", description: "Explore the world through words" },
  { name: "Art", icon: Palette, gradient: "from-pink-400 to-pink-600", description: "Express yourself through creativity" },
  { name: "Music", icon: Music, gradient: "from-indigo-400 to-indigo-600", description: "Discover the language of sound" },
  { name: "Computer Science", icon: Code, gradient: "from-cyan-400 to-cyan-600", description: "Learn the art of programming" },
  { name: "Physical Education", icon: Dumbbell, gradient: "from-orange-400 to-orange-600", description: "Stay fit and healthy" },
  { name: "Biology", icon: Microscope, gradient: "from-teal-400 to-teal-600", description: "Study life and living organisms" },
  { name: "Languages", icon: Languages, gradient: "from-rose-400 to-rose-600", description: "Master new ways of communication" },
  { name: "Writing", icon: PenTool, gradient: "from-lime-400 to-lime-600", description: "Craft compelling stories and essays" },
]

export default function WhatDoYouWantToLearn() {
  const router = useRouter()
  const { user } = useUser()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)
  const [userInterests, setUserInterests] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
    fetchUserInterests()
  }, [])

  const fetchUserInterests = async () => {
    if (user?.id) {
      const docRef = doc(db, "userProfiles", user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const userData = docSnap.data()
        setUserInterests(userData.interests || [])
      }
    }
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
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
      router.push(`/courses/new-course/pick-level?category=${category}`)
    }, 1000)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!mounted) return null

  return (
    <section className="w-full min-h-screen py-12 md:py-24 lg:py-32 transition-colors duration-300">
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-50" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white mb-4">
            What do you want to learn?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Embark on a journey of knowledge and discover your passion
          </p>
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-card text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          <AnimatePresence>
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
                className={`group relative flex flex-col items-center justify-center rounded-xl p-6 text-center text-white transition-all cursor-pointer bg-gradient-to-br ${category.gradient} shadow-md hover:shadow-xl`}
                onClick={() => handleCategoryClick(category.name)}
                tabIndex={0}
                role="button"
                aria-label={`Select ${category.name} category`}
                onKeyPress={(e) => e.key === 'Enter' && handleCategoryClick(category.name)}
              >
                {userInterests.includes(category.name) && (
                  <Badge className="absolute top-2 right-2 bg-white text-gray-900">
                    Interested
                  </Badge>
                )}
                <category.icon className="w-16 h-16 mb-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>
                <motion.div
                  className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl z-[-1]"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredCategories.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 dark:text-gray-400 mt-8"
          >
            No subjects found. Try a different search term.
          </motion.p>
        )}
      </div>
    </section>
  )
}