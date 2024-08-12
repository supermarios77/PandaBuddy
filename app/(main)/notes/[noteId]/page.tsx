"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import { SparklesIcon, Loader2Icon, CheckIcon } from "lucide-react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function NotePage({ params: { noteId } }) {
  const { userId } = useAuth();
  const [note, loading, error] = useDocument(
    userId && noteId ? doc(db, "notes", userId, "notes", noteId) : null
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (note) {
      setTitle(note.data()?.title || "");
      setContent(note.data()?.content || "");
    }
  }, [note]);

  const updateNote = async (newTitle, newContent) => {
    if (userId && noteId) {
      await updateDoc(doc(db, "notes", userId, "notes", noteId), {
        title: newTitle || "",
        content: newContent || "",
      });
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateNote(newTitle, content);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    updateNote(title, newContent);
  };

  const generateSuggestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "Suggest continuation for this text",
          noteContent: content,
        }),
      });
      if (!response.ok) throw new Error("Failed to get response from Gemini");
      const data = await response.json();
      setSuggestion(data.output);
    } catch (error) {
      console.error("Error generating suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = () => {
    if (suggestion) {
      setContent((prevContent) => prevContent + suggestion);
      updateNote(title, content + suggestion);
      setSuggestion("");
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "code-block"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "code-block",
  ];

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );
  if (!userId || loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="animate-spin h-8 w-8" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6 transition-colors duration-200 font-sans">
      <Card className="max-w-4xl mx-auto shadow-lg bg-white dark:bg-[#090808] border-none transition-colors duration-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Input
              value={title}
              onChange={handleTitleChange}
              className="text-3xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white flex-grow mr-4"
              placeholder="Untitled Note"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={generateSuggestion}
              className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SparklesIcon className="mr-2 h-4 w-4" />
              )}
              AI Suggest
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-250px)] relative">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
            />
            {suggestion && (
              <div className="mt-4 p-4 bg-purple-100 dark:bg-purple-900 rounded-md transition-colors duration-200">
                <p className="text-purple-800 dark:text-purple-200 italic mb-2">
                  Suggestion: {suggestion}
                </p>
                <Button
                  onClick={applySuggestion}
                  className="w-full bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-200"
                >
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Apply Suggestion
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}