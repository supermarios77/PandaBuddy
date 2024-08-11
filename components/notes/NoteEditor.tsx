'use client';

import { useState, useEffect } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const NoteEditor = ({ noteId }) => {
  const [note, loading] = useDocument(doc(db, "notes", noteId));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.data()?.title || "");
      setContent(note.data()?.content || "");
    }  
  }, [note]);

  const updateNoteTitle = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    await updateDoc(doc(db, "notes", noteId), { title: newTitle });
  };

  const updateNoteContent = async (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    await updateDoc(doc(db, "notes", noteId), { content: newContent });
  };

  if (loading) return <div>Loading note...</div>;

  return (
        <div className="flex-grow bg-white shadow-lg m-4 p-6 rounded-lg overflow-y-auto">
      <Input 
        value={title} 
        onChange={updateNoteTitle}
        className="text-2xl font-bold mb-4"
        placeholder="Enter note title"
      />
      <Textarea
        value={content}
        onChange={updateNoteContent} 
        className="w-full h-[calc(100vh-200px)]"
        placeholder="Write your note here..."
      />
    </div>
  );
};