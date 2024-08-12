import { useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, SparklesIcon, Loader2Icon } from "lucide-react";

const quickSuggestions = ["Summarize", "Key points", "Expand on", "Clarify"];

export function Sidebar({ isOpen, noteId }) {
  const [note] = useDocument(doc(db, "notes", noteId));
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendQuery = async () => {
    const noteContent = note?.data()?.content || "";

    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, noteContent }),
    });
    const data = await response.json();
    const geminiResponse = data.output;

    setChatHistory((prev) => [...prev, { query, response: geminiResponse }]);
    setQuery("");
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-purple-500" />
          Gemini Assistant
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Get insights for your notes
        </p>
      </div>

      {chatHistory.length === 0 && (
        <div className="p-4 grid grid-cols-2 gap-2">
          {quickSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => setQuery(suggestion)}
              className="text-sm h-auto py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}

      <div className="flex-grow overflow-auto p-4 space-y-4">
        {chatHistory.map((chat, index) => (
          <div key={index} className="space-y-2">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                You
              </p>
              <p className="text-gray-700 dark:text-gray-300">{chat.query}</p>
            </div>
            <div className="bg-purple-50 dark:bg-gray-600 p-3 rounded-lg">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-300">
                Gemini
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {chat.response}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-purple-50 dark:bg-gray-600 p-3 rounded-lg flex items-center">
            <Loader2Icon className="h-5 w-5 text-purple-500 dark:text-purple-300 animate-spin mr-2" />
            <p className="text-sm font-medium text-purple-600 dark:text-purple-300">
              Gemini is thinking...
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Gemini..."
            className="flex-grow bg-gray-100 dark:bg-gray-700 border-none text-gray-800 dark:text-gray-200"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendQuery}
            size="icon"
            className="bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-600"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
