import { OpenAI } from "openai";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");
  const text = searchParams.get("text");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("API key not found", { status: 500 });
  }

  if (!lang || !text) {
    return new Response("Missing parameters", { status: 400 });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful translation engine.",
        },
        {
          role: "user",
          content: `Translate the following to ${lang}: "${text}"`,
        },
      ],
      temperature: 0.3,
    });

    const translated = response.choices[0].message.content;
    return new Response(JSON.stringify({ translated }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
