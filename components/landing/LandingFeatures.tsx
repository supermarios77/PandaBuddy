'use client'

import { useState } from 'react'
import { Gamepad, Palette, PenIcon, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"

const pandaBuddyFeatures = [
  {
    id: 1,
    title: "AI-Powered Learning",
    description: "Harness the power of AI to tailor learning paths that adapt to your unique pace and preferences.",
    icon: <PenIcon className="w-6 h-6" />,
    image: "https://img.freepik.com/free-psd/3d-render-books-notebooks-sales-blank-banner-background_23-2151386597.jpg?ga=GA1.1.464907008.1722544349&semt=ais_hybrid"
  },
  {
    id: 2,
    title: "Interactive Quizzes",
    description: "Engage with quizzes that not only test your knowledge but also help you learn as you play.",
    icon: <Phone className="w-6 h-6" />,
    image: "https://img.freepik.com/free-photo/books-still-life-cartoon-style_23-2150546129.jpg?ga=GA1.1.464907008.1722544349&semt=ais_hybrid"
  },
  {
    id: 3,
    title: "Gamification & Rewards",
    description: "Earn badges and rewards as you progress, making learning a fun and engaging experience.",
    icon: <Gamepad className="w-6 h-6" />,
    image: "https://img.freepik.com/free-photo/3d-cartoon-background-children_23-2150150806.jpg?ga=GA1.1.464907008.1722544349&semt=ais_hybrid"
  },
  {
    id: 4,
    title: "Creative Workspace",
    description: "Unleash your creativity with our workspace tools, including stickers, notes, and a Pomodoro timer.",
    icon: <Palette className="w-6 h-6" />,
    image: "https://img.freepik.com/free-psd/3d-illustration-nocturnal-person-staying-up_23-2150944847.jpg?ga=GA1.1.464907008.1722544349&semt=ais_hybrid"
  }
]

export default function LandingFeatures() {
  const [activeTab, setActiveTab] = useState(1)

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why <span className="text-purple-600">Panda Buddy</span> is Perfect for You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the features that make Panda Buddy the ultimate learning companion, tailored to your unique needs and learning style.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                className="w-full h-full object-cover"
                src={pandaBuddyFeatures[activeTab - 1].image}
                alt={`${pandaBuddyFeatures[activeTab - 1].title} Image`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{pandaBuddyFeatures[activeTab - 1].title}</h3>
                <p className="text-sm">{pandaBuddyFeatures[activeTab - 1].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div>
            <nav className="grid gap-4" aria-label="Features" role="tablist">
              {pandaBuddyFeatures.map((feature) => (
                <motion.button
                  key={feature.id}
                  type="button"
                  className={cn(
                    "text-left p-4 rounded-xl transition-all duration-200 ease-in-out",
                    activeTab === feature.id
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  )}
                  onClick={() => setActiveTab(feature.id)}
                  aria-selected={activeTab === feature.id}
                  aria-controls={`feature-tab-${feature.id}`}
                  role="tab"
                >
                  <span className="flex items-center gap-4">
                    <span className={cn(
                      "flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full",
                      activeTab === feature.id ? "bg-white/20" : "bg-white"
                    )}>
                      {feature.icon}
                    </span>
                    <span className="flex-grow">
                      <span className="block text-lg font-semibold">
                        {feature.title}
                      </span>
                      <span className="block mt-1 text-sm opacity-80">
                        {feature.description}
                      </span>
                    </span>
                  </span>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  )
}