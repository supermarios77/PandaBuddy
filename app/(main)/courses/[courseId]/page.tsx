"use client";
import { Button } from "@/components/ui/button";
import { fetchCourseData, createCourse } from "@/lib/firestoreFunctions";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CoursePage = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const router = useRouter();
  const [topics, setTopics] = useState<string[]>([]);
  const [category, level, selectedSubject] = courseId
    .split("_")
    .map(decodeURIComponent);
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await fetchCourseData(courseId, String(userId));
        if (courseData) {
          setTopics(courseData.topics);
        } else {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              body: `List top 9 topics taught for ${selectedSubject} at ${level}`,
            }),
          });
          const data = await response.json();
          const cleanedTopics = data.output
            .split("\n")
            .map((topic: string) => topic.replace(/[*-]/g, "").trim())
            .filter((topic: string | any[]) => topic.length > 0)
            .sort();

          setTopics(cleanedTopics);

          const courseData = {
            title: selectedSubject,
            category,
            level,
            topics: cleanedTopics,
          };
          await createCourse(courseId, courseData, String(userId));
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourse();
  }, [courseId, level, category, selectedSubject]);

  const handleTopicSelect = (selectedTopic: string) => {
    const lessonId =
      `${category}_${level}_${selectedSubject}_${selectedTopic}`.replace(
        /\s/g,
        "-"
      );
    router.push(`/courses/${courseId}/${encodeURIComponent(lessonId)}`);
  };

  return (
    <section className="flex items-center flex-col justify-center p-5 mt-10 text-black dark:text-white">
      <div className="flex items-center justify-between w-full max-w-5xl p-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-[30px] mb-5 pt-[50px] pb-[50px]">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {selectedSubject
              .split("\n")
              .map((topic: string) =>
                topic.replace(/[*-1234567890]/g, " ").trim()
              )
              .filter((topic: string | any[]) => topic.length > 0)
              .sort()}
          </h1>
          <p className="mt-2 text-white text-xl">
            {category} - {level}
          </p>
        </div>
        <Button
          variant="secondary"
          className="bg-white text-black dark:hover:bg-gray-200"
          onClick={() => router.push(`/${courseId}/mini-game`)}
        >
          Start Mini-Game
        </Button>
      </div>

      <div className="flex items-center justify-between w-full max-w-5xl">
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center justify-center rounded-lg bg-white p-6 text-center text-black transition-colors hover:bg-gray-200 shadow-lg cursor-pointer"
              onClick={() => handleTopicSelect(topic)}
            >
              <h3 className="text-2xl font-bold">
                {topic
                  .split("\n")
                  .map((topic: string) =>
                    topic.replace(/[.1234567890]/g, "").trim()
                  )
                  .filter((topic: string | any[]) => topic.length > 0)
                  .sort()}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursePage;
