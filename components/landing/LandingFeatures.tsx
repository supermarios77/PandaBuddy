"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Component() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const features = [
    {
      title: "Personalized AI Learning",
      description: "Tailored lessons that adapt to your pace and understanding, making sure you learn smarter, not harder.",
      image: "/images/personalized-learning.png",
      span: "md:col-span-2 md:row-span-1"
    },
    {
      title: "Interactive Quizzes",
      description: "Engage with fun quizzes designed to challenge and improve your knowledge retention.",
      image: "/images/interactive-quizzes.svg",
    },
    {
      title: "Creative Workbench",
      description: "Express yourself with stickers, drawings, and notes, making learning both interactive and enjoyable.",
      image: "/images/creative-workbench.jpg",
    },
    {
      title: "Gamified Progress",
      description: "Track your achievements, unlock rewards, and stay motivated as you level up in your studies.",
      image: "/images/gamified-learning.png",
    },
    {
      title: "Pomodoro Timer",
      description: "Boost your productivity with a built-in Pomodoro timer, helping you study in focused sessions.",
      image: "/images/pomodoro-timer.png",
    }
  ]

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 py-24 overflow-hidden">
      <motion.h1 
        className="text-3xl md:text-4xl lg:text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore Panda Buddy's
      </motion.h1>
      <motion.h1 
        className="text-3xl md:text-4xl lg:text-4.5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Power-packed Features
      </motion.h1>
      <motion.p 
        className="text-lg md:text-xl text-center text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        And This Is Just the Beginning! Dive deeper to see how Panda Buddy can transform your learning journey.
      </motion.p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          return (
            <motion.div 
              key={index}
              className={`${feature.span || ''}`}
            >
              <Card 
                className="h-full bg-gray-50 dark:bg-[#111010] border-0 shadow-lg rounded-3xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="p-6">
                  <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{feature.description}</p>
                  <div className="relative w-full h-48 overflow-hidden rounded-2xl">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}