import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generatePosts } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, tone, platform, count } = await req.json();

  if (!topic || !tone || !platform || !count) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const posts = await generatePosts({ topic, tone, platform, count });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate posts" },
      { status: 500 }
    );
  }
}
