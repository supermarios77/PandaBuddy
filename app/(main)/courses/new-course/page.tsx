"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WhatDoYouWantToLearn() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    router.push(`/courses/new-course/pick-level?category=${category}`);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What do you want to learn?
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8">
          {[
            "Maths",
            "Science",
            "History",
            "Geography",
            "English",
            "Art",
          ].map((category) => (
            <div
              key={category}
              className="flex items-center justify-center rounded-lg bg-white p-6 text-center text-black transition-colors hover:bg-gray-200 shadow-lg cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <h3 className="text-2xl font-bold">{category}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}