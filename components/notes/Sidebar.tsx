"use client"
import { useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

const starterSuggestions = [
  "Can you summarize the main points of my note?",
  "What are some key takeaways from this note?",
  "How can I improve the structure of my note?",
  "Are there any important details I'm missing?",
];

export const Sidebar = ({ noteId }) => {
  const [note, loading] = useDocument(doc(db, "notes", noteId));
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendQuery = async () => {
    const noteContent = note?.data()?.content || "";

    // Call Gemini API with current query and note content
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, noteContent }),
    });
    const data = await response.json();
    const geminiResponse = data.output;

    // Update chat history
    setChatHistory(prev => [...prev, { query, response: geminiResponse }]);
    setQuery("");
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-white border-l border-gray-200">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold mb-4">Gemini Assistant</h2>
        <p className="text-gray-600 mb-6">Get smart suggestions and insights for your notes</p>
        
        <div className="mb-8">
          <p className="font-semibold mb-2">Quick Suggestions:</p>
          <div className="grid grid-cols-1 gap-2">
            {starterSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                variant="outline"
                className="text-left"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <Card className="flex-1 overflow-y-auto">
        <CardContent className="p-6 space-y-6">
          {chatHistory.map((chat, index) => (
            <div key={index}>
              <div className="font-semibold text-gray-800 mb-1">You:</div>
              <div className="text-gray-700 rounded-lg bg-gray-100 p-3 mb-4">{chat.query}</div>
              <div className="font-semibold text-blue-600 mb-1">Gemini:</div>
              <div className="text-gray-700 rounded-lg bg-blue-50 p-3 markdown">
                <ReactMarkdown>{chat.response}</ReactMarkdown>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center">
          <Input
            placeholder="Ask Gemini..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 mr-4"
          />
          <Button
            onClick={handleSendQuery}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3"
          >
            <PaperPlaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};