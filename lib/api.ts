import { postRequest } from "@/utils/api";
import { searchVideos } from "@/utils/youtube";

const fetchLectureContent = async (selectedSubject: string, level: string) => {
  const prompt = `Give me a comprehensive overview (paragraph) on ${selectedSubject}. Assume I know nothing about it and I am ${level}. Use analogys`;
  const response = await postRequest(prompt);
  return response.output.trim();
};

const fetchYouTubeVideo = async (selectedTopic: string, level: string) => {
  const queryPrompt = `Generate a search query for YouTube on the topic of ${selectedTopic} for ${level}`;
  const queryResponse = await postRequest(queryPrompt);
  const searchQuery = queryResponse.output.trim();
  const videoResponse = await searchVideos(searchQuery);
  const videos = videoResponse.items;
  if (videos.length > 0) {
    return videos[0].id.videoId;
  } else {
    throw new Error("No videos found");
  }
};

const fetchTitle = async (topic: string) => {
  const prompt = `Rewrite this title ${topic} remove bullet points`;
  const response = await postRequest(prompt);
  return response.output.trim();
};

const fetchKeyPoints = async (topic: string) => {
  const prompt = `Give 5 key points on this topic ${topic}, just give keypoints no titles`;
  const response = await postRequest(prompt);
  return response.output.trim();
};

const fetchMultipleChoiceExerciseData = async (topic: string) => {
  const prompt = `
    Generate a multiple-choice question on the topic of ${topic}. Include the question, four options, and the correct option ID.
    Format the response as:
    {
      "type": "multiple-choice",
      "question": "string",
      "options": [{ "id": "string", "text": "string" }],
      "correctOptionId": "string"
    }
  `;
  const response = await postRequest(prompt);
  return JSON.parse(response.output.trim());
};

const fetchFillInTheBlankExerciseData = async (topic: string) => {
  const prompt = `
    Generate a fill-in-the-blank question on the topic of ${topic}. Include the question and the correct answer.
    Format the response as:
    {
      "type": "fill-in-the-blank",
      "question": "string",
      "correctAnswer": "string"
    }
  `;
  const response = await postRequest(prompt);
  return JSON.parse(response.output.trim());
};

const validateAnswer = async (userAnswer: string, correctAnswer: string) => {
  const prompt = `
    Validate if the user answer "${userAnswer}" is correct for the question with the correct answer "${correctAnswer}".
    Consider different wordings, synonyms, and possible typos.
    Respond with "true" or "false".
  `;
  const response = await postRequest(prompt);
  return response.output.trim().toLowerCase() === "true";
};

export { fetchLectureContent, fetchYouTubeVideo, fetchTitle, fetchKeyPoints, fetchMultipleChoiceExerciseData, fetchFillInTheBlankExerciseData, validateAnswer };