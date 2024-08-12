import { useState, useEffect } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function NoteEditor({ noteId }) {
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

  if (loading) return <div className="flex items-center justify-center h-full">Loading note...</div>;

  return (
    <div className="flex-grow p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto space-y-4">
        <Input
          value={title}
          onChange={updateNoteTitle}
          className="text-3xl font-bold bg-transparent border-none focus:ring-0 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
          placeholder="Untitled Note"
        />
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
        <Textarea
          value={content}
          onChange={updateNoteContent}
          className="w-full min-h-[calc(100vh-200px)] resize-none bg-transparent border-none focus:ring-0 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600"
          placeholder="Start writing your thoughts here..."
        />
      </div>
    </div>
  );
}