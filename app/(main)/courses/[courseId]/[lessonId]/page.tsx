"use client";
import React, { useState, useEffect } from "react";
import LectureContent from "@/components/LectureContent";
import {
  fetchLectureContent,
  fetchYouTubeVideo,
  fetchTitle,
  fetchKeyPoints,
  fetchMultipleChoiceExerciseData,
  fetchFillInTheBlankExerciseData,
} from "@/lib/api";
import YouTubeVideo from "@/components/YoutubeVideo";
import UFOPanda from "@/app/(main)/(home)/Animations/PandaInUFO.json";
import Lottie from "lottie-react";
import MultipleChoiceExercise from "@/components/MultipleChoiceExercise";
import FillInTheBlankExercise from "@/components/FillInTheBlankExercise";
import { useRouter } from "next/navigation";
import { fetchLessonData, createLesson } from "@/lib/firestoreFunctions";
import { useUser } from "@clerk/nextjs";
import { DotLoader } from "react-spinners";
import { postRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LecturePage = ({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) => {
  const router = useRouter();
  const { lessonId, courseId } = params;
  const [lectureContent, setLectureContent] = useState<string>("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [keyPoints, setKeypoints] = useState<string>("");
  const [multipleChoiceExercises, setMultipleChoiceExercises] = useState<any[]>(
    []
  );
  const [fillInTheBlankExercises, setFillInTheBlankExercises] = useState<any[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [category, level, selectedSubject, selectedTopic] = lessonId
    .split("_")
    .map(decodeURIComponent);

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data for lessonId:", lessonId);
      try {
        const existingLesson = await fetchLessonData(
          params.courseId,
          selectedTopic,
          String(userId)
        );
        if (existingLesson) {
          console.log("Existing lesson found:", existingLesson);
          setTitle(existingLesson.title);
          setKeypoints(existingLesson.keyPoints);
          setLectureContent(existingLesson.lectureContent);
          setVideoId(existingLesson.videoId);
          setMultipleChoiceExercises(existingLesson.multipleChoiceExercises);
          setFillInTheBlankExercises(existingLesson.fillInTheBlankExercises);
        } else {
          console.log("No existing lesson found. Fetching new data...");
          const titleResponse = await fetchTitle(selectedTopic);
          setTitle(titleResponse);

          const keyPointsResponse = await fetchKeyPoints(selectedTopic);
          setKeypoints(keyPointsResponse);

          const lectureContentResponse = await fetchLectureContent(
            selectedTopic,
            level
          );
          setLectureContent(lectureContentResponse);

          const videoResponse = await fetchYouTubeVideo(selectedTopic, level);
          setVideoId(videoResponse);

          const multipleChoiceResponse = await fetchMultipleChoiceExerciseData(
            selectedTopic
          );
          setMultipleChoiceExercises([multipleChoiceResponse]);

          const fillInTheBlankResponse = await fetchFillInTheBlankExerciseData(
            selectedTopic
          );
          setFillInTheBlankExercises([fillInTheBlankResponse]);

          const newLesson = {
            title: titleResponse,
            selectedTopic,
            lectureContent: lectureContentResponse,
            videoId: videoResponse,
            keyPoints: keyPointsResponse,
            multipleChoiceExercises: [multipleChoiceResponse],
            fillInTheBlankExercises: [fillInTheBlankResponse],
          };

          await createLesson(params.courseId, newLesson, String(userId));
          console.log("New lesson created and saved:", newLesson);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, params.courseId, selectedTopic, level]);

  if (loading)
    return (
      <div className="flex justify-center align-middle mt-[200px]">
        <DotLoader />
      </div>
    );
  if (error)
    return (
      <p className="text-center flex justify-center align-middle">
        Error: {error}
      </p>
    );

  return (
    <section className="flex items-center flex-col justify-center p-5 mt-10 text-black dark:text-white">
      <div className="flex items-center justify-between w-full max-w-4xl p-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-[30px] mb-5">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {title || `What Are ${selectedTopic}`}
          </h1>
          <p className="mt-2 text-white text-xl">
            {category} - {level}
          </p>
        </div>
        <Lottie animationData={UFOPanda} loop={true} />
      </div>

      <div className="bg-background flex items-center justify-between w-full max-w-4xl p-6 border rounded-[30px] mt-5 mb-10">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-3xl font-bold">Key Points</h2>
          </div>
          <div className="grid gap-3 text-xl">
            <LectureContent content={keyPoints} />
          </div>
        </div>
      </div>

      <div className="bg-background flex items-center justify-between w-full max-w-4xl p-6 border rounded-[30px] mt-5 mb-10">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-3xl font-bold">What are {title}?</h2>
          </div>
          <div className="grid gap-3 text-xl">
            <LectureContent content={lectureContent} />
          </div>
        </div>
      </div>

      <div className="bg-background flex items-center justify-between w-full max-w-4xl p-6 border rounded-[30px] mt-5 mb-10">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-3xl font-bold">Video</h2>
          </div>
          <div className="grid gap-3">
            {videoId ? (
              <YouTubeVideo
                videoId={videoId}
                className="lg:w-[850px] lg:h-[600px] sm:w-[580px] md:w-[700px]"
              />
            ) : (
              <p>No video found</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-background flex flex-col items-center w-full max-w-4xl p-6 border rounded-[30px] mt-5 mb-10">
        <h2 className="text-3xl font-bold mb-4">Multiple Choice Exercises</h2>
        {multipleChoiceExercises.length > 0 ? (
          multipleChoiceExercises.map((exercise, index) => (
            <MultipleChoiceExercise
              key={index}
              question={exercise.question}
              options={exercise.options}
              correctOptionId={exercise.correctOptionId}
              onAnswer={(isCorrect) => {
                console.log(`Answer is ${isCorrect ? "correct" : "incorrect"}`);
              }}
            />
          ))
        ) : (
          <p>No multiple-choice exercises found</p>
        )}
      </div>

      <div className="bg-background flex flex-col items-center w-full max-w-4xl p-6 border rounded-[30px] mt-5 mb-10">
        <h2 className="text-3xl font-bold mb-4">Fill in the Blank Exercises</h2>
        {fillInTheBlankExercises.length > 0 ? (
          fillInTheBlankExercises.map((exercise, index) => (
            <FillInTheBlankExercise
              key={index}
              question={exercise.question}
              correctAnswer={exercise.correctAnswer}
              onAnswer={(isCorrect) => {
                console.log(`Answer is ${isCorrect ? "correct" : "incorrect"}`);
              }}
            />
          ))
        ) : (
          <p>No fill in the blank exercises found</p>
        )}
      </div>

      <Link href={`/courses/${courseId}`}>
        <Button>Complete Exercise</Button>
      </Link>
    </section>
  );
};

export default LecturePage;
