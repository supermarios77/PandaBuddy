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
      return "Great job! You've earned enough points to unlock a reward!";
    return `Keep going! You have ${userPoints} points. Earn ${
      10 - userPoints
    } more to unlock a reward!`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-100 to-white rounded-3xl shadow-lg max-w-md mx-auto"
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
            className="absolute -top-4 -right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            {userPoints} points
          </motion.div>
        )}
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Hey, {user.username}</h2>
      <p className="text-lg text-gray-600 text-center mb-6">{getMessage()}</p>
      <Link href={userPoints && userPoints >= 10 ? "/shop" : "/courses"}>
        <Button className="bg-[#FF7878] text-white hover:bg-[#fc5c5c] transform hover:scale-105 transition-all duration-200 text-lg px-8 py-3 rounded-full shadow-md">
          {userPoints && userPoints >= 10 ? "Buy Stickers" : "Start Studying"}
        </Button>
      </Link>
    </motion.div>
  );
}
