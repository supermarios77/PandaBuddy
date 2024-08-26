import React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link"
import { motion } from "framer-motion"

interface CardProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}

export default function Component({ icon, link, title, description }: CardProps) {
  return (
    <Link href={link} passHref>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-full"
      >
        <Card className="p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-card backdrop-blur-lg h-full flex flex-col justify-between">
          <CardHeader>
            <motion.div
              className="flex items-center justify-center mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.div>
            <CardTitle className="text-center text-xl font-bold text-gray-800 dark:text-white mb-2">
              {title}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              {description}
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    </Link>
  )
}