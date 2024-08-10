"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface Sticker {
  id: string;
  name: string;
  imageUrl: string;
}

interface StickerTabProps {
  onAddSticker: (sticker: Sticker) => void;
}

const StickerTab: React.FC<StickerTabProps> = ({ onAddSticker }) => {
  const [stickers, setStickers] = useState<Sticker[]>([]);

  useEffect(() => {
    const fetchStickers = async () => {
      const stickersCollection = collection(db, 'stickers');
      const stickersSnapshot = await getDocs(stickersCollection);
      const stickersList = stickersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Sticker));
      setStickers(stickersList);
    };

    fetchStickers();
  }, []);

  return (
    <ScrollArea className="h-[300px] w-full pr-4">
      <div className="grid grid-cols-3 gap-2">
        {stickers.map((sticker) => (
          <Button
            key={sticker.id}
            onClick={() => onAddSticker(sticker)}
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
  );
};
export default StickerTab