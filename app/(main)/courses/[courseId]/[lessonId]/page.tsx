'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { DotLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";

import LectureContent from "@/components/lesson/LectureContent";
import { fetchLessonData, createLesson, fetchUserProfile } from "@/lib/firestoreFunctions";
import { fetchTitle, fetchLessonIntroduction, fetchLectureContent, fetchYouTubeVideo, fetchLessonSubline, fetchLessonTitle, fetchLessonActivity, fetchLessonSummary, fetchIntroductionTitle } from "@/lib/api";

import UFOPanda from "@/app/(main)/(home)/Animations/PandaInUFO.json";

import { Poppins } from 'next/font/google'
import clsx from "clsx";
import { TracingBeam } from "@/components/ui/tracing-beam";
import YoutubeVideo from "@/components/lesson/YoutubeVideo";
import { Sidebar } from "@/components/lesson/Sidebar";
import ReactMarkdown from 'react-markdown';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins',
})

type LecturePageProps = {
  params: {
    lessonId: string;
    courseId: string;
  };
};

export default function LecturePage({ params }: LecturePageProps) {
  const router = useRouter();
  const { lessonId, courseId } = params;
  const [lectureContent, setLectureContent] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [lessonHeading, setLessonHeading] = useState("")
  const [subtitle, setSubTitle] = useState("");
  const [introductionTitle, setIntroductionTitle] = useState("");
  const [lessonIntroduction, setLessonIntroduction] = useState("");
  const [activity, setActivity] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const userId = user?.id;

  const [category, level, selectedSubject, selectedTopic] = lessonId.split("_").map(decodeURIComponent);

  const subjectTopic = selectedSubject + selectedTopic;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const userProfile = await fetchUserProfile(userId);
        const learningStyle = userProfile?.learningStyle || 'Visual';

        const existingLesson = await fetchLessonData(courseId, selectedTopic, userId);
        if (existingLesson) {
          setTitle(existingLesson.title);
          setLessonIntroduction(existingLesson.lessonIntroduction);
          setLectureContent(existingLesson.lectureContent);
          setVideoId(existingLesson.videoId);
          setSubTitle(existingLesson.subtitle);
          setLessonHeading(existingLesson.lessonHeading);
          setActivity(existingLesson.activity);
          setSummary(existingLesson.summary);
          setIntroductionTitle(existingLesson.introductionTitle)
        } else {
          const titleResponse = await fetchTitle(selectedTopic);
          setTitle(titleResponse);

          const lessonIntroductionResponse = await fetchLessonIntroduction(selectedTopic, category);
          setLessonIntroduction(lessonIntroductionResponse);

          const lectureContentResponse = await fetchLectureContent(subjectTopic, level, learningStyle, lessonIntroductionResponse);
          setLectureContent(lectureContentResponse);

          const [
            videoResponse,
            subtitleResponse,
            lessonHeadingResponse,
            activityResponse,
            summaryResponse,
            introductionTitleResponse
          ] = await Promise.all([
            fetchYouTubeVideo(selectedTopic, level, learningStyle),
            fetchLessonSubline(selectedTopic, lectureContentResponse),
            fetchLessonTitle(lectureContentResponse, selectedTopic),
            fetchLessonActivity(selectedTopic, lectureContentResponse),
            fetchLessonSummary(selectedTopic, lessonIntroductionResponse, lectureContentResponse),
            fetchIntroductionTitle(selectedTopic)
          ]);

          setVideoId(videoResponse);
          setSubTitle(subtitleResponse);
          setLessonHeading(lessonHeadingResponse);
          setActivity(activityResponse);
          setSummary(summaryResponse);
          setIntroductionTitle(introductionTitleResponse)

          const newLesson = {
            title: titleResponse,
            selectedTopic,
            lectureContent: lectureContentResponse,
            videoId: videoResponse,
            lessonIntroduction: lessonIntroductionResponse,
            completed: false,
            subtitle: subtitleResponse,
            lessonHeading: lessonHeadingResponse,
            activity: activityResponse,
            summary: summaryResponse,
            introductionTitle: introductionTitleResponse
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
  }, [lessonId, courseId, selectedTopic, level, userId, category, subjectTopic]);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
          <div className="flex items-center justify-between w-full p-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-[30px] mb-5" id="introduction">
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

          <div className="bg-background w-full p-6 border rounded-[30px] mt-5 mb-10" id="video-lesson">
            <div className="flex flex-col gap-4">
              <div className="grid gap-3 text-xl tracking-wider">
                <h2 className="text-3xl font-bold">{introductionTitle}</h2>
                <LectureContent content={lessonIntroduction} />
              </div>
              <div>
                {videoId && <YoutubeVideo videoId={videoId} className="w-full" />}
              </div>
            </div>
          </div>

          <div className="bg-background w-full p-6 border rounded-[30px] mt-5 mb-10" id="main-content">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold"><ReactMarkdown>{lessonHeading}</ReactMarkdown></h2>
              <div className="grid gap-3 text-xl">
                <LectureContent content={lectureContent} />
              </div>
            </div>
          </div>

          <div className="bg-background w-full p-6 border rounded-[30px] mt-5 mb-10" id="activity">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold">Activity</h2>
              <div className="grid gap-3 text-xl">
                <LectureContent content={activity} />
              </div>
            </div>
          </div>

          <div className="bg-background w-full p-6 border rounded-[30px] mt-5 mb-10" id="summary">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold">Lesson Summary</h2>
              <div className="grid gap-3 text-xl">
                <LectureContent content={summary} />
              </div>
            </div>
          </div>
        </section>
      </TracingBeam>
      <div className="lg:w-1/3 lg:sticky lg:top-8 lg:self-start">
        <Sidebar 
          title={title} 
          subtitle={subtitle} 
          onSectionClick={handleSectionClick}
        />
      </div>
    </div>
  );
}