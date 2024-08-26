'use client'

import Lottie from "lottie-react"
import { useState, useEffect, useRef } from "react"
import animationData from "./FocusPanda.json"
import { Button } from "@/components/ui/button"
import { PauseIcon, PlayIcon, ListRestart, VolumeX, Volume2 } from "lucide-react"
import successAnimation from "./TimerComplete.json"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

import audio from "@/public/audio/timer-bgm.mp3"

const motivationalMessages = [
  "Great job! Keep up the good work!",
  "You're doing fantastic!",
  "Almost there, keep going!",
  "You've got this!",
  "Keep pushing forward!",
  "Awesome progress!",
  "Way to go! You're making great strides!",
]

const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
  return motivationalMessages[randomIndex]
}

export default function Component() {
  const [secondsLeft, setSecondsLeft] = useState(1500)
  const [isRunning, setIsRunning] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [isSuccessAnimation, setIsSuccessAnimation] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [timerDuration, setTimerDuration] = useState(25)
  const [showMotivationalMessages, setShowMotivationalMessages] = useState(true)

  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning && secondsLeft > 0) {
      timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000)
    } else if (secondsLeft === 0) {
      setIsRunning(false)
      setShowAnimation(true)
      setIsSuccessAnimation(true)
      setMotivationalMessage("")
      toast({
        title: "Pomodoro Complete!",
        description: "Great job! Take a short break before starting your next session.",
        duration: 5000,
      })
    }
    return () => clearTimeout(timer)
  }, [isRunning, secondsLeft, toast])

  useEffect(() => {
    let messageInterval: NodeJS.Timeout
    if (isRunning && !showAnimation && showMotivationalMessages) {
      setMotivationalMessage(getRandomMessage())
      messageInterval = setInterval(() => {
        setMotivationalMessage(getRandomMessage())
      }, 30000)
    }
    return () => clearInterval(messageInterval)
  }, [isRunning, showAnimation, showMotivationalMessages])

  useEffect(() => {
    if (isRunning && audioRef.current) {
      audioRef.current.play()
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [isRunning])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setSecondsLeft(timerDuration * 60)
    setShowAnimation(false)
    setIsSuccessAnimation(false)
    setMotivationalMessage(getRandomMessage())
  }

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0]
    setTimerDuration(newDuration)
    setSecondsLeft(newDuration * 60)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-purple-800 dark:text-purple-300">Pomodoro Timer ⏰</h1>
      <motion.div
        className="mb-8 w-[300px] bg-card rounded-2xl shadow-xl p-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <AnimatePresence mode="wait">
          {showAnimation ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Lottie animationData={successAnimation} loop={false} />
            </motion.div>
          ) : (
            <motion.div
              key="focus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Lottie animationData={animationData} loop={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence mode="wait">
        {secondsLeft === 0 && isSuccessAnimation ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-4xl font-bold mb-4 text-green-600 dark:text-green-400"
          >
            Well Done!
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-7xl font-bold mb-4 text-purple-700 dark:text-purple-300"
          >
            {Math.floor(secondsLeft / 60)
              .toString()
              .padStart(2, "0")}
            :{(secondsLeft % 60).toString().padStart(2, "0")}
          </motion.div>
        )}
      </AnimatePresence>
      {!showAnimation && motivationalMessage && showMotivationalMessages && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400"
        >
          {motivationalMessage}
        </motion.div>
      )}
      <div className="flex flex-row gap-3 mb-8">
        <Button
          onClick={toggleTimer}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          size="lg"
        >
          {isRunning ? <PauseIcon className="mr-2" /> : <PlayIcon className="mr-2" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer} variant="outline" size="lg">
          <ListRestart className="mr-2" />
          Reset
        </Button>
        <Button onClick={() => setIsMuted(!isMuted)} variant="ghost" size="lg">
          {isMuted ? <VolumeX /> : <Volume2 />}
        </Button>
      </div>
      <div className="w-full max-w-md mb-8">
        <Label htmlFor="timer-duration" className="text-lg font-semibold mb-2 block">
          Timer Duration: {timerDuration} minutes
        </Label>
        <Slider
          id="timer-duration"
          min={1}
          max={60}
          step={1}
          value={[timerDuration]}
          onValueChange={handleDurationChange}
          className="mb-4"
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="show-messages"
            checked={showMotivationalMessages}
            onCheckedChange={setShowMotivationalMessages}
          />
          <Label htmlFor="show-messages">Show Motivational Messages</Label>
        </div>
      </div>
      <audio ref={audioRef} src={audio} loop preload="auto" />
    </motion.div>
  )
}