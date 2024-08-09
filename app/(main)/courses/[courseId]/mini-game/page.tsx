"use client";

import { useEffect, useState } from "react";
import QuizGame from "@/components/MiniGame";
import { getQuizQuestions } from "@/lib/quiz";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const QuizPage = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, level, selectedSubject] = courseId
    .split("_")
    .map(decodeURIComponent);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const fetchedQuestions = await getQuizQuestions(selectedSubject, level);
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error("Error fetching quiz questions:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>
            Please wait while we prepare your quiz.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle>Quiz Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {selectedSubject
          .split("\n")
          .map((topic: string) => topic.replace(/[*-1234567890]/g, " ").trim())
          .filter((topic: string | any[]) => topic.length > 0)
          .sort()}{" "}
        Quiz
      </h1>
      <QuizGame questions={questions} />
    </div>
  );
};

export default QuizPage;
