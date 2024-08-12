import { postRequestMiniGame } from "@/utils/api";

export async function getQuizQuestions(topic: string, level: string) {
  const prompt = `
    Generate 8 multiple-choice questions on the topic of ${topic} for ${level}. For each question, include the question, four options, and the correct option ID.
    Format the response as a JSON array of objects, where each object has the following structure:
    {
      "question": "string",
      "options": [{ "id": "string", "text": "string" }],
      "correctOptionId": "string"
    }
  `;
  
  try {
    const response = await postRequestMiniGame(prompt);
    if (response.output && Array.isArray(response.output)) {
      return response.output;
    } else if (response.rawOutput) {
      console.error('Raw output from Gemini:', response.rawOutput);
      throw new Error('Invalid response format from Gemini');
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }
}