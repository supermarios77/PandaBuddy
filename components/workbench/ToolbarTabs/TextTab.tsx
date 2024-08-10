"use client"
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TextTabProps {
  onAddText: (
    text: string,
    fontSize: number,
    fontFamily: string,
    color: string
  ) => void;
}

const TextTab: React.FC<TextTabProps> = ({ onAddText }) => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [color, setColor] = useState("#000000");

  const handleAddText = () => {
    if (text.trim()) {
      onAddText(text, fontSize, fontFamily, color);
      setText("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text-input">Text</Label>
        <Input
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
        <Slider
          id="font-size"
          min={10}
          max={72}
          step={1}
          value={[fontSize]}
          onValueChange={(value) => setFontSize(value[0])}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="font-family">Font Family</Label>
        <Select onValueChange={setFontFamily} value={fontFamily}>
          <SelectTrigger id="font-family">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="text-color">Text Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="text-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 p-1"
          />
          <span className="text-sm">{color}</span>
        </div>
      </div>
      <Button onClick={handleAddText} className="w-full">
        Add Text
      </Button>
    </div>
  );
};

export default TextTab;