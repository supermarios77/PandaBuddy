import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { PenToolIcon } from 'lucide-react';

interface DrawTabProps {
  onToolChange: (tool: 'select' | 'draw') => void;
  onDrawColorChange: (color: string) => void;
  onDrawWidthChange: (width: number) => void;
  drawColor: string;
  drawWidth: number;
  tool: 'select' | 'draw';
}

const DrawTab: React.FC<DrawTabProps> = ({
  onToolChange,
  onDrawColorChange,
  onDrawWidthChange,
  drawColor,
  drawWidth,
  tool,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Drawing Tool</Label>
        <div className="flex space-x-2">
          <Toggle
            pressed={tool === 'draw'}
            onPressedChange={() => onToolChange('draw')}
          >
            <PenToolIcon className="w-4 h-4" />
          </Toggle>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="draw-color">Draw Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="draw-color"
            type="color"
            value={drawColor}
            onChange={(e) => onDrawColorChange(e.target.value)}
            className="w-10 h-10 p-1"
          />
          <span className="text-sm">{drawColor}</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="draw-width">Draw Width: {drawWidth}px</Label>
        <Slider
          id="draw-width"
          min={1}
          max={20}
          step={1}
          value={[drawWidth]}
          onValueChange={(value) => onDrawWidthChange(value[0])}
        />
      </div>
    </div>
  );
};

export default DrawTab;