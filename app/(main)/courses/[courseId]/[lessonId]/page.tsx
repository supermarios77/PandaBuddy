'use client'

import React, { useState, useEffect } from "react"
import LectureContent from "@/components/LectureContent"
import {
  fetchLectureContent,
  fetchYouTubeVideo,
  fetchTitle,
  fetchKeyPoints,
  fetchMultipleChoiceExerciseData,
  fetchFillInTheBlankExerciseData,
} from "@/lib/api"
import YouTubeVideo from "@/components/YoutubeVideo"
import UFOPanda from "@/app/(main)/(home)/Animations/PandaInUFO.json"
import Lottie from "lottie-react"
import MultipleChoiceExercise from "@/components/MultipleChoiceExercise"
import FillInTheBlankExercise from "@/components/FillInTheBlankExercise"
import { useRouter } from "next/navigation"
import { fetchLessonData, createLesson, updateLessonCompletion } from "@/lib/firestoreFunctions"
import { useUser } from "@clerk/nextjs"
import { DotLoader } from "react-spinners"
import { postRequest } from "@/utils/api"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Component({ params }: { params: { courseId: string; lessonId: string } }) {
  const router = useRouter()
  const { lessonId, courseId } = params
  const [lectureContent, setLectureContent] = useState<string>("")
  const [videoId, setVideoId] = useState<string | null>(null)
  const [title, setTitle] = useState<string>("")
  const [keyPoints, setKeypoints] = useState<string>("")
  const [multipleChoiceExercises, setMultipleChoiceExercises] = useState<any[]>([])
  const [fillInTheBlankExercises, setFillInTheBlankExercises] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [category, level, selectedTopic] = lessonId.split("_").map(decodeURIComponent)

  const { user } = useUser()
  const userId = user?.id

  useEffect(() => {
    const fetchData = async () => {
      try {
        const existingLesson = await fetchLessonData(params.courseId, selectedTopic, String(userId))
        if (existingLesson) {
          setTitle(existingLesson.title)
          setKeypoints(existingLesson.keyPoints)
          setLectureContent(existingLesson.lectureContent)
          setVideoId(existingLesson.videoId)
          setMultipleChoiceExercises(existingLesson.multipleChoiceExercises)
          setFillInTheBlankExercises(existingLesson.fillInTheBlankExercises)
          setIsCompleted(existingLesson.completed || false)
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
          ])

          setTitle(titleResponse)
          setKeypoints(keyPointsResponse)
          setLectureContent(lectureContentResponse)
          setVideoId(videoResponse)
          setMultipleChoiceExercises([multipleChoiceResponse])
          setFillInTheBlankExercises([fillInTheBlankResponse])

          const newLesson = {
            title: titleResponse,
            selectedTopic,
            lectureContent: lectureContentResponse,
            videoId: videoResponse,
            keyPoints: keyPointsResponse,
            multipleChoiceExercises: [multipleChoiceResponse],
            fillInTheBlankExercises: [fillInTheBlankResponse],
            completed: false
          }

          await createLesson(params.courseId, newLesson, String(userId))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [lessonId, params.courseId, selectedTopic, level, userId])

  const handleCompletionToggle = async () => {
    const newCompletionStatus = !isCompleted;
    setIsCompleted(newCompletionStatus);
    await updateLessonCompletion(courseId, selectedTopic, String(userId), newCompletionStatus);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <DotLoader color="#9570FF" size={60} />
      </div>
    )
  
  if (error)
    return (
      <div className="text-center flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    )

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center flex-col justify-center p-5 mt-10 text-black dark:text-white"
    >
      <div className="flex items-center justify-between w-full max-w-4xl p-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-[30px] mb-5">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {title || `What Are ${selectedTopic}`}
          </h1>
          <p className="mt-2 text-white text-xl">
            {category} - {level}
          </p>
        </div>
        <Lottie animationData={UFOPanda} loop={true} className="w-24 h-24" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-background flex items-center justify-between w-full max-w-4xl p-6 border rounded-[30px] mt-5 mb-10"
      >
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-3xl font-bold">Key Points</h2>
          <div className="grid gap-3 text-xl">
            <LectureContent content={keyPoints} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-background flex items-center justify-between w-full max-w-4xl p-6 border rounded-[30px] mt-5 mb-10"
      >
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-3xl font-bold">What are {title}?</h2>
          <div className="grid gap-3 text-xl">
            <LectureContent content={lectureContent} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-background flex items-center justify-between w-full max-w-4xl p-6 border rounded-[30px] mt-5 mb-10"
      >
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-3xl font-bold">Video</h2>
          <div className="grid gap-3">
            {videoId ? (
              <YouTubeVideo
                videoId={videoId}
                className="w-full aspect-video"
              />
            ) : (
              <p>No video found</p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-background flex flex-col items-center w-full max-w-4xl p-6 border rounded-[30px] mt-5 mb-10"
      >
        <h2 className="text-3xl font-bold mb-4">Multiple Choice Exercises</h2>
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
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-background flex flex-col items-center w-full max-w-4xl p-6 border rounded-[30px] mt-5 mb-10"
      >
        <h2 className="text-3xl font-bold mb-4">Fill in the Blank Exercises</h2>
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
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center space-x-4 mb-8"
      >
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
      </motion.div>

      <Link href={`/courses/${courseId}`}>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          Back to Course
        </Button>
      </Link>
    </motion.section>
  )
}