"use client";
import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Transformer,
  Rect,
  Circle,
  Line,
} from "react-konva";
import { getDocs, collection } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import {
  ImageIcon,
  TextIcon,
  SquareIcon,
  PenToolIcon,
  CircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Sticker {
  id: string;
  name: string;
  imageUrl: string;
}

interface CanvasElement {
  id: string;
  type: "image" | "text" | "shape" | "freehand";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  align?: string;
  stickerId?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  shapeType?: "rectangle" | "circle";
  points?: number[];
  opacity: number;
  blendMode?: string;
}

const CreativeWorkbench: React.FC = () => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [text, setText] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [fontSize, setFontSize] = useState<number>(20);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [textAlign, setTextAlign] = useState<string>("left");
  const [shapeColor, setShapeColor] = useState<string>("#FF0000");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [shapeType, setShapeType] = useState<"rectangle" | "circle">(
    "rectangle"
  );
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lines, setLines] = useState<number[][]>([]);
  const [tool, setTool] = useState<"select" | "draw">("select");
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const stageRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCanvasSize({
        width: windowSize.width - 32,
        height: windowSize.height * 0.6,
      });
    } else {
      setCanvasSize({ width: 800, height: 600 });
    }
  }, [windowSize, isMobile]);

  useEffect(() => {
    async function fetchStickers() {
      try {
        const stickersSnapshot = await getDocs(collection(db, "stickers"));
        const stickersList = stickersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Sticker[];

        setStickers(stickersList);

        const imgMap: Record<string, HTMLImageElement> = {};
        stickersList.forEach((sticker) => {
          const img = new Image();
          img.src = sticker.imageUrl;
          img.onload = () => {
            imgMap[sticker.id] = img;
            setImages((prevImages) => ({ ...prevImages, ...imgMap }));
          };
        });
      } catch (error) {
        console.error("Error fetching stickers:", error);
      }
    }

    fetchStickers();
  }, []);

  useEffect(() => {
    if (selectedId) {
      const selectedNode = stageRef.current?.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current?.nodes([selectedNode]);
        transformerRef.current?.getLayer().batchDraw();
      }
    } else {
      transformerRef.current?.nodes([]);
      transformerRef.current?.getLayer().batchDraw();
    }
  }, [selectedId]);

  const addToHistory = (elements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(elements);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setCanvasElements(history[historyStep - 1]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setCanvasElements(history[historyStep + 1]);
    }
  };

  const handleAddSticker = (sticker: Sticker) => {
    const newElement: CanvasElement = {
      id: uuidv4(),
      type: "image",
      stickerId: sticker.id,
      x: Math.random() * (canvasSize.width - 100),
      y: Math.random() * (canvasSize.height - 100),
      width: 100,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
    };
    const newElements = [...canvasElements, newElement];
    setCanvasElements(newElements);
    addToHistory(newElements);
  };

  const handleAddText = () => {
    if (text.trim()) {
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: "text",
        text,
        x: Math.random() * (canvasSize.width - 100),
        y: Math.random() * (canvasSize.height - 100),
        fontSize,
        fontFamily,
        align: textAlign,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        fill: textColor,
        opacity: 1,
      };
      const newElements = [...canvasElements, newElement];
      setCanvasElements(newElements);
      addToHistory(newElements);
      setText("");
    }
  };

  const handleAddShape = () => {
    const newElement: CanvasElement = {
      id: uuidv4(),
      type: "shape",
      x: Math.random() * (canvasSize.width - 100),
      y: Math.random() * (canvasSize.height - 100),
      width: 100,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      fill: shapeColor,
      stroke: strokeColor,
      strokeWidth,
      shapeType,
      opacity: 1,
    };
    const newElements = [...canvasElements, newElement];
    setCanvasElements(newElements);
    addToHistory(newElements);
  };

  const handleElementUpdate = (id: string, updates: Partial<CanvasElement>) => {
    const newElements = canvasElements.map((el) =>
      el.id === id ? { ...el, ...updates } : el
    );
    setCanvasElements(newElements);
    addToHistory(newElements);
  };

  const handleSelect = (id: string | null) => {
    setSelectedId(id);
  };

  const handleDragStart = (e: any) => {
    const id = e.target.id();
    setCanvasElements((prev) =>
      prev.map((el) => ({
        ...el,
        isDragging: el.id === id,
      }))
    );
  };

  const handleDragEnd = (e: any) => {
    const newElements = canvasElements.map((el) => ({
      ...el,
      isDragging: false,
      x: el.id === e.target.id() ? e.target.x() : el.x,
      y: el.id === e.target.id() ? e.target.y() : el.y,
    }));
    setCanvasElements(newElements);
    addToHistory(newElements);
  };

  const handleMouseDown = (e: any) => {
    if (tool === "draw") {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, [pos.x, pos.y]]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine = lastLine.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (lines.length > 0) {
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: "freehand",
        points: lines[lines.length - 1],
        stroke: strokeColor,
        strokeWidth,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0,
        opacity: 1,
      };
      const newElements = [...canvasElements, newElement];
      setCanvasElements(newElements);
      addToHistory(newElements);
      setLines([]);
    }
  };

  const handleTouchStart = (e: any) => {
    const touch = e.touches[0];
    handleMouseDown({
      ...e,
      evt: touch,
      target: { ...e.target, getStage: () => stageRef.current },
    });
  };

  const handleTouchMove = (e: any) => {
    const touch = e.touches[0];
    handleMouseMove({
      ...e,
      evt: touch,
      target: { ...e.target, getStage: () => stageRef.current },
    });
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  return (
    <div className="creative-workbench p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Creative Workbench
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stickers" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="stickers">
                    <ImageIcon className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="text">
                    <TextIcon className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="shapes">
                    <SquareIcon className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="draw">
                    <PenToolIcon className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="stickers">
                  <ScrollArea className="h-[300px] w-full pr-4">
                    <div className="grid grid-cols-3 gap-2 p-2">
                      {stickers.map((sticker) => (
                        <Button
                          key={sticker.id}
                          onClick={() => handleAddSticker(sticker)}
                          variant="outline"
                          className="p-1 h-auto aspect-square"
                        >
                          <img
                            src={sticker.imageUrl}
                            alt={sticker.name}
                            className="w-full h-full object-contain"
                          />
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="text" className="space-y-4">
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
                        <SelectItem value="Times New Roman">
                          Times New Roman
                        </SelectItem>
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
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-10 h-10 p-1"
                      />
                      <span className="text-sm">{textColor}</span>
                    </div>
                  </div>
                  <Button onClick={handleAddText} className="w-full">
                    Add Text
                  </Button>
                </TabsContent>
                <TabsContent value="shapes" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Shape Type</Label>
                    <div className="flex space-x-2">
                      <Toggle
                        pressed={shapeType === "rectangle"}
                        onPressedChange={() => setShapeType("rectangle")}
                      >
                        <SquareIcon className="w-4 h-4" />
                      </Toggle>
                      <Toggle
                        pressed={shapeType === "circle"}
                        onPressedChange={() => setShapeType("circle")}
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
                        value={shapeColor}
                        onChange={(e) => setShapeColor(e.target.value)}
                        className="w-10 h-10 p-1"
                      />
                      <span className="text-sm">{shapeColor}</span>
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
                    <Label htmlFor="stroke-width">
                      Stroke Width: {strokeWidth}px
                    </Label>
                    <Slider
                      id="stroke-width"
                      min={0}
                      max={20}
                      step={1}
                      value={[strokeWidth]}
                      onValueChange={(value) => setStrokeWidth(value[0])}
                    />
                  </div>
                  <Button onClick={handleAddShape} className="w-full">
                    Add Shape
                  </Button>
                </TabsContent>
                <TabsContent value="draw" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Drawing Tool</Label>
                    <div className="flex space-x-2">
                      <Toggle
                        pressed={tool === "draw"}
                        onPressedChange={() => setTool("draw")}
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
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="w-10 h-10 p-1"
                      />
                      <span className="text-sm">{strokeColor}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="draw-width">
                      Draw Width: {strokeWidth}px
                    </Label>
                    <Slider
                      id="draw-width"
                      min={1}
                      max={20}
                      step={1}
                      value={[strokeWidth]}
                      onValueChange={(value) => setStrokeWidth(value[0])}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

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
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-10 h-10 p-1"
                  />
                  <span className="text-sm">{backgroundColor}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button
                onClick={handleUndo}
                disabled={historyStep <= 0}
                variant="outline"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleRedo}
                disabled={historyStep >= history.length - 1}
                variant="outline"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0 overflow-hidden">
              <Stage
                width={canvasSize.width}
                height={canvasSize.height}
                ref={stageRef}
                style={{ backgroundColor }}
                onClick={(e) => {
                  const clickedOnEmpty = e.target === e.target.getStage();
                  if (clickedOnEmpty) {
                    handleSelect(null);
                  }
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Layer ref={layerRef}>
                  {canvasElements.map((element) => {
                    if (element.type === "image" && element.stickerId) {
                      const img = images[element.stickerId];
                      return img ? (
                        <KonvaImage
                          key={element.id}
                          id={element.id}
                          image={img}
                          x={element.x}
                          y={element.y}
                          width={element.width}
                          height={element.height}
                          rotation={element.rotation}
                          scaleX={element.scaleX}
                          scaleY={element.scaleY}
                          opacity={element.opacity}
                          // @ts-ignore
                          globalCompositeOperation={element.blendMode}
                          draggable
                          onClick={() => handleSelect(element.id)}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onTransformEnd={(e) => {
                            const node = e.target;
                            handleElementUpdate(element.id, {
                              x: node.x(),
                              y: node.y(),
                              rotation: node.rotation(),
                              scaleX: node.scaleX(),
                              scaleY: node.scaleY(),
                            });
                          }}
                        />
                      ) : null;
                    } else if (element.type === "text") {
                      return (
                        <Text
                          key={element.id}
                          id={element.id}
                          text={element.text}
                          x={element.x}
                          y={element.y}
                          fontSize={element.fontSize}
                          fontFamily={element.fontFamily}
                          align={element.align}
                          fill={element.fill}
                          rotation={element.rotation}
                          scaleX={element.scaleX}
                          scaleY={element.scaleY}
                          opacity={element.opacity}
                          globalCompositeOperation={element.blendMode}
                          draggable
                          onClick={() => handleSelect(element.id)}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onTransformEnd={(e) => {
                            const node = e.target;
                            handleElementUpdate(element.id, {
                              x: node.x(),
                              y: node.y(),
                              rotation: node.rotation(),
                              scaleX: node.scaleX(),
                              scaleY: node.scaleY(),
                            });
                          }}
                        />
                      );
                    } else if (element.type === "shape") {
                      const ShapeComponent =
                        element.shapeType === "circle" ? Circle : Rect;
                      return (
                        <ShapeComponent
                          key={element.id}
                          id={element.id}
                          x={element.x}
                          y={element.y}
                          width={element.width}
                          height={element.height}
                          fill={element.fill}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                          rotation={element.rotation}
                          scaleX={element.scaleX}
                          scaleY={element.scaleY}
                          opacity={element.opacity}
                          // @ts-ignore
                          globalCompositeOperation={element.blendMode}
                          draggable
                          onClick={() => handleSelect(element.id)}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onTransformEnd={(e) => {
                            const node = e.target;
                            handleElementUpdate(element.id, {
                              x: node.x(),
                              y: node.y(),
                              rotation: node.rotation(),
                              scaleX: node.scaleX(),
                              scaleY: node.scaleY(),
                            });
                          }}
                        />
                      );
                    } else if (element.type === "freehand") {
                      return (
                        <Line
                          key={element.id}
                          id={element.id}
                          points={element.points}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                          tension={0.5}
                          lineCap="round"
                          // @ts-ignore
                          globalCompositeOperation={element.blendMode}
                          opacity={element.opacity}
                          draggable
                          onClick={() => handleSelect(element.id)}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onTransformEnd={(e) => {
                            const node = e.target;
                            handleElementUpdate(element.id, {
                              x: node.x(),
                              y: node.y(),
                              rotation: node.rotation(),
                              scaleX: node.scaleX(),
                              scaleY: node.scaleY(),
                            });
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
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
