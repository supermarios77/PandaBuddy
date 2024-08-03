// components/MultipleChoiceExercise.tsx

import React from 'react';

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

  const handleOptionClick = (id: string) => {
    setSelectedOption(id);
    const correct = id === correctOptionId;
    setIsCorrect(correct);
    onAnswer(correct);
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">{question}</h2>
      <div className="mt-2">
        {options.map(option => (
          <button
            key={option.id}
            className={`block p-2 mt-2 w-full text-left border rounded ${
              selectedOption === option.id
                ? isCorrect
                  ? 'bg-green-500'
                  : 'bg-red-500'
                : ''
            }`}
            onClick={() => handleOptionClick(option.id)}
          >
            {option.text}
          </button>
        ))}
      </div>
      {selectedOption && (
        <p className={`mt-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? 'Correct!' : 'Try again.'}
        </p>
      )}
    </div>
  );
};

export default MultipleChoiceExercise;
