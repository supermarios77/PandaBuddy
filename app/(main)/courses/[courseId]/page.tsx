"use client";
import { fetchCourseData, createCourse } from "@/lib/firestoreFunctions";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CoursePage = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;
  const router = useRouter();
  const [topics, setTopics] = useState<string[]>([]);
  const [category, level, selectedSubject] = courseId
    .split("_")
    .map(decodeURIComponent);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await fetchCourseData(courseId);
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

          // Save the course with generated topics
          const courseData = {
            title: selectedSubject,
            category,
            level,
            topics: cleanedTopics,
          };
          await createCourse(courseId, courseData);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourse();
  }, [courseId, level, category, selectedSubject]);

  const handleTopicSelect = (selectedTopic: string) => {
    const lessonId = `${category}_${level}_${selectedSubject}_${selectedTopic}`.replace(/\s/g, "-");
    router.push(`/courses/${courseId}/${encodeURIComponent(lessonId)}`);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Your Lessons
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center justify-center rounded-lg bg-white p-6 text-center text-black transition-colors hover:bg-gray-200 shadow-lg cursor-pointer"
              onClick={() => handleTopicSelect(topic)}
            >
              <h3 className="text-2xl font-bold">{topic}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursePage;