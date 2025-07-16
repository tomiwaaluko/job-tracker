import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RequestBody {
  imageUrl: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 },
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts job application details from email screenshots.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `From this screenshot, extract:
- Company name
- Job title or position
- Application status (e.g. applied, interview, offer, rejected)
- Any dates mentioned

Respond in JSON format like:
{
  "company": "Example Corp",
  "role": "Software Engineer",
  "status": "Interview",
  "date": "2025-07-15"
}
            `,
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    if (!response.choices || response.choices.length === 0) {
      return NextResponse.json(
        { error: "No response from OpenAI" },
        { status: 500 },
      );
    }

    return NextResponse.json(response.choices[0]?.message);
  } catch (error) {
    console.error("Error processing screenshot:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
