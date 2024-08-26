'use client'

import { useNotes } from "@/hooks/useNotes"
import { NoteCard } from "./NoteCard"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen } from "lucide-react"
import { useState, useEffect } from "react"

export function ExistingNotesList({ userId, searchTerm }) {
  const notes = useNotes(userId)
  const [filteredNotes, setFilteredNotes] = useState([])

  useEffect(() => {
    if (notes) {
      setFilteredNotes(
        notes.filter((note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [notes, searchTerm])

  if (!notes) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )
  
  if (filteredNotes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl text-gray-600 dark:text-gray-300 text-center p-12 bg-card0 rounded-2xl shadow-xl"
      >
        <BookOpen className="w-24 h-24 mx-auto mb-6 text-purple-500" />
        <p className="font-semibold">No notes found. Create a new one to get started!</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      <AnimatePresence>
        {filteredNotes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <NoteCard note={note} userId={userId} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}