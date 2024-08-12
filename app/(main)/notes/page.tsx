'use client';

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExistingNotesList } from "@/components/notes/ExistingNotesList";
import { v4 as uuidv4 } from 'uuid';
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

const NotesPage = () => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  
  if (!isLoaded) return null;

  const createNewNote = async () => {
    const newNoteId = uuidv4();
    await createNote(newNoteId, userId);
    router.push(`/notes/${newNoteId}`);
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Button onClick={createNewNote}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> New Note
        </Button>
      </div>
      
      <ExistingNotesList userId={userId} />
      
    </div>
  );
};

const createNote = async (noteId: string, userId: string) => {
  await setDoc(doc(db, 'notes', userId, 'notes', noteId), {
    title: "Untitled Note",
    content: "",
  });
};

export default NotesPage;