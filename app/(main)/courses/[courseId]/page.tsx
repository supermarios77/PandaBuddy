"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fetchCourseData, createCourse } from "@/lib/firestoreFunctions";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Play, CheckCircle, ArrowRight } from "lucide-react";
import useSound from "use-sound";
import selectSound from "@/public/audio/pop.mp3";

interface Topic {
  name: string;
  completed: boolean;
  order: number;
}

export default function LessonPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { courseId } = params;
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [category, level, selectedSubject] = courseId
    .split("_")
    .map(decodeURIComponent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const userId = user?.id;
  const [play] = useSound(selectSound);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await fetchCourseData(courseId, String(userId));
        if (courseData) {
          const sortedTopics = courseData.topics
            .map((topic: Topic) => ({
              ...topic,
              order: parseInt(topic.name.split('.')[0], 10) || 0
            }))
            .sort((a: Topic, b: Topic) => a.order - b.order);
          setTopics(sortedTopics);
          setLoading(false);
        } else {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              body: `List some lessons for a full course on ${selectedSubject} at my level ${level} dont label with lesson and then lesson number just add number and then lesson title`,
            }),
          });
          const data = await response.json();
          const cleanedTopics = data.output
            .split("\n")
            .map((topic: string) => topic.replace(/[*-]/g, "").trim())
            .filter((topic: string | any[]) => topic.length > 0)
            .map((topic: string, index: number) => ({
              name: topic,
              completed: false,
              order: index + 1
            }));

          setTopics(cleanedTopics);

          const courseData = {
            title: selectedSubject,
            category,
            level,
            topics: cleanedTopics,
          };
          await createCourse(courseId, courseData, String(userId));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError("Failed to fetch course data");
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, level, category, selectedSubject, userId]);

  const handleTopicSelect = (selectedTopic: string) => {
    play();
    const lessonId =
      `${category}_${level}_${selectedSubject}_${selectedTopic}`.replace(
        /\s/g,
        "-"
      );
    router.push(`/courses/${courseId}/${encodeURIComponent(lessonId)}`);
  };

  const completedTopics = topics.filter(topic => topic.completed).length;
  const progress = (completedTopics / topics.length) * 100;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Skeleton className="h-8 sm:h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 sm:h-8 w-1/2 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(9)].map((_, index) => (
            <Card key={index} className="bg-card">
              <CardHeader className="p-3 sm:p-4">
                <Skeleton className="h-5 sm:h-6 w-3/4" />
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <Skeleton className="h-16 sm:h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-4 sm:mt-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8 sm:px-10 sm:py-12 backdrop-blur-sm bg-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center">
                <BookOpen className="w-8 h-8 mr-2" />
                {selectedSubject.split("\n")
                  .map((topic: string) => topic.replace(/[*-1234567890]/g, " ").trim())
                  .filter((topic: string | any[]) => topic.length > 0)}
              </h1>
              <p className="text-purple-100 text-sm sm:text-base max-w-md">
                {category} - {level}
              </p>
            </div>
            <Button
              variant="secondary"
              className="bg-white text-purple-700 hover:bg-gray-200"
              onClick={() => router.push(`/courses/${courseId}/mini-game`)}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Mini-Game
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full"
            >
              <Card
                className={`bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col ${topic.completed ? "border-green-500" : ""
                  }`}
                onClick={() => handleTopicSelect(topic.name)}
              >
                <CardHeader className="p-4 flex-grow">
                  <CardTitle className="text-lg flex items-start">
                    {topic.completed ? (
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-1" />
                    ) : (
                      <Sparkles className="w-5 h-5 mr-2 text-purple-500 flex-shrink-0 mt-1" />
                    )}
                    <span className="flex-grow">{topic.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 mt-auto">
                  <Badge variant="secondary" className="text-sm">
                    {topic.completed ? "Completed" : "Start lesson"}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}