"use client";
import { useEffect, useState } from "react";
import LectureContent from "@/components/LectureContent";
import { fetchLectureContent, fetchYouTubeVideo } from "@/lib/api";
import YouTubeVideo from "@/components/YoutubeVideo";

const LecturePage = ({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) => {
  const { lessonId } = params;
  const [lectureContent, setLectureContent] = useState<string>("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const [category, level, selectedSubject, selectedTopic] = lessonId
      .split("_")
      .map(decodeURIComponent);

    const fetchData = async () => {
      try {
        const lectureContentResponse = await fetchLectureContent(
          selectedSubject,
          level
        );
        setLectureContent(lectureContentResponse);

        const videoResponse = await fetchYouTubeVideo(selectedTopic, level);
        setVideoId(videoResponse);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mt-12">
          <LectureContent content={lectureContent} />
          {videoId ? <YouTubeVideo videoId={videoId} /> : <p>No video found</p>}
        </div>
      </div>
    </section>
  );
};

export default LecturePage;
