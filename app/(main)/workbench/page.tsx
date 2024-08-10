"use client"
import React, { useCallback } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import useWorkbenchState from '@/hooks/useWorkbenchState';
import useFirestoreWorkbench from '@/hooks/useFirestoreWorkbench';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CanvasSettings from '@/components/workbench/CanvasSettings';
import CanvasElements from '@/components/workbench/CanvasElements';
import Toolbar from '@/components/workbench/Toolbar';
import { Toaster, toast } from 'react-hot-toast';

const CreativeWorkbench: React.FC = () => {
  const {
    canvasElements,
    setCanvasElements,
    canvasSize,
    setCanvasSize,
    backgroundColor,
    setBackgroundColor,
    selectedId,
    tool,
    drawColor,
    drawWidth,
    lines,
    handleSelect,
    handleElementUpdate,
    handleAddSticker,
    handleAddText,
    handleAddShape,
    handleUndo,
    handleRedo,
    handleToolChange,
    handleDrawColorChange,
    handleDrawWidthChange,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getSerializableWorkbenchData,
  } = useWorkbenchState();

  const { saveWorkbench, loadWorkbench } = useFirestoreWorkbench();

  const handleSave = useCallback(async () => {
    const serializableData = getSerializableWorkbenchData();
    try {
      await saveWorkbench(serializableData);
      toast.success('Workbench saved successfully!');
    } catch (error) {
      console.error('Error saving workbench:', error);
      toast.error('Failed to save workbench. Please try again.');
    }
  }, [getSerializableWorkbenchData, saveWorkbench]);

  const handleLoad = useCallback(async () => {
    try {
      const loadedData = await loadWorkbench();
      if (loadedData) {
        setCanvasElements(loadedData.canvasElements);
        setBackgroundColor(loadedData.backgroundColor);
        setCanvasSize(loadedData.canvasSize);
        toast.success('Workbench loaded successfully!');
      } else {
        // @ts-ignore
        toast.info('No saved workbench found.');
      }
    } catch (error) {
      console.error('Error loading workbench:', error);
      toast.error('Failed to load workbench. Please try again.');
    }
  }, [loadWorkbench, setCanvasElements, setBackgroundColor, setCanvasSize]);

  return (
    <div className="creative-workbench p-4 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-center">Creative Workbench</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-6">
          <Toolbar
            onAddSticker={handleAddSticker}
            onAddText={handleAddText}
            onAddShape={handleAddShape}
            onToolChange={handleToolChange}
            onDrawColorChange={handleDrawColorChange}
            onDrawWidthChange={handleDrawWidthChange}
            drawColor={drawColor}
            drawWidth={drawWidth}
            tool={tool}
          />
          <CanvasSettings
            backgroundColor={backgroundColor}
            onBackgroundColorChange={setBackgroundColor}
          />
          <Card>
            <CardContent className="space-y-2 pt-6">
              <Button onClick={handleSave} className="w-full">Save Workbench</Button>
              <Button onClick={handleLoad} className="w-full">Load Workbench</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button onClick={handleUndo} variant="outline">Undo</Button>
              <Button onClick={handleRedo} variant="outline">Redo</Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0 overflow-hidden">
              <Stage
                width={canvasSize.width}
                height={canvasSize.height}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                style={{ backgroundColor }}
              >
                <Layer>
                  <CanvasElements
                    elements={canvasElements}
                    selectedId={selectedId}
                    tool={tool}
                    onSelect={handleSelect}
                    onUpdate={handleElementUpdate}
                  />
                  {tool === 'draw' && lines.map((line, i) => (
                    <Line
                      key={i}
                      points={line}
                      stroke={drawColor}
                      strokeWidth={drawWidth}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                      globalCompositeOperation="source-over"
                    />
                  ))}
                </Layer>
              </Stage>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreativeWorkbench;