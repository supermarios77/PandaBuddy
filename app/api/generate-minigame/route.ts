import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();

    // Remove the ```json and ``` from the output
    const cleanedOutput = output.replace(/```json\n|\n```/g, "");

    try {
      const parsedOutput = JSON.parse(cleanedOutput);
      return NextResponse.json({ output: parsedOutput });
    } catch (parseError) {
      console.error("Error parsing Gemini output:", cleanedOutput);
      return NextResponse.json(
        { message: "Error parsing Gemini output", rawOutput: cleanedOutput },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { message: "Error generating content" },
      { status: 500 }
    );
  }
}
