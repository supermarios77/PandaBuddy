"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PickYourTopic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = searchParams.get("level") as string;
  const category = searchParams.get("category") as string;
  const selectedSubject = searchParams.get("subject") as string;

  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
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
          .map((topic: string) => topic.replace(/[*-]/g, '').trim())
          .filter((topic: string | any[]) => topic.length > 0)
          .sort();
        setTopics(cleanedTopics);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [level, category, selectedSubject]);

  const handleTopicSelect = (selectedTopic: string) => {
    const courseId = new Date().getTime(); // Generate a unique ID for the course
    const lessonId = `${category}_${level}_${selectedSubject}_${selectedTopic}`.replace(/\s/g, '-'); // Create a lessonId from the information
    router.push(
      `/courses/${courseId}/${lessonId}`
    );
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Pick a Topic
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
}