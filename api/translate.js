// /api/translate.js
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
  const keys = searchParams.get("keys");

  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://weshareapp.io",
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

  try {
    // Single string mode
    if (text) {
      const res = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Translate the following string to ${lang}: "${text}"`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      const output = res.choices[0].message.content.trim();
      return new Response(JSON.stringify({ translation: output }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Bulk translation mode
    if (keys) {
      const keyList = keys.split(",").map((k) => k.trim());
      const translations = {};

      for (const key of keyList) {
        const res = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `Translate the following string to ${lang}: "${key}"`,
            },
          ],
          model: "gpt-3.5-turbo",
        });
        translations[key] = res.choices[0].message.content.trim();
      }

      return new Response(JSON.stringify(translations), {
        status: 200,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ error: "Missing parameters" }), {
      status: 400,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
