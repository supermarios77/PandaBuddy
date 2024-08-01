"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

interface LevelOption {
  id: string;
  name: string;
}

const LEVEL_OPTIONS: LevelOption[] = [
  { id: 'college level', name: 'College' },
  { id: 'university level', name: 'University' },
  { id: 'grade or year 1', name: 'Grade 1' },
  { id: 'grade or year 2', name: 'Grade 2' },
  { id: 'grade or year 3', name: 'Grade 3' },
  { id: 'grade or year 4', name: 'Grade 4' },
  { id: 'grade or year 5', name: 'Grade 5' },
  { id: 'grade or year 6', name: 'Grade 6' },
  { id: 'grade or year 7', name: 'Grade 7' },
  { id: 'grade or year 8', name: 'Grade 8' },
  { id: 'grade or year 9', name: 'Grade 9' },
  { id: 'grade or year 10', name: 'Grade 10' },
  { id: 'grade or year 11', name: 'Grade 11' },
  { id: 'grade or year 12', name: 'Grade 12' },
];

export default function SelectLevel() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [specificDetail, setSpecificDetail] = useState<string>('');
  const [lectures, setLectures] = useState<any[]>([]); // Define a more specific type if possible
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(event.target.value);
  };

  const handleDetailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpecificDetail(event.target.value);
  };

  const handleProceed = () => {
    if (selectedLevel) {
      router.push(`/courses/add?level=${selectedLevel}&details=${encodeURIComponent(specificDetail)}`);
    }
  };

  useEffect(() => {
    const fetchLecturesFromApi = async () => {
      if (selectedLevel) {
        setLoading(true);
        try {
          const response = await fetchLectures(selectedLevel, specificDetail);
          setLectures(response);
        } catch (error) {
          console.error('Failed to fetch lectures:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLecturesFromApi();
  }, [selectedLevel, specificDetail]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-12 md:pt-16 lg:pt-20">
      <div className="container max-w-5xl px-4 md:px-6 flex flex-col items-center mb-8 md:mb-10 lg:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Select Your Level</h1>
        <div className="w-full max-w-md mt-8">
          <label htmlFor="level" className="block text-lg font-medium mb-2">Choose a Level</label>
          <select
            id="level"
            value={selectedLevel || ''}
            onChange={handleLevelChange}
            className="block w-full p-2 border rounded-md bg-transparent"
          >
            <option value="" disabled>Select a level...</option>
            {LEVEL_OPTIONS.map((level) => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full max-w-md mt-4">
          <label htmlFor="details" className="block text-lg font-medium mb-2">Additional Details (Optional)</label>
          <Input
            id="details"
            type="text"
            value={specificDetail}
            onChange={handleDetailChange}
            placeholder="Any specific topics you want to cover?"
          />
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={handleProceed}
          className="mt-8"
          disabled={!selectedLevel}
        >
          Proceed
        </Button>
      </div>

      <div className="container max-w-5xl px-4 md:px-6 mt-12">
        {loading ? (
          <div className="text-center">Loading lectures...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lectures.map((lecture) => (
              <div key={lecture.id} className="p-6 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">{lecture.title}</h3>
                <p className="mt-2">{lecture.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}