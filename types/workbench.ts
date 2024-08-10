export interface CanvasElement {
  id: string;
  type: 'image' | 'text' | 'shape' | 'freehand';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  image?: HTMLImageElement;
  imageUrl?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  shapeType?: 'rectangle' | 'circle';
  points?: number[];
  align?: string;
}

export interface WorkbenchData {
  canvasElements: Omit<CanvasElement, 'image'>[];
  backgroundColor: string;
  canvasSize: { width: number; height: number };
}