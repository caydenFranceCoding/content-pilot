import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generatePosts({
  topic,
  tone,
  platform,
  count,
}: {
  topic: string;
  tone: string;
  platform: string;
  count: number;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const platformLimits: Record<string, string> = {
    twitter: "280 characters max",
    instagram: "2200 characters max, include relevant hashtags",
  };

  const prompt = `Generate ${count} unique social media post(s) for ${platform}.
Topic: ${topic}
Tone: ${tone}
Platform constraints: ${platformLimits[platform] || "standard post length"}

Return ONLY a valid JSON array of strings, where each string is one post. No markdown, no code blocks, just the JSON array.
Example: ["Post 1 text here", "Post 2 text here"]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code blocks if present
  const cleaned = text.replace(/^```(?:json)?\n?/g, "").replace(/\n?```$/g, "");

  return JSON.parse(cleaned) as string[];
}
