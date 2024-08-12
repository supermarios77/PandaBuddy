"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { Sidebar } from "@/components/notes/Sidebar"
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

export default function NotePage({ params: { noteId } }) {
  const { userId } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`h-screen flex`}>
      <div className="flex-grow flex flex-col bg-background transition-colors duration-300">
        <header className="flex justify-between items-center p-4 bg-background shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Pandy's Notes</h1>
        </header>
        <NoteEditor noteId={noteId} userId={userId} />
      </div>
      <Sidebar isOpen={isSidebarOpen} noteId={noteId} userId={userId} />
    </div>
  );
}