'use client'

import React, { useEffect, useState } from "react"
import Lottie from "lottie-react"
import { DotLoader } from "react-spinners"
import UFOPanda from "./Animations/PandaInUFO.json"
import Mascot from "./Components/Mascot"
import Cards from "@/components/Card"
import {
  BookOpen,
  Notebook,
  Palette,
  Pencil,
  ShoppingBag,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

export default function Component() {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [advice, setAdvice] = useState("")
  const [loading, setLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: `Generate a 5 word learning advice for this time ${time} of the day`,
          }),
        })
        const data = await response.json()
        const cleanedAdvice = data.output
          .split("\n")
          .map((advice: string) => advice.replace(/[*-]/g, "").trim())
          .filter((advice: string | any[]) => advice.length > 0)
          .sort()
        setAdvice(cleanedAdvice)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching advice", error)
      }
    }

    fetchAdvice()
  }, [date])

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
      setDate(
        new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(now)
      )
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <DotLoader color="#9570FF" size={60} />
      </div>
    )

  return (
    <AnimatePresence>
      <motion.section
        key={theme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center flex-col justify-center p-5 mt-10 min-h-screen"
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-between w-full max-w-4xl p-8 rounded-[30px] shadow-lg mb-8 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.7) 0%, rgba(79, 70, 229, 0.7) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="absolute inset-0 bg-white  opacity-20 z-0"></div>
          <div className="relative z-10 flex-1">
            <motion.h1 
              className="text-4xl font-bold text-white mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {advice || `Pick Your Subject For Today`}
            </motion.h1>
            <motion.p 
              className="text-xl text-white text-opacity-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {time} | {date}
            </motion.p>
          </div>
          <motion.div 
            className="w-40 h-40 flex-shrink-0 relative z-10"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Lottie animationData={UFOPanda} loop={true} />
          </motion.div>
        </motion.div>

        <div className="my-8">
          <Mascot />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl mb-12"
        >
          <Cards
            link="/shop"
            icon={<ShoppingBag className="w-8 h-8 text-purple-500" />}
            title="Shop"
            description="Buy some stickers."
          />
          <Cards
            link="/notes"
            icon={<Notebook className="w-8 h-8 text-blue-500" />}
            title="Notes"
            description="Manage your notes."
          />
          <Cards
            link="/courses"
            icon={<BookOpen className="w-8 h-8 text-green-500" />}
            title="Study"
            description="Earn points now!"
          />
          <Cards
            link="/workbench"
            icon={<Palette className="w-8 h-8 text-pink-500" />}
            title="Workbench"
            description="Create cool art!"
          />
        </motion.div>
      </motion.section>
    </AnimatePresence>
  )
}