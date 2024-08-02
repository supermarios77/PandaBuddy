"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PickYourSubject() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = searchParams.get("level") as string;
  const category = searchParams.get("category") as string;

  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: `List 6 common subjects for ${category} at ${level}`,
          }),
        });
        const data = await response.json();
        const cleanedSubjects = data.output
          .split("\n")
          .map((subject: string) => subject.replace(/[*-]/g, '').trim())
          .filter((subject: string) => subject.length > 0)
          .sort();
        setSubjects(cleanedSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [level, category]);

  const handleSubjectSelect = (selectedSubject: string) => {
    router.push(
      `/courses/new-course/pick-topic?category=${category}&level=${level}&selectedSubject=${encodeURIComponent(selectedSubject)}`
    );
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Pick a Subject
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="flex items-center justify-center rounded-lg bg-white p-6 text-center text-black transition-colors hover:bg-gray-200 shadow-lg cursor-pointer"
              onClick={() => handleSubjectSelect(subject)}
            >
              <h3 className="text-2xl font-bold">{subject}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}