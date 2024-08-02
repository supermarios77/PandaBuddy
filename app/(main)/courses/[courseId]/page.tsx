"use client"
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactMarkdown from "react-markdown";

export default function LecturePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject') as string;
  const level = searchParams.get('level') as string;

  const [lectureContent, setLectureContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLectureContent = async () => {
      try {
        const prompt = `Generate a lecture for a ${level} level student on the topic of ${subject}. Include explanations, examples, and quizzes. Focus on one topic`;
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: prompt }),
        });
        const data = await response.json();
        if (response.ok) {
          setLectureContent(data.output);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Failed to fetch lecture content');
      } finally {
        setLoading(false);
      }
    };

    if (subject && level) {
      fetchLectureContent();
    }
  }, [subject, level]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Lecture on {subject}</h2>
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