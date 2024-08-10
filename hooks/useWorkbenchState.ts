import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement, WorkbenchData } from '@/types/workbench';

const useWorkbenchState = () => {
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'draw' | 'erase'>('select');
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [drawColor, setDrawColor] = useState('#000000');
  const [drawWidth, setDrawWidth] = useState(2);
  const [lines, setLines] = useState<number[][]>([]);

  const addToHistory = useCallback((elements: CanvasElement[]) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, historyStep + 1);
      newHistory.push(elements);
      return newHistory;
    });
    setHistoryStep(prevStep => prevStep + 1);
  }, [historyStep]);

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const handleElementUpdate = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements(prevElements => {
      const newElements = prevElements.map(el =>
        el.id === id ? { ...el, ...updates } : el
      );
      addToHistory(newElements);
      return newElements;
    });
  }, [addToHistory]);

  const handleAddSticker = useCallback((sticker: any) => {
    const img = new Image();
    img.src = sticker.imageUrl;
    img.onload = () => {
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: 'image',
        x: Math.random() * (canvasSize.width - 100),
        y: Math.random() * (canvasSize.height - 100),
        width: 100,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        image: img,
        imageUrl: sticker.imageUrl,
      };
      setCanvasElements(prevElements => {
        const newElements = [...prevElements, newElement];
        addToHistory(newElements);
        return newElements;
      });
    };
  }, [canvasSize, addToHistory]);

  const handleAddText = useCallback((text: string, fontSize: number, fontFamily: string, color: string) => {
    const newElement: CanvasElement = {
      id: uuidv4(),
      type: 'text',
      x: Math.random() * (canvasSize.width - 100),
      y: Math.random() * (canvasSize.height - 100),
      text,
      fontSize,
      fontFamily,
      fill: color,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      align: 'left',
    };
    setCanvasElements(prevElements => {
      const newElements = [...prevElements, newElement];
      addToHistory(newElements);
      return newElements;
    });
  }, [canvasSize, addToHistory]);

  const handleAddShape = useCallback((shapeType: 'rectangle' | 'circle', color: string, strokeColor: string, strokeWidth: number) => {
    const newElement: CanvasElement = {
      id: uuidv4(),
      type: 'shape',
      x: Math.random() * (canvasSize.width - 100),
      y: Math.random() * (canvasSize.height - 100),
      width: 100,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      fill: color,
      stroke: strokeColor,
      strokeWidth,
      shapeType,
      opacity: 1,
    };
    setCanvasElements(prevElements => {
      const newElements = [...prevElements, newElement];
      addToHistory(newElements);
      return newElements;
    });
  }, [canvasSize, addToHistory]);

  const handleDeleteElement = useCallback((id: string) => {
    setCanvasElements(prevElements => {
      const newElements = prevElements.filter(el => el.id !== id);
      addToHistory(newElements);
      return newElements;
    });
    setSelectedId(null);
  }, [addToHistory]);

  const handleUndo = useCallback(() => {
    if (historyStep > 0) {
      setHistoryStep(prevStep => prevStep - 1);
      setCanvasElements(history[historyStep - 1]);
    }
  }, [history, historyStep]);

  const handleRedo = useCallback(() => {
    if (historyStep < history.length - 1) {
      setHistoryStep(prevStep => prevStep + 1);
      setCanvasElements(history[historyStep + 1]);
    }
  }, [history, historyStep]);

  const handleToolChange = useCallback((newTool: 'select' | 'draw' | 'erase') => {
    setTool(newTool);
  }, []);

  const handleDrawColorChange = useCallback((color: string) => {
    setDrawColor(color);
  }, []);

  const handleDrawWidthChange = useCallback((width: number) => {
    setDrawWidth(width);
  }, []);

  const handleMouseDown = useCallback((e: any) => {
    if (tool !== 'draw' && tool !== 'erase') return;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, [pos.x, pos.y]]);
  }, [tool, lines]);

  const handleMouseMove = useCallback((e: any) => {
    if (tool !== 'draw' && tool !== 'erase') return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    if (lastLine) {
      lastLine = lastLine.concat([point.x, point.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines([...lines]);
    }
  }, [tool, lines]);

  const handleMouseUp = useCallback(() => {
    if (tool !== 'draw' && tool !== 'erase') return;
    if (lines.length > 0) {
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: 'freehand',
        points: lines[lines.length - 1],
        stroke: tool === 'erase' ? backgroundColor : drawColor,
        strokeWidth: drawWidth,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0,
        opacity: 1,
        globalCompositeOperation: tool === 'erase' ? 'destination-out' : 'source-over',
      };
      setCanvasElements(prevElements => {
        const newElements = [...prevElements, newElement];
        addToHistory(newElements);
        return newElements;
      });
      setLines([]);
    }
  }, [tool, lines, drawColor, drawWidth, backgroundColor, addToHistory]);

  const getSerializableWorkbenchData = useCallback((): WorkbenchData => {
    const serializableElements = canvasElements.map(element => {
      const { image, ...rest } = element;
      return rest;
    });

    return {
      canvasElements: serializableElements,
      backgroundColor,
      canvasSize,
    };
  }, [canvasElements, backgroundColor, canvasSize]);

  return {
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
    handleDeleteElement,
    handleUndo,
    handleRedo,
    handleToolChange,
    handleDrawColorChange,
    handleDrawWidthChange,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getSerializableWorkbenchData,
  };
};

export default useWorkbenchState;