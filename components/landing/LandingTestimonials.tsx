'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    content: "Panda Buddy has revolutionized the way I learn. The AI-powered system adapts to my pace, making studying a joy!",
    author: "Alex Johnson",
    role: "Computer Science Student"
  },
  {
    id: 2,
    content: "As a teacher, I've seen my students' engagement skyrocket with Panda Buddy. It's an invaluable tool in modern education.",
    author: "Sarah Thompson",
    role: "High School Teacher"
  },
  {
    id: 3,
    content: "The gamification aspect of Panda Buddy makes learning addictive. I've never been so excited to tackle new subjects!",
    author: "Mike Chen",
    role: "Lifelong Learner"
  }
]

export default function AnimatedTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-24 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          What Our <span className="text-purple-600 dark:text-purple-400">Learners</span> Say
        </h2>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-[#1f1f1f] p-8 rounded-3xl shadow-xl"
            >
              <Quote className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4" />
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">{testimonials[currentIndex].content}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {testimonials[currentIndex].author[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{testimonials[currentIndex].author}</p>
                  <p className="text-gray-600 dark:text-gray-400">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-12 transform -translate-y-1/2 bg-white dark:bg-card p-2 rounded-full shadow-md text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-white dark:bg-card p-2 rounded-full shadow-md text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === currentIndex ? 'bg-purple-600 dark:bg-purple-400' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}