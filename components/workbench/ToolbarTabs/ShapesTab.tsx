"use client"
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from '@/components/ui/slider';
import { SquareIcon, CircleIcon } from 'lucide-react';

interface ShapesTabProps {
  onAddShape: (shapeType: 'rectangle' | 'circle', color: string, strokeColor: string, strokeWidth: number) => void;
}

const ShapesTab: React.FC<ShapesTabProps> = ({ onAddShape }) => {
  const [shapeType, setShapeType] = useState<'rectangle' | 'circle'>('rectangle');
  const [color, setColor] = useState('#FF0000');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const handleAddShape = () => {
    onAddShape(shapeType, color, strokeColor, strokeWidth);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Shape Type</Label>
        <div className="flex space-x-2">
          <Toggle
            pressed={shapeType === 'rectangle'}
            onPressedChange={() => setShapeType('rectangle')}
          >
            <SquareIcon className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={shapeType === 'circle'}
            onPressedChange={() => setShapeType('circle')}
          >
            <CircleIcon className="w-4 h-4" />
          </Toggle>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="shape-color">Fill Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="shape-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 p-1"
          />
          <span className="text-sm">{color}</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="stroke-color">Stroke Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="stroke-color"
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-10 h-10 p-1"
          />
          <span className="text-sm">{strokeColor}</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="stroke-width">Stroke Width: {strokeWidth}px</Label>
        <Slider
          id="stroke-width"
          min={0}
          max={20}
          step={1}
          value={[strokeWidth]}
          onValueChange={(value) => setStrokeWidth(value[0])}
        />
      </div>
      <Button onClick={handleAddShape} className="w-full">Add Shape</Button>
    </div>
  );
};

export default ShapesTab;