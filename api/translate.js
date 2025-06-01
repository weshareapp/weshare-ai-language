
import { NextRequest } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI();

export const runtime = "edge";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");
  const text = searchParams.get("text");

  if (!lang || !text) {
    return new Response(
      JSON.stringify({ error: "Missing lang or text parameter" }),
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Translate "${text}" to ${lang}`,
        },
      ],
    });

    const translated = chatCompletion.choices[0]?.message?.content?.trim();

    return new Response(
      JSON.stringify({ translated }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Translation failed", details: e.message }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
}
