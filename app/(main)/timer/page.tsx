"use client";
import Lottie from "lottie-react";
import { useState, useEffect, useRef } from "react";
import animationData from "./FocusPanda.json";
import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon, ListRestart } from "lucide-react";
import successAnimation from "./TimerComplete.json";

import audio from "@/public/audio/timer-bgm.mp3";

const motivationalMessages = [
  "Great job! Keep up the good work!",
  "You’re doing fantastic!",
  "Almost there, keep going!",
  "You’ve got this!",
  "Keep pushing forward!",
  "Awesome progress!",
  "Way to go! You're making great strides!",
];

const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
};

const PomodoroTimer = () => {
  const [secondsLeft, setSecondsLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isSuccessAnimation, setIsSuccessAnimation] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      setShowAnimation(true);
      setIsSuccessAnimation(true);
      setMotivationalMessage("");
    }
    return () => clearTimeout(timer);
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    let messageInterval: NodeJS.Timeout;
    if (isRunning && !showAnimation) {
      setMotivationalMessage(getRandomMessage());
      messageInterval = setInterval(() => {
        setMotivationalMessage(getRandomMessage());
      }, 30000);
    }
    return () => clearInterval(messageInterval);
  }, [isRunning, showAnimation]);

  useEffect(() => {
    if (isRunning && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(1500);
    setShowAnimation(false);
    setIsSuccessAnimation(false);
    setMotivationalMessage(getRandomMessage());
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mt-12 mb-5">Pomodoro Timer ⏰</h1>
      <div className="mb-8 mt-5 w-[300px]">
        {showAnimation ? (
          <Lottie animationData={successAnimation} loop={false} />
        ) : (
          <Lottie animationData={animationData} loop={true} />
        )}
      </div>
      {secondsLeft === 0 && isSuccessAnimation ? (
        <div className="text-3xl font-bold mb-4">Well Done!</div>
      ) : (
        <div className="text-6xl font-bold mb-4">
          {Math.floor(secondsLeft / 60)
            .toString()
            .padStart(2, "0")}
          :{(secondsLeft % 60).toString().padStart(2, "0")}
        </div>
      )}
      {!showAnimation && motivationalMessage && (
        <div className="text-xl font-semibold mb-4">{motivationalMessage}</div>
      )}
      <div className="flex flex-row gap-3">
        <Button onClick={toggleTimer} className="btn">
          {isRunning ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <Button onClick={resetTimer}>
          <ListRestart />
        </Button>
      </div>
      <audio ref={audioRef} src={audio} loop preload="auto" />
    </div>
  );
};

export default PomodoroTimer;
