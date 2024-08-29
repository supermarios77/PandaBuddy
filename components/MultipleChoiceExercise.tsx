"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from 'lucide-react';

interface Option {
  id: string;
  text: string;
}

interface MultipleChoiceExerciseProps {
  question: string;
  options: Option[];
  correctOptionId: string;
  onAnswer: (isCorrect: boolean) => void;
}

const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  question,
  options,
  correctOptionId,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);

  const handleOptionClick = (id: string) => {
    setSelectedOption(id);
    const correct = id === correctOptionId;
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct);
  };

  const optionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const feedbackVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <Card className="w-full mb-6 shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardTitle className="text-xl font-bold">{question}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid gap-3 sm:gap-4">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              variants={optionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant={selectedOption === option.id ? (isCorrect ? "default" : "destructive") : "outline"}
                className={`w-full justify-start text-left h-auto py-3 px-4 ${
                  selectedOption && selectedOption !== option.id ? 'opacity-50' : ''
                }`}
                onClick={() => handleOptionClick(option.id)}
                disabled={!!selectedOption}
              >
                <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                {option.text}
              </Button>
            </motion.div>
          ))}
        </div>
        {showFeedback && (
          <motion.div
            className="mt-4 sm:mt-6 text-center"
            variants={feedbackVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {isCorrect ? (
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className="text-base sm:text-lg font-semibold">Correct! Great job!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center text-red-600">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className="text-base sm:text-lg font-semibold">Oops! Correct answer was {correctOptionId.toUpperCase()}</span>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceExercise;