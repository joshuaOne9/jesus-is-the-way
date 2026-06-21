export default async function handler(req, res) {
  const { bibleId, chapterId } = req.query;

  if (!bibleId || !chapterId) {
    return res
      .status(400)
      .json({ error: "Missing required query params: bibleId and chapterId" });
  }

  const apiKey = process.env.API_BIBLE_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server misconfiguration: API key missing" });
  }

  try {
    const url = new URL(
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${chapterId}`,
    );
    url.searchParams.set("content-type", "html");
    url.searchParams.set("include-verse-numbers", "true");
    url.searchParams.set("include-titles", "false");
    url.searchParams.set("include-notes", "false");
    url.searchParams.set("include-chapter-numbers", "false");

    const response = await fetch(url.toString(), {
      headers: { "api-key": apiKey },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Scripture service returned ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
