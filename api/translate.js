import { OpenAI } from "openai";

export const config = {
  runtime: "edge",
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req) {
  const searchParams = new URL(req.url).searchParams;
  const lang = searchParams.get("lang");
  const text = searchParams.get("text");

  // Dynamic CORS handling
  const allowedOrigins = ["https://weshareapp.io", "https://www.weshareapp.io"];
  const origin = req.headers.get("origin");

  const corsHeaders = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Set the appropriate origin header
  if (allowedOrigins.includes(origin)) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  } else {
    corsHeaders["Access-Control-Allow-Origin"] = "https://www.weshareapp.io"; // default
  }

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "API key not found" }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a translation engine. Translate the following text into ${lang} only. Return only the translated string.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

    const translation = completion.choices[0]?.message?.content?.trim() || "";

    return new Response(JSON.stringify({ translation }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
