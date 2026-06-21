/* eslint-env node */

const SYSTEM_PROMPT = `You are a biblical scholar providing balanced, scholarly context for Bible readers. Acknowledge both traditional and academic perspectives when they differ. Return responses as pure JSON with no markdown fences, code blocks, or explanatory text.`;

function buildUserPrompt(bookName) {
  return `Provide scholarly context for the Book of ${bookName}. Return a JSON object with these exact fields:

- "author": Who wrote it, noting traditional vs. academic views if they differ (1-2 sentences)
- "date": Approximate date or range of composition
- "audience": Original intended readers and their situation (1-2 sentences)
- "historicalSetting": 2-3 sentences on the historical and cultural setting
- "purpose": 2-3 sentences on the book's main purpose
- "narrative": 3-4 sentences on the book's narrative arc or structure
- "keyCharacters": An array of 3-6 objects, each with "name" (string) and "significance" (1-2 sentences) fields
- "themes": An array of 4-7 objects, each with "name" (string) and "description" (1-2 sentences) fields
- "principles": 2-3 sentences on enduring spiritual principles for readers today

Return ONLY the JSON object, no markdown, no preamble, no closing remarks.`;
}

export default async function handler(req, res) {
  const { book } = req.query;

  if (!book) {
    return res.status(400).json({ error: "Missing book parameter" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server misconfiguration: ANTHROPIC_API_KEY missing" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(book) }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return res
        .status(response.status)
        .json({ error: `Anthropic API returned ${response.status}`, detail });
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text || "";

    // Strip any markdown fences Claude might add despite instructions
    const cleaned = rawText.replace(/```json\n?|```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({
        error: "Failed to parse Claude's response as JSON",
        raw: cleaned.slice(0, 500),
      });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
