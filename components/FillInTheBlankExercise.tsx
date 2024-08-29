"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateAnswer } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface FillInTheBlankExerciseProps {
  question: string;
  correctAnswer: string;
  onAnswer: (isCorrect: boolean) => void;
}

const FillInTheBlankExercise: React.FC<FillInTheBlankExerciseProps> = ({ question, correctAnswer, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
    setIsCorrect(null);
  };

  const handleCheckAnswer = async () => {
    const correct = await validateAnswer(userAnswer, correctAnswer);
    setIsCorrect(correct);
    onAnswer(correct);
  };

  const handleHint = () => {
    setShowHint(true);
  };

  const feedbackVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <Card className="w-full mb-6 shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardTitle className="text-xl font-bold">{question}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <Input
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            placeholder="Type your answer here..."
            className="w-full text-base sm:text-lg"
          />
          <div className="flex space-x-2">
            <Button onClick={handleCheckAnswer} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Check Answer
            </Button>
            <Button onClick={handleHint} variant="outline" className="w-1/3">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Hint
            </Button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {isCorrect !== null && (
            <motion.div
              key={isCorrect ? 'correct' : 'incorrect'}
              variants={feedbackVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-4 p-3 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: isCorrect ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
              }}
            >
              {isCorrect ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  <span className="text-base sm:text-lg font-semibold">Correct! Great job!</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  <span className="text-base sm:text-lg font-semibold">Oops! Try again.</span>
                </div>
              )}
            </motion.div>
          )}
          {showHint && (
            <motion.div
              key="hint"
              variants={feedbackVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-4 p-3 bg-yellow-100 rounded-lg"
            >
              <p className="text-yellow-800 text-sm sm:text-base">
                <strong>Hint:</strong> The answer starts with "{correctAnswer[0]}" and has {correctAnswer.length} letters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default FillInTheBlankExercise;