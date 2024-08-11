'use client';

import { useNotes } from "@/hooks/useNotes";
import { NoteCard } from "./NoteCard";

export const ExistingNotesList = ({ userId }) => {
  const notes = useNotes(userId);
  
  if (!notes) return <div>Loading notes...</div>;
  
  if (notes.length === 0) {
    return <div className="text-lg text-gray-500">No notes found. Create a new one to get started!</div>;  
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};