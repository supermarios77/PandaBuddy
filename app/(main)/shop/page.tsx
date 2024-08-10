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
import { Sparkles } from "lucide-react";

interface Sticker {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function StickerShop() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [loadingPurchase, setLoadingPurchase] = useState<string | null>(null);
  const [userStickers, setUserStickers] = useState<Set<string>>(new Set());
  const { user } = useUser();

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

  const handlePurchase = async (sticker: Sticker) => {
    if (userPoints !== null && userPoints >= sticker.price && user) {
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
      } catch (error) {
        setError("Error purchasing sticker");
        console.error("Error purchasing sticker:", error);
      } finally {
        setLoadingPurchase(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
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
              <Badge
                variant="secondary"
                className="text-xl py-2 px-4 mb-2 bg-white/20 text-white"
              >
                Your Points: {userPoints !== null ? userPoints : "Loading..."}
              </Badge>
              <p className="text-purple-100 text-xs">
                Earn more points to unlock special stickers!
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="text-center"
          >
            <Alert variant="default">
              <AlertDescription>{feedbackMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stickers.map((sticker) => (
          <Card
            key={sticker.id}
            className="bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{sticker.name}</CardTitle>
              <CardDescription>{sticker.price} Points</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Image
                src={sticker.imageUrl}
                alt={sticker.name}
                width={150}
                height={150}
                className="rounded-lg mx-auto hover:scale-105 transition-transform duration-300"
              />
            </CardContent>
            <CardFooter className="p-4">
              <Button
                onClick={() => handlePurchase(sticker)}
                disabled={
                  userPoints === null ||
                  userPoints < sticker.price ||
                  loadingPurchase === sticker.id ||
                  userStickers.has(sticker.id)
                }
                className="w-full"
              >
                {userStickers.has(sticker.id)
                  ? "Purchased"
                  : loadingPurchase === sticker.id
                  ? "Processing..."
                  : "Buy Sticker"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
