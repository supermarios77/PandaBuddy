'use client'

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { PlusCircleIcon, BookOpen, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExistingNotesList } from "@/components/notes/ExistingNotesList"
import { v4 as uuidv4 } from "uuid"
import { setDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebaseConfig"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Toaster } from "@/components/ui/toaster"

export default function Component() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  if (!isLoaded) return null

  const createNewNote = async () => {
    const newNoteId = uuidv4()
    await createNote(newNoteId, userId)
    router.push(`/notes/${newNoteId}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full min-h-screen py-12 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-12"
        >
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-6 sm:mb-0">
            My Notes
          </h1>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={createNewNote}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              <PlusCircleIcon className="mr-2 h-5 w-5" /> New Note
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative mb-8"
        >
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-gray-700 bg-card border-2 border-purple-300 rounded-full focus:outline-none focus:border-purple-500 dark:text-gray-200 dark:border-purple-700 dark:focus:border-purple-500"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </motion.div>

        <ExistingNotesList userId={userId} searchTerm={searchTerm} />
      </div>
      <Toaster />
    </motion.div>
  )
}

const createNote = async (noteId: string, userId: string) => {
  await setDoc(doc(db, "notes", userId, "notes", noteId), {
    title: "Untitled Note",
    content: "",
    createdAt: new Date().toISOString(),
  })
}