
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");
  const lang = searchParams.get("lang");
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response("API key not found", { status: 500 });
  }

  if (!text || !lang) {
    return new Response("Missing required parameters", { status: 400 });
  }

  try {
    const prompt = `Translate this text to ${lang}: "${text}"`;
    const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const json = await apiResponse.json();

    const translated = json.choices?.[0]?.message?.content?.trim() || "";
    return new Response(JSON.stringify({ translated }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error translating text", { status: 500 });
  }
}
