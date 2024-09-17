import { postRequest } from "@/utils/api";
import { searchVideos } from "@/utils/youtube";

const fetchLectureContent = async (
  selectedSubject: string,
  level: string,
  learnerType: string,
  introduction: string
) => {
  const prompt = `Teach me about ${selectedSubject} i am at level ${level}, i am a ${learnerType} learner type.  make big words bold, make it bitesized and comprehensive, and make sure it aligns with ${selectedSubject}, Give me 3 whole paragraphs to teach me, in introdiction you taught me this - ${introduction}. Just use my level to teach dont go in-depth about it. and dont give introduction again`;
  const response = await postRequest(prompt);
  return response.output.trim();
};

const fetchLessonActivity = async (subject: string, lesson: string) => {
  const prompt = `Give me an activity on ${subject} i just learnt this in my lesson - ${lesson}. Make it easy to follow and i am a student`;
  const response = await postRequest(prompt);
  return response.output.trim();
}

const fetchIntroductionTitle = async (subject: string) => {
  const prompt = `Give me a nice introduction-to title on ${subject} it should say introduction to and then subject but make grammatical sense`;
  const response = await postRequest(prompt);
  return response.output.trim();
}

const fetchLessonSummary = async (topic: string, introduction: string, lesson: string) => {
  const prompt = `Give me a summary on my ${topic} lesson in introduction - ${introduction} in lesson - ${lesson} give it all in one peice and paragraph`;
  const response = await postRequest(prompt);
  return response.output.trim();
}

const fetchYouTubeVideo = async (
  selectedTopic: string,
  level: string,
  learnerType: string
) => {
  const queryPrompt = `Generate a search query for YouTube on the topic of ${selectedTopic} for ${level}, the person is a ${learnerType}`;
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

const fetchLessonIntroduction = async (topic: string, subject: string) => {
  const prompt = `Give me an introduction on this ${topic} make big words bold, and make sure it aligns with ${subject}, and dont add any headers`;
  const response = await postRequest(prompt);
  return response.output.trim();
};

const fetchLessonTitle = async (lessonData: string, topic: string) => {
  const prompt = `Make a nice what is/what are/etc.. title for this lesson ${lessonData} its on ${topic} topic`;
  const response = await postRequest(prompt);
  return response.output.trim();
};

const fetchMultipleChoiceExerciseData = async (
  topic: string,
  difficulty: string
) => {
  const prompt = `
    Generate a multiple-choice question on the topic of ${topic}, make it ${difficulty}. Include the question, four options, and the correct option ID.
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

const fetchFillInTheBlankExerciseData = async (
  topic: string,
  difficulty: string
) => {
  const prompt = `
    Generate a fill-in-the-blank question on the topic of ${topic}, make it ${difficulty}. Include the question and the correct answer.
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

const fetchLessonSubline = async (
  lessonTitle: string,
  lessonContent: string
) => {
  const prompt = `Generate a lesson subline using ${lessonTitle} our lesson had this content ${lessonContent}`;
  const response = await postRequest(prompt);
  return response.output.trim();
};

const fetchInteractiveQuestions = async (topic: string, difficulty: string) => {
  const prompt = `
    Generate 3 interactive questions on the topic of ${topic}, make them ${difficulty}. 
    For each question, include the question text, four options, and the correct option ID.
    Format the response as an array of objects:
    [
      {
        "question": "string",
        "options": [{ "id": "string", "text": "string" }],
        "correctOptionId": "string"
      }
    ]
  `;
  const response = await postRequest(prompt);
  return JSON.parse(response.output.trim());
};

export {
  fetchLectureContent,
  fetchYouTubeVideo,
  fetchTitle,
  fetchLessonIntroduction,
  fetchMultipleChoiceExerciseData,
  fetchFillInTheBlankExerciseData,
  validateAnswer,
  fetchLessonSubline,
  fetchLessonTitle,
  fetchLessonActivity,
  fetchLessonSummary,
  fetchIntroductionTitle,
  fetchInteractiveQuestions
};