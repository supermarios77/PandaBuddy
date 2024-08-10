import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StickerTab from './ToolbarTabs/StickerTab';
import TextTab from './ToolbarTabs/TextTab';
import ShapesTab from './ToolbarTabs/ShapesTab';
import DrawTab from './ToolbarTabs/DrawTab';

interface ToolbarProps {
  onAddSticker: (sticker: any) => void;
  onAddText: (text: string, fontSize: number, fontFamily: string, color: string) => void;
  onAddShape: (shapeType: 'rectangle' | 'circle', color: string, strokeColor: string, strokeWidth: number) => void;
  onToolChange: (tool: 'select' | 'draw') => void;
  onDrawColorChange: (color: string) => void;
  onDrawWidthChange: (width: number) => void;
  drawColor: string;
  drawWidth: number;
  tool: 'select' | 'draw';
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddSticker,
  onAddText,
  onAddShape,
  onToolChange,
  onDrawColorChange,
  onDrawWidthChange,
  drawColor,
  drawWidth,
  tool,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tools</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="stickers" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stickers">Stickers</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="shapes">Shapes</TabsTrigger>
            <TabsTrigger value="draw">Draw</TabsTrigger>
          </TabsList>
          <TabsContent value="stickers" className="p-4">
            <StickerTab onAddSticker={onAddSticker} />
          </TabsContent>
          <TabsContent value="text" className="p-4">
            <TextTab onAddText={onAddText} />
          </TabsContent>
          <TabsContent value="shapes" className="p-4">
            <ShapesTab onAddShape={onAddShape} />
          </TabsContent>
          <TabsContent value="draw" className="p-4">
            <DrawTab
              onToolChange={onToolChange}
              onDrawColorChange={onDrawColorChange}
              onDrawWidthChange={onDrawWidthChange}
              drawColor={drawColor}
              drawWidth={drawWidth}
              tool={tool}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Toolbar;