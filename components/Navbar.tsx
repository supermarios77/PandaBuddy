"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import React, { useState, useCallback } from "react";
import ThemeSwitch from "./ThemeSwitch";
import useSound from "use-sound";
import PlayButton from "./PlayButton";
import soundUrl from "@/public/audio/bgm.mp3";
import Link from "next/link";

const Navbar = () => {
  const { user } = useUser();
  const [isPlaying, setIsPlaying] = useState(false);

  const [play, { stop }] = useSound(soundUrl, {
    onplay: () => setIsPlaying(true),
    onend: () => setIsPlaying(false),
    onstop: () => setIsPlaying(false),
  });

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }, [isPlaying, play, stop]);

  return (
    <header className="flex items-center justify-between w-full pt-5 lg:pr-[500px] lg:pl-[500px] bg-white dark:bg-black pr-5 pl-5">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <h1 className="text-xl font-semibold">
            Hello, <span className="font-bold">{user?.username}</span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeSwitch />
        <PlayButton
          active={isPlaying}
          size={60}
          iconColor="var(--color-background)"
          idleBackgroundColor="var(--color-text)"
          activeBackgroundColor="var(--color-primary)"
          play={handlePlayPause}
          stop={handlePlayPause}
        />
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
