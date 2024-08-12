import { useState } from "react";
import { motion } from "framer-motion";
import { PauseCircle, PlayCircle } from "lucide-react";

interface PlayButtonProps {
  active: boolean;
  size: number;
  iconColor: string;
  idleBackgroundColor: string;
  activeBackgroundColor: string;
  play: () => void;
  stop: () => void;
}

export default function PlayButton({
  active,
  size,
  iconColor,
  idleBackgroundColor,
  activeBackgroundColor,
  play,
  stop,
}: PlayButtonProps) {
  return (
    <motion.button
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "none",
        padding: 0,
        backgroundColor: active ? activeBackgroundColor : idleBackgroundColor,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={active ? stop : play}
    >
      <motion.div
        style={{
          width: size * 0.4,
          height: size * 0.4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {active ? <PauseCircle /> : <PlayCircle />}
      </motion.div>
    </motion.button>
  );
}
