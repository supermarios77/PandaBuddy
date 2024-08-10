
import React, { useRef, useEffect } from 'react';
import { Image as KonvaImage, Text, Circle, Rect, Line, Transformer } from 'react-konva';
import { CanvasElement } from '@/types/workbench';

interface CanvasElementsProps {
  elements: CanvasElement[];
  selectedId: string | null;
  tool: string;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
}

const CanvasElements: React.FC<CanvasElementsProps> = ({
  elements,
  selectedId,
  tool,
  onSelect,
  onUpdate,
}) => {
  const transformerRef = useRef<any>(null);

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const node = transformerRef.current.getStage().findOne(`#${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  const handleDragStart = (e: any) => {
    const id = e.target.id();
    onSelect(id);
  };

  const handleDragEnd = (e: any) => {
    const id = e.target.id();
    onUpdate(id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: any) => {
    const node = e.target;
    const id = node.id();
    onUpdate(id, {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    });
  };

  return (
    <>
      {elements.map((element) => {
        const commonProps = {
          id: element.id,
          x: element.x,
          y: element.y,
          rotation: element.rotation,
          scaleX: element.scaleX,
          scaleY: element.scaleY,
          opacity: element.opacity,
          draggable: tool === 'select',
          onClick: () => onSelect(element.id),
          onTap: () => onSelect(element.id),
          onDragStart: handleDragStart,
          onDragEnd: handleDragEnd,
          onTransformEnd: handleTransformEnd,
        };

        switch (element.type) {
          case 'image':
            return (
              <KonvaImage
                key={element.id}
                {...commonProps}
                image={element.image}
                width={element.width}
                height={element.height}
              />
            );
          case 'text':
            return (
              <Text
                key={element.id}
                {...commonProps}
                text={element.text}
                fontSize={element.fontSize}
                fontFamily={element.fontFamily}
                fill={element.fill}
                align={element.align || 'left'}
              />
            );
          case 'shape':
            const ShapeComponent = element.shapeType === 'circle' ? Circle : Rect;
            return (
              <ShapeComponent
                key={element.id}
                {...commonProps}
                width={element.width}
                height={element.height}
                fill={element.fill}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
              />
            );
          case 'freehand':
            return (
              <Line
                key={element.id}
                {...commonProps}
                points={element.points}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            );
          default:
            return null;
        }
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
    </>
  );
};

export default CanvasElements;