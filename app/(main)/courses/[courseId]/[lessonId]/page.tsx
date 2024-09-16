'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Lottie from "lottie-react";
import { DotLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";

import LectureContent from "@/components/lesson/LectureContent";
import { Button } from "@/components/ui/button";

import { fetchLessonData, createLesson, fetchUserProfile } from "@/lib/firestoreFunctions";
import { fetchTitle, fetchLessonIntroduction, fetchLectureContent, fetchYouTubeVideo, fetchLessonSubline } from "@/lib/api";

import UFOPanda from "@/app/(main)/(home)/Animations/PandaInUFO.json";

import { Poppins } from 'next/font/google'
import clsx from "clsx";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Sparkles, ChevronDown, ChevronUp, Layers } from "lucide-react";
import YoutubeVideo from "@/components/lesson/YoutubeVideo";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/lesson/Sidebar";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins',
})

function LecturePage({ params }) {
  const router = useRouter();
  const { lessonId, courseId } = params;
  const [lectureContent, setLectureContent] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubTitle] = useState("");
  const [lessonIntroduction, setLessonIntroduction] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const { user } = useUser();
  const userId = user?.id;
  const userProfile = fetchUserProfile(userId);

  const [category, level, selectedSubject, selectedTopic] = lessonId.split("_").map(decodeURIComponent);

  const subjectTopic = selectedSubject + selectedTopic

  // @ts-ignore
  const learningStyle = userProfile?.learningStyle || 'Visual';
  const userName = user?.fullName

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const existingLesson = await fetchLessonData(courseId, selectedTopic, userId);
        if (existingLesson) {
          setTitle(existingLesson.title);
          setLessonIntroduction(existingLesson.lessonIntroduction);
          setLectureContent(existingLesson.lectureContent);
          setVideoId(existingLesson.videoId);
          setSubTitle(existingLesson.subtitle);
          setProgress(existingLesson.progress || 0);
        } else {
          const [
            titleResponse,
            lessonIntroductionResponse,
            lectureContentResponse,
            videoResponse,
            subtitleResponse,
          ] = await Promise.all([
            fetchTitle(selectedTopic),
            fetchLessonIntroduction(selectedTopic, category),
            fetchLectureContent(subjectTopic, level, learningStyle, userName),
            fetchYouTubeVideo(selectedTopic, level, learningStyle),
            fetchLessonSubline(selectedTopic, lectureContent),
          ]);

          setTitle(titleResponse);
          setLessonIntroduction(lessonIntroductionResponse);
          setLectureContent(lectureContentResponse);
          setVideoId(videoResponse);
          setSubTitle(subtitleResponse);
          setProgress(0);

          const newLesson = {
            title: titleResponse,
            selectedTopic,
            lectureContent: lectureContentResponse,
            videoId: videoResponse,
            lessonIntroduction: lessonIntroductionResponse,
            completed: false,
            subtitle: subtitleResponse,
            progress: 0,
            completedSections: {
              content: false,
              video: false,
              exercises: false,
            }
          };

          await createLesson(courseId, newLesson, userId);
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

  const generatePDF = async () => {
    try {
      const response = await fetch(`/api/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId, lessonId }),
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DotLoader color="#9570FF" size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={clsx("flex flex-col lg:flex-row gap-8 p-6 mt-10 text-black dark:text-white", poppins.className)}>
      <TracingBeam className="flex-grow">
        <section className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between w-full p-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-[30px] mb-5">
            <div>
              <h3 className="text-gray-300 font-semibold mb-3">LESSON</h3>
              <h1 className="text-3xl font-bold text-white">
                {title.replace(/[*-1234567890]/g, " ") || `${selectedTopic.replace(/[*-1234567890]/g, " ")}`}
              </h1>
              <p className="mt-2 text-white text-xl">
                {subtitle.replace(/[*-1234567890]/g, " ")}
              </p>
            </div>
            <Lottie animationData={UFOPanda} loop={true} style={{ width: '150px', height: '150px' }} />
          </div>

          <div className="bg-background w-full p-6 border rounded-[30px] mt-5 mb-10">
            <div className="flex flex-col gap-4">
              <div className="grid gap-3 text-xl tracking-wider">
                <h2 className="text-3xl font-bold">Introduction to {title.replace(/[*-1234567890]/g, " ") || `${selectedTopic.replace(/[*-1234567890]/g, " ")}`}</h2>
                <LectureContent content={lessonIntroduction} />
              </div>
              <div>
                <YoutubeVideo videoId={videoId} className="w-full" />
              </div>
            </div>
          </div>

          <div className="bg-background w-full p-6 border rounded-[30px] mt-5 mb-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold">What are {title}?</h2>
              <div className="grid gap-3 text-xl">
                <LectureContent content={lectureContent} />
              </div>
            </div>
          </div>
        </section>
      </TracingBeam>
      <div className="lg:w-1/3 lg:sticky lg:top-8 lg:self-start">
        <Sidebar title={title} subtitle={subtitle} progress={progress} />
      </div>
    </div>
  );
}

export default LecturePage;