"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from "react-markdown";

export default function LecturePage() {
  const searchParams = useSearchParams();
  const level = searchParams.get('level') as string;
  const selectedSubject = searchParams.get('selectedSubject') as string;

  const [lectureContent, setLectureContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLectureContent = async () => {
      try {
        const prompt = `Teach a ${level} student about ${selectedSubject}. Provide a clear and engaging explanation as if you were a teacher in a classroom. Include detailed explanations, relevant examples, and set up the content to be interactive. Ensure that the lecture prepares the student for exercises and quizzes that will follow.`;
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: prompt }),
        });
        const data = await response.json();
        if (response.ok) {
          const content = data.output;
          const lines = content.split('\n');
          const firstLine = lines[0].replace(/[*-]/g, '').trim();
          setTitle(firstLine || selectedSubject);

          const remainingContent = lines.slice(1).join('\n').trim();
          setLectureContent(remainingContent);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Failed to fetch lecture content');
      } finally {
        setLoading(false);
      }
    };

    if (selectedSubject && level) {
      fetchLectureContent();
    }
  }, [selectedSubject, level]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {title || `Lecture on ${selectedSubject}`}
          </h2>
        </div>
        <div className="mt-12">
          <div className="prose">
            <ReactMarkdown>{lectureContent}</ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
}