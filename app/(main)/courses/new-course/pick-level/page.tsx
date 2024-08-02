"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function PickYourLevel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject') as string;
  const [level, setLevel] = useState('');

  const handleLevelSubmit = () => {
    if (level) {
      const courseId = new Date().getTime(); // Generate a unique ID for the course
      router.push(`/courses/${courseId}?subject=${subject}&level=${level}`);
    }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Pick Your Level For {subject}</h2>
        </div>
        <div className="mt-12 flex justify-center">
          <input
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="Enter your level/age"
            className="p-3 border rounded-md"
          />
          <button onClick={handleLevelSubmit} className="ml-4 p-3 bg-blue-500 text-white rounded-md">
            Submit
          </button>
        </div>
      </div>
    </section>
  );
}