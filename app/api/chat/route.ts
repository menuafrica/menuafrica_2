import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { model, contents, config, isPublicContext } = await req.json();
    
    // We can inject logic here depending on the isPublicContext
    const response = await ai.models.generateContent({
      model: model || "gemini-3.5-flash",
      contents: contents,
      config: config
    });
    
    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
