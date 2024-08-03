import fetch from 'isomorphic-unfetch';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export const searchVideos = async (query: string) => {
  try {
    const response = await fetch(`${YOUTUBE_API_URL}?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}&order=relevance&maxResults=5`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('YouTube API request failed:', error);
    return null;
  }
};