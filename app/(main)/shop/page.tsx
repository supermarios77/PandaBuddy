"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import { Sparkles, X, Check } from "lucide-react";
import buy from "@/public/audio/buy.mp3";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Sticker {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
}

interface StickerPack {
  name: string;
  stickers: Sticker[];
  price: number;
  thumbnailUrl: string;
}

export default function StickerShop() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [stickerPacks, setStickerPacks] = useState<StickerPack[]>([]);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [loadingPurchase, setLoadingPurchase] = useState<string | null>(null);
  const [userStickers, setUserStickers] = useState<Set<string>>(new Set());
  const { user } = useUser();
  const [play] = useSound(buy);
  const [selectedPack, setSelectedPack] = useState<StickerPack | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const [stickersSnapshot, userPointsDoc, userStickerDoc] =
            await Promise.all([
              getDocs(collection(db, "stickers")),
              getDoc(doc(db, "userPoints", user.id)),
              getDoc(doc(db, "userStickers", user.id)),
            ]);

          const stickersList = stickersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Sticker),
          }));

          setStickers(stickersList);

          if (userPointsDoc.exists()) {
            setUserPoints(userPointsDoc.data().points);
          } else {
            setUserPoints(0);
          }

          if (userStickerDoc.exists()) {
            setUserStickers(new Set(userStickerDoc.data().stickers || []));
          }

          const packs = groupStickersIntoPacks(stickersList);
          setStickerPacks(packs);
        } catch (error) {
          setError("Failed to fetch data");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const groupStickersIntoPacks = (stickers: Sticker[]): StickerPack[] => {
    const packsMap = new Map<string, Sticker[]>();

    stickers.forEach((sticker) => {
      if (sticker.category) {
        if (!packsMap.has(sticker.category)) {
          packsMap.set(sticker.category, []);
        }
        packsMap.get(sticker.category)?.push(sticker);
      }
    });

    return Array.from(packsMap.entries()).map(([category, stickers]) => ({
      name: category,
      stickers,
      price: calculatePackPrice(stickers),
      thumbnailUrl: stickers.slice(0, 4).map((sticker) => sticker.imageUrl)[0],
    }));
  };

  const calculatePackPrice = (stickers: Sticker[]) => {
    const total = stickers.reduce((sum, sticker) => sum + sticker.price, 0);
    return Math.round(total * 0.8);
  };

  const handlePurchase = async (sticker: Sticker) => {
    if (userPoints !== null && userPoints >= sticker.price && user && !userStickers.has(sticker.id)) {
      setLoadingPurchase(sticker.id);
      try {
        const userStickerDoc = doc(db, "userStickers", user.id);
        const userStickerSnap = await getDoc(userStickerDoc);

        const userStickerData = userStickerSnap.exists()
          ? userStickerSnap.data().stickers || []
          : [];
        if (!userStickerData.includes(sticker.id)) {
          userStickerData.push(sticker.id);
        }

        await setDoc(
          userStickerDoc,
          { stickers: userStickerData },
          { merge: true }
        );

        const newPoints = userPoints - sticker.price;
        await setDoc(
          doc(db, "userPoints", user.id),
          { points: newPoints },
          { merge: true }
        );

        setUserPoints(newPoints);
        setUserStickers(new Set([...userStickers, sticker.id]));
        setFeedbackMessage("Sticker purchased successfully!");
        play();
      } catch (error) {
        setError("Error purchasing sticker");
        console.error("Error purchasing sticker:", error);
      } finally {
        setLoadingPurchase(null);
      }
    }
  };

  const handlePackPurchase = async (pack: StickerPack) => {
    const newStickers = pack.stickers.filter(sticker => !userStickers.has(sticker.id));
    const packPrice = calculatePackPrice(newStickers);

    if (userPoints !== null && userPoints >= packPrice && user && newStickers.length > 0) {
      setLoadingPurchase(pack.name);
      try {
        const userStickerDoc = doc(db, "userStickers", user.id);
        const userStickerSnap = await getDoc(userStickerDoc);

        const userStickerData = userStickerSnap.exists()
          ? userStickerSnap.data().stickers || []
          : [];

        newStickers.forEach((sticker) => {
          if (!userStickerData.includes(sticker.id)) {
            userStickerData.push(sticker.id);
          }
        });

        await setDoc(
          userStickerDoc,
          { stickers: userStickerData },
          { merge: true }
        );

        const newPoints = userPoints - packPrice;
        await setDoc(
          doc(db, "userPoints", user.id),
          { points: newPoints },
          { merge: true }
        );

        setUserPoints(newPoints);
        setUserStickers(new Set([...userStickers, ...newStickers.map((sticker) => sticker.id)]));
        setFeedbackMessage(`${newStickers.length} new stickers purchased successfully!`);
        play();
      } catch (error) {
        setError("Error purchasing sticker pack");
        console.error("Error purchasing sticker pack:", error);
      } finally {
        setLoadingPurchase(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="bg-card">
              <CardHeader className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-40 w-full" />
              </CardContent>
              <CardFooter className="p-4">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8 sm:px-10 sm:py-12 backdrop-blur-sm bg-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center">
                <Sparkles className="w-8 h-8 mr-2" />
                Sticker Shop
              </h1>
              <p className="text-purple-100 text-sm sm:text-base max-w-md">
                Collect unique stickers and decorate your digital space!
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Points: {userPoints}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {stickerPacks.map((pack) => {
            const newStickersCount = pack.stickers.filter(sticker => !userStickers.has(sticker.id)).length;
            const packPrice = calculatePackPrice(pack.stickers.filter(sticker => !userStickers.has(sticker.id)));
            return (
              <motion.div
                key={pack.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-card h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-4 space-y-2">
                    <CardTitle className="text-xl">{pack.name} Pack</CardTitle>
                    <CardDescription>
                      {newStickersCount} New Stickers - {packPrice} Points
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <div className="grid grid-cols-2 gap-2 aspect-square">
                      {pack.stickers.slice(0, 4).map((sticker) => (
                        <div key={sticker.id} className="relative aspect-square">
                          <Image
                            src={sticker.imageUrl}
                            alt={sticker.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                          {userStickers.has(sticker.id) && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                              <Check className="text-white w-8 h-8" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedPack(pack)}>
                          View Stickers
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{pack.name} Pack</DialogTitle>
                          <DialogDescription>
                            {newStickersCount} New Stickers - {packPrice} Points
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[300px] w-full p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {pack.stickers.map((sticker) => (
                              <div key={sticker.id} className="text-center">
                                <div className="relative aspect-square mb-2">
                                  <Image
                                    src={sticker.imageUrl}
                                    alt={sticker.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                  />
                                  {userStickers.has(sticker.id) && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                                      <Check className="text-white w-8 h-8" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm font-medium mb-1">{sticker.name}</p>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full"
                                          disabled={loadingPurchase === sticker.id || userPoints < sticker.price || userStickers.has(sticker.id)}
                                          onClick={() => handlePurchase(sticker)}
                                        >
                                          {userStickers.has(sticker.id) ? "Owned" : 
                                            loadingPurchase === sticker.id ? "Buying..." : `${sticker.price} pts`}
                                        </Button>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {userStickers.has(sticker.id) ? "You already own this sticker" : 
                                        userPoints < sticker.price ? "Not enough points" : "Click to purchase"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Button
                              variant="default"
                              disabled={loadingPurchase === pack.name || userPoints < packPrice || newStickersCount === 0}
                              onClick={() => handlePackPurchase(pack)}
                            >
                              {loadingPurchase === pack.name ? "Purchasing..." : 
                                newStickersCount === 0 ? "Owned" : "Buy Pack"}
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {newStickersCount === 0 ? "You own all stickers in this pack" : 
                            userPoints < packPrice ? "Not enough points" : "Click to purchase new stickers"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}

          {stickers.map(
            (sticker) =>
              !sticker.category && (
                <motion.div
                  key={sticker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-card h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="p-4 space-y-2">
                      <CardTitle className="text-xl">{sticker.name}</CardTitle>
                      <CardDescription>{sticker.price} Points</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow flex items-center justify-center">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={sticker.imageUrl}
                          alt={sticker.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                        {userStickers.has(sticker.id) && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                            <Check className="text-white w-12 h-12" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-full">
                              <Button
                                variant="default"
                                className="w-full"
                                disabled={loadingPurchase === sticker.id || userPoints < sticker.price || userStickers.has(sticker.id)}
                                onClick={() => handlePurchase(sticker)}
                              >
                                {userStickers.has(sticker.id) ? "Owned" : 
                                  loadingPurchase === sticker.id ? "Purchasing..." : "Buy Sticker"}
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {userStickers.has(sticker.id) ? "You already own this sticker" : 
                              userPoints < sticker.price ? "Not enough points" : "Click to purchase"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {feedbackMessage && (
        <Alert variant="default" className="bg-green-500 border-green-600">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{feedbackMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}