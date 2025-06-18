import { OpenAI } from "openai";

export const config = {
  runtime: "edge",
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req) {
  const searchParams = new URL(req.url).searchParams;
  const lang = searchParams.get("lang") || "en";
  const text = searchParams.get("text") || "";

  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://weshareapp.io",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "API key not found" }),
      { status: 500, headers: corsHeaders }
    );
  }

  if (!text.trim()) {
    return new Response(
      JSON.stringify({ error: "Missing text input" }),
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Translate the following text into ${lang} without quotes or markdown:\n\n${text}`,
        },
      ],
      max_tokens: 60,
      temperature: 0.3,
    });

    const translated = completion.choices[0]?.message?.content?.trim();

    return new Response(
      JSON.stringify({ translation: translated }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Translation failed", detail: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
