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

  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://www.weshareapp.io",
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
    const messages = [
      {
        role: "system",
        content: `Translate the following English phrase to ${lang}. Only return the translated phrase as plain text.`,
      },
      {
        role: "user",
        content: text,
      },
    ];

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const translation = chatCompletion.choices[0].message.content;

    return new Response(JSON.stringify({ translation }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Translation error:", err);
    return new Response(JSON.stringify({ error: "Translation failed" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
