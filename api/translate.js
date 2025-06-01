
export default async function handler(req, res) {
  const { text, lang } = req.query;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key not set" });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a translation assistant." },
        { role: "user", content: `Translate "${text}" to ${lang}` }
      ]
    })
  });

  const data = await response.json();
  const translated = data.choices?.[0]?.message?.content || "";
  res.status(200).json({ translated });
}
