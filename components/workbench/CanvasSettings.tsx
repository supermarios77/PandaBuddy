import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CanvasSettingsProps {
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
}

const CanvasSettings: React.FC<CanvasSettingsProps> = ({
  backgroundColor,
  onBackgroundColorChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Canvas Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bg-color">Background Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="bg-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="w-10 h-10 p-1"
            />
            <span className="text-sm">{backgroundColor}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CanvasSettings;