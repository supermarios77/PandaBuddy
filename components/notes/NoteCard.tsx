"use client";

import { Card } from "@/components/ui/card";
import { truncate } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function NoteCard({ note, userId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const createdAt = new Date(note.createdAt);
  const formattedDate = createdAt.toLocaleDateString();
  const formattedTime = createdAt.toLocaleTimeString();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "notes", userId, "notes", note.id));
      toast({
        title: "Note deleted",
        description: "Your note has been successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete the note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="h-full"
    >
      <Card className="bg-card text-gray-800 dark:text-gray-200 p-6 flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group relative">
        <Link href={`/notes/${String(note.id)}`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
              {note.title}
            </h3>
          </div>
          <p className="text-lg font-medium mb-4 flex-grow">
            <ReactMarkdown>{truncate(note.content, 100)}</ReactMarkdown>
          </p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="mr-3">{formattedDate}</span>
            <Clock className="w-4 h-4 mr-1" />
            <span>{formattedTime}</span>
          </div>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this note?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}
