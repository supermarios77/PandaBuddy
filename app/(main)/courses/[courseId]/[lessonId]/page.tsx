'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { fetchLessonData, createLesson, fetchUserProfile } from "@/lib/firestoreFunctions";
import {
  fetchTitle,
  fetchLessonIntroduction,
  fetchLectureContent,
  fetchYouTubeVideo,
  fetchLessonSubline,
  fetchLessonTitle,
  fetchLessonActivity,
  fetchLessonSummary,
  fetchIntroductionTitle,
  fetchInteractiveQuestions
} from "@/lib/api";

import { Poppins } from 'next/font/google'
import clsx from "clsx";
import { TracingBeam } from "@/components/ui/tracing-beam";
import YoutubeVideo from "@/components/lesson/YoutubeVideo";
import { Sidebar } from "@/components/lesson/Sidebar";
import LectureContent from "@/components/lesson/LectureContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Activity, FileText } from "lucide-react";
import Lottie from "lottie-react";
import UFOPanda from "@/app/(main)/(home)/Animations/PandaInUFO.json"

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
  const [interactiveQuestions, setInteractiveQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
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
          setIntroductionTitle(existingLesson.introductionTitle);
          setInteractiveQuestions(existingLesson.interactiveQuestions || []);
          setProgress(existingLesson.progress || 0);
        } else {
          const titleResponse = await fetchTitle(selectedTopic);
          const introductionTitleResponse = await fetchIntroductionTitle(selectedTopic);
          const lessonIntroductionResponse = await fetchLessonIntroduction(selectedTopic, category);
          const lectureContentResponse = await fetchLectureContent(subjectTopic, level, learningStyle, lessonIntroductionResponse);

          const [
            videoResponse,
            subtitleResponse,
            lessonHeadingResponse,
            activityResponse,
            summaryResponse,
            interactiveQuestionsResponse
          ] = await Promise.all([
            fetchYouTubeVideo(selectedTopic, level, learningStyle),
            fetchLessonSubline(selectedTopic, lectureContentResponse),
            fetchLessonTitle(lectureContentResponse, selectedTopic),
            fetchLessonActivity(selectedTopic, lectureContentResponse),
            fetchLessonSummary(selectedTopic, lessonIntroductionResponse, lectureContentResponse),
            fetchInteractiveQuestions(selectedTopic, level)
          ]);

          setTitle(titleResponse);
          setLessonIntroduction(lessonIntroductionResponse);
          setLectureContent(lectureContentResponse);
          setVideoId(videoResponse);
          setSubTitle(subtitleResponse);
          setLessonHeading(lessonHeadingResponse);
          setActivity(activityResponse);
          setSummary(summaryResponse);
          setIntroductionTitle(introductionTitleResponse);
          setInteractiveQuestions(interactiveQuestionsResponse);

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
            introductionTitle: introductionTitleResponse,
            progress: 0
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

  const updateProgress = (increment: number) => {
    setProgress(prev => Math.min(prev + increment, 100));
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={clsx("flex flex-col lg:flex-row gap-8 p-6 bg-background text-foreground", poppins.className)}>
      <TracingBeam className="flex-grow">
        <section className="max-w-4xl mx-auto space-y-12">
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

          <Card id="introduction">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{introductionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <LectureContent content={lessonIntroduction} />
            </CardContent>
          </Card>

          <Card id="video-lesson">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Video Lesson
              </CardTitle>
            </CardHeader>
            <CardContent>
              {videoId && <YoutubeVideo videoId={videoId} className="w-full rounded-xl overflow-hidden mb-6" />}
              <h3 className="text-xl font-bold mb-4">{lessonHeading}</h3>
              <LectureContent content={lectureContent} />
            </CardContent>
          </Card>

          <Card id="activity">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Activity: Hands-on Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LectureContent content={activity} />
            </CardContent>
          </Card>

          <Card id="summary">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Lesson Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LectureContent content={summary} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Challenge Yourself!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ready for a more advanced challenge? Try these problems:</p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Apply the concepts learned to a real-world scenario</li>
                <li>Solve a complex problem using the techniques discussed</li>
              </ul>
              <Button className="mt-4" onClick={() => updateProgress(10)}>
                Complete Challenge
              </Button>
            </CardContent>
          </Card>
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

function LoadingSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6">
      <div className="flex-grow space-y-8">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[250px] w-full" />
      </div>
      <div className="lg:w-1/3">
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  );
}