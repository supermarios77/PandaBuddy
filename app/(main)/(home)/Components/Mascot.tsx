"use client";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import pandaAnimation from "../Animations/PandaStudying.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Sparkles } from "lucide-react";

export default function MascotPage() {
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "userPoints", user.id));
        if (userDoc.exists()) {
          setUserPoints(userDoc.data().points || 0);
        }
      }
    };

    fetchUserPoints();
  }, [user, db]);

  const getMessage = () => {
    if (userPoints === null) return "Loading...";
    if (userPoints >= 10)
      return "Great job! You've earned enough points to buy a sticker";
    return `Keep going! You have ${userPoints} points. Earn ${
      10 - userPoints
    } more to buy a sticker`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 rounded-3xl shadow-lg max-w-sm mx-auto overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.7) 0%, rgba(79, 70, 229, 0.7) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="relative w-64 h-64 mb-6">
        <Lottie
          animationData={pandaAnimation}
          loop={true}
          className="w-full h-full"
        />
        {userPoints !== null && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="absolute -top-4 -right-4 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            {userPoints} points
          </motion.div>
        )}
      </div>
      <h2 className="text-4xl font-bold text-white mb-3">Hey, {user.username}</h2>
      <p className="text-lg font-bold text-white mb-3 text-center">{getMessage()}</p>
      <Link href={userPoints && userPoints >= 10 ? "/shop" : "/courses"}>
      <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 text-lg px-8 py-3 rounded-full shadow-md flex items-center">
          {userPoints && userPoints >= 10 ? (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Buy Stickers
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Start Studying
            </>
          )}
        </Button>
      </Link>
    </motion.div>
  );
}
