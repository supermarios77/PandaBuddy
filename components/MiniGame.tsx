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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import {
  HeartIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { TrophyIcon } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

import { db } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { useUser } from "@clerk/nextjs";

import congratsSound from "@/public/audio/congrats.mp3";
import gameover from "@/public/audio/game-over.mp3";
import correct from "@/public/audio/correct.mp3";
import wrong from "@/public/audio/wrong.mp3";

import congrats from "@/public/Congrats.json";
import failed from "@/public/Failed.json";

import useSound from "use-sound";

interface Question {
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

interface QuizGameProps {
  questions: Question[];
}

export default function QuizGame({ questions }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const { user } = useUser();
  const [play] = useSound(congratsSound);
  const [playGameOver] = useSound(gameover);
  const [playCorrect] = useSound(correct);
  const [playWrong] = useSound(wrong);

  useEffect(() => {
    setProgress((currentQuestion / questions.length) * 100);
  }, [currentQuestion, questions.length]);

  const handleAnswer = () => {
    const isCorrect =
      selectedAnswer === questions[currentQuestion].correctOptionId;
    setFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setScore(score + 10);
      playCorrect();
    } else {
      setHearts(hearts - 1);
      playWrong();
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestion + 1 < questions.length && hearts > 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setGameOver(true);
        saveScoreToFirebase();
      }
    }, 1500);
  };

  const saveScoreToFirebase = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const userPointsDoc = doc(db, "userPoints", String(user.id));

      const docSnap = await getDoc(userPointsDoc);
      let currentPoints = docSnap.exists() ? docSnap.data().points || 0 : 0;

      const newTotalPoints = currentPoints + score;

      await setDoc(userPointsDoc, {
        points: newTotalPoints,
      });
      console.log("Score saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setHearts(5);
    setGameOver(false);
    setProgress(0);
    setFeedback(null);
  };

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
        <CardHeader>
          <CardTitle>Quiz Error</CardTitle>
          <CardDescription className="text-purple-200">
            Failed to load quiz questions. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (hearts === 0) {
    playGameOver();
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg overflow-hidden">
          <CardHeader className="text-center">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Lottie
                animationData={failed}
                loop={false}
                className="m-0 mb-6"
              />
            </motion.div>
            <CardTitle className="text-3xl sm:text-4xl font-bold mt-4">
              Game Over!
            </CardTitle>
            <CardDescription className="text-xl text-purple-200">
              You Failed.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  if (gameOver) {
    play();
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg overflow-hidden">
          <CardHeader className="text-center">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Lottie animationData={congrats} loop={false} className="m-0" />
            </motion.div>
            <CardTitle className="text-3xl sm:text-4xl font-bold mt-4">
              Quiz Complete!
            </CardTitle>
            <CardDescription className="text-xl text-purple-200">
              Your final score is:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.p
              className="text-6xl sm:text-7xl font-bold text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {score} points
            </motion.p>
            <p className="text-center mt-4 text-lg">
              You answered {currentQuestion + 1} questions
            </p>
            {isSaving && (
              <p className="text-center mt-2 text-sm text-purple-200">
                Saving your score...
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={resetGame}
              className="w-full bg-white text-purple-600 hover:bg-purple-100 text-lg py-6"
            >
              Play Again
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={currentQuestion}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-xl sm:text-2xl">
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <TrophyIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-bold">{score}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex">
              {[...Array(hearts)].map((_, i) => (
                <HeartIcon
                  key={i}
                  className="text-red-500 w-5 h-5 drop-shadow"
                />
              ))}
            </div>
            <div className="text-sm text-purple-200">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress value={progress} className="w-full h-2 bg-purple-300" />
          <CardDescription className="mt-4 text-base sm:text-lg text-purple-100">
            {questions[currentQuestion].question}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            key={currentQuestion}
            onValueChange={setSelectedAnswer}
            value={selectedAnswer || undefined}
            className="space-y-2"
          >
            {questions[currentQuestion].options.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Label
                  htmlFor={option.id}
                  className="flex items-center space-x-2 p-3 rounded-lg bg-white bg-opacity-20 cursor-pointer hover:bg-opacity-30 transition-all"
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="text-purple-600"
                  />
                  <span className="text-white text-sm sm:text-base">
                    {option.text}
                  </span>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Button
            onClick={handleAnswer}
            disabled={!selectedAnswer}
            className="w-full bg-white text-purple-600 hover:bg-purple-100 mb-4 py-6 text-lg"
          >
            {currentQuestion + 1 === questions.length ? "Finish" : "Next"}
          </Button>
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`text-lg font-bold flex items-center ${
                  feedback === "correct" ? "text-green-400" : "text-red-400"
                }`}
              >
                {feedback === "correct" ? (
                  <>
                    <CheckCircledIcon className="mr-2" />
                    Correct!
                  </>
                ) : (
                  <>
                    <CrossCircledIcon className="mr-2" />
                    Incorrect
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
