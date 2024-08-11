"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const Sidebar = ({ noteId }) => {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendQuery = async () => {
    const response = await fetch("/api/gemini", {  
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    const geminiResponse = data.output;

    setChatHistory(prev => [...prev, { query, response: geminiResponse }]);
    setQuery("");
  };

  return (
    <div className="bg-gray-100 w-80 p-4 flex flex-col">
      <h2 className="text-xl mb-4">Gemini Assistant</h2>
      
      <Card className="flex-1 mb-4 overflow-auto">
        <CardHeader>Chat History</CardHeader>
        <CardContent>
          {chatHistory.map((chat, index) => (
            <div key={index}>
              <div className="font-semibold">You: {chat.query}</div>
              <div>Gemini: {chat.response}</div>
            </div>
          ))}
        </CardContent>  
      </Card>
      
      <div className="flex">
        <Input 
          placeholder="Ask Gemini..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 mr-2"
        />
        <Button onClick={handleSendQuery}>Send</Button>
      </div>
    </div>
  );
};