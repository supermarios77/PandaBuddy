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
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mt-12 lg:ml-[600px]">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};