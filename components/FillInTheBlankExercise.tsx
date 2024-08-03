"use client"
import React, { useState } from 'react';
import { validateAnswer } from '@/lib/api';

interface FillInTheBlankExerciseProps {
  question: string;
  correctAnswer: string;
  onAnswer: (isCorrect: boolean) => void;
}

const FillInTheBlankExercise: React.FC<FillInTheBlankExerciseProps> = ({ question, correctAnswer, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const handleCheckAnswer = async () => {
    const correct = await validateAnswer(userAnswer, correctAnswer);
    setIsCorrect(correct);
    onAnswer(correct);
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">{question}</h2>
      <div className="mt-2">
        <input
          type="text"
          value={userAnswer}
          onChange={handleInputChange}
          className="p-2 border rounded w-full"
        />
        <button onClick={handleCheckAnswer} className="mt-2 p-2 bg-blue-500 text-white rounded">
          Check Answer
        </button>
      </div>
      {isCorrect !== null && (
        <p className={`mt-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? 'Correct!' : 'Try again.'}
        </p>
      )}
    </div>
  );
};

export default FillInTheBlankExercise;