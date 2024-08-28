'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { DotLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";

import LectureContent from "@/components/LectureContent";
import YouTubeVideo from "@/components/YoutubeVideo";
import MultipleChoiceExercise from "@/components/MultipleChoiceExercise";
import FillInTheBlankExercise from "@/components/FillInTheBlankExercise";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { fetchLessonData, createLesson, updateTopicCompletion } from "@/lib/firestoreFunctions";
import { fetchTitle, fetchKeyPoints, fetchLectureContent, fetchYouTubeVideo, fetchMultipleChoiceExerciseData, fetchFillInTheBlankExerciseData } from "@/lib/api";

import { ChevronLeft, Download, BookOpen, Video, PenTool, CheckCircle } from "lucide-react";
import UFOPanda from "@/app/(main)/(home)/Animations/PandaInUFO.json";

export default function LecturePage({ params }) {
  const router = useRouter();
  const { lessonId, courseId } = params;
  const [lectureContent, setLectureContent] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [title, setTitle] = useState("");
  const [keyPoints, setKeypoints] = useState("");
  const [multipleChoiceExercises, setMultipleChoiceExercises] = useState([]);
  const [fillInTheBlankExercises, setFillInTheBlankExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [progress, setProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState({
    content: false,
    video: false,
    exercises: false,
  });

  const { user } = useUser();
  const userId = user?.id;

  const [category, level, selectedSubject, selectedTopic] = lessonId.split("_").map(decodeURIComponent);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const existingLesson = await fetchLessonData(courseId, selectedTopic, String(userId));
        if (existingLesson) {
          setTitle(existingLesson.title);
          setKeypoints(existingLesson.keyPoints);
          setLectureContent(existingLesson.lectureContent);
          setVideoId(existingLesson.videoId);
          setMultipleChoiceExercises(existingLesson.multipleChoiceExercises);
          setFillInTheBlankExercises(existingLesson.fillInTheBlankExercises);
          setIsCompleted(existingLesson.completed || false);
        } else {
          const [
            titleResponse,
            keyPointsResponse,
            lectureContentResponse,
            videoResponse,
            multipleChoiceResponse,
            fillInTheBlankResponse
          ] = await Promise.all([
            fetchTitle(selectedTopic),
            fetchKeyPoints(selectedTopic),
            fetchLectureContent(selectedTopic, level),
            fetchYouTubeVideo(selectedTopic, level),
            fetchMultipleChoiceExerciseData(selectedTopic),
            fetchFillInTheBlankExerciseData(selectedTopic)
          ]);

          setTitle(titleResponse);
          setKeypoints(keyPointsResponse);
          setLectureContent(lectureContentResponse);
          setVideoId(videoResponse);
          setMultipleChoiceExercises([multipleChoiceResponse]);
          setFillInTheBlankExercises([fillInTheBlankResponse]);

          const newLesson = {
            title: titleResponse,
            selectedTopic,
            lectureContent: lectureContentResponse,
            videoId: videoResponse,
            keyPoints: keyPointsResponse,
            multipleChoiceExercises: [multipleChoiceResponse],
            fillInTheBlankExercises: [fillInTheBlankResponse],
            completed: false
          };

          await createLesson(courseId, newLesson, String(userId));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, courseId, selectedTopic, level, userId]);

  useEffect(() => {
    const completedCount = Object.values(completedSections).filter(Boolean).length;
    setProgress((completedCount / 3) * 100);
  }, [completedSections]);

  const handleCompletionToggle = async () => {
    const newCompletionStatus = !isCompleted;
    setIsCompleted(newCompletionStatus);
    await updateTopicCompletion(courseId, selectedTopic, String(userId), newCompletionStatus);
  };

  const generatePDF = async () => {
    try {
      const response = await fetch(`/api/generate-pdf?courseId=${courseId}&lessonId=${lessonId}`, {
        method: 'POST',
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${lessonId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error('Failed to generate PDF:', await response.text());
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  const markSectionComplete = (section) => {
    setCompletedSections((prev) => ({ ...prev, [section]: true }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <DotLoader color="#9570FF" size={60} />
      </div>
    );

  if (error)
    return (
      <div className="text-center flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );

  const TabButton = ({ value, icon, label }) => (
    <div className="hide">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setActiveTab(value)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === value
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-background text-muted-foreground hover:bg-secondary"
                }`}
            >
              {icon}
              <span>{label}</span>
              {completedSections[value] && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{completedSections[value] ? "Completed" : "Not completed"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center flex-col justify-center p-5 mt-10 text-black dark:text-white"
    >
      <Card className="w-full max-w-4xl mb-8">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">
                {title || `What Are ${selectedTopic}`}
              </CardTitle>
              <p className="mt-2 text-xl">
                {category} - {level}
              </p>
            </div>
            <Lottie animationData={UFOPanda} loop={true} className="w-24 h-24" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center space-x-4 mb-6">
            <TabButton
              value="content"
              icon={<BookOpen className="w-5 h-5" />}
              label="Content"
            />
            <TabButton
              value="video"
              icon={<Video className="w-5 h-5" />}
              label="Video"
            />
            <TabButton
              value="exercises"
              icon={<PenTool className="w-5 h-5" />}
              label="Exercises"
            />
          </div>
          <Progress value={progress} className="mb-4" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-6"
            >
              {activeTab === "content" && (
                <ScrollArea className="h-[60vh] content">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Key Points</h2>
                      <LectureContent content={keyPoints} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">What are {title}?</h2>
                      <LectureContent content={lectureContent} />
                    </div>
                    <Button
                      onClick={() => markSectionComplete("content")}
                      disabled={completedSections.content}
                      className="mt-4 hide"
                    >
                      {completedSections.content ? "Completed" : "Mark as Complete"}
                    </Button>
                  </div>
                </ScrollArea>
              )}
              {activeTab === "video" && (
                <div className="hide">
                  {videoId ? (
                    <YouTubeVideo
                      videoId={videoId}
                      className="w-full aspect-video rounded-lg"
                    />
                  ) : (
                    <p>No video found</p>
                  )}
                  <Button
                    onClick={() => markSectionComplete("video")}
                    disabled={completedSections.video}
                    className="mt-4"
                  >
                    {completedSections.video ? "Completed" : "Mark as Complete"}
                  </Button>
                </div>
              )}
              {activeTab === "exercises" && (
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-8 hide">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Multiple Choice Exercises</h2>
                      {multipleChoiceExercises.length > 0 ? (
                        multipleChoiceExercises.map((exercise, index) => (
                          <MultipleChoiceExercise
                            key={index}
                            question={exercise.question}
                            options={exercise.options}
                            correctOptionId={exercise.correctOptionId}
                            onAnswer={(isCorrect) => {
                              console.log(`Answer is ${isCorrect ? "correct" : "incorrect"}`)
                            }}
                          />
                        ))
                      ) : (
                        <p>No multiple-choice exercises found</p>
                      )}
                    </div>
                    <div className="hide">
                      <h2 className="text-2xl font-bold mb-4">Fill in the Blank Exercises</h2>
                      {fillInTheBlankExercises.length > 0 ? (
                        fillInTheBlankExercises.map((exercise, index) => (
                          <FillInTheBlankExercise
                            key={index}
                            question={exercise.question}
                            correctAnswer={exercise.correctAnswer}
                            onAnswer={(isCorrect) => {
                              console.log(`Answer is ${isCorrect ? "correct" : "incorrect"}`)
                            }}
                          />
                        ))
                      ) : (
                        <p>No fill in the blank exercises found</p>
                      )}
                    </div>
                    <Button
                      onClick={() => markSectionComplete("exercises")}
                      disabled={completedSections.exercises}
                      className="mt-4"
                    >
                      {completedSections.exercises ? "Completed" : "Mark as Complete"}
                    </Button>
                  </div>
                </ScrollArea>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between w-full max-w-4xl mb-8 hide">
        <div className="flex items-center space-x-4">
          <Checkbox
            id="lesson-completed"
            checked={isCompleted}
            onCheckedChange={handleCompletionToggle}
          />
          <label
            htmlFor="lesson-completed"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mark lesson as completed
          </label>
        </div>
        <div className="flex space-x-4">
          <Link href={`/courses/${courseId}`}>
            <Button variant="outline" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Course
            </Button>
          </Link>
          <Button onClick={generatePDF} className="bg-green-600 hover:bg-green-700 text-white flex items-center">
            <Download className="mr-2 h-4 w-4" /> Generate PDF
          </Button>
        </div>
      </div>
    </motion.section>
  );
}