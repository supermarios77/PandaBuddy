import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { query, noteContent } = await request.json();

    const prompt = `
      User's note:
      ${noteContent}

      User's query: ${query}

      Provide a helpful response to the user's query based on the context of their note.
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = await response.text();

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: 'An error occurred while calling the Gemini API.' }, { status: 500 });
  }
}