"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Ensure this import matches your actual file structure

export default function CreateCourse() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleNext = () => {
    if (selectedCategory) {
      router.push(`/courses/create/${selectedCategory.toLowerCase()}`);
    }
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
          {['Maths', 'Science', 'History', 'Biology', 'Coding', 'Languages'].map((category) => (
            <div
              key={category}
              className={`flex items-center justify-center h-[200pz] rounded-lg bg-card p-6 text-center text-black dark:text-white transition-colors hover:bg-secondary shadow-lg cursor-pointer ${
                selectedCategory === category ? 'bg-secondary' : ''
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <h3 className="text-2xl font-bold">{category}</h3>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleNext}
            disabled={!selectedCategory}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}