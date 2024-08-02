"use client";
import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import YouTube from 'react-youtube'; // Import YouTube player component

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export default function LecturePage({ params }: { params: { courseId: string; lessonId: string; } }) {
  const { lessonId } = params;
  const [lectureContent, setLectureContent] = useState<string>('');
  const [videoId, setVideoId] = useState<string | null>(null); // State to store video ID
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const [category, level, selectedSubject, selectedTopic] = lessonId.split('_').map(decodeURIComponent);

    const fetchLectureContent = async () => {
      try {
        const prompt = `Give me a comprehensive overview (paragraph) on ${selectedSubject}. Assume I know nothing about it and I am ${level}.`;
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: prompt }),
        });
        const data = await response.json();
        console.log('Lecture Content Response:', data); // Debugging line

        if (response.ok) {
          setLectureContent(data.output.trim());
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Failed to fetch lecture content');
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    const fetchYouTubeVideo = async () => {
      try {
        // Generate a search query using Gemini
        const queryPrompt = `Generate a search query for YouTube on the topic of ${selectedTopic} for ${level}`;
        const queryResponse = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: queryPrompt }),
        });
        const queryData = await queryResponse.json();
        const searchQuery = queryData.output.trim();
        console.log('Search Query:', searchQuery); // Debugging line

        // Check localStorage for a cached video ID
        const cachedVideoId = localStorage.getItem(`videoId-${searchQuery}`);
        if (cachedVideoId) {
          setVideoId(cachedVideoId);
          setLoading(false);
          return;
        }

        // Fetch YouTube videos
        const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&key=${YOUTUBE_API_KEY}&order=relevance&maxResults=1`);
        const videoData = await videoResponse.json();
        console.log('YouTube API Response:', videoData); // Debugging line

        if (videoResponse.ok) {
          const videos = videoData.items;
          if (videos.length > 0) {
            const videoId = videos[0].id.videoId;
            console.log('Video ID:', videoId); // Debugging line
            setVideoId(videoId);
            // Cache the video ID in localStorage
            localStorage.setItem(`videoId-${searchQuery}`, videoId);
          } else {
            console.log('No videos found');
          }
        } else {
          console.error('Failed to fetch videos:', videoData.error);
        }
      } catch (error) {
        console.error('Failed to fetch YouTube video:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    if (selectedTopic && level) {
      fetchLectureContent();
      fetchYouTubeVideo();
    }
  }, [lessonId]);

  // Debugging: log states
  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('Lecture Content:', lectureContent);
  console.log('Video ID:', videoId);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mt-12">
          <div className="prose">
            <ReactMarkdown>{lectureContent}</ReactMarkdown>
          </div>
          {videoId ? (
            <div className="mt-12">
              <YouTube videoId={videoId} opts={{ width: '100%', height: '500px' }} />
            </div>
          ) : (
            <p>No video found</p>
          )}
        </div>
      </div>
    </section>
  );
}