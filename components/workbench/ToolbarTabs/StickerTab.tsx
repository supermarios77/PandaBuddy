"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';

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
  const { user } = useUser();

  useEffect(() => {
    const fetchStickers = async () => {
      if (!user) return;

      const userStickerDocRef = doc(db, "userStickers", user.id);
      const userStickerDoc = await getDoc(userStickerDocRef);

      if (userStickerDoc.exists()) {
        const stickerIds = userStickerDoc.data().stickers || [];

        const stickerPromises = stickerIds.map(async (stickerId: string) => {
          const stickerDocRef = doc(db, "stickers", stickerId);
          const stickerDoc = await getDoc(stickerDocRef);
          return stickerDoc.exists() ? { id: stickerDoc.id, ...stickerDoc.data() } as Sticker : null;
        });

        const stickerData = await Promise.all(stickerPromises);
        setStickers(stickerData.filter(sticker => sticker !== null) as Sticker[]);
      }
    };

    fetchStickers();
  }, [user]);

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

export default StickerTab;