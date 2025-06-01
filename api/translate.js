
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang");
  const text = searchParams.get("text");

  console.log("Received request:", { lang, text });

  if (!lang || !text) {
    return NextResponse.json({ translated: "" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY");
    return NextResponse.json({ translated: "" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful translator. Only return the translated phrase without commentary.",
          },
          {
            role: "user",
            content: `Translate this to ${lang}: ${text}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    console.log("OpenAI response:", data);

    const translated = data?.choices?.[0]?.message?.content?.trim() || "";
    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ translated: "" });
  }
}
