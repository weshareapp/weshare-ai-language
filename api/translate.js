import { OpenAI } from "openai";

export const config = {
  runtime: "edge",
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");
  const text = searchParams.get("text");

  const allowedOrigins = [
    "https://weshareapp.io",
    "https://www.weshareapp.io",
    "http://localhost:3000", // optional for local testing
  ];

  const origin = req.headers.get("origin") || "";
  const allowOrigin = allowedOrigins.includes(origin) ? origin : "";

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

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

  if (!lang || !text) {
    return new Response(JSON.stringify({ error: "Missing parameters" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    const prompt = `Translate the following UI phrase to the target language. Only return the translated phrase with no extra quotes or formatting.

Phrase: "${text}"
Target language (ISO code): ${lang}`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const translation = chatCompletion.choices[0].message.content.trim();

    return new Response(JSON.stringify({ translated: translation }), {
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Translation error: " + err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
